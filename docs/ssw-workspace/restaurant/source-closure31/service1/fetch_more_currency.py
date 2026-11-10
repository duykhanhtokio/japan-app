from pathlib import Path
import urllib.request,urllib.parse,re,io,json,hashlib,concurrent.futures
from PIL import Image
R=Path('/workspace/scratch/8c34e3cace7a/japan-app');O=R/'docs/ssw-workspace/restaurant/source-closure31/service1';D=R/'assets/restaurant/source31/service1'
seed=json.loads((O/'official-assets.json').read_text());tasks=[]
base='https://www.mof.go.jp/policy/currency/coin/general_coin/list.htm'
s=urllib.request.urlopen(base,timeout=25).read().decode();ims=re.findall(r'<img[^>]*\bsrc="([^"]+)"[^>]*>',s)
# Actual HTML has alt before src. Limit to the six current denomination pairs and old 500pair source variant.
for value in [500,100,50,10,5,1]:
 for side in ['o','r']:
  name=('500_bicolorclad_obverse_1001.jpg' if side=='o' else '500_bicolorclad_reverse_1001.jpg') if value==500 else f'{value}'+('' if side=='o' else '_reverse')+'.jpg'
  src=next(x for x in ims if x.split('/')[-1]==name)
  tasks.append((urllib.parse.urljoin(base,src),f'mof-coin-{value}-{side}.jpg',f'{value}円硬貨の'+('表' if side=='o' else '裏'),base,['coin-values']))
# 2004 issued specimens may embed both sides in one image; retain unchanged files.
for value,suffix in [(10000,'b'),(5000,'c'),(1000,'d')]:
 u=f'https://www.mof.go.jp/policy/currency/bill/issued/ks140802{suffix}.htm';s=urllib.request.urlopen(u,timeout=25).read().decode()
 for j,t in enumerate(re.findall(r'<img[^>]+>',s)):
  src=re.search(r'src="([^"]+)"',t)
  if src and not any(x in src[1] for x in ['logo','/common/','/icon/']):
   url=urllib.parse.urljoin(u,src[1]);
   if '/images/' in url and any(x in t for x in ['万円','千円','券','図柄']):tasks.append((url,f'mof-2004-{value}-{j}'+Path(url).suffix,f'2004年発行開始の{value}円券の公式見本',u,['banknote-values','currency-old']))
# 2000 2000yen front/back exact observed URLs.
for side,name in [('o','omote'),('r','ura')]:tasks.append((f'https://www.mof.go.jp/policy/currency/images/{name}.jpg',f'mof-2000-2000-{side}.jpg','2000年発行開始の2000円券の'+('表' if side=='o' else '裏'),'https://www.mof.go.jp/policy/currency/bill/issued/so004.htm',['banknote-values']))
def fetch(t):
 url,name,title,context,tags=t;data=urllib.request.urlopen(url,timeout=25).read();im=Image.open(io.BytesIO(data));im.verify();im=Image.open(io.BytesIO(data));p=D/name;p.write_bytes(data)
 x={**seed[0]};x.update(id='rst31-service1-'+Path(name).stem,assetFile=str(p.relative_to(R)),width=im.width,height=im.height,sha256=hashlib.sha256(data).hexdigest(),captionJa=title+'。出典：財務省。',altJa=title+'を示す見本画像。',officialSourceUrl=url,officialContextUrl=context,factTags=tags,scopeLimits='公式の公開見本をそのまま表示する識別教材。実物大や印刷用データを提供しない。真贋判定や全有効図柄の網羅を保証しない。')
 x['rights']={**seed[0]['rights'],'attribution':'出典：財務省'};return x
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for t,res in zip(tasks,ex.map(fetch,tasks)):
  seed.append(res);print(res['id'],res['width'],res['height'])
(O/'official-assets.json').write_text(json.dumps(seed,ensure_ascii=False,indent=2)+'\n')
print('TOTAL',len(seed))
