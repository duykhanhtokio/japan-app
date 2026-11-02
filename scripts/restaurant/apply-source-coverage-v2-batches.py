"""Apply explicit bounded source-reading receipts; no keyword-based acceptance."""
import json,gzip,hashlib,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/ssw-workspace/source-coverage-v2';CAN=ROOT/'docs/ssw-workspace/restaurant/source-closure31/canonical-ja.json'
def sha(x):return hashlib.sha256(x).hexdigest()
def digest(v):return sha(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode())
def esc(x):return str(x).replace('~','~0').replace('/','~1')
def apply(result):
 units={u['knowledgeId']:u for u in result['knowledgeUnits']};pages={(p['sourceId'],p['pdfPage']):p for p in result['pages']};sources={s['sourceId']:s for s in result['sources']};canon=json.loads(CAN.read_text())['items'];docs={};oldq={};cross=json.loads((CAN.parent/'unit-crosswalk.json').read_text())['facts']
 for level in ['1','2']:
  path=f'src/data/restaurant/exams.{level}.ja.json'
  for i,exam in enumerate(json.loads((ROOT/path).read_text())['exams']):
   for j,q in enumerate(exam['questions']):oldq[q['id']]=(path,f'/exams/{i}/questions/{j}',q)
 def evidence(path,ptr,value,note):return dict(path=path,jsonPointer=ptr,sha256=digest(value),sha256Mode='json-value',relation='direct',semanticReviewed=True,reviewNote=note)
 for receipt in sorted(OUT.glob('restaurant-r2-*-source-review-*.json')):
  review=json.loads(receipt.read_text());assert review['status']=='self_checked_ai' and review['sourceTextRead'] and review['sourceVisualReviewed'];rr=str(receipt.relative_to(ROOT))
  for r in review['reviews']:
   u=units[r['knowledgeId']];allrefs={(s['sourceId'],s['pdfPage'])for s in u['sourceRefs']};assert allrefs=={(s['sourceId'],s['pdfPage'])for s in r['sourceSelections']},(u['knowledgeId'],'Every inherited source occurrence must be reviewed')
   for sel in r['sourceSelections']:
    sid=sel['sourceId'];n=sel['pdfPage'];assert sources[sid]['sha256']==review['sourceSha256'][sid];p=pages[(sid,n)];file=p['regionCensus']['artifactPath']
    if file not in docs:docs[file]=json.loads(gzip.decompress((ROOT/file).read_bytes()))
    ap=next(v for v in docs[file]['pages']if v['pdfPage']==n);selected=[]
    if sel.get('usePreviouslyReviewedElements'):
     selected=next(s['elementIds']for s in u['sourceRefs']if s['sourceId']==sid and s['pdfPage']==n);assert selected
    else:
     for e in ap['elements']:
      if e['elementId'] in sel.get('elementIds',[]):selected.append(e['elementId'])
      if e['kind']!='text_span':continue
      block=int(re.search(r':t(\d+)-',e['elementId']).group(1));yes=False
      if 'textBlockRange'in sel:yes=sel['textBlockRange'][0]<=block<=sel['textBlockRange'][1]
      if 'textYRange'in sel:yes|=sel['textYRange'][0]<=e['bbox'][1] and e['bbox'][3]<=sel['textYRange'][1]
      if 'textBox'in sel:
       x0,y0,x1,y1=sel['textBox'];a,b,c,d=e['bbox'];yes|=x0<=a and y0<=b and c<=x1 and d<=y1
      if yes:selected.append(e['elementId'])
    assert selected,(r['knowledgeId'],sel)
    for e in ap['elements']:
     if e['elementId']in selected:e['classification']='knowledge';e['knowledgeIds']=sorted(set(e['knowledgeIds']+[u['knowledgeId']]));e['reason']='Explicit bounded source-reader review; this does not classify the remaining page.'
    for ref in u['sourceRefs']:
     if ref['sourceId']==sid and ref['pdfPage']==n:ref['elementIds']=selected
    if u['knowledgeId']not in p['knowledgeIds']:p['knowledgeIds'].append(u['knowledgeId']);p['knowledgeIds'].sort()
    p['regionCensus']['status']='visually_reviewed';p['regionCensus']['visualReviewRef']=rr
    if p['semanticInventory']['status']!='complete_ai':p['semanticInventory']={'status':'partial','reviewRef':rr}
    p['disposition']='instructional'
   te=[]
   for id in r.get('teachingItemIds',[]):
    v=canon[id];te.append(evidence(str(CAN.relative_to(ROOT)),'/items/'+esc(id),v,r['teachingReview']))
   for ref in r.get('teachingParagraphs',[]):
    path=f"src/data/restaurant/lessons.{ref['level']}.ja.json";ls=json.loads((ROOT/path).read_text())['lessons'];i=next(i for i,l in enumerate(ls)if l['id']==ref['lessonId']);j=next(j for j,p in enumerate(ls[i]['paragraphs'])if p['id']==ref['paragraphId']);te.append(evidence(path,f'/lessons/{i}/paragraphs/{j}/textJa',ls[i]['paragraphs'][j]['textJa'],r['teachingReview']))
   ae=[]
   for id in r['questionIds']:
    if id in canon:
     v=canon[id];assert u['knowledgeId']in v['factIds'] or id in cross[u['knowledgeId']].get('questionIds',[]),(u['knowledgeId'],id,'Cross-objective reuse needs an explicit current fact binding');ae.append(evidence(str(CAN.relative_to(ROOT)),'/items/'+esc(id),v,r['assessmentReview']))
    else:
     path,ptr,v=oldq[id];ae.append(evidence(path,ptr,v,r['assessmentReview']))
   assert te and ae;u.update(before=r['before'],teachingEvidence=te,assessmentEvidence=ae,conditionsJa=r['conditionsJa'],exceptionsJa=r['exceptionsJa'],after={'teaching':'present','assessment':'present'},assessmentRequirement='required',assessmentExemptionReason=None,status='covered_ai',expressionReview={'status':'independent_ai_checked','note':r['expressionReview']},sourceReview={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':rr},unresolved=[])
  for inventory in review.get('pageInventories',[]):
   assert inventory['sourceTextAndVisualCompleteSelfReview'];sid=inventory['sourceId'];n=inventory['pdfPage'];p=pages[(sid,n)];file=p['regionCensus']['artifactPath'];assert file in docs
   ap=next(v for v in docs[file]['pages']if v['pdfPage']==n)
   for e in ap['elements']:
    if e['kind']=='text_span':
     center=(e['bbox'][1]+e['bbox'][3])/2;choices=[b for b in inventory['textYBands']if b['yMin']<=center<b['yMax']];assert len(choices)==1,(e['elementId'],center);decision=choices[0];ids=decision['knowledgeIds'];cl=decision['classification'];reason=decision['reason']
     if decision.get('panelLabels'):
      x=(e['bbox'][0]+e['bbox'][2])/2;index=sum(x>=boundary for boundary in inventory['panelXBoundaries']);ids=[inventory['imagePanelKnowledgeIds'][index]]
    elif e['kind']=='image':
     index=int(e['elementId'].rsplit(':i',1)[1]);ids=[inventory['imagePanelKnowledgeIds'][index]];cl='knowledge';reason='Individually source-viewed action panel; links factual preparation action, not artwork appearance or an additional unique knowledge count.'
    else:raise AssertionError(('Unexpected full-page element requires manual classification',e['elementId']))
    e.update(classification=cl,knowledgeIds=ids,reason=reason)
    for uid in ids:
     u=units[uid];assert u['status']=='covered_ai';ref=next(s for s in u['sourceRefs']if s['sourceId']==sid and s['pdfPage']==n);ref['elementIds']=sorted(set(ref['elementIds']+[e['elementId']]))
     if uid not in p['knowledgeIds']:p['knowledgeIds'].append(uid)
   p['knowledgeIds'].sort();p['semanticInventory']={'status':'complete_ai','reviewRef':rr};p['regionCensus']['status']='visually_reviewed';p['regionCensus']['visualReviewRef']=rr;p['disposition']='instructional'
 for rel,d in docs.items():
  path=ROOT/rel;path.write_bytes(gzip.compress(json.dumps(d,ensure_ascii=False,separators=(',',':')).encode(),mtime=0));h=sha(path.read_bytes())
  for p in result['pages']:
   if p['regionCensus']['artifactPath']==rel:p['regionCensus']['sha256']=h
 if units.get('rst-v2-hygiene1-cause-specific-response',{}).get('status')=='covered_ai':
  result['unresolved']=[s for s in result['unresolved']if not s.startswith('Two additional page-5 source objectives found')]
 result['sourceReaderBatchReceipts']=[str(p.relative_to(ROOT))for p in sorted(OUT.glob('restaurant-r2-*-source-review-*.json'))];return result
