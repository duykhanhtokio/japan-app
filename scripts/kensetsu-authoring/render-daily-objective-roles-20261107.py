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
im,d=start('COS：二つの相手を切り替える機能')
box(d,(65,270,310,390),'共通の側')
box(d,(800,155,1120,275),'切替先 A')
box(d,(800,435,1120,555),'切替先 B')
d.line((310,330,480,330),fill=INK,width=7);d.ellipse((466,316,494,344),fill=INK)
d.line((480,330,738,215),fill=TEAL,width=9);d.line((745,215,800,215),fill=INK,width=7)
d.line((745,495,800,495),fill=INK,width=7);d.ellipse((730,200,760,230),outline=INK,width=4);d.ellipse((730,480,760,510),outline=INK,width=4)
txt(d,(70,590),'単なる入・切ではなく、どの相手へ切り替えるかを分ける',27)
im.save(OUT/'changeover-role-v1.png',optimize=True)
im,d=start('排煙：火災で生じる煙を室内から外へ')
d.rectangle((100,175,720,560),outline=INK,width=7)
txt(d,(130,195),'室内')
for xy in [(280,300,440,385),(380,265,530,350),(470,310,590,395)]:d.ellipse(xy,fill='#b9c0c4')
txt(d,(305,415),'火災の煙')
d.rectangle((690,290,985,365),fill=BG)
arrow(d,(550,330),(1020,330));txt(d,(950,235),'外部')
txt(d,(100,605),'日常の換気や空調とは、取り扱う対象と目的が異なる',27)
im.save(OUT/'smoke-exhaust-role-v1.png',optimize=True)
im,d=start('火災報知：感知する側・人が知らせる側・受ける側')
box(d,(60,160,415,295),'感知器：煙・熱を捉える')
box(d,(60,425,415,560),'発信機：人が知らせる')
box(d,(760,290,1130,425),'受信機：情報を受ける')
arrow(d,(435,230),(720,330));arrow(d,(435,490),(720,390))
txt(d,(465,245),'信号',25);txt(d,(465,485),'信号',25)
txt(d,(65,620),'信号を扱う役割の関係です。消火のための散水とは分けます',26)
im.save(OUT/'fire-alarm-roles-v1.png',optimize=True)
im,d=start('高圧室内作業：大気圧より高い気圧の作業室')
txt(d,(70,130),'外側：大気圧')
d.rectangle((300,225,1080,585),fill='#e9eeee',outline=INK,width=10)
txt(d,(340,250),'作業室内の空気',30);txt(d,(340,305),'大気圧より高い気圧',30)
d.ellipse((765,355,825,415),fill='#d8bd87',outline=INK,width=4)
d.line([(795,415),(795,500)],fill=INK,width=7)
d.line([(745,465),(795,430),(845,465)],fill=INK,width=7)
d.line([(760,560),(795,500),(830,560)],fill=INK,width=7)
txt(d,(70,625),'水中の潜水作業とは分けます。室や設備の設計図ではありません',26)
im.save(OUT/'compressed-air-chamber-role-v2.png',optimize=True)
