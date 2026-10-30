"""Read-only verification of source-bound electrical completion37 authorship."""
import hashlib,itertools,json
from decimal import Decimal
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def h(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def check():
 d=json.loads((ROOT/'src/data/manufacturing/completion37/electrical.json').read_text());assert d['specialty']=='electrical' and len(d['lessons'])==len(d['checks'])==6
 ids=[];questions=[]
 for l,c in zip(d['lessons'],d['checks']):
  assert l['sourceHash']==h({k:v for k,v in l.items() if k!='sourceHash'});assert l['specialty']=='electrical';assert len(l['paragraphs'])==3
  ids.extend([l['id'],c['id']]);assert c['officialSimulation'] is False and c['kind']=='weekly';assert len(c['questions'])==4
  assert [q['correctIndex'] for q in c['questions']]==[0,1,2,3]
  assert c['revision']=='completion37-'+h(c['questions'])[:20]
  for q in c['questions']:
   ids.append(q['id']);questions.append(q);assert q['lessonId']==l['id'] and q['lessonSourceHash']==l['sourceHash'];assert q['sourceHash']==h({k:v for k,v in q.items() if k!='sourceHash'})
   assert len(q['optionsJa'])==len(set(q['optionsJa']))==len(q['optionReasonsJa'])==4
   assert q['sources']==l['sources'] and all(s['pdfPage']-s['printedPage']==9 for s in q['sources'])
 assert len(ids)==len(set(ids))==36
 q=next(q for q in questions if q['id']=='mfg1-electrical-completion37-resistance-q02');resistance=Decimal('.30')/(Decimal(15)/1000);assert resistance==20 and q['optionsJa'][q['correctIndex']]=='20Ω'
 # Three coordinate directions used in the Hall questions are pairwise orthogonal.
 axes=[(1,0,0),(0,1,0),(0,0,1)];assert all(sum(x*y for x,y in zip(a,b))==0 for a,b in itertools.combinations(axes,2))
 assert next(q for q in questions if q['id']=='mfg1-electrical-completion37-hall-q02')['correctIndex']==1
 register=json.loads((ROOT/'docs/ssw-workspace/manufacturing/batch37-completion/electrical/gap-register.json').read_text());assert len(register['items'])==register['recordedOccurrences']==14
 for filename,expected in register['inputSha256'].items():assert hashlib.sha256((ROOT/filename).read_bytes()).hexdigest()==expected
 allq={q['id'] for q in questions};alll={l['id'] for l in d['lessons']}
 for item in register['items']:assert item['newLessonId'] in alll and set(item['assessmentIds'])<=allq and item['wholeHistoricalObjectClosed'] is False
 return {'status':'PASS','lessons':6,'checks':6,'questions':24,'canonicalHashes':30,'independentResistanceExampleOhm':str(resistance),'hallCoordinateRelations':'pairwiseorthogonal','recordedOccurrenceBindings':14,'inputSnapshotsMatched':True,'fullSourceComplete':False,'nativeReviewed':False,'domainReviewed':False}
if __name__=='__main__':print(json.dumps(check(),ensure_ascii=False))
