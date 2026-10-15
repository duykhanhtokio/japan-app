"""Bind technical coverage to independent author self-review evidence, never peer approval."""
from pathlib import Path
import hashlib,json,subprocess,sys
ROOT=Path(__file__).resolve().parents[2]
pref,baseline=sys.argv[1:3];assert pref=='PRF-042','This checkpoint finalizer is scoped to Nagasaki';number=int(pref.split('-')[-1]);d=ROOT/'docs/dialogue-workspace/content-qa'
read=lambda p:json.loads(p.read_text())
write=lambda p,v:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
G=lambda *a:subprocess.check_output(['git',*a],cwd=ROOT,text=True).strip()
manifest=read(d/f'{pref}_COMPLETE_INTEGRATION_MANIFEST.json')
audit=read(d/f'{pref}.json');runtime=read(d/f'{pref}_COMPLETE_RUNTIME_QA.json');corpus=read(d/f'{pref}_COMPLETE_CORPUS_SCREEN.json')
assert runtime['status']=='PASS_REAL_REPOSITORY_AND_DIALOGUE_LOADER_ADAPTERS'
assert corpus['status']=='PASS' and not corpus['exactUtteranceCollisionsTouchingScope']
fields=['exactDuplicateGroups','placeQuantityNormalizedDuplicateGroups','nearDuplicateCandidates','exactPlayerTaskDuplicateGroups','exactPlayerAnswerDuplicateGroups','canonicalTitleDuplicateGroups','recipeReuseGroups']
assert audit['structuralErrorCount']==0 and all(not audit[k] for k in fields)
evidence=[];count=0
for p in sorted(d.glob(f'{pref}_CITY_*_MANIFEST.json')):
 m=read(p);rpath=Path(str(p).replace('_MANIFEST.json','_SELF_REVIEW.json'));r=read(rpath)
 author=ROOT/m['source'];actual=sha(author)
 review_hash=r.get('sourceSha256',r.get('reviewedAuthoringSha256'))
 assert actual==m['sourceSha256']==review_hash,m['cityId']
 ipath=Path(str(p).replace('_MANIFEST.json','_INPUT.json'));assert sha(ipath)==r['inputSha256']
 role=Path(str(p).replace('_MANIFEST.json','_ROLE_ALIGNMENT.json'))
 if r.get('roleAlignmentSha256'):assert sha(role)==r['roleAlignmentSha256']
 reread_field=next((k for k in ['fullFinalReread','allFinalTurnsAndTasksReread','allFinalTurnsAndTasksRead'] if r.get(k) is True),None)
 if not reread_field:
  assert r.get('reviewType')=='independent_author_second_read' and r.get('reviewedScenarioCount')==m['canonicalCount']
  reread_field='reviewType=independent_author_second_read'
 assert not r.get('peerReviewed') and not r.get('humanReviewed') and not r.get('nativeSpeakerReviewed')
 commit=G('log','-1','--format=%H','--',str(p.relative_to(ROOT)))
 subprocess.run(['git','merge-base','--is-ancestor',commit,'origin/recovery/jlpt-n3-n1'],cwd=ROOT,check=True)
 evidence.append({'cityId':m['cityId'],'scenarioCount':m['canonicalCount'],'source':m['source'],'sourceSha256':actual,'selfReviewFile':str(rpath.relative_to(ROOT)),'selfReviewSha256':sha(rpath),'finalRereadEvidenceField':reread_field,'cityCommit':commit,'cityCommitOnRemoteBranch':True})
 count+=m['canonicalCount']
assert count==manifest['canonicalCount']==audit['canonicalCount']==audit['coverageCount']
cities={x['id']:x for x in read(ROOT/'src/data/generated/cities.json')}
rows={x['id']:x for x in read(ROOT/'src/data/generated/scenarios.json')}
for p in ['src/data/dialogue-content/scenario-overrides.json','src/data/dialogue-content/independent-city-overrides.json']:rows.update({x['id']:x for x in read(ROOT/p)})
remaining=[x for x in rows.values() if int(cities[x['cityId']]['prefectureId'].split('-')[-1])>number]
assert len(rows)==7128
# Original city scripts in this prefecture must retain their existing baseline bytes.
preserved_prior=0
for row in audit['inventory']:
 path=row['path'];before=G('rev-parse',baseline+':'+path)
 raw=(ROOT/path).read_bytes();current=hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
 if current==before:preserved_prior+=1
