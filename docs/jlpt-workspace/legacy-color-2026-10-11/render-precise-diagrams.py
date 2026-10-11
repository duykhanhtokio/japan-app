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


def flyer_2011():
    import math
    im=Image.new('RGB',(1440,1400),'#fffaf1');d=ImageDraw.Draw(im)
    f=lambda n:ImageFont.truetype(str(FONT),n)
    d.rounded_rectangle((30,30,1410,1370),18,fill='#fffdf8',outline='#77624b',width=4)
    def center(text,xy,size,color='#263d49'):
        d.text(xy,text,font=f(size),fill=color,anchor='mm',align='center')
    def burst(cx,cy,r,text,size=40):
        pts=[]
        for i in range(24):
            a=-math.pi/2+i*math.pi/12;rad=r if i%2==0 else r*.66
            pts.append((cx+math.cos(a)*rad,cy+math.sin(a)*rad))
        d.polygon(pts,fill='#ffefc6',outline='#967d53',width=4)
        center(text,(cx,cy),size)
    burst(242,245,180,'安い！',55)
    center('あらきや',(1000,165),43)
    center('朝8：00～夜9：00',(1000,232),38)
    center('（電話：012-34-5678）',(1000,295),35)
    boxes=[(480,760),(810,1000),(1060,1280)]
    for a,b in boxes:d.rounded_rectangle((440,a,1350,b),10,fill='#fff6e2',outline='#967d53',width=3)
    burst(240,620,127,'安い！',40)
    burst(240,905,127,'安い！',40)
    burst(240,1170,137,'毎週\n安い！',37)
    center('6月11日（月）～14日（木）',(895,555),36)
    center('さとう 128円　トイレットペーパー 490円',(895,670),33)
    center('6月15日（金）～18日（月）',(895,855),36)
    center('しょうゆ 198円　ティッシュペーパー 290円',(895,940),33)
    for y,text in [(1107,'月・火　くだもの、魚、ジュース'),(1170,'水・木　とうふ、にく、やさい'),(1233,'金・土　パン、ぎゅうにゅう、魚、やさい')]:
        d.text((485,y),text,font=f(32),fill='#263d49',anchor='lm')
    im.save(ROOT/'assets/jlpt-legacy-color/n5-2011-12-grammar-reading-p6-q1.png')
if __name__=='__main__':
    toc();flyer_2011()
