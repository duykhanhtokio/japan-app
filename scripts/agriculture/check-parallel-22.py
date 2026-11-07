"""Validate reviewed-source replay,1080translation fields, additive source evidence and old-state preservation."""
import copy,hashlib,json,subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2];W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-22';D=ROOT/'src/data/agriculture'
BASE='4d70964e489ce67a3a56e440f3d789d2f809733d'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def h(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def old_bytes(p):return subprocess.check_output(['git','show',f'{BASE}:{p}'],cwd=ROOT)
def old(p):return json.loads(old_bytes(p))
def freeze(p):assert (ROOT/p).read_bytes()==old_bytes(p),p
def walk(x):
    if isinstance(x,dict):
        yield x
        for v in x.values():yield from walk(v)
    elif isinstance(x,list):
        for v in x:yield from walk(v)

def main():
    m=read(W/'parallel-22-manifest.json');master=read(P/'japanese.reviewed.json');content=read(D/'lessons.ja.json');before=old('src/data/agriculture/lessons.ja.json')
    assert len(content['lessons'])==174 and content['lessons'][:168]==before['lessons']
    assert content['lessons'][168:]==master['lessons'] and content['courseComplete'] is False
    assert m['japaneseMasterSha256']==sha(P/'japanese.reviewed.json')
    new={l['id']:l for l in master['lessons']};assert list(new)==m['newLessonIds']==m['translatedLessonIds']
    for packet_info in m['sourcePackets']:
        packet=read(ROOT/packet_info['authorPath']);review=read(ROOT/packet_info['reviewPath'])
        assert sha(ROOT/packet_info['authorPath'])==packet_info['authorSha256']==review['authorPacketSha256']
        assert sha(ROOT/packet_info['reviewPath'])==packet_info['reviewSha256'] and review['status']=='complete'
        assert not review['unresolvedBlockingIssues']
        l=copy.deepcopy(packet['lesson']);knowledge=copy.deepcopy(packet['knowledge']);objects={l['id']:l,**{p['id']:p for p in l['paragraphs']},**{k['id']:k for k in knowledge}}
        for patch in review['patches']:
            obj=objects[patch['targetId']];assert obj[patch['field']]==patch['before'];obj[patch['field']]=patch['after']
        l['sourceHash']=h({k:v for k,v in l.items() if k!='sourceHash'})
        assert l==new[l['id']] and len(l['paragraphs'])==6 and len(knowledge)==6
        assert l['sourceHash']==packet_info['reviewedLessonSourceHash']
        assert l['levels']==['2'] and l['targetMinutes']==30 and l['measuredMinutes'] is None
        assert [k for k in master['knowledge'] if l['id'] in k['lessonIds']]==knowledge
    ledger=read(W/'knowledge-ledger.json');priorledger=old('docs/ssw-workspace/agriculture/knowledge-ledger.json')
    assert ledger['knowledge'][:1008]==priorledger['knowledge'] and ledger['knowledge'][1008:]==master['knowledge']
    assert len(ledger['knowledge'])==1044 and ledger['holds']==priorledger['holds']
    assert ledger['sourceGapReconciliation'][:len(priorledger['sourceGapReconciliation'])]==priorledger['sourceGapReconciliation']
    assert ledger['sourceGapReconciliation'][len(priorledger['sourceGapReconciliation']):]==master['sourceGapResolutions']
    course=read(D/'course-manifest.json');priorcourse=old('src/data/agriculture/course-manifest.json')
    assert course['levels']['1']==priorcourse['levels']['1']
    assert course['levels']['2']['weeks'][:-1]==priorcourse['levels']['2']['weeks']
    assert course['levels']['2']['weeks'][-1]['lessonIds']==list(new)
    assert len(course['levels']['2']['weeks'])==len(priorcourse['levels']['2']['weeks'])+1
    for path in ['src/data/agriculture/weekly-checks.ja.json','src/data/agriculture/recognition-images.json','src/data/agriculture/diagrams.json','src/data/agriculture/index.ts','src/data/agriculture/translations.ts','src/services/agriculture-study-state.ts','src/components/agriculture/AgricultureCourse.tsx','src/components/agriculture/RecognitionImages.tsx','docs/ssw-workspace/agriculture/source-coverage-audit.json','docs/ssw-workspace/agriculture/source-gap-backlog.json','docs/ssw-workspace/agriculture/source-gap-reconciliation-11.json','docs/ssw-workspace/agriculture/source-gap-reconciliation-12.json','docs/ssw-workspace/agriculture/source-differences.json','docs/ssw-workspace/agriculture/exam-authoring-blueprint.json']:
        freeze(path)
    registry=read(D/'recognition-images.json');assert len(registry['images'])==39
    for asset in registry['images']:
        if (ROOT/asset['assetPath']).exists():freeze(asset['assetPath'])
    index=read(D/'translations.json');oldindex=old('src/data/agriculture/translations.json');assert index['shards']==oldindex['shards']
    totalpairs=0
    for locale,path in index['shards'].items():
        current=read(D/path);previous=old('src/data/agriculture/'+path)
        assert len(current)==174 and set(current)-set(previous)==set(new)
        assert {k:current[k] for k in previous}==previous;totalpairs+=len(current)
    assert totalpairs==2088
    reviewedpairs=set();patchcount=0
    for info in m['translationPackets']:
        raw=read(ROOT/info['authorPath']);review=read(ROOT/info['reviewPath'])
        assert sha(ROOT/info['authorPath'])==info['authorSha256']==review['authorPacketSha256']
        assert sha(ROOT/info['reviewPath'])==info['reviewSha256']
        assert raw['sourceMasterSha256']==review['sourceMasterSha256']==sha(P/'japanese.reviewed.json')
        assert review['status']=='complete' and review['fieldsReviewed']==180 and review['lessonLocalePairsReviewed']==12 and not review['unresolvedBlockingIssues']
        locales=copy.deepcopy(raw['locales'])
        for patch in review['patches']:
            assert patch['field'] in ['title','objective','activity','paragraphs','paragraphTitles']
            t=locales[patch['locale']][patch['lessonId']];obj=t[patch['field']] if patch['field'] in ['paragraphs','paragraphTitles'] else t;key=patch['paragraphId'] if patch['field'] in ['paragraphs','paragraphTitles'] else patch['field'];assert obj[key]==patch['before'];obj[key]=patch['after'];patchcount+=1
        for locale,entries in locales.items():
            assert set(entries)==set(new)
            shard=read(D/index['shards'][locale])
            for lid,t in entries.items():
                assert t==shard[lid] and t['sourceHash']==new[lid]['sourceHash']
                assert t['translatedDirectlyFrom']=='ja' and t['status']=='translated_ai_unreviewed'
                assert set(t['paragraphs'])==set(t['paragraphTitles'])=={p['id'] for p in new[lid]['paragraphs']}
                reviewedpairs.add((locale,lid))
    assert len(reviewedpairs)==72
    adoption=read(P/'translation-adoption-provenance.json')['preservedOriginalLocaleObjectSha256']
    for locale,hashes in adoption.items():
        raw=read(P/('translations-my-th.json' if locale=='th' else 'translations-zh-CN-zh-TW.json'))['locales'][locale]
        assert {lid:h(t) for lid,t in raw.items()}==hashes
    inventory=read(W/'source-inventory.json');oldinv=old('docs/ssw-workspace/agriculture/source-inventory.json')
    assert len(inventory['documents'])==2
    for doc,previous in zip(inventory['documents'],oldinv['documents']):
        assert {k:v for k,v in doc.items() if k!='pages'}=={k:v for k,v in previous.items() if k!='pages'}
        for page,beforepage in zip(doc['pages'],previous['pages']):
            assert {k:v for k,v in page.items() if k not in ['knowledgeIds','status']}=={k:v for k,v in beforepage.items() if k not in ['knowledgeIds','status']}
            added=[k['id'] for k in master['knowledge'] if any(s['documentId']==doc['id'] and s['pdfPage']==page['pdfPage'] for s in k['sources'])]
            assert page['knowledgeIds']==list(dict.fromkeys(beforepage['knowledgeIds']+added))
            assert page['status']==('partially_mapped_to_authored_content' if added else beforepage['status'])
    overlay=read(W/'source-gap-reconciliation-22.json');backlog={i['id']:i for i in read(W/'source-gap-backlog.json')['items']}
    assert overlay['resolutions']==master['sourceGapResolutions']
    full={i for r in overlay['resolutions'] if r['disposition']=='covered_by_new_prose' for i in r['sourceItemIds']};partial={i for r in overlay['resolutions'] if r['disposition']=='partially_covered' for i in r['sourceItemIds']}
    assert len(full)==49 and len(partial)==2 and not full&partial
    assert all(backlog[i]['status']=='missing' for i in full|partial)
    assert 'AGR-A10-SAFETY-0192' in partial and 'AGR-A10-FLOWER-0282' in partial
    for r in overlay['resolutions']:
        for b in r['evidenceBindings']:
            l=new[b['lessonId']];p=next(p for p in l['paragraphs'] if p['id']==b['paragraphId']);assert b['lessonSourceHash']==l['sourceHash'] and b['paragraphSha256']==h(p)
    progress=read(W/'progress.json');assert progress['authored']['japaneseLessons']==174 and progress['authored']['learningUnits']==1044 and progress['authored']['weeklyQuestions']==412
    assert progress['translations']['completedLessonLocalePairs']==2088
    for x in [m,master,overlay,*[read(p) for p in P.glob('translation-review-*.json')]]:
        for node in walk(x):
            for field in ['humanReviewed','nativeReviewed','domainReviewed','releaseReady','enoughDistinctObjectivesFor800Certified']:
                if field in node:assert node[field] is False
    if 'browserQaEvidence' in m:
        evidence=m['browserQaEvidence'];assert sha(ROOT/evidence['path'])==evidence['sha256'];qa=read(ROOT/evidence['path'])
        assert qa['status']=='PASS' and qa['sourceResponsiveCases']==24 and qa['translatedReaderCases']==72 and qa['longTranslationResponsiveCases']==48 and qa['nightTranslationCases']==12 and qa['completionReloadCases']==6
        for path,digest in qa['inputSha256'].items():assert sha(ROOT/path)==digest
        assert qa['nativeDeviceTested'] is qa['productionExpoTested'] is qa['nativeFontsCertified'] is False
    print(json.dumps(dict(status='PASS',newLessons=6,learningUnits=1044,allLessons=174,newTranslationPairs=72,allTranslationPairs=2088,translatedFieldsReviewed=1080,exactTranslationFieldPatches=patchcount,sourceOccurrencesCovered=49,sourceOccurrencesPartial=2,weeklyQuestionsPreserved=412,oldLessonsPreserved=168,oldTranslationObjectsPreserved=2016,rastersPreserved=39,mocks=0,coveragePercent=None)))

if __name__=='__main__':main()
