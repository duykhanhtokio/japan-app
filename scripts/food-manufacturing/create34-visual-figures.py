"""Original controlled schematic artwork for source-bound visual identification."""
from pathlib import Path
import hashlib,io,json,os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import Circle,Ellipse,Rectangle,Polygon,FancyBboxPatch,Arc,PathPatch
from matplotlib.path import Path as MPath
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'assets/food-manufacturing/source-practice34'; OUT.mkdir(parents=True,exist_ok=True)
AUDIT=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
from PIL import Image
font=Path(os.environ.get('FOOD_QA_JAPANESE_FONT','/workspace/scratch/439bff9a1c34/qa-font/NotoSansCJK-JP.otf')); assert font.exists()
font_manager.fontManager.addfont(str(font));plt.rcParams.update({'font.family':font_manager.FontProperties(fname=font).get_name(),'font.size':14,'svg.fonttype':'path','svg.hashsalt':'food-source34'})
INK='#243f52';BLUE='#247ca7';LIGHT='#e7f3f8';RED='#c24b3b';GREEN='#25795e';YELLOW='#e8b543';SKIN='#f2d4b5';WHITE='#ffffff'
lessons={}
for p in [ROOT/'src/data/food-manufacturing/lessons.1.ja.json',ROOT/'src/data/food-manufacturing/lessons.2.ja.json',*sorted((ROOT/'src/data/food-manufacturing/authoring-20261029').glob('part*.json'))]:lessons.update({l['id']:l for l in json.loads(p.read_text())['lessons']})
manifest=[]
def canvas(title,h=8,sub='独立した学習用模式図。実作業は職場の指定に従う。'):
 f,a=plt.subplots(figsize=(10,h));a.set(xlim=(0,10),ylim=(0,h));a.axis('off');a.text(.3,h-.25,title,fontsize=22,weight='bold',color=INK,va='top');a.text(.3,h-.8,sub,fontsize=12,color=INK,va='top');return f,a

def line(a,pts,c=INK,lw=2,**kw):a.plot(*zip(*pts),color=c,lw=lw,solid_capstyle='round',**kw)
def poly(a,pts,fc=LIGHT,ec=INK,lw=2,**kw):a.add_patch(Polygon(pts,closed=True,facecolor=fc,edgecolor=ec,linewidth=lw,**kw))
def rect(a,x,y,w,h,fc=LIGHT,ec=INK,lw=2,**kw):a.add_patch(Rectangle((x,y),w,h,facecolor=fc,edgecolor=ec,linewidth=lw,**kw))
def circle(a,x,y,r,fc=LIGHT,ec=INK,lw=2,**kw):a.add_patch(Circle((x,y),r,facecolor=fc,edgecolor=ec,linewidth=lw,**kw))
def arrow(a,p,q,c=BLUE):a.annotate('',xy=q,xytext=p,arrowprops={'arrowstyle':'-|>','color':c,'lw':2})
def note(a,text,xy,at,ha='left'):
 a.annotate(text,xy=xy,xytext=at,color=INK,ha=ha,va='center',fontsize=14,linespacing=1.5,arrowprops={'arrowstyle':'-','color':BLUE,'lw':1.5},bbox={'boxstyle':'round,pad=.35','facecolor':'white','edgecolor':BLUE})
def save(f,name,lid,pid,doc,pages,goals,limits,record_ids):
 f.tight_layout(pad=.45);f.savefig(OUT/(name+'.svg'),metadata={'Date':None});b=io.BytesIO();f.savefig(b,format='png',dpi=160,facecolor='white');plt.close(f);b.seek(0);im=Image.open(b).convert('RGB');asset=OUT/(name+'.webp');im.save(asset,'WEBP',quality=94)
 p=next(p for p in lessons[lid]['paragraphs'] if p['id']==pid)
 manifest.append({'id':'food-source34-'+name,'lessonId':lid,'lessonSourceHash':lessons[lid]['sourceHash'],'paragraphId':pid,'keyObjectiveId':'food-source34-'+name,'assetFile':str(asset.relative_to(ROOT)),'svgFile':str((OUT/(name+'.svg')).relative_to(ROOT)),'width':im.width,'height':im.height,'sha256':hashlib.sha256(asset.read_bytes()).hexdigest(),'captionJa':p['titleJa'],'altJa':p['textJa'],'objectiveJa':goals[0],'atomicOutcomesJa':goals,'sourceRefs':[{'document':doc,'pdfPage':n,'printedPage':n-(5 if doc=='ssw1' else 9)} for n in pages],'historicalRecordIds':record_ids,'scopeLimits':limits,'rights':'project_original_controlled_geometry','sourceRenderedAndRead':True,'authoredImageRead':False,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False})

