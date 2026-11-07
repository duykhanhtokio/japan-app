import json,hashlib
from pathlib import Path
B=Path(__file__).parent;D=B.parent.parent;L={};Q={}
for s in ['mechanical','electrical','surface']:
 for p in [Path(f'src/data/manufacturing/{s}.json'),D/f'batch12/{s}/new-content.json']:
  x=json.loads(p.read_text());L.update({l['id']:l for l in x['lessons']});Q.update({q['id']:q for c in x['checks'] for q in c['questions']})
for loc in ['zh-CN','zh-TW']:
 lessons=json.loads((B/f'{loc}.json').read_text())['lessons'];questions=json.loads((B/f'questions.{loc}.json').read_text())['questions'];captions=json.loads((B/f'captions.{loc}.json').read_text())['captions'];entries=[]
 assert set(lessons)==set(L) and set(questions)==set(Q)
 for k,t in lessons.items():
  j=L[k];assert t['sourceHash']==j['sourceHash'],k
  assert [p['id'] for p in t['paragraphs']]==[p['id'] for p in j['paragraphs']],k
  assert [(p['ja'],p['reading']) for p in t['terms']]==[(p['ja'],p['reading']) for p in j['terms']],k
  assert len(t['safety'])==len(j['safetyJa']) and all(t[f] for f in ['title','objective','activity','summary']),k
  assert all(p['title'] and p['text'] for p in t['paragraphs']),k
  assert not t['nativeReviewed'] and not t['domainReviewed'] and t['status']=='ai_translated_draft',k
  entries.append({'kind':'lesson','id':k,'sourceHash':t['sourceHash'],'translationSha256':hashlib.sha256(json.dumps(t,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()})
 for k,t in questions.items():
  j=Q[k];assert t['sourceHash']==j['sourceHash'],k
  assert len(t['options'])==4 and len(t['reasons'])==4 and len(set(t['options']))==4 and all(t['options']) and all(t['reasons']),k
  assert not t['nativeReviewed'] and not t['domainReviewed'] and t['status']=='ai_translated_draft',k
  entries.append({'kind':'question','id':k,'sourceHash':t['sourceHash'],'translationSha256':hashlib.sha256(json.dumps(t,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()})
 report={'locale':loc,'status':'PASS_complete_current_authored_snapshot_not_full_curriculum','lessons':len(lessons),'questions':len(questions),'captions':len(captions),'nativeReviewed':False,'domainReviewed':False,'independentSemanticReviewComplete':False,'workflow':'Existing batch12 drafts assembled. New surface043-070/electrical043-084 translated against Japanese and compared field by field. Traditional orthography prepared using OpenCC s2twp and compared against Japanese; Japanese term labels/readings restored, Taiwan semiconductor term電洞 and passive-component term被動元件 adapted. Prior133lesson/228question fields received schema/hash/identity checks; not a new complete independent semantic review. Mechanical new21lessons/36questions use existing batch12 drafts, not claimed newly authored by this reviewer.','newSurfaceSemanticReview':{'lessons':28,'questions':48,'paragraphs':112,'termMeanings':112,'safetyItems':56,'optionReasons':192},'newElectricalSemanticReview':{'lessons':42,'questions':72,'paragraphs':126,'termMeanings':168,'safetyItems':42,'optionReasons':288},'findings':['Final electrical043 translates20/6 only as app equal-weight practice, not official undisclosed scoring or guaranteed correct counts.','Retained reaction-specific normality and sulfuric-acid factor2; did not propagate source contradiction.','Preserved50Hz cycles rather than polarity-reversal count.','Kept straight-conductor versus coil finger mapping and Fleming left/right mapping.','Kept正塩 classification distinct from neutral solution.','Kept non-destructive sample classification distinct from equipment/radiation safety.','Retained pinhole-through-to-base versus pit-not-through distinction.','No legal compliance certification inferred from RoHS/REACH/PSE summaries.','Preserved derivative-unit and squared-area conversions, semiconductor depletion fixed-charge distinction, SSR leakage, timer timing, motor synchronous-versus-rotor speed, negative-resist development-versus-copper-etch distinction.'],'missingLessons':[],'missingQuestions':[],'files':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in [B/f'{loc}.json',B/f'questions.{loc}.json',B/f'captions.{loc}.json']},'entries':entries}
 (B/f'assembly.{loc}.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(loc,len(lessons),len(questions),len(captions),'all bindings PASS')
