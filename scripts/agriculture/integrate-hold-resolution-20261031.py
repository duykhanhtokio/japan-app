"""Apply the publisher-scoped 45-item packets with exact baseline guards."""
import collections
import copy
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PARTS = ROOT.parent / 'parts'
OUT = ROOT / 'docs/ssw-workspace/agriculture/session-20261031-hold-resolution'
OWNERS = ['hold-general', 'hold-soil', 'hold-chemicals', 'hold-legal', 'hold-equipment', 'hold-science']


def read(path):
    return json.loads(path.read_text())


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def digest(data):
    return hashlib.sha256(json.dumps(data, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


def project(path):
    return ROOT / path


lessons_path = project('src/data/agriculture/lessons.ja.json')
lessons_data = read(lessons_path)
lessons = {lesson['id']: lesson for lesson in lessons_data['lessons']}
baseline_lessons = copy.deepcopy(lessons)
locales = read(project('docs/ssw-workspace/agriculture/progress.json'))['translations']['supportedTargetLocales']
assert len(locales) == 12
translations = {locale: read(project(f'src/data/agriculture/translations/{locale}.json')) for locale in locales}
baseline_translations = copy.deepcopy(translations)
ledger_path = project('docs/ssw-workspace/agriculture/knowledge-ledger.json')
ledger = read(ledger_path)
knowledge = {row['id']: row for row in ledger['knowledge']}
recon_path = project('docs/ssw-workspace/agriculture/completion-40/source-reconciliation.json')
recon = read(recon_path)
rows = {row['id']: row for row in recon['rows']}
target_ids = {row['id'] for row in recon['rows'] if row['disposition'] == 'hold'
              and row['id'].split('-')[2] in ['GENERAL', 'SOIL', 'SAFETY']}
assert len(target_ids) == 45
seen_japanese, seen_translations, seen_rows = set(), set(), set()
changed_lessons, added_paragraphs, evidence = set(), [], {}
exclusion_rules, packet_hashes = [], {}


def translation_patch(locale, lid, field, pid, before, after):
    key = (locale, lid, field, pid)
    assert key not in seen_translations, ('Overlapping translation owner', key)
    seen_translations.add(key)
    entry = translations[locale][lid]
    if pid is None:
        assert entry[field] == before, key
        entry[field] = after
    else:
        assert entry[field].get(pid) == before, key
        entry[field][pid] = after


for owner in OWNERS:
    packet = read(PARTS / owner / 'packet.json')
    write(OUT / owner / 'packet.json', packet)
    packet_hashes[owner] = digest(packet)
    for name in ['qa.json', 'validation.json', 'self-qa.json']:
        path = PARTS / owner / name
        if path.exists():
            write(OUT / owner / name, read(path))
    assert not packet.get('questionPatches', packet.get('questionContentPatches', [])), 'Question content change requires explicit adoption'
    evidence[owner] = packet.get('externalSources', packet.get('primaryEvidence', packet.get('primaryReferences', packet.get('sourceAccess', packet.get('sourceEvidence', [])))))
    exclusion_rules.extend(packet.get('exclusionRules', []))
    for row in packet.get('newKnowledgeEntries', []):
        assert row['id'] not in knowledge
        knowledge[row['id']] = row
        ledger['knowledge'].append(row)

    patches = packet.get('paragraphPatches', packet.get('japaneseParagraphPatches', packet.get('patches', [])))
    for patch in patches:
        lid, pid = patch['lessonId'], patch['paragraphId']
        assert (lid, pid) not in seen_japanese, ('Overlapping paragraph owner', lid, pid)
        seen_japanese.add((lid, pid))
        lesson = lessons[lid]
        expected_hash = patch.get('expectedLessonSourceHash')
        if expected_hash:
            assert expected_hash == baseline_lessons[lid]['sourceHash']
        changed_lessons.add(lid)
        if patch.get('operation') == 'appendParagraph':
            assert not any(p['id'] == pid for p in lesson['paragraphs'])
            paragraph = copy.deepcopy(patch['afterJa'])
            assert paragraph['id'] == pid
            lesson['paragraphs'].append(paragraph)
            added_paragraphs.append(pid)
        else:
            paragraph = next(p for p in lesson['paragraphs'] if p['id'] == pid)
            before, after = patch['expectedBefore'], patch['after']
            if isinstance(before, dict):
                assert paragraph == before, pid
                paragraph.update(copy.deepcopy(after))
            else:
                field = patch.get('field', 'textJa')
                assert paragraph[field] == before, pid
                paragraph[field] = after
        for kid in paragraph['knowledgeIds']:
            assert kid in knowledge and lid in knowledge[kid]['lessonIds'], (pid, kid)
        nested = patch.get('translations', {})
        if nested:
            assert set(nested) == set(locales), pid
            for locale, target in nested.items():
                if patch.get('operation') == 'appendParagraph':
                    translation_patch(locale, lid, 'paragraphs', pid, None, target['paragraph'])
                    translation_patch(locale, lid, 'paragraphTitles', pid, None, target['paragraphTitle'])
                elif isinstance(target, str):
                    translation_patch(locale, lid, 'paragraphs', pid,
                                      baseline_translations[locale][lid]['paragraphs'][pid], target)
                else:
                    translation_patch(locale, lid, 'paragraphs', pid, target['expectedBefore'], target['after'])

    for patch in packet.get('japaneseLessonFieldPatches', []):
        lid, field = patch['lessonId'], patch['field']
        assert lessons[lid][field] == patch['expectedBefore']
        lessons[lid][field] = patch['after']
        changed_lessons.add(lid)
    for patch in packet.get('translationPatches', packet.get('localePatches', [])):
        translation_patch(patch['locale'], patch['lessonId'], patch['field'], patch.get('paragraphId'),
                          patch['expectedBefore'], patch['after'])

    for patch in packet.get('sourceRowResolutions', packet.get('sourceResolutions', [])):
        sid = patch.get('id', patch.get('sourceItemId', patch.get('sourceRowId')))
        assert sid in target_ids and sid not in seen_rows, sid
        seen_rows.add(sid)
        row = rows[sid]
        if isinstance(patch.get('expectedBefore'), dict):
            assert row == patch['expectedBefore'], sid
        assert row['disposition'] == 'hold', sid
        disposition = patch.get('disposition', patch.get('recommendedDisposition'))
        if disposition == 'resolved_bounded_current_source_supplement':
            disposition = 'covered_new_bounded_current_source_supplement'
        assert disposition.startswith(('covered', 'excluded')), (sid, disposition)
        row['originalObjectiveJa'] = row['objectiveJa']
        for key, value in patch.items():
            if key not in ['id', 'sourceItemId', 'sourceRowId', 'expectedBefore', 'disposition']:
                row[key] = copy.deepcopy(value)
        row['disposition'] = disposition
        row['paragraphIds'] = patch.get('paragraphIds', patch.get('safeParagraphIds', []))
        row['reasonJa'] = patch['reasonJa']
        row['reconciliationFile'] = str((OUT / owner / 'packet.json').relative_to(ROOT))
        row['humanReviewed'] = row['domainReviewed'] = row['nativeReviewed'] = False

assert seen_rows == target_ids, target_ids - seen_rows
transitions = []
for lid in sorted(changed_lessons):
    lesson = lessons[lid]
    old_hash = baseline_lessons[lid]['sourceHash']
    core = {key: value for key, value in lesson.items() if key != 'sourceHash'}
    lesson['sourceHash'] = digest(core)
    assert lesson['sourceHash'] != old_hash
    for locale in locales:
        entry = translations[locale][lid]
        assert entry['sourceHash'] == old_hash
        entry['sourceHash'] = lesson['sourceHash']
        entry['status'] = 'translated_ai_unreviewed'
        entry['nativeReviewed'] = entry['domainReviewed'] = False
        assert set(entry['paragraphs']) == {p['id'] for p in lesson['paragraphs']}
        assert set(entry['paragraphTitles']) == {p['id'] for p in lesson['paragraphs']}
    transitions.append({'lessonId': lid, 'beforeSourceHash': old_hash, 'afterSourceHash': lesson['sourceHash']})

question_bindings, revised_banks = [], []
for name in ['weekly-checks.ja.json', 'mock-exams.ja.json']:
    path = project('src/data/agriculture/' + name)
    bank = read(path)
    for exam in bank['exams']:
        changed = False
        for question in exam['questions']:
            lid = question['lessonId']
            if lid in changed_lessons:
                question['lessonSourceHash'] = lessons[lid]['sourceHash']
                question_bindings.append(question['id'])
                changed = True
        if changed:
            before = exam['revision']
            exam['revision'] = 'v1-' + digest(exam['questions'])[:16]
            revised_banks.append({'id': exam['id'], 'before': before, 'after': exam['revision']})
    write(path, bank)

asset_bindings = 0
for relative, key in [('src/data/agriculture/recognition-images.json', 'images'),
                      ('src/data/agriculture/diagrams.json', 'diagrams'),
                      ('docs/ssw-workspace/agriculture/illustration-register.json', 'figures')]:
    path = project(relative)
    data = read(path)
    for figure in data[key]:
        for lid in changed_lessons & set(figure.get('lessonSourceHashes', {})):
            figure['lessonSourceHashes'][lid] = lessons[lid]['sourceHash']
            asset_bindings += 1
    write(path, data)

compat_path = project('src/data/agriculture/source-hash-compatibility.json')
compat = read(compat_path)
for lid in changed_lessons & set(compat['lessons']):
    entry = compat['lessons'][lid]
    entry['historicalCompatibleSourceHashes'] = entry['compatibleSourceHashes']
    entry['compatibleSourceHashes'] = []
    entry['currentSourceHash'] = lessons[lid]['sourceHash']
    entry['semanticPayloadSha256'] = digest({k: v for k, v in lessons[lid].items() if k not in [
        'sourceHash', 'sources', 'levels', 'revision', 'nativeReviewed', 'domainReviewed', 'humanReviewed', 'sourceCheck']})
    entry['reason'] = 'Substantive publisher-authorized content revision; previous content versions are not automatically accepted as the revised lesson.'
write(compat_path, compat)

recon['statusCounts'] = dict(collections.Counter(row['disposition'] for row in recon['rows']))
recon['routingProblems'] = []
recon['allSafeObjectivesResolved'] = False
write(recon_path, recon)
write(lessons_path, lessons_data)
write(ledger_path, ledger)
for locale, data in translations.items():
    write(project(f'src/data/agriculture/translations/{locale}.json'), data)
write(project('src/data/agriculture/authoring-exclusions.json'), {
    'schemaVersion': 1, 'date': '2026-10-31', 'publisherApproved': True,
    'scope': 'narrow assessment exclusions; no source numeric or scientific correction inferred',
    'rules': exclusion_rules, 'sourceTruthResolved': False})
holds = [row for row in recon['rows'] if row['disposition'] == 'hold']
assert len(holds) == 10
write(OUT / 'integration.json', {
    'schemaVersion': 1, 'status': 'PASS', 'baselineCommit': 'e45d14a8858ca17cf8b6881ff358d0263b2e7bc6',
    'processedSourceRows': sorted(seen_rows), 'processedCount': 45, 'remainingHoldCount': 10,
    'changedLessonIds': sorted(changed_lessons), 'sourceHashTransitions': transitions,
    'newParagraphIds': added_paragraphs, 'translationFieldPatches': len(seen_translations),
    'newKnowledgeEntries': len(ledger['knowledge']) - 1356,
    'questionTextChanges': 0, 'questionSourceBindingsRebound': sorted(question_bindings),
    'examRevisionTransitions': revised_banks, 'figureSourceBindingsRebound': asset_bindings,
    'sourceExclusionRules': len(exclusion_rules), 'packetCanonicalHashes': packet_hashes,
    'crossWorkerContentReview': False, 'humanReviewed': False, 'nativeReviewed': False,
    'domainReviewed': False, 'fullSourceCoverageCertified': False})
write(OUT / 'external-source-register.json', {'schemaVersion': 1, 'sourcesByOwner': evidence})
write(OUT / 'remaining-source-holds.json', {'schemaVersion': 1, 'count': len(holds), 'holds': holds,
    'reason': 'Eight rice/crop and two flower items were outside the three publisher tables in this request.'})
print(json.dumps({'status': 'PASS', 'processed': 45, 'remainingHolds': 10,
                  'changedLessons': len(changed_lessons), 'translationFields': len(seen_translations),
                  'newParagraphs': len(added_paragraphs), 'reboundQuestions': len(question_bindings)}))
