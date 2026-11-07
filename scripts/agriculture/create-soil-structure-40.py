from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import math,os,hashlib
R=Path(__file__).resolve().parents[2];im=Image.new('RGB',(1000,1200),'#fffdf3');d=ImageDraw.Draw(im);F=lambda n:ImageFont.truetype(os.environ.get('AGRICULTURE_DIAGRAM_FONT',str(R/'assets/app/fonts/NotoSansJP-Medium.ttf')),n)
d.text((65,30),'単粒構造と団粒構造',font=F(48),fill='#193e35');d.text((65,102),'独立した断面模式図で比べる',font=F(29),fill='#536555')
for i,title in enumerate(['単粒構造','団粒構造']):
 top=170+i*450;d.rounded_rectangle((45,top,955,top+420),radius=25,fill='#f1eee0',outline='#c6bea8',width=3);d.text((80,top+20),title,font=F(38),fill='#193e35')
 if i==0:
  d.rectangle((100,top+85,895,top+300),fill='#d2bd95')
  for row in range(8):
   for col in range(33):
    x=110+col*24+(row%2)*10;y=top+97+row*26
    if x<885:d.ellipse((x-10,y-10,x+10,y+10),fill=['#aa8054','#b99264','#98734e'][(row+col)%3],outline='#785d3f',width=1)
  d.text((80,top+325),'小さな粒が詰まった状態を示す',font=F(30),fill='#193e35')
 else:
  for cx,cy in [(165,top+135),(380,top+135),(600,top+135),(820,top+135),(270,top+250),(500,top+250),(730,top+250)]:
   for a in range(7):
    x=cx+math.cos(a*math.tau/7)*34;y=cy+math.sin(a*math.tau/7)*25
    d.ellipse((x-21,y-19,x+21,y+19),fill='#a78053',outline='#785d3f',width=2)
   d.ellipse((cx-22,cy-20,cx+22,cy+20),fill='#ba9768',outline='#785d3f',width=2)
  d.text((80,top+325),'粒が集まった団粒と、その間のすき間',font=F(29),fill='#193e35')
d.text((65,1095),'粒の大きさ・割合・測定値を表す図ではありません。',font=F(26),fill='#596657')
p=R/'assets/agriculture/diagrams/soil-aggregate-comparison-v1.png';im.save(p,optimize=True);print(p)
