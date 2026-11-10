"""Integrate four disjoint read receipts and reviewed source-reference amendments.

The receipts are editorial evidence, not machine-generated semantic judgements.
"""
from pathlib import Path
import copy
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/food-manufacturing'
AUDIT = ROOT / 'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
read = lambda p: json.loads(p.read_text())


def write(path, value):
    compact = path.exists() and path.read_bytes().count(b'\n') < 2
    if compact:
        newline = '\n' if path.read_bytes().endswith(b'\n') else ''
        path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':'))+newline)
    else:
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')


def sha(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                    separators=(',', ':')).encode()).hexdigest()


def revision(value):
    # Match JSON.stringify property order and JavaScript UTF-16 FNV-1a.
    text = json.dumps(value, ensure_ascii=False, separators=(',', ':')).encode('utf-16-le')
    h = 2166136261
    for i in range(0, len(text), 2):
        h = ((h ^ int.from_bytes(text[i:i+2], 'little')) * 16777619) & 0xffffffff
    return f'fnv1a-{h:x}'


def main():
    paths = [DATA / 'exams.ja.json', *sorted((DATA / 'authoring-20261029').glob('part*.json'))]
    packs = {path: read(path) for path in paths}
    exams = [e for pack in packs.values() for e in pack.get('exams', [])]
    questions = {q['id']:q for e in exams for q in e['questions']}
    before = copy.deepcopy(questions)
    old_revisions = {e['id']:e.get('revision', revision(e)) for e in exams}
    parts = [read(AUDIT / f'question-review34-part-{i}.json') for i in range(1, 5)]
    review_ids = [r['questionId'] for part in parts for r in part['reviews']]
    assert len(review_ids) == len(set(review_ids)) == 732
    for part in parts:
        assert len(part['reviews']) == 183
        assert part.get('allAssignedQuestionsHandled', True) is True
        for receipt in part['reviews']:
            assert sha(questions[receipt['questionId']]) == receipt['contentSha256']
    changes = []
    for part in parts:
        for proposal in part.get('sourceReferenceCorrections', []):
            q = questions[proposal['questionId']]
            prior = copy.deepcopy(q['sourceRefs'])
            if proposal.get('kind') == 'deduplicate_only':
                q['sourceRefs'] = proposal['proposedSourceRefs']
            else:
                for ref in proposal['addRefs']:
                    assert ref['document'] in ('ssw1', 'ssw2')
                    assert 1 <= ref['pdfPage'] <= (86 if ref['document']=='ssw1' else 165)
                    if ref not in q['sourceRefs']:
                        q['sourceRefs'].append(ref)
            if q['sourceRefs'] != prior:
                changes.append({'questionId':q['id'], 'field':'sourceRefs',
                                'before':prior, 'after':copy.deepcopy(q['sourceRefs']),
                                'reason':proposal['reason']})
    q = questions['food-2-q040']
    prior = q['optionExplanationsJa'][2]
    corrected = '101gは測定値の一つであり、最大値と最小値の差ではありません。'
    assert prior == '代表値の一つであり、最大値と最小値の差ではありません。'
    q['optionExplanationsJa'][2] = corrected
    changes.append({'questionId':q['id'], 'field':'optionExplanationsJa[2]',
                    'before':prior, 'after':corrected,
                    'reason':'101g is one observation, not a representative statistic or range.'})
    # Source references and a wrong-option clarification leave stored answer identities valid.
    changed_exam_ids = []
    for exam in exams:
        if any(before[q['id']] != q for q in exam['questions']):
            exam['revision'] = old_revisions[exam['id']]
            changed_exam_ids.append(exam['id'])
    translations = {}
    for suffix in 'abcd':
        t = read(AUDIT / f'question-wording34-translations-{suffix}.json')
        assert t['questionId'] == q['id']
        translations.update(t['translations'])
    assert len(translations) == 12
    new_hash = revision({k:q[k] for k in ['promptJa','optionsJa','explanationJa','optionExplanationsJa']})
    for locale, entry in translations.items():
        path = DATA / 'test-translations' / (locale+'.json')
        pack = read(path)
        target = pack['questions'][q['id']]
        target['optionExplanations'][2] = entry['optionExplanations']['2']
        target['sourceHash'] = new_hash
        write(path, pack)
    from janome.tokenizer import Tokenizer
    import re
    tokens = []
    for t in Tokenizer().tokenize(corrected):
        token = {'text':t.surface}
        if re.search(r'[一-龯]', t.surface):
            assert t.reading != '*', t.surface
            token['reading'] = ''.join(chr(ord(c)-96) if 'ァ' <= c <= 'ヶ' else c for c in t.reading)
        tokens.append(token)
    matches = 0
    for path in (DATA / 'ruby').glob('*.json'):
        pack = read(path)
        if q['id'] in pack.get('questions', {}):
            entry = pack['questions'][q['id']]
            entry['sourceHash'] = new_hash
            assert 'optionReasonsJa.2' in entry['fields']
            entry['fields']['optionReasonsJa.2'] = tokens
            write(path, pack)
            matches += 1
    assert matches == 1
    for path, pack in packs.items():
        if any(before[q['id']] != q for e in pack.get('exams', []) for q in e['questions']):
            write(path, pack)
    receipts = []
    for index, part in enumerate(parts, 1):
        for receipt in part['reviews']:
            item = copy.deepcopy(receipt)
            qid = item['questionId']
            item['originReceipt'] = {'path':f'question-review34-part-{index}.json',
                                     'contentSha256':item['contentSha256']}
            item['contentSha256'] = sha(questions[qid])
            item['sourceRefs'] = questions[qid]['sourceRefs']
            item['appliedCorrections'] = [c for c in changes if c['questionId']==qid]
            if qid == 'food-2-q040':
                item['judgement'] = 'no_blocking_correctness_issue_identified_after_wording_correction'
                item['reason'] += ' Applied exact reviewed clarification: '+corrected
                item['wordingImprovementPending'] = False
            receipts.append(item)
    write(AUDIT / 'question-semantic34.json', {'reviews':receipts,
          'appliedCorrections':changes, 'preservedExamRevisions':{i:old_revisions[i] for i in changed_exam_ids},
          'humanReviewed':False, 'nativeReviewed':False, 'domainReviewed':False})
    audit = read(AUDIT / 'question-audit.json')
    reviewed = set(review_ids) | {r['questionId'] for p in [AUDIT/'question-semantic32.json',AUDIT/'question-semantic33.json'] for r in read(p)['reviews']}
    for item in audit['items']:
        current = questions[item['questionId']]
        item['contentSha256'] = sha(current)
        item['sourceRefs'] = current['sourceRefs']
        item['stemAnswerAndAllDistractorsSourceSemanticReview'] = 'ai_scoped_rechecked_not_human_certified' if item['questionId'] in reviewed else 'pending'
    audit['aiScopedSemanticallyRechecked'] = len(reviewed)
    audit['semanticReviewRemaining'] = len(questions)-len(reviewed)
    audit['aiSemanticSourceReviewComplete'] = len(reviewed)==len(questions)
    audit['fullSemanticSourceReviewComplete'] = False
    write(AUDIT / 'question-audit.json', audit)
    print(json.dumps({'newReceipts':len(receipts), 'currentAiReceipts':len(reviewed),
                      'appliedCorrections':len(changes), 'preservedExamRevisions':len(changed_exam_ids)}))


if __name__ == '__main__':
    main()
