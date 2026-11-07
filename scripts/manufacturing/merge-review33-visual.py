"""Union actual visual-assist page receipts without double-counting or changing knowledge closure."""
from pathlib import Path
import hashlib,json,os,tempfile
ROOT=Path(__file__).resolve().parents[2]
BASE='docs/ssw-workspace/manufacturing/batch33-full-review/'
def read(p):return json.loads((ROOT/p).read_text())
def encoded(d):return json.dumps(d,ensure_ascii=False,indent=2)+'\n'
def sha(p):return hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
def atomic_write(path,text):
    with tempfile.NamedTemporaryFile(dir=path.parent,mode='w',encoding='utf-8',delete=False) as handle:
        handle.write(text);temporary=handle.name
    os.replace(temporary,path)
def merge():
    path=BASE+'surface/page-ledger.json';d=read(path);pages={p['physicalPage']:p for p in d['pages']};assert set(pages)==set(range(1,208))
    expected='08d7e9d6ae5fc5a442af227bbc690ed54cde06681ee8806eb7aadf87748b2eae'
    original=ROOT/BASE/'surface/primary-page-ledger-before-visual-assist.json'
    if not original.exists() or original.stat().st_size==0:atomic_write(original,encoded(d))
    primary=read(str(original.relative_to(ROOT)));primary_count=sum(p.get('visualDetailedRead',False) for p in primary['pages']);inputs={};assist_occurrences=0
    known={l['id']:l for l in read('src/data/manufacturing/surface.json')['lessons']}
    known.update({g['id']:g for g in read('src/data/manufacturing/source-guides.json')['guides'] if g['specialty']=='surface'})
    for relative in ['mechanical/surface-visual-assist.json','electrical/surface-visual-assist.json']:
        p=BASE+relative;a=read(p);inputs[p]=sha(p)
        assert a.get('sourceSha256',a.get('sourceSha'))==expected
        for flag in ['nativeReviewed','domainReviewed','humanReviewed','wholeKnowledgeReviewed','releaseReady']:assert a.get(flag,False) is False
        numbers=[r['physicalPage'] for r in a['pages']];assert len(numbers)==len(set(numbers))
        for row in a['pages']:
            number=row['physicalPage'];assert 11<=number<=206 and row['actualVisualRead'] is True and row['visualDetailedRead'] is True
            assert row.get('sourceSha256',row.get('sourceSha'))==expected
            bindings=row.get('lessonBindings',row.get('actualAppLessonBindingsCompared',[]))+row.get('guideBindings',row.get('actualAppGuideBindingsCompared',[]))
            for binding in bindings:assert known[binding['id']]['sourceHash']==binding['sourceHash'],'Stale visual/app binding'
            target=pages[number];evidence=target.setdefault('additionalVisualAssistEvidence',[])
            receipt={'reviewer':a['reviewer'],'path':p,'sha256':inputs[p],'physicalPage':number,'actualVisualRead':True,'method':row['method']}
            if receipt not in evidence:evidence.append(receipt)
            target['visualDetailedRead']=True;target['visualDetailedStatus']='primary_or_assist_AI_detail_view; see separate reviewer receipts'
            assert target['wholePageKnowledgeCoverageCertified'] is False
            assist_occurrences+=1
    detailed=sum(p.get('visualDetailedRead',False) for p in pages.values());assert all(pages[n].get('visualDetailedRead') for n in range(11,207)),'Unread surface body-detail page remains'
    d['counts'].update(pagesVisualDetailedRead=detailed,pagesNotSeparatelyEnlarged=207-detailed)
    d['visualAssistIntegration']={'primaryLedgerSnapshot':str(original.relative_to(ROOT)),'primaryLedgerSnapshotSha256':sha(str(original.relative_to(ROOT))),'primaryReviewerDetailedPages':primary_count,'assistPageOccurrences':assist_occurrences,'additionalUniquePagesBeyondPrimary':detailed-primary_count,'unionDetailedPages':detailed,'inputsSha256':inputs,'overlapCountedOnce':True,'nativeReviewed':False,'domainReviewed':False,'wholeKnowledgeClosed':False}
    atomic_write(ROOT/path,encoded(d));return d['visualAssistIntegration']
if __name__=='__main__':print(json.dumps(merge()))
