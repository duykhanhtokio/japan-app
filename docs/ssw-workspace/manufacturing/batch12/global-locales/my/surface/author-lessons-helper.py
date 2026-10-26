from pathlib import Path
import json
R=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');P=Path(__file__).parent
S={int(l['id'][-3:]):l for l in json.load(open(R/'src/data/manufacturing/surface.json'))['lessons']}
def write(D,name):
 out={}
 for n,t in D.items():
  s=S[n];title,obj,paras,terms,act,safety,summary=t
  assert len(paras)==len(s['paragraphs'])and len(terms)==len(s['terms'])and len(safety)==len(s['safetyJa'])
  out[s['id']]={'sourceHash':s['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','title':title,'objective':obj,'paragraphs':[{'id':x['id'],'title':a,'text':b}for x,(a,b)in zip(s['paragraphs'],paras)],'terms':[{'ja':x['ja'],'reading':x['reading'],'meaning':a}for x,a in zip(s['terms'],terms)],'activity':act,'safety':safety,'summary':summary}
 (P/name).write_text(json.dumps({'locale':'my','lessons':out,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False},ensure_ascii=False,indent=2)+'\n');print('Authored Myanmar surface',sorted(D))
