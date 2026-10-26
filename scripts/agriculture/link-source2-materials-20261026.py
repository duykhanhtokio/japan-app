"""Reuse four existing original illustrations after source2 caption/appearance comparison."""
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];W=ROOT/'docs/ssw-workspace/agriculture'
def read(p):return json.loads(p.read_text())
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def h(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def render(x):return {k:x[k] for k in ['id','lessonIds','lessonSourceHashes','titleJa','altJa','observationJa','limitJa','assetKey','width','height']}

def main():
 rp=ROOT/'src/data/agriculture/recognition-images.json';ip=W/'recognition-inventory.json';reg=read(rp);inv=read(ip)
 assert len(reg['images'])==42 and sum(x.get('originalIllustrationAvailable') is True for x in inv['entries'])==36
 keys=['agripoly-film','nonwoven-cover','shade-cloth','insect-net']
 captions=['農ポリ','不織布','寒冷紗','防虫ネット'];findings=[
  'Source photograph shows black wrinkled groundsheet; existing art shows a black wrinkled sheet onsoil with a folded edge. This supports a source-labelled appearance example, not resin identification or thickness/temperature/UV/performance certification.',
  'Source photograph shows pale continuous covering over a bed; existing art shows a pale continuous flexible fibrous sheet. Existing art does not reproduce the installed bed or certify fibre composition, thickness, permeability or insulation.',
  'Source photograph shows dark woven-looking covering over a curved support; existing art shows dark crossing threads, openings and draped folds. Existing art is a material appearance example, not installation instructions, mesh dimensions or shading-rate certification.',
  'Source photograph shows pale/greenish mesh on a facility side; existing art shows pale crossing threads and visible openings. Existing art does not depict that installed sidewall, establish mesh size or certify exclusion of any named pest.'
 ]
 baseline=dict(registryImages={x['id']:h(x) for x in reg['images']},renderedImages={x['id']:h(render(x)) for x in reg['images']},inventoryEntries={x['id']:h(x) for x in inv['entries']})
 frozen=['src/components/agriculture/RecognitionImages.tsx','src/components/agriculture/AgricultureCourse.tsx','src/services/agriculture-study-state.ts','src/data/agriculture/lessons.ja.json','src/data/agriculture/course-manifest.json','src/data/agriculture/weekly-checks.ja.json','src/data/agriculture/translations.json','docs/ssw-workspace/agriculture/illustration-register.json','docs/ssw-workspace/agriculture/source-inventory.json','docs/ssw-workspace/agriculture/knowledge-ledger.json','docs/ssw-workspace/agriculture/source-coverage-audit.json','docs/ssw-workspace/agriculture/source-gap-backlog.json','docs/ssw-workspace/agriculture/source-gap-reconciliation-22.json']
 frozen += ['src/data/agriculture/'+x for x in read(ROOT/'src/data/agriculture/translations.json')['shards'].values()]
 baseline['unchangedFiles']={p:sha(ROOT/p) for p in frozen};baseline['assets']={x['assetPath']:sha(ROOT/x['assetPath']) for x in reg['images']}
 evidence=[]
 for key,caption,number,item,finding in zip(keys,captions,range(45,49),range(509,513),findings):
  row=next(x for x in reg['images'] if x['assetKey']==key);rid=f'AGR-RI-S2-131-{number}';entry=next(x for x in inv['entries'] if x['id']==rid)
  assert entry['captionJa']==caption and not entry.get('originalIllustrationAvailable')
  assert row['scopeLevels']==['1'] and len(row['photoInventoryIds'])==1
  old=dict(row);row['photoInventoryIds']=row['photoInventoryIds']+[rid];row['sourceItemIds']=row['sourceItemIds']+[f'AGR-A10-FLOWER-{item:04}'];row['sources']=row['sources']+[dict(documentId='AGR-S2',pdfPage=131,printedPage=129)];row['scopeLevels']=['1','2'];row['additionalSourceReviewPaths']=['docs/ssw-workspace/agriculture/material-source2-20261026.json']
  entry.update(originalIllustrationAssetId=row['id'],originalIllustrationAvailable=True,sourcePhotoObjectiveComplete=False)
  evidence.append(dict(assetKey=key,id=row['id'],captionJa=caption,photoInventoryId=rid,sourceItemId=f'AGR-A10-FLOWER-{item:04}',before=old,assetSha256=row['assetSha256'],sourceAppearanceFinding=finding,source2PageAndExistingFullImageViewed=True,comparisonScope='Caption and bounded common material appearance, not installed configuration or product/chemical certification',independentAiReviewed=False,humanReviewed=False,nativeReviewed=False,domainReviewed=False,sourceOccurrenceClosed=False))
 inv['originalIllustrations']['count']=40;inv['originalIllustrations']['status']='forty_end_caption_rows_have_original_illustration_links_with_per_asset_review_evidence'
 manifest=dict(schemaVersion=1,status='root_self_reviewed_additive_source2_material_links',baselineCommit='24f5b65fb44bc449f517e68b385db60034ff36ef',source=dict(documentId='AGR-S2',pdfPage=131,printedPage=129,pdfSha256='c19741bd8f6128a80d9d9f9e3ab39e8a5e9eb969a30f51771c47527ef6190a12',pageVisuallyChecked=True,sourceImageRedistributed=False),links=evidence,baseline=baseline,newRasterAssets=0,newLessonLocalePairs=0,newQuestions=0,totalRasterAssets=42,captionRowsWithOriginalIllustrations=40,sourceOccurrencesClosed=0,recognitionComplete=False,independentAiReviewed=False,humanReviewed=False,nativeReviewed=False,domainReviewed=False,releaseReady=False,browserRerunRequired=False,browserRationale='Every field consumed by RecognitionImages, component bytes and every asset byte remain unchanged; the previously recorded76-reader/973-decode run covered these four assets. This unit checks additive source metadata only.',remaining='Eight source2 pest-caption rows and inline equipment/state recognition remain separate; source-gap/objective coverage and800mocks are not closed.')
 write(rp,reg);write(ip,inv);write(W/'material-source2-20261026.json',manifest)
 progress=read(W/'progress.json');progress['latestFigureSourceLinkReview']='material-source2-20261026.json';progress['next']['resumePriority']='Published supplement+symptom units verified at24f5b65f. Preserve174lessons/2088AI-draftpairs/412weeklyquestions/42rasters. Four source2 material-caption links reuse original art;40of48historical captionrows have illustration links, not full recognition certification. Continue8source2 pest groups, inlineequipment/state imagery, missing knowledge via overlays11/12/22 and distinct1go/2go assessment matrix before800newmocks.';progress['next']['alsoPending'][0]='Eight source2 pest-caption groups and inline tool/facility/state recognition remain;40historical end-caption rows link original art. No photographic/diagnostic/product certification.';write(W/'progress.json',progress)
 print(json.dumps(dict(linkedSource2MaterialRows=4,newAssets=0,totalRasterAssets=42,captionRowsWithIllustrations=40,sourceObjectivesClosed=0)))
if __name__=='__main__':main()
