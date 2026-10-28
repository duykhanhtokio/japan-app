"""Read-only final-preview and fail-closed evidence checks."""
from pathlib import Path
from copy import deepcopy
from unittest.mock import patch
import hashlib,json,runpy
ROOT=Path(__file__).resolve().parents[2]
M=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-caliper-guide29.py'))
def validate():
 inputs=M['load_inputs']();base=M['base_outputs']();build=M['compile_outputs'];enc=M['encoded'];outputs=build(inputs,base)
 assert build(dict(reversed(list(inputs.items()))),base)==outputs
 for p,raw in outputs.items():assert (ROOT/p).read_bytes()==raw
 assert M['preflight']()[0]==outputs
 assert all(M['historical_bytes'](p,raw,base)==base[p] for p,raw in outputs.items())
 rejected=[]
 def rejects(label,fn):
  try:fn()
  except (AssertionError,ValueError,KeyError):rejected.append(label)
  else:raise AssertionError('Accepted invalid29input:'+label)
 def mutate(label,path,fn):
  d=dict(inputs);v=json.loads(d[path]);fn(v);d[path]=enc(v);rejects(label,lambda:build(d,base))
 g=M['DRAFT']+'guide.ja.json';t=M['DRAFT']+'guide.vi.json'
 mutate('wrong-source-number',g,lambda v:v['paragraphs'][0].__setitem__('textJa',v['paragraphs'][0]['textJa'].replace('0.01','0.1')))
 mutate('wrong-level',g,lambda v:v['sources'][0].__setitem__('documentId','mfg2-mechanical-source'))
 mutate('target-decimal-change',t,lambda v:v['paragraphs'][0].__setitem__('text',v['paragraphs'][0]['text'].replace('0.05','0.5')))
 mutate('target-paragraph-order',t,lambda v:v['paragraphs'].reverse())
 mutate('target-missing-safety',t,lambda v:v['safety'].clear())
 mutate('target-native-claim',t,lambda v:v.__setitem__('nativeReviewed',True))
 mutate('review-independent-claim',M['REVIEW'],lambda v:v.__setitem__('independentAIComparisonPerformed',True))
 mutate('review-missing-locale',M['REVIEW'],lambda v:v['locales'].pop())
 mutate('review-unresolved-correction',M['REVIEW'],lambda v:v['locales'][0]['requiredCorrections'].append('unresolved'))
 for p,raw in outputs.items():rejects('unknown-current:'+p,lambda p=p,raw=raw:M['historical_bytes'](p,raw+b' ',base))
 rejects('unknown-progress',lambda:M['projected_progress']({'unknown':True},{}))
 # The actual writer must allocate every payload before replacing any file.
 original=Path.read_bytes
 def sourcebase(p):return base[M['SOURCE']] if p==ROOT/M['SOURCE'] else original(p)
 with patch.object(Path,'read_bytes',sourcebase),patch.object(Path,'write_bytes',side_effect=OSError(28,'allocation fixture')),patch.object(M['os'],'replace') as replacements:
  try:M['main']()
  except OSError:rejected.append('allocation-failure-zero-replacements')
  else:raise AssertionError('Allocation fixture not reached')
  assert replacements.call_count==0
 return {'status':'PASS_PREVIEW_DRAFT','guides':12,'targetPairs':144,'newGuides':1,'newTargetPairs':12,'authorComparedProseFields':156,'independentAIComparisonPerformed':False,'invalidFixturesRejected':len(rejected),'fixtures':rejected,'historical11GuideBytesExact':True,'allocationFailureZeroReplacements':True,'nativeReviewed':False,'domainReviewed':False,'releaseReady':False}
if __name__=='__main__':print(json.dumps(validate()))
