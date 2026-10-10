"""Repair the independently authored N1 02 opening label, preserving scored speech.
Run after N1 06 durability. Uses local approved VOICEVOX only; no legacy exam input.
"""
import argparse,hashlib,io,json,subprocess,time,urllib.parse,urllib.request,wave
from pathlib import Path
import numpy as np
ap=argparse.ArgumentParser();ap.add_argument('--root',required=True);ap.add_argument('--original-track',required=True);ap.add_argument('--engine',required=True);args=ap.parse_args()
R=Path(args.root);B=R/'src/data/jlpt-original/n1/02';a=json.loads((B/'audio.manifest.json').read_text());org=json.loads((B/'listening-organization.ja.json').read_text());cast=json.loads((R/'src/data/jlpt-original/voice-casting.json').read_text());original=Path(args.original_track)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(original)==a['continuousSha256']
old=org['openingJa'];assert '第一回' in old;new=old.replace('第一回','第二回')
work=Path('/tmp/n102-opening-repair');work.mkdir(exist_ok=True);http=urllib.request.build_opener(urllib.request.ProxyHandler({}));port=50146;sid=cast['roles']['adultFemale']['speakerId'];assert sid==118
def req(path,data=None):return http.open(urllib.request.Request('http://127.0.0.1:'+str(port)+path,data=data,headers={'Content-Type':'application/json'}),timeout=120).read()
def synth(text):
 cache=work/(hashlib.sha256(text.encode()).hexdigest()+'.wav')
 if not cache.exists():
  q=json.loads(req('/audio_query?'+urllib.parse.urlencode({'speaker':sid,'text':text.replace(' ','')}),b''));q.update(speedScale=.9,outputSamplingRate=24000,outputStereo=False);cache.write_bytes(req('/synthesis?speaker='+str(sid),json.dumps(q).encode()))
 with wave.open(str(cache))as w:assert (w.getframerate(),w.getnchannels(),w.getsampwidth())==(24000,1,2);return w.readframes(w.getnframes())
def decode(p):return subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','s16le','-ar','24000','-ac','1','pipe:1'])
with (work/'engine.log').open('w')as log:
 proc=subprocess.Popen([args.engine,'--host','127.0.0.1','--port',str(port),'--cpu_num_threads','1'],cwd=str(Path(args.engine).parent),stdout=log,stderr=log)
 try:
  for _ in range(100):
   try:req('/speakers');break
   except Exception:
    if proc.poll()is not None:raise RuntimeError('Engine stopped')
    time.sleep(.2)
  before=synth(old);after=synth(new)
 finally:
  if proc.poll()is None:proc.terminate();proc.wait(timeout=15)
raw=decode(original);start=24000*2;end=start+len(before);left=np.frombuffer(before,dtype='<i2').astype(float);right=np.frombuffer(raw[start:end],dtype='<i2').astype(float);correlation=float(np.corrcoef(left,right)[0,1]);assert correlation>.98,'Do not splice without verified exact opening alignment'
patched=raw[:start]+after+raw[end:];assert patched[start+len(after):]==raw[end:]
framesDelta=(len(after)-len(before))//2;deltaMs=round(framesDelta/24);duration=round(len(patched)/48)
target=R/a['continuousAudioPath'];target.parent.mkdir(parents=True,exist_ok=True)
subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ar','24000','-ac','1','-i','pipe:0','-codec:a','libmp3lame','-b:a',str(a.get('continuousBitrateKbps',24))+'k','-metadata','artist='+'; '.join(a['credits']),'-metadata','comment=Independent N1 02; corrected second-exam opening; perceptual review pending',str(target)],input=patched,check=True)
encoded=decode(target);assert len(encoded)==len(patched)
for it in a['items']:it['startMs']+=deltaMs;it['endMs']+=deltaMs
for x in a['orientationSegments']:
 if x['role']=='opening_sound_check_and_general_instructions':x['endMs']+=deltaMs
 else:
  for k in ['startMs','endMs','exampleStartMs','exampleEndMs']:
   if k in x:x[k]+=deltaMs
for k in ['announcementStartMs','musicStartMs','musicEndMs','resumeAnnouncementEndMs']:a['break'][k]+=deltaMs
org['openingJa']=new;(B/'listening-organization.ja.json').write_text(json.dumps(org,ensure_ascii=False,indent=2)+'\n');a['organizationSha256']=sha(B/'listening-organization.ja.json');a['durationMs']=duration;a['continuousSha256']=sha(target)
mp=B/'master.ja.json';m=json.loads(mp.read_text());m['audio']['actualDurationMs']=duration;mp.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');a['currentMasterSha256']=sha(mp)
a['openingLabelRepair']={'oldOpeningJa':old,'newOpeningJa':new,'originalTrackSha256':sha(original),'verifiedOldOpeningCorrelation':correlation,'deltaPcmFrames':framesDelta,'deltaMs':deltaMs,'scoredSpeechPcmPreservedBeforeEncoding':True,'encodedGaplessFrameCountVerified':True,'speakerId':118,'speedScale':.9,'publisherReviewed':False,'perceptualApproval':False}
(B/'audio.manifest.json').write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n')
report={'status':'PASS_opening_label_repair','examId':m['examId'],'durationMs':duration,'repair':a['openingLabelRepair'],'continuousSha256':a['continuousSha256'],'scope':'Opening-only PCM replacement then same-bitrate gapless encoding. Scored story PCM preserved before encoding, existing per-story assets unchanged; timing shifted by measured delta. Not perceptual or native approval.'}
(R/'docs/jlpt-workspace/original/n1-02/opening-label-repair.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
