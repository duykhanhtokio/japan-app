import json,pathlib
R=P.resolve().parents[6];J=json.load(open(R/'src/data/manufacturing'/f'{TRACK}.json'))['lessons'];r={}
for l,z in zip(J[START-1:END],D):
 title,obj,texts,terms,summary=z;heads=['विषय और भूमिका','सिद्धांत और अंतर','रिकॉर्ड और पुष्टि','पर्यावरण लक्ष्य में भी चक्र']
 r[l['id']]={'sourceHash':l['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','title':title,'objective':obj,'paragraphs':[{'id':p['id'],'title':h,'text':t} for p,h,t in zip(l['paragraphs'],heads,texts)],'terms':[{'ja':s['ja'],'reading':s['reading'],'meaning':t} for s,t in zip(l['terms'],terms)],'activity':'4 मिनट: उद्देश्य व शब्द।\n10 मिनट: पाठ और कागज चित्र से विषय/सिद्धांत।\n7 मिनट: तीन शब्द अपने शब्दों में।\n7 मिनट: दो स्थितियाँ कागज पर मिलाकर शर्त व संपर्क लिखें।\n2 मिनट: सार देखें।','safety':['कागज पर तुलना करें; वास्तविक संचालन, समायोजन या रसायन प्रयोग निर्धारित प्रशिक्षण और प्रक्रिया से करें।'],'summary':summary}
(P/f'lessons-{START:03}-{END:03}.json').write_text(json.dumps({'locale':'hi','lessons':r},ensure_ascii=False,indent=2)+'\n')
