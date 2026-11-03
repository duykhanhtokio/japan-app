"""Validate all Shikoku full-context receipts against current source and locale files."""
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'docs/localization-workspace/region-review/shikoku-20261103'
LOCALES={'vi','en','id','tl','zh-CN','zh-TW','hi','bn','ne','my','th','km'}
def read(path):return json.loads(path.read_text())
def sha(text):return hashlib.sha256(text.encode()).hexdigest()
idx=read(ROOT/'src/data/dialogue-content/locale-batch-index.json')
queue=read(ROOT/'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json')
prefs=[p for p in queue['prefectures'] if p['prefectureId'] in {'PRF-036','PRF-037','PRF-038','PRF-039'}]
members={s for p in prefs for c in p['cities'] for k in ('sentenceTaskReviewedScenarioIds','pendingSentenceTaskScenarioIds') for s in c[k]}
cache={}
def load(path):
 if path not in cache:cache[path]=read(ROOT/path)
 return cache[path]
complete=set();fields=0;changes=0
for path in sorted(BASE.glob('worker-*.json')):
 r=read(path);ids=set(r['scenarios'])
 assert len(ids)==len(r['scenarios']) and ids<=members and not ids&complete
 assert r['nativeReviewed'] is False and r['semanticCrossReview'] is False
 reviews={s:set() for s in ids}
 for review in r['reviews']:
  sid,locale=review['scenarioId'],review['locale'];assert sid in ids and locale in LOCALES and locale not in reviews[sid]
  reviews[sid].add(locale);batch=idx[sid]
  source=load(f'docs/localization-workspace/sources/dialogue-batch-{batch}.ja.json')['scenarios'][sid]['turns']
  target=load(f'src/data/dialogue-content/locale-batches/{locale}/{batch}.json')['scenarios'][sid]['turns']
  expected={(tid,k) for tid,t in source.items() for k,sk in [('translation','sourceJa'),('hintTranslation','hintJa')] if sk in t}
  assert len(review['fields'])==16 and expected=={(f['turnId'],f['field']) for f in review['fields']}
  for f in review['fields']:
   tid,key=f['turnId'],f['field'];sk='sourceJa' if key=='translation' else 'hintJa'
   assert source[tid][sk]==target[tid][sk]
   assert sha(source[tid][sk])==f['sourceSha256'] and sha(target[tid][key])==f['targetSha256'],(sid,locale,tid,key)
   fields+=1
 assert all(v==LOCALES for v in reviews.values())
 for c in r['changes']:
  assert c['scenarioId'] in ids and c['locale'] in LOCALES
  expected=f"src/data/dialogue-content/locale-batches/{c['locale']}/{idx[c['scenarioId']]}.json"
  assert c['path']==expected and load(expected)['scenarios'][c['scenarioId']]['turns'][c['turnId']][c['field']]==c['after']
  changes+=1
 complete|=ids
assert fields==len(complete)*192
registered={s for p in prefs for c in p['cities'] for s in c['sentenceTaskReviewedScenarioIds']}
assert complete<=registered
print(json.dumps({'status':'PASS','region':'shikoku','receiptedScenarios':len(complete),'total':len(members),'reviewedFields':fields,'changedFields':changes,'nativeReviewed':False,'semanticCrossReview':False}))
