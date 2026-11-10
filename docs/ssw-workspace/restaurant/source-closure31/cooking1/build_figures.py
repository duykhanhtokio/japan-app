"""Original geometrical teaching illustrations; no copied source illustration pixels/paths."""
from pathlib import Path
import json,hashlib,html,math
import cairosvg
from PIL import Image
ROOT=Path(__file__).resolve().parents[5];OUT=Path(__file__).resolve().parent;DEST=ROOT/'assets/restaurant/source31/cooking1';DEST.mkdir(parents=True,exist_ok=True)
INK='#284756';STEEL='#bacbd1';DARK='#57717b';BLUE='#24839a';RED='#bd6245';LIGHT='#edf5f2';GOLD='#d2aa68'
class S:
 def __init__(self):self.a=[]
 def rect(self,x,y,w,h,f=STEEL,rx=0,stroke=INK):self.a.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{f}" stroke="{stroke}" stroke-width="3"/>')
 def line(self,x,y,xx,yy,c=INK,w=4):self.a.append(f'<line x1="{x}" y1="{y}" x2="{xx}" y2="{yy}" stroke="{c}" stroke-width="{w}"/>')
 def ellipse(self,x,y,rx,ry,f=STEEL):self.a.append(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{f}" stroke="{INK}" stroke-width="3"/>')
 def path(self,d,f='none',c=INK):self.a.append(f'<path d="{d}" fill="{f}" stroke="{c}" stroke-width="4" stroke-linejoin="round"/>')
 def text(self,x,y,t,size=28):self.a.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{INK}" text-anchor="middle">{html.escape(t)}</text>')
 def group(self,x,y,scale=1):self.a.append(f'<g transform="translate({x},{y}) scale({scale})">')
 def end(self):self.a.append('</g>')
 def leader(self,x,y,tx,ty,label):self.line(x,y,tx,ty,BLUE,2);self.ellipse(x,y,4,4,BLUE);self.text(tx,ty-10,label)
def legs(s):
 for x in [25,205]:s.line(x,185,x,218,DARK,7)
def cabinet(s,doors=1,glass=False):
 s.rect(10,20,220,180);legs(s)
 for i in range(doors):
  xx=18+i*204/doors;s.rect(xx,42,198/doors,145,LIGHT if glass else STEEL,3);s.line(xx+15,85,xx+15,120,DARK,6)
  if glass:
   for y in [90,130,165]:s.line(xx+3,y,xx+194/doors,y,DARK,2)
 s.rect(25,27,38,10,BLUE)
def machine(s,k):
 if k in ['gas','ih','chinese','griddle','noodle','fryer']:
  s.rect(15,90,210,85);legs(s);s.rect(12,65,216,40,DARK)
  if k=='griddle':s.rect(20,60,200,15,LIGHT);s.rect(20,35,200,20);s.rect(30,48,180,30,LIGHT)
  elif k in ['noodle','fryer']:
   for x in [55,145]:
    s.rect(x,65,60,30,LIGHT);s.line(x+40,68,x+65,35,DARK,6)
    for dx in range(4):s.line(x+8+dx*12,73,x+8+dx*12,90,BLUE,2)
   if k=='noodle':
    for x in [65,145]:s.ellipse(x,78,20,12,LIGHT);s.rect(x-15,78,30,30,LIGHT,10);s.path(f'M{x} 55 q-9 -12 0 -24',c=BLUE)
   else:
    for x in [60,150]:s.line(x,72,x+40,90,RED,2)
  elif k=='chinese':
   s.ellipse(120,77,75,23,DARK);s.path('M40 62 Q120 155 200 62',STEEL);s.line(145,65,220,25,DARK,9)
  else:
   for x in [65,170]:
    s.ellipse(x,78,36,12,LIGHT);s.ellipse(x,78,21,7,BLUE if k=='ih' else DARK)
    if k=='gas':s.path(f'M{x-12} 70 l12 -20 l12 20',RED)
  for x in [50,120,190]:s.ellipse(x,130,8,8,RED if k=='gas' else DARK)
 elif k in ['combi','steam','standing-rice','grill']:
  cabinet(s,1,True)
  if k=='grill':
   for x in range(50,210,25):s.line(x,58,x-12,78,RED,7)
  elif k=='standing-rice':
   for y in [70,115,160]:s.rect(45,y,140,24,LIGHT,4);s.rect(95,y+8,40,6,DARK)
  elif k=='combi':
   s.ellipse(175,112,25,30,LIGHT)
   for i in range(4):s.line(175,112,175+20*math.cos(i*math.pi/2),112+22*math.sin(i*math.pi/2),BLUE,6)
  else:
   for x in [70,120,170]:s.path(f'M{x} 145 q-18 -20 0 -40 q18 -20 0 -40',c=BLUE)
 elif k in ['rice','warmer']:
  s.rect(35,75,170,110,STEEL,38);s.ellipse(120,75,85,25,LIGHT);s.rect(96,40,48,20,DARK,8);s.rect(90,135,60,30,DARK,5)
  if k=='rice':s.rect(104,142,32,12,RED);s.path('M105 65 q-12 -20 0 -30',c=BLUE)
  else:s.rect(50,72,20,30,DARK,6);s.rect(170,72,20,30,DARK,6);s.rect(104,142,32,12,GOLD)
 elif k=='braise':
  s.rect(15,95,210,80);legs(s);s.rect(25,70,185,45,LIGHT);s.path('M25 70 L25 20 L200 20 L210 70',STEEL);s.ellipse(220,120,18,18,DARK)
 elif k in ['conveyor-oven','conveyor-washer']:
  s.rect(50,30,150,125,STEEL,4);s.rect(50,85,150,48,DARK);s.rect(0,126,250,20,STEEL)
  for x in range(0,250,18):s.line(x,130,x+8,141,DARK,2)
  legs(s)
  if k=='conveyor-washer':
   for x in [20,80,140,205]:s.ellipse(x,120,10,25,LIGHT)
   for x in [70,110,150]:s.line(x,60,x-8,85,BLUE,3)
  else:
   for y in [55,70]:s.line(65,y,180,y,RED,6)
 elif k=='kettle':
  s.path('M35 75 Q120 225 205 75 Z',STEEL);s.ellipse(120,75,85,23,LIGHT);s.rect(20,100,15,100,DARK);s.rect(205,100,15,100,DARK);s.ellipse(220,93,20,20,STEEL);s.line(220,73,220,113);s.line(200,93,240,93);s.rect(95,45,50,16,DARK,7)
 elif k in ['fridge','blast','vacuum-cool','sterilizer','showcase']:
  cabinet(s,2 if k in ['fridge','showcase'] else 1,k=='showcase')
  if k in ['blast','vacuum-cool']:
   for y in [80,110,140,170]:s.line(55,y,180,y,DARK,3)
   if k=='blast':
    s.ellipse(160,68,20,20,LIGHT)
    for dy in [0,35,70]:s.path(f'M70 {90+dy} l-25 0 l10 -8 m-10 8 l10 8',c=BLUE)
   else:
    s.ellipse(193,32,18,18,LIGHT);s.line(193,32,184,21,RED);s.path('M230 75 h20 v100 h-20',c=BLUE)
  if k=='sterilizer':
   s.line(40,60,190,60,BLUE,9)
   for x in range(50,200,30):s.line(x,70,x,100,BLUE,2)
 elif k=='table-fridge':
  s.rect(0,50,240,15,LIGHT);s.rect(10,65,220,100);s.rect(18,78,93,77);s.rect(127,78,93,77)
  for x in [40,145]:s.line(x,90,x+45,90,DARK,6)
  for x in [25,210]:s.line(x,165,x,200,DARK,6)
 elif k=='walkin':
  s.path('M20 45 L165 20 L230 55 L230 200 L20 200 Z',STEEL);s.rect(45,65,100,135,LIGHT);s.line(130,120,130,150,DARK,7);s.path('M165 20 V200',c=DARK);s.line(45,65,145,65,BLUE,6)
 elif k=='ice':
  s.rect(20,45,200,150);s.rect(20,45,200,35,DARK);s.rect(40,94,160,62,LIGHT);s.path('M40 94 L70 130 H200',STEEL)
  for x in [95,125,155]:s.rect(x,125,18,18,'#d6f1f5',3)
 elif k=='small-washer':
  s.rect(25,70,190,130);s.rect(35,105,170,80,LIGHT);s.path('M35 185 L10 220 H200 L205 185',STEEL);s.rect(45,80,45,10,BLUE)
 elif k=='hood-washer':
  s.rect(35,130,170,65);legs(s);s.rect(35,40,170,75,LIGHT);s.line(25,45,25,155,DARK,7);s.line(215,45,215,155,DARK,7);s.line(25,45,215,45,DARK,6)
  for x in [70,110,150]:s.ellipse(x,130,9,24,LIGHT)
 elif k=='slicer':
  s.rect(25,170,190,25);s.rect(75,120,50,50);s.ellipse(140,95,65,65,LIGHT);s.ellipse(140,95,45,45,STEEL);s.path('M20 115 L75 75 L100 105 L50 150 Z',STEEL);s.line(30,110,15,55,DARK,7)
 elif k=='small-cutter':
  s.rect(55,80,130,100);s.rect(65,55,110,35,DARK);s.path('M145 65 L160 10 L185 18 L165 65',LIGHT);s.path('M70 160 l-20 20 l-30 0',c=BLUE);s.rect(30,180,60,15,GOLD)
 elif k=='cutter-mixer':
  s.rect(45,170,150,30,DARK);s.rect(65,80,115,90,LIGHT,20);s.ellipse(122,80,58,15,STEEL);s.rect(100,40,45,35,DARK);s.line(122,105,122,155,DARK,6);s.line(85,145,160,145,RED,6)
 elif k=='peeler':
  s.rect(45,80,150,100,LIGHT,20);s.ellipse(120,80,75,20);s.rect(72,35,95,35,DARK,15);s.rect(30,165,180,35,DARK);s.rect(180,120,35,30,STEEL)
  for x in [85,115,145]:s.ellipse(x,110,12,10,GOLD)
 elif k=='vacuum-pack':
  s.rect(30,100,180,95);s.rect(40,75,160,35,DARK);s.path('M35 75 L45 20 H190 L205 75 Z',LIGHT);s.rect(65,95,110,35,'#d4ead6',3);s.line(50,110,190,110,RED,5);s.rect(80,150,70,20,BLUE,4)
 elif k=='hand-dispenser':
  s.rect(70,25,105,150,DARK,25);s.rect(88,60,70,75,LIGHT,8);s.rect(105,80,34,45,'#cce5df',5);s.line(122,125,122,152,BLUE,5);s.path('M30 185 h110 q40 -5 55 -25 l-15 -10 q-25 25 -65 18 l-35 -13 Z',GOLD)
def save(name,title,s,w=1400,h=950):
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}"><rect width="{w}" height="{h}" fill="#fffdf7"/><g font-family="Noto Sans CJK JP, sans-serif"><text x="50" y="65" font-size="36" fill="{INK}">{html.escape(title)}</text>'+''.join(s.a)+f'<text x="{w/2}" y="{h-28}" text-anchor="middle" font-size="24" fill="{INK}">{('部位の概略図。解体手順や正確な切出し境界を示しません。' if name.startswith('meat-') else '独自の模式図。製品の能力・操作は実物と説明書で確認します。')}</text></g></svg>'
 sp=DEST/(name+'.svg');pp=DEST/(name+'.png');sp.write_text(svg);cairosvg.svg2png(bytestring=svg.encode(),write_to=str(pp))
 with Image.open(pp) as im:im.convert('RGB').save(pp,optimize=True)
 return {'id':'rst31-cooking1-fig-'+name,'assetFile':str(pp.relative_to(ROOT)),'svgFile':str(sp.relative_to(ROOT)),'width':w,'height':h,'sha256':hashlib.sha256(pp.read_bytes()).hexdigest(),'captionJa':title,'altJa':title+'の形と特徴を比較する模式図。','scopeLimits':'型式固有の仕様・操作や安全設定を示さない。専門家・実機・端末確認は未実施。','rights':{'origin':'independent_original_code_geometry','copiedSourceArtwork':False},'aiPixelReviewed':False,'humanReviewed':False,'domainReviewed':False}
