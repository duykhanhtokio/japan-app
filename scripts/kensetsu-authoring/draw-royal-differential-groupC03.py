"""Civil well, marine and tunnel relationship diagrams, not specifications."""
from pathlib import Path
# Reuse scoped controlled card primitives without generating earlier groups.
s=Path(__file__).with_name('draw-royal-differential-groupC02.py').read_text().split('# Ground/rod')[0]
s=s.replace("in ['c7','c8','c9']", "in ['c10','c11','c12']").replace("groupC02'","groupC03'")
exec(s)
# Three investigated quantities remain separate from intake and sealing geometry.
b=soil(87,403,87,118)+line(128,380,128,499,N,3)+rect(119,470,18,33,'url(#metal)',N,3)
b+=rect(191,421,55,95,'#DEEDF2',N,8)+rect(200,407,37,17,'url(#metal)',N,3)+path('M201 478 Q217 467 236 479 V505 H201 Z','#9EC4D5','#3183A2',2)
b+=line(300,413,300,507,'#3183A2',6)+path('M292 421 L300 413 L308 421','none','#3183A2',3)+rect(275,487,49,37,'#BBD4DC',N,3)+line(273,527,327,527,N,2)
b+=soil(462,394,253,137)+rect(552,397,71,132,'#E5C47C',G,2)+rect(574,383,29,145,'url(#metal)',N,3)
for y in range(464,522,9):b+=line(575,y,602,y,T,3)
for xx in [562,613]:
 for yy in range(412,523,16):b+=f'<circle cx="{xx}" cy="{yy}" r="4" fill="#A08659" stroke="{G}" stroke-width="1"/>'
b+=arrow(492,486,568,486,'#3183A2')+path('M652 486 L610 486 M620 479 L610 486 L620 493','none','#3183A2',3)
b+=soil(835,399,264,129)+rect(950,384,31,145,'url(#metal)',N,3)+rect(927,405,78,37,'#D7E4DB',T,3)
b+=line(843,421,922,421,'#3183A2',4)+line(921,404,921,440,'#B34F40',5)
b+=line(1009,421,1090,421,'#3183A2',4)+line(1008,404,1008,440,'#B34F40',5)
save('c10',b)
# Fleet scope, vessel motion/anchor/winch, and bitt-eye contact are separate.
b=rect(186,370,71,28,'#E5C47C',G,5)+line(221,400,221,425,N,2)+line(122,425,322,425,N,2)
for xx in [104,204,304]:b+=line(xx+17,425,xx+17,448,N,2)+path(f'M{xx-11} 456 H{xx+45} L{xx+35} 474 H{xx} Z','url(#metal)')+rect(xx+6,441,20,14,'#C7DCD5',T,2)
b+=path('M101 510 H129 L121 530 H109 Z','#E5C47C',G,2)+line(115,487,115,510,N,3)+path('M115 489 L136 499 L115 499 Z','#C7DCD5',T,2)
b+=path('M459 481 H505 L493 500 H468 Z','#C8DCE5')+line(508,486,554,486,G,2)+path('M560 479 H710 L694 504 H575 Z','url(#metal)')
b+=rect(575,390,59,54,'url(#metal)',N,4)
for xx in range(584,628,7):b+=line(xx,393,xx,441,N,2)
b+=line(635,417,682,417,G,3)+path('M682 418 V459 M663 445 Q682 476 701 445 M673 432 H691','none',N,4)
b+=rect(935,403,38,97,'url(#metal)',N,4)+rect(915,396,78,17,'url(#metal)',N,4)+rect(908,499,95,16,'#A9B8B1',N,4)
b+=f'<ellipse cx="955" cy="449" rx="64" ry="29" fill="none" stroke="{G}" stroke-width="8"/>'+path('M894 450 Q866 463 843 503','none',G,7)
save('c11',b)
# Excavation face/geology versus vehicle, and separate monitor channels/ventilation.
b=path('M104 525 V421 Q142 366 199 421 V525 Z','#DCC699',G,4)
for x,y in [(135,414),(172,427),(142,456),(181,474)]:b+=path(f'M{x} {y} l15 -7 10 14 -16 10 Z','#B69D71',G,2)
b+=path('M158 409 L146 431 L154 449','none',N,2)+line(229,393,229,534,G,2)
b+=rect(273,450,178,53,'url(#metal)',N,5)+rect(281,418,63,34,'#C4D7CF',N,3)
for xx in [306,414]:b+=f'<circle cx="{xx}" cy="510" r="14" fill="#B7C7CE" stroke="{N}" stroke-width="4"/>'
b+=rect(673,387,177,150,'url(#metal)',N,12)
for y,label in [(412,'O₂'),(455,'CO'),(498,'CO₂')]:b+=rect(687,y-15,149,32,'#FFFAEC',T,3)+text(700,y+8,label,23)
b+=rect(922,410,73,76,'#C4D7CF',N,6)+f'<circle cx="958" cy="448" r="25" fill="#E5C47C" stroke="{N}" stroke-width="3"/>'
for angle in [0,120,240]:b+=f'<path d="M958 448 Q941 421 959 426 Q980 434 958 448" transform="rotate({angle} 958 448)" fill="#A5B9C5" stroke="{N}" stroke-width="1"/>'
b+=arrow(1007,448,1100,448,'#3183A2')
save('c12',b)
print('Wrote c10/c11/c12 technical relations,1200x650')
