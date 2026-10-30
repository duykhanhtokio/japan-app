"""Independent bounded surface-learning boards; no source raster reused.

Retains the already-translated lesson summaries as captions. These are paper
models of identification/reading, never instructions for actual chemical work.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import json,math,subprocess
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/manufacturing/diagrams'
W,H=1600,1500
INK,BLUE,GREEN,ORANGE='#26364c','#426b91','#287b72','#b45828'
class D:
 def __init__(self,title,sub):
  self.p=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="context-stroke"/></marker></defs><rect width="{W}" height="{H}" fill="#fff8e8"/><g font-family="Noto Sans JP,Noto Sans CJK JP,sans-serif" fill="{INK}">'];self.text(45,65,title,38,True);self.text(45,112,sub,23)
 def text(self,x,y,t,size=23,bold=False,color=INK):self.p.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">'+escape(t)+'</text>')
 def line(self,x1,y1,x2,y2,c=INK,w=3,arrow=False,dash=None):self.p.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{w}"'+(' marker-end="url(#arr)"' if arrow else '')+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
 def rect(self,x,y,w,h,fill='#edf1f1',stroke='#c9c5b6',r=10):self.p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
 def circle(self,x,y,r,fill=GREEN,stroke=GREEN):self.p.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
 def path(self,t,fill='none',stroke=INK,w=3):self.p.append(f'<path d="{t}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>')
 def panel(self,x,y,title):self.rect(x,y,490,550,'#f7f3e8');self.text(x+18,y+45,title,27,True)
 def footer(self,a,b):self.line(45,1380,1555,1380,'#c9c5b6',2);self.text(45,1425,a,23);self.text(45,1465,b,23)
 def save(self,name):
  f=OUT/(name+'.svg');f.write_text(''.join(self.p)+'</g></svg>');subprocess.run(['inkscape',str(f),'--export-type=png','--export-filename='+str(f.with_suffix('.png')),'--export-width='+str(W),'--export-height='+str(H)],check=True,capture_output=True)

def qc():
 d=D('QC：記録・軸・時間順を別々に読む','全て独立した架空データ。実製品の管理値・合格基準や現場標準ではありません。')
 # Work sheet
 x,y=40,160;d.panel(x,y,'① 管理記録の四つの問い')
 for n,(a,b) in enumerate([('何を','異物の付着'),('どう','指定照明・限度見本'),('いつ','ロット開始時・変更後'),('異常なら','区分して責任者へ連絡')]):
  yy=y+90+n*87;d.rect(x+18,yy,452,73,'#e9f0f5',r=0);d.text(x+30,yy+30,a,22,True,BLUE);d.text(x+120,yy+43,b,21)
 d.text(x+20,y+485,'分類と数え方を先にそろえる',23,True)
 # Pareto counts = canonical24 and cumulative ratios
 x,y=555,160;d.panel(x,y,'② パレート図：件数と比率')
 left,bottom=x+64,y+370;d.line(left,y+100,left,bottom);d.line(left,bottom,x+435,bottom);d.line(x+435,y+100,x+435,bottom)
 values=[12,6,4,2];labels=['異物','色むら','傷','他'];cum=[50,75,100*22/24,100]
 pts=[]
 for i,(v,label,c) in enumerate(zip(values,labels,cum)):
  xx=left+18+i*82;bh=v*18;d.rect(xx,bottom-bh,48,bh,'#a5c8c1',GREEN,0);d.text(xx+8,bottom-bh-10,str(v),21);d.text(xx-2,bottom+32,label,19);pts.append((xx+24,bottom-c*2.4))
 for a,b in zip(pts,pts[1:]):d.line(*a,*b,ORANGE,4)
 for i,(xx,yy) in enumerate(pts):d.circle(xx,yy,5,ORANGE,ORANGE);d.text(xx-15,yy-18,['50','75','91.7','100'][i],19,True,ORANGE)
 d.text(left-16,y+90,'件',20);d.text(x+405,y+90,'%',20);d.text(x+20,y+465,'合計24件／最初の二分類＝75%',22,True);d.text(x+20,y+507,'棒：件数　線：累積比率',23)
 # Histogram
 x,y=1070,160;d.panel(x,y,'③ ヒストグラム：分布')
 left,bottom=x+55,y+385;d.line(left,y+110,left,bottom);d.line(left,bottom,x+450,bottom)
 for i,n in enumerate([1,3,5,4,2]):d.rect(left+i*72,bottom-n*45,72,n*45,'#b7cde1',BLUE,0)
 d.text(x+20,y+95,'個数',21);d.text(x+95,y+430,'同じ幅の測定値の区間',21);d.text(x+20,y+490,'時間順そのものは残らない',23,True)
 # Control chart: preserve spec20-30,CL23-26,26.8
 x,y=40,770;d.panel(x,y,'④ 管理図：工程の時間変化')
 left,right=x+70,x+440;top,bot=y+100,y+380
 sy=lambda v:bot-(v-20)*28
 for value,label,c in [(30,'仕様30',BLUE),(26,'管理26',ORANGE),(23,'管理23',ORANGE),(20,'仕様20',BLUE)]:d.line(left,sy(value),right,sy(value),c,2,dash='7 5');d.text(x+5,sy(value)-8,label,17,False,c)
 data=[24,25,24.5,26.8,25];pts=[(left+30+i*76,sy(v)) for i,v in enumerate(data)]
 for a,b in zip(pts,pts[1:]):d.line(*a,*b,GREEN,3)
 for xx,yy in pts:d.circle(xx,yy,5)
 d.text(pts[3][0]-35,pts[3][1]-18,'26.8',21,True,ORANGE);d.text(x+230,y+420,'時間順 →',22);d.text(x+20,y+473,'26.8：仕様内・上側管理限界外',21,True);d.text(x+20,y+515,'製品判定と工程調査は別',22)
 # Scatter
 x,y=555,770;d.panel(x,y,'⑤ 散布図：二量の対応')
 left,bottom=x+65,y+395;d.line(left,y+115,left,bottom);d.line(left,bottom,x+440,bottom)
 for xx,yy in [(35,35),(75,110),(110,95),(140,180),(190,140),(225,225),(265,205),(320,245)]:d.circle(left+xx,bottom-yy,7,BLUE,BLUE)
 d.text(x+20,y+95,'量B',21);d.text(x+365,y+435,'量A',21);d.text(x+20,y+490,'関連が見えても原因は未確定',22,True)
 # Fishbone
 x,y=1070,770;d.panel(x,y,'⑥ 特性要因図：原因候補')
 d.line(x+35,y+300,x+440,y+300,INK,5,True)
 for xx,word in [(x+125,'人'),(x+300,'機械')]:d.line(xx,y+300,xx-55,y+180,BLUE);d.text(xx-65,y+155,word,25,True)
 for xx,word in [(x+180,'材料'),(x+355,'方法')]:d.line(xx,y+300,xx-55,y+420,GREEN);d.text(xx-70,y+457,word,25,True)
 d.text(x+360,y+275,'結果',23,True);d.text(x+20,y+515,'候補は記録や調査で検証する',22,True)
 d.footer('図の数字・頻度・管理線は紙上学習専用です。現場の設定を変える指示ではありません。','分母、期間、測定量、時間順を確認し、管理限界と仕様限界、関連と原因を分けます。');d.save('batch37-surface-qc')

def instruments():
 d=D('測定：視線・液面・目盛り・基準を分ける','独立した紙上モデル。器具や液ごとの指定読取り方法が優先されます。')
 # thermometer
 x,y=40,160;d.panel(x,y,'① 液柱温度計と視線')
 d.rect(x+215,y+110,30,300,'#fff8e8',BLUE,12);d.circle(x+230,y+420,26,'#e6b2a7',ORANGE);d.rect(x+225,y+220,10,200,'#c98170',ORANGE,0)
 for yy,num in [(y+140,'40'),(y+220,'30'),(y+300,'20')]:d.line(x+247,yy,x+270,yy);d.text(x+278,yy+8,num,22)
 d.line(x+235,y+220,x+430,y+220,GREEN,3,dash='8 6');d.circle(x+430,y+220,13,'#fff8e8',GREEN);d.text(x+320,y+185,'同じ高さ',22,True,GREEN);d.text(x+20,y+490,'液柱の先端を指定方向から読む',21)
 # hydrometer upper meniscus
 x,y=555,160;d.panel(x,y,'② 比重計：上縁視定の例')
 d.rect(x+70,y+115,340,320,'#fff8e8',BLUE,0);d.rect(x+220,y+110,45,300,'#e9f0f5',BLUE,0)
 for yy,num in [(y+170,'1.10'),(y+240,'1.12'),(y+310,'1.14')]:d.line(x+222,yy,x+265,yy);d.text(x+275,yy+8,num,23)
 d.path(f'M{x+72} {y+270} L{x+190} {y+270} Q{x+220} {y+270} {x+220} {y+240} M{x+265} {y+240} Q{x+265} {y+270} {x+300} {y+270} L{x+408} {y+270}',stroke=GREEN,w=5)
 d.line(x+115,y+205,x+215,y+238,ORANGE,4,True);d.text(x+90,y+175,'上縁',24,True,ORANGE);d.text(x+20,y+470,'この図の指定読値：1.12',23,True);d.text(x+20,y+510,'架空換算モデルでは200g/L',22)
 # burette:values increase down
 x,y=1070,160;d.panel(x,y,'③ ビューレット：下縁の例')
 d.rect(x+185,y+105,80,300,'#fff8e8',BLUE,0)
 for i in range(11):
  yy=y+150+i*20;d.line(x+267,yy,x+285+(8 if i%5==0 else 0),yy)
  if i%5==0:d.text(x+300,yy+8,str(2+i/5)+'mL',22)
 # ticks2.0 y150,3.0 y250,4.0 y350;bottom3.2=y270
 d.path(f'M{x+187} {y+250} Q{x+225} {y+290} {x+263} {y+250}',stroke=GREEN,w=5)
 d.line(x+85,y+300,x+220,y+272,ORANGE,4,True);d.text(x+30,y+345,'液面の底',24,True,ORANGE);d.text(x+20,y+470,'この図の指定読値：3.2mL',23,True);d.text(x+20,y+510,'目盛りの増える向きも確認',22)
 # pipette
 x,y=40,770;d.panel(x,y,'④ ホールピペット：標線')
 d.path(f'M{x+210} {y+105} L{x+210} {y+245} Q{x+150} {y+285} {x+210} {y+345} L{x+210} {y+430} L{x+230} {y+430} L{x+230} {y+345} Q{x+290} {y+285} {x+230} {y+245} L{x+230} {y+105}Z',fill='#e9f0f5',stroke=BLUE)
 d.line(x+185,y+185,x+255,y+185,INK,4);d.path(f'M{x+211} {y+175} Q{x+220} {y+195} {x+229} {y+175}',stroke=GREEN,w=4)
 d.text(x+275,y+190,'標線',25,True);d.line(x+330,y+220,x+230,y+185,ORANGE,3,True);d.text(x+285,y+260,'下縁',24,True,ORANGE);d.text(x+20,y+490,'この模式例は下縁を標線へ対応',21)
 # analog meter 0-10 scale, pointer6
 x,y=555,770;d.panel(x,y,'⑤ アナログ目盛りの読取り')
 cx,cy,r=x+245,y+360,160
 for i in range(11):
  a=math.pi-i*math.pi/10;xx,yy=cx+r*math.cos(a),cy-r*math.sin(a);xi,yi=cx+(r-18)*math.cos(a),cy-(r-18)*math.sin(a);d.line(xi,yi,xx,yy,BLUE,3)
  if i%2==0:d.text(cx+(r+25)*math.cos(a)-10,cy-(r+25)*math.sin(a)+8,str(i),22)
 a=math.pi-6*math.pi/10;d.line(cx,cy,cx+140*math.cos(a),cy-140*math.sin(a),ORANGE,6,True);d.circle(cx,cy,9,INK,INK)
 d.text(x+20,y+420,'紙上目盛り0～10：針の位置は6',22,True);d.text(x+20,y+470,'実測値にはレンジと単位も必要',21);d.text(x+20,y+510,'機種の精度・接続を示す図ではない',20)
 # sensor and hardware recognition separate
 x,y=1070,770;d.panel(x,y,'⑥ 測る方式と調整装置')
 for n,(a,b) in enumerate([('熱電対','異種金属・熱起電力'),('白金抵抗体','温度による抵抗変化'),('冷却蛇管','液を冷やす装置の例'),('槽外熱交換器','槽外で温度調整の例'),('投入式ヒーター','液を温める装置の例')]):d.text(x+20,y+105+n*80,a,23,True,BLUE);d.text(x+20,y+138+n*80,b,21)
 d.footer('上縁・下縁を全器具へ一般化しません。液の種類、温度、校正法、指定読取り方法を確認します。','架空の目盛りや比重換算を実液・実機へ流用せず、通電、採液、加熱の手順は別に確認します。');d.save('batch37-surface-instruments')

def corrosion():
 d=D('腐食と皮膜：通る場所と層の役割を読む','独立した概念配置。寸法、腐食速度、全反応機構や装置配線を示しません。')
 # panel1 galvanic, electronics in metal wire and ionic inliquid no carrier sign law
 d.rect(40,160,1520,345,'#f7f3e8');d.text(65,205,'① 金属側の電子と、液側のイオンを分ける',30,True)
 d.rect(400,325,760,140,'#e9f0f5',BLUE,0);d.rect(500,280,70,160,'#d1d9dc',INK,0);d.rect(920,280,70,160,'#b6c8be',INK,0)
 d.text(465,260,'Al',28,True);d.text(920,260,'Ni',28,True);d.path('M535 280 L535 235 L955 235 L955 280',stroke=INK,w=4);d.line(650,235,830,235,ORANGE,5,True);d.text(650,220,'金属側：電子',22,True,ORANGE)
 d.line(590,390,850,390,GREEN,4,dash='7 5');d.text(620,435,'液側：イオンが電荷移動に関与',21,True,GREEN)
 d.text(70,310,'異種金属・導電経路',23);d.text(70,350,'電解質を含む環境',23);d.text(70,430,'条件で腐食は変わる',23,True);d.text(1190,315,'金属の並びだけで',21);d.text(1190,352,'全環境の速度を',21);d.text(1190,389,'決めない',23,True)
 #pinhole
 d.rect(40,530,1520,340,'#f7f3e8');d.text(65,575,'② ピンホール：基材へ届く経路を見分ける',30,True)
 d.rect(410,720,650,95,'#b7c8d2',INK,0);d.rect(410,655,285,65,'#73a4b0',BLUE,0);d.rect(745,655,315,65,'#73a4b0',BLUE,0)
 d.path('M720 600 Q690 638 705 650 Q720 665 735 650 Q750 638 720 600Z',fill='#c5e0e4',stroke=BLUE);d.line(720,660,720,748,ORANGE,4,True);d.text(1110,685,'皮膜',26,True,BLUE);d.text(1110,765,'基材',26,True);d.text(70,650,'水などが基材へ',24);d.text(70,690,'届く穴の例',24);d.text(70,795,'穴から腐食が広がる場合がある',21,True);d.text(1100,825,'実寸・合否は未指定',21)
 # porous/barrier exact distinction
 d.rect(40,895,1520,440,'#f7f3e8');d.text(65,940,'③ 代表的な多孔質陽極酸化皮膜の断面',30,True)
 d.rect(420,1200,650,90,'#b7c8d2',INK,0);d.rect(420,1165,650,35,'#487f8b',BLUE,0)
 for xx in [420,550,680,810,940]:
  d.rect(xx,1020,105,145,'#a4c4c8',BLUE,0);d.rect(xx+105,1020,25,145,'#fff8e8',stroke='#c9c5b6',r=0)
 d.text(1120,1070,'孔を含む領域',27,True,BLUE);d.line(1110,1090,1055,1090,BLUE,3,True);d.text(1120,1185,'緻密なバリア層',25,True,GREEN);d.line(1110,1180,1065,1180,GREEN,3,True);d.text(1120,1265,'アルミニウム基材',24,True)
 d.text(70,1045,'孔の形・太さ・',24);d.text(70,1085,'層の比は模式的',24);d.text(70,1150,'自然酸化膜と',24);d.text(70,1190,'処理皮膜は別',24);d.text(70,1270,'全ての皮膜が同形とは限らない',20,True)
 d.footer('図は概念の区別用です。実作業で電子配線や薬液の流れ、電極接続を指示するものではありません。','材料、保護皮膜、電解質、温度などの条件を確認し、反応しやすさの順だけで腐食を断定しません。');d.save('batch37-surface-corrosion')
if __name__=='__main__':
 OUT.mkdir(parents=True,exist_ok=True)
 for fun in [qc,instruments,corrosion]:fun()
 c=json.loads((ROOT/'src/data/manufacturing/completion37/surface.json').read_text());items=[]
 for name,n in [('qc',6),('instruments',3),('corrosion',8)]:
  l=c['lessons'][n-1];items.append({'id':'mfg1-completion37-surface-'+name,'lessonId':l['id'],'lessonSourceHash':l['sourceHash'],'assetFile':'batch37-surface-'+name+'.png','width':W,'height':H,'captionJa':l['summaryJa'],'scopeLimits':['independent_paper_model_only','no_operating_instruction','not_current_standard_or_acceptance_certification']})
 manifest_path=ROOT/'src/data/manufacturing/completion37/diagrams.json'
 current=json.loads(manifest_path.read_text()) if manifest_path.exists() else {'schemaVersion':1,'items':[]}
 assert current['schemaVersion']==1
 own_ids={item['id'] for item in items}
 # Preserve other lanes' independently owned boards when regenerating ours.
 current['items']=items+[item for item in current['items'] if item['id'] not in own_ids]
 manifest_path.write_text(json.dumps(current,ensure_ascii=False,indent=2)+'\n');print('3source-qualified original boards and guardedmanifest generated')
