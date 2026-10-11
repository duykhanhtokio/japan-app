"""Rebuild literal diagram labels deterministically; never invent exam data."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[3]
FONT=ROOT/'assets/app/fonts/NotoSansJP-Medium.ttf'
def toc():
    im=Image.new('RGB',(1240,820),'#fffaf1');d=ImageDraw.Draw(im)
    f=lambda n:ImageFont.truetype(str(FONT),n)
    d.rounded_rectangle((30,30,1210,790),20,fill='#fffdf8',outline='#77624b',width=4)
    d.text((82,65),'目次',font=f(44),fill='#263d49')
    names=['研究の背景','研究の目的','研究の方法','研究の分析結果','まとめ']
    pages=[1,9,11,17,35]
    for i,(name,page) in enumerate(zip(names,pages)):
        y=178+i*113
        d.text((142,y),f'{i+1} 章',font=f(38),fill='#263d49')
        d.text((280,y),name,font=f(38),fill='#263d49')
        end=280+d.textlength(name,font=f(38))+18
        for x in range(int(end),838,18):d.ellipse((x,y+40,x+4,y+44),fill='#77624b')
        d.text((866,y),str(page),font=f(38),fill='#263d49')
    # Choice leaders retain the original row mapping: 1→chapter1, 2→chapter2,
    # 3→chapter4, 4→chapter5. Chapter3 has no leader.
    for label,row,ly in [(1,0,145),(2,1,265),(3,3,570),(4,4,695)]:
        y=178+row*113
        x=280+d.textlength(names[row],font=f(38))+8
        d.line((x,y+29,1042,ly+28),fill='#263d49',width=3)
        d.text((1072,ly),str(label),font=f(43),fill='#263d49')
    target=ROOT/'assets/jlpt-legacy-color/n1-2012-07-l-p1-q06.png';im.save(target)
if __name__=='__main__':toc()
