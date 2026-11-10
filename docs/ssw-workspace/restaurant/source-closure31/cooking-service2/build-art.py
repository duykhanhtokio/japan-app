from pathlib import Path
import html,subprocess,json,hashlib,math
R=Path(__file__).resolve().parents[5];OUT=R/'assets/restaurant/source31/cooking-service2';OUT.mkdir(parents=True,exist_ok=True)
INK='#183d50';TEAL='#087e85';RED='#bd3f39';BLUE='#cee2eb';GOLD='#e8c382';PAPER='#fffdf6'
class Art:
 def __init__(self,title,w=1600,h=1100):
  self.w=w;self.h=h;self.s=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs><marker id="arr" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0 0L10 4L0 8Z" fill="{TEAL}"/></marker></defs><rect width="100%" height="100%" fill="{PAPER}"/><rect width="100%" height="110" fill="{INK}"/>'];self.t(40,67,title,38,'white')
 def t(self,x,y,text,size=28,c=INK):self.s.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{c}" font-family="Noto Sans CJK JP,sans-serif">{html.escape(text)}</text>')
 def rect(self,x,y,w,h,fill=BLUE,stroke=INK,sw=4,rx=0):self.s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
 def line(self,x,y,X,Y,c=INK,sw=5,arrow=False):self.s.append(f'<path d="M{x} {y}L{X} {Y}" fill="none" stroke="{c}" stroke-width="{sw}"'+(' marker-end="url(#arr)"'if arrow else '')+'/>')
 def path(self,p,fill='none',c=INK,sw=5):self.s.append(f'<path d="{p}" fill="{fill}" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')
 def oval(self,x,y,rx,ry,fill=BLUE,c=INK):self.s.append(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{c}" stroke-width="4"/>')
 def fish(self,x,y,scale=1):
  self.s.append(f'<g transform="translate({x},{y}) scale({scale})">');self.path('M50 110Q150 25 310 100Q335 120 310 145Q160 225 50 145L0 180L0 75Z',BLUE);self.oval(290,113,5,5,INK);self.path('M256 87Q235 123 256 160');self.path('M215 140L177 184L229 157',GOLD);self.path('M148 173L121 204L167 176',GOLD);self.line(55,130,238,130,'#7b9ca8',2);self.s.append('</g>')
 def pot(self,x,y):self.rect(x,y,190,120,BLUE,rx=12);self.oval(x+95,y,95,20,PAPER);self.line(x-20,y+25,x,y+25);self.line(x+190,y+25,x+210,y+25)
 def person(self,x,y,arm='normal'):
  self.oval(x,y,20,24,GOLD);self.path(f'M{x-22} {y+30}L{x+22} {y+30}L{x+27} {y+100}L{x-27} {y+100}Z',TEAL);self.line(x-12,y+100,x-25,y+155);self.line(x+12,y+100,x+26,y+155);self.line(x-22,y+35,x-55,y+75);self.line(x+22,y+35,x+55,y+75)
 def save(self,name):
  self.t(38,self.h-24,'独自の学習用模式図。実物・機種・自店の手順を確認し、実演を受ける。',22)
  p=OUT/(name+'.svg');p.write_text(''.join(self.s)+'</svg>');png=p.with_suffix('.png');subprocess.run(['inkscape',str(p),'--export-type=png','--export-filename='+str(png)],check=True,capture_output=True);return {'assetFile':str(png.relative_to(R)),'svgFile':str(p.relative_to(R)),'width':self.w,'height':self.h,'sha256':hashlib.sha256(png.read_bytes()).hexdigest(),'svgSha256':hashlib.sha256(p.read_bytes()).hexdigest()}
rows=[]
a=Art('魚の下処理：方向と部位を照合する',1600,1200)
a.t(45,165,'うろこ：尾から頭へ');a.fish(80,230,1.7);a.line(180,390,555,390,TEAL,9,True);a.t(100,570,'尾');a.t(555,570,'頭');a.t(865,165,'えら：ふたを開き、両側の付け根');a.fish(895,230,1.7);a.oval(1310,425,34,54,'none',RED);a.line(1320,510,1410,565,RED,4);a.t(1110,610,'えらと身のつながる所',27)
a.t(45,690,'内臓：用途で切込み位置を分ける');a.fish(75,760,1.5);a.path('M455 990L300 1035','none',RED,8);a.t(65,1095,'切り身用：えら付近から腹へ',26);a.fish(670,760,1.5);a.path('M982 991L1005 980','none',TEAL,12);a.t(640,1095,'尾頭付き：裏側の胸びれ下',26)
a.fish(1210,790,.8);a.line(1378,906,1322,934,RED,7);a.t(1190,1000,'頭：ひれ後方の斜め線',25);a.t(1190,1040,'反対側も処理する',25);rows.append(a.save('fish-preparation'))
a=Art('三枚と五枚：身と中骨を数える',1600,1100)
a.t(80,170,'三枚：身二つ ＋ 中骨');a.t(890,170,'五枚：身四つ ＋ 中骨')
for y in [300,700]:a.path(f'M100 {y}Q330 {y-120} 570 {y}Q380 {y+80} 100 {y}',GOLD)
a.line(90,515,570,515,INK,10)
for x in range(150,560,55):a.line(x,515,x-35,465,INK,4);a.line(x,515,x-35,565,INK,4)
a.t(100,860,'片側の身・中骨・反対側の身',29)
for x,y in [(890,340),(1200,340),(890,700),(1200,700)]:a.path(f'M{x} {y}Q{x+75} {y-115} {x+225} {y}Q{x+100} {y+100} {x} {y}',GOLD)
a.line(900,530,1450,530,INK,10)
for x in range(950,1430,55):a.line(x,530,x-35,485,INK,4);a.line(x,530,x-35,575,INK,4)
a.t(895,865,'平たい魚など：四つの身と中骨',29);a.t(80,990,'加工後の分かれ方を示す図です。刃物の動作を教える実演図ではありません。',28);rows.append(a.save('fish-three-five'))
a=Art('令和4年の図を読む：2023年版教材の引用例',1600,1000)
labels=['転倒','切れ・こすれ','高温・低温物との接触','動作の反動・無理な動作','墜落・転落','激突','交通事故','はさまれ・巻き込まれ','その他'];values=[30,20,15,10,6,5,4,4,6]
for i,(lab,v) in enumerate(zip(labels,values)):
 y=170+i*78;a.t(40,y+32,lab,28);a.rect(535,y,v*24,40,TEAL,TEAL);a.t(560+v*24,y+32,str(v)+'％',29)
a.t(40,935,'分類の構成比です。現在の割合、一店舗の事故率、一人の発生確率ではありません。',27);rows.append(a.save('accident-reference-2022'))
a=Art('場所と動作から危険を見つける',1800,1500)
labels=['濡れた床','グレーチング','包丁・まな板','シンク内の刃物','缶のふち・蓋','割れた食器・串','熱い鍋','揚げ油','すれ違い・衝突','濡れ床＋熱い荷物','荷物を体へ近づける','熱いフィルター']
for i,lab in enumerate(labels):
 col=i%4;row=i//4;x=col*445+20;y=row*425+150;a.t(x+8,y,lab,26);a.rect(x+10,y+30,410,345,PAPER,'#b4c7cc',2)
 if i in [0,1,9]:
  a.line(x+35,y+330,x+385,y+330);a.person(x+180,y+175)
  if i==1:
   a.rect(x+45,y+305,140,35,'#aaa');
   for j in range(8):a.line(x+55+j*16,y+306,x+55+j*16,y+338,INK,2)
  else:a.oval(x+185,y+335,110,16,BLUE)
  if i==9:a.pot(x+220,y+210)
 elif i==2:a.rect(x+45,y+170,320,95,GOLD);a.path(f'M{x+80} {y+160}L{x+260} {y+130}L{x+275} {y+175}L{x+80} {y+190}Z',BLUE);a.line(x+270,y+152,x+340,y+140,INK,18)
 elif i==3:a.rect(x+55,y+110,280,190,BLUE);a.oval(x+190,y+175,100,60,PAPER);a.path(f'M{x+120} {y+230}L{x+250} {y+190}',c=RED,sw=12);a.t(x+55,y+350,'刃を隠して放置しない',23)
 elif i==4:a.oval(x+170,y+260,95,20,BLUE);a.rect(x+75,y+155,190,105,BLUE);a.oval(x+170,y+155,95,20,PAPER);a.oval(x+290,y+105,70,18,GOLD,RED);a.line(x+270,y+137,x+240,y+167,RED,7)
 elif i==5:a.path(f'M{x+75} {y+155}L{x+180} {y+120}L{x+165} {y+240}Z',PAPER,RED);a.path(f'M{x+215} {y+180}L{x+310} {y+230}L{x+250} {y+285}Z',PAPER,RED);a.line(x+65,y+300,x+345,y+155,RED,7)
 elif i in [6,7,11]:

  if i==11:
   a.path(f'M{x+95} {y+130}L{x+280} {y+130}L{x+205} {y+250}L{x+170} {y+250}Z',GOLD);a.oval(x+187,y+130,93,20,'#725037');a.rect(x+135,y+275,110,60,PAPER);a.line(x+187,y+250,x+187,y+270,RED,5)
  else:a.pot(x+90,y+175)
  for j in range(3):a.path(f'M{x+140+j*45} {y+145}q-20 -25 0 -50q20 -25 0 -45',c=RED,sw=5)
  if i==7:a.oval(x+185,y+173,80,14,GOLD);a.oval(x+290,y+125,10,8,GOLD)
  if i==11:a.t(x+95,y+365,'残湯も確認する',24)
 elif i==8:a.person(x+130,y+90);a.person(x+310,y+90);a.line(x+170,y+240,x+265,y+240,RED,8)
 elif i==10:a.person(x+185,y+80);a.rect(x+210,y+145,105,90,GOLD);a.line(x+175,y+210,x+235,y+210,TEAL,7,True)
rows.append(a.save('kitchen-hazards'))
a=Art('食品加工機械：種類ごとの防護部位',1600,1100)
for i,lab in enumerate(['切断・切削機','粉砕・混合機','ロール機','成形・圧縮機']):
 x=(i%2)*790+45;y=(i//2)*435+180;a.t(x,y,lab,32)
 if i==0:a.rect(x+90,y+170,500,65,BLUE);a.oval(x+335,y+135,90,90,GOLD);a.path(f'M{x+235} {y+135}A100 100 0 0 1 {x+435} {y+135}',TEAL,TEAL,20);a.t(x+60,y+330,'不要な刃の露出を防ぐ',28)
 if i==1:a.path(f'M{x+170} {y+85}L{x+450} {y+85}L{x+390} {y+230}L{x+230} {y+230}Z',BLUE);a.rect(x+160,y+62,300,25,TEAL);a.line(x+310,y+90,x+310,y+215);a.line(x+245,y+175,x+375,y+175);a.t(x+50,y+330,'開口部の転落・接触を防ぐ',28)
 if i==2:
  a.rect(x+120,y+40,400,210,'none',TEAL,15);a.oval(x+245,y+155,65,65,GOLD);a.oval(x+385,y+155,65,65,GOLD);a.t(x+70,y+330,'巻き込まれる所を防護する',28)
 if i==3:a.rect(x+120,y+40,400,230,'none',TEAL,15);a.rect(x+200,y+80,240,40,GOLD);a.rect(x+200,y+210,240,40,GOLD);a.line(x+320,y+125,x+320,y+188,TEAL,6,True);a.t(x+70,y+330,'挟まれ・巻き込まれを防ぐ',28)
a.t(45,1050,'投入・取出しと、掃除・詰まり調整を区別。停止・再始動防止は指定手順で確認する。',27);rows.append(a.save('machine-guards'))
a=Art('モップと窓：動かす方向と仕上げを比べる',1600,1100)
a.t(55,170,'モップ：糸を広げ、後ろへ下がる');a.rect(60,215,640,640,'#eff6f8')
a.path('M300 450C100 240 100 660 300 450C500 240 500 660 300 450',c=TEAL,sw=9);a.line(500,400,500,700,TEAL,9,True);a.t(525,570,'後退',27);a.line(310,590,400,270,INK,10)
for j in range(9):a.line(278+j*10,590,270+j*12,650,TEAL,7)
a.t(70,930,'区画・退路・通行を確認して行う',29)
a.t(820,170,'窓：全面を濡らす → 水を切る');a.rect(840,230,640,500,BLUE,INK,10);a.line(1160,230,1160,730);a.line(840,480,1480,480)
for x in [900,1010,1110,1270,1390]:a.path(f'M{x} 280q-30 65 0 115q30 60 0 115',c='#67b9d1',sw=8)
a.line(1230,330,1450,330,INK,16);a.line(1340,330,1340,440,INK,12);a.line(1250,380,1250,620,TEAL,7,True);a.rect(870,780,160,65,GOLD);a.line(900,795,1000,820,TEAL,10);a.t(1050,825,'刃先を都度拭く',28);a.t(835,930,'最後に窓枠も乾かす',29);rows.append(a.save('mop-window'))
a=Art('場所別に用具と表面の条件を選ぶ',1800,1250)
for i,lab in enumerate(['外周・植え込み','非ワックス床','ワックス塗布通路','カーペットのしみ','家具の対応素材','電話・レジ']):
 x=(i%3)*590+30;y=(i//3)*500+180;a.t(x,y,lab,31);a.rect(x+10,y+40,540,360,PAPER,'#bdcbd1',2)
 if i==0:
  a.rect(x+55,y+220,170,90,GOLD);a.path(f'M{x+95} {y+225}q-40 -110 40 -110q-10 -80 60 -70q80 10 40 110',TEAL);a.line(x+345,y+90,x+295,y+280,INK,8);a.path(f'M{x+270} {y+275}L{x+335} {y+290}L{x+350} {y+330}L{x+245} {y+305}Z',GOLD);a.rect(x+410,y+250,70,70,BLUE);a.t(x+45,y+380,'ごみ回収と植物の条件',25)
 elif i in [1,2]:
  a.rect(x+65,y+220,420,80,BLUE);a.line(x+310,y+100,x+240,y+260,INK,9);a.path(f'M{x+180} {y+255}L{x+310} {y+270}',c=TEAL,sw=25)
  if i==2:a.oval(x+120,y+165,60,40,GOLD);a.path(f'M{x+165} {y+145}Q{x+240} {y+70} {x+320} {y+200}');a.t(x+40,y+380,'砂を除き、指定用具で仕上げ',25)
  else:a.oval(x+155,y+270,50,8,TEAL);a.t(x+40,y+380,'ごみ除去・適合洗浄・水切り',25)
 elif i==3:a.rect(x+65,y+90,400,200,GOLD);a.oval(x+260,y+200,60,30,RED);a.rect(x+300,y+225,90,50,BLUE);a.t(x+40,y+380,'素材と薬剤に合う方法',25)
 elif i==4:a.rect(x+100,y+140,350,65,GOLD);a.line(x+130,y+205,x+130,y+320);a.line(x+420,y+205,x+420,y+320);a.rect(x+230,y+120,140,35,BLUE);a.t(x+30,y+380,'ワックス可否・乾燥条件を確認',25)
 else:a.rect(x+80,y+180,300,130,BLUE);a.rect(x+155,y+70,160,110,INK);a.rect(x+175,y+95,120,55,TEAL);a.rect(x+400,y+160,90,45,GOLD);a.line(x+390,y+150,x+475,y+110,TEAL,6,True);a.t(x+35,y+380,'液を内部へ直接吹き込まない',25)
rows.append(a.save('cleaning-zones'))
a=Art('調味料容器とトイレ：工程・用具を分ける',1800,1150)
a.t(40,165,'食品用容器：内容物を店の手順で扱い、洗浄してから再充填する',31)
for i,lab in enumerate(['空にする','洗う','すすぐ','水を切る','再充填']):
 x=60+i*345;a.t(x,260,lab,29);a.rect(x+30,360,180,190,BLUE);a.oval(x+120,360,90,20,PAPER)
 if i==0:a.path(f'M{x+110} 380L{x+220} 480',c=GOLD,sw=20);a.rect(x+215,465,85,110,GOLD)
 if i==1:a.rect(x+65,420,120,55,GOLD);a.oval(x+60,400,12,12,PAPER);a.oval(x+195,430,15,15,PAPER)
 if i==2:a.line(x+115,300,x+115,415,'#5ba9cd',13);a.line(x+100,300,x+100,415,'#5ba9cd',7)
 if i==3:
  a.rect(x+15,330,220,235,PAPER,PAPER,0);a.path(f'M{x+30} 550L{x+30} 380Q{x+120} 345 {x+210} 380L{x+210} 550');a.line(x+15,570,x+225,570,TEAL,6);a.path(f'M{x+120} 590q-14 23 0 32q14 -9 0 -32',BLUE)
 if i==4:a.line(x+120,300,x+120,430,GOLD,18);a.rect(x+50,450,140,80,GOLD)
a.line(40,670,1750,670,RED,8);a.t(45,735,'用具を共有しない：食品容器・客席と、化粧室・便器を分ける',32,RED)
a.rect(90,790,300,180,BLUE);a.rect(145,750,190,55,GOLD);a.t(90,1030,'食品容器用スポンジ',28)
a.oval(790,870,150,75,PAPER);a.path('M670 900L700 1020L870 1020L900 900',PAPER);a.line(830,790,870,950,INK,10);a.oval(870,950,35,20,TEAL);a.t(660,1085,'便器内は専用ブラシ',28)
a.line(455,845,570,960,RED,10);a.line(455,960,570,845,RED,10)
a.rect(1140,790,330,170,BLUE);a.line(1160,820,1430,820);a.line(1160,860,1430,860);a.t(1120,1030,'壁・洗面台・床・外側も区分',27);rows.append(a.save('condiments-toilets'))
a=Art('八つの包丁：刃の形と主な用途を照合する',1800,1200)
knifeRows=[('柳刃','刺身',310,25,80),('出刃','魚の処理',230,85,45),('菜切','野菜の刻み',220,85,0),('薄刃','野菜の皮むき等',240,75,0),('牛刀','肉・魚・野菜',280,65,80),('三徳','肉・魚・野菜',245,75,40),('ペティ','細かな作業',170,40,60),('中華包丁','広い刃と重み',240,130,0)]
for i,(name,use,length,bh,tip) in enumerate(knifeRows):
 x=(i%2)*890+45;y=(i//2)*240+180;a.t(x,y,name+'：'+use,31);yy=y+60;a.path(f'M{x+40+length} {yy}L{x+40+tip} {yy}Q{x+40} {yy+bh*.25} {x+40} {yy+bh}L{x+40+length} {yy+bh}Z',BLUE) if tip else a.rect(x+40,yy,length,bh,BLUE);a.line(x+40+length,yy+bh*.5,x+180+length,yy+bh*.5,INK,28)
a.t(45,1120,'形は比較用の概念図です。刃の厚み・片刃等は実物の仕様と指導で確認する。',28);rows.append(a.save('eight-knives'))
a=Art('体調急変：通報・AED・誘導を分担する',1800,1000)
a.oval(310,535,30,25,GOLD);a.rect(345,510,260,55,TEAL);a.line(605,525,720,490,INK,14);a.line(605,550,725,585,INK,14);a.t(130,660,'反応・呼吸の異常は緊急要請を遅らせない',29)
a.person(1050,310);a.rect(1100,280,70,135,INK);a.rect(1110,300,50,75,BLUE);a.t(1000,220,'119番通報',34);a.t(950,590,'指令員の質問・指示に従う',28)
a.rect(1370,340,260,175,GOLD,INK,8,15);a.rect(1450,300,95,45,'none',INK,10);a.path('M1515 365L1470 430L1510 430L1465 495',c=INK,sw=12);a.t(1380,220,'AEDを手配',34)
a.line(1175,690,1650,690,TEAL,7,True);a.rect(1395,730,180,155,PAPER,INK,8);a.line(1510,735,1510,885,INK,5);a.t(1170,940,'別の担当：入口の誘導と周囲の安全',28);a.t(70,840,'病名を独断で決めない。受講した応急手当の手順へつなぐ。',29);rows.append(a.save('emergency-roles'))
a=Art('食品の流通：複数の経路と仕入先を照合する',1800,1200)
# Icons distinguish facilities; arrows describe pathways rather than replacing the teaching with word boxes.
for y in [330,770]:
 for j in range(4):a.path(f'M{80+j*55} {y}q-20 -65 15 -90q35 30 10 90',TEAL);a.line(40,y+10,340,y+10,TEAL,9)
a.t(70,460,'生産者',32)
a.rect(520,240,230,175,BLUE);a.path('M500 240L635 150L770 240',GOLD);a.t(505,470,'出荷事業者',31)
a.rect(920,180,270,210,PAPER);a.path('M900 180L1055 110L1210 180',GOLD);a.rect(960,240,70,115,TEAL);a.rect(1080,240,70,115,TEAL);a.t(940,445,'卸売市場',32)
a.rect(920,710,270,190,BLUE);a.path('M920 710L995 640L995 710L1070 640L1070 710L1145 640L1145 710',GOLD);a.rect(1130,580,45,135,INK);a.t(925,970,'食品製造・加工',31)
a.rect(1320,250,250,170,PAPER);a.path('M1300 250L1590 250L1560 185L1330 185Z',TEAL);a.rect(1400,310,75,110,GOLD);a.t(1325,470,'小売・飲食店',31)
a.person(1490,700);a.person(1620,700);a.t(1440,940,'消費者',32)
a.line(350,330,510,330,TEAL,7,True);a.line(760,310,900,280,TEAL,7,True);a.line(1185,300,1300,320,TEAL,7,True);a.line(700,425,900,755,TEAL,7,True);a.line(1190,790,1270,520,TEAL,7);a.line(1270,520,1280,300,TEAL,7);a.line(1280,300,1320,300,TEAL,7,True);a.line(1450,480,1490,650,TEAL,7,True);a.line(340,820,900,820,TEAL,7,True)
a.t(55,1080,'市場の働き：集荷・価格形成・決済・情報・災害時対応・衛生保持',32);a.t(55,1130,'経路の一例です。全商品が全ての施設を通るわけではありません。',28);rows.append(a.save('distribution-paths'))
(R/'docs/ssw-workspace/restaurant/source-closure31/cooking-service2/art-receipts.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'figures':len(rows),'pngBytes':sum((R/r['assetFile']).stat().st_size for r in rows)}))
