"""Integrate only explicitly reviewed whole forms; preserve raw worker packets."""
import copy
import hashlib
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / 'docs/ssw-workspace/agriculture/parallel-28'
DATA = ROOT / 'src/data/agriculture'


def read(path):
    return json.loads(path.read_text())


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


def main():
    plan = read(WORK / 'integration-plan.json')
    for path, expected in plan['inputFileSha256'].items():
        assert hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == expected, 'Changed input: ' + path
    bank = read(DATA / 'mock-exams.ja.json')
    lessons = {l['id']: l for l in read(DATA / 'lessons.ja.json')['lessons']}
    ledger = read(ROOT / 'docs/ssw-workspace/agriculture/knowledge-ledger.json')
    knowledge = {k['id']: k for k in ledger['knowledge']}
    manifest = read(DATA / 'course-manifest.json')
    old_ids = {e['id'] for e in bank['exams']}
    objective_ids = {q['objectiveId'] for e in bank['exams'] for q in e['questions']}
    assert len({e['id'] for e in plan['forms']}) == len(plan['forms']), 'Duplicate planned form'
    assert not ({e['id'] for e in plan['forms']} & old_ids), 'Already integrated; never replay on live data'
    packets = {}
    raw = {}
    for worker in range(1, 7):
        path = WORK / f'worker{worker}.json'
        assert hashlib.sha256(path.read_bytes()).hexdigest() == plan['workerPacketSha256'][str(worker)]
        packet = read(path)
        packets[worker] = packet
        for question in packet['questions']:
            ref = f'{worker}:{question["id"]}'
            assert ref not in raw
            raw[ref] = question
    used = set()
    provenance, accepted_objectives = [], []
    for form in plan['forms']:
        assert len(form['questionRefs']) == 40 and len(set(form['questionRefs'])) == 40
        positions = [i for i in range(4) for _ in range(10)]
        rng = random.Random(form['id'] + ':parallel28')
        while True:
            rng.shuffle(positions)
            if all(not (positions[i] == positions[i-1] == positions[i-2]) for i in range(2, 40)):
                break
        qs = []
        for i, ref in enumerate(form['questionRefs']):
            assert ref not in used
            used.add(ref)
            assert plan['decisions'][ref]['decision'] == 'accept'
            q = copy.deepcopy(raw[ref])
            worker = int(ref.split(':', 1)[0])
            assert packets[worker]['level'] == form['level']
            objectives = {x['id']: x for x in packets[worker]['objectives']}
            for patch in plan.get('patches', []):
                if patch['ref'] == ref:
                    assert patch['field'] in {'stemJa', 'optionsJa', 'optionReasonsJa', 'correctIndex'}, 'Unsafe patch field'
                    assert q[patch['field']] == patch['before'], ref
                    assert patch['reasonJa']
                    q[patch['field']] = patch['after']
            objective = copy.deepcopy(objectives[q['objectiveId']])
            assert q['objectiveId'] not in objective_ids, 'Repeated objective: ' + q['objectiveId']
            objective_ids.add(q['objectiveId'])
            assert len(q['optionsJa']) == len(q['optionReasonsJa']) == 4
            assert len(set(q['optionsJa'])) == 4
            assert all(isinstance(v, str) and v.strip() for v in q['optionsJa'] + q['optionReasonsJa'])
            assert type(q['correctIndex']) is int and 0 <= q['correctIndex'] < 4
            lesson = lessons[q['lessonId']]
            assert form['level'] in lesson['levels']
            assert q['lessonSourceHash'] == lesson['sourceHash']
            assert q['knowledgeIds'] and q['nativeReviewed'] is False and q['domainReviewed'] is False
            assert objective['lessonId'] == q['lessonId']
            assert set(q['knowledgeIds']) <= set(objective['knowledgeIds'])
            paragraph_ids = {p['id'] for p in lesson['paragraphs']}
            assert objective['paragraphIds'] and set(objective['paragraphIds']) <= paragraph_ids
            bound_knowledge = {kid for p in lesson['paragraphs'] if p['id'] in objective['paragraphIds']
                               for kid in p['knowledgeIds']}
            assert set(objective['knowledgeIds']) <= bound_knowledge, 'Objective/paragraph mismatch: ' + ref
            correct = q['correctIndex']
            order = [n for n in range(4) if n != correct]
            rng.shuffle(order)
            order.insert(positions[i], correct)
            q['optionsJa'] = [q['optionsJa'][n] for n in order]
            q['optionReasonsJa'] = [q['optionReasonsJa'][n] for n in order]
            q['correctIndex'] = positions[i]
            q['id'] = form['id'] + f'-q{i+1:02}'
            # Runtime payload stays compatible with the approved existing runner.
            q = {k: q[k] for k in ['id', 'objectiveId', 'topicJa', 'stemJa', 'optionsJa',
                 'correctIndex', 'optionReasonsJa', 'lessonId', 'lessonSourceHash',
                 'knowledgeIds', 'nativeReviewed', 'domainReviewed']}
            for kid in q['knowledgeIds']:
                assert lesson['id'] in knowledge[kid]['lessonIds']
                assert q['id'] not in knowledge[kid]['questionIds']
                knowledge[kid]['questionIds'].append(q['id'])
            qs.append(q)
            provenance.append({'questionId': q['id'], 'rawQuestionRef': ref,
                               'objectiveId': q['objectiveId'], 'questionHash': digest(q)})
            accepted_objectives.append({**objective, 'level': form['level'],
                                       'questionId': q['id'], 'lessonSourceHash': lesson['sourceHash'],
                                       'rootReview': plan['decisions'][ref]})
        exam = {'id': form['id'], 'revision': 'v1-' + digest(qs)[:16], 'level': form['level'],
                'levels': [form['level']], 'kind': 'mock', 'titleJa': form['titleJa'],
                'officialSimulation': False, 'timeLimitMinutes': None,
                'passThreshold': None, 'questions': qs,
                'nativeReviewed': False, 'domainReviewed': False}
        bank['exams'].append(exam)
        manifest['levels'][form['level']]['mockExams'].append(exam['id'])
    assert used == {ref for ref, d in plan['decisions'].items() if d['decision'] == 'accept'}
    bank['complete'] = all(sum(e['level'] == level for e in bank['exams']) == 10 for level in ['1', '2'])
    bank['status'] = 'partial_original_practice_forms_ai_reviewed_not_domain_certified'
    write(DATA / 'mock-exams.ja.json', bank)
    write(DATA / 'course-manifest.json', manifest)
    write(ROOT / 'docs/ssw-workspace/agriculture/knowledge-ledger.json', ledger)
    write(WORK / 'accepted-objectives.json', {'schemaVersion': 1, 'objectives': accepted_objectives,
          'capacityFor800Certified': False, 'nativeReviewed': False, 'domainReviewed': False})
    write(WORK / 'integration-provenance.json', {'schemaVersion': 1, 'questions': provenance,
          'rawPacketsPreserved': True, 'answerPositionsRebalancedWithReasons': True})
    print(json.dumps({'newForms': len(plan['forms']), 'newQuestions': len(used)}))


if __name__ == '__main__':
    main()
