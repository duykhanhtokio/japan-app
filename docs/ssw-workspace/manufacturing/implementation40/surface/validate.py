from pathlib import Path
import json,hashlib,xml.etree.ElementTree as ET
from PIL import Image
ROOT=Path(__file__).resolve().parents[5];OUT=Path(__file__).resolve().parent
L={l['id']:l for l in json.loads((ROOT/'src/data/manufacturing/surface.json').read_text())['lessons']}
B=json.loads((OUT/'daily-bindings.json').read_text())['bindings']
assert len(B)==73 and {b['lessonId'] for b in B}==set(L)
assert len({b['assetId'] for b in B})==len({b['file'] for b in B})==73
assert len({b['sha256'] for b in B})==73
counts=[]
for b in B:
 l=L[b['lessonId']];assert b['sourceHash']==l['sourceHash'];assert b['captionJa']==l['summaryJa'];assert b['altJa']==l['titleJa'];assert b['sourceRefs']==l['sources']
 assert b['keyObjectiveJa'] in l['objectiveJa'].split('\n')
 p=ROOT/b['file'];assert p.read_bytes().startswith(b'\x89PNG\r\n\x1a\n');assert hashlib.sha256(p.read_bytes()).hexdigest()==b['sha256']
 with Image.open(p) as im:assert im.size==(1400,900) and im.mode=='RGB'
 svg=ROOT/b['svgFile'];assert hashlib.sha256(svg.read_bytes()).hexdigest()==b['svgSha256'];tree=ET.fromstring(svg.read_text())
 texts=tree.findall('.//{http://www.w3.org/2000/svg}text');assert all(float(t.attrib['font-size'])>=26 for t in texts)
 assert not tree.findall('.//{http://www.w3.org/2000/svg}image')
 shapes=[x for x in tree.iter() if x.tag.split('}')[-1] in ['rect','path','circle','line','polygon']];assert len(shapes)>=8
 assert all(b[k] is False for k in ['humanReviewed','nativeReviewed','domainReviewed','physicalDeviceVerified','renderedByExistingComponent'])
 counts.append({'lessonId':b['lessonId'],'pngBytes':p.stat().st_size,'shapePrimitives':len(shapes),'fontSizeMin':min(float(t.attrib['font-size']) for t in texts)})
r={'status':'PASS_asset_binding_and_geometry_invariants_not_expert_or_device_acceptance','scheduledSurfaceLessons':73,'newControlledSvgAssets':73,'newActualPngAssets':73,'allSourceHashesBound':True,'captionExactExistingSummaryReuse':73,'altExactExistingTitleReuse':73,'minimumLabelFontSize':26,'totalPngBytes':sum(x['pngBytes'] for x in counts),'maxPngBytes':max(x['pngBytes'] for x in counts),'sourceImagesCopied':False,'legacyFiguresRemoved':False,'rootRuntimeIntegrationPending':True,'physicalDeviceVerified':False,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'items':counts}
(OUT/'validation.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in r.items() if k!='items'},ensure_ascii=False))
