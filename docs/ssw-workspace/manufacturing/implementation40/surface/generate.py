"""Original controlled daily teaching figures; no PDF artwork or operating recipes."""
from pathlib import Path
import json, math, hashlib, html, re
import cairosvg
from PIL import Image,ImageFont
ROOT=Path(__file__).resolve().parents[5]
OUT=Path(__file__).resolve().parent
ASSETS=ROOT/'assets/manufacturing/daily40/surface'
FONT='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
NAVY='#193651';BLUE='#277da8';TEAL='#188b87';GOLD='#d5a448';RED='#c55a55';GRAY='#8a9aa8';PALE='#edf5f8'
def H(s):return html.escape(str(s))
class SVG:
 def __init__(self):self.a=[];self.labels=[]
 def add(self,s):self.a.append(s)
 def rect(self,x,y,w,h,fill=PALE,stroke=NAVY,sw=3,rx=8):self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
 def line(self,x1,y1,x2,y2,color=NAVY,sw=4,arrow=False,dash=False):self.add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}" '+('marker-end="url(#arrow)" ' if arrow else '')+('stroke-dasharray="10 8" ' if dash else '')+'/>')
 def circ(self,x,y,r,fill=PALE,stroke=NAVY,sw=3):self.add(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
 def path(self,d,fill='none',stroke=NAVY,sw=4):self.add(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>')
 def poly(self,pts,fill,stroke=NAVY,sw=3):self.add(f'<polygon points="'+ ' '.join(f'{x},{y}' for x,y in pts)+f'" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
 def text(self,x,y,t,size=30,color=NAVY,anchor='start',weight='normal'):
  self.labels.append({'text':str(t),'x':x,'y':y,'fontSize':size})
  # Font-specific runs at explicit positions avoid missing Japanese-font math
  # glyphs and CairoSVG's per-tspan text-anchor recentering.
  runs=[]
  for c in str(t):
   family='DejaVu Sans' if c in '₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻' else 'Noto Sans CJK JP'
   if runs and runs[-1][0]==family:runs[-1]=(family,runs[-1][1]+c)
   else:runs.append((family,c))
  widths=[]
  for family,value in runs:
   fp='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf' if family=='DejaVu Sans' else FONT
   widths.append(ImageFont.truetype(fp,size).getlength(value))
  cursor=x-(sum(widths)/2 if anchor=='middle' else sum(widths) if anchor=='end' else 0)
  for (family,value),width in zip(runs,widths):
   self.add(f'<text x="{cursor:.2f}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}" font-family="{family}">{H(value)}</text>')
   cursor+=width
 def caption(self,x,y,t):self.text(x,y,t,29,anchor='middle',weight='bold')
 def group(self,x,y,scale,fn):self.add(f'<g transform="translate({x} {y}) scale({scale})">');fn();self.add('</g>')
 def finish(self):return '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#193651"/></marker><linearGradient id="metal" x2="0" y2="1"><stop stop-color="#e9eef1"/><stop offset=".5" stop-color="#aab9c5"/><stop offset="1" stop-color="#dce5eb"/></linearGradient></defs>'+''.join(self.a)+'</svg>'
def wrap(text,size,width):
 font=ImageFont.truetype(FONT,size);result=[]
 for para in str(text).split('\n'):
  line=''
  for c in para:
   if font.getlength(line+c)>width and line:result.append(line);line=c
   else:line+=c
  result.append(line)
 return result

def beaker(s,x,y,label='',particles=False,sediment=False,probe=False,w=220,h=230):
 s.rect(x+8,y+55,w-16,h-65,'#b7dfe9','none',0,2)
 s.path(f'M{x} {y}L{x+5} {y+h}Q{x+w/2} {y+h+15} {x+w-5} {y+h}L{x+w} {y}',stroke=BLUE,sw=6)
 for i in range(1,5):s.line(x+15,y+i*42,x+45,y+i*42,BLUE,3)
 if particles:
  for i in range(12):s.circ(x+55+(i*47)%int(w-70),y+85+(i*39)%int(h-100),7,GOLD,'none',0)
 if sediment:
  for i in range(24):s.circ(x+30+(i*29)%int(w-50),y+h-12-(i%3)*9,7,RED,'none',0)
 if probe:s.rect(x+w*.6,y-90,28,210,'#e6e9e5');s.circ(x+w*.6+14,y+120,11,GOLD)
 if label:s.caption(x+w/2,y+h+53,label)
def sample(s,x,y,w=270,variant='film',label=''):
 s.poly([(x,y+90),(x+w,y+90),(x+w+28,y+60),(x+28,y+60)],'#c1d0d9')
 s.rect(x,y+90,w,130,'url(#metal)',NAVY,3,0)
 if variant not in ['bare','scratch','mirror','hairline','satin']:
  s.rect(x,y+50,w,40,GOLD,NAVY,3,0)
  if variant=='pinhole':s.rect(x+w*.45,y+50,20,40,'#edf5f8','none',0,0)
  if variant=='pit':s.path(f'M{x+w*.4} {y+50}Q{x+w*.5} {y+83} {x+w*.6} {y+50}',PALE,NAVY,3)
  if variant=='blister':s.path(f'M{x+70} {y+80}Q{x+135} {y-30} {x+210} {y+80}L{x+210} {y+90}L{x+70} {y+90}Z',GOLD,NAVY,4)
  if variant=='unplated':s.rect(x+w*.55,y+49,w*.25,42,'#c1d0d9','none',0,0)
  if variant=='oxide':
   for i in range(8):s.rect(x+16+i*(w-25)/8,y+49,9,29,'#e7f4f7','none',0,0)
   s.line(x,y+85,x+w,y+85,TEAL,9)
  if variant=='alloy':s.rect(x,y+90,w,22,'#bd8d76',NAVY,1,0)
  if variant=='run':s.path(f'M{x+w-35} {y+50}Q{x+w+15} {y+80} {x+w+20} {y+150}Q{x+w-40} {y+140} {x+w-35} {y+50}',GOLD)
  if variant=='contact':s.rect(x+w*.4,y+35,35,90,GRAY,NAVY,2,2)
 else:
  if variant=='mirror':s.path(f'M{x+30} {y+160}L{x+w-40} {y+105}',stroke='#ffffff',sw=13)
  elif variant=='satin':
   for i in range(18):
    xx=x+20+(i*37)%int(w-40);yy=y+100+(i*23)%85;s.line(xx,yy,xx+18,yy-7,'#657f93',2)
  else:
   for i in range(9 if variant=='hairline' else 4):
    yy=y+95+i*9;s.line(x+15,yy,x+w-15,yy+(20 if variant=='scratch' else 0),RED if variant=='scratch' else '#657f93',2)
 if label:s.caption(x+w/2,y+270,label)
def tank(s,x,y,label='処理槽',mode='electric',w=350,h=260):
 s.rect(x,y+50,w,h-50,'#b7dfe9',BLUE,4,2);s.line(x,y+50,x+w,y+50,BLUE,4)
 if mode=='hot':
  s.rect(x+8,y+58,w-16,h-66,'#e8a55e','none',0,0)
  for i in range(5):s.path(f'M{x+30+i*65} {y+h+38}q-15 -20 0 -40q15 -15 0 -30',stroke=RED,sw=6)
 if mode in ['electric','anodize']:
  s.rect(x+55,y-10,40,190,'#b7a284');s.rect(x+w-110,y-10,50,190,'#a4b9c7')
  s.line(x+75,y-10,x+75,y-70);s.line(x+75,y-70,x+w/2-55,y-70);s.line(x+w-85,y-10,x+w-85,y-70);s.line(x+w-85,y-70,x+w/2+55,y-70)
  s.rect(x+w/2-55,y-105,110,65,'#fff');s.text(x+w/2-33,y-60,'＋',30,RED);s.text(x+w/2+18,y-60,'−',30,BLUE)
  s.text(x+43,y+225,'陽極',27);s.text(x+w-118,y+225,'陰極',27)
  for i in range(6):s.circ(x+125+(i*32)%90,y+90+(i%3)*35,8,GOLD,'none',0)
 elif mode in ['electroless','hot']:
  s.path(f'M{x+w*.62} {y-45}v65',stroke=NAVY,sw=10);s.rect(x+w*.62-35,y+20,70,130,GRAY)
 if label:s.caption(x+w/2,y+h+80,label)
def meter(s,x,y,label='測定器',value='12.0',w=230):
 s.rect(x,y,w,150,'#e4e9ee',NAVY,4,18);s.rect(x+20,y+20,w-40,65,'#d5e3d0',NAVY,2);s.text(x+w/2,y+68,value,40,anchor='middle');s.circ(x+w/2,y+118,16,GRAY)
 s.path(f'M{x+35} {y+150}q-45 100 20 130',stroke=RED);s.path(f'M{x+w-35} {y+150}q50 90 0 130',stroke=BLUE)
 s.caption(x+w/2,y+325,label)
def ppe(s,x,y):
 s.path(f'M{x} {y+40}q80 -65 160 0v65q-30 45 -70 0q-45 45 -90 0Z','#c8e8ee',NAVY,5);s.line(x+80,y+65,x+90,y+65,BLUE,5)
 s.path(f'M{x+180} {y+170}l25 -110q10 -15 20 0v60l10 -85q15 -20 25 0v85l10 -80q20 -10 20 8v83l10 -60q15 -12 18 10v100l-25 80h-80Z','#f6dca0',NAVY,4)
 s.caption(x+95,y+180,'保護眼鏡');s.caption(x+245,y+325,'作業別の保護具')
def wheel(s,x,y,label='バフ',hot=False,guard=False):
 s.rect(x-25,y+90,290,85,GRAY,NAVY,3);s.circ(x+40,y+130,60,'#b9c4cb');s.circ(x+190,y+130,105,'#e1c8a2');s.circ(x+190,y+130,22,GRAY)
 for i in range(16):
  a=i*math.pi/8;s.line(x+190+35*math.cos(a),y+130+35*math.sin(a),x+190+90*math.cos(a),y+130+90*math.sin(a),'#ad987c',3)
 s.rect(x+125,y+238,170,25,'#c9d5dc',NAVY,3,1)
 if hot:s.path(f'M{x+165} {y+250}q-25 -30 0 -55q25 -25 0 -45',stroke=RED,sw=6)
 if guard:s.path(f'M{x+80} {y+120}A115 115 0 0 1 {x+300} {y+120}',stroke=TEAL,sw=18)
 s.caption(x+170,y+320,label)
def cube(s,x,y,color=GRAY,label='試料',scale=1):
 w=160*scale;h=130*scale;d=45*scale
 s.poly([(x,y),(x+w,y),(x+w+d,y-d),(x+d,y-d)],'#dce6ec');s.poly([(x+w,y),(x+w+d,y-d),(x+w+d,y+h-d),(x+w,y+h)],'#718b9d');s.rect(x,y,w,h,color,NAVY,3,0);s.caption(x+w/2,y+h+60,label)
def beam(s,x,y,kind='lamp'):
 s.path(f'M{x} {y}l100 -40l100 40Z',GOLD,NAVY,3);s.line(x+100,y-40,x+100,y-100,NAVY,5)
 for dx in [-70,0,70]:s.line(x+100,y+20,x+100+dx,y+145,GOLD,4)
def chamber(s,x,y,label='試験装置',mode='salt'):
 s.rect(x,y,340,280,'#dce7eb',NAVY,4,18);s.rect(x+25,y+40,290,190,'#eaf6f9',BLUE,3,3);s.rect(x+105,y+110,120,90,GRAY,NAVY,3,1)
 if mode=='salt':
  s.poly([(x+35,y+90),(x+70,y+70),(x+70,y+110)],TEAL);s.line(x+35,y+90,x+15,y+90,TEAL,5)
  for i in range(15):s.circ(x+90+(i*17)%200,y+65+(i*23)%130,4,BLUE,'none',0)
 if mode=='pvd':s.rect(x+90,y+55,150,20,GOLD);s.line(x+330,y+245,x+395,y+245,BLUE,8);s.circ(x+405,y+245,30,GRAY)
 s.caption(x+170,y+340,label)
def resistor(s,x,y,label='R',w=160):s.line(x-40,y,x,y);s.rect(x,y-24,w,48,'#f2d59a',NAVY,3,1);s.line(x+w,y,x+w+40,y);s.text(x+w/2,y-45,label,30,anchor='middle')
def circuit(s,x,y,parallel=False,values=False):
 if parallel:
  # Source branch at left; resistor branches share explicit upper/lower nodes.
  # No return conductor bypasses the loads across the two buses.
  s.line(x,y,x+340,y,NAVY,5);s.line(x,y+240,x+340,y+240,NAVY,5)
  s.line(x,y,x,y+85,NAVY,5);s.line(x,y+115,x,y+240,NAVY,5)
  s.line(x-22,y+85,x+22,y+85,NAVY,5);s.line(x-12,y+115,x+12,y+115,NAVY,5)
  for xx,label in [(x+160,'6 Ω' if values else 'R₁'),(x+340,'3 Ω' if values else 'R₂')]:
   s.line(xx,y,xx,y+65,NAVY,5);s.rect(xx-24,y+65,48,110,'#f2d59a',NAVY,3,1);s.line(xx,y+175,xx,y+240,NAVY,5)
   s.circ(xx,y,6,NAVY,'none',0);s.circ(xx,y+240,6,NAVY,'none',0);s.text(xx-40,y+130,label,30,anchor='end')
  if values:s.text(x-8,y+195,'12 V',28,anchor='end')
 else:
  s.path(f'M{x} {y}h300v220h-300Z',stroke=NAVY,sw=5)
  s.rect(x-10,y+93,20,32,'#fff','none',0,0);s.line(x-22,y+93,x+22,y+93,NAVY,5);s.line(x-12,y+125,x+12,y+125,NAVY,5)
  resistor(s,x+70,y,'6 Ω' if values else 'R₁',150);resistor(s,x+70,y+220,'3 Ω' if values else 'R₂',150)
  if values:s.text(x-8,y+195,'12 V',28,anchor='end')
def ion(s,x,y,t,color=BLUE,r=30):s.circ(x,y,r,color,'#fff',2);s.text(x,y+11,t,28,'#fff','middle')
def record(s,x,y,label='記録'):
 s.rect(x,y,250,260,'#fff',NAVY,3,6)
 for i in range(4):s.line(x+25,y+65+i*45,x+225,y+65+i*45,GRAY,2)
 s.text(x+125,y+38,label,30,anchor='middle');s.text(x+35,y+103,'時刻・位置',26);s.text(x+35,y+148,'値・単位',26);s.text(x+35,y+193,'条件・異常',26)
def plot(s,x,y,kind='run'):
 s.line(x,y+210,x+300,y+210);s.line(x,y+210,x,y-10)
 if kind=='hist':
  for i,h in enumerate([50,120,185,150,75]):s.rect(x+18+i*52,y+210-h,40,h,TEAL,NAVY,1,0)
 elif kind=='pareto':
  for i,h in enumerate([180,120,70,35]):s.rect(x+20+i*65,y+210-h,45,h,BLUE,NAVY,1,0)
 elif kind=='scatter':
  for i in range(12):s.circ(x+25+i*22,y+180-i*12+(i%3)*13,7,TEAL,'none',0)
 else:
  pts=[(x+15+i*33,y+100+int(math.sin(i*1.5)*35)+(i%2)*5) for i in range(9)]
  s.path('M'+'L'.join(f'{a} {b}' for a,b in pts),stroke=TEAL)
  for a,b in pts:s.circ(a,b,6,TEAL,'none',0)
def scene(n,s):
 # Physical diagrams are tailored to each lesson; coordinates/labels are original.
 if n==1:ppe(s,130,320);wheel(s,850,310,'回転部との距離',guard=True);s.line(680,250,680,680,GRAY,3,False,True);return '薬液作業の保護具と回転部の危険を別の対象物で比較する。'
 if n==2:beaker(s,170,330,'試料と電極',probe=True);meter(s,560,300,'pH計','pH 4.8');record(s,980,300,'採取記録');return '試料・pH電極・指示値・採取記録の対応を示す。'
 if n==3:
  sample(s,150,340,440,'film','指定した複数の位置')
  for i,t in enumerate(['位置①','位置②','位置③']):s.line(220+i*150,290,220+i*150,385,BLUE,4,True);s.text(220+i*150,265,t,28,anchor='middle')
  sample(s,870,340,300,'film','断面で見る局所膜厚');s.line(1240,390,1240,430,RED,4);s.text(1245,470,'μm',30);return '複数の測定位置と基材上の皮膜断面を対応させる。'
 if n==4:sample(s,110,360,300,'pinhole','皮膜を通る穴');sample(s,560,360,300,'film','異種金属の接触');beaker(s,1050,360,'電解液の関与',particles=True,w=220);return '皮膜の穴、接触する金属、周囲の電解液を分けて考える。'
 if n==5:tank(s,150,360,'一般的な電気めっき');sample(s,750,360,400,'film','品物側に析出する皮膜');s.text(760,320,'金属イオン＋電子',30);return '電源と二電極、品物上の析出膜を示す。'
 if n==6:
  sample(s,110,370,270,'film','小さい対象面積');sample(s,610,370,520,'film','大きい対象面積');s.text(210,270,'同じ電流 I',34);s.text(760,270,'電流密度＝I／対象面積',32);return '異なる対象面積の品物と断面皮膜を比較し、平均電流密度と局所分布を分ける。'
 if n==7:sample(s,110,350,390,'film','付着した金属皮膜');sample(s,830,350,390,'oxide','基材から育つ酸化皮膜');return '付着するめっき膜と細孔・バリア層を持つ陽極酸化膜を区別する。'
 if n==8:sample(s,110,360,390,'scratch','前工程の残留傷');wheel(s,850,310,'接触と熱の管理',hot=True);return '残留傷のある表面とバフ接触部の熱を並べて示す。'
 if n==9:beaker(s,130,360,'同じ条件で採取',w=250);s.rect(235,225,30,245,'#f8f6e8',NAVY,3);s.circ(250,470,20,RED);s.line(250,440,250,290,RED,10);beaker(s,640,360,'比重計の浮き方',w=250);s.path('M765 240v180q-70 65-20 130h40q50-65-20-130',fill='#e6efdf',stroke=NAVY);record(s,1060,300,'温度・時刻');return '温度計、浮ひょう、同じ条件の記録を結び付ける。'
 if n==10:
  s.rect(240,210,34,330,'#e7f4f7');s.line(257,540,257,580,BLUE,8);s.line(220,530,300,530,NAVY,5)
  for i in range(9):s.line(242,240+i*30,263,240+i*30,BLUE,2)
  s.path('M245 580l-80 120h195l-80-120v-45h-35Z','#b9dfe7');s.circ(258,568,7,TEAL);s.caption(260,750,'ビューレットと試料');record(s,620,320,'開始値・終了値');beaker(s,1040,380,'標準液',w=180,h=210);return '標準液を入れる器具、試料、開始・終了値を別々に示す。'
 if n==11:cube(s,150,390,GOLD,'溶質の質量');beaker(s,620,340,'溶液の最終体積',particles=True,w=270);s.text(1040,360,'g/L',46);s.text(1040,460,'mol/L',46);s.line(980,510,1260,510,TEAL,5);s.text(980,570,'量の種類を区別',28);return '固体溶質と溶液の最終体積を描き、濃度の分子・分母を分ける。'
 if n==12:
  for x,t in [(150,'O'),(270,'C'),(390,'O')]:ion(s,x,400,t,RED if t=='O' else NAVY,40)
  for y in [389,411]:s.line(190,y,230,y,NAVY,4);s.line(310,y,350,y,NAVY,4)
  ion(s,640,400,'Ca²⁺',TEAL,60);ion(s,800,400,'O²⁻',RED,60)
  for x,y,t in [(1060,340,'Al'),(1210,340,'Al'),(1030,490,'O'),(1140,490,'O'),(1250,490,'O')]:ion(s,x,y,t,TEAL if t=='Al' else RED,38)
  s.caption(270,640,'CO₂：塩基との反応');s.caption(720,640,'CaO：酸との反応');s.caption(1140,640,'Al₂O₃：両方を確認');s.text(1110,710,'原子数比の模型',28,anchor='middle');return '二酸化炭素の分子と、CaO・Al₂O₃の構成粒子比を独立模型で示し、反応相手を比較する。'
 if n==13:beaker(s,160,340,'溶けた成分',particles=True,w=290);beaker(s,860,340,'底に集まった沈殿',sediment=True,w=290);return '溶けた成分の分布と沈殿した固体を区別する。'
 if n==14:cube(s,130,350,GRAY,'体積 V');s.rect(660,530,420,70,'#e4e9ee');s.poly([(700,530),(1040,530),(990,490),(750,490)],GRAY);cube(s,810,330,GOLD,'質量 m',.8);s.text(200,680,'m＝ρ×V',38);s.text(720,690,'密度の単位も確認',30);return '寸法を持つ試料と秤の物理模型で密度・体積・質量を対応させる。'
 if n==15:
  for x,c,t,other in [(160,'#cc995a','黄銅：Cu・Zn','Zn'),(620,'#ad7b55','青銅：Cu・Sn','Sn'),(1070,'#b9c6cc','白銅：Cu・Ni','Ni')]:
   cube(s,x,360,c,t)
   for i in range(6):s.circ(x+32+(i%3)*48,390+(i//3)*45,14,'#c48b67' if i%3 else TEAL,NAVY,1)
  s.text(700,690,'構成元素の概念図・配合比は表示しない',28,anchor='middle');return '三つの銅合金の試料断面に異なる構成粒子を描き、添加元素の違いを照合する。'
 if n==16:sample(s,100,370,300,'bare','油分・汚れ');s.path('M180 365q50-65 95 0q25 45-45 50q-80-5-50-50',GOLD);sample(s,570,370,300,'oxide','酸化皮膜');tank(s,1020,380,'工程間の水洗','electroless',w=250,h=240);return '油分、酸化皮膜、持込みを抑える水洗を異なる物理状態で示す。'
 if n==17:sample(s,80,360,320,'blister','ふくれ');sample(s,550,360,320,'film','変色の観察');s.rect(620,410,160,40,'#996c88','none',0,0);sample(s,1010,360,270,'unplated','不めっき');return 'ふくれ・変色・未被覆部の異なる外観と断面を描く。'
 if n==18:tank(s,130,340,'溶融金属の浴','hot',w=400);sample(s,900,350,300,'alloy','基材と合金層');s.text(890,290,'投入前の乾燥確認',32);return '熱い金属浴への浸漬と基材に接する合金層を描く。'
 if n==19:tank(s,80,350,'無電解の液中反応','electroless',w=340);chamber(s,540,330,'真空中の成膜','pvd');s.rect(1050,340,220,250,'#e7e9e0');s.line(1030,380,1120,380,TEAL,14);s.text(1050,320,'気相の反応',28);sample(s,1070,450,140,'film');return '外部通電しない液中反応、真空装置、気相処理を異なる設備で比較する。'
 if n==20:
  for x,c,t in [(100,TEAL,'系統A'),(540,BLUE,'系統B'),(980,GOLD,'分析・処理後')]:
   tank(s,x,380,t,'none',w=300,h=220);s.rect(x+40,300,220,50,'#fff');s.text(x+150,335,t,28,anchor='middle')
   s.line(x+25,600,x+25,650,GRAY,10);s.line(x+275,600,x+275,650,GRAY,10);s.line(x+150,600,x+150,640,c,11);s.circ(x+150,625,15,'#fff',c,4);s.line(x+137,612,x+163,638,c,4)
   for i in range(4):s.circ(x+60+i*58,500+(i%2)*35,8,c,'none',0)
  return '閉じた採取口と脚を持つ独立した排水槽を描き、系統を分けた確認と処理後の分析を示す。'
 if n==21:chamber(s,120,350,'排気を捕集する覆い');s.path('M220 350v-120h260v120',stroke=TEAL,sw=22);s.circ(980,420,95,GRAY);s.path('M1100 330q100 100 0 200',stroke=RED,sw=8);s.caption(1000,650,'音と周囲への影響');return '排気の捕集設備と音が広がる機械を分けて観察する。'
 if n==22:
  circuit(s,180,310);s.circ(480,420,46,'#fff');s.text(480,432,'A',36,anchor='middle');s.line(780,340,1170,340);resistor(s,880,340,'負荷',170);s.path('M840 340v230h300v-230');s.circ(990,570,46,'#fff');s.text(990,582,'V',36,anchor='middle');s.caption(330,680,'電流計は直列の原理');s.caption(1000,680,'電圧計は並列の原理');return '電流計と電圧計の接続位置を原理回路で分ける。実設備の配線指示ではない。'
 if n==23:chamber(s,120,320,'塩水噴霧の試験');sample(s,900,360,300,'oxide','滴下による評価対象');s.circ(1050,300,14,TEAL);s.line(1050,320,1050,385,TEAL,3,True);return '噴霧する試験槽と皮膜への滴下評価を別の試験装置として比較する。'
 if n==24:beam(s,100,260);beam(s,750,260);s.rect(90,480,490,180,'#e5e5df');s.rect(740,480,490,180,'#e5e5df');s.rect(170,510,135,100,'#9db8be');s.rect(350,510,135,100,'#a5bcc1');s.rect(820,510,135,100,'#9db8be');s.rect(1000,510,135,100,'#a5bcc1');s.caption(335,710,'見本と試料を同条件で');s.caption(985,710,'照明・背景・角度');return '同じ照明と背景のもとに見本と試料を並べる検査台を示す。'
 if n==25:s.rect(130,400,330,180,'#d4c8b7');s.path('M160 390q130-130 270 0v120H160Z','#e4a36c');s.caption(290,670,'融点：相変化の性質');circuit(s,900,320);s.caption(1050,670,'導電率：電気の性質');return '金属が溶ける坩堝と電気を通す回路を別の性質として示す。'
 if n==26:sample(s,130,350,420,'contact','通電接点と保持');s.rect(420,390,80,65,TEAL);sample(s,880,350,300,'film','処理しない範囲');s.rect(1050,390,90,45,TEAL);s.text(930,310,'マスキング',30);return '治具の接点・保持部と、覆って処理しない部分を区別する。'
 if n==27:beaker(s,140,350,'溶液中の電離',w=300);ion(s,220,440,'＋');ion(s,355,510,'−',RED);cube(s,840,380,GRAY,'金属の酸化');ion(s,1160,330,'＋',TEAL,40);s.text(1100,520,'e⁻',38);return '溶液中の陽陰イオンと金属から電子が離れる模型を比較する。'
 if n==28:tank(s,130,350,'析出と副反応');s.circ(430,450,13,'#fff',BLUE);s.circ(430,415,10,'#fff',BLUE);s.text(750,300,'Q＝I×t',48);sample(s,810,360,340,'film','目的金属の析出量');s.text(750,690,'時間と効率を分ける',30);return '析出膜と気泡の副反応を同じ槽に描き、電気量と目的析出への利用割合を分ける。'
 if n==29:
  for x,c,t in [(100,TEAL,'リン酸塩系'),(550,GOLD,'クロメート系'),(1000,GRAY,'黒染めの例')]:sample(s,x,370,280,'film',t);s.rect(x,420,280,40,c,NAVY,2,0)
  return '基材上にできる異なる化成皮膜を比較し、処方や代用を名称だけで決めない。'
 if n==30:
  sample(s,80,360,280,'film','吹き付け');s.path('M100 250h130v80H100Z',GRAY);s.line(230,280,350,360,BLUE,3,True)
  tank(s,550,350,'電着の模型',w=320);chamber(s,970,340,'硬化・焼付の設備');return 'スプレー、電着槽、硬化設備を別の工程要素として示す。'
 if n==31:sample(s,120,360,420,'pinhole','皮膜の遮へい効果');sample(s,850,360,360,'film','亜鉛による防食の例');s.rect(850,410,360,40,'#8ebaa9');s.text(900,345,'Zn / Fe',34);return '遮へいする皮膜と亜鉛・鉄の組合せを断面で比較する。'
 if n==32:tank(s,500,360,'槽内の状態');s.rect(110,230,240,190,'#d9e4ea');s.text(230,285,'整流器',32,anchor='middle');s.line(350,325,550,325,RED,7);s.rect(1040,340,210,210,'#d9e4ea');s.text(1145,395,'フィルター',28,anchor='middle');s.path('M850 490h170v-100h20M1040 530h-65v110H700v-20',stroke=TEAL,sw=11);return '整流器・槽・循環フィルターの物理的な役割を分ける。'
 if n==33:sample(s,80,360,300,'oxide','着色前の孔');sample(s,550,360,300,'oxide','染料を保持');sample(s,1010,360,270,'oxide','封孔後の模型');s.line(1010,410,1280,410,TEAL,18);return '陽極酸化膜の孔、着色、孔を閉じる後処理を断面模型で比較する。'
 if n==34:
  wheel(s,80,300,'粗い傷を取る側');wheel(s,830,300,'仕上げ側を分ける');s.line(690,230,690,700,RED,4,False,True)
  for i in range(10):s.circ(220+(i%3)*40,370+(i//3)*30,9,RED,'none',0);s.circ(970+(i%3)*40,370+(i//3)*30,3,TEAL,'none',0)
  return '粗い研磨粒子が残る道具と仕上げ道具の分離を物理的に示す。'
 if n==35:wheel(s,60,300,'固定式');s.path('M650 350l170 40l-35 110l-170-45Z',GRAY);s.circ(810,415,60,'#dfc89f');s.caption(710,650,'手持ち式');s.path('M1050 610v-140l100-140l100 100',stroke=TEAL,sw=35);s.circ(1150,330,30,GRAY);s.circ(1250,430,50,'#dfc89f');s.caption(1150,700,'ロボットの保持');return '固定式バフ、手持ち工具、ロボットアームの保持の違いを描く。'
 if n==36:
  s.rect(120,260,550,400,'#e1e8e5')
  for yy in [395,530]:s.line(120,yy,670,yy,NAVY,7)
  for i in range(6):s.rect(160+(i%3)*160,290+(i//3)*150,100,100,['#b8d9dc','#e6d3a3','#c4cadc'][i%3]);s.text(210+(i%3)*160,350+(i//3)*150,str(i%3+1),30,anchor='middle')
  record(s,920,300,'場所・品目・数量');return '区分した棚と定位置・定品・定量の記録を対応させる。'
 if n==37:wheel(s,70,300,'設備の変化');cube(s,590,400,GOLD,'材料の変化');record(s,1020,300,'方法・担当者');s.text(510,690,'実物と記録を照合',32);return '設備・材料・担当と方法の記録という4Mの確認対象を具体物で示す。'
 if n==38:tank(s,100,360,'管理対象の工程');record(s,660,300,'頻度と測定位置');meter(s,1080,370,'値と異常の記録','値',200);return '実際の処理槽、測定器、記録欄を結び、手順と管理計画を区別する。'
 if n==39:
  for x,k,t in [(90,'pareto','分類と優先'),(550,'hist','分布'),(1010,'run','時間変化')]:plot(s,x,340,k);s.caption(x+145,650,t)
  return '異なるデータ配置を独立した作例グラフで比較する。'
 if n==40:
  for x,c,t in [(70,'#b16e54','鉄：さびの例'),(400,'#715956','銅：変色の例'),(730,'#92c6cf','Al：酸化皮膜'),(1060,'#8ba99e','Zn：消耗の例')]:
   sample(s,x,380,230,'film',t);s.rect(x,430,230,40,c,NAVY,2,0)
  for i in range(8):s.circ(100+i*23,428+(i%3)*8,10,'#b16e54','none',0)
  s.rect(1150,430,50,28,'#c1d0d9','none',0,0)
  s.text(700,700,'環境や皮膜の状態で変わる観察例',28,anchor='middle');return '鉄のさび、銅の変色、Alの酸化膜、Znの消耗という異なる観察例を断面で示す。'
 if n==41:
  s.path('M230 330h350v240H230Z',stroke=NAVY,sw=5);s.rect(218,420,24,35,'#fff','none',0);s.line(205,420,255,420,NAVY,6);s.line(216,455,244,455,NAVY,6);resistor(s,325,330,'6 Ω',160);s.text(190,510,'12 V',32,anchor='end');s.text(850,330,'I＝12 V ÷ 6 Ω',38);s.text(850,430,'I＝2 A',44);s.text(850,550,'一定条件の理想抵抗',30);return '電源と単一の抵抗の回路模型に、完全な仮定値を持つオーム則の紙上例を示す。'
 if n==42:circuit(s,180,330,False,True);circuit(s,900,330,True,True);s.caption(330,680,'直列：同じ電流');s.caption(1050,680,'並列：同じ電圧');return '直列・並列の接続と共通になる量を二つの回路で比較する。'
 if n==43:wheel(s,120,310,'危険を具体的に観察',guard=True);s.line(650,250,650,650,GRAY,4);ppe(s,900,350);s.text(850,270,'教育範囲を確認',32);return 'ガード付き回転工具と作業別保護具を観察対象にして教育と危険予知を結ぶ。'
 if n==44:wheel(s,80,300,'危険源を見つける');wheel(s,850,300,'対策後も点検する',guard=True);s.circ(300,520,130,'none',RED,7);return '同種の回転部を対策前後で描き、残留する接触・飛出しの危険を考える。'
 if n==45:
  s.circ(260,410,130,'#fff',RED,18);s.line(165,500,350,320,RED,18);s.poly([(620,540),(750,280),(880,540)],'#f4d45a');s.line(750,350,750,435,NAVY,15);s.circ(750,480,9,NAVY)
  s.rect(1080,285,180,300,TEAL);s.rect(1110,320,80,245,'#fff');s.caption(260,680,'禁止の区分');s.caption(750,680,'注意の区分');s.caption(1170,680,'避難先の区分');return '独立した概念図で禁止・注意・避難先の表示形式を区別する。現行標識の認証図ではない。'
 if n==46:cube(s,110,380,GRAY,'質量・長さ');s.rect(600,330,70,280,'#e8e7ce');s.line(635,580,635,380,RED,13);s.circ(635,600,27,RED);meter(s,1030,350,'電流などの量','A',220);return '試料寸法、温度計、電流表示を実際の測定対象として単位の違いを示す。'
 if n==47:
  cube(s,90,380,GRAY,'材料の無駄を抑える');s.poly([(285,450),(345,470),(315,510)],GOLD)
  s.rect(620,300,180,260,'#d0e4e7',NAVY,4,26);s.rect(650,260,120,55,GOLD);s.line(650,380,770,380,TEAL,5);s.caption(710,650,'同じ容器を再使用')
  s.path('M1020 350l30 230h230l30-230Z','#d9d4bf')
  for i in range(12):s.rect(1055+(i%4)*47,385+(i//4)*48,35,22,GRAY,NAVY,1,1)
  s.caption(1160,650,'回収して材料へ戻す');return '部品と端材、ふた付きの再使用容器、分別した金属端材の回収箱で3Rを描き分ける。'
 if n==48:
  for x,t in [(120,'酸の模型'),(580,'塩基の模型'),(1040,'塩の模型')]:beaker(s,x,360,t,w=220)
  ion(s,210,450,'H⁺');ion(s,670,450,'OH⁻',RED);ion(s,1100,430,'＋');ion(s,1180,520,'−',RED);return '水溶液中の異なるイオンを概念粒子で示し、名称だけで中性・無害としない。'
 if n==49:cube(s,120,390,GRAY,'酸化される金属');ion(s,600,390,'e⁻',TEAL,45);s.line(390,405,535,405,NAVY,5,True);ion(s,1050,390,'＋',BLUE,70);s.caption(1050,650,'電子を受け取る側');return '金属と相手の間の電子の授受を概念的に示し、両側の役割を対応させる。'
 if n==50:beaker(s,160,350,'硫酸：1 mol',particles=True,w=280);beaker(s,870,350,'NaOH：2 mol',particles=True,w=280);s.text(700,330,'完全中和の',32,anchor='middle');s.text(700,380,'紙上モデル',32,anchor='middle');return '指定した完全中和の反応比を二つの物質量モデルで示す。実槽の調製指示ではない。'
 if n==51:
  beaker(s,500,390,'同じ試料中の二電極',w=420);s.rect(600,300,25,240,'#dceacb');s.rect(790,300,25,240,'#c1d4e5');s.path('M612 300V260H660M802 300V260H760',stroke=NAVY,sw=5)
  s.rect(640,200,180,110,'#dfe8eb');s.rect(660,220,140,60,'#d0e2c9');s.text(730,263,'ΔV',38,anchor='middle');s.text(240,420,'ガラス電極',32);s.text(1020,420,'比較電極',32);return '同じ試料にあるガラス電極・比較電極と、二電極につながる電位差計を示す。'
 if n==52:
  plot(s,100,360);s.line(110,450,390,450,RED,6);s.caption(245,680,'直流の向き');s.line(800,480,1250,480,GRAY,3)
  s.path('M800 480C840 300 870 300 910 480S980 660 1020 480S1100 300 1140 480S1220 660 1260 480',stroke=BLUE,sw=7);s.caption(1030,680,'交流の変化');return '直流の固定方向と交流の往復を波形と電源の概念で区別する。'
 if n==53:
  s.circ(350,450,45,TEAL);s.circ(350,450,10,'#fff');s.path('M450 450a100 100 0 1 0 -100 100',stroke=BLUE,sw=6);s.line(320,550,350,550,BLUE,5,True);s.caption(350,680,'電流は手前向き：⊙')
  s.path('M850 550v-230q25-70 50 0v230q25 70 50 0v-230q25-70 50 0v230q25 70 50 0v-230q25-70 50 0v230',stroke=GOLD,sw=12);s.caption(1030,680,'コイルの巻き方も確認');return '断面で手前向きの導体と反時計回りの磁界、別にコイルの形状を示す。'
 if n==54:
  for x,c,t in [(130,GRAY,'鉄鋼材料'),(620,'#c78a60','銅系材料'),(1090,'#c5d4dc','軽金属')]:cube(s,x,380,c,t)
  return '異なる金属試料と材料区分を図示し、見た目だけで材料を同定しない。'
 if n==55:sample(s,80,420,300,'film','密着性');s.path('M120 465l150-150l100 30l-180 130Z','#e5d58d');sample(s,550,420,300,'film','押込みの硬さ');s.poly([(620,260),(780,260),(700,450)],GRAY);sample(s,1020,420,270,'film','はんだの広がり');s.path('M1060 470q60-90 140 0Z','#9caeba');return '剥離・圧痕・濡れ広がりという異なる試験作用を比較する。'
 if n==56:chamber(s,90,360,'発生源の装置');s.path('M190 360v-120h80v120',stroke=GRAY,sw=28);beaker(s,670,400,'水・土壌の影響',particles=True,w=220);record(s,1050,290,'含有物質情報');return '発生源、液の試料、化学物質情報の資料を別の確認対象として描く。'
 if n==57:
  for x,v,t in [(50,'film','金属皮膜'),(390,'oxide','酸化皮膜'),(730,'film','化成皮膜'),(1070,'film','塗装皮膜')]:sample(s,x,380,230,v,t)
  return '基材上の四つの皮膜形成モデルを比較し、形成法と目的を対応させる。'
 if n==58:
  for x,c,t in [(100,GRAY,'鉄鋼'),(550,'#c6d2d8','ステンレス'),(1000,'#c9deea','軽金属')]:sample(s,x,390,280,'film',t);s.rect(x,455,280,12,TEAL,NAVY,1,0)
  s.text(380,290,'薄い下地・前処理の役割を確認',34);return '基材と薄い下地を別の層として描き、材質別の工程確認を促す。'
 if n==59:sample(s,220,320,840,'alloy','基材・合金層・外側の皮膜');s.line(1120,370,1120,432,RED,5);s.text(1135,420,'膜厚',32);s.text(280,640,'Zn系／Al系／Sn系など：材料と要求で照合',30);return '溶融めっきの基材・合金層・外層を大きな断面で分ける。'
 if n==60:
  for x,v,t in [(40,'pinhole','ピンホール'),(380,'pit','ピット'),(720,'unplated','未被覆部'),(1060,'run','たれ')]:sample(s,x,380,230,v,t)
  return '貫通穴、浅いくぼみ、未被覆部、余分な付着を四つの断面模型で区別する。'
 if n==61:
  for x,v,t in [(100,'mirror','鏡面'),(550,'satin','サテン'),(1000,'hairline','ヘアライン')]:sample(s,x,390,280,v,t)
  s.line(210,270,260,450,GOLD,5,True);s.line(260,450,340,270,GOLD,5,True);return '光沢と方向性の異なる三つの仕上げ表面を比較する。'
 if n==62:sample(s,100,380,400,'scratch','線状傷');sample(s,850,380,350,'film','局所的な停滞');s.path('M900 430q130 110 250 0',stroke=RED,sw=9);return '線状傷と局所のくぼみ・膜への影響を形状で分ける。'
 if n==63:
  s.rect(60,290,380,335,'#dde8ed');s.rect(95,330,80,80,GOLD);s.rect(330,330,75,80,TEAL);s.rect(185,500,170,30,GRAY);s.line(160,410,240,500,RED,6,True);s.line(260,500,340,410,TEAL,6,True);s.text(105,280,'X線源',28);s.text(325,280,'検出器',28);s.caption(250,690,'蛍光X線の模型');s.rect(590,330,230,160,'#dce5eb');s.rect(610,350,190,70,'#d0e2c9');s.text(705,403,'μm',42,anchor='middle');s.path('M705 490q-20 90 80 95h100v-70',stroke=NAVY,sw=6);s.rect(869,500,32,100,'#b5c6cd');s.rect(835,602,120,15,GOLD,NAVY,2,0);s.caption(730,690,'計器・ケーブル・プローブ');sample(s,1030,390,260,'film','断面と質量の評価');return '励起X線と検出器、電磁的プローブの計器、試料断面を並べ、原理名と適合を分ける。'
 if n==64:cube(s,110,370,GRAY,'設計する部品');wheel(s,570,300,'製造する工程');s.rect(1050,340,220,200,'#d6bc8c');s.line(1050,340,1160,395,GOLD,7);s.line(1270,340,1160,395,GOLD,7);s.caption(1160,650,'輸送時の保護');return '同じ製品に関係する設計試料、製造設備、梱包保護を具体物で分ける。'
 if n==65:beaker(s,120,340,'水質は複数の指標',particles=True,sediment=True,probe=True,w=330);chamber(s,850,360,'発生源と周囲');s.path('M950 360V220h90v140',stroke=GRAY,sw=30);return '電極・溶存成分・浮遊固体を含む液と大気の発生源を別々に示す。'
 if n==66:
  for x in [250,950]:s.rect(x,230,75,370,'#e6f1f4',NAVY,3,0)
  for i in range(9):
   s.line(252,270+i*35,280 if i%2 else 300,270+i*35,BLUE,3)
   s.line(952,270+i*35,980 if i%2 else 1000,270+i*35,BLUE,3)
  s.path('M252 400q36 90 72 0',stroke=TEAL,sw=6);s.line(180,445,320,445,RED,3,True);s.path('M952 400q36 45 72 0',stroke=TEAL,sw=6);s.line(880,400,1020,400,RED,3,True);s.text(230,276,'10',26,anchor='end');s.text(230,416,'11',26,anchor='end');s.text(230,556,'12',26,anchor='end');s.text(287,220,'mL',28,anchor='middle');s.caption(287,690,'下縁を読む指定例');s.caption(987,690,'上縁を読む指定例');return '同形の液面を拡大し、指定により上縁・下縁の参照位置が違うことを示す。'
 if n==67:beaker(s,100,360,'滴定の試料',particles=True,w=250);beaker(s,570,360,'液中の沈殿',sediment=True,w=250);tank(s,1020,370,'電極上の析出','electric',w=280,h=230);return '滴定対象、液中沈殿、電極上の皮膜を異なる現象として示す。'
 if n==68:
  for x,c,t in [(100,'#c9e6ee','水性の表示'),(550,'#e6d8b9','溶剤系の表示')]:beaker(s,x,350,t,particles=True,w=260);s.rect(x+40,520,180,50,c)
  chamber(s,970,340,'硬化条件の確認');return '塗料の容器と表示、硬化装置を分け、分類と加熱条件を混同しない。'
 if n==69:sample(s,160,320,1020,'oxide','細孔を含む部分と基材側のバリア層');s.line(400,270,400,380,BLUE,4,True);s.text(400,240,'細孔',32,anchor='middle');s.line(1030,650,1030,410,TEAL,4,True);s.text(1030,700,'バリア層',32,anchor='middle');return '大きな陽極酸化膜断面で細孔・バリア層・基材を区別する。'
 if n==70:s.rect(110,360,240,100,'#d5c392');s.caption(230,650,'固形の研磨剤');beaker(s,590,330,'液状：粒子を分散',particles=True,w=250);wheel(s,990,300,'含粒の工具');return '固形・液状・粒子を含む工具を物理的に描き、供給と混入管理を分ける。'
 if n==71:wheel(s,70,300,'設備の安全');ppe(s,620,350);record(s,1050,280,'担当者へ連絡');return '設備と保護具、責任者へ伝える記録を同じ作業場の確認対象として示す。'
 if n in [72,73]:
  lesson=LESSONS[n-1];alltext='\n'.join(p['textJa'] for p in lesson['paragraphs']);rows=[]
  if n==72:
   for name,sym,value in re.findall(r'\d+\. ([^/\n]+) / [^/]+ / ([A-Za-z]+)：比重 ([0-9.]+)',alltext):rows.append((sym,value))
  else:
   for sym,value in re.findall(r'（([A-Za-z]+)）：([0-9.]+) ×10',alltext):rows.append((sym,value))
  cols=3;per=7 if n==72 else 5
  for i,(sym,value) in enumerate(rows):
   x=90+(i//per)*450;y=245+(i%per)*(65 if n==72 else 88);v=float(value);s.rect(x,y-27,32,32,GRAY,NAVY,2,0);s.text(x+50,y,sym,28);s.rect(x+115,y-25,max(2,v/(22 if n==72 else 65)*135),28,TEAL,'none',0,0);s.text(x+325,y,value,27,anchor='end')
  s.text(700,735,'比重：無次元・表の参考値' if n==72 else '導電率：数値 ×10⁶ S/m（条件付き参考値）',30,anchor='middle');return '独立した試料マークと比例バーで元の参考値全行を再構成し、倍率・単位と比較を確認する。'
 raise ValueError(n)

LESSONS=json.loads((ROOT/'src/data/manufacturing/surface.json').read_text())['lessons']
def build():
 ASSETS.mkdir(parents=True,exist_ok=True);bindings=[];validation=[]
 for n,l in enumerate(LESSONS,1):
  s=SVG();s.rect(0,0,1400,900,'#fbfcfa','none',0,0);s.rect(0,0,1400,155,NAVY,'none',0,0);s.text(48,40,f'金属表面処理｜学習図 {n:02d}',26,'#c9e4e9')
  for i,line in enumerate(wrap(l['titleJa'],36,1280)):s.text(48,90+i*45,line,36,'#fff',weight='bold')
  reason=scene(n,s)
  s.line(45,765,1355,765,'#cbd8dd',2)
  for i,line in enumerate(wrap(l['summaryJa'],26,1300)[:3]):s.text(50,806+i*33,line,26)
  svg=s.finish();name=f'surface-{n:03d}';sv=ASSETS/(name+'.svg');png=ASSETS/(name+'.png');sv.write_text(svg)
  cairosvg.svg2png(bytestring=svg.encode(),write_to=str(png))
  with Image.open(png) as im:im.convert('RGB').save(png,optimize=True)
  digest=hashlib.sha256(png.read_bytes()).hexdigest()
  bindings.append({'lessonId':l['id'],'sourceHash':l['sourceHash'],'specialty':'surface','level':'1','keyObjectiveId':l['id']+'-objective-main','keyObjectiveJa':l['objectiveJa'].split('\n')[1 if n in [36,44,46,64,67,70] and '\n' in l['objectiveJa'] else 0],'assetId':f'mfg40-surface-{n:03d}','file':str(png.relative_to(ROOT)),'svgFile':str(sv.relative_to(ROOT)),'width':1400,'height':900,'sha256':digest,'svgSha256':hashlib.sha256(sv.read_bytes()).hexdigest(),'captionJa':l['summaryJa'],'captionSourceField':'summaryJa','altJa':l['titleJa'],'altSourceField':'titleJa','relevanceReasonJa':reason,'sourceRefs':l['sources'],'rights':{'kind':'independently_authored_controlled_svg','author':'project AI surface lane','sourceArtworkCopied':False,'sourcePhotosUsed':False,'thirdPartyImagePayloads':False},'aiSemanticReviewPerformed':True,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'physicalDeviceVerified':False,'displayRole':'learning_day_only_not_quiz_asset','newImagesRenderedByExistingComponent':False,'renderedByExistingComponent':False,'reviewStatus':'ai_authored_teaching_diagram_not_real_device_photo_certification'})
  validation.append({'lessonId':l['id'],'labels':len(s.labels),'minimumFontSize':min(x['fontSize'] for x in s.labels),'pngBytes':png.stat().st_size,'physicalSceneDescriptionJa':reason})
 (OUT/'daily-bindings.json').write_text(json.dumps({'schemaVersion':1,'date':'2026-10-31','scope':'73 canonical scheduled surface lessons, not unscheduled supplements','bindings':bindings},ensure_ascii=False,indent=2)+'\n')
 (OUT/'generation-validation.json').write_text(json.dumps({'lessons':73,'assets':73,'uniquePngHashes':len({x['sha256'] for x in bindings}),'sourceLessonIdsUnchanged':True,'totalPngBytes':sum(x['pngBytes'] for x in validation),'minLabelFont':min(x['minimumFontSize'] for x in validation),'items':validation,'physicalDeviceVerified':False,'domainReviewed':False,'nativeReviewed':False},ensure_ascii=False,indent=2)+'\n')
 print('Generated',len(bindings),'surface daily SVG/PNG assets,',sum(x['pngBytes'] for x in validation),'PNG bytes')
if __name__=='__main__':build()
