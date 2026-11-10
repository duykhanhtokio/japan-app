import json, pathlib, hashlib, collections
base=pathlib.Path(__file__).resolve().parents[1]; out=pathlib.Path(__file__).resolve().parent
results=[]
for loc in ['my','th','km','tl']:
 inp=base/'language'/'term-review-inputs'/f'{loc}.json'; data=json.loads(inp.read_text()); receipt=json.loads((out/f'{loc}-review.json').read_text())
 assert receipt['inputSha256']==hashlib.sha256(inp.read_bytes()).hexdigest()
 assert len(receipt['records'])==len(data['records'])==1077
 count=collections.Counter()
 for original,r in zip(data['records'],receipt['records']):
  assert all(r[k]==v for k,v in original.items())
  assert hashlib.sha256(r['target'].encode()).hexdigest()==r['targetSha256']
  assert r['nativeReviewed'] is False and r['domainExpertReviewed'] is False
  assert r['decision'] in ['ai_semantic_match_no_change','pending_unread']
  if r['decision']=='ai_semantic_match_no_change':
   assert r['before']==r['after']==r['target']
   assert len(r['contextNote'])>15 and 'not native' in r['reviewScope']
  else: assert r['before'] is None and r['after'] is None
  count[r['decision']]+=1
 assert receipt['aiSemanticReviewed']==count['ai_semantic_match_no_change']
 assert receipt['pendingUnread']==count['pending_unread']
 results.append({'locale':loc,'totalSlots':1077,'aiSemanticReviewed':receipt['aiSemanticReviewed'],'pendingUnread':receipt['pendingUnread'],'receiptSha256':hashlib.sha256((out/f'{loc}-review.json').read_bytes()).hexdigest(),'reviewedInputIndexRange':[0,receipt['aiSemanticReviewed']-1],'targetEdits':0})
report={'status':'PASS_receipt_integrity_not_native_acceptance','locales':results,'aiSemanticReviewedTotal':sum(x['aiSemanticReviewed'] for x in results),'pendingUnreadTotal':sum(x['pendingUnread'] for x in results),'nativeAcceptance':False,'domainExpertAcceptance':False,'handoff':{'my':'Remaining assigned to terminology-my-th lane','th':'Remaining assigned to terminology-my-th lane','km':'Remaining assigned to terminology-km lane','tl':'1077/1077 completed here'}}
(out/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
