"""Eight original source-bound technical relation sheets; no operation/design values."""
from pathlib import Path
import ast
from PIL import ImageFont
helper=Path(__file__).with_name('draw-royal-differential-group01.py').read_text()
exec(helper.split('# Clamp:')[0])
OUT=ROOT/'docs/ssw-workspace/kensetsu/royal-differential-20261107/group05'
OUT.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',24)
spec={}
for node in ast.walk(ast.parse(Path(__file__).with_name('draw-differential-diagrams.py').read_text())):
    if isinstance(node,ast.Call) and isinstance(node.func,ast.Name) and node.func.id=='save' and isinstance(node.args[0],ast.Constant) and node.args[0].value in [f'b{i}' for i in range(15,23)]:
        spec[node.args[0].value]=(ast.literal_eval(node.args[1]),ast.literal_eval(node.args[2]))
assert len(spec)==8

def sheet(n,diagram):
    title,groups=spec[f'b{n}'];count=len(groups);w=(1090-(count-1)*24)//count;b=''
    for i,(heading,lines) in enumerate(groups):
        x=55+i*(w+24);b+=rect(x,135,w,425)+text(x+22,185,heading,29)
        wrapped=[]
        for label in lines:
            part=''
            for char in label:
                if part and font.getlength(part+char)>w-44:wrapped.append(part);part=''
                part+=char
            wrapped.append(part)
        assert len(wrapped)<=4,(n,wrapped)
        for j,label in enumerate(wrapped):b+=text(x+22,235+40*j,label,24)
    save(f'b{n}',title,b+diagram)

# Material handling, masking/removal, and roller pile are three different relations.
b='<path d="M105 429 L254 403 L284 454 L135 480 Z" fill="#D8C398" stroke="#173750" stroke-width="3"/>'
b+=line(173,473,173,497,NAVY,5)+line(151,498,196,498,NAVY,5)
b+='<path d="M213 395 L251 373 L264 390 L250 414 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
b+=rect(464,412,249,83,'#DDE5EA',NAVY,3)+rect(469,412,106,78,'#D8E9E1',TEAL,1)+line(575,415,575,490,GOLD,7)
b+='<path d="M642 418 L689 392 L701 407 L662 437 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/><path d="M627 440 Q654 420 678 437" fill="none" stroke="#B38432" stroke-width="4"/>'
for x,length in [(849,13),(1000,5)]:
    b+=rect(x,424,85,30,'#E8D6AE',NAVY,12)
    for off in range(7,82,12):b+=line(x+off,424,x+off,424-length,GOLD,2)+line(x+off,454,x+off,454+length,GOLD,2)
sheet(15,b)

# Workpiece shape, straight/curved cutting paths, and unscaled coating sections.
b='<path d="M105 407 H250 L297 438 L250 482 H105 Z" fill="#D8C398" stroke="#173750" stroke-width="3"/>'
b+=line(239,411,239,479,TEAL,4)
b+=line(318,463,318,394,GOLD,4)+line(309,404,318,394,GOLD,4)+line(327,404,318,394,GOLD,4)
b+=rect(465,399,104,98,'#DDE5EA',NAVY,2)+rect(621,399,104,98,'#DDE5EA',NAVY,2)
b+=line(481,415,551,481,TEAL,4)
b+='<path d="M637 415 Q713 422 640 481" fill="none" stroke="#B38432" stroke-width="4"/>'
for y,paint in [(395,False),(440,True)]:
    b+=rect(846,y,234,23,'#769AA5',NAVY,1)+line(848,y-3,1078,y-3,GOLD,5)
    if paint:b+=line(848,y-9,1078,y-9,TEAL,5)
b+=rect(846,489,234,23,'#A9B8B1',NAVY,1)
for x in range(863,1070,27):b+=circle(x,500,3,GOLD,GOLD,1)
sheet(16,b)

# Cross-section distinguishes information gathering, adhesion and separation.
b=rect(103,449,247,42,'#D8C398',NAVY,2)+rect(103,425,247,18,'#DDE5EA',NAVY,2)
b+='<path d="M169 449 Q204 435 241 449" fill="#FFFAEC" stroke="#173750" stroke-width="2"/>'
b+=line(152,392,225,412,'#769AA5',7)+circle(230,414,10,'#E7CC8F',NAVY,2)
b+='<path d="M253 400 Q270 413 253 426 M264 390 Q291 413 264 436" fill="none" stroke="#22766D" stroke-width="2"/>'
b+=rect(466,449,249,42,'#D8C398',NAVY,2)+rect(466,435,249,14,'#E7CC8F',GOLD,1)+rect(466,414,249,21,'#DDE5EA',NAVY,2)
b+=rect(526,391,118,17,'#D8C398',NAVY,2)
b+='<path d="M851 418 H949 V492 H851 Z M969 418 H1067 V492 H969 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
b+=line(959,412,959,498,GOLD,3)
sheet(17,b)