def head(a,x,y,s=1,bad=None):
 # Hood is an original rounded rectangle with face opening; no source contour reused.
 a.add_patch(FancyBboxPatch((x-.62*s,y-.8*s),1.24*s,1.65*s,boxstyle=f'round,pad=0,rounding_size={.4*s}',facecolor=LIGHT,edgecolor=INK,linewidth=2))
 a.add_patch(Ellipse((x,y),.91*s,1.15*s,facecolor=SKIN,edgecolor=INK,lw=1.5))
 # eyes and nose remain visible; mask normally spans bridge to chin.
 for dx in [-.21,.21]:circle(a,x+dx*s,y+.18*s,.035*s,INK,INK,1)
 line(a,[(x,y+.12*s),(x-.05*s,y-.04*s),(x+.04*s,y-.04*s)],lw=1)
 masktop=y+(.02 if bad!='nose' else -.20)*s
 poly(a,[(x-.43*s,masktop),(x,masktop+.07*s),(x+.43*s,masktop),(x+.36*s,y-.58*s),(x-.36*s,y-.58*s)],fc='white',ec=BLUE,lw=1.8)
 line(a,[(x-.34*s,masktop-.16*s),(x+.34*s,masktop-.16*s)],c=BLUE,lw=1)
 line(a,[(x-.31*s,masktop-.31*s),(x+.31*s,masktop-.31*s)],c=BLUE,lw=1)
 line(a,[(x-.62*s,y-.7*s),(x-.2*s,y-.9*s),(x+.2*s,y-.9*s),(x+.62*s,y-.7*s)],c=INK,lw=2)
 if bad=='hair':
  for k in range(4):line(a,[(x-.48*s,y+.5*s-k*.12*s),(x-.8*s,y+.35*s-k*.13*s)],c='#603d25',lw=3)
 if bad=='nose':a.add_patch(Ellipse((x,y-.07*s),.8*s,.38*s,fill=False,edgecolor=RED,lw=2))

def glove(a,x,y,s=1,kind='plain',loose=False,damaged=False):
 # one original polygon outline, dimensions are illustration coordinates only.
 pts=[(-.33,-.65),(.28,-.65),(.32,-.18),(.58,.1),(.58,.27),(.48,.32),(.3,.14),(.25,.62),(.15,.7),(.06,.65),(.06,.2),(-.01,.78),(-.12,.83),(-.22,.75),(-.16,.18),(-.28,.66),(-.39,.7),(-.48,.6),(-.37,.05),(-.5,.43),(-.61,.43),(-.67,.31),(-.45,-.2)]
 fc=YELLOW if kind=='fiber' else '#c9d2d8' if kind=='chain' else LIGHT
 poly(a,[(x+px*s,y+py*s) for px,py in pts],fc=fc,lw=1.7)
 rect(a,x-.34*s,y-.67*s,.63*s,.14*s,fc=BLUE,lw=1)
 if kind in ['fiber','chain']:
  # Material cues drawn within palm; deliberately schematic, not a product specification.
  for ix in range(4):
   for iy in range(5):
    xx=x-.28*s+ix*.13*s;yy=y-.35*s+iy*.13*s
    if kind=='fiber':line(a,[(xx-.035*s,yy-.035*s),(xx+.035*s,yy+.035*s)],c='#8b702b',lw=1)
    else:circle(a,xx,yy,.055*s,fc='none',ec='#586974',lw=.8)
 if loose:
  line(a,[(x-.2*s,y-.5*s),(x-.22*s,y-.02*s),(x-.17*s,y+.35*s)],c=RED,lw=1.5,ls='--')
  line(a,[(x+.13*s,y-.5*s),(x+.18*s,y-.03*s),(x+.14*s,y+.35*s)],c=RED,lw=1.5,ls='--')
 if damaged:
  poly(a,[(x-.07*s,y+.02*s),(x+.02*s,y+.13*s),(x+.15*s,y+.04*s),(x+.07*s,y-.1*s)],fc=SKIN,ec=RED,lw=1.5)
  for xx,yy in [(-.2,-.24),(.13,-.3),(-.12,-.1)]:circle(a,x+xx*s,y+yy*s,.045*s,fc='#886044',ec='#886044',lw=.5)

