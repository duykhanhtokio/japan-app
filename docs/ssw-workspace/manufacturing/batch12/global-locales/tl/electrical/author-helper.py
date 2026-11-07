from pathlib import Path
import json
OUT=Path(__file__).parent;ROOT=OUT.parents[6]
SOURCE={x['id']:x for x in json.loads((ROOT/'src/data/manufacturing/electrical.json').read_text())['lessons']}
def lesson(n,title,objective,paragraphs,terms,activity,safety,summary):
 s=SOURCE[f'mfg1-electrical-l{n:03}'];assert len(paragraphs)==len(s['paragraphs']) and len(terms)==len(s['terms']) and len(safety)==len(s['safetyJa'])
 t={'sourceHash':s['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','title':title,'objective':objective,'paragraphs':[{'id':p['id'],'title':a,'text':b} for p,(a,b) in zip(s['paragraphs'],paragraphs)],'terms':[{'ja':p['ja'],'reading':p['reading'],'meaning':v} for p,v in zip(s['terms'],terms)],'activity':activity,'safety':safety,'summary':summary}
 d={'locale':'tl','status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'lessons':{s['id']:t}}
 (OUT/f'lesson-{n:03}.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
