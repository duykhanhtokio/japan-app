from pathlib import Path
import math,hashlib,json
import cairosvg
from PIL import Image
R=Path('/workspace/scratch/8c34e3cace7a/japan-app');D=R/'assets/restaurant/source31/service1';D.mkdir(parents=True,exist_ok=True)
ink='#24384b'; green='#17624c'; gold='#c99138'; skin='#e5b995'; red='#ad3f38';blue='#55869b'
def line(a,b,c=ink,w=7,dash=''):return f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="{c}" stroke-width="{w}" stroke-linecap="round" '+(f'stroke-dasharray="{dash}"' if dash else '')+'/>'
def rect(x,y,w,h,c='#fff',rx=14,stroke=ink):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{c}" stroke="{stroke}" stroke-width="5"/>'
def ellipse(x,y,rx,ry,c='#fff',stroke=ink):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{c}" stroke="{stroke}" stroke-width="5"/>'
def txt(x,y,t,size=32,c=ink,anchor='middle'):return f'<text x="{x}" y="{y}" font-size="{size}" fill="{c}" text-anchor="{anchor}" font-family="Noto Sans CJK JP">{t}</text>'
def path(s,c='none',stroke=ink,w=6):return f'<path d="{s}" fill="{c}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
def arrow(a,b,c=green):
 th=math.atan2(b[1]-a[1],b[0]-a[0]);return line(a,b,c)+line(b,(b[0]-20*math.cos(th-.5),b[1]-20*math.sin(th-.5)),c)+line(b,(b[0]-20*math.cos(th+.5),b[1]-20*math.sin(th+.5)),c)
rows=[]
def save(n,title,body,caption,alt,tags,lesson,pages,limits):
 stem=f'rst31-service1-fig{n:03}';svg=D/(stem+'.svg');png=D/(stem+'.png')
 svg.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">'+rect(3,3,1394,894,'#faf8f0',24,green)+txt(700,74,title,42)+body+txt(700,856,'独立作成した模式図。本文の条件と店の方法を確認する。',28)+'</svg>')
 cairosvg.svg2png(url=str(svg),write_to=str(png));im=Image.open(png).convert('RGB');im.save(png,optimize=True)
 rows.append({'id':stem,'lessonId':f'rst-1-svc-{lesson:02}','factTags':tags,'assetFile':str(png.relative_to(R)),'svgFile':str(svg.relative_to(R)),'width':1400,'height':900,'sha256':hashlib.sha256(png.read_bytes()).hexdigest(),'svgSha256':hashlib.sha256(svg.read_bytes()).hexdigest(),'captionJa':caption,'altJa':alt,'sourceRefs':[{'documentId':'rst-1-service','pdfPages':pages,'section':title}],'scopeLimits':limits,'rights':'独立作成したコード図形。PDFの絵・写真・ページを使用していない。','authorPixelReviewed':False,'humanReviewed':False,'domainReviewed':False,'nativeReviewed':False})
# 1 Straight torso bends at hips; angles are exact geometrical vectors from vertical.
b=''
for x,deg,name,use in [(245,15,'会釈','すれ違いなど'),(700,30,'敬礼','歓迎・感謝など'),(1155,45,'最敬礼','見送り・お詫びなど')]:
 hip=(x-65,570);r=math.radians(deg);shoulder=(hip[0]+240*math.sin(r),hip[1]-240*math.cos(r));head=(shoulder[0]+55*math.sin(r),shoulder[1]-55*math.cos(r));
 b+=txt(x,155,name,36)+txt(x,205,f'約{deg}°',32)+line((x-160,740),(x+160,740),gold,4)
 b+=line(hip,(hip[0]-8,733),ink,30)+line((hip[0]+15,600),(hip[0]+40,733),ink,27)+line(hip,shoulder,green,50)+ellipse(head[0],head[1],34,34,skin)
 b+=line((shoulder[0]-12,shoulder[1]+25),(hip[0]+45,hip[1]-10),ink,17)+line(hip,(hip[0],hip[1]-280),blue,3,'10 8')
 ep=(hip[0]+85*math.sin(r),hip[1]-85*math.cos(r));b+=path(f'M {hip[0]} {hip[1]-85} A 85 85 0 0 1 {ep[0]} {ep[1]}','none',gold,5)
 b+=txt(x,795,use,28)