def shoe(a,x,y,s=1,boot=False):
 pts=[(-.65,-.15),(.65,-.15),(.67,.06),(.49,.24),(.06,.28),(-.05,.43),(-.43,.43),(-.45,.04),(-.65,-.02)]
 if boot:pts=[(-.65,-.15),(.65,-.15),(.67,.06),(.45,.21),(.1,.24),(.05,1.0),(-.45,1.0),(-.43,.05),(-.65,-.02)]
 poly(a,[(x+xx*s,y+yy*s) for xx,yy in pts],fc=LIGHT)
 line(a,[(x-.62*s,y-.18*s),(x+.62*s,y-.18*s)],c=BLUE,lw=4)
 if boot:
  rect(a,x-.5*s,y+.9*s,.59*s,.16*s,fc=BLUE,lw=1)
 else:
  a.add_patch(Arc((x+.4*s,y+.05*s),.45*s,.4*s,theta1=0,theta2=140,color=BLUE,lw=3))
  line(a,[(x-.4*s,y+.03*s),(x-.4*s,y+.31*s)],c=BLUE,lw=3)

# 1: whole-body garment recognition, with real garment geometry and overlays.
f,a=canvas('服装：部位を指して確かめる',11)
head(a,5,8.2,1.15)
poly(a,[(4.42,7.2),(3.9,6.86),(3.3,5.2),(3.8,5.0),(4.25,6.0),(4.18,4.7),(5.82,4.7),(5.75,6),(6.2,5),(6.7,5.2),(6.1,6.86),(5.58,7.2)],fc=LIGHT)
# standing collar and covered central fastener, no pockets/buttons.
rect(a,4.7,6.95,.6,.35,fc='white');line(a,[(5,6.95),(5,4.75)],c=BLUE,lw=1.5)
# waist tucked under trousers; cuffs/ankles emphasized.
poly(a,[(4.18,4.7),(5.82,4.7),(5.78,2.0),(5.15,2.0),(5,3.8),(4.85,2.0),(4.22,2.0)],fc='#d5e8f2')
for x in [4.22,5.15]:rect(a,x,1.95,.63,.13,fc=BLUE,lw=1)
for pts in [[(3.3,5.2),(3.8,5)],[(6.2,5),(6.7,5.2)]]:line(a,pts,c=BLUE,lw=6)
shoe(a,4.53,1.72,.7);shoe(a,5.48,1.72,.7)
note(a,'帽子の内側にネット\n髪を収める',(4.42,8.5),(.35,8.7))
note(a,'縦襟\n内衣はボタンなし',(4.72,7.05),(.35,6.9))
note(a,'袖口・裾を絞る',(3.58,5.1),(.35,4.6))
note(a,'清潔な履き物',(4.5,1.65),(.35,2.1))
note(a,'清潔な上着\nポケット・ボタンなしの例',(5.6,6.25),(7.1,7.2))
note(a,'上着と内衣の端を\nズボンの中へ',(5.8,4.7),(7.1,5.1))
# apron and arm sleeve miniatures are visibly independent garment pieces.
poly(a,[(7.6,3.1),(8.15,3.1),(8.25,2.7),(8.5,1.4),(7.3,1.4),(7.5,2.7)],fc='#79c4db');a.add_patch(Arc((7.87,3.12),.6,.5,theta1=0,theta2=180,color=INK,lw=2))
poly(a,[(8.9,2.9),(9.3,2.8),(9.05,1.7),(8.65,1.8)],fc='#79c4db');line(a,[(8.65,1.8),(9.05,1.7)],c=BLUE,lw=4)
a.text(8.1,.8,'必要なエプロン・腕カバーは\n作業服の上に',ha='center',fontsize=13,color=INK)
save(f,'garment-body','food-1-044','p2','ssw1',[27],['服装の部位と確認点を人体模式図で対応させる','エプロンと腕カバーの重ね方を識別する'],'Clothing examples, not universal workplace garment specifications. Original schematic proportions.',['food-ssw1-p027-garment-diagram'])

