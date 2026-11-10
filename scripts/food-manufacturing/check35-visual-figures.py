"""Independent arithmetic and source/asset binding checks for original chart examples."""
from pathlib import Path
import json,hashlib
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];AUDIT=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031';D=ROOT/'src/data/food-manufacturing';read=lambda p:json.loads(p.read_text());figs=read(AUDIT/'figures35.json')['figures'];assert len(figs)==2
lesson=next(l for l in read(D/'lessons.2.ja.json')['lessons'] if l['id']=='food-2-021');section=next(s for s in read(AUDIT/'source-teaching34.json')['sections'] if s['id']=='food34-chart-axes');reg=(D/'source-practice35.ts').read_text();by={f['id']:f for f in figs}
pie=by['food-source35-time-pie-angle']['teachingData']['pie'];assert pie['total']==sum(pie['counts'])==30;assert pie['percentages']==[100*n/30 for n in pie['counts']]==[50,30,20];assert pie['anglesDegrees']==[360*n/30 for n in pie['counts']]==[180,108,72];assert sum(pie['anglesDegrees'])==360
pareto=by['food-source35-pareto-cumulative']['teachingData'];assert pareto['counts']==[15,9,6] and all(a>=b for a,b in zip(pareto['counts'],pareto['counts'][1:]));assert pareto['cumulativeCounts']==[sum(pareto['counts'][:i]) for i in [1,2,3]]==[15,24,30];assert pareto['cumulativePercentages']==[100*n/30 for n in pareto['cumulativeCounts']]==[50,80,100]
for f in figs:
 assert f['lessonSourceHash']==lesson['sourceHash'] and f['paragraphId']=='p1';assert f['supplementSectionId']==section['id'] and f['supplementTextSha256']==hashlib.sha256(section['textJa'].encode()).hexdigest();asset=ROOT/f['assetFile'];assert hashlib.sha256(asset.read_bytes()).hexdigest()==f['sha256'];assert (ROOT/f['svgFile']).is_file();assert f['assetFile'] in reg
 with Image.open(asset) as im:assert im.size==(f['width'],f['height']);im.verify()
 for locale in ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']:
  tr=read(D/'translations'/(locale+'.json'))[lesson['id']];assert tr['sourceHash']==lesson['sourceHash'] and tr['paragraphs']['p1'].strip() and tr['paragraphTitles']['p1'].strip()
report={'status':'PASS','decodedFigures':2,'independentArithmeticChecks':'PASS','exactSourceSectionAndLessonBindings':2,'canonicalCaptionBodyLocaleBindings':24,'webpBytes':sum((ROOT/f['assetFile']).stat().st_size for f in figs),'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'physicalDeviceTested':False,'rasterLabelsTranslated':False}
(AUDIT/'visual35-validation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
