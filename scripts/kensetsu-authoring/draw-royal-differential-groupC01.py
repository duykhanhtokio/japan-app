"""Independent controlled role diagrams; no operating sequence or design dimensions.
Retains original Japanese card text. Geometry links material, force and measurement.
"""
from pathlib import Path
import ast,subprocess,html
R=Path(__file__).resolve().parents[2];O=R/'docs/ssw-workspace/kensetsu/royal-differential-20261107/groupC01';A=R/'assets/kensetsu/differential';O.mkdir(parents=True,exist_ok=True);A.mkdir(parents=True,exist_ok=True)
N='#173750';T='#22766D';G='#B38432'
def text(x,y,s,size=26):return f'<text x="{x}" y="{y}" font-size="{size}">{html.escape(s)}</text>'
def rect(x,y,w,h,fill='#F0F3EE',stroke=T,r=12):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2.5"/>'
def line(x,y,u,v,c=N,w=3):return f'<path d="M{x} {y} L{u} {v}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'
def path(d,fill='none',c=N,w=3):return f'<path d="{d}" fill="{fill}" stroke="{c}" stroke-width="{w}" stroke-linejoin="round"/>'
def arrow(x,y,u,v,c=T):return line(x,y,u,v,c,4)+f'<path d="M{u-10} {v-7} L{u} {v} L{u-10} {v+7}" fill="none" stroke="{c}" stroke-width="3"/>'
def soil(x,y,w,h):
 b=rect(x,y,w,h,'#DCC699',G,3)
 for yy in range(y+7,y+h-3,11):
  for xx in range(x+8,x+w-3,15):b+=f'<circle cx="{xx+(yy%3)}" cy="{yy}" r="1.6" fill="#A08552"/>'
 return b
spec={}
for node in ast.walk(ast.parse((R/'scripts/kensetsu-authoring/draw-differential-diagrams.py').read_text())):
 if isinstance(node,ast.Call) and isinstance(node.func,ast.Name) and node.func.id=='save' and isinstance(node.args[0],ast.Constant) and node.args[0].value in ['c3','c5','c6']:spec[node.args[0].value]=(ast.literal_eval(node.args[1]),ast.literal_eval(node.args[2]))
def save(key,b):
 title,groups=spec[key];w=(1090-(len(groups)-1)*24)//len(groups)
 s='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="650" viewBox="0 0 1200 650"><defs><linearGradient id="metal" x2="0" y2="1"><stop stop-color="#F4F7F9"/><stop offset=".45" stop-color="#A5B9C5"/><stop offset="1" stop-color="#D9E3E8"/></linearGradient></defs><g font-family="Noto Sans CJK JP" fill="'+N+'">'+rect(20,20,1160,610,'#FFFAEC',G,28)+text(55,78,title,34)+line(55,101,1145,101,G,2)
 for i,(heading,labels) in enumerate(groups):
  x=55+i*(w+24);s+=rect(x,135,w,425)+text(x+22,185,heading,30)
  for j,label in enumerate(labels):s+=text(x+22,234+43*j,label,26)
 s+=b+text(55,615,'役割を比べる概念図・操作手順ではありません',23)+'</g></svg>'
 p=O/(key+'.svg');p.write_text(s+'\n');subprocess.run(['inkscape',str(p),'--export-type=png',f'--export-filename={A/(key+".png")}'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
# Material retained in a bowl, relocation, and the distinct blade/surface relation.
b=soil(95,452,92,36)+path('M91 426 L102 495 H211 L226 426','url(#metal)')+soil(109,454,95,32)+line(103,499,211,499,G,5)
b+=arrow(238,464,289,464)+soil(308,454,106,29)+path('M302 450 L324 433 H418 L436 450','url(#metal)')+arrow(444,464,480,464)
b+=soil(489,479,63,12)+line(489,493,551,493,N,3)
b+=soil(652,473,424,35)+path('M660 473 Q711 435 760 465 Q820 436 872 458 Q930 435 1002 465','none',G,3)
b+=path('M783 395 L830 403 L839 476 L799 470 Z','url(#metal)')+line(809,389,809,405,N,5)+arrow(880,421,989,421)+line(652,513,1081,513,N,3)
save('c3',b)
# A piston pushes; separate two-rail support carries and guides a pipe sample.
b=rect(93,429,115,51,'url(#metal)',N,6)+rect(190,440,106,28,'url(#metal)',N,3)+rect(296,422,19,63,'#E5C47C',G,2)+rect(321,425,185,57,'url(#metal)',N,6)+arrow(347,405,458,405)
b+=line(106,482,106,505,N,4)+line(189,482,189,505,N,4)+line(90,506,218,506,N,4)
b+=rect(690,414,320,68,'url(#metal)',N,9)+line(713,490,1051,490,T,8)+line(713,510,1051,510,T,8)
for x in [735,981]:b+=path(f'M{x} 482 L{x-18} 500 L{x+18} 500 Z','#C4D7CF',T,3)+line(x,511,x,535,N,4)
b+=arrow(1023,442,1101,442,G)+line(681,414,681,482,G,2)+line(672,414,689,414,G,2)+line(672,482,689,482,G,2)
save('c5',b)
# Grab removal of sediment; crane vessel/carrier/tug; sonar observes a separate bed.
b=rect(83,374,289,131,'#E0EEF1','#9DBDC9',5)+soil(83,491,289,28)+line(126,365,126,426,N,3)
b+=path('M126 425 L100 452 L126 474 L152 452 Z','url(#metal)')+path('M100 452 Q108 484 126 474 Q145 484 152 452','url(#metal)')+soil(117,464,18,11)
b+=path('M223 480 L235 453 L258 429 L258 382','none',N,14)+path('M223 480 L235 453 L258 429 L258 382','none','#C8DCE5',7)
b+=path('M454 446 H701 L681 477 H475 Z','url(#metal)')+rect(474,419,44,26,'#E3CF9F',N,3)+path('M542 440 L575 370 L637 420','none',N,5)+line(637,420,637,445,N,2)+rect(620,444,34,21,'#D8C398',G,2)+soil(542,450,91,17)
b+=path('M459 518 H503 L493 533 H466 Z','#C8DCE5')+line(506,522,572,522,G,2)+path('M576 516 H695 L681 536 H589 Z','#D8C398')
b+=rect(829,374,281,143,'#E0EEF1','#9DBDC9',5)+path('M882 385 H1056 L1042 405 H895 Z','url(#metal)')+rect(953,399,26,13,'#E3CF9F',G,3)
b+=path('M965 421 Q943 446 965 472 M977 421 Q999 446 977 472','none',T,3)+path('M833 493 Q879 475 923 493 Q978 514 1035 490 Q1072 478 1107 494','none',G,4)
save('c6',b)
print('Wrote c3/c5/c6 controlled diagrams,1200x650; Japanese labels unchanged')
