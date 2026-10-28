"""Exercise the final26->29 assembly chain in a small isolated RAM snapshot.

This does not claim a whole-course frozen-draft or Expo rebuild.
"""
from pathlib import Path
import hashlib,json,runpy,subprocess,sys,tempfile
ROOT=Path(__file__).resolve().parents[2]
M=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-caliper-guide29.py'))
def main():
 latest=M['layer26']();inputs={**latest['load_inputs'](),**M['load_inputs']()}
 runtime=[M[k] for k in ['SOURCE','TARGETS','COURSE','PROGRESS']]
 for p in runtime:inputs[p]=(ROOT/p).read_bytes()
 scripts=['scripts/manufacturing/apply-guide-extension26.py','scripts/manufacturing/apply-caliper-guide29.py']
 for p in scripts:inputs[p]=(ROOT/p).read_bytes()
 progress_base=latest['STAGE']+'integration/base-progress.json'
 inputs[progress_base]=(ROOT/progress_base).read_bytes()
 expected={p:inputs[p] for p in runtime};steps=[]
 with tempfile.TemporaryDirectory(prefix='caliper29-chain-',dir='/dev/shm') as temp:
  root=Path(temp)
  for p,raw in inputs.items():
   target=root/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
  for script in [scripts[0],scripts[1],scripts[1]]:
   result=subprocess.run([sys.executable,str(root/script)],cwd=root,text=True,capture_output=True)
   assert result.returncode==0,(script,result.stderr)
   steps.append({'script':script,'status':'PASS','result':json.loads(result.stdout)})
   if script==scripts[0]:assert len(json.loads((root/M['SOURCE']).read_bytes())['guides'])==11
   else:assert all((root/p).read_bytes()==raw for p,raw in expected.items()),'Chain failed to restore exact12-guide bytes'
  # Real stale-input execution must leave all four outputs untouched.
  target=root/(M['DRAFT']+'guide.vi.json');v=json.loads(target.read_bytes());v['paragraphs'][0]['text']+=' 999';target.write_bytes(M['encoded'](v))
  failed=subprocess.run([sys.executable,str(root/scripts[1])],cwd=root,text=True,capture_output=True)
  assert failed.returncode!=0 and 'Stale29input' in failed.stderr
  assert all((root/p).read_bytes()==raw for p,raw in expected.items())
  assert all((ROOT/p).read_bytes()==raw for p,raw in expected.items()),'Shared runtime changed'
 return {'status':'PASS','scope':'Actual isolated final26->29 writer chain only; not full frozen-draft/Expo build.',
         'steps':steps,'runtimeFilesRestoredByteExactly':4,'repeat29ByteIdempotent':True,
         'actualStaleInputFailureZeroOutputWrites':True,'sharedRuntimeModified':False,
         'runtimeSha256':{p:hashlib.sha256(raw).hexdigest() for p,raw in expected.items()},
         'independentAIComparisonPerformed':False,'nativeReviewed':False,'domainReviewed':False,'releaseReady':False}
if __name__=='__main__':print(json.dumps(main()))
