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
