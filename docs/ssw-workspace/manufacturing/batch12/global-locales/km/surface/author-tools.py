import json
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[6];EX=json.loads((R/'src/data/manufacturing/mocks/surface.json').read_text())['exams']
def save(exam,theory,practical):
 e=EX[exam-1];M={};assert len(theory)==30 and len(practical)==10
 for q,(stem,body) in zip(e['sections']['theory']['questions'],theory):
  assert len({a.split('。',1)[1] for a in q['optionReasonsJa']})==1
  M[q['stemJa']]=stem;M[q['optionReasonsJa'][0].split('。',1)[1]]=body
 for q,(stem,options,reasons) in zip(e['sections']['practical']['questions'],practical):
  assert len(options)==len(q['optionsJa']) and len(reasons)==len(q['optionReasonsJa'])
  for a,b in zip([q['stemJa']]+q['optionsJa']+q['optionReasonsJa'],[stem]+options+reasons):M[a]=b
 (P/f'mock-authored-{exam:02}.json').write_text(json.dumps({'locale':'km','exactJaTranslations':M,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False},ensure_ascii=False,indent=2)+'\n');print(exam,len(M))
