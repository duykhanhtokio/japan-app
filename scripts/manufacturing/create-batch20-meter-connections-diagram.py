"""Original paper-only ammeter/voltmeter topology comparison, not hookup steps.

Source: SSW1 electrical PDF b846a05aa2c33a490e2bb706fe14ad55d587e7fd60718a4e09ab1cd28033bdcf,
physical147/148, figures10-2/10-4; physical151/152 measurement prose.
Original vertical layout; no source-page images, numerical readings or terminals.
Requires CairoSVG, fontconfig and a registered Noto Serif JP/CJK JP font.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import subprocess
import cairosvg

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets/manufacturing/diagrams'
NAME = 'batch20-electrical-meter-connections'
W, H = 1400, 1100
INK, BLUE, GREEN = '#26364c', '#426b91', '#287b72'


class Drawing:
    def __init__(self):
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
                      f'<rect width="{W}" height="{H}" fill="#fff8e8"/>',
                      '<g font-family="Noto Serif JP,Noto Serif CJK JP,serif" fill="'+INK+'">']

    def text(self, x, y, value, size=26, bold=False, color=INK):
        self.parts.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{escape(value)}</text>')

    def line(self, x1, y1, x2, y2, color=INK, width=4):
        self.parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"/>')

    def box(self, x, y, width, height, fill='none', stroke=INK, radius=0):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>')

    def circle(self, x, y, radius, fill='#fffdf7', stroke=INK, width=4):
        self.parts.append(f'<circle cx="{x}" cy="{y}" r="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')

    def meter(self, x, y, letter, color):
        self.circle(x,y,43,stroke=color)
        self.text(x-20,y+16,letter,46,True,color)


def build():
    family = subprocess.check_output(['fc-match','--format=%{family}','Noto Serif JP'],text=True)
    if 'Noto Serif JP' not in family and 'Noto Serif CJK JP' not in family:
        raise RuntimeError('Install/register Noto Serif JP or Noto Serif CJK JP before rendering.')
    d = Drawing()
    d.text(40,57,'電流と電圧：測る量と接続を区別する',38,True)
    d.text(40,105,'回路の一部を示す独自概念図。実機の端子・配線・接続手順ではありません。',26)
    for x,title,color in [(30,'電流計 A：対象の枝路に直列',BLUE),(715,'電圧計 V：対象の二点間に並列',GREEN)]:
        d.box(x,145,655,760,fill='#f1f0e6',stroke='#c9c5b6',radius=16)
        d.text(x+22,196,title,30,True,color)

    # Ammeter in the sole illustrated load branch. All continuation wires and
    # both meter connections terminate at the symbol boundary, never behind it.
    x=30; cx=x+325
    d.text(x+218,256,'回路の続きへ',25)
    d.line(cx,275,cx,332,BLUE)
    d.meter(cx,375,'A',BLUE)
    d.line(cx,418,cx,485,BLUE)
    d.box(cx-65,485,130,100,fill='#e7edf4')
    d.text(cx-31,546,'負荷',29,True)
    d.line(cx,585,cx,690,BLUE)
    d.text(x+218,732,'回路の続きへ',25)
    d.text(x+35,801,'負荷と電流計は同じ枝路上。',27,True,BLUE)
    d.text(x+35,851,'この枝路を流れる電流を測る。',26)

    # Voltmeter is a distinct branch across exactly the same two load nodes.
    x=715; left=x+235; right=x+470; upper=335; lower=640
    d.text(x+125,256,'回路の続きへ',25)
    d.line(left,275,left,upper)
    d.line(left,upper,left,435)
    d.box(left-65,435,130,100,fill='#e7edf4')
    d.text(left-31,496,'負荷',29,True)
    d.line(left,535,left,lower)
    d.line(left,lower,left,690)
    d.line(left,upper,right,upper,GREEN)
    d.line(right,upper,right,442,GREEN)
    d.meter(right,485,'V',GREEN)
    d.line(right,528,right,lower,GREEN)
    d.line(right,lower,left,lower,GREEN)
    for y,label in [(upper,'P'),(lower,'Q')]:
        d.circle(left,y,7,fill=INK,stroke=INK,width=1)
        d.text(left-42,y+10,label,29,True)
    d.text(x+125,732,'回路の続きへ',25)
    d.text(x+30,801,'負荷と電圧計は同じ二点 P・Q の間。',26,True,GREEN)
    d.text(x+30,851,'二点間の電圧（電位差）を測る。',26)

    d.text(40,958,'紙上で関係を学ぶ図です。電流レンジを電源両端へ直接当てない。',28,True)
    d.text(40,1004,'実作業では担当範囲・教育・設備手順と測定器の適合を確認する。',27)
    d.text(40,1050,'数値・入力端子・レンジの選び方や、実機の接続操作は示していません。',26)
    OUT.mkdir(parents=True,exist_ok=True)
    svg=''.join(d.parts)+'</g></svg>'
    (OUT/(NAME+'.svg')).write_text(svg,encoding='utf-8')
    cairosvg.svg2png(bytestring=svg.encode(),write_to=str(OUT/(NAME+'.png')))
    print(f'Generated original controlled meter connection comparison: {W}x{H}')


if __name__ == '__main__':
    build()
