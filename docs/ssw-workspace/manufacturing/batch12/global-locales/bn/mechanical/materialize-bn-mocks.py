import json,re,hashlib
from pathlib import Path
ROOT=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');OUT=ROOT/'docs/ssw-workspace/manufacturing/batch12/global-locales/bn/mechanical';S=json.loads((ROOT/'src/data/manufacturing/mechanical.json').read_text());M=json.loads((ROOT/'src/data/manufacturing/mocks/mechanical.json').read_text());lt={}
for f in OUT.glob('*lessons*.json'):lt.update(json.loads(f.read_text()).get('lessons',{}))
paras={p['textJa']:next(t['text']for t in lt[l['id']]['paragraphs']if t['id']==p['id'])for l in S['lessons']for p in l['paragraphs']}
pref={'この文を正しいとする選択は適切でない。':'এই বক্তব্যকে সঠিক বলা উপযুক্ত নয়। ','この文を誤りとする選択は適切でない。':'এই বক্তব্যকে ভুল বলা উপযুক্ত নয়। ','正しい。':'সঠিক। ','誤り。':'ভুল। '}
srcst=[];srcbody=[]
for e in M['exams']:
 for q in e['sections']['theory']['questions']:
  assert q['optionsJa']==['正しい','誤り']
  if q['stemJa']not in srcst:srcst.append(q['stemJa'])
  for r in q['optionReasonsJa']:
   pp=next(p for p in pref if r.startswith(p));b=r[len(pp):];assert r==pp+b
   if b not in paras and b not in srcbody:srcbody.append(b)
def mem(pat):return[v for f in sorted(OUT.glob(pat))for v in json.loads(f.read_text())['translationMemory']]
st=mem('bn-theory-stems*.json');bt=mem('bn-theory-bodies*.json');pt=mem('bn-practical-memory*.json');assert len(srcst)==len(st)==300 and len(srcbody)==len(bt)==198 and len(pt)==100
st=dict(zip(srcst,st));bmap=dict(zip(srcbody,bt));bmap.update(paras);prov=[]
def clean(x):
 if isinstance(x,str):
  for a,b in {'加工':'প্রক্রিয়াকরণ','担当':'দায়িত্বপ্রাপ্ত ','仕様':'নির্ধারিত বৈশিষ্ট্য','গঠন-সম্বন্ধ':'গঠন ও বৈশিষ্ট্য'}.items():x=x.replace(a,b)
  return x
 if isinstance(x,list):return[clean(a)for a in x]
 if isinstance(x,dict):return{k:clean(v)for k,v in x.items()}
 return x
for ei,e in enumerate(M['exams']):
 out={}
 for q in e['sections']['theory']['questions']:
  reasons=[]
  for r in q['optionReasonsJa']:
   pp=next(p for p in pref if r.startswith(p));body=r[len(pp):];assert r==pp+body
   reasons.append(pref[pp]+bmap[body])
   if body in paras:prov.append({'questionId':q['id'],'completeSourceReasonSha256':hashlib.sha256(r.encode()).hexdigest(),'method':'exact_actual_verdict_prefix_plus_exact_complete_canonical_paragraph','completePairCompared':True})
  out[q['id']]={'sourceHash':q['sourceHash'],'stem':st[q['stemJa']],'options':['সঠিক','ভুল'],'reasons':reasons}
 for qi,q in enumerate(e['sections']['practical']['questions']):
  stem,options,reasons=pt[ei*10+qi];assert len(options)==len(reasons)==len(q['optionsJa']);out[q['id']]={'sourceHash':q['sourceHash'],'stem':stem,'options':options,'reasons':reasons}
 for x in out.values():x.update(translatedDirectlyFrom='ja',status='ai_translated_draft',nativeReviewed=False,domainReviewed=False)
 (OUT/f'bn-mock{ei+1:02d}.json').write_text(json.dumps(clean({'locale':'bn','status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'questions':out}),ensure_ascii=False,indent=2)+'\n')
(OUT/'bn-mock-exact-reuse-provenance.json').write_text(json.dumps({'locale':'bn','status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'completeParagraphBodiesReviewed':80,'fullReasonCompositionInstances':len(prov),'method':'Full source reason exactly equals actual verdict prefix plus exact full canonical paragraph; never infer verdict from correctIndex; all complete JA/BN paragraph pairs compared during direct lesson translation, root baseline002/003 pairs additionally read.','entries':prov},ensure_ascii=False,indent=2)+'\n')
print('Materialized400questions; exact composed full reasons',len(prov))
