#!/usr/bin/env python3
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
R=Path(__file__).resolve().parents[2];D=R/'src/data/food-manufacturing';out=R/'assets/food-manufacturing/source-practice46';out.mkdir(parents=True,exist_ok=True)
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def ft(n):return ImageFont.truetype(font,n)
def base(title):
 im=Image.new('RGB',(1400,900),'#fffdf5');d=ImageDraw.Draw(im);d.text((55,35),title,font=ft(40),fill='#173b50');return im,d
im,d=base('規格値と管理線：名称を区別する学習図')
ys=[170,290,450,610,730];labels=['上限規格値','UCL：上方管理限界','CL：管理中心線','LCL：下方管理限界','下限規格値']
for i,(y,label) in enumerate(zip(ys,labels)):
 color='#773f37' if i in [0,4] else '#247b9b'
 if i in [1,3]:
  for x in range(100,780,35):d.line((x,y,x+20,y),fill=color,width=4)
 else:d.line((100,y,780,y),fill=color,width=4)
 d.text((825,y-25),label,font=ft(32),fill=color)
pts=[(120,480),(220,420),(320,470),(420,390),(520,490),(620,440),(740,400)]
d.line(pts,fill='#2d607c',width=4)
for x,y in pts:d.ellipse((x-7,y-7,x+7,y+7),fill='#2d607c')
d.text((60,825),'架空の単位なし図：職場の規格値・管理限界値ではない',font=ft(30),fill='#173b50');im.save(out/'control-line-names.webp',quality=90)
im,d=base('特性要因図：同じ名前でも工程は違う')
d.line((120,460,1200,460),fill='#247b9b',width=6);d.polygon([(1200,460),(1175,445),(1175,475)],fill='#247b9b');d.text((1230,435),'結果',font=ft(36),fill='#173b50')
d.line((500,460,300,200),fill='#247b9b',width=5);d.line((900,460,700,730),fill='#247b9b',width=5)
d.text((220,140),'加熱',font=ft(40),fill='#173b50');d.text((650,755),'冷却',font=ft(40),fill='#173b50')
d.line((400,330,200,330),fill='#247b9b',width=4);d.text((100,285),'温度',font=ft(36),fill='#173b50')
d.line((800,595,1010,595),fill='#247b9b',width=4);d.text((1030,565),'温度',font=ft(36),fill='#173b50')
d.text((60,825),'枝は原因候補：工程ごとの現物・記録で確かめる',font=ft(30),fill='#173b50');im.save(out/'factor-process-context.webp',quality=90)
rows=[];lines=['import type {ImageSourcePropType} from "react-native";','export const foodSourcePractice46: {id:string;lessonId:string;lessonSourceHash:string;paragraphId:string;source:ImageSourcePropType;width:number;height:number;aspectRatio:number;captionSupplementId:string;captionSupplementSourceHash:string;altJa:string}[] = [']
for n,f,pid in [(47,'control-line-names','p3'),(48,'factor-process-context','p3')]:
 s=json.loads((D/f'source-closure{n}.json').read_text())['sections'][0];a={'id':'food-source46-'+f,'lessonId':s['lessonId'],'lessonSourceHash':s['lessonSourceHash'],'paragraphId':pid,'width':1400,'height':900,'captionSupplementId':s['id'],'captionSupplementSourceHash':s['sourceHash'],'altJa':s['titleJa']+'。'+s['textJa']}
 lines.append(' '+json.dumps(a,ensure_ascii=False)[:-1]+f',source:require("../../../assets/food-manufacturing/source-practice46/{f}.webp"),aspectRatio:1400/900}},')
 p=out/(f+'.webp');rows.append({'id':a['id'],'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'sourceRefs':s['sourceRefs'],'keyObjectiveId':s['id'],'width':1400,'height':900,'rights':'Original controlled illustration; no source artwork reproduced','nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False})
lines.append('];');(D/'source-practice46.ts').write_text('\n'.join(lines)+'\n');(R/'docs/ssw-workspace/food-manufacturing/atomic-qc-next-20261102/figures46-48.json').write_text(json.dumps({'newFigures':rows,'reusedFigure46':{'id':'food-source36-histogram-bin-comparison','lessonId':'food-2-043','purpose':'Already shows 0.1g measurement steps and 1.25g/1.35g boundaries; new check reads precision and width explicitly.'}},ensure_ascii=False,indent=2)+'\n')
print('Created2 controlled figures; one source-matched existing figure reused.')