# 2: correct and incorrect fit side by side, no photographic copying.
f,a=canvas('どこを直す？ 頭・マスク・手袋',10, '○は確認点がそろった例。×は入場前に直す例。')
for x,bad,title in [(1.7,None,'○ 髪を収め、鼻からあごまで'),(5,'nose','× 鼻が出ている'),(8.3,'hair','× 髪が外へ出ている')]:
 head(a,x,7.0,1.3,bad);a.text(x,5.5,title,ha='center',fontsize=13,color=GREEN if bad is None else RED)
for x,kind,title in [(1.7,'fit','○ 手に合うサイズ'),(5,'loose','× 大きすぎる'),(8.3,'damage','× 破れ・汚れ')]:
 glove(a,x,3.7,1.5,loose=kind=='loose',damaged=kind=='damage');a.text(x,2.25,title,ha='center',fontsize=15,color=GREEN if kind=='fit' else RED)
# extra fit arrows: tightly covered cheek and nose bridge in correct panel.
note(a,'鼻・頬に隙間なし',(1.2,6.8),(.35,8.65))
a.text(5,.75,'長い髪はまとめる。帽子の裾は上着の内側へ。\n手袋は清潔で破損のないもの。異常があれば交換・確認。',ha='center',fontsize=16,color=INK)
save(f,'fit-comparison','food-1-044','p3','ssw1',[24,28],['鼻の露出・毛髪の露出を正しい着用と比較する','手袋の適合・大きすぎ・破れ汚れを見分ける'],'Stylised examples are not certification of actual fit. Gloves do not replace hygiene or safe machine isolation.',['food-ssw1-p028-mask-headcover'])

# 3: head/eyes/ears and reinforced shoe/boot, with mechanisms shown.
f,a=canvas('保護具：形と守る場所を結ぶ',10)
# helmet
x,y=1.9,7.5;a.add_patch(Arc((x,y),1.7,1.35,theta1=0,theta2=180,color=INK,lw=2));poly(a,[(x-.85,y),(x-.65,y+.2),(x+.65,y+.2),(x+.85,y)],fc=YELLOW);line(a,[(x,y+.15),(x,y+.65)],c=YELLOW,lw=12);a.text(x,6.75,'ヘルメット\n頭を守る',ha='center',color=INK,fontsize=16)
# goggles
x=5;rect(a,x-1,7.1,2,.65,fc=BLUE);rect(a,x-.88,7.2,.76,.43,fc='white',lw=1);rect(a,x+.12,7.2,.76,.43,fc='white',lw=1);line(a,[(x-1,7.5),(x-1.3,7.7)],lw=2);line(a,[(x+1,7.5),(x+1.3,7.7)],lw=2);a.text(x,6.8,'保護メガネ\n飛散物から目を守る',ha='center',va='top',color=INK,fontsize=16)
# ear plugs cord
x=8.1;a.add_patch(Arc((x,7.5),1.45,1.5,theta1=0,theta2=180,color=BLUE,lw=3))
for dx in [-.7,.7]:rect(a,x+dx-.12,7.15,.24,.43,fc=YELLOW,lw=1)
a.text(x,6.75,'耳栓\n騒音から耳を守る',ha='center',color=INK,fontsize=16)
shoe(a,2.5,4.15,1.55);note(a,'補強：つま先・かかと',(3.14,4.3),(.55,3.15));a.text(2.5,5.15,'安全靴：圧傷の防止',ha='center',fontsize=18,color=INK)
shoe(a,7.4,3.3,1.65,boot=True);a.text(7.4,5.8,'カバー付き長靴',ha='center',fontsize=18,color=INK);note(a,'上部からの流入を防ぐカバー',(7.05,4.88),(5.3,2.1));note(a,'耐油・滑りにくい靴底',(7.5,3.0),(6.0,1.2))
a.text(.4,.55,'名称だけでなく、守る部位と仕組みを確認。用途の異なる保護具で代用しない。',fontsize=13,color=INK)
save(f,'ppe-head-foot','food-1-046','p4','ssw1',[52],['ヘルメット・保護メガネ・耳栓を形と目的で識別する','安全靴の補強と長靴のカバー・靴底を識別する'],'No helmet-height legal interpretation or PPE ratings are inferred. Diagram is a recognition aid, not a selection specification.',['ssw1-p052-helmet','ssw1-p052-goggles','ssw1-p052-earplugs','ssw1-p052-safety-shoes','ssw1-p052-covered-boots'])