save(1,'上体の傾きとお辞儀の例',b,'会釈約15度・敬礼約30度・最敬礼約45度の上体の傾きを比較する。首だけを折らず背筋を保つ。','横から見た三つのお辞儀。腰を支点にまっすぐな上体の傾きを比べる。',['bow-angles','bow-movement','bow-purpose'],2,[11],'角度は教材の目安。視線距離や身体寸法を縮尺で表す図ではない。')
# 2 Tray top view supported by actual palm, positions explicit near body versus fingertips.
b=rect(170,200,770,470,'#e6ddd0',70)+txt(555,160,'上から見た配置',34)+ellipse(550,470,145,105,'#ead0b5')
for dx,dy in [(-95,-135),(-35,-165),(30,-165),(90,-140)]:b+=rect(550+dx,470+dy,38,165,skin,19)
b+=rect(495,560,105,210,skin,25)+ellipse(400,545,108,60,'#fff')+ellipse(400,545,74,35,'#bf8546')
b+=ellipse(760,330,70,30,'#fff')+ellipse(760,330,46,16,'#fff',gold)
b+=txt(1090,295,'手先側',34)+arrow((1015,310),(850,310))+txt(1090,570,'手前・体側',34)+arrow((1015,590),(790,590))
b+=txt(1100,390,'下ろす側の例',28)+txt(1100,650,'重い物の位置例',28)+txt(540,790,'手はトレイの下（透視）',32)
save(2,'トレイの手前・手先と支える手',b,'利き手と反対の手で中心を支える模式図。重い物を手前から載せ、手先側から下ろす例を確認する。','トレイの下の手のひらと広げた指、体側の重い皿、手先側のグラスを上から示す。',['tray-support','tray-load'],3,[12],'透視のため手を重ねた模式図。手と器の寸法比・積載量を規定しない。')
# 3 Glass below-half zone and plate underside/rim in section, hand exists rather than text card.
b=txt(350,160,'グラスは下半分',34)+path('M 210 260 L 235 620 Q 350 680 465 620 L 490 260 Z','#e5f0ef',blue)+ellipse(350,260,140,30,'#fff',blue)+line((200,455),(500,455),gold,4,'12 9')
b+=path('M 420 550 Q 490 500 550 535 L 565 610 Q 515 650 450 622 Z',skin)+rect(440,540,120,38,skin,19)+rect(445,582,115,34,skin,17)+txt(350,730,'口が触れる縁を避ける',32)
b+=txt(1030,160,'皿は底を支える',34)+ellipse(1000,350,240,50,'#fff')+ellipse(1000,337,165,20,'#e0af76')+path('M 785 365 Q 1000 435 1210 365','none',ink,8)
b+=path('M 1165 390 Q 1210 390 1235 430 L 1220 555 L 1130 540 Q 1090 505 1110 460 L 1165 425 Z',skin)
b+=rect(1000,395,185,38,skin,19)+path('M 1198 413 L 1235 365 Q 1258 350 1270 370 L 1240 430',skin)+txt(1035,635,'親指は縁へ・他の指は底へ',30)+txt(1035,730,'料理に指を入れない',32)
save(3,'口や料理が触れる場所を避けて持つ',b,'グラスの下側と皿の底側を支える位置の模式図。飲み口や料理に指を触れないようにする。','グラスの下半分を持つ手と、皿の縁・底側を支える手を示す二つの図。',['glass-grip','plate-grip'],3,[12],'模式的な接触位置。細かな指関節の実技・握力や手袋の適否を示すものではない。')
# 4 Two distinct eating-status arrangements with actual utensil shapes.
def fork(x,y,ang):
 return f'<g transform="translate({x} {y}) rotate({ang})">'+rect(-8,0,16,195,'#b5c3cb',8)+rect(-24,-30,48,45,'#b5c3cb',8)+''.join(line((-22+i*14,-28),(-22+i*14,-75),ink,7) for i in range(4))+'</g>'
