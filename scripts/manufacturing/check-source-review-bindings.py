"""Check exact source snapshots against independent AI review evidence."""
from pathlib import Path
import json,hashlib,runpy
ROOT=Path(__file__).resolve().parents[2];STAGE=ROOT/'docs/ssw-workspace/manufacturing/batch12'
def read(p):return json.loads(p.read_text())
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def h(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
baseline=read(STAGE/'baseline-object-freeze.json')['objects']
for specialty,bindings in baseline.items():
 course=read(ROOT/f'src/data/manufacturing/{specialty}.json');current={l['id']:l for l in course['lessons']};current.update({q['id']:q for c in course['checks'] for q in c['questions']})
 for identifier,expected in bindings.items():assert identifier in current and h(current[identifier])==expected,'Baseline content drift: '+identifier
frozen=read(STAGE/'frozen-source-inputs.json')['sha256']
for relative,expected in frozen.items():assert digest(STAGE/relative)==expected,relative
pairs=[('mechanical/new-content.json','mechanical-locales/new-japanese-independent-review.json','sourcePayloadSha256AfterRepair'),('mechanical/gap-content.json','mechanical-locales/gap-japanese-independent-review.json','sourcePayloadSha256'),('electrical/new-content.json','electrical-locales/new-JA-independent-review-progress.json','payloadSha256'),('electrical/gap-content.json','electrical-locales/gap-independent-qa.json','payloadSha256'),('mechanical/mocks.json','mechanical/independent-mock-review.json','payloadSha256'),('electrical/mocks.json','electrical-locales/mocks-independent-qa.json','payloadSha256')]
for source,report,key in pairs:assert digest(STAGE/source)==read(STAGE/report)[key],source
objects={}
for name in ['new-content.json','leaf-gap-supplement.json']:
 d=read(STAGE/'surface'/name);objects.update({l['id']:l for l in d['lessons']});objects.update({q['id']:q for c in d['checks'] for q in c['questions']})
d=read(STAGE/'surface/mocks.json');objects.update({q['id']:q for e in d['exams'] for s in e['sections'].values() for q in s['questions']})
matched=set();mismatches=[]
def scan(x,report):
 if isinstance(x,dict):
  identifier=x.get('id') or x.get('lessonId') or x.get('questionId')
  if identifier in objects:
   original=objects[identifier];checks=[]
   if 'sourceHash' in x:checks.append(x['sourceHash']==original['sourceHash'])
   for key in ['reviewedQuestionObjectSha256','reviewedLessonObjectSha256']:
    if key in x:checks.append(x[key]==h(original))
   if checks:
    if all(checks):matched.add(identifier)
    else:mismatches.append({'report':str(report.relative_to(STAGE)),'id':identifier})
  for v in x.values():scan(v,report)
 elif isinstance(x,list):
  for v in x:scan(v,report)
for p in (STAGE/'surface-locales').glob('ja-independent-review-*.json'):scan(read(p),p)
missing=set(objects)-matched;assert not missing,sorted(missing)
guide_count=0
guide_freeze=STAGE/'source-guides/source-freeze.json'
if guide_freeze.exists():
 gf=read(guide_freeze);gp=ROOT/gf['path'];history=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-reference-guide-extension.py'));guide_bytes=history['historical_source_guides_bytes'](gp.read_bytes());assert hashlib.sha256(guide_bytes).hexdigest()==gf['sha256'],'Reference guide source freeze drift'
 for guide in json.loads(guide_bytes)['guides']:
  assert guide['sourceHash']==gf['objects'][guide['id']]==h({k:v for k,v in guide.items() if k!='sourceHash'}),guide['id']
  guide_count+=1
result={'status':'PASS','sourceReferenceGuidesBound':guide_count,'fileDigestBoundReviews':len(pairs),'surfaceReviewedObjects':len(matched),'supersededReviewRecords':mismatches,'missingCurrentReviewBindings':[],'scope':'Exact frozen source identities and independently reviewed snapshots, not a native/domain/full-knowledge certificate.'}
report_payload=(json.dumps(result,ensure_ascii=False,indent=2)+'\n').encode();report_path=STAGE/'source-review-bindings-qa.json'
if report_path.exists():assert report_path.read_bytes()==report_payload,'Historical source-review binding report drift'
else:report_path.write_bytes(report_payload)
print(json.dumps(result))
