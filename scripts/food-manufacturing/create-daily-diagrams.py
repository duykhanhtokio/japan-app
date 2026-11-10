"""Original controlled teaching diagrams, not photographs or copied source artwork."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import hashlib,json,math
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/food-manufacturing/daily-diagrams';OUT.mkdir(parents=True,exist_ok=True)
FONT=Path('/workspace/scratch/439bff9a1c34/qa-font/NotoSansCJK-JP.otf')
if not FONT.exists():
 import os
 FONT=Path(os.environ['FOOD_DIAGRAM_FONT'])
W,H=1200,760
BG='#fffaf0';INK='#233c4c';BLUE='#377f9d';GREEN='#4d8c73';RED='#be5545';GOLD='#c5a15a';PALE='#d9e8df'
font=lambda n:ImageFont.truetype(str(FONT),n)
records=[]
def make(kind,title,draw):
 global im,d
 im=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(im);d.rounded_rectangle((20,20,W-20,H-20),radius=24,outline=GOLD,width=3)
 d.text((50,35),title,fill=INK,font=font(32));d.text((1040,42),'模式図',fill=INK,font=font(22));draw();d.text((50,705),'本文の条件と照合して読む',fill=INK,font=font(22))
 p=OUT/(kind+'.webp');im.save(p,'WEBP',quality=90,method=6);records.append({'kind':kind,'assetPath':p.relative_to(ROOT).as_posix(),'assetSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'width':W,'height':H,'rights':'project_original_controlled_geometry','domainReviewed':False})
def line(a,b,color=INK,width=5):d.line((*a,*b),fill=color,width=width)
def rect(box,fill=PALE,outline=INK,width=4):d.rounded_rectangle(box,radius=12,fill=fill,outline=outline,width=width)
def text(x,y,s,size=26,color=INK):d.text((x,y),s,font=font(size),fill=color)
def arr(a,b,color=BLUE,width=6):
 line(a,b,color,width);ang=math.atan2(b[1]-a[1],b[0]-a[0]);p=[b,(b[0]-20*math.cos(ang-.5),b[1]-20*math.sin(ang-.5)),(b[0]-20*math.cos(ang+.5),b[1]-20*math.sin(ang+.5))];d.polygon(p,fill=color)
def person(x,y,color=BLUE,scale=1):
 r=28*scale;d.ellipse((x-r,y-r,x+r,y+r),fill=color);d.polygon([(x-45*scale,y+45*scale),(x+45*scale,y+45*scale),(x+60*scale,y+155*scale),(x-60*scale,y+155*scale)],fill=color)
 line((x-25*scale,y+155*scale),(x-30*scale,y+230*scale),color,int(18*scale));line((x+25*scale,y+155*scale),(x+30*scale,y+230*scale),color,int(18*scale))
def tray(x,y,label,color=GREEN):rect((x,y,x+250,y+115),fill='#e7eee4',outline=color);text(x+20,y+35,label,26,color)
def can(x,y,label,color=BLUE):
 d.rectangle((x,y+20,x+115,y+140),fill='#eef1ed',outline=color,width=4);d.ellipse((x,y,x+115,y+40),fill='#f7f4e9',outline=color,width=4);d.arc((x,y+115,x+115,y+155),0,180,fill=color,width=4);text(x+12,y+65,label,22,color)
def gear(cx,cy,r,color):
 for i in range(12):
  a=i*math.pi/6;d.ellipse((cx+(r+8)*math.cos(a)-12,cy+(r+8)*math.sin(a)-12,cx+(r+8)*math.cos(a)+12,cy+(r+8)*math.sin(a)+12),fill=color)
 d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=color);d.ellipse((cx-18,cy-18,cx+18,cy+18),fill=BG)
def plot(points,color=BLUE):
 line((170,600),(170,190));line((170,600),(1040,600));d.line(points,fill=color,width=7);text(65,150,'測定値',23);text(1000,620,'順序',23)
def safety():
 person(270,230);tray(700,300,'食品');d.arc((130,180,410,610),30,330,fill=BLUE,width=8);d.arc((630,180,1040,610),210,510,fill=GREEN,width=8);text(160,120,'働く人の安全');text(730,120,'食べる人の安全');line((550,170),(550,620),GOLD,3)
def zones():
 rect((110,170,1090,600),fill='#f4efe0');d.rectangle((115,175,590,595),fill='#e8cdbb');d.rectangle((620,175,1085,595),fill='#c9e4dc');line((605,170),(605,600),RED,9);tray(200,330,'原料',RED);tray(750,330,'加熱後',GREEN);text(220,210,'区域・器具');text(760,210,'区域・器具');arr((360,510),(850,510),BLUE);text(420,560,'人・物の動線',25)
def foreign():
 tray(450,450,'食品');d.polygon([(180,190),(240,240),(190,330),(135,270)],outline=BLUE,fill='#c8e1e8');d.arc((520,180,660,330),20,310,fill=INK,width=14);d.polygon([(900,190),(980,310),(840,300)],fill=RED);text(120,360,'ガラス片');text(520,360,'金属片');text(850,360,'硬い破片');arr((220,405),(470,490),RED);arr((590,405),(590,450),RED);arr((900,405),(690,490),RED)
def allergen():
 tray(110,390,'原料A',BLUE);tray(830,390,'原料B',GREEN);d.ellipse((190,235,320,320),fill=GOLD,outline=INK,width=4);line((300,270),(710,270),INK,24);d.ellipse((650,245,695,290),fill=RED);arr((350,345),(850,345),RED);text(420,150,'器具を介する混入');text(400,570,'切替え・確認',30)
def chemicals():
 rect((90,180,490,620),fill='#e6e3dd');can(190,300,'薬剤',RED);rect((710,180,1110,620),fill='#d8e6df');can(850,300,'食品',GREEN);line((600,170),(600,630),RED,8);text(190,220,'表示・保管');text(810,220,'区分する');d.polygon([(230,480),(290,580),(170,580)],outline=RED,fill='#fff1dd');text(215,515,'!',30,RED)
def microbes():
 d.rounded_rectangle((130,290,470,440),radius=75,fill='#a1c5a4',outline=GREEN,width=6);d.ellipse((210,330,255,375),fill=GREEN);d.ellipse((330,335,400,400),outline=INK,width=5);text(220,490,'細菌・芽胞');
 d.ellipse((760,250,950,440),fill='#d4c6e0',outline=INK,width=5)
 for a in range(0,360,30):
  rad=math.radians(a);line((855+100*math.cos(rad),345+100*math.sin(rad)),(855+135*math.cos(rad),345+135*math.sin(rad)),INK,5)
 text(740,490,'ウイルス等');text(150,150,'見た目だけでは判断しない',32)
def wash():
 rect((150,250,450,500),fill='#d3dce0');d.ellipse((210,330,270,385),fill='#8e7453');d.ellipse((310,400,370,450),fill='#8e7453');rect((750,250,1050,500),fill='#d3dce0');arr((500,375),(700,375));text(160,550,'汚れ');text(770,550,'洗浄・乾燥');
 for x in [510,555,600]:d.ellipse((x,245,x+22,280),fill=BLUE)
def clothing():
 person(580,225,GREEN,1.2);d.arc((525,175,635,265),175,365,fill=BLUE,width=18);d.rectangle((535,235,625,270),fill=BG,outline=BLUE,width=3);d.polygon([(526,290),(634,290),(645,420),(515,420)],fill='#f4f2e8',outline=INK);text(150,160,'帽子');line((280,200),(540,200),BLUE,3);text(870,250,'服装');line((880,295),(640,340),BLUE,3);text(110,520,'持込み品');d.rectangle((300,520,380,610),outline=RED,width=5);line((290,510),(395,625),RED,5)
def hands():
 d.ellipse((260,270,580,420),fill='#d6b49c',outline=INK,width=5);d.ellipse((475,355,800,505),fill='#d6b49c',outline=INK,width=5);rect((820,160,1010,260),fill='#dde4e8');line((820,235),(720,235),INK,12)
 for x in [680,715,750]:line((x,255),(x-30,335),BLUE,6)
 text(120,155,'洗う・清潔に乾かす');text(620,570,'タイミングも確認',30)
def receipt():
 rect((100,230,490,560),fill='#dfcfac');line((295,230),(295,560),GOLD);text(200,340,'原料');rect((650,175,1060,610),fill='#fffdf8')
 for y,label in [(230,'表示'),(335,'包装'),(440,'状態')]:d.rectangle((700,y,740,y+40),outline=GREEN,width=4);line((705,y+20),(718,y+33),GREEN,4);line((718,y+33),(737,y+6),GREEN,4);text(780,y,label,28)
def cold():
 rect((120,170,600,630),fill='#ddeaf0');line((120,350),(600,350),BLUE,6);can(200,240,'原料');can(385,425,'原料');d.rounded_rectangle((820,180,870,500),radius=25,outline=INK,width=5);d.ellipse((790,450,900,560),fill=BLUE,outline=INK,width=4);line((845,480),(845,290),BLUE,17);text(720,600,'品目・温度・記録',28)
def fifo():
 for y in [270,510]:line((150,y),(1040,y),INK,12)
 for x,lab in [(190,'先'),(480,'後'),(770,'後')]:can(x,350,lab,GREEN)
 arr((220,610),(1030,610));text(160,165,'入庫順・期限を確認');text(800,210,'取出し順',26)
def probe():
 d.ellipse((230,260,910,570),fill='#bd7758',outline=INK,width=5);d.ellipse((290,300,850,530),fill='#e6b990');d.ellipse((490,345,660,480),fill='#f5d7ad');line((930,170),(570,400),INK,14);rect((900,110,1090,195),fill='#dfe7e5');d.ellipse((550,380,585,415),fill=RED);text(150,150,'中心を確かめる');line((390,225),(555,385),RED,3);text(880,590,'温度計',27)
def heatcurve():
 plot([(180,570),(330,570),(480,280),(650,280),(820,560),(1020,570)]);text(65,150,'温度',23);text(990,620,'時間',23);text(370,180,'加熱');text(780,440,'冷却');text(240,650,'数値・時間は本文と製品条件で確認',25)
def seal():
 d.polygon([(250,250),(950,250),(880,570),(320,570)],fill='#d5e8e7',outline=INK);d.rectangle((250,215,950,270),fill=GOLD);line((250,285),(950,285),GREEN,7);text(450,140,'シール部分');line((600,190),(600,260),RED,4);d.rectangle((490,410,760,490),fill=BG,outline=BLUE,width=4);text(530,425,'表示・印字',25)
def detector():
 line((100,520),(1100,520),INK,20);rect((430,210,770,520),fill='#dbe7e9');d.rectangle((485,270,715,520),fill=BG);can(200,350,'製品',GREEN);can(850,350,'製品',GREEN);arr((180,610),(1050,610));text(460,140,'検査');d.ellipse((550,390,575,415),fill=RED)
def control():
 plot([(180,450),(300,430),(420,455),(540,420),(660,440),(780,290),(910,420),(1030,430)]);line((175,350),(1040,350),RED,4);line((175,530),(1040,530),RED,4);d.ellipse((765,275,795,305),fill=RED);text(750,205,'逸脱・確認',26);text(230,650,'図の位置は模式的。基準は本文で確認',24)
def guard():
 gear(450,390,90,BLUE);gear(650,390,90,GREEN);d.rounded_rectangle((290,220,815,565),radius=20,outline=RED,width=10);d.rectangle((850,390,1030,450),fill='#d6b49c',outline=INK,width=4);arr((850,420),(790,420),RED);text(260,150,'可動部・ガード');text(830,530,'手を近づけない',24)
def floor():
 d.polygon([(140,560),(400,240),(840,240),(1100,560)],fill='#e5dfce',outline=INK);d.polygon([(500,560),(555,240),(665,240),(710,560)],fill='#d2e7da');rect((270,430,440,540),fill='#bda276');d.ellipse((780,440,1000,520),fill='#9bc7dc');text(270,130,'障害物');text(760,130,'ぬれ');arr((605,600),(605,285),GREEN)
def lifting():
 rect((600,340,850,550),fill='#c8ad83');person(390,250,BLUE,.85);line((405,310),(610,390),BLUE,18);line((480,630),(900,630),INK,5);line((690,270),(690,580),RED,4);text(500,145,'荷・体の位置');text(150,570,'重さ・持ち方・周囲を確認',27)
def teaching():
 person(280,240,BLUE);person(840,240,GREEN);rect((485,325,640,435),fill='#e2d1a5');line((330,350),(485,370),BLUE,18);line((790,350),(640,380),GREEN,18);arr((350,180),(760,180));arr((760,595),(350,595),GREEN);text(370,110,'示す・確認する');text(410,620,'質問・報告',27)
def privacy():
 person(325,250,BLUE);person(815,250,GREEN);d.arc((180,150,960,650),185,355,fill=GOLD,width=7);line((600,190),(600,590),GOLD,3);text(440,120,'相談の範囲');rect((500,400,700,550),fill=BG);d.arc((555,330,645,460),180,360,fill=INK,width=8);d.ellipse((592,455,608,472),fill=INK)
def lots():
 can(150,320,'原料');can(520,200,'製品A',GREEN);can(520,460,'製品B',GREEN);can(900,200,'出荷A',GREEN);can(900,460,'出荷B',GREEN);arr((290,380),(500,280));arr((290,390),(500,535));arr((670,280),(875,280));arr((670,535),(875,535));text(160,150,'ロットをつなぐ')
def stats():
 plot([(200,430),(350,470),(500,420),(650,460),(800,425),(980,455)]);line((175,445),(1040,445),GREEN,4);d.ellipse((190,420,210,440),fill=BLUE);text(400,120,'中心とばらつき',32);d.arc((500,300,820,550),180,360,fill=GOLD,width=6)
def yieldfig():
 rect((120,300,350,500),fill='#dac49b');text(170,365,'投入');d.polygon([(470,340),(750,280),(750,500),(470,460)],fill='#bad3be',outline=INK);arr((350,400),(470,400));arr((750,355),(1000,300),GREEN,28);arr((650,500),(650,620),RED,18);text(920,220,'製品');text(730,590,'ロス');text(160,150,'分母・分子を分ける',32)
def downtime():
 line((130,570),(1080,570),INK,5);d.rectangle((150,300,420,500),fill=GREEN);d.rectangle((420,300,600,500),fill=RED);d.rectangle((600,300,1050,500),fill=GREEN);text(200,360,'稼働');text(445,360,'停止');text(750,360,'稼働');text(170,150,'時刻・区間を記録');text(980,600,'時間',26)
def defense():
 rect((370,180,850,620),fill='#e7e4db');rect((470,270,740,620),fill='#c8dce0');d.ellipse((685,420,705,440),fill=INK);person(200,300,BLUE,.75);rect((890,340,1060,465),fill=BG);text(925,375,'ID',36);arr((360,350),(470,350));text(400,120,'入場・権限を確認',30)
def circular():
 can(510,300,'資源',GREEN)
 for a in [0,120,240]:
  aa=math.radians(a);bb=math.radians(a+85);arr((600+240*math.cos(aa),400+200*math.sin(aa)),(600+240*math.cos(bb),400+200*math.sin(bb)),GREEN,11)
 text(150,135,'使用・廃棄・見直し');rect((900,450,1030,570),fill='#ded7c9');text(900,585,'分別',25)
def risk():
 for i in range(3):
  for j in range(3):
   c=['#cbded1','#e9d494','#d9977f'][min(2,(i+j)//2)];d.rectangle((300+j*170,210+(2-i)*130,470+j*170,340+(2-i)*130),fill=c,outline=BG,width=5)
 arr((250,615),(250,190),INK);arr((285,640),(850,640),INK);text(40,355,'可能性',26);text(885,620,'重大性',26);text(300,120,'評価表の軸と区分',30)
def health():
 person(300,270,BLUE);d.ellipse((275,245,290,260),fill=RED);rect((720,245,950,560),fill='#e5e6dc');d.rectangle((750,285,920,470),fill=BG,outline=INK,width=4);d.ellipse((820,510,850,540),outline=INK,width=3);arr((410,360),(680,360),RED);text(160,145,'体調の変化');text(725,150,'報告・相談')
def stop():
 gear(330,390,90,BLUE);rect((680,310,1020,560),fill='#dbe5e3');d.rectangle((805,260,905,330),fill=INK);d.ellipse((760,200,950,290),fill=RED,outline=INK,width=5);line((420,390),(660,390),RED,9);line((540,320),(540,460),RED,14);text(140,150,'異常・可動部');text(720,145,'停止・連絡')
def signs():
 d.ellipse((120,220,400,500),outline=RED,width=22);d.rectangle((240,280,275,435),fill=INK);line((160,260),(360,460),RED,20);d.polygon([(600,210),(780,510),(420,510)],fill='#edc45d',outline=INK);text(570,300,'!',110);d.ellipse((850,220,1130,500),fill=BLUE);text(910,290,'→',100,'#fff');text(170,570,'禁止');text(540,570,'警告');text(900,570,'指示')
def label():
 d.polygon([(220,180),(980,180),(920,625),(280,625)],fill='#d8e7e0',outline=INK);rect((350,270,850,550),fill=BG);text(400,310,'原材料・表示',30);line((400,380),(790,380),INK,4);d.rectangle((395,410,780,475),outline=RED,width=5);text(430,425,'照合する',26)
def calibration():
 rect((220,400,700,570),fill='#dbe1df');line((160,340),(760,340),INK,10);d.ellipse((370,250,550,335),fill=GOLD,outline=INK,width=5);text(355,190,'基準');rect((830,280,1040,570),fill=BG);text(865,320,'記録');line((865,395),(1000,395),INK);line((865,445),(1000,445),INK);arr((730,465),(800,465));text(210,620,'機器・根拠・実施結果',26)
def normal():
 line((150,580),(1080,580),INK,5);points=[(x,570-340*math.exp(-((x-610)/175)**2/2)) for x in range(170,1050,4)];d.line(points,fill=BLUE,width=7)
 for x,lab in [(435,'−σ'),(610,'平均'),(785,'＋σ')]:line((x,570),(x,650),GOLD,4);text(x-25,660,lab,23)
 text(170,150,'正規分布を仮定した模式図',30)
for kind,title,fn in [('health','体調変化の報告',health),('stop','異常時の停止と連絡',stop),('signs','標識の区分',signs),('label','原料・包材・表示の照合',label),('calibration','機器と確認記録',calibration),('normal','正規分布の中心と幅',normal),('safety','二つの安全',safety),('zones','区域と交差汚染',zones),('foreign','異物の形と混入経路',foreign),('allergen','器具を介する交差接触',allergen),('chemicals','表示と保管区分',chemicals),('microbes','微生物の模式的な形',microbes),('wash','汚れの除去と乾燥',wash),('clothing','服装・持込み品',clothing),('hands','手洗いと乾燥',hands),('receipt','受入れの照合',receipt),('cold','保管と温度の確認',cold),('fifo','棚と取出し順',fifo),('probe','中心温度の測定位置',probe),('heatcurve','温度と時間の関係',heatcurve),('seal','包装のシールと表示',seal),('detector','検査工程と製品の通過',detector),('control','測定・基準・逸脱',control),('guard','可動部を囲うガード',guard),('floor','床・障害物・動線',floor),('lifting','荷と体の位置関係',lifting),('teaching','実演と双方向の確認',teaching),('privacy','相談と情報の範囲',privacy),('lots','原料から出荷までの追跡',lots),('stats','測定の中心とばらつき',stats),('yield','投入・製品・ロス',yieldfig),('downtime','稼働と停止の時間区間',downtime),('defense','入場と権限の確認',defense),('circular','資源と廃棄を見直す',circular),('risk','可能性と重大性の区分',risk)]:make(kind,title,fn)
(OUT/'manifest.json').write_text(json.dumps({'status':'authored_ai_unreviewed','kind':'controlled_original_schematic_not_operational_procedure','assets':records},ensure_ascii=False,indent=2)+'\n')
print('Created',len(records),'controlled diagrams')
