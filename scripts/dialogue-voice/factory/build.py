"""Deterministic, source-bound offline voice factory. No learner-side engine.
Each worker produces bounded MP3 packs; only a complete matching corpus may publish.
"""
import argparse,hashlib,io,json,os,pathlib,subprocess,time,urllib.parse,urllib.request,wave
ENGINE_SHA='bab016a966131b89bad398e7b898f8c742617dc80a7da49bf494cd07133dbc7a'
APPROVED={8,118,11,21}
ROLES={'femaleStudent':8,'adultFemale':118,'youngMale':11,'adultMale':21}
def read(p):return json.loads(pathlib.Path(p).read_text())
def digest(data):return hashlib.sha256(data).hexdigest()
def identity(row,plan):
 d={k:row[k] for k in ['sourceJa','spokenKana','speakerId']};d.update(engine=plan['engine'],settings=plan['settings']);return d
def clip_key(row,plan):return digest(json.dumps(identity(row,plan),ensure_ascii=False,sort_keys=True).encode())
def samples(p):
 d=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(p)]));n=round(float(d['format']['duration'])*24000);assert n>0 and n%576==0,(str(p),n);return n
def shard(s):
 n=2166136261
 for b in s.encode():n=((n^b)*16777619)&0xffffffff
 return f'{n%32:02d}'
def worker(a):
 plan=read(a.plan);assert plan['engine']['version']=='0.25.2';assert not plan.get('unverifiedCategories');assert all(ROLES[r['role']]==r['speakerId'] for r in plan['rows']);assert {r['speakerId'] for r in plan['rows']}==APPROVED
 unique={}
 for row in plan['rows']:unique.setdefault(clip_key(row,plan),row)
 chosen=[(k,r) for i,(k,r) in enumerate(sorted(unique.items())) if i%a.workers==a.index]
 out=pathlib.Path(a.output);out.mkdir(parents=True,exist_ok=True);clips=out/'clips';clips.mkdir(exist_ok=True)
 http=urllib.request.build_opener(urllib.request.ProxyHandler({}))
 def req(route,data=None):return http.open(urllib.request.Request(f'http://127.0.0.1:{a.port}'+route,data=data,headers={'Content-Type':'application/json'}),timeout=180).read()
 engine=pathlib.Path(a.engine).resolve();log=(out/'engine.log').open('ab');proc=subprocess.Popen([str(engine),'--host','127.0.0.1','--port',str(a.port),'--cpu_num_threads','4'],cwd=engine.parent,stdout=log,stderr=log)
 try:
  for _ in range(120):
   if proc.poll() is not None:raise RuntimeError('Engine stopped before readiness')
   try:version=json.loads(req('/version'));break
   except OSError:time.sleep(.5)
  else:raise RuntimeError('Engine startup timeout')
  assert version=='0.25.2';assert APPROVED<={s['id'] for v in json.loads(req('/speakers')) for s in v['styles']}
  start=time.monotonic();meta={}
  for i,(key,row) in enumerate(chosen):
   p=clips/(key+'.mp3');m=clips/(key+'.json')
   if not(p.exists() and m.exists()):
    # Reuse a verified existing clip when available, never regenerate good audio.
    seed=pathlib.Path(a.seed)/p.name if a.seed else None
    seed_meta=seed.with_suffix('.json') if seed else None
    if seed and seed.exists() and seed_meta.exists() and seed.stat().st_size>200:
     old=read(seed_meta)
     if old['sha256']==digest(seed.read_bytes()) and all(old.get(k)==v for k,v in identity(row,plan).items()):
      import shutil
      shutil.copy2(seed,p);shutil.copy2(seed_meta,m)
   if not(p.exists() and m.exists()):
    query=json.loads(req('/audio_query?'+urllib.parse.urlencode({'speaker':row['speakerId'],'text':row['sourceJa']}),b''));query.update(plan['settings'])
    wav=req('/synthesis?speaker='+str(row['speakerId']),json.dumps(query).encode())
    with wave.open(io.BytesIO(wav),'rb') as w:assert w.getframerate()==24000 and w.getnchannels()==1 and w.getsampwidth()==2;durationMs=round(w.getnframes()/24);assert any(w.readframes(w.getnframes())), 'Silent synthesis response'
    tmp=p.with_suffix('.tmp.mp3');subprocess.run(['ffmpeg','-v','error','-y','-f','wav','-i','pipe:0','-codec:a','libmp3lame','-b:a','48k',str(tmp)],input=wav,check=True)
    subprocess.run(['ffmpeg','-v','error','-i',str(tmp),'-f','null','-'],check=True);tmp.replace(p)
    m.write_text(json.dumps({**identity(row,plan),'durationMs':durationMs,'sha256':digest(p.read_bytes()),'nativeReviewed':False},ensure_ascii=False)+'\n')
   metadata=read(m);assert metadata['sha256']==digest(p.read_bytes());assert all(metadata[k]==v for k,v in identity(row,plan).items());meta[key]={**metadata,'samples':samples(p)}
   if (i+1)%25==0:print(json.dumps({'worker':a.index,'done':i+1,'total':len(chosen),'seconds':round(time.monotonic()-start)}),flush=True)
  # Bounded packs: exact frame-based offsets, original constant bitrate retained.
  groups=[];group=[];size=0
  for key,_ in chosen:
   p=clips/(key+'.mp3')
   if group and size+p.stat().st_size>8*1024*1024:groups.append(group);group=[];size=0
   group.append(key);size+=p.stat().st_size
  if group:groups.append(group)
  packed={};packs={}
  for number,keys in enumerate(groups):
   name=f'voice-{a.index:02d}-{number:02d}.mp3';target=out/name;listing=out/'concat.txt';listing.write_text(''.join("file '"+str((clips/(key+'.mp3')).resolve())+"'\n" for key in keys))
   subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(listing),'-c','copy','-write_xing','0','-id3v2_version','0',str(target)],check=True)
   expected=sum(meta[k]['samples'] for k in keys);assert abs(samples(target)-expected)<=576
   subprocess.run(['ffmpeg','-v','error','-i',str(target),'-f','null','-'],check=True)
   offset=0
   for key in keys:
    packed[key]={'pack':name,'startMs':offset/24,'durationMs':meta[key]['samples']/24,'sha256':meta[key]['sha256'],'nativeReviewed':False};offset+=meta[key]['samples']
   packs[name]={'bytes':target.stat().st_size,'sha256':digest(target.read_bytes()),'durationMs':expected/24}
  result={'schemaVersion':1,'worker':a.index,'workerCount':a.workers,'planSha256':digest(pathlib.Path(a.plan).read_bytes()),'clips':packed,'packs':packs}
  (out/f'worker-{a.index:02d}.json').write_text(json.dumps(result,separators=(',',':'))+'\n');print(json.dumps({'worker':a.index,'complete':True,'clips':len(chosen),'packs':len(packs)}),flush=True)
 finally:
  proc.terminate()
  try:proc.wait(timeout=15)
  except subprocess.TimeoutExpired:proc.kill();proc.wait()
  log.close()
