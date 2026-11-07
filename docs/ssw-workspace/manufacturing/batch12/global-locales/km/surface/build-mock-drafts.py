import json,re,hashlib,collections
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[6];CACHE=json.loads((P.parent/'exact-ja-translation-memory.json').read_text())['entries'];MEM={a:b['translation'] for a,b in CACHE.items()};proof=[]
PREFIX={'正しいと判断する。':'វិនិច្ឆ័យថាត្រូវ។ ','誤りとするのは不適切。':'ការចាត់ថាខុសមិនសមស្រប។ ','正しいとするのは誤り。':'ការចាត់ថាត្រូវគឺខុស។ ','誤りと判断する。':'វិនិច្ឆ័យថាខុស។ '}
MEM.update({'正しい':'ត្រូវ','誤り':'ខុស'})
for f in sorted(P.glob('mock-authored-*.json')):
 for a,b in json.loads(f.read_text())['exactJaTranslations'].items():MEM[a]=b

def translate(a):
 if a in MEM:return MEM[a]
 for pre,t in PREFIX.items():
  if a.startswith(pre) and a[len(pre):] in MEM:
   proof.append({'sourceSha256':hashlib.sha256(a.encode()).hexdigest(),'sourcePrefix':pre,'completeBodyMatched':True});return t+MEM[a[len(pre):]]
 if re.fullmatch(r'[0-9a-zA-ZΩ℃μ²³%＋－−+*/÷×=＝. :〜～°±φRSt□()\-]+',a):return a
 return None
SRC=json.loads((R/'src/data/manufacturing/mocks/surface.json').read_text());out={};missing={};issues=[];fields=0
for e in SRC['exams']:
 for sec in e['sections'].values():
  for q in sec['questions']:
   ja=[q['stemJa']]+q['optionsJa']+q['optionReasonsJa'];tr=[translate(x) for x in ja]
   for a,b in zip(ja,tr):
    if b is None:missing.setdefault(a,[]).append(q['id'])
   if all(tr):
    out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':tr[0],'options':tr[1:1+len(q['optionsJa'])],'reasons':tr[1+len(q['optionsJa']):]}
    for a,b in zip(ja,tr):
     fields+=1
     if re.search('[\u3040-\u30ff\u3400-\u9fff]',b):issues.append([q['id'],'foreign',b])
     na=set(re.findall(r'\d+(?:\.\d+)?',a));nb=set(re.findall(r'\d+(?:\.\d+)?',b))
     if na!=nb:issues.append([q['id'],'numeric',sorted(na-nb),sorted(nb-na)])
(P/'mocks.json').write_text(json.dumps({'locale':'km','questions':out},ensure_ascii=False,indent=2)+'\n');(P/'mock-missing-source-qa.json').write_text(json.dumps(missing,ensure_ascii=False,indent=2)+'\n');report={'locale':'km','specialty':'surface','mockQuestions':len(out),'targetFields':fields,'issues':issues,'actualPrefixCompleteBodyCompositions':proof,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False};(P/'mock-structural-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print('complete',len(out),'uniqueMissing',len(missing),'issues',issues)
