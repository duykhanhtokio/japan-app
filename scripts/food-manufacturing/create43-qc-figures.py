#!/usr/bin/env python3
"""Original controlled graphs; synthetic unitless histogram bins, no PDF artwork."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
R=Path(__file__).resolve().parents[2];out=R/'assets/food-manufacturing/source-practice43';out.mkdir(parents=True,exist_ok=True)
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def ft(n):return ImageFont.truetype(font,n)
def base(title):
 im=Image.new('RGB',(1400,900),'#fffdf5');d=ImageDraw.Draw(im);d.text((60,30),title,font=ft(42),fill='#173b50');return im,d
def bars(d,values,x,y,w,h,color):
 mx=max(values);bw=w/len(values)
 d.line((x,y,x,y+h,x+w,y+h),fill='#173b50',width=4)
 for i,v in enumerate(values):
  bh=v/mx*(h-30)
  d.rectangle((x+i*bw+5,y+h-bh,x+(i+1)*bw-5,y+h),fill=color)
# 43: arbitrary category order retained; all numbers exactly from teaching scenario.
im,d=base('棒グラフ：項目順は目的で決める')
x,y,w,h=180,170,1020,510
for v in range(0,11,2):
 yy=y+h-v/10*h;d.line((x,yy,x+w,yy),fill='#d9e3e8',width=2);d.text((125,yy-20),str(v),font=ft(30),fill='#173b50')
d.line((x,y,x,y+h,x+w,y+h),fill='#173b50',width=4)
for i,(k,v) in enumerate(zip('XYZ',[4,9,2])):
 xx=x+80+i*340;d.rectangle((xx,y+h-v/10*h,xx+170,y+h),fill='#2c7d9a');d.text((xx+70,y+h+25),k,font=ft(38),fill='#173b50');d.text((xx+70,y+h-v/10*h-50),str(v),font=ft(34),fill='#173b50')
d.text((65,110),'件数',font=ft(32),fill='#173b50');d.text((1070,750),'不良の項目',font=ft(32),fill='#173b50');d.text((60,820),'架空例：X=4件・Y=9件・Z=2件',font=ft(30),fill='#173b50');im.save(out/'bar-order.webp',quality=90)
# 44: explicitly constructed groups sum to a broad plateau; no universal shape claim.
series=[[0,2,4,5,4,2,0,0,0,0,0,0],[0,0,0,1,3,5,5,3,1,0,0,0],[0,0,0,0,0,0,2,4,5,4,2,0]]
im,d=base('集団を分ける前と後：架空の分布')
colors=['#247b9b','#d88830','#7b5ca5'];total=[sum(z) for z in zip(*series)]
bars(d,total,130,140,1100,260,'#247b9b');d.text((100,410),'全体：広く平らに見える',font=ft(30),fill='#173b50')
for i,a in enumerate(series):
 bars(d,a,100+i*440,530,350,200,colors[i]);d.text((190+i*440,755),'ABC'[i],font=ft(34),fill='#173b50')
d.text((70,830),'横：測定値の階級　縦：頻度　／　架空の単位なしデータ',font=ft(28),fill='#173b50');im.save(out/'plateau-groups.webp',quality=90)
# 45: separated data are a question, not proof of which hypothesis caused them.
im,d=base('離れ小島型：形だけで原因を固定しない')
bars(d,[0,2,6,9,6,2,0,0,0,1,2,1],150,170,1100,460,'#247b9b')
d.text((190,690),'集団の混ざり？',font=ft(36),fill='#173b50');d.text((760,690),'測定方法の誤り？',font=ft(36),fill='#173b50')
d.text((65,775),'元データ・測定方法・単位・記録を確認する',font=ft(32),fill='#173b50');d.text((65,835),'横：測定値の階級　縦：頻度　／　架空の単位なしデータ',font=ft(28),fill='#173b50');im.save(out/'island-method.webp',quality=90)
D=R/'src/data/food-manufacturing';lines=['import type {ImageSourcePropType} from "react-native";','export const foodSourcePractice43: {id:string;lessonId:string;lessonSourceHash:string;paragraphId:string;source:ImageSourcePropType;width:number;height:number;aspectRatio:number;captionSupplementId:string;captionSupplementSourceHash:string;altJa:string}[] = [']
records=[]
for n,file in zip([43,44,45],['bar-order','plateau-groups','island-method']):
 s=json.loads((D/f'source-closure{n}.json').read_text())['sections'][0]
 a={'id':'food-source43-'+file,'lessonId':s['lessonId'],'lessonSourceHash':s['lessonSourceHash'],'paragraphId':'p1','width':1400,'height':900,'captionSupplementId':s['id'],'captionSupplementSourceHash':s['sourceHash'],'altJa':s['titleJa']+'。'+s['textJa']}
 lines.append(' '+json.dumps(a,ensure_ascii=False)[:-1]+f',source:require("../../../assets/food-manufacturing/source-practice43/{file}.webp"),aspectRatio:1400/900}},')
 p=out/(file+'.webp');records.append({'id':a['id'],'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'width':1400,'height':900,'sourceRefs':s['sourceRefs'],'keyObjectiveId':s['id'],'rights':'Original controlled drawing and synthetic data; no source artwork copied','translatedCaptionLocales':12,'sourceLabelsJa':True,'physicalDeviceTested':False})
lines.append('];');(D/'source-practice43.ts').write_text('\n'.join(lines)+'\n')
(R/'docs/ssw-workspace/food-manufacturing/atomic-qc-20261102/figures43-45.json').write_text(json.dumps({'records':records,'syntheticHistogram44Groups':series,'syntheticHistogram44Total':total},ensure_ascii=False,indent=2)+'\n')
print('Created three original 1400×900 controlled graphs.')