def finalize(a):
 plan=read(a.plan);workers=[read(p) for p in sorted(pathlib.Path(a.input).rglob('worker-*.json'))];assert len(workers)==a.workers
 assert {w['worker'] for w in workers}==set(range(a.workers));clips={};packs={}
 for w in workers:
  assert w['schemaVersion']==1
  assert w['workerCount']==a.workers;assert w['planSha256']==digest(pathlib.Path(a.plan).read_bytes())
  assert not(set(clips)&set(w['clips']));assert not(set(packs)&set(w['packs']));clips.update(w['clips']);packs.update(w['packs'])
 expected={clip_key(r,plan) for r in plan['rows']};assert set(clips)==expected
 release=read(a.assets_json) if a.assets_json else json.load(urllib.request.urlopen(urllib.request.Request('https://api.github.com/repos/duykhanhtokio/japan-app/releases/tags/'+a.base_url.rsplit('/',1)[-1],headers={'Accept':'application/vnd.github+json','User-Agent':'japan-app-audio-validator'}),timeout=60))
 assets={asset['name']:asset for asset in release['assets']}
 for name,pack in packs.items():
  assert 0<pack['bytes']<=20*1024*1024 and pack['durationMs']>0
  asset=assets[name];assert asset['state']=='uploaded' and asset['size']==pack['bytes'] and asset['digest']=='sha256:'+pack['sha256']
 shards={f'{i:02d}':{} for i in range(32)};rows=0
 for r in plan['rows']:
  key=clip_key(r,plan);entry=clips[key];pack=packs[entry['pack']];assert entry['startMs']>=0 and entry['durationMs']>0 and entry['startMs']+entry['durationMs']<=pack['durationMs']+.1
  shards[shard(r['scenarioId'])].setdefault(r['scenarioId'],{})[r['turnId']]={**entry,'sourceJa':r['sourceJa'],'role':r['role'],'speakerId':r['speakerId'],'clip':key};rows+=1
 assert rows==42768 and len({r['scenarioId'] for r in plan['rows']})==7128
 assert sum(len(turns) for data in shards.values() for turns in data.values())==rows
 out=pathlib.Path(a.output);out.mkdir(parents=True,exist_ok=True)
 for name,data in shards.items():(out/(name+'.json')).write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n')
 manifest={'schemaVersion':1,'complete':True,'baseUrl':a.base_url,'sourceCommit':a.commit,'engine':plan['engine'],'settings':plan['settings'],'scenarioCount':7128,'turnCount':rows,'uniqueClips':len(clips),'packs':packs,'nativeListeningReviewed':False,'pronunciationReviewed':False}
 (out.parent/'npc-audio-release.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'complete':True,'turns':rows,'clips':len(clips),'packs':len(packs)}))
if __name__=='__main__':
 p=argparse.ArgumentParser();sub=p.add_subparsers(dest='command',required=True)
 w=sub.add_parser('worker');w.add_argument('--plan',required=True);w.add_argument('--engine',required=True);w.add_argument('--output',required=True);w.add_argument('--index',type=int,required=True);w.add_argument('--workers',type=int,default=48);w.add_argument('--port',type=int,default=50129);w.add_argument('--seed')
 f=sub.add_parser('finalize');f.add_argument('--plan',required=True);f.add_argument('--input',required=True);f.add_argument('--output',required=True);f.add_argument('--workers',type=int,default=48);f.add_argument('--base-url',required=True);f.add_argument('--commit',required=True);f.add_argument('--assets-json')
 a=p.parse_args();worker(a) if a.command=='worker' else finalize(a)
