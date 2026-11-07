"""Original controlled caliper structure/contact concepts, not operating steps.

Bounded source: mechanical SSW1 PDF physical72–73 (printed64–65), exact SHA
35096524ce12c830ce7765311f536b5d1d0a8bde7268e5385f90588abba04622.
The source gives structure and contact-role prose; these contact geometries are
independent conceptual constructions, not copies of figure6-1 or its scale.
No scale/readout/resolution or acceptance example is generated.
Requires CairoSVG, fontconfig and registered Noto Serif JP/CJK JP.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import subprocess
import cairosvg

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/manufacturing/diagrams'
NAME='batch23-mechanical-caliper-contacts'
W,H=1400,1400
INK,BLUE,GREEN,CONTACT='#26364c','#426b91','#287b72','#b45828'
FIXED,MOVING,WORK='#dfe7ee','#d6e8df','#eadfc7'


class Drawing:
    def __init__(self):
        self.parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
                    f'<rect width="{W}" height="{H}" fill="#fff8e8"/>',
                    '<g font-family="Noto Serif JP,Noto Serif CJK JP,serif" fill="'+INK+'">']

    def text(self,x,y,value,size=25,bold=False,color=INK):
        self.parts.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{escape(value)}</text>')

    def line(self,x1,y1,x2,y2,color=INK,width=3):
        self.parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"/>')

    def box(self,x,y,w,h,fill='none',stroke=INK,radius=0,width=3):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')

    def path(self,value,fill='none',stroke=INK,width=3):
        self.parts.append(f'<path d="{value}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')

    def dot(self,x,y):
        self.parts.append(f'<circle cx="{x}" cy="{y}" r="5" fill="{CONTACT}"/>')

    def external_body(self,x,y):
        self.box(x+100,y+210,485,30,FIXED)
        self.box(x+100,y+240,30,120,FIXED)
        self.box(x+265,y+195,80,60,MOVING,stroke=GREEN)
        self.box(x+280,y+255,30,105,MOVING,stroke=GREEN)


def build():
    family=subprocess.check_output(['fc-match','--format=%{family}','Noto Serif JP'],text=True)
    if 'Noto Serif JP' not in family and 'Noto Serif CJK JP' not in family:
        raise RuntimeError('Install/register Noto Serif JP or Noto Serif CJK JP before rendering.')
    d=Drawing()
    d.text(40,57,'ノギス：部位と測定面の役割を分けて見る',37,True)
    d.text(40,105,'デプスバーのある器具の独自模式例。実寸・目盛り・操作手順は示していません。',25)
    panels=[(30,145),(715,145),(30,710),(715,710)]
    titles=['① 本尺とスライダの関係','② 外側の測定面','③ 内側の測定面','④ 深さの測定面']
    for (x,y),title in zip(panels,titles):
        d.box(x,y,655,535,fill='#f1f0e6',stroke='#c9c5b6',radius=16)
        d.text(x+22,y+46,title,30,True)

    # Structure, independently simplified: fixed main body, moving slider/jaw,
    # small inside jaws above beam, larger outside jaws below, depth bar at end.
    x,y=panels[0]
    d.external_body(x,y)
    d.path(f'M{x+100} {y+210}V{y+157}L{x+118} {y+182}V{y+210}Z',FIXED)
    d.path(f'M{x+280} {y+195}V{y+177}L{x+298} {y+152}V{y+195}Z',MOVING,GREEN)
    d.box(x+585,y+224,42,5,INK,stroke=INK,width=1)
    d.text(x+225,y+116,'スライダ',25,True,GREEN)
    d.line(x+302,y+130,x+302,y+192,GREEN,2)
    d.text(x+415,y+155,'デプスバー',25,True)
    d.line(x+562,y+166,x+605,y+222,INK,2)
    d.text(x+420,y+315,'本尺',25,True,BLUE)
    d.line(x+450,y+290,x+450,y+243,BLUE,2)
    d.text(x+30,y+419,'固定ジョウ',25,True,BLUE)
    d.line(x+115,y+393,x+115,y+364,BLUE,2)
    d.text(x+245,y+419,'測定ジョウ',25,True,GREEN)
    d.line(x+295,y+393,x+295,y+364,GREEN,2)
    d.text(x+25,y+485,'固定側と、スライダ側の部位を対応させる。',24)

    # Outside contact: inward faces contact opposed external workpiece faces.
    # Workpiece is near the roots, not hanging from the thin jaw tips.
    x,y=panels[1]
    d.external_body(x,y)
    d.box(x+130,y+276,150,60,WORK,stroke='#8d7657')
    d.line(x+130,y+276,x+130,y+336,CONTACT,6)
    d.line(x+280,y+276,x+280,y+336,CONTACT,6)
    d.text(x+360,y+316,'工作物',26,True)
    d.line(x+347,y+306,x+283,y+306,INK,2)
    d.text(x+47,y+417,'外側用測定面',25,True,CONTACT)
    d.line(x+133,y+387,x+131,y+339,CONTACT,2)
    d.line(x+233,y+387,x+278,y+339,CONTACT,2)
    d.text(x+25,y+485,'工作物の外側の、向かい合う二面に接する。',24)

    # Inside contact: outward faces of the smaller jaws contact opposed inner
    # walls. Separate section fragments avoid implying one closed-pocket shape.
    x,y=panels[2]
    d.box(x+85,y+174,95,136,WORK,stroke='#8d7657')
    d.box(x+410,y+174,95,136,WORK,stroke='#8d7657')
    d.box(x+175,y+350,390,30,FIXED)
    d.box(x+370,y+335,75,60,MOVING,stroke=GREEN)
    d.path(f'M{x+180} {y+350}V{y+236}L{x+205} {y+267}V{y+350}Z',FIXED)
    d.path(f'M{x+385} {y+335}V{y+267}L{x+410} {y+236}V{y+335}Z',MOVING,GREEN)
    d.line(x+180,y+240,x+180,y+289,CONTACT,6)
    d.line(x+410,y+240,x+410,y+289,CONTACT,6)
    d.text(x+160,y+133,'穴・溝の向かい合う内側面',25,True)
    d.line(x+175,y+148,x+180,y+172,INK,2)
    d.line(x+430,y+148,x+410,y+172,INK,2)
    d.text(x+70,y+435,'内側用測定面',25,True,CONTACT)
    d.line(x+154,y+405,x+180,y+293,CONTACT,2)
    d.line(x+258,y+405,x+410,y+293,CONTACT,2)
    d.text(x+25,y+485,'小さいジョウの、外を向く測定面を区別する。',24)

    # Depth: source prose supports role, not this exact geometry. Original
    # vertical conceptual construction: beam end has support on the rim while
    # the mechanically associated slender depth bar extends to the bottom.
    x,y=panels[3]
    d.box(x+90,y+300,490,160,WORK,stroke='#8d7657')
    d.path(f'M{x+270} {y+300}V{y+425}H{x+450}V{y+300}',fill='#f1f0e6',stroke='#8d7657')
    d.box(x+230,y+136,60,164,FIXED)
    d.box(x+215,y+165,90,48,MOVING,stroke=GREEN)
    d.box(x+277,y+300,6,125,INK,stroke=INK,width=1)
    d.line(x+230,y+300,x+269,y+300,CONTACT,6)
    d.line(x+277,y+425,x+283,y+425,CONTACT,6)
    d.dot(x+280,y+425)
    d.text(x+360,y+218,'デプスバー',25,True)
    d.line(x+352,y+231,x+284,y+349,INK,2)
    d.text(x+23,y+259,'基準となる端面',25,True,CONTACT)
    d.line(x+199,y+271,x+244,y+297,CONTACT,2)
    d.text(x+355,y+436,'底に当たる先端',25,True,CONTACT)
    d.line(x+345,y+429,x+287,y+425,CONTACT,2)
    d.text(x+25,y+485,'基準となる端面と、底の当たりを区別する。',24)

    d.text(40,1303,'赤は当たりを示す補助色。実寸・読み値・合否を指定する図ではありません。',27,True)
    d.text(40,1351,'実際には器具の仕様と指定された測定方法を確認し、動いている対象を測定しない。',25)
    OUT.mkdir(parents=True,exist_ok=True)
    svg=''.join(d.parts)+'</g></svg>'
    (OUT/(NAME+'.svg')).write_text(svg,encoding='utf-8')
    cairosvg.svg2png(bytestring=svg.encode(),write_to=str(OUT/(NAME+'.png')))
    print(f'Generated original controlled caliper contact comparison: {W}x{H}')


if __name__=='__main__':build()
