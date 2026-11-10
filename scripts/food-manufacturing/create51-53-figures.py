#!/usr/bin/env python3
"""Controlled original numeric examples, never source artwork tracing."""
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import json,hashlib
R=Path(__file__).resolve().parents[2];O=R/'assets/food-manufacturing/source-practice51';O.mkdir(parents=True,exist_ok=True)
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def canvas(size):
 im=Image.new('RGB',size,'#fffaf0');return im,ImageDraw.Draw(im)
def txt(d,x,y,s,n=24):d.text((x,y),s,font=ImageFont.truetype(font,n),fill='#20384b')
series={'E':[1,2,11],'F':[1,-1]*7,'G':[8.5,1,9],'H':[8.5,9,1,8.5,9],'I':[-1,0,1]*5,'J':[3,-3,4,-4,3,-3,4,-4]}
im,d=canvas((1500,1460));txt(d,55,25,'学習用の連続記録 E〜J：数値は自作の仮定',34);txt(d,55,78,'CL=0 / UCL=10 / LCL=−10　中心付近：−2〜2　限界付近：8以上・−8以下',24)
for k,(name,vals)in enumerate(series.items()):
 x=70+(k%2)*750;y=170+(k//2)*395;w=610;h=270
 txt(d,x,y-24,name,32)
 def xy(i,v):return x+30+i*(w-60)/max(1,len(vals)-1),y+40+h/2-v*h/26
 # Shaded central range is fictional and labelled in title.
 d.rectangle((x,y+40+h/2-2*h/26,x+w,y+40+h/2+2*h/26),fill='#e8eee5')
 for v,label in [(10,'UCL'),(0,'CL'),(-10,'LCL')]:
  yy=y+40+h/2-v*h/26;d.line((x,yy,x+w,yy),fill='#80909c',width=2);txt(d,x+w+8,yy-12,label,18)
 points=[xy(i,v)for i,v in enumerate(vals)];d.line(points,fill='#20739b',width=4)
 for i,((xx,yy),v)in enumerate(zip(points,vals)):
  d.ellipse((xx-5,yy-5,xx+5,yy+5),fill='#20739b');txt(d,xx-7,yy-26,str(v),17)
 txt(d,x,y+335,'記録順 →　'+str(len(vals))+'点',20)
txt(d,55,1390,'「近い」範囲は練習だけの設定。実際は職場の管理基準を確認する。',25)
p=O/'six-original-series.webp';im.save(p,'WEBP',quality=90,method=6)
# The progress diagram is new data and a new layout, not the source example.
O2=R/'assets/food-manufacturing/source-practice53';O2.mkdir(parents=True,exist_ok=True)
im,d=canvas((1400,1000));txt(d,65,25,'自作の進捗図：標準速度 3kg/分',36);txt(d,65,82,'練習の許容幅：標準±10kg（0分では0以上）',25)
x0,y0,w,h=150,180,1090,610
xy=lambda t,v:(x0+t/30*w,y0+h-v/110*h)
poly=[xy(t,max(0,3*t-10))for t in range(31)]+[xy(t,3*t+10)for t in reversed(range(31))];d.polygon(poly,fill='#e2e9dc')
for q in [0,30,60,90]:
 xx,yy=xy(0,q);d.line((x0,yy,x0+w,yy),fill='#c3cbd0',width=1);txt(d,85,yy-15,str(q),22)
for t in [0,10,20,30]:xx,yy=xy(t,0);txt(d,xx-8,yy+15,str(t),23)
d.line([xy(t,3*t)for t in range(31)],fill='#6d8051',width=4)
actual=[(0,0),(10,40),(20,65),(30,80)];points=[xy(t,q)for t,q in actual];d.line(points,fill='#20739b',width=6)
for (t,q),(xx,yy)in zip(actual,points):d.ellipse((xx-7,yy-7,xx+7,yy+7),fill='#20739b');txt(d,xx-20,yy-37,str(q),24)
txt(d,60,130,'累積出来高（kg）',25);txt(d,1050,850,'経過時間（分）',25);txt(d,160,900,'緑：標準線　薄緑：仮定の許容幅　青：実績線',27)
p2=O2/'original-progress.webp';im.save(p2,'WEBP',quality=90,method=6)
for n,path in [(51,p),(53,p2)]:
 pack=json.loads((R/f'src/data/food-manufacturing/source-closure{n}.json').read_text());s=pack['sections'][0];size=Image.open(path).size;name=path.stem;row={'id':f'food-source{n}-{name}','lessonId':s['lessonId'],'lessonSourceHash':s['lessonSourceHash'],'paragraphId':'p3','width':size[0],'height':size[1],'captionSupplementId':s['id'],'captionSupplementSourceHash':s['sourceHash'],'altJa':s['titleJa']+'。'+s['textJa']}
 data='import type {ImageSourcePropType} from "react-native";\nexport const foodSourcePractice'+str(n)+': {id:string;lessonId:string;lessonSourceHash:string;paragraphId:string;source:ImageSourcePropType;width:number;height:number;aspectRatio:number;captionSupplementId:string;captionSupplementSourceHash:string;altJa:string}[] = [\n'+json.dumps(row,ensure_ascii=False)[:-1]+',source:require("../../../'+str(path.relative_to(R))+'"),aspectRatio:'+str(size[0])+'/'+str(size[1])+'},\n];\n'
 (R/f'src/data/food-manufacturing/source-practice{n}.ts').write_text(data);print(json.dumps({'n':n,'path':str(path.relative_to(R)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size,'sourceImageCopied':False}))
