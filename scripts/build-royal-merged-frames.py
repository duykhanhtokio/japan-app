from pathlib import Path
from PIL import Image
r=Path(__file__).resolve().parent.parent / 'assets/app/ui/royal-af'
for tone,cx,cy,h in [('paper',36,24,220),('hud',30,15,160),('open',36,16,160)]:
 out=Image.new('RGBA',(600,h))
 for row in range(3):
  for col in range(3):
   if tone=='open' and row==1 and col==1:continue
   im=Image.open(r/f'{tone}-slices/{row}-{col}.png')
   xs=[0,cx,600-cx,600];ys=[0,cy,h-cy,h]
   im=im.resize((xs[col+1]-xs[col],ys[row+1]-ys[row]),Image.Resampling.LANCZOS)
   out.paste(im,(xs[col],ys[row]))
 out.save(r/f'{tone}-merged.png',optimize=True)
 print(tone,out.size)
