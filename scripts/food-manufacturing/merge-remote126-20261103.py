"""Scoped three-way food merge; preserve both exact semantic reviews on page90."""
from pathlib import Path
import subprocess,json,gzip,hashlib,copy
R=Path(__file__).resolve().parents[2]
BASE='e4ea4f4d619ba1b0a8e146c54908430897e0f2a7';REMOTE='126c53d76733ca80a105d3e8b1b812f531148f0b'
LP='docs/ssw-workspace/source-coverage-v2/food.json';AP='docs/ssw-workspace/source-coverage-v2/food-ssw2-regions.json.gz'
OUT=R/'docs/ssw-workspace/food-manufacturing/merge-remote126-20261103';OUT.mkdir(exist_ok=True)
def git(ref,p):return subprocess.check_output(['git','show',ref+':'+p],cwd=R)
def sha(x):return hashlib.sha256(x).hexdigest()
def obj(ref,p):return json.loads(git(ref,p))
def unique(v):return list(dict.fromkeys(v))
ours_raw=(R/LP).read_bytes();assert ours_raw==git('',LP),'Working canonical changed after index snapshot'
base=obj(BASE,LP);remote=obj(REMOTE,LP);ours=json.loads(ours_raw)
before=copy.deepcopy(ours);by={u['knowledgeId']:u for u in ours['knowledgeUnits']};old={u['knowledgeId']:u for u in base['knowledgeUnits']}
added=[]
for u in remote['knowledgeUnits']:
    prior=old.get(u['knowledgeId'])
    if prior==u:continue
    assert prior is None,'Remote unexpectedly rewrote an existing food unit'
    assert u['knowledgeId']not in by,'Unit already imported; do not rerun merge'
    assert u['status']=='covered_ai'and u['sourceRefs'][0]['pdfPage']==90
    ours['knowledgeUnits'].append(copy.deepcopy(u));added.append(u['knowledgeId'])
assert len(added)==3
old_a=json.loads(gzip.decompress(git(BASE,AP)));new_a=json.loads(gzip.decompress(git(REMOTE,AP)));ours_a=json.loads(gzip.decompress((R/AP).read_bytes()))
old_pages={p['pdfPage']:p for p in old_a['pages']};new_pages={p['pdfPage']:p for p in new_a['pages']};merged_objects=[]
for page in ours_a['pages']:
    n=page['pdfPage'];bp=old_pages[n];rp=new_pages[n]
    assert len(page['elements'])==len(bp['elements'])==len(rp['elements'])
    for here,b,r in zip(page['elements'],bp['elements'],rp['elements']):
        assert here['elementId']==b['elementId']==r['elementId']
        if r==b:continue
        assert n==90,'Unexpected incoming page; requires separate source self-review'
        for key in ['elementId','sha256','bbox','kind']:assert here[key]==b[key]==r[key],key
        previous=copy.deepcopy(here)
        here['knowledgeIds']=unique(here['knowledgeIds']+r['knowledgeIds'])
        if r['classification']=='knowledge' or here['classification']=='knowledge':here['classification']='knowledge'
        if r.get('reason')!=b.get('reason'):
            reasons=unique([x for x in [here.get('reason'),r.get('reason')]if x]);here['reason']=' | '.join(reasons)
        reviews=unique([x for x in [*here.get('semanticReviewRefs',[]),here.get('semanticReviewRef'),r.get('semanticReviewRef')]if x])
        if reviews:here['semanticReviewRefs']=reviews;here['semanticReviewRef']=here.get('semanticReviewRef')or reviews[-1]
        merged_objects.append({'elementId':here['elementId'],'oursBefore':previous,'remoteIncoming':r,'mergedKnowledgeIds':here['knowledgeIds'],'mergedReviewRefs':reviews})
for page in ours['pages']:
    if page['sourceId']!='food-2' or page['pdfPage']!=90:continue
    p=next(p for p in ours_a['pages']if p['pdfPage']==90);page['knowledgeIds']=unique(page['knowledgeIds']+[id for e in p['elements']for id in e['knowledgeIds']])
    assert page['semanticInventory']['status']=='partial','Do not infer complete page90 inventory'
packed=gzip.compress((json.dumps(ours_a,ensure_ascii=False,indent=2)+'\n').encode(),mtime=0)
for p in ours['pages']:
    if p['regionCensus']['artifactPath']==AP:p['regionCensus']['sha256']=sha(packed)
for u in before['knowledgeUnits']:assert next(x for x in ours['knowledgeUnits']if x['knowledgeId']==u['knowledgeId'])==u,'Existing unit changed'
assert ours['denominator']==before['denominator']and ours['wholeSourceKnowledgeCovered']is False
imports=['docs/ssw-workspace/food-manufacturing/control-checksheet-source-review-20261103.json','docs/ssw-workspace/food-manufacturing/control-checksheet-validation-20261103.json','docs/ssw-workspace/food-manufacturing/reverse-bindings-20261103.json','scripts/food-manufacturing/audit-reverse-bindings.cjs','scripts/food-manufacturing/bind-control-checksheet-20261103.cjs']
imported=[]
for p in imports:
    data=git(REMOTE,p);f=R/p
    if f.exists():assert f.read_bytes()==data,'Existing different file requires explicit review: '+p
    f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(data);imported.append({'path':p,'sha256':sha(data)})
(R/LP).write_text(json.dumps(ours,ensure_ascii=False,indent=2)+'\n');(R/AP).write_bytes(packed)
report={'schemaVersion':1,'mergeBase':BASE,'incomingCommit':REMOTE,'scope':'Food only; no repository merge performed','source90SelfReview':'Already read source90 text/image in audit65. Re-read current base teaching plus q066/q298/q067, all options/answers/rationales. Incoming claims directly match side-bias, rising trend and checksheet confirmation/recording. No universal run-count rule is introduced. Existing line-name units are different competencies.','addedIncomingUnits':added,'ourUnitCountRetained':len(before['knowledgeUnits']),'everyOurUnitRetainedExact':True,'everyAddedIncomingUnitRetainedExact':all(next(x for x in ours['knowledgeUnits']if x['knowledgeId']==u['knowledgeId'])==u for u in remote['knowledgeUnits']if u['knowledgeId']in added),'mergedSourceObjects':len(merged_objects),'source90InventoryStill':'partial','objects':merged_objects,'importedRemoteSnapshotFiles':imported,'remoteSnapshotsAreHistorical':'Remote control/reverse reports describe121units/4partial before audit65 reconciliation. Current canonical ledger is authoritative; a fresh merged reverse inventory is separate.','sourceDenominator':'open','wholeSourceKnowledgeCovered':False,'sourceCoveragePercent':None,'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False,'appContentChangedByThisMerge':False,'audioAcceptanceInferred':False}
(OUT/'self-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'SCOPED_FOOD_MERGE_WRITTEN','preservedOurUnits':len(before['knowledgeUnits']),'incomingUnitsAdded':len(added),'mergedSourceObjects':len(merged_objects),'totalUnits':len(ours['knowledgeUnits'])}))
