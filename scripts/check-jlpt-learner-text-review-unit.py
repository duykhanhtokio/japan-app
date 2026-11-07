"""Reproduce dated text-review integration evidence; does not perform semantic or acoustic review."""
import hashlib,json,pathlib,subprocess,sys
root=pathlib.Path(__file__).resolve().parents[1]
unit=sys.argv[1]; level,num=unit.split('-')
p=root/f'src/data/jlpt-original/{level}/{num}/master.ja.json'
d=json.loads(p.read_text()); a=json.loads(p.with_name('audio.manifest.json').read_text())
r=json.loads((root/f'docs/jlpt-workspace/learner-content-audit-20261107/{unit}.json').read_text())
h=hashlib.sha256(p.read_bytes()).hexdigest()
assert r['masterSha256']==h,(unit,'receipt hash')
ids=[q['id'] for q in d['questions']]
review=r.get('textSemanticReview',{})
readids=r.get('reviewedQuestionIds',review.get('reviewedQuestionIds',review.get('questionIdsRead')))
assert readids is not None and set(readids)==set(ids) and len(readids)==len(ids),(unit,'review ID coverage')
assert a.get('currentMasterSha256',a['masterSha256'])==h,(unit,'audio metadata master binding')
assert r.get('releaseReady') is False,(unit,'release flag')
assert r.get('actualAudioHeard') is False,(unit,'hearing flag')
assert r.get('pronunciationVerified') is False,(unit,'pronunciation flag')
base='3baa71640f9cde91c20ff5233096d826abccd495'
rel=str(p.relative_to(root));b=json.loads(subprocess.check_output(['git','show',base+':'+rel],cwd=root))
assert ids==[q['id'] for q in b['questions']],(unit,'question identity')
assert [(q['id'],q['correctOptionId']) for q in d['questions']]==[(q['id'],q['correctOptionId']) for q in b['questions']],(unit,'answer keys changed')
old_a=json.loads(subprocess.check_output(['git','show',base+':'+str(p.with_name('audio.manifest.json').relative_to(root))],cwd=root))
assert a['items']==old_a['items'],(unit,'recorded manifest items changed')
assert a['continuousSha256']==old_a['continuousSha256'],(unit,'audio bytes hash changed')
assert [(q['id'],q['script']) for q in d['questions'] if q['section']=='listening']==[(q['id'],q['script']) for q in b['questions'] if q['section']=='listening'],(unit,'spoken scripts changed')
for q in d['questions']:
 assert sum(o['id']==q['correctOptionId'] for o in q['options'])==1,(unit,q['id'],'answer reference')
 assert len({''.join(o['text'].split()) for o in q['options']})==len(q['options']),(unit,q['id'],'duplicate choices')
 if 'ordering' in q:
  order=q['ordering']; seq=list(map(str,order['solutionOptionIds'])); lookup={o['id']:o['text'] for o in q['options']}
  assert sorted(seq)==sorted(lookup),(unit,q['id'],'ordering permutation')
  assert seq[order['starSlot']-1]==q['correctOptionId'],(unit,q['id'],'nested star mapping')
  sentence=order.get('prefix','')+''.join(lookup[i] for i in seq)+order.get('suffix','')
  assert ''.join(sentence.split())==''.join(order['completedSentence'].split()),(unit,q['id'],'ordering sentence')
 if 'solutionOrder' in q:
  assert str(q['solutionOrder'][q['starSlot']-1])==q['correctOptionId'],(unit,q['id'],'star mapping')
qa=root/f'docs/jlpt-workspace/original/{unit}/qa.json'
if qa.exists():
 j=json.loads(qa.read_text())
 assert j.get('masterSha256',h)==h,(unit,'qa binding')
print(json.dumps({'unit':unit,'questions':len(ids),'masterSha256':h,'integrationChecks':'PASS'}))
