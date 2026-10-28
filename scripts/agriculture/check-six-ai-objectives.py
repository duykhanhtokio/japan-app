"""Validate a bounded AI review matrix; never turn review rows into exam capacity."""
import argparse
import copy
import hashlib
import json
import subprocess
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIRECTORY = Path('docs/ssw-workspace/agriculture/session-20261028-six-ai')


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read(path):
    return json.loads(path.read_text())


def build(root=ROOT, baseline_ref=None):
    paths = ['src/data/agriculture/' + name for name in
             ['lessons.ja.json', 'weekly-checks.ja.json', 'mock-exams.ja.json']]
    inputs = {path: (json.loads(subprocess.check_output(
        ['git', 'show', baseline_ref + ':' + path], cwd=root, text=True))
        if baseline_ref else read(root / path)) for path in paths}
    lessons = {l['id']: l for l in inputs[paths[0]]['lessons']}
    paragraphs = {p['id']: (l, p) for l in lessons.values() for p in l['paragraphs']}
    questions = {}
    for path in paths[1:]:
        for exam in inputs[path]['exams']:
            for q in exam['questions']:
                require(q['id'] not in questions or questions[q['id']] == q,
                        'Conflicting shared question ' + q['id'])
                questions[q['id']] = q
    rows, packet_hashes = [], {}
    for number in range(1, 7):
        name = 'objectives-' + str(number) + '.json'
        packet = read(root / DIRECTORY / name)
        packet_hashes[name] = digest(packet)
        for original in packet.get('rows', packet.get('records', [])):
            lesson, paragraph = paragraphs[original['paragraphId']]
            require(original['lessonId'] == lesson['id'], 'Lesson binding mismatch')
            require(original['lessonSourceHash'] == lesson['sourceHash'], 'Stale lesson')
            if 'paragraphHash' in original:
                require(original['paragraphHash'] == digest(paragraph), 'Stale paragraph')
            else:
                require(original['paragraphTextSha256'] == hashlib.sha256(
                    paragraph['textJa'].encode()).hexdigest(), 'Stale paragraph text')
            refs = original.get('relatedQuestionIds', original.get('nearestQuestionIds', []))
            require(refs and set(refs) <= set(questions), 'Unknown/absent comparison questions')
            for key in ['nativeReviewed', 'domainReviewed', 'humanReviewed',
                        'independentObjectiveCertified', 'eligibleForAutomaticQuestionGeneration',
                        'approvedForQuestionAuthoring']:
                require(original.get(key, False) is False, 'False approval ' + key)
            decision = original.get('decision', original.get('disposition'))
            if decision in ['duplicate', 'exclude_from_new_question_count']:
                decision = 'exclude_duplicate'
            elif decision in ['hold_not_new_capacity', 'provisional_distinct_source_recheck']:
                decision = 'hold'
            require(decision in ['exclude_duplicate', 'retain_for_cross_packet_review', 'hold'],
                    'Unknown disposition ' + str(decision))
            source_pages = original.get('sourcePages', original.get('sources'))
            require(source_pages == lesson['sources'], 'Source reference mismatch')
            rows.append({'id': original.get('id', original.get('objectiveId')),
                         'packet': name, 'lessonId': lesson['id'],
                         'paragraphId': paragraph['id'], 'paragraphHash': digest(paragraph),
                         'lessonSourceHash': lesson['sourceHash'], 'sourcePages': source_pages,
                         'knowledgeIds': paragraph['knowledgeIds'], 'levels': lesson['levels'],
                         'objective': original.get('objectiveJa', original.get('objectiveEn',
                                      original.get('paragraphTextJa'))),
                         'decision': decision,
                         'reason': original.get('reasonJa', original.get('reasonEn')),
                         'relatedQuestions': [{'id': qid, 'hash': digest(questions[qid])} for qid in refs],
                         'eligibleForAutomaticQuestionGeneration': False})
    require(len(rows) == 94, 'Incomplete six-worker review')
    require(len({r['id'] for r in rows}) == len(rows), 'Duplicate review ID')
    require(all(r['reason'] and r['objective'] for r in rows), 'Missing review rationale')
    pending = read(root / DIRECTORY / 'pending-question-fingerprints.json')
    pending_ids = {q['id'] for q in pending['questions']}
    require(len(pending_ids) == 80, 'Pending question snapshot incomplete')
    by_id = {r['id']: r for r in rows}
    reviewed = set()
    peer_hashes = {}
    for name in ['review-2.json', 'review-1-3.json', 'review-4-5.json']:
        peer = read(root / DIRECTORY / name)
        peer_hashes[name] = digest(peer)
        peer_pending_hash = peer.get('pendingInputSha256', peer.get('inputs', {}).get('pendingMockFileSha256'))
        require(peer_pending_hash == pending['fileSha256'], 'Peer pending snapshot mismatch')
        packet_bindings = peer.get('reviewedPacketHashes', {})
        if 'inputPacket' in peer:
            packet_bindings[peer['inputPacket']] = peer['inputPacketSha256']
        for n in [4, 5]:
            if 'objectives' + str(n) + 'Sha256' in peer.get('inputs', {}):
                packet_bindings['objectives-' + str(n) + '.json'] = peer['inputs']['objectives' + str(n) + 'Sha256']
        for packet_name, bound_hash in packet_bindings.items():
            raw_hash = hashlib.sha256((root / DIRECTORY / packet_name).read_bytes()).hexdigest()
            require(bound_hash in [raw_hash, packet_hashes[packet_name]], 'Stale peer packet binding')
        for review in peer['rows']:
            row_id = review.get('rowId', review.get('id'))
            require(row_id in by_id and row_id not in reviewed, 'Unknown/repeated peer row')
            reviewed.add(row_id)
            refs = review.get('relatedPendingQuestionIds', review.get('pendingQuestionIds', []))
            require(set(refs) <= pending_ids, 'Unknown pending comparison')
            require(review.get('authoringApproved', False) is False, 'Peer falsely approves authoring')
            row = by_id[row_id]
            row['peerReview'] = {'file': name, 'decision': review['decision'],
                                 'pendingQuestionIds': refs,
                                 'reason': review.get('reasonJa', review.get('reasonEn'))}
            require(row['peerReview']['reason'], 'Missing peer rationale')
            if review['decision'].startswith(('exclude', 'merge')):
                row['decision'] = 'exclude_duplicate'
            elif review['decision'].startswith('hold'):
                row['decision'] = 'hold'
            elif review['decision'].startswith('retain'):
                row['decision'] = 'retain_for_cross_packet_review'
            else:
                raise ValueError('Unknown peer disposition')
    require(len(reviewed) == 34, 'Peer coverage changed')
    same_paragraphs = Counter(r['paragraphId'] for r in rows)
    return {'schemaVersion': 1, 'status': 'bounded_review_not_global_capacity',
            'inputs': {path: digest(value) for path, value in inputs.items()},
            'packetCanonicalHashes': packet_hashes,
            'peerCanonicalHashes': peer_hashes,
            'pendingSnapshotCanonicalHash': digest(pending),
            'summary': {'workers': 6, 'reviewRows': len(rows),
                        'independentlyCrossReviewedRows': len(reviewed),
                        'uniqueParagraphs': len(same_paragraphs),
                        'baselineUniqueQuestions': len(questions),
                        'decisions': dict(Counter(r['decision'] for r in rows)),
                        'newQuestions': 0},
            'overlappingParagraphReviews': {p: n for p, n in same_paragraphs.items() if n > 1},
            'rows': rows, 'globalSemanticDedupComplete': False,
            'capacityFor800Certified': False, 'nativeReviewed': False,
            'domainReviewed': False, 'humanReviewed': False,
            'pendingParallel28QuestionsAreAppContent': False,
            'limitations': ['Lexical screening supports targeted AI comparison; it is not exhaustive semantic certification.',
                           'All retained rows still require source and global objective review before authoring.',
                           'Pending parallel-28 questions are uncommitted review inputs, not credited app content.',
                           'Cross-packet reviews remain separately hash-bound evidence; no automatic promotion.']}


