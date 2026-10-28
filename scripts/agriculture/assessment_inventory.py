"""Index assessment evidence without treating paragraph counts as exam capacity."""
import argparse
import copy
import hashlib
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEST = 'docs/ssw-workspace/agriculture/assessment-inventory.json'
INPUTS = {
    'lessons': 'src/data/agriculture/lessons.ja.json',
    'weekly': 'src/data/agriculture/weekly-checks.ja.json',
    'mocks': 'src/data/agriculture/mock-exams.ja.json',
    'ledger': 'docs/ssw-workspace/agriculture/knowledge-ledger.json',
    'candidates': 'docs/ssw-workspace/agriculture/session-20261027/assessment-audit.json',
    'review': 'docs/ssw-workspace/agriculture/session-20261028/assessment-review.json',
}


def require(ok, message):
    if not ok:
        raise ValueError(message)


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


def unique(rows, label):
    result = {}
    for row in rows:
        require(row['id'] not in result, 'duplicate ' + label + ': ' + row['id'])
        result[row['id']] = row
    return result


def build(data):
    lessons = unique(data['lessons']['lessons'], 'lesson')
    ledger = unique(data['ledger']['knowledge'], 'knowledge')
    paragraphs, questions, uses = {}, {}, defaultdict(list)
    for lesson in lessons.values():
        require(digest({k: v for k, v in lesson.items() if k != 'sourceHash'}) == lesson['sourceHash'],
                'lesson content/hash mismatch: ' + lesson['id'])
        for p in lesson['paragraphs']:
            require(p['id'] not in paragraphs, 'duplicate paragraph: ' + p['id'])
            require(bool(p['knowledgeIds']), 'unbound paragraph: ' + p['id'])
            for kid in p['knowledgeIds']:
                require(kid in ledger and lesson['id'] in ledger[kid]['lessonIds'],
                        'invalid paragraph knowledge: ' + p['id'] + '/' + kid)
            paragraphs[p['id']] = (lesson, p)
    for kind, bank in [('weekly', data['weekly']), ('mock', data['mocks'])]:
        for exam in bank['exams']:
            for q in exam['questions']:
                require(q['lessonId'] in lessons, 'unknown question lesson: ' + q['id'])
                lesson = lessons[q['lessonId']]
                require(q['lessonSourceHash'] == lesson['sourceHash'],
                        'stale question lesson: ' + q['id'])
                require(q['knowledgeIds'], 'unbound question: ' + q['id'])
                for kid in q['knowledgeIds']:
                    require(kid in ledger and q['lessonId'] in ledger[kid]['lessonIds'],
                            'invalid question knowledge: ' + q['id'] + '/' + kid)
                if q['id'] in questions:
                    require(questions[q['id']] == q, 'conflicting shared question: ' + q['id'])
                    require(all(u['kind'] == kind for u in uses[q['id']]),
                            'weekly/mock question ID reuse: ' + q['id'])
                else:
                    questions[q['id']] = copy.deepcopy(q)
                levels = exam.get('levels', [exam['level']])
                require(set(levels) <= set(lesson['levels']), 'question level outside lesson: ' + q['id'])
                uses[q['id']].append({'examId': exam['id'], 'kind': kind, 'levels': levels})

    by_knowledge = defaultdict(set)
    for q in questions.values():
        for kid in q['knowledgeIds']:
            by_knowledge[kid].add(q['id'])
    same_text = defaultdict(list)
    for pid, (_, p) in paragraphs.items():
        same_text[re.sub(r'\s+', '', p['textJa'])].append(pid)
    holds = defaultdict(set)
    for hold in data['ledger']['holds']:
        for source in hold.get('sources', []):
            holds[(source['documentId'], source['pdfPage'])].add(hold['id'])

    rows = []
    for pid, (lesson, p) in paragraphs.items():
        refs = sorted(set().union(*(by_knowledge[k] for k in p['knowledgeIds'])))
        # Page overlap is only a review signal: it does not assert that a held
        # fact occurs in this paragraph or that the whole page is unusable.
        page_holds = sorted(set().union(*(holds[(s['documentId'], s['pdfPage'])]
                                         for s in lesson['sources'])))
        rows.append({
            'id': 'AGR-PAR-CAND-' + pid,
            'lessonId': lesson['id'], 'paragraphId': pid,
            'lessonSourceHash': lesson['sourceHash'], 'paragraphHash': digest(p),
            'levels': lesson['levels'], 'chapterJa': lesson['chapter'],
            'titleJa': p['titleJa'], 'knowledgeIds': p['knowledgeIds'],
            'sourcePages': lesson['sources'],
            'existingQuestionIds': refs,
            'sameNormalizedTextParagraphIds': [x for x in same_text[re.sub(r'\s+', '', p['textJa'])] if x != pid],
            'summaryTitleSignal': bool(re.search('まとめ|整理|振り返り|復習', p['titleJa'])),
            'sourcePageHoldIdsForReview': page_holds,
            'status': 'requires_atomic_objective_and_global_semantic_review',
            'independentObjectiveCertified': False,
        })

    candidates = data['candidates']['new2goCandidateObjectives']
    require(data['review']['reviewedInputHashes'] == {
        key: digest(data[key]) for key in ['lessons', 'weekly', 'mocks', 'candidates']
    }, 'local editorial review stale; review changed assessment inputs before regeneration')
    reviews = {r['candidateId']: r for r in data['review']['decisions']}
    require(len(reviews) == len(data['review']['decisions']), 'duplicate candidate review')
    require(set(reviews) == {c['candidateId'] for c in candidates}, 'candidate/review coverage mismatch')
    candidate_rows = []
    for candidate in candidates:
        cid = candidate['candidateId']
        require(candidate['paragraphId'] in paragraphs, 'unknown candidate paragraph: ' + cid)
        lesson, p = paragraphs[candidate['paragraphId']]
        require(candidate['lessonId'] == lesson['id'], 'candidate lesson mismatch: ' + cid)
        require(candidate['lessonSourceHash'] == lesson['sourceHash'], 'stale candidate lesson: ' + cid)
        require(set(candidate['knowledgeIds']) <= set(p['knowledgeIds']), 'candidate knowledge mismatch: ' + cid)
        require(set(candidate['scopeLevels']) <= set(lesson['levels']), 'candidate level mismatch: ' + cid)
        review = reviews[cid]
        require(all(review[k] is False for k in ['humanReviewed', 'nativeReviewed', 'domainReviewed']),
                'local AI screen cannot claim external approval: ' + cid)
        require(review['decision'] in {'retain_for_global_review', 'exclude_from_new_question_count'},
                'invalid candidate decision: ' + cid)
        require(review['reasonJa'].strip(), 'missing review reason: ' + cid)
        for qid in review['relatedQuestionIds']:
            require(qid in questions, 'unknown comparison question: ' + qid)
        candidate_rows.append({**candidate, 'localAiScreen': review,
                               'paragraphHash': digest(p),
                               'globalSemanticDedupComplete': False,
                               'eligibleForAutomaticQuestionGeneration': False})

    level_counts = {}
    for level in ['1', '2']:
        relevant = [r for r in rows if level in r['levels']]
        level_counts[level] = {
            'paragraphBindings': len(relevant),
            'withoutExistingQuestionKnowledgeBinding': sum(not r['existingQuestionIds'] for r in relevant),
            'summaryTitleSignals': sum(r['summaryTitleSignal'] for r in relevant),
            'sourcePageHoldReviewSignals': sum(bool(r['sourcePageHoldIdsForReview']) for r in relevant),
            'independentNewObjectiveCapacity': None,
        }
    return {
        'schemaVersion': 1,
        'status': 'evidence_index_not_certified_assessment_capacity',
        'inputs': {key: {'path': INPUTS[key], 'canonicalJsonSha256': digest(data[key])} for key in INPUTS},
        'summary': {
            'lessons': len(lessons), 'paragraphBindings': len(rows),
            'uniqueExistingQuestions': len(questions),
            'uniqueWeeklyQuestions': sum(any(u['kind'] == 'weekly' for u in uses[q]) for q in questions),
            'uniqueMockQuestions': sum(any(u['kind'] == 'mock' for u in uses[q]) for q in questions),
            'localCandidateDecisions': dict(Counter(r['localAiScreen']['decision'] for r in candidate_rows)),
            'levels': level_counts,
        },
        'limitations': [
            'Paragraphs, knowledge IDs and source occurrences are not independently assessable objective counts.',
            'Question knowledge bindings detect direct reuse only; different IDs may assess the same meaning.',
            'Summary titles and exact text matches are screening signals, not complete semantic deduplication.',
            'A hold on the same source page requires checking its scope; this index neither resolves nor broadens that hold.',
            'Local review uses existing source-checked prose, not a fresh inspection of the original PDF pages.',
            'Retained candidates remain unavailable for automatic question generation until global matrix review.',
        ],
        'capacityFor800Certified': False, 'nativeReviewed': False, 'domainReviewed': False,
        'paragraphCandidates': rows,
        'existingAssessments': [{
            'questionId': q['id'], 'objectiveId': q.get('objectiveId'),
            'lessonId': q['lessonId'], 'lessonSourceHash': q['lessonSourceHash'],
            'knowledgeIds': q['knowledgeIds'], 'questionHash': digest(q), 'uses': uses[q['id']],
        } for q in questions.values()],
        'locallyScreenedCandidates': candidate_rows,
    }


def load(root=ROOT):
    return {key: json.loads((root / name).read_text()) for key, name in INPUTS.items()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true', help='explicitly regenerate the evidence index')
    args = parser.parse_args()
    report = build(load())
    target = ROOT / DEST
    if args.write:
        target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    else:
        require(json.loads(target.read_text()) == report, 'assessment inventory stale; review inputs before --write')
    print(json.dumps({'status': 'PASS', **report['summary'], 'capacityFor800Certified': False}, ensure_ascii=False))


if __name__ == '__main__':
    main()