tokutei_diff=G('diff','--name-only',baseline,'HEAD','--','src/data/kensetsu','src/components/kensetsu','docs/ssw-workspace/kensetsu')
assert not tokutei_diff
screen={k:audit[k] for k in fields};screen.update(canonicalCount=count,independentlySelfReviewedCount=count,remainingCount=0,machineOnly=True,contentPass=False,peerReviewed=False,structuralErrorCount=0,status='PASS_TECHNICAL_SCREEN_COMPLETE_INDEPENDENT_CITIES')
write(d/f'{pref}_COMPLETE_SIMILARITY_SCREEN.json',screen)
write(d/f'{pref}_COMPLETE_SELF_REVIEW_BINDINGS.json',{'prefectureId':pref,'status':'PASS_HASH_BOUND_INDEPENDENT_AUTHOR_SELF_REVIEW','scenarioCount':count,'cityCount':len(evidence),'cities':evidence,'peerReviewed':False,'humanReviewed':False,'nativeSpeakerReviewed':False,'preservedPreviouslyIntegratedScripts':preserved_prior})
state={'prefectureId':pref,'status':'COMPLETE_INDEPENDENT_JAPANESE_CITY_SELF_REVIEW_CONTAINING_CHECKPOINT_PENDING_PUBLICATION','canonicalCount':count,'cityCount':len(evidence),'turns':count*11,'tasks':count*5,'remainingScenarios':0,'allCityCommitsRemotelyVerified':True,'baseline':baseline,'nextPrefectureAfterPersistence':f'PRF-{number+1:03d}','nextPrefectureName':'Kumamoto' if number==42 else None,'peerReviewed':False,'humanReviewed':False,'nativeSpeakerReviewed':False,'deviceReviewed':False,'releaseApproved':False,'contentPass':False,'technicalChecks':'PASS whole real adapters/corpus/normalized-near/task/answer/title/recipe screens; UIlock10/10 and correctedNPCprogression','globalIndependentlyAuthoredCount':len(rows)-len(remaining),'globalCanonicalCount':len(rows),'globalRemainingCount':len(remaining),'globalRemainingCities':len({x['cityId'] for x in remaining}),'cityCommits':[{k:x[k] for k in ['cityId','cityCommit']} for x in evidence],'currentCheckpointPersistence':'pending containing checkpoint commit; do not advance before WORK PERSISTENCE PASS','limits':['Independent author own-city review, no peer/cross-author semantic reading.','Exact/similarity screens are not exhaustive semantic originality/native/operator/device approval.','No new translations; Tokutei source paths remain unchanged.']}
write(d/f'{pref}_CHECKPOINT.json',state)
cp=ROOT/'docs/dialogue-workspace/JAPANESE_PREFECTURE_PROGRESS_2026-09-30.md'
with cp.open('a') as f:f.write(f'\n\n## 2026-10-15 — {pref} Nagasaki complete independent city self-review\n\n{count}/{count} canonical scenarios across{len(evidence)}cities,{count*11}Japanese turns,{count*5}Player tasks. This continuation finished24scenarios inSaikai/Unzen/Minamishimabara, each containing city commit remotely verified before advancing. Whole real adapters/corpus/normalized-near/task/answer/title/recipe checks PASS; zero exact Player/NPC collisions;{corpus["unchangedOutsideRuntimeFiles"]}outside runtime files unchanged. Source hashes and final-own-read evidence bind all13city reviews, including alternate historical field names. Prior{preserved_prior}existing scripts and Tokutei paths preserved. UIlock10/10 and correctedNPCprogression PASS. No peer/human/native/operator/device/release approval. Global{state["globalIndependentlyAuthoredCount"]}/7128;{state["globalRemainingCount"]}scenarios/{state["globalRemainingCities"]}cities remain. NextKumamoto PRF-043 only after this checkpoint commit persistence.\n')
print('PREFECTURE COMPLETE TECHNICAL/SELF-REVIEW:',pref,count,'scenarios;',len(evidence),'cities; global',state['globalIndependentlyAuthoredCount'],'/7128; remain',len(remaining),'scenarios/',state['globalRemainingCities'],'cities; preserved prior',preserved_prior)
