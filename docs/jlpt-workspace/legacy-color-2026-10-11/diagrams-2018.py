"""Literal historical diagrams: preserve labels, numbers and geometry."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[3]
INK='#263d49';LINE='#9b8052';CREAM='#fffaf1'
def canvas(w,h):
 im=Image.new('RGB',(w,h),CREAM);d=ImageDraw.Draw(im)
 d.rounded_rectangle((24,24,w-24,h-24),18,fill='#fffdf8',outline=LINE,width=4)
 return im,d
def font(n):return ImageFont.truetype(str(ROOT/'assets/app/fonts/NotoSansJP-Medium.ttf'),n)
def text(d,s,x,y,n=34,anchor='mm'):d.text((x,y),s,font=font(n),fill=INK,anchor=anchor)
def save(im,id):im.save(ROOT/f'assets/jlpt-legacy-color/n5-2018-12-{id}.png')
def routes():
 im,d=canvas(1440,1500)
 rows=[(46,300,['寺西駅','バスてい','1ばん'],'バス',45,['バスてい','「高木大学前」'],1),(30,550,['花田駅'],'電車',25,['水村駅'],5),(40,450,['花田駅'],'ちかてつ',30,['木山駅'],10),(35,430,['糸川駅'],'電車',25,['木山駅'],10)]
 for i,(total,cost,start,kind,ride,mid,walk) in enumerate(rows):
  y=60+i*355
  text(d,f'{i+1}  かかる 時間：{total} 分',70,y+40,34,'lm');text(d,f'かかる お金：{cost} 円',720,y+40,34,'lm')
  cy=y+195
  d.line((345,cy,1095,cy),fill='#7c9486',width=12)
  for x,words in [(70,start),(585,mid),(1095,['高木大学'])]:
   d.rectangle((x,y+100,x+275,y+290),fill='#fff4d9',outline=LINE,width=3)
   for j,s in enumerate(words):text(d,s,x+137,cy+(j-(len(words)-1)/2)*47,33)
  text(d,kind,465,cy-55,32);text(d,f'{ride} 分',465,cy+55,32)
  text(d,'歩く',978,cy-55,32);text(d,f'{walk} 分',978,cy+55,32)
  if i<3:d.line((60,y+332,1380,y+332),fill=LINE,width=2)
 save(im,'grammar-reading-p6-q1')
def calendar():
 im,d=canvas(1200,1000)
 d.rounded_rectangle((190,100,1010,900),15,fill='#fffcf5',outline=LINE,width=4)
 d.line((600,100,600,900),fill=LINE,width=4);text(d,'9月',245,143,32)
 left=['2 月','3 火','4 水','5 木','6 金','7 土','8 日'];right=['9 月','10 火','11 水','12 木','13 金','14 土','15 日']
 for i,(a,b) in enumerate(zip(left,right)):
  y=210+i*95
  text(d,a.split()[0],310,y,40);text(d,a.split()[1],370,y,40);text(d,b.split()[0],732,y,40);text(d,b.split()[1],805,y,40)
  d.line((200,y+45,590,y+45),fill=LINE,width=2);d.line((610,y+45,1000,y+45),fill=LINE,width=2)
 for label,x,y,lx,ly in [(1,310,400,100,420),(2,732,210,1095,180),(3,310,590,100,650),(4,732,305,1095,300)]:
  d.ellipse((x-39,y-33,x+33,y+33),outline=INK,width=3)
  d.line((lx+(-35 if lx>600 else 35),ly,x+(33 if lx>600 else -39),y),fill=INK,width=3);text(d,str(label),lx,ly,46)
 save(im,'listening-p1-q3')
def school_map():
 im,d=canvas(1200,1000)
 d.rectangle((90,90,1110,650),fill='#f5edda',outline=LINE,width=3)
 d.rectangle((550,90,650,650),fill='#dce5e9');d.rectangle((90,335,1110,425),fill='#dce5e9')
 for r in [(90,90,550,335),(650,90,1110,335),(90,425,550,650),(650,425,1110,650)]:d.rectangle(r,outline=LINE,width=3)
 for num,x,y in [(1,340,285),(2,870,285),(3,165,490),(4,1035,490)]:
  d.rectangle((x-35,y-36,x+35,y+36),fill='#fffdf8',outline=LINE,width=3);text(d,str(num),x,y,43)
 for x in [320,875]:
  d.rectangle((x-125,430,x+125,555),fill='#f7d89b',outline=LINE,width=3);text(d,'ぎんこう',x,492,38)
 # Two neutral diagram figures discussing below the map, preserving source count.
 d.ellipse((300,685,900,935),fill='#e6ecd8')
 for x,mirror in [(475,1),(730,-1)]:
  d.ellipse((x-45,710,x+45,800),fill='#edc4a0',outline=INK,width=3)
  d.pieslice((x-48,707,x+48,790),180,360,fill='#594838')
  d.rounded_rectangle((x-75,805,x+75,922),18,fill='#88a6ad' if mirror==1 else '#dba58e',outline=INK,width=3)
  d.line((x+mirror*35,835,x+mirror*90,800),fill=INK,width=5)
 save(im,'listening-p1-q1')
if __name__=='__main__':routes();calendar();school_map()
