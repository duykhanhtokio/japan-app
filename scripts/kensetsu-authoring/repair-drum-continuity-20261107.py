from pathlib import Path
from PIL import Image,ImageDraw
P=Path(__file__).resolve().parents[2]
im=Image.open(P/'assets/kensetsu/daily-technical/drum.png').convert('RGB');d=ImageDraw.Draw(im)
# Close the unintended blank gap between reel silhouette and its drawn extension cord.
d.line([(630,421),(650,421)],fill='#173750',width=14)
out=P/'assets/kensetsu/daily-technical-reviewed-20261107/drum-cord-continuity-v2.png';im.save(out,optimize=True);print(out)
