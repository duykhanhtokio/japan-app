"""Check diagnostic screenshots at straight border segments, away from corners."""
import json
from pathlib import Path
from PIL import Image
root=Path('docs/ui-workspace/home-stroke-1220-2026-10-03')
report=json.loads((root/'runtime.json').read_text())
checks=[]
for view in report['views']:
 for index,item in enumerate(view['cards']):
  im=Image.open(root/f"edge-{view['width']}-{index}.png").convert('RGB')
  x,y,w,h=0,0,*im.size
  bands={'left':(x+7,y+h*.4,x+10,y+h*.6),'right':(x+w-10,y+h*.4,x+w-7,y+h*.6),'top':(x+w*.4,y+9,x+w*.6,y+11),'bottom':(x+w*.4,y+h-8,x+w*.6,y+h-6)}
  for edge,box in bands.items():
   pixels=list(im.crop(tuple(round(n) for n in box)).get_flattened_data())
   gaps=sum(r>200 and b>200 and g<60 for r,g,b in pixels)
   artwork=sum(r<30 and g>230 and b>230 for r,g,b in pixels)
   assert gaps==0,(view['width'],item['name'],edge,'uncovered background',gaps)
   assert artwork>0,(view['width'],item['name'],edge,'no artwork next to stroke')
   checks.append({'width':view['width'],'card':item['name'],'edge':edge,'backgroundPixels':gaps,'artworkPixels':artwork})
(root/'pixels.json').write_text(json.dumps({'checks':checks,'pass':True},ensure_ascii=False,indent=2)+'\n')
print(f'Home stroke pixel PASS: {len(checks)} straight-edge bands; no uncovered background between artwork and gold stroke.')
