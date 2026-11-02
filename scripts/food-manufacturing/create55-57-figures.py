#!/usr/bin/env python3
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
R=Path(__file__).resolve().parents[2];font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def txt(d,x,y,s,n=26,c='#20384b'):d.text((x,y),s,font=ImageFont.truetype(font,n),fill=c)
figures=[]
# Original mass bars, not a source vegetable/scale illustration.
O=R/'assets/food-manufacturing/source-practice55';O.mkdir(parents=True,exist_ok=True);im=Image.new('RGB',(1400,880),'#fffaf0');d=ImageDraw.Draw(im);txt(d,65,30,'自作の重量比較：工程と分母をそろえる',36)
for row,(label,inp,out)in enumerate([('前処理',600,480),('加熱',500,430),('米基準の炊飯',150,360)]):
 y=145+row*205;txt(d,65,y,label,27)
 for k,(name,val,color)in enumerate([('投入',inp,'#879fa9'),('出来高',out,'#2a7c9e')]):
  yy=y+50+k*55;txt(d,85,yy,name,23);d.rectangle((230,yy,230+val*1.4,yy+34),fill=color);txt(d,250+val*1.4,yy,str(val)+'g',24)
txt(d,65,790,'全て架空の重さ。炊飯の分母150gは米のみで、加えた水を含まない。',25);p=O/'original-process-masses.webp';im.save(p,'WEBP',quality=90,method=6);figures.append((55,p,im.size))
O=R/'assets/food-manufacturing/source-practice57';O.mkdir(parents=True,exist_ok=True);im=Image.new('RGB',(1400,930),'#fffaf0');d=ImageDraw.Draw(im);txt(d,65,30,'同じ実重量でも、袋数と規格換算は異なる',36);txt(d,65,90,'自作条件：投入64kg／実重量60kg／規格40g／袋数販売／全袋が規格内',25)
x=320;scale=13
for row,(name,bags,nominal)in enumerate([('記録 A',1400,56),('記録 B',1500,60)]):
 y=200+row*300;txt(d,65,y,name,32);txt(d,65,y+48,str(bags)+'袋',27)
 for k,(label,val,color)in enumerate([('投入',64,'#c9cfd0'),('実重量',60,'#2a7c9e'),('規格換算',nominal,'#bd9142')]):
  yy=y+k*70;txt(d,170,yy,label,25);d.rectangle((x,yy,x+val*scale,yy+42),fill=color);txt(d,x+val*scale+20,yy+2,str(val)+'kg',25)
txt(d,65,840,'実機の達成保証ではない。重量規格を守る前提の計算比較。',27);p=O/'original-bag-value.webp';im.save(p,'WEBP',quality=90,method=6);figures.append((57,p,im.size))
for n,path,size in figures:
 s=json.loads((R/f'src/data/food-manufacturing/source-closure{n}.json').read_text())['sections'][0];row={'id':f'food-source{n}-{path.stem}','lessonId':s['lessonId'],'lessonSourceHash':s['lessonSourceHash'],'paragraphId':'p1'if n==55 else'p2','width':size[0],'height':size[1],'captionSupplementId':s['id'],'captionSupplementSourceHash':s['sourceHash'],'altJa':s['titleJa']+'。'+s['textJa']}
 ts='import type {ImageSourcePropType} from "react-native";\nexport const foodSourcePractice'+str(n)+': {id:string;lessonId:string;lessonSourceHash:string;paragraphId:string;source:ImageSourcePropType;width:number;height:number;aspectRatio:number;captionSupplementId:string;captionSupplementSourceHash:string;altJa:string}[] = [\n'+json.dumps(row,ensure_ascii=False)[:-1]+',source:require("../../../'+str(path.relative_to(R))+'"),aspectRatio:'+str(size[0])+'/'+str(size[1])+'},\n];\n';(R/f'src/data/food-manufacturing/source-practice{n}.ts').write_text(ts);print(json.dumps({'path':str(path.relative_to(R)),'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}))
