"""Check batch21 source/peer bindings and exact preservation of existing study content."""
import copy
import hashlib
import json
from pathlib import Path
import subprocess
from collections import Counter

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / 'docs/ssw-workspace/agriculture'
PACKETS = WORK / 'parallel-21'
BASE = '04da35f0124888087bbd1657086470f63f767772'


def read(p):
    return json.loads(p.read_text())


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def old_bytes(name):
    return subprocess.check_output(['git', 'show', f'{BASE}:{name}'], cwd=ROOT)


def content_hash(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)


def main():
    manifest = read(WORK / 'parallel-21-manifest.json')
    assert manifest['baselineCommit'] == BASE
    lessons = {l['id']: l for l in read(ROOT / 'src/data/agriculture/lessons.ja.json')['lessons']}
    inventory = {d['id']: d for d in read(WORK / 'source-inventory.json')['documents']}
    checks = read(ROOT / 'src/data/agriculture/weekly-checks.ja.json')
    old_checks = json.loads(old_bytes('src/data/agriculture/weekly-checks.ja.json'))
    assert checks['exams'][:len(old_checks['exams'])] == old_checks['exams']
    assert len(checks['exams']) == 44 and len(old_checks['exams']) == 38
    new_banks = checks['exams'][38:]
    assert [b['id'] for b in new_banks] == manifest['newBankIds']
    assert sum(len(e['questions']) for e in checks['exams']) == 412
    frozen = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', BASE, 'src/data/agriculture'], cwd=ROOT, text=True).splitlines()
    frozen += ['src/services/agriculture-study-state.ts', 'src/components/agriculture/AgricultureCourse.tsx',
        'src/components/agriculture/RecognitionImages.tsx', 'docs/ssw-workspace/agriculture/source-inventory.json',
        'docs/ssw-workspace/agriculture/source-gap-backlog.json', 'docs/ssw-workspace/agriculture/source-coverage-audit.json',
        'docs/ssw-workspace/agriculture/source-gap-reconciliation-11.json', 'docs/ssw-workspace/agriculture/source-gap-reconciliation-12.json',
        'docs/ssw-workspace/agriculture/exam-authoring-blueprint.json', 'docs/ssw-workspace/agriculture/parallel-20/assessment-candidate-queue.json']
    for name in frozen:
        if name != 'src/data/agriculture/weekly-checks.ja.json':
            assert (ROOT / name).read_bytes() == old_bytes(name), f'Preserved bytes changed: {name}'
    queue = read(WORK / 'parallel-20/assessment-candidate-queue.json')['records']
    retained = {r['candidateRef']: r for r in queue if r['queueDisposition'] == 'retain_provisional_source_recheck'}
    source_summary = read(PACKETS / 'source-concordance.json')
    assert len(source_summary['sourceChecks']) == len(retained) == 66
    assert {c['candidateRef'] for c in source_summary['sourceChecks']} == set(retained)
    for check in source_summary['sourceChecks']:
        original = retained[check['candidateRef']]
        assert check['lessonId'] == original['lessonId']
        assert check['lessonSourceHash'] == original['lessonSourceHash'] == lessons[check['lessonId']]['sourceHash']
        assert check['paragraphIds'] == original['paragraphIds']
        assert check['knowledgeIds'] == original['knowledgeIds']
        sources = check.get('verifiedSources', check.get('checkedSourcePages', check.get('sources')))
        assert sources
        for source in sources:
            assert inventory[source['documentId']]['pages'][source['pdfPage']-1]['printedPage'] == source['printedPage']
    expected_ids = []
    for report, bank in zip(manifest['packets'], new_banks):
        author, review = read(ROOT / report['authorPath']), read(ROOT / report['reviewPath'])
        assert sha(ROOT / report['authorPath']) == report['authorSha256'] == review['authorPacketSha256']
        assert sha(ROOT / report['reviewPath']) == report['reviewSha256']
        assert review['status'] == 'complete' and not review['excludedQuestionIds'] and not review['unresolvedBlockingIssues']
        assert set(review['questionsReviewed']) == {q['id'] for q in author['questions']}
        questions = copy.deepcopy(author['questions'])
        by_id = {q['id']: q for q in questions}
        for patch in review['questionPatches']:
            obj = by_id[patch['questionId']]
            assert obj[patch['field']] == patch['before']
            obj[patch['field']] = patch['after']
        for q in questions:
            q.update(revision='v1', level='2', levels=['2'], kind='weekly', status='independently_ai_reviewed_source_checked', officialSimulation=False)
            assert q['lessonSourceHash'] == lessons[q['lessonId']]['sourceHash']
            assert '2' in lessons[q['lessonId']]['levels']
            assert q['sources'] and all(s['documentId'] == 'AGR-S2' for s in q['sources'])
            expected_ids.append(q['id'])
        assert questions == bank['questions']
        assert content_hash(questions) == report['integratedQuestionsSha256']
        assert bank['revision'] == 'v1-' + content_hash(questions)[:16]
        assert Counter(q['correctIndex'] for q in questions) == Counter({0: 1, 1: 1, 2: 1, 3: 1})
    assert expected_ids == manifest['newQuestionIds'] and len(set(expected_ids)) == 24
    old_ledger = json.loads(old_bytes('docs/ssw-workspace/agriculture/knowledge-ledger.json'))
    ledger = read(WORK / 'knowledge-ledger.json')
    assert ledger.keys() == old_ledger.keys()
    for key in ledger:
        if key != 'knowledge':
            assert ledger[key] == old_ledger[key]
    assert len(ledger['knowledge']) == len(old_ledger['knowledge']) == 1008
    for current, previous in zip(ledger['knowledge'], old_ledger['knowledge']):
        assert {k:v for k,v in current.items() if k != 'questionIds'} == {k:v for k,v in previous.items() if k != 'questionIds'}
        additions = {q['id'] for e in new_banks for q in e['questions'] if current['id'] in q['knowledgeIds']}
        assert set(current['questionIds']) == set(previous['questionIds']) | additions
    for value in [manifest, source_summary, *[read(p) for p in PACKETS.glob('source-*.json')], *[read(p) for p in PACKETS.glob('review-*.json')]]:
        for node in nodes(value):
            for key in ('nativeReviewed', 'domainReviewed', 'humanReviewed', 'releaseReady', 'enoughDistinctObjectivesFor800Certified'):
                if key in node:
                    assert node[key] is False
            if 'sourceOccurrencesClosed' in node:
                assert node['sourceOccurrencesClosed'] == 0
    assert manifest['totalMockQuestions'] == manifest['newMockQuestions'] == 0
    assert read(WORK / 'progress.json')['authored']['weeklyQuestions'] == 412
    assert sha(PACKETS / 'source-concordance.json') == manifest['sourceSummarySha256']
    if 'browserQaEvidence' in manifest:
        evidence = manifest['browserQaEvidence']
        assert sha(ROOT / evidence['path']) == evidence['sha256']
        qa = read(ROOT / evidence['path'])
        assert qa['status'] == 'PASS' and qa['newQuestionCases'] == 24 and qa['newBanks'] == 6
        assert qa['responsiveCases'] == 48 and qa['resumeCases'] == qa['saveFailureRetryCases'] == 6
        for name, digest in qa['inputSha256'].items():
            assert sha(ROOT / name) == digest
        assert qa['nativeDeviceTested'] is qa['productionExpoTested'] is qa['nativeFontsCertified'] is False
    print('PASS: 66 source-check bindings; 24 independently reviewed level2 weekly questions / 6 banks; all388priorquestions and168lessons/2016translations preserved; only additive ledger question links; no source closures or800objective certification.')


if __name__ == '__main__':
    main()
