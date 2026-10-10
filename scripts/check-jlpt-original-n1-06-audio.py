"""Validate actual N1 06 assets including a once-played integrated two-response dialogue."""
import hashlib,json,pathlib,subprocess,array
R=pathlib.Path(__file__).resolve().parent.parent;B=R/'src/data/jlpt-original/n1/06';m=json.loads((B/'master.ja.json').read_text());a=json.loads((B/'audio.manifest.json').read_text());org=json.loads((B/'listening-organization.ja.json').read_text());cast=json.loads((R/'src/data/jlpt-original/voice-casting.json').read_text());qs={q['id']:q for q in m['questions'] if q['section']=='listening'}
assert m['examId']=='jpapp-n1-original-06-v1', 'Audio validator must read this exam, not previous form'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def decode(p):
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','s16le','-ar','24000','-ac','1','pipe:1']);samples=array.array('h',raw);assert max(abs(v) for v in samples)>100;return len(raw)//2,raw
assert len(a['items'])==36 and {i['questionId'] for i in a['items']}==set(qs)
assert a['masterSha256']==sha(B/'master.ja.json') or a.get('currentMasterSha256')==sha(B/'master.ja.json')
assert a['voiceCastingSha256']==sha(R/'src/data/jlpt-original/voice-casting.json')
assert a['organizationSha256']==sha(B/'listening-organization.ja.json')
assert a['settings']['speedScale']==.9
for key in ['afterIntroSeconds','betweenTurnsSeconds','answerPauseSecondsByProblem']:assert a['settings'][key]==cast['levelPacing']['n1'][key]
for flag in ['publisherReviewed','nativeReviewCompleted','perceptualApproval','rightsReleaseReviewCompleted']:assert a[flag] is False
unique={};report=[]
for it in a['items']:
 q=qs[it['questionId']];p=R/it['path'];assert sha(p)==it['sha256'];assert it['playbackReviewed'] is False
 if it['path'] not in unique:
  frames,_=decode(p);assert abs(round(frames/24)-it['durationMs'])<=1;unique[it['path']]=frames
  prior=a['items'][a['items'].index(it)-1] if a['items'].index(it) else None
  if prior:assert it['startMs']>=prior['endMs']
 roles=[{'actor':r,'role':r,'text':t} for r,t in q['script']];assert it['turns'][:len(roles)]==roles
 g=next(g for g in org['groups'] if g['problem']==q['group']);opts=[t for t in it['turns'] if t['actor'].startswith('option-')]
 if g['readChoices']:assert [(t['actor'][7:],t['text']) for t in opts]==[(o['id'],o['text']) for o in q['options']]
 else:assert not opts
 windows=it['responseWindows'];w=next(w for w in windows if w['questionId']==q['id']);assert w['answerEndOffsetMs']-w['answerStartOffsetMs']==cast['levelPacing']['n1']['answerPauseSecondsByProblem'][str(q['group'])]*1000
 report.append({'id':q['id'],'path':it['path'],'durationMs':it['durationMs'],'answerWindowMs':w['answerEndOffsetMs']-w['answerStartOffsetMs']})
assert len(unique)==35
sharedIds={q['sharedDialogueId'] for q in qs.values() if q.get('sharedDialogueId')};assert len(sharedIds)==1;shared=[it for it in a['items'] if it['sharedDialogueId'] in sharedIds];assert len(shared)==2
for key in ['path','startMs','endMs','sha256','turns','responseWindows']:assert shared[0][key]==shared[1][key]
assert len(shared[0]['responseWindows'])==2
track=R/a['continuousAudioPath'];assert sha(track)==a['continuousSha256'];frames,raw=decode(track);duration=round(frames/24);assert abs(duration-a['durationMs'])<=1
br=a['break'];assert br['afterProblem']==2 and br['beforeProblem']==3 and br['musicDurationMs']==60000 and br['musicPcmFrames']==1440000
music=R/br['path'];assert sha(music)==br['sha256'];music_frames,_=decode(music);assert music_frames==1440000
assert br['musicEndMs']-br['musicStartMs']==60000
assert min(i['startMs'] for i in a['items'] if i['group']==3)>br['resumeAnnouncementEndMs']
assert next(o for o in a['orientationSegments'] if o.get('problem')==3)['startMs']>=br['resumeAnnouncementEndMs']
assert max(i['endMs'] for i in a['items'] if i['group']==2)<=br['announcementStartMs']
assert a['examplesCount']==5 and len([o for o in a['orientationSegments'] if o.get('exampleCount')==1])==5
out={'status':'PASS','scope':'Decoded files, scripts/roles/options/hashes/windows/shared dialogue/exact music. Not human listening or native certification.','examId':m['examId'],'responseUnits':36,'uniqueDialogueFiles':35,'sharedDialogueUnits':2,'decodedDurationMs':duration,'targetDurationMs':3300000,'durationDifferenceMs':duration-3300000,'pcmFrames':frames,'musicPcmFrames':music_frames,'musicMs':60000,'items':report,'publisherReviewed':False,'perceptualApproval':False,'rightsReleaseReviewCompleted':False}
(R/'docs/jlpt-workspace/original/n1-06/audio-validation.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in out.items() if k!='items'}))
