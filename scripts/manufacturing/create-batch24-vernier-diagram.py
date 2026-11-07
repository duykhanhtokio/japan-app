"""Original exact-geometry paper vernier model for the existing18.20mm example.

The source explains adding the main-scale reading and coincident vernier value;
this independently constructed20/19 model is not a reproduction of figure6-2,
its30.35mm example, or a specification/accuracy claim for a real instrument.
Requires CairoSVG, fontconfig and registered Noto Serif JP/CJK JP.
"""
from fractions import Fraction
from pathlib import Path
from xml.sax.saxutils import escape
import json
import subprocess
import cairosvg

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/manufacturing/diagrams'
NAME='batch24-mechanical-vernier-reading'
GEOMETRY_PATH=ROOT/'docs/ssw-workspace/manufacturing/batch24/geometry.json'
W,H=1400,1300
INK,BLUE,GREEN,ORANGE='#26364c','#426b91','#287b72','#b45828'


def geometry():
    zero=Fraction(182,10)
    main_spacing=50
    vernier_spacing=Fraction(19,20)
    origin_x,origin_mm=100,16
    main=[{'index':n,'x':float(origin_x+(n-origin_mm)*main_spacing)} for n in range(16,40)]
    zero_x=origin_x+(zero-origin_mm)*main_spacing
    sub=[{'index':k,'x':float(zero_x+k*vernier_spacing*main_spacing)} for k in range(21)]
    coincident=[k for k in range(21) if (zero+k*vernier_spacing).denominator==1]
    assert coincident==[4]
    assert sub[4]['x']==next(t['x'] for t in main if t['index']==22)
    assert sub[-1]['x']-sub[0]['x']==19*main_spacing
    assert Fraction(18)+4*Fraction(1,20)==zero
    inset_origin=875
    return {'schemaVersion':1,'paperModelOnly':True,'width':W,'height':H,
            'main':{'originMm':origin_mm,'originX':origin_x,'pixelsPerMm':main_spacing,'ticks':main},
            'vernier':{'intervalCount':20,'spanMainMm':19,'spacingMm':float(vernier_spacing),
                       'spacingPx':float(vernier_spacing*main_spacing),'zeroMm':float(zero),'zeroX':float(zero_x),
                       'coincidenceIndex':4,'coincidentMainMm':22,'ticks':sub},
            'reading':{'mainMm':18,'coincidentIntervals':4,'readoutUnitMm':0.05,'vernierMm':0.20,
                       'totalMm':float(zero),'display':'18.20 mm'},
            'inset':{'mainOriginMm':18,'mainOriginX':inset_origin,'pixelsPerMm':200,
                     'mainTicks':[{'index':18,'x':inset_origin},{'index':19,'x':inset_origin+200}],
                     'vernierZeroX':inset_origin+40,'vernierSpacingPx':190,
                     'vernierTicks':[{'index':0,'x':inset_origin+40},{'index':1,'x':inset_origin+230}],
                     'drawingMagnificationRelativeToOverview':4}}


class Drawing:
    def __init__(self,model):
        self.parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
                    '<metadata id="vernier-geometry">'+escape(json.dumps(model,ensure_ascii=False,sort_keys=True))+'</metadata>',
                    f'<rect width="{W}" height="{H}" fill="#fff8e8"/>',
                    '<g font-family="Noto Serif JP,Noto Serif CJK JP,serif" fill="'+INK+'">']

    def text(self,x,y,value,size=25,bold=False,color=INK,center=False):
        self.parts.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}"'+
                          (' text-anchor="middle"' if center else '')+'>'+escape(value)+'</text>')

    def line(self,x1,y1,x2,y2,color=INK,width=3,identifier=None,dash=None,scale=None,index=None,value=None):
        self.parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"'+
                          (f' id="{identifier}"' if identifier else '')+(f' stroke-dasharray="{dash}"' if dash else '')+
                          (f' data-scale="{scale}"' if scale else '')+(f' data-index="{index}"' if index is not None else '')+
                          (f' data-value="{value}"' if value is not None else '')+'/>')

    def box(self,x,y,w,h,fill='none',stroke=INK,radius=0,width=3):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')


