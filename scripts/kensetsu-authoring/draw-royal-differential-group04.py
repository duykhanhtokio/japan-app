"""Controlled grain, composition and plastering-geometry relationships."""
from pathlib import Path
helper=Path(__file__).with_name('draw-royal-differential-group01.py').read_text()
exec(helper.split('# Clamp:')[0])
OUT=ROOT/'docs/ssw-workspace/kensetsu/royal-differential-20261107/group04'
OUT.mkdir(parents=True,exist_ok=True)

def cards(headings,rows):
    b=''.join(rect(x,135,347,425) for x in [55,426,797])
    for x,h,ls in zip([78,449,820],headings,rows):
        b+=text(x,185,h,29)
        for i,l in enumerate(ls):b+=text(x,235+i*42,l,25)
    return b

b=cards(['切る方向','削る形','印と打撃'],[
 ['縦引き：繊維に沿う','横引き：繊維を横切る','両刃：両側に用途別の刃'],
 ['のみ：溝や穴を削る','かんな：表面を整える','きり：回転で穴をつくる'],
 ['筋毛引き：平行な線','げんのう：打撃','用途を入れ替えない']])
# Two equal blocks: the same grain direction, different cutting orientation.
for x in [100,245]:
    b+=rect(x,379,108,119,'#E8D6AE',NAVY,2)
    for off in [15,35,55,75,95]:
        b+=f'<path d="M{x+off} 384 Q{x+off-7} 433 {x+off} 493" fill="none" stroke="#BBA47B" stroke-width="2"/>'
b+=line(154,387,154,489,TEAL,5)+line(251,437,347,437,GOLD,5)
b+=text(154,534,'縦引き',21,'middle')+text(299,534,'横引き',21,'middle')
# Workpiece profiles, not claims that one tool substitutes for another.
b+='<path d="M462 413 H484 V438 H510 V413 H532 V493 H462 Z" fill="#E8D6AE" stroke="#173750" stroke-width="3"/>'
b+=rect(552,442,70,51,'#E8D6AE',NAVY,2)+line(555,440,619,440,TEAL,5)
b+=rect(650,413,80,80,'#E8D6AE',NAVY,2)+circle(690,453,18,'#FFFAEC',TEAL,3)
b+='<path d="M674 407 A25 25 0 0 1 715 426 M715 426 L703 421 M715 426 L717 414" fill="none" stroke="#B38432" stroke-width="3"/>'
# A reference edge and a parallel marked line are explicit, not freehand decoration.
b+=rect(837,382,145,107,'#E8D6AE',NAVY,2)+line(840,414,978,414,TEAL,3)+line(840,382,978,382,GOLD,4)
b+=rect(954,372,17,33,'#BBA47B',NAVY,1)+line(962,402,962,415,NAVY,3)
b+=line(1047,409,1047,502,'#BBA47B',12)+rect(1017,393,60,25,'#DDE5EA',NAVY,9)
save('b12','木の繊維・削る形・印の基準',b)

b=rect(55,135,532,425)+rect(613,135,532,425)
b+=text(78,185,'モルタル',31)+text(635,185,'漆喰',31)
for x,ls in [(78,['セメント・水・砂','砂利を含む一般的な','コンクリートと区別']), (635,['消石灰が中心','糊・スサを組み合わせる','配合は製品ごとに確認'])]:
    for i,l in enumerate(ls):b+=text(x,235+42*i,l,26)
# A component relationship map intentionally carries no quantities/proportions.
for x,label,w in [(84,'セメント',154),(263,'水',75),(363,'砂',75),(642,'消石灰',133),(800,'糊',75),(900,'スサ',110)]:
    b+=rect(x,373,w,49,'#DDE5EA',TEAL,6)+text(x+w/2,405,label,23,'middle')
for x in [161,300,400]:b+=f'<path d="M{x} 422 V450 H300 V471" fill="none" stroke="#22766D" stroke-width="2"/>'
for x in [708,837,955]:b+=f'<path d="M{x} 422 V450 H837 V471" fill="none" stroke="#22766D" stroke-width="2"/>'
b+=rect(208,473,185,51,'#F5EAD1',GOLD,7)+text(300,508,'モルタル',25,'middle')
b+=rect(755,473,164,51,'#F5EAD1',GOLD,7)+text(837,508,'漆喰',25,'middle')
save('b13','左官材料を主な成分から分ける',b)

b=cards(['面・狭い場所','角・塗付け','保持・掃除'],[
 ['仕上げ・中塗りごて','柳刃ごて・目地ごて','角ごて：押さえ仕上げ'],
 ['面引き：出隅','切り付け：入隅','くし目：櫛状の部分'],
 ['こて板：材料の台','ちりぼうき：散り際','塗り付けるこてと区別']])
# Blade face shapes are controlled geometry, with neck/handle separated.
b+='<path d="M110 430 L169 391 L228 430 L211 493 H127 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
b+=line(168,444,168,418,NAVY,5)+line(137,416,199,416,'#BBA47B',12)
b+=rect(281,401,24,102,'#DDE5EA',NAVY,2)+line(293,455,293,426,NAVY,4)+line(268,425,318,425,'#BBA47B',10)
# Solid workpiece distinguishes an outside corner from an inside recess.
b+='<path d="M476 409 H552 V490 H476 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/><path d="M535 409 H552 V427" fill="none" stroke="#B38432" stroke-width="6"/>'
b+='<path d="M620 409 H647 V460 H697 V490 H620 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/><path d="M647 441 V460 H666" fill="none" stroke="#B38432" stroke-width="6"/>'
b+=text(514,531,'出隅',21,'middle')+text(658,531,'入隅',21,'middle')
# Board underside grip versus a separate brush; no application procedure shown.
b+='<path d="M839 418 L963 400 L986 441 L862 460 Z" fill="#D8C398" stroke="#173750" stroke-width="3"/><path d="M883 457 V478 H933 V451" fill="none" stroke="#173750" stroke-width="6"/>'
b+=line(1063,387,1050,442,'#BBA47B',12)
for dx in [-25,-15,-5,5,15,25]:b+=line(1050,439,1050+dx,491,GOLD,3)
save('b14','こての対象と、周りの道具',b)
