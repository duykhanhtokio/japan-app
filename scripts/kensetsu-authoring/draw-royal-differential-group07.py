"""Partial structural relationships, explicitly without dimension/load/operation design."""
from pathlib import Path
base=Path(__file__).with_name('draw-royal-differential-group05.py').read_text().split('# Material handling')[0]
exec(base.replace('range(15,23)','[23,24,35,36,37,38,40,42]'))
OUT=ROOT/'docs/ssw-workspace/kensetsu/royal-differential-20261107/group07'
OUT.mkdir(parents=True,exist_ok=True)

# Column foot versus a bracket/beam-end relation. No fixing pattern/sequence implied.
b=rect(140,475,318,57,'#D8C398',NAVY,2)+rect(257,389,43,69,'#DDE5EA',NAVY,2)+rect(200,458,157,16,'#A9B8B1',NAVY,2)
for x in [217,340]:b+=line(x,447,x,518,GOLD,5)+rect(x-8,451,16,9,'#DDE5EA',NAVY,1)
b+=rect(704,387,38,137,'#DDE5EA',NAVY,2)+rect(742,429,88,24,'#DDE5EA',NAVY,2)+rect(846,429,216,24,'#DDE5EA',NAVY,2)
b+='<path d="M838 414 V469" fill="none" stroke="#B38432" stroke-width="3" stroke-dasharray="6 5"/>'
sheet(23,b)

# Information flow, bar/hoop roles and two distinct level positions.
b=rect(95,401,111,60,'#DDE5EA',TEAL,4)+text(150,438,'施工図',22,'middle')+rect(252,401,111,60,'#DDE5EA',GOLD,4)+text(307,438,'加工帳',22,'middle')
b+=line(211,430,244,430,NAVY,3)
b+='<path d="M233 423 L244 430 L233 437" fill="none" stroke="#173750" stroke-width="3"/>'
b+=rect(508,397,145,121,'#DDE5EA',NAVY,3)+rect(525,414,111,87,'none',TEAL,5)
for x,y in [(537,426),(624,426),(537,489),(624,489)]:b+=circle(x,y,6,'#E7CC8F',NAVY,2)
b+=rect(843,399,248,118,'#D8C398',NAVY,2)+line(862,422,1072,422,TEAL,7)+line(862,493,1072,493,GOLD,7)
sheet(24,b)

# A partial frame, a foot assembly and a diagonal are different spatial roles.
b=line(114,391,114,514,NAVY,8)+line(330,391,330,514,NAVY,8)+line(114,432,330,432,TEAL,7)
b+='<path d="M114 432 L152 412 H367 L330 432 Z" fill="#D8C398" stroke="#173750" stroke-width="2"/>'
b+=line(493,401,493,502,NAVY,7)+line(694,401,694,502,NAVY,7)+line(493,488,694,488,TEAL,6)
for x in [493,694]:b+=rect(x-23,501,46,9,'#DDE5EA',NAVY,1)+rect(x-35,511,70,15,'#D8C398',NAVY,1)
b+=line(847,394,847,516,NAVY,7)+line(1085,394,1085,516,NAVY,7)+line(847,516,1085,394,GOLD,6)+line(847,516,1085,516,TEAL,5)
sheet(35,b)

# Force transfer and a protected bar/neutralization front; no quantitative model.
b=rect(124,415,211,74,'#D8C398',NAVY,2)+line(143,462,316,462,TEAL,8)
b+=line(85,451,116,451,GOLD,3)+line(343,451,374,451,GOLD,3)
b+='<path d="M107 443 L116 451 L107 459 M352 443 L343 451 L352 459" fill="none" stroke="#B38432" stroke-width="3"/>'
b+=rect(484,398,220,113,'#D8E9E1',NAVY,2)+circle(594,454,19,'#769AA5',NAVY,3)
b+=rect(843,398,248,113,'#D8E9E1',NAVY,2)+rect(843,398,88,113,'#E8D6AE',GOLD,1)+circle(976,454,19,'#769AA5',NAVY,3)
b+='<path d="M931 399 V510" stroke="#B38432" stroke-width="3" stroke-dasharray="5 5"/>'
sheet(36,b)

# Joists, girder and posts contact in order; ties occupy distinct heights.
b=rect(124,420,375,15,'#D8C398',NAVY,2)
for x in [182,247,312,377,442]:b+=circle(x,443,8,'#DDE5EA',NAVY,2)
b+=rect(166,452,291,17,'#D8C398',NAVY,2)
for x in [215,409]:b+=line(x,476,x,523,'#769AA5',14)+line(x-19,469,x+19,469,NAVY,5)
b+=line(715,395,715,526,NAVY,8)+line(1048,395,1048,526,NAVY,8)+line(715,444,1048,444,GOLD,6)+line(715,511,1048,511,TEAL,6)
sheet(37,b)

# Hydraulic path and axial holding relation are separate from the gas/heat route.
b=rect(93,420,70,53,'#DDE5EA',NAVY,3)
b+='<path d="M163 447 C180 405 220 491 239 447" fill="none" stroke="#22766D" stroke-width="5"/>'
b+=rect(239,420,65,53,'#DDE5EA',NAVY,3)+line(305,446,341,446,GOLD,7)
b+=line(467,454,578,454,'#769AA5',18)+line(609,454,730,454,'#769AA5',18)+rect(490,428,32,52,'none',NAVY,4)+rect(674,428,32,52,'none',NAVY,4)
b+='<path d="M540 402 H580 M568 393 L580 402 L568 411 M647 402 H607 M619 393 L607 402 L619 411" fill="none" stroke="#B38432" stroke-width="3"/>'
b+='<path d="M840 412 L912 440 M840 482 L912 454" fill="none" stroke="#22766D" stroke-width="5"/>'
b+=rect(913,430,64,35,'#DDE5EA',NAVY,3)+line(979,447,1059,447,GOLD,7)
b+=text(1001,506,'ガスの経路',22,'middle')
sheet(38,b)

# Coating and metal core shown in section; particle comparison is unscaled.
b=rect(132,422,361,41,'#E8D6AE',GOLD,3)+rect(137,433,351,19,'#769AA5',NAVY,1)+circle(152,442,18,'#E8D6AE',GOLD,2)+circle(152,442,8,'#769AA5',NAVY,1)
for x,y in [(697,424),(731,438),(759,407),(789,451),(821,420),(725,478),(780,492)]:b+=circle(x,y,3,'#769AA5',TEAL,1)
for x,y in [(911,433),(986,474),(1067,418)]:b+=circle(x,y,12,'#E7CC8F',GOLD,2)
sheet(40,b)

# Different scaffold-format parts; edge restraint roles; arrest versus lifting.
b=line(111,503,111,415,NAVY,8)+line(111,415,195,415,NAVY,8)+line(195,415,195,503,NAVY,8)
b+=line(282,404,282,510,NAVY,7)+line(282,452,349,452,TEAL,7)
b+='<path d="M276 437 L292 437 L286 470 Z" fill="#E7CC8F" stroke="#173750" stroke-width="2"/>'
b+=rect(461,489,253,18,'#D8C398',NAVY,2)+rect(469,461,20,28,'#E7CC8F',NAVY,2)+line(488,397,488,490,NAVY,6)+line(488,403,714,403,TEAL,6)+line(488,444,714,444,TEAL,6)
b+=rect(830,401,292,42,'#DDE5EA',TEAL,4)+text(976,430,'墜落の制止',23,'middle')+text(976,479,'≠',36,'middle')+text(976,523,'荷物を上げる',23,'middle')
sheet(42,b)
