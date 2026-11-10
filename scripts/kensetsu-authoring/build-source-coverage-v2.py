"""Conservative source-first census. Private PDFs/text never enter Git.

python scripts/kensetsu-authoring/build-source-coverage-v2.py PRIVATE_SOURCE_DIRECTORY
All physical text blocks (including ruby and tiny labels), image placements and
vector objects are retained. Their geometry/counts are not knowledge acceptance.
"""
import argparse,gzip,hashlib,json
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'docs/ssw-workspace/kensetsu'
OUT=ROOT/'docs/ssw-workspace/source-coverage-v2'
BASELINE='66d22c9ff810543f266ee9b76dd3f57b0726bdcc'
LEADER='kensetsu-2go-foreman-leader-20250115'
def sha(b):return hashlib.sha256(b).hexdigest()
def encoded(v):return json.dumps(v,ensure_ascii=False,separators=(',',':')).encode()
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def safe_vector(v):
 if isinstance(v,(str,int,float,bool)) or v is None:return v
 if isinstance(v,dict):return {k:safe_vector(x) for k,x in v.items()}
 if isinstance(v,(tuple,list)):return [safe_vector(x) for x in v]
 if isinstance(v,(fitz.Point,fitz.Rect,fitz.Quad)):return [safe_vector(x) for x in v]
 return str(v)
def box(v):return [round(float(x),3) for x in v]
def evidence(p,pointer,note):
 v=json.loads((ROOT/p).read_text())
 for key in pointer.strip('/').split('/') if pointer else []:v=v[int(key)] if isinstance(v,list) else v[key]
 return {'path':p,'jsonPointer':pointer,'sha256':sha(encoded(v)),'sha256Mode':'json-value','relation':'direct','semanticReviewed':True,'reviewNote':note}
