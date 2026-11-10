"""Build an exact-content connector payload; stdout contains metadata only.

The caller must transmit the complete payload, compare the returned final tree
against expectedTree, and update the branch with a lease on base. This does not
perform network writes or claim persistence.
"""
import hashlib
import json
import pathlib
import subprocess
import sys

root = pathlib.Path(__file__).resolve().parents[4]
base, output = sys.argv[1:3]


def git(*args):
    return subprocess.check_output(['git', *args], cwd=root, text=True).strip()


base = git('rev-parse', base)
entries = []
for name in git('diff', '--name-only', base, 'HEAD').splitlines():
    record = git('ls-tree', 'HEAD', '--', name)
    if not record:
        entries.append({'path': name, 'mode': '100644', 'type': 'blob', 'sha': None})
        continue
    metadata = record.split('\t', 1)[0].split()
    assert metadata[0] == '100644' and metadata[1] == 'blob', name
    content = (root / name).read_bytes()
    assert hashlib.sha1(b'blob ' + str(len(content)).encode() + b'\0' + content).hexdigest() == metadata[2]
    entries.append({'path': name, 'mode': '100644', 'type': 'blob', 'content': content.decode('utf-8')})
data = {'entries': entries, 'base': base, 'baseTree': git('rev-parse', base+'^{tree}'),
        'expectedTree': git('rev-parse', 'HEAD^{tree}')}
serialized = json.dumps(data, ensure_ascii=False)
pathlib.Path(output).write_text(serialized)
print(json.dumps({'chars': len(serialized), 'bytes': len(serialized.encode()), 'files': len(entries),
                  'sha256': hashlib.sha256(serialized.encode()).hexdigest(),
                  'chunks': (len(serialized)+99999)//100000, 'expectedTree': data['expectedTree'], 'base': base}))
