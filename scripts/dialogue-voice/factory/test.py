"""Publication gate fixtures: no speech files are claimed by this test."""
import contextlib,copy,importlib.util,io,json,pathlib,tempfile,types
spec=importlib.util.spec_from_file_location('factory',pathlib.Path(__file__).with_name('build.py'));f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)
def run(plan_path):
 plan=f.read(plan_path);unique=sorted({f.clip_key(r,plan) for r in plan['rows']})
 with tempfile.TemporaryDirectory() as temp:
  root=pathlib.Path(temp);meta=root/'metadata';meta.mkdir();workers=[];assets=[]
  for index in range(48):
   keys=unique[index::48];name=f'voice-{index:02d}-00.mp3';clips={key:{'pack':name,'startMs':i*100,'durationMs':100,'sha256':'b'*64,'nativeReviewed':False} for i,key in enumerate(keys)}
   pack={'bytes':1000,'sha256':'a'*64,'durationMs':len(keys)*100}
   worker={'schemaVersion':1,'worker':index,'workerCount':48,'planSha256':f.digest(pathlib.Path(plan_path).read_bytes()),'clips':clips,'packs':{name:pack}};workers.append(worker)
   assets.append({'name':name,'size':1000,'digest':'sha256:'+'a'*64,'state':'uploaded'})
  def save():
   for index,worker in enumerate(workers):(meta/f'worker-{index:02d}.json').write_text(json.dumps(worker))
   (root/'assets.json').write_text(json.dumps({'assets':assets}))
  a=types.SimpleNamespace(plan=plan_path,input=str(meta),output=str(root/'data/audio-packs'),workers=48,base_url='https://github.com/duykhanhtokio/japan-app/releases/download/npc-audio-test',commit='fixture',assets_json=str(root/'assets.json'))
  save()
  with contextlib.redirect_stdout(io.StringIO()):f.finalize(a)
  assert f.read(root/'data/npc-audio-release.json')['turnCount']==42768
  removed=workers[0]['clips'].pop(next(iter(workers[0]['clips'])));save()
  try:f.finalize(a)
  except AssertionError:pass
  else:raise AssertionError('Missing clip must prevent publication')
  workers[0]['clips'][unique[0]]=removed;assets[0]['digest']='sha256:'+'0'*64;save()
  try:f.finalize(a)
  except AssertionError:pass
  else:raise AssertionError('Wrong uploaded digest must prevent publication')
 print('PUBLICATION GATE PASS: 42768 fixture bindings accepted; missing audio and wrong uploaded digest rejected. Fixtures are not generated speech.')
if __name__=='__main__':
 import sys
 run(sys.argv[1])
