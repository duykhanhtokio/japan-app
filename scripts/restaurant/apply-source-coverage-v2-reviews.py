"""Apply explicit source-reader decisions, never keywords or geometric-count closure."""
import json,gzip,hashlib,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
DOC=ROOT/'docs/ssw-workspace/restaurant/source-closure31'
OUT=ROOT/'docs/ssw-workspace/source-coverage-v2'
RECEIPT=OUT/'restaurant-review-20261102.json'
def sha(b):return hashlib.sha256(b).hexdigest()
def hval(x):return sha(json.dumps(x,ensure_ascii=False,separators=(',',':')).encode())
def esc(s):return str(s).replace('~','~0').replace('/','~1')
def ev(path,ptr,x,note):return {'path':path,'jsonPointer':ptr,'sha256':hval(x),'sha256Mode':'json-value','relation':'direct','semanticReviewed':True,'reviewNote':note}
def apply(result):
 review=json.loads(RECEIPT.read_text());assert review['sourceTextAndVisualReview'] is True
 sources={s['sourceId']:s for s in result['sources']};assert sources['rst-1-hygiene']['sha256']==review['sourcePdfSha256']
 canonical=json.loads((DOC/'canonical-ja.json').read_text())['items'];units={u['knowledgeId']:u for u in result['knowledgeUnits']};pages={(p['sourceId'],p['pdfPage']):p for p in result['pages']};docs={}
 for r in review['reviews']:
  u=units[r['knowledgeId']];p=pages[(r['sourceId'],r['pdfPage'])];file=p['regionCensus']['artifactPath']
  if file not in docs:docs[file]=json.loads(gzip.decompress((ROOT/file).read_bytes()))
  ap=next(x for x in docs[file]['pages'] if x['pdfPage']==r['pdfPage']);selector=r['selector'];selected=[]
  for e in ap['elements']:
   is_selected=e['elementId'] in selector.get('elementIds',[]) or e['kind'] in selector.get('kinds',[])
   if e['kind']=='text_span':
    block=int(re.search(r':t(\d+)-',e['elementId']).group(1))
    if 'textBlockRange'in selector:is_selected|=selector['textBlockRange'][0]<=block<=selector['textBlockRange'][1]
    if 'textYRange'in selector:is_selected|=selector['textYRange'][0]<=e['bbox'][1] and e['bbox'][3]<=selector['textYRange'][1]
   if is_selected:
    e['classification']='knowledge';e['knowledgeIds']=sorted(set(e['knowledgeIds']+[u['knowledgeId']]));e['reason']='Explicit worker source-reading selection; bounded claim, not complete element/page semantic inventory.';selected.append(e['elementId'])
  assert selected,(r['knowledgeId'],'no source element');assert len(u['sourceRefs'])==1,(u['knowledgeId'],'review all source occurrences before closure')
  u['sourceRefs'][0]['elementIds']=selected;u['conditionsJa']=r['conditionsJa'];u['exceptionsJa']=r['exceptionsJa'];u['teachingEvidence']=[]
  if 'teachingRef'in r:
   ref=r['teachingRef'];path='src/data/restaurant/lessons.1.ja.json';ls=json.loads((ROOT/path).read_text())['lessons'];i=next(i for i,l in enumerate(ls)if l['id']==ref['lessonId']);j=next(j for j,p in enumerate(ls[i]['paragraphs'])if p['id']==ref['paragraphId']);v=ls[i]['paragraphs'][j]['textJa'];u['teachingEvidence'].append(ev(path,f'/lessons/{i}/paragraphs/{j}/textJa',v,r['reviewNote']))
  for id in [*r.get('teachingItemIds',[]),*([r['teachingItemId']]if 'teachingItemId'in r else [])]:
   v=canonical[id];u['teachingEvidence'].append(ev('docs/ssw-workspace/restaurant/source-closure31/canonical-ja.json','/items/'+esc(id),v,r['reviewNote']))
  q=canonical[r['questionId']];assert u['knowledgeId'] in q['factIds'];u['assessmentEvidence']=[ev('docs/ssw-workspace/restaurant/source-closure31/canonical-ja.json','/items/'+esc(q['id']),q,r['reviewNote'])]
  if 'imageId'in r:
   im=canonical[r['imageId']];u['imageEvidence']=[{'path':im['assetFile'],'sha256':sha((ROOT/im['assetFile']).read_bytes()),'sha256Mode':'file','relation':'direct','semanticReviewed':True,'reviewNote':r['reviewNote'],'keyObjectiveId':u['knowledgeId'],'caption':im['captionJa'],'alt':im['altJa'],'rights':'Independent controlled instructional diagram; existing authoring provenance, no source PDF pixels.'}]
  u['before']['assessment']='missing';u['after']={'teaching':'present','assessment':'present'};u['assessmentRequirement']='required';u['assessmentExemptionReason']=None;u['expressionReview']={'status':'independent_ai_checked','note':r['expressionNote']};u['sourceReview']={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':str(RECEIPT.relative_to(ROOT))};u['status']='covered_ai';u['unresolved']=[]
  p['disposition']='instructional';p['regionCensus']['status']='visually_reviewed';p['regionCensus']['visualReviewRef']=str(RECEIPT.relative_to(ROOT));p['semanticInventory']={'status':'partial','reviewRef':str(RECEIPT.relative_to(ROOT))}
 # Whole-page reading decisions are separate from app acceptance. New source
 # objectives remain visible gaps instead of being forced into broad legacy IDs.
 page_receipt=OUT/'restaurant-page5-semantic-review-20261102.json'
 if page_receipt.exists():
  pr=json.loads(page_receipt.read_text());assert pr['wholePageVisualReviewed'] and pr['sourceTextRead'] and pr['sourcePdfSha256']==sources[pr['sourceId']]['sha256']
  p=pages[(pr['sourceId'],pr['pdfPage'])];rel=p['regionCensus']['artifactPath']
  if rel not in docs:docs[rel]=json.loads(gzip.decompress((ROOT/rel).read_bytes()))
  ap=next(x for x in docs[rel]['pages'] if x['pdfPage']==pr['pdfPage'])
  for spec in pr['newUnits']:
   uid=spec['knowledgeId']
   u={'knowledgeId':uid,'sourceRefs':[{'sourceId':pr['sourceId'],'pdfPage':pr['pdfPage'],'elementIds':[]}],'statementJa':spec['statementJa'],'conditionsJa':spec['conditionsJa'],'exceptionsJa':spec['exceptionsJa'],'importance':spec['importance'],'classification':'knowledge','before':{'teaching':'unknown','assessment':'missing'},'after':{'teaching':'missing','assessment':'missing'},'teachingEvidence':[],'assessmentEvidence':[],'imageEvidence':[],'assessmentRequirement':'required','assessmentExemptionReason':None,'expressionReview':{'status':'pending','note':'New independently summarized source objective; app addition/exact evidence is still pending.'},'status':'partial','unresolved':[spec['unresolved']],'sourceReview':{'status':'self_checked_ai','conditionsChecked':True,'reviewRef':str(page_receipt.relative_to(ROOT))},'legacyRefs':[],'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False}}
   if spec['teachingItemId']:
    item=canonical[spec['teachingItemId']];note='Whole-page source reading: '+('independent contamination-to-consumer explanation with vomiting/diarrhea examples and explicit non-universality condition.' if spec.get('assessmentQuestionId') else 'explicit cause classification and selection of differing controls; assessment coverage remains open.');u['teachingEvidence']=[ev('docs/ssw-workspace/restaurant/source-closure31/canonical-ja.json','/items/'+esc(item['id']),item,note)];u['after']['teaching']='present'
   if spec.get('assessmentQuestionId'):
    q=canonical[spec['assessmentQuestionId']];assert uid in q['factIds'];u['assessmentEvidence']=[ev('docs/ssw-workspace/restaurant/source-closure31/canonical-ja.json','/items/'+esc(q['id']),q,'Independent causal-relation question: correct choice links contaminated food to possible consumer vomiting/diarrhea; distractors test no-health-effect, universal identical symptoms and presumed harmlessness from eating. All source conditions retained.')];u['after']['assessment']='present';u['status']='covered_ai';u['unresolved']=[];u['expressionReview']={'status':'independent_ai_checked','note':spec['expressionNote']}
   for qid in spec.get('existingAssessmentQuestionIds',[]):
    matches=[]
    for level in ['1','2']:
     path=f'src/data/restaurant/exams.{level}.ja.json'
     for i,exam in enumerate(json.loads((ROOT/path).read_text())['exams']):
      for j,q in enumerate(exam['questions']):
       if q['id']==qid:matches.append(ev(path,f'/exams/{i}/questions/{j}',q,spec['unresolved']))
    assert len(matches)==1,qid;u['assessmentEvidence'].extend(matches);u['after']['assessment']='partial'
   if uid in units:
    previous=units[uid];u['legacyRefs']=previous['legacyRefs'];result['knowledgeUnits'][result['knowledgeUnits'].index(previous)]=u
   else:result['knowledgeUnits'].append(u)
   units[uid]=u
  for e in ap['elements']:
   if e['kind']=='text_span':
    block=int(re.search(r':t(\d+)-',e['elementId']).group(1));decisions=[r for r in pr['textBlockDecisions'] if r['from']<=block<=r['to']];assert len(decisions)==1,(e['elementId'],decisions);decision=decisions[0]
   else:
    decision=pr['nonTextDecision'];assert e['kind'] in decision['kinds'],e['elementId']
   e['classification']=decision['classification'];e['knowledgeIds']=decision['knowledgeIds'];e['reason']=decision['reason']
   for uid in e['knowledgeIds']:
    u=units[uid];refs=[r for r in u['sourceRefs'] if r['sourceId']==pr['sourceId'] and r['pdfPage']==pr['pdfPage']]
    if not refs:
     refs=[{'sourceId':pr['sourceId'],'pdfPage':pr['pdfPage'],'elementIds':[]}];u['sourceRefs'].extend(refs)
    for ref in refs:ref['elementIds']=sorted(set(ref['elementIds']+[e['elementId']]))
    if uid not in p['knowledgeIds']:p['knowledgeIds'].append(uid)
  p['knowledgeIds'].sort();p['disposition']='instructional';p['regionCensus']['status']='visually_reviewed';p['regionCensus']['visualReviewRef']=str(page_receipt.relative_to(ROOT));p['semanticInventory']={'status':'complete_ai','reviewRef':str(page_receipt.relative_to(ROOT))}
  result['unresolved'].append('Two additional page-5 source objectives found by complete semantic inventory; consumer causal definition now has independent direct teaching/assessment, cause-specific response still needs its own complete assessment.')
 for rel,d in docs.items():
  file=ROOT/rel;file.write_bytes(gzip.compress(json.dumps(d,ensure_ascii=False,separators=(',',':')).encode(),mtime=0));h=sha(file.read_bytes())
  for p in result['pages']:
   if p['regionCensus']['artifactPath']==rel:p['regionCensus']['sha256']=h
 result['boundedReviewReceipt']=str(RECEIPT.relative_to(ROOT));return result
if __name__=='__main__':
 p=OUT/'restaurant.json';x=apply(json.loads(p.read_text()));p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n');print('Applied4explicitboundedsource/self-reviewdecisions;page/sectorclosuresremainfalse.')