def build():
    family=subprocess.check_output(['fc-match','--format=%{family}','Noto Serif JP'],text=True)
    if 'Noto Serif JP' not in family and 'Noto Serif CJK JP' not in family:
        raise RuntimeError('Install/register Noto Serif JP or Noto Serif CJK JP before rendering.')
    model=geometry();d=Drawing(model)
    d.text(40,57,'バーニヤの読み方：独立した紙上モデル',37,True)
    d.text(40,105,'本尺1目盛＝1 mm ／ 副尺20区間＝本尺19 mm ／ 読取単位0.05 mm（このモデル）',25)
    d.box(30,145,1340,500,fill='#f1f0e6',stroke='#c9c5b6',radius=16)
    d.text(55,198,'本尺と副尺の位置関係を、同じ縮尺で作図',30,True)
    d.text(55,248,'本尺（mm）',25,True,BLUE)
    d.line(85,330,1280,330,BLUE,2)
    for tick in model['main']['ticks']:
        n,x=tick['index'],tick['x'];color=GREEN if n==22 else BLUE if n==18 else INK
        d.line(x,330,x,380,color,5 if n in (18,22) else 2,identifier=f'main-tick-{n}',scale='main',value=n)
        d.text(x,310,str(n),22,n in (18,22),color,True)
    d.line(205,440,1170,440,INK,2)
    for tick in model['vernier']['ticks']:
        k,x=tick['index'],tick['x'];color=ORANGE if k==0 else GREEN if k==4 else INK
        d.line(x,400,x,440,color,5 if k in (0,4) else 2,identifier=f'vernier-tick-{k}',scale='vernier',index=k)
        d.text(x,480,str(k),22,k in (0,4),color,True)
    d.line(400,380,400,400,GREEN,3,identifier='coincidence-guide',dash='4 3')
    d.text(80,550,'副尺0（左端）',26,True,ORANGE)
    d.text(450,550,'緑の一致線：副尺4 ↔ 本尺22 mm',27,True,GREEN)
    d.text(55,609,'副尺の線番号は0～20（20区間）。線番号そのものはmm値ではありません。',25)

    d.box(30,690,655,400,fill='#f1f0e6',stroke='#c9c5b6',radius=16)
    d.text(55,740,'本尺を読み、副尺の値を足す',29,True)
    d.text(65,799,'本尺：18 mm',30,True,BLUE)
    d.text(65,859,'副尺：4 × 0.05 ＝ 0.20 mm',29,True,GREEN)
    d.text(65,929,'18 ＋ 0.20 ＝ 18.20 mm',34,True)
    d.text(65,993,'副尺の「4」は、0から4区間先の線。',25)
    d.text(65,1043,'一致する線から副尺の区間数を読む。',25)

    d.box(715,690,655,400,fill='#f1f0e6',stroke='#c9c5b6',radius=16)
    d.text(740,740,'部分拡大：18 mmと19 mmの間',28,True)
    d.text(740,782,'上図とは描画の倍率が異なります。',24)
    d.box(875,843,200,65,fill='#e0e9ef',stroke='none',width=0)
    d.text(741,835,'本尺',23,True,BLUE)
    d.line(850,850,1190,850,BLUE,2)
    for tick in model['inset']['mainTicks']:
        n,x=tick['index'],tick['x'];color=BLUE if n==18 else INK
        d.line(x,850,x,900,color,4,identifier=f'inset-main-tick-{n}',scale='inset-main',value=n)
        d.text(x,830,str(n),26,True,color,True)
    d.line(900,975,1175,975,INK,2)
    for tick in model['inset']['vernierTicks']:
        k,x=tick['index'],tick['x'];color=ORANGE if k==0 else INK
        d.line(x,930,x,975,color,4,identifier=f'inset-vernier-tick-{k}',scale='inset-vernier',index=k)
        d.text(x,1011,str(k),25,k==0,color,True)
    d.line(915,855,915,930,ORANGE,2,identifier='inset-zero-guide',dash='5 5')
    d.text(740,1055,'副尺0は18 mmを越え、19 mmより手前。',24,True,ORANGE)

    d.text(40,1156,'本文の18.20 mmという独立した計算例を可視化した図です。',28,True)
    d.text(40,1205,'実器具の仕様・測定精度や合否を示す図ではありません。',27)
    d.text(40,1254,'実際には器具の最小読取値と、指定された測定方法を確認します。',26)
    OUT.mkdir(parents=True,exist_ok=True)
    svg=''.join(d.parts)+'</g></svg>'
    (OUT/(NAME+'.svg')).write_text(svg,encoding='utf-8')
    cairosvg.svg2png(bytestring=svg.encode(),write_to=str(OUT/(NAME+'.png')))
    GEOMETRY_PATH.parent.mkdir(parents=True,exist_ok=True)
    GEOMETRY_PATH.write_text(json.dumps(model,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'status':'PASS','width':W,'height':H,'coincidenceIndex':4,'reading':'18.20 mm',
                      'mainTicks':len(model['main']['ticks']),'vernierTicks':len(model['vernier']['ticks'])}))


if __name__=='__main__':build()
