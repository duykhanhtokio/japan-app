"""Generate local VOICEVOX draft audio from original master and approved casting.
Usage: python scripts/generate-jlpt-original-audio.py --engine /path/to/engine/run
No external text service; no legacy exam inputs. Generated audio requires human review.
"""
import argparse,array,hashlib,io,json,subprocess,time,urllib.parse,urllib.request,wave
from pathlib import Path
ap=argparse.ArgumentParser();ap.add_argument('--engine',required=True);args=ap.parse_args()
root=Path(__file__).resolve().parent.parent;master=root/'src/data/jlpt-original/n5/01/master.ja.json';exam=json.loads(master.read_text());casting=json.loads((root/'src/data/jlpt-original/voice-casting.json').read_text());settings=casting['settings'];roles=casting['roles']
out=root/'assets/jlpt-original/n5/01/audio';out.mkdir(parents=True,exist_ok=True)
work=root/'docs/jlpt-workspace/original/n5-01/audio';work.mkdir(parents=True,exist_ok=True)
plan={1:'問題一です。話を聞いて、これから何をするかを考えてください。答えを一つ選んでください。',2:'問題二です。話の中から、質問の答えを探してください。答えを一つ選んでください。',3:'問題三です。絵と話から、場面に合う言い方を考えてください。三つの言い方を聞いて、一つ選んでください。',4:'問題四です。短い言葉を聞いてください。そのあと、三つの返事を聞いて、一番合うものを選んでください。'}
# Explicit actor casting; narrator is adultFemale. Same actor keeps same voice within each item.
actors={
 '1-01':{'female':'adultFemale','male':'adultMale'},'1-02':{'teacher':'adultMale'},
 '1-03':{'female':'adultFemale','male':'youngMale'},'1-04':{'female':'femaleStudent','male':'youngMale'},
 '1-05':{'female':'adultFemale','male':'adultMale'},'1-06':{'female':'femaleStudent','male':'youngMale'},
 '1-07':{'female':'adultFemale','male':'adultMale'},'2-01':{'female':'femaleStudent','male':'youngMale'},
 '2-02':{'female':'adultFemale','male':'adultMale'},'2-03':{'female':'femaleStudent','male':'youngMale'},
 '2-04':{'female':'adultFemale','male':'youngMale'},'2-05':{'female':'adultFemale','male':'adultMale'},
 '2-06':{'female':'femaleStudent','male':'youngMale'},
 '4-01':{'friend':'youngMale'},'4-02':{'clerk':'adultFemale'},'4-03':{'friend':'femaleStudent'},
 '4-04':{'teacher':'adultMale'},'4-05':{'friend':'youngMale'},'4-06':{'friend':'femaleStudent'}}
http=urllib.request.build_opener(urllib.request.ProxyHandler({}));proc=None;log=open(work/'generation.log','w')
def start():
 global proc
 proc=subprocess.Popen([args.engine,'--host','127.0.0.1','--port','50128','--cpu_num_threads','2'],cwd=str(Path(args.engine).parent),stdout=log,stderr=log)
 for _ in range(80):
  try: req('/speakers');return
  except Exception:
   if proc.poll() is not None:raise RuntimeError('VOICEVOX stopped')
   time.sleep(.25)
 raise RuntimeError('Startup timeout')
def stop():
 if proc and proc.poll() is None:proc.terminate();proc.wait(timeout=15)
def req(path,data=None):return http.open(urllib.request.Request('http://127.0.0.1:50128'+path,data=data,headers={'Content-Type':'application/json'}),timeout=120).read()
def silence(sec):return b'\0'*round(24000*sec)*2
cache=work/'turn-cache';cache.mkdir(exist_ok=True)
def synth(text,role):
 sid=roles[role]['speakerId'];text=text.replace(' ','');key=hashlib.sha256(json.dumps([text,sid,settings['speedScale']],ensure_ascii=False).encode()).hexdigest();p=cache/(key+'.wav')
 if not p.exists():
  q=json.loads(req('/audio_query?'+urllib.parse.urlencode({'speaker':sid,'text':text}),b''));q.update(speedScale=settings['speedScale'],outputSamplingRate=24000,outputStereo=False)
  p.write_bytes(req('/synthesis?speaker='+str(sid),json.dumps(q).encode()))
 with wave.open(str(p)) as w:
  assert (w.getframerate(),w.getnchannels(),w.getsampwidth())==(24000,1,2)
  pcm=w.readframes(w.getnframes());assert max(abs(v) for v in array.array('h',pcm))>100
 return pcm
