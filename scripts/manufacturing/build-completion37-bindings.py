"""Bind additive lessons and checks to the exact authored teaching revisions."""
from pathlib import Path
import hashlib, json

ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'src/data/manufacturing/completion37'
def sha(value):
    return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def build():
    lessons,checks={},{}
    for specialty in ('mechanical','electrical','surface'):
        data=json.loads((DATA/(specialty+'.json')).read_text())
        for lesson in data['lessons']:
            core={k:v for k,v in lesson.items() if k!='sourceHash'}
            assert sha(core)==lesson['sourceHash'], 'Lesson digest drift: '+lesson['id']
            assert lesson['id'] not in lessons
            lessons[lesson['id']]=lesson['sourceHash']
        for exam in data['checks']:
            question_hashes={}
            teaching={}
            for q in exam['questions']:
                core={k:v for k,v in q.items() if k!='sourceHash'}
                assert sha(core)==q['sourceHash'], 'Question digest drift: '+q['id']
                question_hashes[q['id']]=q['sourceHash']
                teaching[q['lessonId']]=lessons[q['lessonId']]
            checks[exam['id']]={'revision':exam['revision'],'questionIds':[q['id'] for q in exam['questions']],'questionHashes':question_hashes,'lessonSourceHashes':teaching}
    return {'schemaVersion':1,'lessons':lessons,'checks':checks}

if __name__=='__main__':
    payload=build()
    (DATA/'bindings.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'status':'PASS','lessons':len(payload['lessons']),'checks':len(payload['checks'])}))