def build(directory):
 OUT.mkdir(exist_ok=True)
 intake=json.loads((BASE/'SOURCE_INTAKE_2GO_2026-10-17.json').read_text())['sources']
 prior=json.loads((BASE/'knowledge-reaudit-source-manifest.json').read_text())['sources']+json.loads((BASE/'SOURCE_KD_INTAKE_2026-10-17.json').read_text())['sources']
 by_hash={s['sha256']:s['sourceId'] for s in prior};by_hash['fa094327913a14047de32ad734b552d6911af281566076ec327e50608c5106f7']=LEADER
 source_map={};docs={};source_receipts=[]
 for s in intake:
  f=directory/s['filename'];raw=f.read_bytes();assert sha(raw)==s['sha256'],f;d=fitz.open(f);assert len(d)==s['pages']
  source_receipts.append({'filename':s['filename'],'sha256':s['sha256'],'pages':len(d),'bytes':len(raw),'byteAndPageVerified':True,'annotations':sum(len(list(pg.annots() or [])) for pg in d),'linkAnnotations':sum(len(pg.get_links()) for pg in d),'formWidgets':sum(len(list(pg.widgets() or [])) for pg in d)})
  if s['sha256'] in source_map:source_map[s['sha256']]['aliases'].append(s['filename']);continue
  sid=by_hash.get(s['sha256'],'kensetsu-theory-text1k-20261017')
  source_map[s['sha256']]={'sourceId':sid,'sha256':s['sha256'],'pdfPages':len(d),'aliases':[s['filename']],'byteVerified':True,'verificationRef':'docs/ssw-workspace/source-coverage-v2/construction-source-verification.json'}
  docs[sid]=d
 assert len(source_map)==15 and sum(s['pdfPages'] for s in source_map.values())==530
 elements={};artifacts={};page_rows=[]
 for s in source_map.values():
  sid=s['sourceId'];pages=[]
  for p in docs[sid]:
   els=[]
   for i,b in enumerate(p.get_text('dict')['blocks']):
    kind='text' if b['type']==0 else 'image' if b['type']==1 else 'unknown'
    meta={}
    if kind=='text':
     spans=[z for l in b.get('lines',[]) for z in l['spans']];text='\n'.join(''.join(z['text'] for z in l['spans']) for l in b.get('lines',[]));raw=text.encode();meta={'characters':len(text),'fontPointRange':[min((z['size'] for z in spans),default=0),max((z['size'] for z in spans),default=0)],'spanCount':len(spans),'whitespaceOnly':not text.strip()}
    elif kind=='image':raw=b.get('image',b'');meta={'width':b.get('width'),'height':b.get('height'),'extension':b.get('ext'),'placementRetained':True}
    else:raw=repr(b).encode()
    e={'elementId':f'{sid}:p{p.number+1}:b{i}','kind':kind,'bbox':box(b['bbox']),'sha256':sha(raw),'classification':'pending','knowledgeIds':[],'reason':None,**meta};els.append(e)
   for i,v in enumerate(p.get_drawings()):els.append({'elementId':f'{sid}:p{p.number+1}:v{i}','kind':'vector','bbox':box(v['rect']),'sha256':sha(encoded(safe_vector(v))),'classification':'pending','knowledgeIds':[],'reason':None,'drawingItemCount':len(v.get('items',[]))})
   ap={'pdfPage':p.number+1,'elements':els};pages.append(ap);elements[sid,p.number+1]=els
  artifacts[sid]={'schemaVersion':1,'sector':'construction','sourceId':sid,'sourceSha256':s['sha256'],'sourceTextOrImagesRedistributed':False,'method':'All original PDF text blocks including ruby/small labels, image placements and vector objects; no semantic acceptance inferred.','pages':pages}
 legacy=json.loads((BASE/'TWO_GO_SOURCE_CAPABILITY_MATRIX_20261102.json').read_text())
 runtime=json.loads((BASE/'TWO_GO_RUNTIME_SOURCE_MATRIX_20261102.json').read_text())
 legacy_by_hash=legacy['uniqueSourcePageIndex']
 units=[]
 page_review_path=OUT/'construction-unlinked-page-review.json'
 page_review=json.loads(page_review_path.read_text()) if page_review_path.exists() else {'pages':[]}
 role_by_page={(r['sourceId'],r['pdfPage']):r for r in page_review['pages']}
 author=OUT/'construction-semantic-authoring.json'
 authored=json.loads(author.read_text()) if author.exists() else {'units':[]}
 for i,row in enumerate(authored['units']):
  refs=[];kid=row['knowledgeId']
  for r in row['sourceLocations']:
   sid=r.get('sourceId',LEADER);n=r['pdfPage'];rect=fitz.Rect(r['bbox']);ids=[]
   for e in elements[sid,n]:
    eb=fitz.Rect(e['bbox']);center=fitz.Point((eb.x0+eb.x1)/2,(eb.y0+eb.y1)/2)
    if center in rect:
     e['knowledgeIds'].append(kid);ids.append(e['elementId'])
     # A physical block can also hold un-inventoried claims; keep pending until fully reviewed.
   assert ids,(kid,r)
   refs.append({'sourceId':sid,'pdfPage':n,'elementIds':ids,'reviewedSubregionBbox':r.get('reviewedSubregionBbox',r['bbox'])})
  u={k:v for k,v in row.items() if k not in ['sourceLocations','teachingSelectors','assessmentSelectors','imageSelectors']};u['sourceRefs']=refs
  u['teachingEvidence']=[evidence(*x) for x in row.get('teachingSelectors',[])];u['assessmentEvidence']=[evidence(*x) for x in row.get('assessmentSelectors',[])];u['imageEvidence']=[{**im,'sha256':sha((ROOT/im['path']).read_bytes()),'sha256Mode':'file','relation':'direct','semanticReviewed':True} for im in row.get('imageSelectors',[])]
  units.append(u)
 complete_by_page={(r['sourceId'],r['pdfPage']):r for r in authored.get('completePageInventories',[])}
 for sid,a in artifacts.items():
  for ap in a['pages']:
   complete=complete_by_page.get((sid,ap['pdfPage']))
   if complete:
    for e in ap['elements']:
     if e['knowledgeIds']:e['classification']='knowledge';continue
     eb=fitz.Rect(e['bbox']);center=fitz.Point((eb.x0+eb.x1)/2,(eb.y0+eb.y1)/2)
     if any(center in fitz.Rect(band) for band in complete['navigationBands']):
      e['classification']='navigation';e['reason']='Self-viewed repeated chapter header, printed page number or non-instructional page margin.'
     else:
      assert e.get('whitespaceOnly'), ('Unmapped non-whitespace prevents fullpage acceptance',sid,ap['pdfPage'],e['elementId'],e['bbox'])
      e['classification']='decorative';e['reason']='Whitespace-only PDF text object, byte hash and coordinates retained.'
   role=role_by_page.get((sid,ap['pdfPage']))
   if role and role['semanticInventory']=='excluded':
    for e in ap['elements']:
     assert not e['knowledgeIds'], (sid,ap['pdfPage'],'exclusion has linked knowledge')
     e['classification']='navigation';e['reason']=role['exclusionReason']
  target=OUT/f'construction-{sid}-regions.json.gz';target.write_bytes(gzip.compress(encoded(a),mtime=0));rel=str(target.relative_to(ROOT));digest=sha(target.read_bytes())
  for p in a['pages']:
   n=p['pdfPage'];complete=complete_by_page.get((sid,n));ids=[u['knowledgeId'] for u in units if any(r['sourceId']==sid and r['pdfPage']==n for r in u['sourceRefs'])];reviewed=sid==LEADER and n in authored.get('sourceReadPages',list(range(89,101)))
   source_hash=next(source['sha256'] for source in source_map.values() if source['sourceId']==sid)
   legacy_keys=legacy_by_hash.get(source_hash,{}).get('pages',[])
   candidates=legacy_keys[n-1]['candidateRuntimeLessonEvidenceKeys'] if len(legacy_keys)>=n else []
   navigation=[{'lessonId':runtime['lessonEvidence'][key]['lessonId'],'legacyEvidenceKey':key,'relation':'candidate','semanticReviewed':False} for key in candidates]
   role=role_by_page.get((sid,n));excluded=role and role['semanticInventory']=='excluded'
   if sid=='kensetsu-theory-text1k-20261017' and 6<=n<=12:
    peer=next(v for v in legacy_by_hash.values() if v.get('canonicalSourceId')=='kensetsu-src-01')
    for key in peer['pages'][n-1]['candidateRuntimeLessonEvidenceKeys']:
     navigation.append({'lessonId':runtime['lessonEvidence'][key]['lessonId'],'legacyEvidenceKey':key,'relation':'candidate','semanticReviewed':False,'viaVisibleEquivalentSourceId':'kensetsu-src-01','viaVisibleEquivalentPage':n,'verificationRef':'docs/ssw-workspace/source-coverage-v2/construction-unlinked-page-review.json'})
   page_rows.append({'sourceId':sid,'pdfPage':n,'disposition':role['role'] if role else 'instructional' if reviewed else 'unclassified','exclusionReason':role['exclusionReason'] if excluded else None,'regionCensus':{'artifactPath':rel,'sha256':digest,'elementCount':len(p['elements']),'status':'visually_reviewed' if reviewed or excluded else 'extracted','visualReviewRef':role['reviewRef'] if excluded else ('docs/ssw-workspace/source-coverage-v2/construction-batch3-source-review.json' if n>100 else 'docs/ssw-workspace/source-coverage-v2/construction-source-review.json') if reviewed else None},'semanticInventory':{'status':'excluded' if excluded else 'complete_ai' if complete else 'partial' if reviewed else 'pending','reviewRef':role['reviewRef'] if excluded else complete['reviewRef'] if complete else ('docs/ssw-workspace/source-coverage-v2/construction-batch3-source-review.json' if n>100 else 'docs/ssw-workspace/source-coverage-v2/construction-source-review.json') if reviewed else None},'knowledgeIds':ids,'legacyLessonCandidates':navigation,'candidateLessonLinksProveKnowledgeCoverage':False})
 receipt={'date':'2026-11-02','files':source_receipts,'nominalFiles':17,'nominalPages':604,'canonicalPdfHashes':15,'canonicalPages':530,'byteDuplicateAliasesOnly':True,'differentHashText1kNotMergedWithText1l':True,'extractedOnlyNotSemanticCoverage':True}
 receipt['annotationScan']={'pdfAnnotations':sum(len(list(pg.annots() or [])) for d in docs.values() for pg in d),'linkAnnotations':sum(len(pg.get_links()) for d in docs.values() for pg in d),'formWidgets':sum(len(list(pg.widgets() or [])) for d in docs.values() for pg in d),'method':'All530uniquePDFpages scanned; any nonzero annotation count requires a further dedicated inventory rather than silent omission.'}
 assert not any(receipt['annotationScan'][k] for k in ['pdfAnnotations','linkAnnotations','formWidgets']), 'Annotation inputs require inventory'
 write(OUT/'construction-source-verification.json',receipt)
 ledger={'schemaVersion':2,'sector':'construction','baselineCommit':BASELINE,'sources':list(source_map.values()),'pages':page_rows,'knowledgeUnits':units,'denominator':{'status':'open','reviewNote':'All 530 canonical source pages have non-lossy physical element census. Only named source subregions have semantic self-review; unresolved table cells/figures and all remaining pages prevent a frozen knowledge denominator.'},'wholeSourceKnowledgeCovered':False,'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False},'legacyRefs':[{'path':'docs/ssw-workspace/kensetsu/TWO_GO_RUNTIME_SOURCE_MATRIX_20261102.json','sha256':sha((BASE/'TWO_GO_RUNTIME_SOURCE_MATRIX_20261102.json').read_bytes()),'records':580,'meaning':'Navigation/evidence candidates only, not 580 independent source ideas or accepted semantics.'},{'path':'docs/ssw-workspace/kensetsu/TWO_GO_SOURCE_CAPABILITY_MATRIX_20261102.json','unlinkedPagesAtPriorBaseline':136,'meaning':'Unlinked source-page roles must be reviewed; no automatic deletion or source reuse acceptance.'}],'unresolved':['Complete per-element semantic inventory of all 530 pages, including tables, diagrams, labels and conditions.','Text1k/text1l pages2–12 match at144dpi including visible small text/images; byte aliases remain separate and source→app semantic acceptance is not inferred.','Reused 1go payloads and independent progress keys are not evidence of full specialist2go competence.','Specialist/native/rights acceptance, actual devices, audio and measured learner duration remain separate.']}
 write(OUT/'construction.json',ledger)
 print(json.dumps({'sources':len(source_map),'pages':len(page_rows),'elements':sum(len(v) for v in elements.values()),'knowledgeUnits':len(units),'coveredAi':sum(u['status']=='covered_ai' for u in units),'sourceCoveragePercent':None}))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('directory',type=Path);a=p.parse_args();build(a.directory)
