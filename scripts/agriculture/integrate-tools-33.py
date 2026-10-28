"""Integrate six independently reviewed original handtool images, additively."""
import copy,hashlib,json,shutil,os
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];W=ROOT/'docs/ssw-workspace/agriculture/tools-33'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def first(d,keys):return next(d[k] for k in keys if k in d)
def main():
 baseline=read(W/'baseline-file-hashes.json')
 for p,h in baseline['files'].items():assert sha(ROOT/p)==h,'changed baseline '+p
 D=ROOT/'src/data/agriculture';registry=read(D/'recognition-images.json');register=read(ROOT/'docs/ssw-workspace/agriculture/illustration-register.json');ledger=read(ROOT/'docs/ssw-workspace/agriculture/knowledge-ledger.json');progress=read(ROOT/'docs/ssw-workspace/agriculture/progress.json')
 lesson=next(l for l in read(D/'lessons.ja.json')['lessons'] if l['id']=='agr-safety-maintenance-tools');knowledge={k['id']:k for k in ledger['knowledge']}
 stems=['socket-wrench','open-end-spanner','box-end-wrench','screwdrivers','adjustable-wrench','hex-keys'];parts=[2,3,3,6,4,5];suffix=[(145,421),(146,422),(147,423),(148,424),(149,425),(150,426)]
 rows=[];mappings=[];proof=[];assetdir=ROOT/'assets/agriculture/tools';assetdir.mkdir(exist_ok=True)
 (assetdir/'.gitattributes').write_text('# Original tool PNGs are ordinary Git blobs for connector persistence.\n*.png -filter -diff -merge -text\n')
 for i,(stem,pnum,srcids) in enumerate(zip(stems,parts,suffix),1):
  packet=read(W/f'asset-{i}.json');review=read(W/f'review-{i}.json');gen=packet.get('generation',packet)
  expectedMeta=first(review,['reviewedAssetMetadataSha256','assetMetadataSHA256','authorPacketSha256','assetMetadataSha256','metadataSHA256','inputMetadataSha256'])
  assert expectedMeta==sha(W/f'asset-{i}.json'),'stale independent metadata review'
  assert review['decision'].startswith('accept') and review['author']!=review['reviewer']
  assert not any(review.get(k,False) for k in ['iterationRequired','iterationNeeded','needsImageIteration'])
  source=Path(os.environ.get('AGRICULTURE_TOOL_SOURCE_DIR',str(assetdir)))/(stem+'-v1.png');dest=assetdir/source.name
  digest=sha(source);assert digest==first(review,['reviewedImageSha256','imageSHA256','imageSha256','assetSha256'])
  assert digest==first(gen,['savedSha256']);assert digest==first(gen,['originalGeneratedSha256','originalSha256'])
  with Image.open(source) as im:assert im.format=='PNG';width,height=im.size;assert width==height==1254
  if dest.exists():assert sha(dest)==digest,'existing asset differs'
  else:shutil.copy2(source,dest)
  assert sha(dest)==digest
  paragraph=next(p for p in lesson['paragraphs'] if p['id'].endswith('-p'+str(pnum)));kid=paragraph['knowledgeIds'][0]
  key='tool-'+stem;row={'id':packet['assetId'],'kind':'tool_appearance_illustration','assetKey':key,'assetPath':str(dest.relative_to(ROOT)),'assetSha256':digest,'width':width,'height':height,'lessonIds':[lesson['id']],'lessonSourceHashes':{lesson['id']:lesson['sourceHash']},'paragraphIds':[paragraph['id']],'knowledgeIds':[kid],'scopeLevels':['1','2'],'titleJa':packet.get('titleJa',packet.get('subjectJa')),'altJa':packet['altJa'],'observationJa':packet.get('observationJa',packet['captionJa']),'limitJa':first(packet,['limitJa','limitsJa','recognitionLimitsJa']),'allowExpandedView':True,'photoInventoryIds':[],'sourceItemIds':['AGR-A10-SAFETY-'+str(n).zfill(4) for n in srcids],'sources':[{'documentId':'AGR-S1','pdfPage':44,'printedPage':38},{'documentId':'AGR-S2','pdfPage':60,'printedPage':58}],'creation':'original_builtin_imagegen_no_source_image_input','sourceImagesRedistributed':False,'independentAiReviewed':True,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'operatingSafetyApproved':False,'nativeDeviceTested':False,'sourcePhotoObjectiveComplete':False,'sourceOccurrencesClosed':0,'releaseReady':False}
  for f in ['titleJa','altJa','observationJa','limitJa']:
   if isinstance(row[f],list):row[f]=' '.join(row[f])
   assert isinstance(row[f],str) and row[f].strip()
  assert row['id'] not in {r['id'] for r in registry['images']};rows.append(row)
  register['figures'].append({'id':row['id'],'kind':row['kind'],'implementation':'src/components/agriculture/RecognitionImages.tsx','assetPath':row['assetPath'],'assetSha256':digest,'lessonIds':row['lessonIds'],'knowledgeIds':[kid],'scopeLevels':['1','2'],'labelsJa':[row['titleJa']],'sources':row['sources'],'creation':row['creation'],'aiReviewed':True,'independentAiReviewed':True,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'nativeDeviceTested':False,'notARecognitionPhotograph':True,'sourcePhotoObjectiveComplete':False,'sourceOccurrencesClosed':0})
  knowledge[kid]['figureIds'].append(row['id']);mappings.append(" '"+key+"':require('../../../"+row['assetPath']+"'),\n")
  proof.append({'assetId':row['id'],'authorPath':str((W/f'asset-{i}.json').relative_to(ROOT)),'authorSha256':expectedMeta,'reviewPath':str((W/f'review-{i}.json').relative_to(ROOT)),'reviewSha256':sha(W/f'review-{i}.json'),'reviewer':review['reviewer'],'author':review['author'],'assetPath':row['assetPath'],'assetSha256':digest,'paragraphSha256':hashlib.sha256(paragraph['textJa'].encode()).hexdigest(),'sourceOccurrenceClosures':0})
 assert len(registry['images'])==56;registry['images'].extend(rows);assert len(registry['images'])==62
 component=ROOT/'src/components/agriculture/RecognitionImages.tsx';text=component.read_text();needle='\n};\ntype RecognitionImage';assert text.count(needle)==1;component.write_text(text.replace(needle,'\n'+''.join(mappings)+'};\ntype RecognitionImage',1))
 progress['authored']['registeredRasterFigures']=62;progress['authored']['recognitionIllustrations']+=6;progress['figureInventory']['registeredRasterFigures']=62;progress['figureInventory']['toolAppearanceIllustrations']=6;progress['figureInventory']['sourceOccurrencesClosedByFigureOnlyBatches']=0;progress['latestFigureBatch']='tools-33/manifest.json';progress['latestBatch']='tools-33/manifest.json';progress['parallelWorkers']={'count':6,'status':'six_tool_authors_and_independent_visual_peers_finished_pending_remote_gate','backgroundAuthoringRunning':False};progress['next']['resumePriority']='Preserve186lessons/2232draftpairs/421weeklyquestions/160mocks and62rasters. Six original handtool examples now supplement the existing shared1go/2go lesson. Continue source-audit32 adopted scopes, unresolved irrigation/state/flower recognition and1200missing-or-partial occurrences/301baselineholds. Keep16forms/640questions open; compare581currentquestions and frozenqueues before authoring. Image availability closes0source occurrences and certifies no safe operations.'
 for p,d in [(D/'recognition-images.json',registry),(ROOT/'docs/ssw-workspace/agriculture/illustration-register.json',register),(ROOT/'docs/ssw-workspace/agriculture/knowledge-ledger.json',ledger),(ROOT/'docs/ssw-workspace/agriculture/progress.json',progress)]:write(p,d)
 write(W/'integration-provenance.json',{'schemaVersion':1,'baseCommit':baseline['baseCommit'],'images':proof,'newRuntimeRows':rows,'staticMappingLines':mappings,'sourceOccurrencesClosed':0,'metadataNormalization':'One list-valued Japanese limit joined with spaces; no semantic content changed. All raw author/peer packets preserved.'})
 print(json.dumps({'newTools':6,'totalRasters':62,'sourceClosures':0}))
if __name__=='__main__':main()
