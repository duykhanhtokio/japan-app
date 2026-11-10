"""Independent precise conceptual diagrams; no source pixels used.
Source examples: AGR-S1 PDF82–83; AGR-S2 PDF103–104. No operating recipe.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import math
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'assets/agriculture/royal-weekly-20261107/agri-restaurant12'
FONT='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
NAVY='#163d53';BG='#faf6e9';GOLD='#bd9753';WOOD='#b89c73';DARK='#92734f';SCION='#decc9b';GREEN='#4d8c66'
def font(n):return ImageFont.truetype(FONT,n)
def base(size,title,subtitle):
 im=Image.new('RGB',size,BG);d=ImageDraw.Draw(im);d.rounded_rectangle((16,16,size[0]-16,size[1]-16),22,outline=GOLD,width=3);d.text((44,35),title,font=font(34),fill=NAVY);d.text((45,95),subtitle,font=font(19),fill=NAVY);return im,d
def panel(d,box,title):
 d.rounded_rectangle(box,18,fill='#fffdf6',outline=GOLD,width=2);d.text((box[0]+20,box[1]+14),title,font=font(25),fill=NAVY)
def arrow(d,a,b,color=GOLD):
 d.line((a,b),fill=color,width=3);ang=math.atan2(a[1]-b[1],a[0]-b[0]);p=[b,(b[0]+12*math.cos(ang+.4),b[1]+12*math.sin(ang+.4)),(b[0]+12*math.cos(ang-.4),b[1]+12*math.sin(ang-.4))];d.polygon(p,fill=color)
def stock(d,poly):d.polygon(poly,fill=WOOD,outline=DARK,width=3)
def bud(d,x,y):d.ellipse((x-7,y-5,x+7,y+5),fill=GREEN,outline=NAVY)
# Three contrasting insertion positions; retained live stock is unmistakable.
im,d=base((1320,1100),'三つの枝接ぎ：接ぐ位置と残る枝','接合位置の概念図です。切断寸法・角度や刃物の操作は指定しません。')
panel(d,(50,155,635,575),'切り接ぎ');panel(d,(685,155,1270,575),'割り接ぎ');panel(d,(50,610,1270,1045),'腹接ぎ：元の枝・幹を切り落とさない')
stock(d,[(220,450),(220,315),(355,315),(355,450)]);d.polygon([(326,390),(326,240),(350,246),(350,390)],fill=SCION,outline=NAVY);d.line((326,316,326,405),fill=GREEN,width=4);bud(d,342,268);d.text((95,495),'切断した台木の側で形成層を合わせる',font=font(23),fill=NAVY)
stock(d,[(870,450),(870,315),(1010,315),(1010,450)]);d.line((940,316,940,433),fill=NAVY,width=2);d.polygon([(925,240),(955,240),(955,317),(940,397),(925,317)],fill=SCION,outline=NAVY);bud(d,946,268);d.text((745,495),'割った部分へ、くさび状の穂木',font=font(23),fill=NAVY)
# Continuous original trunk branches above side union: no flat severed top.
stock(d,[(320,974),(320,766),(302,716),(315,709),(337,753),(340,690),(355,690),(355,754),(394,715),(405,726),(360,775),(360,974)])
d.line((340,750,340,672),fill=DARK,width=11);bud(d,345,678);bud(d,315,718);bud(d,399,720)
d.polygon([(355,883),(398,770),(417,779)],fill=SCION,outline=NAVY);d.line((355,883,397,797),fill=GREEN,width=3);bud(d,408,790)
arrow(d,(640,740),(357,733));d.text((650,717),'元の枝・幹が上へ続く',font=font(25),fill=NAVY)
arrow(d,(640,850),(375,832));d.text((650,827),'途中の側面へ穂木を接ぐ',font=font(25),fill=NAVY)
d.text((650,920),'枝接ぎの型を比べるための模式図',font=font(21),fill=NAVY)
im.save(OUT/'branch-graft-type-profiles-v2.png')
# Numeric plate: measured-looking information is explicitly the source example.
im,d=base((1320,645),'枝接ぎ図の数値を資料の例として読む','1号・2号の掲載例です。樹種や条件に共通する作業寸法ではありません。')
panel(d,(50,155,635,585),'台木の掲載例');panel(d,(685,155,1270,585),'穂木の掲載例')
# Actual 45-degree shoulder bevel: dx == dy, arrow endpoint on slope.
stock(d,[(225,480),(225,325),(285,325),(325,365),(325,480)])
d.line((115,480,350,480),fill=NAVY,width=2);arrow(d,(145,478),(145,326));arrow(d,(145,328),(145,480));d.line((135,325,225,325),fill=GOLD,width=2)
d.text((80,500),'地表から4.5〜6 cm',font=font(23),fill=NAVY)
arrow(d,(417,277),(307,347));d.text((390,238),'肩：45度',font=font(23),fill=NAVY)
d.line((307,347,307,415),fill=GREEN,width=4);arrow(d,(420,410),(307,390));d.text((365,425),'切り込み：約3 cm',font=font(22),fill=NAVY)
d.text((80,548),'斜面の位置を示す図・縮尺は一定でない',font=font(19),fill=NAVY)
# Side profile and reverse face are separate rather than conflating both cuts.
stock(d,[(790,270),(816,270),(816,384),(790,472)]);d.polygon([(790,472),(816,384),(816,472)],fill=SCION,outline=NAVY);bud(d,809,297);bud(d,808,328);bud(d,809,358)
d.text((725,220),'芽：1〜3個',font=font(23),fill=NAVY);arrow(d,(994,356),(802,430));d.text((951,320),'斜め：約3.6 cm',font=font(22),fill=NAVY)
# reverse bevel, explicit 45-degree diagonal with matching x/y offsets.
stock(d,[(1094,415),(1120,415),(1120,475),(1094,449)]);d.polygon([(1094,449),(1120,475),(1094,475)],fill=SCION,outline=NAVY);arrow(d,(1210,475),(1107,462));d.text((955,510),'裏：45度・約9 mm',font=font(23),fill=NAVY)
d.text((722,548),'二つの切り面を別図で示す・実寸ではない',font=font(19),fill=NAVY)
im.save(OUT/'graft-source-example-dimensions-v2.png')
print(OUT)
