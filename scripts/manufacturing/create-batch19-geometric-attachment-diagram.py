"""Draw original SSW1 attachment comparisons; never reproduce source-page images.

Source scope: mechanical textbook physical pp102–103 (printed94–95),
figures7-14/15/16 and the datum-attachment prose. Diagram four is an
independent construction from that prose. Values are intentionally omitted.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import subprocess
import cairosvg

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets/manufacturing/diagrams'
NAME = 'batch19-mechanical-geometric-attachments'
INK, BLUE, GREEN = '#26364c', '#426b91', '#287b72'
W, H = 1400, 1300


class Drawing:
    def __init__(self):
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
                      '<rect width="1400" height="1300" fill="#fff8e8"/>',
                      '<g font-family="Noto Serif JP,Noto Serif CJK JP,serif" fill="'+INK+'">']

    def text(self, x, y, value, size=25, bold=False, color=INK):
        self.parts.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{escape(value)}</text>')

    def line(self, x1, y1, x2, y2, color=INK, width=4, dash=None):
        self.parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')

    def path(self, points, color=INK, width=4, fill='none'):
        self.parts.append(f'<path d="{points}" fill="{fill}" stroke="{color}" stroke-width="{width}"/>')

    def box(self, x, y, width, height, fill='none', stroke=INK, radius=0):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>')

    def frame(self, x, y):
        self.box(x, y, 120, 45, fill='#fffdf7')
        self.line(x+45, y, x+45, y+45, width=3)

    def arrow(self, x, y, down=True, color=BLUE):
        # Open arrowhead, with its tip exactly on the attachment feature.
        dy = -15 if down else 15
        self.path(f'M{x-7} {y+dy}L{x} {y}L{x+7} {y+dy}', color, 3)

    def datum(self, x, base_y):
        # Source construction: broad filled-triangle base contacts the feature;
        # its apex faces the stem/boxed datum identifier above it.
        self.box(x-23, base_y-113, 46, 46, fill='#fffdf7')
        self.text(x-14, base_y-79, 'A', 33)
        self.line(x, base_y-67, x, base_y-22, width=3)
        self.path(f'M{x-13} {base_y}L{x} {base_y-22}L{x+13} {base_y}Z', INK, 1, INK)

    def shaft(self, x, y):
        self.box(x+150, y+205, 390, 90, fill='#e7edf4')
        self.line(x+130, y+250, x+558, y+250, color=BLUE, width=2, dash='34 8 5 8')
        self.line(x+55, y+205, x+150, y+205, width=2)
        self.line(x+55, y+295, x+150, y+295, width=2)
        self.line(x+90, y+205, x+90, y+295, color=GREEN, width=3)
        self.line(x+90, y+295, x+90, y+338, color=GREEN, width=3)
        self.arrow(x+90, y+295, down=False, color=GREEN)


def build():
    # Fail before producing a tofu-lettered PNG on a host without a JP font.
    family = subprocess.check_output(
        ['fc-match', '--format=%{family}', 'Noto Serif JP'], text=True)
    if 'Noto Serif JP' not in family and 'Noto Serif CJK JP' not in family:
        raise RuntimeError('Install/register Noto Serif JP or Noto Serif CJK JP before rendering.')
    d = Drawing()
    d.text(40, 57, '幾何公差とデータム：取付位置を比べる', 37, True)
    d.text(40, 103, '資料に基づく独自模式図。枠内の幾何特性記号・公差値は省略。', 26)
    panels = [(30,145),(715,145),(30,680),(715,680)]
    titles = ['① 表面への公差指示', '② 軸線への公差指示', '③ 表面をデータムにする', '④ 軸線をデータムにする']
    for (x,y), title in zip(panels,titles):
        d.box(x,y,655,505,fill='#f1f0e6',stroke='#c9c5b6',radius=16)
        d.text(x+22,y+46,title,31,True)

    x,y=panels[0]
    d.frame(x+80,y+95)
    d.path(f'M{x+80} {y+118}H{x+60}V{y+245}',BLUE,3)
    d.arrow(x+60,y+245)
    d.path(f'M{x+40} {y+245}H{x+255}V{y+320}',INK,4)
    d.text(x+38,y+368,'外形線へ',25,True,color=BLUE)
    d.frame(x+425,y+95)
    d.path(f'M{x+425} {y+118}H{x+397}V{y+245}',BLUE,3)
    d.arrow(x+397,y+245)
    d.path(f'M{x+455} {y+245}H{x+600}V{y+320}',INK,4)
    d.line(x+370,y+245,x+455,y+245,width=2)
    d.text(x+360,y+368,'外形線の延長線へ',25,True,color=BLUE)
    d.text(x+25,y+441,'矢印の先が接する線を確認する。',24)

    x,y=panels[1]
    d.shaft(x,y)
    d.frame(x+210,y+95)
    d.path(f'M{x+210} {y+118}H{x+90}V{y+205}',BLUE,3)
    d.arrow(x+90,y+205)
    d.text(x+125,y+363,'緑：寸法線とその延長',23,color=GREEN)
    d.text(x+25,y+414,'公差指示は寸法線の延長線へ。',25,True,color=BLUE)
    d.text(x+25,y+454,'破線の軸線へ直接向けない。',24)

    x,y=panels[2]
    d.line(x+80,y+275,x+555,y+275,width=4)
    d.line(x+80,y+275,x+80,y+335,width=4)
    d.datum(x+300,y+275)
    d.text(x+75,y+365,'三角形の底辺が対象の線に接する。',24)
    d.text(x+25,y+414,'外形線またはその延長線へ。',25,True,color=BLUE)
    d.text(x+25,y+454,'文字 A は基準を識別する。',24)

    x,y=panels[3]
    d.shaft(x,y)
    d.datum(x+90,y+205)
    d.text(x+125,y+363,'緑：寸法線とその延長',23,color=GREEN)
    d.text(x+25,y+414,'データム記号は寸法線の延長線へ。',25,True,color=BLUE)
    d.text(x+25,y+454,'破線の軸線へ直接付けない。',24)

    d.text(40,1230,'取付位置の比較用。公差値・実寸・測定合否は指定していません。',27,True)
    d.text(40,1270,'実際の図面の適用規格と指示を優先してください。',25)
    OUT.mkdir(parents=True,exist_ok=True)
    svg = ''.join(d.parts)+'</g></svg>'
    (OUT/(NAME+'.svg')).write_text(svg,encoding='utf-8')
    cairosvg.svg2png(bytestring=svg.encode(),write_to=str(OUT/(NAME+'.png')))
    print(f'Generated original controlled attachment comparison: {W}x{H}')


if __name__ == '__main__':
    build()
