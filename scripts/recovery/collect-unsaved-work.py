#!/usr/bin/env python3
"""Package all Git-visible unfinished work locally, without changing the checkout.
No upload, commit, checkout, stash, reset, install or process termination is performed.
Ignored files are excluded by Git. Restore only after comparing with the newer branch.
"""
import argparse
import datetime
import hashlib
import io
import json
import os
from pathlib import Path
import stat
import subprocess
import sys
import zipfile


def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(repo), *args])


class PartsWriter(io.RawIOBase):
    def __init__(self, folder, limit):
        super().__init__()
        self.folder, self.limit = folder, limit
        self.position = self.part_size = self.number = 0
        self.file = None
        self.paths = []

    def writable(self):
        return True

    def seekable(self):
        return False

    def tell(self):
        return self.position

    def write(self, data):
        view = memoryview(data)
        total = len(view)
        while view:
            if self.file is None or self.part_size == self.limit:
                if self.file:
                    self.file.close()
                self.number += 1
                path = self.folder / f'unsaved-work.zip.part{self.number:03d}'
                self.paths.append(path)
                self.file = path.open('xb')
                self.part_size = 0
            count = min(len(view), self.limit - self.part_size)
            self.file.write(view[:count])
            view = view[count:]
            self.part_size += count
            self.position += count
        return total

    def flush(self):
        if self.file and not self.file.closed:
            self.file.flush()

    def close(self):
        if self.file and not self.file.closed:
            self.file.close()
        super().close()


def sha_file(path):
    digest = hashlib.sha256()
    with path.open('rb') as source:
        for block in iter(lambda: source.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def snapshot(path):
    if path.is_symlink():
        raw = os.fsencode(os.readlink(path))
        return {'type': 'symlink', 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest(), 'target': os.fsdecode(raw)}
    if not path.exists():
        return {'type': 'deleted', 'bytes': 0}
    if not path.is_file():
        raise RuntimeError(f'Unsupported changed path (for example a submodule): {path}')
    return {'type': 'file', 'bytes': path.stat().st_size, 'sha256': sha_file(path), 'mode': stat.S_IMODE(path.stat().st_mode)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, default=Path.cwd())
    parser.add_argument('--output-parent', type=Path, default=Path.home() / 'Desktop')
    parser.add_argument('--part-mib', type=int, default=48)
    args = parser.parse_args()
    if args.part_mib < 1:
        parser.error('--part-mib must be positive')
    repo = Path(os.fsdecode(git(args.repo, 'rev-parse', '--show-toplevel')).strip()).resolve()
    parent = args.output_parent.expanduser().resolve()
    if parent == repo or repo in parent.parents:
        parser.error('Output must be outside the repository')
    head = git(repo, 'rev-parse', 'HEAD').decode().strip()
    branch = git(repo, 'branch', '--show-current').decode().strip()
    raw_status = git(repo, 'status', '--porcelain=v1', '-z', '--untracked-files=all')
    paths = set()
    entries = raw_status.split(b'\0')
    index = 0
    while index < len(entries):
        entry = entries[index]
        index += 1
        if not entry:
            continue
        code, name = entry[:2], os.fsdecode(entry[3:])
        paths.add(name)
        if b'R' in code or b'C' in code:
            if index >= len(entries) or not entries[index]:
                raise RuntimeError('Incomplete Git rename status')
            paths.add(os.fsdecode(entries[index]))
            index += 1
    if not paths:
        print('No Git-visible unfinished work. No package created.')
        return
    timestamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S-%f')
    folder = parent / ('japan-app-unsaved-' + timestamp)
    folder.mkdir(parents=True, exist_ok=False)
    rows = []
    for name in sorted(paths):
        if Path(name).is_absolute() or '..' in Path(name).parts:
            raise RuntimeError('Unsafe Git path')
        rows.append(dict(path=name, **snapshot(repo / name)))
    manifest = {'schemaVersion': 1, 'repoPath': str(repo), 'branch': branch, 'head': head,
                'headDetails': git(repo, 'show', '-s', '--format=%H%n%aI%n%s', 'HEAD').decode().strip(),
                'scope': 'All Git-visible staged, unstaged, deleted, renamed and untracked paths; ignored files excluded.',
                'pathCount': len(rows), 'workingBytes': sum(row['bytes'] for row in rows), 'paths': rows}
    print(f"HEAD {head}; {len(rows)} changed paths; {manifest['workingBytes'] / 1024**2:.1f} MiB before compression", flush=True)
    (folder / 'MANIFEST.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    stream = PartsWriter(folder, args.part_mib * 1024 * 1024)
    try:
        with zipfile.ZipFile(stream, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=1, allowZip64=True) as package:
            package.writestr('MANIFEST.json', json.dumps(manifest, ensure_ascii=False, indent=2))
            package.writestr('git-status.z', raw_status)
            for label, command in [('head-to-working.patch', ['diff', 'HEAD', '--binary', '--full-index', '--no-ext-diff', '--no-textconv']),
                                   ('staged.patch', ['diff', '--cached', '--binary', '--full-index', '--no-ext-diff', '--no-textconv'])]:
                package.writestr(label, git(repo, *command))
            for i, row in enumerate(rows, 1):
                name = row['path']
                source = repo / name
                if row['type'] == 'symlink':
                    package.writestr('working-symlinks/' + name, os.fsencode(row['target']))
                elif row['type'] == 'file':
                    package.write(source, 'working/' + name)
                # Keep exact HEAD blobs for comparison, including Git-LFS pointers.
                result = subprocess.run(['git', '-C', str(repo), 'show', 'HEAD:' + name], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
                if result.returncode == 0:
                    package.writestr('base-head/' + name, result.stdout)
                if i % 100 == 0:
                    print(f'Packaged {i}/{len(rows)} paths', flush=True)
    finally:
        stream.close()
    changed = [row['path'] for row in rows if snapshot(repo / row['path']) != {k: v for k, v in row.items() if k != 'path'}]
    if git(repo, 'rev-parse', 'HEAD').decode().strip() != head or git(repo, 'status', '--porcelain=v1', '-z', '--untracked-files=all') != raw_status:
        changed.append('[Git state changed while packaging]')
    if changed:
        (folder / 'INCOMPLETE.txt').write_text('\n'.join(changed) + '\n')
        raise RuntimeError(f'Files changed during packaging. Package is not accepted; originals remain untouched. See {folder}/INCOMPLETE.txt')
    parts = [{'name': path.name, 'bytes': path.stat().st_size, 'sha256': sha_file(path)} for path in stream.paths]
    manifest['parts'] = parts
    manifest['captureVerifiedUnchanged'] = True
    (folder / 'MANIFEST.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print('CAPTURE PASS: original checkout unchanged; package contains every Git-visible unfinished path.')
    print(f'Folder: {folder}')
    print(f'Upload MANIFEST.json and all {len(parts)} unsaved-work.zip.partNNN files. Do not apply the package over the newer branch.')


if __name__ == '__main__':
    try:
        main()
    except (OSError, subprocess.CalledProcessError, RuntimeError) as error:
        print(f'CAPTURE FAILED: {error}', file=sys.stderr)
        sys.exit(1)
