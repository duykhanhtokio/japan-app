"""Add six independently reviewed supplementary weekly banks; preserve old study state."""
import copy
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / 'docs/ssw-workspace/agriculture'
PACKETS = WORK / 'parallel-21'
DATA = ROOT / 'src/data/agriculture'
BASE = '04da35f0124888087bbd1657086470f63f767772'


def read(p):
    return json.loads(p.read_text())


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def content_hash(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def write(p, value):
    p.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def main():
    checks = read(DATA / 'weekly-checks.ja.json')
    assert sum(len(e['questions']) for e in checks['exams']) == 388, 'Wrong baseline/already integrated'
    old = copy.deepcopy(checks['exams'])
    ledger = read(WORK / 'knowledge-ledger.json')
    lessons = {l['id']: l for l in read(DATA / 'lessons.ja.json')['lessons']}
    knowledge = {k['id']: k for k in ledger['knowledge']}
    course = read(DATA / 'course-manifest.json')
    inventory = read(WORK / 'source-inventory.json')
    documents = {d['id']: d for d in inventory['documents']}
    old_ids = {q['id'] for e in old for q in e['questions']}
    stems = {q['stemJa'] for e in old for q in e['questions']}
    titles = ['かん水器具と土壌生物', '防除計画と農薬ラベル', '施設の被覆機能', '生育観察と養液栽培・果樹', '果樹と切り花・種子', '作物の生理と安全・比較表']
    new_ids, reports, source_checks = [], [], []
    for group in range(1, 7):
        author_path = PACKETS / f'source-{group}.json'
        review_path = PACKETS / f'review-{group}.json'
        packet, review = read(author_path), read(review_path)
        assert review['status'] == 'complete' and review['authorPacketSha256'] == sha(author_path)
        assert not review['excludedQuestionIds'] and not review['unresolvedBlockingIssues']
        assert set(review['questionsReviewed']) == {q['id'] for q in packet['questions']}
        assert len(packet['questions']) == 4
        questions = copy.deepcopy(packet['questions'])
        by_id = {q['id']: q for q in questions}
        for patch in review['questionPatches']:
            target = by_id[patch['questionId']]
            assert patch['field'] in ('stemJa', 'optionsJa', 'optionReasonsJa')
            assert target[patch['field']] == patch['before'] and patch['reason']
            target[patch['field']] = patch['after']
        for q in questions:
            assert q['id'] not in old_ids and q['stemJa'] not in stems
            old_ids.add(q['id']); stems.add(q['stemJa']); new_ids.append(q['id'])
            lesson = lessons[q['lessonId']]
            assert '2' in lesson['levels'] and q['lessonSourceHash'] == lesson['sourceHash']
            assert q['knowledgeIds'] and set(q['knowledgeIds']) <= set(knowledge)
            assert all(q['lessonId'] in knowledge[k]['lessonIds'] for k in q['knowledgeIds'])
            assert any(s['documentId'] == 'AGR-S2' for s in q['sources'])
            for source in q['sources']:
                assert documents[source['documentId']]['pages'][source['pdfPage']-1]['printedPage'] == source['printedPage']
            assert len(q['optionsJa']) == len(set(q['optionsJa'])) == len(q['optionReasonsJa']) == 4
            assert all(q['optionReasonsJa'])
            q.update(revision='v1', level='2', levels=['2'], kind='weekly', status='independently_ai_reviewed_source_checked', officialSimulation=False)
            assert all(q[f] is False for f in ('humanReviewed', 'nativeReviewed', 'domainReviewed'))
        assert sorted(q['correctIndex'] for q in questions) == [0, 1, 2, 3]
        weeks = [w for w in course['levels']['2']['weeks'] if any(q['lessonId'] in w['lessonIds'] for q in questions)]
        assert weeks and all(any(q['lessonId'] in w['lessonIds'] for w in weeks) for q in questions)
        exam_id = f'agr-par21-g{group}-2-check'
        checks['exams'].append(dict(id=exam_id, revision='v1-'+content_hash(questions)[:16], level='2', levels=['2'], kind='weekly',
            weekId=weeks[0]['id'], weekNumber=weeks[0]['number'], weekIdsByLevel={'2': weeks[0]['id']},
            studyWeekIdsByLevel={'2': [w['id'] for w in weeks]}, titleJa=titles[group-1]+'の補足確認',
            officialSimulation=False, timeLimitMinutes=None, passThreshold=None, questions=questions))
        reports.append(dict(group=group, authorPath=str(author_path.relative_to(ROOT)), authorSha256=sha(author_path),
            reviewPath=str(review_path.relative_to(ROOT)), reviewSha256=sha(review_path), bankId=exam_id,
            appliedPatches=review['questionPatches'], integratedQuestionsSha256=content_hash(questions)))
        source_checks.extend(dict(group=group, authorPath=str(author_path.relative_to(ROOT)), **entry) for entry in packet['sourceChecks'])
    assert len(new_ids) == len(set(new_ids)) == 24 and len(source_checks) == 66
    for k in ledger['knowledge']:
        additions = [q['id'] for e in checks['exams'][len(old):] for q in e['questions'] if k['id'] in q['knowledgeIds']]
        if additions:
            k['questionIds'] = sorted(set(k['questionIds']) | set(additions))
    assert checks['exams'][:len(old)] == old
    source_summary = dict(schemaVersion=1, status='ai_source_concordance_with_exact_page_scope_not_complete_curriculum',
        sourcePdfSha256={d['id']: d['sha256'] for d in inventory['documents']}, sourceChecks=source_checks,
        candidateChecks=66, sourceOccurrencesClosed=0, uniqueAssessableObjectivesCertified=None,
        enoughDistinctObjectivesFor800Certified=False, nativeReviewed=False, domainReviewed=False, humanReviewed=False,
        note='Retain raw source-specific/inference/partial statuses. Source support is not an independent-objective count; some supported facts already occur in weekly distractors/reasons. Peer review covers all24questions, not a blanket independent recheck of all66unused source checks.')
    manifest = dict(schemaVersion=1, id='agriculture-parallel-21', baselineCommit=BASE,
        status='integrated_independently_ai_reviewed_pending_final_qa', groups=6, authors=6,
        independentQuestionReviews=6, reviewerCapacityNote='Worker3 completed its source packet then capacity-stopped before review4; coordinator independently reviewed group4. No blocked-worker retry/model switch.',
        packets=reports, newBankIds=[r['bankId'] for r in reports], newQuestionIds=new_ids, newWeeklyQuestions=24,
        newLessonIds=[], sourceCandidateChecks=66, totalWeeklyQuestions=412, totalWeeklyBanks=len(checks['exams']),
        preservedLessons=168, preservedLearningUnits=1008, preservedTranslationPairs=2016, preservedRasterFigures=39,
        unchangedPriorWeeklyBanks=len(old), newMockQuestions=0, totalMockQuestions=0,
        sourceOccurrencesClosed=0, uniqueAssessableObjectivesCertified=None, enoughDistinctObjectivesFor800Certified=False,
        sourceSummaryPath='docs/ssw-workspace/agriculture/parallel-21/source-concordance.json',
        humanReviewed=False, nativeReviewed=False, domainReviewed=False, releaseReady=False, backgroundAuthoringRunning=False)
    progress = read(WORK / 'progress.json')
    progress['authored']['weeklyQuestions'] = 412
    progress['latestBatch'] = 'parallel-21-manifest.json'
    progress['parallelWorkers'] = dict(count=6, status='six_source_authors_and_six_independent_question_reviews_complete_coordinator_adopted_review4_after_capacity_stop', backgroundAuthoringRunning=False)
    progress['next']['resumePriority'] = 'Use parallel-21/source-concordance.json with the frozen batch20queue:66exact-source candidate checks, with original qualifiers/partial/inference statuses preserved.24independentlyAI-reviewed2go weekly questions added;412totalweeklyquestions are not the800mockquestions. Continue source gaps, distinct-objective matrix and remaining3S2disease/8pest/4material caption groups; preserve168lessons/2016draftpairs/39rasters and existing learner state.'
    write(DATA / 'weekly-checks.ja.json', checks)
    write(WORK / 'knowledge-ledger.json', ledger)
    write(PACKETS / 'source-concordance.json', source_summary)
    write(WORK / 'parallel-21-manifest.json', manifest)
    write(WORK / 'progress.json', progress)
    print(json.dumps(dict(newWeeklyQuestions=24, totalWeeklyQuestions=412, newBanks=6, sourceCandidateChecks=66, mockQuestions=0)))


if __name__ == '__main__':
    main()
