"""Evidence inventory of real scheduled content; no word-count duration claims.

Optional --sources DIRECTORY binds each of the 117 PDF pages to its current
bytes. Source text and source images are never copied into the app/repository.
"""
from pathlib import Path
import json,hashlib,statistics,argparse,collections,subprocess
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/hospitality';DOC=ROOT/'docs/ssw-workspace/hospitality'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
parser=argparse.ArgumentParser();parser.add_argument('--sources',type=Path);args=parser.parse_args()
lessons=[l for g in ['front','planning','service','restaurant','safety'] for l in read(DATA/(g+'.json'))['lessons']]
images={i['lessonId']:i for i in read(DOC/'image-manifest.json')['images']}
atoms=read(DOC/'knowledge-ledger.json')['sourceAtoms'];oldpages=read(DOC/'page-audit.json')['pages']
levels={level:[l for l in lessons if l['level']==1 or level==2] for level in [1,2]}
medians={level:statistics.median(sum(len(s['body']) for s in l['sections']) for l in ls) for level,ls in levels.items()}
days=[]
for l in lessons:
 image=images[l['id']];file=ROOT/image['path'];assert sha(file)==image['sha256']
 assert image['caption']==l['illustration']['caption'] and image['alt']==l['illustration']['alt']
 bodies=[s['body'] for s in l['sections']];body=sum(map(len,bodies));assert len(bodies)==len(set(bodies)),l['id']
 assert all(o['text'].strip() for o in l['objectives']) and l['example']['steps'] and l['practice']['expectedPoints']
 relevant=[a['atomId'] for a in atoms if a['after']['evidence']['lessonId']==l['id']]
 tracks={str(level):{'bodyMedian':medians[level],'belowHalfMedian':body<medians[level]/2,'aboveDoubleMedian':body>medians[level]*2} for level,ls in levels.items() if l in ls}
 days.append({'lessonId':l['id'],'sourceRevision':l['revision'],'bodyCharacters':body,'sections':len(bodies),'objectives':len(l['objectives']),'terms':len(l['terms']),'exampleSteps':len(l['example']['steps']),'applicationExpectedPoints':len(l['practice']['expectedPoints']),'questions':len(l['questions']),'sourceAtomIds':relevant,'trackScreening':tracks,'illustration':{'id':image['imageId'],'sha256':image['sha256'],'realBytes':True,'captionAndAltMatch':True,'aiContactSheetReviewedThisSession':True,'domainReviewed':False,'responsiveReadingCheck':'see browser QA; no physical device claim'},'estimatedMinutes':l['estimatedMinutes'],'durationMeasured':False,'workloadAcceptance':'design_review_candidate_not_measured'})
sourcepages=[]
if args.sources:
 import fitz
 for n in [1,2]:
  file=args.sources/f'khach_san_{n}_jp.pdf';doc=fitz.open(file);sourceid=f'hotel-{n}'
  inv=next(s for s in read(DOC/'source-inventory.json')['sources'] if s['sourceId']==sourceid)
  assert sha(file)==inv['sha256'] and len(doc)==inv['pdfPages']
  for i,page in enumerate(doc):
   audit=next(p for p in oldpages if p['sourceId']==sourceid and p['pdfPage']==i+1)
   references=[a['atomId'] for a in atoms if any(r['sourceId']==sourceid and r['pdfPage']==i+1 for r in a['sourceRefs'])]
   text=page.get_text();assert text.strip(),(n,i+1)
   sourcepages.append({'sourceId':sourceid,'pdfPage':i+1,'sourceSha256':inv['sha256'],'extractedTextSha256':hashlib.sha256(text.encode()).hexdigest(),'pageType':audit['pageType'],'knowledgeScopeIncluded':audit['knowledgeScopeIncluded'],'exclusionReason':audit.get('exclusionReason'),'sourceAtomIds':references,'currentExtractionVerified':True,'historicalVisualReview':{'date':'2026-10-31','evidence':audit.get('visualEvidence')},'allPageIdeasAccepted':False})
 assert len(sourcepages)==117
write(DOC/'editorial-review-20261101.json',{'schemaVersion':1,'date':'2026-11-01','timezone':'Asia/Tokyo','baseCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'scope':'Current PDF identity/page extraction and actual reader-day metrics; source-atom evidence remains AI candidate. Does not certify exhaustive source decomposition or professional semantics.','sourcePages':sourcepages,'days':days,'summary':{'sourcePages':len(sourcepages),'instructionalPages':sum(p['knowledgeScopeIncluded'] for p in sourcepages),'sourceAtoms':len(atoms),'lessons':len(lessons),'questions':sum(len(l['questions']) for l in lessons),'bodyCharacters':sum(d['bodyCharacters'] for d in days),'bodyMin':min(d['bodyCharacters'] for d in days),'bodyMedian':statistics.median(d['bodyCharacters'] for d in days),'bodyMax':max(d['bodyCharacters'] for d in days),'actualImages':len(images),'allSourceIdeasAccepted':False,'durationMeasured':False,'nativeReviewed':False,'domainReviewed':False}})
print(json.dumps({'status':'PASS','pages':len(sourcepages),'days':len(days),'images':len(images),'exhaustiveAcceptance':False}))
