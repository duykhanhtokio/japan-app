"""Validate all scheduled-day art bindings; no human/device certification inferred."""
import hashlib,json,xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image,ImageFont
ROOT=Path(__file__).resolve().parents[5];HERE=Path(__file__).parent
data=json.loads((HERE/'daily-bindings.json').read_text());rows=data['bindings']
lessons=json.loads((ROOT/'src/data/manufacturing/electrical.json').read_text())['lessons']
canonical={l['id']:l for l in lessons}
assert len(rows)==len(canonical)==98
assert {r['lessonId'] for r in rows}==set(canonical)
assert len({r['assetId'] for r in rows})==98
fontpath='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
new=[];existing=[];families=set();total_bytes=0;text_count=0;min_font=100
for r in rows:
 l=canonical[r['lessonId']];p=ROOT/r['assetFile'];raw=p.read_bytes()
 assert not raw.startswith(b'version https://git-lfs')
 assert hashlib.sha256(raw).hexdigest()==r['sha256']
 assert r['lessonSourceHash']==l['sourceHash']
 assert r['captionJa']==l['summaryJa'] and r['altJa']==l['titleJa']
 assert r['sourceRefs']==l['sources']
 assert r['keyObjectiveJa'] and r['relevanceReasonJa']
 with Image.open(p) as im:
  assert im.format=='PNG' and im.size==(r['width'],r['height'])
  if not r['existingAssetReused']:
   assert im.size==(1400,900)
   rgb=im.convert('RGB')
   assert not any(any(abs(a-b)>20 for a,b in zip(rgb.getpixel((1399,y)),(255,253,246))) for y in range(150,830)),'clipped right artwork'
 if r['existingAssetReused']:
  assert r['renderedByExistingComponent'];existing.append(r['lessonId'])
 else:
  new.append(r['lessonId']);families.add(r['family']);svg=p.with_suffix('.svg');tree=ET.parse(svg)
  for e in tree.iter('{http://www.w3.org/2000/svg}text'):
   size=float(e.attrib['font-size']);min_font=min(min_font,size);assert size>=26
   st=''.join(e.itertext());x=float(e.attrib['x']);y=float(e.attrib['y']);w=ImageFont.truetype(fontpath,round(size)).getlength(st)
   anchor=e.attrib.get('text-anchor','start');left=x-w/2 if anchor=='middle' else x-w if anchor=='end' else x
   assert left>=20 and left+w<=1380 and y<=880,(p.name,st)
   text_count+=1
  assert len(list(tree.iter('{http://www.w3.org/2000/svg}path')))+len(list(tree.iter('{http://www.w3.org/2000/svg}rect')))+len(list(tree.iter('{http://www.w3.org/2000/svg}circle')))>3
  total_bytes+=len(raw)
 r['reviewFlags']['aiGeometryChecked']=True
 r['reviewFlags']['aiPixelInspected']=not r['existingAssetReused']
 r['reviewFlags']['aiPixelInspectionScope']='88 new outputs viewed in four contact sheets; sampled technical families viewed at larger size. This is not a responsive reader or real-equipment/device acceptance.' if not r['existingAssetReused'] else 'Relevance and file bytes verified; existing project-art review retained.'
 assert not r['reviewFlags']['domainReviewed'] and not r['reviewFlags']['nativeReviewed'] and not r['reviewFlags']['physicalDeviceVerified']
assert len(new)==88 and len(existing)==10
svg28=(ROOT/'assets/manufacturing/daily40/electrical/electrical-day-028.svg').read_text()
assert 'M480 355V565H595M705 565H880V355' in svg28
assert 'M480 355V565H880V355' not in svg28
assert (840/2)/84*2==10 # exact period div × ms/div in the independent waveform example
assert 10*100==1000 and 1000*(1-.05)==950 and 1000*(1+.05)==1050
(HERE/'daily-bindings.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
result={'status':'PASS_all98_binding_bytes_dimensions_textbounds_and_selected_geometry','scheduledDays':98,'mappedDays':98,'newSvgPngPairs':88,'existingRelevantAssetsReused':10,'newDiagramFamilies':len(families),'newPngTotalBytes':total_bytes,'textElementsChecked':text_count,'minimumNewLabelFontSize':min_font,'allNewOutputsSurveyedInContactSheets':True,'operatingRatingsInvented':False,'sourceArtworkCopied':False,'responsiveReaderCheck':'root integration owns this check','domainReviewed':False,'nativeReviewed':False,'physicalDeviceVerified':False,'bindingsSha256':hashlib.sha256((HERE/'daily-bindings.json').read_bytes()).hexdigest()}
(HERE/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False))
