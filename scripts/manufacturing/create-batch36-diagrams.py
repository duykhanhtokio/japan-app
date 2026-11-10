"""Create five independent conceptual teaching visuals, not copies of source figures.

Source comparison/provenance lives in docs/ssw-workspace/manufacturing/batch36-visuals.
Exact labels, colors and geometry are authored here. No measurements, settings,
terminal layouts or operational prescriptions are inferred from these drawings.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import subprocess

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/manufacturing/diagrams'
W,H=1400,1000
INK,BLUE,GREEN,ORANGE='#26364c','#426b91','#287b72','#b45828'
FONT='Noto Sans JP,Noto Sans CJK JP,sans-serif'

class Drawing:
    def __init__(self,title,subtitle):
        self.parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">', '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8Z" fill="context-stroke"/></marker></defs>',f'<rect width="{W}" height="{H}" fill="#fff8e8"/><g font-family="{FONT}" fill="{INK}">']
        self.text(50,70,title,39,True);self.text(50,120,subtitle,24)
    def text(self,x,y,s,size=28,bold=False,color=INK,center=False):
        self.parts.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}"'+(' text-anchor="middle"' if center else '')+'>'+escape(s)+'</text>')
    def box(self,x,y,w,h,fill='#edf1f1',stroke=INK,r=12):self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>')
    def line(self,x1,y1,x2,y2,color=INK,width=4,arrow=False,both=False,dash=None):self.parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"'+(' marker-end="url(#arrow)"' if arrow or both else '')+(' marker-start="url(#arrow)"' if both else '')+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
    def circle(self,x,y,r,fill='none',stroke=INK,width=3):self.parts.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')
    def path(self,points,fill='none',stroke=INK,width=4):self.parts.append(f'<path d="{points}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')
    def foot(self,lines):
        self.line(50,830,1350,830,'#c9c5b6',2)
        for n,line in enumerate(lines):self.text(55,880+n*42,line,24)
    def save(self,name):
        svg=''.join(self.parts)+'</g></svg>';(OUT/(name+'.svg')).write_text(svg);subprocess.run(['inkscape',str(OUT/(name+'.svg')),'--export-type=png','--export-filename='+str(OUT/(name+'.png')),'--export-width='+str(W),'--export-height='+str(H)],check=True,capture_output=True)

def lcr():
    d=Drawing('L・C・R：測る量を区別する','独立した概念配置。実機の外観、端子、スイッチを再現していません。')
    d.box(70,230,500,480,'#e9f0f5',BLUE);d.text(320,295,'LCR メーター',36,True,BLUE,True);d.box(125,345,390,120,'#fff8e8',BLUE);d.text(320,420,'表示欄：数値例なし',27,False,INK,True);d.text(120,550,'対象の量と条件を照合する',27,True);d.text(120,610,'端子・配線は描かない',27)
    for n,(symbol,label) in enumerate([('L','インダクタンス'),('C','静電容量'),('R','抵抗')]):
        y=240+n*155;d.box(740,y,580,125,'#e6f0e8',GREEN);d.text(790,y+78,symbol,52,True,GREEN);d.text(900,y+75,label,32,True);d.line(590,y+63,720,y+63,BLUE,4,True)
    d.foot(['インピーダンスなども測る計器です。機種・部品・測定条件を確認します。','図の表示欄は測定値、単位、精度、合否や接続手順を指定しません。']);d.save('batch36-lcr')

def thermocouple():
    d=Drawing('熱電対：異なる金属と二つの温度','温度差に関係する熱起電力を利用する、原理の概念図です。')
    d.box(70,220,290,420,'#e6f0e8',GREEN);d.text(215,285,'計測側',34,True,GREEN,True);d.text(215,350,'温度 T1',33,True,INK,True)
    d.box(1000,220,330,420,'#e9f0f5',BLUE);d.text(1165,285,'計器側',34,True,BLUE,True);d.text(1165,350,'温度 T2',33,True,INK,True)
    d.path('M260 440 L450 390 L1000 390',stroke=ORANGE,width=7);d.path('M260 440 L450 550 L1000 550',stroke=BLUE,width=7);d.circle(260,440,10,INK);d.circle(1000,390,10,'#fff8e8',ORANGE);d.circle(1000,550,10,'#fff8e8',BLUE)
    d.text(630,355,'金属 A',33,True,ORANGE,True);d.text(630,605,'金属 B',33,True,BLUE,True)
    d.line(1120,400,1120,540,GREEN,5,both=True);d.text(1165,490,'熱起電力',25,True,GREEN)
    d.text(700,735,'接点の温度だけでなく、計器側の基準の扱いも関係する',29,True,INK,True)
    d.foot(['A・Bは異なる金属を表す記号です。熱起電力の正負は指定していません。','基準接点補償の回路、極性、実配線、使用温度範囲や操作手順は示しません。']);d.save('batch36-thermocouple')

def hall():
    d=Drawing('ホール効果：三つの方向を区別する','平面内の電流と電圧の方向、紙面に垂直な磁界の関係を示します。')
    d.box(280,280,840,360,'#e9f0f5',BLUE,0)
    # B out of page is a direction convention only; no voltage polarity sign.
    for x in [450,700,950]:
        for y in [360,560]:d.circle(x,y,23,'#fff8e8',GREEN);d.circle(x,y,4,GREEN,GREEN,2)
    d.line(100,460,1300,460,ORANGE,7,True);d.text(1180,415,'電流 I',32,True,ORANGE)
    d.line(700,220,700,700,BLUE,7,both=True);d.text(750,215,'ホール電圧の方向',29,True,BLUE);d.text(750,260,'（正負を指定しない）',24,False,BLUE)
    d.circle(165,735,22,'#fff8e8',GREEN);d.circle(165,735,4,GREEN,GREEN,2);d.text(205,746,'磁界 B：紙面から手前へ',28,True,GREEN)
    d.text(760,735,'I ⟂ B    ／    電圧の方向 ⟂ I・B',28,True,INK,True)
    d.foot(['丸と点は紙面から手前への方向を表します。三方向の直交関係だけの図です。','電圧の正負、電子・正孔の別、実際のセンサー端子や配線を決める図ではありません。']);d.save('batch36-hall')

def caliper():
    d=Drawing('ノギス：本尺・スライダと測定部','部位の位置と役割を対応させる独立模式図。読取りや操作の図ではありません。')
    # Beam and opposed fixed/moving jaws; no numeric graduations.
    d.box(220,390,960,80,'#e9f0f5',BLUE,0)
    d.path('M220 390 L220 300 L245 300 L270 390Z',fill='#dfe9ea',stroke=BLUE)
    d.path('M220 470 L220 675 L260 675 L285 470Z',fill='#dfe9ea',stroke=BLUE)
    d.box(520,365,150,130,'#e4eadc',GREEN,0)
    d.path('M560 365 L585 300 L610 300 L610 365Z',fill='#e4eadc',stroke=GREEN)
    d.path('M590 495 L590 675 L550 675 L525 495Z',fill='#e4eadc',stroke=GREEN)
    d.box(555,440,95,30,'#fff8e8',GREEN,0)
    for x in range(290,1160,30):d.line(x,400,x,420,BLUE,2)
    for x in range(565,650,10):d.line(x,447,x,465,GREEN,2)
    d.box(630,330,32,35,'#e4eadc',GREEN,3);d.line(646,330,646,316,GREEN,5)
    d.line(1180,430,1320,430,BLUE,9)
    # Label leaders avoid instrument and each other.
    labels=[(55,245,'内側の測定部',BLUE,(350,250,250,310)),(50,735,'固定ジョウ',BLUE,(250,710,245,650)),(480,745,'測定ジョウ',GREEN,(585,710,570,650)),(850,285,'本尺',BLUE,(930,305,930,390)),(700,570,'スライダ',GREEN,(730,532,655,495)),(830,665,'副尺',GREEN,(830,635,635,457)),(460,210,'止めねじ',GREEN,(585,230,646,330)),(1070,550,'デプスバー',BLUE,(1240,520,1260,430))]
    for x,y,label,col,coords in labels:d.text(x,y,label,30,True,col);d.line(*coords,col,3)
    d.text(70,795,'外側の測定部：下側のジョウの向かい合う面',28,True)
    d.foot(['青は本尺側、緑はスライダ側の部位を示します。目盛りに数値は付けません。','デプスバー付きの器具を例にした部位図で、仕様・精度・合否や操作を指定しません。']);d.save('batch36-caliper-parts')

def indentation():
    d=Drawing('ビッカース圧痕：四角形と二本の対角線','上から見た形の読み方。細長いヌープ圧痕とは区別します。')
    d.box(80,200,790,570,'#e9f0f5',BLUE)
    # Rotated square: all sides equal and crossing diagonals equal; no scale.
    d.path('M475 265 L685 475 L475 685 L265 475 Z',fill='#f5f1dd',stroke=INK,width=6)
    d.line(475,265,475,685,GREEN,5);d.line(265,475,685,475,ORANGE,5)
    d.circle(475,475,7,INK)
    d.text(500,360,'対角線 1',30,True,GREEN);d.text(530,530,'対角線 2',30,True,ORANGE)
    d.text(920,315,'向かい合う',32,True);d.text(920,365,'頂点を結ぶ',32,True);d.line(940,410,695,475,INK,3,True)
    d.text(920,555,'正方形を回して',29);d.text(920,600,'示した模式形',29);d.text(920,675,'数値目盛りなし',28,True)
    d.foot(['二本の線は圧痕の二つの対角線を表します。図の長さは実寸ではありません。','硬さの計算値、試験荷重、皮膜厚さ、測定条件や合否基準を指定しません。']);d.save('batch36-indentation')

if __name__=='__main__':
    OUT.mkdir(exist_ok=True,parents=True)
    for draw in [lcr,thermocouple,hall,caliper,indentation]:draw()
    print('Created five independent1400x1000 SVG/PNG diagrams.')
