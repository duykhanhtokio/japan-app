"""Original controlled educational illustrations for all98 scheduled electrical days.
No PDF artwork, external images, operational ratings or answer keys are inputs.
"""
import hashlib, html, json, math
from pathlib import Path
import cairosvg
from PIL import Image

ROOT=Path(__file__).resolve().parents[5]
OUT=ROOT/'assets/manufacturing/daily40/electrical'
HERE=Path(__file__).parent
OUT.mkdir(parents=True,exist_ok=True)
LESSONS=json.loads((ROOT/'src/data/manufacturing/electrical.json').read_text())['lessons']
INK='#17324d'; BLUE='#2179aa'; TEAL='#008f88'; ORANGE='#dc7b21'; RED='#b84144'; GRAY='#8194a3'; LIGHT='#eaf1f4'; GOLD='#d1a13a'

def esc(x):return html.escape(str(x))
def line(x1,y1,x2,y2,c=INK,w=5,dash=None):return f'<path d="M{x1} {y1}L{x2} {y2}" fill="none" stroke="{c}" stroke-width="{w}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>'
def rect(x,y,w,h,fill=LIGHT,stroke=INK,r=9):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="4"/>'
def circ(x,y,r,fill='white',stroke=INK,w=4):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
def text(x,y,s,size=30,fill=INK,anchor='start'):return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" font-family="Noto Sans CJK JP,sans-serif">{esc(s)}</text>'
def path(d,fill='none',stroke=INK,w=5):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linejoin="round"/>'
def arrow(x1,y1,x2,y2,c=BLUE,w=6):
 a=math.atan2(y2-y1,x2-x1);l=17
 return line(x1,y1,x2,y2,c,w)+path(f'M{x2-l*math.cos(a-.5)} {y2-l*math.sin(a-.5)}L{x2} {y2}L{x2-l*math.cos(a+.5)} {y2-l*math.sin(a+.5)}',stroke=c,w=w)
def label(x,y,s):return text(x,y,s,30)
def resistor(x,y,w=170):return line(x-35,y,x,y)+rect(x,y-24,w,48,'#f3e5b8',INK,0)+line(x+w,y,x+w+35,y)
def coil(x,y,turns=6,r=18):
 return ''.join(path(f'M{x+i*2*r} {y} a{r} {r} 0 0 1 {2*r} 0') for i in range(turns))
def capacitor(x,y):return line(x-80,y,x-12,y)+line(x-12,y-55,x-12,y+55)+line(x+12,y-55,x+12,y+55)+line(x+12,y,x+80,y)
def wire(x,y,w=350,kind='stranded'):
 s=rect(x,y-32,w,64,BLUE,INK,20)
 for i in range(7 if kind=='stranded' else 1):s+=line(x+w,y-24+i*8 if kind=='stranded' else y,x+w+120,y-24+i*8 if kind=='stranded' else y,ORANGE,5 if kind=='stranded' else 14)
 return s
def pcb(x,y,w=450,h=260,assembled=True):
 s=rect(x,y,w,h,'#93cbb5',TEAL,15)
 for i in range(5):
  yy=y+40+i*44;s+=path(f'M{x+25} {yy}H{x+130+i*35}V{y+h-30}H{x+w-20}',stroke='#e4b745',w=9)
  s+=circ(x+25,yy,9,'#ffe6a1',ORANGE,3)
 if assembled:
  s+=chip(x+w*.52,y+h*.45,130,95)
  s+=resistor(x+45,y+h*.76,100)
  s+=circ(x+w-65,y+60,25,BLUE,INK)
 return s
def chip(x,y,w=180,h=120):
 s=rect(x-w/2,y-h/2,w,h,'#354755',INK,7)
 for i in range(6):
  yy=y-h/2+12+i*(h-24)/5;s+=line(x-w/2-25,yy,x-w/2,yy,GRAY,8)+line(x+w/2,yy,x+w/2+25,yy,GRAY,8)
 return s+text(x,y+12,'IC',34,'white','middle')
def caliper(x,y,reading=False):
 s=rect(x,y,480,52,'#dce4e9',INK,2)+rect(x+150,y-18,110,88,'#9cb2c0',INK,4)
 s+=path(f'M{x} {y+5}v150h38v-108M{x+205} {y+8}v150h-38v-108',stroke=INK,w=12)
 s+=path(f'M{x} {y}v-75h38v80M{x+205} {y}v-75h-38v80',stroke=INK,w=9)
 for i in range(25):s+=line(x+i*19,y+25,x+i*19,y+50 if i%5==0 else y+39,INK,2)
 return s+line(x+480,y+18,x+620,y+18,GRAY,8)
def micrometer(x,y):
 s=path(f'M{x+90} {y-90}C{x-80} {y-120} {x-80} {y+150} {x+90} {y+115}',stroke=INK,w=35)
 s+=rect(x+40,y-110,45,60,'#a9bac4',INK,3)+rect(x+80,y-105,240,45,'#dbe2e7',INK,2)+rect(x+320,y-135,125,105,'#b5c5d0',INK,8)+rect(x+445,y-120,80,75,'#e2e8ec',INK,10)
 s+=line(x+100,y-82,x+320,y-82,INK,2)
 for i in range(9):s+=line(x+115+i*22,y-105,x+115+i*22,y-85 if i%2==0 else y-95,INK,2)
 for i in range(6):s+=line(x+365,y-130+i*16,x+440,y-130+i*16,INK,2)
 return s
def meter(x,y,mode='V',analog=False):
 s=rect(x,y,240,300,'#f6d161',INK,28)
 if analog:
  s+=rect(x+20,y+25,200,125,'white',INK,3)+path(f'M{x+40} {y+125}Q{x+120} {y-5} {x+200} {y+125}',stroke=GRAY,w=3)
  for i in range(9):
   a=math.pi*(1-i/8);s+=line(x+120+85*math.cos(a),y+125-85*math.sin(a),x+120+71*math.cos(a),y+125-71*math.sin(a),INK,2)
  s+=line(x+120,y+125,x+165,y+65,RED,4)
 else:s+=rect(x+20,y+25,200,85,'#d7e6ce',INK,3)+text(x+120,y+83,mode,40,INK,'middle')
 s+=circ(x+120,y+202,44,'#4d5c65',INK)+line(x+120,y+202,x+143,y+174,'white',7)
 s+=circ(x+60,y+270,13,RED,INK)+circ(x+180,y+270,13,'#273641',INK)
 return s
def bench(x,y):return rect(x,y,530,28,'#be936c',INK,3)+line(x+40,y+28,x+40,y+220,GRAY,15)+line(x+490,y+28,x+490,y+220,GRAY,15)
def magnify(x,y,r=65):return circ(x,y,r,'#ffffff88',BLUE,8)+line(x+r*.65,y+r*.65,x+r+55,y+r+55,BLUE,16)
def box(x,y,w=180,h=140):return rect(x,y,w,h,'#d8b78a',INK,4)+line(x+w*.5,y,x+w*.5,y+h,INK,3)+line(x,y+30,x+w,y+30,GRAY,2)
def doc(x,y,title='記録',w=270,h=300):
 s=rect(x,y,w,h,'white',INK,5)+rect(x+60,y-12,w-120,35,'#acc3cf',INK,5)+text(x+w/2,y+70,title,30,INK,'middle')
 for i in range(4):s+=line(x+25,y+115+i*40,x+w-25,y+115+i*40,GRAY,3)
 return s
