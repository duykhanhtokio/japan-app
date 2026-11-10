"""Original exact histogram geometry from fictional A/B data, not source art."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
R=Path(__file__).resolve().parents[2];out=R/'assets/food-manufacturing/source-practice64';out.mkdir(parents=True,exist_ok=True)
image=Image.new('RGB',(1200,960),'#fffaf0');d=ImageDraw.Draw(image)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
normal=ImageFont.truetype(font,28);large=ImageFont.truetype(font,36)
data={'A':[9,10,11],'B':[7,10,13]};rects=[]
for label,values in data.items():
    bottom=390 if label=='A' else 850;top=bottom-240;left=130;step=135
    d.text((35,top-40),label,fill='#15364a',font=large)
    for count in [0,1,2]:
        y=bottom-count*100;d.line((left,y,1080,y),fill='#d0d5d5',width=2);d.text((75,y-18),str(count),fill='#15364a',font=normal)
    d.text((75,top-40),'n',fill='#15364a',font=normal)
    for value in values:
        x=left+(value-6.5)*step
        box=(round(x-step/2),bottom-100,round(x+step/2),bottom)
        d.rectangle(box,fill='#478fa5'if label=='A'else '#c18542',outline='#15364a',width=3)
        rects.append({'group':label,'binLow':value-.5,'binHigh':value+.5,'frequency':1,'pixels':box})
    d.line((left,top-15,left,bottom),fill='#15364a',width=4);d.line((left,bottom,1080,bottom),fill='#15364a',width=4)
    for value in range(7,14):
        x=left+(value-6.5)*step;d.line((x,bottom,x,bottom+10),fill='#15364a',width=2);d.text((x-15,bottom+16),str(value),fill='#15364a',font=normal)
    d.text((1100,bottom+16),'g',fill='#15364a',font=normal)
path=out/'same-centre-different-spread.webp';image.save(path,'WEBP',lossless=True)
receipt={'schemaVersion':1,'originalArt':True,'sourceImageCopiedOrTraced':False,'data':data,'sameBinWidthG':1,'xLimitsG':[6.5,13.5],'yTicks':[0,1,2],'panels':2,'barGeometry':rects,'axisLabels':{'g':'mass in grams','n':'frequency'},'width':1200,'height':960,'asset':str(path.relative_to(R)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'domainReviewed':False,'physicalDeviceTested':False}
(R/'docs/ssw-workspace/food-manufacturing/source-v2-round2-20261103/figure64.json').write_text(json.dumps(receipt,indent=2)+'\n')
print('Original A/B histogram generated: six1g bins, same axes, no answer labels.')
