from pathlib import Path
import json,re,hashlib
OUT=Path(__file__).parent
mapping=json.loads((OUT/'approved-whitespace-map-qa.json').read_text())
for k in ['documented','indefinite','remaking']:mapping.pop(k,None)
for k in list(mapping):mapping[k]=mapping[k].replace('contact or','contactor').replace('pin out','pinout')
# Reviewed boundary fixes only; characters and mathematical symbols remain identical.
mapping.update({'notencoding':'not encoding','malingmilliseconds':'maling milliseconds','sonpagkataposoff':'s on pagkatapos off','mAginawang':'mA ginawang','msginawang':'ms ginawang','kgkahitvolume':'kg kahit volume','kgmass':'kg mass','mmanggawin':'mm ang gawin','ngspecified':'ng specified','kumulangsampungbesesmalaki':'kumulang sampung beses malaki','maxclearance':'max clearance','angmax':'ang max','parafit':'para fit','dahiloff':'dahil off','saSSR':'sa SSR','Cexample':'C example','Areverse':'A reverse','Hzsine':'Hz sine','asms':'as ms','Acurrent':'A current','hindiV':'hindi V','angvalues':'ang values','toolibangunit':'tool ibang unit','Alisinwasher':'Alisin washer','angtorque':'ang torque','ibangunit':'ibang unit','Hinalangcause':'Hinalang cause','bilangfact':'bilang fact','malingmessage':'maling message','ayonprocedure':'ayon procedure','IDlost':'ID lost','huwagpalitanK':'huwag palitan K','separatescoil':'separates coil','parafunction':'para function','IdealtransformerN':'Ideal transformer N','lossnotfromratiolamang':'loss not from ratio lamang','Edifferentorder':'E different order','Eexchange':'E exchange','Underratingdamagekahitsamepackage':'Underrating damage kahit same package','ignoremaxrating':'ignore max rating','pinsboth':'pins both','Checkcertscope':'Check cert scope','Organizationcert':'Organization cert','strandedarea':'stranded area','Cutstrandslosesarea':'Cut strands loses area','Dialzero':'Dial zero','bawatisa':'bawat isa','itempass':'item pass','windingfit':'winding fit','Mlaging':'M laging','bilangprefix':'bilang prefix','PPMlaging':'PPM laging','angSIbase':'ang SI base','aycd':'ay cd','PSEclassification':'PSE classification','maliitRmas':'maliit R mas','NTlamang':'NT lamang','ngN':'ng N','TangP':'T ang P','mAay':'mA ay','PMay':'PM ay','MayJIS':'May JIS','ORonlyone':'OR only one','BJTsa':'BJT sa','DCmotor':'DC motor','PPEayon':'PPE ayon','bodypart':'body part','samplecount':'sample count','mAin':'mA in','SGdensityratio':'SG density ratio','Rproportional':'R proportional','twoends':'two ends','Needtarget':'Need target','kasyaparts':'kasya parts','safeisolation':'safe isolation','all-life':'all-life'})
for k,v in mapping.items():assert re.sub(r'\s','',k)==re.sub(r'\s','',v),(k,v)
pat=re.compile(r'\b(?:'+ '|'.join(re.escape(x) for x in sorted(mapping,key=len,reverse=True))+r')\b')
keep={'pH','hFE','kWh','mA','mV','mF','kW','kV','kHz','MHz','CdS'}
def clean(s):
 orig=s
 s=pat.sub(lambda m:mapping[m.group()],s)
 def camel(m):
  w=m.group()
  if w in keep:return w
  w=re.sub(r'^(NOT|AND|OR|SSR|BJT|FET|IGBT|DC|AC|IC|PLC|PSE|ISO|JIS|PDF|ESD|PPM|FRP|LCR|DMM|SG)(?=[a-z])', r'\1 ',w)
  w=re.sub(r'([a-z])([A-Z])',r'\1 \2',w)
  w=re.sub(r'([A-Z]{2,})([A-Z][a-z])',r'\1 \2',w)
  return w
 s=re.sub('[A-Za-z]+',camel,s)
 for a,b in {'NO Tx':'NOT x','NO Ty':'NOT y','ORNO T':'OR NOT','ANDNO T':'AND NOT','AN Dat':'AND at','O Rat':'OR at','h FE':'hFE','m F':'mF','k Wh':'kWh','p H':'pH','A C':'AC','I C':'IC','AN Dinputs':'AND inputs','ES Dbag':'ESD bag','DM Mnever':'DMM never','FElaging':'FE laging'}.items():s=s.replace(a,b)
 s=re.sub(r'(?<=[Ω²³¹])(?=[A-Za-z])',' ',s)
 s=re.sub(r'(?<=\d)(?=[A-Za-z])',' ',s)
 s=re.sub(r'(?<=[A-Za-z])(?=\d)',' ',s)
 s=re.sub(r'(?<=[,;:])(?=[A-Za-z0-9])',' ',s)
 assert re.sub(r'\s','',orig)==re.sub(r'\s','',s)
 return s
changes=[]
for f in sorted(OUT.glob('*.json')):
 if not f.name.startswith(('lesson-','weekly-','mock-')):continue
 d=json.loads(f.read_text());before=hashlib.sha256(f.read_bytes()).hexdigest()
 for l in d.get('lessons',{}).values():
  for k in ('title','objective','activity','summary'):l[k]=clean(l[k])
  l['safety']=[clean(x) for x in l['safety']]
  for a in l['paragraphs']:a['title']=clean(a['title']);a['text']=clean(a['text'])
  for a in l['terms']:a['meaning']=clean(a['meaning'])
 for q in d.get('questions',{}).values():
  q['stem']=clean(q['stem']);q['options']=[clean(x) for x in q['options']];q['reasons']=[clean(x) for x in q.get('reasons',q.get('optionReasons',[]))]
 f.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');after=hashlib.sha256(f.read_bytes()).hexdigest()
 if before!=after:changes.append({'file':f.name,'beforeSha256':before,'afterSha256':after})
(OUT/'target-whitespace-normalization-qa.json').write_text(json.dumps({'method':'Reviewed word-boundary spacing only; every target field asserted identical after removal of whitespace. No source,metadata,mathematical symbols,or translation letters changed.','changedFiles':changes,'nativeReviewed':False,'domainReviewed':False},ensure_ascii=False,indent=2)+'\n')
print('Whitespace-only normalization:',len(changes),'payloads')
