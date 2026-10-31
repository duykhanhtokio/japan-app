from pathlib import Path
from PIL import Image
import collections,json,hashlib
ROOT=Path(__file__).resolve().parents[5];OUT=Path(__file__).resolve().parent
p=json.loads((OUT/'packet.json').read_text());facts={x['id']:x for x in p['facts']};adds={x['id']:x for x in p['additions']};questions={x['id']:x for x in p['questions']};figs={x['id']:x for x in p['figures']};units={u['unitId']:u for u in p['units']}
assert len(facts)==len(p['facts']) and len(adds)==len(p['additions']) and len(questions)==len(p['questions']) and len(figs)==len(p['figures'])
assert len(units)==67 and [x['pdfPage'] for x in p['pages']]==list(range(1,50))
for u in units.values():
 assert u['factIds'] and set(u['factIds'])<=set(facts)
 assert set(u.get('childUnitIds',[]))<=set(units)
for f in facts.values():
 assert f['unitIds'] and set(f['unitIds'])<=set(units)
 assert set(f['additionIds'])<=set(adds)
 assert set(f['questionIds'])<=set(questions)|{e['questionId'] for e in f['existingEvidence'] if e['kind']=='question'}
 for v in f['visualEvidence']:
  if v.get('figureId'):assert v['figureId'] in figs
for a in adds.values():assert a['textJa'].strip() and a['factIds'] and set(a['factIds'])<=set(facts)
for q in questions.values():
 assert len(q['optionsJa'])==len(set(q['optionsJa']))==len(q['optionReasonsJa'])==4 and q['correctIndex'] in range(4)
 assert q['factIds'] and set(q['factIds'])<=set(facts)
 for fid in q['figureIds']:
  f=figs[fid];assert f.get('neutralForQuestions') and not f.get('foodNameJa') and not f.get('teachingOnly')
  assert not any(name in f['captionJa']+f['altJa'] for name in ['ホタテ','なす','アスパラガス'])
for f in figs.values():
 image=ROOT/f['assetFile'];assert image.is_file();assert hashlib.sha256(image.read_bytes()).hexdigest()==f['sha256']
 im=Image.open(image);assert im.size==(f['width'],f['height'])
 assert set(f['factIds'])<=set(facts) and f['factIds']
 if 'cropBox' in f:
  c=f['cropBox'];assert c['width']>0 and c['height']>0 and c['x']+c['width']<=f['width'] and c['y']+c['height']<=f['height']
 assert f['humanReviewed'] is False and f['domainReviewed'] is False
for collection in ['facts','additions','questions','figures']:
 for x in p[collection]:
  for r in x['sourceRefs']:
   if r['documentId']=='rst-1-cooking':assert all(1<=pg<=49 for pg in r['pdfPages'])
paths={f['assetFile'] for f in figs.values()};pngbytes=sum((ROOT/path).stat().st_size for path in paths)
ja={'additions':p['additions'],'questions':p['questions'],'figureText':[{'id':f['id'],'captionJa':f['captionJa'],'altJa':f['altJa'],'scopeLimits':f['scopeLimits']} for f in p['figures']]}
r={'status':'PASS_SOURCE_LOCK_REFERENCES_QUESTION_CONTRACT_ASSET_BYTES','units':len(units),'pages':len(p['pages']),'facts':len(facts),'additions':len(adds),'questions':len(questions),'textQuestions':sum(not q['figureIds'] for q in questions.values()),'neutralImageQuestions':sum(bool(q['figureIds']) for q in questions.values()),'figureViews':len(figs),'distinctRasterFiles':len(paths),'actualRasterBytes':pngbytes,'sourceDecisionCounts':dict(collections.Counter(u['decision'] for u in units.values())),'packetSha256':hashlib.sha256((OUT/'packet.json').read_bytes()).hexdigest(),'japaneseFreezeSha256':hashlib.sha256(json.dumps(ja,ensure_ascii=False,sort_keys=True).encode()).hexdigest(),'sourcePdfInRepo':False,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceVerified':False,'residual':'One original-source locator inconsistency, explicitly retained; food recognition additions actually attempted and inspected.'}
(OUT/'validation.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps(r,ensure_ascii=False))
