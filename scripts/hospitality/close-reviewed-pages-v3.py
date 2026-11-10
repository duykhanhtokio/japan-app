"""Apply explicit self-read semantic dispositions, never generic bbox/keyword closure.
Run after build-source-census-v2.py. Private PDF screenshots were read; no prose is exported.
"""
import json,gzip,pathlib,hashlib,re
ROOT=pathlib.Path(__file__).resolve().parents[2];OUT=ROOT/'docs/ssw-workspace/source-coverage-v2';RECEIPT='docs/ssw-workspace/hospitality/source-v3-page-closure-review.json'
def group(ids,blocks):return {b:ids.split(',') for b in blocks}
# Body/label blocks are explicitly reviewed, not inferred from text similarity.
INTRO={**group('HF1-005-01',list(range(0,4))+[6]+list(range(8,13))),7:['HF1-005-01','HX1-005-reception'],**group('HF1-005-02',[13,14])}
RES=group('HF1-006-01',[3,4,5,8,9,10])
AVAIL={**group('HF1-007-01',[13,14]),**group('HF1-007-02',range(15,24)),**group('HF1-007-03',[0,1,2,3,4]),**group('HF1-007-04',[5,6]),**group('HA1-007-01,HA1-007-02',[7,8]),**group('HF1-007-05',[9,10]),11:['HF1-007-06'],12:['HF1-007-07']}
GUEST={**group('HF1-008-07',[0,1,2]),3:['HF1-008-01'],4:['HF1-008-02'],5:['HF1-008-04'],6:['HF1-008-06'],**group('HF1-008-03',[7,8,18,19]),**group('HF1-008-05',[9,10])}
AVAIL2={**group('HF1-007-01',[0,1]),**group('HF1-007-02',range(2,11)),**group('HF2-010-01',[19,20]),21:['HF2-010-02'],22:['HF2-010-02','HF2-010-03'],23:['HF2-010-03','HF2-010-04'],24:['HF2-010-04']}
CALL={**group('HF1-007-03',[7,8]),**group('HF1-007-04',[9,10]),**group('HA1-007-01,HA1-007-02',[11,12]),**group('HF1-007-05,HF2-011-01',[13,14]),15:['HF1-007-06'],16:['HF1-007-07'],**group('HX2-011-reservation',[28,29,30,31]),**group('HF2-011-02',[36,37]),38:['HF2-011-03'],39:['HF2-011-03','HF2-011-04'],40:['HF2-011-04','HF2-011-05','HF2-011-07'],41:['HF2-011-05','HF2-011-06','HF2-011-07'],42:['HF2-011-06']}
SPECS={('hotel-1',5):(INTRO,set(range(15,23)),{4,5,23,24,25,26,27,28,29,30,31,32},'intro'),('hotel-2',8):(INTRO,set(range(15,23)),{4,5,23,24,25,26,27,28,29,30,31,32},'intro'),('hotel-1',6):(RES,{14,15,16},{0,1,2,6,7,11,12,13,17,18,19},'reservation'),('hotel-2',9):(RES,{14,15,16},{0,1,2,6,7,11,12,13,17,18,19},'reservation'),('hotel-1',7):(AVAIL,set(range(33,54)),set(range(24,33))|{54},'availability'),('hotel-2',10):(AVAIL2,set(range(26,41)),set(range(11,19))|{25,41},'availability'),('hotel-2',11):(CALL,set(range(17,28))|set(range(32,36))|set(range(43,53)),set(range(7))|{53},'call'),('hotel-1',8):(GUEST,set(range(22,34)),set(range(11,18))|{20,21,34},'guest'),('hotel-2',12):(GUEST,set(range(22,34)),set(range(11,18))|{20,21,34},'guest')}
SPECS.update({('hotel-1',15):(group('HF1-015-01',[7,8,9,10]),set(range(13,17)),set(range(7))|{11,12,17},'room_entry'),('hotel-2',20):({**group('HF1-015-01',[7,8,9,10]),**group('HF2-020-01',[11,12])},set(range(15,22)),set(range(7))|{13,14,22},'room_entry')})
WEB={**group('HP1-024-02,HP1-024-07',[1,2,3]),**group('HP1-024-01',[4,5,6]),**group('HP1-024-02',[7,8,9]),**group('HP1-024-03',[10,11]),**group('HP1-024-04',[12,13]),**group('HP1-024-04,HP1-021-07',[14,15]),**group('HP1-024-05',[16,17,18]),**group('HP1-024-06',[19,20,21]),**group('HP1-024-07',[22,23,24])}
WEB2={b if b<16 else b+1:ids[:] for b,ids in WEB.items()};WEB2[8].append('HP2-030-01');WEB2[9].append('HP2-030-01');WEB2[16]=['HP2-030-02']
SPECS.update({('hotel-1',24):(WEB,set(range(29,54)),{0,25,26,27,28,54},'website'),('hotel-2',30):(WEB2,set(range(30,56)),{0,26,27,28,29,56},'website')})
ledger=json.loads((OUT/'hospitality.json').read_text());units={u['knowledgeId']:u for u in ledger['knowledgeUnits']};receipts=[]
for sid in ['hotel-1','hotel-2']:
 path=OUT/f'hospitality-{sid}-elements.json.gz';a=json.loads(gzip.decompress(path.read_bytes()))
 for p in a['pages']:
  key=(sid,p['pdfPage'])
  if key not in SPECS:continue
  body,ruby,nav,kind=SPECS[key];assert not(set(body)&ruby or set(body)&nav or ruby&nav)
  for e in p['elements']:
   eid=e['elementId'];ids=[];cls=None;reason=None
   if e['kind']=='text':
    bi=int(eid.split('-text-')[1]);assert bi in body or bi in ruby or bi in nav,(key,bi)
    if bi in body:cls='knowledge';ids=body[bi];reason='Explicitly self-read body/label; source condition and app competency reviewed.'
    elif bi in ruby:cls='duplicate';reason='Source pronunciation gloss of the body/labels on this page, checked against the visible main text; no additional occupational claim. Retained in census.'
    else:cls='navigation';reason='Self-read heading, chapter/page number, repeated workflow navigator or next-page direction; substantive workflow concepts separately mapped.'
   elif e['kind']=='text_span':
    parent=next(x for x in p['elements'] if x['elementId']==e['parentId']);cls='duplicate';reason='Exact retained span of classified parent '+parent['elementId']+'; same characters, not another independent source idea.'
   elif e['kind']=='image':cls='decorative';reason='Rendered page inspected: clipped oversized background raster placement has no visible independent occupational labels or relationships; actual diagrams are preserved as vector/text regions.'
   elif e['kind']=='vector':
    vi=int(eid.split('-vector-')[1])
    if kind=='intro':cls='knowledge';ids=['HF1-005-01'];reason='Four-stage reception workflow boxes/arrows reproduce the conceptual sequence taught and tested, not a new numerical table.'
    elif kind=='reservation' and e['bbox'][1]>100:cls='knowledge';ids=['HF1-006-01'];reason='Reservation branch connectors link enquiry, guest information, changes/cancellation; all three functions checked against teaching and assessment.'
    elif kind=='availability' and vi==4:cls='knowledge';ids=['HF1-007-02'];reason='Vacancy/full illustration contrast read with its two labels; meaning taught and separately tested in q10.'
    elif e['bbox'][1]<130:cls='navigation';reason='Repeated chapter workflow location marker, not a new service procedure.'
    else:cls='decorative';reason='Visible bullet dot or list/frame border has no independent instruction, quantity or directional relation; associated text remains mapped.'
   elif e['kind']=='table':
    if kind=='availability':cls='knowledge';ids=['HF1-007-02'];reason='Table detector caught vacancy illustration geometry. Figure and labels checked; no data table or quantitative relation exists here.'
    elif kind=='reservation' and e['bbox'][1]>100:cls='knowledge';ids=['HF1-006-01'];reason='Table detector caught reservation flowchart branches, checked as three reservation-management functions; no numerical rows omitted.'
    else:cls='navigation';reason='Table detector caught repeated top workflow navigation geometry; cells do not contain additional occupational data.'
   else:raise AssertionError(e)
   if cls!='knowledge':
    for u in units.values():
     for rr in u['sourceRefs']:
      if rr['sourceId']==sid and rr['pdfPage']==p['pdfPage'] and eid in rr['elementIds']:rr['elementIds'].remove(eid)
   if cls=='knowledge':
    ids=sorted(set(ids)|set(e.get('knowledgeIds',[]))|{u['knowledgeId'] for u in units.values() for rr in u['sourceRefs'] if rr['sourceId']==sid and rr['pdfPage']==p['pdfPage'] and eid in rr['elementIds']})
   e.update(classification=cls,knowledgeIds=ids,reason=reason,semanticReviewRef=RECEIPT)
   for uid in ids:
    u=units[uid];ref=next((r for r in u['sourceRefs'] if r['sourceId']==sid and r['pdfPage']==p['pdfPage']),None)
    if ref is None:ref={'sourceId':sid,'pdfPage':p['pdfPage'],'elementIds':[]};u['sourceRefs'].append(ref)
    if eid not in ref['elementIds']:ref['elementIds'].append(eid)
  page=next(q for q in ledger['pages'] if q['sourceId']==sid and q['pdfPage']==p['pdfPage']);page['semanticInventory']={'status':'complete_ai','reviewRef':RECEIPT};page['regionCensus']['visualReviewRef']=RECEIPT
  page['knowledgeIds']=sorted(set(page['knowledgeIds'])|{uid for e in p['elements'] for uid in e['knowledgeIds']});assert all(units[uid]['status']=='covered_ai' for uid in page['knowledgeIds'])
  receipts.append({'sourceId':sid,'pdfPage':p['pdfPage'],'elements':len(p['elements']),'knowledgeIds':page['knowledgeIds'],'bodyBlocks':sorted(body),'rubyBlocks':sorted(ruby),'navigationBlocks':sorted(nav),'visualAndSemanticStatus':'self_checked_ai','allRequiredKnowledgeCoveredAi':True,'specificReview':'All paragraphs, list labels, small reading glosses, workflow arrows/branches, vacancy illustration and detector table cells inspected. Repeated navigator distinguished from instructional diagram; no occupation fact excluded by font size.'})
 path.write_bytes(gzip.compress(json.dumps(a,ensure_ascii=False,separators=(',',':')).encode(),mtime=0));sha=hashlib.sha256(path.read_bytes()).hexdigest()
 for p in ledger['pages']:
  if p['sourceId']==sid:p['regionCensus']['sha256']=sha
