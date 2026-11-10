"""Three explicit self-reviewed source groups, not a page-completeness claim.

Read source pages and current app content before running; this script verifies
the chosen PDF regions and evidence snapshots, it does not decide semantics.
"""
import sys, json, gzip, hashlib
from pathlib import Path
import fitz

ROOT=Path(__file__).resolve().parents[2]
LP='docs/ssw-workspace/source-coverage-v2/hospitality.json'
RP='docs/ssw-workspace/hospitality/rebuild-source-groups-20261106.json'
def read(p):return json.loads((ROOT/p).read_text())
def write(p,v):(ROOT/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def sha(b):return hashlib.sha256(b if isinstance(b,bytes) else b.encode()).hexdigest()
def jhash(x):return sha(json.dumps(x,ensure_ascii=False,separators=(',',':')))
group=int(sys.argv[1]);assert group in [1,2,3]
ledger=read(LP)
receipt=read(RP) if (ROOT/RP).exists() else {'schemaVersion':1,'dateJst':'2026-11-06','baselineCommit':'689001b50','workType':'rebuild_missing_content_from_verified_github_baseline','missingCommitRecovered':False,'groups':[],'units':[],'sourceElementChecks':{},'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False},'sourceProsePublished':False,'newPagesClosed':0,'sourceCoveragePercent':None,'wholeSourceKnowledgeCovered':False}
assert group not in [g['group'] for g in receipt['groups']]
docs={};arts={};paths={}
for sid,p in zip(['hotel-1','hotel-2'],sys.argv[2:4]):
 s=next(s for s in ledger['sources'] if s['sourceId']==sid);assert sha(Path(p).read_bytes())==s['sha256'];docs[sid]=fitz.open(p);assert len(docs[sid])==s['pdfPages'];paths[sid]=f'docs/ssw-workspace/source-coverage-v2/hospitality-{sid}-elements.json.gz';arts[sid]=json.loads(gzip.decompress((ROOT/paths[sid]).read_bytes()))
assert len(docs)==2
def both(p1,p2,indices):return [('hotel-1',p1,indices),('hotel-2',p2,indices)]
specs={1:{
 'HF1-013-01':both(13,18,[1,2,3,4,5]),
 'HF1-013-02':both(13,18,[6,7,8]),
 'HF1-014-01':both(14,19,[0,1]),
 'HF1-014-02':both(14,19,[1,2]),
 'HF1-014-03':both(14,19,[3,4,5]),
 'HF1-014-04':both(14,19,[7,8,9]),
 'HF1-014-05':both(14,19,[10,11]),
 'HF1-014-06':both(14,19,[12,13]),
 'HF1-014-07':both(14,19,[14,15]),
 'HF1-014-08':both(14,19,[16,17]),
 'HF1-014-09':both(14,19,[17,18,19]),
 'HF1-014-10':both(14,19,[17,18,19]),
},2:{
 'HF1-016-01':both(16,21,[1,2,3]),
 'HF1-017-01':[('hotel-1',17,[0,1,2]),('hotel-2',22,[27,28,29])],
 'HF1-017-02':[('hotel-1',17,[0,1,2]),('hotel-2',22,[27,28,29])],
 'HF1-017-03':[('hotel-1',17,[10,11,12]),('hotel-2',22,[31,32,33])],
 'HF1-017-04':[('hotel-1',17,[13,14]),('hotel-2',22,[34,35])],
 'HF1-017-05':[('hotel-1',17,[12,13]),('hotel-2',22,[33,34])],
 'HF2-022-01':[('hotel-2',22,[33,34])],
 'HF2-022-02':[('hotel-2',22,[36,37,38])],
},3:{
 'HS1-032-01':both(32,39,[15,19]),
 'HS1-032-02':both(32,39,[16,17,18]),
 'HS1-032-03':both(32,39,[17,18]),
 'HS1-032-04':both(32,39,[0,1,2,3]),
 'HS1-032-05':both(32,39,[0,4,5]),
 'HS1-032-06':both(32,39,[6,7,8,9,10,11,12,13,14]),
}}
notes={
 'HF1-013-01':'front04 s01 and q10 explicitly cover nearby shops and outside information as well as facility guidance. Unknown information must be confirmed.',
 'HF1-013-02':'front04 s01 and q11 connect understanding other departments with readiness of rooms/equipment and staff placement; not merely knowing department names.',
 'HF1-014-01':'front04 s03 and q12 require clear speech at a speed the caller can understand, including extension calls.',
 'HF1-014-02':'front04 s03 and q05 require waiting until the guest ends the call before hanging up.',
 'HF1-014-03':'front04 s03 and q01 require hearing again and repeating an unclear room-service order rather than guessing.',
 'HF1-014-04':'front04 s02 and q06 cover entrance welcome, guidance to reception and seeing departing guests off.',
 'HF1-014-05':'front04 s02 and q03 explicitly include both cleaning and amenity preparation in housekeeping.',
 'HF1-014-06':'front04 s02 and q07 identify ryokan nakai work by room guidance and meal service, with ryokan scope retained.',
 'HF1-014-07':'front04 s02 and q08 correctly identify the restaurant department by serving food.',
 'HF1-014-08':'front04 s02 and q04 define the concierge by specialist information and arrangements inside/outside the property.',
 'HF1-014-09':'front04 s02 and q09 explicitly assess front-desk staff also doing concierge work at smaller properties. Previous q04 naming concierge alone was insufficient for this condition.',
 'HF1-014-10':'front04 s02 and q09 assess scale-dependent staffing as a tendency, not a rule that every large property must employ a dedicated concierge.',
 'HF1-016-01':'front05 s01 and q05 jointly require accuracy and smooth checkout mindful of the guest departure plans, not speed at the expense of checks.',
 'HF1-017-01':'front05 s02 and q01 explicitly identify plan-excluded drinks/services as charges to check for settlement.',
 'HF1-017-02':'front05 s02 and q08 compare the booked breakfast plan against usage records to prevent charging an included meal twice.',
 'HF1-017-03':'front05 s03 and q02 require presenting an itemized bill before payment; the body names room, internal-use, service-charge and applicable-tax components.',
 'HF1-017-04':'Existing q06 only assessed the statement/payment/receipt order. New q10 independently assesses a stated 12000-versus-10000 card discrepancy, requiring records/amount reconciliation and checking the 2000 difference, not charging the whole amount twice.',
 'HF1-017-05':'front05 s03 and q06 preserve itemized statement, payment confirmation and then receipt handling in that order.',
 'HF2-022-01':'front05 s03 and q09 explicitly retain source2 condition: issue/pass the receipt after payment unless the guest says it is unnecessary. No new legal generalization is made.',
 'HF2-022-02':'front05 s04 and q07 retain municipality/property applicability of accommodation/bathing taxes, with no universal rate or claim that all properties charge both.',
 'HS1-032-01':'service02 attitude paragraph and q03 combine facing the guest, expression and clear delivery; this does not certify a physical performance.',
 'HS1-032-02':'service02 request paragraph and q01 retain considering how to meet an unexpected request before refusing, without promising an unknown outcome.',
 'HS1-032-03':'service02 request paragraph and q01 explicitly require consultation with a supervisor when the staff member cannot decide.',
 'HS1-032-04':'service02 honorific paragraph and q04 distinguish respectful language for the guest action from humble language for the staff action.',
 'HS1-032-05':'service02 honorific paragraph and q02/q04 assess whose action is described by humble wording; app examples are independently authored.',
 'HS1-032-06':'service02 honorific paragraph and q05 explicitly assess desu/masu/gozaimasu as polite expressions to the listener, without mechanically adding prefixes to all nouns.',
}
for kid,refs in specs[group].items():
 u=next(u for u in ledger['knowledgeUnits'] if u['knowledgeId']==kid);assert u['status']=='candidate';before=json.loads(json.dumps(u))
 if kid=='HF1-014-09':
  q=read('src/data/hospitality/front.json')['lessons'][3]['questions'][8]
  u['assessmentEvidence']=[{'path':'src/data/hospitality/front.json','jsonPointer':'/lessons/3/questions/8','sha256':jhash(q),'sha256Mode':'json-value','relation':'candidate','semanticReviewed':False}]
 if kid=='HF1-017-04':
  q=read('src/data/hospitality/front.json')['lessons'][4]['questions'][9];assert q['id']=='hotel-front-05-q10'
  u['assessmentEvidence']=[{'path':'src/data/hospitality/front.json','jsonPointer':'/lessons/4/questions/9','sha256':jhash(q),'sha256Mode':'json-value','relation':'candidate','semanticReviewed':False}]
 for sid,pn,indices in refs:
  page=next(p for p in arts[sid]['pages'] if p['pdfPage']==pn);ref=next(r for r in u['sourceRefs'] if r['sourceId']==sid and r['pdfPage']==pn)
  for n in indices:
   eid=f'{sid}-p{pn:03d}-text-{n:03d}';e=next(e for e in page['elements'] if e['elementId']==eid);b=docs[sid][pn-1].get_text('dict')['blocks'][n];assert b['type']==0
   text='\n'.join(''.join(s['text'] for s in ln['spans']) for ln in b['lines']);assert sha(text)==e['sha256'];assert max(abs(a-b) for a,b in zip(e['bbox'],b['bbox']))<.002
   e.update(classification='knowledge',knowledgeIds=list(dict.fromkeys(e['knowledgeIds']+[kid])),reason='Individually self-reviewed front-desk or speech competency with direct current teaching and assessment; no whole-page acceptance.',semanticReviewRef=RP);ref['elementIds']=list(dict.fromkeys(ref['elementIds']+[eid]));receipt['sourceElementChecks'][eid]={'sha256':e['sha256'],'bboxVerified':True}
  lp=next(p for p in ledger['pages'] if p['sourceId']==sid and p['pdfPage']==pn);lp['regionCensus'].update(status='visually_reviewed',visualReviewRef=RP)
  if lp['semanticInventory']['status']=='pending':lp['semanticInventory']={'status':'partial','reviewRef':RP}
 for typ in ['teachingEvidence','assessmentEvidence']:
  for e in u[typ]:
   v=read(e['path'])
   for k in e['jsonPointer'].strip('/').split('/'):v=v[int(k)] if isinstance(v,list) else v[k]
   assert jhash(v)==e['sha256'];e.update(relation='direct',semanticReviewed=True,reviewNote=notes[kid])
 u.update(status='covered_ai',after={'teaching':'present','assessment':'present'},unresolved=[],sourceReview={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':RP},expressionReview={'status':'independent_ai_checked','note':'Original explanations, examples and practice situations; no source prose/page images redistributed. '+notes[kid]})
 receipt['units'].append({'knowledgeId':kid,'group':group,'before':before,'sourceRefs':u['sourceRefs'],'teachingEvidence':u['teachingEvidence'],'assessmentEvidence':u['assessmentEvidence'],'afterStatus':'covered_ai','reviewNote':notes[kid]})
for sid,p in paths.items():
 (ROOT/p).write_bytes(gzip.compress((json.dumps(arts[sid],ensure_ascii=False,indent=2)+'\n').encode(),mtime=0));digest=sha((ROOT/p).read_bytes())
 for p in ledger['pages']:
  if p['sourceId']==sid:p['regionCensus']['sha256']=digest
receipt['groups'].append({'group':group,'newCoveredAi':len(specs[group]),'sourcePagesTextAndImagesRead':[{'sourceId':sid,'pdfPage':pn} for sid,pn in sorted({(sid,pn) for refs in specs[group].values() for sid,pn,_ in refs})]})
receipt['newCoveredAi']=len(receipt['units']);receipt['coveredAi']=sum(u['status']=='covered_ai' for u in ledger['knowledgeUnits']);receipt['knownUnits']=len(ledger['knowledgeUnits']);receipt['openUnits']=receipt['knownUnits']-receipt['coveredAi'];receipt['specificRemainingGap']={'knowledgeId':'HF1-017-06','note':'q04 tests service-fee inclusion/separate presentation but does not itself directly assess distinguishing service charge from tip. Remains candidate pending a focused assessment; no blanket closure.'}
write(LP,ledger);write(RP,receipt)
print(json.dumps({'status':'SELF_CHECKED_GROUP','group':group,'newCoveredAi':len(specs[group]),'coveredAi':receipt['coveredAi'],'knownUnits':receipt['knownUnits'],'wholeSourceKnowledgeCovered':False}))
