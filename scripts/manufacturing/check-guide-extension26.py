"""Read-only exact-layer, negative-fixture and zero-write failure checks."""
from pathlib import Path
from copy import deepcopy
from unittest.mock import patch
import json,runpy
ROOT=Path(__file__).resolve().parents[2]
M=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-guide-extension26.py'))
def validate():
 inputs=M['load_inputs']();build=M['compile_outputs'];enc=M['encoded'];sha=M['digest'];outputs=build(inputs);rejected=[]
 assert build(dict(reversed(list(inputs.items()))))==outputs
 assert M['preflight']()==outputs
 for p,raw in outputs.items():assert (ROOT/p).read_bytes()==raw,'Apply26first:'+p
 def reject(label,fn):
  try:fn()
  except (ValueError,AssertionError,KeyError):rejected.append(label)
  else:raise AssertionError('Invalid26fixtureaccepted:'+label)
 def mutate(label,path,fn,rebind=True):
  c=dict(inputs);v=json.loads(c[path]);fn(v)
  if path.endswith('-guide.json') and label!='source-stale-hash':v['sourceHash']=M['object_digest']({k:x for k,x in v.items() if k!='sourceHash'})
  c[path]=enc(v)
  if rebind:
   a=json.loads(c[M['APPROVAL']]);mapping='inputs' if path in a['inputs'] else 'evidenceSha256'
   if path in a[mapping]:a[mapping][path]=sha(c[path]);c[M['APPROVAL']]=enc(a)
  if rebind and path.endswith('-guide.json'):
   sr=json.loads(c[M['SREVIEW']]);tr=json.loads(c[M['TREVIEW']]);sr['guideFiles'][path]=tr['guideFiles'][path]=sha(c[path])
   oldid=json.loads(inputs[path])['id'];row=next(r for r in sr['guides'] if r['guideId']==oldid);row.update(guideSha256=M['object_digest'](v),sourceHash=v['sourceHash'])
   c[M['SREVIEW']]=enc(sr);c[M['TREVIEW']]=enc(tr)
  if rebind and path.endswith('-guide-translations.json'):
   tr=json.loads(c[M['TREVIEW']]);tr['translationFiles'][path]=sha(c[path])
   import re
   for locale,entries in v['locales'].items():
    for gid,target in entries.items():
     rows=[r for r in tr['items'] if r['guideId']==gid and r['locale']==locale]
     if not rows:continue
     row=rows[0];row['targetObjectSha256']=M['object_digest'](target)
     for binding in row['fieldBindings']:
      key=binding['targetField']
      if key.startswith('paragraphs['):
       ident,field=key[len('paragraphs['):].split('].');matches=[p for p in target['paragraphs'] if p['id']==ident]
       if matches:binding['targetTextSha256']=sha(matches[0][field].encode())
      elif key.startswith('terms['):
       idx=int(key.split('[')[1].split(']')[0]);binding['targetTextSha256']=sha(target['terms'][idx]['meaning'].encode())
      elif key.startswith('safety['):
       idx=int(key.split('[')[1].split(']')[0])
       if idx<len(target['safety']):binding['targetTextSha256']=sha(target['safety'][idx].encode())
      else:binding['targetTextSha256']=sha(target[key].encode())
   c[M['TREVIEW']]=enc(tr)
  if rebind:
   a=json.loads(c[M['APPROVAL']])
   for receipt in [M['SREVIEW'],M['TREVIEW']]:a['evidenceSha256'][receipt]=sha(c[receipt])
   c[M['APPROVAL']]=enc(a)
  reject(label,lambda:build(c))
 stage=M['STAGE'];g=stage+'mechanical-guide.json';t=stage+'mechanical-guide-translations.json'
 mutate('source-wrong-specialty',g,lambda d:d.__setitem__('specialty','surface'))
 mutate('source-stale-hash',g,lambda d:d.__setitem__('sourceHash','bad'))
 mutate('source-unknown-id',g,lambda d:d.__setitem__('id','mfg1-mechanical-source-guide-unknown'))
 mutate('source-certified',g,lambda d:d.__setitem__('nativeReviewed',True))
 mutate('source-bad-page',g,lambda d:d['sources'][0].__setitem__('pdfPage',98))
 mutate('source-bad-knowledge',g,lambda d:d.__setitem__('knowledgeIds',['unknown']))
 mutate('target-missing-locale',t,lambda d:d['locales'].pop('vi'))
 mutate('target-extra-locale',t,lambda d:d['locales'].__setitem__('xx',{}))
 identifier=json.loads(inputs[g])['id']
 def target(d):return d['locales']['en'][identifier]
 for label,fn in [
 ('stale-source',lambda d:target(d).__setitem__('sourceHash','bad')),
 ('missing-safety',lambda d:target(d)['safety'].clear()),
 ('paragraph-reverse',lambda d:target(d)['paragraphs'].reverse()),
 ('empty-title',lambda d:target(d).__setitem__('title','')),
 ('glossary-drift',lambda d:target(d)['terms'][0].__setitem__('ja','unknown')),
 ('false-provenance',lambda d:target(d).__setitem__('translatedDirectlyFrom','en')),
 ('native-certification',lambda d:target(d).__setitem__('nativeReviewed',True)),
 ('numeric-drift',lambda d:target(d)['paragraphs'][0].__setitem__('text',target(d)['paragraphs'][0]['text']+'999')),
 ('basis-source-drift',lambda d:d['authoringBasis'].__setitem__('sourceDocumentSha256','bad')),
 ]:mutate('target-'+label,t,fn)
 for label,fn in [
 ('pending',lambda d:d.__setitem__('status','pending')),
 ('not-compared',lambda d:d.__setitem__('independentAIComparisonPerformed',False)),
 ('required-correction',lambda d:d['requiredCorrections'].append('unresolved')),
 ('stale-evidence',lambda d:d['evidenceFiles'].__setitem__(next(iter(d['evidenceFiles'])),'bad')),
 ('missing-guide',lambda d:d['guides'].pop()),
 ('stale-object',lambda d:d['guides'][0].__setitem__('guideSha256','bad')),
 ]:mutate('source-review-'+label,M['SREVIEW'],fn)
 for label,fn in [
 ('not-semantic',lambda d:d.__setitem__('semanticTranslationReviewPerformed',False)),
 ('not-independent',lambda d:d.__setitem__('independentAiCompared',False)),
 ('required-finding',lambda d:d['unresolvedRequiredFindings'].append('unresolved')),
 ('wrong-counts',lambda d:d['counts'].__setitem__('translatedProseFieldPairsCompared',1)),
 ('missing-item',lambda d:d['items'].pop()),
 ('duplicate-item',lambda d:d['items'].append(deepcopy(d['items'][0]))),
 ('stale-object',lambda d:d['items'][0].__setitem__('targetObjectSha256','bad')),
 ('missing-field',lambda d:d['items'][0]['fieldBindings'].pop()),
 ('reversed-fields',lambda d:d['items'][0]['fieldBindings'].reverse()),
 ('stale-field-hash',lambda d:d['items'][0]['fieldBindings'][0].__setitem__('targetTextSha256','bad')),
 ('false-field-count',lambda d:d['items'][0].__setitem__('proseFieldPairsCompared',1)),
 ]:mutate('target-review-'+label,M['TREVIEW'],fn)
 for path in M['AUTHORITIES']:
  c=dict(inputs);c[path]+=b' ';reject('authority-drift:'+path,lambda c=c:build(c))
 for path in M['BASES']:
  current={p:(ROOT/p).read_bytes() for p in M['BASES']};current[path]+=b' ';reject('unknown-current:'+path,lambda current=current:M['preflight'](current))
 reject('unknown-progress',lambda:M['progress_preflight'](enc({'unknownProgressPayload':True})))
 progresspath=ROOT/M['PROGRESS'];original=Path.read_bytes
 def badprogress(p):return enc({'unknownProgressPayload':True}) if p==progresspath else original(p)
 with patch.object(Path,'read_bytes',badprogress),patch.object(Path,'write_bytes') as writes,patch.dict(M['main'].__globals__,{'os':M['os']}),patch.object(M['os'],'replace') as replacements:
  reject('actual-main-unknown-progress-zero-writes',M['main']);assert writes.call_count==replacements.call_count==0
 def basecurrent(p):
  if p==ROOT/M['SOURCE']:return inputs[stage+'integration/'+M['BASES'][M['SOURCE']][0]]
  return original(p)
 with patch.object(Path,'read_bytes',basecurrent),patch.object(Path,'write_bytes',side_effect=OSError(28,'fixture allocation failure')),patch.object(M['os'],'replace') as replacements:
  try:M['main']()
  except OSError:rejected.append('allocation-failure-zero-replacements')
  else:raise AssertionError('Allocationfixture not reached')
  assert replacements.call_count==0
 return {'status':'PASS','guides':11,'targetPairs':132,'newGuides':3,'newTargetPairs':36,'preservedGuides':8,'preservedTargetPairs':96,'reviewedProsePairs':468,'invalidFixturesRejected':len(rejected),'fixtures':rejected,'deterministic':True,'byteIdempotent':True,'unknownProgressMainZeroWrites':True,'allocationFailureZeroReplacements':True,'nativeReviewed':False,'domainReviewed':False,'releaseReady':False}
if __name__=='__main__':print(json.dumps(validate()))
