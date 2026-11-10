import json,pathlib,hashlib,re,sys
b=pathlib.Path(__file__).resolve().parents[2];report={}
for shard in sys.argv[1:]:
 report[shard]={}
 for loc in ['ne','km']:
  f=b/'translations'/loc/(shard+'.json');t=json.loads(f.read_text());source=b/t['canonicalFile'];s=json.loads(source.read_text());assert t['canonicalSha256']==hashlib.sha256(source.read_bytes()).hexdigest();assert list(t['items'])==list(s['items']);exc=[]
  for k,v in t['items'].items():
   a=s['items'][k];assert v['sourceHash']==a['sourceHash'];fields=['title','text']if a['kind']in ['section','term','reference']else['caption','alt']if a['kind']=='figure'else['stem','objective','options','explanation','reasons'];assert set(v)==set(fields+['sourceHash'])
   for field in fields:
    text=v[field];rows=text if isinstance(text,list)else[text];assert all(isinstance(z,str)and z.strip()for z in rows)
    if re.search(r'[ぁ-ゖァ-ヺ一-龯]',json.dumps(text,ensure_ascii=False)):
     assert k in ['rst31-operations2-q006','rst31-operations2-q007']and field=='options';exc.append({'id':k,'field':field,'reason':'Japanese expressions are learning objects; each has a target gloss. Surrounding fields fully translated.'})
   if a['kind']=='question':assert len(v['options'])==len(v['reasons'])==4 and len(set(v['options']))==len(set(v['reasons']))==4
  report[shard][loc]={'items':len(t['items']),'fileSha256':hashlib.sha256(f.read_bytes()).hexdigest(),'sourceHashBindings':'PASS','completeFields':'PASS','narrowJapaneseExceptions':exc,'humanNativeReviewed':False,'humanDomainReviewed':False}
 (b/'translations/ne-km-receipts'/(shard+'-validation.json')).write_text(json.dumps(report[shard],ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
