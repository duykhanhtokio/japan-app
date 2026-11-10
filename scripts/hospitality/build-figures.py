"""Controlled original instructional diagrams. Source page art is never reused."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json,hashlib,math
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/app/hospitality';OUT.mkdir(parents=True,exist_ok=True)
FONT='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
F=lambda n:ImageFont.truetype(FONT,n)
INK='#203e53';BLUE='#2f7193';GOLD='#b57b23';GREEN='#297b61';RED='#ab493e'
def text(d,xy,t,size=23,color=INK): d.text(xy,t,font=F(size),fill=color)
def person(d,x,y,bow=0,color=BLUE):
 # side-view hip hinge shows the body angle; head and trunk rotate together.
 hip=(x,y+105);theta=math.radians(bow);shoulder=(x+math.sin(theta)*75,y+105-math.cos(theta)*75)
 head=(shoulder[0]+math.sin(theta)*26,shoulder[1]-math.cos(theta)*26)
 d.line([hip,shoulder],fill=color,width=13);d.ellipse((head[0]-14,head[1]-14,head[0]+14,head[1]+14),fill=color)
 d.line([hip,(x-14,y+170)],fill=color,width=10);d.line([hip,(x+16,y+170)],fill=color,width=10)
 d.line([shoulder,(x+math.sin(theta)*95+12,y+105-math.cos(theta)*35)],fill=color,width=7)
def arrow(d,a,b):
 d.line([a,b],fill=GOLD,width=5);ang=math.atan2(b[1]-a[1],b[0]-a[0]);p=[b,(b[0]-17*math.cos(ang-.45),b[1]-17*math.sin(ang-.45)),(b[0]-17*math.cos(ang+.45),b[1]-17*math.sin(ang+.45))];d.polygon(p,fill=GOLD)
def symbol(d,kind,x,y):
 if kind=='room':
  d.rectangle((x+20,y+20,x+205,y+160),outline=BLUE,width=5);d.rectangle((x+45,y+85,x+180,y+130),fill='#b9d7de',outline=BLUE,width=3);d.rectangle((x+55,y+65,x+90,y+92),fill='white',outline=BLUE,width=3);d.line((x+44,y+132,x+44,y+150),fill=BLUE,width=5);d.line((x+180,y+132,x+180,y+150),fill=BLUE,width=5)
 elif kind in ['record','bill','lock','plan']:
  d.rounded_rectangle((x+55,y+5,x+180,y+173),radius=7,fill='white',outline=BLUE,width=4)
  for j in range(4):d.line((x+75,y+40+j*28,x+160,y+40+j*28),fill='#7e9aa4',width=3)
  if kind=='bill':text(d,(x+104,y+118),'¥',38,GOLD)
  if kind=='lock':
   d.arc((x+105,y+80,x+165,y+142),180,360,fill=GREEN,width=6);d.rectangle((x+102,y+112,x+169,y+162),fill=GREEN);d.ellipse((x+130,y+130,x+140,y+140),fill='white')
  if kind=='plan':d.rectangle((x+68,y+110,x+108,y+151),fill='#bbe1cf');d.rectangle((x+119,y+70,x+157,y+151),fill=BLUE)
 elif kind=='counter':
  person(d,x+65,y-8);d.rectangle((x+35,y+104,x+210,y+172),fill='#d7c49c',outline=GOLD,width=4);d.rectangle((x+123,y+62,x+181,y+103),fill='#b9d7de',outline=BLUE,width=4)
 elif kind=='guest':person(d,x+95,y+2);d.rounded_rectangle((x+145,y+88,x+193,y+158),radius=5,fill='#d2a96c',outline=GOLD,width=3)
 elif kind=='phone':
  d.rounded_rectangle((x+62,y+7,x+172,y+173),radius=18,fill='#d7e6eb',outline=BLUE,width=5);d.rectangle((x+77,y+37,x+157,y+127),fill='white');d.arc((x+84,y+47,x+145,y+108),45,235,fill=BLUE,width=10);d.ellipse((x+109,y+143,x+126,y+160),fill=BLUE)
 elif kind=='key':
  d.ellipse((x+30,y+45,x+100,y+115),outline=GOLD,width=12);d.line((x+93,y+80,x+208,y+80),fill=GOLD,width=12);d.line((x+177,y+80,x+177,y+113),fill=GOLD,width=12);d.line((x+202,y+80,x+202,y+103),fill=GOLD,width=12)
 elif kind=='plate':
  d.ellipse((x+60,y+32,x+184,y+155),fill='white',outline=BLUE,width=4);d.ellipse((x+78,y+51,x+166,y+138),outline='#99b9c6',width=3);d.line((x+32,y+36,x+32,y+161),fill=BLUE,width=5);d.line((x+211,y+36,x+211,y+161),fill=BLUE,width=5)
 elif kind=='food':
  d.ellipse((x+30,y+66,x+210,y+154),fill='white',outline=BLUE,width=4)
  for px,py,col in [(85,95,'#8eb66b'),(125,107,'#e6a55e'),(159,91,'#c4725b')]:d.ellipse((x+px-20,y+py-20,x+px+20,y+py+20),fill=col)
 elif kind=='allergy':
  symbol(d,'food',x,y);d.polygon([(x+150,y+12),(x+112,y+82),(x+189,y+82)],fill='#f4d798',outline=RED);text(d,(x+143,y+27),'!',37,RED)
 elif kind=='wash':
  d.line((x+75,y+20,x+156,y+20,x+156,y+61),fill=BLUE,width=8);d.arc((x+35,y+95,x+208,y+189),0,180,fill=BLUE,width=6)
  for dx in [-10,8,26]:d.ellipse((x+145+dx,y+67,x+152+dx,y+80),fill='#75b9db')
  d.rounded_rectangle((x+53,y+104,x+171,y+127),radius=10,fill='#e5c9b2',outline=GOLD,width=3)
 elif kind=='exit':
  d.rectangle((x+85,y+15,x+190,y+170),outline=GREEN,width=6);d.rectangle((x+99,y+25,x+180,y+168),fill='#d5eadf');person(d,x+97,y+2,color=GREEN);arrow(d,(x+64,y+80),(x+22,y+80))
 elif kind=='fire':
  d.polygon([(x+120,y+14),(x+88,y+76),(x+79,y+45),(x+48,y+133),(x+85,y+170),(x+160,y+164),(x+190,y+115),(x+150,y+60),(x+151,y+111)],fill='#d76742');d.polygon([(x+125,y+88),(x+90,y+145),(x+134,y+165),(x+158,y+135)],fill='#f5c567')
 elif kind=='waste':
  for dx,col in [(0,BLUE),(91,GREEN)]:d.rectangle((x+35+dx,y+51,x+103+dx,y+166),fill='#e0e9e5',outline=col,width=4);d.line((x+28+dx,y+43,x+109+dx,y+43),fill=col,width=7)
 elif kind=='wheelchair':
  d.ellipse((x+40,y+94,x+125,y+177),outline=BLUE,width=6);d.ellipse((x+105,y+10,x+138,y+43),fill=BLUE);d.line((x+117,y+52,x+116,y+113,x+170,y+113,x+188,y+158),fill=BLUE,width=10);d.line((x+89,y+56,x+89,y+104,x+139,y+104),fill=BLUE,width=5)
 elif kind=='chart':
  d.line((x+35,y+10,x+35,y+165,x+215,y+165),fill=INK,width=4)
  for dx,h in [(56,70),(105,119),(155,90)]:d.rectangle((x+dx,y+165-h,x+dx+30,y+164),fill=BLUE)
 else:symbol(d,'record',x,y)
def make(lesson,config):
 im=Image.new('RGB',(1200,760),'#fbf7ec');d=ImageDraw.Draw(im);text(d,(40,24),'宿泊 · '+lesson['title'],29)
 kind=config.get('mode','panels')
 if kind=='bows':
  for n,(angle,label) in enumerate([(15,'会釈'),(30,'敬礼'),(45,'最敬礼')]):
   x=145+n*355;person(d,x,170,angle);d.line((x,205,x,365),fill='#bfc8c4',width=2);text(d,(x-20,420),f'{label}  約{angle}°',28)
  text(d,(75,510),'背中を伸ばす → 腰から上体を倒す → 一度止める',30)
 elif kind=='two-route-monitoring':
  text(d,(50,100),'二方向の経路（学習用の例）',28)
  text(d,(690,100),'監視と保守を分ける',28)
  d.rounded_rectangle((45,155,630,540),18,fill='white',outline='#b7c8c9',width=3)
  d.rectangle((85,345,590,450),fill='#e7ede4',outline=GREEN,width=3)
  d.rectangle((252,205,420,300),fill='#e4edf1',outline=BLUE,width=3)
  text(d,(287,230),'客室',27);d.line((336,300,336,398),fill=GREEN,width=5)
  for x,label in [(90,'階段A'),(510,'階段B')]:
   d.rectangle((x,205,x+80,305),fill='#e9dfc5',outline=GOLD,width=3)
   for j in range(4):d.line((x+8,225+j*18,x+70,225+j*18),fill=GOLD,width=3)
   text(d,(x-3,165),label,23)
  arrow(d,(330,398),(130,398));arrow(d,(130,390),(130,312))
  arrow(d,(343,398),(550,398));arrow(d,(550,390),(550,312))
  text(d,(85,478),'出発位置と途中の状況を確認',25)
  d.rounded_rectangle((675,155,1160,540),18,fill='white',outline='#b7c8c9',width=3)
  text(d,(705,188),'夜勤担当',26);text(d,(993,188),'早番担当',26)
  arrow(d,(840,206),(975,206))
  d.ellipse((868,258,955,345),fill='#d8e7e8',outline=BLUE,width=4)
  text(d,(882,280),'異常',26)
  text(d,(709,375),'区域・時刻・連絡先・対応状況',24)
  d.line((710,430,1120,430),fill='#b7c8c9',width=2)
  text(d,(712,455),'専門担当者：点検・原因確認',24)
  text(d,(58,590),'経路は実施設の消防計画で確認する。',28)
  text(d,(58,640),'交代時の監視の引継ぎと、専門担当者の保守は別の仕事。',28)
 elif kind=='accessible-service':
  # Spatially explicit examples rather than a generic wheelchair icon.
  for x in [35,430,825]:
   d.rounded_rectangle((x,120,x+350,595),16,fill='white',outline='#b7c8c9',width=3)
  text(d,(62,140),'目の高さを合わせる',25)
  symbol(d,'wheelchair',45,240)
  d.ellipse((290,240,321,271),fill=GREEN)
  d.line((306,279,285,345,325,390),fill=GREEN,width=9)
  d.line((285,345,260,390),fill=GREEN,width=9)
  d.line((189,255,290,255),fill=GOLD,width=3)
  text(d,(65,450),'話しやすい位置を確認',23)
  text(d,(456,140),'声で希望を尋ねる',25)
  person(d,495,285);person(d,665,285,color=GREEN)
  d.line((510,385,535,455),fill=GOLD,width=4)
  d.rounded_rectangle((460,200,765,265),10,fill='#edf4ee',outline=GREEN,width=2)
  text(d,(475,213),'お手伝いは必要ですか',23)
  text(d,(457,495),'無言で行先を決めない',23)
  text(d,(851,140),'希望する席を確認',25)
  d.rectangle((850,230,1145,475),outline=BLUE,width=3)
  d.rectangle((870,460,938,490),fill='white')
  text(d,(850,520),'出入口',22)
  for x,y,label in [(925,390,'A'),(1070,290,'B')]:
   d.ellipse((x-27,y-27,x+27,y+27),fill='#e9dfc5',outline=GOLD,width=3)
   text(d,(x-10,y-16),label,24)
   for dx in [-43,32]:d.rectangle((x+dx,y-13,x+dx+10,y+13),outline=BLUE,width=2)
  arrow(d,(903,475),(925,423))
  text(d,(65,645),'近い席Aも選択肢。本人の希望を聞いてから案内する。',28)
 elif kind=='honorific':
  for x in [35,430,825]:d.rounded_rectangle((x,125,x+350,610),16,fill='white',outline='#b7c8c9',width=3)
  for x,label in [(65,'尊敬語'),(460,'謙譲語'),(855,'丁寧語')]:text(d,(x,145),label,31)
  person(d,135,235);arrow(d,(200,300),(290,235));text(d,(65,445),'相手の行動を敬う',25);text(d,(65,500),'お客様がいらっしゃる',23)
  person(d,525,235,30);text(d,(460,445),'自分側の行動で敬意',25);text(d,(460,500),'係の者が伺う',24)
  person(d,900,315);d.rounded_rectangle((850,220,1150,285),12,fill='#edf4ee',outline=GREEN,width=3)
  text(d,(868,230),'です・ます・ございます',20);text(d,(855,475),'聞き手に丁寧に伝える',23)
  text(d,(65,650),'誰の行動かと、聞き手への伝え方を区別する。',28)
 elif kind=='guiding':
  text(d,(65,105),'同じ進行方向を向いて案内する',30)
  arrow(d,(610,540),(610,185));text(d,(665,195),'進行方向',25)
  person(d,390,230);text(d,(310,440),'従業員：左斜め前',26)
  person(d,780,390);text(d,(750,590),'お客様',26)
  d.line((515,370,745,470),fill=GOLD,width=4);text(d,(605,390),'２～３歩',24)
 elif kind in ['washoku','western']:
  d.rounded_rectangle((80,115,1120 if kind=='washoku' else 790,590),20,fill='#e9dfc5',outline=GOLD,width=4)
  def plate(cx,cy,label,r=70):
   d.ellipse((cx-r,cy-r,cx+r,cy+r),fill='white',outline=BLUE,width=4);text(d,(cx-r+8,cy-15),label,23)
  if kind=='washoku':
   plate(380,440,'ご飯');plate(815,440,'汁物')
   plate(310,235,'副菜1');plate(600,235,'副菜2');plate(890,235,'主菜')
   text(d,(135,555),'三菜は主菜と副菜２品の例。香の物とは区別する。',22)
  else:
   plate(435,365,'主皿',94);plate(230,235,'パン',49)
   d.line((290,320,290,460),fill=BLUE,width=7);text(d,(205,490),'フォーク',23)
   for dx in [-12,0,12]:d.line((290+dx,320,290+dx,346),fill=BLUE,width=3)
   d.line((590,300,590,460),fill=BLUE,width=7);text(d,(550,490),'ナイフ',23)
   d.line((715,325,715,460),fill=BLUE,width=7);d.ellipse((696,282,734,330),outline=BLUE,width=4);text(d,(665,490),'スプーン',23)
   d.line((365,190,520,190),fill=BLUE,width=7);text(d,(360,130),'デザート用',23)
   text(d,(145,550),'客側から見た左右。道具は外側から。',23)
   # The old caption described these signs but the bitmap omitted them.
   for cy,label in [(265,'食事中の目安'),(485,'終了の目安')]:
    text(d,(840,cy-105),label,24)
    d.ellipse((900,cy-66,1080,cy+66),fill='white',outline=BLUE,width=3)
   d.line((976,238,945,302),fill=BLUE,width=6)
   d.line((1005,238,1038,302),fill=BLUE,width=6)
   for dx in [-7,0,7]:d.line((976+dx,238,970+dx,251),fill=BLUE,width=2)
   d.line((985,484,1042,523),fill=BLUE,width=6)
   d.line((995,472,1052,511),fill=BLUE,width=6)
   text(d,(853,575),'下げる前に本人へ確認',22)
  cx=600 if kind=='washoku' else 435
  text(d,(cx-115,640),'お客様の位置',30);arrow(d,(cx,630),(cx,585))
 elif kind=='appearance':
  person(d,585,175);d.rectangle((535,260,645,350),fill='#adcbd4',outline=BLUE,width=4)
  for a,b,label in [((570,180),(285,150),'髪：清潔にまとめる'),((615,305),(830,260),'手：爪・傷を確認'),((545,300),(270,390),'制服：汚れを点検'),((585,352),(810,490),'靴：清潔・動きやすさ')]:
   arrow(d,a,b);text(d,(b[0]-110,b[1]-40),label,25)
 elif kind=='serving':
  symbol(d,'plate',220,180);text(d,(205,425),'料理の正面を客側へ',27);arrow(d,(350,370),(350,530));text(d,(290,555),'お客様',28)
  d.polygon([(800,160),(1000,160),(965,360),(835,360)],outline=BLUE,fill='#d8e7e8');d.line((900,360,900,430),fill=BLUE,width=6);d.line((850,430,950,430),fill=BLUE,width=6)
  d.rounded_rectangle((860,295,1005,330),12,fill='#e1c1a2',outline=GOLD,width=3);text(d,(760,480),'下半分を支える',28);text(d,(760,530),'飲み口には触れない',27)
 elif kind=='revenue':
  text(d,(80,110),'同じ日・販売可能50室で比較する',30)
  for x,n,price,rev,color in [(85,30,15000,450000,BLUE),(650,40,12000,480000,GREEN)]:
   symbol(d,'room',x+110,170);text(d,(x,370),f'{n}室 × {price:,}円 = {rev:,}円',29)
   d.rectangle((x,430,x+(rev/480000)*450,480),fill=color)
   text(d,(x,515),f'OCC {n*2}% / RevPAR {rev//50:,}円',28)
  text(d,(80,610),'稼働率・単価・客室売上を合わせて比較する。',29)
 elif kind=='beverages':
  for x,col in [(170,BLUE),(760,GREEN)]:
   d.rounded_rectangle((x+50,180,x+145,450),20,fill='#d0e0d9',outline=col,width=5);d.rectangle((x+72,130,x+122,190),fill='#d0e0d9',outline=col,width=4)
  text(d,(75,490),'日本酒：米・麹・水',29);text(d,(75,540),'冷酒・常温・燗酒',27)
  text(d,(680,490),'ワイン：ぶどう',29);text(d,(680,540),'品種・産地を確認',27)
 elif kind=='costs':
  text(d,(70,110),'売上200万円を、同じ分母にして考える',31)
  x=80;y=245;total=1040
  for width,col,label in [(64/200*total,BLUE,'食材費64万円'),(52/200*total,GREEN,'人件費52万円'),(84/200*total,'#d9c698','その他84万円')]:
   d.rectangle((x,y,x+width,y+130),fill=col);text(d,(x+12,y+155),label,25);x+=width
  text(d,(80,490),'食材原価率：64 ÷ 200 × 100 = 32%',30)
  text(d,(80,550),'FL率：(64 + 52) ÷ 200 × 100 = 58%',30)
  text(d,(80,625),'その他には諸経費なども含まれ、全額が利益ではない。',25)
 elif kind=='metrics':
  text(d,(70,103),'同じ１日：販売可能40室・販売30室・客室売上360,000円',28)
  for n,(a,b,c) in enumerate([('OCC','30 ÷ 40 × 100','75%'),('ADR','360,000 ÷ 30','12,000円'),('RevPAR','360,000 ÷ 40','9,000円')]):
   x=45+n*390;d.rounded_rectangle((x,175,x+365,455),16,fill='white',outline='#aac1c5',width=3);symbol(d,'chart',x+68,190);text(d,(x+20,370),a,27);text(d,(x+20,415),b,21);text(d,(x+30,490),c,34,GREEN)
  text(d,(70,567),'0.75 × 12,000円 = 9,000円 （75 × 12,000円ではない）',27)
 else:
  panels=config.get('panels',[('guest','確認'),('record','記録'),('counter','共有')])
  for n,(symbol_name,label) in enumerate(panels):
   x=45+n*390;d.rounded_rectangle((x,145,x+350,480),16,fill='white',outline='#b7c8c9',width=3);symbol(d,symbol_name,x+50,185)
   # Labels are controlled, brief, and tied to the pictured objects/actions.
   for j,line in enumerate(label.split('|')):text(d,(x+22,393+j*35),line,25)
   if n<2:arrow(d,(x+355,298),(x+383,298))
  for j,line in enumerate(config.get('note','確認する情報と、次に引き継ぐ相手を説明しましょう。').split('|')):text(d,(60,535+j*42),line,27)
 # Learner caption is outside bitmap for readability and localization.
 file=OUT/(lesson['id']+'.png');im.save(file,optimize=True)
 return {'lessonId':lesson['id'],'imageId':lesson['illustration']['id'],'path':str(file.relative_to(ROOT)),'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'keyObjectiveId':lesson['illustration']['keyObjectiveId'],'caption':lesson['illustration']['caption'],'alt':lesson['illustration']['alt'],'rights':'original controlled diagram; no source artwork','contentReviewed':False,'renderVerified':False}
configs=json.loads((ROOT/'docs/ssw-workspace/hospitality/figure-designs.json').read_text())
manifest=[];registry="import type {ImageSourcePropType} from 'react-native';\nconst figures:Record<string,()=>ImageSourcePropType>={\n"
for group in ['front','planning','service','restaurant','safety']:
 for lesson in json.loads((ROOT/f'src/data/hospitality/{group}.json').read_text())['lessons']:
  if lesson['id'] not in configs:raise ValueError('Missing authored figure design '+lesson['id'])
  manifest.append(make(lesson,configs[lesson['id']]))
  registry+=f" '{lesson['id']}':()=>require('../../../assets/app/hospitality/{lesson['id']}.png'),\n"
registry+="};\nexport function hotelIllustration(id:string):ImageSourcePropType|null{return figures[id]?.()??null;}\n"
(ROOT/'src/data/hospitality/illustrations.ts').write_text(registry)
(ROOT/'docs/ssw-workspace/hospitality/image-manifest.json').write_text(json.dumps({'images':manifest},ensure_ascii=False,indent=2)+'\n')
print('Controlled figures',len(manifest))
