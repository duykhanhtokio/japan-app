#!/usr/bin/env python3
"""Reconcile only proven image-metadata changes; never rebind changed care content."""
import json,hashlib,pathlib,argparse
R=pathlib.Path(__file__).resolve().parents[2]
def sha(b):return hashlib.sha256(b).hexdigest()
def changes(a,b,p=''):
 if type(a)!=type(b):return [(p,a,b)]
 if isinstance(a,dict):
  if a.keys()!=b.keys():return [(p,a,b)]
  return sum((changes(a[k],b[k],p+'/'+k.replace('~','~0').replace('/','~1')) for k in a),[])
 if isinstance(a,list):
  if len(a)!=len(b):return [(p,a,b)]
  return sum((changes(x,y,p+'/'+str(i)) for i,(x,y) in enumerate(zip(a,b))),[])
 return [] if a==b else [(p,a,b)]
def run(base,apply):
 receipt={'schemaVersion':1,'baselineCommit':'bb0b746e48343c168a24e23629c2c90525d3497a','review':'self_checked_ai_metadata_only','domainReviewed':False,'nativeReviewed':False,'weeks':[]}
 for week,old in [(3,'21af02f1e07c34c3047bddd4990977affc0e103a58e7036df3056c99c9e884a7'),(4,'ab4db43ae60bb977846a2c008fb071fa7cd9ddf01d36eededa79ce9d3810e12e')]:
  name=f'week-{week:02}.json';p=R/'src/data/kaigo/japanese-master'/name;q=p.parent/'questions'/name
  raw=(base/name).read_bytes().rstrip()+b'\n';assert sha(raw)==old,'Baseline source hash mismatch'
  before=json.loads(raw);after=json.loads(p.read_bytes());diff=changes(before,after)
  if week==3:
   expected={f'/sections/{s}/figureCaptionsJa/{f}' for s,f in [('kaigo-depth-05','pressure-contact-map'),('kaigo-depth-04','posture-support-map'),('kaigo-depth-11','wheelchair-function-map')]}
   assert {v[0] for v in diff}==expected
   assert all(a==b+'図内の旧ベトナム語ラベルは日本語化の確認待ちです。' for _,a,b in diff)
  else:assert diff==[('/sections/kaigo-depth-14/figureReviewStatus/posture-support-map','needs_japanese_embedded_label_replacement','ai_generated_japanese_labels_visually_checked_domain_review_pending')]
  bank=json.loads(q.read_bytes());baseline=json.loads((base/('questions-'+name)).read_bytes());new=sha(p.read_bytes())
  assert bank['sourceJapaneseSha256'] in (old,new)
  comparable=dict(bank);comparable['sourceJapaneseSha256']=old;assert comparable==baseline,'Question bank changed'
  receipt['weeks'].append({'week':week,'sourcePath':str(p.relative_to(R)),'questionPath':str(q.relative_to(R)),'oldSourceSha256':old,'newSourceSha256':new,'questionCount':len(bank['questions']),'questionPayloadSha256':sha(json.dumps(bank['questions'],ensure_ascii=False,separators=(',',':')).encode()),'changes':[{'jsonPointer':a,'before':b,'after':c} for a,b,c in diff],'careParagraphsUnchanged':True,'questionObjectsUnchanged':True})
  if apply:bank['sourceJapaneseSha256']=new;q.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
 if apply:(R/'docs/ssw-workspace/source-coverage-v2/kaigo-week03-week04-binding-review.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
 return receipt
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--baseline-dir',type=pathlib.Path,required=True);p.add_argument('--apply',action='store_true');a=p.parse_args();r=run(a.baseline_dir,a.apply);print(json.dumps({'weeks':[x['week'] for x in r['weeks']],'questionsUnchanged':sum(x['questionCount'] for x in r['weeks']),'applied':a.apply}))
