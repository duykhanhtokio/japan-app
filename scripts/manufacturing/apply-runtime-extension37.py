"""Restore the exact reviewed completion reader after historical assembly."""
from pathlib import Path
import hashlib,json,os,tempfile

ROOT=Path(__file__).resolve().parents[2]
def apply(root=ROOT):
    spec=json.loads((root/'docs/ssw-workspace/manufacturing/batch37-completion/runtime-extension.json').read_text())
    assert spec['path']=='src/components/manufacturing/ManufacturingCourse.tsx'
    desired=(root/spec['snapshot']).read_bytes()
    assert hashlib.sha256(desired).hexdigest()==spec['sha256'], 'Completion reader snapshot changed'
    target=root/spec['path'];current=target.read_bytes()
    digest=hashlib.sha256(current).hexdigest()
    assert digest in (spec['sha256'],spec['beforeSha256']), 'Unrecognized reader; preserve it'
    if current==desired:return []
    fd,temporary=tempfile.mkstemp(prefix='.mfg37-',dir=target.parent)
    try:
        with os.fdopen(fd,'wb') as stream:stream.write(desired)
        os.replace(temporary,target)
    finally:Path(temporary).unlink(missing_ok=True)
    return [spec['path']]

if __name__=='__main__':print(json.dumps({'status':'PASS','updated':apply()}))
