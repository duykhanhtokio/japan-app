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
im,d=start('短絡：本来の負荷を通らない低抵抗の経路')
box(d,(60,255,290,445),'電源側')
box(d,(735,270,1085,430),'本来の負荷')
d.line([(290,295),(500,295),(735,295)],fill=INK,width=6)
d.line([(1085,405),(1085,535),(290,535),(290,405)],fill=INK,width=6)
d.line([(500,295),(500,535)],fill='#b64e42',width=10)
txt(d,(335,165),'意図しない短絡の経路',30)
d.line((485,225,500,280),fill='#b64e42',width=3)
txt(d,(75,620),'負荷を通る経路と、負荷を迂回する経路の比較。実配線図ではありません',24)
im.save(OUT/'short-circuit-role-v1.png',optimize=True)
im,d=start('建て入れ：柱の位置・鉛直と、確認する基準')
d.line((150,560,1050,560),fill=INK,width=6)
d.polygon([(480,545),(520,555),(635,200),(595,190)],fill='#abc1c7',outline=INK)
d.line((750,160,750,560),fill=TEAL,width=5)
d.polygon([(750,560),(730,525),(770,525)],fill=TEAL)
txt(d,(245,160),'確認する柱の例');txt(d,(810,275),'鉛直の基準')
d.line((588,350,750,350),fill='#b64e42',width=5)
txt(d,(75,620),'位置と基準を照合する図。調整用具が付いたことだけで鉛直とは判断しません',23)
im.save(OUT/'column-plumb-reference-v1.png',optimize=True)
im,d=start('床型枠：面から下へ受け渡す支持の役割')
for xy,c in [((180,175,800,210),'#dcc48e'),((245,235,725,270),'#b5c9cd'),((320,295,650,345),'#8eabb4')]:d.rectangle(xy,fill=c,outline=INK,width=4)
d.rectangle((465,370,505,585),fill='#c8d3d5',outline=INK,width=4)
for y,term in [(180,'せき板'),(240,'根太'),(305,'大引き'),(440,'支柱の例')]:
 txt(d,(855,y),term);d.line((790 if y<220 else (715 if y<280 else (640 if y<350 else 500)),y+20,835,y+20),fill=INK,width=2)
txt(d,(75,625),'役割の順を分けた表示。間隔・取付け・支柱の本数を定める図ではありません',23)
im.save(OUT/'floor-form-support-roles-v1.png',optimize=True)
im,d=start('鉄道施設：土木・建築・設備の役割を合わせる')
box(d,(50,175,370,555),'線路・橋など')
for x in [135,270]:d.line((x,285,x,465),fill=INK,width=6)
for y in [300,345,390,435]:d.line((105,y,300,y),fill=INK,width=5)
txt(d,(100,485),'土木の部分',26)
box(d,(440,175,760,555),'駅などの建物')
d.rectangle((505,310,695,440),fill='#d7c28e',outline=INK,width=4)
d.polygon([(480,310),(600,250),(720,310)],fill='#99b9bf',outline=INK)
txt(d,(490,485),'建築の部分',26)
box(d,(830,175,1150,555),'電気設備など')
d.line((930,290,930,435),fill=INK,width=6);d.line((880,320,1085,320),fill=INK,width=6)
txt(d,(880,485),'設備の部分',26)
txt(d,(75,620),'一つの用途の施設を、異なる専門工事が支える関係。施工例の配置図ではありません',22)
im.save(OUT/'railway-work-roles-v1.png',optimize=True)
