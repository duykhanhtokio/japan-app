"""Bind restaurant progress/translations to canonical semantic content; no content authoring."""
from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'src/data/restaurant'
def read(p): return json.loads(p.read_text())
def write(p,x): p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(x): return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def semantic(x):
 if isinstance(x,dict):return {k:semantic(v) for k,v in x.items() if k not in ('sourceHash','revision','knowledgeIds','review','reviewStatus','furigana')}
 if isinstance(x,list):return [semantic(v) for v in x]
 return x
def content_hash(x): return sha(semantic(x))
def main():
 lessons=[];exams=[];questions=[]
 for level in ('1','2'):
  p=DATA/f'lessons.{level}.ja.json'
  if p.exists():
   x=read(p)
   for l in x['lessons']:l['sourceHash']=content_hash(l)
   write(p,x);lessons+=x['lessons']
  p=DATA/f'exams.{level}.ja.json'
  if p.exists():
   x=read(p)
   for e in x['exams']:
    for q in e['questions']:q['sourceHash']=content_hash(q)
    e['sourceHash']=content_hash(e);e['revision']=e['sourceHash'];questions+=e['questions']
   write(p,x);exams+=x['exams']
 # Never add sourceHash to an existing translation blindly. Translator must supply
 # the canonical hash/revision it actually translated; root may bind only reviewed
 # originals through explicit --bind list after checking source compatibility.
 manifest={'schemaVersion':1,'sector':'外食業','contentVersion':'2026-10-26-v1','canonicalLanguage':'ja','minutesPerDay':30,'officialExamSimulation':False,'authoringStatus':'in_progress','domainReviewed':False,'nativeReviewed':False,'locales':['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'],'levels':{}}
 for level in ('1','2'):
  ls=[l for l in lessons if l['level']==level];weeks=[]
  for w in sorted({l['week'] for l in ls}):
   ordered=sorted([l for l in ls if l['week']==w],key=lambda l:l['day'])
   weeks.append({'id':f'rst-{level}-w{w:02}','number':w,'titleJa':ordered[0].get('weekTitleJa',ordered[0]['titleJa']),'lessonIds':[l['id'] for l in ordered]})
  es=[e for e in exams if e['level']==level]
  manifest['levels'][level]={'weeks':weeks,'lessonCount':len(ls),'practiceExamCount':sum(e['kind']=='practice' for e in es),'practiceQuestionCount':sum(len(e['questions']) for e in es if e['kind']=='practice'),'weeklyExamCount':sum(e['kind']=='weekly' for e in es),'targetPracticeExams':10,'targetPracticeQuestions':400}
 manifest['contentHash']=sha({'lessons':[(l['id'],l['sourceHash']) for l in lessons],'exams':[(e['id'],e['sourceHash']) for e in exams]})
 write(DATA/'course-manifest.json',manifest)
 print(json.dumps({l:{k:v for k,v in d.items() if k!='weeks'} for l,d in manifest['levels'].items()}))
if __name__=='__main__':main()
