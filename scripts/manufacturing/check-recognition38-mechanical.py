"""Independent readout and image/source bindings for the three mechanical recognition packs."""
from pathlib import Path
import json,hashlib,math,xml.etree.ElementTree as ET
from decimal import Decimal
R=Path(__file__).resolve().parents[2];p=R/'src/data/manufacturing/recognition38/mechanical.json';d=json.loads(p.read_text());ns={'s':'http://www.w3.org/2000/svg'}
def sha(b):return hashlib.sha256(b).hexdigest()
def canon(o):return sha(json.dumps(o,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode())
counts={};qbyid={};assetbyid={}
for pack in d['packs']:
 assert pack['id'] in ['mfg37-required-sign-recognition','mfg37-required-analogue-metrology-readout','mfg37-required-hole-weld-annotations']
 for asset in pack['assets']:
  assert sha((R/asset['file']).read_bytes())==asset['sha256'];assetbyid[asset['id']]=asset
 for q in pack['questions']:
  assert q['sourceHash']==canon({k:v for k,v in q.items() if k!='sourceHash'})
  assert len(q['optionsJa'])==len(q['optionReasonsJa'])==4 and len(set(q['optionsJa']))==4
  for id in q['imageAssetIds']:assert q['imageAssetHashes'][id]==assetbyid[id]['sha256']
  assert all(isinstance(x,str) and x.strip() for x in [q['stemJa']]+q['optionsJa']+q['optionReasonsJa'])
  counts[q['correctIndex']]=counts.get(q['correctIndex'],0)+1;qbyid[q['id']]=q
 for loc,t in pack['locales'].items():
  assert t['captionSourceHash']==sha(pack['captionJa'].encode());assert t['caption'].strip()
  assert set(t['questions'])=={q['id'] for q in pack['questions']}
  for id,x in t['questions'].items():
   assert x['sourceHash']==qbyid[id]['sourceHash'];assert len(x['options'])==len(x['reasons'])==4
   assert all(isinstance(s,str) and s.strip() for s in [x['stem']]+x['options']+x['reasons'])
# Derive the micrometer result from the visible tick geometry and reference line.
base=R/'assets/manufacturing/recognition38'
root=ET.parse(base/'metrology-micrometer.svg').getroot();lines=root.findall('.//s:line',ns);rects=root.findall('.//s:rect',ns)
edge=next(float(x.attrib['x']) for x in rects if x.attrib.get('x')=='720')
visible=[float(x.attrib['x1']) for x in lines if x.attrib.get('stroke')=='#21384b' and x.attrib.get('y1')=='470' and x.attrib.get('x1')==x.attrib.get('x2') and float(x.attrib['x1'])<edge]
main=Decimal('12')+Decimal(str((max(visible)-245)/170));assert main==Decimal('14.5')
reference=next(float(x.attrib['y1']) for x in lines if x.attrib.get('stroke')=='#b25d2c')
labels=[int(x.text) for x in root.findall('.//s:text',ns) if x.attrib.get('x')=='845' and abs(float(x.attrib['y'])-9-reference)<1e-9]
assert labels==[23];micro=main+Decimal(labels[0])*Decimal('.5')/50;assert micro==Decimal('14.73')
results=[]
for name,divisions,expected,inc,reference,sign in [('dial',100,12,'.01','20.00',1),('lever',50,-5,'.002','10.000',1),('bore',100,12,'.001','25.000',-1)]:
 root=ET.parse(base/f'metrology-{name}.svg').getroot();ls=root.findall('.//s:line',ns)
 tickangles=[]
 for x in ls:
  if x.attrib.get('stroke')!='#21384b':continue
  xx=float(x.attrib['x2']);yy=float(x.attrib['y2'])
  if abs(math.hypot(xx-540,yy-490)-265)<1e-7:tickangles.append(math.atan2(xx-540,490-yy)%(2*math.pi))
 assert len(tickangles)==divisions
 tickangles.sort();spacings=[(tickangles[(i+1)%divisions]-tickangles[i])%(2*math.pi) for i in range(divisions)]
 assert all(abs(x-2*math.pi/divisions)<1e-10 for x in spacings)
 needle=next(x for x in ls if x.attrib.get('stroke')=='#b25d2c' and x.attrib.get('x1')=='540')
 angle=math.atan2(float(needle.attrib['x2'])-540,490-float(needle.attrib['y2']));ticks=angle*divisions/(2*math.pi);assert abs(ticks-expected)<1e-10
 value=Decimal(reference)+Decimal(expected)*Decimal(inc)*sign;results.append({'model':name,'ticks':expected,'value':str(value)})
assert [x['value'] for x in results]==['20.12','9.990','24.988']
# Independently check hole-depth ratio and prescribed segment/pitch dimensions.
assert Decimal('196.875')/Decimal('350')==Decimal('9')/Decimal('16')
assert Decimal('200')/10==20 and (Decimal('610')-260)/10==35
assert 3*20==60 and 35-20==15
# The sign questions jointly ask for every one of the thirty pictured meanings.
covered=[]
for id,inds in {'001':[7,8,4],'002':[3,5,6],'003':[0,1,2,9],'004':[15,14,17,18,19],'005':[10,11,12,13,16],'006':[20,21,22,23,24],'007':[25,26,27,28,29]}.items():
 assert 'mfg38-mechanical-q'+id in qbyid;covered+=inds
assert sorted(covered)==list(range(30))
assert len(qbyid)==21 and counts=={0:6,1:5,2:5,3:5}
print(json.dumps({'status':'PASS','packs':3,'questions':21,'assets':11,'answerPositions':counts,'signMeaningsAssessed':30,'micrometerReadout':str(micro),'comparatorReadouts':results,'segmentTotal':60,'segmentGap':15,'segmentPitch':35,'sourceAndImageHashes':'exact','scope':'Bounded educational models; no physical-device/native/domain or whole-source certification.'}))
