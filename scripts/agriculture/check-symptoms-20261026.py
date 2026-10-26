"""Check original asset bytes, bounded source claims and preservation for the three symptom examples."""
import hashlib,json
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];W=ROOT/'docs/ssw-workspace/agriculture'
def read(p):return json.loads(p.read_text())
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def h(value):return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
m=read(W/'symptoms-20261026-manifest.json');baseline=m['baseline']
registry=read(ROOT/'src/data/agriculture/recognition-images.json')['images'];byid={x['id']:x for x in registry}
assert len(registry)==len(byid)==42 and len(m['newRecognitionImageIds'])==3
for old in baseline['registryImages']:assert h(byid[old['id']])==old['sha256']
for p,sha in baseline['unchangedFiles'].items():assert digest(ROOT/p)==sha,p
component=(ROOT/'src/components/agriculture/RecognitionImages.tsx').read_text();prior=component
for rid in m['newRecognitionImageIds']:
 row=byid[rid];assert row['kind']=='crop_symptom_illustration' and row['scopeLevels']==['2']
 assert all(row[f] is False for f in ['humanReviewed','nativeReviewed','domainReviewed','releaseReady','sourcePhotoObjectiveComplete','sourceImagesRedistributed'])
 assert row['sourceOccurrencesClosed']==0 and row['sources']==[dict(documentId='AGR-S2',pdfPage=130,printedPage=128)]
 for field in ['titleJa','altJa','observationJa','limitJa']:assert isinstance(row[field],str) and row[field].strip()
 assert 'だけで' in row['limitJa'] and '農薬' in row['limitJa']
 asset=ROOT/row['assetPath'];assert digest(asset)==row['assetSha256']
 with Image.open(asset) as im:assert im.size==(row['width'],row['height'])==(1024,1024)
 author=read(ROOT/row['authorEvidencePath']);review=read(ROOT/row['reviewEvidencePath'])
 assert review['authorPacketSha256']==digest(ROOT/row['authorEvidencePath'])
 assert review['status']=='complete_self_review_not_independent' and not review['unresolvedBlockingIssues']
 assert review['independentAiReviewed'] is author['independentAiReviewed'] is False
 for field in ['titleJa','altJa','observationJa','limitJa','assetSha256','photoInventoryIds','sourceItemIds']:assert row[field]==author[field]
 assert author['provenance']['referenceImages']==[] and author['provenance']['sourcePdfOrSourceImageUsedAsGenerationInput'] is False
 assert author['sourceVerification']['originalPdfSha256']=='c19741bd8f6128a80d9d9f9e3ab39e8a5e9eb969a30f51771c47527ef6190a12'
 line=" '"+row['assetKey']+"':require('../../../"+row['assetPath']+"'),\n"
 assert prior.count(line)==1;prior=prior.replace(line,'',1)
 # The inserted line includes a separate newline immediately before it.
 prior=prior.replace('\n\n};\ntype RecognitionImage=','\n};\ntype RecognitionImage=',1)
assert hashlib.sha256(prior.encode()).hexdigest()==baseline['componentSha256'],'Non-require component change'
inventory=read(W/'recognition-inventory.json');inventory_byid={x['id']:x for x in inventory['entries']}
newlinks={i:r for r in registry if r['id'] in m['newRecognitionImageIds'] for i in r['photoInventoryIds']}
for rid,sha in baseline['inventoryEntries'].items():
 entry=dict(inventory_byid[rid])
 if rid in newlinks:
  assert entry.pop('originalIllustrationAssetId')==newlinks[rid]['id']
  assert entry.pop('originalIllustrationAvailable') is True
  assert entry.pop('sourcePhotoObjectiveComplete') is False
 assert h(entry)==sha,rid
assert sum(x.get('originalIllustrationAvailable') is True for x in inventory['entries'])==36
figures={x['id']:x for x in read(W/'illustration-register.json')['figures']}
for old in baseline['figures']:assert h(figures[old['id']])==old['sha256']
assert len(figures)==len(baseline['figures'])+3
if 'browserQa' in m:
 qa=read(W/m['browserQa']['file']);tested=read(W/m['browserQa']['testedRegistryFile'])
 assert digest(W/m['browserQa']['file'])==m['browserQa']['sha256']
 assert digest(W/m['browserQa']['testedRegistryFile'])==qa['registrySha256']
 assert digest(W/m['browserQa']['inputManifestFile'])==qa['batchManifestSha256']
 assert tested['images']==registry
 current=read(ROOT/'src/data/agriculture/recognition-images.json')
 assert {k:v for k,v in tested.items() if k!='status'}=={k:v for k,v in current.items() if k!='status'}
 assert digest(ROOT/'src/components/agriculture/RecognitionImages.tsx')==qa['componentSha256']
 assert qa['status']=='PASS' and qa['cases']==76 and qa['imageDecodes']==973 and qa['completionActions']==26
 assert not qa['errors'] and qa['actualImageBytes'] is True
print(json.dumps(dict(status='PASS',newOriginalImages=3,totalRasterImages=42,captionRowsWithOriginalIllustrations=36,previousImageObjectsPreserved=39,sourceOccurrencesClosed=0,independentAiReviewed=False,nativeReviewed=False,domainReviewed=False,releaseReady=False)))
