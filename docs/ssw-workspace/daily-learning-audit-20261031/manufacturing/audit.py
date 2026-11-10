from pathlib import Path
import json,re,statistics,hashlib
ROOT=Path(__file__).resolve().parents[4]
OUT=Path(__file__).parent
P=ROOT/'src/data/manufacturing'
read=lambda p:json.loads(p.read_text())
chars=lambda x:len(re.sub(r'\s+','',x.replace('\\n','\n')))
manifest=read(P/'course-manifest.json')
source=(ROOT/'src/components/manufacturing/ManufacturingDiagram.tsx').read_text()
base={m[0]:m[1] for m in re.findall(r"'([^']+)':\{source:require\('([^']+)'\)",source)}
base={k:v for k,v in base.items() if (ROOT/'src/components/manufacturing'/v).exists()}
supp=read(P/'supplemental-diagrams.json')['items']
patches=[read(P/(n+'.json')) for n in ['lesson-editorial','boolean-editorial']]
def figure_ids(l):
 ids=[]
 if l['id'] in base:ids.append(l['id'])
 if l['id']=='mfg1-mechanical-lesson-018' and l['id']+'-reading' in base:ids.append(l['id']+'-reading')
 for d in supp:
  if d['lessonId']==l['id'] and d['lessonSourceHash']==l['sourceHash'] and d['captionJa'].strip() and d['width']>0 and d['height']>0 and (ROOT/'assets/manufacturing/diagrams'/d['assetFile']).exists():ids.append(d['id'])
 return ids
def percentile(a,p):
 a=sorted(a);idx=(len(a)-1)*p;lo=int(idx);hi=min(lo+1,len(a)-1);return round(a[lo]+(a[hi]-a[lo])*(idx-lo),1)
rows=[];summaries=[]
for spec in manifest['specialties']:
 data=read(P/(spec['id']+'.json'));by={l['id']:l for l in data['lessons']}
 local=[]
 for w in spec['weeks']:
  for day,lid in enumerate(w['lessonIds'][:7],1):
   l=by[lid];bodies=[]
   for p in l['paragraphs']:
    text=p['textJa']
    for patch in patches:
     if patch['lessonId']==lid and patch['paragraphId']==p['id'] and patch['sourceHash']==l['sourceHash'] and patch['wording']['ja']['before']==text:text=patch['wording']['ja']['after']
    bodies.append(text)
   body=sum(map(chars,bodies))
   other=[l['objectiveJa'],l['activityJa'],*l['safetyJa'],l['summaryJa']]+[t['ja']+t['reading']+t['meaningJa'] for t in l['terms']]
   figures=figure_ids(l)
   row={'specialty':spec['id'],'week':w['number'],'day':day,'lessonId':lid,'titleJa':l['titleJa'],'paragraphs':len(bodies),'bodyChars':body,'learningChars':body+sum(map(chars,other)),'activityChars':chars(l['activityJa']),'terms':len(l['terms']),'estimatedMinutes':l['estimatedMinutes'],'durationBasis':l.get('durationBasis'),'figureIds':figures,'hasRenderedFigureBinding':bool(figures),'sourceHash':l['sourceHash']};rows.append(row);local.append(row)
 vals=[r['bodyChars'] for r in local];med=statistics.median(vals)
 summaries.append({'specialty':spec['id'],'scheduledDays':len(local),'weeks':len(spec['weeks']),'emptyWeekSlots':7*len(spec['weeks'])-len(local),'bodyChars':{'min':min(vals),'p25':percentile(vals,.25),'median':med,'p75':percentile(vals,.75),'max':max(vals),'maxMinRatio':round(max(vals)/min(vals),2)},'learningChars':{'min':min(r['learningChars'] for r in local),'median':statistics.median(r['learningChars'] for r in local),'max':max(r['learningChars'] for r in local)},'shorterThanHalfTrackMedian':[r['lessonId'] for r in local if r['bodyChars']<med*.5],'daysWithFigure':sum(r['hasRenderedFigureBinding'] for r in local),'daysWithoutFigure':sum(not r['hasRenderedFigureBinding'] for r in local),'declaredMinutes':sorted(set(r['estimatedMinutes'] for r in local)),'shortestFive':sorted(local,key=lambda r:r['bodyChars'])[:5]})
result={'scope':'Current checked-out branch manufacturing actual daily schedule; static runtime binding audit, not browser load or semantic image validation','method':'Non-whitespace Unicode codepoints. bodyChars=sum rendered paragraph bodies including two exact-bound Japanese editorial overrides. learningChars adds objective, terms incl readings/meanings, activity, safety and summary; excludes titles/captions/UI/translations. A short flag (<half track median) is screening only, not a measured duration claim. Empty last-week slots excluded. Core weekdays one lesson/day; supplement reading cards not automatically assigned to days.','productionAvailability':'Manufacturing route returns preparation notice outside __DEV__.','summary':summaries,'totalDays':len(rows),'daysWithFigure':sum(r['hasRenderedFigureBinding'] for r in rows),'daysWithoutFigure':sum(not r['hasRenderedFigureBinding'] for r in rows),'rows':rows}
(OUT/'audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='rows'},ensure_ascii=False))
