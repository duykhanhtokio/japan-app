"""Read-only arithmetic/ruby verification of four staged original Boolean items."""
from pathlib import Path
import hashlib,itertools,json,re
ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'docs/ssw-workspace/manufacturing/batch36-continuation/boolean-practice'
def digest(value):return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def check():
 d=json.loads((BASE/'practice.ja.json').read_text());r=json.loads((BASE/'furigana.ja.json').read_text())['questions'];qs=d['questions']
 assert d['status']=='ai_authored_draft_not_integrated' and d['appIntegrationReady'] is False
 assert len(qs)==4 and [q['correctIndex'] for q in qs]==[0,1,2,3]
 for q in qs:
  assert q['sourceHash']==digest({k:v for k,v in q.items() if k!='sourceHash'})
  assert len(q['optionsJa'])==len(set(q['optionsJa']))==len(q['optionReasonsJa'])==4
  ruby=r[q['id']];assert ruby['sourceHash']==q['sourceHash']
  for text,parts in [(q['stemJa'],ruby['stem']),*zip(q['optionsJa'],ruby['options'])]:
   assert ''.join(p['text'] for p in parts)==text
   assert all(p.get('reading') and re.fullmatch(r'[ぁ-ゖー]+',p['reading']) for p in parts if re.search(r'[一-龯]',p['text']))
 rows=list(itertools.product((0,1),repeat=3));left=lambda a,b,c:a|(b&c)
 candidates=[lambda a,b,c:(a|b)&(a|c),lambda a,b,c:(a|b)|(a|c),lambda a,b,c:(a|b)&c,lambda a,b,c:a&(b|c)]
 equivalent=[all(left(*row)==f(*row) for row in rows) for f in candidates];assert equivalent==[True,False,False,False]
 a,b,c=0,1,1;pair=(left(a,b,c),candidates[0](a,b,c));assert pair==(1,1)
 pairs=[tuple(map(int,re.findall(r'[01]',option))) for option in qs[1]['optionsJa']];assert [i for i,x in enumerate(pairs) if x==pair]==[qs[1]['correctIndex']]
 assignments=[tuple(map(int,re.findall(r'[01]',option))) for option in qs[2]['optionsJa']]
 counters=[left(*row)!=candidates[3](*row) for row in assignments];assert counters==[False,False,True,False]
 truth=[{'a':a,'b':b,'c':c,'left':left(a,b,c),'right':candidates[0](a,b,c)} for a,b,c in rows]
 assert all(row['left']==row['right']==(row['b']&row['c'] if row['a']==0 else 1) for row in truth)
 for flag in ('nativeReviewed','domainReviewed','humanReviewed','independentReviewed','appIntegrationReady','releaseReady'):assert d[flag] is False
 return {'status':'PASS','questions':4,'answerPositions':[0,1,2,3],'truthRows':truth,'singleCorrectFormulaOption':equivalent,'counterexampleOptions':counters,'rubyTextExactlyAligned':True,'allKanjiReadingsPresent':True,'runtimeIntegrated':False,'nativeReviewed':False,'domainReviewed':False}
if __name__=='__main__':print(json.dumps(check(),ensure_ascii=False))
