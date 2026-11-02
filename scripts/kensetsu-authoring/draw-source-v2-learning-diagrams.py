from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,shutil
R=Path(__file__).resolve().parents[2];D=R/'assets/kensetsu/foreman';D.mkdir(exist_ok=True)
font=R/'assets/app/fonts/NotoSansJP-Medium.ttf'
def f(n):return ImageFont.truetype(str(font),n)
def arrow(d,pts,color,width=12):
 d.line(pts,fill=color,width=width,joint='curve');x,y=pts[-1];u,v=pts[-2];dx=x-u;dy=y-v;le=(dx*dx+dy*dy)**.5;dx/=le;dy/=le;d.polygon([(x,y),(x-25*dx+12*dy,y-25*dy-12*dx),(x-25*dx-12*dy,y-25*dy+12*dx)],fill=color)
im=Image.new('RGB',(1200,720),'#f7f8fa');d=ImageDraw.Draw(im);d.text((38,22),'搬入路を変えた後、どこを確認する？',font=f(34),fill='#193650');d.text((40,80),'学習用の平面模式図・寸法や安全基準を示す図ではありません',font=f(23),fill='#48596a')
d.rectangle((80,155,1120,625),fill='#e6ebee',outline='#4a5964',width=3)
for x in [180,430,850]:
 d.rectangle((x,180,x+170,275),fill='#b09a81',outline='#554c42',width=3);d.text((x+20,202),'資材棚',font=f(26),fill='#252525')
# Actual spatial crossings, not decorative arrows/text-only panels.
arrow(d,[(110,500),(1040,500)],'#2868a2');d.text((100,540),'歩行者の経路',font=f(27),fill='#174a78')
arrow(d,[(700,595),(700,330),(560,330)],'#b45b20');d.text((750,385),'変更後の搬入路',font=f(27),fill='#8b431a')
d.rectangle((650,410,745,465),fill='#d89a61',outline='#58391c',width=4)
for x in [665,730]:d.ellipse((x-9,459,x+9,477),fill='#333')
d.line((745,420,770,397),fill='#58391c',width=5);d.text((790,440),'台車',font=f(24),fill='#58391c')
d.ellipse((275,480,315,520),fill='#2868a2',outline='white',width=3);d.ellipse((680,480,720,520),outline='#be2222',width=6)
d.text((56,660),'観察：経路・視界・同時作業　／　判断：未確認事項と実施結果',font=f(26),fill='#193650');im.save(D/'route-crossing-review.png')
im=Image.new('RGB',(1200,720),'#faf9f4');d=ImageDraw.Draw(im);d.text((38,22),'資材棚：必要数と取出し順を分けて考える',font=f(32),fill='#193650');d.text((40,80),'学習用の棚の模式図・耐荷重や保管規格を示す図ではありません',font=f(23),fill='#48596a')
# Shelf perspective with bins and offcuts outside; visible positions support the distinction.
for x in [160,1010]:d.rectangle((x,160,x+20,610),fill='#637481')
for y in [310,500,590]:d.rectangle((160,y,1030,y+18),fill='#637481')
for x,num,col in [(230,1,'#88b9c9'),(490,2,'#e0b575'),(750,3,'#aab9a0')]:
 d.polygon([(x,210),(x+150,210),(x+175,235),(x+25,235)],fill=col,outline='#445');d.rectangle((x+25,235,x+175,309),fill=col,outline='#445',width=2);d.text((x+185,250),f'{num}',font=f(29),fill='#193650')
 for j in range(num+1):d.line((x+40+25*j,285,x+40+25*j,245),fill='#42494c',width=7)
