"""Bounded source-to-app acceptance for the separately authored route question."""
import sys,json,gzip,hashlib
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[2]
LP='docs/ssw-workspace/source-coverage-v2/hospitality.json'
RP='docs/ssw-workspace/hospitality/front-evacuation-v10-source-review.json'
read=lambda p:json.loads((ROOT/p).read_text())
digest=lambda b:hashlib.sha256(b).hexdigest()
ledger=read(LP);u=next(u for u in ledger['knowledgeUnits'] if u['knowledgeId']=='HF1-012-03')
assert u['status']=='candidate'
before=json.loads(json.dumps(u));checks=[]
for source,pdf,pn in zip(ledger['sources'],sys.argv[1:3],[12,17]):
 sid=source['sourceId'];assert digest(Path(pdf).read_bytes())==source['sha256']
 doc=fitz.open(pdf);assert len(doc)==source['pdfPages']
 path=f'docs/ssw-workspace/source-coverage-v2/hospitality-{sid}-elements.json.gz'
 art=json.loads(gzip.decompress((ROOT/path).read_bytes()));page=next(p for p in art['pages'] if p['pdfPage']==pn)
 ref=next(r for r in u['sourceRefs'] if r['sourceId']==sid and r['pdfPage']==pn)
 for n in [3,4]:
  eid=f'{sid}-p{pn:03d}-text-{n:03d}';e=next(e for e in page['elements'] if e['elementId']==eid)
  b=doc[pn-1].get_text('dict')['blocks'][n];text='\n'.join(''.join(s['text'] for s in line['spans']) for line in b['lines'])
  assert digest(text.encode())==e['sha256'];assert max(abs(a-b) for a,b in zip(e['bbox'],b['bbox']))<.002
  e.update(classification='knowledge',knowledgeIds=list(dict.fromkeys(e['knowledgeIds']+[u['knowledgeId']])),reason='Emergency-exit and evacuation-route guidance self-checked together, with focused question assessing both.',semanticReviewRef=RP)
  ref['elementIds']=list(dict.fromkeys(ref['elementIds']+[eid]));checks.append({'sourceId':sid,'pdfPage':pn,'elementId':eid,'sha256':e['sha256'],'bboxVerified':True})
 (ROOT/path).write_bytes(gzip.compress((json.dumps(art,ensure_ascii=False,indent=2)+'\n').encode(),mtime=0))
 sha=digest((ROOT/path).read_bytes())
 for p in ledger['pages']:
  if p['sourceId']==sid:p['regionCensus']['sha256']=sha
note='Source1 p12 and source2 p17 name both emergency exits and evacuation routes. Existing q02 omitted the route in its correct option. Additive q09 now explicitly selects both the exit location and the route from the room to that exit, with explanation requiring the property-confirmed route. No claim of physical evacuation competence or universal route is made.'
for e in u['teachingEvidence']:
 value=read(e['path'])
 for k in e['jsonPointer'].strip('/').split('/'):value=value[int(k)] if isinstance(value,list) else value[k]
 assert digest(json.dumps(value,ensure_ascii=False,separators=(',',':')).encode())==e['sha256']
 e.update(relation='direct',semanticReviewed=True,reviewNote=note)
new=next(e for e in u['assessmentEvidence'] if e['jsonPointer']=='/lessons/2/questions/8')
q=read(new['path'])['lessons'][2]['questions'][8]
assert digest(json.dumps(q,ensure_ascii=False,separators=(',',':')).encode())==new['sha256']
assert q['id']=='hotel-front-03-q09';assert q['answerIndex']==0
new.update(relation='direct',semanticReviewed=True,reviewNote=note)
u.update(status='covered_ai',after={'teaching':'present','assessment':'present'},unresolved=[],sourceReview={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':RP},expressionReview={'status':'independent_ai_checked','note':'Original focused question and distractors about a guest-room evacuation explanation; no source paragraph or source diagram reproduced. '+note})
receipt={'schemaVersion':1,'date':'2026-11-03','knowledgeId':u['knowledgeId'],'before':before,'afterStatus':u['status'],'sourceRefs':u['sourceRefs'],'sourceElementChecks':checks,'sourcePagesTextAndImagesRead':[{'sourceId':'hotel-1','pdfPage':12},{'sourceId':'hotel-2','pdfPage':17}],'reviewNote':note,'teachingEvidence':u['teachingEvidence'],'assessmentEvidence':new,'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False,'audioAuditioned':False},'coveredAi':sum(u['status']=='covered_ai' for u in ledger['knowledgeUnits']),'knownUnits':len(ledger['knowledgeUnits']),'sourceCoveragePercent':None,'wholeSourceKnowledgeCovered':False,'sourceProseOrImagesPublished':False}
(ROOT/LP).write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n');(ROOT/RP).write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'EVACUATION_SOURCE_SELF_CHECKED','coveredAi':receipt['coveredAi'],'openKnownUnits':receipt['knownUnits']-receipt['coveredAi']}))
