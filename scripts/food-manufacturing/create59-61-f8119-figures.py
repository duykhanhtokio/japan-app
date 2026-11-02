#!/usr/bin/env python3
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
R=Path(__file__).resolve().parents[2]
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def text(d,x,y,s,size=28):d.text((x,y),s,font=ImageFont.truetype(font,size),fill='#20384b')
for n in [60,61]:
 im=Image.new('RGB',(1400,940),'#fffaf0');d=ImageDraw.Draw(im)
 if n==60:
  text(d,60,35,'自作の段階診断：分母は工程ごとに変わる',36)
  for y,label,val,color in [(160,'A 投入',80,'#a0adb1'),(290,'A 良品 = B 投入',76,'#2a7c9e'),(420,'B 表示量換算',68.4,'#bd9142')]:
   text(d,60,y,label);d.rectangle((400,y,400+val*10,y+55),fill=color);text(d,420+val*10,y,str(val)+'kg')
  text(d,60,570,'A: 76 / 80 = 95%    B: 68.4 / 76 = 90%',32)
  text(d,60,650,'全体: 68.4 / 80 = 85.5%    = 0.95 × 0.90 × 100',30)
  text(d,60,750,'架空条件：A の他の重量増減なし／B は良品1368袋 × 表示50g',26)
  text(d,60,820,'不良ゼロ ≠ 改善不要。実重量・平均充填量も確認。',28)
  stem='original-stage-denominators'
 else:
  text(d,60,35,'自作の比較：同じ米でも、分母で評価が変わる',36)
  for y,label,total,out,cost in [(170,'P',8,7.2,'125.0'),(420,'Q',7.5,6.9,'130.4')]:
   text(d,65,y,label,36);text(d,180,y,f'投入 {total}kg → 製品 {out}kg',30)
   text(d,180,y+65,('全投入基準 90% ／ 米基準 240%'if label=='P'else'全投入基準 92% ／ 米基準 230%'),30)
   text(d,180,y+130,f'米原価のみ: 900円 / {out}kg '+('= 'if label=='P'else'≈ ')+f'{cost}円/kg',30)
  text(d,60,710,'両方：米3kg × 300円/kg = 900円',30)
  text(d,60,790,'設問限定：水原価ゼロ／同品質／他費用除外',27)
  text(d,60,850,'実工場の総原価・利益や、水の無償を意味しない。',27)
  stem='original-rice-cost-bases'
 O=R/f'assets/food-manufacturing/source-practice{n}-f8119';O.mkdir(parents=True,exist_ok=True);p=O/(stem+'.webp');im.save(p,'WEBP',quality=90,method=6)
 s=json.loads((R/f'src/data/food-manufacturing/source-closure{n}-f8119.json').read_text())['sections'][0];row={'id':f'food-source{n}-f8119-{stem}','lessonId':s['lessonId'],'lessonSourceHash':s['lessonSourceHash'],'paragraphId':'p2'if n==60 else'p3','width':1400,'height':940,'captionSupplementId':s['id'],'captionSupplementSourceHash':s['sourceHash'],'altJa':s['titleJa']+'。'+s['textJa']}
 (R/f'src/data/food-manufacturing/source-practice{n}-f8119.ts').write_text('import type {ImageSourcePropType} from "react-native";\nexport const foodSourcePractice'+str(n)+'f8119: {id:string;lessonId:string;lessonSourceHash:string;paragraphId:string;source:ImageSourcePropType;width:number;height:number;aspectRatio:number;captionSupplementId:string;captionSupplementSourceHash:string;altJa:string}[] = [\n'+json.dumps(row,ensure_ascii=False)[:-1]+',source:require("../../../'+str(p.relative_to(R))+'"),aspectRatio:1400/940},\n];\n')
 print(p.relative_to(R),p.stat().st_size,hashlib.sha256(p.read_bytes()).hexdigest())
