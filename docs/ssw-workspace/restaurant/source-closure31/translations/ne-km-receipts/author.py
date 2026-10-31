import json,pathlib,hashlib,sys,re
out=pathlib.Path(__file__).resolve().parent;base=out.parents[1]
locale,shard,start=sys.argv[1],sys.argv[2],int(sys.argv[3]);assert locale in ['ne','km']
f=base/f'canonical-ja.{shard}.json';raw=f.read_bytes();sha=hashlib.sha256(raw).hexdigest();anchors=out/'frozen-inputs.json';locks=json.loads(anchors.read_text())if anchors.exists()else{}
if shard in locks:assert locks[shard]==sha,'Canonical changed: reread before translation'
else:locks[shard]=sha;anchors.write_text(json.dumps(locks,indent=2)+'\n')
source=json.loads(raw);items=list(source['items'].items());rows=json.load(sys.stdin);target=base/'translations'/locale/(shard+'.json')
result=json.loads(target.read_text())if target.exists()else{'schemaVersion':1,'locale':locale,'shard':shard,'canonicalFile':str(f.relative_to(base)),'canonicalSha256':sha,'items':{}}
assert result['canonicalSha256']==sha
for i,row in enumerate(rows,start):
 key,s=items[i];fields=['title','text']if s['kind']in ['section','term','reference']else['caption','alt']if s['kind']=='figure'else['stem','objective','options','explanation','reasons'];assert len(row)==len(fields),(i,key)
 t=dict(zip(fields,row));flat=[v for x in row for v in(x if isinstance(x,list)else[x])];assert all(isinstance(x,str)and x.strip()for x in flat);assert not any(re.search(r'[ぁ-ゖァ-ヺ一-龯]',x)for x in flat) or key in ['rst31-operations2-q006','rst31-operations2-q007','rst31-operations2-service-phrases'],'Untranslated Japanese'
 if s['kind']=='question':assert len(t['options'])==len(t['reasons'])==4 and len(set(t['options']))==4 and len(set(t['reasons']))==4
 result['items'][key]={'sourceHash':s['sourceHash'],**t}
result['items']={k:result['items'][k]for k,_ in items if k in result['items']};target.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
receipt={'locale':locale,'shard':shard,'canonicalSha256':sha,'authoredTranslatedItems':len(result['items']),'expectedItems':len(items),'pendingItems':[k for k,_ in items if k not in result['items']],'nativeReviewed':False,'domainReviewed':False,'method':'Direct AI semantic translation of frozen Japanese fields, not machine key/hash approval'}
(out/f'{locale}-{shard}.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print({k:v for k,v in receipt.items()if k!='pendingItems'})
