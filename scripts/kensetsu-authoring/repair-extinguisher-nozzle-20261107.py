from pathlib import Path
from PIL import Image,ImageDraw
P=Path(__file__).resolve().parents[2];im=Image.open(P/'assets/kensetsu/daily-technical/extinguisher.png').convert('RGB');d=ImageDraw.Draw(im)
# Complete the hose-to-nozzle connection; no operation, type or rating is introduced.
d.line([(775,374),(772,393),(762,420)],fill='#173750',width=18)
out=P/'assets/kensetsu/daily-technical-reviewed-20261107/extinguisher-connected-nozzle-v2.png';im.save(out,optimize=True);print(out)