d.text((215,350),'① 必要な数量を決める',font=f(27),fill='#193650');d.text((215,397),'② 作業の順に、取出しやすく置く',font=f(27),fill='#193650')
d.rectangle((490,520,710,590),fill='#b9ab93',outline='#655642',width=2)
for a in [(520,545,560,565),(575,540,620,568),(637,542,680,562)]:d.line(a,fill='#755734',width=8)
d.text((735,530),'切りくず',font=f(25),fill='#58432b');d.text((40,660),'清掃して終わり？　翌日の状態とルールの理解も確認する',font=f(28),fill='#193650');im.save(D/'shelf-five-roles.png')
im=Image.new('RGB',(1200,720),'#f7f8fa');d=ImageDraw.Draw(im);d.text((40,25),'似た対象：返事と、対象の理解は同じ？',font=f(34),fill='#193650');d.text((40,80),'識別を考える模式図・操作や変更を指示する図ではありません',font=f(23),fill='#48596a')
for x,label in [(300,'A12'),(850,'A21')]:
 d.rectangle((x-35,170,x+35,555),fill='#aac3ca',outline='#3f5964',width=4);d.ellipse((x-85,300,x+85,470),fill='#d5e4e8',outline='#3f5964',width=5);d.ellipse((x-60,325,x+60,445),outline='#3f5964',width=9);d.line((x-60,385,x+60,385),fill='#3f5964',width=7);d.line((x,325,x,445),fill='#3f5964',width=7);d.rectangle((x-90,200,x+90,265),fill='white',outline='#193650',width=3);d.text((x-48,203),label,font=f(38),fill='#193650')
d.text((55,605),'確認する情報：識別名・場所・適用時点・交代者への伝達',font=f(29),fill='#193650');d.text((55,660),'同じ色や似た名前だけで、対象を決めない',font=f(28),fill='#193650');im.save(D/'identification-handover.png')
im=Image.new('RGB',(1200,720),'#faf9f4');d=ImageDraw.Draw(im);d.text((40,25),'二つの図書：版と取合いの確認',font=f(35),fill='#193650');d.text((40,80),'検討用の平面模式図・承認図や実際の寸法を示す図ではありません',font=f(23),fill='#48596a')
for x,title in [(60,'平面図：旧版'),(650,'配管施工図：新版')]:
 d.text((x+15,145),title,font=f(28),fill='#193650');d.rectangle((x,210,x+490,555),outline='#68757c',width=12);d.rectangle((x+210,310,x+280,450),fill='#929ba0',outline='#4b5256',width=3);d.text((x+205,470),'柱',font=f(26),fill='#424a4e')
