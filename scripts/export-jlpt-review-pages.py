#!/usr/bin/env python3
"""Make small, ordinary-Git text previews from a locally available JLPT PDF.

These are review evidence only. The app never loads these complete-page images.
"""

import argparse
import base64
import hashlib
import json
import subprocess
import sys
import unicodedata
from pathlib import Path


def same_name(left: str, right: str) -> bool:
    return unicodedata.normalize('NFC', left).casefold() == unicodedata.normalize('NFC', right).casefold()


def find_pdf(exam: str) -> Path:
    level, year, month = exam.split('-')
    desktop = Path.home() / 'Desktop'
    roots = [p for p in desktop.iterdir() if p.is_dir() and same_name(p.name, 'Nội dung đưa vào app')]
    if len(roots) != 1:
        raise RuntimeError('Cannot identify the Desktop/Nội dung đưa vào app folder uniquely; pass --source PDF_PATH.')
    level_dir = roots[0] / level.upper()
    folders = [p for p in level_dir.iterdir() if p.is_dir() and p.name.upper().startswith(level.upper() + ' ')
               and p.name.split(' ', 1)[1].replace(' ', '') in (f'{int(month)}-{year}', f'{month}-{year}')]
    pdfs = [p for folder in folders for p in folder.iterdir() if p.suffix.lower() == '.pdf']
    if len(pdfs) != 1:
        raise RuntimeError(f'Expected one PDF for {exam}; found {len(pdfs)}. Pass --source PDF_PATH.')
    return pdfs[0]


def git(*args: str, cwd: Path) -> str:
    return subprocess.check_output(['git', *args], cwd=cwd, text=True).strip()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--exam', required=True, help='For example n5-2021-12')
    parser.add_argument('--source', type=Path, help='Override the auto-detected local PDF')
    parser.add_argument('--output', type=Path, help='Override the review output directory')
    parser.add_argument('--publish', action='store_true', help='Commit only the review previews and push the current recovery branch')
    args = parser.parse_args()
    if not __import__('re').fullmatch(r'n[45]-\d{4}-(07|12)', args.exam):
        parser.error('--exam must be an N4/N5 period such as n5-2021-12')
    try:
        import fitz
    except ImportError as exc:
        raise SystemExit('PyMuPDF is required. Install once with: python3 -m pip install pymupdf') from exc

    repo = Path(__file__).resolve().parent.parent
    source = args.source.expanduser().resolve() if args.source else find_pdf(args.exam)
    if not source.is_file():
        raise SystemExit(f'PDF not found: {source}')
    if source.read_bytes()[:42].startswith(b'version https://git-lfs.github.com/spec/v1'):
        raise SystemExit(f'This is a Git LFS pointer, not the PDF: {source}. Run git lfs pull in its source repository first.')
    output = (args.output or repo / 'docs/jlpt-workspace/source-review-previews' / args.exam).resolve()
    if args.publish and (output != repo / 'docs/jlpt-workspace/source-review-previews' / args.exam):
        parser.error('--publish requires the default output directory inside the app repository')

    pdf_sha = hashlib.sha256(source.read_bytes()).hexdigest()
    document = fitz.open(source)
    if len(document) == 0:
        raise SystemExit('PDF has no pages')
    output.mkdir(parents=True, exist_ok=True)
    records = []
    for index, page in enumerate(document):
        for dpi in (180, 150, 120, 100):
            pixmap = page.get_pixmap(matrix=fitz.Matrix(dpi / 72, dpi / 72), alpha=False)
            jpeg = pixmap.tobytes('jpeg', jpg_quality=67)
            if len(jpeg) <= 700_000:
                break
        if len(jpeg) > 700_000:
            raise SystemExit(f'Page {index + 1} cannot fit the 700 KB review limit')
        name = f'page-{index + 1:02d}.jpg.base64.txt'
        (output / name).write_text(base64.b64encode(jpeg).decode('ascii') + '\n', encoding='ascii')
        records.append({'page': index + 1, 'file': name, 'jpegSha256': hashlib.sha256(jpeg).hexdigest(),
                        'jpegBytes': len(jpeg), 'dpi': dpi})
    manifest = {'exam': args.exam, 'sourcePdfSha256': pdf_sha, 'sourcePages': len(document),
                'purpose': 'source image review only; never render full PDF pages as runtime questions',
                'pages': records}
    (output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Exported {len(records)} review pages from {source.name} to {output}')

    if args.publish:
        if git('branch', '--show-current', cwd=repo) != 'recovery/jlpt-n3-n1':
            raise SystemExit('Publish only from recovery/jlpt-n3-n1')
        relative = str(output.relative_to(repo))
        git('add', '--', relative, cwd=repo)
        if not git('diff', '--cached', '--name-only', '--', relative, cwd=repo):
            print('Review pages already match the committed version.')
            return
        git('commit', '-m', f'data(jlpt): add {args.exam} source review previews', '--', relative, cwd=repo)
        git('push', 'origin', 'recovery/jlpt-n3-n1', cwd=repo)
        print('Published review previews to origin/recovery/jlpt-n3-n1')


if __name__ == '__main__':
    try:
        main()
    except (OSError, subprocess.CalledProcessError, RuntimeError) as error:
        sys.exit(str(error))
