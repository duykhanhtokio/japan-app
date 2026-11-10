"""Validate the exact source-review scope and evidence anchors, not editorial judgment."""
from pathlib import Path
import hashlib,json,collections
ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'docs/ssw-workspace/restaurant'
DATA=ROOT/'src/data/restaurant'
ledger=json.loads((WORK/'knowledge-ledger.json').read_text())
units={u['id']:u for u in ledger['units']}
documents={d['id']:d for d in json.loads((WORK/'source-inventory.json').read_text())['documents']}
lessons={l['id']:l for p in DATA.glob('lessons.*.ja.json') for l in json.loads(p.read_text())['lessons']}
scope=json.loads((WORK/'completion25-review-scope.json').read_text())
groups=scope['groups']
seen=set();counts={};errors=[]
for group,ids in groups.items():
 expected=set(ids)
 if not expected.issubset(units):errors.append(group+': scope references absent ledger units')
 path=WORK/f'completion25-source-{group}.json'
 report=json.loads(path.read_text());records=report['units'];actual=[r['unitId'] for r in records]
 if len(actual)!=len(set(actual)) or set(actual)!=expected:errors.append(f'{group}: missing/duplicate/out-of-scope unit IDs')
 decisions=collections.Counter()
 for r in records:
  id=r['unitId'];seen.add(id);decisions[r['decision']]+=1
  if r['decision'] not in ('covered','partial') or not r.get('reason'):errors.append(id+': missing decision/reason')
  if not r.get('sourcePagesInspected'):errors.append(id+': no inspected source pages')
  for ref in r.get('sourcePagesInspected',[]):
   doc=documents.get(ref.get('documentId'));pages=ref.get('pdfPages',[])
   if not doc or not pages or any(type(p)!=int or not 1<=p<=doc['pdfPages'] for p in pages):errors.append(id+': invalid source page anchor')
  evidence=r.get('lessonEvidence',[])
  for e in evidence:
   l=lessons.get(e.get('lessonId'));p=next((p for p in l.get('paragraphs',[]) if p['id']==e.get('paragraphId')),None) if l else None
   if not p or hashlib.sha256(p['textJa'].encode()).hexdigest()!=e.get('sha256'):errors.append(id+': stale/missing lesson paragraph evidence')
  if r['decision']=='covered' and (not evidence or r.get('factGaps') or r.get('imageGaps')):errors.append(id+': covered decision has missing evidence or open gaps')
  if r['decision']=='partial' and not (r.get('factGaps') or r.get('imageGaps')):errors.append(id+': partial decision needs an explicit remaining gap')
 counts[group]={'units':len(records),'decisions':dict(decisions)}
if len(seen)!=565:errors.append(f'Expected565 exact source units; got {len(seen)}')
result={'status':'SOURCE_REVIEW_ANCHORS_PASS' if not errors else 'SOURCE_REVIEW_ANCHORS_FAIL','reviewedUnitCount':len(seen),'groups':counts,'errors':errors,'scope':'Checks unit scope/page ranges/paragraph hashes and explicit open gaps. Does not certify judgment, source currency, pronunciation or human/domain review.','humanReviewed':False,'nativeReviewed':False,'domainReviewed':False}
(WORK/'completion25-source-comparison-qa.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False));raise SystemExit(bool(errors))
