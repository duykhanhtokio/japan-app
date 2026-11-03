"""Apply one of three author-self-reviewed groups from exact private PDFs.

The mapping is an explicit editorial decision, not keyword-based acceptance.
No source prose or source page image is written into the repository.
"""
import sys, json, gzip, hashlib
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[2]
LEDGER = 'docs/ssw-workspace/source-coverage-v2/hospitality.json'
RECEIPT = 'docs/ssw-workspace/hospitality/front-source-v10-review-20261103.json'
BASE = '2aa8c72ef0dc475250631f222b3e3c7d0da7e3e9'
read = lambda p: json.loads((ROOT/p).read_text())
digest = lambda b: hashlib.sha256(b).hexdigest()
def write(p, value):
    (ROOT/p).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')

group = int(sys.argv[1])
assert group in [1, 2, 3]
ledger = read(LEDGER)
receipt = read(RECEIPT) if (ROOT/RECEIPT).exists() else {
    'schemaVersion': 1, 'baselineCommit': BASE, 'date': '2026-11-03',
    'scope': 'Three bounded front-desk source groups; no whole-page or whole-sector acceptance.',
    'groups': [], 'units': [], 'sourceElements': {},
    'review': {'domainReviewed': False, 'nativeReviewed': False,
               'physicalDeviceTested': False, 'learnerDurationMeasured': False},
    'sourceTextOrImagesPublished': False,
}
assert group not in [g['group'] for g in receipt['groups']]
docs = {}; artifacts = {}; artifact_paths = {}
for s, pdf in zip(ledger['sources'], sys.argv[2:4]):
    data = Path(pdf).read_bytes(); assert digest(data) == s['sha256']
    docs[s['sourceId']] = fitz.open(pdf)
    assert len(docs[s['sourceId']]) == s['pdfPages']
    p = f"docs/ssw-workspace/source-coverage-v2/hospitality-{s['sourceId']}-elements.json.gz"
    artifacts[s['sourceId']] = json.loads(gzip.decompress((ROOT/p).read_bytes()))
    artifact_paths[s['sourceId']] = p
assert len(docs) == 2

