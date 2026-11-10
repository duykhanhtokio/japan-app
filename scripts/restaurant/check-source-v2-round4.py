"""Two new bounded hygiene assessments plus one precisely reused process assessment: revisions, translations and preservation.
No source denominator, native, expert or device acceptance is inferred.
"""
from pathlib import Path
import json,subprocess,re,hashlib
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/restaurant/source-closure31';OUT=R/'docs/ssw-workspace/source-coverage-v2'
read=lambda p:json.loads(p.read_text())
a=read(D/'integration/source-v2-r4-hygiene-authoring-20261102.json');base=a['baselineCommit'];ids={q['id']for q in a['questions']};assert len(ids)==2
old=lambda p:json.loads(subprocess.check_output(['git','show',base+':'+p],cwd=R))
canonical=read(D/'canonical-ja.json')['items'];preserved=[];runtime_questions={};ruby_fields=0
for level in ['1','2']:
 for name in ['lessons','exams']:
  p=f'src/data/restaurant/{name}.{level}.ja.json';assert (R/p).read_bytes()==subprocess.check_output(['git','show',base+':'+p],cwd=R),(p,'core changed')
 p=f'src/data/restaurant/source31/{level}.json';before=old(p);after=read(R/p)
 oq={q['id']:q for row in before['lessons'].values()for q in(row.get('exam')or{}).get('questions',[])};nq={q['id']:q for row in after['lessons'].values()for q in(row.get('exam')or{}).get('questions',[])}
 assert all(nq.get(id)==q for id,q in oq.items()),'Existing questions or readings changed'
 assert (set(nq)-set(oq)) >= (ids if level=='1'else set());preserved.append(dict(level=level,questions=len(oq)));runtime_questions.update(nq)
 for lid,row in before['lessons'].items():
  for key in ['sections','figures','terms','references']:assert after['lessons'][lid][key]==row[key],(lid,key,'existing reader content changed')
for q in a['questions']:
 c=canonical[q['id']];n=runtime_questions[q['id']]
 assert c['optionsJa'][c['correctIndex']]==q['optionsJa'][q['correctIndex']]
 for text,seq in[(n['stemJa'],n['furigana']['stem']),(n['explanationJa'],n['furigana']['explanation']),*zip(n['optionsJa'],n['furigana']['options']),*zip(n['optionReasonsJa'],n['reasonRuby'])]:
  assert ''.join(s['text']for s in seq)==text
  assert not any(re.search('[一-龯]',s['text'])and not s.get('reading')for s in seq),(q['id'],seq)
  ruby_fields+=1
locales=['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];preserved_locale={}
for locale in locales:
 p=f'src/data/restaurant/source31/{locale}.json';before=old(p)['items'];after=read(R/p)['items'];assert all(after.get(id)==v for id,v in before.items()),locale
 assert (set(after)-set(before)) >= ids,locale;preserved_locale[locale]=len(before)
 targets=read(D/f'translations/{locale}/source-v2-r4-hygiene-20261102.json')['items'];assert set(targets)==ids
 for id,t in targets.items():
  assert after[id]==t and t['sourceHash']==canonical[id]['sourceHash'],(locale,id)
  assert len(set(t['options']))==4 and len(t['reasons'])==4
  assert all(isinstance(x,str)and x.strip()for x in[t['objective'],t['stem'],t['explanation'],*t['options'],*t['reasons']])
  if id.endswith('q001'):assert t['options']==canonical[id]['optionsJa'],locale
ledger=read(OUT/'restaurant.json');units={u['knowledgeId']:u for u in ledger['knowledgeUnits']}
for q in a['questions']:
 u=units[q['factIds'][0]];assert u['status']=='covered_ai' and u['sourceReview']['conditionsChecked']
 assert all(s['elementIds']for s in u['sourceRefs'])
 assert any(e.get('jsonPointer','').endswith('/'+q['id'])for e in u['assessmentEvidence'])
assert ledger['denominator']['status']=='open' and not ledger['wholeSourceKnowledgeCovered']
x=read(D/'unit-crosswalk.json')['facts'];gaps=[id for id,f in x.items()if not id.startswith('rst-v2-')and not f.get('questionIds')and not f.get('crossShardQuestionIds')and f['decision']!='reference_excluded']
numeric=read(D/'translation-number-screen.json');previous_numeric=old(str((D/'translation-number-screen.json').relative_to(R)));flag_key=lambda f:(f['locale'],f['id'],f['field']);assert {flag_key(f):f for f in numeric['flags']}=={flag_key(f):f for f in previous_numeric['flags']};assert not any(f['id'] in ids for f in numeric['flags'])
report=dict(status='PASS',baselineCommit=base,newNumericFlags=0,historicalNumericFlagsPreservedUnchanged=len(numeric['flags']),newQuestions=2,reusedExistingQuestions=1,sourceGroups=3,newTranslatedPairs=24,newTranslatedVisibleFields=264,newRubyFields=ruby_fields,preservedQuestions=preserved,preservedLocaleItemCounts=preserved_locale,legacyAssessmentGaps=len(gaps),canonicalAssessmentMissing=sum(u['after']['assessment']=='missing'for u in units.values()),coveredAi=sum(u['status']=='covered_ai'for u in units.values()),sourceCoveragePercent=None,sourceDenominatorOpen=True,nativeReviewed=False,domainReviewed=False,physicalDeviceTested=False,learnerDurationMeasured=False)
p=OUT/'restaurant-r4-hygiene-validation-20261102.json';p.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report))
