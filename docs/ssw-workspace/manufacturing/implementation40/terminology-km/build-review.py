import json,pathlib,hashlib
out=pathlib.Path(__file__).resolve().parent;base=out.parent
source=base/'language/term-review-inputs/km.json';inp=json.loads(source.read_text());prior=base/'terminology-southeast/km-review.json';old=json.loads(prior.read_text());records=inp['records'];reviews=[]
for i,r in enumerate(records):
 p=old['records'][i]
 if i<280:
  assert p['key']==r['key'] and p['targetSha256']==r['targetSha256'] and p['decision']!='pending_unread'
  reviews.append(dict(p,index=i,locale='km',provenance={'type':'inherited_semantic_comparison','file':str(prior.relative_to(base)),'fileSha256':hashlib.sha256(prior.read_bytes()).hexdigest(),'reviewerLane':'surface_coverage','handoff':'2026-10-31 frozen indices0..279 actually read; new QA lane reviews remaining'}))
 else: reviews.append(dict(r,index=i,locale='km',decision='pending_unread',contextNote='Not yet semantically compared by current reviewer',nativeReviewed=False,domainExpertReviewed=False))
for f in sorted(out.glob('read-*.json')):
 for p in json.loads(f.read_text()):
  i=p['index'];r=records[i];assert i>=280 and p['contextNote'].strip();assert p['key']==r['key'] and p['targetSha256']==r['targetSha256'] and p['before']==r['target'] and p['locale']=='km'; reviews[i].update(p,reviewScope='AI JP-definition vs Khmer text semantic comparison; not native/domain acceptance',provenance={'type':'new_semantic_comparison','file':f.name})
counts={}
for r in reviews:counts[r['decision']]=counts.get(r['decision'],0)+1
result={'schemaVersion':1,'locale':'km','inputSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'totalSlots':len(records),'inheritedReviewedSlots':280,'newlyReadSlots':sum(r['decision']!='pending_unread' for r in reviews[280:]),'pendingUnread':counts.get('pending_unread',0),'counts':counts,'reviewLimit':'AI contextual comparison; no human/native/domain confirmation','reviews':reviews}
(out/'review.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print({k:v for k,v in result.items() if k!='reviews'})
