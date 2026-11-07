"""Original formwork/pump role geometry; not assembly, design or operating instructions."""
from pathlib import Path
helper = Path(__file__).with_name('draw-royal-differential-group01.py').read_text()
exec(helper.split('# Clamp:')[0])
OUT = ROOT / 'docs/ssw-workspace/kensetsu/royal-differential-20261107/group03'
OUT.mkdir(parents=True, exist_ok=True)

def cards(headings, rows):
    body=''.join(rect(x,135,347,425) for x in [55,426,797])
    for x,heading,lines in zip([78,449,820],headings,rows):
        body+=text(x,185,heading,29)
        for i,label in enumerate(lines):body+=text(x,235+i*42,label,25)
    return body

b=cards(['間隔・締付け','面と補強','荷重を受ける部分'],[
 ['セパレーター：間隔','Pコン：端部','フォームタイ：締付け'],
 ['せき板：接する面','桟木：補強・接続','パネル：板＋補強'],
 ['端太角・トンボ端太','横向きに受ける','パイプサポート：支柱']])
# Cross-section relationship: facing panels, spacing member, end parts/outside ties.
b+=rect(143,385,18,118,'#BBA47B',NAVY,2)+rect(295,385,18,118,'#BBA47B',NAVY,2)
b+=line(118,444,337,444,TEAL,7)
b+='<path d="M161 431 L185 438 V450 L161 457 Z M295 431 L271 438 V450 L295 457 Z" fill="#E7CC8F" stroke="#B38432" stroke-width="3"/>'
b+=line(127,421,127,467,GOLD,7)+line(327,421,327,467,GOLD,7)
# An original oblique panel with reinforcement on its rear face.
b+='<path d="M493 401 L650 382 L691 462 L534 484 Z" fill="#D8C398" stroke="#173750" stroke-width="3"/>'
b+=line(524,408,557,468,GOLD,9)+line(573,402,606,461,GOLD,9)+line(621,395,654,454,GOLD,9)
# Horizontal load receiving member and vertical support: relationship, no load sizing.
b+=rect(864,390,216,22,'#BBA47B',NAVY,2)+line(970,416,970,510,'#769AA5',17)+line(947,410,993,410,NAVY,7)+line(941,515,999,515,NAVY,5)
save('b9','型枠をつくる部材と、支える部材',b)

b=cards(['完成形をつくる','工具','剥離剤'],[
 ['面木：角の面取り','目地棒：平面の溝','欠き込み材：欠き込み'],
 ['フック：穴へ案内','タイ回し：締める・緩める'],
 ['型枠の表面に用いる','混和剤・支柱とは別','取外し可否の判断とは別']])
# Finished workpiece corner and surface groove, not a cut/installation sequence.
b+='<path d="M125 402 H208 L231 425 V493 H125 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/><path d="M208 402 L231 425" stroke="#B38432" stroke-width="7"/>'
b+='<path d="M264 402 H284 V425 H304 V402 H330 V493 H264 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
# Guide-through-hole relation, distinct from a circular tool motion.
b+=rect(520,364,15,123,'#D8C398',NAVY,2)+circle(527,406,12,'#FFFAEC')
b+='<path d="M473 442 L542 406 Q560 399 557 387" fill="none" stroke="#22766D" stroke-width="6" stroke-linecap="round"/>'
b+=circle(658,421,25,'#E7CC8F',NAVY,3)
b+='<path d="M626 395 A45 45 0 0 1 703 415 M703 415 L691 408 M703 415 L706 402" fill="none" stroke="#22766D" stroke-width="4"/>'
# Surface treatment: adjacent formwork and concrete with gold interface line.
b+=rect(878,388,25,121,'#D8C398',NAVY,2)+rect(917,388,139,121,'#DDE5EA',NAVY,2)+line(908,391,908,506,GOLD,6)
save('b10','形を残す・案内する・外しやすくする',b)

b=cards(['受入れ・検知','動力・給油','経路・支持'],[
 ['ホッパ：受入れ','スクリーン：開口の部品','レベル：量を検知'],
 ['PTO：動力の取出し','油圧回路：発生・制御','給油装置：摩擦部へ'],
 ['輸送管：材料の経路','ブーム：経路を届かせる','アウトリガ：車体安定']])
# Hopper mouth/screen and side sensor are separated in the schematic.
b+='<path d="M128 401 H330 L288 485 H170 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
b+=line(128,401,330,401,TEAL,6)
for x in [146,177,208,239,270,301]:b+=line(x,390,x,411,TEAL,3)
b+=rect(323,434,24,22,'#E7CC8F',GOLD,3)+line(299,445,323,445,GOLD,3)
# Different schematic destinations, not a claimed complete hydraulic circuit.
b+=circle(516,437,28,'#DDE5EA')+circle(516,437,11,'#E7CC8F')
b+=line(550,437,585,437,GOLD,4)+rect(595,403,82,66,'#E7CC8F',TEAL,7)
b+='<path d="M604 438 Q620 411 636 438 T668 438" fill="none" stroke="#22766D" stroke-width="3"/>'
b+=circle(697,490,11,'#E7CC8F',GOLD,3)
# Pipe path and a separate structural arm/support. No outriggers/load dimensions.
b+='<path d="M858 459 V397 H1058 V453" fill="none" stroke="#22766D" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>'
b+='<path d="M868 479 L945 425 L1035 425" fill="none" stroke="#B38432" stroke-width="7" stroke-linejoin="round"/>'
b+=line(945,425,945,403,GOLD,3)+line(1035,425,1035,403,GOLD,3)
b+=rect(862,480,180,22,'#DDE5EA',NAVY,3)+line(862,502,840,523,NAVY,5)+line(1042,502,1064,523,NAVY,5)+line(830,528,850,528,NAVY,4)+line(1054,528,1074,528,NAVY,4)
save('b11','ポンプの部位を目的で整理する',b)
