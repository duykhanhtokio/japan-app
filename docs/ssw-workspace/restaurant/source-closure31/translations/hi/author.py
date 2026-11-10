from pathlib import Path
import json,hashlib
BASE=Path(__file__).resolve().parents[2]
def put(shard,id,hi,bn):
 source=BASE/f'canonical-ja.{shard}.json';canonical=json.loads(source.read_text());r=canonical['items'][id]
 for locale,value in [('hi',hi),('bn',bn)]:
  p=BASE/'translations'/locale/f'{shard}.json';j=json.loads(p.read_text())if p.exists()else {'schemaVersion':1,'locale':locale,'shard':shard,'canonicalFile':str(source.relative_to(BASE)),'canonicalSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'items':{},'nativeReviewed':False,'domainReviewed':False}
  assert j['canonicalSha256']==hashlib.sha256(source.read_bytes()).hexdigest();j['items'][id]={'sourceHash':r['sourceHash'],**value};p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')
def S(name,ht,hb,bt,bb):put('hygiene1','rst31-hygiene1-a-'+name,{'title':ht,'text':hb},{'title':bt,'text':bb})
