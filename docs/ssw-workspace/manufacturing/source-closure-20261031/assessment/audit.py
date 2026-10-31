"""Read-only assessment ledger. Run from any directory; writes beside this file.

Structural checks and candidate matches are NOT semantic/source certification.
No source PDF prose or source illustrations are redistributed by this script.
"""
from pathlib import Path
import collections
import copy
import difflib
import hashlib
import json
import re
import unicodedata

OUT = Path(__file__).resolve().parent
ROOT = next(p for p in OUT.parents if (p / 'AGENTS.md').exists())
BASE = ROOT / 'src/data/manufacturing'
SPECIALTIES = ['mechanical', 'electrical', 'surface']


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def dump(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def norm(text):
    return re.sub(r'[\W_]+', '', unicodedata.normalize('NFKC', text), flags=re.UNICODE)


def walk(value, pointer=''):
    if isinstance(value, dict):
        if 'stemJa' in value and 'optionsJa' in value:
            yield pointer, value
        for k, v in value.items():
            yield from walk(v, pointer + '/' + str(k))
    elif isinstance(value, list):
        for i, v in enumerate(value):
            yield from walk(v, pointer + '/' + str(i))


def load(path):
    return json.loads(path.read_text())


def main():
    files = []
    lessons = {}
    lesson_paths = {}
    parent_context = {}
    for specialty in SPECIALTIES:
        for section, kind in [('', 'weekly'), ('mocks', 'mock_original'), ('completion37', 'completion37')]:
            path = BASE / section / f'{specialty}.json'
            value = load(path)
            files.append((path, kind, value))
            for lesson in value.get('lessons', []):
                lessons[lesson['id']] = copy.deepcopy(lesson)
                lesson_paths[lesson['id']] = str(path.relative_to(ROOT))
    for guide in load(BASE / 'source-guides.json')['guides']:
        lessons[guide['id']] = copy.deepcopy(guide)
        lesson_paths[guide['id']] = 'src/data/manufacturing/source-guides.json'
    for name in ['lesson-editorial.json', 'boolean-editorial.json']:
        patch = load(BASE / name)
        lesson = lessons[patch['lessonId']]
        assert lesson['sourceHash'] == patch['sourceHash']
        paragraph = next(p for p in lesson['paragraphs'] if p['id'] == patch['paragraphId'])
        assert paragraph['textJa'] == patch['wording']['ja']['before']
        paragraph['textJa'] = patch['wording']['ja']['after']
    for path in sorted((BASE / 'recognition38').glob('*.json')):
        value = load(path)
        packs = value.get('packs', [])
        if not isinstance(packs, list):
            continue
        files.append((path, 'recognition38', value))
        for pack in packs:
            for q in pack.get('questions', []):
                parent_context[q['id']] = pack
    for filename, kind in [('supplement-practice.json', 'caliper_supplement'), ('boolean-practice.json', 'boolean_supplement')]:
        value = load(BASE / filename)
        files.append((BASE / filename, kind, value))
        for q in value['questions']:
            parent_context[q['id']] = value
    source_manifest = load(ROOT / 'docs/ssw-workspace/manufacturing/batch33-full-review/source-manifest.json')
    sources = {s['sourceId']: s for s in source_manifest['sources']}
    patches = load(BASE / 'question-editorial.json')
    records = []
    structural_findings = []
    inputs = {}
    for filename in ['source-guides.json', 'lesson-editorial.json', 'boolean-editorial.json', 'question-editorial.json', 'reference-practice.json']:
        path = BASE / filename
        inputs[str(path.relative_to(ROOT))] = hashlib.sha256(path.read_bytes()).hexdigest()
    manifest_path = ROOT / 'docs/ssw-workspace/manufacturing/batch33-full-review/source-manifest.json'
    inputs[str(manifest_path.relative_to(ROOT))] = hashlib.sha256(manifest_path.read_bytes()).hexdigest()
    for path, kind, value in files:
        rel = str(path.relative_to(ROOT))
        inputs[rel] = hashlib.sha256(path.read_bytes()).hexdigest()
        for pointer, original in walk(value):
            q = copy.deepcopy(original)
            applied = []
            if q['id'] == patches['questionId']:
                assert q['sourceHash'] == patches['sourceHash'] and q['stemJa'] == patches['before']
                q['stemJa'] = patches['after']
                applied.append('src/data/manufacturing/question-editorial.json')
            context = parent_context.get(q['id'], {})
            lesson_id = q.get('lessonId') or context.get('guideId')
            lesson = lessons.get(lesson_id)
            options = q['optionsJa']
            correct = q['correctIndex']
            reasons = q.get('optionReasonsJa')
            if not (len(options) in [2, 3, 4] and 0 <= correct < len(options)):
                structural_findings.append({'questionId': q['id'], 'kind': 'invalid_option_key_structure'})
            if len(set(re.sub(r'\s+', '', unicodedata.normalize('NFKC', o)) for o in options)) != len(options):
                structural_findings.append({'questionId': q['id'], 'kind': 'identical_normalized_options'})
            if reasons is not None and (len(reasons) != len(options) or not all(reasons)):
                structural_findings.append({'questionId': q['id'], 'kind': 'missing_option_reason'})
            if not lesson:
                structural_findings.append({'questionId': q['id'], 'kind': 'missing_lesson_identity', 'lessonId': lesson_id})
            expected_hash = q.get('lessonSourceHash') or context.get('guideSourceHash') or context.get('lessonSourceHashes', {}).get(lesson_id)
            if expected_hash and lesson and expected_hash != lesson['sourceHash']:
                structural_findings.append({'questionId': q['id'], 'kind': 'stale_taught_lesson_hash', 'lessonId': lesson_id})
            refs = q.get('sources') or (lesson or {}).get('sources', [])
            refs = [{**ref, 'sourceSha256': sources.get(ref.get('documentId'), {}).get('sha256'), 'bindingOrigin': 'question_explicit' if q.get('sources') else 'inherited_taught_lesson'} for ref in refs]
            for ref in refs:
                source = sources.get(ref.get('documentId'))
                if not source or not 1 <= ref.get('pdfPage', 0) <= source['physicalPages']:
                    structural_findings.append({'questionId': q['id'], 'kind': 'invalid_source_page', 'source': ref})
            explicit_paragraph = q.get('guideParagraphId') or q.get('paragraphId') or context.get('paragraphId')
            paragraphs = (lesson or {}).get('paragraphs', [])
            if explicit_paragraph and not any(p['id'] == explicit_paragraph for p in paragraphs):
                structural_findings.append({'questionId': q['id'], 'kind': 'missing_explicit_paragraph', 'paragraphId': explicit_paragraph})
            all_text = q['stemJa'] + '\n' + '\n'.join(options) + '\n' + '\n'.join(reasons or [q.get('explanationJa', '')])
            matched_terms = []
            candidates = []
            for term in (lesson or {}).get('terms', []):
                if len(term['ja']) >= 2 and term['ja'] in all_text:
                    matched_terms.append({'lessonId': lesson_id, 'termJa': term['ja'], 'status': 'lexical_candidate_not_semantic_verified'})
            for p in paragraphs:
                terms = [t['termJa'] for t in matched_terms if t['termJa'] in p.get('textJa', '')]
                if terms:
                    candidates.append({'paragraphId': p['id'], 'matchedTerms': terms, 'status': 'lexical_candidate_not_semantic_verified'})
            numeric = bool(re.search(r'[0-9０-９]', q['stemJa']) and re.search(r'求め|計算|いくつ|何[VAWΩ度倍%個枚秒分]|何mm|何 mm|合計|平均|差は|換算|読み[取と]|読取|値は|値になる|抵抗値|電力は|電流は|電圧は|面積', q['stemJa']))
            record = {
                'id': q['id'], 'bank': kind, 'specialty': (lesson or {}).get('specialty'),
                'sourcePath': rel, 'jsonPointer': pointer, 'recordSha256': digest(original),
                'authoredSourceHash': q.get('sourceHash'), 'effectiveEditorialOverlays': applied,
                'stemJa': q['stemJa'], 'correctIndex': correct,
                'options': [{'index': i, 'textJa': text, 'keyedCorrect': i == correct, 'reasonJa': reasons[i] if reasons else None, 'sharedExplanationJa': None if reasons else q.get('explanationJa'), 'semanticReviewStatus': 'pending_current_source_and_option_review'} for i, text in enumerate(options)],
                'taughtBinding': {'lessonId': lesson_id, 'lessonIdentityResolved': bool(lesson), 'sourceHashMatches': expected_hash == (lesson or {}).get('sourceHash') if expected_hash else None, 'lessonPath': lesson_paths.get(lesson_id), 'explicitParagraphId': explicit_paragraph, 'paragraphCandidates': candidates, 'status': 'explicit_paragraph_identity_only' if explicit_paragraph else 'lesson_only_paragraph_support_pending'},
                'termBindings': matched_terms, 'sourceBindings': refs, 'knowledgeIds': q.get('knowledgeIds', []),
                'numericReviewCandidate': numeric, 'numericTokens': re.findall(r'[−+-]?\d+(?:[.,]\d+)?(?:\s*(?:mm²|mm|m²|cm³|μm|nm|kΩ|Ω|mA|A|mV|V|Wh|W|g/L|g/mol|mol/L|mol|dm²|N/mm²|N|ms|s|%))?', q['stemJa']),
                'sourceSupportStatus': 'not_certified_by_metadata_link', 'fullOptionSemanticReview': False,
                'nativeReviewed': False, 'domainReviewed': False,
            }
            records.append(record)
    assert len({r['id'] for r in records}) == len(records)
    indexed = {r['id']: r for r in records}
    curated = []
    for form in load(BASE / 'reference-practice.json')['forms']:
        for section in form['sections'].values():
            for selection in section['selection']:
                assert selection['id'] in indexed
                assert selection['sourceHash'] == indexed[selection['id']]['authoredSourceHash']
                curated.append({'formId': form['id'], 'questionId': selection['id'], 'countedAsNew': False})
    exact = collections.defaultdict(list)
    templates = collections.defaultdict(list)
    for r in records:
        exact[norm(r['stemJa'])].append(r)
        templates[re.sub(r'\d+(?:[.,]\d+)?', '#', norm(r['stemJa']))].append(r)
    duplicate_groups = []
    for kind, groups in [('normalized_exact_stem', exact), ('numeric_template_stem', templates)]:
        for key, group in groups.items():
            if len(group) <= 1 or (kind == 'numeric_template_stem' and len({norm(r['stemJa']) for r in group}) == 1):
                continue
            duplicate_groups.append({'type': kind, 'stemFingerprint': hashlib.sha256(key.encode()).hexdigest(), 'questionIds': [r['id'] for r in group], 'banks': sorted({r['bank'] for r in group}), 'disposition': 'candidate_requires_pedagogic_decision_not_automatic_deletion'})
    by_lesson = collections.defaultdict(list)
    for r in records:
        by_lesson[r['taughtBinding']['lessonId']].append(r)
    near = []
    for group in by_lesson.values():
        for i, a in enumerate(group):
            for b in group[i+1:]:
                if a['bank'] == b['bank']:
                    continue
                x, y = norm(a['stemJa']), norm(b['stemJa'])
                if x == y or not min(len(x),len(y)) / max(len(x),len(y)) >= .7:
                    continue
                score = difflib.SequenceMatcher(None, x, y, autojunk=False).ratio()
                if score >= .78:
                    near.append({'questionIds': [a['id'],b['id']], 'banks': [a['bank'],b['bank']], 'similarity': round(score,4), 'lessonId': a['taughtBinding']['lessonId'], 'status': 'textual_candidate_not_semantic_duplicate_verdict'})
    repeated_reasons = [r['id'] for r in records if len({o['reasonJa'] for o in r['options']}) == 1 and r['options'][0]['reasonJa']]
    no_per_option = [r['id'] for r in records if any(o['reasonJa'] is None for o in r['options'])]
    dump('question-ledger.json', {'schemaVersion': 1, 'status':'structural_inventory_and_review_queue_not_full_semantic_acceptance', 'inputFileSha256':inputs,'questions':records})
    dump('duplicate-candidates.json', {'method':'NFKC punctuation-insensitive exact stems; numeral template; same-lesson cross-bank SequenceMatcher>=0.78. Candidates are not proof of substantive repetition.','groups':duplicate_groups,'nearCrossBankPairs':near,'curatedReferenceSelections':curated})
    dump('structural-findings.json', {'hardFindings':structural_findings,'noPerOptionReasons':no_per_option,'identicalReasonsAcrossAllOptions':repeated_reasons})
    summary = {
        'schemaVersion':1, 'date':'2026-10-31','uniqueAuthoredQuestions':len(records),'countsByBank':dict(collections.Counter(r['bank'] for r in records)),
        'optionCounts':dict(collections.Counter(len(r['options']) for r in records)), 'optionSidesInventoried':sum(len(r['options']) for r in records),
        'lessonsAndGuidesIndexed':len(lessons),'structuralHardFindings':len(structural_findings),
        'lessonIdentityResolved':sum(r['taughtBinding']['lessonIdentityResolved'] for r in records),'explicitParagraphBindings':sum(bool(r['taughtBinding']['explicitParagraphId']) for r in records),
        'sourcePageMetadataBound':sum(bool(r['sourceBindings']) for r in records),'numericCandidates':sum(r['numericReviewCandidate'] for r in records),
        'exactDuplicateGroups':sum(g['type']=='normalized_exact_stem' for g in duplicate_groups), 'numericTemplateGroups':sum(g['type']=='numeric_template_stem' for g in duplicate_groups),'nearCrossBankPairs':len(near),
        'curatedSelectionsNotNewQuestions':len(curated),'noPerOptionReasons':len(no_per_option),'identicalReasonsAcrossAllOptions':len(repeated_reasons),
        'allQuestionSemanticReviewCompletedThisSession':False,'fullSourceSupportCertified':False,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,
    }
    page_edges = []
    for q in records:
        for ref in q['sourceBindings']:
            specialty = ref['documentId'].removeprefix('mfg1-').removesuffix('-source')
            page_edges.append({'questionId':q['id'],'questionRecordSha256':q['recordSha256'],'sourceId':ref['documentId'],'sourceSha256':ref['sourceSha256'],'physicalPage':ref['pdfPage'],'sourcePageKey':f'mfg39-{specialty}-p{ref["pdfPage"]:03d}','atomicUnitId':None,'lessonId':q['taughtBinding']['lessonId'],'explicitParagraphId':q['taughtBinding']['explicitParagraphId'],'knowledgeIds':q['knowledgeIds'],'evidenceKind':ref['bindingOrigin'],'status':'page_metadata_only_atomic_support_pending'})
    dump('source-page-question-edges.json', {'schemaVersion':1,'scope':'Join hints for root common matrix; every edge remains candidate until semantic atomic-unit support is verified.','edges':page_edges})
    dump('summary.json',summary)
    print(json.dumps(summary,ensure_ascii=False))


if __name__ == '__main__':
    main()