specs = {
 1: {
  'HF1-009-01': [('hotel-1',9,[6,7]),('hotel-2',13,[6,7])],
  'HF1-009-02': [('hotel-1',9,[8,9,10,11]),('hotel-2',13,[8,9,10,11])],
 },
 2: {
  'HF1-011-01': [('hotel-1',11,[0,1,2]),('hotel-2',15,[0,1,2])],
  'HF1-011-02': [('hotel-1',11,[19,20,7,8]),('hotel-2',15,[16,17,4,5])],
  'HF1-011-03': [('hotel-1',11,[19,20,9,10]),('hotel-2',15,[16,17,6,7])],
 },
 3: {
  'HF1-012-01': [('hotel-1',12,[0,1]),('hotel-2',17,[0,1])],
  'HF1-012-02': [('hotel-1',12,[1,2,3,4]),('hotel-2',17,[1,2,3,4])],
  'HF1-012-04': [('hotel-1',12,[5,6,7]),('hotel-2',17,[5,6,7])],
  'HF1-012-05': [('hotel-1',12,[4,5,6]),('hotel-2',17,[4,5,6])],
 },
}
notes = {
 'HF1-009-01': 'front02 s04 and q03 require identifying the actual booking and applicable property cancellation policy; source2 adds accommodation terms. No national percentage or automatic fee waiver is invented.',
 'HF1-009-02': 'front02 s03 explains both reservation adjustment and post-stay lost-property enquiries. q01 presents two same-name bookings and requires the stay date to identify the correct booking; the name is already given by its scenario.',
 'HF1-011-01': 'front03 s01 and q04 explicitly cover clean appearance, posture and polite wording together. This checks choosing customer-facing behavior, not a physical posture demonstration.',
 'HF1-011-02': 'front03 s02 and q01 explicitly check booking existence and guest name. The listed reservation details were read in both source diagrams, not inferred from the chapter heading.',
 'HF1-011-03': 'front03 s02 teaches checking party size and the booked plan; q01 checks both and q05 tests a breakfast-plan discrepancy without accepting an unconfirmed change.',
 'HF1-012-01': 'front03 s03 and q08 preserve the order: booking/procedure confirmation before handing over the intended room key, followed by property guidance.',
 'HF1-012-02': 'front03 s03 and q02 explicitly test the route to the room plus facility locations and opening/use times; the source time conditions are property-specific.',
 'HF1-012-04': 'front03 s03 keeps 14/15 and 10/11 as source examples, not national rules. q03 and q06 assess checking the actual property/plan time instead of substituting the source example.',
 'HF1-012-05': 'front03 s03 retains the usual check-in-to-check-out use window. q07 tests a late-use request by checking availability and conditions rather than claiming the calendar day grants extra hours. The scenario is independently authored; it does not invent a universal extension price or permission.',
}
for kid, refs in specs[group].items():
    u = next(u for u in ledger['knowledgeUnits'] if u['knowledgeId'] == kid)
    assert u['status'] == 'candidate'
    before = {'status':u['status'], 'after':u['after'], 'unresolved':u['unresolved'], 'sourceRefs':json.loads(json.dumps(u['sourceRefs']))}
    for sid, pn, indices in refs:
        page = next(p for p in artifacts[sid]['pages'] if p['pdfPage'] == pn)
        target = next(r for r in u['sourceRefs'] if r['sourceId']==sid and r['pdfPage']==pn)
        for n in indices:
            eid = f'{sid}-p{pn:03d}-text-{n:03d}'
            e = next(e for e in page['elements'] if e['elementId']==eid)
            b = docs[sid][pn-1].get_text('dict')['blocks'][n]
            assert b['type']==0
            text = '\n'.join(''.join(s['text'] for s in ln['spans']) for ln in b['lines'])
            assert digest(text.encode()) == e['sha256']
            assert max(abs(a-b) for a,b in zip(e['bbox'],b['bbox'])) < .002
            e.update(classification='knowledge', knowledgeIds=list(dict.fromkeys(e['knowledgeIds']+[kid])),
                     reason='Individually checked operational statement or listed detail; bounded source mapping, not whole-page acceptance.', semanticReviewRef=RECEIPT)
            target['elementIds'] = list(dict.fromkeys(target['elementIds']+[eid]))
            receipt['sourceElements'][eid] = {'sourceSha256':next(s['sha256'] for s in ledger['sources'] if s['sourceId']==sid), 'elementSha256':e['sha256'], 'bboxVerified':True}
        lp = next(p for p in ledger['pages'] if p['sourceId']==sid and p['pdfPage']==pn)
        lp['regionCensus'].update(status='visually_reviewed',visualReviewRef=RECEIPT)
        if lp['semanticInventory']['status']=='pending': lp['semanticInventory']={'status':'partial','reviewRef':RECEIPT}
    for typ in ['teachingEvidence','assessmentEvidence']:
        for e in u[typ]:
            value=read(e['path'])
            for k in e['jsonPointer'].strip('/').split('/'): value=value[int(k)] if isinstance(value,list) else value[k]
            assert digest(json.dumps(value,ensure_ascii=False,separators=(',',':')).encode()) == e['sha256']
            e.update(relation='direct',semanticReviewed=True,reviewNote=notes[kid])
    u.update(status='covered_ai',after={'teaching':'present','assessment':'present'},unresolved=[],
             sourceReview={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':RECEIPT},
             expressionReview={'status':'independent_ai_checked','note':'The app supplies original explanations and guest scenarios rather than reproducing the source page layout or sentence sequence. '+notes[kid]})
    if kid=='HF1-012-05':
        u['conditionsJa']=list(dict.fromkeys(u['conditionsJa']+['原資料の客室利用時間の説明は「多くの場合」であり、施設やプランの条件を確認する。']))
    receipt['units'].append({'knowledgeId':kid,'group':group,'before':before,'afterStatus':u['status'],'sourceRefs':u['sourceRefs'],'teachingEvidence':u['teachingEvidence'],'assessmentEvidence':u['assessmentEvidence'],'reviewNote':notes[kid]})
for sid, p in artifact_paths.items():
    (ROOT/p).write_bytes(gzip.compress((json.dumps(artifacts[sid],ensure_ascii=False,indent=2)+'\n').encode(),mtime=0))
    h=digest((ROOT/p).read_bytes())
    for page in ledger['pages']:
        if page['sourceId']==sid:page['regionCensus']['sha256']=h
receipt['groups'].append({'group':group,'units':list(specs[group]),'pagesTextAndImagesRead':[{'sourceId':sid,'pdfPage':pn} for sid,pn in sorted({(sid,pn) for refs in specs[group].values() for sid,pn,_ in refs})]})
receipt['coveredAi']=sum(u['status']=='covered_ai' for u in ledger['knowledgeUnits'])
receipt['knownUnits']=len(ledger['knowledgeUnits']);receipt['openUnits']=receipt['knownUnits']-receipt['coveredAi']
receipt['denominatorStatus']='open';receipt['sourceCoveragePercent']=None
receipt['remainingSpecificGap']={'knowledgeId':'HF1-012-03','note':'Teaching names emergency exits and evacuation routes; q02 correct option names emergency exits but omits routes. Its distractor mentions routes. Do not count this alone as an explicit correct-route assessment. Retained candidate pending focused assessment/source mapping.'}
write(LEDGER,ledger);write(RECEIPT,receipt)
print(json.dumps({'status':'SOURCE_GROUP_SELF_CHECKED','group':group,'newlyCoveredAi':len(specs[group]),'coveredAi':receipt['coveredAi'],'openUnits':receipt['openUnits']}))
