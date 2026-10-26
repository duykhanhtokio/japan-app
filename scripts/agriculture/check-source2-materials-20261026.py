"""Verify bounded source2 material links and byte-identical rendering inputs."""
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];W=ROOT/'docs/ssw-workspace/agriculture'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def h(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def render(x):return {k:x[k] for k in ['id','lessonIds','lessonSourceHashes','titleJa','altJa','observationJa','limitJa','assetKey','width','height']}
m=read(W/'material-source2-20261026.json');base=m['baseline'];reg=read(ROOT/'src/data/agriculture/recognition-images.json')['images'];images={x['id']:x for x in reg};inv=read(W/'recognition-inventory.json');entries={x['id']:x for x in inv['entries']}
assert len(images)==len(reg)==42 and len(m['links'])==4
for p,digest in base['unchangedFiles'].items():assert sha(ROOT/p)==digest,p
for p,digest in base['assets'].items():assert sha(ROOT/p)==digest,p
linked={x['id']:x for x in m['links']};linked_entries={x['photoInventoryId']:x for x in m['links']}
for rid,digest in base['registryImages'].items():
 row=images[rid];assert h(render(row))==base['renderedImages'][rid]
 if rid not in linked:assert h(row)==digest;continue
 evidence=linked[rid];before=evidence['before'];assert h(before)==digest
 expected=dict(before);expected.update(photoInventoryIds=before['photoInventoryIds']+[evidence['photoInventoryId']],sourceItemIds=before['sourceItemIds']+[evidence['sourceItemId']],sources=before['sources']+[dict(documentId='AGR-S2',pdfPage=131,printedPage=129)],scopeLevels=['1','2'],additionalSourceReviewPaths=['docs/ssw-workspace/agriculture/material-source2-20261026.json'])
 assert row==expected and row['assetSha256']==evidence['assetSha256']
 assert evidence['source2PageAndExistingFullImageViewed'] is True and evidence['independentAiReviewed'] is False
for rid,digest in base['inventoryEntries'].items():
 row=dict(entries[rid])
 if rid in linked_entries:
  assert row.pop('originalIllustrationAssetId')==linked_entries[rid]['id'];assert row.pop('originalIllustrationAvailable') is True;assert row.pop('sourcePhotoObjectiveComplete') is False
 assert h(row)==digest,rid
assert inv['recognitionReady'] is False
assert sum(x.get('originalIllustrationAvailable') is True for x in inv['entries'])==inv['originalIllustrations']['count']==40
assert m['newRasterAssets']==m['sourceOccurrencesClosed']==m['newQuestions']==0
print(json.dumps(dict(status='PASS',newSource2MaterialLinks=4,identicalRasterAssets=42,identicalRenderedImageObjects=42,captionRowsWithIllustrations=40,newSourceClosures=0,independentAiReviewed=False,domainReviewed=False,releaseReady=False)))
