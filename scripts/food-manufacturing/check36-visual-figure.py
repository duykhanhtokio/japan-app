"""Recount all intervals independently and verify exact source/lesson assets."""
from pathlib import Path
import hashlib,json,math
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];A=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031';D=ROOT/'src/data/food-manufacturing';read=lambda p:json.loads(p.read_text());fs=read(A/'figures36.json')['figures'];assert len(fs)==1;f=fs[0];v=f['teachingData'];data=v['measurementsG'];assert len(data)==v['sampleCount']==8
for edges,counts,width in zip(v['binEdgesG'],v['frequencies'],v['widthsG']):
 assert all(abs(b-a-width)<1e-9 for a,b in zip(edges,edges[1:]));actual=[sum(a<=x<b for x in data) for a,b in zip(edges,edges[1:])];assert actual==counts and sum(actual)==8
assert v['frequencies']==[[2,0,3,0,3],[2,3,3],[8]] and v['frequencySums']==[8,8,8]
b=v['boundaryExample'];assert b['lowerG']<=b['valueG']<b['upperG'] and sum(b['lowerG']<=x<b['upperG'] for x in data)==b['frequency']==3
assert round(math.sqrt(v['sqrtNGuidance']['n']),2)==v['sqrtNGuidance']['sqrtNApprox']==2.83 and not v['sqrtNGuidance']['mandatoryRule']
l=next(l for p in (D/'authoring-20261029').glob('part*.json') for l in read(p)['lessons'] if l['id']==f['lessonId']);s=next(s for s in read(A/'source-teaching34-tail.json')['sections'] if s['id']==f['supplementSectionId']);assert l['sourceHash']==f['lessonSourceHash']==s['lessonSourceHash'];assert hashlib.sha256(s['textJa'].encode()).hexdigest()==f['supplementTextSha256'];assert any(p['id']==f['paragraphId'] for p in l['paragraphs']);asset=ROOT/f['assetFile'];assert hashlib.sha256(asset.read_bytes()).hexdigest()==f['sha256'];assert (ROOT/f['svgFile']).is_file()
with Image.open(asset) as im:assert im.size==(f['width'],f['height']);im.verify()
reg=(D/'source-practice36.ts').read_text();assert f['assetFile'] in reg and f['lessonSourceHash'] in reg
for locale in ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']:
 translations={}
 for p in (D/'authoring-20261029').glob('part*.json'):translations.update(read(p)['translations'].get(locale,{}))
 tr=translations[l['id']];assert tr['sourceHash']==l['sourceHash'] and tr['paragraphs'][f['paragraphId']].strip()
report={'status':'PASS','decodedOriginalFigures':1,'independentFrequencyRecounts':3,'frequencySumEach':8,'workedBoundaryFrequency':3,'sourceAndLessonHashBindings':1,'canonicalCaptionBodyLocaleBindings':12,'webpBytes':asset.stat().st_size,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'physicalDeviceTested':False,'rasterLabelsTranslated':False};(A/'visual36-validation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
