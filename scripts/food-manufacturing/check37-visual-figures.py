"""Verify new diagram bindings, exact lookup/survey data and existing sign assets."""
from pathlib import Path
import json,hashlib
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];D=ROOT/'src/data/food-manufacturing';A=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031';read=lambda p:json.loads(p.read_text());fs=read(A/'figures37.json')['figures'];assert len(fs)==3;by={f['id']:f for f in fs};lessons={l['id']:l for p in [D/'lessons.1.ja.json',D/'lessons.2.ja.json',*sorted((D/'authoring-20261029').glob('part*.json'))] for l in read(p)['lessons']};checks={c['id']:c for c in read(A/'assessment35-source-gaps.json')['newOpenResponseChecks']};reg=(D/'source-practice37.ts').read_text()
v=by['food-source37-lookup-matrix']['teachingData'];assert v['lookup']==[['H','H','M'],['H','M','L'],['H','M','L']];assert all(r[0]=='H' for r in v['lookup']);assert v['lookup'][2][0]=='H' and v['lookup'][1][2]=='L';assert v['fictional']
v=by['food-source37-conditional-groups']['teachingData'];assert v['sampleSizesCompanies']==[4985,3075,794,301,2167,54];assert v['judgedApplicablePercent']==[73,80.9,50.1,55.5,86.8,37];assert v['notJudgedApplicablePercent']==[27,19.1,49.9,44.5,13.2,63];assert all(abs(a+b-100)<1e-9 for a,b in zip(v['judgedApplicablePercent'],v['notJudgedApplicablePercent']));assert v['surveyFiscalYear']==2023 and v['groupsMustNotBeSummedIntoPopulationRate'];assert len(set(v['sampleSizesCompanies']))==6
v=by['food-source37-flow-zones']['teachingData'];assert v['fictional'] and v['ccpExample']=='加熱' and v['numericUniversalLimitSupplied'] is False and len(v['inputs'])==3
for f in fs:
 l=lessons[f['lessonId']];assert l['sourceHash']==f['lessonSourceHash'];assert any(p['id']==f['paragraphId'] for p in l['paragraphs']);asset=ROOT/f['assetFile'];assert hashlib.sha256(asset.read_bytes()).hexdigest()==f['sha256'];assert (ROOT/f['svgFile']).is_file() and f['assetFile'] in reg
 with Image.open(asset) as im:assert im.size==(f['width'],f['height']);im.verify()
 assert f['altJa'].strip() and json.dumps(f['altJa']) in reg
 for cid in f['assessmentCheckIds']:assert cid in checks and f['id'] in checks[cid]['figureIds'] and checks[cid]['lessonSourceHash']==f['lessonSourceHash']
 for locale in ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']:
  trs=read(D/'translations'/(locale+'.json'))
  for p in (D/'authoring-20261029').glob('part*.json'):trs.update(read(p)['translations'].get(locale,{}))
  tr=trs[l['id']];assert tr['sourceHash']==l['sourceHash'] and tr['paragraphs'][f['paragraphId']].strip()
  if f.get('captionSupplementId'):
   cp=next(s for s in read(D/'source-closure31.json')['sections'] if s['id']==f['captionSupplementId']);assert cp['sourceHash']==f['captionSupplementSourceHash'];assert cp['translations'][locale]['sourceHash']==cp['sourceHash'] and cp['translations'][locale]['title'].strip()
s=read(D/'safety-signs.json');assert len(s['signs'])==15 and s['sourceHash']==lessons[s['lessonId']]['sourceHash'];signrows=[]
for i,sign in enumerate(s['signs']):
 asset=ROOT/'assets/food-manufacturing/recognition'/(sign['id']+'.webp');svg=asset.with_suffix('.svg');assert svg.is_file()
 with Image.open(asset) as im:assert im.size==(640,640);im.verify()
 for locale,t in s['translations'].items():assert len(t['labels'])==15 and t['labels'][i].strip() and t['notice'].strip()
 signrows.append({'id':sign['id'],'assetFile':str(asset.relative_to(ROOT)),'svgFile':str(svg.relative_to(ROOT)),'sha256':hashlib.sha256(asset.read_bytes()).hexdigest(),'width':640,'height':640,'lessonId':s['lessonId'],'lessonSourceHash':s['sourceHash'],'paragraphId':sign['paragraphId'],'labelJa':sign['ja'],'reading':sign['reading'],'index':i,'testId':'food-sign-'+sign['id']})
report={'status':'PASS','newOriginalFigures':3,'existingOriginalSignAssetsVerified':15,'newWebpBytes':sum((ROOT/f['assetFile']).stat().st_size for f in fs),'newFigureCaptionLocalePairs':36,'existingSignLabelLocalePairs':180,'independentLookupAndHistoricalSurveyDataChecks':'PASS','humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False,'browserTestedByThisValidator':False};(A/'visual37-validation.json').write_text(json.dumps(report,indent=2)+'\n');(A/'existing-signs37.json').write_text(json.dumps({'signs':signrows,'activityJa':lessons[s['lessonId']]['activityJa'],'meaning':'Existing original image cards plus existing formative classification/action activity. Not unseen-image MCQ certification.'},ensure_ascii=False,indent=2)+'\n');print(json.dumps(report))
