"""Metadata-only signal analysis authorized by publisher on 2026-10-06.
No ASR, text/script/answer extraction, audio playback, clip export or cloud upload.
Existing item boundaries are candidate metadata, NOT verified by this analysis.
"""
from pathlib import Path
import hashlib,json,re,statistics,subprocess
root=Path(__file__).resolve().parent.parent
source=root/'assets/jlpt/n5/2013-07/audio/n5-2013-07.mp3'
boundaries=root/'src/data/jlpt-official/n5-2013-07/listening.candidate.json'
out=root/'docs/jlpt-workspace/original/n5-01/reference-timing.metadata.json'
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,sample_rate,channels','-of','json',str(source)],text=True))
duration=round(float(probe['format']['duration'])*1000)
run=subprocess.run(['ffmpeg','-nostdin','-hide_banner','-i',str(source),'-af','silencedetect=noise=-35dB:d=0.25','-f','null','-'],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,text=True,check=True)
intervals=[];start=None
for line in run.stderr.splitlines():
 m=re.search(r'silence_start: ([\d.]+)',line)
 if m:start=round(float(m[1])*1000)
 m=re.search(r'silence_end: ([\d.]+)',line)
 if m and start is not None:intervals.append((start,min(duration,round(float(m[1])*1000))));start=None
if start is not None:intervals.append((start,duration))
raw=json.loads(boundaries.read_text())
# Whitelisted fields only. Other legacy fields never leave this isolated parser.
items=[{k:int(q[k]) for k in ('problemNumber','questionNumber','startMs','endMs')} for q in raw['segments']]
assert len(items)==24
assert all(0<=q['startMs']<q['endMs']<=duration for q in items)
def stats(a,b):
 spans=[(max(a,s),min(b,e)) for s,e in intervals if max(a,s)<min(b,e)]
 silent=sum(e-s for s,e in spans)
 return {'durationMs':b-a,'detectedSilenceMs':silent,'signalAboveThresholdMs':b-a-silent,'silenceIntervalsMs':[[s-a,e-a] for s,e in spans],'longestDetectedSilenceMs':max((e-s for s,e in spans),default=0),'trailingDetectedSilenceMs':next((e-s for s,e in reversed(spans) if e>=b-30),0)}
groups=[];unassigned=[];cursor=0
for g in range(1,5):
 qs=[q for q in items if q['problemNumber']==g];a=qs[0]['startMs'];b=qs[-1]['endMs']
 if a>cursor:unassigned.append({'beforeProblem':g,'startMs':cursor,'endMs':a,**stats(cursor,a),'semanticRole':'not_determined_from_signal'})
 rows=[dict(q,**stats(q['startMs'],q['endMs'])) for q in qs]
 lengths=[q['durationMs'] for q in rows]
 groups.append({'problem':g,'responses':len(rows),'startMs':a,'endMs':b,'durationMs':b-a,'medianItemDurationMs':round(statistics.median(lengths)),'minItemDurationMs':min(lengths),'maxItemDurationMs':max(lengths),'items':rows})
 cursor=b
if cursor<duration:unassigned.append({'afterProblem':4,'startMs':cursor,'endMs':duration,**stats(cursor,duration),'semanticRole':'not_determined_from_signal'})
report={'schemaVersion':1,'createdAt':'2026-10-06','publisherAuthorization':'Metadata-only timing analysis of N5 第3回; no content reuse. Confirmed in conversation 2026-10-06.','analysisMethod':'ffprobe duration and FFmpeg signal-threshold silence detection; no recognition/transcription/playback/export.','sourcePath':str(source.relative_to(root)),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'boundaryMetadataPath':str(boundaries.relative_to(root)),'boundaryMetadataSha256':hashlib.sha256(boundaries.read_bytes()).hexdigest(),'sourceDurationMs':duration,'silenceThresholdDb':-35,'minimumSilenceMs':250,'sourceItemsBoundaryStatus':'candidate_unverified','boundaryHumanReviewed':False,'semanticClassificationPerformed':False,'legacyContentIncluded':False,'legacyAudioExported':False,'cloudUploadPerformed':False,'groups':groups,'unassignedWindows':unassigned,'limitations':['Signal below threshold is not proof of an answer/preparation pause; signal above threshold is not proof of speech.','Candidate item boundaries can include transition/instruction material; their semantic accuracy is not established.','Instruction/example counts, spoken wording, speech speed in syllables and semantic roles cannot be established without semantic analysis; none is asserted.','This metadata may guide independent pacing design; it is not a per-item template or copyright license.']}
# Sensitivity checks: changing the signal threshold must not be mistaken for
# new information about spoken content or the purpose of a quiet interval.
sensitivity=[]
for threshold in (-40,-45):
 test=subprocess.run(['ffmpeg','-nostdin','-hide_banner','-i',str(source),'-af',f'silencedetect=noise={threshold}dB:d=0.25','-f','null','-'],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,text=True,check=True)
 ranges=[];begin=None
 for line in test.stderr.splitlines():
  found=re.search(r'silence_start: ([\d.]+)',line)
  if found:begin=round(float(found[1])*1000)
  found=re.search(r'silence_end: ([\d.]+)',line)
  if found and begin is not None:ranges.append((begin,min(duration,round(float(found[1])*1000))));begin=None
 if begin is not None:ranges.append((begin,duration))
 sensitivity.append({'thresholdDb':threshold,'detectedSilenceMs':sum(b-a for a,b in ranges),'intervalCount':len(ranges)})
report['thresholdSensitivity']=sensitivity
out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'sourceDurationMs':duration,'groupSummaries':[{k:v for k,v in g.items() if k!='items'} for g in groups],'unassignedWindowDurationsMs':[w['durationMs'] for w in unassigned],'exportedOnlyMetadata':True},ensure_ascii=False,indent=2))
