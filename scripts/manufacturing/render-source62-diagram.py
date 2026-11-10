"""Original controlled mechanism diagram; no source pixels or product geometry."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[2]
W,H=1200,680
im=Image.new('RGB',(W,H),'#f8f7ef');d=ImageDraw.Draw(im)
font_path='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def text(x,y,t,n=34,c='#173a50'):
 d.text((x,y),t,font=ImageFont.truetype(font_path,n),fill=c,anchor='mm')
def label(x,y,t,k):
 text(x,y-30,k,20);text(x,y,t,34)
text(600,40,'電磁開閉器：二つの役割を分ける',38)
text(600,80,'でんじかいへいき　　ふたつのやくわり',21)
d.rounded_rectangle((65,135,550,505),15,fill='#e7f1f3',outline='#31596d',width=4)
d.rounded_rectangle((650,135,1135,505),15,fill='#f5e6d7',outline='#735444',width=4)
label(307,185,'接触器','せっしょくき');text(307,235,'コンタクタ',28)
for x in [210,300,390]:
 d.line((x,300,x,355),fill='#234e68',width=8)
 d.ellipse((x-9,345,x+9,363),fill='#234e68');d.ellipse((x-9,413,x+9,431),fill='#234e68')
 d.line((x,422,x+32,377),fill='#234e68',width=7);d.line((x,422,x,455),fill='#234e68',width=8)
label(892,185,'熱動過電流リレー','ねつどうかでんりゅう');text(892,235,'サーマルリレー',28)
# Separate two-layer strip; no terminal assignment or operating parameters.
d.arc((730,205,1050,430),25,150,fill='#b95f39',width=17)
d.arc((730,215,1050,440),25,150,fill='#38778f',width=17)
label(307,548,'負荷の開閉','ふかのかいへい');label(892,548,'過負荷の検出','かふかのけんしゅつ')
text(600,612,'きのうの がいねんず：はいせん・せってい・そうさの しじではありません。',22)
text(600,645,'せいひんの しゃしんではありません。じっきの ぶひんどうていには つかいません。',22)
p=ROOT/'assets/manufacturing/source62/switch-roles.png';p.parent.mkdir(exist_ok=True);im.save(p,optimize=True)
