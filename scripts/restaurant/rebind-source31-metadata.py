"""Apply one explicitly proven metadata-only freeze update, never a text-edit hash refresh."""
from pathlib import Path
import json,hashlib
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/restaurant/source-closure31'
read=lambda p:json.loads(p.read_text());sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
proof=read(D/'integration/metadata-rebindings.json');oldfile=D/'frozen-exports'/f"{proof['oldCanonicalSha256']}.json";newfile=D/'canonical-ja.integration.json';assert sha(oldfile)==proof['oldCanonicalSha256'] and sha(newfile)==proof['newCanonicalSha256'];old=read(oldfile)['items'];new=read(newfile)['items']
assert set(old)-set(new)==set(proof['removedQuestionIds'])
for id,item in new.items():assert all(old[id].get(k)==item.get(k) for k in proof['visibleJapaneseComparisonFields']),id
changed={x['id']:x for x in proof['changes']};logs=[]
for path in sorted((D/'translations').glob('*/integration.json')):
 target=read(path);assert target.get('shard')=='integration';before=sha(path);removed=[];rebound=[]
 for id in proof['removedQuestionIds']:
  if id in target['items']:removed.append(id);target['items'].pop(id)
 for id,t in target['items'].items():
  assert id in new,(path,id)
  if t['sourceHash']!=new[id]['sourceHash']:
   assert id in changed and t['sourceHash']==changed[id]['oldSourceHash'] and new[id]['sourceHash']==changed[id]['newSourceHash'],(path,id)
   t['sourceHash']=new[id]['sourceHash'];rebound.append(id)
 target['canonicalSha256']=proof['newCanonicalSha256'];path.write_text(json.dumps(target,ensure_ascii=False,indent=2)+'\n')
 logs.append(dict(path=str(path.relative_to(R)),beforeSha256=before,afterSha256=sha(path),removed=removed,metadataOnlyRebound=rebound))
(D/'integration/target-metadata-rebindings.json').write_text(json.dumps(dict(schemaVersion=1,proof='metadata-rebindings.json',retainedTranslationTextUnchanged=True,targets=logs),ensure_ascii=False,indent=2)+'\n');print('PASS metadata-only target rebind',len(logs))
