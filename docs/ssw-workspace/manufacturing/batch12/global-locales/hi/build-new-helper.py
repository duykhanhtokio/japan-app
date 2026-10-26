import json
R=P.resolve().parents[6];J=json.load(open(R/'src/data/manufacturing'/f'{TRACK}.json'))['lessons'];r={}
for l,z in zip(J[START-1:END],D):
 title,obj,pars,terms,extra,safety,summary=z
 r[l['id']]={'sourceHash':l['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','title':title,'objective':obj,'paragraphs':[{'id':p['id'],'title':h,'text':t} for p,(h,t) in zip(l['paragraphs'],pars)],'terms':[{'ja':s['ja'],'reading':s['reading'],'meaning':t} for s,t in zip(l['terms'],terms)],'activity':'30 मिनट का लक्ष्य: पाठ10 मिनट, उदाहरण8 मिनट, लेखन9 मिनट और समीक्षा3 मिनट।\n'+extra,'safety':safety,'summary':summary}
(P/f'lessons-{START:03}-{END:03}.json').write_text(json.dumps({'locale':'hi','lessons':r},ensure_ascii=False,indent=2)+'\n')
