"""Validate the original ordering exercise, including units and revision-safe content.
An automated pass does not certify native language, food safety or source completeness.
"""
from pathlib import Path
from decimal import Decimal as D
import collections, hashlib, json, re

ROOT=Path(__file__).resolve().parents[2]
path=ROOT/'src/data/restaurant/ordering-exercise.json'
data=json.loads(path.read_text())
locales=set(['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'])
assert data['schemaVersion']==1 and data['lessonIds']==['rst-2-ops-05']
assert data['sourceRefs'][0]['documentId']=='rst-2-operations'
assert data['sourceRefs'][0]['pdfPages']==[17,18]
assert not data['review']['nativeReviewed'] and not data['review']['domainReviewed']
assert not data['review']['officialExamQuestion']
labels=data['labels']
required={'title','recipe','curry','setMeal','sales','portions','rice','portionUnit','order','demand','buffer','usable','incoming','additional','schedule','monday','tuesday','wednesday','thursday','show','hide','note','period','stockNote','selected','yen','supplier','forecastNote'}
assert set(labels)==required
def digits(text):return collections.Counter(re.findall(r'\d+(?:[.:]\d+)*',text))
for key,label in labels.items():
 assert label['ja'] and ''.join(s['text'] for s in label['segments'])==label['ja'],key
 for segment in label['segments']:
  assert segment['text']
  if re.search('[一-龯々]',segment['text']):assert re.fullmatch('[ぁ-ゖー]+',segment.get('reading','')),key
 assert set(label['translations'])==locales,key
 for locale,text in label['translations'].items():
  # 定食 is also an established Traditional Chinese menu term. An exact,
  # documented shared term is distinct from a missing-language fallback.
  shared_term=(key,locale,text)==('setMeal','zh-TW','定食')
  assert isinstance(text,str) and text.strip() and (text!=label['ja'] or shared_term),(key,locale)
  assert digits(text)==digits(label['ja']),(key,locale,'numeric/time notation differs')

checks=0
for plan in data['plans']:
 sales=sum(D(str(plan[key]))*D(str(data['priceYen'][key])) for key in ('curry','setMeal'))
 rice=sum(D(str(plan[key]))*D(str(data['recipeKg'][key])) for key in ('curry','setMeal'))
 assert sales==D(str(plan['salesYen'])) and rice==D(str(plan['riceKg']))
 assert plan['curry']>0 and plan['setMeal']>0
 checks+=2
order={k:D(str(v)) for k,v in data['orderKg'].items()}
assert order['demand']==D(str(data['plans'][data['selectedPlan']]['riceKg']))
assert order['additional']==order['demand']+order['buffer']-order['usable']-order['incoming']==D('4.2')
assert order['additional']+order['usable']+order['incoming']==order['demand']+order['buffer']
assert all(v>=0 for v in order.values())
checks+=4
assert '含みません' in labels['stockNote']['ja'] and '二重' in labels['stockNote']['ja']
assert '検収合格' in labels['stockNote']['ja'] and '遅配' in labels['stockNote']['ja']
assert '再計算' in labels['period']['ja']
review_path=ROOT/'docs/ssw-workspace/restaurant/completion27-ordering-source-review.json'
if review_path.exists():
 review=json.loads(review_path.read_text())
 assert review['artifact']['sha256']==hashlib.sha256(path.read_bytes()).hexdigest(),'stale source supplement'
 component=ROOT/review['artifact']['component']
 assert review['artifact']['componentSha256']==hashlib.sha256(component.read_bytes()).hexdigest(),'stale component review'
 assert review['newlyNarrowCovered']==['rst-2-operations-k027']
 assert all(review[key] is False for key in ('nativeReviewed','domainReviewed','humanReviewed','fullSourceCoverageComplete'))
 ledger=json.loads((ROOT/'docs/ssw-workspace/restaurant/knowledge-ledger.json').read_text())
 unit=next(u for u in ledger['units'] if u['id']=='rst-2-operations-k027')
 assert unit['coverageStatus']=='covered' and unit['lessonId'] in data['lessonIds']
 assert unit['coverageEvidence']['supplementArtifactSha256']==review['artifact']['sha256']
report={'status':'ORDERING_EXERCISE_PASS','labels':len(labels),'locales':len(locales),'translatedLabels':len(labels)*len(locales),'exactArithmeticChecks':checks,'allJapaneseLabelsAligned':True,'sourceTextPagesRead':[17,18],'sourceFigureInspection':False,'sourceCoverageCertified':False,'nativeReviewed':False,'domainReviewed':False,'inputSha256':hashlib.sha256(path.read_bytes()).hexdigest()}
(ROOT/'docs/ssw-workspace/restaurant/completion27-ordering-data-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report))
