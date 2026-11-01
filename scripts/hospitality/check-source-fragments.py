"""Verify complete structural accounting, never infer semantic acceptance."""
from pathlib import Path
import argparse,json,hashlib
import fitz
ROOT=Path(__file__).resolve().parents[2];DOC=ROOT/'docs/ssw-workspace/hospitality'
parser=argparse.ArgumentParser();parser.add_argument('sources',type=Path);args=parser.parse_args()
source=json.loads((DOC/'source-fragments-authoring.json').read_text());ledger=json.loads((DOC/'knowledge-ledger.json').read_text())
assert ledger['schemaVersion']==3 and ledger['sourceFragments']==source
assert len(source['pages'])==117 and source['allKnowledgeAccepted'] is False
ids={};count=0
for n in [1,2]:
 file=args.sources/f'khach_san_{n}_jp.pdf';doc=fitz.open(file);digest=hashlib.sha256(file.read_bytes()).hexdigest()
 for page in doc:
  p=next(p for p in source['pages'] if p['sourceId']==f'hotel-{n}' and p['pdfPage']==page.number+1)
  assert p['sourceSha256']==digest and p['allPageIdeasAccepted'] is False
  blocks=[]
  for b in page.get_text('dict')['blocks']:
   if b.get('type')!=0:continue
   text='\n'.join(''.join(s['text'] for s in l['spans']) for l in b.get('lines',[]))
   if text.strip():blocks.append((b,text))
  assert len(blocks)==len(p['blocks']),(n,page.number,'omitted/extra native block')
  for (b,text),record in zip(blocks,p['blocks']):
   assert hashlib.sha256(text.encode()).hexdigest()==record['sha256']
   assert [round(v,2) for v in b['bbox']]==record['bbox']
   assert record['id'] not in ids;ids[record['id']]=record;count+=1
  assert len(page.get_images())==p['embeddedRasterCount'] and len(page.get_drawings())==p['vectorDrawingCount']
bound=0
for atom in ledger['sourceAtoms']:
 for ref in atom['sourceRefs']:
  for anchor in ref.get('sourceBlockAnchors',[]):
   block=ids[anchor['fragmentId']]
   assert atom['atomId'] in block['boundAtomIds'] and block['sha256']==anchor['blockSha256'] and block['bbox']==anchor['bbox']
   bound+=1
print(json.dumps({'status':'PASS','pdfPages':117,'nativeTextBlocksAccounted':count,'sourceBlockAtomBindings':bound,'allSourceKnowledgeAccepted':False,'smallTextSilentlyExcluded':False}))
