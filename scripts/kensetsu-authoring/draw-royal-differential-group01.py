"""Original controlled connection/task diagrams. Source evidence in group01 receipt.
No source artwork is used; geometry expresses relationships, not installation steps.
"""
from pathlib import Path
import subprocess
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/ssw-workspace/kensetsu/royal-differential-20261107/group01'
ASSETS = ROOT / 'assets/kensetsu/differential'
OUT.mkdir(parents=True, exist_ok=True)
ASSETS.mkdir(parents=True, exist_ok=True)
NAVY, TEAL, GOLD = '#173750', '#22766D', '#B38432'

def text(x,y,s,size=27,anchor='start'):
    return f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="{anchor}">{s}</text>'

def line(x1,y1,x2,y2,color=TEAL,width=12):
    return f'<path d="M{x1},{y1} L{x2},{y2}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round"/>'

def rect(x,y,w,h,fill='#F0F3EE',stroke=TEAL,rx=18):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'

def circle(x,y,r,fill='white',stroke=NAVY,width=3):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>'

def save(key,title,body):
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="650" viewBox="0 0 1200 650"><g font-family="Noto Sans CJK JP" fill="{NAVY}">'
    svg+=rect(20,20,1160,610,'#FFFAEC',GOLD,28)+text(55,78,title,34)+line(55,101,1145,101,GOLD,2)+body
    svg+=text(55,615,'役割を比べる概念図・操作手順ではありません',23)+'</g></svg>'
    path=OUT/(key+'.svg');path.write_text(svg+'\n')
    subprocess.run(['inkscape',str(path),'--export-type=png',f'--export-filename={ASSETS/(key+".png")}'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)

# Clamp: two pipe axes meet at one connector; wall tie: scaffold-to-building.
b=rect(55,135,532,425)+rect(613,135,532,425)
b+=text(78,185,'クランプ',31)+text(635,185,'壁つなぎ',31)
b+=line(145,320,485,320,'#A9B8B1',30)+line(315,245,315,405,'#769AA5',30)
b+=rect(285,292,60,56,'#E7CC8F',GOLD,8)+circle(302,320,6,NAVY)+circle(329,320,6,NAVY)
b+=text(125,450,'単管　⇄　単管',28)+text(125,500,'管どうしの接続')
b+=line(715,255,715,405,'#769AA5',18)+line(715,325,1000,325,GOLD,17)
b+=rect(997,228,90,185,'#DDE5EA',NAVY,2)+rect(978,304,24,42,'#E7CC8F',GOLD,2)
b+=text(680,450,'足場　⇄　建物',28)+text(680,500,'建物側への接続')
save('b3','足場の接続先を区別する',b)

# Distinguish hole alignment, rotation, and confirmation. No force/acceptance values.
b=''.join(rect(x,135,347,425) for x in [55,426,797])
b+=text(78,185,'位置合わせ',31)+text(449,185,'レンチ',31)+text(820,185,'確認',31)
b+=text(78,233,'接合部の穴')+rect(118,277,160,100,'#EDE2BF',GOLD,3)+rect(142,299,160,100,'#DDE5EA',TEAL,3)
b+=circle(198,328,25,'none',GOLD,5)+circle(218,344,25,'none',TEAL,5)
b+=line(198,310,218,310,GOLD,3)+text(78,495,'穴の位置をそろえる',25)
b+=circle(600,337,46,'#DDE5EA',NAVY,4)
b+='<path d="M600 307 L626 322 L626 352 L600 367 L574 352 L574 322 Z" fill="#E7CC8F" stroke="#173750" stroke-width="4"/>'
b+='<path d="M557 296 A65 65 0 0 1 663 318 M663 318 L648 310 M663 318 L665 300" fill="none" stroke="#22766D" stroke-width="5"/>'
b+=text(449,233,'ボルト・ナット')+text(449,450,'回転')+text(449,495,'回す働き')
b+=text(820,280,'工具の準備')+text(970,370,'≠',64,'middle')+text(820,455,'施工結果の確認',25)
save('b4','接合工具の働きと、結果の確認',b)

# Workpiece states show task differences without inventing equipment models.
b=''.join(rect(x,135,347,425) for x in [55,426,797])
b+=text(78,185,'カッター',31)+text(449,185,'ベンダー',31)+text(820,185,'ハッカー・結束機',27)
b+=text(78,235,'切断')+text(449,235,'曲げ加工')+text(820,235,'結束')
b+=line(110,345,205,345,'#769AA5',25)+line(243,345,345,345,'#769AA5',25)
b+=line(224,315,224,375,GOLD,3)
b+='<path d="M487 365 H600 Q635 365 635 330 V285" fill="none" stroke="#769AA5" stroke-width="25" stroke-linecap="round"/>'
b+=line(855,345,1080,345,'#769AA5',23)+line(970,275,970,420,'#A9B8B1',23)
b+='<path d="M948 326 Q981 302 992 332 L950 367 Q978 391 994 355 Z" fill="none" stroke="#B38432" stroke-width="6" stroke-linejoin="round"/>'
b+=text(78,495,'一本を切り分ける',25)+text(449,495,'形を曲げる')+text(820,495,'交差する鉄筋を結ぶ',25)
save('b5','鉄筋の工具を目的で分ける',b)
