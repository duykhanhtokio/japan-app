from pathlib import Path
import json,re,hashlib
P=Path(__file__).resolve().parent;R=P.parents[6]
s=json.load(open(R/'src/data/manufacturing/mechanical.json'));ls={l['id']:l for l in s['lessons']};qs={q['id']:q for c in s['checks'] for q in c['questions']};ms={q['id']:q for e in json.load(open(R/'src/data/manufacturing/mocks/mechanical.json'))['exams'] for sec in e['sections'].values() for q in sec['questions']}
lt={};qt={};files=[]
for pattern,key,out in [('root-tl-lessons*.json','lessons',lt),('root-tl-weekly*.json','questions',qt)]:
 for f in sorted(P.glob(pattern)):
  files.append(f)
  for k,v in json.load(open(f))[key].items():assert k not in out;out[k]=v
f=P/'root-tl-mocks.json';files.append(f);mt=json.load(open(f))['questions'];assert set(lt)==set(ls) and set(qt)==set(qs) and set(mt)==set(ms)
fields=[]
def metadata(t,j):
 assert t['sourceHash']==j['sourceHash'] and t['translatedDirectlyFrom']=='ja' and t['nativeReviewed'] is False and t['domainReviewed'] is False
for k,t in lt.items():
 j=ls[k];metadata(t,j);assert [x['id'] for x in j['paragraphs']]==[x['id'] for x in t['paragraphs']];assert len(j['terms'])==len(t['terms']);assert len(j['safetyJa'])==len(t['safety'])
 fields.extend((k,a,j[a+'Ja'],t[a]) for a in ['title','objective','activity','summary'])
 for a,b in zip(j['paragraphs'],t['paragraphs']):fields.extend([(k,a['id']+'.title',a['titleJa'],b['title']),(k,a['id']+'.text',a['textJa'],b['text'])])
 for i,(a,b) in enumerate(zip(j['terms'],t['terms'])):assert a['ja']==b['ja'] and a['reading']==b['reading'];fields.append((k,'term'+str(i),a['meaningJa'],b['meaning']))
 for i,(a,b) in enumerate(zip(j['safetyJa'],t['safety'])):fields.append((k,'safety'+str(i),a,b))
for sources,targets in [(qs,qt),(ms,mt)]:
 for k,t in targets.items():
  j=sources[k];metadata(t,j);assert len(t['options'])==len(j['optionsJa'])==len(t['reasons'])
  fields.append((k,'stem',j['stemJa'],t['stem']))
  for i,(a,b) in enumerate(zip(j['optionsJa'],t['options'])):fields.append((k,'option'+str(i),a,b))
  for i,(a,b) in enumerate(zip(j['optionReasonsJa'],t['reasons'])):fields.append((k,'reason'+str(i),a,b))
issues=[];numissues=[]
def nums(x):return set(re.findall(r'\d+(?:\.\d+)?',x))
for k,field,ja,tl in fields:
 if not tl.strip():issues.append([k,field,'empty'])
 if re.search(r'[\u3040-\u30ff\u3400-\u9fff\u0900-\u109f\u1780-\u17ff]',tl):issues.append([k,field,'foreign prose'])
 if nums(ja)!=nums(tl):numissues.append([k,field,ja,tl])
assert not issues,issues
assert len(numissues)==1,numissues
q,f,j,t=numissues[0];assert q=='mfg1-mechanical-mock-03-practical-02' and f=='reason3' and '100万倍' in j and 'isang milyong beses' in t and 450/0.00045==1000000
report={'status':'PASS','lessons':len(lt),'weeklyQuestions':len(qt),'mockQuestions':len(mt),'targetTextFields':len(fields),'bindingStructureMetadataForeignIssues':issues,'numericEquivalentException':{'id':q,'field':f,'Japanese':'100万倍','Tagalog':'isang milyong beses','value':1000000,'arithmeticProof':'450 / 0.00045 = 1000000','scope':'Equivalent numeral expression manually reviewed; all other field number-token sets identical.'},'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'scope':'Source-bound full AI drafts and structural/numeric checks, not native or domain certification. All70 reused sentence pairs manually compared by root before reuse.','payloads':[{'path':x.name,'sha256':hashlib.sha256(x.read_bytes()).hexdigest()} for x in files]}
(P/'root-tl-mechanical-completion-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='payloads'},ensure_ascii=False))
