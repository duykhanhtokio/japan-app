"""Original controlled SVG teaching charts; universal symbols, not source-page images."""
from pathlib import Path
from xml.sax.saxutils import escape
import json,math
import cairosvg

ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/manufacturing/diagrams';OUT.mkdir(parents=True,exist_ok=True)
INK='#26364c';BLUE='#426b91';GREEN='#287b72';RED='#b45828'
class SVG:
 def __init__(self,title,width=1200,height=1050):
  self.w,self.h=width,height;self.items=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><rect width="100%" height="100%" rx="20" fill="#fff8e8"/><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="{INK}"/></marker></defs><g font-family="Noto Serif CJK JP,serif" fill="{INK}">'];self.text(34,52,title,31,True)
 def text(self,x,y,t,size=22,bold=False,anchor=None):self.items.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}"'+(f' text-anchor="{anchor}"' if anchor else '')+'>'+escape(t)+'</text>')
 def line(self,x1,y1,x2,y2,color=INK,width=4,arrow=False,dash=None):self.items.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"'+(' marker-end="url(#arrow)"' if arrow else '')+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
 def path(self,d,color=INK,width=4,fill='none',arrow=False):self.items.append(f'<path d="{d}" stroke="{color}" stroke-width="{width}" fill="{fill}"'+(' marker-end="url(#arrow)"' if arrow else '')+'/>')
 def rect(self,x,y,w,h,fill='#e8eef1',stroke=None,radius=10):self.items.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="2"' if stroke else '')+'/>')
 def circle(self,x,y,r,fill='none',stroke=INK,width=4):self.items.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')
 def save(self,name):
  text=''.join(self.items)+'</g></svg>';(OUT/(name+'.svg')).write_text(text);cairosvg.svg2png(bytestring=text.encode(),write_to=str(OUT/(name+'.png')))

def geom(s,kind,x,y):
 if kind=='line':s.line(x-27,y,x+27,y)
 elif kind=='flat':s.path(f'M{x-25} {y+15}L{x-12} {y-15}H{x+25}L{x+12} {y+15}Z')
 elif kind=='circle':s.circle(x,y,21)
 elif kind=='cylinder':s.circle(x,y,17);s.line(x-30,y+28,x-8,y-28);s.line(x+8,y+28,x+30,y-28)
 elif kind in ['lineProfile','surfaceProfile']:
  s.path(f'M{x-25} {y+14}A25 25 0 0 1 {x+25} {y+14}'+('Z' if kind=='surfaceProfile' else ''))
 elif kind=='parallel':s.line(x-25,y+22,x-3,y-22);s.line(x+3,y+22,x+25,y-22)
 elif kind=='perpendicular':s.line(x-27,y+17,x+27,y+17);s.line(x,y-24,x,y+17)
 elif kind=='angle':s.path(f'M{x+26} {y+20}H{x-26}L{x+11} {y-20}')
 elif kind=='position':s.circle(x,y,18);s.line(x-30,y,x+30,y);s.line(x,y-30,x,y+30)
 elif kind=='concentric':s.circle(x,y,23);s.circle(x,y,13)
 elif kind=='symmetry':s.line(x-18,y-12,x+18,y-12);s.line(x-29,y,x+29,y);s.line(x-18,y+12,x+18,y+12)
 elif kind=='runout':s.line(x-25,y+22,x+22,y-23,arrow=True)
 elif kind=='totalRunout':s.line(x-32,y+24,x+4,y-19,arrow=True);s.line(x-32,y+24,x-3,y+24);s.line(x-3,y+24,x+33,y-19,arrow=True)

def mechanical():
 s=SVG('資料の幾何公差：15の名称と記号');s.text(34,89,'同心度と同軸度は、この資料では同じ記号。対象・データムと一緒に読む。',21)
 rows=[('真直度','line'),('平面度','flat'),('真円度','circle'),('円筒度','cylinder'),('線の輪郭度','lineProfile'),('面の輪郭度','surfaceProfile'),('平行度','parallel'),('直角度','perpendicular'),('傾斜度','angle'),('位置度','position'),('同心度','concentric'),('同軸度','concentric'),('対称度','symmetry'),('円周振れ','runout'),('全振れ','totalRunout')]
 for i,(name,kind) in enumerate(rows):
  col,row=divmod(i,5);x=28+col*390;y=115+row*162;s.rect(x,y,374,146,['#e3ece5','#e7edf4','#f1e4cb'][col]);s.text(x+16,y+37,name,24,True);geom(s,kind,x+270,y+86)
 s.text(34,982,'記号の形を読むための独自配置。公差値・寸法・検査合否を指定する図ではありません。',20);s.save('batch12-mechanical-geometric-symbols')
 s=SVG('寸法補助記号：形と意味を対応させる');s.text(34,90,'図形記号はベクトルで独自作図。数値の前後と対象形状を必ず照合する。',21)
 rows=[('φ','円・大きい円弧の直径'),('Sφ','球の直径'),('□','正方形の辺'),('R','半径'),('CR','コントロール半径'),('SR','球の半径'),('arc','円弧の長さ'),('C','45°の面取り'),('cone','円すい状の面取り'),('t','厚さ'),('counterbore','ざぐり・深ざぐり'),('countersink','皿ざぐり'),('depth','穴深さ')]
 for i,(symbol,name) in enumerate(rows):
  col,row=divmod(i,5);x=28+col*390;y=115+row*162;s.rect(x,y,374,146,['#e3ece5','#e7edf4','#f1e4cb'][col]);s.text(x+16,y+34,name,22,True);cx=x+190;cy=y+91
  if symbol=='arc':s.path(f'M{cx-27} {cy+10}A27 27 0 0 1 {cx+27} {cy+10}')
  elif symbol=='cone':s.path(f'M{cx-25} {cy+12}L{cx} {cy-14}L{cx+25} {cy+12}')
  elif symbol=='counterbore':s.path(f'M{cx-25} {cy-18}V{cy+18}H{cx+25}V{cy-18}')
  elif symbol=='countersink':s.path(f'M{cx-25} {cy-15}L{cx} {cy+13}L{cx+25} {cy-15}')
  elif symbol=='depth':s.line(cx-27,cy-22,cx+27,cy-22);s.line(cx,cy-22,cx,cy+23);s.path(f'M{cx-15} {cy+7}L{cx} {cy+24}L{cx+15} {cy+7}')
  else:s.text(cx,cy+16,symbol,44,True,'middle')
 s.rect(808,601,374,146,'#f1e4cb');s.text(824,635,'Sφ8 と SR8',23,True);s.text(824,676,'Sφ8：球の直径8',21);s.text(824,710,'SR8：球の半径8 → 直径16',21)
 s.rect(808,763,374,146,'#f1e4cb');s.text(824,797,'C2 と R2',23,True);s.text(824,838,'C2：45°面取りの寸法2',21);s.text(824,872,'R2：半径2の丸み',21)
 s.text(34,982,'学習用記号表。深さ・球・半径・面取りを、見た目だけで同じ意味にしない。',20);s.save('batch12-mechanical-dimension-symbols')

def diode(s,x,y,light=None):
 s.line(x,y-43,x,y-24);s.path(f'M{x-22} {y-24}H{x+22}L{x} {y+18}Z');s.line(x-25,y+18,x+25,y+18);s.line(x,y+18,x,y+42);s.text(x-43,y-26,'A',17);s.text(x-43,y+34,'K',17)
 if light=='out':s.line(x+27,y-8,x+52,y-34,arrow=True,width=2);s.line(x+39,y+4,x+64,y-22,arrow=True,width=2)
 elif light=='in':s.line(x+58,y-37,x+32,y-11,arrow=True,width=2);s.line(x+70,y-25,x+44,y+1,arrow=True,width=2)
def contact(s,x,y,closed=False,actuator=None):
 s.line(x-45,y,x-16,y);s.line(x+16,y,x+48,y);s.line(x-16,y if closed else y+26,x+16,y)
 if closed:s.line(x-16,y-15,x-16,y+1,width=3)
 if actuator in ['push','alarm','emergency']:
  s.line(x,y+11,x,y+42,width=2,dash='4 4');s.path(f'M{x-15} {y+42}V{y+53}H{x+15}V{y+42}',width=3)
 if actuator=='alarm':s.circle(x-33,y+43,12,width=2);s.line(x-40,y+43,x-25,y+43,width=2,arrow=True)
 if actuator=='emergency':s.line(x+22,y+43,x+46,y+43,width=2);s.path(f'M{x+46} {y+25}Q{x+24} {y+43} {x+46} {y+61}',width=3)
 if actuator=='limit':s.path(f'M{x-3} {y+8}L{x+14} {y+24}L{x+10} {y+2}Z',width=2)
 if actuator=='proximity':s.path(f'M{x-10} {y+40}L{x} {y+27}L{x+10} {y+40}L{x} {y+53}Z',width=2);s.line(x,y+14,x,y+27,width=2,dash='3 3')
 if actuator=='breaker':s.line(x-24,y-10,x-8,y+10,width=3);s.line(x-24,y+10,x-8,y-10,width=3)
 if actuator=='mc':s.path(f'M{x-16} {y}Q{x-30} {y-14} {x-16} {y-18}',width=3)
def electrical():
 s=SVG('電気用図記号：名称・端子・動作を読む',1200,1510);s.text(34,90,'記号と名称を対応させる。PNPの矢印はエミッタE側で内向き。',20)
 rows=[('抵抗器',None,'resistor'),('可変抵抗器',None,'variable'),('コンデンサ',None,'capacitor'),('インダクタンス','リアクトル','coil'),('ダイオード','A：アノード／K：カソード','diode'),('発光ダイオード','LED','led'),('pnpトランジスタ','E：エミッタの矢印','pnp'),('フォトダイオード','受光する向き','photo'),('メーク接点','a接点','a'),('ブレーク接点','b接点','b'),('押しボタンスイッチ','自動復帰','push'),('警報スイッチ','自動復帰','alarm'),('非常停止スイッチ','自動復帰しない','emergency'),('近接スイッチ',None,'proximity'),('リミットスイッチ','確実な開放のb接点','positive'),('リミットスイッチ','b接点','limitb'),('リミットスイッチ','a接点','limita'),('配線用遮断器',None,'breaker'),('電磁接触器','MC','mc'),('表示灯','ランプ','lamp'),('電流計',None,'ammeter'),('ヒューズ',None,'fuse')]
 for i,(name,note,kind) in enumerate(rows):
  row,col=divmod(i,3);x=25+col*392;y=115+row*162;s.rect(x,y,376,146,['#e3ece5','#e7edf4','#f1e4cb'][col]);s.text(x+12,y+25,str(i+1),16);cx=x+70;cy=y+80;s.text(x+137,y+57,name,20,True)
  if note:s.text(x+137,y+90,note,17)
  if kind in ['resistor','variable']:
   s.line(cx-45,cy,cx-28,cy);s.rect(cx-28,cy-12,56,24,'none',INK,radius=0);s.line(cx+28,cy,cx+45,cy)
   if kind=='variable':s.line(cx-31,cy+30,cx+32,cy-31,arrow=True,width=3)
  elif kind=='capacitor':s.line(cx,cy-44,cx,cy-11);s.line(cx-27,cy-11,cx+27,cy-11);s.line(cx-27,cy+11,cx+27,cy+11);s.line(cx,cy+11,cx,cy+44)
  elif kind=='coil':s.path(f'M{cx-50} {cy}'+''.join(f'a12.5 15 0 0 1 25 0' for _ in range(4)))
  elif kind in ['diode','led','photo']:diode(s,cx-5,cy,{'led':'out','photo':'in'}.get(kind))
  elif kind=='pnp':
   s.line(cx-48,cy,cx-10,cy);s.line(cx-10,cy-29,cx-10,cy+29);s.line(cx-10,cy-15,cx+28,cy-42);s.line(cx+28,cy+42,cx-10,cy+15,arrow=True,width=3);s.text(cx-50,cy-9,'B',15);s.text(cx+30,cy-30,'C',15);s.text(cx+30,cy+45,'E',15)
  elif kind in ['a','b','push','alarm','emergency','proximity','positive','limitb','limita','breaker','mc']:
   closed=kind in ['b','emergency','positive','limitb'];act={'push':'push','alarm':'alarm','emergency':'emergency','proximity':'proximity','positive':'limit','limitb':'limit','limita':'limit','breaker':'breaker','mc':'mc'}.get(kind);contact(s,cx,cy-4,closed,act)
   if kind=='positive':s.circle(cx+35,cy+34,10,width=2);s.line(cx+29,cy+34,cx+42,cy+34,width=2,arrow=True)
  elif kind=='lamp':s.circle(cx,cy,28);s.line(cx-19,cy-19,cx+19,cy+19);s.line(cx-19,cy+19,cx+19,cy-19)
  elif kind=='ammeter':s.circle(cx,cy,28);s.text(cx,cy+10,'A',28,False,'middle')
  elif kind=='fuse':s.rect(cx-10,cy-33,20,66,'none',INK,radius=0);s.line(cx,cy-48,cx,cy+48,width=3)
 s.text(34,1466,'機器の実端子配列・実配線を示す図ではありません。適用図面と機器仕様で確認します。',18);s.save('batch12-electrical-symbol-bank')

def timecharts():
 s=SVG('オンディレーとオフディレー：3秒の紙上例',1200,750)
 for offset,label,on,off,delay_start,delay_end in [(0,'オンディレー',4,6,1,4),(310,'オフディレー',1,9,6,9)]:
  s.rect(26,85+offset,1148,292,'#e7edf4');s.text(45,121+offset,label,27,True);s.rect(180+delay_start*88,132+offset,(delay_end-delay_start)*88,180,'#e3ece5');s.text(180+delay_start*88+8,151+offset,'3秒',18)
  for name,y,start,end in [('入力',210+offset,1,6),('出力',300+offset,on,off)]:
   s.text(54,y-9,name,24,True);s.line(180,y,1060,y,'#a1acb4',1);s.path(f'M180 {y}H{180+start*88}V{y-46}H{180+end*88}V{y}H1060',GREEN,5)
  for sec in range(11):x=180+sec*88;s.line(x,315+offset,x,324+offset,INK,1);s.text(x,346+offset,str(sec),18,False,'middle')
  s.text(1090,346+offset,'秒',19)
 s.text(34,726,'学習用の動作例。実機の設定・端子・配線の指示ではありません。',20);s.save('batch12-electrical-time-delays')
def junction():
 s=SVG('pn接合：空乏層と内部電界の概念図',1200,800);s.text(34,95,'外部電圧を加えていない接合の模式表示。寸法・個数は実際の値を表さない。',21)
 s.rect(45,180,555,340,'#f1dfda');s.rect(600,180,555,340,'#dce8f0');s.rect(490,180,220,340,'#f3ead1');s.text(170,155,'p形領域',27,True);s.text(850,155,'n形領域',27,True);s.text(600,155,'空乏層',26,True,'middle');s.line(600,180,600,520,'#8d826b',2,dash='8 5')
 for x,y in [(150,260),(300,330),(420,430),(190,440),(380,235)]:s.circle(x,y,20,'#fff8e8',RED,3);s.text(x,y+8,'＋',22,False,'middle')
 for x,y in [(790,250),(950,330),(1090,440),(840,430),(1060,235)]:s.circle(x,y,20,'#d0e2f2',BLUE,3);s.text(x,y+7,'−',24,False,'middle')
 for y in [250,350,450]:s.circle(550,y,22,'#fff8e8',RED,2);s.text(550,y+8,'−',25,True,'middle');s.circle(650,y,22,'#fff8e8',BLUE,2);s.text(650,y+8,'＋',23,True,'middle')
 s.text(100,565,'多数キャリア：正孔',24);s.text(790,565,'多数キャリア：電子',24);s.line(710,625,490,625,RED,5,True);s.text(600,603,'内部電界：n側 → p側',24,True,'middle');s.text(600,683,'中央の−／＋は固定されたイオンの模式表示',22,False,'middle');s.text(34,727,'空乏層では自由な電子・正孔が少なくなる。実部品の端子配置は示していない。',20);s.text(34,774,'外側の＋／−は移動キャリア。背景の固定イオンは省略し、領域全体の帯電を示さない。',19);s.save('batch12-electrical-pn-junction')

def surface():
 s=SVG('右手で対応させる：電流と磁界',1200,750)
 for x in [30,620]:s.rect(x,100,550,520,'#e7edf4')
 s.text(55,145,'直線導体：電流が手前へ',26,True);s.text(645,145,'コイル：端面から見る例',26,True)
 for cx,which in [(305,'wire'),(895,'coil')]:
  cy=355;pts=[(cx+130*math.cos(math.radians(t)),cy-130*math.sin(math.radians(t))) for t in range(0,341,5)];s.path('M'+'L'.join(f'{x:.2f} {y:.2f}' for x,y in pts),BLUE,5,arrow=True);s.circle(cx,cy,33,'#fff8e8',INK,3);s.circle(cx,cy,8,INK,INK,1)
  s.text(cx,535,'磁界は反時計回り' if which=='wire' else '電流は反時計回り',24,True,'middle');s.text(cx,577,'●：電流が紙面から出る' if which=='wire' else '●：内部磁界が手前へ',22,False,'middle')
 s.text(45,670,'直線導体：親指＝電流、4本の指＝磁界。コイル：4本の指＝電流、親指＝内部磁界。',21);s.text(45,715,'必ず観察方向と、電流／磁界のどちらを矢印が表すかを区別する。',21);s.save('batch12-surface-right-grip')
 s=SVG('めっき皮膜の外観：断面を比べる模式例',1200,750)
 for i,(title,note) in enumerate([('ピンホール','皮膜を貫く穴'),('ピット','この例では皮膜途中までのくぼみ'),('ふくれ','皮膜が局部的に浮いた例')]):
  x=25+i*395;s.rect(x,115,375,475,'#e7edf4');s.text(x+185,165,title,27,True,'middle');s.rect(x+30,350,315,125,'#c5ae86');s.rect(x+30,275,315,75,'#6ca9bb');s.text(x+185,530,note,19,False,'middle')
  if i==0:s.path(f'M{x+175} 275H{x+195}V350H{x+175}Z',fill='#fff8e8',color='#fff8e8',width=1)
  elif i==1:s.path(f'M{x+156} 275L{x+185} 320L{x+214} 275Z',fill='#fff8e8',color='#fff8e8',width=1)
  else:
   s.path(f'M{x+105} 350Q{x+185} 175 {x+265} 350Z',fill='#fff8e8',color='#fff8e8',width=1);s.path(f'M{x+105} 275Q{x+185} 100 {x+265} 275V350Q{x+185} 175 {x+105} 350Z',color='#6ca9bb',width=1,fill='#6ca9bb')
 s.text(45,640,'青：皮膜　／　茶：素地　／　明るい部分：穴・すき間を表す模式表示',23);s.text(45,692,'寸法・深さは実寸ではない。実際の分類と合否は適用規格・限度見本で確認する。',21);s.save('batch12-surface-coating-defects')

if __name__=='__main__':
 mechanical();electrical();timecharts();junction();surface();print('Generated7originalcontrolledSVG/PNGdiagrams')
