"""Asset/lesson/translation integrity. Does not certify native/domain or devices."""
from pathlib import Path
import hashlib,json
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/food-manufacturing';AUDIT=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
read=lambda p:json.loads(p.read_text());packs=[read(DATA/'lessons.1.ja.json'),read(DATA/'lessons.2.ja.json')]+[read(p) for p in sorted((DATA/'authoring-20261029').glob('part*.json'))];lessons={l['id']:l for p in packs for l in p['lessons']};figures=read(AUDIT/'figures34.json')['figures'];registry=(DATA/'source-practice34.ts').read_text();assert len(figures)==9
for f in figures:
 l=lessons[f['lessonId']];assert f['lessonSourceHash']==l['sourceHash'];p=next(p for p in l['paragraphs'] if p['id']==f['paragraphId']);assert f['captionJa']==p['titleJa'] and f['altJa']==p['textJa'];asset=ROOT/f['assetFile'];assert hashlib.sha256(asset.read_bytes()).hexdigest()==f['sha256']
 with Image.open(asset) as im:assert im.size==(f['width'],f['height']);im.verify()
 assert (ROOT/f['svgFile']).exists() and f['assetFile'] in registry and f['lessonSourceHash'] in registry
 for locale in ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']:
  tr=read(DATA/'translations'/(locale+'.json'))
  for pack in packs[2:]:tr.update(pack['translations'].get(locale,{}))
  t=tr[l['id']];assert t['sourceHash']==l['sourceHash'];assert t['paragraphTitles'][p['id']].strip() and t['paragraphs'][p['id']].strip()
 assert not f['humanReviewed'] and not f['domainReviewed'] and not f['nativeReviewed']
report={'status':'PASS','decodedOriginalSchematicFigures':len(figures),'exactLessonParagraphHashBindings':len(figures),'captionAndBodyLocaleBindings':len(figures)*12,'webpBytes':sum((ROOT/f['assetFile']).stat().st_size for f in figures),'svgSources':len(figures),'imageRasterLabelsTranslated':False,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False,'browserTestedByThisValidator':False}
(AUDIT/'visual34-validation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