def motor(x,y):
 s=circ(x,y,132,'#d8e7ed',INK,7)+circ(x,y,75,'#a1bac6',INK,6)+circ(x,y,30,'#c5d0d6',INK,4)
 for a in range(0,360,60):
  rad=math.radians(a);s+=circ(x+103*math.cos(rad),y+103*math.sin(rad),22,ORANGE,INK,3)
 s+=line(x,y,x+215,y,GRAY,23)+arrow(x+25,y-175,x+125,y-140,TEAL)
 return s
def transformer(x,y):
 s=rect(x,y,260,230,'#b7c3cc',INK,5)+rect(x+65,y+50,130,130,'white',INK,1)
 for i in range(7):s+=path(f'M{x-20} {y+35+i*24}h95v14h-95',stroke=ORANGE,w=7)
 for i in range(5):s+=path(f'M{x+185} {y+55+i*28}h95v16h-95',stroke=BLUE,w=7)
 return s
def sine(x,y,w=440,h=85,cycles=2,c=BLUE):
 pts=[(x+w*i/200,y-h*math.sin(i/200*cycles*2*math.pi)) for i in range(201)]
 return path('M'+'L'.join(f'{a:.1f} {b:.1f}' for a,b in pts),stroke=c,w=5)
def axes(x,y,w=450,h=260):return arrow(x,y,x+w,y,INK,4)+arrow(x,y,x,y-h,INK,4)
def bolt(x,y,kind='hex'):
 s=rect(x-22,y,44,180,'#becbd4',INK,2)
 for i in range(12):s+=line(x-22,y+12+i*13,x+22,y+i*13,GRAY,2)
 if kind=='hex':s+=path('M'+'L'.join(f'{x+65*math.cos(math.radians(a))} {y-20+65*math.sin(math.radians(a))}' for a in range(0,361,60)),fill='#cdd8df')
 else:s+=circ(x,y-15,62,'#cdd8df',INK)+line(x-40,y-15,x+40,y-15,INK,9)+(line(x,y-55,x,y+25,INK,9) if kind=='cross' else '')
 return s
def package_scene(x,y,protect=True):
 s=box(x,y,300,240)+rect(x+50,y+70,200,110,'#d2e0e5',INK,4)
 if protect:
  for dx,dy in [(20,40),(245,40),(20,170),(245,170)]:s+=rect(x+dx,y+dy,35,60,'#f9f6dc',GRAY,5)
  s+=line(x+30,y+10,x+30,y+230,TEAL,10)+line(x+270,y+10,x+270,y+230,TEAL,10)
 else:s+=path(f'M{x+80} {y+90}l35 20l-10 30l45 10',stroke=RED,w=8)
 return s
def contact(x,y,nc=False,vertical=False):
 s=line(x-55,y,x-18,y)+line(x+18,y,x+55,y)+line(x-18,y-30,x-18,y+30)+line(x+18,y-30,x+18,y+30)
 if nc:s+=line(x-33,y+42,x+33,y-42,RED,5)
 return s

