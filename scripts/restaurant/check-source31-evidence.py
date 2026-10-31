"""Verify preserved source bytes and explicit crosswalk links; no semantic or expert certification."""
from pathlib import Path
import json,hashlib,collections
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/restaurant/source-closure31'
read=lambda p:json.loads(p.read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
lock=read(D/'source-lock.json');cross=read(D/'unit-crosswalk.json');canonical=read(D/'canonical-ja.json')['items'];ledger={u['id']:u for u in read(D.parent/'knowledge-ledger.json')['units']}
pdfroot=Path('/workspace/scratch/8c34e3cace7a/restaurant-source31');extract=pdfroot.parent/'restaurant-source31-extracted'
pdfs={sha(p):p for p in pdfroot.glob('*.pdf')};pages=[]
for doc in lock['documents']:
 assert doc['pdfSha256'] in pdfs,doc['documentId']
 for page in doc['pages']:
  file=extract/doc['documentId']/f"p{page['pdfPage']:03}.txt";assert sha(file)==page['textSha256'],str(file);pages.append((doc['documentId'],page['pdfPage']))
assert len(lock['documents'])==7 and len(pages)==271 and len(set(pages))==271
assert set(cross['units'])==set(ledger) and len(ledger)==639
assert {(x['documentId'],x['pdfPage']) for x in cross['pages']}==set(pages)
for file,h in cross['inputSha256'].items():assert sha(R/file)==h,('packet changed since compilation',file)
lessons={l['id']:l for n in ['1','2'] for l in read(R/f'src/data/restaurant/lessons.{n}.ja.json')['lessons']}
questions={q['id']:q for n in ['1','2'] for e in read(R/f'src/data/restaurant/exams.{n}.ja.json')['exams'] for q in e['questions']}
paragraphs=0;existingquestions=0;unassessed=[]
for fid,fact in cross['facts'].items():
 assert set(fact['unitIds'])<=set(ledger),fid
 for ref in fact['sourceRefs']:
  if any(d['documentId']==ref['documentId'] for d in lock['documents']):assert all((ref['documentId'],p) in pages for p in ref['pdfPages']),fid
 for aid in fact.get('additionIds',[])+fact.get('crossShardAdditionIds',[]):assert aid in canonical,(fid,aid)
 for qid in fact.get('questionIds',[])+fact.get('crossShardQuestionIds',[]):assert qid in questions or qid in canonical,(fid,qid)
 for ev in fact.get('existingEvidence',[]):
  if ev.get('lessonId') and ev.get('paragraphId'):
   l=lessons[ev['lessonId']];p=next(p for p in l['paragraphs'] if p['id']==ev['paragraphId']);paragraphs+=1
   if ev.get('sha256'):assert hashlib.sha256(p['textJa'].encode()).hexdigest()==ev['sha256'],fid
  if ev.get('questionId'):assert ev['questionId'] in questions;existingquestions+=1
 if not fact.get('questionIds') and not fact.get('crossShardQuestionIds') and fact.get('decision')!='reference_excluded':unassessed.append(fid)
for uid,u in cross['units'].items():
 assert set(u.get('factIds',[]))<=set(cross['facts']),uid
 assert set(u.get('childUnitIds',[]))<=set(ledger),uid
report=dict(status='PASS',documents=7,pages=271,units=639,facts=len(cross['facts']),existingParagraphLinksChecked=paragraphs,existingQuestionLinksChecked=existingquestions,sourceBytesVerified=True,unitDecisions=dict(collections.Counter(u['decision'] for u in cross['units'].values())),factsWithoutDedicatedQuestionIds=unassessed,semanticReview='inherited_author_evidence_not_recertified',humanReviewed=False,nativeReviewed=False,domainReviewed=False)
(D/'evidence-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({**report,'factsWithoutDedicatedQuestionIds':len(unassessed)},ensure_ascii=False))
