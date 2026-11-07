"""Marine contact, pile component and force-path concept diagrams."""
from pathlib import Path
s=Path(__file__).with_name('draw-royal-differential-groupC02.py').read_text().split('# Ground/rod')[0]
s=s.replace("in ['c7','c8','c9']", "in ['c13','c14','c15','c16']").replace("groupC02'","groupC04'")
exec(s)
# Buoyancy garment and no-foot-in-rope-loop warning. Not a fitting specification.
b=rect(102,444,418,77,'#DDECF0','#87AEBE',6)+f'<circle cx="311" cy="392" r="24" fill="#E7D4B3" stroke="{N}" stroke-width="3"/>'
b+=path('M283 418 Q311 432 340 418 L369 447 L351 499 H273 L254 447 Z','#E8C277',G,3)+path('M283 418 V477 H305 V444 H318 V477 H341 V418','none',N,3)+line(270,471,354,471,N,6)+rect(304,466,17,12,'#FFFAEC',N,2)
b+=path('M108 484 Q160 468 216 484 M405 484 Q460 468 513 484','none','#3183A2',3)
b+=f'<ellipse cx="853" cy="484" rx="108" ry="35" fill="none" stroke="{G}" stroke-width="8"/>'+path('M955 491 Q1003 498 1085 453','none',G,8)
b+=path('M847 405 V463 L903 474 V498 H815 V470 L822 405 Z','#A5B9C5',N,3)+path('M758 408 L960 529 M960 408 L758 529','none','#B34F40',6)
save('c13',b)
# Pile bore support/soil removal; leader/device; separately tank spray to surface.
b=soil(84,409,287,117)+rect(151,393,135,135,'url(#metal)',N,3)+rect(166,405,105,123,'#FFFAEC',N,2)+line(217,365,217,439,N,3)
b+=path('M217 439 L186 463 L217 489 L247 463 Z','url(#metal)')+path('M186 463 Q192 500 217 489 Q242 500 247 463','url(#metal)')+soil(205,479,24,10)
b+=line(514,375,514,529,N,8)+line(541,375,541,529,N,8)+line(514,383,541,383,G,4)+rect(506,437,43,62,'url(#metal)',N,5)+rect(494,528,103,11,'#B8C9D0',N,3)+rect(611,429,78,74,'url(#metal)',N,5)+line(596,466,611,466,G,2)
b+=rect(853,389,180,66,'url(#metal)',N,18)+line(1034,440,1064,440,N,4)+line(1064,440,1064,468,N,4)+line(1029,470,1098,470,N,5)
for xx in range(1033,1097,15):
 b+=path(f'M{xx} 476 L{xx-7} 500 M{xx} 476 L{xx+7} 500','none','#806744',2)
b+=soil(843,507,265,24)
save('c14',b)
# Independently drawn force directions; not the source's full launch-site layout.
b=rect(84,428,65,54,'url(#metal)',N,4)+rect(143,438,65,30,'url(#metal)',N,2)+rect(207,416,17,80,'#E8C277',G,2)+rect(232,425,144,58,'url(#metal)',N,6)+arrow(109,404,340,404)
b+=soil(456,413,74,116)+rect(531,406,22,130,'#A5B9C5',N,3)+rect(557,425,28,85,'#E8C277',G,2)+rect(594,438,124,41,'url(#metal)',N,4)+line(690,395,487,395,T,4)+path('M499 388 L487 395 L499 402','none',T,3)
b+=rect(834,435,111,57,'url(#metal)',N,4)+rect(944,443,40,40,'#E8C277',G,3)+rect(984,435,122,57,'url(#metal)',N,4)+arrow(951,414,1033,414)+line(850,503,850,525,N,3)+line(1090,503,1090,525,N,3)
save('c15',b)
# Mixer vessel and grab carrier; lead/sonar/anchor are distinct instruments.
b=path('M94 481 H295 L278 512 H111 Z','url(#metal)')+rect(127,450,79,25,'#C7DCD5',N,4)+path('M141 450 L162 402 L208 412 L194 457 Z','url(#metal)')+path('M205 441 H248 L260 468','none',T,5)
b+=path('M330 481 H553 L536 512 H348 Z','url(#metal)')+soil(372,459,105,20)+path('M393 454 L420 388 L514 437','none',N,4)+line(514,437,514,455,N,2)+path('M514 455 L495 475 L514 489 L532 475 Z','url(#metal)')
b+=rect(653,401,448,131,'#DEEDF2','#9DBDC9',4)+line(703,388,703,512,N,3)
for yy in range(409,506,16):b+=line(697,yy,709,yy,G,2)
b+=path('M695 509 H711 L718 524 H688 Z','url(#metal)')+rect(823,407,43,22,'url(#metal)',N,4)+path('M840 439 Q816 466 840 496 M853 439 Q877 466 853 496','none',T,3)
b+=path('M1005 418 V500 M978 480 Q1005 527 1032 480 M992 438 H1018','none',N,5)+path('M659 527 Q755 510 848 527 Q944 510 1096 527','none',G,3)
save('c16',b)
print('Wrote c13–c16 controlled relations,1200x650')
