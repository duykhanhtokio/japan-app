import json,pathlib
P=pathlib.Path(__file__).parent;R=P.resolve().parents[6]
def build(start,D):
 J=json.load(open(R/'src/data/manufacturing/surface.json'))['lessons'];out={}
 for l,z in zip(J[start-1:start-1+len(D)],D):
  title,obj,pars,terms,activity,safety,summary=z
  assert len(pars)==len(l['paragraphs']) and len(terms)==len(l['terms']) and len(safety)==len(l['safetyJa']),l['id']
  out[l['id']]={'sourceHash':l['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','title':title,'objective':obj,'paragraphs':[{'id':p['id'],'title':h,'text':t} for p,(h,t) in zip(l['paragraphs'],pars)],'terms':[{'ja':s['ja'],'reading':s['reading'],'meaning':t} for s,t in zip(l['terms'],terms)],'activity':activity,'safety':safety,'summary':summary}
 (P/f'lessons-{start:03}-{start+len(D)-1:03}.json').write_text(json.dumps({'locale':'tl','lessons':out},ensure_ascii=False,indent=2)+'\n')
