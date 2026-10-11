"""Exact calendar dates and map adjacency from historical source."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[3];INK='#263d49';LINE='#9b8052'
def canvas(w,h):
 im=Image.new('RGB',(w,h),'#fffaf1');d=ImageDraw.Draw(im)
 d.rounded_rectangle((24,24,w-24,h-24),18,fill='#fffdf8',outline=LINE,width=4)
 return im,d
def font(n):return ImageFont.truetype(str(ROOT/'assets/app/fonts/NotoSansJP-Medium.ttf'),n)
def t(d,s,x,y,n=36):d.text((x,y),s,font=font(n),fill=INK,anchor='mm')
def calendar():
 im,d=canvas(1240,1100);t(d,'3月',620,130,58)
 x0=270;y0=230;w=100;h=135
 for row in range(6):
  for col in range(7):d.rectangle((x0+col*w,y0+row*h,x0+(col+1)*w,y0+(row+1)*h),fill='#fff4db' if row==0 else '#fffdf8',outline=LINE,width=2)
 for c,(kan,kana) in enumerate(zip('月火水木金土日',['げつ','か','すい','もく','きん','ど','にち'])):
  t(d,kana,x0+c*w+50,y0+35,22);t(d,kan,x0+c*w+50,y0+85,43)
 for day in range(1,32):
  idx=day;row=idx//7+1;col=idx%7;t(d,str(day),x0+col*w+50,y0+row*h+67,44)
 for label,day,lx,ly in [(1,8,120,445),(2,4,1120,345),(3,22,120,790),(4,18,1120,650)]:
  row=day//7+1;col=day%7;x=x0+col*w+50;y=y0+row*h+67
  d.ellipse((x-42,y-43,x+42,y+43),outline=INK,width=3)
  d.line((lx+(35 if lx<620 else -35),ly,x+(-42 if lx<620 else 42),y),fill=INK,width=3);t(d,str(label),lx,ly,48)
 im.save(ROOT/'assets/jlpt-legacy-color/n5-2021-12-listening-p2-q3.png')
def cafe_map():
 im,d=canvas(1200,1050)
 d.rectangle((80,80,1120,970),fill='#f6eedb',outline=LINE,width=3)
 d.rectangle((80,330,1120,405),fill='#dce5e9');d.rectangle((540,405,650,970),fill='#dce5e9')
 d.rectangle((115,150,460,330),fill='#e3ead2',outline=LINE,width=3);t(d,'だいがく',287,205,26);t(d,'大学',287,265,48)
 d.rectangle((650,675,985,865),fill='#e3ead2',outline=LINE,width=3);t(d,'えき',817,730,27);t(d,'駅',817,790,52)
 cafes=[(1,460,215,585,330,670,125),(2,650,555,775,675,870,445),(3,415,775,540,905,335,850),(4,200,405,325,525,140,630)]
 for num,x0,y0,x1,y1,lx,ly in cafes:
  d.rectangle((x0,y0,x1,y1),fill='#f7d89b',outline=LINE,width=3)
  cx=(x0+x1)//2;cy=(y0+y1)//2+15
  # Coffee cup icon, same symbol at every candidate location.
  d.arc((cx+22,cy-23,cx+58,cy+15),260,100,fill=INK,width=6)
  d.pieslice((cx-40,cy-30,cx+40,cy+30),0,180,fill=INK);d.ellipse((cx-48,cy+20,cx+48,cy+30),fill=INK)
  px=x0+22;py=y0+22;d.line((lx,ly,px,py),fill=INK,width=3);d.ellipse((px-4,py-4,px+4,py+4),fill=INK);t(d,str(num),lx,ly-20,48)
 im.save(ROOT/'assets/jlpt-legacy-color/n5-2021-12-listening-p1-q4.png')
if __name__=='__main__':calendar();cafe_map()
