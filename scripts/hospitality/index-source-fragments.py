"""Independent, reproducible source-layout inventory, NOT accepted knowledge.

No OCR/body text or source artwork is redistributed. Every native text block,
including small print/ruby, is retained by page, bbox and digest. Small text is
flagged for visual inspection, never silently discarded. The canonical ledger
receives this authoring input through build.cjs.
"""
from pathlib import Path
import argparse,json,hashlib,collections
import fitz
ROOT=Path(__file__).resolve().parents[2];DOC=ROOT/'docs/ssw-workspace/hospitality'
parser=argparse.ArgumentParser();parser.add_argument('sources',type=Path);args=parser.parse_args()
pagespec=json.loads((DOC/'page-audit.json').read_text())['pages']
inventory=json.loads((DOC/'source-inventory.json').read_text())['sources']
result={'schemaVersion':1,'status':'structural_inventory_not_semantic_acceptance','date':'2026-11-01','allKnowledgeAccepted':False,'textIsRedistributed':False,'pages':[]}
previous=DOC/'source-fragments-authoring.json'
old={b['id']:b for p in json.loads(previous.read_text())['pages'] for b in p['blocks']} if previous.exists() else {}
for n in [1,2]:
 source=f'hotel-{n}';file=args.sources/f'khach_san_{n}_jp.pdf';raw=file.read_bytes()
 sha=hashlib.sha256(raw).hexdigest();expected=next(s for s in inventory if s['sourceId']==source)
 assert sha==expected['sha256'];doc=fitz.open(file);assert len(doc)==expected['pdfPages']
 occurrences=collections.Counter()
 blocks_by_page=[]
 for page in doc:
  blocks=[]
  for b in page.get_text('dict')['blocks']:
   if b.get('type')!=0:continue
   lines=[''.join(s['text'] for s in l['spans']) for l in b.get('lines',[])]
   text='\n'.join(lines)
   if not text.strip():continue
   digest=hashlib.sha256(text.encode()).hexdigest();occurrences[digest]+=1
   sizes=[s['size'] for l in b['lines'] for s in l['spans'] if s['text'].strip()]
   blocks.append({'id':f'HSF{n}-{page.number+1:03d}-{len(blocks)+1:03d}','bbox':[round(v,2) for v in b['bbox']],'sha256':digest,'characterCount':len(text),'minFont':round(min(sizes),2),'maxFont':round(max(sizes),2)})
  blocks_by_page.append(blocks)
 for i,(page,blocks) in enumerate(zip(doc,blocks_by_page)):
  spec=next(p for p in pagespec if p['sourceId']==source and p['pdfPage']==i+1)
  for b in blocks:
   prior=old.get(b['id'])
   if prior and prior['sha256']==b['sha256'] and prior['bbox']==b['bbox'] and prior.get('boundAtomIds'):
    b['boundAtomIds']=prior['boundAtomIds']
   b['repeatedBlockOccurrences']=occurrences[b['sha256']]
   b['disposition']='needs_source_meaning_review' if spec['knowledgeScopeIncluded'] else 'page_excluded_with_recorded_reason'
  result['pages'].append({'sourceId':source,'pdfPage':i+1,'sourceSha256':sha,'knowledgeScopeIncluded':spec['knowledgeScopeIncluded'],'pageExclusionReason':spec.get('exclusionReason'),'pageType':spec['pageType'],'blocks':blocks,'embeddedRasterCount':len(page.get_images()),'vectorDrawingCount':len(page.get_drawings()),'figureMeaningReview':'not_inferred_from_text_blocks','allPageIdeasAccepted':False})
result['summary']={'pdfPages':len(result['pages']),'nativeTextBlocks':sum(len(p['blocks']) for p in result['pages']),'instructionalPageTextBlocks':sum(len(p['blocks']) for p in result['pages'] if p['knowledgeScopeIncluded']),'semanticKnowledgeUnitCount':None,'reason':'Layout blocks are source accounting units, not independently accepted knowledge atoms.'}
(DOC/'source-fragments-authoring.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
print(json.dumps(result['summary']))
