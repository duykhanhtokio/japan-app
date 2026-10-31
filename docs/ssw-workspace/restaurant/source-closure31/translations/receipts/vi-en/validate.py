import json,hashlib,re,unicodedata,collections
from pathlib import Path
B=Path(__file__).resolve().parents[2]
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def nums(s):return collections.Counter(re.findall(r'[-−]?\d+(?:[,.]\d+)*',unicodedata.normalize('NFKC',s)))
checks=[];differences=[];fieldCount=0
for locale in ['vi','en']:
 for f in sorted((B/locale).glob('*.json')):
  d=read(f);c=B.parent/f'canonical-ja.{d["shard"]}.json';canon=read(c)['items'];assert d['canonicalSha256']==sha(c),f
  assert set(d['items'])==set(canon),(f,'missing/extra IDs')
  itemFields=0
  for k,src in canon.items():
   t=d['items'][k];assert t['sourceHash']==src['sourceHash'],(f,k)
   if src['kind'] in ['section','reference']:fields=[('titleJa','title'),('textJa','text')]
   elif src['kind']=='term':fields=[('termJa','title'),('explanationJa','text')]
   elif src['kind']=='figure':fields=[('captionJa','caption'),('altJa','alt')]
   else:
    assert len(t['options'])==len(set(t['options']))==4 and len(t['reasons'])==4,(f,k)
    fields=[('stemJa','stem'),('objectiveJa','objective'),('explanationJa','explanation')]+[(f'optionsJa.{i}',f'options.{i}') for i in range(4)]+[(f'optionReasonsJa.{i}',f'reasons.{i}') for i in range(4)]
   for sf,tf in fields:
    def get(obj,field):
     a=field.split('.');return obj[a[0]][int(a[1])] if len(a)==2 else obj[field]
    a,b=get(src,sf),get(t,tf);assert isinstance(b,str) and b.strip(),(f,k,tf)
    assert a!=b,(f,k,'unchanged JA fallback',tf)
    itemFields+=1
    if nums(a)!=nums(b):differences.append(dict(locale=locale,shard=d['shard'],id=k,field=tf,ja=a,target=b,sourceTokens=dict(nums(a)),targetTokens=dict(nums(b))))
  checks.append(dict(locale=locale,shard=d['shard'],items=len(canon),translatedFields=itemFields,canonicalSha256=sha(c),targetSha256=sha(f)));fieldCount+=itemFields
receipt=dict(status='PASS_STRUCTURAL',itemsAcrossLocaleFiles=sum(x['items'] for x in checks),translatedFields=fieldCount,files=checks,numericComparisonsNeedingSemanticDisposition=differences,scope='Manual AI authoring; this script verifies completeness/hash/shape and detects numeric token differences, not native/expert approval.',nativeReviewed=False,domainReviewed=False)
(Path(__file__).parent/'validation.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
print('PASS',len(checks),'files',receipt['itemsAcrossLocaleFiles'],'locale-items',fieldCount,'fields;',len(differences),'numeric token differences to disposition')
for x in differences:print(x['locale'],x['shard'],x['id'],x['field'],x['sourceTokens'],x['targetTokens'])
