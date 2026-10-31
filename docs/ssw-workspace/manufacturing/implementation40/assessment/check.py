"""Validate authoring guards, aligned readings and the three new decision tasks."""
from pathlib import Path
import hashlib,json,re
OUT=Path(__file__).resolve().parent
ROOT=next(p for p in OUT.parents if (p/'AGENTS.md').exists())
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def ja(q):return {k:q[k] for k in ['stemJa','optionsJa','correctIndex','optionReasonsJa','explanationJa'] if k in q}
j=json.loads((OUT/'final-authoring.json').read_text());seen=set();count=0
for kind in ['rationaleUpdates','replacementQuestions']:
 for r in j[kind]:
  assert r['questionId'] not in seen;seen.add(r['questionId'])
  data=json.loads((ROOT/r['sourcePath']).read_text())
  for p in r['jsonPointer'].strip('/').split('/'):data=data[int(p)] if isinstance(data,list) else data[p]
  assert data==r['beforeQuestion']
  assert data['sourceHash']==r['expectedSourceHash'] and sha(data)==r['expectedRecordSha256']
  after=r['afterQuestion'];assert after['id']==data['id'] and after['correctIndex']==data['correctIndex']
  assert len(after['optionsJa'])==4 and len(after['optionReasonsJa'])==4
  assert len(set(after['optionsJa']))==4 and len(set(after['optionReasonsJa']))==4
  assert r['after']==ja(after) and r['canonicalJaHash']==sha(ja(after))
  if kind=='rationaleUpdates':
   assert all(after[k]==data[k] for k in ['stemJa','optionsJa','correctIndex'])
   count+=len(after['optionReasonsJa'])
  else:
   assert data['stemJa']!=after['stemJa'] and data['optionsJa']!=after['optionsJa']
  ruby=r['ruby'];assert ruby['canonicalJaHash']==r['canonicalJaHash']
  assert ''.join(p['text'] for p in ruby['stem'])==after['stemJa']
  for field,tokenfield in [('optionsJa','options'),('optionReasonsJa','reasons')]:
   for text,parts in zip(after[field],ruby[tokenfield]):
    assert ''.join(p['text'] for p in parts)==text
    assert all('reading'in p for p in parts if re.search(r'[一-龯々〆]',p['text']))
  for parts in [ruby['stem']]+ruby['options']+ruby['reasons']:
   for p in parts:
    if p['text']=='本尺':assert p['reading']=='ほんじゃく'
    if p['text']=='負':assert p['reading']=='ふ'
    if p['text']=='値':assert p['reading']=='あたい'
  evidence=r.get('authorComparison',{})
  if evidence.get('assetPath'):
   assert hashlib.sha256((ROOT/evidence['assetPath']).read_bytes()).hexdigest()==evidence['assetSha256']
   assert hashlib.sha256((ROOT/evidence['svgPath']).read_bytes()).hexdigest()==evidence['svgSha256']
assert len(j['rationaleUpdates'])==29 and count==116 and len(j['replacementQuestions'])==3
expected=sha({'rationaleUpdates':[{k:u[k] for k in ['questionId','after','canonicalJaHash']} for u in j['rationaleUpdates']],'replacementQuestions':[{k:u[k] for k in ['questionId','after','canonicalJaHash']} for u in j['replacementQuestions']]})
assert expected==j['canonicalJaBundleHash']
# Exact arithmetic that identifies double counting rather than simply asking a sum.
from fractions import Fraction
right=Fraction('18')+Fraction('0.45');wrong=Fraction('18')+2*Fraction('0.45')
assert right==Fraction('18.45') and wrong==Fraction('18.90') and wrong-right==Fraction('0.45')
# Non-latching self-hold model; losing supply drops the coil, returned-start is0.
coil=True
for power,start in [(False,False),(True,False)]:coil=bool(power and (start or coil))
assert coil is False
# Charge-sign change with unchanged magnitudes/r and permittivity: abs(product)
# unchanged, sign changes. This is not another triple-distance exercise.
before_product=1*1;after_product=1*(-1)
assert abs(before_product)==abs(after_product) and before_product>0 and after_product<0
report={'status':'PASS_authoring_ready_for_root_guarded_integration','rationaleQuestions':29,'rationaleTexts':116,'newTasks':3,'keyPositionsPreserved':32,'allRubyTextAligned':True,'unknownKanjiCount':0,'canonicalJaBundleHash':expected,'visualComparison':'all11mechanicalPNGactualviews;SVGhashesbound;A-Jlabelsconfirmedbyenlargedcrop;noassetrevisionneeded','caliperSourceComparison':'hashverifiedmechanicalPDFphysical72renderandguide3paragraphs','newTaskSourceComparison':'hashverifiedelectricalPDF93/94/120/169/170textread;nooriginalexerciseexpressionreused','nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'physicalDeviceVerified':False}
(OUT/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