credits='; '.join(v['credit'] for v in roles.values())
def save(name,pcm):
 wp=work/(name+'.wav');mp=out/(name+'.mp3')
 with wave.open(str(wp),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(24000);w.writeframes(pcm)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(wp),'-codec:a','libmp3lame','-b:a','96k','-metadata','artist='+credits,'-metadata','comment=Independently authored N5 pilot; draft audio; human playback review pending',str(mp)],check=True);wp.unlink();return mp
try:
 start();album=bytearray(silence(1));segments=[];used=[]
 for group in range(1,5):
  album.extend(synth(plan[group],'adultFemale'));album.extend(silence(2))
  for q in [q for q in exam['questions'] if q['section']=='listening' and q['group']==group]:
   key=f'{group}-{q["number"]:02d}';frames=bytearray(synth(str(q['number'])+'番です。','adultFemale'));frames.extend(silence(.5));turns=[]
   for i,(actor,text) in enumerate(q['script']):
    role='adultFemale' if actor=='narrator' else actors[key][actor]
    frames.extend(synth(text,role));frames.extend(silence(settings['afterIntroSeconds'] if i==0 else settings['betweenTurnsSeconds']));turns.append({'actor':actor,'role':role,'text':text})
   if group<=2:frames.extend(synth(q['prompt'],'adultFemale'))
   else:
    answer_role=('femaleStudent' if q['number']%2 else 'youngMale') if group==3 else {'4-01':'femaleStudent','4-02':'youngMale','4-03':'youngMale','4-04':'femaleStudent','4-05':'femaleStudent','4-06':'youngMale'}[key]
    for opt in q['options']:
     frames.extend(synth(opt['id']+'。','adultFemale'));frames.extend(silence(.3));frames.extend(synth(opt['text'],answer_role));frames.extend(silence(.8));turns.append({'actor':'option-'+opt['id'],'role':answer_role,'text':opt['text']})
   frames.extend(silence(settings['answerPauseSeconds']));mp=save('problem-'+key,frames)
   begin=round(len(album)/48);album.extend(frames);end=round(len(album)/48)
   segments.append({'questionId':q['id'],'group':group,'number':q['number'],'path':str(mp.relative_to(root)),'startMs':begin,'endMs':end,'durationMs':round(len(frames)/48),'sha256':hashlib.sha256(mp.read_bytes()).hexdigest(),'playbackReviewed':False,'turns':turns})
   print(f'{len(segments)}/24 problem {key}',flush=True)
   if len(segments)%6==0 and len(segments)<24:stop();start()
 mp=save('n5-original-01-listening-draft',album)
 manifest={'examId':exam['examId'],'status':'generated_draft_unreviewed','masterSha256':hashlib.sha256(master.read_bytes()).hexdigest(),'voiceCastingSha256':hashlib.sha256((root/'src/data/jlpt-original/voice-casting.json').read_bytes()).hexdigest(),'continuousAudioPath':str(mp.relative_to(root)),'continuousSha256':hashlib.sha256(mp.read_bytes()).hexdigest(),'durationMs':round(len(album)/48),'targetDurationMs':1800000,'matchesThirtyMinuteTarget':False,'durationMeasuredFromPcm':True,'publisherReviewed':False,'nativeReviewCompleted':False,'perceptualApproval':False,'rightsReleaseReviewCompleted':False,'instructions':plan,'settings':settings,'credits':[v['credit'] for v in roles.values()],'items':segments}
 (root/'src/data/jlpt-original/n5/01/audio.manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'count':24,'durationSeconds':len(album)/48000,'complete':True}),flush=True)
finally:stop();log.close()
