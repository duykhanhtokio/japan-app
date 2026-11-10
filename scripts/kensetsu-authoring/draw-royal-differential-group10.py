"""Partial role geometry only; no construction, support or safe-access design."""
from pathlib import Path
base=Path(__file__).with_name('draw-royal-differential-group05.py').read_text().split('# Material handling')[0]
exec(base.replace('range(15,23)','[31,32,41,47,48,58]').replace('assert len(spec)==8','assert len(spec)==6'))
OUT=ROOT/'docs/ssw-workspace/kensetsu/royal-differential-20261107/group10'
OUT.mkdir(parents=True,exist_ok=True)

# Covered surface receives wind; ties have a different connection role.
b=rect(267,396,224,134,'#DDE5EA',NAVY,1)
for y in [415,463,511]:
 b+=line(111,y,234,y,GOLD,4)+line(220,y-9,234,y,GOLD,4)+line(220,y+9,234,y,GOLD,4)
for x in [267,491]:b+=line(x,396,x,530,NAVY,7)
b+=line(268,396,490,530,TEAL,4)+line(730,397,730,528,NAVY,9)+rect(1042,390,42,141,'#D8C398',NAVY,1)
for y in [418,493]:b+=line(730,y,1042,y,GOLD,9)
b+=text(889,550,'足場と建物をつなぐ',22,'middle')
sheet(31,b)

# Falling outside an edge versus passing through a broken roof surface.
b=line(111,421,368,421,NAVY,12)+line(111,430,111,531,NAVY,8)
b+='<path d="M291 392 H406 V525 M397 513 L406 525 L415 513" fill="none" stroke="#B38432" stroke-width="5"/>'
b+=text(419,449,'端',22)
b+=line(680,421,831,421,NAVY,12)+line(922,421,1073,421,NAVY,12)
b+='<path d="M831 421 L848 438 L858 424 M892 425 L904 440 L922 421 M877 385 V524 M868 512 L877 524 L886 512" fill="none" stroke="#B38432" stroke-width="5"/>'
b+=text(877,550,'屋根面を通り抜ける危険',22,'middle')
sheet(32,b)

# Documented communication and actual system condition are separate evidence.
b=rect(101,400,135,91,'#DDE5EA',TEAL,2)+text(168,454,'連絡記録',23,'middle')+text(285,458,'≠',38,'middle')+rect(344,400,155,91,'#D8C398',NAVY,2)+text(421,440,'現地の',23,'middle')+text(421,473,'系統状態',23,'middle')
b+=rect(669,390,158,119,'#DDE5EA',NAVY,1)+rect(923,390,158,119,'#DDE5EA',NAVY,1)
for y in [428,468]:b+=line(671,y,825,y,NAVY,5)+line(925,y,1079,y,NAVY,5)
b+='<path d="M746 379 V402 M738 393 L746 402 L754 393 M1002 464 V494 M994 485 L1002 494 L1010 485" fill="none" stroke="#B38432" stroke-width="4"/>'
b+=rect(950,510,104,15,'#E8D6AE',GOLD,1)
b+=text(748,546,'上部から',21,'middle')+text(1001,546,'支持して降下',21,'middle')
sheet(41,b)

# Roof material and underlay are distinct layers. Stops differ from a gutter.
b='<path d="M117 444 L480 404 L484 439 L121 479 Z" fill="#D8C398" stroke="#173750" stroke-width="3"/>'
b+=line(116,435,480,395,TEAL,10)+line(116,420,480,380,NAVY,15)+text(304,521,'上：屋根材　下：下葺き材',21,'middle')
b+='<path d="M689 405 L1066 458" fill="none" stroke="#173750" stroke-width="9"/><path d="M877 432 L882 398 H900" fill="none" stroke="#B38432" stroke-width="7"/><path d="M1035 480 Q1064 526 1091 480" fill="none" stroke="#22766D" stroke-width="7"/>'
b+=text(842,549,'雪止め',22,'middle')+text(1058,549,'雨どい',22,'middle')
sheet(47,b)

# A wedge occupies a clearance; fixing transfers to the structural side.
b=rect(118,413,257,34,'#D8C398',NAVY,1)+rect(118,510,257,27,'#DDE5EA',NAVY,1)
b+='<path d="M151 508 L329 449 V508 Z" fill="#E8D6AE" stroke="#B38432" stroke-width="3"/>'
b+=rect(708,398,67,136,'#D8C398',NAVY,1)+rect(1004,398,50,136,'#DDE5EA',NAVY,1)
b+='<path d="M746 454 H1026 V483" fill="none" stroke="#B38432" stroke-width="10"/>'
b+=text(876,551,'躯体側と枠側の固定部',22,'middle')
sheet(48,b)

# A translucent section indicates concealed services, not service routing design.
b=rect(125,397,345,135,'#D8C398',NAVY,1)+line(192,414,192,510,TEAL,8)+line(192,472,416,472,TEAL,8)+line(281,414,416,414,GOLD,5)
b+='<rect x="334" y="397" width="137" height="135" fill="#DDE5EA" fill-opacity="0.88" stroke="#173750" stroke-width="3"/>'
b+=text(298,551,'内部と閉じる面の関係',22,'middle')
b+=rect(676,475,163,37,'#DDE5EA',NAVY,1)+rect(848,475,197,37,'#DDE5EA',NAVY,1)+rect(798,461,92,13,'#D8E9E1',TEAL,1)
b+='<path d="M763 461 Q842 448 923 461" fill="#E8D6AE" stroke="#B38432" stroke-width="3"/>'
b+=text(865,549,'継目の補強と表面の調整',22,'middle')
sheet(58,b)
