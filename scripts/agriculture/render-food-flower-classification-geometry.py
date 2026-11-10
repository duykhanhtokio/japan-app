"""Faithful source-driven RN-host CSS geometry preview, explicitly not a browser screenshot."""
from pathlib import Path
import sys,re,json,xml.etree.ElementTree as ET
from PIL import Image,ImageDraw,ImageFont
import unicodedata
def clusters(s):
 out=[]
 for c in s:
  if out and (unicodedata.category(c).startswith("M") or out[-1].endswith("\u1039")):out[-1]+=c
  else:out.append(c)
 return out
Q=Path(sys.argv[1]);scale=2;overflow=[]
font_cache={}
def font(size,myanmar=False):
 key=(size,myanmar)
 if key not in font_cache:font_cache[key]=ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSansMyanmar-Regular.ttf' if myanmar else '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',round(size*scale))
 return font_cache[key]
def runs(s):
 out=[]
 for c in s:
  my=bool(re.search('[\u1000-\u109f\uaa60-\uaa7f]',c))
  if out and (out[-1][1]==my or c.isspace()):out[-1]=(out[-1][0]+c,out[-1][1])
  else:out.append((c,my))
 return out
def measure(s,size):return sum(font(size,m).getlength(t)/scale for t,m in runs(s))
def style(e):
 d={}
 for a in e.get('style','').split(';'):
  if ':' in a:
   k,v=a.split(':',1);d[k]=v
 return d
def num(s,k,default=0):
 try:return float(s.get(k,str(default)).replace('px',''))
 except:return default
def layout(e,x,y,w):
 s=style(e);pt=num(s,'padding-top',num(s,'padding'));pb=num(s,'padding-bottom',num(s,'padding'));pl=num(s,'padding-left',num(s,'padding'));pr=num(s,'padding-right',num(s,'padding'));bw=num(s,'border-width');inner=max(1,w-pl-pr-2*bw);n={'tag':e.tag,'s':s,'x':x,'y':y,'w':w,'children':[],'id':e.get('data-testid')}
 if e.tag=='span':
  size=num(s,'font-size',16);lh=num(s,'line-height',size*1.2);lines=['']
  for c in clusters(''.join(e.itertext())):
   if c=='\n':lines.append('');continue
   if measure(lines[-1]+c,size)>w and lines[-1]:
    k=lines[-1].rfind(' ')
    if k>0 and measure(lines[-1][k+1:]+c,size)<=w:
     tail=lines[-1][k+1:]+c;lines[-1]=lines[-1][:k];lines.append(tail)
    else:lines.append(c)
   else:lines[-1]+=c
  for l in lines:
   if measure(l,size)>w+0.5:overflow.append((n['id'],measure(l,size),w))
  n.update(lines=lines,font=size,lineheight=lh,h=max(lh,len(lines)*lh));return n
 children=list(e);gap=num(s,'gap');cy=y+pt+bw
 if s.get('flex-direction')=='row':
  groups=[[]];used=0
  for c in children:
   basis=num(style(c),'flex-basis',inner)
   if groups[-1] and used+gap+basis>inner:groups.append([]);used=0
   groups[-1].append((c,min(inner,basis)));used+=min(inner,basis)+(gap if used else 0)
  for group in groups:
   total=sum(b for _,b in group)+gap*(len(group)-1);extra=max(0,inner-total);grow=sum(num(style(c),'flex-grow') for c,_ in group);cx=x+pl+bw;line=[]
   for c,b in group:
    cw=b+(extra*num(style(c),'flex-grow')/grow if grow else 0);v=layout(c,cx,cy,cw);line.append(v);cx+=cw+gap
   height=max((v['h'] for v in line),default=0)
   for v in line:v['h']=height;n['children'].append(v)
   cy+=height+gap
  if groups and children:cy-=gap
 else:
  for c in children:
   v=layout(c,x+pl+bw,cy,inner);n['children'].append(v);cy+=v['h']+gap
  if children:cy-=gap
 n['h']=cy-y+pb+bw;return n
def draw(n,p):
 s=n['s'];x,y,w,h=[n[k]*scale for k in ['x','y','w','h']]
 if s.get('background-color'):p.rectangle([x,y,x+w,y+h],fill=s['background-color'])
 if num(s,'border-width'):p.rounded_rectangle([x,y,x+w,y+h],radius=num(s,'border-radius')*scale,outline=s.get('border-color','#B38432'),width=max(1,round(num(s,'border-width')*scale)))
 if num(s,'border-bottom-width'):p.line([x,y+h,x+w,y+h],fill=s.get('border-color','#B38432'),width=max(1,round(num(s,'border-bottom-width')*scale)))
 if n['tag']=='span':
  for i,l in enumerate(n['lines']):
   xx=x;yy=y+i*n['lineheight']*scale
   for t,m in runs(l):
    f=font(n['font'],m);p.text((xx,yy),t,font=f,fill=s.get('color','#173750'),anchor='lt');xx+=f.getlength(t)
 for c in n['children']:draw(c,p)
results=[]
for html in [Q/'1-vi-375.html',Q/'2-vi-375.html',Q/'2-my-375.html',Q/'2-vi-1440.html']:
 raw=html.read_text();width=int(re.search(r'size:(\d+)px',raw)[1]);e=ET.fromstring(raw.split('</style>',1)[1]);tree=layout(e,12,12,width-24);height=round(tree['h']+24);im=Image.new('RGB',(width*scale,height*scale),'#FFFAEF');draw(tree,ImageDraw.Draw(im));out=html.with_suffix('.geometry.png');im.save(out)
 # Separate scroll-view slices aid actual inspection without claiming browser screenshots.
 for i,top in enumerate(range(0,im.height,2400)):im.crop((0,top,im.width,min(im.height,top+2400))).save(html.with_name(html.stem+f'.slice-{i+1}.png'))
 results.append({'actualSSRInput':html.name,'geometryOutput':out.name,'width':width,'contentHeight':height,'method':'RN structural-host source styles, explicit flex-wrap/line-height/font measurement approximation; not browser/native rendering'})
assert not overflow,overflow
(Q/'geometry-result.json').write_text(json.dumps({'PASS':True,'textOverflowCount':0,'cases':results},indent=2)+'\n');print('PASS4 faithful source-driven geometry previews;0 measured text overflow;not browser screenshots')
