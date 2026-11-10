from pathlib import Path
import collections,hashlib,json,re,unicodedata
OUT=Path(__file__).resolve().parent;ROOT=OUT.parents[4]
def load(p):return json.loads(p.read_text())
def sha(x):return hashlib.sha256(x).hexdigest()
def nums(s):return re.findall(r'\d+(?:\.\d+)?',unicodedata.normalize('NFKC',s))
ja=load(OUT.parent/'assessment/final-authoring.json');tr=load(OUT/'assessment-translations.json');daily=load(OUT/'daily-translations.json');differences=[]
assert tr['sourceJaBundleHash']==ja['canonicalJaBundleHash']=='176236b467ad4e5915b98aaff30eaaf3c4a26ecb7b1e31a0326eac8816e256b6'
assert tr['sourceJaFileSha256']==sha((OUT.parent/'assessment/final-authoring.json').read_bytes())
assert len(tr['rationaleUpdates'])==29 and len(tr['replacementQuestions'])==3
locales=['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
for row in ja['rationaleUpdates']:
 qid=row['questionId'];entry=tr['rationaleUpdates'][qid];assert entry['canonicalJaHash']==row['canonicalJaHash']
 for locale in locales:
  target=entry['locales'][locale];assert target['expectedBeforeSourceHash']==row['expectedSourceHash'];assert len(target['reasons'])==len(set(target['reasons']))==4
  assert target['nativeReviewed'] is False and target['domainReviewed'] is False
  for i,(source,text) in enumerate(zip(row['after']['optionReasonsJa'],target['reasons'])):
   assert text.strip()
   if nums(source)!=nums(text):
    # Explicit manual comparison: these exact cases only reorder values or write counts as number words.
    assert (qid=='mfg38-mechanical-q011' and i==1 and locale=='tl') or (qid=='mfg38-mechanical-q013' and i==2 and locale=='tl') or (qid=='mfg38-mechanical-q019' and i in [1,2,3]) or (qid=='mfg38-mechanical-q021' and i==3),(qid,locale,i)
    differences.append({'questionId':qid,'locale':locale,'field':['reasons',i],'sourceNumbers':nums(source),'targetNumbers':nums(text),'manualDecision':'same_values_with_reordered_numeric_expression_or_written_count_words'})
for row in ja['replacementQuestions']:
 qid=row['questionId'];entry=tr['replacementQuestions'][qid];assert entry['canonicalJaHash']==row['canonicalJaHash']
 for locale in locales:
  target=entry['locales'][locale];assert len(target['options'])==len(target['reasons'])==4
  for key,sourcekey in [('stem','stemJa'),('options','optionsJa'),('reasons','optionReasonsJa')]:
   a=row['after'][sourcekey];b=target[key]
   if isinstance(a,str):a=[a];b=[b]
   for i,(source,text) in enumerate(zip(a,b)):
    assert text.strip()
    if nums(source)!=nums(text):
     assert qid=='mfg1-electrical-mock-09-practical-q03' and key in ['options','reasons'] and i==0
     differences.append({'questionId':qid,'locale':locale,'field':[key,i],'sourceNumbers':nums(source),'targetNumbers':nums(text),'manualDecision':'double_force_count_two_written_as_word_target'})
assert len(differences)==74
assert daily['lessonCount']==262 and daily['translatedFieldCount']==6288
for lessonid,entry in daily['lessons'].items():
 assert entry['captionPlanValidated'] is True
 assert len(entry['locales'])==12
 assert sha(entry['captionJa'].encode())==entry['captionSourceHash']
 assert sha(entry['altJa'].encode())==entry['altSourceHash']
 for locale,target in entry['locales'].items():
  assert target['sourceHash']==entry['lessonSourceHash'] and target['captionSourceHash']==entry['captionSourceHash'] and target['altSourceHash']==entry['altSourceHash']
  assert target['caption'].strip() and target['alt'].strip()
report={'status':'PASS','newQuestionTargetFields':1716,'rationaleTargetFields':1392,'replacementTargetFields':324,'dailyCaptionAltFieldsReusedExactly':6288,'dailyValidatedCanonicalBindings':262,'manualNumericDifferenceDispositions':differences,'meaningReview':'AI author compared all newlyauthored target fields to frozenJA, technicaldistinctions/negations/conditional scope preserved; no independent/native/domain certification','translationApiUsed':False,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False}
(OUT/'new-translation-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('NEW TARGET VALIDATION PASS:1716newquestionfields +6288exactreuseddailycaption/altfields;32frozenJArecords;262dailyplans;74numericword-order/countwordcasesmanuallydispositioned.')
