from pathlib import Path
import hashlib,json,re,sys
B=Path(__file__).resolve().parents[2]
locale,shard=sys.argv[1:3];cp=B/f'canonical-ja.{shard}.json';c=json.loads(cp.read_text())['items'];p=B/'translations'/locale/f'{shard}.json';t=json.loads(p.read_text());assert t['canonicalSha256']==hashlib.sha256(cp.read_bytes()).hexdigest();assert set(t['items'])==set(c)
for id,a in c.items():
 v=t['items'][id];assert v['sourceHash']==a['sourceHash'];fields={'section':['title','text'],'term':['title','text'],'officialreference':['title','text'],'reference':['title','text'],'figure':['caption','alt'],'question':['stem','objective','options','explanation','reasons']}[a['kind']]
 for k in fields:
  val=v[k];items=val if isinstance(val,list) else [val]
  if isinstance(val,list):assert len(val)==4 and len(set(val))==4,(id,k)
  for s in items:
   checked=s
   if shard=='operations2' and (id,k) in {('rst31-operations2-service-phrases','text'),('rst31-operations2-q006','options'),('rst31-operations2-q007','options')}:
    for phrase in ['いらっしゃいませ','かしこまりました','少々お待ちください','お待たせいたしました','失礼いたします','恐れ入りますが','申し訳ございません','ありがとうございました']:checked=checked.replace(phrase,'')
   if shard=='service1' and (id,k) in {('rst31-service1-a009','text'),('rst31-service1-a010','text')}:
    for phrase in ['失礼いたします','存じ上げております','そうさせていただきます','奥様','旦那様','お使いの方','恐れ入りますが']:checked=checked.replace(phrase,'')
   assert s.strip() and not re.search('[ぁ-ゖァ-ヺ一-龯]',checked),(id,k,s)
   assert re.search({'my':'[က-႟]','th':'[ก-๛]','ne':'[\u0900-\u097f]','km':'[\u1780-\u17ff]'}[locale],s),(id,k)
assert all(t[f] is False for f in ['humanReviewed','nativeReviewed','domainReviewed'])
r=dict(status='PASS',locale=locale,shard=shard,items=len(c),canonicalSha256=t['canonicalSha256'],translationSha256=hashlib.sha256(p.read_bytes()).hexdigest(),sourceHashBindings=True,fourOptionsAndReasons=True,noJapaneseFallback=True,japaneseLearningObjectExceptions=([{'id':'rst31-operations2-service-phrases','field':'text'},{'id':'rst31-operations2-q006','field':'options'},{'id':'rst31-operations2-q007','field':'options'}] if shard=='operations2' else [{'id':'rst31-service1-a009','field':'text'},{'id':'rst31-service1-a010','field':'text'}] if shard=='service1' else []),meaningReview='AI authored against frozen JA; technical scope/current-vs-historical distinctions retained',nativeReviewed=False,humanReviewed=False,domainReviewed=False)
(B/'translations/my-th-receipts'/f'{locale}-{shard}.validation.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps(r,ensure_ascii=False))