# Lists are explicit source-item mappings, not mined topic matches.
groups={23:[('gas','ガスレンジ'),('ih','IHレンジ'),('chinese','中華ガスレンジ'),('combi','スチームコンベクション'),('steam','蒸し器'),('fryer','フライヤー'),('noodle','ゆで麺器'),('griddle','グリドル'),('standing-rice','立体式炊飯器')],24:[('rice','卓上炊飯器'),('warmer','ライスウォーマー'),('grill','焼物器'),('braise','ブレージングパン'),('conveyor-oven','ジェットオーブン'),('kettle','回転釜')],25:[('fridge','冷蔵冷凍庫'),('table-fridge','テーブル型冷蔵冷凍庫'),('showcase','冷蔵ショーケース'),('walkin','プレハブ冷蔵冷凍庫'),('ice','製氷機'),('blast','ブラストチラー'),('vacuum-cool','真空冷却器')],26:[('small-washer','小型洗浄機'),('hood-washer','ドアタイプ洗浄機'),('conveyor-washer','コンベアタイプ洗浄機'),('sterilizer','殺菌庫')],27:[('slicer','フードスライサー'),('small-cutter','小型調理器'),('cutter-mixer','カッターミキサー'),('peeler','皮むき器'),('vacuum-pack','真空包装機'),('hand-dispenser','自動手指消毒器')]}
figs=[]
# Separate right-facing region maps: approximate commercial cut locations, not dissection boundaries.
for species,title,page in [('beef','牛肉：部位の位置を概略で比べる',5),('pork','豚肉：部位の位置を概略で比べる',6),('chicken','鶏肉：むね・手羽・ももを位置で分ける',7)]:
 s=S()
 if species in ['beef','pork']:
  s.ellipse(680,445,335,155,LIGHT);s.path('M940 370 L1030 300 L1110 330 L1150 430 L1060 465 L980 445 Z',LIGHT)
  s.path('M1040 315 L1025 260 L1080 305 Z',GOLD);s.ellipse(1090,360,8,8,DARK);s.path('M370 405 Q300 335 300 490',c=DARK)
  for x in [440,940]:s.rect(x,540,48,140,STEEL,12)
  if species=='beef':
   s.path('M1050 307 Q1085 260 1080 245',c=DARK)
   items=[('かた',955,425,1190,490),('肩ロース',875,350,1100,230),('リブロース',770,335,900,205),('サーロイン',650,335,690,205),('ランプ',470,350,440,215),('ヒレ',640,455,730,735),('かたばら',900,505,1090,710),('ともばら',740,520,910,780),('うちもも',485,530,485,770),('そともも',410,490,250,610),('すね',465,620,245,750)]
   for x,y,w,h,f in [(835,335,70,90,'#dfb58d'),(735,330,90,90,'#e1caa5'),(590,330,130,90,'#d5b6bf'),(410,350,150,90,'#b4d1c0'),(865,480,100,55,'#cfb0a3'),(570,480,270,62,'#efc5a2')]:s.rect(x,y,w,h,f,16)
   s.ellipse(640,455,65,18,'#c69aa7');s.ellipse(475,525,32,32,'#a4c5aa');s.ellipse(412,500,26,45,'#d1bf9c')
  else:
   s.ellipse(1140,417,26,20,GOLD);s.ellipse(1140,417,3,7,DARK)
   items=[('かた',945,440,1160,560),('肩ロース',865,350,1030,230),('ロース',670,335,720,215),('ヒレ',650,460,780,735),('そともも',410,415,290,270),('もも',440,540,320,740),('ばら',735,525,1030,765)]
   s.rect(865,360,110,100,'#d8b4a1',20);s.rect(785,330,90,85,'#d3bd99',18);s.rect(540,330,220,85,'#ccb3bf',20);s.rect(520,490,345,65,'#e7c19b',20);s.ellipse(650,460,70,19,'#bd96a0');s.ellipse(420,415,48,65,'#b0cdbb');s.ellipse(440,530,40,54,'#a6bea9')
  for label,x,y,tx,ty in items:s.leader(x,y,tx,ty,label)
 else:
  s.ellipse(650,450,250,160,LIGHT);s.path('M825 375 L880 240 Q930 175 980 230 L1005 310 L925 390 L875 475 Z',LIGHT);s.path('M975 240 L1050 270 L1000 290 Z',GOLD);s.ellipse(967,248,7,7,DARK)
  s.path('M450 410 L325 290 L360 435 L300 390 L380 490 Z',STEEL);s.line(555,570,535,720,DARK,14);s.line(535,720,455,740,DARK,12);s.ellipse(800,450,65,95,'#dfbdb0');s.ellipse(650,400,120,65,'#c5bba1');s.ellipse(530,540,75,85,'#a7c5b5');s.ellipse(835,490,22,60,'#b790a1')
  for label,x,y,tx,ty in [('むね',810,420,1120,410),('ささみ',835,490,1100,660),('手羽',650,400,610,215),('もも',530,540,310,685)]:s.leader(x,y,tx,ty,label)
 s.text(700,850,'おおよその位置。内部のヒレ・ささみは位置関係を示す表示です。',26)
 f=save('meat-'+species,title,s,1400,950);f.update(lessonId='rst-1-cook-01',factIds=[],sourceRefs=[{'documentId':'rst-1-cooking','pdfPages':[page],'section':'肉の部位'}]);figs.append(f)
# Individual machine figures keep each object readable in a narrow reader column.
figs=[f for f in figs if '-fig-meat-' in f['id']]
for page,items in groups.items():
 for key,label in items:
  ss=S();ss.group(170,105,2.3);machine(ss,key);ss.end()
  f=save('machine-'+key,label+'：形と用途を確認する',ss,900,750)
  f.update(lessonId='rst-1-cook-'+('13' if page>=26 else '12'),factIds=[],sourceRefs=[{'documentId':'rst-1-cooking','pdfPages':[page],'section':'調理機器'}],sourceItems=[key]);figs.append(f)
(OUT/'figures.json').write_text(json.dumps(figs,ensure_ascii=False,indent=2)+'\n');print('total figures',len(figs))