def figure(family,n):
 s=''
 if family=='wire':
  s+=wire(110,330,360,'stranded')+wire(110,590,360,'solid')
  s+=label(120,250,'より線：断面積 mm²')+label(120,510,'単線：直径 mm')
  s+=circ(850,345,90,BLUE,INK)+''.join(circ(850+dx,345+dy,17,ORANGE,INK,2) for dx,dy in [(0,0),(-34,0),(34,0),(-17,-30),(17,-30),(-17,30),(17,30)])
  s+=circ(850,595,90,BLUE,INK)+circ(850,595,54,ORANGE,INK)
  s+=doc(1060,310,'工具適合',230,270)+label(750,220,'導体の違いを照合')
 elif family=='solder':
  s+=pcb(100,480,500,220,False)+pcb(800,480,500,220,False)
  s+=rect(300,320,35,240,'#bcc7ce',INK,3)+path('M255 520Q315 425 375 520Z',fill='#bbc5ca')
  s+=rect(1000,320,35,240,'#bcc7ce',INK,3)+circ(1017,505,55,'#bbc5ca',INK)
  s+=path('M460 240l-130 155l-45-28l130-155Z',fill=ORANGE)+arrow(220,380,290,430,RED)
  s+=label(110,240,'接合部を加熱・保持')+label(810,240,'塊を置くだけでは不十分')
  s+=label(140,765,'冷却前に動かさない')+label(850,765,'濡れ・橋渡しを観察')
 elif family=='vernier':
  s+=caliper(250,425)+rect(265,500,150,80,'#c9b19a',INK,2)
  s+=arrow(165,570,260,520)+label(80,640,'外側')+arrow(175,260,280,345)+label(85,230,'内側')
  s+=arrow(1150,450,870,443)+label(1080,540,'深さ')+label(430,230,'測定部と基準を選ぶ')
 elif family=='micrometer':
  s+=micrometer(220,470)+rect(260,345,45,65,'#d9b28d',INK,2)
  s+=magnify(1070,460,115)+line(950,460,800,420,BLUE,3)
  for i in range(6):s+=line(980+i*35,410,980+i*35,470 if i%2==0 else 445,INK,3)
  s+=line(970,460,1170,460,INK,3)+label(940,610,'0.5 mm線も確認')+label(160,700,'スリーブ＋シンブル')+label(170,260,'定圧装置で測定力をそろえる')
 elif family=='scope':
  s+=rect(140,195,1120,535,'#bfd0db',INK,20)+rect(200,235,840,420,'#eff8f7',INK,3)
  for i in range(11):s+=line(200+i*84,235,200+i*84,655,'#b8d1d3',2)
  for i in range(6):s+=line(200,235+i*84,1040,235+i*84,'#b8d1d3',2)
  s+=line(200,445,1040,445,GRAY,3)+sine(200,445,840,168,2,TEAL)
  for yy in [320,440,560]:s+=circ(1145,yy,35,'#eff5f8',INK)
  s+=label(255,175,'独立例：1 V/div・2 ms/div')+line(200,765,620,765,BLUE,4)+line(200,745,200,785,BLUE,3)+line(620,745,620,785,BLUE,3)+label(690,790,'一周期 5 div = 10 ms')
 elif family=='inspection':
  s+=pcb(100,300,400,240,True)+magnify(350,480,75)+rect(250,665,300,100,'#f4ddd5',RED,5)+label(280,730,'識別・保留')
  s+=pcb(850,300,400,240,True)+doc(890,590,'検査記録',280,190)
  s+=path('M200 370l65 40l-20 45l45 35',stroke=RED,w=12)+arrow(600,420,760,420,GRAY)+label(100,240,'対象と不適合箇所')+label(860,240,'目的・方法・判定を記録')
 elif family=='report':
  s+=bench(80,540)
  for i in range(3):s+=box(115+i*145,390,100,110)
  s+=rect(370,385,105,120,'none',RED,2)+doc(820,275,'事実の報告',400,410)
  s+=circ(1110,580,52,'white',INK)+line(1110,580,1110,550)+line(1110,580,1140,580)
  s+=label(100,260,'不足：品物・数量・場所')+label(835,735,'推測と事実を分ける')
 elif family=='risk':
  s+=rect(160,250,430,430,'#d6e1e7',INK,20)+motor(360,450)+rect(205,340,320,220,'#ffffff88',BLUE,1)
  for i in range(7):s+=line(220+i*45,345,220+i*45,555,BLUE,2)
  s+=circ(535,280,30,RED,INK)+doc(850,330,'隔離・報告',300,300)
  s+=label(100,735,'可動部・ガード・停止状態')+label(860,250,'異常を無断で解除しない')
 elif family=='variation':
  s+=axes(130,660,470,360)+axes(790,660,470,360)
  for i,h in enumerate([75,160,285,335,220,115,45]):s+=rect(155+i*55,660-h,48,h,'#82bbd0',INK,1)
  for i,v in enumerate([510,495,530,505,470,490,520,485]):
   s+=circ(830+i*55,v,7,BLUE,BLUE,2)
   if i:s+=line(830+(i-1)*55,[510,495,530,505,470,490,520,485][i-1],830+i*55,v,BLUE,4)
  s+=line(800,380,1240,380,RED,3,'10 6')+line(800,590,1240,590,RED,3,'10 6')
  s+=label(160,235,'分布を見る')+label(850,235,'時間の変化を見る')+label(150,740,'測定値')+label(1070,740,'測定順')
 elif family=='pareto':
  s+=axes(160,690,1050,420)
  for x,h,c,t in [(250,330,BLUE,'18件'),(550,165,TEAL,'9件'),(850,55,ORANGE,'3件')]:s+=rect(x,690-h,180,h,c,INK,2)+text(x+90,730,t,30,INK,'middle')
  s+=path('M340 470L640 330L940 280',stroke=RED,w=7)+''.join(circ(x,y,11,RED,RED) for x,y in [(340,470),(640,330),(940,280)])
  s+=label(280,420,'60%')+label(570,285,'90%')+label(940,245,'100%')+label(160,220,'件数と累積比率：独立した学習例')
 elif family=='drawing':
  s+=rect(100,225,530,500,'white',GRAY,0)+rect(770,225,530,500,'white',GRAY,0)
  s+=path('M180 550V360H420V435H520V550Z',fill='#dbe7ed')+path('M850 540V390H1030V450H1160V540Z',fill='#dbe7ed')
  for x,w in [(180,340),(850,310)]:s+=line(x,605,x+w,605,BLUE,3)+line(x,585,x,625,BLUE,3)+line(x+w,585,x+w,625,BLUE,3)+text(x+w/2,655,'記入寸法を読む',28,BLUE,'middle')
  s+=label(140,185,'尺度・図面の改訂')+label(810,185,'印刷の大きさと区別')
 elif family=='layout':
  s+=rect(80,240,520,450,'#dbe7ed',INK,12)
  for i in range(3):s+=rect(150+i*135,335,90,130,'#6e8b9d',INK,8)+text(195+i*135,415,f'K{i+1}',28,'white','middle')
  for i in range(5):s+=circ(165+i*75,600,13,ORANGE,INK)
  s+=line(780,330,865,330)+line(975,330,1260,330)+line(780,650,1260,650)+contact(920,330)+circ(1130,490,55,'white',INK)+label(1090,500,'K1')+line(1130,330,1130,435)+line(1130,545,1130,650)
  s+=label(130,200,'配置：どこにあるか')+label(800,200,'接続：どこにつながるか')
 elif family=='materials':
  s+=wire(120,360,280)+rect(670,270,190,220,'#c3cdd4',INK,8)+coil(690,340,4,18)+rect(1040,290,170,190,'#ecdfc5',INK,10)
  s+=label(130,240,'導電：電気を通す')+label(630,240,'磁性：磁界との関係')+label(1000,240,'絶縁：条件を照合')
  s+=rect(160,610,1040,80,'#f8e6cf',ORANGE,10)+circ(240,650,35,RED,INK)+line(240,650,240,570,RED,15)
  s+=label(320,665,'温度・厚さ・周囲条件を別々に確認')
 elif family=='resistor':
  s+=line(100,440,340,440,GRAY,16)+line(1040,440,1290,440,GRAY,16)+rect(330,340,720,200,'#d6be8a',INK,80)
  for x,c in [(420,'#754323'),(550,'#18212b'),(680,'#be3d40'),(910,GOLD)]:s+=rect(x,350,55,180,c,c,0)
  for x,t in [(445,'1'),(575,'0'),(705,'×100'),(935,'±5%')]:s+=line(x,550,x,630,GRAY,3)+text(x,685,t,34,INK,'middle')
  s+=label(210,250,'四帯：数字・倍率・許容差')+label(400,770,'学習例：1 kΩ ±5%')
 elif family=='diode':
  s+=line(140,390,440,390)+path('M440 320L440 460L580 390Z',fill='#7db1c9')+line(590,310,590,470)+line(590,390,780,390)+label(190,330,'A')+label(680,330,'K')+arrow(260,540,680,540,BLUE)+label(340,600,'順方向の概念')
  s+=axes(890,560,350,260)+sine(910,450,290,60,2,GRAY)
  pts=[]
  for i in range(121):pts.append((910+i*2.4,650-max(0,math.sin(i/120*4*math.pi))*65))
  s+=path('M'+'L'.join(f'{a} {b}' for a,b in pts),stroke=TEAL,w=5)+label(900,740,'片方向を取り出す')
 elif family=='esd':
  s+=bench(130,570)+rect(170,480,450,90,'#91c9c0',INK,5)+pcb(220,330,350,180,True)
  s+=path('M720 500C810 390 850 570 930 460',stroke=TEAL,w=10)+circ(970,430,85,'#e8c6a4',INK)+rect(900,445,130,42,BLUE,INK,7)
  s+=chip(1110,380,170,110)+rect(1010,310,205,180,'none',GRAY,1)+label(170,245,'指定マット・部品容器')+label(830,680,'作業者・台・部品を一組で確認')
 elif family=='logic':
  s+=path('M250 320V500H350A90 90 0 0 0 350 320Z',fill='#d0e5ed')+line(110,365,250,365)+line(110,455,250,455)+line(440,410,580,410)+label(270,265,'AND')
  s+=path('M780 320Q850 410 780 500Q950 500 1030 410Q950 320 780 320Z',fill='#d0e5ed')+line(660,365,805,365)+line(660,455,805,455)+line(1030,410,1180,410)+label(825,265,'OR')
  for x,t in [(140,'A'),(140,'B'),(660,'A'),(660,'B')]:pass
  s+=label(105,345,'A')+label(105,505,'B')+label(655,345,'A')+label(655,505,'B')
  for x,col in [(260,[0,0,0,1]),(850,[0,1,1,1])]:
   for i,v in enumerate(col):s+=circ(x+i*65,650,23,TEAL if v else 'white',INK)+text(x+i*65,735,f'{i//2}{i%2}',26,INK,'middle')
  s+=label(150,790,'入力 00・01・10・11 を全て比較')
 elif family=='maintenance':
  s+=motor(340,440)+magnify(430,485,80)+doc(930,265,'状態・交換記録',300,340)+axes(800,735,420,150)
  s+=path('M820 700L900 690L980 660L1060 625L1130 590',stroke=ORANGE,w=6)+label(160,705,'異音・振動・摩耗の兆候')+label(880,235,'予防・状態監視・事後')
 elif family=='passive':
  s+=resistor(100,395,230)+coil(590,400,5,23)+capacitor(1080,400)
  s+=label(100,260,'抵抗：R')+label(570,260,'コイル：L')+label(1000,260,'コンデンサ：C')
  s+=rect(220,600,190,110,'#dbb6a5',INK,6)+''.join(line(240+i*32,610,240+i*32,700,ORANGE,5) for i in range(5))
  s+=rect(600,585,230,145,'#dce7ed',INK,3)+''.join(line(625+i*35,595,625+i*35,720,BLUE,8) for i in range(5))
  s+=label(230,790,'構造と定格を別々に照合')
 elif family=='transistor':
  s+=circ(350,400,150,'#d8e7ed',INK)+line(350,295,350,505,INK,7)+line(350,350,470,265)+line(350,450,470,535)+line(170,400,350,400)+arrow(395,480,450,520,BLUE)
  s+=label(120,370,'B')+label(475,250,'C')+label(475,580,'E')+label(200,680,'三端子の役割と向き')
  s+=axes(820,480,380,180)+sine(835,390,350,50,1,TEAL)+path('M830 690V570H920V690H1010V570H1100V690H1200',stroke=BLUE,w=6)+label(850,255,'増幅とスイッチ動作')
 elif family=='ic':
  s+=chip(680,425,280,210)+sine(95,420,300,70,1,TEAL)+path('M1010 500V350H1080V500H1150V350H1220V500',stroke=BLUE,w=7)
  s+=label(100,260,'連続する信号')+label(995,260,'二値の信号')+label(530,715,'機能・信号・仕様を照合')
 elif family=='computer':
  s+=pcb(100,265,630,360,True)+chip(390,445,190,160)+rect(160,680,500,80,'#9fb6c5',INK,8)
  for i in range(12):s+=rect(180+i*38,700,27,28,'white',INK,2)
  s+=rect(930,275,320,220,'#d8e7ed',INK,12)+line(1090,495,1090,590,GRAY,18)+line(1000,590,1180,590,GRAY,15)
  for i,t in enumerate(['8','4','2','1']):s+=rect(875+i*105,650,90,80,TEAL if i in [0,2,3] else 'white',INK,4)+text(920+i*105,785,t,30,INK,'middle')
  s+=label(140,225,'入力・記憶・制御・演算')+label(970,225,'出力')
 elif family=='pcb':
  s+=pcb(90,330,510,320,False)+pcb(800,330,510,320,True)+label(120,245,'配線パターンを形成')+label(830,245,'部品を取り付ける')+label(130,740,'基材と銅の役割')+label(850,740,'実装後は接合も検査')
 elif family=='grease':
  s+=circ(420,435,190,'#a7bbc6',INK)+circ(420,435,115,'white',INK)+circ(420,435,70,'#bcc9d1',INK)
  for a in range(0,360,45):
   r=math.radians(a);s+=circ(420+150*math.cos(r),435+150*math.sin(r),29,'#7fb69c',INK)
  s+=rect(960,310,250,280,'#d3e2ce',INK,12)+rect(1035,260,100,65,TEAL,INK,5)+label(985,455,'指定グリス')+label(800,710,'種類・量・箇所を照合')+label(230,740,'潤滑：接触部の摩擦を抑える')
 elif family=='selfhold':
  s+=line(120,250,120,700)+line(1270,250,1270,700)+line(120,355,245,355)+line(355,355,595,355)+line(705,355,1055,355)+line(1165,355,1270,355)+contact(300,355,True)+contact(650,355)+circ(1110,355,55,'white',INK)+text(1110,367,'R',34,INK,'middle')
  s+=path('M480 355V565H595M705 565H880V355',stroke=INK,w=5)+contact(650,565)+label(210,270,'停止 b接点')+label(565,270,'起動 a接点')+label(555,645,'自己接点 R')
  s+=rect(350,735,700,1,'none','none',0)+label(320,755,'起動を離しても並列経路を追う')
 elif family=='motor':
  s+=motor(350,440)+rect(950,330,230,220,'#d3dfe6',INK,15)+circ(1065,440,70,'white',INK)
  for a in range(0,360,30):s+=line(1065+50*math.cos(math.radians(a)),440+50*math.sin(math.radians(a)),1065+67*math.cos(math.radians(a)),440+67*math.sin(math.radians(a)),INK,3)
  s+=path('M565 440H800V600H1065V550',stroke=BLUE,w=5)+label(160,235,'固定子・回転子・軸')+label(870,235,'検出と制御を照合')+label(780,730,'入力と軸出力は別の量')
 elif family=='breaker':
  for i,(t,c) in enumerate([('遮断器',ORANGE),('開閉器',BLUE),('断路器',GRAY)]):
   x=120+i*440;s+=rect(x,300,310,340,'#d9e4e9',INK,15)+contact(x+155,470)+rect(x+100,360,110,65,c,INK,5)+text(x+155,245,t,34,INK,'middle')
   s+=line(x+155,300,x+155,400)+line(x+155,520,x+155,640)
  s+=label(170,750,'開閉・保護・隔離：名称だけで代用しない')
 elif family=='solar':
  s+=rect(95,330,320,230,BLUE,INK,2)
  for i in range(1,5):s+=line(95+i*64,330,95+i*64,560,'white',2)
  for i in range(1,3):s+=line(95,330+i*77,415,330+i*77,'white',2)
  s+=circ(200,220,55,GOLD,ORANGE)+arrow(200,280,250,325,ORANGE)+rect(560,350,240,200,'#98c6ad',INK,10)+rect(610,325,35,25,INK,INK,1)+rect(715,325,35,25,INK,INK,1)
  s+=rect(965,335,300,235,'#d9e5e9',INK,15)+sine(1000,450,220,60,1,BLUE)+label(115,650,'光→電気')+label(555,650,'蓄える')+label(940,650,'直流／交流を変換')
 elif family=='hydraulic':
  s+=rect(110,550,300,110,'#dce9ed',INK,3)+circ(260,420,65,'white',INK)+path('M230 450L290 450L260 390Z',fill=BLUE)
  s+=path('M260 355V280H640V570H860V410H1190',stroke=BLUE,w=8)+rect(570,330,140,180,'white',INK,1)+arrow(610,475,680,365,INK)
  s+=rect(930,330,260,160,'#b9d1dd',INK,2)+rect(1010,340,30,140,GRAY,INK,1)+line(1040,410,1310,410,GRAY,20)
  s+=label(120,755,'ポンプ')+label(550,755,'制御弁')+label(960,755,'アクチュエータ')
 elif family=='packaging':
  s+=package_scene(130,350,False)+package_scene(900,350,True)+magnify(360,420,75)+label(130,260,'保護条件が不足')+label(880,260,'緩衝・固定・表示を確認')
  s+=doc(535,370,'数量・届け先',270,300)
 elif family=='injection':
  s+=path('M130 230H350L300 380H180Z',fill='#bfd4de')+rect(135,390,660,130,'#d8e3e9',INK,25)
  for i in range(9):s+=path(f'M{180+i*55} 405l45 100',stroke=GRAY,w=8)
  s+=rect(865,295,330,320,'#a9c1cf',INK,4)+rect(1015,315,35,280,ORANGE,INK,1)+path('M790 455H1015',stroke=ORANGE,w=20)
  s+=line(1040,455,1260,455,GRAY,18)+label(120,680,'材料・可塑化・計量')+label(865,680,'型締め・充填・離型')
 elif family=='fastener':
  for x,k,t in [(270,'hex','六角'),(700,'slot','すり割り'),(1120,'cross','十字')]:s+=bolt(x,430,k)+text(x,715,t,32,INK,'middle')
  s+=path('M190 245h160v55h-160Z',fill=BLUE)+line(270,300,270,350,GRAY,18)+path('M625 240h150v55h-150Z',fill=BLUE)+line(700,295,700,350,GRAY,12)+path('M1040 240h160v55h-160Z',fill=BLUE)+line(1120,295,1120,350,GRAY,12)
  s+=label(270,200,'頭部と工具先端の形を照合する')
 elif family=='drilling':
  for i in range(3):
   x=110+i*440;s+=rect(x,515,310,150,'#cad5db',INK,2)+line(x+155,280,x+155,500,GRAY,30)
   if i==0:s+=path(f'M{x+138} 470L{x+155} 510L{x+172} 470',fill=GRAY)
   elif i==1:
    for j in range(7):s+=line(x+135,310+j*26,x+175,330+j*26,INK,3)
    s+=rect(x+136,515,38,150,'white',INK,0)
   else:
    for j in range(8):s+=line(x+132,310+j*22,x+178,310+j*22,INK,3)
    for j in range(8):s+=line(x+130,530+j*16,x+180,545+j*16,INK,3)
  s+=label(145,755,'位置を決める')+label(600,755,'下穴をあける')+label(1040,755,'ねじを加工')
 elif family=='files':
  for i,(t,d) in enumerate([('平', 'M160 400h190v90H160Z'),('丸',''),('三角','M1030 500L1120 340L1210 500Z')]):
   if i==1:s+=circ(700,430,90,'#c0ccd3',INK)
   else:s+=path(d,fill='#c0ccd3')
   x=[140,600,1020][i];s+=rect(x,620,210,65,'#cba67f',INK,20)+line(x+200,652,x+290,652,GRAY,20)+text(x+100,765,t,32,INK,'middle')
  s+=label(260,240,'加工する面・穴と断面を対応させる')
 elif family=='field':
  for x,t in [(330,'電動作用'),(1050,'発電作用')]:
   s+=rect(x-170,300,115,280,'#a4c2d1',INK,10)+rect(x+55,300,115,280,'#d3b6c2',INK,10)+text(x-115,435,'N',38,INK,'middle')+text(x+110,435,'S',38,INK,'middle')
   s+=line(x,315,x,590,ORANGE,20)+arrow(x-35,460,x+40,460,BLUE)+arrow(x,390,x,305,TEAL)+circ(x,500,25,'white',INK)+line(x-15,485,x+15,515,INK,4)+line(x+15,485,x-15,515,INK,4)+text(x,240,t,34,INK,'middle')
  s+=label(295,275,'I')+label(1015,275,'v')+label(375,490,'B')+label(1095,490,'B')+label(370,560,'F')+label(1090,560,'I')
  s+=label(185,750,'磁界・電流・力の向きを区別')+label(925,750,'運動と誘導の向きを確認')
 elif family=='exam':
  s+=doc(130,260,'学科',400,380)+rect(185,385,280,120,'white',GRAY,0)
  for i in range(3):
   for j in range(4):s+=circ(220+j*65,420+i*30,8,'white',INK,2)
  s+=bench(770,590)+'<g transform="translate(785,370) scale(.65)">'+caliper(0,0)+'</g>'+rect(835,475,170,95,'#c7ae8e',INK,2)+label(915,250,'実技：観察・判断')+label(170,760,'別々の達成を確認する')
 elif family=='toolsort':
  s+=rect(110,240,560,470,'#dbe7ed',INK,10)
  for i in range(4):
   x=185+i*120;s+=line(x,310,x,500,BLUE,20)+circ(x,530,35,'none',BLUE,7)
  s+=rect(490,290,90,300,'none',RED,4)+box(850,420,180,180)+box(1090,420,180,180)+label(140,780,'定位置・定品・定量')+label(835,325,'混入と不足を見つける')
 elif family=='ppe':
  s+=path('M150 415Q320 250 490 415L450 480H190Z',fill='#c3e5f0')+line(180,410,460,410,BLUE,8)
  s+=path('M620 285h180v300q-90 100-180 0Z',fill='#d8edf2')+line(610,295,810,295,BLUE,18)
  s+=path('M1040 330q120-70 180 50v180q-90 80-180-20Z',fill='#d9e4e9')+line(1030,425,1225,425,GRAY,8)
  s+=label(170,720,'飛来・飛散')+label(615,720,'顔全体の防護')+label(1010,720,'呼吸用：対象を照合')+label(150,220,'危険と指定された保護具を対応させる')
 elif family=='signs':
  s+=circ(280,420,150,'white',RED,22)+line(170,310,390,530,RED,24)+path('M155 445h250v60H155Z',fill='#333')
  s+=path('M700 255L875 565H525Z',fill='#f6d751',stroke=INK,w=12)+path('M720 335l-70 100h65l-40 95l95-120h-65Z',fill=INK,stroke=INK)
  s+=rect(1010,275,300,300,'#148d65','#148d65',4)+path('M1080 325h140v205h-140Z',stroke='white',w=10)+arrow(1040,600,1280,600,TEAL)
  s+=label(200,740,'禁止')+label(625,740,'危険・注意')+label(1090,740,'避難方向')
 elif family=='chemical':
  s+=rect(140,360,230,300,'#d2e4dd',INK,22)+rect(190,285,130,75,GRAY,INK,5)+path('M255 405L320 470L255 535L190 470Z',fill='white',stroke=RED,w=9)+path('M235 490q-20-50 25-75q-5 35 20 45q25 40-20 50Z',fill=INK)
  s+=doc(535,260,'SDS',350,430)+rect(1020,310,220,300,'#d8e7eb',INK,2)+line(1000,610,1270,610,TEAL,15)+label(990,725,'換気・保護・緊急対応')+label(130,755,'ラベルと資料を照合')
 elif family=='qcfactors':
  s+=bench(400,550)+pcb(430,330,430,220,True)+motor(1120,450)+box(110,395,190,150)+doc(510,620,'作業条件',340,170)
  s+=label(100,270,'材料／部品')+label(1020,245,'機械／設備')+label(510,230,'人・作業方法')+label(185,770,'変化を記録し、要求品質と照合する')
 elif family=='standard':
  s+=pcb(100,330,420,240,True)+caliper(760,430)+doc(850,220,'対象・版・要求',370,370)
  s+=magnify(380,525,85)+label(95,740,'現物の適合と記録')+label(800,735,'規格・認証・個別検査を区別')
 elif family=='units':
  s+=rect(110,350,450,85,'#e0c697',INK,2)
  for i in range(21):s+=line(125+i*21,350,125+i*21,385 if i%5 else 410,INK,2)
  s+=text(335,510,'長さ：m・mm',34,INK,'middle')+rect(760,300,250,250,'#a6ccdf',INK,0)+label(775,635,'面積：mm²')
  s+=path('M1060 380l130-70l100 60v190l-130 70l-100-60Z',fill='#d8c5a9')+line(1060,380,1160,440)+line(1160,440,1290,370)+line(1160,440,1160,630)+label(1040,720,'体積：mm³')
 elif family=='chemistry':
  for x,c,t in [(140,'#e69a95','酸性'),(570,'#9ac8bc','アルカリ性'),(1020,'#e4cc96','密度の比')]:
   s+=path(f'M{x} 300v280q0 80 200 80V300',fill='#ffffff88')+path(f'M{x+5} 455h190v120q-95 65-190 0Z',fill=c,stroke='none')+text(x+100,740,t,32,INK,'middle')
  s+=line(170,260,260,430,GRAY,12)+line(600,260,700,420,GRAY,12)+circ(1120,440,35,'#d6ac79',INK)+label(145,220,'別の量・反応を一つの尺度にしない')
 elif family=='recycle':
  s+=pcb(120,300,420,260,True)+box(760,420,190,160)+box(1060,420,190,160)+chip(850,350,100,80)+coil(1090,340,3,16)
  s+=rect(190,600,320,115,'#dce8ed',INK,3)+rect(825,610,55,80,ORANGE,INK,1)+rect(1115,610,55,80,GRAY,INK,1)
  s+=label(135,240,'分解前に再使用条件を確認')+label(760,740,'回収・分別・再資源化')
 elif family=='law':
  s+=rect(150,300,250,300,'#d9e6eb',INK,20)+rect(205,375,140,110,'#90b7c9',INK,6)+line(275,600,275,670,GRAY,15)+doc(535,260,'適用・時点',300,390)
  s+=rect(970,300,280,330,'#e1e8e9',INK,3)+line(1015,350,1015,580,BLUE,10)+line(1090,350,1090,580,ORANGE,10)+line(1165,350,1165,580,TEAL,10)+label(130,755,'製品の条件')+label(935,755,'設備・作業者の条件')
 elif family=='projection':
  s+=path('M180 650V400H430V500H560V650Z',fill='#a8c8d8')+path('M180 400l90-90h250l-90 90M430 400l90-90v100l130 0v150l-90 90M430 500l90-90',stroke=INK,w=4)
  s+=path('M830 660V420H1025V520H1130V660Z',fill='#e3edf1')+rect(830,220,300,130,'#d9e6ed',INK,0)+line(1025,220,1025,350,INK,3)+rect(1195,420,110,240,'#e7edf0',INK,0)+line(1195,520,1305,520,INK,3)
  s+=label(175,765,'立体を方向ごとに見る')+label(815,740,'正面・平面・右側面')
 elif family=='fits':
  s+=rect(140,350,420,230,'#bacdd8',INK,0)+rect(260,345,180,240,'white',INK,0)+rect(287,250,126,430,'#d6be9b',INK,1)
  s+=line(130,710,570,710,BLUE,3)+label(185,780,'穴と軸の寸法関係')+axes(810,590,450,250)
  pts=[(820+i*10,460+25*math.sin(i*1.4)+13*math.sin(i*.5)) for i in range(42)]
  s+=path('M'+'L'.join(f'{x} {y}' for x,y in pts),stroke=ORANGE,w=5)+line(820,460,1240,460,GRAY,3,'8 6')+label(850,735,'表面の微細な凹凸')
 elif family=='machining':
  s+=rect(110,360,470,190,'#d9e4ea',INK,3)+rect(180,405,310,100,'#d2b38e',INK,3)+circ(190,455,65,'#c3ced4',INK)+arrow(150,300,230,290,BLUE)+path('M430 570l-80-80l120 25Z',fill=ORANGE)
  s+=rect(860,530,390,110,'#c9b08c',INK,2)+line(1060,290,1060,510,GRAY,40)+path('M1010 470h100v55h-100Z',fill='#a1b9c8')+arrow(980,290,1120,290,BLUE)
  s+=label(130,735,'旋盤：工作物の回転')+label(835,735,'フライス：工具の回転')
 elif family=='power':
  s+=wire(120,330,350)+wire(120,600,520)+label(130,245,'材料・長さ・断面積')+label(760,255,'瞬間の電力と積算電力量')
  s+=meter(860,320,'W')+circ(1210,470,85,'white',INK)+line(1210,470,1210,410)+line(1210,470,1250,490)+label(1010,770,'W × h → Wh')
 elif family=='wave':
  s+=axes(110,450,500,230)+sine(130,330,460,80,2,BLUE)+label(160,590,'同じ位相までが一周期')
  s+=axes(800,650,450,350)+path('M810 640Q870 370 1180 370',stroke=TEAL,w=6)+line(810,370,1230,370,GRAY,3,'10 8')+label(810,735,'過渡状態と定常状態')
 elif family=='kirchhoff':
  s+=circ(350,440,18,INK,INK)+arrow(100,440,325,440,BLUE)+arrow(360,425,560,270,TEAL)+arrow(365,450,560,600,ORANGE)+label(100,380,'流入')+label(490,240,'流出')+label(490,690,'流出')
  s+=path('M900 300H830V650H1190V300H1090',stroke=INK,w=6)+resistor(900,300,190)+circ(830,470,50,'white',INK)+text(830,480,'E',32,INK,'middle')+arrow(900,555,1100,555,BLUE)+label(800,760,'閉路の極性と向きをそろえる')
 elif family=='fet':
  for x,names,title in [(350,['G','D','S'],'FET'),(1050,['G','C','E'],'IGBT')]:
   s+=rect(x-120,280,240,280,'#344a5b',INK,15)+circ(x,340,25,'#718693',INK)
   for i,t in enumerate(names):s+=rect(x-85+i*70,560,30,145,'#c0cbd1',INK,0)+text(x-70+i*70,765,t,34,INK,'middle')
   s+=text(x,450,title,40,'white','middle')
  s+=label(180,220,'制御端子と主電流端子を照合する')
 elif family=='clamp':
  s+=meter(150,330,'Ω',True)+path('M950 460C780 260 850 200 1000 240C1150 200 1220 300 1060 460',stroke=TEAL,w=38)+rect(920,430,175,270,'#d3dfdf',INK,25)+line(1000,180,1000,430,ORANGE,16)
  s+=label(120,750,'レンジと目盛')+label(850,760,'囲む導体とAC/DC仕様')
 elif family=='relay':
  s+=coil(160,450,7,25)+rect(150,530,360,60,'#9eb8c6',INK,5)+path('M260 320H580L650 250',stroke=GRAY,w=16)+line(600,250,600,330,GRAY,18)
  s+=chip(1040,440,260,170)+path('M850 370H910M1170 370H1260M850 510H910M1170 510H1260',stroke=BLUE,w=8)
  s+=label(150,225,'コイルと可動接点')+label(925,225,'半導体出力：SSR')+label(160,755,'入力・復帰・出力方式を分ける')
 elif family=='speed':
  s+=motor(300,440)+circ(650,440,95,'#c3d3dd',INK)+''.join(line(650+70*math.cos(i*math.pi/6),440+70*math.sin(i*math.pi/6),650+90*math.cos(i*math.pi/6),440+90*math.sin(i*math.pi/6),INK,3) for i in range(12))
  s+=meter(1000,310,'回転数')+line(650,535,650,680,BLUE,6)+line(650,680,1110,680,BLUE,6)+label(130,230,'回転磁界と実際の回転')+label(850,760,'検出値・入力・軸出力')
 elif family=='transformloss':
  s+=transformer(200,350)+transformer(900,350)+rect(850,300,360,330,'none',BLUE,4)
  for x in [250,350,950,1050]:s+=path(f'M{x} 300q-30-30 0-60q30-30 0-60',stroke=RED,w=5)
  s+=label(140,735,'鉄心・巻線と損失')+label(840,735,'絶縁方式・保守条件')
 elif family=='multitest':
  s+=magnify(235,390,110)+pcb(105,460,260,170,False)+caliper(770,315)+rect(795,500,180,100,'#c1a582',INK,2)
  s+=rect(450,270,270,400,'#d8e7ec',INK,15)+rect(485,350,200,180,'#b5d2df',INK,4)+circ(585,615,20,ORANGE,INK)
  s+=label(100,765,'外観')+label(460,765,'環境・機能')+label(920,765,'寸法・構造')
 elif family=='ppm':
  s+=package_scene(100,300,True)
  for i in range(4):s+=box(740+(i%2)*250,300+(i//2)*180,200,150)
  s+=rect(750,310,45,45,RED,RED,1)+label(130,720,'荷姿の表示と保護')+label(750,750,'不良数／総数をそろえる')
 elif family=='mold':
  s+=rect(150,260,420,420,'#aac0ce',INK,3)+path('M350 280v110h100v160H350v110',stroke=ORANGE,w=35)+line(90,470,330,470,GRAY,20)
  s+=rect(850,330,350,280,'#d4d7c4',INK,4)
  for i in range(9):s+=line(870,350+i*28,1180,350+i*28,TEAL,7)
  s+=magnify(1080,520,95)+label(160,760,'流路・型の保持・離型')+label(840,760,'繊維の向きと材料の条件')
 elif family=='pcbprocess':
  for i,(t,mask,copper) in enumerate([('保護膜',True,True),('現像',True,True),('不要銅を除去',True,False),('膜を除去',False,False)]):
   x=70+i*340;s+=rect(x,495,270,140,'#cfc6aa',INK,0)
   if copper:s+=rect(x,460,270,35,ORANGE,INK,0)
   else:s+=rect(x+40,460,65,35,ORANGE,INK,0)+rect(x+175,460,65,35,ORANGE,INK,0)
   if mask:s+=(rect(x,425,270,35,BLUE,INK,0) if i==0 else rect(x+40,425,65,35,BLUE,INK,0)+rect(x+175,425,65,35,BLUE,INK,0))
   s+=text(x+135,725,t,29,INK,'middle')
  s+=label(120,260,'基材・銅・膜を分けて断面を読む')+label(100,335,'独立した概念図：材料方式の違いは別に確認')
 elif family=='contactors':
  s+=coil(160,430,5,27)+rect(110,530,400,100,'#b3cbd8',INK,5)+line(470,320,900,320,GRAY,16)+contact(780,320)+rect(960,300,260,310,'#d7e2e8',INK,8)
  s+=path('M1010 360q40 30 0 70q-40 30 0 70',stroke=ORANGE,w=16)+line(1030,530,1190,530,RED,7)+label(100,740,'主回路の開閉')+label(950,740,'過負荷の検出')+label(340,230,'機能を組み合わせても役割は別')
 elif family=='linetypes':
  s+=rect(250,270,760,400,'#e8f0f3',INK,0)
  s+=line(350,470,910,470,BLUE,3,'20 8 4 8')+line(630,220,630,710,BLUE,3,'20 8 4 8')
  s+=line(250,735,1010,735,TEAL,3)+line(250,690,250,765,TEAL,3)+line(1010,690,1010,765,TEAL,3)
  s+=line(485,350,485,585,GRAY,3,'12 9')+line(775,350,775,585,GRAY,3,'12 9')
  s+=line(485,350,775,350,GRAY,3,'12 9')+line(485,585,775,585,GRAY,3,'12 9')
  s+=label(90,215,'外形：太い実線')+label(930,220,'中心：一点鎖線')+label(1010,590,'内部：破線')+label(545,795,'寸法：細い線')
 elif family=='qcplan':
  s+=bench(100,570)+pcb(120,355,400,200,True)+caliper(155,275)
  s+=doc(740,240,'標準作業',270,400)+doc(1070,240,'管理条件',270,400)
  s+=circ(845,550,42,'white',INK)+line(845,550,845,520)+line(845,550,875,550)+magnify(1180,520,55)
  s+=label(120,745,'何を・どう測るか')+label(740,745,'頻度・方法・異常時処置')
 elif family=='fieldgraph':
  s+=circ(240,410,75,'#b9d5e3',INK)+circ(570,410,75,'#b9d5e3',INK)+text(240,425,'+',50,INK,'middle')+text(570,425,'+',50,INK,'middle')+arrow(155,410,80,410,RED)+arrow(655,410,730,410,RED)+line(320,565,490,565,GRAY,3)
  s+=axes(850,650,400,350)+line(860,640,1140,330,BLUE,6)+line(860,640,1190,495,ORANGE,6)+label(805,265,'横軸V・縦軸I')+label(1175,690,'V')+label(815,325,'I')
  s+=label(120,750,'点電荷モデルの距離と力')+label(860,755,'直線の傾き I/V = 1/R')
 elif family=='motortransformer':
  s+=motor(330,440)+transformer(920,330)
  s+=circ(655,455,55,'white',INK)+line(630,455,680,455,BLUE,5)+line(655,430,655,480,BLUE,5)
  s+=label(145,230,'回転子・固定子・検出')+label(895,230,'鉄心・巻線・絶縁')+label(170,750,'運動への変換')+label(900,750,'交流の電圧変換')
 elif family=='pcbscale':
  s+=pcb(100,300,500,320,False)+chip(1040,440,270,230)+magnify(1110,420,145)
  for i in range(10):s+=line(1000+i*20,350,1000+i*20,500,ORANGE,3)
  s+=label(150,735,'配線板：構造・膜・銅')+label(870,735,'IC：微細な加工の桁')+label(830,250,'mm と nm を混同しない')
 else:raise ValueError(family)
 return s

FAMILIES={
1:'wire',2:'solder',3:'vernier',4:'micrometer',7:'scope',8:'inspection',9:'report',10:'risk',11:'variation',12:'pareto',13:'drawing',14:'layout',15:'materials',16:'resistor',18:'diode',19:'esd',20:'logic',21:'maintenance',22:'passive',23:'transistor',24:'ic',25:'computer',26:'pcb',27:'grease',28:'selfhold',29:'motor',31:'breaker',32:'solar',33:'hydraulic',34:'packaging',35:'injection',36:'fastener',37:'drilling',40:'drilling',41:'files',42:'field',43:'exam',44:'risk',45:'toolsort',46:'ppe',47:'signs',48:'chemical',49:'risk',50:'qcfactors',51:'inspection',52:'qcplan',53:'variation',54:'standard',55:'units',56:'chemistry',57:'recycle',58:'law',59:'standard',60:'projection',61:'fits',62:'layout',63:'materials',64:'wire',65:'solder',66:'passive',67:'machining',68:'power',69:'wave',70:'kirchhoff',72:'fet',73:'clamp',74:'toolsort',75:'logic',76:'relay',78:'speed',79:'transformloss',80:'multitest',81:'maintenance',82:'ppm',83:'mold',84:'pcbprocess',85:'risk',86:'linetypes',88:'materials',89:'fastener',90:'drilling',92:'passive',93:'fieldgraph',94:'contactors',95:'motortransformer',96:'multitest',97:'packaging',98:'pcbscale'}
EXISTING={5:'batch20-electrical-meter-connections.png',6:'ohms-law.png',17:'series-parallel.png',30:'transformer-ratio.png',38:'batch07-electrical-comparison-measurement.png',39:'batch36-lcr.png',71:'batch12-electrical-pn-junction.png',77:'batch12-electrical-time-delays.png',87:'batch12-electrical-symbol-bank.png',91:'batch36-hall.png'}
KEY_FOCUS={39:'LCRメーターが測る量と測定情報の対応を説明する。',46:'作業の危険に合わせ、目・顔・呼吸の保護具を区別する。',49:'可動部の危険の兆候を共有し、隔離と報告につなげる。',51:'現物の不適合箇所を確認し、観察事実を記録する。',52:'測定箇所と、標準作業・管理条件の記録を照合する。',53:'分布を表す図と時間順の変化を表す図の目的を分ける。',55:'長さ・面積・体積の単位を混同しない。',56:'酸・アルカリの指標と密度の比を別々の量として読む。',57:'部品の再使用条件を確認し、回収・分別へつなげる。',59:'規格の対象と版を現物の確認へ結び付ける。',61:'穴と軸の寸法関係と表面の凹凸を別の要求として読む。',63:'材料の電気・磁気・熱の性質を別々に確認する。',66:'抵抗・コイル・コンデンサを構造と役割で区別する。',74:'片付け時に定位置と数量を確認し、不足・混入を見つける。',78:'回転する機構と回転数の検出を分けて確認する。',80:'外観・寸法・環境や機能の試験目的を分ける。',81:'異音・振動・摩耗などの兆候を記録し、比較条件をそろえる。',85:'可動部の安全装置と異常時の隔離・報告を確認する。',86:'外形線・かくれ線・中心線・寸法線を形状と対応させる。',89:'ねじ頭部と工具先端の形を対応させる。',91:'ホール効果の三方向を対応させ、測定原理を説明する。',92:'受動部品の内部構造と役割を区別する。',97:'包装材の緩衝と固定を保護要求に対応させる。'}
REASONS={5:'電圧・電流・抵抗で接続を分ける図が、本日の測定前確認に直接対応する。',6:'電圧・電流・抵抗の量と式を示す既存の独立図を再利用する。',17:'直列と並列の配線形状が、同じ電流と同じ電圧の区別に直接対応する。',30:'二つの巻線と巻数比の関係を示す図が、変圧器の計算の基礎に直接対応する。',38:'比較測定の基準と変位を示す既存図が、測定基準をそろえる目的に対応する。',39:'本日の計器のうちLCRメーターの測定量を重点として、内部の測定情報との関係を示す。',71:'pn接合の領域・キャリア・空乏層を示す既存図が、本日の主要な理解対象に直接対応する。',77:'入力と出力を分けた時間図が、オンディレーとオフディレーの違いに直接対応する。',87:'部品の図記号と端子を並べた既存図が、形と機能の照合に直接対応する。',91:'本日の測定原理の一つであるホール効果を重点とし、三方向を分けて示す。'}

def main():
 rows=[];new=0
 for i,l in enumerate(LESSONS,1):
  n=int(l['id'].rsplit('l',1)[1]);family=FAMILIES.get(n,'existing')
  if n in EXISTING:
   asset=ROOT/'assets/manufacturing/diagrams'/EXISTING[n]
   reason=REASONS[n];origin='existing_independently_authored_project_diagram'
  else:
   name=f'electrical-day-{n:03d}';asset=OUT/(name+'.png')
   title=l['titleJa'];lines=[title[k:k+28] for k in range(0,len(title),28)]
   head=''.join(text(70,57+j*48,t,36,'white') for j,t in enumerate(lines))
   scene=figure(family,n)
   # Exact title and per-day objective are metadata/caption, not the visual
   # substitute: the central scene always contains controlled physical graphics.
   svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900"><rect width="1400" height="900" fill="#fffdf6"/><rect width="1400" height="135" fill="{INK}"/>{head}{scene}{text(70,866,"独立した学習用概念図・実機の操作手順ではありません",27,GRAY)}</svg>'
   (OUT/(name+'.svg')).write_text(svg)
   cairosvg.svg2png(bytestring=svg.encode(),write_to=str(asset),output_width=1400,output_height=900)
   with Image.open(asset) as im:im.convert('RGB').quantize(colors=192,method=Image.Quantize.MEDIANCUT).save(asset,optimize=True)
   reason=f'本日の「{l["objectiveJa"].splitlines()[0]}」を、{family}系の独立した機器・構造・状態比較として見える形にした。名称を並べるだけでなく、部品の位置、形状又は観測状態を読む。'
   origin='original_code_authored_controlled_svg_and_png';new+=1
  assert asset.exists() and not asset.read_bytes().startswith(b'version https://git-lfs')
  with Image.open(asset) as im:w,h=im.size
  rows.append({'lessonId':l['id'],'lessonSourceHash':l['sourceHash'],'specialty':'electrical','week':(i-1)//7+1,'day':(i-1)%7+1,'keyObjectiveId':l['id']+'-key-objective','keyObjectiveJa':KEY_FOCUS.get(n,l['objectiveJa'].splitlines()[0]),'assetId':f'mfg40-electrical-day-{n:03d}','assetFile':str(asset.relative_to(ROOT)),'width':w,'height':h,'sha256':hashlib.sha256(asset.read_bytes()).hexdigest(),'captionJa':l['summaryJa'],'altJa':l['titleJa'],'captionSourceField':'summaryJa','altSourceField':'titleJa','relevanceReasonJa':reason,'sourceRefs':l['sources'],'rights':{'origin':origin,'sourceArtworkCopied':False,'permissionBasis':'independent_project_authorship; no external artwork input'},'family':family,'existingAssetReused':n in EXISTING,'renderedByExistingComponent':n in EXISTING,'scope':'teaching_day_only_not_exam_answer_asset','reviewFlags':{'aiGeometryChecked':False,'aiPixelInspected':False,'domainReviewed':False,'nativeReviewed':False,'physicalDeviceVerified':False}})
 (HERE/'daily-bindings.json').write_text(json.dumps({'schemaVersion':1,'specialty':'electrical','scheduledDays':98,'sourceFile':'src/data/manufacturing/electrical.json','sourceFileSha256':hashlib.sha256((ROOT/'src/data/manufacturing/electrical.json').read_bytes()).hexdigest(),'bindings':rows},ensure_ascii=False,indent=2)+'\n')
 (HERE/'summary.json').write_text(json.dumps({'scheduledDays':98,'mappedDays':len(rows),'newSvgPngPairs':new,'existingRelevantAssetsReused':98-new,'newPngTotalBytes':sum((ROOT/r['assetFile']).stat().st_size for r in rows if not r['existingAssetReused']),'uniqueFamilies':len(set(FAMILIES.values())),'noCoreRuntimeEdits':True,'humanNativeDomainDeviceReview':False},ensure_ascii=False,indent=2)+'\n')
 print('ELECTRICAL DAILY40',len(rows),'mapped,',new,'new SVG/PNG pairs,',98-new,'existing art reused')

if __name__=='__main__':main()
