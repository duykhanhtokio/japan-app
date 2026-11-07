"""Source-bound door, waterproofing/stone and tile relation sections."""
from pathlib import Path
base=Path(__file__).with_name('draw-royal-differential-group05.py').read_text().split('# Material handling')[0]
exec(base.replace('range(15,23)','[27,28,29]').replace('assert len(spec)==8','assert len(spec)==3'))
OUT=ROOT/'docs/ssw-workspace/kensetsu/royal-differential-20261107/group09'
OUT.mkdir(parents=True,exist_ok=True)

# Framed/panel door face and flush door edge section; horizontal motion vs hinge.
b=rect(88,391,108,132,'#D8C398',NAVY,1)+rect(106,410,72,94,'#DDE5EA',TEAL,1)
b+=rect(239,392,15,130,'#DDE5EA',TEAL,1)+rect(254,392,49,130,'#D8C398',NAVY,1)+rect(303,392,15,130,'#DDE5EA',TEAL,1)
b+=text(143,549,'かまち戸',20,'middle')+text(278,549,'フラッシュ戸',20,'middle')
b+=rect(466,394,249,13,'#D8C398',NAVY,1)+rect(466,516,249,13,'#D8C398',NAVY,1)+rect(536,409,102,95,'#DDE5EA',NAVY,1)
for x in [555,618]:b+=circle(x,509,7,'#E8D6AE',NAVY,2)
b+=line(488,467,520,467,GOLD,3)+line(647,467,691,467,GOLD,3)
b+='<path d="M497 460 L488 467 L497 474 M682 460 L691 467 L682 474" fill="none" stroke="#B38432" stroke-width="3"/>'
b+=circle(851,495,6,'#E8D6AE',NAVY,2)+line(851,495,851,407,NAVY,6)+line(851,495,939,495,TEAL,8)
b+='<path d="M851 407 A88 88 0 0 1 939 495" fill="none" stroke="#B38432" stroke-width="3" stroke-dasharray="6 5"/>'
b+=text(1033,434,'上から',21,'middle')+text(1033,463,'見た例',21,'middle')
sheet(27,b)

# Fixing disc and sheet overlap are separate contact locations, not a fixing plan.
b=rect(101,484,419,37,'#D8C398',NAVY,1)+line(101,468,340,468,TEAL,9)+line(298,459,520,459,TEAL,9)
b+=rect(165,473,47,11,'#E8D6AE',NAVY,1)+line(188,479,188,509,GOLD,4)
b+=text(188,550,'固定部',21,'middle')+text(384,550,'シート接合部',21,'middle')
b= b+rect(672,406,35,113,'#D8C398',NAVY,1)+rect(707,406,42,113,'#BBA482',NAVY,1)+rect(749,406,38,113,'#DDE5EA',NAVY,1)
b+=rect(941,406,35,113,'#D8C398',NAVY,1)+rect(1030,406,38,113,'#DDE5EA',NAVY,1)
b+='<path d="M962 441 H1048 V458 M962 489 H1048 V475" fill="none" stroke="#B38432" stroke-width="6"/>'
b+=text(731,550,'湿式の断面例',21,'middle')+text(1007,550,'乾式の断面例',21,'middle')
sheet(28,b)

# Tile underside relief meets bedding material; timeline is a permitted interval.
b=rect(105,480,408,43,'#D8C398',NAVY,1)+rect(105,450,408,30,'#E8D6AE',NAVY,1)
b+='<path d="M105 404 H513 V450 H469 V465 H445 V450 H372 V465 H348 V450 H275 V465 H251 V450 H178 V465 H154 V450 H105 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
b+=text(307,550,'タイル裏面と張付け材',22,'middle')
b+=line(685,435,1076,435,NAVY,3)+circle(719,435,5,'#173750')+rect(719,419,278,30,'#D8E9E1',TEAL,1)
b+=text(719,491,'塗付け',21,'middle')+text(867,395,'張付け可能な時間',23,'middle')
b+=text(871,541,'条件は製品等で確認',23,'middle')
sheet(29,b)
