"""Original schematic data for the 15 new CBT judgement tasks. No source assets."""
from pathlib import Path
R=Path(__file__).resolve().parents[1];D=R/'docs/ssw-workspace/kaigo/drafts/mock-figures';D.mkdir(exist_ok=True)
def rect(x,y,w,h,fill='#e0ebef',stroke='#27435e'):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'
def label(x,y,t):return f'<text x="{x}" y="{y}" font-family="sans-serif" font-size="22" fill="#18324a">{t}</text>'
def line(x,y,a,b):return f'<path d="M{x} {y} L{a} {b}" stroke="#49677f" stroke-width="4" fill="none"/>'
scenes={
's04-judgement-01':'<circle cx="170" cy="155" r="90" fill="#e8f0f3" stroke="#49677f" stroke-dasharray="8 6"/>'+rect(145,140,50,35)+label(155,165,'P')+label(205,135,'A')+label(310,115,'B')+label(405,220,'C'),
's04-judgement-02':''.join(rect(50+i*150,95,w,170)+label(50+i*150,60,k)+label(50+i*150,290,str(cm)+' cm') for i,(k,w,cm) in enumerate([('A',55,55),('B',80,80),('C',60,60)])),
's04-judgement-03':rect(45,30,410,65)+label(70,72,'EXPLAINED')+rect(45,120,410,65)+label(70,162,'CONSENT ?')+rect(45,210,410,65)+label(70,252,'NOT STARTED'),
's04-judgement-04':rect(35,100,425,145)+label(60,80,'TABLE')+'<ellipse cx="195" cy="170" rx="90" ry="42" fill="#fff" stroke="#49677f" stroke-width="3"/>'+label(170,175,'PLATE')+line(95,225,150,225)+label(100,280,'SLIDES')+line(340,135,340,210)+label(285,65,'SPOON HELD'),
's04-judgement-05':rect(35,65,200,110)+label(60,100,'A')+label(60,140,'ID 26')+rect(265,65,200,110)+label(290,100,'B')+label(290,140,'ID 62')+rect(115,220,270,65)+label(130,265,'RECORD: ID 62'),
's05-judgement-01':rect(180,25,140,260,'#fff')+rect(25,85,115,90)+label(60,140,'B')+rect(220,135,75,65)+label(245,175,'A')+line(185,30,310,30)+label(235,60,'C')+label(160,315,'CORRIDOR'),
's05-judgement-02':rect(45,90,170,110)+line(70,140,190,140)+label(75,65,'A: TIGHT')+rect(285,90,170,110)+line(310,165,430,165)+label(265,240,'B: FIT CHECKED'),
's05-judgement-03':''.join(rect(45+i*85,115,55,90,'#fff' if i<2 else '#c4d9ea')+label(60+i*85,165,'T' if i<2 else 'D') for i in range(5))+label(45,55,'T: NATURAL   D: REPLACEMENT'),
's05-judgement-04':rect(45,30,410,65)+label(70,72,'10:00 REQUEST')+rect(45,120,410,65)+label(70,162,'10:05 RESPONSE')+rect(45,210,410,65)+label(70,252,'ACTION: ---'),
's05-judgement-05':rect(50,80,150,150)+label(80,120,'A')+label(60,180,'CHOSEN')+rect(290,80,150,150)+label(320,120,'B')+label(305,180,'UNKNOWN'),
's06-judgement-01':'<circle cx="250" cy="160" r="110" fill="#fff" stroke="#49677f" stroke-width="3"/>'+label(235,80,'12')+label(330,165,'3')+label(245,265,'6')+label(145,165,'9')+rect(390,130,70,50)+label(415,163,'B')+label(195,320,'VIEW FROM PERSON'),
's06-judgement-02':rect(30,95,110,155)+label(55,65,'A: DEEP')+line(30,155,140,155)+rect(195,95,110,155)+label(165,290,'B: CORNERS')+line(195,155,225,195)+line(305,155,275,195)+rect(360,95,110,155)+label(355,65,'C: EDGE')+line(360,115,470,115),
's06-judgement-03':rect(50,75,200,150,'#d8e2eb')+label(75,120,'A: USED')+rect(245,180,205,110,'#fff')+label(270,245,'B: CLEAN')+line(245,180,245,225)+label(270,155,'CONTACT'),
's06-judgement-04':rect(40,60,420,90)+label(60,115,'A: 200 ml / 30 min')+rect(40,190,420,90)+label(60,245,'B: 200 ml / 1 day'),
's06-judgement-05':rect(125,40,250,230,'#fff')+'<path d="M250 65 C190 105 310 135 230 180 S270 220 250 250" stroke="#49677f" stroke-width="5" fill="none"/>'+label(305,175,'A')+label(120,315,'BACK OF SHIRT')}
for key,body in scenes.items():
 svg='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="340" viewBox="0 0 500 340"><rect width="500" height="340" fill="#f5f8fb"/>'+body+'</svg>';(D/(key+'.svg')).write_text(svg)
print('ORIGINAL_SCHEMATICS',len(scenes))
