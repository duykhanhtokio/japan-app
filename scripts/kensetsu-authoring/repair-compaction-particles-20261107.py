from PIL import Image,ImageDraw
from pathlib import Path
P=Path(__file__).resolve().parents[2];im=Image.open(P/'assets/kensetsu/daily-technical/compaction.png').convert('RGB');d=ImageDraw.Draw(im)
# Same soil sample: retain20 particles before and after. Compress vertical voids only.
d.rectangle((605,365,885,505),fill=im.getpixel((610,370)))
for x in [626,681,736,791,846]:
 for y in [386,421,456,491]:d.ellipse((x-6,y-6,x+6,y+6),fill='#c19b4d',outline='#173750',width=4)
out=P/'assets/kensetsu/daily-technical-reviewed-20261107/compaction-particles-v2.png';im.save(out,optimize=True);print(out)
