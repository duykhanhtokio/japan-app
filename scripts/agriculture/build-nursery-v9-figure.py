"""Independent instructional grouping diagram; no PDF image/prose input or species diagnosis."""
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import math
root=Path(__file__).resolve().parents[2]
out=root/'assets/agriculture/nursery-v9/nursery-crop-groups.png';out.parent.mkdir(parents=True,exist_ok=True)
im=Image.new('RGB',(1400,1000),'#fffaf0');d=ImageDraw.Draw(im)
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def txt(x,y,s,size=28,fill='#203c32',anchor='mm'):d.text((x,y),s,font=ImageFont.truetype(font,size),fill=fill,anchor=anchor)
def line(points,color='#547b3b',width=7):d.line(points,fill=color,width=width,joint='curve')
def leaf(x,y,a=0,s=1):
 pts=[]
 for t in range(33):
  q=t*math.pi/16;xx=math.cos(q)*28*s;yy=math.sin(q)*11*s;pts.append((x+xx*math.cos(a)-yy*math.sin(a),y+xx*math.sin(a)+yy*math.cos(a)))
 d.polygon(pts,fill='#72a64e')
def stem(x,y):
 line([(x,y),(x,y-106)]);leaf(x-20,y-62,-.4);leaf(x+20,y-82,.4)
def rice(x,y):
 for off in [-25,0,25]:
  line([(x,y),(x+off,y-100),(x+off+12,y-151)],width=4)
  line([(x+off,y-83),(x+off-36,y-129)],width=4)
  for j in range(6):d.ellipse((x+off+8-j,y-155+j*9,x+off+21-j,y-146+j*9),fill='#d2ab47')
def tomato(x,y):
 stem(x,y)
 for xx,yy in [(x-25,y-93),(x+27,y-47)]:d.ellipse((xx-15,yy-15,xx+15,yy+15),fill='#ce5944')
def cucumber(x,y):
 stem(x,y);d.rounded_rectangle((x+20,y-72,x+43,y-11),radius=10,fill='#477e39');d.arc((x-31,y-135,x+4,y-99),180,340,fill='#477e39',width=3)
def cabbage(x,y,loose=False):
 for i in range(7):
  a=2*math.pi*i/7;cx=x+math.cos(a)*25;cy=y-34+math.sin(a)*24
  d.ellipse((cx-25,cy-36,cx+25,cy+27),fill='#70a657' if i%2 else '#8dbf6f',outline='#416e3d',width=2)
 if not loose:d.ellipse((x-22,y-57,x+23,y-9),fill='#b9d69d',outline='#416e3d',width=2)
def tree(x,y):
 d.rectangle((x-9,y-100,x+9,y),fill='#8e6745')
 for dx,dy in [(-36,-98),(32,-108),(0,-142)]:d.ellipse((x+dx-44,y+dy-37,x+dx+44,y+dy+37),fill='#70a15a')
 for dx,dy in [(-30,-98),(26,-108),(1,-152)]:d.ellipse((x+dx-8,y+dy-8,x+dx+8,y+dy+8),fill='#d69f42')
def flower(x,y):
 stem(x,y)
 for i in range(6):
  a=i*math.pi/3;cx=x+math.cos(a)*22;cy=y-124+math.sin(a)*22;d.ellipse((cx-17,cy-17,cx+17,cy+17),fill='#cf83a1')
 d.ellipse((x-12,y-136,x+12,y-112),fill='#dfbb50')
txt(700,48,'育苗（いくびょう）の掲載例を五つの群で整理する',38)
txt(700,100,'作物のグループと具体例を対応させる独自の模式図',26)
# Two large vegetable comparisons and three supporting crop categories: not source layout.
boxes=[(45,154,450,510),(497,154,902,510),(949,154,1354,510),(270,554,675,910),(723,554,1128,910)]
for b in boxes:d.rounded_rectangle(b,radius=24,fill='white',outline='#c6ba94',width=3)
for i,(title,sub) in enumerate([('イネ','いね'),('果菜類','かさいるい'),('葉菜類','ようさいるい'),('果樹','かじゅ'),('花き','かき')]):
 x=(boxes[i][0]+boxes[i][2])/2;y=boxes[i][1];txt(x,y+39,title,33);txt(x,y+77,sub,22)
rice(245,430);txt(245,477,'イネ',27)
tomato(610,425);cucumber(787,425);txt(610,477,'トマト',26);txt(787,477,'キュウリ',26)
cabbage(1060,425);cabbage(1240,425,True);txt(1060,477,'キャベツ',26);txt(1240,477,'レタス',26)
tree(472,835);txt(472,879,'果樹の例',26)
flower(925,838);txt(925,879,'花きの例',26)
txt(700,958,'掲載例です。全作物・全品種に共通する育苗の指示や、外観だけの品種判定ではありません。',23)
im.save(out,optimize=True)
print(out)
