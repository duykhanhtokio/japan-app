"""Mechanical learner-content checks. Does not certify semantics or heard audio."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
norm = lambda value: ''.join(value.split())
results = []
for master in sorted((ROOT / 'src/data/jlpt-original').glob('n*/*/master.ja.json')):
    raw = master.read_bytes()
    exam = json.loads(raw)
    manifest = json.loads(master.with_name('audio.manifest.json').read_text())
    issues = []
    items = {item['questionId']: item for item in manifest['items']}
    seen = set()
    for q in exam['questions']:
        qid = q['id']
        def issue(kind, detail):
            issues.append({'questionId': qid, 'kind': kind, 'detail': detail})
        if qid in seen:
            issue('duplicate_question_id', qid)
        seen.add(qid)
        options = q['options']
        if sum(o['id'] == q['correctOptionId'] for o in options) != 1:
            issue('invalid_answer_reference', q['correctOptionId'])
        if len({norm(o['text']) for o in options}) != len(options):
            issue('duplicate_option_text', 'Whitespace-normalized alternatives collide')
        if len({o['id'] for o in options}) != len(options):
            issue('duplicate_option_id', 'Option IDs collide')
        for o in options:
            if not o['text'].strip() or not o.get('rationale', '').strip():
                issue('empty_option_or_rationale', o['id'])
        if q.get('passageId') and not exam.get('passages', {}).get(q['passageId']):
            issue('missing_passage', q['passageId'])
        if 'solutionOrder' in q:
            order = list(map(str, q['solutionOrder']))
            if sorted(order) != sorted(o['id'] for o in options):
                issue('invalid_order_permutation', order)
            elif order[q['starSlot'] - 1] != q['correctOptionId']:
                issue('star_answer_mismatch', order)
            else:
                lookup = {o['id']: o['text'] for o in options}
                sentence = q.get('prefix', '') + ''.join(lookup[i] for i in order) + q.get('suffix', '')
                if norm(sentence) != norm(q.get('completedSentence', '')):
                    issue('completed_sentence_mismatch', sentence)
        if q['section'] == 'listening':
            item = items.get(qid)
            if item is None:
                issue('missing_audio_manifest_item', qid)
                continue
            recorded = [t['text'] for t in item['turns'] if not t['actor'].startswith(('option-', 'question-'))]
            for turn in item['turns']:
                if turn['actor'].startswith('question-') and norm(turn['text']) != norm(q['prompt']):
                    issue('recorded_question_prompt_mismatch', turn['text'])
            scripted = [t[1] for t in q['script']]
            if list(map(norm, recorded)) != list(map(norm, scripted)):
                issue('script_manifest_difference_requires_review', 'Compare renderer-added question repeats/shared-story handling before classifying as error')
            if q.get('spokenOptions'):
                spoken = [t['text'] for t in item['turns'] if t['actor'].startswith('option-')]
                if list(map(norm, spoken)) != [norm(o['text']) for o in options]:
                    issue('spoken_option_difference_requires_review', 'Inspect numbering prefixes/renderer policy; not an acoustic comparison')
    results.append({'examId': exam['examId'], 'masterSha256': hashlib.sha256(raw).hexdigest(),
                    'questionsChecked': len(exam['questions']), 'listeningItemsChecked': len(items),
                    'issues': issues})
report = {'schemaVersion': 1, 'scope': '30 independently authored forms; current canonical manifests',
          'method': 'Mechanical references, duplicates, ordering, and text-to-manifest comparison only',
          'semanticReviewComplete': False, 'acousticTranscriptVerified': False,
          'pronunciationVerified': False, 'releaseReady': False, 'forms': results}
target = ROOT / 'docs/jlpt-workspace/learner-content-audit-20261107/mechanical.json'
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'forms': len(results), 'questions': sum(r['questionsChecked'] for r in results),
                  'listeningItems': sum(r['listeningItemsChecked'] for r in results),
                  'issues': sum(len(r['issues']) for r in results)}, ensure_ascii=False))
