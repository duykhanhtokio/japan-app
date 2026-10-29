from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import os,hashlib
R=Path(__file__).resolve().parents[2];out=R/'assets/agriculture/diagrams/irrigation-destinations-v1.png'
font=os.environ.get('AGRICULTURE_DIAGRAM_FONT',str(R/'assets/app/fonts/NotoSansJP-Medium.ttf'))
assert hashlib.sha256(Path(font).read_bytes()).hexdigest()=='7b8bbb543db880657eca298118e701a09fadeaac3e417a5012040ec98336d9c2', 'Provide the actual approved NotoSansJP-Medium bytes via AGRICULTURE_DIAGRAM_FONT'
out.parent.mkdir(parents=True,exist_ok=True)
im=Image.new('RGB',(1000,1500),'#fffcf2');d=ImageDraw.Draw(im)
F=lambda n:ImageFont.truetype(font,n)
d.text((70,35),'かん水：水を届ける場所',font=F(47),fill='#173a33')
d.text((70,105),'三つの方法を比べる模式図',font=F(29),fill='#43584e')
def arrow(x1,y1,x2,y2):
 d.line((x1,y1,x2,y2),fill='#1578ad',width=6)
 import math
 a=math.atan2(y2-y1,x2-x1)
 d.polygon([(x2,y2),(x2-22*math.cos(a-.45),y2-22*math.sin(a-.45)),(x2-22*math.cos(a+.45),y2-22*math.sin(a+.45))],fill='#1578ad')
def plant(x,base):
 d.line((x,base,x,base-115),fill='#337141',width=9)
 d.ellipse((x-66,base-100,x-3,base-68),fill='#80aa58',outline='#337141',width=3)
 d.ellipse((x+3,base-131,x+66,base-99),fill='#80aa58',outline='#337141',width=3)
 d.line((x,base-82,x-40,base-84),fill='#337141',width=3)
 d.line((x,base-113,x+42,base-114),fill='#337141',width=3)
for i,(title,caption) in enumerate([('頭上かん水','上から葉や作物へ水をかける'),('株元かん水','株の根元へ水を届ける'),('うね間かん水','うねとうねの間へ水を流す')]):
 top=170+i*410
 d.rounded_rectangle((45,top,955,top+380),radius=24,fill='#f1f4e8',outline='#c5ccad',width=3)
 d.text((80,top+20),title,font=F(39),fill='#173a33')
 base=top+280
 if i<2:
  d.rectangle((110,base,855,base+24),fill='#b8966a')
  for x in (270,480,690):plant(x,base)
 else:
  for x in (260,660):
   d.polygon([(x-140,base+25),(x-110,base-15),(x+110,base-15),(x+140,base+25)],fill='#b8966a',outline='#94734d')
   plant(x,base-15)
  d.rectangle((400,base+5,520,base+25),fill='#59b4d1')
 if i==0:
  d.line((810,base+5,810,top+105,745,top+105),fill='#535e5b',width=12)
  for x in (265,365,470,575,675):
   arrow(745,top+110,x,top+167)
  d.text((735,top+58),'水',font=F(26),fill='#1578ad')
 elif i==1:
  d.line((150,base-5,815,base-5),fill='#535e5b',width=12)
  for x in (270,480,690):
   d.ellipse((x-5,base-20,x+5,base-10),fill='#1578ad');arrow(x+35,base-62,x+7,base-18)
 else:
  arrow(460,top+103,460,base+3)
  d.text((493,top+130),'水の通り道',font=F(25),fill='#1578ad')
 d.text((85,top+308),caption,font=F(30),fill='#173a33')
d.text((65,1420),'水量・時間・設置方法を指示する図ではありません。',font=F(26),fill='#596455')
im.save(out,optimize=True)
print(out)
