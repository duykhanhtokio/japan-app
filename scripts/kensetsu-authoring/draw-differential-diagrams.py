from PIL import Image,ImageDraw,ImageFont
import fitz,io,pathlib,math,json
R=pathlib.Path(__file__).resolve().parents[2];out=R/'assets/kensetsu/differential';out.mkdir(parents=True,exist_ok=True)
font=fitz.Font('japan').buffer
F=lambda n:ImageFont.truetype(io.BytesIO(font),n)
navy='#173750';gold='#B38432';cream='#FFFAEC';teal='#22766D';ink='#24384B'
def start(title):
 im=Image.new('RGB',(1200,650),cream);d=ImageDraw.Draw(im);d.rounded_rectangle((20,20,1180,630),radius=28,outline=gold,width=3);d.text((55,42),title,font=F(34),fill=navy);d.line((55,100,1145,100),fill=gold,width=2);d.text((55,590),'役割を比べる概念図・操作手順ではありません',font=F(23),fill=ink);return im,d
def card(d,x,y,w,h,title,lines):
 d.rounded_rectangle((x,y,x+w,y+h),radius=18,fill='#F0F3EE',outline=teal,width=3);d.text((x+22,y+22),title,font=F(31),fill=navy)
 for i,l in enumerate(lines):d.text((x+22,y+80+i*47),l,font=F(27),fill=ink)
def save(key,title,groups):
 im,d=start(title);w=(1090-(len(groups)-1)*24)//len(groups)
 for i,(t,ls)in enumerate(groups):card(d,55+i*(w+24),135,w,395,t,ls)
 im.save(out/(key+'.png'),optimize=True);return im
ims=[]
ims.append(save('b3','足場の接続先を区別する',[('クランプ',['単管　⇄　単管','管どうしの接続']),('壁つなぎ',['足場　⇄　建物','建物側への接続'])]))
ims.append(save('b4','接合工具の働きと、結果の確認',[('位置合わせ',['接合部の穴','○　○','穴の位置をそろえる']),('レンチ',['ボルト・ナット','回転','回す働き']),('確認',['工具の準備','≠','施工結果の確認'])]))
ims.append(save('b5','鉄筋の工具を目的で分ける',[('カッター',['切断','一本を切り分ける']),('ベンダー',['曲げ加工','形を曲げる']),('ハッカー・結束機',['結束','交差する鉄筋を結ぶ'])]))
ims.append(save('b6','接合部を調べる方法と情報',[('外側の形',['外観・形状の測定','外側の情報']),('超音波',['内部の状態の検査','内部の情報']),('引張・曲げ試験',['力を加える試験','実施と承認を区別'])]))
ims.append(save('b7','溶接の周辺にある道具・製品',[('石筆',['材料への印','目印を付ける']),('やっとこ',['材料の保持','つかむ']),('付着を抑える製品',['材料表面への対応','目・呼吸の保護とは','別の役割'])]))
ims.append(save('c3','土を運ぶ仕事と、面を整える仕事',[('スクレーパ',['土を取り込む','別の場所へ運ぶ','土を広げる']),('モーターグレーダ',['ブレードによる整形','地表や路盤材の','面を整える'])]))
ims.append(save('c5','推進設備の「力」と「案内」',[('元押しジャッキ',['前へ進める力','押す働き']),('推進台',['高さ・方向の案内','管を導く架台'])]))
ims.append(save('c6','海上作業の目的を分ける',[('浚渫船',['グラブ：つかむ','吸込み式：水と吸う','水底の土砂を除去']),('起重機船・土運船',['起重機船：吊る','土運船：土砂を運ぶ','引船：他船を動かす']),('測る機器',['ソナー・水深測定','対象の状態を調べる','除去作業とは別'])]))
ims.append(save('c7','井戸の掘削と、地中の水の集水',[('ボーリングマシン',['地中に穴をつくる','ビット：先端の部品','機械全体とは別']),('ウェルポイント設備',['ウェルポイント：','先端側でろ過・集水','ライザー管：地上へ接続'])]))
im,d=start('スランプ検尺が読む「高さの変化」')
d.line((120,175,690,175),fill=navy,width=3);d.text((110,125),'元の高さ',font=F(28),fill=navy)
d.polygon([(190,475),(245,340),(400,315),(465,370),(520,475)],fill='#A9B8B1',outline=teal)
d.line((120,475,690,475),fill=navy,width=3);d.line((560,175,560,315),fill=gold,width=5)
for yy,sg in [(175,1),(315,-1)]:d.line((548,yy+sg*15,560,yy,572,yy+sg*15),fill=gold,width=4)
d.line((400,315,590,315),fill=teal,width=2);d.text((585,220),'下がった分',font=F(27),fill=navy);d.text((150,500),'コーンを外した後の試料（模式図）',font=F(25),fill=ink)
card(d,780,140,365,385,'区別すること',['スランプの測定','≠ 硬化後の強度試験','','型枠側からの振動','≠ 内部締固めの全代替'])
im.save(out/'b8.png',optimize=True);ims.append(im)
contact=Image.new('RGB',(1200,5*325),'#dddddd')
for i,im in enumerate(ims):im=im.resize((600,325));contact.paste(im,((i%2)*600,(i//2)*325))
# Source-controlled generator; the review contact sheet is a temporary QA artifact.
import os
if os.environ.get('KENSETSU_DIAGRAM_CONTACT'):contact.save(os.environ['KENSETSU_DIAGRAM_CONTACT'])
print('rendered',len(ims),'original controlled diagrams')
