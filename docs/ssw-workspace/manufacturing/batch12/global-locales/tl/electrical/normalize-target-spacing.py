from pathlib import Path
import json,re
OUT=Path(__file__).parent
FIX={'DCsupply':'DC supply','ACsupply':'AC supply','DCang':'DC ang','ACang':'AC ang','anodeAat':'anode A at','cathodeK':'cathode K','ICat':'IC at','ICna':'IC na','Japaneseang':'Japanese ang','PPEsa':'PPE sa','saANDatORng':'sa AND at OR ng','ANDatORoutput':'AND at OR output','ngANDatOR':'ng AND at OR','ngAND,OR,NOT':'ng AND, OR, NOT','ANDna':'AND na','ORna':'OR na','NOTna':'NOT na','atparallel':'at parallel','angANDatparallel':'ang AND at parallel','NOTofA':'NOT ng A','lampLaydapat':'lamp L ay dapat','onangAatB':'on ang A at B','ANDito':'AND ito','ORito':'OR ito','saAatBayon':'sa A at B ay on','ayonpara':'ay on para','ayoffat':'ay off at','atORay':'at OR ay','angORsa':'ang OR sa','saA=':'sa A=','ngA,B':'ng A, B','inputA,Bna':'input A, B na','atB=':'at B=','kungA=':'kung A=','angA,K':'ang A, K','ngA,K':'ng A, K','saA,K':'sa A, K','saAC':'sa AC','ngAC':'ng AC','Ksa':'K sa','Vba':'V ba','・':',','chahida':'pangangailangan','ɡ':'g'}
def clean(t):
 for a,b in FIX.items():t=t.replace(a,b)
 t=re.sub(r'(?<=\d)(?=[A-Za-z])',' ',t)
 t=re.sub(r'(?<=[A-Za-z])(?=\d)',' ',t)
 t=re.sub(r'(?<=[%Ω²³])(?=[A-Za-z])',' ',t)
 t=re.sub(r'(?<=[,;:])(?=[A-Za-z0-9])',' ',t)
 return t
for f in OUT.glob('lesson-*.json'):
 d=json.loads(f.read_text())
 for l in d['lessons'].values():
  for k in ('title','objective','activity','summary'):l[k]=clean(l[k])
  l['safety']=[clean(x) for x in l['safety']]
  for a in l['paragraphs']:a['title']=clean(a['title']);a['text']=clean(a['text'])
  for a in l['terms']:a['meaning']=clean(a['meaning'])
 f.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
print('Target spacing normalized; source and numeric content unchanged')
