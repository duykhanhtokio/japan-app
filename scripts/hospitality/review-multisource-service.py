"""Three bounded self-reviewed groups; requires both exact private PDFs.

Source prose stays private. Public receipts contain hashes, coordinates, concise
independently worded competencies and exact app evidence only.
"""
import sys,json,gzip,hashlib,subprocess,shutil,tempfile
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[2]
BASE='4832f53f8407298126fa43c104a266972f2a3831'
DOC='docs/ssw-workspace/hospitality';RECEIPT=DOC+'/recovery-v9/multisource-service-review.json'
LP='docs/ssw-workspace/source-coverage-v2/hospitality.json'
def read(p):return json.loads((ROOT/p).read_text())
def write(p,x):(ROOT/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def digest(b):return hashlib.sha256(b if isinstance(b,bytes) else b.encode()).hexdigest()
def jhash(x):return digest(json.dumps(x,ensure_ascii=False,separators=(',',':')))
group=int(sys.argv[1]);assert group in [1,2,3]
ledger=read(LP);prior=json.loads(subprocess.check_output(['git','show',BASE+':'+LP],cwd=ROOT))
docs={};artifacts={};artifact_paths={}
for sid,p in zip(['hotel-1','hotel-2'],sys.argv[2:4]):
 source=next(s for s in ledger['sources'] if s['sourceId']==sid);assert digest(Path(p).read_bytes())==source['sha256'];docs[sid]=fitz.open(p);assert len(docs[sid])==source['pdfPages'];artifact_paths[sid]=f'docs/ssw-workspace/source-coverage-v2/hospitality-{sid}-elements.json.gz';artifacts[sid]=json.loads(gzip.decompress((ROOT/artifact_paths[sid]).read_bytes()))
assert len(docs)==2
specs={
1:{
'HS1-034-01':[('hotel-1',34,[2]),('hotel-2',41,[22])],
'HS1-034-02':[('hotel-1',34,[3]),('hotel-2',41,[23])],
'HS1-034-03':[('hotel-1',34,[4]),('hotel-2',41,[24])],
'HS1-034-04':[('hotel-1',34,[5]),('hotel-2',41,[25])],
'HS1-034-05':[('hotel-1',34,[8,9,10,11,12]),('hotel-2',42,[0,1,2,3,4,5])],
'HS1-034-06':[('hotel-1',34,[14,15,16]),('hotel-2',42,[6,7,8])]},
2:{
'HS1-030-01':[('hotel-1',30,[8,9,10]),('hotel-2',37,[8,9,10])],
'HS1-030-02':[('hotel-1',30,[10]),('hotel-2',37,[10])],
'HS1-030-03':[('hotel-1',30,[11]),('hotel-2',37,[11])],
'HS1-030-04':[('hotel-1',30,[12]),('hotel-2',37,[12])]},
3:{
'HS1-033-01':[('hotel-1',33,[1,2]),('hotel-2',40,[1,2])],
'HS1-033-02':[('hotel-1',33,[6]),('hotel-2',40,[6])],
'HS1-033-03':[('hotel-1',33,[3,4]),('hotel-2',40,[3,4])],
'HS1-033-04':[('hotel-1',33,[5]),('hotel-2',40,[5])],
'HS1-033-05':[('hotel-1',33,[7,8]),('hotel-2',40,[7,8])],
'HS1-033-06':[('hotel-1',33,[9,10]),('hotel-2',40,[9,10])],
'HS1-033-07':[('hotel-1',33,[11,12]),('hotel-2',40,[11,12])],
'HS1-033-08':[('hotel-1',33,[13]),('hotel-2',40,[13])],
'HS1-033-09':[('hotel-1',33,[14,15]),('hotel-2',40,[16,17])],
'HS1-033-10':[('hotel-1',33,[16,17]),('hotel-2',40,[19,20])],
'HS1-033-11':[('hotel-1',33,[18,19]),('hotel-2',40,[21,22])],
'HS1-033-12':[('hotel-1',33,[20,21,22,23]),('hotel-2',40,[23,24,25,26])]}}
notes={
'HS1-034-01':'The preparation component of q04 explicitly checks memo paper and writing tools before answering, separately from identifying the facility.',
'HS1-034-02':'The response component of q04 checks identifying the facility when answering; it is not inferred from the caller-identification question.',
'HS1-034-03':'q01 checks the caller name and company name for a company call, preserving the condition rather than requiring every private caller to supply a company.',
'HS1-034-04':'q05 checks waiting for the guest to finish/end the call before putting down the receiver; the source guest-call scope is retained.',
'HS1-034-05':'q02 separately selects apology, careful cause confirmation and reporting to the responsible person. The introductory possibility of complaints is taught in the same paragraph; no guarantee that courtesy prevents complaints.',
'HS1-034-06':'q03 explicitly retains the reporting obligation even when the employee own mistake is clear. The manager-only investigation sentence later in source2 is not claimed as part of this unit.',
'HS1-030-01':'Existing q03 covered back/chin/shoulders but omitted the abdomen component. New focused q17 checks all four together; recognition does not certify actual posture demonstration.',
'HS1-030-02':'q11 explicitly checks hands below the abdomen and the right hand underneath; no angle or numerical hand distance is invented.',
'HS1-030-03':'q14 checks the source alternative of naturally lowering arms by the sides. Teaching explicitly retains the source male example, without making the example a universal prohibition for other guests/staff.',
'HS1-030-04':'q12 explicitly selects a natural expression while facing the guest; the greeting scenario directly checks the expression used in customer-facing posture.',
'HS1-033-01':'q03 selects asking whether the guest is searching for a place/object instead of selecting a destination without asking.',
'HS1-033-02':'q08 separately tests answering a guest who has called and then asking the purpose; answering and immediately returning to work is rejected.',
'HS1-033-03':'q01 combines left-forward positioning, the two-to-three-step guide and matching the guest walking speed, rather than preserving distance by hurrying away.',
'HS1-033-04':'q07 selects stopping, a small bow and waiting for the guest to pass. The passing situation is distinct from walking ahead during guidance.',
'HS1-033-05':'q06 checks careful luggage handling and bringing it inside the intended guest room, not leaving it in the corridor. Actual room-entry permission remains a separate facility condition.',
'HS1-033-06':'q05 explicitly checks palm upward with four fingers together when indicating on a map; it does not certify a physical gesture demonstration.',
'HS1-033-07':'q02 independently checks guest-facing orientation and both hands when handing over a key.',
'HS1-033-08':'q04 preserves guest priority when staff need to use the elevator for work, rather than unconditional employee priority.',
'HS1-033-09':'q01 in service04 directly selects communicating at the wheelchair user eye level. This is a communication choice, not physical-assistance certification.',
'HS1-033-10':'q02 in service04 explicitly asks whether help is needed; source1 does not specify the frontal approach which source2 adds and a separate source2 unit already tracks.',
'HS1-033-11':'q03 and q04 in service04 preserve the guest wish condition for a near-entrance seat and handle a guest who prefers another seat without forcing an entrance seat.',
'HS1-033-12':'q09 and q10 test adapting action to the guest wish and heartfelt service aimed at a satisfying stay; fixed polite words alone are rejected.'}
receipt=read(RECEIPT) if (ROOT/RECEIPT).exists() else {'schemaVersion':1,'parentCommit':BASE,'date':'2026-11-03','sources':[{'sourceId':s['sourceId'],'sha256':s['sha256'],'pdfPages':s['pdfPages']} for s in ledger['sources']],'groups':[],'units':[],'semanticPageInventories':[],'sourceElementChecks':{},'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False}
assert not any(g['group']==group for g in receipt['groups'])
backup=Path(tempfile.mkdtemp(prefix=f'hotel-multisource-group{group}-'))
for p in [LP,RECEIPT,*artifact_paths.values()]:
 if (ROOT/p).exists():q=backup/p;q.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(ROOT/p,q)
def bind(sid,pn,eid,ids,reason):
 page=next(p for p in artifacts[sid]['pages'] if p['pdfPage']==pn);el=next(e for e in page['elements'] if e['elementId']==eid);assert el['kind']=='text';index=int(eid.split('-')[-1]);b=docs[sid][pn-1].get_text('dict')['blocks'][index];assert b['type']==0;text='\n'.join(''.join(sp['text'] for sp in ln['spans']) for ln in b['lines']);assert digest(text)==el['sha256'];assert max(abs(x-y) for x,y in zip(b['bbox'],el['bbox']))<.002
 el.update(classification='knowledge',knowledgeIds=list(dict.fromkeys(el['knowledgeIds']+ids)),reason=reason,semanticReviewRef=RECEIPT);receipt['sourceElementChecks'][eid]={'sha256':el['sha256'],'bboxVerified':True}
 for kid in ids:
  u=next(u for u in ledger['knowledgeUnits'] if u['knowledgeId']==kid);ref=next((r for r in u['sourceRefs'] if r['sourceId']==sid and r['pdfPage']==pn),None)
  if ref is None:
   assert kid=='HS1-033-12' and sid=='hotel-2' and pn==40
   ref={'sourceId':sid,'pdfPage':pn,'elementIds':[]};u['sourceRefs'].append(ref);page_link=next(pg for pg in ledger['pages'] if pg['sourceId']==sid and pg['pdfPage']==pn);page_link['knowledgeIds']=list(dict.fromkeys(page_link['knowledgeIds']+[kid]));receipt.setdefault('addedCorroboratingSourceRefs',[]).append({'knowledgeId':kid,'sourceId':sid,'pdfPage':pn,'reason':'Source2 page40 also explicitly explains heartfelt service and guest stay satisfaction; source1-only legacy provenance did not include this corroborating paragraph.'})
  ref['elementIds']=list(dict.fromkeys(ref['elementIds']+[eid]))
 return el
for kid,refs in specs[group].items():
 u=next(u for u in ledger['knowledgeUnits'] if u['knowledgeId']==kid);assert u['status']=='candidate';before=next(u for u in prior['knowledgeUnits'] if u['knowledgeId']==kid)
 for sid,pn,indices in refs:
  for n in indices:bind(sid,pn,f'{sid}-p{pn:03d}-text-{n:03d}',[kid],'Bounded operational competency self-read in both private source PDFs and page images; no whole-page closure inferred from this link.')
 for typ in ['teachingEvidence','assessmentEvidence']:
  for e in u[typ]:
   value=read(e['path'])
   for key in e['jsonPointer'].strip('/').split('/'):value=value[int(key)] if isinstance(value,list) else value[key]
   assert jhash(value)==e['sha256'];e.update(relation='direct',semanticReviewed=True,reviewNote=notes[kid])
 u.update(after={'teaching':'present','assessment':'present'},status='covered_ai',unresolved=[],sourceReview={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':RECEIPT},expressionReview={'status':'independent_ai_checked','note':'App uses original guest situations, explanations and distractors instead of reproducing source paragraph/order or photographs. '+notes[kid]})
 condition_map={'HS1-030-03':['原資料で腕を体の横へ自然に下ろす姿は男性の例として示される。'],'HS1-033-11':['出入口に近い席へ案内する条件は、お客様本人が希望することである。'],'HS1-034-03':['会社からの電話では相手名に加えて会社名も確認する。'],'HS1-034-04':['原資料は特にお客様からの電話で相手が先に切ることを確認する。']}
 u['conditionsJa']=list(dict.fromkeys(u['conditionsJa']+condition_map.get(kid,[])))
 receipt['units'].append({'verifiedConditionsJa':u['conditionsJa'],'knowledgeId':kid,'group':group,'before':before,'afterStatus':'covered_ai','objectiveReview':notes[kid],'sourceRefs':u['sourceRefs'],'teachingEvidence':u['teachingEvidence'],'assessmentEvidence':u['assessmentEvidence']})
if group==1:
 # Complete only the two text-only pages whose every object has been read and classified.
 for sid,pn in [('hotel-1',34),('hotel-2',41)]:
  p=next(p for p in artifacts[sid]['pages'] if p['pdfPage']==pn)
  phone=[f'HS1-034-0{i}' for i in range(1,5)]
  if sid=='hotel-1':
   mapping={0:phone,1:phone,2:[phone[0]],3:[phone[1]],4:[phone[2]],5:[phone[3]],8:['HS1-034-05'],9:['HS1-034-05'],10:['HS1-034-05'],11:['HS1-034-05'],12:['HS1-034-05'],14:['HS1-034-06'],15:['HS1-034-06'],16:['HS1-034-06']};nav={7,17,18,19,20,35,36,37};ruby={21:0,22:2,23:3,24:4,25:5,26:8,27:10,28:14,29:15,30:16,31:11,32:12,33:9,34:1};closing={6,13}
  else:
   mapping={0:['HS2-041-01'],1:['HS2-041-02'],2:['HS2-041-02'],3:['HS2-041-03'],4:['HS2-041-03'],5:['HS2-041-04'],6:['HS2-041-04'],20:phone,21:phone,22:[phone[0]],23:[phone[1]],24:[phone[2]],25:[phone[3]]};nav={7,8,9,10,27,34};ruby={11:0,12:1,13:2,14:3,15:4,16:5,17:6,18:3,19:1,28:20,29:22,30:23,31:24,32:25,33:21};closing={26}
  for n,ids in mapping.items():bind(sid,pn,f'{sid}-p{pn:03d}-text-{n:03d}',ids,'Full-page review: operational bullet or supporting explanation mapped to the specified competency, without counting it as a new independent unit.')
  for e in p['elements']:
   if e['kind']=='text':
    n=int(e['elementId'].split('-')[-1])
    if n in mapping:continue
    if n in nav:e.update(classification='navigation',knowledgeIds=[],reason='Repeated chapter/section navigation, heading/reading or page number; no independent operational condition.',semanticReviewRef=RECEIPT)
    elif n in ruby:e.update(classification='duplicate',knowledgeIds=[],reason=f'Ruby pronunciation layer repeats the already mapped body block {ruby[n]}; retained physically and checked, not an additional vocational fact. Pronunciation acceptance is separate.',duplicateOfElementId=f'{sid}-p{pn:03d}-text-{ruby[n]:03d}',semanticReviewRef=RECEIPT)
    elif n in closing:e.update(classification='duplicate',knowledgeIds=[],reason='Grammatical closing of the preceding fully mapped bullet list, not another vocational objective.',semanticReviewRef=RECEIPT)
    else:raise AssertionError('Unclassified text '+e['elementId'])
   elif e['kind']=='text_span':
    parent=next(x for x in p['elements'] if x['elementId']==e['parentId']);e.update(classification='duplicate',knowledgeIds=[],reason='Literal text span retained as constituent of its classified parent block; no independent source fact beyond that parent.',duplicateOfElementId=parent['elementId'],semanticReviewRef=RECEIPT)
   elif e['kind']=='vector':
    assert e['bbox'][3]<100;e.update(classification='navigation',knowledgeIds=[],reason='Top-of-page chapter navigation arrow or box, visually checked; no process diagram or technical content.',semanticReviewRef=RECEIPT)
   else:raise AssertionError('Unexpected object '+e['elementId'])
  physical=docs[sid][pn-1];assert not physical.get_image_info();assert not physical.get_links();assert not list(physical.annots() or [])
  assert all(e['classification'] not in ['pending','blocked'] for e in p['elements'])
  page=next(x for x in ledger['pages'] if x['sourceId']==sid and x['pdfPage']==pn);page['semanticInventory']={'status':'complete_ai','reviewRef':RECEIPT};page['regionCensus'].update(status='visually_reviewed',visualReviewRef=RECEIPT)
  blocks=physical.get_text('dict')['blocks'];drawings=physical.get_drawings();clusters=physical.cluster_drawings(drawings=drawings)
  for el in p['elements']:
   if el['kind']=='text':
    b=blocks[int(el['elementId'].split('-')[-1])];payload='\n'.join(''.join(sp['text'] for sp in ln['spans']) for ln in b['lines']).encode();box=b['bbox']
   elif el['kind']=='text_span':
    parent,loc=el['elementId'].split(':span:');li,si=map(int,loc.split(':'));sp=blocks[int(parent.split('-')[-1])]['lines'][li]['spans'][si];payload=sp['text'].encode();box=sp['bbox']
   else:
    assert el['kind']=='vector';box=clusters[int(el['elementId'].split('-')[-1])];payload=repr([d for d in drawings if fitz.Rect(d['rect']).intersects(box)]).encode()
   assert digest(payload)==el['sha256'];assert max(abs(a-b) for a,b in zip(box,el['bbox']))<.002
  receipt['semanticPageInventories'].append({'physicalObjectChecks':{'objects':len(p['elements']),'sha256AndBboxReverifiedAgainstPrivatePdf':True,'textSpansAndRubyIncluded':True,'navigationVectorPartsIncluded':True,'sourceProsePublished':False},'sourceId':sid,'pdfPage':pn,'elements':len(p['elements']),'elementKinds':{kind:sum(e['kind']==kind for e in p['elements']) for kind in ['text','text_span','vector']},'sourceImages':0,'sourceLinks':0,'sourceAnnotations':0,'everyElementClassified':True,'novelVocationalObjectivesDetected':0,'knowledgeIds':page['knowledgeIds'],'scopeNote':'Six units on source1 p34 and eight units on source2 p41; supporting introductory statements are mapped, ruby/spans/grammatical closures retained as explicit duplicates, and all navigation vectors excluded with reasons.'})
for kid,refs in specs[group].items():
 for sid,pn,_ in refs:
  p=next(p for p in ledger['pages'] if p['sourceId']==sid and p['pdfPage']==pn);p['regionCensus'].update(status='visually_reviewed',visualReviewRef=RECEIPT)
  if p['semanticInventory']['status']=='pending':p['semanticInventory']={'status':'partial','reviewRef':RECEIPT}
for sid,p in artifact_paths.items():
 (ROOT/p).write_bytes(gzip.compress((json.dumps(artifacts[sid],ensure_ascii=False,indent=2)+'\n').encode(),mtime=0));sha=digest((ROOT/p).read_bytes())
 for page in ledger['pages']:
  if page['sourceId']==sid:page['regionCensus']['sha256']=sha
receipt['groups'].append({'group':group,'unitsReviewed':len(specs[group]),'pagesTextAndImagesRead':[{'sourceId':sid,'pdfPage':pn} for sid,pn in sorted({(sid,pn) for refs in specs[group].values() for sid,pn,_ in refs})]});receipt['coveredAi']=sum(u['status']=='covered_ai' for u in ledger['knowledgeUnits']);receipt['knownUnits']=len(ledger['knowledgeUnits']);receipt['openUnits']=receipt['knownUnits']-receipt['coveredAi'];receipt['sourceDenominator']='open';receipt['wholeSourceKnowledgeCovered']=False;receipt['privateSourcesRecoveredAndHashVerified']=True;receipt['wholePageInventoryScope']='Every text block, span, ruby layer, navigation vector and page label was classified on source1 p34 and source2 p41. No source image, table, link or annotation is present on either page. This does not accept the adjacent pages or the whole source.';write(LP,ledger);write(RECEIPT,receipt)
print(json.dumps({'status':'MULTISOURCE_GROUP_SELF_CHECKED','group':group,'newlyCoveredAi':len(specs[group]),'coveredAi':receipt['coveredAi'],'knownUnits':receipt['knownUnits'],'openUnits':receipt['openUnits'],'semanticPagesAdded':len(receipt['semanticPageInventories'])}))