# 4: hand/body PPE plus fibre/chain texture cues.
f,a=canvas('手袋・エプロン：素材と用途を分ける',11)
for x,kind,label in [(1.8,'fiber','メクセル手袋\n切れにくい繊維'),(5,'chain','くさり手袋\nステンレスの網')]:
 glove(a,x,7.8,1.65,kind=kind);a.text(x,6.0,label,ha='center',fontsize=17,color=INK)
# mitten outline
poly(a,[(7.6,6.65),(8.55,6.65),(8.65,7.4),(9.0,7.65),(9.02,8.05),(8.85,8.15),(8.58,7.97),(8.55,8.65),(8.3,8.95),(7.85,8.95),(7.55,8.65)],fc='#efdcc2');rect(a,7.58,6.65,.98,.2,fc=BLUE);a.text(8.1,6.0,'耐熱ミトン\n指定された熱い物に',ha='center',fontsize=17,color=INK)
# apron
poly(a,[(1.3,4.9),(2.1,4.9),(2.25,4.0),(2.75,2.1),(.65,2.1),(1.15,4.0)],fc='#efdbc0');a.add_patch(Arc((1.7,4.88),.75,.65,theta1=0,theta2=180,color=INK,lw=2));a.text(1.7,1.35,'耐熱エプロン\n熱・薬剤・清掃の指定用途',ha='center',fontsize=15,color=INK)
# rubber glove and liquid ingress warning; hand is above fluid, not immersed.
glove(a,5,3.65,1.4);rect(a,6.4,2.7,2.8,.9,fc='#8dc9e5');line(a,[(6.4,3.6),(9.2,3.6)],c=BLUE,lw=2);a.text(7.8,2.2,'熱い液体',ha='center',fontsize=16,color=INK);arrow(a,(6.35,3.95),(5.55,3.1),RED);a.text(6.45,4.7,'× 液体へ手を入れない\n開口から流入する危険',fontsize=15,color=RED)
a.text(5,.55,'耐切創と耐熱は別の用途。保護具を着けても、動く機械へ手を入れない。',ha='center',fontsize=13,color=INK)
save(f,'ppe-hand-body','food-1-046','p2','ssw1',[52],['繊維製と金属網の耐切創手袋を見分ける','耐熱ミトン・耐熱エプロンとゴム手袋の用途を区別する','手袋の開口から熱い液体が入る危険を識別する'],'Material textures are schematic, not brand authentication or certification of heat/chemical/cut resistance.',['ssw1-p052-rubber-gloves','ssw1-p052-mittens','ssw1-p052-apron','ssw1-p052-mexcel','ssw1-p052-chain-gloves'])

