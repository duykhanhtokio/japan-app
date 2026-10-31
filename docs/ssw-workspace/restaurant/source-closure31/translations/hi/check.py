from pathlib import Path
import json,hashlib,sys,re
BASE=Path(__file__).resolve().parents[2]
def check(shard):
 src=BASE/f'canonical-ja.{shard}.json';j=json.loads(src.read_text());out=[]
 for locale in ['hi','bn']:
  p=BASE/'translations'/locale/f'{shard}.json';t=json.loads(p.read_text());assert t['canonicalSha256']==hashlib.sha256(src.read_bytes()).hexdigest();assert set(t['items'])==set(j['items']),(locale,len(t['items']),len(j['items']))
  for id,r in j['items'].items():
   v=t['items'][id];assert v['sourceHash']==r['sourceHash']
   fields={'section':['title','text'],'reference':['title','text'],'term':['title','text'],'figure':['caption','alt'],'question':['stem','objective','options','explanation','reasons']}[r['kind']]
   assert set(v)=={'sourceHash',*fields},(id,set(v),fields)
   for f in fields:
    vals=v[f]if isinstance(v[f],list)else[v[f]]
    if f in ['options','reasons']:assert len(vals)==4
    assert all(isinstance(s,str)and s.strip()for s in vals)
    assert all(not re.search('[\u3040-\u30ff\u4e00-\u9fff]',s)for s in vals) or id in ['rst31-operations2-service-phrases','rst31-operations2-q006','rst31-operations2-q007','rst31-service1-a009','rst31-service1-a010','rst31-service1-a014'],(id,f,'Japanesefallback')
    if locale=='hi':assert all(not re.search('[\u0980-\u09ff\uac00-\ud7af]',s)for s in vals),(id,f,'otherlocale script')
    if locale=='bn':assert all(not re.search('[\u0900-\u0963\u0966-\u097f\uac00-\ud7af]',s)for s in vals),(id,f,'otherlocale script')
   if r['kind']=='question':assert len(set(v['options']))==4
  out.append({'locale':locale,'items':len(t['items']),'outputSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'exactSourceHashes':True,'allFieldsAuthored':True,'nativeReviewed':False,'domainReviewed':False})
 result={'shard':shard,'result':'PASS','canonicalSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'locales':out,'scope':'Structural/exact-anchor checks; translations independently authored by AI, not native/domain-certified.'};(BASE/'translations/hi'/f'{shard}.receipt.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result))
if __name__=='__main__':check(sys.argv[1])
