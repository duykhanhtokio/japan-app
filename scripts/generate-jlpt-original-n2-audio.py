"""Generate local VOICEVOX audio from original master and approved casting.
Usage: python scripts/generate-jlpt-original-n2-audio.py --engine /path/to/engine/run
No external text service; no legacy exam inputs. Generated audio requires human review.
"""
import argparse,array,hashlib,io,json,math,subprocess,time,urllib.parse,urllib.request,wave
from pathlib import Path
ap=argparse.ArgumentParser();ap.add_argument('--level',choices=['n2'],default='n2');ap.add_argument('--port',type=int,default=50128);ap.add_argument('--cpu-threads',type=int,default=2);ap.add_argument('--engine',required=True);ap.add_argument('--exam-number',type=int,choices=range(1,7),default=1);ap.add_argument('--cache-dir');ap.add_argument('--continuous-bitrate-kbps',type=int,choices=[32,40,48,64,96],default=96);args=ap.parse_args();level=args.level;exam_number=f'{args.exam_number:02d}'
root=Path(__file__).resolve().parent.parent;master=root/f'src/data/jlpt-original/{level}/{exam_number}/master.ja.json';master_bytes=master.read_bytes();exam=json.loads(master_bytes);casting=json.loads((root/'src/data/jlpt-original/voice-casting.json').read_text());settings={**casting['settings'],**casting.get('levelPacing',{}).get(level,{})};roles=casting['roles'];organization_path=root/f'src/data/jlpt-original/{level}/{exam_number}/listening-organization.ja.json';organization_bytes=organization_path.read_bytes();organization=json.loads(organization_bytes)
out=root/f'assets/jlpt-original/{level}/{exam_number}/audio';out.mkdir(parents=True,exist_ok=True)
work=root/f'docs/jlpt-workspace/original/{level}-{exam_number}/audio';work.mkdir(parents=True,exist_ok=True)
settings.pop('answerPauseSeconds',None)
plan={g['problem']:g['instructionsJa'] for g in organization['groups']}
# Explicit actor casting; narrator is adultFemale. Same actor keeps same voice within each item.
http=urllib.request.build_opener(urllib.request.ProxyHandler({}));proc=None;log=open(work/'generation.log','w')
def start():
 global proc
 proc=subprocess.Popen([args.engine,'--host','127.0.0.1','--port',str(args.port),'--cpu_num_threads',str(args.cpu_threads)],cwd=str(Path(args.engine).parent),stdout=log,stderr=log)
 for _ in range(80):
  try: req('/speakers');return
  except Exception:
   if proc.poll() is not None:raise RuntimeError('VOICEVOX stopped')
   time.sleep(.25)
 raise RuntimeError('Startup timeout')
def stop():
 if proc and proc.poll() is None:proc.terminate();proc.wait(timeout=15)
def req(path,data=None):return http.open(urllib.request.Request('http://127.0.0.1:'+str(args.port)+path,data=data,headers={'Content-Type':'application/json'}),timeout=120).read()
def silence(sec):return b'\0'*round(24000*sec)*2
cache=Path(args.cache_dir) if args.cache_dir else work/'turn-cache';cache.mkdir(parents=True,exist_ok=True);new_synthesis_count=0
def synth(text,role):
 global new_synthesis_count
 sid=roles[role]['speakerId'];text=text.replace(' ','');key=hashlib.sha256(json.dumps([text,sid,settings['speedScale']],ensure_ascii=False).encode()).hexdigest();p=cache/(key+'.wav')
 if not p.exists():
  if new_synthesis_count and new_synthesis_count%6==0:stop();start()
  q=json.loads(req('/audio_query?'+urllib.parse.urlencode({'speaker':sid,'text':text}),b''));q.update(speedScale=settings['speedScale'],outputSamplingRate=24000,outputStereo=False)
  p.write_bytes(req('/synthesis?speaker='+str(sid),json.dumps(q).encode()));new_synthesis_count+=1
 with wave.open(str(p)) as w:
  assert (w.getframerate(),w.getnchannels(),w.getsampwidth())==(24000,1,2)
  pcm=w.readframes(w.getnframes());assert max(abs(v) for v in array.array('h',pcm))>100
 return pcm
credits='; '.join(v['credit'] for v in roles.values())
def save(name,pcm):
 mp=out/(name+'.mp3')
 subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ar','24000','-ac','1','-i','pipe:0','-codec:a','libmp3lame','-b:a',str(args.continuous_bitrate_kbps)+'k' if name.endswith('-listening-draft') else '96k','-metadata','artist='+credits,'-metadata','comment=Independently authored '+level.upper()+'; human playback review pending',str(mp)],input=pcm,check=True)
 return mp
