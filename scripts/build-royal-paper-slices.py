"""Reproduce the approved paper frame slices without changing artwork."""
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parent.parent
source = Image.open(root / 'assets/app/ui/royal-af/dialogue-frame-v1.png')
assert source.size == (1600, 560)
x, y = [0, 240, 1360, 1600], [68, 228, 328, 488]
out = root / 'assets/app/ui/royal-af/paper-slices'
out.mkdir(exist_ok=True)
for row in range(3):
    for col in range(3):
        source.crop((x[col], y[row], x[col+1], y[row+1])).save(out / f'{row}-{col}.png')
print('Royal paper slices: exact approved source crop, 9 files.')
