"""Deterministically assemble new forms from existing source-bound questions.

No question, answer, translation or source asset is rewritten by this tool.
"""
from pathlib import Path
import hashlib
import json
import random
import re

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / 'docs/ssw-workspace/manufacturing/batch28-reference-exams'
PLANS = {
 'mechanical': {'theory':[1,2,5,6,7,8,9,10,11,12,13,14,17,18,19,21,22,24,25,26,27,28,30,31,36,38,58,59,64,81], 'practical':[6,12,14,18,19,21,25,36,42,49]},
 'electrical': {'theory':[1,2,3,5,6,8,10,11,12,13,15,16,17,18,19,20,21,22,23,24,28,29,30,31,35,36,44,45,50,55], 'practical':[1,3,4,6,12,17,20,28,30,36]},
 'surface': {'theory':[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,23,24,26,27,28,29,33,36,44], 'practical':[2,3,5,6,7,9,10,14,22,28]}}
TITLES={'mechanical':'機械金属加工','electrical':'電気電子機器組立て','surface':'金属表面処理'}

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def read(p): return json.loads(p.read_bytes())
def object_sha(v): return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def build():
 pack={'schemaVersion':1,'scopeLevel':'1','kind':'curated_existing_question_practice','countedAsNewOriginalQuestions':False,
       'referenceInventorySha256':sha(STAGE/'reference-inventory.json'),'sourceBankSha256':{},'preservedOriginalForms':30,
       'additionalForms':3,'uniqueOriginalQuestionBankSize':1200,
       'timingPolicy':{'referenceTotalMinutes':80,'practiceSectionMinutes':[40,40],'referenceConfirmsSeparate40MinuteClocks':False,
                       'note':'Retains the established training runner split; uploaded covers confirm total80 only.'},'forms':[]}
 for specialty,plan in PLANS.items():
  path=ROOT/'src/data/manufacturing/mocks'/f'{specialty}.json'
  bank=read(path)['exams'];pack['sourceBankSha256'][str(path.relative_to(ROOT))]=sha(path)
  lessons={l['id']:l for l in read(ROOT/f'src/data/manufacturing/{specialty}.json')['lessons']}
  form={'id':f'mfg1-{specialty}-reference-practice-2025-01','specialty':specialty,
        'titleJa':TITLES[specialty]+' 参照形式・再構成01（既習問題）','kind':'mock','officialSimulation':True,
        'assemblyType':'curated_existing_bank_not_new_questions','sections':{}}
  for section,nums in plan.items():
   pools={n:[] for n in nums}
   for exam in bank:
    for q in exam['sections'][section]['questions']:
     n=int(re.search(r'(\d+)$',q['lessonId']).group(1))
     if n in pools:pools[n].append(q)
   assert all(pools.values()),(specialty,section,'Missing taught topic')
   rng=random.Random(specialty+section+'20251028')
   for trial in range(20000):
    selected=[rng.choice(pools[n]) for n in nums];rng.shuffle(selected)
    keys=[q['correctIndex'] for q in selected];counts=[keys.count(i) for i in range(2 if section=='theory' else 4)]
    if section=='theory' and counts!=[15,15]:continue
    if section=='practical' and sorted(counts)!=[2,2,3,3]:continue
    if any(keys[i]==keys[i+1]==keys[i+2] for i in range(len(keys)-2)):continue
    break
   else:raise AssertionError(('No balanced selection',specialty,section))
   form['sections'][section]={'id':form['id']+'-'+section,'durationMs':2400000,
     'passMinimumCorrect':20 if section=='theory' else 6,
     'selection':[{'id':q['id'],'sourceHash':q['sourceHash'],'lessonId':q['lessonId'],
       'lessonSourceHash':q['lessonSourceHash'],'lessonTitleJa':lessons[q['lessonId']]['titleJa']} for q in selected],
     'answerCounts':counts}
  form['revision']=object_sha(form);pack['forms'].append(form)
 return pack

if __name__=='__main__':
 value=build();payload=(json.dumps(value,ensure_ascii=False,indent=2)+'\n').encode()
 (STAGE/'selection-manifest.json').write_bytes(payload)
 (ROOT/'src/data/manufacturing/reference-practice.json').write_bytes(payload)
 print(json.dumps({'status':'PASS','newAssemblies':3,'reusedQuestionAppearances':120,'newOriginalQuestions':0}))
