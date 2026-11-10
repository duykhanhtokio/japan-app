"""Original controlled anatomy schematics. No source artwork is copied.
Requires Pillow and KAIGO_DIAGRAM_FONT (Japanese font path)."""
from pathlib import Path
import os, math
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/kaigo/daily-fix-20261031';OUT.mkdir(parents=True,exist_ok=True)
FONT=os.environ.get('KAIGO_DIAGRAM_FONT','/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
BG='#fbf5e9';INK='#263d4b';MUTED='#637887';BLUE='#548faf';RED='#c45d63';GOLD='#b48c45';SKIN='#e9d4bf';GREEN='#58978a'
def font(n):return ImageFont.truetype(FONT,n)
def start(title):
 im=Image.new('RGB',(1400,1100),BG);d=ImageDraw.Draw(im);d.rounded_rectangle((18,18,1382,1082),radius=32,outline=GOLD,width=4);d.text((60,42),title,font=font(46),fill=INK);return im,d
def txt(d,xy,t,n=30,c=INK):d.text(xy,t,font=font(n),fill=c)
def ell(d,b,fill,outline=INK,w=3):d.ellipse(b,fill=fill,outline=outline,width=w)
def line(d,pts,c=INK,w=4):d.line(pts,fill=c,width=w,joint='curve')
def label(d,p,t,xy,n=30):
 # Callout endpoint remains outside object; no crossing through another label.
 x,y=xy;tw=d.textlength(t,font=font(n));end=(x+tw+8,y+18) if x<p[0] else (x-8,y+18);line(d,[p,end],MUTED,3);ell(d,(p[0]-5,p[1]-5,p[0]+5,p[1]+5),GOLD,GOLD,1);txt(d,(x,y),t,n)
def body(d,cx,top=160,scale=1):
 def box(x1,y1,x2,y2):return (cx+x1*scale,top+y1*scale,cx+x2*scale,top+y2*scale)
 ell(d,box(-45,0,45,95),SKIN)
 d.rounded_rectangle(box(-25,80,25,130),radius=12,fill=SKIN,outline=INK,width=3)
 d.polygon([(cx-82*scale,top+125*scale),(cx+82*scale,top+125*scale),(cx+67*scale,top+365*scale),(cx-67*scale,top+365*scale)],fill=SKIN,outline=INK,width=3)
 for sign in [-1,1]:
  line(d,[(cx+sign*80*scale,top+140*scale),(cx+sign*125*scale,top+290*scale),(cx+sign*138*scale,top+420*scale)],SKIN,35)
  line(d,[(cx+sign*35*scale,top+360*scale),(cx+sign*45*scale,top+530*scale),(cx+sign*50*scale,top+700*scale)],SKIN,53)
  ell(d,box(sign*50-30,685,sign*50+30,725),SKIN)
 return lambda x,y:(cx+x*scale,top+y*scale)
def finish(im,d,name,note='位置・関係を学ぶ模式図。縮尺や個人の状態を示しません。'):
 txt(d,(60,994),note,26,MUTED);im.save(OUT/(name+'.png'),optimize=True)
# Muscles: separate anterior/posterior with major region shapes, not a clinical atlas.
im,d=start('主要な筋肉：前面と後面を分ける');a=body(d,420,190,.95);b=body(d,1010,190,.95);txt(d,(375,130),'前面',36);txt(d,(965,130),'後面',36)
for fn,back in [(a,False),(b,True)]:
 for sign in [-1,1]:
  def e(x1,y1,x2,y2,col):
   p1,p2=fn(x1,y1),fn(x2,y2);ell(d,(*p1,*p2),col,RED,2)
  e(sign*76-22,122,sign*76+22,178,RED)
  e(sign*102-15,195,sign*102+15,280,'#d28a6c')
  e(sign*37-21,400,sign*37+21,520,'#bc6c82')
 if back:
  for sign in [-1,1]:
   p1,p2=fn(sign*34-30,300),fn(sign*34+30,370);ell(d,(*p1,*p2),'#c87567',RED,2)
 else:
  for sign in [-1,1]:
   p1,p2=fn(sign*34-28,150),fn(sign*34+28,205);ell(d,(*p1,*p2),'#c87567',RED,2)
label(d,a(-76,150),'三角筋',(70,220));label(d,a(-35,175),'大胸筋',(70,305));label(d,a(-100,235),'上腕二頭筋',(60,415));label(d,a(-36,455),'大腿四頭筋',(55,700));label(d,b(102,235),'上腕三頭筋',(1120,405));label(d,b(34,340),'大臀筋',(1150,590));label(d,b(37,455),'大腿二頭筋',(1110,750));finish(im,d,'muscles')
# Endocrine: main regions and separate sex-gland insets, never both on same body.
im,d=start('内分泌腺：名前とおおまかな位置');p=body(d,670,170,1.02)
for x,y in [(-9,35),(14,27)]:q=p(x,y);ell(d,(q[0]-8,q[1]-8,q[0]+8,q[1]+8),RED)
q=p(0,111);ell(d,(q[0]-24,q[1]-15,q[0]+24,q[1]+15),RED)
for x,y in [(-13,110),(13,116)]:q=p(x,y);ell(d,(q[0]-4,q[1]-4,q[0]+4,q[1]+4),'#ffc64a',INK,1)
q=p(0,160);ell(d,(q[0]-23,q[1]-15,q[0]+23,q[1]+25),GREEN)
for x in [-45,45]:
 q=p(x,260);ell(d,(q[0]-22,q[1]-25,q[0]+22,q[1]+25),'#b4b4aa');d.polygon([(q[0]-23,q[1]-29),(q[0],q[1]-44),(q[0]+23,q[1]-29)],fill=RED,outline=INK)
q=p(5,240);d.rounded_rectangle((q[0]-47,q[1]-10,q[0]+47,q[1]+10),radius=10,fill=GOLD,outline=INK,width=2)
label(d,p(-9,35),'下垂体',(190,200));label(d,p(14,27),'松果体',(910,160));label(d,p(-20,110),'甲状腺',(180,310));label(d,p(14,116),'副甲状腺（甲状腺の後面）',(900,300),26);label(d,p(0,165),'胸腺',(190,410));label(d,p(46,220),'副腎（腎臓の上）',(920,440));label(d,p(5,240),'膵臓',(240,500))
# inset gonads are separate schematic positions, not one individual.
d.rounded_rectangle((70,665,390,930),radius=20,outline=MUTED,width=2);txt(d,(115,685),'卵巣：骨盤内',28)
line(d,[(145,805),(195,795),(230,825),(265,795),(315,805)],INK,5)
ell(d,(125,790,160,820),RED);ell(d,(300,790,335,820),RED);d.polygon([(205,790),(255,790),(245,845),(215,845)],fill=SKIN,outline=INK)
d.rounded_rectangle((980,665,1310,930),radius=20,outline=MUTED,width=2);txt(d,(1025,685),'精巣：陰嚢内',28);d.arc((1070,760,1220,890),0,180,fill=INK,width=5);ell(d,(1090,790,1140,855),RED);ell(d,(1150,790,1200,855),RED);finish(im,d,'endocrine','性腺は別の模式図。位置の学習であり、ホルモン異常の診断図ではありません。')
# CNS and peripheral nerves: central trunk + radial branches.
im,d=start('神経：中枢と末梢の位置関係');p=body(d,700,160,1.02);q=p(0,42);ell(d,(q[0]-30,q[1]-29,q[0]+30,q[1]+29),BLUE)
line(d,[p(0,80),p(0,385)],BLUE,14)
for y in [135,185,230,275,320]:
 for sign in [-1,1]:line(d,[p(0,y),p(sign*55,y+15),p(sign*110,y+70)],GOLD,5)
for sign in [-1,1]:line(d,[p(0,355),p(sign*40,445),p(sign*50,670)],GOLD,6)
label(d,p(0,40),'脳',(220,215));label(d,p(0,240),'脊髄',(220,460));label(d,p(105,250),'末梢神経',(1020,465));txt(d,(160,780),'中枢：脳と脊髄',32,BLUE);txt(d,(160,840),'末梢：身体の各部と中枢をつなぐ',30,GOLD);finish(im,d,'nervous','神経の分布を簡略化。枝の数は脳神経・脊髄神経の対数を示しません。')
# Brain: simple sagittal regions, with brainstem named regions.
im,d=start('脳の各部：大脳・間脳・小脳・脳幹');ell(d,(300,190,1040,700),'#d9c9dc')
for xx,yy in [(390,300),(490,250),(610,220),(750,260),(880,330),(450,440),(580,410),(730,380)]:d.arc((xx-45,yy-15,xx+60,yy+85),20,300,fill='#b29db8',width=5)
ell(d,(725,550,1010,765),GREEN)
for i in range(5):d.arc((750+i*20,565,985,750-i*12),30,300,fill='#36796d',width=3)
ell(d,(615,490,760,595),GOLD)
d.polygon([(640,555),(700,575),(720,650),(690,700),(710,790),(650,790),(650,690),(620,635)],fill=BLUE,outline=INK,width=3)
label(d,(530,300),'大脳',(110,170));label(d,(665,535),'間脳',(120,450));label(d,(900,670),'小脳',(1100,630));label(d,(655,585),'中脳',(110,630));label(d,(680,655),'橋',(110,730));label(d,(680,745),'延髄',(110,825));line(d,[(750,585),(780,585),(780,795),(750,795)],INK,4);txt(d,(825,830),'中脳・橋・延髄＝脳幹',30);finish(im,d,'brain','各部の関係を整理した模式図。症状から損傷部位を特定するための図ではありません。')
# Respiratory: actual airway tree and alveolar inset.
im,d=start('気道と肺胞：空気の道筋を追う');ell(d,(520,160,730,350),SKIN);line(d,[(560,235),(640,235),(650,375),(650,500)],BLUE,23)
for sign in [-1,1]:
 cx=650+sign*125;ell(d,(cx-105,410,cx+105,800),'#e7bfc4');line(d,[(650,490),(cx,540),(cx-45,635)],BLUE,16);line(d,[(cx,540),(cx+45,635)],BLUE,10)
label(d,(575,235),'鼻腔',(140,180));label(d,(650,300),'咽頭・喉頭',(950,240));label(d,(650,400),'気管',(950,380));label(d,(525,540),'気管支',(100,490));label(d,(480,730),'肺',(170,740))
d.rounded_rectangle((920,530,1300,915),radius=25,outline=MUTED,width=2);txt(d,(1040,545),'肺胞',32)
for x,y in [(1030,680),(1130,680),(1080,775)]:ell(d,(x-52,y-52,x+52,y+52),'#edced3');d.arc((x-67,y-65,x+67,y+65),30,300,fill=RED,width=8)
txt(d,(970,845),'周囲の血液とガス交換',24);finish(im,d,'respiratory')
# Skeleton and spine; highlighted femoral neck, no pathological diagnosis.
im,d=start('骨の名前と位置：全身と脊柱');p=body(d,470,165,.98);q=p(0,40);ell(d,(q[0]-32,q[1]-35,q[0]+32,q[1]+35),'#fffdf5')
line(d,[p(0,110),p(0,350)],INK,11)
for y in range(145,261,24):d.arc((p(-60,y)[0],p(-60,y)[1],p(60,y+40)[0],p(60,y+40)[1]),0,180,fill=INK,width=5)
for sign in [-1,1]:
 line(d,[p(sign*65,125),p(sign*95,270),p(sign*135,410)],'#fdfbf1',15);line(d,[p(sign*30,360),p(sign*45,530),p(sign*50,680)],'#fffdf5',18);line(d,[p(sign*10,335),p(sign*30,360)],RED,9)
label(d,p(0,40),'頭蓋骨',(90,170));label(d,p(-50,190),'肋骨',(90,350));label(d,p(0,280),'脊柱',(90,470));label(d,p(30,360),'大腿骨頸部',(680,570));label(d,p(45,440),'大腿骨',(700,690));
pts=[(1090+35*math.sin(i/9),210+i*17) for i in range(32)];line(d,pts,INK,15);txt(d,(975,135),'側面の脊柱',30);txt(d,(960,835),'生理的な湾曲',28);finish(im,d,'skeleton','骨の位置と関係の模式図。湾曲や痛みだけで骨折・骨粗鬆症を診断しません。')
# Eye cross section: lens biconvex and retinal back wall distinct.
im,d=start('眼の断面：水晶体・網膜・視神経');ell(d,(320,200,1030,870),'#f7faf7');d.arc((340,220,1010,850),270,90,fill=RED,width=17)
d.polygon([(910,560),(1150,610),(1140,665),(910,610)],fill=GOLD,outline=INK,width=3)
ell(d,(340,385,430,675),'#bddfe6');d.arc((280,350,445,710),100,260,fill=BLUE,width=7)
line(d,[(140,525),(355,525),(910,555)],GOLD,4);line(d,[(145,455),(355,455),(910,555)],GOLD,4);line(d,[(145,595),(355,595),(910,555)],GOLD,4)
label(d,(390,520),'水晶体',(120,770));label(d,(980,450),'網膜',(1110,280));label(d,(1100,630),'視神経',(1040,815));txt(d,(70,340),'光',32,GOLD);finish(im,d,'eye','断面の位置関係を簡略化。水晶体は別の球ではなく、両面がふくらむ構造です。')
# Hand locations, not unverified color-intensity microbiology or process steps.
im,d=start('手指衛生：手の面と部位を確かめる')
for cx,back in [(420,False),(1010,True)]:
 d.rounded_rectangle((cx-100,450,cx+100,780),radius=70,fill=SKIN,outline=INK,width=4)
 for i,(dx,y) in enumerate([(-75,270),(-25,220),(25,240),(75,310)]):d.rounded_rectangle((cx+dx-22,y,cx+dx+22,510),radius=22,fill=SKIN,outline=INK,width=4)
 d.polygon([(cx-80,540),(cx-150,410),(cx-190,440),(cx-130,620)],fill=SKIN,outline=INK,width=4)
 d.rectangle((cx-65,740,cx+65,865),fill=SKIN,outline=INK,width=4)
 for dx,y in [(-75,270),(-25,220),(25,240),(75,310)]:ell(d,(cx+dx-12,y+6,cx+dx+12,y+30),RED,RED,1)
 for x in [-50,0,50]:ell(d,(cx+x-10,475,cx+x+10,500),BLUE,BLUE,1)
 if back:
  for dx,y in [(-75,270),(-25,220),(25,240),(75,310)]:d.rounded_rectangle((cx+dx-13,y+10,cx+dx+13,y+50),radius=7,outline=INK,width=2)
  for yy in [570,620]:line(d,[(cx-60,yy),(cx+60,yy-20)],MUTED,2)
 else:
  d.arc((cx-70,535,cx+70,680),15,170,fill=MUTED,width=3)
  d.arc((cx-70,595,cx+80,730),200,350,fill=MUTED,width=3)
 txt(d,(cx-60,135),'手の甲' if back else '手のひら',34)
label(d,(395,245),'指先・爪の周囲',(60,200));label(d,(420,485),'指の間',(55,520));label(d,(270,470),'親指',(70,660));label(d,(1010,805),'手首',(1180,840));finish(im,d,'hand-regions','部位を示す色であり、洗い残しの濃淡・菌数・除菌率を示すものではありません。')
# Skin cross section: distinct layers and coiled sweat duct.
im,d=start('皮膚の断面：層と汗腺を分ける')
d.rectangle((170,300,1080,390),fill='#d6a083',outline=INK,width=3);d.rectangle((170,390,1080,690),fill='#edc4b4',outline=INK,width=3);d.rectangle((170,690,1080,870),fill='#ebd796',outline=INK,width=3)
for x in range(200,1040,80):ell(d,(x,720,x+65,800),'#f5e7b0',GOLD,2)
line(d,[(530,310),(530,500),(560,530)],BLUE,12)
for a in range(4):ell(d,(510+a*18,540-a*4,575+a*18,605-a*4),'#b3d1d9',BLUE,5)
line(d,[(180,640),(1050,640)],RED,9);line(d,[(350,640),(350,470)],RED,7);line(d,[(810,640),(810,460)],RED,7)
label(d,(930,345),'表皮',(1140,300));label(d,(930,520),'真皮',(1140,500));label(d,(930,770),'皮下組織',(1110,760));label(d,(580,580),'汗腺',(180,130));label(d,(810,640),'血管',(650,130));finish(im,d,'skin','層と付属器の位置関係を簡略化。厚さや色は本人の皮膚状態の判定基準ではありません。')
print('Built9 original controlled PNG schematics.')
# Four chambers and pulmonary/systemic circulation, geometry deliberately schematic.
def arrow(d,pts,c=INK,w=8):
 line(d,pts,c,w);a,b=pts[-2],pts[-1];ang=math.atan2(b[1]-a[1],b[0]-a[0]);length=20;d.polygon([b,(b[0]-length*math.cos(ang-.55),b[1]-length*math.sin(ang-.55)),(b[0]-length*math.cos(ang+.55),b[1]-length*math.sin(ang+.55))],fill=c)
im,d=start('心臓の四つの部屋と二つの循環');d.rounded_rectangle((410,360,990,790),radius=150,fill='#d9b5b5',outline=INK,width=5)
for b,c in [((460,400,670,535),BLUE),((460,565,670,745),BLUE),((730,400,940,535),RED),((730,565,940,745),RED)]:d.rounded_rectangle(b,radius=48,fill=c,outline=INK,width=4)
txt(d,(500,445),'右心房',30,'#ffffff');txt(d,(500,625),'右心室',30,'#ffffff');txt(d,(770,445),'左心房',30,'#ffffff');txt(d,(770,625),'左心室',30,'#ffffff');arrow(d,[(565,525),(565,590)],'#ffffff',6);arrow(d,[(835,525),(835,590)],'#ffffff',6)
# Lung object above and body object to right; no oxygen-colour definition of artery/vein.
for cx in [625,775]:ell(d,(cx-55,145,cx+55,290),'#e7bfc4')
line(d,[(700,140),(700,200),(650,220)],BLUE,8);line(d,[(700,200),(750,220)],BLUE,8);txt(d,(500,150),'肺',34)
arrow(d,[(470,620),(325,620),(325,290),(570,250)],BLUE);txt(d,(155,385),'肺動脈',28,BLUE)
arrow(d,[(830,250),(1070,290),(1070,430),(940,465)],RED);txt(d,(1110,330),'肺静脈',28,RED)
arrow(d,[(835,730),(1120,830),(1120,900),(790,900)],RED);txt(d,(530,930),'全身の血管',27)
arrow(d,[(610,900),(260,900),(260,465),(460,465)],BLUE);finish(im,d,'heart','心臓から出る血管が動脈、戻る血管が静脈。流れの関係を簡略化しています。')
# Digestive path in a frontal body, explicitly subject's right/left.
im,d=start('消化管：本人の左右と通り道');p=body(d,700,155,1.02);line(d,[p(0,50),p(0,220)],RED,15);q=p(37,235);ell(d,(q[0]-55,q[1]-30,q[0]+55,q[1]+50),'#d28a6c')
# Viewer left = subject right: ascending colon climbs here.
pts=[p(-65,365),p(-65,275),p(70,275),p(70,385),p(15,410),p(0,445)];line(d,pts,'#a98560',23)
for yy in [300,325,350,375]:line(d,[p(-42,yy),p(42,yy+6),p(-32,yy+18)],'#cf9c8d',12)
label(d,p(0,50),'口・咽頭',(200,180));label(d,p(0,160),'食道',(970,310));label(d,p(42,235),'胃',(1010,410));label(d,p(15,330),'小腸',(1010,570));label(d,p(-65,300),'大腸',(180,560));label(d,p(0,430),'直腸・肛門',(1020,790));txt(d,(355,905),'本人の右',30);txt(d,(850,905),'本人の左',30);finish(im,d,'digestive','本人の左右を基準に示す模式図。腹部マッサージ等の手技を指示する図ではありません。')
# Urinary structures and direction; no normal capacity numbers.
im,d=start('尿の通り道：尿管と尿道を区別する')
for cx in [490,910]:
 ell(d,(cx-85,250,cx+85,430),'#bc797d');ell(d,(cx-30,305,cx+50,375),BG,BG,1)
 line(d,[(cx,365),(cx,520),(700+(cx-700)*.32,670)],GOLD,13)
ell(d,(580,620,820,835),'#d8b28d');line(d,[(700,825),(700,930)],GOLD,16)
label(d,(450,320),'腎臓：尿をつくる',(80,170));label(d,(490,500),'尿管',(80,510));label(d,(780,720),'膀胱：尿をためる',(980,690));label(d,(700,900),'尿道',(1020,880));finish(im,d,'urinary','経路の概念図。尿量、容量や個人の排尿状態を示すものではありません。')
# Lateral brain lobes; labels identify the four externally visible lobes only.
im,d=start('大脳の四つの葉：位置を区別する')
mask=Image.new('L',im.size,0);ImageDraw.Draw(mask).ellipse((260,210,1120,800),fill=255)
layer=Image.new('RGB',im.size,'#c797a8');ld=ImageDraw.Draw(layer)
ld.polygon([(650,210),(980,210),(960,510),(650,520)],fill='#9ab7cb',outline=INK,width=4)
ld.polygon([(980,210),(1190,340),(1190,740),(950,710),(960,510)],fill='#b6bc8f',outline=INK,width=4)
ld.polygon([(540,570),(650,520),(960,510),(950,710),(1000,820),(500,820)],fill='#d8bd89',outline=INK,width=4)
im.paste(layer,(0,0),mask);d=ImageDraw.Draw(im);d.ellipse((260,210,1120,800),outline=INK,width=4)
label(d,(430,400),'前頭葉',(90,180));label(d,(750,350),'頭頂葉',(880,140));label(d,(1020,520),'後頭葉',(1140,480));label(d,(700,675),'側頭葉',(650,850));txt(d,(260,875),'前',30);txt(d,(1080,875),'後',30);finish(im,d,'brain-lobes','外から見える四つの葉を簡略化。働きを一対一に固定したり、診断に使ったりしません。')
# Anatomical term distinction only, not genital handling/cleaning operations.
im,d=start('陰嚢・精巣・包皮：別の構造を読む')
d.rounded_rectangle((320,210,540,550),radius=95,fill=SKIN,outline=INK,width=4);ell(d,(310,465,555,690),SKIN);ell(d,(365,505,425,610),'#bf8e8e');ell(d,(440,505,500,610),'#bf8e8e');label(d,(335,570),'陰嚢（袋状の部分）',(70,770));label(d,(395,555),'精巣（内部）',(660,620));
d.rounded_rectangle((860,210,1030,550),radius=70,fill=SKIN,outline=INK,width=4);d.arc((850,425,1040,610),0,180,fill=RED,width=18);label(d,(1020,520),'包皮（先端を覆う皮膚）',(700,785),28);txt(d,(320,140),'陰嚢と内部の精巣',28);txt(d,(860,140),'包皮の位置',28);finish(im,d,'male-terms','用語を区別するための概念図。動かし方や洗浄方法を指示するものではありません。')
# Oral utensil ownership verification is an original visual case, not a procedure.
im,d=start('口腔ケア用品：表示と持ち主を照合する')
for cx,name,colour in [(370,'Aさん',BLUE),(1000,'Bさん',GREEN)]:
 d.rounded_rectangle((cx-200,420,cx+200,800),radius=30,outline=colour,width=7);txt(d,(cx-75,735),name,34)
 d.rounded_rectangle((cx-110,250,cx-80,670),radius=15,fill=colour,outline=INK,width=3);d.rounded_rectangle((cx-130,200,cx-60,295),radius=15,fill='#ffffff',outline=INK,width=3)
 for yy in range(215,280,13):line(d,[(cx-123,yy),(cx-67,yy)],colour,3)
 ell(d,(cx+5,470,cx+135,630),'#f5e7dd');d.arc((cx+20,490,cx+120,605),0,180,fill=INK,width=4)
 txt(d,(cx-165,840),'表示・保管場所・計画を確認',24)
finish(im,d,'oral-ownership','学習用の例。色や置き場所だけで持ち主や使用条件を確定しません。')
print('Built15 total original controlled PNG schematics.')
# Pupils compare the same physical feature; no clinical light test is taught.
im,d=start('瞳孔：広がる方向と狭くなる方向')
for cx,r,word in [(390,105,'広がる方向'),(1010,45,'狭くなる方向')]:
 ell(d,(cx-220,320,cx+220,700),'#ffffff');ell(d,(cx-135,370,cx+135,650),BLUE);ell(d,(cx-r,510-r,cx+r,510+r),INK);txt(d,(cx-115,770),word,34)
txt(d,(230,215),'交感神経',32);txt(d,(830,215),'副交感神経',32);finish(im,d,'pupils','同じ器官での一般的な方向を比べる模式図。神経の検査や薬の選択を指示しません。')
# Distinct grooming objects; the model intentionally does not imply a universal operation.
im,d=start('整容用品：用具と観察する部位を分ける')
# electric shaver silhouette and instruction leaflet
ell(d,(180,225,510,385),'#b2bdc1');d.rounded_rectangle((235,330,455,760),radius=60,fill=BLUE,outline=INK,width=5)
for cx in [260,345,430]:ell(d,(cx-40,255,cx+40,335),'#dce2e0')
ell(d,(315,460,370,520),'#f3e8c9');txt(d,(220,800),'ひげ剃り用具',32)
# nail and finger close-up: nail is placed at distal end, no cutting direction.
d.rounded_rectangle((920,260,1130,760),radius=90,fill=SKIN,outline=INK,width=5);d.rounded_rectangle((955,290,1095,460),radius=40,fill='#faf0e5',outline=RED,width=4);txt(d,(930,800),'爪と周囲の皮膚',30)
# owner/product manual object links the two observations.
d.rectangle((570,380,780,680),fill='#ffffff',outline=INK,width=4)
for yy in [430,480,530,580]:line(d,[(600,yy),(750,yy)],MUTED,4)
txt(d,(580,710),'製品の説明',29);finish(im,d,'grooming','本人の希望、皮膚・爪の状態、製品の説明を確認。操作や切る方向を示す図ではありません。')
print('Built17 total original controlled PNG schematics.')
