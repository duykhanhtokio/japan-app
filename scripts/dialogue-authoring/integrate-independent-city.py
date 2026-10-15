"""Integrate one self-reviewed city; preserve canonical IDs and all other scenarios."""
from pathlib import Path
import json,hashlib,subprocess,sys
ROOT=Path(__file__).resolve().parents[2]
read=lambda p:json.loads((ROOT/p).read_text())
write=lambda p,v:(ROOT/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
digest=lambda p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
city=sys.argv[1];pref=sys.argv[2] if len(sys.argv)>2 else 'PRF-042'
prefix=f'docs/dialogue-workspace/content-qa/{pref}_CITY_{city}'
source=f'scripts/dialogue-authoring/{pref.lower()}-city-{city.lower()}.json'
entries=read(source);role=read(prefix+'_ROLE_ALIGNMENT.json');review=read(prefix+'_SELF_REVIEW.json');snapshot=read(prefix+'_INPUT.json')
assert snapshot['city']['id']==city and len(snapshot['entries'])==len(entries)
assert role['sourceSha256']==review['sourceSha256']==digest(source)
assert role['inputSha256']==review['inputSha256']==digest(prefix+'_INPUT.json')
assert review.get('selfReviewed',review.get('status')=='author_self_review_complete') and review['fullFinalReread']
assert review.get('roleAlignmentSha256',digest(prefix+'_ROLE_ALIGNMENT.json'))==digest(prefix+'_ROLE_ALIGNMENT.json')
assert not review.get('peerReviewed') and not review.get('crossReadingPerformed')
assert set(entries)=={x['scenario']['id'] for x in snapshot['entries']}
baseline=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
prior_manifest=ROOT/(prefix+'_MANIFEST.json')
if prior_manifest.exists():baseline=read(prefix+'_MANIFEST.json')['baseline']
for e in snapshot['entries']:
 p=f"src/data/generated/dialogues/{e['scenario']['id']}.json"
 assert digest(p)==e['runtimeSha256'] or (prior_manifest.exists() and read(p).get('authoring',{}).get('editorialSource')==source),'Assigned runtime changed outside this city integration'
# Existing authoring applier preserves original translations in its timestamped backup.
subprocess.run(['python',str(ROOT/'scripts/dialogue-authoring/apply-editorial-rewrites.py'),source],cwd=ROOT,check=True)
locations=read('src/data/generated/locations.json');location_by_id={x['id']:x for x in locations}
roles=read('src/data/location-role-corrections.json')
for lid,changes in role.get('corrections',{}).items():
 assert location_by_id[lid]['cityId']==city
 assert set(changes)<={'category','npcJob','nameJa','name','description','openHours','address'}
 location_by_id[lid].update(changes)
 old=roles.get(lid,{})
 roles[lid]={'category':changes.get('category',old.get('category',location_by_id[lid]['category'])),'npcJob':changes.get('npcJob',old.get('npcJob',location_by_id[lid]['npcJob']))}
write('src/data/generated/locations.json',locations);write('src/data/location-role-corrections.json',roles)
rows={x['id']:x for x in read('src/data/generated/scenarios.json')}
rows.update({x['id']:x for x in read('src/data/dialogue-content/scenario-overrides.json')})
overrides=read('src/data/dialogue-content/independent-city-overrides.json');overlay_by_id={x['id']:x for x in overrides};rows.update(overlay_by_id)
for sid,e in entries.items():
 assert len(e['turns'])==11 and len(e['tasks'])==5
 s=dict(rows[sid]);assert s['cityId']==city
 loc=location_by_id[s['locationId']];r=roles.get(loc['id'],{})
 s.update(name=e['title'],situation=e['premise'],playerGoal=e['tasks'][0][1],locationType=r.get('category',loc['category']),difficulty=None,status='Review',description=None,evaluationCriteria=None,outcome=None,startingExpression=None,version=2)
 overlay_by_id[sid]=s
write('src/data/dialogue-content/independent-city-overrides.json',list(overlay_by_id.values()))
manifest={'baseline':baseline,'cityId':city,'prefectureId':pref,'canonicalCount':len(entries),'groups':[{'scenarioIds':list(entries)}],'runtimeQaPath':prefix+'_RUNTIME_QA.json','corpusScreenPath':prefix+'_CORPUS_SCREEN.json','source':source,'sourceSha256':digest(source),'selfReviewOnly':True,'peerReviewed':False}
write(prefix+'_MANIFEST.json',manifest)
# Exact task equality across the effective corpus is a screening gate, not peer review.
tasks={}
for p in (ROOT/'src/data/generated/dialogues').glob('*.json'):
 d=json.loads(p.read_text())
 for t in (d.get('shared',[]) if isinstance(d,dict) else []):
  if t.get('speaker')=='PLAYER':
   goal=(t.get('player') or {}).get('requiredSemanticComponents',{}).get('goal')
   if isinstance(goal,str) and goal:tasks.setdefault(goal,[]).append(p.stem)
collisions=[{'goal':g,'scenarioIds':ids} for g,ids in tasks.items() if len(ids)>1 and any(sid in entries for sid in ids)]
write(prefix+'_GOAL_SCREEN.json',{'status':'PASS' if not collisions else 'FAIL','machineOnly':True,'peerSemanticReview':False,'collisions':collisions})
print('CITY INTEGRATED:',city,len(entries),'scenarios; exact goal collision groups:',len(collisions))
assert not collisions