# 5: close load / squat / extend knees; original articulated side-view geometry.
def person_side(a,x,y,pose='stand',c=BLUE):
 if pose.startswith('squat'):
  ankle=(x,y);knee=(x+.65,y+.65);hip=(x+.1,y+1.3);shoulder=(x+.25,y+2.15);headp=(x+.32,y+2.6);elbow=(x+.45,y+1.75);hand=(x+.65,y+1.3)
  if pose=='squat-reach':elbow=(x+.55,y+1.55);hand=(x+.8,y+1.0)
 else:
  ankle=(x,y);knee=(x+.06,y+1.0);hip=(x+.08,y+1.9);shoulder=(x+.13,y+2.8);headp=(x+.18,y+3.25);elbow=(x+.55,y+2.25);hand=(x+.7,y+2.1)
 line(a,[ankle,knee,hip,shoulder],c=c,lw=13);line(a,[shoulder,elbow,hand],c=c,lw=9);circle(a,*headp,.27,SKIN,INK);line(a,[(ankle[0]-.18,ankle[1]),(ankle[0]+.45,ankle[1])],c=INK,lw=7)
 return hand
f,a=canvas('荷を近づけ、膝を使ってゆっくり立つ',7.8,'持つ前に重さ・足場・補助者・台車を確認。無理な荷は持ち上げない。')
for x,pose,num in [(1.3,'squat-reach','1'),(4.55,'squat','2'),(7.75,'stand','3')]:
 hand=person_side(a,x,2.1,pose);rect(a,hand[0]-.25,hand[1]-.45,.95,.85,fc='#d6ab6e');a.text(x+.45,5.8,num,ha='center',fontsize=21,color=BLUE)
for x in [3.75,7.0]:arrow(a,(x-.3,3.6),(x+.25,3.6))
a.text(1.75,1.25,'荷へ体を近づける\n膝を曲げ、腰を下ろす',ha='center',fontsize=14,color=INK);a.text(5,1.25,'体の近くで抱える\n足場と姿勢を保つ',ha='center',fontsize=14,color=INK);a.text(8.15,1.25,'膝を伸ばす\nゆっくり立ち上がる',ha='center',fontsize=14,color=INK)
a.text(5,.45,'体をひねって無理に上げない。できるだけ台車や補助を使う。',ha='center',fontsize=14,color=INK)
save(f,'lifting-sequence','food-1-048','p1','ssw1',[66],['荷に近づく・膝を曲げ腰を下ろす・抱える・膝を伸ばして立つ順序を読む'],'Not a universal safe-weight limit or medical/ergonomic certification; task-specific assessment remains necessary.',['ssw1-p066-lifting-sequence'])

