from pathlib import Path
import json,hashlib,re
P=Path(__file__).parent;R=P.parents[5];MEM=json.loads((P/'exact-ja-translation-memory.json').read_text());E=MEM['entries'];conflicts=[]
def add(s,t,c):
 if not isinstance(s,str) or not isinstance(t,str) or not t:return
 if s in E and E[s]['translation']!=t:
  conflicts.append(c);return
 if s not in E:E[s]={'translation':t,'contexts':[c]}
 elif c not in E[s]['contexts']:E[s]['contexts'].append(c)
counts={};lessons={};questions={}
for sp in ['mechanical','electrical','surface']:
 S=json.loads((R/f'src/data/manufacturing/{sp}.json').read_text());ls={l['id']:l for l in S['lessons']};qs={q['id']:q for c in S['checks'] for q in c['questions']};L={};Q={}
 for f in (P/sp).glob('*.json'):
  if 'qa' in f.name or 'checkpoint' in f.name:continue
  x=json.loads(f.read_text())
  if not isinstance(x,dict):continue
  for id,t in x.get('lessons',{}).items():
   if id not in ls:continue
   s=ls[id];assert s['sourceHash']==t['sourceHash'],(f,id)
   L[id]=t
   for sk,tk in [('titleJa','title'),('objectiveJa','objective'),('activityJa','activity'),('summaryJa','summary')]:add(s[sk],t[tk],id+':'+sk)
   assert len(s['paragraphs'])==len(t['paragraphs']);assert len(s['terms'])==len(t['terms']);assert len(s['safetyJa'])==len(t['safety'])
   for a,b in zip(s['paragraphs'],t['paragraphs']):
    assert a['id']==b['id'];add(a['titleJa'],b['title'],id+':paragraph-title');add(a['textJa'],b['text'],id+':paragraph-text')
   for a,b in zip(s['terms'],t['terms']):assert a['ja']==b['ja'];add(a['meaningJa'],b['meaning'],id+':term')
   for a,b in zip(s['safetyJa'],t['safety']):add(a,b,id+':safety')
  for id,t in x.get('questions',{}).items():
   if id not in qs:continue
   s=qs[id];assert s['sourceHash']==t['sourceHash'];Q[id]=t
   add(s['stemJa'],t['stem'],id+':stem')
   assert len(s['optionsJa'])==len(t['options']);rr=t.get('reasons',t.get('optionReasons'));assert len(s['optionReasonsJa'])==len(rr)
   for a,b in zip(s['optionsJa'],t['options']):add(a,b,id+':option')
   for a,b in zip(s['optionReasonsJa'],rr):add(a,b,id+':reason')
 counts[sp]={'lessons':len(L),'weekly':len(Q)};lessons.update(L);questions.update(Q)
MEM['policy']='ExactJapanese string matches only; reuse requires context suitability. No unseenfield translation by substitution.'
(P/'exact-ja-translation-memory.json').write_text(json.dumps(MEM,ensure_ascii=False,indent=2)+'\n')
(P/'completion-checkpoint-qa.json').write_text(json.dumps({'locale':'km','counts':counts,'exactJapaneseMemoryFields':len(E),'nativeReviewed':False,'domainReviewed':False,'independentLinguisticReview':False,'structuralSourceBindings':'PASS','alternateExactJapaneseWordingsNotOverwritten':len(conflicts)},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(counts));print('Exact-JA memory fields',len(E))
