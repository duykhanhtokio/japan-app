"""Exact conceptual role figures; no wiring, operating sequence or settings."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
P=Path(__file__).resolve().parents[2]
OUT=P/'assets/kensetsu/daily-technical-reviewed-20261107'
OUT.mkdir(parents=True,exist_ok=True)
INK='#173750'; BG='#fffaf0'; GOLD='#bd974c'; TEAL='#23847e'
FONT='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def start(title):
    im=Image.new('RGB',(1200,760),BG);d=ImageDraw.Draw(im)
    d.rounded_rectangle((14,14,1185,745),22,outline=GOLD,width=3)
    d.text((40,28),title,font=ImageFont.truetype(FONT,36),fill=INK)
    d.line((40,88,1160,88),fill=GOLD,width=2)
    d.text((40,696),'機能・役割の模式図／配線・寸法・操作条件は示しません',font=ImageFont.truetype(FONT,24),fill=INK)
    return im,d
def txt(d,xy,s,size=28):d.text(xy,s,font=ImageFont.truetype(FONT,size),fill=INK)
def box(d,xy,s):
    d.rounded_rectangle(xy,12,fill='#d9e6e8',outline=INK,width=4)
    txt(d,(xy[0]+18,xy[1]+18),s)
def arrow(d,a,b):
    d.line((a,b),fill=TEAL,width=7)
    x,y=b;d.polygon([(x,y),(x-20,y-11),(x-20,y+11)],fill=TEAL)
im,d=start('養生ネット：垂直の面と水平の面を分ける')
txt(d,(75,150),'垂直の面の例',30);txt(d,(675,150),'水平の面の例',30)
d.rectangle((110,230,455,530),fill='#e4eeee',outline=INK,width=5)
for x in range(140,455,35):d.line((x,235,x,525),fill=TEAL,width=2)
for y in range(260,530,35):d.line((115,y,450,y),fill=TEAL,width=2)
A=(650,445);B=(1010,445);C=(1110,280);D=(750,280)
d.polygon([A,B,C,D],fill='#e4eeee',outline=INK,width=5)
for i in range(1,10):
 f=i/10;d.line((A[0]+(B[0]-A[0])*f,A[1],D[0]+(C[0]-D[0])*f,D[1]),fill=TEAL,width=2)
for i in range(1,6):
 f=i/6;d.line((A[0]+(D[0]-A[0])*f,A[1]+(D[1]-A[1])*f,B[0]+(C[0]-B[0])*f,B[1]+(C[1]-B[1])*f),fill=TEAL,width=2)
txt(d,(120,555),'飛散への対策など',25);txt(d,(650,500),'落下を受け止める性能のある種類',25)
txt(d,(60,625),'面の向きと用途の区別。強度・取付け・有効範囲を示す図ではありません',24)
im.save(OUT/'vertical-horizontal-net-roles-v1.png',optimize=True)
im,d=start('直角を示す用具：さしがねと、おおがねの模式例')
txt(d,(110,160),'さしがねの二つの枝',29)
d.polygon([(145,230),(200,230),(200,470),(510,470),(510,525),(145,525)],fill='#bdd0d4',outline=INK)
d.line([(220,470),(220,450),(200,450)],fill=TEAL,width=4)
txt(d,(85,575),'長枝・短枝、内側・外側を分ける',24)
txt(d,(710,160),'おおがね：直角の参照',29)
d.polygon([(745,500),(745,260),(1065,500)],fill='#e3d3b0',outline=INK)
d.line([(745,470),(775,470),(775,500)],fill=TEAL,width=4)
txt(d,(700,575),'大きさと直角の正しさは別',24)
txt(d,(60,635),'形の関係の模式例。目盛・寸法・製品の精度を指定する図ではありません',24)
im.save(OUT/'right-angle-tool-roles-v1.png',optimize=True)
im,d=start('平形ケーブル：導体・絶縁体・シースの位置')
d.rounded_rectangle((120,260,870,470),100,fill='#a4bdc4',outline=INK,width=5)
for x in [300,495,690]:
 d.ellipse((x-80,285,x+80,445),fill='#e9d7ac',outline=INK,width=4)
 d.ellipse((x-35,330,x+35,400),fill='#bf8c4a',outline=INK,width=3)
for xy,term,ty in [((725,365),'導体',170),((550,310),'絶縁体',310),((850,430),'シース',490)]:
 d.line((xy[0],xy[1],950,ty+20),fill=INK,width=2);txt(d,(960,ty),term,27)
txt(d,(70,590),'芯数は模式例です。EM-EEFの材料構成は本文と製品の表示を対応させます',24)
txt(d,(70,635),'平形の断面と層の関係。定格・寸法・結線方法を指定する図ではありません',24)
im.save(OUT/'flat-cable-layer-roles-v1.png',optimize=True)