def knife(x,y,ang):return f'<g transform="translate({x} {y}) rotate({ang})">'+rect(-8,0,16,195,'#b5c3cb',8)+path('M -8 0 L -8 -85 Q 35 -75 24 0 Z','#b5c3cb')+'</g>'
b=''
for x,title in [(350,'食事中の目安'),(1050,'終了の目安')]:b+=txt(x,180,title,36)+ellipse(x,445,240,220,'#fff')+ellipse(x,445,205,187,'#fff',gold)
b+=fork(310,405,40)+knife(395,405,-40)+fork(1030,410,-42)+knife(1110,365,-42)+txt(350,740,'ハの字（8時20分の形）',32)+txt(1050,740,'二本を斜めにそろえる',32)
save(4,'道具の形は進行を知る手がかり',b,'ハの字と斜めにそろえたカトラリーを比較する。下膳前には食事の状況と本人の希望を確認する。','二枚の皿に、ハの字に開いた道具と斜めに並べた道具を示す。',['cutlery-signal'],5,[15],'教材の目安。これだけで食事終了を確定しない。刃の細部を縮尺再現する図ではない。')
# 5 Seating plans, not duplicate food placement.
b=rect(90,200,530,520,'#f4e8cf',5)+rect(100,210,175,60,'#c4cabb',4)+txt(188,253,'床の間',28)+rect(260,385,200,130,'#bb8757',4)+txt(360,335,'上座側の例',30)+txt(360,590,'下座側の例',30)
b+=line((500,720),(610,720),'#faf8f0',15)+path('M 500 720 L 500 615 A 105 105 0 0 1 605 720','none',blue,4)+txt(565,780,'入口',30)
b+=rect(755,200,530,520,'#f4e8cf',5)+ellipse(1020,440,145,145,'#bb8757')+ellipse(1020,440,70,70,'#eee8da')
for x,y in [(1020,245),(825,440),(1215,440),(1020,635)]:b+=ellipse(x,y,36,26,'#bed4ca')
b+=line((1165,720),(1275,720),'#faf8f0',15)+path('M 1165 720 L 1165 615 A 105 105 0 0 1 1270 720','none',blue,4)+txt(1220,780,'入口',30)+txt(1020,175,'入口から遠い側の例',30)
save(5,'入口と客席を上から見て考える',b,'和室と円卓の席配置の一例。入口や床の間を手がかりにしつつ、希望と移動条件を確かめる。','入口、床の間、テーブルと席を示す和室と円卓の平面図。',['seating','tokonoma','round-seats'],4,[14,16],'具体的な店舗の避難経路や全ての上座を定めない。席番号や人物の序列を仮定しない。')
# 6 Wheel types physically distinct rear wheel/handrim, no generic access floorplan reuse.
b=''
for x,title,big in [(340,'介助用の例',False),(1040,'自走式の例',True)]:
 b+=txt(x,180,title,36)+line((x-170,720),(x+190,720),gold,4)
 radius=108 if big else 58;cx=x-60;cy=720-radius
 b+=ellipse(cx,cy,radius,radius,'#dee5e7')+ellipse(cx,cy,radius-15,radius-15,'#faf8f0')
 if big:b+=ellipse(cx,cy,radius-28,radius-28,'none',blue)
 b+=ellipse(x+135,680,38,38,'#dee5e7')+line((x-25,420),(x-25,600),green,16)+line((x-25,600),(x+100,600),green,16)+line((x+100,600),(x+140,665),ink,10)+line((x-25,440),(x-95,420),ink,8)+line((x-95,420),(x-120,420),ink,10)+line((x-25,600),(x-60,cy),ink,8)
 b+=txt(x,790,'本人の希望を先に確認',28)
b+=txt(1040,310,'手で回す輪の例',30)+arrow((1110,330),(1030,550),blue)
save(6,'車椅子の型は支援を考える手がかり',b,'介助用の例と、大きい車輪に手で回す輪がある自走式の例。型だけで介助の要否を決めない。','介助用と自走式の車椅子を横から比較し、自走式の手で回す輪を示す。',['wheelchair-types'],7,[17],'製品により構造は違う。操作・移乗・持上げの実技や寸法の基準ではない。')
# 7 Upper/lower chopstick motion, physical hand and chopsticks: controlled role diagram.
b=txt(700,160,'右利きの教材例：下を保ち、上を動かす',34)+path('M 250 570 Q 190 490 235 400 L 355 350 Q 430 355 480 420 L 560 475 L 525 560 L 440 540 L 340 650 Z',skin)
b+=path('M 310 405 Q 380 350 470 405 L 520 440 L 490 485 L 420 445 L 350 480',skin)
b+=line((390,520),(1110,620),gold,16)+line((400,410),(1120,560),gold,16)+line((400,410),(1120,400),gold,9,'15 12')
b+=txt(990,330,'上の箸：動く',32)+path('M 1140 420 Q 1195 485 1145 550','none',green,8)+arrow((1145,540),(1133,560))
b+=txt(950,710,'下の箸：位置を保つ',32)
save(7,'二本の箸の動く側を比べる',b,'下の箸を保ち上の箸を動かす役割を示す。手は位置関係を説明するための模式形。','手と二本の箸。下の箸は一定、上の箸は開く位置を点線で示す。',['chopsticks'],4,[13],'箸の上下の役割に限定する。指の細かな持ち替えを実技として認定する図ではない。')
# 8 Face/eyes/mouth demonstration, avoids text-only substitution.
b=ellipse(700,430,190,225,skin)+path('M 520 350 Q 520 175 700 180 Q 875 185 880 360 Q 795 270 715 290 Q 610 265 520 350 Z','#4a4140')
b+=ellipse(620,420,40,19,'#fff')+ellipse(780,420,40,19,'#fff')+ellipse(620,420,8,13,ink)+ellipse(780,420,8,13,ink)+path('M 625 525 Q 700 610 775 525','none',ink,10)
b+=txt(300,380,'やさしい目線',34)+arrow((440,390),(565,420))+txt(1080,570,'口の両端',34)+arrow((970,580),(790,530))+txt(700,750,'相手を思う気持ちを行動と合わせる',32)
save(8,'目元・口元と笑顔の練習',b,'やさしい目元と上がった口の両端を観察する模式図。相手の感じ方を確かめて練習する。','穏やかな目元と口角を示す顔の模式図。目元と口元へ指示線を置く。',['smile'],2,[9],'特定の顔立ちや表情を強制する基準ではない。実際の人への接客の評価は別に確認する。')
(R/'docs/ssw-workspace/restaurant/source-closure31/service1/figures.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print(len(rows),'controlled SVG/PNG figures')
