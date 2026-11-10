#!/usr/bin/env python3
"""Merge bounded Nepali/Khmer workers without replacing existing translations."""
import json,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[2];d=root/'src/data/food-manufacturing';lessons={l['id']:l for n in ('1','2') for l in json.loads((d/f'lessons.{n}.ja.json').read_text())['lessons']}
merged={};updates=[]
for locale in ('ne','km'):
 p=d/'translations'/f'{locale}.json';pack=json.loads(p.read_text());part={}
 names=[f'{locale}.level2.json'] if locale=='ne' else ['km.level2.json','km.level2.013-024.json','km.level2.025-036.json']
 for name in names:
  block=json.loads((d/'translations/parts'/name).read_text())
  for key,value in block.items():
   assert key not in part,key+': duplicate part entry';part[key]=value
 assert len(part)==36,locale+': incomplete L2'
 assert all(f'food-1-{n:03}' in pack for n in range(1,43)),locale+': incomplete L1'
 for key,t in part.items():
  assert key.startswith('food-2-') and t['sourceHash']==lessons[key]['sourceHash'],key
  if key in pack:assert pack[key]==t,key+': preserve conflicting existing work'
  else:pack[key]=t
 assert len(pack)==78,locale+': expected78'
 updates.append((p,pack))
 merged[locale]=len(pack)
if '--check-only' not in sys.argv:
 for path,pack in updates:path.write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'PASS','mergedLessonCounts':merged}))
