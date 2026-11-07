from pathlib import Path
from PIL import Image,ImageDraw
P=Path(__file__).resolve().parents[2];im=Image.open(P/'assets/kensetsu/daily-technical/gasweld.png').convert('RGB');d=ImageDraw.Draw(im);ink='#173750';cream='#fffaf0';grey='#a8afb2'
# Keep labels and frame. Route the two hoses from regulator-neck regions, never cylinder walls.
d.rectangle((175,140,812,545),fill=cream)
for x,col in [(180,'#7b9d9f'),(380,'#b79b77')]:
 d.rounded_rectangle((x,250,x+110,540),radius=35,fill=col,outline=ink,width=5)
 d.rectangle((x+35,190,x+75,250),fill=grey,outline=ink,width=4)
 d.ellipse((x+65,205,x+120,260),fill=cream,outline=ink,width=4)
d.line([(235,190),(235,145),(650,145),(720,215)],fill='#527eab',width=8)
d.line([(435,190),(435,175),(610,175),(731,226)],fill='#b44e43',width=8)
d.line([(720,215),(800,145)],fill=ink,width=18)
d.line([(716,211),(731,226)],fill=ink,width=18)
out=P/'assets/kensetsu/daily-technical-reviewed-20261107/gasweld-regulator-routes-v2.png';im.save(out,optimize=True);print(out)
