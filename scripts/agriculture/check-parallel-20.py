"""Validate audit coverage/bindings/preservation, never certify semantic uniqueness."""
import hashlib
import json
from pathlib import Path
import subprocess
from collections import Counter

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / 'docs/ssw-workspace/agriculture'
BASE = '83217632464ac4c171d4cbc868c6fa01ebfb3a55'


def read(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def main():
    lessons = read(ROOT / 'src/data/agriculture/lessons.ja.json')['lessons']
    questions = {q['id']: q for exam in read(ROOT / 'src/data/agriculture/weekly-checks.ja.json')['exams'] for q in exam['questions']}
    knowledge = {k['id']: k for k in read(WORK / 'knowledge-ledger.json')['knowledge']}
    manifest = read(WORK / 'parallel-20-manifest.json')
    assert manifest['baselineCommit'] == BASE
    assert manifest['uniqueAssessableObjectivesCertified'] is None
    assert manifest['enoughDistinctObjectivesFor800Certified'] is False
    assert manifest['newQuestionsAuthored'] == manifest['sourceOccurrencesClosed'] == 0
    audited = []
    paragraph_count = 0
    for group in range(1, 7):
        path = WORK / f'parallel-20/objectives-{group}.json'
        packet = read(path)
        assert sha(path) == manifest['packetSha256'][str(path.relative_to(ROOT))]
        expected = lessons[(group - 1) * 28:group * 28]
        assert [l['lessonId'] for l in packet['lessons']] == [l['id'] for l in expected]
        for entry, canonical in zip(packet['lessons'], expected):
            assert entry['sourceHash'] == canonical['sourceHash']
            paragraphs = {p['id']: p for p in canonical['paragraphs']}
            if group == 2:
                assert set(entry['paragraphsReviewed']) == set(paragraphs)
                assert set(entry['knowledgeIdsReviewed']) == {kid for p in paragraphs.values() for kid in p['knowledgeIds']}
                assert {pid for objective in entry['objectives'] for pid in objective['paragraphIds']} == set(paragraphs)
                assert all(isinstance(o['assessmentEligibleCandidate'], bool) for o in entry['objectives'])
                paragraph_count += len(paragraphs)
            else:
                dispositions = next(entry[k] for k in ['paragraphs', 'paragraphDispositions', 'paragraphAudit'] if k in entry)
                assert len(dispositions) == len(paragraphs) == 6
                assert {p['paragraphId'] for p in dispositions} == set(paragraphs)
                for disposition in dispositions:
                    canonical_p = paragraphs[disposition['paragraphId']]
                    assert disposition['knowledgeIds'] == canonical_p['knowledgeIds']
                    assert isinstance(disposition['assessmentEligibleCandidate'], bool)
                    paragraph_count += 1
            for node in walk(entry):
                for key, value in node.items():
                    if key in ('humanReviewed', 'nativeReviewed', 'domainReviewed', 'releaseReady'):
                        assert value is False
                    if key == 'paragraphId':
                        assert value in paragraphs
                    if key == 'paragraphIds':
                        assert set(value) <= set(paragraphs)
                    if key == 'knowledgeIds':
                        assert set(value) <= set(knowledge)
                        assert set(value) <= {kid for p in canonical['paragraphs'] for kid in p['knowledgeIds']}
                    if key.endswith('QuestionIds'):
                        assert set(value) <= set(questions), (group, key, set(value) - set(questions))
            audited.append(entry['lessonId'])
        inputs = packet.get('inputSha256', packet.get('inputs', {}))
        for name, expected_hash in inputs.items():
            assert sha(ROOT / name) == expected_hash, name
    assert len(audited) == len(set(audited)) == 168
    assert paragraph_count == 1008 and len(questions) == 388
    for name, expected_hash in manifest['reviewSha256'].items():
        assert sha(ROOT / name) == expected_hash
        review = read(ROOT / name)
        for packet in review['reviewedPackets']:
            assert sha(ROOT / packet['path']) == packet['sha256']
    queue = read(ROOT / manifest['queuePath'])
    assert sha(ROOT / manifest['queuePath']) == manifest['queueSha256']
    assert len(queue['records']) == queue['rawProposals'] == manifest['rawProposals'] == 129
    assert len({(r['packet'], r['candidateRef']) for r in queue['records']}) == 129
    assert dict(Counter(r['queueDisposition'] for r in queue['records'])) == manifest['dispositionCounts'] == queue['dispositionCounts']
    by_lesson = {l['id']: l for l in lessons}
    for record in queue['records']:
        canonical = by_lesson[record['lessonId']]
        assert record['lessonSourceHash'] == canonical['sourceHash']
        assert record['paragraphIds'] and set(record['paragraphIds']) <= {p['id'] for p in canonical['paragraphs']}
        assert set(record['knowledgeIds']) <= {kid for p in canonical['paragraphs'] for kid in p['knowledgeIds']}
        assert record['sourceRecheckRequired'] is True
        assert record['sourceOccurrencesClosed'] == 0
        assert (WORK / 'parallel-20' / record['reviewFile']).is_file()
        for node in walk(record):
            for key, value in node.items():
                if key == 'questionId':
                    assert value in questions
                if key == 'priorWeeklyEvidenceIds':
                    assert set(value) <= set(questions)
    for name, expected_hash in manifest['preservedInputSha256'].items():
        assert sha(ROOT / name) == expected_hash
        original = subprocess.check_output(['git', 'show', f'{BASE}:{name}'], cwd=ROOT)
        assert hashlib.sha256(original).hexdigest() == expected_hash
    assert read(ROOT / 'src/data/agriculture/lessons.ja.json')['courseComplete'] is False
    print('PASS: 168 lessons / 1008 paragraph dispositions; 388-question references; six packet bindings; review hashes; canonical data preserved. No semantic/source/native/800-objective certification.')


if __name__ == '__main__':
    main()
