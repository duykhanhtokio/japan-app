#!/usr/bin/env python3
"""Original plotted datasets, not a tracing of the source's eight-panel figure."""
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parents[2]
O=R/'assets/food-manufacturing/source-practice49';O.mkdir(parents=True,exist_ok=True)
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
im=Image.new('RGB',(1400,820),'#fffaf0');d=ImageDraw.Draw(im)
def text(x,y,s,n=26,c='#20384b'):d.text((x,y),s,font=ImageFont.truetype(font,n),fill=c)
text(65,25,'架空の2系列：線と点の順序を別々に確認する',36)
text(65,82,'学習用：CL = 0 / UCL = 10 / LCL = −10',25)
data={'A':[2,3,1,4,2,5,3,4,1],'B':[-3,-2,-1,0,1,2]}
for col,(label,values) in enumerate(data.items()):
 x0=95+col*665;y0=220;w=550;h=420
 text(x0,y0-68,label,36)
 def xy(i,v):return (x0+30+i*(w-60)/(len(values)-1),y0+h/2-v*h/24)
 for val,line in [(10,'UCL'),(0,'CL'),(-10,'LCL')]:
  y=y0+h/2-val*h/24
  if val==0:
   for x in range(x0,x0+w,18):d.line((x,y,min(x+9,x0+w),y),fill='#7b8790',width=2)
  else:d.line((x0,y,x0+w,y),fill='#71879b',width=2)
  text(x0+8 if val==0 else x0+w-52,y+6 if val==0 else y-32,line,20)
 pts=[xy(i,v) for i,v in enumerate(values)];d.line(pts,fill='#20739b',width=5)
 for i,((x,y),v) in enumerate(zip(pts,values)):
  d.ellipse((x-7,y-7,x+7,y+7),fill='#20739b',outline='white',width=2)
  text(x-10,y-36,str(v),20);text(x-8,y0+h+5,str(i+1),18)
 text(x0,y0+h+45,'記録した順番 →',24)
text(65,745,'実際の判定・処置は職場の基準と記録で確認する。原因は図だけで確定しない。',25)
p=O/'inside-limit-sequences.webp';im.save(p,'WEBP',quality=90,method=6)
print(json.dumps({'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'datasets':data,'sourceImageCopied':False}))
