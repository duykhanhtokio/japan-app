"""Rebuild the day70 exact pupil comparison; no source-book artwork or text."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import math
S=2;W,H=1536,1024
im=Image.new('RGB',(W*S,H*S),'#fffaf0');d=ImageDraw.Draw(im)
def ellipse(box,fill,outline=None,width=1):d.ellipse(tuple(int(x*S) for x in box),fill=fill,outline=outline,width=width*S)
def bez(a,b,c):return [((1-t)**2*a[0]+2*(1-t)*t*b[0]+t*t*c[0],(1-t)**2*a[1]+2*(1-t)*t*b[1]+t*t*c[1])for t in [i/80 for i in range(81)]]
def line(points,fill,width):d.line([(int(x*S),int(y*S))for x,y in points],fill=fill,width=width*S,joint='curve')
for cx,pupil in [(420,90),(1116,40)]:
 ellipse((cx-280,365,cx+280,660),'#e8c8b0')
 upper=bez((cx-256,510),(cx,321),(cx+256,510));lower=bez((cx+256,510),(cx,712),(cx-256,510));poly=upper+lower
 d.polygon([(int(x*S),int(y*S))for x,y in poly],fill='#f7f4e9')
 eyeBase=im.copy()
 for r in range(126,0,-1):
  t=r/126;color=tuple(int((1-t)*a+t*b)for a,b in zip((119,155,146),(29,65,80)));ellipse((cx-r,510-r,cx+r,510+r),color)
 for k in range(120):
  a=2*math.pi*k/120;r1=102 if pupil==90 else 57;r2=122
  line([(cx+r1*math.cos(a),510+r1*math.sin(a)),(cx+r2*math.cos(a),510+r2*math.sin(a))],['#a4bab0','#213e47','#7c9d95'][k%3],1+k%2)
 ellipse((cx-pupil,510-pupil,cx+pupil,510+pupil),'#102833','#23404a',3)
 ellipse((cx-58,452,cx-10,478),'#d9e4dc')
 mask=Image.new('L',im.size,0);md=ImageDraw.Draw(mask);md.polygon([(int(x*S),int(y*S))for x,y in poly],fill=255)
 im=Image.composite(im,eyeBase,mask);d=ImageDraw.Draw(im)
 line(upper,'#7d6456',6);line(lower,'#a58e7c',3)
Path('assets/kaigo/royal-weekly-20261107/week10').mkdir(parents=True,exist_ok=True)
im.resize((W,H),Image.Resampling.LANCZOS).save('assets/kaigo/royal-weekly-20261107/week10/day70-pupil-directions-controlled.webp','WEBP',quality=95)
