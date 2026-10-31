"""Package explicitly authored MY/TH strings with exact frozen source identities."""
from pathlib import Path
import json,hashlib,sys
B=Path(__file__).resolve().parents[2]
def put(locale,shard,records):
 c=B/f'canonical-ja.{shard}.json';canonical=json.loads(c.read_text())['items'];out=B/'translations'/locale/f'{shard}.json'
 p=json.loads(out.read_text()) if out.exists() else dict(schemaVersion=1,locale=locale,shard=shard,canonicalFile=str(c.relative_to(B.parents[3])),canonicalSha256=hashlib.sha256(c.read_bytes()).hexdigest(),items={},humanReviewed=False,nativeReviewed=False,domainReviewed=False,status='translated_ai_unreviewed')
 assert p['canonicalSha256']==hashlib.sha256(c.read_bytes()).hexdigest()
 packet=json.loads((B/shard/'packet.json').read_text());original={q['id']:q for q in packet['questions']}
 for id,t in records.items():
  a=canonical[id];kind=a['kind'];t=dict(t)
  if kind=='figure' and 'alt'not in t:t['alt']=t['caption']
  if kind=='question' and 'goodFirstOptions'in t:
   q=original[id];idx=q['correctIndex'];order=[idx]+[i for i in range(4) if i!=idx];opts=[q['optionsJa'][i] for i in order];reasonSource=[q['optionReasonsJa'][i] for i in order]
   texts=t.pop('goodFirstOptions');reasons=t.pop('goodFirstReasons');assert len(texts)==len(reasons)==4
   t['options']=[texts[opts.index(x)] for x in a['optionsJa']];t['reasons']=[reasons[reasonSource.index(x)] for x in a['optionReasonsJa']]
  required={'section':['title','text'],'term':['title','text'],'figure':['caption','alt'],'question':['stem','objective','options','explanation','reasons']}[kind]
  assert all(k in t for k in required),(id,t.keys())
  p['items'][id]={'sourceHash':a['sourceHash'],**t}
 out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n');print(locale,shard,len(p['items']),'/',len(canonical))
if __name__=='__main__':
 put(sys.argv[1],sys.argv[2],json.loads(Path(sys.argv[3]).read_text()))
