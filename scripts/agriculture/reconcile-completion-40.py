"""Resolve the frozen 1,405 occurrence backlog using explicit authored evidence."""
import json,collections
from pathlib import Path
R=Path(__file__).resolve().parents[2];S=R.parent/'agri-final-work';W=R/'docs/ssw-workspace/agriculture/completion-40';D=R/'src/data/agriculture'
def read(p):return json.loads(p.read_text())
def put(p,j):p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')
def rows(j):return j if isinstance(j,list) else j.get('rows',j.get('reconciliation',[]))
base=[x for n in ['general','soil','safety','rice','facility','flower'] for x in read(S/(n+'-backlog.json'))];assert len(base)==1405;by={x['id']:x for x in base};selected={};paths=['general/final-reconciliation.json','soil/new-reconciliation.json','safety/reconciliation.json','rice/reconciliation.json','flower/final-reconciliation.json','facility/new-reconciliation.json','facility-general-support/reconciliation.json','facility-flower-support/reconciliation.json','facility-safety-support/reconciliation.json','facility-soil-support/reconciliation.json','facility/final-support-reconciliation.json','visual-safety/scope-resolved-helper-media.json']
for name in paths:
 f=S/name;folder=W/f.parent.name;folder.mkdir(exist_ok=True);j=read(f);put(folder/f.name,j)
 for x in rows(j):
  id=x.get('sourceItemId',x.get('id'));assert id in by,(name,id)
  selected[id]={**x,'reconciliationFile':str((folder/f.name).relative_to(R))}
assert set(selected)==set(by),(len(selected),set(by)-set(selected))
lessons=read(D/'lessons.ja.json')['lessons'];pmap={p['id']:l for l in lessons for p in l['paragraphs']};fmap={f['id']:f for f in read(D/'recognition-images.json')['images']};fmap.update({f['id']:f for f in read(D/'diagrams.json')['diagrams']})
result=[];problems=[]
for id,b in by.items():
 x=selected[id];status=x['disposition'];ps=x.get('paragraphIds',x.get('evidenceParagraphIds',[]));fs=x.get('figureIds',x.get('mediaIds',x.get('imageIds',[])));fs=['agr-f40-graft-cambium-alignment-v2' if f=='agr-f40-graft-cambium-alignment' else f for f in fs]
 # Every resolved row must reach correctly scoped learner-facing evidence.
 if status.startswith('covered'):
  if not ps and not fs:
   # A subset of shared-scope rows intentionally references entire canonical lessons.
   lids=x.get('lessonIds',[]);ps=[p['id'] for l in lessons if l['id'] in lids for p in l['paragraphs']]
  for level in b['scopeLevels']:
   accessible=any(p in pmap and level in pmap[p]['levels'] for p in ps) or any(f in fmap and level in fmap[f].get('scopeLevels',[]) and any(level in next(l for l in lessons if l['id']==i)['levels'] for i in fmap[f]['lessonIds']) for f in fs)
   if not accessible:problems.append({'id':id,'level':level,'paragraphIds':ps,'figureIds':fs,'reconciliation':x})
 result.append({'id':id,'baselineStatus':b['status'],'scopeLevels':b['scopeLevels'],'sources':b['sources'],'objectiveJa':b['objectiveJa'],'disposition':status,'paragraphIds':ps,'figureIds':fs,'reasonJa':x.get('reasonJa',''),'reconciliationFile':x['reconciliationFile'],'humanReviewed':False,'domainReviewed':False,'nativeReviewed':False})
counts=dict(collections.Counter(x['disposition'] for x in result));put(W/'source-reconciliation.json',{'schemaVersion':1,'baselineOccurrences':1405,'sourceOccurrenceCountIsNotUniqueKnowledgeDenominator':True,'statusCounts':counts,'rows':result,'routingProblems':problems,'allSafeObjectivesResolved':not problems and all(x['disposition'].startswith(('covered','excluded')) for x in result),'coveragePercent':None,'humanReviewed':False,'domainReviewed':False,'nativeReviewed':False});print(json.dumps({'counts':counts,'routingProblems':len(problems),'problemIds':[x['id'] for x in problems]}))
