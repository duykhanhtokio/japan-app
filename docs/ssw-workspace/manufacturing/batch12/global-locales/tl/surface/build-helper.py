import json,pathlib,re
P=pathlib.Path(__file__).parent;R=P.resolve().parents[6]
def polish(x):
 if isinstance(x,str):
  x=x.replace('it ala','itala').replace('sun din','sundin').replace('Idi in','Idiin').replace('l ahat','lahat').replace('t iyakin','tiyakin').replace('v spH','vs pH').replace('molt o','mol to').replace('omV','o mV').replace('samol/L','sa mol/L').replace('saNnotation','sa N notation')
  x=re.sub(r',(?=[A-Za-z])',', ',x);x=re.sub(r';(?=\S)','; ',x)
  x=re.sub(r'(?<=[a-z])(?=(?:4M|3R|5S|QCD|SI|ISO|JIS|RoHS|REACH|OSHMS|KYT|OJT|SDS|PDF|Table|Ohm|Kirchhoff|Fleming|Heinrich|DC|AC|COD|BOD|SS|VOC|SOx|NOx|XRF|X-ray))',' ',x)
  x=re.sub(r'(?<=[A-Za-z])(?=\d)',lambda m:' ' if x[max(0,m.start()-5):m.start()].split()[-1:] not in [['ADC']] else '',x)
  x=re.sub(r'(?<=\d)(?=(?:minuto|metals|rows|ang|at|ay|ng|sa|kaysa|kaya|bilang|equivalent))',' ',x)
  for a,b in {'Aat':'A at','Vat':'V at','S/mat':'S/m at','S/mang':'S/m ang','pHlamang':'pH lamang','pH7at':'pH7 at','DCat':'DC at','ACo':'AC o','Nnumber':'N number','SDSat':'SDS at','SDSlamang':'SDS lamang','PDFnoong':'PDF noong','3Rang':'3R ang','Table7-1at':'Table7-1 at','Table7-1bilang':'Table7-1 bilang','Table7-2at':'Table7-2 at','Table7-2numbers':'Table7-2 numbers','Table7-2,':'Table7-2,','SIm':'SI m','SIunit':'SI unit','ABSresin':'ABS resin','Ohm law':'Ohm law','Slamang':'S lamang','mSlamang':'mS lamang','IACS.':'IACS.','µS/mat':'µS/m at','Xrays':'X-rays','X-ray irradiation':'X-ray irradiation'}.items():x=x.replace(a,b)
  for term in ['pH','DC','AC','COD','BOD','SS','VOC','SOx','NOx','SDS','PDF','ISO9001','ISO14001','JIS','RoHS','REACH','OSHMS','KYT','OJT','4M','3R','5S','QCDS','QCD','SI','Table7-1','Table7-2','NaOH','HCl','Cu','Zn','Sn','Ni','AgCl','CVD','PVD','XRF','IACS','ACS','ABS','mol/L','S/m','µS/m','mS/m']:
   # Preserve scientific token identity while separating accidentally attached Filipino words.
   for word in ['ang','at','ay','sa','ng','kaya','lamang','raw','to','for','in','pero','only','need','comparison','certification','explanation','notation','diagram','unit','values','number','numbers','meter','lamang']:
    x=x.replace(term+word,term+' '+word)
   for word in ['ang','sa','ng','at','kaysa','mula','bago','lahat','same','sam','vs']:
    x=re.sub(r'(?<![A-Za-z])'+word+re.escape(term),word+' '+term,x)
  x=x.replace('naSo mS','na S o mS').replace('absoluteS/m','absolute S/m').replace('7-2numbers','7-2 numbers').replace('7-1at','7-1 at').replace('7-1bilang','7-1 bilang').replace('7-2at','7-2 at').replace('100%ang','100% ang').replace('current2A','current 2A').replace('drops=8Vat16V','drops=8V at 16V')
  x=x.replace('No color change,no chemical reaction','Walang color change,kaya walang chemical reaction').replace('Delete records','Burahin ang mga rekord').replace('Delete whole record','Burahin ang buong rekord').replace('Delete count records','Burahin ang quantity records').replace('Delete names','Burahin ang names').replace('Open running lid','Buksan ang lid habang running').replace('Hold hanggang','Ipagpaliban hanggang').replace('Check before','Suriin bago')
  x=re.sub(r'(?<=%)(?=[A-Za-z])',' ',x)
  x=re.sub(r',(?=[A-Za-z])',', ',x)
  return x
 if isinstance(x,list):return [polish(v) for v in x]
 if isinstance(x,tuple):return tuple(polish(v) for v in x)
 return x
def build(start,D):
 D=polish(D)
 J=json.load(open(R/'src/data/manufacturing/surface.json'))['lessons'];out={}
 for l,z in zip(J[start-1:start-1+len(D)],D):
  title,obj,pars,terms,activity,safety,summary=z
  assert len(pars)==len(l['paragraphs']) and len(terms)==len(l['terms']) and len(safety)==len(l['safetyJa']),l['id']
  out[l['id']]={'sourceHash':l['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','title':title,'objective':obj,'paragraphs':[{'id':p['id'],'title':h,'text':t} for p,(h,t) in zip(l['paragraphs'],pars)],'terms':[{'ja':s['ja'],'reading':s['reading'],'meaning':t} for s,t in zip(l['terms'],terms)],'activity':activity,'safety':safety,'summary':summary}
 (P/f'lessons-{start:03}-{start+len(D)-1:03}.json').write_text(json.dumps({'locale':'tl','lessons':out},ensure_ascii=False,indent=2)+'\n')
