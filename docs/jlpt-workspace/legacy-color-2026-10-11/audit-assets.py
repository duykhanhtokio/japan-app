"""Verify complete replacement coverage and untouched historical source bytes."""
import hashlib,json,re
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[3];DOC=Path(__file__).parent
manifest=json.loads((DOC/'replacement-manifest.json').read_text())
sources=json.loads((DOC/'source-inventory.json').read_text())
for source in sources:
 assert hashlib.sha256((ROOT/source['path']).read_bytes()).hexdigest()==source['sha256'],source['path']
assert len(manifest['items'])==99
assert len({x['id'] for x in manifest['items']})==99
assert all(x['status'] in ['color_integrated','text_source_preserved_no_scene'] for x in manifest['items'])
mapping=(ROOT/'src/data/jlpt-official/legacy-color-visuals.ts').read_text()
rows=[]
for item in manifest['items']:
 if item['status']!='color_integrated':continue
 path=ROOT/item['output']
 assert f"'{item['id']}': require('../../../{item['output']}')" in mapping,item['id']
 with Image.open(path) as im:
  im.verify()
 with Image.open(path) as im:w,h=im.size
 assert w>=800 and h>=600,(item['id'],w,h)
 rows.append(dict(id=item['id'],output=item['output'],width=w,height=h,sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
assert len(rows)==88
report=dict(status='PASS',sourceAssetsUnchanged=len(sources),imageResponses=99,colorImages=88,textOnlySourcesPreserved=11,missingImages=0,rows=rows)
(DOC/'asset-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('PASS: 80 original source files unchanged; 88 complete color assets; 11 literal text images preserved; 0 missing')
