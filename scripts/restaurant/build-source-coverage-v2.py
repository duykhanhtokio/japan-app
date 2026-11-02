#!/usr/bin/env python3
"""Build byte-backed source census and migrate legacy facts without claiming new closure.
Source text/images stay private. Geometry is retained even when small or unresolved.
"""
import argparse,gzip,hashlib,json,collections
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[2]
DOC=ROOT/'docs/ssw-workspace/restaurant'
OUT=ROOT/'docs/ssw-workspace/source-coverage-v2'
BASE='5ff65af0fe2ec63eb0b47c250212fd5dcc7c3c6a'
def read(p):return json.loads(p.read_text())
def sha(x):return hashlib.sha256(x if isinstance(x,bytes) else x.encode()).hexdigest()
def digest(x):return sha(json.dumps(x,ensure_ascii=False,separators=(',',':')))
def esc(x):return str(x).replace('~','~0').replace('/','~1')
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def evidence(path,pointer,value,note,reviewed=False):
 return {'path':path,'jsonPointer':pointer,'sha256':digest(value),'sha256Mode':'json-value','relation':'direct' if reviewed else 'candidate','semanticReviewed':reviewed,'reviewNote':note}
def box(r,page):return [round(float(v),4) for v in r]
def build(source_dir):
 inv=read(DOC/'source-inventory.json');cross=read(DOC/'source-closure31/unit-crosswalk.json');canon=read(DOC/'source-closure31/canonical-ja.json')['items'];OUT.mkdir(parents=True,exist_ok=True)
 lp={};qp={}
 for level in ['1','2']:
  path=f'src/data/restaurant/lessons.{level}.ja.json';data=read(ROOT/path)
  for i,l in enumerate(data['lessons']):
   for j,p in enumerate(l['paragraphs']):lp[(l['id'],p['id'])]=(path,f'/lessons/{i}/paragraphs/{j}/textJa',p['textJa'])
  path=f'src/data/restaurant/exams.{level}.ja.json'
  for i,e in enumerate(read(ROOT/path)['exams']):
   for j,q in enumerate(e['questions']):qp[q['id']]=(path,f'/exams/{i}/questions/{j}',q)
 for k,v in canon.items():
  if v['kind']=='question':qp[k]=('docs/ssw-workspace/restaurant/source-closure31/canonical-ja.json','/items/'+esc(k),v)
 sources=[];pages=[];region_counts=collections.Counter();font_spans=0;small=0
 for src in inv['documents']:
  file=source_dir/src['filename'];assert file.exists(),str(file)
  raw=file.read_bytes();assert sha(raw)==src['sha256'],src['id']+' source hash drift'
  pdf=fitz.open(file);assert len(pdf)==src['pdfPages'];sid=src['id'];pout=[]
  for n,p in enumerate(pdf,1):
   elements=[];t=p.get_text('dict',flags=fitz.TEXTFLAGS_DICT & ~fitz.TEXT_PRESERVE_IMAGES)
   for bi,b in enumerate(t['blocks']):
    if b['type']!=0:continue
    for li,line in enumerate(b.get('lines',[])):
     for si,s in enumerate(line['spans']):
      elements.append({'elementId':f'{sid}:p{n}:t{bi}-{li}-{si}','kind':'text_span','bbox':box(s['bbox'],p),'sha256':sha(s['text']),'fontSizePt':round(s['size'],4),'characters':len(s['text']),'classification':'pending','knowledgeIds':[],'reason':None});font_spans+=1;small+=s['size']<10
   for ii,im in enumerate(p.get_image_info(hashes=True)):
    elements.append({'elementId':f'{sid}:p{n}:i{ii}','kind':'image','bbox':box(im['bbox'],p),'sha256':sha(im.get('digest',b'')),'pixels':[im['width'],im['height']],'classification':'pending','knowledgeIds':[],'reason':None})
   for vi,v in enumerate(p.get_drawings()):
    # Primitive instructions are fingerprinted, not reproduced; every path is retained.
    elements.append({'elementId':f'{sid}:p{n}:v{vi}','kind':'vector','bbox':box(v['rect'],p),'sha256':sha(repr(v)),'primitiveCount':len(v.get('items',[])),'classification':'pending','knowledgeIds':[],'reason':None})
   # Table candidates supplement underlying paths/text; neither detection nor absence closes content.
   try:
    for ti,table in enumerate(p.find_tables().tables):
     cells=table.extract();elements.append({'elementId':f'{sid}:p{n}:table{ti}','kind':'table','bbox':box(table.bbox,p),'sha256':digest(cells),'rows':table.row_count,'columns':table.col_count,'classification':'pending','knowledgeIds':[],'reason':None})
   except Exception as e:
    elements.append({'elementId':f'{sid}:p{n}:table-detection','kind':'unknown','bbox':box(p.rect,p),'sha256':sha(type(e).__name__),'classification':'blocked','knowledgeIds':[],'reason':'Table detector failed; inspect the whole page before classifying tables.'})
   if not elements:elements.append({'elementId':f'{sid}:p{n}:empty','kind':'unknown','bbox':box(p.rect,p),'sha256':sha(b''),'classification':'pending','knowledgeIds':[],'reason':'No extracted element; visual inspection is still required.'})
   for e in elements:region_counts[e['kind']]+=1
   pout.append({'pdfPage':n,'sizePt':[p.rect.width,p.rect.height],'elements':elements})
  artifact={'schemaVersion':1,'sector':'restaurant','sourceId':sid,'coordinateSystem':'PDF points, top-left origin','pages':pout,'sourceTextRedistributed':False,'sourceImageRedistributed':False,'fontSizeBasedExclusions':0,'tableDetectionIsSemanticInventory':False}
  ap=OUT/f'restaurant-{sid}-regions.json.gz';ap.write_bytes(gzip.compress(json.dumps(artifact,ensure_ascii=False,separators=(',',':')).encode(),mtime=0));ah=sha(ap.read_bytes())
  sources.append({'sourceId':sid,'sha256':src['sha256'],'pdfPages':src['pdfPages'],'aliases':[],'byteVerified':True,'verificationRef':'scripts/restaurant/build-source-coverage-v2.py; SHA-256 and page count checked against source-inventory.json','versionLabel':src.get('versionLabel'),'sourcePdfsInRepository':False})
  for p in pout:
   legacy=src['pages'][p['pdfPage']-1];ids=[fid for fid,f in cross['facts'].items() if any(r['documentId']==sid and p['pdfPage'] in r['pdfPages'] for r in f['sourceRefs'])]
   pages.append({'sourceId':sid,'pdfPage':p['pdfPage'],'disposition':'unclassified','exclusionReason':None,'regionCensus':{'artifactPath':str(ap.relative_to(ROOT)),'sha256':ah,'elementCount':len(p['elements']),'status':'extracted','visualReviewRef':None},'semanticInventory':{'status':'pending','reviewRef':None},'knowledgeIds':ids,'legacyRole':legacy['role'],'legacyRoleIsAcceptance':False})
 units=[]
 reference_excluded={fid for fid,f in cross['facts'].items() if f['decision']=='reference_excluded'}
 file_hash_cache={}
 for fid,f in cross['facts'].items():
  te=[];ae=[];im=[]
  for ev in f.get('existingEvidence',[]):
   if isinstance(ev,dict) and ev.get('path') and (ROOT/ev['path']).is_file() and ev.get('kind')!='lesson_paragraph':
    path=ev['path']
    if path not in file_hash_cache:file_hash_cache[path]=sha((ROOT/path).read_bytes())
    target=ae if ev.get('kind') in ['question','existing_question','assessment'] else te
    target.append({'path':path,'sha256':file_hash_cache[path],'sha256Mode':'file','locator':ev.get('field','legacy source binding'),'relation':'candidate','semanticReviewed':False,'reviewNote':'Legacy '+ev.get('kind','unclassified')+' evidence retained without dropping its locator. It is not exact v2 semantic acceptance.'})
   if ev.get('kind')=='lesson_paragraph' and (ev.get('lessonId'),ev.get('paragraphId')) in lp:
    path,ptr,val=lp[(ev['lessonId'],ev['paragraphId'])];te.append(evidence(path,ptr,val,'Inherited exact-field legacy binding; v2 source-element and semantic self-review remain pending.'))
  for aid in f.get('additionIds',[]):
   if aid in canon:
    v=canon[aid];ptr='/items/'+esc(aid);te.append(evidence('docs/ssw-workspace/restaurant/source-closure31/canonical-ja.json',ptr,v,'Inherited supplemental teaching item. Shared page/topic is not fresh source-element evidence.'))
  for qid in sorted(set(f.get('questionIds',[])+f.get('crossShardQuestionIds',[]))):
   if qid in qp:
    path,ptr,val=qp[qid];ae.append(evidence(path,ptr,val,'Inherited fact-to-question binding; v2 self-review must verify all facets rather than topic overlap.'))
  for visual in f.get('visualEvidence',[]):
   if isinstance(visual,str):visual={'figureId':visual}
   if visual.get('figureId') in canon:
    v=canon[visual['figureId']];p=ROOT/v['assetFile'];im.append({'path':v['assetFile'],'sha256':sha(p.read_bytes()) if p.exists() else v['sha256'],'sha256Mode':'file','relation':'candidate','semanticReviewed':False,'reviewNote':'Inherited independent figure. Source objective, caption, rights and actual reader rendering require v2 review.','objectiveJa':f['statementJa'],'legacyFigureId':v['id']})
  units.append({'knowledgeId':fid,'sourceRefs':[{'sourceId':r['documentId'],'pdfPage':n,'elementIds':[]} for r in f['sourceRefs'] if r['documentId'] in {x['sourceId'] for x in sources} for n in r['pdfPages']],'legacyExternalSourceRefs':[r for r in f['sourceRefs'] if r['documentId'] not in {x['sourceId'] for x in sources}],'statementJa':f['statementJa'],'conditionsJa':[],'exceptionsJa':[],'importance':'reference' if fid in reference_excluded else 'core','classification':'knowledge','before':{'teaching':'present' if te else 'unknown','assessment':'present' if ae else 'missing'},'after':{'teaching':'partial' if te else 'unknown','assessment':'partial' if ae else 'missing'},'teachingEvidence':te,'assessmentEvidence':ae,'imageEvidence':im,'assessmentRequirement':'not_required' if fid in reference_excluded else 'required','assessmentExemptionReason':f.get('exclusionReason','Reference-only source quantity; exact example is not a transferable assessment objective.') if fid in reference_excluded else None,'expressionReview':{'status':'pending','note':'Legacy independent authoring is preserved; no phrase-length threshold is treated as copyright clearance.'},'status':'candidate','unresolved':['Exact source elements, conditions/exceptions and source-to-app self-review are not yet established in v2.'],'legacyImageEvidence':f.get('visualEvidence',[]),'legacyRefs':[{'path':'docs/ssw-workspace/restaurant/source-closure31/unit-crosswalk.json','jsonPointer':'/facts/'+esc(fid),'unitIds':f['unitIds'],'decision':f['decision'],'scopeLimits':f.get('scopeLimits','')}],'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False}})
 assert len(pages)==271 and len(units)==len(cross['facts'])
 result={'schemaVersion':2,'sector':'restaurant','baselineCommit':BASE,'sources':sources,'pages':pages,'knowledgeUnits':units,'denominator':{'status':'open','reviewNote':'All 271 source pages have byte-backed region census. 1,476 legacy facts are migration candidates, not a proven exhaustive or deduplicated semantic denominator.'},'wholeSourceKnowledgeCovered':False,'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False},'unresolved':[str(sum(not f.get('questionIds') and not f.get('crossShardQuestionIds') and fid not in reference_excluded and not fid.startswith('rst-v2-') for fid,f in cross['facts'].items()))+' legacy assessment gaps remain separately tracked until a reviewed change is integrated.','21 reference-excluded facts remain separate from assessment gaps.','Source term うぐいす骨/ほほ骨, five official-mark rights and offline first-aid practical acceptance remain open.','Census preserves ruby, captions and small text; no full semantic acceptance is inferred from geometry.'],'legacySummary':{'hierarchyUnits':639,'facts':1476,'assessmentGaps':sum(not f.get('questionIds') and not f.get('crossShardQuestionIds') and fid not in reference_excluded and not fid.startswith('rst-v2-') for fid,f in cross['facts'].items()),'referenceExcludedFacts':len(reference_excluded)},'censusSummary':{'pages':271,'elementsByKind':dict(region_counts),'retainedTextSpans':font_spans,'retainedSmallFontSpans':small,'fontSizeBasedExclusions':0}}
 import importlib.util
 spec=importlib.util.spec_from_file_location('restaurant_v2_reviews',ROOT/'scripts/restaurant/apply-source-coverage-v2-reviews.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
 if (OUT/'restaurant-review-20261102.json').exists():result=mod.apply(result)
 return result

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--source-dir',required=True,type=Path);ap.add_argument('--check',action='store_true');a=ap.parse_args();result=build(a.source_dir);out=OUT/'restaurant.json'
 if a.check:assert read(out)==result,'Canonical ledger drift; review changed inputs'
 else:save(out,result)
 print(json.dumps({'status':'PASS_CENSUS_AND_CANDIDATE_MIGRATION_NOT_SEMANTIC_CLOSURE',**result['censusSummary'],'legacyFacts':1476,'coveragePercent':None}))
if __name__=='__main__':main()
