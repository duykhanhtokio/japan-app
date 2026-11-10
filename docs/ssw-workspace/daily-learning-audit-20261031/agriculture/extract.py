import json,re,statistics,hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[4]
read=lambda p:json.loads((root/p).read_text())
lessons=read('src/data/agriculture/lessons.ja.json')['lessons']; by={l['id']:l for l in lessons}; manifest=read('src/data/agriculture/course-manifest.json'); images=read('src/data/agriculture/recognition-images.json')['images']; diagrams=read('src/data/agriculture/diagrams.json')['diagrams'];src=(root/'src/components/agriculture/RecognitionImages.tsx').read_text();assetkeys=set(re.findall(r'"([^"\n]+)":require',src));
cp=lambda s:len(re.sub(r'\s','',s))
days=[]
for level,course in manifest['levels'].items():
 for w in course['weeks']:
  for day,lid in enumerate(w['lessonIds'],1):
   l=by.get(lid)
   if not l or level not in l['levels']:continue
   im=[x for x in images if lid in x.get('lessonIds',[]) and x.get('lessonSourceHashes',{}).get(lid)==l['sourceHash'] and level in x.get('scopeLevels',[]) and x['assetKey'] in assetkeys and x.get('width',0)>0 and x.get('height',0)>0 and all(x.get(k) for k in ['titleJa','altJa','observationJa','limitJa'])]
   di=[d for d in diagrams if lid in d['lessonIds'] and level in d.get('scopeLevels',[])]
   built=lid in ['agr-rice','agr-organs','agr-sowing-design']
   days.append({'sector':'agriculture','track':level,'weekId':w['id'],'week':w['number'],'day':day,'lessonId':lid,'titleJa':l['titleJa'],'paragraphCount':len(l['paragraphs']),'paragraphBodyChars':sum(cp(p['textJa']) for p in l['paragraphs']),'objectiveActivityChars':cp(l['objectiveJa'])+cp(l['activityJa']),'termCount':len(l['terms']),'rasterFigureCount':len(im),'rasterFigureIds':[x['id'] for x in im],'rasterAssetPaths':[x['assetPath'] for x in im],'conceptDiagramCount':len(di),'builtinDiagram':built,'hasAnyInstructionalVisual':bool(im or di or built)})
summary={}
for level in manifest['levels']:
 ds=[d for d in days if d['track']==level];nums=sorted(d['paragraphBodyChars'] for d in ds);med=statistics.median(nums)
 summary[level]={'weeks':len(manifest['levels'][level]['weeks']),'studyDays':len(ds),'uniqueLessons':len(set(d['lessonId'] for d in ds)),'bodyChars':{'min':min(nums),'p10':nums[int(.1*(len(nums)-1))],'median':med,'mean':round(statistics.mean(nums),1),'p90':nums[int(.9*(len(nums)-1))],'max':max(nums),'maxMinRatio':round(max(nums)/min(nums),2)},'paragraphCounts':dict(__import__('collections').Counter(d['paragraphCount'] for d in ds)),'belowHalfTrackMedian':sum(d['paragraphBodyChars']<med*.5 for d in ds),'below300BodyChars':sum(d['paragraphBodyChars']<300 for d in ds),'below500BodyChars':sum(d['paragraphBodyChars']<500 for d in ds),'withRaster':sum(d['rasterFigureCount']>0 for d in ds),'withoutRaster':sum(d['rasterFigureCount']==0 for d in ds),'withAnyVisualIncludingTextConcept':sum(d['hasAnyInstructionalVisual'] for d in ds),'withoutAnyVisual':sum(not d['hasAnyInstructionalVisual'] for d in ds),'shortest':sorted(ds,key=lambda d:d['paragraphBodyChars'])[:6]}
report={'method':'Actual AgricultureCourse.tsx selected.lessonIds mapping: one lesson = one displayed day. Non-whitespace Unicode character counts of Japanese paragraph bodies only, excluding titles, translations, glossary, objectives/activity, images and UI. This is a screening measure, not measured learning time or semantic quality certification. Raster eligibility duplicates runtime conditions; counts at source level, no visual semantic certification. Text-only concept panels are separate from raster illustration.','paths':['src/components/agriculture/AgricultureCourse.tsx','src/data/agriculture/course-manifest.json','src/data/agriculture/lessons.ja.json','src/components/agriculture/RecognitionImages.tsx','src/data/agriculture/recognition-images.json','src/components/agriculture/ConceptDiagrams.tsx','src/data/agriculture/diagrams.json'],'summary':summary,'days':days,'missingRasterUniqueLessons':sorted({d['lessonId'] for d in days if not d['rasterFigureCount']}),'dataFilesSha256':{p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in ['src/data/agriculture/lessons.ja.json','src/data/agriculture/course-manifest.json','src/data/agriculture/recognition-images.json']}}
out=Path(__file__).parent/'audit.json';out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False,indent=2))
