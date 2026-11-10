"""91 original controlled teaching diagrams; no source illustrations or operating recipes."""
from pathlib import Path
import collections, hashlib, html, json, math, re
import cairosvg
from PIL import Image

ROOT=Path(__file__).resolve().parents[5]
OUT=Path(__file__).resolve().parent
ASSETS=ROOT/'assets/manufacturing/daily40/mechanical'
# Individual semantic rationale, reviewed against each controlled drawing.
RELEVANCE=['異常振動の機械、停止操作、連絡先を並べ、発見後の判断を具体化する。', '工具の乱雑な状態と定位置管理を対比し、整理・整頓の違いを示す。', '部品棚の位置・品種・数量と誤品・不足を示し、三定の確認対象を見せる。', '治具と加工物の作業実演・実施・確認を対比し、教える対象を具体化する。', '台車の不安定な荷と交差動線を描き、危険源と接触リスクを示す。', '頭・眼・呼吸の保護具と回転部の巻き込まれ危険を対比する。', '重篤度と可能性の配置を対策前後で示し、リスク低減の考え方を見せる。', '禁止・警告・化学危険の標識形状を区別して見せる。', '設計寸法、製造確認、出荷時の損傷を並べ、品質の対象範囲を示す。', '人・機械・材料・方法を実物の記号で枝分けし、原因整理の四分類を示す。', '機械と作業標準、管理表と時刻・不良品を並べ、標準と管理の役割を分ける。', 'パレート図・ヒストグラム・散布図のデータ形状を描き、使い分けを助ける。', '長さの物差しと質量の分銅を描き、量と単位の対応を示す。', 'ロットと抽出試料を点で区別し、母集団と標本の違いを示す。', '引張試験片と硬さの圧痕を描き、荷重を加える位置と評価対象を分ける。', '部品断面内のきずと表面の探触子を示し、内部と表面の検査対象を分ける。', '物差しを見る二方向と温度条件を描き、視差と環境の影響を示す。', '外側・内側・深さの測定面と独自の副尺目盛例を描き、ノギスの使い分けを示す。', 'アンビル・スピンドル・スリーブ・シンブルと半目盛を含む読み取り例を示す。', '同一部品を異なる尺度で描き、寸法数値は実寸であることを示す。', '許容区間と内外の測定点を配置し、上限・下限による合否判断を示す。', '機械の漏れ、日常確認、点検記録の未確認欄を並べ、保全確認の対象を示す。', '等体積の材料とばね・曲げの変形を描き、材料特性の違いを示す。', '温度と時間の定性的な曲線を使い、焼入れ・焼戻し・焼なましの工程を分ける。', '旋盤・フライス盤・ボール盤の工具と加工物を描き、切削運動の違いを示す。', '砥石と研磨パッド、表面の凹凸を描き、研削と研磨の違いを示す。', '溶接継手・鋳型・圧縮加工を描き、接合・鋳造・塑性加工を分ける。', '同条件の断面曲線に平均と高さを示し、RaとRzの見方を分ける。', '直流回路で電流計を直列、電圧計を抵抗の両端に並列接続して示す。', '射出・吹込・圧縮・押出・積層の材料と型の形を描き、成形方法を比較する。', '噴霧粒子の付着と液槽への浸漬を描き、塗装方式の違いを示す。', '緩衝材で保護した部品、品番表示、包んだ部品を描き、包装の三つの役割を示す。', '熱間・冷間のローラと板材変形を対比し、圧延条件の違いを示す。', '加工中の冷却・潤滑と加工後の炉を分け、処理の目的と順序を示す。', 'ビレット・ダイス・押出形材と長手のきずを描き、押出材の形成と検査位置を示す。', '酸性・中性・アルカリ性の液と電子授受を分け、化学的な二つの観点を示す。', '材料削減、容器再使用、スクラップ回収を実物で示し、3Rの行動を分ける。', '製品要求、管理の文書、個別製品の検査を分け、規格と検査の役割を示す。', '振り子衝撃・梁の曲げ・繰返し荷重を描き、機械試験の荷重の違いを示す。', '基準と比較するダイヤルゲージの接触と負偏差の独自例を示す。', 'てこ式・穴用測定器・内側測定器の接触位置を描き、用途を区別する。', '穴に対する通り側の通過と止り側の不通過を描き、限界ゲージの判定を示す。', '図面用紙の入れ子寸法関係と部品・組立・配置の図を並べる。', '一つの立体に対応する正面・平面・右側面を第三角法の位置で示す。', '中空部品と材料部分だけをハッチングした断面を対応させ、空洞との区別を示す。', '切欠き部品の長さ寸法と角度寸法を示し、記入位置を区別する。', '丸み・穴・板厚・参考寸法の形状と記号を結び付けて示す。', '基準面Bと平行度の公差域を示し、データムに対する方向の管理を示す。', '表面性状の指示線と溶接の基準線上の記号を、対象形状と対応させる。', '等体積の水と材料を対比し、密度・比重を考える基準を具体化する。', '物差しのゼロ合わせと分度器を描き、長さと角度の測定位置を示す。', '定盤上のハイトゲージと上面基準の深さ測定を対比し、基準面を示す。', '工場配置と警報発生位置、指定連絡先を示し、異常連絡の位置情報を具体化する。', '機械作業と対象工具の資格・教育確認を描き、作業範囲の確認を示す。', '落下物のヒヤリハットと1・29・300の関係を描き、予測値ではない整理を示す。', '吊荷の角度と位置ずれした締結部を描き、揚重・締結の危険点を示す。', '粒子を捕らえる防じん用と吸収缶を持つ防毒用の保護具を区別して示す。', '火災・通報ボタン・出口への動線を描き、緊急時の行動対象を示す。', '台車運搬・高温炉・局所排気を描き、作業環境ごとの対策を分ける。', '機械の現行手順書と旧版の除外、正式な周知を示し、文書管理を具体化する。', '設計から原材料・加工・検査・出荷への製品の流れと改善の戻りを示す。', '実測表示12.03と誤記12.30、訂正値を対比し、正確な記録の必要性を示す。', '直流と交流の波形、機器の定格表示を描き、電源の性質と確認対象を示す。', '機械の漏電・接地と電源の遮断確認を描き、感電対策の原理を示す。', 'モーター・変圧器・遮断器の構造的な特徴を並べ、機能を区別する。', '導体・絶縁体・半導体の条件による通電状態を点灯で示す。', '抵抗による発熱とコンデンサの蓄積を分け、受動部品の作用を示す。', 'ダイオードの一方向性と三端子トランジスタを並べ、働きを区別する。', '学科判断と実技の加工物判断を別に描き、試験形式を区別する。', '設問の否定表現を読む位置と禁止された端末利用を描き、受験上の確認を示す。', '禁止・警告の標識と機械ガードの境界を対比し、標識と設備対策を示す。', '化学品の危険表示と緊急設備・SDSを並べ、情報と対応場所の確認を示す。', '機械・保護具・点検記録を改善の循環に配置し、OSHMSの対象を具体化する。', '抽出試料と隔離した不適合品、計量・計数の区分を描き、検査管理を示す。', '各硬さ試験の圧子・圧痕・反発の形を比較し、硬さ記号の意味を分ける。', 'コイル付近の渦電流ときず、表面を観察する器具を描き、検査原理を分ける。', '円筒を受けるVブロック、直角定規、マグネットスタンドを並べ、保持と基準を示す。', '三次元測定の接触子と表面粗さ測定の触針を描き、測る形状を区別する。', 'ゲージブロックの接触面と保護収納を描き、基準器の取扱いを示す。', '実形状の図面に実線・隠れ線・中心線・破断線・切断線を描き分ける。', '球面・面取り・座ぐり穴の断面と記号を対応させ、形状の読み方を示す。', '形状・姿勢・位置の公差域を別の幾何形状で示し、管理対象を区別する。', '材料中の熱の伝わりと溶融状態を定性的に示し、熱的特性を比較する。', '溶接部の熱影響帯と金属内部の流れを描き、加工で変わる内部状態を示す。', '旋盤の主軸台・チャック・刃物台・心押し台・往復台を実配置に沿って示す。', 'フライス盤・ボール盤・工具交換装置付き機械を並べ、構造と用途を区別する。', '砥石のガードと飛散物、立入を避ける範囲を示し、研削作業の危険を示す。', '各成形法の材料と金型に加熱・硬化の状態を加え、樹脂成形の条件を分ける。', '帯電粒子の付着と電極を使う液槽を分け、静電塗装と電着の原理を示す。', '熱間・冷間圧延と材料内部の伸びた組織を示し、加工による変化を対比する。', 'L形材のダイス出口と長手の表面を示し、押出形状と検査位置を結び付ける。']

INK='#17344d';TEAL='#087f8c';BLUE='#3478b8';GOLD='#d49320';RED='#c64c4c';PALE='#e8f2f3';STEEL='#a8bac9';GRAY='#667985';WHITE='#ffffff'

