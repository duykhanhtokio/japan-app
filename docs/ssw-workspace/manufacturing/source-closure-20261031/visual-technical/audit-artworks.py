"""Registered manufacturing artwork audit; no source/runtime mutation or certification."""
from pathlib import Path
import json,hashlib,re,csv,xml.etree.ElementTree as ET
from collections import Counter
from PIL import Image
ROOT=Path(__file__).resolve().parents[5]
OUT=Path(__file__).resolve().parent
read=lambda p:json.loads((ROOT/p).read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
lessons={}
for s in ['mechanical','electrical','surface']:
 for p in [f'src/data/manufacturing/{s}.json',f'src/data/manufacturing/completion37/{s}.json']:
  for l in read(p)['lessons']:lessons[l['id']]=l
for l in read('src/data/manufacturing/source-guides.json')['guides']:lessons[l['id']]=l
sources={x['sourceId']:x for x in read('docs/ssw-workspace/manufacturing/batch33-full-review/source-manifest.json')['sources']}
entries={};findings=[]
def register(path,record):entries.setdefault(path,[]).append(record)
for a in read('docs/ssw-workspace/manufacturing/illustration-register.json')['assets']:
 register('assets/manufacturing/diagrams/'+a['png'],{'family':'legacy','id':a['id'],'lessonIds':a['lessonIds'],'width':a['dimensions']['width'],'height':a['dimensions']['height'],'expectedSha256':None,'role':'teaching','sourceSpecialty':a.get('sourceSpecialty'),'declaredSourcePhysicalPages':a.get('sourcePdfPages',[a.get('sourcePdfPage')]),'sourcePdfSha256':a.get('sourcePdfSha256')})
for family,file in [('supplemental36','supplemental-diagrams.json'),('completion37','completion37/diagrams.json')]:
 for a in read('src/data/manufacturing/'+file)['items']:
  l=lessons.get(a['lessonId']);assert l and l['sourceHash']==a['lessonSourceHash'],a['id']
  register('assets/manufacturing/diagrams/'+a['assetFile'],{'family':family,'id':a['id'],'lessonIds':[a['lessonId']],'lessonSourceHashes':{a['lessonId']:a['lessonSourceHash']},'width':a['width'],'height':a['height'],'expectedSha256':None,'role':'teaching','scopeLimits':a['scopeLimits']})
packCount=0;questions=0
for file in ['mechanical','measurement','materials','processes','finishing']:
 for p in read('src/data/manufacturing/recognition38/core/'+file+'.json')['packs']:
  packCount+=1;questions+=len(p['questions'])
  for a in p['assets']:
   qs=[q for q in p['questions'] if a['id'] in q['imageAssetIds']]
   register(a['file'],{'family':'recognition38','id':a['id'],'packId':p['id'],'lessonIds':p['lessonIds'],'lessonSourceHashes':p['lessonSourceHashes'],'width':a['width'],'height':a['height'],'expectedSha256':a['sha256'],'role':a.get('role','shared_observation'),'questionIds':[q['id'] for q in qs],'sourceRefs':list({(r['documentId'],r['pdfPage']):r for q in qs for r in q['sources']}.values())})
reviews=json.loads((OUT/'scoped-visual-review.json').read_text())['items'] if (OUT/'scoped-visual-review.json').exists() else []
assets=[]
for path,regs in sorted(entries.items()):
 p=ROOT/path;raw=p.read_bytes();pointer=raw.startswith(b'version https://git-lfs.github.com/spec/');expected={r['expectedSha256']for r in regs if r['expectedSha256']};assert len(expected)<=1
 oid=re.search(rb'oid sha256:([0-9a-f]{64})',raw).group(1).decode() if pointer else None
 if pointer:
  assert not expected or oid in expected,path
  png='lfs_pointer_not_image';dims=None
 else:
  assert raw[:8]==b'\x89PNG\r\n\x1a\n',path
  with Image.open(p)as image:dims=list(image.size);image.verify()
  assert all(dims==[r['width'],r['height']]for r in regs),path
  assert not expected or sha(raw)in expected,path
  png='actual_png_bytes_verified'
 svg=p.with_suffix('.svg');assert svg.exists();xml=ET.fromstring(svg.read_bytes());width=float(xml.attrib['width'].replace('px',''));height=float(xml.attrib['height'].replace('px',''));assert all(abs(width-r['width'])<.01 and abs(height-r['height'])<.01 for r in regs)
 text=svg.read_text();fonts=[float(x) for x in re.findall(r'font-size\s*(?:=\s*[\"\']|:\s*)([\d.]+)',text)]
 lessonIds=sorted({i for r in regs for i in r['lessonIds']});boundSources=[]
 for id in lessonIds:
  assert id in lessons,id
  for ref in lessons[id].get('sources',[]):
   assert ref['documentId']in sources;assert 1<=ref['pdfPage']<=sources[ref['documentId']]['physicalPages']
   if ref not in boundSources:boundSources.append(ref)
 rec={'path':path,'svgPath':str(svg.relative_to(ROOT)),'registrations':regs,'registrationCount':len(regs),'lessonIds':lessonIds,'sourceRefsViaLessons':boundSources,'sourceBindingStatus':'declared_metadata_and_current_lesson_revision_checked_not_whole_source_semantic_certification','pngAvailability':png,'bytes':len(raw),'sha256':sha(raw),'lfsOid':oid,'expectedSha256':next(iter(expected),None),'pngDimensions':dims,'svgDimensions':[width,height],'svgSha256':sha(svg.read_bytes()),'fontSizeRangeSvgUnits':[min(fonts),max(fonts)]if fonts else None,'smallestFontEstimatedPxAt358ImageWidth':round(min(fonts)*358/width,2)if fonts else None,'smallestFontEstimatedPxAt960ZoomWidth':round(min(fonts)*960/width,2)if fonts else None,'phoneReadability':'requires_zoom_and_actual_phone_validation','scaleAndUnitReview':'svg_geometry_metadata_checked; detailed_readout_review_only_for_named_subset','actualDeviceSimilarityVerified':False,'humanExpertApproved':False,'physicalDeviceVerified':False}
 currentZoom=max(960,390) if any(r['family']=='legacy'for r in regs) else max(960,width,390)
 rec['currentComponentZoomWidthAtPhone358']=currentZoom
 rec['smallestFontEstimatedPxAtCurrentPhoneZoom']=round(min(fonts)*currentZoom/width,2)if fonts else None
 rec['zoomScope']='legacy DiagramFrame keeps existing960minimum; SupplementalFigure now retains source width'
 rec['scopedAiInspection']=[r for r in reviews if str(Path(r['path']).with_suffix('.png'))==path]
 rec['sourcePdfSemanticReviewPerformedThisLane']=False
 assets.append(rec)
 if pointer:findings.append({'severity':'blocked','assetPath':path,'type':'actual_png_bytes_unavailable','action':'Restore exact registered PNG bytes from verified original renderer or available LFS object; never use pointer as image.'})
actual=set(str(p.relative_to(ROOT))for p in (ROOT/'assets/manufacturing').rglob('*.png'))
orphan=sorted(actual-set(entries))
report={'schemaVersion':1,'date':'2026-10-31','status':'machine_integrity_and_scoped_ai_visual_review_not_release_certification','summary':{'registeredAssetOccurrences':sum(len(x)for x in entries.values()),'uniqueRegisteredPngAssets':len(assets),'uniqueLegacyPngs':sum(any(r['family']=='legacy'for r in a['registrations'])for a in assets),'uniqueSupplemental36Pngs':sum(any(r['family']=='supplemental36'for r in a['registrations'])for a in assets),'uniqueCompletion37Pngs':sum(any(r['family']=='completion37'for r in a['registrations'])for a in assets),'uniqueRecognition38Pngs':sum(any(r['family']=='recognition38'for r in a['registrations'])for a in assets),'actualPngBytesVerified':sum(a['pngAvailability']=='actual_png_bytes_verified'for a in assets),'lfsPointersNotImages':sum(a['pngAvailability']!='actual_png_bytes_verified'for a in assets),'sourceSvgAvailable':len(assets),'recognitionPacks':packCount,'imageBoundQuestions':questions,'unregisteredPngFiles':len(orphan)},'assets':assets,'unregisteredPngFiles':orphan,'findings':findings,'physicalDeviceVerified':False,'professionalExpertSignoff':False,'full574PageVisualObjectClosure':False}
(OUT/'artwork-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
with(OUT/'image-by-image-checklist.csv').open('w',newline='')as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['png','svg','families','registrationOccurrences','lessonIds','sourceRefs','actualPngAvailability','minSvgFont','estimatedMinAt358px','estimatedMinAt960px','currentPhoneZoomWidth','estimatedMinAtCurrentPhoneZoom','realDeviceComparison','phoneReadability','expertAcceptance'])
 for a in assets:w.writerow([a['path'],a['svgPath'],';'.join(sorted({r['family']for r in a['registrations']})),a['registrationCount'],';'.join(a['lessonIds']),';'.join(f"{r['documentId']}:{r['pdfPage']}"for r in a['sourceRefsViaLessons']),a['pngAvailability'],a['fontSizeRangeSvgUnits'][0]if a['fontSizeRangeSvgUnits']else'',a['smallestFontEstimatedPxAt358ImageWidth'],a['smallestFontEstimatedPxAt960ZoomWidth'],a['currentComponentZoomWidthAtPhone358'],a['smallestFontEstimatedPxAtCurrentPhoneZoom'],'UNVERIFIED','ZOOM_REQUIRED_DEVICE_PENDING','PENDING'])
print(json.dumps(report['summary']))
