"""Bounded round-two authoring guards, preserving the full pre-batch bank."""
from pathlib import Path
import json,re,subprocess,hashlib
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/restaurant/source-closure31';BASE='d38397e7569b136777ba2c219ab0df56d9c4eee1'
def read(p):return json.loads(p.read_text())
preserved=0;new=[];sections=[]
for level in ['1','2']:
 for name in ['lessons','exams']:
  rel=f'src/data/restaurant/{name}.{level}.ja.json';assert (R/rel).read_bytes()==subprocess.check_output(['git','show',BASE+':'+rel],cwd=R)
 rel=f'src/data/restaurant/source31/{level}.json';old=json.loads(subprocess.check_output(['git','show',BASE+':'+rel],cwd=R));now=read(R/rel);oq={q['id']:q for row in old['lessons'].values()for q in(row.get('exam')or{}).get('questions',[])};nq={q['id']:q for row in now['lessons'].values()for q in(row.get('exam')or{}).get('questions',[])};assert all(nq.get(id)==q for id,q in oq.items()),'Pre-batch question changed';preserved+=len(oq)
 for row in now['lessons'].values():new.extend(q for q in(row.get('exam')or{}).get('questions',[])if q['id'].startswith('rst31-v2-r2-'));sections.extend(s for s in row['sections']if s['id'].startswith('rst31-v2-r2-'))
fields=0
for q in new:
 for text,seq in[(q['stemJa'],q['furigana']['stem']),(q['explanationJa'],q['furigana']['explanation']),*zip(q['optionsJa'],q['furigana']['options']),*zip(q['optionReasonsJa'],q['reasonRuby'])]:
  assert ''.join(s['text']for s in seq)==text;assert not any(re.search('[一-龯]',s['text'])and not s.get('reading')for s in seq),(q['id'],seq);fields+=1
for s in sections:
 for key in ['title','text']:
  seq=s['furigana'][key];assert ''.join(z['text']for z in seq)==s[key+'Ja'];assert not any(re.search('[一-龯]',z['text'])and not z.get('reading')for z in seq),(s['id'],seq);fields+=1
assert preserved==260
persisted_counts={}
for revision in ['beb6a9de8c84350e6c22de13bceed24eb14bdf7f','840cced254aeff1d1aef1e6671953538b36c17d2','04186871758b3eaaabcf0537c0d3937250da2fbf']:
 count=0
 for level in ['1','2']:
  rel=f'src/data/restaurant/source31/{level}.json';old=json.loads(subprocess.check_output(['git','show',revision+':'+rel],cwd=R));now=read(R/rel);oq={q['id']:q for row in old['lessons'].values()for q in(row.get('exam')or{}).get('questions',[])};nq={q['id']:q for row in now['lessons'].values()for q in(row.get('exam')or{}).get('questions',[])};assert all(nq.get(id)==q for id,q in oq.items()),(revision,'Persisted batch question changed');count+=len(oq)
 persisted_counts[revision]=count
c=read(D/'canonical-ja.json')['items'];cross=read(D/'unit-crosswalk.json');legacygaps=[id for id,f in cross['facts'].items()if not id.startswith('rst-v2-')and not f.get('questionIds')and not f.get('crossShardQuestionIds')and f['decision']!='reference_excluded'];excluded=[id for id,f in cross['facts'].items()if f['decision']=='reference_excluded'];assert len(excluded)==21
for authoring in sorted((D/'integration').glob('source-v2-r2-*-authoring-20261102.json')):
 a=read(authoring)
 for q in a['questions']:
  compiled=c[q['id']];assert compiled['optionsJa'][compiled['correctIndex']]==q['optionsJa'][q['correctIndex']]
  for fid in q['factIds']:assert q['id']in cross['facts'][fid]['questionIds']
 for locale in ['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']:
  t=read(D/'translations'/locale/(authoring.name.replace('-authoring','')));assert len(t['items'])==len(a['questions'])+len(a.get('additions',[]))
  for id,v in t['items'].items():assert v['sourceHash']==c[id]['sourceHash']
report=dict(status='PASS',baselineCommit=BASE,preBatchQuestionsPreserved=preserved,persistedBatchQuestionCountsPreserved=persisted_counts,coreLessonsAndExamsPreserved=True,newQuestions=len(new),newSections=len(sections),newRubyFields=fields,unknownNewKanjiSegments=0,legacyAssessmentGaps=len(legacygaps),referenceExclusions=len(excluded),nativeReviewed=False,domainReviewed=False,physicalDeviceTested=False)
p=R/'docs/ssw-workspace/source-coverage-v2/restaurant-r2-delta-guard-20261102.json';p.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report))
