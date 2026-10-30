from pathlib import Path
from xml.sax.saxutils import escape
import subprocess,math,json,hashlib
R=Path(__file__).resolve().parents[2];OUT=R/'assets/manufacturing/recognition38';INK='#21384b';RED='#d6232e';GREEN='#18834b';BLUE='#306d90';ORANGE='#b25d2c';YELLOW='#ffdd35';PAPER='#fff9ed'
class G:
 def __init__(self,title):
  self.p=['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="context-stroke"/></marker><pattern id="hatch" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M0 16L16 0" stroke="#9aaba8" stroke-width="2"/></pattern></defs>',f'<rect width="1600" height="1000" fill="{PAPER}"/><g font-family="Noto Sans CJK JP,Noto Sans JP,sans-serif" fill="{INK}">'];self.t(55,65,title,36,True)
 def t(self,x,y,s,size=28,b=False,c=INK):self.p.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if b else 400}" fill="{c}">{escape(s)}</text>')
 def line(self,x,y,a,b,c=INK,w=4,arrow=False,both=False,dash=None):self.p.append(f'<line x1="{x}" y1="{y}" x2="{a}" y2="{b}" stroke="{c}" stroke-width="{w}" stroke-linecap="round"'+(' marker-end="url(#arrow)"' if arrow or both else '')+(' marker-start="url(#arrow)"' if both else '')+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
 def path(self,d,fill='none',c=INK,w=4):self.p.append(f'<path d="{d}" fill="{fill}" stroke="{c}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round"/>')
 def circle(self,x,y,r,fill='none',c=INK,w=4):self.p.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{c}" stroke-width="{w}"/>')
 def box(self,x,y,w,h,fill='none',c=INK,sw=4,r=5):self.p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{c}" stroke-width="{sw}"/>')
 def group(self,x,y):self.p.append(f'<g transform="translate({x} {y})">')
 def end(self):self.p.append('</g>')
 def human(self,pose='stand',c='#111'):
  if pose=='stand':self.circle(0,-44,13,c,c,1);self.line(0,-25,0,25,c,14);self.line(0,-15,-30,10,c,12);self.line(0,-15,30,10,c,12);self.line(0,25,-16,65,c,12);self.line(0,25,16,65,c,12)
  elif pose=='run':self.circle(25,-48,12,c,c,1);self.line(15,-30,-7,6,c,14);self.line(10,-20,-22,-30,c,11);self.line(-22,-30,-44,-8,c,11);self.line(10,-20,40,-3,c,11);self.line(-7,6,25,22,c,12);self.line(25,22,45,51,c,12);self.line(-7,6,-25,40,c,12);self.line(-25,40,-58,32,c,12)
 def icon(self,k):
  if k=='smoke':self.box(-58,22,95,18,'#111','#111',1,0);self.box(37,22,22,18,'none','#111',3,0);self.path('M20 8Q0-8 20-20T20-50','none','#111',8);self.path('M45 7Q25-9 45-22','none','#111',7)
  elif k=='fire':self.path('M0-65C-50-15-55 10-38 38C-12 80 50 60 50 16C50-8 30-25 23-38C25-5-8 2 0-65Z','#111','#111',2)
  elif k=='stand':self.human()
  elif k=='run':self.human('run')
  elif k=='hand':
   self.path('M-40 45L-52 5Q-56-8-45-10L-25 9L-25-48Q-25-61-14-54L-12-18L-8-66Q-2-78 5-64L7-20L15-58Q24-69 30-54L25-13L38-35Q51-39 49-24L37 39Q30 65 0 65Z','none','#111',7)
  elif k=='drink':self.path('M-60-47L5-47L5-24L40-24L40-6L-5-6L-5-26L-60-26Z','#111','#111',2);self.path('M-25 4L20 4L12 62L-15 62Z','none','#111',6);self.path('M-2-5Q-14 12-2 14Q10 12-2-5Z','#111','#111',1)
  elif k=='phone':self.box(-32,-65,64,130,'none','#111',8,8);self.box(-22,-43,44,61,'none','#111',4,0);self.circle(0,45,6,'#111','#111',1)
  elif k=='laptop':self.box(-62,-55,124,85,'none','#111',8,4);self.path('M-72 38L72 38L84 62L-84 62Z','#111','#111',2)
  elif k=='general':self.t(-13,52,'!',130,True,'#111')
  elif k in ['trip','up','down']:
   self.group(-10,-10);self.human('run');self.end()
   if k=='trip':self.box(20,43,38,26,'#111','#111',1,0);self.line(-70,70,75,70,'#111',6)
   elif k=='up':self.path('M-75 70L-10 70L-10 40L65 40','none','#111',8);self.line(30,20,65,-15,'#111',5,True)
   else:self.path('M-75 40L-10 40L-10 70L65 70','none','#111',8);self.line(30,-15,65,20,'#111',5,True)
  elif k=='slip':
   self.group(-5,-5);self.p.append('<g transform="rotate(-45)">');self.human('run');self.end();self.end();self.path('M-70 65Q-20 45 30 65M-30 80Q15 60 65 80','none','#111',5)
  elif k=='fall':self.path('M-75 50L5 50L5 95','none','#111',8);self.group(20,-25);self.p.append('<g transform="rotate(35)">');self.human('run');self.end();self.end()
  elif k=='head':self.line(-65,-65,65,-65,'#111',12);self.circle(0,-25,16,'#111','#111',1);self.path('M-5-5L-25 28L10 44M-23 27L-45 48M0 42L25 70M0 42L-25 75','none','#111',12);self.path('M-8-52L0-62L8-52L16-60','none','#111',4)
  elif k=='electric':self.path('M20-75L-40 8L-3 8L-25 77L45-20L8-20Z','#111','#111',2)
  elif k=='wave':self.path('M-77 72C-45 0 28-25 65 11C15-2 8 28 52 39L77 72Z','#111','#111',2);self.line(-78,78,78,78,'#111',5)
  elif k=='rocks':self.path('M25-78L80 80L-20 80Z','#111','#111',2);self.path('M-25-40L-5-55L10-35L-8-15Z','#111','#111',2);self.path('M-55 0L-35-15L-20 5L-37 25Z','#111','#111',2);self.path('M-73 42L-55 33L-45 52L-62 64Z','#111','#111',2)
  elif k=='corrosion':
   self.path('M-65-45L-15-25L-8-42L-58-62Z','none','#111',5);self.path('M20-58L65-38L72-55L27-75Z','none','#111',5)
   for x,y in [(-10,-10),(48,-13)]:self.path(f'M{x} {y}q-10 16 0 18q10-2 0-18Z','#111','#111',1)
   self.box(-70,42,65,12,'#111','#111',1,0);self.path('M10 60L25 30L70 30L73 44L42 48L34 65Z','#111','#111',2)
  elif k=='health':
   self.circle(0,-48,22,'#111','#111',1);self.path('M-22-17L-51 5L-65 73L65 73L51 5L22-17Z','#111','#111',1)
   self.path('M0-1L9 19L30 14L15 32L29 50L7 44L0 65L-8 43L-30 50L-15 31L-28 15L-9 19Z','white','white',1)
  elif k=='environment':
   self.path('M-33 55L-25-42M-27-12L-57-35M-27-23L0-50M-28 8L-60-6M-28-10L0-17','none','#111',8);self.line(-75,65,75,65,'#111',5);self.path('M5 38Q35 10 65 38L80 22L80 53L64 42Q35 67 5 38Z','#111','#111',1);self.line(35,26,43,40,'white',3);self.line(43,26,35,40,'white',3)
  elif k=='extinguisher':self.box(-25,-22,52,92,'white','white',2,5);self.line(-5,-22,-5,-55,'white',8);self.line(-5,-55,36,-55,'white',9);self.path('M-5-42Q-51-45-48-10L-48 40','none','white',7)
  elif k=='aed':self.t(-66,-60,'AED',40,True,'white');self.path('M0 68C-110-5-55-60 0-20C55-60 110-5 0 68Z','white','white',2);self.path('M15-26L-23 14L-1 14L-16 52L34-3L10-3Z',RED,RED,1)
  elif k=='open':self.p.append('<ellipse cx="0" cy="65" rx="85" ry="20" fill="white"/>');self.group(0,-20);self.human('run','white');self.end()
  elif k=='building':self.path('M-75-2L0-68L75-2L75 80L-75 80Z','white','white',1);self.box(-48,8,96,72,GREEN,GREEN,1,0);self.group(-5,38);self.p.append('<g transform="scale(.5)">');self.human('run','white');self.end();self.end()
  elif k=='evacwave':self.path('M-85 80L80-50L80 80Z','white','white',1);self.group(12,-35);self.p.append('<g transform="scale(.65)">');self.human('run','white');self.end();self.end();self.path('M-85 35Q-48-14-16 7Q-46-2-48 24L-25 38Z','white','white',1)
 def save(self,name,footer='学習用の独立した模式図。現場用表示・操作・現在の規格への適合を認証しません。'):
  self.t(50,960,footer,21);p=OUT/(name+'.svg');p.write_text(''.join(self.p)+'</g></svg>');subprocess.run(['inkscape',str(p),'--export-type=png','--export-filename='+str(OUT/(name+'.png')),'--export-width=1600','--export-height=1000'],check=True,capture_output=True)
def signs():
 sets=[('sign-prohibition','図1：禁止の模式表示（A～J）',['','smoke','fire','stand','run','hand','drink','phone','laptop','road']),('sign-warning','図2：危険を知らせる模式表示（A～J）',['general','trip','up','down','slip','fall','head','electric','wave','rocks']),('sign-chemical','図3：化学物質の危険情報の模式表示（A～E）',['fire','corrosion','health','environment','general']),('sign-emergency','図4：緊急設備・避難場所の模式表示（A～E）',['extinguisher','aed','open','building','evacwave'])]
 for name,title,icons in sets:
  g=G(title)
  for i,k in enumerate(icons):
   x=200+(i%5)*300;y=(330+380*(i//5)) if len(icons)>5 else 500;g.t(x-105,y-140,chr(65+i),42,True);g.group(x,y)
   if 'prohibition' in name:
    if k=='road':g.circle(0,0,110,RED,RED,3);g.box(-75,-20,150,40,'white','white',1,0)
    else:g.circle(0,0,110,'white',RED,14);g.icon(k);g.line(-78,-78,78,78,RED,15)
   elif 'warning' in name:g.path('M0-120L125 100L-125 100Z',YELLOW,'#111',9);g.group(0,20);g.p.append('<g transform="scale(.70)">');g.icon(k);g.end();g.end()
   elif 'chemical' in name:g.path('M0-125L125 0L0 125L-125 0Z','white',RED,10);g.p.append('<g transform="scale(.82)">');g.icon(k);g.end()
   else:g.box(-120,-120,240,240,GREEN if i>1 else RED,GREEN if i>1 else RED,2,8);g.icon(k)
   g.end()
  g.save(name)
def micrometer():
 g=G('図5：マイクロメータの独立した目盛模型')
 g.t(65,130,'ピッチ 0.5 mm／50分割。上段：1 mm、下段：0.5 mm。',29,True)
 g.box(150,225,655,505,'#e8efeb',BLUE,4,0);g.line(185,470,1380,470,INK,3)
 origin=245;step=170
 for half in range(7):
  x=origin+half*step/2
  if x>=805:continue
  if half%2==0:g.line(x,470,x,425,INK,4);g.t(x-15,405,str(12+half//2),30,True)
  else:g.line(x,470,x,515,INK,4)
 # Edge falls after14.5 and before15: integer12 at245,14.5 at670;edge805 <15at755?correct edge must<755.
 # Use opaque thimble edge at720, leaving14.5visible and15hidden.
 g.box(720,225,700,505,'#e0eaf1',BLUE,4,0)
 for value in range(17,30):
  y=470-(value-23)*32
  g.line(720,y,805 if value%5==0 else 775,y,INK,3)
  g.t(845,y+9,str(value),27,False)
 g.line(150,470,815,470,ORANGE,3)
 g.t(65,820,'基線に合うシンブル目盛を読む。主尺は端まで見える最後の値。',27)
 g.t(65,875,'この模型には0.001 mmの副尺や推定桁の指示はありません。',25)
 g.save('metrology-micrometer')
def dial(name,title,divisions,needle,increment,reference,positive,kind):
 g=G(title);g.t(65,130,f'1目盛 {increment} mm ／ 基準 {reference} mm',30,True);cx,cy,rad=540,490,265
 g.circle(cx,cy,rad,'#f5f8f1',BLUE,6)
 for i in range(divisions):
  a=2*math.pi*i/divisions;major=i%(10 if divisions==100 else 5)==0;ri=rad-(30 if major else 15)
  x,y=cx+math.sin(a)*ri,cy-math.cos(a)*ri;xx,yy=cx+math.sin(a)*rad,cy-math.cos(a)*rad;g.line(x,y,xx,yy,INK,3 if major else 2)
  if major:
   rr=rad-60;g.t(cx+math.sin(a)*rr-17,cy-math.cos(a)*rr+10,str(i if kind!='lever' or i<=divisions//2 else i-divisions),24,True)
 a=2*math.pi*needle/divisions;g.line(cx,cy,cx+math.sin(a)*(rad-12),cy-math.cos(a)*(rad-12),ORANGE,4);g.circle(cx+math.sin(a)*(rad-12),cy-math.cos(a)*(rad-12),3,ORANGE,ORANGE,1);g.circle(cx,cy,12,INK,INK,1)
 g.path('M900 250Q1000 250 1015 350','none',BLUE,5);g.line(1005,330,1015,350,BLUE,4,True);g.t(930,220,'＋表示方向',27,True)
 g.t(925,430,positive[0],29,True);g.t(925,480,positive[1],27)
 if kind=='plunger':g.box(515,760,50,95,'#e2ebe6',BLUE,3,0);g.circle(540,875,13,'#e2ebe6',BLUE,3);g.t(925,610,'直動式の模型',30,True)
 elif kind=='lever':g.line(530,760,610,865,GREEN,12);g.circle(610,865,12,'#e2ebe6',GREEN,3);g.t(925,610,'てこ式の模型',30,True);g.t(925,665,'測定方向のずれは',25);g.t(925,705,'別に確認する',25)
 else:g.line(540,760,540,830,GREEN,12);g.line(475,830,605,830,GREEN,10);g.circle(540,830,70,'none',BLUE,4);g.t(925,610,'内径比較の模型',30,True);g.t(925,665,'基準リングに対する',25);g.t(925,705,'この図の符号規則',25)
 g.save(name,'独立した一回転内の模型。目量・符号・基準は図内限定で、実機の手順ではありません。')
def holes():
 g=G('図9：平底の止まり穴と貫通穴（独立した断面模型）')
 for x,label,through in [(140,'A',False),(900,'B',True)]:
  g.t(x,175,label,45,True);g.box(x,300,470,350,'url(#hatch)',INK,4,0)
  depth=350 if through else 196.875;g.box(x+150,300,130,depth,PAPER,INK,4,0);g.line(x+150,300,x+280,300,PAPER,8)
  if through:g.line(x+150,650,x+280,650,PAPER,8)
  g.line(x+360,220,x+260,330,BLUE,3,True);g.t(x+50,240,'⌀6',31,True);
  if not through:g.line(x+335,300,x+335,496.875,INK,3,both=True);g.t(x+350,410,'9',30,True)
  g.line(x+520,300,x+520,650,INK,3,both=True);g.t(x+540,490,'16',30,True)
 g.t(100,790,'寸法はmm。図形と寸法線を対応させて読みます。',28)
 g.t(100,845,'加工方法・材質・公差を指定する操作図ではありません。',26)
 g.save('annotations-holes')
def weld():
 g=G('図10：基線・矢・開先部材（この資料の図示方式）')
 for x,label,above in [(100,'A',False),(620,'B',True)]:
  g.t(x,165,label,42,True);g.box(x+35,440,340,40,'#dae5df',INK,3,0);g.box(x+180,290,40,150,'#dae5df',INK,3,0)
  g.line(x+80,225,x+380,225,BLUE,4);g.line(x+80,225,x+160,430,BLUE,4,True)
  if above:g.path(f'M{x+250} 225L{x+250} 185L{x+290} 225Z','none',INK,4)
  else:g.path(f'M{x+250} 225L{x+250} 265L{x+290} 225Z','none',INK,4)
 g.t(1150,165,'C',42,True);g.box(1180,400,130,80,'#dae5df',INK,3,0);g.path('M1340 400L1490 400L1490 480L1310 480Z','#dae5df',INK,3)
 g.line(1190,230,1510,230,BLUE,4);g.path('M1190 230L1160 300L1260 330L1342 408','none',BLUE,4);g.line(1260,330,1342,408,BLUE,4,True)
 g.t(1150,565,'左部材／右部材',27,True)
 g.t(80,710,'A・B：基本記号が基線のどちら側か、矢がどこを指すかを読む。',26)
 g.t(80,770,'C：折れた矢で示された部材を確認する。',26)
 g.t(80,835,'図示方式・規格・注記を確認する。実溶接の指示や資格を与えない。',25)
 g.save('annotations-weld')
def intermittent():
 g=G('図11：断続する区間を読む独立した学習模型')
 g.t(80,145,'寸法はmm。赤い区間が対象。ピッチは同じ位置（始点）どうしの距離。',27)
 g.box(120,450,1330,130,'#e5ede5',BLUE,4,0);starts=[260,610,960]
 # 10px/mm;20mmsegment,35mmpitch =>15mmgap.
 for x in starts:g.line(x,515,x+200,515,RED,22)
 g.line(260,360,460,360,INK,3,both=True);g.line(260,370,260,490,INK,2);g.line(460,370,460,490,INK,2);g.t(335,330,'20',32,True)
 g.line(260,690,610,690,INK,3,both=True);g.line(260,540,260,705,INK,2);g.line(610,540,610,705,INK,2);g.t(400,745,'35',32,True)
 g.t(100,830,'3区間。実際の溶接記号・施工条件へそのまま流用しない。',27)
 g.save('annotations-intermittent')
if __name__=='__main__':
 OUT.mkdir(parents=True,exist_ok=True);signs();micrometer()
 dial('metrology-dial','図6：直動式ダイヤルの独立目盛模型',100,12,'0.01','20.00',['＋表示は、基準より大きい。','差を基準へ加える。'],'plunger')
 dial('metrology-lever','図7：てこ式比較測定の独立目盛模型',50,-5,'0.002','10.000',['＋表示は、基準より大きい。','差の符号を区別する。'],'lever')
 dial('metrology-bore','図8：内径比較の独立目盛模型',100,12,'0.001','25.000',['この図では＋表示＝','内径は基準より小さい。'],'bore')
 holes();weld();intermittent();print('11independentmechanicalrecognitionSVG/PNGcreated')