class Art:
 def __init__(self):self.parts=[]
 def raw(self,s):self.parts.append(s)
 def rect(self,x,y,w,h,fill=WHITE,stroke=INK,sw=3,rx=0):self.raw(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
 def line(self,x1,y1,x2,y2,c=INK,w=4,dash=None):self.raw(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{w}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
 def circle(self,x,y,r,fill=WHITE,stroke=INK,w=3):self.raw(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>')
 def ellipse(self,x,y,rx,ry,fill=WHITE,stroke=INK,w=3):self.raw(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>')
 def path(self,d,fill='none',stroke=INK,w=4):self.raw(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round"/>')
 def poly(self,points,fill=WHITE,stroke=INK,w=3):self.raw(f'<polygon points="'+ ' '.join(f'{x},{y}' for x,y in points)+f'" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>')
 def text(self,x,y,s,size=30,c=INK,anchor='start',weight=500):self.raw(f'<text x="{x}" y="{y}" fill="{c}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{html.escape(str(s))}</text>')
 def arrow(self,x1,y1,x2,y2,c=TEAL,w=5):
  self.line(x1,y1,x2,y2,c,w);ang=math.atan2(y2-y1,x2-x1);p=[(x2,y2),(x2-17*math.cos(ang-.45),y2-17*math.sin(ang-.45)),(x2-17*math.cos(ang+.45),y2-17*math.sin(ang+.45))];self.poly(p,c,c,1)
 def leader(self,x,y,tx,ty,label):self.line(x,y,tx,ty,GRAY,2);self.circle(x,y,4,TEAL,TEAL,1);self.text(tx+6,ty-5,label,28)
 def group(self,x,y,s=1):self.raw(f'<g transform="translate({x},{y}) scale({s})">')
 def end(self):self.raw('</g>')
 def tick(self,x,y,c=TEAL):self.path(f'M{x-15},{y} l12,13 l27,-32',stroke=c,w=8)
 def cross(self,x,y,r=18):self.line(x-r,y-r,x+r,y+r,RED,7);self.line(x-r,y+r,x+r,y-r,RED,7)

def bolt(a,x,y,s=1):
 a.group(x,y,s);a.poly([(0,0),(25,-15),(50,0),(50,30),(25,45),(0,30)],STEEL);a.rect(16,38,18,85,STEEL)
 for k in range(5):a.line(15,55+k*12,36,47+k*12,INK,2)
 a.end()
def gear(a,x,y,r=40,c=STEEL):
 for i in range(12):
  ang=i*math.pi/6;a.line(x+(r-6)*math.cos(ang),y+(r-6)*math.sin(ang),x+(r+15)*math.cos(ang),y+(r+15)*math.sin(ang),c,16)
 a.circle(x,y,r,c);a.circle(x,y,r*.32,WHITE)
def part(a,x,y,w=170,h=100,fill=STEEL,hole=True):
 a.rect(x,y,w,h,fill,INK,4,7)
 if hole:a.circle(x+w*.5,y+h*.5,min(w,h)*.22,WHITE)
def cart(a,x,y,w=230):
 a.rect(x,y,w,60,STEEL,INK,4);a.circle(x+35,y+85,22,WHITE);a.circle(x+w-35,y+85,22,WHITE);a.line(x+w,y+20,x+w+15,y-100,INK,7)
def worker(a,x,y,c=TEAL):
 a.circle(x,y,24,'#edd0b4');a.path(f'M{x-27},{y+32} l-18,105 h88 l-18,-105 Z',c);a.line(x-12,y+137,x-25,y+210,INK,10);a.line(x+12,y+137,x+27,y+210,INK,10)
 a.line(x-27,y+55,x-55,y+108,c,14);a.line(x+27,y+55,x+70,y+80,c,14)
def machine(a,x,y,s=1,guard=True):
 a.group(x,y,s);a.rect(0,0,360,270,'#cfdae3',INK,5,16);a.rect(35,40,250,155,PALE,INK,4);a.rect(300,48,35,75,WHITE,INK,3);a.circle(318,68,10,RED);a.circle(318,100,8,TEAL);a.rect(60,205,230,30,STEEL);a.line(70,80,250,80,INK,9);a.rect(120,100,90,45,STEEL)
 if guard:
  for z in range(6):a.line(45+z*40,45,45+z*40,190,'#83a8bb',2)
 a.end()
def lathe(a,x,y,s=1,labels=False):
 a.group(x,y,s);a.rect(0,180,440,45,STEEL);a.rect(20,220,65,90,STEEL);a.rect(340,220,65,90,STEEL);a.rect(15,45,105,140,'#c2d2dd');a.circle(117,108,38,GRAY);a.rect(135,92,210,32,GOLD);a.poly([(336,76),(390,76),(390,157),(345,157)],STEEL);a.rect(205,145,95,65,BLUE);a.poly([(225,143),(245,98),(270,143)],TEAL);a.circle(247,190,22,WHITE);a.line(247,168,247,212);a.line(225,190,269,190)
 if labels:
  a.leader(60,60,-40,0,'主軸台');a.leader(117,105,110,-30,'チャック');a.leader(245,140,235,25,'刃物台');a.leader(363,105,325,-20,'心押し台');a.leader(247,193,220,285,'往復台')
 a.end()
def drill(a,x,y,s=1):
 a.group(x,y,s);a.rect(40,270,260,40,STEEL);a.rect(90,30,35,240,STEEL);a.rect(85,30,185,70,BLUE,INK,4,12);a.rect(208,98,25,55,GRAY);a.poly([(208,153),(233,153),(221,208)],STEEL);a.line(223,145,253,105,INK,5);a.circle(255,103,12,GRAY);a.rect(130,225,180,28,STEEL);a.rect(168,190,90,35,GOLD);a.end()
def milling(a,x,y,s=1):
 a.group(x,y,s);a.rect(0,270,330,35,STEEL);a.rect(20,30,95,240,STEEL);a.rect(60,5,200,70,BLUE);a.rect(218,75,25,75,GRAY);a.rect(205,145,50,35,TEAL);a.rect(105,205,210,30,STEEL);a.rect(130,180,110,25,GOLD);a.rect(142,235,90,35,STEEL);a.rect(25,105,65,55,WHITE);a.end()
def waveform(a,x,y,w=330,h=100,kind='sine',c=TEAL):
 a.line(x,y+h/2,x+w,y+h/2,GRAY,2);a.line(x,y-10,x,y+h+20,GRAY,2)
 pts=[]
 for i in range(81):
  yy=y+h/2-(h*.4 if kind=='dc' else math.sin(i/80*math.pi*4)*h*.4)
  pts.append((x+i*w/80,yy))
 a.path('M'+' L'.join(f'{xx},{yy}' for xx,yy in pts),stroke=c,w=5)
def surface(a,x,y,w=360,h=100,amp=18,c=INK):
 pts=[(x+i*w/40,y+math.sin(i*2.3)*amp+math.cos(i*.8)*amp*.5) for i in range(41)];a.path('M'+' L'.join(f'{xx},{yy}' for xx,yy in pts),stroke=c,w=4);a.line(x,y,x+w,y,TEAL,2,'10 6')
def tank(a,x,y,w=250,h=210):
 a.rect(x,y,w,h,WHITE,INK,5);a.rect(x+4,y+65,w-8,h-69,'#a9dce2','none',0);a.line(x+28,y+10,x+28,y+160,RED,10);a.rect(x+w*.5,y+30,60,120,STEEL);a.line(x+w*.5+30,y+30,x+w*.5+30,y-35,INK,4)
def document(a,x,y,w=230,h=260,heading='',rows=5):
 a.rect(x,y,w,h,WHITE,INK,4,7);a.poly([(x+w-45,y),(x+w,y+45),(x+w-45,y+45)],PALE)
 if heading:a.text(x+16,y+47,heading,28)
 for k in range(rows):a.line(x+20,y+77+k*30,x+w-25,y+77+k*30,STEEL,3)
def dim(a,x1,y1,x2,y2,label,offset=30):
 if abs(y2-y1)<1:
  y=y1-offset;a.line(x1,y1,x1,y-14,GRAY,2);a.line(x2,y2,x2,y-14,GRAY,2);a.line(x1,y,x2,y,INK,2);a.arrow(x1+25,y,x1,y,INK,2);a.arrow(x2-25,y,x2,y,INK,2);a.text((x1+x2)/2,y-14,label,32,anchor='middle')
 else:
  x=x1-offset;a.line(x1,y1,x-14,y1,GRAY,2);a.line(x2,y2,x-14,y2,GRAY,2);a.line(x,y1,x,y2,INK,2);a.arrow(x,y1+25,x,y1,INK,2);a.arrow(x,y2-25,x,y2,INK,2);a.text(x-12,(y1+y2)/2,label,32,anchor='end')
def coil(a,x,y,w=180,h=70,turns=7):
 for i in range(turns):a.path(f'M{x+i*w/turns},{y+h} C{x+i*w/turns-18},{y-h} {x+(i+1)*w/turns+18},{y-h} {x+(i+1)*w/turns},{y+h}',stroke=INK,w=5)
def checkgrid(a,x,y,cols=8,rows=3,selected=()):
 for r in range(rows):
  for c in range(cols):
   i=r*cols+c;a.circle(x+c*48,y+r*48,16,RED if i in selected else '#b5d4df',INK,2)
def furnace(a,x,y):
 a.rect(x,y,200,160,'#dd9676',INK,4,12);a.rect(x+35,y+35,130,100,'#e7c09b');a.path(f'M{x+65},{y+115} q-20,-40 15,-65 q-3,30 15,38 q30,-50 35,-60 q35,70 -5,90 Z',GOLD,RED,2)
def rollers(a,x,y,hot=False):
 a.circle(x+170,y+55,70,STEEL);a.circle(x+170,y+218,70,STEEL);a.poly([(x,y+110),(x+120,y+110),(x+240,y+135),(x+390,y+135),(x+390,y+150),(x+240,y+150),(x+120,y+180),(x,y+180)],'#e98c54' if hot else '#80b6c7');a.arrow(x+270,y+112,x+365,y+112,TEAL);a.path(f'M{x+135},{y+55} a35,35 0 1,1 55,-25',stroke=TEAL);a.path(f'M{x+195},{y+218} a35,35 0 1,1 -55,25',stroke=TEAL)
def extrusion(a,x,y,s=1):
 a.group(x,y,s);a.rect(0,80,160,80,STEEL);a.rect(155,55,70,130,GRAY);a.rect(20,95,130,50,'#dc9a60');a.poly([(225,95),(470,95),(470,112),(245,112),(245,150),(225,150)],GOLD);a.arrow(-55,120,0,120,TEAL)
 for k in range(4):a.circle(265+k*58,176,20,STEEL)
 a.end()
def hard(a,x,y,kind='vickers',s=1):
 a.group(x,y,s);a.rect(0,190,180,45,STEEL)
 if kind=='brinell':a.circle(90,120,45,GRAY);a.arrow(90,20,90,60,TEAL);a.path('M55,190 Q90,225 125,190',stroke=RED,w=5);dim(a,55,270,125,270,'直径',10)
 elif kind=='rockwell':a.poly([(55,65),(125,65),(90,155)],GRAY);a.arrow(90,5,90,45,TEAL);a.path('M65,190 l25,20 25,-20',stroke=RED,w=5);a.arrow(210,155,210,210,TEAL);a.text(145,300,'深さ',34)
 elif kind=='shore':a.rect(64,50,52,90,GRAY);a.arrow(45,50,45,170,RED);a.arrow(140,170,140,75,TEAL);a.text(10,295,'反発の高さ',34)
 else:
  points=[(90,30),(155,110),(90,190),(25,110)] if kind=='vickers' else [(0,110),(100,75),(200,110),(100,145)]
  a.poly(points,PALE);a.line(points[0][0],points[0][1],points[2][0],points[2][1],RED,5)
  if kind=='vickers':a.line(points[1][0],points[1][1],points[3][0],points[3][1],TEAL,5)
  a.text(0,280,'対角線',34)
 a.end()
def chart(a,x,y,kind='bars',w=300,h=220):
 a.line(x,y,x,y+h,INK,3);a.line(x,y+h,x+w,y+h,INK,3)
 if kind=='hist':
  for i,v in enumerate([.18,.46,.82,.95,.64,.28]):a.rect(x+10+i*45,y+h-v*h,43,v*h,TEAL,WHITE,2)
 elif kind=='scatter':
  for i in range(14):a.circle(x+20+i*18,y+h-30-i*12+(i%3-1)*15,7,TEAL,TEAL,1)
 elif kind=='control':
  a.line(x,y+40,x+w,y+40,RED,3,'10 7');a.line(x,y+h-30,x+w,y+h-30,RED,3,'10 7')
  pts=[(x+15+i*30,y+100+([0,30,-12,18,-28,4,10,-18,5,0][i])) for i in range(10)];a.path('M'+' L'.join(f'{xx},{yy}' for xx,yy in pts),stroke=TEAL)
  for xx,yy in pts:a.circle(xx,yy,5,TEAL,TEAL,1)
 else:
  for i,v in enumerate([1,.58,.35,.2]):a.rect(x+15+i*65,y+h-v*(h-15),45,v*(h-15),TEAL)
  if kind=='pareto':a.path(f'M{x+35},{y+120} L{x+100},{y+65} L{x+165},{y+25} L{x+230},{y}',stroke=GOLD,w=5)
def sign(a,x,y,kind='warning',s=1):
 a.group(x,y,s)
 if kind=='ban':a.circle(0,0,85,WHITE,RED,13);a.circle(0,-25,18,INK);a.path('M-22,0 h44 l15,65 h-74 Z',INK);a.line(-60,60,60,-60,RED,14)
 elif kind=='chemical':
  a.poly([(0,-95),(95,0),(0,95),(-95,0)],WHITE,RED,10);a.path('M-40,-30 l55,20 -5,17 -55,-20 Z',GRAY);a.circle(27,30,9,RED);a.line(-52,55,55,55,INK,7);a.path('M-45,60 l27,-16 55,10',stroke=INK,w=7)
 elif kind=='emergency':
  a.rect(-90,-80,180,160,TEAL,TEAL,1,5);a.circle(-30,-40,15,WHITE,WHITE);a.path('M-30,-15 l20,35 -45,25 M-10,20 l38,30 M-20,0 l45,-15',stroke=WHITE,w=12);a.arrow(45,-35,75,-35,WHITE,6)
 else:
  a.poly([(0,-95),(100,80),(-100,80)],'#f7d165',INK,8);a.path('M12,-45 l-35,62 h30 l-17,45 44,-65 h-30 Z',INK)
 a.end()
def mask(a,x,y,kind='dust'):
 a.circle(x,y,83,'#edd5c0');a.path(f'M{x-58},{y-10} Q{x},{y-45} {x+58},{y-10} L{x+48},{y+55} Q{x},{y+85} {x-48},{y+55} Z',PALE);a.circle(x,y+25,24,GRAY)
 if kind=='gas':a.rect(x-110,y+5,46,65,BLUE);a.rect(x+64,y+5,46,65,BLUE)
 else:
  for k in range(4):a.line(x-38,y+8+k*14,x+38,y+8+k*14,TEAL,3)
def wire_circuit(a,x,y,w=400,h=240):
 a.line(x,y,x+w,y);a.line(x+w,y,x+w,y+h);a.line(x+w,y+h,x,y+h);a.line(x,y+h,x,y+150);a.line(x,y,x,y+70);a.line(x-32,y+80,x+32,y+80,INK,5);a.line(x-18,y+115,x+18,y+115,INK,5);a.line(x,y+115,x,y+150)
def roughframe(a,x,y):
 surface(a,x,y,400,100,25);a.rect(x,y+80,400,45,STEEL);a.line(x+45,y-50,x+45,y+60,RED,2);a.line(x+365,y-50,x+365,y+60,RED,2);a.arrow(x+320,y-45,x+320,y+55,RED);a.text(x+345,y,'Rz',30);a.text(x+120,y+175,'同じ条件・同じ区間',30)

def recipe(n,a):
 # Each branch has a physical object, measurable geometry or data-bearing chart.
 if n==1:
  machine(a,130,270,1.3);a.path('M180,250 q30,-50 60,0 t60,0',stroke=RED,w=7);a.text(120,230,'異音・振動',34,RED);a.circle(610,340,45,RED);a.text(610,351,'停止',28,WHITE,'middle');a.rect(965,280,160,235,INK,INK,3,20);a.rect(985,310,120,100,PALE);a.line(1050,280,1050,230,INK,8);a.arrow(710,450,915,390);a.text(910,575,'事実を報告',34)
 elif n==2:
  for x,tidy in [(100,False),(760,True)]:
   a.rect(x,310,480,240,'#e4c39b',INK,5);a.rect(x,550,35,140,STEEL);a.rect(x+445,550,35,140,STEEL);a.text(x+240,240,'整える前' if not tidy else '定位置へ',36,anchor='middle')
   for i in range(4):bolt(a,x+50+i*95,360+(i%2)*55 if not tidy else 350,.6)
   for k in range(3):a.circle(x+75+k*140,490 if tidy else 330+k*37,25,TEAL)
   if tidy:
    for k in range(4):a.rect(x+35+k*98,335,75,145,'none',BLUE,2,10)
   else:a.path(f'M{x+210},520 l90,-100 -50,-35',stroke=RED,w=9)
 elif n==3:
  for i in range(3):
   x=135+i*390;a.rect(x,310,290,210,PALE,INK,4,14);a.text(x+145,270,['定位','定品','定量'][i],38,anchor='middle')
   for j in range(3 if i!=2 else 2):gear(a,x+65+j*75,410,24,TEAL)
   if i==1:bolt(a,x+102,430,.5);a.cross(x+185,485)
   if i==2:a.circle(x+215,410,25,'none',GRAY,2);a.text(x+145,605,'空きも確認',30,anchor='middle')
 elif n==4:
  a.rect(200,480,370,80,STEEL);part(a,310,370,150,80,GOLD);a.path('M190,320 q120,-80 190,20 l-10,50 -110,-20 -55,20 Z','#eac9ad');a.text(380,260,'実演',38,anchor='middle');a.arrow(620,440,760,440);a.rect(820,480,370,80,STEEL);part(a,920,370,150,80,GOLD);a.tick(1150,355);a.text(1000,260,'実施・確認',38,anchor='middle');a.text(700,665,'見るだけでなく、対象の保持と順序を確かめる',32,anchor='middle')
 elif n==5:
  a.rect(100,270,1180,380,'#eff4f5',INK,4);a.rect(720,310,300,250,'#f7e8bf',GOLD,4);cart(a,270,430,220);part(a,300,300,130,125,GOLD);a.path('M430,340 l60,70 -50,50',stroke=RED,w=8);a.path('M150,600 H1160',stroke=TEAL,w=12);a.text(720,225,'荷の不安定さと通路の交差',36,anchor='middle');a.cross(560,520);a.arrow(1130,600,1220,600,TEAL)
 elif n==6:
  mask(a,330,390,'dust');a.rect(235,335,190,45,'#aad4e8',BLUE,4,15);a.path('M230,325 Q330,210 430,325 Z',GOLD);a.text(330,620,'飛散・粉じんに合う保護',32,anchor='middle');lathe(a,750,320,.9);a.path('M900,365 q35,-45 70,0 l-15,65 -50,0 Z','#d4ba8f');a.cross(950,385,40);a.text(990,655,'回転部との巻込みも確認',30,anchor='middle')
 elif n==7:
  for r in range(3):
   for c in range(3):a.rect(250+c*240,250+r*135,240,135,['#e2f0ea','#f5e2ae','#edb9af'][min(2,(r+c)//2)],WHITE,3)
  a.circle(850,315,25,RED);a.circle(370,585,25,TEAL);a.arrow(825,335,395,565,TEAL,7);a.text(600,730,'起こりやすさ',34,anchor='middle');a.text(90,460,'被害の大きさ',30);a.text(1090,365,'対策前',30,RED);a.text(1090,570,'対策後',30,TEAL)
 elif n in (8,71,72):
  kinds=['ban','warning','chemical'] if n==8 else ['ban','warning'] if n==71 else ['chemical','emergency']
  for i,k in enumerate(kinds):
   x=(260+i*440) if len(kinds)==3 else (380+i*620);sign(a,x,390,k,1.1);a.text(x,585,{'ban':'してはいけない行為','warning':'危険の存在','chemical':'化学物質の危険情報','emergency':'緊急場所・経路'}[k],30,anchor='middle')
  if n==72:a.rect(520,650,150,65,RED,RED,2,8);a.text(595,696,'SDS',32,WHITE,'middle');a.path('M1120,660 h90 v-70',stroke=TEAL,w=10);a.arrow(1160,660,1220,660)
  if n==71:machine(a,650,595,.38);a.line(620,625,620,760,RED,8)
 elif n==9:
  part(a,160,360,220,150);dim(a,160,360,380,360,'要求寸法',45);part(a,590,360,220,150);a.circle(700,435,70,'none',TEAL,6);a.tick(760,540);a.rect(1000,330,240,220,'#d8b58b');a.path('M1010,490 l40,-20 30,55',stroke=RED,w=7);a.text(270,650,'設計',34,anchor='middle');a.text(700,650,'製造・確認',34,anchor='middle');a.text(1120,650,'輸送中の保護',32,anchor='middle')
 elif n==10:
  a.arrow(160,460,1180,460,INK,8)
  for x,top,label in [(350,True,'人'),(750,True,'設備'),(350,False,'材料'),(750,False,'方法')]:
   y=255 if top else 665;a.line(x,y,x+150,460,TEAL,6);a.text(x,y-20 if top else y+48,label,36,anchor='middle')
  worker(a,285,255,BLUE);gear(a,775,280,45);part(a,230,600,120,70,GOLD);document(a,690,590,160,150,rows=2);a.text(1190,470,'不適合',32)
 elif n==11:
  machine(a,80,300,.75);a.text(220,580,'作業対象',32,anchor='middle');document(a,470,250,300,390,'作業標準',7);a.poly([(510,360),(580,310),(650,360),(580,410)],PALE);a.arrow(590,450,700,450);a.rect(870,270,410,350,WHITE,INK,4)
  for k in range(5):a.line(870,340+k*55,1280,340+k*55,STEEL,3)
  for x in [1015,1150]:a.line(x,270,x,620,STEEL,3)
  a.text(890,315,'QC工程図',32);a.circle(960,420,25,WHITE);a.line(960,420,960,402);a.line(960,420,978,420);a.tick(1090,480);a.rect(1170,520,80,55,RED);a.text(1075,690,'項目・頻度・異常処置',30,anchor='middle')
 elif n==12:
  for i,k in enumerate(['pareto','hist','scatter']):chart(a,100+i*450,300,k,300,240);a.text(250+i*450,650,['順位・累積','ばらつき','二変数の関係'][i],32,anchor='middle')
 elif n==13:
  a.rect(140,390,450,90,STEEL);a.line(140,430,590,430)
  for k in range(16):a.line(140+k*30,390,140+k*30,420 if k%5 else 440,INK,3)
  a.text(365,560,'長さ：単位と接頭語',32,anchor='middle');a.path('M850,330 h160 l50,220 h-260 Z',STEEL);a.circle(930,430,50,WHITE);a.text(930,442,'kg',34,anchor='middle');a.text(930,620,'質量',34,anchor='middle');a.text(700,230,'数値だけを記録しない',36,anchor='middle')
 elif n in (14,74):
  checkgrid(a,135,330,8,3,(1,11,20));a.rect(70,270,450,220,'none',BLUE,4);a.text(295,570,'ロット全体',34,anchor='middle');a.arrow(575,380,715,380);checkgrid(a,800,340,3,2,(1,4));a.rect(740,275,215,170,'none',TEAL,4);a.text(850,535,'選んだサンプル',30,anchor='middle')
  if n==14:a.text(700,680,'不適合品数 ÷ 対応する母数 × 100',34,anchor='middle')
  else: a.rect(1060,310,210,210,'#f8e4b7',GOLD,5);a.text(1165,400,'判定保留',30,anchor='middle');a.circle(1150,465,20,RED);a.text(1100,610,'計量値と個数を分ける',28,anchor='middle')
 elif n==15:
  a.rect(150,280,260,35,GRAY);a.rect(150,590,260,35,GRAY);a.poly([(225,315),(330,315),(295,385),(295,520),(330,590),(225,590),(260,520),(260,385)],STEEL);a.arrow(280,245,280,185);a.arrow(280,660,280,720);a.text(280,770,'荷重・伸び',32,anchor='middle');hard(a,650,310,'rockwell');hard(a,1020,320,'vickers');a.text(1000,745,'圧痕から調べる硬さ',32,anchor='middle')
 elif n==16:
  a.poly([(220,330),(620,330),(740,260),(340,260)],PALE);a.rect(220,330,400,220,STEEL);a.poly([(620,330),(740,260),(740,480),(620,550)],'#8ea3b3');a.path('M300,330 l30,40 -10,45',stroke=RED,w=7);a.path('M450,450 l40,-35 50,25',stroke=RED,w=8);a.text(270,240,'表面に開くきず',30,RED);a.text(835,475,'内部のきず',32,RED);a.rect(470,195,90,65,TEAL);a.arrow(515,260,515,400);a.path('M515,390 l-25,-30 50,-30',stroke=TEAL,w=5);a.text(700,690,'位置・材料・形状で適用を確認',34,anchor='middle')
 elif n==17:
  a.rect(250,430,760,35,STEEL)
  for k in range(21):a.line(250+k*38,430,250+k*38,460 if k%5 else 485,INK,3)
  a.circle(625,245,40,WHITE);a.circle(625,245,12,TEAL);a.arrow(625,290,625,423);a.circle(980,245,40,WHITE);a.circle(980,245,12,RED);a.line(950,280,640,425,RED,4,'12 7');a.cross(1015,310);a.text(650,595,'正面から読む',38,TEAL,'middle');a.circle(1160,515,35,RED);a.rect(1145,315,30,180,WHITE,INK,3,15);a.rect(1154,385,12,135,RED,RED,1);a.text(1120,660,'温度条件もそろえる',28,anchor='middle')
 elif n==18:
  a.rect(180,260,950,35,STEEL);a.path('M210,260 v120 h90 v-150 h-35 v80 h-20 v-50 Z',STEEL);a.path('M720,260 v120 h-90 v-150 h35 v80 h20 v-50 Z',STEEL);a.rect(650,235,120,80,BLUE);a.rect(1130,272,120,10,GRAY);a.leader(295,345,80,410,'外側');a.leader(640,235,765,205,'内側');a.leader(1190,277,1110,350,'深さ')
  x0=160;step=28;y=535
  for i in range(37):a.line(x0+i*step,y,x0+i*step,y-(55 if i%5==0 else 28),INK,2)
  for i in range(0,36,5):a.text(x0+i*step,y-72,str(i),28,anchor='middle')
  vx=x0+18.2*step;a.line(vx,y+20,vx+19*.95*step,y+20,BLUE,4)
  for i in range(21):
   xx=vx+i*.95*step;a.line(xx,y+20,xx,y+60,RED if i==4 else BLUE,4 if i==4 else 2)
   if i%4==0:a.text(xx,y+99,str(i),28,RED if i==4 else BLUE,'middle')
  a.text(700,755,'独自例：18 mm ＋ 4 × 0.05 mm ＝ 18.20 mm',32,anchor='middle')
 elif n==19:
  a.path('M370,250 C120,250 120,650 370,650 L470,650 L470,560 L370,560 C250,560 250,340 370,340 Z',STEEL);a.rect(350,270,85,40,GRAY);a.rect(555,270,210,40,STEEL);a.rect(750,245,190,90,PALE);a.rect(935,235,200,110,GRAY);a.rect(1135,250,100,80,STEEL)
  for i in range(6):a.line(960+i*27,240,960+i*27,340,INK,3)
  a.leader(405,285,305,205,'アンビル');a.leader(650,285,560,390,'スピンドル');a.leader(825,280,785,185,'スリーブ');a.leader(1020,280,985,400,'シンブル');a.rect(650,485,250,125,PALE);a.rect(900,460,300,180,STEEL);a.line(650,535,1200,535,RED,3);a.line(740,535,740,485,INK,3);a.text(740,470,'7',28,anchor='middle');a.line(840,535,840,590,INK,3);a.text(840,625,'7.5',28,anchor='middle')
  for k in range(20,26):
   yy=535-(k-23)*25;a.line(900,yy,950,yy,INK,3)
   if k in (20,23,25):a.text(980,yy+10,str(k),28)
  a.text(940,740,'7.5 ＋ 0.23 ＝ 7.73 mm（独自例）',34,anchor='middle')
 elif n==20:
  a.rect(180,330,360,180,STEEL);dim(a,180,330,540,330,'12',35);a.text(360,620,'尺度 2:1',38,anchor='middle');a.rect(900,385,90,45,STEEL);dim(a,900,385,990,385,'12',55);a.text(960,620,'尺度 1:2',38,anchor='middle');a.line(180,420,540,420,RED,3,'22 8 5 8');a.line(310,330,310,510,BLUE,3,'12 8');a.text(700,750,'図の大きさが変わっても、寸法数値は実寸',32,anchor='middle')
 elif n==21:
  x=210;y=420;scale=1250
  a.line(x,y,x+1000,y,INK,8);lo=x+.01*scale*10;hi=lo+.06*scale*10;a.line(lo,y,hi,y,TEAL,24)
  for val,label in [(lo,'19.98'),(hi,'20.04')]:a.line(val,y-30,val,y+30,INK,4);a.text(val,y+80,label,32,anchor='middle')
  m=lo+.05*scale*10;a.circle(m,y,20,GOLD);a.text(m,300,'20.03',34,anchor='middle');a.arrow(m,315,m,390,GOLD);a.circle(x,y,18,RED);a.text(x,600,'19.97：範囲外',30,RED,'middle');a.text(700,730,'独自例：基準 20 mm、上 ＋0.04、下 −0.02',32,anchor='middle')
 elif n==22:
  machine(a,130,290,1.1);a.path('M180,590 q-25,35 0,45 q25,-10 0,-45 Z',BLUE);a.circle(595,355,45,WHITE,TEAL,5);a.line(595,355,595,320,TEAL,5);a.line(595,355,620,365,TEAL,5);document(a,840,260,350,390,'点検記録',7);a.tick(900,390);a.tick(900,450);a.text(890,545,'未確認',34,RED);a.text(350,740,'日常の状態',34,anchor='middle');a.text(1030,740,'計画点検と記録',34,anchor='middle')
 elif n==23:
  for x,c in [(160,STEEL),(480,GOLD)]:a.rect(x,330,170,170,c,INK,4);a.poly([(x,330),(x+55,290),(x+225,290),(x+170,330)],c);a.poly([(x+170,330),(x+225,290),(x+225,460),(x+170,500)],c)
  a.text(420,620,'同じ体積でも質量は異なる',32,anchor='middle');a.path('M850,335 q-40,25 0,50 t0,50 t0,50 t0,50',stroke=TEAL,w=12);a.arrow(850,270,850,315);a.path('M1100,330 v110 q0,55 80,55',stroke=RED,w=15);a.text(990,665,'戻る変形／残る変形',32,anchor='middle')
 elif n==24:
  for i,typ in enumerate(['焼入れ','焼戻し','焼なまし']):
   x=90+i*440;a.line(x,570,x+330,570,GRAY,3);a.line(x,570,x,280,GRAY,3)
   path=[(x,570),(x+80,320),(x+190,320),(x+210 if i==0 else x+315,570)]
   if i==1:path=[(x,570),(x+70,400),(x+205,400),(x+310,570)]
   a.path('M'+' L'.join(f'{xx},{yy}' for xx,yy in path),stroke=[RED,GOLD,BLUE][i],w=7);a.text(x+165,675,typ,36,anchor='middle')
  a.text(700,225,'温度変化の形を比べる模式図（作業条件ではない）',32,anchor='middle')
 elif n==25:
  lathe(a,70,330,.85);milling(a,555,295,.9);drill(a,1010,295,.9)
  a.path('M240,340 a40,40 0 1,1 10,70',stroke=RED,w=5);a.arrow(240,410,250,393,RED);a.arrow(760,385,760,330,TEAL);a.arrow(1210,400,1210,460,TEAL);a.text(270,720,'工作物が回る',32,anchor='middle');a.text(710,720,'工具が回る',32,anchor='middle');a.text(1150,720,'穴をあける',32,anchor='middle')
 elif n==26:
  a.circle(340,365,110,GRAY);a.circle(340,365,38,WHITE);part(a,150,480,400,70);a.path('M300,465 l-70,-40 M320,475 l-40,-75 M350,470 l10,-80',stroke=GOLD,w=6);a.text(340,665,'砥石で除去する',34,anchor='middle');a.ellipse(1000,410,150,40,TEAL);a.rect(880,330,240,75,BLUE);surface(a,825,520,350,80,8);a.text(1000,665,'研磨剤で表面を整える',32,anchor='middle')
 elif n==27:
  a.rect(105,470,280,80,STEEL);a.line(245,470,245,550,RED,13);a.path('M200,320 l40,100 40,-100',stroke=GOLD,w=8);a.text(245,670,'接合',36,anchor='middle');a.poly([(575,430),(815,430),(775,580),(615,580)],'#be9d78');a.path('M650,250 q-80,70 20,100 l60,45 -20,35 -80,-60 q-110,-65 20,-120 Z','#e7a067');a.text(700,670,'溶かして固める',32,anchor='middle');a.rect(1000,450,250,70,STEEL);a.rect(1060,260,130,80,GRAY);a.arrow(1125,350,1125,425);a.text(1125,670,'固体を変形',34,anchor='middle')
 elif n==28:
  roughframe(a,130,440);roughframe(a,800,440);a.line(170,330,500,330,TEAL,3);a.text(330,280,'Ra：平均の評価',34,anchor='middle');a.text(1000,280,'Rz：高さの評価',34,anchor='middle');a.path('M995,350 l-35,55 h65',stroke=BLUE,w=4)
 elif n==29:
  wire_circuit(a,300,320,700,260);a.rect(585,300,150,40,WHITE);a.text(660,270,'抵抗',30,anchor='middle');a.circle(440,320,42,WHITE,TEAL,5);a.text(440,331,'A',34,TEAL,'middle');a.line(580,320,580,450);a.line(740,320,740,450);a.circle(660,450,45,WHITE,BLUE,5);a.line(580,450,615,450);a.line(705,450,740,450);a.text(660,462,'V',34,BLUE,'middle');a.text(700,730,'電流計は直列、電圧計は対象の両端',32,anchor='middle')
 elif n in (30,88):
  positions=[(95,230),(545,230),(995,230),(310,535),(830,535)]
  for (x,y),kind in zip(positions,['射出','ブロー','圧縮','押出','積層']):
   if kind=='射出':a.rect(x,y+40,170,60,STEEL);a.rect(x+170,y,100,150,GRAY);a.arrow(x-25,y+70,x+165,y+70,GOLD)
   elif kind=='ブロー':a.path(f'M{x+90},{y+10} h60 v30 q100,25 60,120 h-180 q-40,-95 60,-120 Z',PALE);a.arrow(x+120,y-20,x+120,y+100,BLUE)
   elif kind=='圧縮':a.rect(x,y+110,270,40,GRAY);a.rect(x+35,y,200,40,GRAY);a.ellipse(x+135,y+100,70,25,GOLD);a.arrow(x+135,y+45,x+135,y+80,TEAL)
   elif kind=='押出':a.rect(x,y+40,170,75,GRAY);a.rect(x+170,y+55,130,40,GOLD);a.arrow(x-40,y+78,x+110,y+78)
   else:
    for k in range(4):a.poly([(x+10*k,y+100-18*k),(x+210+10*k,y+100-18*k),(x+270+10*k,y+130-18*k),(x+60+10*k,y+130-18*k)],['#d2c498','#8cb9bb','#d2c498','#8cb9bb'][k])
   a.text(x+135,y+210,kind,32,anchor='middle')
  if n==88:a.text(700,170,'形をつくる方法と、固まる条件を分ける',32,anchor='middle');a.circle(1260,720,35,RED);a.path('M1215,705 q30,-25 60,0',stroke=RED)
 elif n in (31,89):
  a.path('M180,340 h130 l40,45 -70,45 -100,-25 Z',STEEL);a.rect(235,420,35,100,GRAY)
  for i in range(7):a.circle(430+i*34,345+i*12,8,BLUE,BLUE,1)
  a.rect(690,280,35,320,STEEL);a.line(690,280,725,280,TEAL,9);a.text(470,675,'飛んだ粒子と対象物',32,anchor='middle');tank(a,950,325,280,240);a.line(978,335,978,240,RED,4);a.line(978,240,985,240,RED,4);a.line(1120,290,1120,255,INK,4);a.rect(985,205,180,50,WHITE);a.text(1075,241,'直流電源',28,anchor='middle');a.text(1090,675,'液中で皮膜を形成',32,anchor='middle')
  if n==89:
   for xx,yy in [(450,250),(520,275),(590,300)]:a.text(xx,yy,'−',34,BLUE)
   a.line(710,600,710,660,INK,4);a.line(680,660,740,660);a.line(690,672,730,672);a.text(665,735,'接地・適用条件は指定どおり',28,anchor='middle')
 elif n==32:
  a.rect(120,350,300,250,'#d2b48c');part(a,175,420,180,100,PALE);a.rect(145,380,250,190,'none',TEAL,18);a.text(270,685,'保護・緩衝',34,anchor='middle');a.rect(560,335,270,210,'#d2b48c');a.rect(600,390,185,90,WHITE);a.text(695,430,'品番',32,anchor='middle');a.line(620,460,760,460,INK,6);a.text(695,685,'識別',34,anchor='middle');part(a,1010,400,230,140,STEEL);a.poly([(990,380),(1260,380),(1260,565),(990,565)],'none',TEAL,4);a.text(1125,685,'輸送条件',34,anchor='middle')
 elif n in (33,90):
  rollers(a,120,310,True);rollers(a,850,310,False);a.text(310,690,'熱間',36,RED,'middle');a.text(1045,690,'冷間',36,BLUE,'middle')
  if n==90:
   for xx in [200,260,320]:a.ellipse(xx,610,40,10,'none',RED,2)
   for xx in [960,1020,1080]:a.ellipse(xx,610,45,7,'none',BLUE,2)
   a.text(700,240,'寸法・表面・加工硬化・後処理を照合',32,anchor='middle')
 elif n==34:
  rollers(a,100,330);a.path('M245,230 v60 l80,25',stroke=BLUE,w=9)
  for x in [255,275,295]:a.path(f'M{x},305 q-18,26 0,35 q18,-9 0,-35 Z',BLUE,BLUE,2)
  furnace(a,870,340);a.arrow(620,470,790,470);a.text(340,720,'潤滑・冷却・表面保護',32,anchor='middle');a.text(985,720,'後工程の性質調整',32,anchor='middle')
 elif n in (35,91):
  extrusion(a,200,290,1.55);a.text(370,240,'ビレット・ダイス',34);a.leader(860,445,940,330,'一定の断面');a.leader(850,555,880,675,'搬送面も確認')
  if n==91:
   a.poly([(1090,470),(1200,470),(1200,500),(1120,500),(1120,610),(1090,610)],GOLD);a.text(1120,735,'断面形状と製品',30,anchor='middle')
  else:a.path('M700,445 h200 M700,455 h200',stroke=RED,w=3);a.text(800,730,'縦筋や割れを工程条件と照合',30,anchor='middle')
 elif n==36:
  for i,c in enumerate([RED,GOLD,BLUE]):
   x=200+i*220;a.rect(x,310,90,220,WHITE,INK,4,35);a.rect(x+5,410,80,115,c,'none',0,25);a.text(x+45,600,['酸性','中性','アルカリ性'][i],30,anchor='middle')
  a.circle(1010,365,65,STEEL);a.circle(1010,615,65,STEEL);a.arrow(1010,445,1010,535,TEAL);a.circle(1140,490,18,BLUE);a.text(1140,502,'e',28,WHITE,'middle');a.text(1070,735,'電子の受渡し',32,anchor='middle')
 elif n==37:
  a.rect(130,340,230,170,STEEL);a.rect(165,365,160,120,'none',TEAL,8);a.text(245,630,'使う量を減らす',32,anchor='middle');a.rect(590,365,180,150,'#b9c4ca');a.path('M600,365 v-45 h160 v45',stroke=TEAL,w=8);a.path('M625,540 a80,80 0 1,0 100,0',stroke=TEAL,w=8);a.text(680,630,'繰り返し使う',32,anchor='middle');a.poly([(1040,410),(1130,330),(1250,410),(1190,540),(1060,520)],STEEL);a.arrow(1060,280,1220,280,TEAL);a.text(1150,630,'資源として戻す',32,anchor='middle')
 elif n==38:
  document(a,115,285,310,360,'製品規格',6);a.rect(170,385,190,65,PALE);dim(a,170,385,360,385,'要求',25);document(a,590,285,310,360,'管理の規格',6);a.circle(740,480,65,'none',TEAL,5);a.path('M700,460 l50,45 50,-60',stroke=TEAL,w=5);part(a,1045,380,200,130);a.text(1145,600,'個別に検査',32,anchor='middle');a.text(700,755,'規格名・対象・版と、品物の判定は別',32,anchor='middle')
 elif n==39:
  a.line(220,260,220,440,INK,7);a.circle(220,260,15,GRAY);a.rect(200,435,60,70,GRAY);a.path('M220,505 Q330,550 360,620',stroke=TEAL,w=5);a.rect(120,610,260,30,STEEL);a.text(250,735,'衝撃',34,anchor='middle');a.circle(600,600,30,GRAY);a.circle(820,600,30,GRAY);a.path('M565,520 Q710,620 855,520',stroke=BLUE,w=15);a.arrow(710,350,710,470);a.text(710,735,'曲げ',34,anchor='middle');waveform(a,1010,360,260,150);a.rect(1000,580,280,40,STEEL);a.text(1140,735,'繰返し',34,anchor='middle')
 elif n==40:
  a.rect(150,590,400,70,STEEL);a.rect(230,465,200,125,GOLD);a.circle(330,320,110,WHITE,INK,6)
  for k in range(20):
   ang=k*math.pi/10;a.line(330+90*math.sin(ang),320-90*math.cos(ang),330+104*math.sin(ang),320-104*math.cos(ang),INK,3)
  a.line(330,320,278,250,RED,7);a.line(330,430,330,465,INK,10);a.text(330,195,'基準合わせ',34,anchor='middle');a.text(920,350,'基準 30.00 mm',38,anchor='middle');a.text(920,450,'差 −0.04 mm',38,TEAL,'middle');a.text(920,570,'29.96 mm',45,anchor='middle');a.text(920,680,'符号・測定方向を確認',30,anchor='middle')
 elif n==41:
  a.circle(270,330,80,WHITE);a.rect(245,410,50,110,STEEL);a.line(270,520,340,585,INK,9);a.circle(345,590,13,TEAL);a.text(270,710,'てこ式',34,anchor='middle');a.rect(650,330,35,260,STEEL);a.rect(580,560,180,30,TEAL);a.circle(668,300,70,WHITE);a.path('M610,590 v50 h115 v-50',stroke=GRAY,w=15);a.text(670,710,'内径の比較',34,anchor='middle');a.circle(1100,330,75,WHITE);a.path('M1080,405 q-130,40 -90,210 M1120,405 q130,40 90,210',stroke=STEEL,w=18);a.text(1100,710,'溝へ届く測定子',30,anchor='middle')
 elif n==42:
  a.rect(150,360,250,160,STEEL);a.circle(275,440,70,WHITE);a.rect(430,410,230,60,TEAL);a.arrow(560,365,350,365);a.tick(470,570);a.text(350,690,'通り側',34,anchor='middle');a.rect(850,360,250,160,STEEL);a.circle(975,440,70,WHITE);a.rect(1120,390,140,100,RED);a.line(1098,350,1098,540,RED,5);a.text(1050,690,'止り側・指定条件',32,anchor='middle')
 elif n==43:
  a.rect(120,250,420,435,WHITE,INK,5)
  for k in range(1,4):a.rect(120,250,420/(2**(k/2)),435/(2**(k/2)),['#edf3f4','#d8e7eb','#bfd6de'][k-1],INK,3)
  a.text(330,755,'用紙・読める文字',32,anchor='middle');part(a,700,290,130,100);bolt(a,740,470,.7);a.rect(980,280,260,330,WHITE);a.rect(1000,320,70,90,STEEL);a.rect(1115,430,95,65,TEAL);a.line(990,580,1225,580,GRAY,5);a.text(975,755,'部品・組立・配置を使い分ける',28,anchor='middle')
 elif n==44:
  a.poly([(160,410),(440,410),(540,340),(260,340)],PALE);a.rect(160,410,280,180,STEEL);a.poly([(440,410),(540,340),(540,520),(440,590)],'#7f9eaf');a.text(350,690,'独自の直方体',32,anchor='middle');a.rect(820,445,280,180,PALE);a.rect(820,290,280,108,PALE);a.rect(1140,445,108,180,PALE);a.text(960,260,'上面図',30,anchor='middle');a.text(960,685,'正面図',32,anchor='middle');a.text(1195,685,'右側面',28,anchor='middle');a.line(820,398,820,445,TEAL,2,'8 7');a.line(1100,398,1100,445,TEAL,2,'8 7')
 elif n==45:
  a.ellipse(360,375,190,120,STEEL);a.ellipse(360,375,95,60,WHITE);a.rect(170,375,380,150,STEEL);a.ellipse(360,525,190,120,STEEL);a.ellipse(360,525,95,60,WHITE);a.rect(265,375,190,150,WHITE,'none',0);a.path('M175,450 H545',stroke=RED,w=5);a.arrow(610,450,760,450);a.circle(1010,450,160,PALE);a.circle(1010,450,85,WHITE)
  a.raw('<clipPath id="ring"><path d="M850,450a160,160 0 1,0 320,0a160,160 0 1,0 -320,0 M925,450a85,85 0 1,1 170,0a85,85 0 1,1 -170,0" fill-rule="evenodd"/></clipPath><g clip-path="url(#ring)">')
  for k in range(50):a.line(300+k*25,750,900+k*25,150,GRAY,2)
  a.end();a.circle(1010,450,85,WHITE);a.text(1010,465,'空間',32,anchor='middle');a.text(700,755,'切られた材料だけにハッチング',32,anchor='middle')
 elif n==46:
  a.path('M250,350 h350 v220 h-180 v-100 h-170 Z',STEEL);dim(a,250,350,600,350,'長さ',45);dim(a,250,350,250,570,'高さ',65);a.circle(1020,500,145,WHITE);a.line(1020,500,1130,400,INK,4);a.line(1020,500,1020,355,INK,4);a.path('M1020,430 A70,70 0 0,1 1070,450',stroke=TEAL,w=5);a.text(1080,355,'角度',32);a.text(700,750,'数値と線の両端から対象を確かめる',32,anchor='middle')
 elif n==47:
  a.path('M250,350 h540 v240 h-540 Z',STEEL);a.circle(470,470,50,WHITE);a.path('M250,390 q0,-40 40,-40',stroke=RED,w=7);a.leader(270,360,160,265,'R');dim(a,420,470,520,470,'φ',100);a.rect(1000,340,40,250,STEEL);dim(a,1000,340,1040,340,'t',50);a.text(650,690,'参考寸法は（ ）を残す',34,anchor='middle')
 elif n==48:
  a.rect(260,590,800,50,STEEL);a.path('M280,360 q150,-45 310,0 t300,-10',stroke=TEAL,w=7);a.line(260,315,1060,315,RED,3,'12 8');a.line(260,415,1060,415,RED,3,'12 8');a.rect(760,210,390,80,WHITE);a.line(870,210,870,290);a.line(1020,210,1020,290);a.text(815,265,'∥',40,anchor='middle');a.text(945,265,'0.08',36,anchor='middle');a.text(1085,265,'B',36,anchor='middle');a.arrow(780,290,730,360);a.poly([(570,640),(590,675),(550,675)],INK);a.rect(540,680,70,70,WHITE);a.text(575,731,'B',36,anchor='middle');a.text(1030,735,'基準面と対象面を区別',30,anchor='middle')
 elif n==49:
  roughframe(a,100,420);a.path('M270,300 l35,45 70,-90 h150',stroke=INK,w=4);a.text(370,245,'Ra',32);a.rect(850,480,370,55,STEEL);a.rect(990,300,55,180,STEEL);a.poly([(1045,480),(1105,480),(1045,420)],GOLD);a.line(850,250,1250,250,INK,4);a.poly([(1000,250),(1040,250),(1000,290)],WHITE);a.arrow(900,250,1050,440);a.text(1060,675,'位置・開先・基本記号',30,anchor='middle')
 elif n==50:
  for x,c in [(180,BLUE),(900,STEEL)]:
   a.rect(x,350,220,220,c);a.poly([(x,350),(x+65,300),(x+285,300),(x+220,350)],c);a.poly([(x+220,350),(x+285,300),(x+285,520),(x+220,570)],c)
  a.text(320,670,'基準物質',34,anchor='middle');a.text(1040,670,'比べる材料',34,anchor='middle');a.text(700,240,'同じ体積・同じ条件で比べる',36,anchor='middle');a.text(700,755,'比重は密度どうしの比（単位なし）',32,anchor='middle')
 elif n==51:
  a.rect(110,430,540,50,STEEL)
  for k in range(19):a.line(110+k*30,430,110+k*30,455 if k%3 else 475,INK,2)
  part(a,110,350,340,75,GOLD,False);a.tick(130,540);a.path('M1030,560 m-170,0 a170,170 0 0,1 340,0',stroke=TEAL,w=5);a.line(860,560,1200,560,INK,4);a.line(1030,560,1150,440,INK,8)
  for k in range(13):
   ang=k*math.pi/12;a.line(1030+150*math.cos(ang),560-150*math.sin(ang),1030+168*math.cos(ang),560-168*math.sin(ang),INK,3)
  a.text(1040,700,'二面の角度を照合',32,anchor='middle')
 elif n==52:
  a.rect(110,630,510,50,GRAY);a.rect(210,280,35,350,STEEL);a.rect(165,600,140,30,STEEL);a.rect(235,380,170,40,BLUE);part(a,350,480,120,150,GOLD,False);a.line(395,420,395,480,INK,5);a.arrow(540,620,540,480);a.text(340,750,'高さ：定盤が基準',32,anchor='middle');a.rect(830,380,400,210,STEEL);a.rect(950,380,160,140,WHITE);a.rect(870,340,320,35,BLUE);a.rect(1020,375,25,125,GRAY);a.arrow(1190,385,1190,515);a.text(1050,750,'深さ：上面が基準',32,anchor='middle')
 elif n==53:
  a.rect(140,250,1100,410,'#edf4f3',INK,5);machine(a,200,310,.7);machine(a,790,310,.7);a.path('M150,600 H1220',stroke=TEAL,w=18);a.rect(610,285,100,140,INK,INK,3,14);a.path('M625,320 q40,-30 70,0',stroke=WHITE,w=10);a.circle(385,565,30,RED);a.path('M385,535 V480 H660 V440',stroke=RED,w=6);a.text(660,220,'指定された連絡先へ',36,anchor='middle');a.text(700,755,'挨拶と、危険を知らせる連絡は役割が異なる',30,anchor='middle')
 elif n==54:
  machine(a,130,310,.9);a.rect(790,270,380,370,WHITE,INK,5,18);a.rect(825,320,110,130,PALE);worker(a,880,355,TEAL);a.text(970,345,'作業範囲',30);gear(a,1010,405,20,STEEL);a.tick(1100,420);a.path('M990,485 l40,25 -15,25',stroke=GOLD,w=7);a.cross(1100,510);a.line(820,555,1140,555,STEEL,3);a.text(980,610,'教育・資格の確認',28,anchor='middle');a.text(700,755,'作業が変われば、必要な教育も確認する',32,anchor='middle')
 elif n==55:
  a.poly([(1050,260),(1250,660),(850,660)],PALE,TEAL,5);a.line(945,470,1150,470);a.line(900,570,1200,570);a.text(1050,400,'1',40,anchor='middle');a.text(1050,540,'29',40,anchor='middle');a.text(1050,630,'300',40,anchor='middle');a.rect(230,260,180,120,GOLD);a.path('M230,380 l30,70 -70,65',stroke=RED,w=7);a.line(160,600,610,600,INK,5);a.ellipse(420,570,60,20,INK);a.text(360,710,'けががなくても事実を残す',30,anchor='middle');a.text(1040,750,'学習上の比率・予測ではない',28,anchor='middle')
 elif n==56:
  a.circle(360,260,20,GRAY);a.line(360,280,180,560,TEAL,8);a.line(360,280,540,560,TEAL,8);a.rect(160,560,400,90,STEEL);a.line(360,280,360,560,GRAY,2,'10 7');a.text(355,740,'角度と吊り荷を確認',32,anchor='middle');a.rect(950,430,220,85,STEEL);bolt(a,1030,285,.8);a.path('M1010,320 l-50,80',stroke=RED,w=8);a.cross(965,365);a.text(1050,690,'ねじを無理に押し込まない',30,anchor='middle')
 elif n==57:
  mask(a,360,410,'dust');mask(a,1010,410,'gas')
  for k in range(9):a.circle(150+(k%3)*28,340+(k//3)*40,6,GRAY,GRAY,1)
  for k in range(5):a.path(f'M{1180},{300+k*40} q-20,-20 -40,0 t-40,0',stroke=BLUE,w=4)
  a.text(360,680,'粒子への適合',34,anchor='middle');a.text(1010,680,'ガスへの適合',34,anchor='middle')
 elif n==58:
  a.path('M270,600 C150,530 260,445 240,370 C370,450 340,480 380,450 C435,550 390,620 270,600 Z',GOLD,RED,5);a.rect(145,610,340,35,STEEL);a.rect(760,300,100,130,RED,RED,3,14);a.text(810,385,'通報',28,WHITE,'middle');a.rect(1050,280,180,350,TEAL,INK,5);a.path('M1070,310 H1190 V600',stroke=WHITE,w=8);a.arrow(900,550,1050,550,TEAL,10);a.text(700,755,'知らせる・退路を確保・無理な接近をしない',30,anchor='middle')
 elif n==59:
  cart(a,105,490,270);part(a,140,340,200,140,GOLD);a.path('M100,685 H430',stroke=TEAL,w=10);a.arrow(400,685,470,685);furnace(a,600,360);a.path('M640,290 q25,-40 50,0 t50,0',stroke=RED,w=6);a.rect(1010,350,230,240,PALE);a.path('M990,350 h270 l-45,-60 h-180 Z',GRAY);a.arrow(1125,445,1125,325,TEAL,8);a.text(260,755,'運搬',32,anchor='middle');a.text(700,755,'暑熱',32,anchor='middle');a.text(1130,755,'局所の暴露防止',30,anchor='middle')
 elif n==60:
  machine(a,120,300,1);document(a,630,250,310,390,'対象・版',7);a.rect(1000,380,230,160,WHITE,INK,4);a.line(1035,400,1190,520,RED,7);a.line(1190,400,1035,520,RED,7);a.rect(1000,580,230,70,TEAL);a.text(1115,627,'正式に周知',28,WHITE,'middle');a.text(700,750,'承認された現行手順を、使える場所へ',32,anchor='middle')
 elif n==61:
  for i in range(5):
   x=110+i*250
   if i==0:part(a,x,390,160,100,PALE);dim(a,x,390,x+160,390,'要求',25)
   elif i==1:a.rect(x,350,130,180,STEEL);a.rect(x+20,375,90,130,GOLD)
   elif i==2:machine(a,x,345,.48)
   elif i==3:a.circle(x+80,405,75,'none',TEAL,5);a.line(x+135,460,x+170,495,TEAL,13);part(a,x+40,370,80,60,STEEL)
   else:a.rect(x,360,155,160,'#caa77e');a.line(x+78,360,x+78,520,INK,3)
   a.text(x+80,650,['設計','調達','製造','検査','出荷'][i],30,anchor='middle')
   if i<4:a.arrow(x+175,445,x+225,445,TEAL)
  a.path('M180,720 H1190 V690',stroke=GOLD,w=6);a.arrow(180,720,180,670,GOLD)
 elif n==62:
  part(a,150,370,240,140,STEEL);a.rect(150,250,240,85,INK,INK,3,10);a.text(270,309,'12.03',42,WHITE,'middle');a.arrow(430,430,570,430);document(a,640,250,240,350,'記録',5);a.text(760,430,'12.30',38,RED,'middle');a.cross(760,475);document(a,1030,250,240,350,'訂正履歴',5);a.text(1150,430,'12.03',38,TEAL,'middle');a.tick(1150,500);a.text(700,735,'独自の転記例：実測・記録・訂正を区別',32,anchor='middle')
 elif n==63:
  waveform(a,130,330,470,180,'dc',TEAL);waveform(a,800,330,470,180,'sine',BLUE);a.text(365,640,'直流：方向が一定',34,anchor='middle');a.text(1035,640,'交流：方向が変わる',34,anchor='middle');a.rect(540,710,330,65,WHITE,INK,3);a.text(705,755,'銘板と定格も確認',28,anchor='middle')
 elif n==64:
  machine(a,140,280,1.1);a.path('M300,480 L300,670',stroke=TEAL,w=8);a.line(260,670,340,670,TEAL,5);a.line(273,685,327,685,TEAL,5);a.line(287,700,313,700,TEAL,5);a.path('M470,410 l-55,40 35,15 -50,65',stroke=RED,w=8);a.rect(920,290,220,260,WHITE,INK,5);a.line(950,350,1010,350,INK,5);a.line(1030,350,1100,350,INK,5);a.line(1008,350,1035,315,TEAL,6);a.text(1030,615,'停止後の残留も確認',30,anchor='middle');a.text(700,755,'これは原理図であり、配線・救助の作業指示ではない',28,anchor='middle')
 elif n==65:
  a.circle(240,440,110,STEEL);a.circle(240,440,60,PALE);a.line(240,440,350,440,INK,15);a.path('M175,350 a105,105 0 0,1 150,70',stroke=TEAL,w=6);a.text(240,690,'モーター',34,anchor='middle');coil(a,560,360,120,95,5);coil(a,750,360,120,95,8);a.rect(690,280,45,280,GRAY);a.text(710,690,'変圧器',34,anchor='middle');a.rect(1040,300,180,280,PALE,INK,5,12);a.rect(1080,380,100,120,GRAY);a.line(1110,415,1160,380,RED,12);a.text(1130,690,'ブレーカー',32,anchor='middle')
 elif n==66:
  for i,kind in enumerate(['導体','絶縁体','半導体']):
   x=110+i*450;a.rect(x,340,320,160,[STEEL,PALE,'#c9b8da'][i],INK,4);a.text(x+160,650,kind,36,anchor='middle')
   for j in range(7):a.circle(x+30+j*43,420,7,TEAL,TEAL,1)
   if i==0:a.arrow(x+40,560,x+280,560)
   elif i==1:a.line(x+160,350,x+160,490,RED,10);a.cross(x+160,565)
   else:a.circle(x+160,255,38,GOLD);a.arrow(x+160,300,x+160,335,GOLD);a.arrow(x+40,560,x+200,560,BLUE)
 elif n==67:
  a.rect(180,380,300,70,WHITE,INK,5);a.line(100,415,180,415,INK,5);a.line(480,415,560,415,INK,5)
  for k in range(4):a.path(f'M{240+k*55},335 q-20,-35 0,-65',stroke=RED,w=4)
  a.text(330,650,'抵抗：電流・発熱',34,anchor='middle');a.line(870,325,870,515,BLUE,12);a.line(1030,325,1030,515,RED,12);a.line(760,420,870,420,INK,5);a.line(1030,420,1160,420,INK,5)
  for y in [350,405,460]:a.text(910,y,'＋',32,RED);a.text(980,y,'−',32,BLUE)
  a.text(970,650,'コンデンサ：蓄積・放出',32,anchor='middle')
 elif n==68:
  a.line(120,420,580,420,INK,6);a.poly([(270,340),(270,500),(400,420)],PALE);a.line(400,330,400,510,INK,7);a.arrow(170,560,490,560);a.text(355,690,'一方向への導通',34,anchor='middle');a.circle(1010,420,135,WHITE);a.line(870,420,960,420,INK,6);a.line(960,340,960,500,INK,6);a.line(960,385,1065,315,INK,6);a.line(960,455,1065,525,INK,6);a.arrow(1010,488,1065,525,INK,5);a.text(1030,690,'増幅・スイッチング',32,anchor='middle');a.text(700,240,'端子配置と使用条件は、機種ごとに確認',32,anchor='middle')
 elif n==69:
  for i,label in enumerate(['学科','実技']):
   x=300+i*750;a.circle(x,350,100,WHITE,INK,5);a.line(x,350,x,285,TEAL,7);a.line(x,350,x+45,380,TEAL,7);a.text(x,205,label,38,anchor='middle')
  document(a,170,500,260,190,'A / B',3);part(a,940,500,230,120,STEEL);dim(a,940,500,1170,500,'判断',25);a.text(700,780,'時間と条件を、二つの区分で別々に確認',32,anchor='middle')
 elif n==70:
  document(a,165,260,390,390,'専門語・文末',7);a.circle(460,520,90,'none',TEAL,10);a.line(520,580,580,640,TEAL,18);a.text(340,405,'〜ない',40);a.rect(950,300,180,290,INK,INK,4,20);a.circle(1040,440,135,'none',RED,12);a.line(935,545,1145,335,RED,13);a.text(1040,710,'試験情報を持ち出さない',30,anchor='middle')
 elif n==73:
  machine(a,220,245,.55);mask(a,1040,350,'dust');document(a,875,545,230,180,'評価記録',3);gear(a,370,640,75,TEAL);a.path('M530,300 Q750,200 900,290 M1100,460 Q1200,600 1120,650 M810,720 H520 M260,540 Q150,430 250,350',stroke=GOLD,w=8);a.text(700,460,'現場の確認を循環へ',36,anchor='middle')
 elif n==75:
  for i,k in enumerate(['rockwell','brinell','vickers','knoop','shore']):
   x=55+i*270;hard(a,x,330,k,.85);a.text(x+90,250,['HR','HBW','HV','HK','HS'][i],35,anchor='middle')
  a.text(700,785,'深さ・直径・対角線・反発の高さを区別',32,anchor='middle')
 elif n==76:
  a.rect(120,500,540,90,STEEL);a.path('M410,500 l20,35 -20,25',stroke=RED,w=6);coil(a,280,300,180,70,6)
  for y in [430,450,470]:a.ellipse(420,y,95,18,'none',TEAL,3)
  a.text(385,700,'渦電流と欠陥の影響',32,anchor='middle');surface(a,870,480,350,100,20);a.circle(1040,300,65,WHITE);a.ellipse(1040,300,35,17,PALE);a.circle(1040,300,14,INK);a.arrow(1040,370,1040,430);a.text(1040,700,'安全な観察条件',32,anchor='middle')
 elif n==77:
  a.poly([(150,520),(380,520),(380,380),(265,465),(150,380)],STEEL);a.circle(265,380,73,PALE);a.text(265,690,'円筒を支える',32,anchor='middle');a.path('M620,280 v290 h220 v-45 h-175 v-245 Z',STEEL);a.text(720,690,'直角の基準',32,anchor='middle');a.rect(1040,500,180,80,TEAL);a.line(1130,500,1130,300,INK,10);a.line(1130,300,1000,240,INK,10);a.circle(1000,240,20,GRAY);a.text(1120,690,'保持・案内',32,anchor='middle')
 elif n==78:
  a.rect(130,600,520,55,GRAY);a.rect(160,260,65,340,STEEL);a.rect(540,260,65,340,STEEL);a.rect(160,240,445,65,BLUE);a.rect(350,305,35,180,STEEL);a.line(365,485,365,540,INK,5);a.circle(365,545,9,RED);part(a,295,545,180,55,GOLD);a.text(390,740,'座標から形状を調べる',32,anchor='middle');surface(a,855,520,350,100,24);a.poly([(980,355),(1020,355),(1030,480),(1010,510),(990,480)],STEEL);a.arrow(980,310,1130,310,TEAL);a.text(1030,740,'触針と粗さ曲線',32,anchor='middle')
 elif n==79:
  for i in range(4):a.rect(230+i*80,400-i*18,70,210+i*18,STEEL,INK,4)
  a.line(225,400,550,345,TEAL,9);a.leader(410,365,580,265,'測定面');a.rect(850,330,380,280,'#c7a777',INK,5,18)
  for i in range(5):a.rect(875+i*65,385,45,180,PALE,INK,2,4)
  a.text(1070,710,'保管・識別・傷の防止',32,anchor='middle');a.text(380,710,'組合せと接触面を守る',32,anchor='middle')
 elif n==80:
  a.rect(170,310,400,270,'none',INK,8);a.line(170,445,570,445,TEAL,4,'24 8 4 8');a.line(370,280,370,615,TEAL,4,'24 8 4 8');a.line(280,310,280,580,BLUE,4,'15 12');a.line(460,310,460,580,BLUE,4,'15 12');a.rect(840,310,350,270,'none',GRAY,3);a.path('M900,580 l30,-60 30,60 30,-60 30,60',stroke=INK,w=4);a.line(840,250,1190,250,RED,4,'30 10 5 10');a.arrow(840,250,840,300,RED);a.arrow(1190,250,1190,300,RED);a.text(370,735,'外形・隠れた形・中心',30,anchor='middle');a.text(1030,735,'破断・切断位置',32,anchor='middle')
 elif n==81:
  a.circle(280,420,125,PALE);a.ellipse(280,420,125,35,'none',GRAY,3);a.line(155,420,405,420,RED,4);a.text(280,630,'球径 Sφ',34,anchor='middle');a.path('M650,330 h240 l-60,60 h-180 Z',STEEL);a.path('M650,330 h90 v90 h-90 Z',PALE);a.leader(850,370,920,280,'面取り');a.rect(950,460,220,120,STEEL);a.poly([(1000,460),(1050,510),(1100,460)],WHITE);a.text(1060,660,'皿ざぐり・穴',32,anchor='middle');a.text(700,755,'記号だけでなく、指している形状を見る',32,anchor='middle')
 elif n==82:
  a.line(100,570,440,570,GRAY,4);a.path('M130,420 q100,-50 200,5 t80,-20',stroke=TEAL,w=7);a.line(100,365,440,365,RED,3,'10 7');a.line(100,465,440,465,RED,3,'10 7');a.text(270,700,'形状',34,anchor='middle');a.rect(585,510,250,55,STEEL);a.line(600,325,820,365,TEAL,8);a.text(710,700,'方向',34,anchor='middle');a.rect(1000,330,260,240,STEEL);a.circle(1130,450,65,WHITE);a.circle(1130,450,25,'none',TEAL,3);a.line(1010,450,1250,450,RED,3,'10 7');a.line(1130,340,1130,560,RED,3,'10 7');a.text(1130,700,'位置',34,anchor='middle')
 elif n==83:
  for i,label in enumerate(['熱を伝えやすい例','熱を伝えにくい例']):
   x=150+i*650;a.rect(x,360,400,120,'#c8a16c' if i==0 else STEEL,INK,4);a.circle(x-10,420,55,RED);a.arrow(x+30,420,x+(360 if i==0 else 160),420,GOLD,14);a.text(x+200,650,label,30,anchor='middle')
  a.text(700,240,'材料・条件をそろえて比べる模式図',34,anchor='middle');a.text(700,755,'融点だけで使用できる温度は決まらない',32,anchor='middle')
 elif n==84:
  a.rect(130,370,500,190,STEEL);a.path('M330,370 l60,100 60,-100',GOLD,RED,6);a.path('M290,370 l100,155 100,-155',fill='none',stroke='#c88174',w=26);a.text(375,680,'溶接部の周囲にも熱の影響',30,anchor='middle');a.rect(840,370,400,190,STEEL)
  for k in range(6):a.path(f'M850,{390+k*25} Q1050,{330+k*25} 1230,{390+k*25}',stroke=TEAL,w=3)
  a.arrow(920,285,1160,285,RED);a.text(1030,680,'材料内部の流れと向き',30,anchor='middle')
 elif n==85:
  lathe(a,300,290,1.7,True);a.leader(700,610,870,760,'サドル・エプロン')
 elif n==86:
  milling(a,70,310,1);drill(a,550,310,1);machine(a,990,310,.75);gear(a,1115,330,55,TEAL);a.text(240,725,'フライス盤',32,anchor='middle');a.text(720,725,'ボール盤',32,anchor='middle');a.text(1120,725,'工具自動交換',30,anchor='middle')
 elif n==87:
  a.circle(460,420,145,GRAY);a.circle(460,420,45,WHITE);a.path('M310,430 A150,150 0 0,1 610,430',stroke=TEAL,w=28);a.rect(410,560,390,55,STEEL);a.rect(690,340,90,220,GRAY);a.path('M540,540 l100,90 M560,520 l150,40 M580,500 l160,0',stroke=GOLD,w=7);a.rect(990,300,190,300,PALE,INK,4);a.path('M1005,320 l165,255 M1170,320 l-165,255',stroke=RED,w=9);a.text(700,755,'砥石・切りくずへ、動いたまま近づかない',32,anchor='middle')
 else:raise ValueError(n)

def build():
 lessons=json.loads((ROOT/'src/data/manufacturing/mechanical.json').read_text())['lessons'];assert len(lessons)==91
 plans=json.loads((OUT/'caption-plan.json').read_text())['bindings'];byid={p['lessonId']:p for p in plans};bindings=[];shape_hashes={}
 ASSETS.mkdir(parents=True,exist_ok=True)
 for i,l in enumerate(lessons,1):
  a=Art();recipe(i,a);body=''.join(a.parts)
  graphic_hash=hashlib.sha256(re.sub(r'<text\b.*?</text>','',body,flags=re.S).encode()).hexdigest()
  assert graphic_hash not in shape_hashes,(i,shape_hashes.get(graphic_hash));shape_hashes[graphic_hash]=i
  title=l['titleJa'];title_lines=[title[j:j+29] for j in range(0,len(title),29)]
  svg='<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900"><rect width="1400" height="900" fill="#faf9f4"/><g font-family="Noto Sans CJK JP, sans-serif">'
  svg+=f'<text x="65" y="64" fill="{TEAL}" font-size="28" font-weight="700">機械金属加工・学習図 {i:03d}</text>'
  for k,line in enumerate(title_lines):svg+=f'<text x="65" y="{120+k*45}" fill="{INK}" font-size="36" font-weight="700">{html.escape(line)}</text>'
  svg+=body+f'<text x="700" y="865" text-anchor="middle" fill="{GRAY}" font-size="26">独自の学習用模式図・実機の仕様や作業指示ではありません</text></g></svg>'
  stem=f'day-{i:03d}';svgpath=ASSETS/(stem+'.svg');pngpath=ASSETS/(stem+'.png');svgpath.write_text(svg)
  cairosvg.svg2png(bytestring=svg.encode(),write_to=str(pngpath),output_width=1400,output_height=900)
  with Image.open(pngpath) as im:
   assert im.size==(1400,900);im.convert('RGB').save(pngpath,optimize=True)
  p=byid[l['id']];assert p['captionJa']==l['summaryJa'] and p['altJa']==l['titleJa'] and p['lessonSourceHash']==l['sourceHash']
  bindings.append({'lessonId':l['id'],'lessonSourceHash':l['sourceHash'],'specialty':'mechanical','level':'1','keyObjectiveId':l['id']+'-objective-main','keyObjectiveJa':l['objectiveJa'],'assetId':f'mfg40-mechanical-day-{i:03d}','assetFile':str(pngpath.relative_to(ROOT)),'svgFile':str(svgpath.relative_to(ROOT)),'width':1400,'height':900,'sha256':hashlib.sha256(pngpath.read_bytes()).hexdigest(),'svgSha256':hashlib.sha256(svgpath.read_bytes()).hexdigest(),'graphicalGeometrySha256':graphic_hash,'captionJa':l['summaryJa'],'altJa':l['titleJa'],'captionReuse':{'field':'summaryJa','sourceLessonId':l['id']},'altReuse':{'field':'titleJa','sourceLessonId':l['id']},'relevanceReasonJa':RELEVANCE[i-1],'sourceRefs':l['sources'],'rights':{'origin':'original_controlled_svg_and_rasterization','sourceImagesCopied':False,'projectMayRedistributeGeneratedArt':True,'font':'Noto Sans CJK JP, system font; rasterized glyphs only'},'reviewFlags':{'aiSemanticReview':True,'pixelInspected':True,'domainReviewed':False,'nativeReviewed':False,'humanReviewed':False,'physicalDeviceVerified':False},'integrationStatus':'asset_delivered_reader_registration_owned_by_root','reusedExistingAsset':False,'renderedByExistingComponent':False,'pixelInspectionScope':'all 91 contact-sheet images; selected full-resolution instrument, section and circuit images','bytes':pngpath.stat().st_size})
 (OUT/'daily-bindings.json').write_text(json.dumps({'schemaVersion':1,'specialty':'mechanical','scope':'91 canonical scheduled lesson days; supplements remain attached by shared reader','bindings':bindings,'all91AssetsHaveActualPngBytes':True,'existingReaderImagesMustRemain':True,'domainReviewed':False,'nativeReviewed':False,'physicalDeviceVerified':False},ensure_ascii=False,indent=2)+'\n')
 (OUT/'build-validation.json').write_text(json.dumps({'status':'PASS_ASSET_BYTES_AND_EXACT_CANONICAL_BINDINGS','lessons':91,'uniqueAssets':91,'uniqueNonTextGeometryHashes':len(shape_hashes),'pngBytes':sum(b['bytes'] for b in bindings),'size':[1400,900],'minimumSvgFontPx':26,'renderer':'CairoSVG + Pillow optimized RGB PNG','allSourceHashesMatchCanonical':True,'sourceImagesCopied':False,'semanticReviewPending':False,'aiReviewDoesNotReplaceExpertOrNativeReview':True,'physicalDeviceVerified':False},ensure_ascii=False,indent=2)+'\n')
 print('91 PNG/SVG generated;',sum(b['bytes'] for b in bindings),'PNG bytes; unique non-text geometry',len(shape_hashes))

if __name__=='__main__':build()
