"""Collect independently authored, complete rows; leave rejected rows with their owner."""
from pathlib import Path
import argparse, json, re, os
p=argparse.ArgumentParser();p.add_argument('--source',required=True);args=p.parse_args()
root=Path(__file__).resolve().parents[1];work=Path(args.source);directory=root/'docs/vocabulary-workspace/practical-examples'
assignment=json.loads((directory/'parallel-assignment-2026-10-18.json').read_text());locales=assignment['locales'];owners={id:w['worker'] for w in assignment['workers'] for id in w['ids']}
canonical=json.loads((root/'src/data/generated/vocabulary.json').read_text());base={}
for f in ['vocabulary-practical-examples.json','vocabulary-practical-example-additions.json']:base.update(json.loads((root/'src/data/generated'/f).read_text())['entries'])
sources={x['exampleJa']:x['id'] for x in canonical if x.get('exampleJa')};sources.update({x['sourceJa']:id for id,x in base.items()})
batchById={};integrated={}
for f in sorted(directory.glob('direct-*.json')):
 n=int(f.stem.split('-')[1])
 if n<1000:continue
 for r in json.loads(f.read_text())['rows']:
  batchById[r[0]]=f.name;integrated[r[0]]=r;sources[r[2]]=r[0]
scripts={'zh-CN':r'[\u3400-\u9fff]','zh-TW':r'[\u3400-\u9fff]','hi':r'[\u0900-\u097f]','ne':r'[\u0900-\u097f]','bn':r'[\u0980-\u09ff]','my':r'[\u1000-\u109f]','th':r'[\u0e00-\u0e7f]','km':r'[\u1780-\u17ff]'}
issues=[];changed=[];new=0
for worker in range(1,7):
 for f in sorted((work/f'worker-{worker}'/'output').glob('direct-*.json')):
  try:
   b=json.loads(f.read_text());assert b['locales']==locales,'locale order';num=int(f.stem.split('-')[1]);assert num//1000==worker,'file number ownership'
  except Exception as e:issues.append({'worker':worker,'file':f.name,'error':str(e)});continue
  dest=directory/f.name;previous=json.loads(dest.read_text()) if dest.exists() else {**b,'rows':[]};accepted={r[0]:r for r in previous['rows']};seen=set()
  for r in b['rows']:
   id=r[0] if r else '?'
   try:
    assert len(r)==15 and all(isinstance(v,str) and v.strip() for v in r),'15 nonempty strings required'
    assert owners.get(id)==worker,'ID not assigned to this worker';assert id not in seen,'duplicate row ID';seen.add(id)
    assert batchById.get(id,f.name)==f.name,'ID already authored in another file'
    assert 8<=len(r[2])<=120,'Japanese length 8..120';assert r[1] in r[2],'target form absent'
    assert sources.get(r[2],id)==id,'Japanese sentence duplicates another vocabulary ID'
    for i,locale in enumerate(locales):
     value=r[i+3];assert len(value)<=1000,locale+' too long'
     assert locale=='en' or value!=r[3],locale+' is English fallback'
     if locale in scripts:assert re.search(scripts[locale],value),locale+' script absent'
     if locale not in ['zh-CN','zh-TW']:assert not re.search(r'[\u3040-\u30ff\u3400-\u9fff]',value),locale+' contains untranslated Japanese'
     assert not re.search(r'\b(TODO|TRANSLATE_ME|PLACEHOLDER)\b',value),'placeholder'
    if id not in integrated:new+=1
    accepted[id]=r;integrated[id]=r;batchById[id]=f.name;sources[r[2]]=id
   except Exception as e:issues.append({'worker':worker,'file':f.name,'id':id,'error':str(e)})
  if accepted:
   result={**b,'rows':list(accepted.values())};content=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
   if not dest.exists() or dest.read_text()!=content:
    tmp=dest.with_suffix('.json.collecting');tmp.write_text(content);os.replace(tmp,dest);changed.append(f.name)
counts=[{'worker':w['worker'],'required':w['count'],'integrated':sum(owners[id]==w['worker'] for id in integrated)} for w in assignment['workers']]
report={'previousCoverage':assignment['existingCoverage'],'newThisCollection':new,'parallelIntegrated':len(integrated),'effectiveCoverage':assignment['existingCoverage']+len(integrated),'remaining':assignment['missing']-len(integrated),'workers':counts,'changedFiles':changed,'issues':issues}
(work/'collection-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
