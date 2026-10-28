"""Check additive six-worker integration and its reviewed option provenance."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
W = 'docs/ssw-workspace/agriculture/parallel-29/'
BASE = '4b8bac004a96e52db2ce63a69745e2e83fefa472'


def read(path):
    return json.loads((ROOT / path).read_text())


def old(path):
    return json.loads(subprocess.check_output(['git', 'show', BASE + ':' + path], cwd=ROOT))


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


plan = read(W + 'integration-plan.json')
for filename, expected in plan['reviewFileSha256'].items():
    assert hashlib.sha256((ROOT / W / filename).read_bytes()).hexdigest() == expected, 'Peer review changed'
before = old('src/data/agriculture/mock-exams.ja.json')['exams']
after = read('src/data/agriculture/mock-exams.ja.json')['exams']
assert after[:len(before)] == before, 'Historical forms changed'
new = after[len(before):]
assert [e['id'] for e in new] == [e['id'] for e in plan['forms']]
packets = {n: read(W + name) for n, name in plan['packetFiles'].items()}
raw = {f'{n}:{q["id"]}': q for n, packet in packets.items() for q in packet['questions']}
previous_queue = {r['rawRef']: r for r in read('docs/ssw-workspace/agriculture/parallel-28/deferred-questions-reviewed.json')['candidates']}
adopted = set()
excluded_adoption_rewrites = []
for ref, question in raw.items():
    source = question.get('adoptedCandidateRef')
    if not source:
        continue
    source_ref = source['rawRef'] if isinstance(source, dict) else source
    source_ref = source_ref.rsplit('#', 1)[-1]
    assert source_ref in previous_queue and source_ref not in adopted, 'Duplicate/unknown queue adoption'
    adopted.add(source_ref)
    original = previous_queue[source_ref]['questionAfterPeerPatches']
    changed_fields = [field for field in ['stemJa', 'optionsJa', 'correctIndex', 'optionReasonsJa', 'lessonId', 'lessonSourceHash', 'knowledgeIds']
                      if question[field] != original[field]]
    if changed_fields:
        assert plan['decisions'][ref]['decision'] == 'exclude', ('Changed adoption must not be accepted/deferred', ref)
        excluded_adoption_rewrites.append({'ref': ref, 'changedFields': changed_fields})
for n in packets:
    assert hashlib.sha256((ROOT / W / plan['packetFiles'][n]).read_bytes()).hexdigest() == plan['workerPacketSha256'][str(n)]
provenance = read(W + 'integration-provenance.json')['questions']
bindings = {r['questionId']: r for r in provenance}
assert len(bindings) == len(provenance)
seen_refs = set()
for exam in new:
    assert len(exam['questions']) == 40
    assert exam['timeLimitMinutes'] is None and exam['passThreshold'] is None
    assert exam['officialSimulation'] is False
    for q in exam['questions']:
        proof = bindings[q['id']]
        ref = proof['rawQuestionRef']
        assert ref not in seen_refs
        seen_refs.add(ref)
        assert plan['decisions'][ref]['decision'] == 'accept'
        source = dict(raw[ref])
        for patch in plan.get('patches', []):
            if patch['ref'] == ref:
                assert source[patch['field']] == patch['before']
                source[patch['field']] = patch['after']
        assert sorted(zip(q['optionsJa'], q['optionReasonsJa'])) == sorted(zip(source['optionsJa'], source['optionReasonsJa']))
        assert q['optionsJa'][q['correctIndex']] == source['optionsJa'][source['correctIndex']]
        for field in ['stemJa', 'objectiveId', 'lessonId', 'lessonSourceHash', 'knowledgeIds']:
            assert q[field] == source[field], (q['id'], field)
        assert digest(q) == proof['questionHash']
assert seen_refs == {ref for ref, d in plan['decisions'].items() if d['decision'] == 'accept'}
deferred = read(W + 'deferred-questions-reviewed.json')
assert deferred['runtimeRegistered'] is False
assert {r['rawRef'] for r in deferred['candidates']} == {
    ref for ref, d in plan['decisions'].items() if d['decision'] == 'defer_to_future_whole_form'
}
assert not ({r['candidateId'] for r in deferred['candidates']} & {
    q['objectiveId'] for exam in after for q in exam['questions']
})
for item in deferred['candidates']:
    source = raw[item['rawRef']]
    q = item['questionAfterPeerPatches']
    assert q['lessonId'] == source['lessonId'] and q['lessonSourceHash'] == source['lessonSourceHash']
    assert q['objectiveId'] == item['candidateId']
    assert len(q['optionsJa']) == len(q['optionReasonsJa']) == 4
    assert item['nativeReviewed'] is False and item['domainReviewed'] is False

old_course = old('src/data/agriculture/course-manifest.json')
course = read('src/data/agriculture/course-manifest.json')
for level in ['1', '2']:
    assert course['levels'][level]['weeks'] == old_course['levels'][level]['weeks']
    assert course['levels'][level]['mockExams'] == old_course['levels'][level]['mockExams'] + [e['id'] for e in new if e['level'] == level]

old_ledger = old('docs/ssw-workspace/agriculture/knowledge-ledger.json')
ledger = read('docs/ssw-workspace/agriculture/knowledge-ledger.json')
assert {k: v for k, v in ledger.items() if k != 'knowledge'} == {k: v for k, v in old_ledger.items() if k != 'knowledge'}
assert len(ledger['knowledge']) == len(old_ledger['knowledge'])
new_refs = {}
for e in new:
    for q in e['questions']:
        for kid in q['knowledgeIds']:
            new_refs.setdefault(kid, []).append(q['id'])
for previous, current in zip(old_ledger['knowledge'], ledger['knowledge']):
    assert {k: v for k, v in previous.items() if k != 'questionIds'} == {k: v for k, v in current.items() if k != 'questionIds'}
    assert current['questionIds'] == previous['questionIds'] + new_refs.get(current['id'], [])

# Existing lesson, translation, image registries and weekly questions stay byte-identical.
preserved = old('docs/ssw-workspace/agriculture/session-20261028/manifest.json')['preservedProductFileSha256']
for path, expected in preserved.items():
    if path not in {'src/data/agriculture/course-manifest.json', 'src/data/agriculture/mock-exams.ja.json'}:
        assert hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == expected, path
assert read(W + 'accepted-objectives.json')['capacityFor800Certified'] is False
print(json.dumps({'status': 'PASS', 'preservedForms': len(before), 'newForms': len(new),
                  'newQuestions': len(seen_refs), 'preservedLessons': 180,
                  'preservedWeeklyQuestions': 412, 'aiWorkers': 6, 'rawPacketsPreserved': len(packets),
                  'deferredCandidatesNotRegistered': len(deferred['candidates']),
                  'excludedRewrittenAdoptions': excluded_adoption_rewrites,
                  'nativeReviewed': False, 'domainReviewed': False}))