# 6: conceptual relation shown by count symbols, not proportions pretending real site frequencies.
f,a=canvas('小さな兆候を共有する：1・29・300',8,'教材の模式的な関係。工場ごとの発生件数を予測する式ではない。')
for y,count,label,color in [(5.6,1,'重い災害',RED),(3.9,29,'軽いけが等',YELLOW),(2.2,300,'ヒヤリ・ハット',BLUE)]:
 a.text(.5,y+.25,str(count),fontsize=29,color=color,weight='bold');a.text(2.2,y+.25,label,fontsize=21,color=INK)
 if count==1:circle(a,5.3,y+.3,.2,color,color)
 elif count==29:
  for i in range(29):circle(a,5.1+(i%15)*.27,y+.47-(i//15)*.34,.075,color,color,lw=.5)
 else:
  for i in range(300):circle(a,5.1+(i%30)*.135,y+.68-(i//30)*.135,.033,color,color,lw=.3)
a.text(5,.6,'記録 → 共有 → 原因と対策を考える\n「けががなかった」体験も隠さず報告する。',ha='center',fontsize=17,color=INK)
save(f,'heinrich-relation','food-1-047','p2','ssw1',[59,60],['1・29・300の模式的関係を図で読み、現場予測と区別する'],'Symbol counts exactly 1/29/300; not an area chart, current accident statistics, causal proof, or a fixed factory prediction.',['ssw1-p059-heinrich'])

# 7: tangible guard geometry and operator relocation, original controls comparison.
f,a=canvas('工学的対策：危険との接触を減らす',10,'設計検討の模式図。寸法・回路・安全機能の仕様ではない。')
# sharp-to-rounded top edge
line(a,[(.8,7.4),(1.75,8.2),(.8,9.0)],c=INK,lw=6);arrow(a,(2.3,8.2),(3.1,8.2));a.add_patch(PathPatch(MPath([(3.5,7.4),(4.9,8.2),(3.5,9.0)],[MPath.MOVETO,MPath.CURVE3,MPath.CURVE3]),fill=False,edgecolor=BLUE,lw=6));a.text(6,8.2,'角を丸くする・突起をなくす\n接触時の危険を低減',fontsize=16,va='center',color=INK)
# exposed rotor before and guarded after
for x in [1.5,5.4]:
 rect(a,x-.8,4.8,1.6,1.4,fc=LIGHT);circle(a,x,5.5,.4,'white',RED)
 for ang in np.linspace(0,2*np.pi,6,endpoint=False):line(a,[(x,5.5),(x+.35*np.cos(ang),5.5+.35*np.sin(ang))],c=RED,lw=2)
# hand silhouette approaches exposed rotor
line(a,[(.25,5.6),(.65,5.6)],c=SKIN,lw=13);arrow(a,(2.6,5.5),(3.8,5.5))
for xx in np.arange(4.45,6.4,.19):line(a,[(xx,4.65),(xx,6.35)],c=BLUE,lw=2)
for yy in np.arange(4.65,6.4,.19):line(a,[(4.45,yy),(6.4,yy)],c=BLUE,lw=2)
a.text(7.0,5.5,'手指が入らない囲い\n必要な防護条件を設計・検証',va='center',fontsize=15,color=INK)
# remote operation: operator outside machine zone
rect(a,.65,1.55,2.1,1.3,fc=LIGHT);circle(a,1.7,2.2,.37,fc=YELLOW);rect(a,5,1.5,.7,1,fc='#bdd9e7');circle(a,5.35,2.15,.09,fc=GREEN);person_side(a,7.8,.7,'stand');line(a,[(2.8,2.2),(4.85,2.2)],c=BLUE,lw=2,ls='--');a.text(.65,1.0,'危険な作業部',fontsize=14,color=INK);a.text(4.3,.6,'離れた操作位置を検討',fontsize=14,color=INK)
save(f,'engineering-controls','food-2-046','p2','ssw2',[131,137],['丸い角・突起除去・手指を遮る囲い・遠隔操作を形で識別する'],'No safe gap dimension, interlock logic, circuit, distance or permission to modify equipment is specified. Guard and remote operation require proper engineering validation.',['p128-engineering'])

# 8: energy reduction example and crushing residual risk; avoid claiming 24V always safe.
f,a=canvas('設備の変更：エネルギーと被害を考える',8,'教材の設計例を検討する。変更は設備担当者と評価・検証する。')
for x,label,color in [(1.9,'変更前の電源条件',RED),(7.3,'低電圧化を検討',BLUE)]:
 rect(a,x-.8,4.8,1.6,1.5,fc=LIGHT);poly(a,[(x+.1,6.05),(x-.3,5.5),(x+.05,5.5),(x-.1,5.0),(x+.4,5.65),(x+.04,5.65)],fc=color,ec=color);a.text(x,4.25,label,ha='center',fontsize=16,color=INK)
a.text(7.3,6.65,'例：DC24V',ha='center',fontsize=17,color=BLUE);arrow(a,(3.2,5.5),(5.9,5.5))
# thick and light door literal outlines and pinch space
rect(a,1.0,1.4,1.8,1.9,fc='#667a87');rect(a,6.5,1.4,.45,1.9,fc='#cce5ef');line(a,[(3.0,1.4),(3.0,3.3)],lw=3);line(a,[(7.2,1.4),(7.2,3.3)],lw=3)
for x in [2.9,7.1]:poly(a,[(x-.14,2.2),(x+.14,2.2),(x,2.52)],fc=RED,ec=RED,lw=1)
arrow(a,(3.65,2.3),(5.65,2.3));a.text(1.9,.9,'重い扉',ha='center',fontsize=16,color=INK);a.text(7.0,.9,'軽い扉を検討\n挟まれの危険は残る',ha='center',fontsize=15,color=INK)
a.text(.4,.2,'低電圧や軽量化だけで全ての危険がなくなるとは判断しない。',fontsize=13,color=INK)
save(f,'design-energy-door','food-2-046','p2','ssw2',[132],['低電圧化と扉軽量化の設計例を識別し、残留リスクを説明する'],'DC24V is a source example, not a universal electrical safety guarantee or installation instruction. Door geometry is schematic.',['p123-design-column'])

# 9: four measurement targets physically differentiated; no invented limit or site data.
f,a=canvas('改善前と改善後：同じ条件で確かめる',9,'温度・湿度・騒音・振動。数値や許容値はこの図では指定しない。')
# thermometer
rect(a,1.3,5.4,.4,1.5,fc='white');circle(a,1.5,5.4,.32,fc=RED);line(a,[(1.5,5.5),(1.5,6.4)],c=RED,lw=6);a.text(1.5,4.6,'温度',ha='center',fontsize=18,color=INK)
# humidity droplet gauge
poly(a,[(4.0,7.0),(3.35,5.9),(3.4,5.5),(3.75,5.2),(4.1,5.2),(4.45,5.5),(4.5,5.9)],fc='#8fcce7');a.text(3.95,5.75,'%',ha='center',fontsize=24,color=INK);a.text(3.95,4.6,'湿度',ha='center',fontsize=18,color=INK)
# noise meter and waves
rect(a,5.8,5.25,.75,1.2,fc=LIGHT);circle(a,6.17,6.7,.25,fc=BLUE);rect(a,5.97,5.9,.4,.28,fc='white',lw=1)
for r in [.5,.8,1.1]:a.add_patch(Arc((6.17,6.7),r,r,theta1=30,theta2=150,color=BLUE,lw=1.5))
a.text(6.17,4.6,'騒音',ha='center',fontsize=18,color=INK)
# vibration machine with zigzag
rect(a,8.0,5.7,1.2,.65,fc=LIGHT)
for xx in [8.2,9.0]:line(a,[(xx,5.7),(xx-.1,5.5),(xx+.1,5.3),(xx,5.1)],c=BLUE,lw=2)
a.text(8.6,4.6,'振動',ha='center',fontsize=18,color=INK)
# same-condition comparison with actual clipboard forms
for x,title in [(1.0,'改善前'),(6.2,'改善後')]:
 rect(a,x,1.4,2.8,2.1,fc='white');rect(a,x+.9,3.3,1,.35,fc=BLUE)
 for j in range(4):line(a,[(x+.3,2.95-j*.35),(x+2.5,2.95-j*.35)],c='#9aafb9',lw=1)
 a.text(x+1.4,.9,title,ha='center',fontsize=18,color=INK)
arrow(a,(4.1,2.5),(5.9,2.5));a.text(5,.2,'効果が不十分なら再改善。残る負担には保護具・服装・作業時間の調整も検討。',ha='center',fontsize=12,color=INK)
save(f,'environment-comparison','food-2-046','p2','ssw2',[131],['温度・湿度・騒音・振動を識別し改善前後の条件をそろえて確かめる'],'Blank measurement sheets intentionally supply no fabricated site data or exposure limits. Methods and acceptance criteria must come from approved workplace procedures.',['p122-environment'])

(OUT/'.gitattributes').write_text('*.webp -filter -diff -merge -text\n*.svg -filter -diff -merge -text\n')
(AUDIT/'figures34.json').write_text(json.dumps({'figures':manifest},ensure_ascii=False,indent=2)+'\n')
registry=['import type {ImageSourcePropType} from "react-native";','export const foodSourcePractice34: {id:string;lessonId:string;lessonSourceHash:string;paragraphId:string;source:ImageSourcePropType;width:number;height:number;aspectRatio:number}[] = [']
for f in manifest:
 row={k:f[k] for k in ['id','lessonId','lessonSourceHash','paragraphId','width','height']};registry.append(' '+json.dumps(row)[:-1]+',source:require("../../../'+f['assetFile']+'"),aspectRatio:'+str(f['width']/f['height'])+'},')
registry.append('];');(ROOT/'src/data/food-manufacturing/source-practice34.ts').write_text('\n'.join(registry)+'\n')
print(json.dumps({'figures':len(manifest),'atomicOutcomes':sum(len(f['atomicOutcomesJa']) for f in manifest),'webpBytes':sum((ROOT/f['assetFile']).stat().st_size for f in manifest)}))
