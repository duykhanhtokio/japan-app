from pathlib import Path
import json,re,hashlib
P=Path(__file__).parent;R=P.parents[5];counts={};issues=[];nonkm=[];files=[];seen={}
for sp in ['mechanical','electrical','surface']:
 S=json.loads((R/f'src/data/manufacturing/mocks/{sp}.json').read_text());Q={q['id']:q for e in S['exams'] for section in e['sections'].values() for q in section['questions']};out={}
 for f in (P/sp).glob('mock*.json'):
  if 'qa'in f.name:continue
  x=json.loads(f.read_text())
  for id,t in x.get('questions',{}).items():
   s=Q[id];assert s['sourceHash']==t['sourceHash'];assert t['translatedDirectlyFrom']=='ja'and t['nativeReviewed']is False and t['domainReviewed']is False
   assert len(s['optionsJa'])==len(t['options'])==len(t['reasons'])
   if id in out:assert out[id]==t
   out[id]=t
   for ja,tx in [(s['stemJa'],t['stem'])]+list(zip(s['optionsJa'],t['options']))+list(zip(s['optionReasonsJa'],t['reasons'])):
    assert isinstance(tx,str)and tx.strip()
    a=set(re.findall(r'\d+(?:\.\d+)?',ja));b=set(re.findall(r'\d+(?:\.\d+)?',tx))
    if a!=b:issues.append({'id':id,'sourceNumbers':sorted(a),'targetNumbers':sorted(b)})
    if re.search(r'[ぁ-ゖァ-ヺ一-龯ก-๙অ-৿]',tx):nonkm.append(id)
  if x.get('questions'):files.append({'path':str(f.relative_to(P)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'questions':len(x['questions'])})
 counts[sp]=len(out)
report={'locale':'km','counts':counts,'sourceBindingsFieldOptionReasonMetadataChecks':'PASS','numericDifferences':issues,'foreignJapaneseThaiBanglaFragments':nonkm,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'files':files}
(P/'mock-completion-checkpoint-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items()if k!='files'},ensure_ascii=False))