arrow(d,[(90,280),(510,280)],'#2677a5',width=16);arrow(d,[(680,380),(1100,380)],'#2677a5',width=16);d.rectangle((855,350,940,410),outline='#b44036',width=5);d.text((50,610),'経路が違う。柱との位置関係は、誰と何を照合する？',font=f(29),fill='#193650');d.text((50,660),'図書の整合を確認してから、施工図・手順・指示へ反映する',font=f(27),fill='#193650');im.save(D/'drawing-version-coordination.png')
im=Image.new('RGB',(1200,720),'#f7f8fa');d=ImageDraw.Draw(im);d.text((40,25),'入場前に、本人と場所を確かめる',font=f(35),fill='#193650');d.text((40,80),'架空の現場案内図・実際の通路や避難計画ではありません',font=f(24),fill='#48596a')
d.rectangle((80,150,1120,600),fill='#e7ede8',outline='#586c62',width=4);d.rectangle((130,190,430,360),fill='#c6cfcd',outline='#586c62',width=4);d.text((165,248),'作業場所',font=f(32),fill='#193650');d.rectangle((720,190,1050,360),fill='#dac1a3',outline='#8e6847',width=4)
for x in range(730,1040,30):d.line((x,195,min(x+90,1045),min(355,195+(1045-x)*160/90)),fill='#c09169',width=3)
d.rectangle((735,230,1035,300),fill='#fff6ec');d.text((750,240),'立入禁止区域',font=f(30),fill='#8e3926');d.ellipse((580,430,700,550),fill='#c5d7c6',outline='#46744c',width=4);d.text((553,565),'集合場所A',font=f(28),fill='#295136');d.rectangle((150,460,390,555),fill='white',outline='#193650',width=4);d.text((177,485),'連絡先掲示',font=f(29),fill='#193650');d.text((835,510),'入口',font=f(33),fill='#193650');d.rectangle((900,585,1020,610),fill='#f7f8fa');arrow(d,[(970,675),(970,600)],'#355f84',width=9);d.text((40,658),'案内を配っただけで、区域・連絡・退避の理解は分からない',font=f(27),fill='#193650');im.save(D/'site-entry-confirmation.png')
im=Image.new('RGB',(1200,720),'#faf9f4');d=ImageDraw.Draw(im);d.text((40,25),'回転刃と手袋：巻込みのおそれを確認',font=f(34),fill='#193650');d.text((40,80),'機能を考える模式図・機械の操作や実際の点検手順ではありません',font=f(23),fill='#48596a')
# A static simplified drilling machine; no hand or operator is shown near the bit.
d.rectangle((180,580,610,615),fill='#707b85',outline='#37434d',width=4);d.rectangle((500,180,550,580),fill='#a2adb5',outline='#37434d',width=4);d.rounded_rectangle((250,165,565,265),radius=20,fill='#b5c4cc',outline='#37434d',width=4);d.rectangle((300,265,350,315),fill='#697d89');d.line((325,315,325,425),fill='#36434c',width=14)
for y in range(330,420,18):d.line((312,y,338,y+13),fill='#b7c6ce',width=4)
d.rectangle((220,460,555,485),fill='#91a0aa',outline='#37434d',width=4);d.rectangle((290,438,410,458),fill='#c6b391',outline='#746347',width=3);d.text((220,515),'加工部（模式）',font=f(25),fill='#193650');d.ellipse((280,305,372,435),outline='#ba4237',width=6)
# Standalone glove pictogram, crossed out only under the stated risk condition.
pts=[(850,425),(815,375),(815,292),(838,292),(842,342),(848,230),(873,230),(875,335),(884,218),(908,218),(910,335),(920,244),(944,244),(942,355),(975,300),(996,312),(965,390),(936,425),(936,500),(850,500)]
d.polygon(pts,fill='#d8c6a6',outline='#746347',width=4);d.ellipse((755,190,1055,525),outline='#ba4237',width=8);d.line((785,225,1025,495),fill='#ba4237',width=9);d.text((700,545),'巻込みのおそれがある場合',font=f(26),fill='#8e3926');d.text((40,658),'手袋を外せば操作できる、という図ではない。条件と対策を確認する',font=f(26),fill='#193650');im.save(D/'glove-entanglement-condition.png')
im=Image.new('RGB',(1200,720),'#f7f8fa');d=ImageDraw.Draw(im);d.text((40,25),'服だけで、暑熱対策は完了する？',font=f(35),fill='#193650');d.text((40,80),'架空の作業場所と休憩場所・数値や対策の効果を保証する図ではありません',font=f(22),fill='#48596a')
d.ellipse((65,155,190,280),fill='#eab85c',outline='#ca8e26',width=3)
import math
for a in range(0,360,45):
 t=math.radians(a);d.line((127+78*math.cos(t),217+78*math.sin(t),127+96*math.cos(t),217+96*math.sin(t)),fill='#dba33a',width=6)
d.rectangle((80,405,575,570),fill='#ded0bc',outline='#947d5c',width=4);d.rectangle((150,365,420,405),fill='#a9b7be',outline='#68757c',width=3);d.text((170,462),'作業場所',font=f(34),fill='#193650');d.text((175,520),'WBGTを確認',font=f(25),fill='#193650')
d.rectangle((725,230,1085,575),fill='#dce8eb',outline='#557383',width=4);d.polygon([(690,230),(905,150),(1120,230)],fill='#7898a8',outline='#557383');d.rectangle((790,315,1020,465),fill='#f9fcfd',outline='#557383',width=3);d.rectangle((780,480,1030,510),fill='#9aafa6');d.rectangle((800,510,820,560),fill='#9aafa6');d.rectangle((990,510,1010,560),fill='#9aafa6');d.text((800,257),'休憩場所',font=f(29),fill='#193650');d.text((785,365),'使える時間？',font=f(27),fill='#193650');d.text((40,658),'衣服の機能・現場環境・作業と休憩・連絡の運用を分けて確認',font=f(27),fill='#193650');im.save(D/'heat-work-rest-conditions.png')
