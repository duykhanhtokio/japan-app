"""Well flow, roller operator position and pruning condition concept diagrams."""
from pathlib import Path
s=Path(__file__).with_name('draw-royal-differential-groupC02.py').read_text().split('# Ground/rod')[0]
s=s.replace("in ['c7','c8','c9']", "in ['c17','c18','c19']").replace("groupC02'","groupC05'")
exec(s)
# Impact/rotation at the working tip; circulating drilling fluid is a separate relation.
b=soil(86,486,283,48)+rect(204,386,32,111,'url(#metal)',N,4)+path('M204 497 L220 514 L236 497','url(#metal)')+arrow(166,402,166,468)+path('M250 417 Q286 441 250 464 M250 464 L264 462 M250 464 L252 450','none',T,3)
b+=rect(460,401,65,60,'url(#metal)',N,8)+path('M525 423 H590 V497 H650 V426 H701','none','#3183A2',5)+arrow(565,423,589,423)+path('M698 420 L708 426 L698 432','none',T,3)+rect(612,467,16,62,'url(#metal)',N,3)+path('M616 515 L620 523 L624 515','none','#3183A2',3)
b+=soil(842,391,268,143)+rect(927,391,89,143,'url(#metal)',N,3)+rect(939,391,65,143,'#FFFAEC',N,2)+rect(962,391,19,143,'url(#metal)',N,2)+path('M934 380 H1010 M971 372 V386 M960 380 L971 372 L982 380','none',T,3)
save('c17',b)
# Relative operator locations, not a machine operating instruction or rating.
b=path('M105 524 H516','none',G,3)+f'<circle cx="191" cy="391" r="19" fill="#E7D4B3" stroke="{N}" stroke-width="3"/>'+path('M191 413 V464 M191 431 L246 445 M191 464 L166 509 M191 464 L213 509','none',N,8)+path('M245 445 L312 456 L343 489','none',N,5)+rect(332,456,131,38,'url(#metal)',N,7)+rect(350,488,122,35,'url(#metal)',N,16)+path('M369 492 V520 M455 492 V520','none',N,2)
b+=path('M653 524 H1096','none',G,3)+rect(762,453,251,47,'url(#metal)',N,8)+rect(743,488,98,35,'url(#metal)',N,15)+rect(940,488,98,35,'url(#metal)',N,15)+path('M849 414 V456 H896','none',N,7)+f'<circle cx="868" cy="376" r="18" fill="#E7D4B3" stroke="{N}" stroke-width="3"/>'+path('M866 398 L876 431 H921 L932 457 M874 414 L929 410','none',N,7)+path('M929 410 L943 401 M939 396 L950 408','none',N,3)
save('c18',b)
# Tree architecture and flower/fruit states; no cut line or universal calendar month.
b=path('M306 531 V443 M306 472 L230 423 M306 486 L382 431 M306 450 L280 403 M306 443 L342 395','none','#806744',8)
for x,y in [(230,423),(280,403),(342,395),(382,431)]:
 b+=path(f'M{x} {y} Q{x-36} {y-43} {x-49} {y-8} Q{x-28} {y+15} {x} {y} Q{x+35} {y-37} {x+47} {y-4} Q{x+29} {y+20} {x} {y}','#C7DCD5',T,2)
b+=path('M180 534 H429','none',G,3)+path('M726 506 Q796 465 848 435','none','#806744',6)
for x,y in [(765,483),(815,456)]:b+=path(f'M{x} {y} Q{x-4} {y-42} {x+30} {y-35} Q{x+34} {y-11} {x} {y}','#C7DCD5',T,2)
for x,y in [(849,432),(877,460)]:
 for dx,dy in [(-10,0),(10,0),(0,-10),(0,10)]:b+=f'<circle cx="{x+dx}" cy="{y+dy}" r="9" fill="#E7D4B3" stroke="{G}" stroke-width="2"/>'
 b+=f'<circle cx="{x}" cy="{y}" r="5" fill="{G}"/>'
b+=rect(958,393,107,119,'#FFFAEC',N,6)+line(958,418,1065,418,G,3)+path('M979 385 V405 M1044 385 V405 M978 442 H1047 M978 465 H1047 M978 488 H1023','none',N,3)+path('M918 456 H943 M934 447 L943 456 L934 465','none',T,3)
save('c19',b)
print('Wrote c17–c19 controlled relations,1200x650')
