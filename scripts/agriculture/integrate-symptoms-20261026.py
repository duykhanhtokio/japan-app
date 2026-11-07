"""Add three original symptom examples without changing lessons, questions or source coverage."""
import hashlib,json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
W=ROOT/'docs/ssw-workspace/agriculture'
P=W/'symptoms-20261026'
def read(p):return json.loads(p.read_text())
def write(p,value):p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def h(value):return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def main():
 rows=read(P/'images.json')['images'];assert len(rows)==3
 rp=ROOT/'src/data/agriculture/recognition-images.json';reg=read(rp)
 assert len(reg['images'])==39 and not {x['id'] for x in rows}&{x['id'] for x in reg['images']}
 ip=W/'recognition-inventory.json';inv=read(ip);fp=W/'illustration-register.json';figures=read(fp)
 cp=ROOT/'src/components/agriculture/RecognitionImages.tsx';component=cp.read_text()
 lessons=read(ROOT/'src/data/agriculture/lessons.ja.json')['lessons'];byid={l['id']:l for l in lessons}
 unchanged=['src/data/agriculture/lessons.ja.json','src/data/agriculture/course-manifest.json','src/data/agriculture/weekly-checks.ja.json','src/data/agriculture/translations.json','src/services/agriculture-study-state.ts','src/components/agriculture/AgricultureCourse.tsx','docs/ssw-workspace/agriculture/knowledge-ledger.json','docs/ssw-workspace/agriculture/source-coverage-audit.json','docs/ssw-workspace/agriculture/source-gap-backlog.json']
 unchanged += ['src/data/agriculture/'+p for p in read(ROOT/'src/data/agriculture/translations.json')['shards'].values()]
 before=dict(registryImages=[dict(id=x['id'],sha256=h(x)) for x in reg['images']],inventoryEntries={x['id']:h(x) for x in inv['entries']},figures=[dict(id=x['id'],sha256=h(x)) for x in figures['figures']],componentSha256=digest(cp),unchangedFiles={p:digest(ROOT/p) for p in unchanged})
 for row in rows:
  assert digest(ROOT/row['assetPath'])==row['assetSha256']
  for lid in row['lessonIds']:assert row['lessonSourceHashes'][lid]==byid[lid]['sourceHash']
  assert row['sourceOccurrencesClosed']==0 and row['sourcePhotoObjectiveComplete'] is False
  author=read(ROOT/row['authorEvidencePath']);review=read(ROOT/row['reviewEvidencePath'])
  assert review['authorPacketSha256']==digest(ROOT/row['authorEvidencePath']) and review['status']=='complete_self_review_not_independent'
  assert author['independentAiReviewed'] is review['independentAiReviewed'] is False
  assert not review['unresolvedBlockingIssues']
  for entryid in row['photoInventoryIds']:
   entry=next(x for x in inv['entries'] if x['id']==entryid)
   assert entry.get('originalIllustrationAvailable') is not True
   entry.update(originalIllustrationAssetId=row['id'],originalIllustrationAvailable=True,sourcePhotoObjectiveComplete=False)
  figures['figures'].append(dict(id=row['id'],kind=row['kind'],implementation='src/components/agriculture/RecognitionImages.tsx',assetPath=row['assetPath'],assetSha256=row['assetSha256'],lessonIds=row['lessonIds'],labelsJa=[row['titleJa']],creation=row['creation'],aiReviewed=True,independentAiReviewed=False,humanReviewed=False,nativeReviewed=False,domainReviewed=False,nativeDeviceTested=False,notARecognitionPhotograph=True,sourcePhotoObjectiveComplete=False))
  require=" '"+row['assetKey']+"':require('../../../"+row['assetPath']+"'),\n"
  assert row['assetKey'] not in component
  component=component.replace('\n};\ntype RecognitionImage=', '\n'+require+'};\ntype RecognitionImage=',1)
 reg['images'].extend(rows)
 reg['status']='source_bound_candidate_illustrations_with_per_asset_review_evidence'
 inv['originalIllustrations']['count']=sum(x.get('originalIllustrationAvailable') is True for x in inv['entries'])
 inv['originalIllustrations']['status']='thirty_six_end_caption_rows_have_original_illustrations_with_distinct_review_evidence'
 manifest=dict(schemaVersion=1,id='agriculture-symptoms-20261026',status='integrated_candidate_pending_scoped_browser_qa',newRecognitionImageIds=[x['id'] for x in rows],preservedPriorImageIds=[x['id'] for x in reg['images'][:-3]],newRasterFigures=3,totalRasterFigures=42,sourcePhotoCaptionRowsWithIllustrations=inv['originalIllustrations']['count'],sourceOccurrencesClosed=0,newQuestions=0,mockQuestions=0,newLessonLocalePairs=0,baseline=before,independentAiReviewed=False,humanReviewed=False,nativeReviewed=False,domainReviewed=False,releaseReady=False,backgroundAuthoringRunning=False,limits=['Three new root-self-reviewed symptom illustrations; no independent or domain certification.','Source caption availability is not full recognition competence or source-objective closure.','Source2 illustrations are supplemental in shared1go readers; no source1 photograph-coverage claim.'])
 write(rp,reg);write(ip,inv);write(fp,figures);cp.write_text(component)
 write(W/'symptoms-20261026-manifest.json',manifest)
 print(json.dumps(dict(newImages=3,totalImages=42,captionRows=inv['originalIllustrations']['count'],sourceObjectivesClosed=0)))

if __name__=='__main__':main()