# Board edge/joint; wall stud bracing; ceiling suspension connection targets.
b='<path d="M103 421 H193 L208 436 V482 H103 Z M218 421 H315 V482 H218 Z" fill="#E8D6AE" stroke="#173750" stroke-width="3"/>'
b+=line(181,421,207,421,TEAL,6)+line(194,423,208,437,GOLD,6)+rect(188,414,48,7,'#D8E9E1',TEAL,1)
b+='<path d="M487 393 H512 V491 H487 M668 393 H693 V491 H668" fill="none" stroke="#173750" stroke-width="6"/>'
b+=line(500,443,681,443,TEAL,8)+rect(489,415,23,16,'#E7CC8F',GOLD,2)+rect(670,415,23,16,'#E7CC8F',GOLD,2)
b+=line(963,383,963,416,NAVY,5)
b+='<path d="M942 414 V447 H984 V414" fill="none" stroke="#B38432" stroke-width="5"/>'
b+=line(942,414,984,414,GOLD,5)
b+=rect(861,430,205,18,'#DDE5EA',NAVY,2)+rect(947,449,31,12,'#E7CC8F',GOLD,2)+rect(950,459,24,60,'#DDE5EA',NAVY,2)
sheet(18,b)

# Compass/divider endpoints and radius relation; vinyl seam; pressing layers.
b=circle(159,452,45,'none',TEAL,2)
b+='<path d="M159 452 L184 393 L204 452 M271 452 L295 393 L320 452" fill="none" stroke="#173750" stroke-width="5" stroke-linecap="round"/>'
b+=line(199,440,206,454,'#B38432',6)+circle(184,393,5,'#E7CC8F')+circle(295,393,5,'#E7CC8F')
b+=rect(466,423,110,61,'#D8E9E1',NAVY,2)+rect(584,423,131,61,'#D8E9E1',NAVY,2)+line(580,426,580,481,GOLD,7)
b+=rect(837,461,111,20,'#D8C398',NAVY,2)+line(839,456,946,456,TEAL,5)+circle(899,428,24,'#DDE5EA',NAVY,3)+line(899,403,918,388,NAVY,4)
b+=rect(1035,390,18,111,'#D8C398',NAVY,2)+line(1030,392,1030,499,TEAL,5)+circle(1004,444,22,'#DDE5EA',NAVY,3)
sheet(19,b)

# Wedge thickness and frame gap; two components leading to a cellular material.
b=rect(116,430,230,24,'#D8C398',NAVY,2)+rect(116,510,230,22,'#DDE5EA',NAVY,2)
b+='<path d="M147 509 L288 456 V509 Z" fill="#E7CC8F" stroke="#173750" stroke-width="3"/>'
b+=rect(672,390,125,43,'#DDE5EA',TEAL,5)+rect(855,390,125,43,'#DDE5EA',TEAL,5)
b+=text(734,420,'成分',23,'middle')+text(917,420,'成分',23,'middle')
b+='<path d="M734 435 V455 H826 M917 435 V455 H826 V474" fill="none" stroke="#22766D" stroke-width="3"/>'
b+=rect(756,478,143,54,'#E8D6AE',NAVY,5)
for x,y in [(773,492),(799,503),(834,494),(873,511),(809,522),(850,520)]:b+=circle(x,y,7,'#FFFAEC',GOLD,1)
sheet(20,b)

# Cartridge/gun relation, distinct interface and sheet material taxonomy.
b=rect(104,403,166,32,'#DDE5EA',NAVY,6)
b+='<path d="M270 406 L314 419 L270 432 M119 437 L132 490 H151 L142 435 M104 419 H83" fill="none" stroke="#173750" stroke-width="5" stroke-linejoin="round"/>'
b+='<path d="M286 501 V475 H310 V501" fill="none" stroke="#B38432" stroke-width="4"/>'
b+=rect(478,456,231,42,'#D8C398',NAVY,2)+rect(478,428,231,22,'#DDE5EA',NAVY,2)+line(480,453,707,453,GOLD,5)
for x,y,l in [(834,389,'アスファルト'),(834,432,'改質型'),(993,389,'加硫ゴム系'),(993,432,'塩ビ')]:
    b+=rect(x,y,130,34,'#DDE5EA',TEAL,4)+text(x+65,y+25,l,18,'middle')
sheet(21,b)

# Cutting edge versus hammer; two comparable textured striking faces.
b='<path d="M132 410 H181 L171 495 H143 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
b+=line(143,495,171,495,GOLD,5)+rect(299,395,74,37,'#DDE5EA',NAVY,8)+line(336,435,336,508,'#BBA47B',13)
for x,step in [(672,21),(862,12)]:
    b+=rect(x,398,139,108,'#DDE5EA',NAVY,7)
    for xx in range(x+15,x+130,step):
        for yy in range(412,495,step):b+=circle(xx,yy,2.5,GOLD,GOLD,1)
sheet(22,b)
