"""Index every physical source page while keeping reading, visual detail and knowledge closure separate."""
from pathlib import Path
from collections import Counter
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[2]
BASE='docs/ssw-workspace/manufacturing/batch33-full-review/'
EXPECTED={'mechanical':169,'electrical':198,'surface':207}
def read(p):return json.loads((ROOT/p).read_text())
def sha(p):return hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
def build():
    manifest=read(BASE+'source-manifest.json');assert manifest['totalPhysicalPages']==574 and manifest['scopeLevel']=='1'
    known={s['specialty']:s for s in read('docs/ssw-workspace/manufacturing/source-qa-report.json')['sources']}
    declared={s['specialty']:s for s in manifest['sources']};assert set(declared)==set(EXPECTED)
    inputs={BASE+'source-manifest.json':sha(BASE+'source-manifest.json')};summary={};rows=[]
    for specialty,count in EXPECTED.items():
        assert declared[specialty]['sha256']==known[specialty]['sha256'] and declared[specialty]['physicalPages']==count
        p=BASE+specialty+'/page-ledger.json';ledger=read(p);inputs[p]=sha(p)
        if specialty=='surface' and 'visualAssistIntegration' in ledger:
            integration=ledger['visualAssistIntegration']
            for receipt,expected_hash in integration['inputsSha256'].items():
                assert sha(receipt)==expected_hash,'Stale visual-assist receipt';inputs[receipt]=expected_hash
            snapshot=integration['primaryLedgerSnapshot'];assert sha(snapshot)==integration['primaryLedgerSnapshotSha256'];inputs[snapshot]=sha(snapshot)
        for flag in ['nativeReviewed','domainReviewed','humanReviewed','fullKnowledgeAtomizationComplete','releaseReady']:assert ledger.get(flag,False) is False,'Unsupported source-review certification'
        pages=ledger['pages'];numbers=[page.get('physicalPage',page.get('pdfPage')) for page in pages];assert numbers==list(range(1,count+1)),'Missing/duplicate/reordered source page:'+specialty
        observed=ledger.get('sourceActualSha256',ledger.get('sourcePdfSha256Verified',ledger.get('expectedSourceSha256')))
        if isinstance(observed,str):assert observed==declared[specialty]['sha256'],'Wrong reviewed PDF'
        for page in pages:
            number=page.get('physicalPage',page.get('pdfPage'))
            if specialty=='mechanical':
                text=page['sourceTextRead'];overview=page.get('visualOverviewInspected',False);detail=page.get('sourceHighResolutionInspected',False);compared=page['semanticComparisonPerformed'];facets=page['facets']
            elif specialty=='electrical':
                text=page['semanticReviewStatus']=='ai_text_concept_review_scoped';overview=page.get('overviewVisuallyReviewed',False);detail=page.get('detailPanelViewed',False) or page.get('highResolutionDetailViewed',False);compared=bool(page['knowledgeFacets']);facets=page['knowledgeFacets']
            else:
                text=page['textRead'];overview=page['visualRead'];detail=page.get('visualDetailedRead',False);compared=page['comparisonPerformed'];facets=page['facets']
            assert all(type(v) is bool for v in [text,overview,detail,compared])
            closed=page.get('wholePageKnowledgeCoverageCertified',page.get('wholePageSemanticallyClosed',False));assert closed is False,'Reading must not be promoted to whole-page knowledge closure'
            rows.append({'sourceId':declared[specialty]['sourceId'],'specialty':specialty,'physicalPage':number,'textReviewed':text,'visualOverviewReviewed':overview,'visualDetailReviewed':detail,'sourceAppComparisonRecorded':compared,'recordedFacetCount':len(facets),'wholePageKnowledgeClosed':False})
        group=rows[-count:];summary[specialty]={'physicalPages':count,'textReviewed':sum(r['textReviewed'] for r in group),'visualOverviewReviewed':sum(r['visualOverviewReviewed'] for r in group),'visualDetailReviewed':sum(r['visualDetailReviewed'] for r in group),'sourceAppComparisonRecorded':sum(r['sourceAppComparisonRecorded'] for r in group),'wholePageKnowledgeClosed':0}
    assert len(rows)==574
    result={'schemaVersion':1,'date':'2026-10-29','scope':'Six-AI manufacturing1 review. Page reading is distinct from exhaustive source-object closure and from professional/native/hardware certification.','inputsSha256':inputs,'summary':summary,'totalPhysicalPages':574,'sourceTextPagesReviewed':sum(v['textReviewed'] for v in summary.values()),'sourceVisualOverviewPagesReviewed':sum(v['visualOverviewReviewed'] for v in summary.values()),'sourceVisualDetailPagesReviewed':sum(v['visualDetailReviewed'] for v in summary.values()),'all574SourceTextPagesReviewed':all(v['textReviewed']==v['physicalPages'] for v in summary.values()),'pages':rows,'fullKnowledgeAtomizationComplete':False,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'physicalDeviceVerified':False,'wholeCurriculumComplete':False,'releaseReady':False}
    return result
def encoded(d):return json.dumps(d,ensure_ascii=False,indent=2)+'\n'
if __name__=='__main__':
    result=build();p=ROOT/BASE/'review-index.json'
    if sys.argv[1:]==['--write']:p.write_text(encoded(result))
    else:assert not sys.argv[1:] and p.read_text()==encoded(result),'Stale page-review index'
    print(json.dumps({k:result[k] for k in ['totalPhysicalPages','sourceTextPagesReviewed','sourceVisualOverviewPagesReviewed','sourceVisualDetailPagesReviewed','all574SourceTextPagesReviewed','fullKnowledgeAtomizationComplete','physicalDeviceVerified','releaseReady']}))
