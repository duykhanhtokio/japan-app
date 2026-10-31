"""Re-execute existing independent SVG model math without accepting missing PNG bytes."""
from pathlib import Path
import math,json,xml.etree.ElementTree as ET
from decimal import Decimal
ROOT=Path(__file__).resolve().parents[5];A=ROOT/'assets/manufacturing/recognition38';ns={'s':'http://www.w3.org/2000/svg'}
r=ET.parse(A/'metrology-micrometer.svg').getroot();lines=r.findall('.//s:line',ns);edge=next(float(x.attrib['x'])for x in r.findall('.//s:rect',ns)if x.attrib.get('x')=='720')
xs=[float(x.attrib['x1'])for x in lines if x.attrib.get('stroke')=='#21384b' and x.attrib.get('y1')=='470' and x.attrib.get('x1')==x.attrib.get('x2') and float(x.attrib['x1'])<edge]
main=Decimal('12')+Decimal(str((max(xs)-245)/170));assert main==Decimal('14.5')
reference=next(float(x.attrib['y1'])for x in lines if x.attrib.get('stroke')=='#b25d2c')
labels=[int(x.text)for x in r.findall('.//s:text',ns)if x.attrib.get('x')=='845' and abs(float(x.attrib['y'])-9-reference)<1e-9];assert labels==[23]
micro=main+Decimal(labels[0])*Decimal('.5')/50;assert micro==Decimal('14.73')
results=[]
for name,divisions,expected,inc,reference,sign in [('dial',100,12,'.01','20.00',1),('lever',50,-5,'.002','10.000',1),('bore',100,12,'.001','25.000',-1)]:
 r=ET.parse(A/f'metrology-{name}.svg').getroot();lines=r.findall('.//s:line',ns);angles=[]
 for x in lines:
  if x.attrib.get('stroke')!='#21384b':continue
  xx=float(x.attrib['x2']);yy=float(x.attrib['y2'])
  if abs(math.hypot(xx-540,yy-490)-265)<1e-7:angles.append(math.atan2(xx-540,490-yy)%(2*math.pi))
 assert len(angles)==divisions;angles.sort();assert all(abs((angles[(i+1)%divisions]-angles[i])%(2*math.pi)-2*math.pi/divisions)<1e-10 for i in range(divisions))
 needle=next(x for x in lines if x.attrib.get('stroke')=='#b25d2c' and x.attrib.get('x1')=='540');ticks=math.atan2(float(needle.attrib['x2'])-540,490-float(needle.attrib['y2']))*divisions/(2*math.pi);assert abs(ticks-expected)<1e-10
 value=Decimal(reference)+Decimal(expected)*Decimal(inc)*sign;results.append({'model':name,'ticks':expected,'valueMm':str(value)})
assert[str(x['valueMm'])for x in results]==['20.12','9.990','24.988']
area=2*Decimal(60)*40;edges=2*(Decimal(60)+40)*2;assert(area,area+edges)==(Decimal(4800),Decimal(5200))
result={'status':'PASS','logicProvenance':'Existing independent SVG readout validation logic re-executed in this session; not a new physical-device experiment','micrometerMm':str(micro),'comparatorReadouts':results,'broadFacesMm2':str(area),'allSixFacesMm2':str(area+edges),'scope':'Four original mathematical readout models and given plated-area arithmetic only; not device accuracy, compliance or all574-page closure'}
(Path(__file__).parent/'readout-geometry.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
