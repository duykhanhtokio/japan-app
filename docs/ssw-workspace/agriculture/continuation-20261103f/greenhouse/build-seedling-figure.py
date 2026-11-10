"""Independent controlled redraw from verified knowledge; no input image pixels."""
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import hashlib,json
D=Path(__file__).parent
W,H=1320,900
im=Image.new('RGB',(W,H),'#fbf9ef');dr=ImageDraw.Draw(im)
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def ft(s):return ImageFont.truetype(font,s,index=0)
def txt(x,y,s,size=24,color='#253f45'):dr.text((x,y),s,font=ft(size),fill=color)
def arrow(a,b,color='#a38849'):
 dr.line([a,b],fill=color,width=3)
 import math
 t=math.atan2(b[1]-a[1],b[0]-a[0]);L=11
 dr.polygon([b,(b[0]-L*math.cos(t-.45),b[1]-L*math.sin(t-.45)),(b[0]-L*math.cos(t+.45),b[1]-L*math.sin(t+.45))],fill=color)
def leaf(x,y,side,scale,color,up=0):
 dx=side*scale;dy=up
 points=[(x,y),(x+dx*.45,y-scale*.36+dy),(x+dx,y-scale*.13+dy),(x+dx*.80,y+scale*.25+dy),(x+dx*.3,y+scale*.2)]
 dr.polygon(points,fill=color);dr.line([(x,y),(x+dx*.80,y+dy)],fill='#31553a',width=2)
def plant(cx,top,stemwidth,ys,leafsize,color,coty,up=0):
 ground=605;dr.rectangle((cx-92,ground,cx+92,ground+21),fill='#b8a27a');dr.line([(cx,ground),(cx,top)],fill=color,width=stemwidth)
 for i,y in enumerate(ys):leaf(cx,y,1 if i%2==0 else -1,leafsize,color,up)
 leaf(cx,570,-1,coty,color);leaf(cx,570,1,coty,color)
 return(cx+int(coty*.8),570)
dr.rounded_rectangle((14,14,W-14,H-14),radius=20,outline='#a58c54',width=3)
txt(42,36,'苗の外観を、複数の部位で比べる',34)
txt(42,90,'資料に示された模式例です。見た目だけで原因を確定する診断基準ではありません。',21)
for i in range(3):
 x=30+i*430;dr.rounded_rectangle((x,150,x+400,737),radius=16,fill='#fffef8',outline='#b5a475',width=2)
txt(52,170,'A  徒長苗の例',28);txt(482,170,'B  健苗の例',28);txt(912,170,'C  老化苗の例',28)
plant(228,294,6,[344,425,502],'x' if False else 48,'#598962',33)
plant(658,383,13,[420,454,487],45,'#447b4f',39,-19)
c=plant(1088,423,13,[456,486,514],28,'#315b39',17)
txt(52,225,'細い茎・長い節間',22);txt(482,225,'太い茎・詰まった節間',22);txt(912,225,'小さい葉・詰まった節間',22)
txt(52,652,'葉は薄く大きい例',22);txt(482,652,'葉はしっかり上向き',22)
txt(912,652,'子葉は小形',24);arrow((1052,651),c)
txt(52,782,'節間が短いという一点だけで、苗が健康だとは判断しません。',26)
txt(52,828,'茎、節間、葉、子葉を分けて観察し、どの部位を見たか記録します。',23)
out=D/'seedling-condition-comparison.png';im.save(out,optimize=True)
sha=hashlib.sha256(out.read_bytes()).hexdigest();(D/'figure-build.json').write_text(json.dumps({'schemaVersion':1,'method':'independent_controlled_Pillow_redraw','sourceImagePixelsCopied':False,'rasterRetouch':False,'filename':out.name,'width':W,'height':H,'sha256':sha,'sourceFacts':[{'sourceId':'AGR-S1','pdfPage':73},{'sourceId':'AGR-S2','pdfPage':94}],'correction':'Unsupported hardened cotyledons replaced by source small cotyledons; arrow points to small cotyledon.','nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False},ensure_ascii=False,indent=2)+'\n')
print(sha)
