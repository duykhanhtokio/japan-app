"""Layer position, timber members and earthen-wall substrate; no installation design."""
from pathlib import Path
base=Path(__file__).with_name('draw-royal-differential-group05.py').read_text().split('# Material handling')[0]
exec(base.replace('range(15,23)','[25,26,30]').replace('assert len(spec)==8','assert len(spec)==3'))
OUT=ROOT/'docs/ssw-workspace/kensetsu/royal-differential-20261107/group08'
OUT.mkdir(parents=True,exist_ok=True)

# The same section distinguishes substrate and three coating positions. No scale.
b=rect(109,493,239,35,'#D8C398',NAVY,2)
for y,fill in [(466,'#DDE5EA'),(439,'#E8D6AE'),(412,'#D8E9E1')]:b+=rect(109,y,239,27,fill,NAVY,1)
for y,label in [(431,'上塗り'),(458,'中塗り'),(485,'下塗り'),(517,'素地')]:b+=text(371,y,label,22)
b+=rect(665,413,152,67,'#DDE5EA',TEAL,3)+rect(926,413,152,67,'#D8E9E1',TEAL,3)
b+=text(741,454,'前の工程',23,'middle')+text(1002,454,'次の工程',23,'middle')
b+=line(825,445,917,445,GOLD,3)+text(871,512,'製品・条件で照合',24,'middle')
sheet(25,b)

# Continuous versus storey-height posts. Partial roof section and temporary brace.
b=rect(88,510,274,15,'#D8C398',NAVY,1)+rect(88,446,274,14,'#D8C398',NAVY,1)
b+=rect(111,389,17,121,'#D8C398',NAVY,1)+rect(306,389,17,57,'#D8C398',NAVY,1)+rect(306,460,17,50,'#D8C398',NAVY,1)
b+=text(151,412,'通し柱',21)+text(237,493,'管柱',21)
b+='<path d="M468 444 L590 386 L711 444" fill="none" stroke="#173750" stroke-width="7"/>'
b+=rect(583,384,14,20,'#E8D6AE',NAVY,1)+rect(511,418,14,20,'#E8D6AE',NAVY,1)+rect(655,418,14,20,'#E8D6AE',NAVY,1)
b+=line(590,405,590,478,GOLD,9)+line(479,482,700,482,NAVY,8)
b+=text(590,521,'垂木・母屋・小屋束',21,'middle')
b+=line(847,396,847,518,NAVY,8)+line(1093,396,1093,518,NAVY,8)+line(847,396,1093,396,NAVY,8)+line(847,518,1093,518,NAVY,8)+line(847,518,1093,396,GOLD,5)
b+=rect(839,482,16,35,'#DDE5EA',TEAL,1)+text(971,549,'部分図・接合設計ではない',20,'middle')
sheet(26,b)

# A lattice is the substrate, whereas the adjacent section shows earthen layers.
b=''
for x in range(131,511,47):b+=line(x,397,x,520,'#B38432',9)
for y in range(404,521,28):b+=line(119,y,514,y,'#769A76',9)
b+=text(316,551,'小舞の面を見た例',21,'middle')
b+=rect(697,403,156,119,'#BBA482',NAVY,1)+rect(853,403,97,119,'#E8D6AE',NAVY,1)+rect(950,403,79,119,'#D8E9E1',NAVY,1)
b+=line(718,414,718,511,TEAL,7)
for x,label in [(718,'小舞'),(797,'荒壁'),(901,'中塗り'),(993,'上塗り')]:b+=text(x,551,label,21,'middle')
sheet(30,b)
