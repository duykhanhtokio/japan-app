"""Integrate exact frozen AI-reviewed source units, preserving baseline identities.

This is a data assembly operation, not a claim of full-source/native certification.
"""
from pathlib import Path
import hashlib,json,re,subprocess,sys,runpy

ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'src/data/manufacturing'
DOCS=ROOT/'docs/ssw-workspace/manufacturing'
STAGE=DOCS/'batch12'
def read(p):return json.loads(p.read_text())
def write(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def hash_object(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def insertion_hash(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
def without_bindings(x):
 if isinstance(x,list):return [without_bindings(v) for v in x]
 if isinstance(x,dict):return {k:without_bindings(v) for k,v in x.items() if k not in ['sourceHash','lessonSourceHash','revision']}
 return x
def append_unique(old,new):
 by_id={x['id']:x for x in old}
 for x in new:
  if x['id'] in by_id:assert by_id[x['id']]==x or without_bindings(by_id[x['id']])==without_bindings(x),'Existing source content changed '+x['id']
  else:old.append(x);by_id[x['id']]=x
def staged_translation_resolver(selection):
 """Coalesce identical drafts; require explicit authority for conflicting text."""
 candidates={};used=set()
 def add(locale,kind,identifier,translation,path):
  key=f'{locale}:{kind}:{identifier}';payload=hash_object(translation)
  row=candidates.setdefault(key,{}).setdefault(payload,{'value':translation,'paths':set()})
  row['paths'].add(str(path.relative_to(ROOT)))
 def resolve(locale,kind,table):
  prefix=f'{locale}:{kind}:'
  for key,variants in candidates.items():
   if not key.startswith(prefix):continue
   identifier=key[len(prefix):]
   if len(variants)==1:
    assert key not in selection,'Recorded translation conflict disappeared: '+key
    chosen=next(iter(variants.values()))['value']
   else:
    assert key in selection,'Unresolved staged translation conflict: '+key
    rule=selection[key];expected=rule['selectedPayloadSha256'];used.add(key)
    assert set(variants)==set(rule['candidatePayloadSha256']),'Translation conflict variants changed: '+key
    assert expected in variants and rule['selectedPath'] in variants[expected]['paths'],'Selected staged translation missing: '+key
    chosen=variants[expected]['value']
    assert chosen['sourceHash']==rule['sourceHash'],'Translation selection source changed: '+key
   table[identifier]=chosen
 def finish():assert used==set(selection),'Unused translation selection entries: '+','.join(sorted(set(selection)-used))
 return add,resolve,finish
def main():
 runpy.run_path(str(ROOT/'scripts/manufacturing/apply-electrical-precision.py'))['preflight']()
 runpy.run_path(str(ROOT/'scripts/manufacturing/apply-diagram-extension.py'))['preflight']()
 subprocess.run([sys.executable,str(ROOT/'scripts/manufacturing/check-source-review-bindings.py')],check=True,capture_output=True,text=True)
 subprocess.run([sys.executable,str(ROOT/'scripts/manufacturing/integrate-source-guides.py')],check=True,capture_output=True,text=True)
 guide_report=read(STAGE/'source-guides/integration-qa.json')
 frozen=read(STAGE/'frozen-source-inputs.json')['sha256']
 for relative,expected in frozen.items():assert hashlib.sha256((STAGE/relative).read_bytes()).hexdigest()==expected,'Source freeze drift: '+relative
 manifest=read(DATA/'course-manifest.json');matrix=read(DOCS/'knowledge-matrix.json');knowledge={k['id']:k for k in matrix['knowledge']}
 inputs={'mechanical':['new-content.json','gap-content.json'],'electrical':['new-content.json','gap-content.json'],'surface':['new-content.json','leaf-gap-supplement.json']}
 normalization_path=STAGE/'source-binding-normalization.json'
 courses={};all_lessons={};all_questions={};mappings=[];input_digests={};normalized_bindings=read(normalization_path) if normalization_path.exists() else {}
 for specialty,files in inputs.items():
  course=read(DATA/f'{specialty}.json');info=next(s for s in manifest['specialties'] if s['id']==specialty)
  for check in course['checks']:
   if check['kind']=='weekly_check':check['kind']='weekly'
  for name in files:
   p=STAGE/specialty/name;d=read(p);input_digests[str(p.relative_to(ROOT))]=hashlib.sha256(p.read_bytes()).hexdigest()
   for item in d['lessons']+[q for check in d['checks'] for q in check['questions']]:
    core={k:v for k,v in item.items() if k!='sourceHash'};assert item['sourceHash'] in [hash_object(core),insertion_hash(core)],item['id']
   for check in d['checks']:
    if check['kind']=='weekly_check':check['kind']='weekly'
   append_unique(course['lessons'],d['lessons']);append_unique(course['checks'],d['checks']);append_unique(info['weeks'],d['weeks']);mappings.extend(d.get('knowledgeMappings',[]))
  info['authoredLessons']=len(course['lessons']);info['weeks'].sort(key=lambda w:w['number']);info['fullCurriculumWeeks']=None
  info['referenceSupplementLessonIds']=[f'mfg1-electrical-l{i:03}' for i in range(85,99)] if specialty=='electrical' else []
  courses[specialty]=course
  for lesson in course['lessons']:
   assert lesson['id'] not in all_lessons;core={k:v for k,v in lesson.items() if k!='sourceHash'};original=lesson['sourceHash'];canonical=hash_object(core)
   assert original in [canonical,insertion_hash(core)],lesson['id']
   if original!=canonical:normalized_bindings[lesson['id']]={'from':original,'to':canonical,'reason':'same exact source object; insertion-order digest normalized to sorted-key digest'};lesson['sourceHash']=canonical
   all_lessons[lesson['id']]=lesson
  for check in course['checks']:
   for q in check['questions']:
    assert q['id'] not in all_questions;core={k:v for k,v in q.items() if k!='sourceHash'};original=q['sourceHash'];assert original in [hash_object(core),insertion_hash(core)],q['id']
    expected=all_lessons[q['lessonId']]['sourceHash'];old_lesson=normalized_bindings.get(q['lessonId'])
    assert q['lessonSourceHash']==expected or (old_lesson and q['lessonSourceHash']==old_lesson['from']),q['id']
    q['lessonSourceHash']=expected;q['sourceHash']=hash_object({k:v for k,v in q.items() if k!='sourceHash'})
    if original!=q['sourceHash']:normalized_bindings[q['id']]={'from':original,'to':q['sourceHash'],'reason':'same question text/options/reasons; canonical source-binding/hash normalization'}
    all_questions[q['id']]=q
   check['revision']='v1-'+hash_object(check['questions'])[:16]
 for lesson in all_lessons.values():
  for kid in lesson['knowledgeIds']:
   assert kid in knowledge,kid;k=knowledge[kid];k.setdefault('lessonIds',[])
   if lesson['id'] not in k['lessonIds']:k['lessonIds'].append(lesson['id'])
 for q in all_questions.values():
  for kid in q['knowledgeIds']:
   assert kid in knowledge,kid;k=knowledge[kid];k.setdefault('questionIds',[])
   if q['id'] not in k['questionIds']:k['questionIds'].append(q['id'])
 for m in mappings:
  kids=m.get('knowledgeIds') or [m.get('knowledgeId')];lids=m.get('lessonIds') or [m.get('lessonId')]
  for kid in kids:
   if not kid:continue
   assert kid in knowledge,kid;k=knowledge[kid]
   for lid in lids:
    if not lid:continue
    assert lid in all_lessons,lid
    if lid not in k.setdefault('lessonIds',[]):k['lessonIds'].append(lid)
   for qid in m.get('questionIds',[]):
    assert qid in all_questions,qid
    if qid not in k.setdefault('questionIds',[]):k['questionIds'].append(qid)
  # TOC linkage is recorded separately from source/object completeness.
  for kid in kids:
   if kid:knowledge[kid]['coverageStatus']='linked_to_ai_draft_lessons_not_source_certification'
 for specialty,course in courses.items():write(DATA/f'{specialty}.json',course)
 # Integrate independently reviewed originals; normalize only proven source bindings.
 mock_questions={};mock_binding_remaps={}
 expected_digests={'mechanical':'929f1207fa32cf2c044be3dd510f9f44456b008b71a8ea1ec800168cfb617d25','electrical':'3a81192ddcc0b74d427e57c07418a0f3049435818f137cdcc9d2fede7457ecc0','surface':'8dc2025826c43e6fa88ef5a27c938695e9b7fa34bdb1d8606cca32e5917bb251'}
 for specialty in inputs:
  source=STAGE/specialty/'mocks.json';assert hashlib.sha256(source.read_bytes()).hexdigest()==expected_digests[specialty]
  bundle=read(source);assert len(bundle['exams'])==10
  covered=set()
  for exam in bundle['exams']:
   for section,count,minimum in [('theory',30,20),('practical',10,6)]:
    part=exam['sections'][section];assert len(part['questions'])==count and part['durationMs']==2400000 and part['passMinimumCorrect']==minimum
    for q in part['questions']:
     original=q['sourceHash'];assert original==hash_object({k:v for k,v in q.items() if k!='sourceHash'}),q['id']
     lesson=all_lessons[q['lessonId']];old=normalized_bindings.get(q['lessonId'])
     assert q.get('lessonSourceHash') in [None,lesson['sourceHash'],old['from'] if old else lesson['sourceHash']]
     if 'lessonSourceHash' in q:q['lessonSourceHash']=lesson['sourceHash']
     q['sourceHash']=hash_object({k:v for k,v in q.items() if k!='sourceHash'})
     if original!=q['sourceHash']:mock_binding_remaps[q['id']]={'from':original,'to':q['sourceHash']}
     assert len(q['optionsJa'])==(2 if section=='theory' else 4) and len(q['optionReasonsJa'])==len(q['optionsJa'])
     assert 0<=q['correctIndex']<len(q['optionsJa']) and q['id'] not in mock_questions
     mock_questions[q['id']]=q;covered.add(q['lessonId'])
   exam['revision']='v1-'+hash_object(exam['sections'])[:16]
  assert covered=={l['id'] for l in courses[specialty]['lessons']},specialty
  write(DATA/'mocks'/f'{specialty}.json',bundle)
 manifest['completedMockExams']=30
 write(STAGE/'mock-source-binding-normalization.json',mock_binding_remaps)
 guide_history=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-reference-guide-extension.py'))
 for guide in json.loads(guide_history['historical_source_guides_bytes']((DATA/'source-guides.json').read_bytes()))['guides']:
  for kid in guide['knowledgeIds']:
   row=knowledge[kid];row.setdefault('referenceGuideIds',[])
   if guide['id'] not in row['referenceGuideIds']:row['referenceGuideIds'].append(guide['id'])
   row['coverageStatus']='linked_to_ai_reference_supplement_not_source_certification'
 manifest['courseComplete']=False;manifest['releaseReady']=False;write(DATA/'course-manifest.json',manifest);write(DOCS/'knowledge-matrix.json',matrix)
 translation_aliases={}
 registry=read(DATA/'translations/manifest.json');targets=list(registry['locales']);locale_lessons={};locale_questions={};locale_mocks={};caption_data=read(DATA/'diagram-translations.json')
 # Retain valid existing translations, then overlay full staged fields only.
 for locale in targets:
  entry=registry['locales'][locale];locale_lessons[locale]={};locale_questions[locale]={};locale_mocks[locale]={}
  if entry.get('file'):
   locale_lessons[locale]=read(DATA/'translations'/entry['file']).get('lessons',{})
  if entry.get('questionFile'):locale_questions[locale]=read(DATA/'translations'/entry['questionFile']).get('questions',{})
 selection=read(DOCS/'batch17/integration/translation-selection.json')['entries']
 stage_add,stage_resolve,stage_finish=staged_translation_resolver(selection)
 for p in sorted(STAGE.rglob('*.json'),key=str):
  if not any(x in p.parts for x in ['mechanical-locales','electrical-locales','surface-locales','global-locales']):continue
  if any(x in p.name for x in ['qa','review','checkpoint','blueprint','progress']):continue
  d=read(p)
  if not isinstance(d,dict):continue
  blocks=d.get('locales') if isinstance(d.get('locales'),dict) else {d.get('locale'):d}
  for locale,block in blocks.items():
   if locale not in targets or not isinstance(block,dict):continue
   for key,table,known in [('lessons',locale_lessons[locale],all_lessons),('questions',locale_questions[locale],all_questions)]:
    entries=block.get(key,{})
    if not isinstance(entries,dict):continue
    for identifier,translation in entries.items():
     if not isinstance(translation,dict) or not translation.get('sourceHash'):continue
     if key=='questions' and 'reasons' not in translation and isinstance(translation.get('optionReasons'),list):
      original=translation
      assert isinstance(original.get('options'),list) and len(original['options'])==len(original['optionReasons']) and all(isinstance(v,str) and v.strip() for v in original['optionReasons']),identifier
      translation={k:v for k,v in original.items() if k!='optionReasons'};translation['reasons']=original['optionReasons']
      translation_aliases[locale+':'+identifier]={'sourceHash':original['sourceHash'],'fromField':'optionReasons','toField':'reasons','reasonCount':len(original['optionReasons']),'targetReasonStringsUnchanged':translation['reasons']==original['optionReasons'],'originalPayloadSha256':hash_object(original),'normalizedPayloadSha256':hash_object(translation)}
     if key=='lessons' and not all(k in translation for k in ['title','objective','paragraphs','terms','activity','safety','summary']):continue
     if key=='questions' and not all(k in translation for k in ['stem','options','reasons']):continue
     if identifier in known and (translation['sourceHash']==known[identifier]['sourceHash'] or (identifier in normalized_bindings and translation['sourceHash']==normalized_bindings[identifier]['from'])):
      stage_add(locale,key,identifier,{**translation,'sourceHash':known[identifier]['sourceHash']},p)
     elif key=='questions' and identifier in mock_questions:
      expected=mock_questions[identifier]['sourceHash'];remap=mock_binding_remaps.get(identifier)
      if translation['sourceHash']==expected or (remap and translation['sourceHash']==remap['from']):stage_add(locale,'mocks',identifier,{**translation,'sourceHash':expected},p)
   for ckey in ['captions','diagramCaptions']:
    entries=block.get(ckey,{})
    if isinstance(entries,dict):
     for identifier,translation in entries.items():
      if isinstance(translation,dict) and isinstance(translation.get('sourceJa'),str) and isinstance(translation.get('text'),str):stage_add(locale,'captions',identifier,translation,p)
 for locale in targets:
  stage_resolve(locale,'lessons',locale_lessons[locale]);stage_resolve(locale,'questions',locale_questions[locale]);stage_resolve(locale,'mocks',locale_mocks[locale]);stage_resolve(locale,'captions',caption_data['locales'].setdefault(locale,{}))
 stage_finish()
 complete=[];partial=[]
 for locale in targets:
  entry=registry['locales'][locale];ls={k:v for k,v in locale_lessons[locale].items() if k in all_lessons and v['sourceHash']==all_lessons[k]['sourceHash']};qs={k:v for k,v in locale_questions[locale].items() if k in all_questions and v['sourceHash']==all_questions[k]['sourceHash']}
  if not ls and not qs:continue
  entry.update(file=f'{locale}.json',lessonCount=len(ls),questionFile=f'questions.{locale}.json',questionCount=len(qs),status='ai_translated_draft',scope='all_current_authored_content;full_curriculum_incomplete' if len(ls)==len(all_lessons) and len(qs)==len(all_questions) else 'partial_authored_content;full_curriculum_incomplete')
  write(DATA/'translations'/entry['file'],{'locale':locale,'lessons':ls});write(DATA/'translations'/entry['questionFile'],{'locale':locale,'questions':qs})
  (complete if len(ls)==len(all_lessons) and len(qs)==len(all_questions) else partial).append(locale)
 write(DATA/'translations/manifest.json',registry);write(DATA/'diagram-translations.json',caption_data)
 ts="import type {ManufacturingLesson,ManufacturingQuestion} from './index';\nexport type LessonTranslation={sourceHash:string;title:string;objective:string;paragraphs:{id:string;title:string;text:string}[];terms:{ja:string;reading:string;meaning:string}[];activity:string;safety:string[];summary:string};\nexport type QuestionTranslation={sourceHash:string;stem:string;options:string[];reasons:string[]};\n"
 for name,arg,typ,key,regkey in [('manufacturingTranslation','lesson','ManufacturingLesson','lessons','file'),('manufacturingQuestionTranslation','question','ManufacturingQuestion','questions','questionFile')]:
  ts+=f'export function {name}({arg}:{typ},locale:string):'+('LessonTranslation' if key=='lessons' else 'QuestionTranslation')+'|null {\n let entries:Record<string,'+('LessonTranslation' if key=='lessons' else 'QuestionTranslation')+'>|null=null;\n switch(locale){'
  for locale,entry in registry['locales'].items():
   filename=entry.get(regkey)
   if filename:assert re.fullmatch(r'[a-zA-Z0-9.-]+\.json',filename);ts+=f"case '{locale}':entries=require('./translations/{filename}').{key};break;"
  ts+=f'}}\n const item=entries?.[{arg}.id];return item?.sourceHash==={arg}.sourceHash?item:null;\n}}\n'
 (DATA/'translations.ts').write_text(ts)
 existing_mock_locales=read(DATA/'mock-translations.json').get('locales',{})
 for locale,entries in locale_mocks.items():existing_mock_locales.setdefault(locale,{}).update(entries)
 write(DATA/'mock-translations.json',{'sourceLocale':'ja','status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'locales':existing_mock_locales})
 progress=read(DOCS/'progress.json');progress.setdefault('batch','12-in-progress');progress.update(authoredJapaneseLessons=len(all_lessons),aiEditorialReviewedJapaneseLessons=len(all_lessons),integratedPreviewLessons=len(all_lessons),weeklyChecks=sum(len(c['checks']) for c in courses.values()),weeklyQuestions=len(all_questions),tocEntriesWithDraftLessons=sum(bool(k.get('lessonIds')) for k in knowledge.values()),translatedLessonLocalePairs=sum(e['lessonCount'] for e in registry['locales'].values()),translatedQuestionLocalePairs=sum(e['questionCount'] for e in registry['locales'].values()),translatedDiagramCaptionLocalePairs=sum(len(x) for x in caption_data['locales'].values()),fullyDraftTranslatedLocalesForAuthoredContent=complete,partiallyDraftTranslatedLocales=partial,wholeCurriculumComplete=False,releaseReady=False)
 progress['draftUiLabelsPerLocale']=len(read(DATA/'ui-translations.json')['locales']['ja'])
 progress['originalMocksCompleted']=30
 progress['createdDiagrams']=20;progress['usedDiagrams']=20
 progress['mockTranslationCoverage']={l:len(existing_mock_locales.get(l,{})) for l in targets}
 progress['diagramTranslationCoverage']={l:len(caption_data['locales'].get(l,{})) for l in targets}
 progress['fullyDraftTranslatedLocalesForAllCurrentContent']=[l for l in complete if len(existing_mock_locales.get(l,{}))==1200 and len(caption_data['locales'].get(l,{}))==20 and guide_report['coverage'].get(l,0)==5]
 progress['sourceReferenceGuides']=guide_report['guides'];progress['sourceGuideTranslationCoverage']=guide_report['coverage'];progress['translatedSourceGuideLocalePairs']=guide_report['translatedGuidePairs']
 progress['specificallyAuditedTocGapsWithReferenceGuides']=sum(bool(k.get('referenceGuideIds')) for k in knowledge.values())
 progress['aiDraftDeliveryComplete']=len(progress['fullyDraftTranslatedLocalesForAllCurrentContent'])==12
 manifest['aiDraftDeliveryComplete']=progress['aiDraftDeliveryComplete'];manifest['sourceReferenceGuides']=guide_report['guides'];write(DATA/'course-manifest.json',manifest)
 remaining_locales=[l for l in targets if l not in progress['fullyDraftTranslatedLocalesForAllCurrentContent']]
 progress.setdefault('next',('Complete remaining source-bound draft translations: '+', '.join(remaining_locales)+'. ' if remaining_locales else 'All12 target locales cover the currently authored lessons, weekly questions, mocks, captions and five source-reference guides as AI drafts. ')+"Maintain source-object provenance and finish full-source atomization/coverage review; independent native/domain review and physical native-device verification remain uncertified. SSW2 excluded.")
 progress['lessonTranslationCoverage']={l:e['lessonCount'] for l,e in registry['locales'].items()};progress['questionTranslationCoverage']={l:e['questionCount'] for l,e in registry['locales'].items()};progress['previewWeeksBySpecialty']={s['id']:len(s['weeks']) for s in manifest['specialties']};write(DOCS/'progress.json',progress)
 write(STAGE/'translation-schema-normalization.json',translation_aliases)
 write(STAGE/'integration-input-digests.json',input_digests)
 write(STAGE/'source-binding-normalization.json',normalized_bindings)
 # Preserve later source-bound editorial revisions when rebuilding frozen drafts.
 subprocess.run([sys.executable,str(ROOT/'scripts/manufacturing/apply-editorial-patches.py')],check=True)
 subprocess.run([sys.executable,str(ROOT/'scripts/manufacturing/apply-locale-revisions.py')],check=True)
 subprocess.run([sys.executable,str(ROOT/'scripts/manufacturing/apply-electrical-precision.py')],check=True)
 subprocess.run([sys.executable,str(ROOT/'scripts/manufacturing/apply-reference-guide-extension.py')],check=True)
 subprocess.run([sys.executable,str(ROOT/'scripts/manufacturing/apply-diagram-extension.py')],check=True)
 print(json.dumps({'lessons':len(all_lessons),'weeklyQuestions':len(all_questions),'weeks':progress['previewWeeksBySpecialty'],'translatedLessonPairs':progress['translatedLessonLocalePairs'],'translatedQuestionPairs':progress['translatedQuestionLocalePairs'],'completeDraftLocales':complete,'courseComplete':False}))
if __name__=='__main__':main()
