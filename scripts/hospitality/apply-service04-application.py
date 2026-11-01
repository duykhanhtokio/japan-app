"""Apply an authored Japanese extension and all 12 explicit locale deltas once."""
from pathlib import Path
import json,hashlib,subprocess,copy
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/hospitality';DOC=ROOT/'docs/ssw-workspace/hospitality'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
delta=read(Path(__file__).with_name('service04-application.json'))
p=DATA/'service.json';d=read(p);l=next(l for l in d['lessons'] if l['id']=='hotel-service-04')
sid=l['id']+'-application';qid=l['id']+'-q04'
if any(s['id']==sid for s in l['sections']):raise SystemExit('Already applied; do not overwrite subsequent editing.')
oldrev=l['revision'];base=copy.deepcopy(l)
# Reject a stale original translation before touching any content.
translations={}
for locale in delta:
 if locale=='ja':continue
 file=DATA/'translations'/locale/'service.json';t=read(file)
 lesson=next(t for t in t['lessons'] if t['id']==l['id'])
 assert lesson['sourceRevision']==oldrev,(locale,'original translation stale; full review required')
 translations[locale]=(file,t,lesson)
j=delta['ja'];l['sections'].append({'id':sid,'title':j[0],'body':j[1],'sourceRefs':[{'sourceId':'hotel-1','pdfPage':33,'section':'4.具体例⑪; independently authored application'},{'sourceId':'hotel-2','pdfPage':40,'section':'4.具体例⑫; independently authored application'}]})
l['questions'].append({'id':qid,'prompt':j[2],'choices':j[3],'answerIndex':2,'explanation':j[4],'knowledgeIds':[k for k in l['knowledgeIds'] if '-seat-' in k]})
write(p,d)
subprocess.run(['node','scripts/hospitality/build.cjs'],cwd=ROOT,check=True)
l=next(l for l in read(p)['lessons'] if l['id']==base['id'])
for locale,(file,d,t) in translations.items():
 a=delta[locale];t['sections'].append({'id':sid,'title':a[0],'body':a[1]})
 t['questions'].append({'id':qid,'prompt':a[2],'choices':a[3],'answerIndex':2,'explanation':a[4],'knowledgeIds':l['questions'][-1]['knowledgeIds']})
 t['sourceRevision']=l['revision'];write(file,d)
atoms=read(DOC/'source-atoms-authoring.json')
for a in atoms['atoms']:
 if a['after']['evidence']['lessonId']==l['id']:
  a['after']['reviewedLessonRevision']=l['revision']
  a['review']['revisionCarryForward']={'date':'2026-11-01','reason':'Original teaching/assessment bytes retained; source-based application and one assessment appended.'}
  if a['atomId']=='HS1-033-11':
   q=l['questions'][-1];a['after']['questionIds'].append(qid);a['after']['questionEvidence'].append({'questionId':qid,'prompt':q['prompt'],'correctChoice':q['choices'][q['answerIndex']]})
write(DOC/'source-atoms-authoring.json',atoms)
write(DOC/'service04-translation-delta-review.json',{'date':'2026-11-01','lessonId':l['id'],'beforeRevision':oldrev,'afterRevision':l['revision'],'preservedOriginalFields':True,'addedSectionId':sid,'addedQuestionId':qid,'explicitlyTranslatedLocales':list(translations),'status':'translated_ai_unreviewed','nativeReviewed':False,'domainReviewed':False})
subprocess.run(['node','scripts/hospitality/build.cjs'],cwd=ROOT,check=True)