def validate(matrix, expected):
    require(matrix == expected, 'Matrix stale or modified; recheck source/packet inputs')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--write', action='store_true')
    parser.add_argument('--self-test', action='store_true')
    parser.add_argument('--baseline-ref', help='Validate historical input bindings at this Git ref; not current capacity')
    args = parser.parse_args()
    expected = build(baseline_ref=args.baseline_ref)
    destination = ROOT / DIRECTORY / 'atomic-objective-matrix.json'
    if args.write:
        destination.write_text(json.dumps(expected, ensure_ascii=False, indent=2) + '\n')
    validate(read(destination), expected)
    failures = 0
    if args.self_test:
        for mutate in [lambda x: x.update(capacityFor800Certified=True),
                       lambda x: x['rows'].pop(),
                       lambda x: x['rows'][0].update(paragraphHash='stale'),
                       lambda x: x['rows'][0].update(eligibleForAutomaticQuestionGeneration=True),
                       lambda x: x['inputs'].update({'unexpected': 'unbound'}),
                       lambda x: x.update(pendingParallel28QuestionsAreAppContent=True)]:
            changed = copy.deepcopy(expected)
            mutate(changed)
            try:
                validate(changed, expected)
            except ValueError:
                failures += 1
        require(failures == 6, 'Negative guard failed')
    print(json.dumps({'status': 'PASS', **expected['summary'], 'negativeGuards': failures}))


if __name__ == '__main__':
    main()
