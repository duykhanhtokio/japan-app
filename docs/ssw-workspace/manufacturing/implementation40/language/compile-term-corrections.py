"""Compile disjoint semantic reviews; reject stale or duplicate identities."""
import json,hashlib,collections
from pathlib import Path
ROOT=Path(__file__).resolve().parents[5]; BASE=ROOT/'docs/ssw-workspace/manufacturing/implementation40'; OUT=BASE/'language'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
inputs=read(OUT/'canonical-current-term-review-input.json')['records']; bykey={r['key']:r for r in inputs}
reviewSources=[('language/vi-en-review.json','records'),('terminology-id/review.json','reviews'),('terminology-zh-cn/review.json','reviews'),('terminology-zh-tw/decisions.json','records'),('terminology-hi-bn-ne/semantic-decisions.json','decisions'),('terminology-my-th/semantic-decisions.json','decisions'),('terminology-km/review.json','reviews'),('terminology-southeast/tl-review.json','records')]
merged=[]; seen=set(); receipts=[]
for name,field in reviewSources:
 path=BASE/name; data=read(path); rows=data[field]; filehash=sha(path); receipts.append({'file':name,'sha256':sha(path),'records':len(rows)})
 for r in rows:
  if 'locale' not in r:r={**r,'locale':data['locale']}
  identity=(r['key'],r['locale']); assert identity not in seen,identity;seen.add(identity)
  target=bykey[r['key']]['targets'][r['locale']]
  assert r['targetSha256']==target['sha256'],identity
  assert r['lessonSourceHash']==bykey[r['key']]['sourceHash'],identity
  merged.append({**r,'provenanceFile':name,'provenanceSha256':filehash})
assert len(seen)==12924
pending=[r for r in merged if 'unread' in r.get('decision','').lower()]
assert not pending, f'{len(pending)} unread decisions remain; wait for final KM'
proposalSources=[('language/vi-en-corrections.json','patches'),('terminology-id/corrections.json','corrections'),('terminology-zh-cn/corrections.json','corrections'),('terminology-zh-tw/corrections.json','corrections'),('terminology-hi-bn-ne/correction-proposals.json','corrections'),('terminology-my-th/correction-proposals.json','corrections')]
proposals=[]
for name,field in proposalSources:
 path=BASE/name
 for r in read(path)[field]:proposals.append({**r,'proposalFile':name,'proposalSha256':sha(path)})
# KM/TL owners keep exact changed wording in their reviewed decision records.
for r in merged:
 if r['locale'] in ['km','tl'] and r.get('after') and r.get('before')!=r['after']:
  assert 'pending' not in r['decision'].lower();proposals.append({**r,'proposalFile':r['provenanceFile']})
clarifications=[read(OUT/'canonical-meaning-clarification.json')]+read(OUT/'canonical-meaning-clarifications-extra.json')['clarifications']
clarificationKeys={(f"{c['lessonId']}:term:{c['termIndex']}",l) for c in clarifications for l in c['wording']}
patches={}; superseded=[]
for r in proposals:
 key,locale=r['key'],r['locale'];identity=(key,locale); canonical=bykey[key]; target=canonical['targets'][locale]
 assert r['before']==target['meaning'] and r['targetSha256']==target['sha256'],identity
 assert r['lessonSourceHash']==canonical['sourceHash'],identity
 if identity in clarificationKeys:superseded.append(r);continue
 lesson,index=key.split(':term:')
 rawfile,rawpointer=canonical['canonicalPath'].split('#'); rawterm=read(ROOT/rawfile)
 for token in rawpointer.strip('/').split('/'):rawterm=rawterm[int(token)] if isinstance(rawterm,list) else rawterm[token]
 patch=dict(lessonId=lesson,termIndex=int(index),termJa=canonical['termJa'],meaningJa=rawterm['meaningJa'],sourceHash=canonical['sourceHash'],locale=locale,before=r['before'],after=r['after'],proposalFile=r['proposalFile'],targetSha256=r['targetSha256'])
 if identity in patches:assert patches[identity]['after']==patch['after'],identity
 patches[identity]=patch
for c in clarifications:
 key=f"{c['lessonId']}:term:{c['termIndex']}";canonical=bykey[key];assert c['sourceHash']==canonical['sourceHash'] and c['canonicalMeaningBefore']==canonical['meaningJa']
 for locale,w in c['wording'].items():
  expected=canonical['meaningJa'] if locale=='ja' else canonical['targets'][locale]['meaning'];assert w['before']==expected,(key,locale)
  patches[(key,locale)]=dict(lessonId=c['lessonId'],termIndex=c['termIndex'],termJa=c['termJa'],meaningJa=c['canonicalMeaningBefore'],sourceHash=c['sourceHash'],locale=locale,before=w['before'],after=w['after'],proposalFile='language/canonical-meaning-clarification'+('' if c==clarifications[0] else 's-extra')+'.json',changeKind='source_context_clarification',targetSha256=hashlib.sha256(w['before'].encode()).hexdigest())
result=dict(schemaVersion=1,patches=list(patches.values()),nativeReviewed=False,domainReviewed=False)
save(ROOT/'src/data/manufacturing/implementation40/term-corrections.json',result)
indexFields=['key','locale','decision','targetSha256','lessonSourceHash','provenanceFile','provenanceSha256']
indexRows=[{field:r[field] for field in indexFields} for r in merged]
index=dict(indexByReference=True,scope='Compact identity and decision index; full contextual decisions remain in the eight SHA-256-bound reviewSources files.',reviewSources=receipts,uniqueDecisions=len(merged),perLocale=dict(collections.Counter(r['locale'] for r in merged)),unread=0,nativeReviewed=False,domainReviewed=False,records=indexRows)
(OUT/'merged-term-semantic-review.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':'))+'\n')
save(OUT/'term-compilation-receipt.json',dict(status='PASS',reviewSources=receipts,uniqueSemanticDecisions=len(merged),perLocale=dict(collections.Counter(r['locale'] for r in merged)),patches=len(patches),patchesPerLocale=dict(collections.Counter(r['locale'] for r in patches.values())),sourceContextClarifications=len(clarifications),supersededProposalCount=len(superseded),superseded=superseded,outputSha256=sha(ROOT/'src/data/manufacturing/implementation40/term-corrections.json'),nativeReviewed=False,domainReviewed=False))
print('PASS',len(merged),'review decisions;',len(patches),'guarded patches')
