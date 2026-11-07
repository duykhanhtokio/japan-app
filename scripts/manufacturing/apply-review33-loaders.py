"""Restore the exact reviewed translation getters after historical content assembly."""
from pathlib import Path
import hashlib,json,os,runpy,tempfile
ROOT=Path(__file__).resolve().parents[2]
STAGE='docs/ssw-workspace/manufacturing/batch33-full-review/integration/'
def expected(root=ROOT):
    hashes=runpy.run_path(str(ROOT/'scripts/manufacturing/editorial-translation-projection.py'))['HASHES'];outputs={}
    for relative,(before,after) in hashes.items():
        payload=(root/STAGE/('after-'+Path(relative).name)).read_bytes()
        assert hashlib.sha256(payload).hexdigest()==after,'Unknown reviewed loader snapshot'
        current=(root/relative).read_bytes();assert hashlib.sha256(current).hexdigest() in (before,after),'Unknown current loader:'+relative
        outputs[relative]=payload
    return outputs
def restore_loaders(root=ROOT):
    outputs=expected(root);changed=[]
    with tempfile.TemporaryDirectory(prefix='review33-loaders-',dir=root) as folder:
        staged=[]
        for index,(relative,payload) in enumerate(outputs.items()):
            if (root/relative).read_bytes()!=payload:
                temporary=Path(folder)/str(index);temporary.write_bytes(payload);staged.append((relative,temporary));changed.append(relative)
        for relative,temporary in staged:os.replace(temporary,root/relative)
    return changed
if __name__=='__main__':print(json.dumps({'status':'PASS_REVIEWED_LOADERS','changedFiles':restore_loaders(),'fullBuildCertified':False}))