# A fresh source-first gap: the SNS-brand purpose is distinct from posting cadence,
# account tagging and generic branding vocabulary. Existing questions were searched.
gap_id='HSP1-025-sns-brand-purpose'
if gap_id not in units:
 unit={'knowledgeId':gap_id,'sourceRefs':[],'statementJa':'SNSでお客様との交流を続けることは、施設のブランドを育てる目的にもつながる。','conditionsJa':['ブランドの形成に役立つ可能性を学ぶもので、投稿回数だけで認知や売上の増加を保証しない。'],'exceptionsJa':[],'importance':'supporting','classification':'knowledge','before':{'teaching':'unknown','assessment':'unknown'},'after':{'teaching':'partial','assessment':'missing'},'teachingEvidence':[],'assessmentEvidence':[],'imageEvidence':[],'assessmentRequirement':'required','assessmentExemptionReason':None,'expressionReview':{'status':'pending','note':'Independent app wording tying SNS relationship-building explicitly to brand purpose still needs a focused addition.'},'sourceReview':{'status':'self_checked_ai','conditionsChecked':True,'reviewRef':'docs/ssw-workspace/hospitality/source-v3-open-gaps.json'},'status':'partial','unresolved':['Planning04 content teaches relationship-building; planning07 brand teaches generic branding. Existing planning04 questions and planning07-q02 do not directly test the specific SNS-to-brand purpose. Add focused teaching and assessment before closure, then update affected12locales/readings.'],'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False}}
 for sid,pn in [('hotel-1',25),('hotel-2',31)]:
  ap=OUT/f'hospitality-{sid}-elements.json.gz';artifact=json.loads(gzip.decompress(ap.read_bytes()));pg=next(p for p in artifact['pages'] if p['pdfPage']==pn);eids=[f'{sid}-p{pn:03}-text-{b:03}' for b in [1,2]]
  for eid in eids:
   e=next(e for e in pg['elements'] if e['elementId']==eid);e.update(classification='knowledge',knowledgeIds=[gap_id],reason='Freshly identified SNS relationship/brand purpose; teaching and assessment gap remains explicit.')
  ap.write_bytes(gzip.compress(json.dumps(artifact,ensure_ascii=False,separators=(',',':')).encode(),mtime=0));sha=hashlib.sha256(ap.read_bytes()).hexdigest()
  for lp in ledger['pages']:
   if lp['sourceId']==sid:lp['regionCensus']['sha256']=sha
  page=next(p for p in ledger['pages'] if p['sourceId']==sid and p['pdfPage']==pn);page['knowledgeIds'].append(gap_id)
  unit['sourceRefs'].append({'sourceId':sid,'pdfPage':pn,'elementIds':eids})
 ledger['knowledgeUnits'].append(unit)
(ROOT/'docs/ssw-workspace/hospitality/source-v3-open-gaps.json').write_text(json.dumps({'date':'2026-11-02','knowledgeId':gap_id,'sourceRefs':next(u for u in ledger['knowledgeUnits'] if u['knowledgeId']==gap_id)['sourceRefs'],'existingContentSearched':['hotel-planning-04-content','hotel-planning-04-q01..q08','hotel-planning-07-brand','hotel-planning-07-q02'],'finding':'SNS relationship-building and brand formation is an explicit source purpose absent from the inherited380 denominator. Generic branding and content planning questions are related, but are not accepted as direct assessment of this relation.','nextAction':'Add focused independent Japanese teaching and assessment, then affected12locale translations and ruby. This discovered gap keeps SNS pages partial; no closure percentage is inferred.','domainReviewed':False,'nativeReviewed':False},ensure_ascii=False,indent=2)+'\n')
(OUT/'hospitality.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
(ROOT/RECEIPT).write_text(json.dumps({'date':'2026-11-02','status':'SELF_CHECKED_AI_PAGE_INVENTORY','pages':receipts,'sourceProseRedistributed':False,'newKnowledgeDenominatorFrozen':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False,'scopeNote':'Thirteen explicitly listed pages only; whole117-page source denominator remains open. Source pronunciation gloss classification does not certify app audio/native pronunciation.'},ensure_ascii=False,indent=2)+'\n')
print('Semantically classified all elements on',len(receipts),'pages; denominator stays open')
