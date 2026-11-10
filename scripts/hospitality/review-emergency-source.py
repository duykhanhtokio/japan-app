"""Three bounded groups from exact private PDFs; no source text is published."""
import sys,json,gzip,hashlib,subprocess,tempfile,shutil
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[2];LP='docs/ssw-workspace/source-coverage-v2/hospitality.json';RECEIPT='docs/ssw-workspace/hospitality/recovery-v9/emergency-source-review.json';BASE='f72e3e6cc36c1b407aace4b0e47a23a63ca7cdaa'
def read(p):return json.loads((ROOT/p).read_text())
def write(p,v):(ROOT/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def digest(b):return hashlib.sha256(b if isinstance(b,bytes) else b.encode()).hexdigest()
def jhash(v):return digest(json.dumps(v,ensure_ascii=False,separators=(',',':')))
group=int(sys.argv[1]);assert group in [1,2,3];ledger=read(LP);prior=json.loads(subprocess.check_output(['git','show',BASE+':'+LP],cwd=ROOT));docs={};arts={};aps={}
for sid,p in zip(['hotel-1','hotel-2'],sys.argv[2:4]):
 s=next(s for s in ledger['sources'] if s['sourceId']==sid);assert digest(Path(p).read_bytes())==s['sha256'];docs[sid]=fitz.open(p);assert len(docs[sid])==s['pdfPages'];aps[sid]=f'docs/ssw-workspace/source-coverage-v2/hospitality-{sid}-elements.json.gz';arts[sid]=json.loads(gzip.decompress((ROOT/aps[sid]).read_bytes()))
assert len(docs)==2
specs={1:{
'HA1-047-02':[('hotel-1',47,[1,2,3,4]),('hotel-2',59,[1,2,3,4])],
'HA1-047-04':[('hotel-1',47,[8,9]),('hotel-2',59,[8,9])],
'HA1-047-05':[('hotel-1',47,[8,9]),('hotel-2',59,[8,9])],
'HA1-047-06':[('hotel-1',47,[8,9]),('hotel-2',59,[8,9])],
'HA1-047-07':[('hotel-1',47,[10,11]),('hotel-2',59,[10,11])],
'HA1-047-08':[('hotel-1',47,[12,13]),('hotel-2',59,[12,13])],
'HA1-047-09':[('hotel-1',47,[14,15]),('hotel-2',59,[17,18])]},
2:{
'HA1-048-02':[('hotel-1',48,[7,8]),('hotel-2',60,[16,17])],
'HA1-048-03':[('hotel-1',48,[7,8]),('hotel-2',60,[16,17])],
'HA2-060-05':[('hotel-2',60,[6,7])],
'HA2-060-06':[('hotel-2',60,[8,9,10])],
'HA2-060-07':[('hotel-2',60,[8,9,10])]},
3:{
'HA1-048-06':[('hotel-1',48,[17]),('hotel-2',61,[13])],
'HA1-048-07':[('hotel-1',48,[18,19]),('hotel-2',61,[16,17])],
'HA1-048-08':[('hotel-1',48,[20,21]),('hotel-2',61,[18,19])],
'HA2-059-01':[('hotel-2',59,[10,11])],
'HA2-059-02':[('hotel-2',59,[14,15,16])],
'HA2-059-03':[('hotel-2',59,[14,15,16])]}}
notes={
'HA1-047-02':'q01 places the learner on a newly assigned floor and requires advance checking of route, equipment and communication plus practising roles. This checks place-specific preparedness rather than actual competence during a disaster.',
'HA1-047-04':'q05 explicitly names fire alarm equipment and checks both position and correct handling learned from the facility responsible staff and training. It does not certify physical operation.',
'HA1-047-05':'q05 separately names the extinguisher and requires position and correct handling, not merely recognition from a picture. Physical operation requires facility training.',
'HA1-047-06':'q05 separately names guest-room escape equipment and requires location and correct handling. It does not instruct untrained use or certify physical evacuation skill.',
'HA1-047-07':'q01 requires checking the route in advance instead of photographing a sign without checking the path. The additional two-direction detail in source2 is tracked separately as HA2-059-01.',
'HA1-047-08':'Inherited q01 covered routes/equipment/communication roles but did not explicitly test the facility manual. New q06 specifically selects own-facility response manual, communication/guidance roles and practice for illness, accidents and fire.',
'HA1-047-09':'q03 explicitly checks infection risk, spread and facility response procedures; disease diagnosis by hotel staff is rejected. This is preparation knowledge, not medical certification.',
'HA1-048-02':'q04 explicitly checks keeping combustible linen away from ignition sources; the existing section names linen and paper. No unsupported separation distance is introduced.',
'HA1-048-03':'q04 also explicitly selects facility-procedure disposal of cigarette ends and rejects mixing them with paper waste. No improvised extinguishing method is taught.',
'HA2-060-05':'safety07 q04 presents a linen cart before a fire door and checks restoring the door function through facility procedure. Source statement about spread prevention is taught in the paragraph; this does not certify building-code compliance.',
'HA2-060-06':'safety07 q08 checks handover of unresolved alarm condition across night/day shift, keeping location, time, notified person and interim action. Monitoring is continuous in the teaching; it is distinct from technician maintenance.',
'HA2-060-07':'safety07 q14 explicitly distinguishes monitoring from regular maintenance and asks that responsible inspectors check state, cause and repair need. Universal installation/legal applicability claims are not inferred from this bounded operational unit.',
'HA1-048-06':'q07 explicitly combines initial firefighting only within trained safe conditions with reporting/evacuation, and stopping on smoke, heat or unsafe retreat. Hotel-source shorthand is bounded by current official safety guidance; no firefighting practical skill is certified.',
'HA1-048-07':'Existing q03 checks fire evacuation. Newly appended body and q08 explicitly add earthquake evacuation without elevators and route/facility-procedure checks. Avoiding a blanket run-during-shaking instruction is preserved.',
'HA1-048-08':'q02 checks 119, location within the facility, fire versus emergency and verified situation. No requirement to gather every item before calling; instruction-following and unknown information remain explicit.',
'HA2-059-01':'safety07 q07 tests the alternative-direction decision when corridor A has smoke: check B route and facility instructions instead of using the usual route. The fictitious A/B diagram is not a real hotel plan or proof of legal design compliance.',
'HA2-059-02':'safety02 q05 checks verified symptoms and contact information in an emergency call, while q04 rejects inventing a diagnosis. Medical triage and treatment competence are not claimed.',
'HA2-059-03':'safety02 q04 specifically tests unknown age: state it is unknown and answer verified information instead of guessing or ending the call. Teaching distinguishes confirmed age from appearance-based guesses.'}
r=read(RECEIPT) if (ROOT/RECEIPT).exists() else {'schemaVersion':1,'date':'2026-11-03','baselineCommit':BASE,'groups':[],'units':[],'sourceElementChecks':{},'sourceProseRedistributed':False,'wholeSourceKnowledgeCovered':False,'sourceDenominator':'open','nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False,'supportingOfficialGuidance':[{'url':'https://www.mlit.go.jp/kankocho/content/810003034.pdf','scope':'Flames reaching ceiling stop initial firefighting; 119 address/building/situation/name/contact; evacuation roles. Browsed 2026-11-03; operational education only.'},{'url':'https://www.mlit.go.jp/kankocho/content/810003034.pdf','scope':'Opened official PDF sections5.3/5.4 on2026-11-03: ceiling-reaching flame stop;119 location/situation/name/contact. No new extinguisher operating steps imported.'}]}
assert not any(g['group']==group for g in r['groups']);b=Path(tempfile.mkdtemp(prefix=f'hsp-emergency-g{group}-'))
for p in [LP,RECEIPT,*aps.values()]:
 if (ROOT/p).exists():q=b/p;q.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(ROOT/p,q)
for kid,refs in specs[group].items():
 u=next(u for u in ledger['knowledgeUnits'] if u['knowledgeId']==kid);before=next(u for u in prior['knowledgeUnits'] if u['knowledgeId']==kid);assert u['status']=='candidate'
 for sid,pn,indices in refs:
  page=next(p for p in arts[sid]['pages'] if p['pdfPage']==pn);ref=next(z for z in u['sourceRefs'] if z['sourceId']==sid and z['pdfPage']==pn)
  for i in indices:
   eid=f'{sid}-p{pn:03d}-text-{i:03d}';e=next(e for e in page['elements'] if e['elementId']==eid);block=docs[sid][pn-1].get_text('dict')['blocks'][i];assert block['type']==0;source='\n'.join(''.join(s['text'] for s in line['spans']) for line in block['lines']);assert digest(source)==e['sha256'];assert max(abs(x-y) for x,y in zip(block['bbox'],e['bbox']))<.002
   ref['elementIds']=list(dict.fromkeys(ref['elementIds']+[eid]));e.update(classification='knowledge',knowledgeIds=list(dict.fromkeys(e['knowledgeIds']+[kid])),reason='Exact independently stated emergency-preparedness, fire-prevention or evacuation/communication competency self-reviewed; no whole-page acceptance.',semanticReviewRef=RECEIPT);r['sourceElementChecks'][eid]={'sha256':e['sha256'],'bboxVerified':True}
  lp=next(p for p in ledger['pages'] if p['sourceId']==sid and p['pdfPage']==pn);lp['regionCensus'].update(status='visually_reviewed',visualReviewRef=RECEIPT)
  if lp['semanticInventory']['status']=='pending':lp['semanticInventory']={'status':'partial','reviewRef':RECEIPT}
 for typ in ['teachingEvidence','assessmentEvidence']:
  for e in u[typ]:
   v=read(e['path'])
   for k in e['jsonPointer'].strip('/').split('/'):v=v[int(k)] if isinstance(v,list) else v[k]
   assert jhash(v)==e['sha256'];e.update(relation='candidate' if kid=='HA1-047-08' and typ=='assessmentEvidence' and e['jsonPointer'].endswith('/questions/0') else 'direct',semanticReviewed=True,reviewNote=notes[kid])
 u.update(after={'teaching':'present','assessment':'present'},status='covered_ai',unresolved=[],sourceReview={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':RECEIPT},expressionReview={'status':'independent_ai_checked','note':'Original facility scenarios, independent explanations and distractors; source sentences/layout/images are not reproduced. '+notes[kid]})
 r['units'].append({'knowledgeId':kid,'group':group,'before':before,'afterStatus':'covered_ai','objectiveReview':notes[kid],'sourceRefs':u['sourceRefs'],'teachingEvidence':u['teachingEvidence'],'assessmentEvidence':u['assessmentEvidence']})
for sid,p in aps.items():
 (ROOT/p).write_bytes(gzip.compress((json.dumps(arts[sid],ensure_ascii=False,indent=2)+'\n').encode(),mtime=0));sha=digest((ROOT/p).read_bytes())
 for page in ledger['pages']:
  if page['sourceId']==sid:page['regionCensus']['sha256']=sha
r['groups'].append({'group':group,'newCoveredAi':len(specs[group]),'sourcePagesTextAndImagesRead':[{'sourceId':sid,'pdfPage':pn} for sid,pn in sorted({(sid,pn) for refs in specs[group].values() for sid,pn,_ in refs})]});r['newlyCoveredAi']=len(r['units']);r['coveredAi']=sum(u['status']=='covered_ai' for u in ledger['knowledgeUnits']);r['knownUnits']=len(ledger['knowledgeUnits']);r['openUnits']=r['knownUnits']-r['coveredAi'];write(LP,ledger);write(RECEIPT,r);print(json.dumps({'status':'EMERGENCY_GROUP_SELF_CHECKED','group':group,'newlyCoveredAi':len(specs[group]),'coveredAi':r['coveredAi'],'knownUnits':r['knownUnits'],'wholeSourceKnowledgeCovered':False}))
