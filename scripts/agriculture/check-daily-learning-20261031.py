"""Verify revision-bound daily context/figures without rewriting source lessons or learner IDs."""
import json,hashlib,subprocess,re,statistics
from PIL import Image
from pathlib import Path
root=Path(__file__).resolve().parents[2]
read=lambda p:json.loads((root/p).read_text())
lessons=read('src/data/agriculture/lessons.ja.json')['lessons'];by={l['id']:l for l in lessons};im=read('src/data/agriculture/recognition-images.json')['images'];fig={i['id']:i for i in im};s=read('src/data/agriculture/daily-learning-support.json');manifest=read('src/data/agriculture/course-manifest.json')
base='2639e56cc2f488646382750a7e5f0de86d404544'
for name in ['lessons.ja.json','course-manifest.json','weekly-checks.ja.json','mock-exams.ja.json','source-hash-compatibility.json']:
 assert (root/'src/data/agriculture'/name).read_bytes()==subprocess.check_output(['git','show',base+':src/data/agriculture/'+name],cwd=root),name+' modified'
for name in ['bn','en','hi','id','km','my','ne','th','tl','vi','zh-CN','zh-TW']:
 p='src/data/agriculture/translations/'+name+'.json';assert (root/p).read_bytes()==subprocess.check_output(['git','show',base+':'+p],cwd=root)
for lid,b in s['figureBindings'].items():
 assert b['lessonSourceHash']==by[lid]['sourceHash'];f=fig[b['figureId']];assert b['assetSha256']==f['assetSha256'];assert hashlib.sha256((root/f['assetPath']).read_bytes()).hexdigest()==f['assetSha256']
for image in im:
 asset=root/image['assetPath'];raw=asset.read_bytes();assert not raw.startswith(b'version https://git-lfs.github.com/spec/v1');assert hashlib.sha256(raw).hexdigest()==image['assetSha256'];Image.open(asset).verify()
for lid,d in s['controlledDiagrams'].items():
 assert d['lessonSourceHash']==by[lid]['sourceHash'];asset=root/d['assetPath'];assert hashlib.sha256(asset.read_bytes()).hexdigest()==d['assetSha256'];Image.open(asset).verify()
for lid,entries in s['companionReadings'].items():
 assert s['sourceVersions'][lid]==by[lid]['sourceHash']
 for e in entries:
  l=by[e['lessonId']];assert e['sourceHash']==l['sourceHash'];assert set(e['paragraphIds'])<=set(p['id'] for p in l['paragraphs'])
chars=lambda l,pids=None:sum(len(re.sub(r'\s','',p['textJa'])) for p in l['paragraphs'] if pids is None or p['id'] in pids)
def has_image(lid,level):
 l=by[lid]
 if lid in s['controlledDiagrams']:return True
 if any(lid in i['lessonIds'] and i.get('lessonSourceHashes',{}).get(lid)==l['sourceHash'] and level in i['scopeLevels'] for i in im):return True
 b=s['figureBindings'].get(lid)
 return bool(b and level in b['scopeLevels'])
rows=[]
for level,course in manifest['levels'].items():
 for w in course['weeks']:
  for day,lid in enumerate(w['lessonIds'],1):
   l=by[lid];companions=[e for e in s['companionReadings'].get(lid,[]) if level in by[e['lessonId']]['levels']]
   rows.append({'level':level,'week':w['number'],'day':day,'lessonId':lid,'beforeChars':chars(l),'afterChars':chars(l)+sum(chars(by[e['lessonId']],e['paragraphIds']) for e in companions),'companionLessonIds':[e['lessonId'] for e in companions],'hasInstructionalFigure':has_image(lid,level) or any(has_image(e['lessonId'],level) for e in companions)})
summary={}
for level in ['1','2']:
 ds=[r for r in rows if r['level']==level];summary[level]={'days':len(ds),'beforeMinimum':min(x['beforeChars'] for x in ds),'afterMinimum':min(x['afterChars'] for x in ds),'expandedDays':sum(x['afterChars']>x['beforeChars'] for x in ds),'withFigure':sum(x['hasInstructionalFigure'] for x in ds),'remainingMissingFigure':[x['lessonId'] for x in ds if not x['hasInstructionalFigure']],'remainingUnder300':[x['lessonId'] for x in ds if x['afterChars']<300]}
report={'status':'PASS','originalLessonsSchedulesTranslationsAnd1227QuestionsUnchanged':True,'companionPlanCount':len(s['companionReadings']),'newControlledDiagramKinds':len({x['kind'] for x in s['controlledDiagrams'].values()}),'sourceBoundDiagramLessons':len(s['controlledDiagrams']),'reuseFigureLessons':len(s['figureBindings']),'summary':summary,'rows':rows,'imageRelevanceIndependentlyReviewed':False,'durationMeasured':False,'domainReviewed':False,'physicalDeviceTested':False}
out=root/'docs/ssw-workspace/agriculture/daily-fix-20261031';out.mkdir(exist_ok=True);(out/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='rows'},ensure_ascii=False))
