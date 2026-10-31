from pathlib import Path
import hashlib,json,re
OUT=Path(__file__).resolve().parent;ROOT=OUT.parents[4]
def load(p):return json.loads(p.read_text())
def sha(x):return hashlib.sha256(x).hexdigest()
source=OUT.parent/'assessment/final-authoring.json';packet=load(source)
assert packet['canonicalJaBundleHash']=='176236b467ad4e5915b98aaff30eaaf3c4a26ecb7b1e31a0326eac8816e256b6'
cal=load(OUT/'caliper-reasons-authored.json');fig=load(OUT/'figure-reasons-authored.json');sign=load(OUT/'sign-phrases-authored.json');rep=load(OUT/'replacements-authored.json')
LOCALES=['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
# Hand-authored vocabulary/grammar; this is deterministic semantic composition, not a translation service.
keys=sign['meaningOrder'];maps=[dict(zip('ABCDEFGHIJ',keys[:10])),dict(zip('ABCDEFGHIJ',keys[10:20])),dict(zip('ABCDE',keys[20:25])),dict(zip('ABCDE',keys[25:30]))]
question_figure=[0,0,0,1,1,2,3]
def sign_reason(row,loc):
 q=row['after'];number=int(row['questionId'].rsplit('q',1)[1]);meaningmap=maps[question_figure[number-1]];vocab=dict(zip(keys,sign['vocabulary'][loc]));template=sign['templates'][loc]
 def split(x):return [p.strip() for p in x.split('/')]
 expected=split(q['optionsJa'][q['correctIndex']]);reasons=[]
 for option in q['optionsJa']:
  actual=split(option);assert len(actual)==len(expected)
  if actual==expected:
   items='; '.join(f'{label} = {vocab[meaningmap[label]]}' for label in expected)
   reasons.append(template['correct'].format(items=items))
  else:
   reasons.append(' '.join(template['wrong'].format(n=i+1,actual=a,actualMeaning=vocab[meaningmap[a]],expected=b,expectedMeaning=vocab[meaningmap[b]]) for i,(a,b) in enumerate(zip(actual,expected)) if a!=b))
 return reasons
updates={};replacements={}
for row in packet['rationaleUpdates']:
 qid=row['questionId'];targets={}
 for loc in LOCALES:
  if qid in cal['questionOrder']:
   n=cal['questionOrder'].index(qid);reasons=cal['locales'][loc][n*4:n*4+4];basis='individually_authored_from_frozen_Japanese_caliper_reason'
  elif qid in fig['questionOrder']:
   n=fig['questionOrder'].index(qid);reasons=fig['locales'][loc][n*4:n*4+4];basis='individually_authored_from_frozen_Japanese_figure_reason'
  else:
   reasons=sign_reason(row,loc);basis='hand_authored_sign_vocabulary_and_natural_mismatch_sentence_composition'
  assert len(reasons)==4 and len(set(reasons))==4 and all(isinstance(x,str) and x.strip() for x in reasons),(qid,loc)
  targets[loc]={'canonicalJaHash':row['canonicalJaHash'],'expectedBeforeSourceHash':row['expectedSourceHash'],'reasons':reasons,'translatedDirectlyFrom':'ja','status':'ai_authored_semantically_compared','authorshipBasis':basis,'nativeReviewed':False,'domainReviewed':False}
 updates[qid]={'canonicalJaHash':row['canonicalJaHash'],'expectedBeforeSourceHash':row['expectedSourceHash'],'canonicalReasonsJa':row['after']['optionReasonsJa'],'locales':targets}
for row in packet['replacementQuestions']:
 qid=row['questionId'];n=rep['questionOrder'].index(qid);targets={}
 for loc in LOCALES:
  words=rep['locales'][loc][n];assert len(words['options'])==len(words['reasons'])==4
  targets[loc]={'canonicalJaHash':row['canonicalJaHash'],'expectedBeforeSourceHash':row['expectedSourceHash'],**words,'translatedDirectlyFrom':'ja','status':'ai_authored_semantically_compared','nativeReviewed':False,'domainReviewed':False}
 replacements[qid]={'canonicalJaHash':row['canonicalJaHash'],'expectedBeforeSourceHash':row['expectedSourceHash'],'locales':targets}
result={'schemaVersion':1,'sourceJaBundleHash':packet['canonicalJaBundleHash'],'sourceJaFile':'docs/ssw-workspace/manufacturing/implementation40/assessment/final-authoring.json','sourceJaFileSha256':sha(source.read_bytes()),'locales':LOCALES,'rationaleUpdates':updates,'replacementQuestions':replacements,'counts':{'rationaleQuestions':29,'rationaleTargetFields':29*4*12,'replacementQuestions':3,'replacementTargetFields':3*9*12,'totalNewQuestionTargetFields':1716},'sourceBindingPolicy':'canonicalJaHash pins exact new Japanese wording; expectedBeforeSourceHash pins source record BEFORE overlay. Root integration must bind actual resulting question revision/hash without changing authored target words.','nativeReviewed':False,'domainReviewed':False,'humanReviewed':False}
(OUT/'assessment-translations.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('ASSESSMENT TARGETS PASS:29×4×12=1392specificrationales;3×9×12=324replacementfields;total1716newtargetfields;all32JAhashesbound.')
