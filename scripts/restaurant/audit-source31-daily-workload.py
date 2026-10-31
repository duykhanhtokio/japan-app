"""Lower-bound scheduled text inventory after supplements, not a learning-time estimate."""
from pathlib import Path
import json,statistics,collections
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/restaurant/source-closure31';DATA=R/'src/data/restaurant';read=lambda p:json.loads(p.read_text())
lessons={l['id']:l for level in ['1','2'] for l in read(DATA/f'lessons.{level}.ja.json')['lessons']};rows={k:v for level in ['1','2'] for k,v in read(DATA/f'source31/{level}.json')['lessons'].items()};daily={b['lessonId']:b for b in read(DATA/'daily-learning.json')['bindings']};result=[]
for id,l in lessons.items():
 texts=[p['textJa'] for p in l['paragraphs']];base=sum(len(x) for x in dict.fromkeys(texts));b=daily[id]
 for c in b['companionReadings']:texts += [p['textJa'] for p in lessons[c['lessonId']]['paragraphs'] if p['id'] in c['paragraphIds']]
 before=sum(len(x) for x in dict.fromkeys(texts));supp=rows.get(id,{})
 texts += [s['textJa'] for s in supp.get('sections',[])];after=sum(len(x) for x in dict.fromkeys(texts))
 result.append(dict(lessonId=id,level=l['level'],week=l['week'],day=l['day'],baseParagraphChars=base,withScheduledCompanionsChars=before,withSupplementsLowerBoundChars=after,newSectionCount=len(supp.get('sections',[])),supplementQuestions=len((supp.get('exam')or{}).get('questions',[])),primaryDailyFigureId=b['figureId'],supplementTeachingFigureViews=len([f for f in supp.get('figures',[]) if not f.get('quizSafe')]),estimatedMinutes=l['minutes'],observedActiveMinutes=None))
summary={}
for level in ['1','2']:
 subset=[x for x in result if x['level']==level];values=[x['withSupplementsLowerBoundChars']for x in subset];median=statistics.median(values)
 summary[level]=dict(days=len(subset),minimumLowerBoundChars=min(values),medianLowerBoundChars=median,maximumLowerBoundChars=max(values),shortScreen=[x['lessonId'] for x in subset if x['withSupplementsLowerBoundChars']<median/2],longScreen=[x['lessonId'] for x in subset if x['withSupplementsLowerBoundChars']>median*2])
report=dict(status='INVENTORY_ONLY_DURATION_UNMEASURED',days=result,summary=summary,all120DaysRetainObjectiveFigureBinding=len(result)==120 and all(x['primaryDailyFigureId']for x in result),durationMeasured=False,exclusions=['translations','headings','furigana','captions','glossary','interactive guide panels not expanded by this inventory'],limitation='Character screens only. Do not infer minutes, split days or accept equal workload without occupational/content and learner-duration evidence.')
(D/'daily-workload-after-supplements.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(summary=summary,durationMeasured=False,objectiveFigureBindings=120)))