def original_rest_music():
 # Original procedural instrumental pad; no recorded source or copied melody.
 # 12 independently chosen five-second harmonic cells, soft sine harmonics.
 cells=[(64,69,72),(59,62,67),(62,65,70),(57,60,65),(60,64,71),(55,60,67),(65,69,74),(59,64,69),(62,67,72),(57,62,66),(60,65,69),(64,69,72)]
 if args.exam_number>1:
  offset=(args.exam_number-1)*2
  cells=cells[offset:]+cells[:offset]
  cells=[tuple(note+args.exam_number-1 for note in cell) for cell in cells]
 samples=array.array('h')
 for i in range(1440000):
  t=i/24000;cell=int(t//5);local=t-cell*5
  envelope=min(1,local/.8,(5-local)/.8)*min(1,t/2,(60-t)/2)
  value=sum(math.sin(2*math.pi*(440*2**((note-69)/12))*t)+.12*math.sin(2*math.pi*(880*2**((note-69)/12))*t) for note in cells[cell])
  samples.append(round(950*max(0,envelope)*value))
 assert len(samples)==1440000
 return samples.tobytes()
try:
 start();album=bytearray(silence(1));segments=[];used=[];break_manifest=None;orientation_segments=[]
 def narration(text):
  album.extend(synth(text,'adultFemale'));album.extend(silence(settings['betweenTurnsSeconds']))
 opening_start=round(len(album)/48);narration(organization['openingJa'])
 for check in organization['soundCheck']:
  album.extend(synth(check['text'],check['role']));album.extend(silence(settings['betweenTurnsSeconds']))
 narration(organization['generalInstructionsJa']);orientation_segments.append({'role':'opening_sound_check_and_general_instructions','startMs':opening_start,'endMs':round(len(album)/48)})
 for group in range(1,len(organization['groups'])+1):
  orientation_start=round(len(album)/48);narration(plan[group]);org=next(g for g in organization['groups'] if g['problem']==group);practice=org['example'];practice_start=round(len(album)/48);practice_turns=[]
  for i,(role,text) in enumerate(practice['script']):
   album.extend(synth(text,role));album.extend(silence(settings['afterIntroSeconds'] if i==0 else settings['betweenTurnsSeconds']));practice_turns.append({'actor':role,'role':role,'text':text})
  if org.get('readQuestionAfterDialogue',group<=2):album.extend(synth(practice['prompt'],'adultFemale'))
  if org.get('readChoices',group>2):
   for opt in practice['options']:
    practice_answer_role=practice.get('optionVoiceRole') or ('femaleStudent' if group==3 else 'youngMale')
    album.extend(synth(opt['id']+'。','adultFemale'));album.extend(silence(.3));album.extend(synth(opt['text'],practice_answer_role));album.extend(silence(.8));practice_turns.append({'actor':'option-'+opt['id'],'role':practice_answer_role,'text':opt['text']})
  album.extend(silence(settings['answerPauseSecondsByProblem'][str(group)]));practice_end=round(len(album)/48)
  narration(practice['answerExplanationJa']);narration(org['scoredStartJa'])
  orientation_segments.append({'role':'problem_instructions_example_demonstration','problem':group,'startMs':orientation_start,'endMs':round(len(album)/48),'exampleId':practice['id'],'exampleStartMs':practice_start,'exampleEndMs':practice_end,'exampleCount':1,'exampleTurns':practice_turns,'scored':False})
  group_questions=[q for q in exam['questions'] if q['section']=='listening' and q['group']==group]
  completed_dialogues=set()
  for q in group_questions:
   shared=q.get('sharedDialogueId')
   if shared and shared in completed_dialogues:continue
   siblings=[x for x in group_questions if x.get('sharedDialogueId')==shared] if shared else [q]
   if shared:completed_dialogues.add(shared)
   assert all(x['script']==q['script'] for x in siblings), 'Shared dialogue must have exactly matching script'
   key=f'{group}-{q["number"]:02d}'
   numbers='と'.join(str(x['number'])+'番' for x in siblings)
   frames=bytearray(synth(numbers+'です。','adultFemale'));frames.extend(silence(.5));turns=[];response_windows=[]
   for i,(role,text) in enumerate(q['script']):
    assert role in roles
    frames.extend(synth(text,role));frames.extend(silence(settings['afterIntroSeconds'] if i==0 else settings['betweenTurnsSeconds']));turns.append({'actor':role,'role':role,'text':text})
   for response in siblings:
    question_start_ms=round(len(frames)/48)
    if org.get('readQuestionAfterDialogue',False):
     question=response['prompt']
     if len(siblings)>1:question=str(response['number'])+'番。'+question
     frames.extend(synth(question,'adultFemale'));turns.append({'actor':'question-'+str(response['number']),'role':'adultFemale','text':question})
    if org.get('readChoices',False):
     answer_role=response.get('optionVoiceRole','adultMale')
     for opt in response['options']:
      frames.extend(synth(opt['id']+'。','adultFemale'));frames.extend(silence(.3));frames.extend(synth(opt['text'],answer_role));frames.extend(silence(.8));turns.append({'actor':'option-'+opt['id'],'role':answer_role,'text':opt['text']})
    answer_start_ms=round(len(frames)/48);frames.extend(silence(settings['answerPauseSecondsByProblem'][str(group)]))
    response_windows.append({'questionId':response['id'],'questionStartOffsetMs':question_start_ms,'answerStartOffsetMs':answer_start_ms,'answerEndOffsetMs':round(len(frames)/48)})
   mp=save('problem-'+key,frames);begin=round(len(album)/48);album.extend(frames);end=round(len(album)/48)
   for response in siblings:
    segments.append({'questionId':response['id'],'group':group,'number':response['number'],'path':str(mp.relative_to(root)),'startMs':begin,'endMs':end,'durationMs':round(len(frames)/48),'sha256':hashlib.sha256(mp.read_bytes()).hexdigest(),'playbackReviewed':False,'turns':turns,'sharedDialogueId':shared,'responseWindows':response_windows})
   print(f'{len(segments)}/{sum(x["section"]=="listening" for x in exam["questions"])} problem {key}, {len(siblings)} scored responses',flush=True)
   if len(segments)%6==0 and len(segments)<sum(x['section']=='listening' for x in exam['questions']):stop();start()
  if group==2:
   before=round(len(album)/48);album.extend(synth('問題二はここまでです。これから一分間休みます。','adultFemale'))
   music_start=round(len(album)/48);music=original_rest_music();music_file=save('original-instrumental-rest-60s',music);album.extend(music);music_end=round(len(album)/48)
   assert music_end-music_start==60000
   album.extend(synth('休み時間は終わりです。問題三を始めます。','adultFemale'));resume_end=round(len(album)/48)
   break_manifest={'afterProblem':2,'beforeProblem':3,'announcementStartMs':before,'musicStartMs':music_start,'musicEndMs':music_end,'musicDurationMs':60000,'resumeAnnouncementEndMs':resume_end,'musicPcmFrames':1440000,'path':str(music_file.relative_to(root)),'sha256':hashlib.sha256(music_file.read_bytes()).hexdigest(),'source':'Original procedural score in this generation script; no external recording or melody input.','publisherReviewed':False}
 closing_start=round(len(album)/48);narration(organization['closingJa']);orientation_segments.append({'role':'closing','startMs':closing_start,'endMs':round(len(album)/48)})
 assert master.read_bytes()==master_bytes, 'Master changed during synthesis; regenerate from the new snapshot.'
 assert organization_path.read_bytes()==organization_bytes, 'Organization changed during synthesis; regenerate from the new snapshot.'
 mp=save(f'{level}-original-{exam_number}-listening-draft',album)
 manifest={'examId':exam['examId'],'status':'generated_ai_unreviewed','masterSha256':hashlib.sha256(master_bytes).hexdigest(),'voiceCastingSha256':hashlib.sha256((root/'src/data/jlpt-original/voice-casting.json').read_bytes()).hexdigest(),'continuousAudioPath':str(mp.relative_to(root)),'continuousSha256':hashlib.sha256(mp.read_bytes()).hexdigest(),'durationMs':round(len(album)/48),'targetDurationMs':3000000,'matchesThirtyMinuteTarget':False,'durationMeasuredFromPcm':True,'continuousBitrateKbps':args.continuous_bitrate_kbps,'publisherReviewed':False,'nativeReviewCompleted':False,'perceptualApproval':False,'rightsReleaseReviewCompleted':False,'break':break_manifest,'organizationSha256':hashlib.sha256(organization_bytes).hexdigest(),'orientationSegments':orientation_segments,'examplesCount':len(organization['groups']),'instructions':plan,'settings':settings,'credits':[v['credit'] for v in roles.values()],'items':segments}
 (root/f'src/data/jlpt-original/{level}/{exam_number}/audio.manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'count':len(segments),'durationSeconds':len(album)/48000,'complete':True}),flush=True)
finally:stop();log.close()
