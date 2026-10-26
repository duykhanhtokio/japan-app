"""Freeze reviewed batch22 Japanese first; integrate only after all72 direct locale drafts pass review."""
import argparse
import copy
import hashlib
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-22';D=ROOT/'src/data/agriculture'
BASE='4d70964e489ce67a3a56e440f3d789d2f809733d'
TAGS=['fertilizer','hormones','weeds','vegetables','facility','fruit']
PAIRS=['en-hi','vi-id','zh-CN-zh-TW','bn-ne','my-th','km-tl']
def read(p):return json.loads(p.read_text())
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def h(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')

def prepare():
    existing=read(D/'lessons.ja.json')['lessons'];assert len(existing)==168
    inventory={d['id']:d for d in read(W/'source-inventory.json')['documents']}
    backlog={i['id']:i for i in read(W/'source-gap-backlog.json')['items']}
    prior=[r for n in [11,12] for r in read(W/f'source-gap-reconciliation-{n}.json')['resolutions']]
    covered={i for r in prior if r['disposition']=='covered_by_new_prose' for i in r['sourceItemIds']}
    lessons=[];knowledge=[];resolutions=[];reports=[];seen=set()
    for tag in TAGS:
        path=P/f'source-{tag}.json';reviewpath=P/f'review-{tag}.json'
        raw=read(path);packet=copy.deepcopy(raw);review=read(reviewpath)
        assert review['status']=='complete' and review['authorPacketSha256']==digest(path)
        assert not review['unresolvedBlockingIssues'] and packet['lesson']
        l=packet['lesson'];byid={l['id']:l,**{p['id']:p for p in l['paragraphs']},**{k['id']:k for k in packet['knowledge']}}
        for patch in review['patches']:
            obj=byid[patch['targetId']];assert obj[patch['field']]==patch['before'] and patch['reason'];obj[patch['field']]=patch['after']
        for patch in review['resolutionPatches']:
            obj=packet['sourceGapResolutions'][patch['index']];assert obj[patch['field']]==patch['before'];obj[patch['field']]=patch['after']
        l['sourceHash']=h({k:v for k,v in l.items() if k!='sourceHash'})
        assert len(l['paragraphs'])==len(packet['knowledge'])==6 and l['levels']==['2']
        assert l['id'] not in {old['id'] for old in existing}
        assert all(k['questionIds']==[] and k['figureIds']==[] for k in packet['knowledge'])
        paragraphs={p['id']:p for p in l['paragraphs']}
        for i,r in enumerate(packet['sourceGapResolutions']):
            if i in review['excludedResolutionIndices']:continue
            assert r['disposition'] in ['covered_by_new_prose','partially_covered']
            assert set(r['lessonIds'])=={l['id']} and set(r['paragraphIds'])<=set(paragraphs)
            for itemid in r['sourceItemIds']:
                assert itemid not in seen and itemid not in covered
                item=backlog[itemid];assert item['status']=='missing'
                assert not any(s in item['kind'] for s in ['recognition','figure','diagram','caption']),itemid
                assert set(item['scopeLevels'])<=set(l['levels'])
                assert any(s['documentId']==item['documentId'] and s['pdfPage']==item['pdfPage'] for s in l['sources'])
                seen.add(itemid)
            bindings=[dict(lessonId=l['id'],lessonSourceHash=l['sourceHash'],paragraphId=pid,paragraphSha256=h(paragraphs[pid])) for pid in r['paragraphIds']]
            resolutions.append(dict(worker=tag,**r,evidenceBindings=bindings))
        for s in l['sources']:assert inventory[s['documentId']]['pages'][s['pdfPage']-1]['printedPage']==s['printedPage']
        lessons.append(l);knowledge.extend(packet['knowledge'])
        reports.append(dict(tag=tag,authorPath=str(path.relative_to(ROOT)),authorSha256=digest(path),reviewPath=str(reviewpath.relative_to(ROOT)),reviewSha256=digest(reviewpath),appliedPatches=review['patches'],reviewedLessonSourceHash=l['sourceHash'],localHoldNotes=packet.get('localHoldNotes',[])))
    canonical=dict(schemaVersion=1,status='reviewed_japanese_frozen_for_direct_translation',baselineCommit=BASE,lessons=lessons,knowledge=knowledge,sourceGapResolutions=resolutions,packets=reports,humanReviewed=False,nativeReviewed=False,domainReviewed=False,releaseReady=False)
    write(P/'japanese.reviewed.json',canonical)
    print(json.dumps(dict(newLessons=len(lessons),newParagraphUnits=len(knowledge),fullSourceOccurrences=len({i for r in resolutions if r['disposition']=='covered_by_new_prose' for i in r['sourceItemIds']}),partialSourceOccurrences=len({i for r in resolutions if r['disposition']=='partially_covered' for i in r['sourceItemIds']}))))

def integrate():
    master=read(P/'japanese.reviewed.json');content=read(D/'lessons.ja.json');assert len(content['lessons'])==168
    assert len(master['lessons'])==6 and len(master['knowledge'])==36
    course=read(D/'course-manifest.json');ledger=read(W/'knowledge-ledger.json');inv=read(W/'source-inventory.json');index=read(D/'translations.json')
    oldlessons=copy.deepcopy(content['lessons']);oldknowledge=copy.deepcopy(ledger['knowledge']);oldcourse=copy.deepcopy(course)
    content['lessons'].extend(master['lessons']);ledger['knowledge'].extend(master['knowledge'])
    newids=[l['id'] for l in master['lessons']];byid={l['id']:l for l in master['lessons']}
    n=max(w['number'] for w in course['levels']['2']['weeks'])+1
    course['levels']['2']['weeks'].append(dict(id=f'agr-2-w{n:02}',number=n,titleJa='作業別の補足知識',lessonIds=newids));course['revision']='v22'
    translation_reports=[];newpairs=set();pending_shards={}
    for pair in PAIRS:
        path=P/f'translations-{pair}.json';reviewpath=P/f'translation-review-{pair}.json';packet=read(path);review=read(reviewpath)
        assert review['status']=='complete' and review['authorPacketSha256']==digest(path)
        assert not review['unresolvedBlockingIssues']
        assert packet['sourceMasterSha256']==review['sourceMasterSha256']==digest(P/'japanese.reviewed.json')
        assert review['lessonLocalePairsReviewed']==12 and review['fieldsReviewed']==180
        locales=copy.deepcopy(packet['locales'])
        for patch in review['patches']:
            assert patch['field'] in ['title','objective','activity','paragraphTitles','paragraphs']
            t=locales[patch['locale']][patch['lessonId']]
            obj=t[patch['field']] if patch['field'] in ['paragraphs','paragraphTitles'] else t
            key=patch['paragraphId'] if patch['field'] in ['paragraphs','paragraphTitles'] else patch['field']
            assert obj[key]==patch['before'] and patch['reason'];obj[key]=patch['after']
        for locale,entries in locales.items():
            assert locale in index['shards'] and set(entries)==set(newids)
            shard=read(D/index['shards'][locale]);assert not set(entries)&set(shard)
            for lid,t in entries.items():
                l=byid[lid];assert t['sourceHash']==l['sourceHash']
                assert t['translatedDirectlyFrom']=='ja' and t['status']=='translated_ai_unreviewed'
                assert t['nativeReviewed'] is t['domainReviewed'] is False
                assert set(t['paragraphs'])==set(t['paragraphTitles'])=={p['id'] for p in l['paragraphs']}
                assert t['title'] and t['objective'] and t['activity']
                assert all(isinstance(v,str) and v.strip() for name in ['paragraphs','paragraphTitles'] for v in t[name].values())
                newpairs.add((locale,lid))
            shard.update(entries);pending_shards[D/index['shards'][locale]]=shard
        translation_reports.append(dict(pair=pair,authorPath=str(path.relative_to(ROOT)),authorSha256=digest(path),reviewPath=str(reviewpath.relative_to(ROOT)),reviewSha256=digest(reviewpath),locales=list(locales),pairs=sum(len(v) for v in locales.values()),fieldPatches=review['patches']))
    assert len(newpairs)==72 and len(pending_shards)==12
    for doc in inv['documents']:
        for page in doc['pages']:
            additions=[k['id'] for k in master['knowledge'] if any(s['documentId']==doc['id'] and s['pdfPage']==page['pdfPage'] for s in k['sources'])]
            if additions:page['knowledgeIds']=list(dict.fromkeys(page['knowledgeIds']+additions));page['status']='partially_mapped_to_authored_content'
    prior=[r for n in [11,12] for r in read(W/f'source-gap-reconciliation-{n}.json')['resolutions']]
    oldcovered={i for r in prior if r['disposition']=='covered_by_new_prose' for i in r['sourceItemIds']}
    newcovered={i for r in master['sourceGapResolutions'] if r['disposition']=='covered_by_new_prose' for i in r['sourceItemIds']}
    partial={i for r in prior+master['sourceGapResolutions'] if r['disposition']=='partially_covered' for i in r['sourceItemIds']}-oldcovered-newcovered
    summary=dict(sourceOccurrencesCoveredByNewProse=len(newcovered),sourceOccurrencesPartiallyCovered=len({i for r in master['sourceGapResolutions'] if r['disposition']=='partially_covered' for i in r['sourceItemIds']}),cumulativeSourceOccurrencesCoveredByProse=len(oldcovered|newcovered),partiallyCoveredAcrossOverlays=len(partial),candidateRemainingMissingOrPartialOccurrencesFromBaseline=1559-len(oldcovered|newcovered),baselineHeldOccurrencesUnchanged=301,uniqueKnowledgeDenominator=None,coveragePercent=None)
    overlay=dict(schemaVersion=1,status='independently_ai_reviewed_source_prose_candidate',baselineCommit=BASE,previousReconciliation='source-gap-reconciliation-12.json',frozenAudit='source-coverage-audit.json',frozenBacklog='source-gap-backlog.json',summary=summary,resolutions=master['sourceGapResolutions'],humanReviewed=False,nativeReviewed=False,domainReviewed=False,releaseReady=False)
    ledger.setdefault('sourceGapReconciliation',[]).extend(master['sourceGapResolutions'])
    ledger['latestSourceGapReconciliation']=dict(file='source-gap-reconciliation-22.json',baselineAudit='source-coverage-audit.json',previousOverlay='source-gap-reconciliation-12.json',note='Additive AI-reviewed source-prose evidence, not unique knowledge or full-curriculum certification.')
    index['authoredLessonCoverage']=dict(authoredLessons=174,fullyDraftTranslatedLessons=174,lessonLocalePairs=2088,completeForCurrentlyAuthoredLessons=True,wholeCurriculumComplete=False)
    assert content['lessons'][:168]==oldlessons and ledger['knowledge'][:1008]==oldknowledge
    assert course['levels']['1']==oldcourse['levels']['1'] and course['levels']['2']['weeks'][:-1]==oldcourse['levels']['2']['weeks']
    manifest=dict(schemaVersion=1,id='agriculture-parallel-22',baselineCommit=BASE,status='integrated_independently_ai_reviewed_pending_scoped_qa',newLessonIds=newids,translatedLessonIds=newids,newKnowledgeUnits=36,newTranslationPairs=72,newWeeklyQuestions=0,totalWeeklyQuestions=412,newMockQuestions=0,totalMockQuestions=0,newWeekIds={'2':f'agr-2-w{n:02}'},counts=dict(lessons=174,learningUnits=1044,translationPairs=2088,rasterFigures=39),japaneseMasterSha256=digest(P/'japanese.reviewed.json'),sourcePackets=master['packets'],translationPackets=translation_reports,sourceGapReconciliation=dict(file='source-gap-reconciliation-22.json',**summary),sourceImagesRedistributed=False,uniqueAssessableObjectivesCertified=None,enoughDistinctObjectivesFor800Certified=False,humanReviewed=False,nativeReviewed=False,domainReviewed=False,releaseReady=False,backgroundAuthoringRunning=False)
    progress=read(W/'progress.json');progress['authored']['japaneseLessons']=174;progress['authored']['learningUnits']=1044
    progress['translations']['completedLessonLocalePairs']=2088;progress['translations']['japaneseLessonsWithAll12Drafts']+=newids
    progress['latestBatch']='parallel-22-manifest.json';progress['sources']['latestSourceGapReconciliation']={'file':'source-gap-reconciliation-22.json','previous':'source-gap-reconciliation-12.json',**summary}
    progress['parallelWorkers']=dict(count=6,status='six_source_authors_and_six_independent_source_reviews_then_six_locale_pair_authors_and_six_independent_translation_reviews_complete',backgroundAuthoringRunning=False)
    progress['next']['resumePriority']='Continue source gaps via frozen audit and overlays11/12/22; preserve174Japanese lessons/2088AI-draft pairs/412weeklyquestions/39rasters. Source-occurrence counts are not unique assessment objectives;800mockquestions remain0. Preserve ABAabscission/ナシscope partials and current-product/visual holds. Continue remaining recognition groups and distinct assessment matrix.'
    for path,value in [*pending_shards.items(),(D/'lessons.ja.json',content),(D/'course-manifest.json',course),(W/'knowledge-ledger.json',ledger),(W/'source-inventory.json',inv),(D/'translations.json',index),(W/'source-gap-reconciliation-22.json',overlay),(W/'parallel-22-manifest.json',manifest),(W/'progress.json',progress)]:write(path,value)
    print(json.dumps(dict(newLessons=6,newParagraphUnits=36,newTranslationPairs=72,totalLessons=174,totalTranslationPairs=2088,weeklyQuestions=412,sourceSummary=summary)))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--prepare',action='store_true');args=parser.parse_args()
    prepare() if args.prepare else integrate()
