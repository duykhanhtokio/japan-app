"""Check bounded source-gap changes against the unchanged Git baseline."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/ssw-workspace/kensetsu'
record = json.loads((DOCS / 'AUTHORIZED_REUSE_INPUT_REVISIONS_2026-10-17.json').read_text())
old, new = {}, {}
for entry in record['files']:
    file = entry['path']
    before = subprocess.check_output(['git', 'show', record['baseCommit'] + ':' + file], cwd=ROOT)
    after = (ROOT / file).read_bytes()
    assert hashlib.sha256(before).hexdigest() == entry['beforeSha256'], file
    assert hashlib.sha256(after).hexdigest() == entry['afterSha256'], file
    old[file], new[file] = json.loads(before), json.loads(after)

locales = {'en', 'vi', 'id', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl'}
added, revised = set(), set()
retained_paragraphs = retained_translation_entries = 0
lesson_files = {f for f in old if f.startswith('docs/') and '/shared-session-' in f}
paragraphs = lambda lesson: {p['id']: p['ja'] for c in lesson['clusters'] for p in c['paragraphs']}
for file in lesson_files:
    before, after = old[file], new[file]
    before_p, after_p = paragraphs(before), paragraphs(after)
    assert set(before_p) <= set(after_p), 'Removed original paragraph: ' + file
    assert after['revision'] == before['revision'] + 1
    added_here = set(after_p) - set(before_p)
    revised_here = {k for k, v in before_p.items() if after_p[k] != v}
    added |= added_here
    revised |= revised_here
    retained_paragraphs += len(before_p) - len(revised_here)
    translation_file = 'src/data/kensetsu/translations/session-' + before['id'].split('-')[-1] + '.json'
    before_entries, after_entries = old[translation_file]['entries'], new[translation_file]['entries']
    assert set(before_entries) <= set(after_entries)
    assert set(after_entries) - set(before_entries) == added_here
    for key, value in before_entries.items():
        if key not in revised_here:
            assert after_entries[key] == value, 'Unexpected translation change: ' + key
            retained_translation_entries += 1
    for pid in added_here | revised_here:
        entry = after_entries[pid]
        assert entry['sourceJa'] == after_p[pid]
        assert set(entry['translations']) == locales
        assert all(isinstance(v, str) and v.strip() for v in entry['translations'].values())
assert added == set(record['addedCanonicalParagraphs'])
assert revised == set(record.get('revisedCanonicalParagraphs', []))

# A scope-only split must preserve the original Japanese and translated sentences.
for split in record.get('paragraphReorganizations', []):
    old_id, moved_id = split['sourceParagraphId'], split['splitParagraphId']
    lesson_file, translation_file = split['lessonFile'], split['translationFile']
    prior = {'ja': paragraphs(old[lesson_file])[old_id], **old[translation_file]['entries'][old_id]['translations']}
    retained = {'ja': paragraphs(new[lesson_file])[old_id], **new[translation_file]['entries'][old_id]['translations']}
    moved = {'ja': paragraphs(new[lesson_file])[moved_id], **new[translation_file]['entries'][moved_id]['translations']}
    for locale, original in prior.items():
        if locale == 'th':
            middle = split['thaiMiddleSentence']
            assert original.count(middle) == 1 and moved[locale] == middle
            assert original.replace(' ' + middle, '', 1) == retained[locale]
        else:
            fmt = split['sentenceFormats'][locale]
            end, separator = fmt['terminator'], fmt['separator']
            parts = retained[locale][:-len(end)].split(end + separator)
            assert len(parts) == 2 and retained[locale].endswith(end) and moved[locale].endswith(end)
            assert original == parts[0] + end + separator + moved[locale] + separator + parts[1] + end

# Citation-only changes preserve question content, order, choices, answers and exam revisions.
def without_citation_hash(value):
    if isinstance(value, dict):
        return {k: without_citation_hash(v) for k, v in value.items() if k != 'lessonSha256'}
    if isinstance(value, list):
        return [without_citation_hash(v) for v in value]
    return value

updates = 0
for file in [f for f in old if 'review-tests' in f]:
    assert without_citation_hash(old[file]) == without_citation_hash(new[file])
    def check_pairs(before, after):
        global updates
        if isinstance(before, dict):
            if before.get('lessonSha256') != after.get('lessonSha256'):
                target = before['lessonFile']
                assert target in lesson_files and after['lessonFile'] == target
                entry = next(e for e in record['files'] if e['path'] == target)
                assert before['lessonSha256'] == entry['beforeSha256']
                assert after['lessonSha256'] == entry['afterSha256']
                updates += 1
            for key in before:
                check_pairs(before[key], after[key])
        elif isinstance(before, list):
            for a, b in zip(before, after):
                check_pairs(a, b)
    check_pairs(old[file], new[file])
assert updates == record['citationHashUpdates']
policy = json.loads((ROOT / 'src/data/kensetsu/reuse-policy.json').read_text())
for file in lesson_files:
    assert old[file]['id'] + ':r1' in policy['preservedArchivedCompletionIds']
print(json.dumps({'status': 'PASS_BOUNDED_SOURCE_GAP_REVISIONS', 'addedParagraphs': len(added),
                  'revisedParagraphs': len(revised), 'retainedOriginalParagraphs': retained_paragraphs,
                  'retainedTranslationEntries': retained_translation_entries,
                  'targetLocales': len(locales), 'citationHashesOnly': updates,
                  'questionPayloadsOrderAndExamRevisionsUnchanged': True,
                  'allPriorR1CompletionIdsArchived': True}))
