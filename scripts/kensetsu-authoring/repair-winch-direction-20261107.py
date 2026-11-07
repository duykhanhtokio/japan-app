from pathlib import Path
from PIL import Image,ImageDraw
import math
P=Path(__file__).resolve().parents[2];im=Image.open(P/'assets/kensetsu/daily-technical/winch.png').convert('RGB');d=ImageDraw.Draw(im)
d.rectangle((640,265,800,295),fill='#fffaf0')
a=(790,280);b=(650,280);ang=math.atan2(b[1]-a[1],b[0]-a[0]);d.line([a,b],fill='#25847c',width=6);d.polygon([b,(b[0]-20*math.cos(ang-.45),b[1]-20*math.sin(ang-.45)),(b[0]-20*math.cos(ang+.45),b[1]-20*math.sin(ang+.45))],fill='#25847c')
out=P/'assets/kensetsu/daily-technical-reviewed-20261107/winch-winding-direction-v2.png';im.save(out,optimize=True);print(out)
