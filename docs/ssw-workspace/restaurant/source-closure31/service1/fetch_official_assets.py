from pathlib import Path
import urllib.request,hashlib,json,io
from PIL import Image
R=Path('/workspace/scratch/8c34e3cace7a/japan-app');D=R/'assets/restaurant/source31/service1';records=[]
for value,person,back in [(10000,'渋沢栄一','東京駅（丸の内駅舎）'),(5000,'津田梅子','フジ（藤）'),(1000,'北里柴三郎','富嶽三十六景「神奈川沖浪裏」')]:
 for side,ja,desc in [('o','表',person),('r','裏',back)]:
  url=f'https://www.mof.go.jp/policy/currency/bill/{value}_{side}.jpg';data=urllib.request.urlopen(url,timeout=30).read();im=Image.open(io.BytesIO(data));im.verify();im=Image.open(io.BytesIO(data))
  f=D/f'mof-2024-{value}-{side}.jpg';f.write_bytes(data)
  records.append({'id':f'rst31-service1-mof-{value}-{side}','lessonId':'rst-1-svc-17','factTags':['banknote-values','currency-old'],'assetFile':str(f.relative_to(R)),'svgFile':None,'width':im.width,'height':im.height,'sha256':hashlib.sha256(data).hexdigest(),'captionJa':f'2024年発行開始の{value:,}円券の{ja}。図柄：{desc}。出典：財務省。','altJa':f'{value:,}円券の{ja}の公式見本画像。{desc}が描かれている。','sourceRefs':[{'documentId':'rst-1-service','pdfPages':[32],'section':'現金の額面と現在の図柄の補足'}],'officialSourceUrl':url,'officialContextUrl':'https://www.mof.go.jp/policy/currency/bill/231212.html','rights':{'owner':'財務省','license':'公共データ利用規約 PDL1.0（財務省サイトの特記なしコンテンツ）','licenseUrl':'https://www.mof.go.jp/about_mof/notice/index.html','currencyGuidanceUrl':'https://www.mof.go.jp/faq/currency/07af.htm','attribution':'出典：財務省「新様式の日本銀行券の発行について」','byteIdenticalToOfficialDownload':True,'modifications':'none','useScope':'公式の公開済み見本画像を変更せず、通常のデジタル学習で額面・図柄の識別に表示。印刷用・実寸出力・高解像度化を提供しない。'},'scopeLimits':'公式の見本画像。真贋判定用ではない。全ての有効な旧券の図柄や二千円券を網羅するものではない。','authorPixelReviewed':False,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False})
(R/'docs/ssw-workspace/restaurant/source-closure31/service1/official-assets.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print([(r['id'],r['width'],r['height']) for r in records])
