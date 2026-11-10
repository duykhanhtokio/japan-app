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
im,d=start('水道：水源・水質に応じた処理・供給する水')
box(d,(50,230,345,465),'水源からの水')
box(d,(450,230,745,465),'水質に応じた処理')
box(d,(850,230,1145,465),'供給する水')
arrow(d,(365,350),(430,350));arrow(d,(765,350),(830,350))
txt(d,(475,335),'消毒なども関係',24)
txt(d,(75,590),'必要な処理は水質に対応させます。地下水も一律の方法とは決めません',24)
txt(d,(75,635),'機能の関係図です。処理設備の順番・組合せを指定する図ではありません',24)
im.save(OUT/'water-treatment-roles-v1.png',optimize=True)
im,d=start('モンキーレンチ：固定する顎と動く顎')
txt(d,(80,140),'顎の役割を分けた表示（実際の製品形状ではありません）',26)
d.rectangle((485,270,590,550),fill='#9ebbc3',outline=INK,width=5)
d.rectangle((320,235,590,285),fill='#9ebbc3',outline=INK,width=5)
d.rectangle((320,400,480,450),fill='#d5bc83',outline=INK,width=5)
txt(d,(690,245),'固定された顎');d.line((585,260,665,260),fill=INK,width=3)
txt(d,(690,415),'動く顎');d.line((480,425,665,425),fill=INK,width=3)
d.line((260,310,260,390),fill=TEAL,width=6)
d.polygon([(260,310),(248,330),(272,330)],fill=TEAL)
d.polygon([(260,390),(248,370),(272,370)],fill=TEAL)
txt(d,(75,605),'顎の開口を対象の二面幅へ対応させる役割。適用寸法や使用方法は指定しません',23)
im.save(OUT/'adjustable-wrench-jaw-roles-v1.png',optimize=True)
im,d=start('ロックウール：原料から繊維状の材料へ')
box(d,(50,205,410,540),'鉱物などの原料')
d.polygon([(130,440),(100,360),(180,300),(270,325),(325,425),(255,475)],fill='#b2bdc0',outline=INK)
arrow(d,(435,365),(690,365));txt(d,(465,265),'溶かして繊維化',25)
box(d,(720,205,1150,540),'繊維状の材料')
for y in [330,360,390,420,450]:d.line([(770,y+20),(830,y-15),(910,y+10),(1000,y-15),(1100,y+15)],fill='#8b987d',width=5)
txt(d,(75,610),'材料の成り立ちの模式図。原料の組合せ・製造設備・繊維寸法は指定しません',23)
im.save(OUT/'mineral-fiber-role-v1.png',optimize=True)
