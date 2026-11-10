from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
P=Path(__file__).resolve().parents[2];out=P/'assets/kensetsu/daily-technical-reviewed-20261107/network-role-v2.png'
im=Image.new('RGB',(1400,875),'#fffaf0');d=ImageDraw.Draw(im);N='#173a52';G='#c59a45';T='#238a80';B='#6685a8';font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def txt(x,y,t,size=29):d.text((x,y),t,font=ImageFont.truetype(font,size),fill=N)
d.rounded_rectangle((18,18,1382,857),radius=30,outline=G,width=3);txt(50,40,'通信の経路・機器・電源・確認用具を分ける',42);d.line((50,112,1350,112),fill=G,width=2)
for x in [350,700,1050]:d.line((x,158,x,695),fill='#e1d7bf',width=2)
# Media: separate examples of cable and radio. No installed topology.
txt(72,155,'信号の通り道',32)
d.arc((76,251,258,441),50,320,fill=B,width=17);d.line((215,268,270,268),fill=B,width=17);d.rounded_rectangle((259,248,302,286),radius=4,fill='#a4bdc4',outline=N,width=3)
for x in range(267,296,7):d.line((x,250,x,260),fill=G,width=3)
d.line((131,432,131,465),fill=B,width=17);d.rectangle((111,455,151,503),fill='#a4bdc4',outline=N,width=3)
for r in [28,49,70]:d.arc((253-r,420-r,253+r,420+r),215,325,fill=T,width=5)
d.ellipse((245,413,261,429),fill=T)
txt(86,557,'有線・無線',29);txt(65,608,'ケーブル・電波',26)
# Equipment: neutral network equipment examples, no terminal or wiring claims.
txt(445,155,'通信機器',32)
d.rounded_rectangle((399,260,654,503),radius=12,fill='#a4bdc4',outline=N,width=4)
for y in [285,348,411]:
 d.rectangle((419,y,635,y+44),fill='#e8eee9',outline=N,width=3)
 for x in [439,460,481,502]:d.rectangle((x,y+17,x+12,y+29),fill=N)
 d.ellipse((607,y+17,617,y+27),fill=T)
txt(392,557,'ハブ・ルータ等の例',27);txt(386,608,'情報を中継する役割',26)
# Power is a distinct role, not connected as a signal path.
txt(769,155,'機器の電源',32)
d.rounded_rectangle((787,261,969,507),radius=12,fill='#d3be89',outline=N,width=4);d.rectangle((810,286,946,333),fill='#e8eee9',outline=N,width=3)
d.polygon([(889,354),(852,411),(879,411),(867,471),(912,400),(888,400)],fill=N)
for x in range(807,953,18):d.line((x,483,x+8,483),fill=N,width=3)
txt(752,557,'通信用の電力設備',27);txt(748,608,'信号の経路と区別',26)
# Tester shown separately, not falsely placed in series between active devices.
txt(1118,155,'確認用具',32)
d.rounded_rectangle((1135,270,1298,508),radius=14,fill='#c7d1cb',outline=N,width=4);d.rectangle((1160,296,1274,347),fill='#fffaf0',outline=N,width=3)
for y in [372,400,428,456]:
 for x in [1177,1236]:d.ellipse((x,y,x+12,y+12),fill=T)
d.rectangle((1185,256,1249,270),fill='#a4bdc4',outline=N,width=3)
txt(1101,557,'LANテスター等',27);txt(1084,608,'配線を調べる用具',26)
txt(95,730,'役割の比較です。確認用具を、通信機器どうしの常設の経路として示していません。',27)
txt(50,802,'装置間の接続・配線方法、性能・試験の合否、停電時の利用範囲を指定する図ではありません。',25)
im.save(out,optimize=True);print(out)
