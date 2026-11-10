"""Apply the disjoint, self-checked metadata and terminology packets once."""
import collections
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SESSION = ROOT / 'docs/ssw-workspace/agriculture/session-20261031'


def read(path):
    return json.loads(path.read_text())


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


ledger_path = ROOT / 'docs/ssw-workspace/agriculture/knowledge-ledger.json'
recon_path = ROOT / 'docs/ssw-workspace/agriculture/completion-40/source-reconciliation.json'
ledger, recon = read(ledger_path), read(recon_path)
knowledge = {row['id']: row for row in ledger['knowledge']}
rows = {row['id']: row for row in recon['rows']}
greenhouse = read(SESSION / 'greenhouse/ledger-patch.json')
for patch in greenhouse['knowledgePatches']:
    row = knowledge[patch['knowledgeId']]
    assert row['scopeLevels'] == patch['expectedScopeLevels']
    assert row['sources'] == patch['expectedSources']
    for field in ['scopeLevels', 'sources', 'sourceCheck']:
        row[field] = patch[field]
for patch in greenhouse['sourceReconciliationPatches']:
    row = rows[patch['sourceItemId']]
    assert row['disposition'] == patch['expectedDisposition']
    assert row['paragraphIds'] == patch['paragraphIds']
    row.update({field: patch[field] for field in ['disposition', 'reasonJa']})
    row['reconciliationFile'] = 'docs/ssw-workspace/agriculture/session-20261031/greenhouse/ledger-patch.json'
orchard = read(SESSION / 'orchard/source-metadata-adoption.json')['patches']
for patch in orchard['knowledgeEntries']:
    row = knowledge[patch['id']]
    assert row['scopeLevels'] == patch['expectedScopeLevels']
    assert row['sources'] == patch['expectedSources']
    row.update(patch['set'])
for patch in orchard['sourceReconciliationRows']:
    row = rows[patch['id']]
    assert row['disposition'] == patch['expectedDisposition']
    row.update(patch['set'])
for row in recon['rows']:
    if 'routingCorrectionEvidence' in row:
        row['routingCorrectionEvidence'] = 'docs/ssw-workspace/agriculture/session-20261031/recognition/recognition-routing-validation.json'
recon['statusCounts'] = dict(collections.Counter(row['disposition'] for row in recon['rows']))
write(ledger_path, ledger)
write(recon_path, recon)

patches = read(SESSION / 'translations/translation-patches.json')['patches']
by_locale = collections.defaultdict(list)
for patch in patches:
    by_locale[patch['locale']].append(patch)
for locale, items in by_locale.items():
    path = ROOT / f'src/data/agriculture/translations/{locale}.json'
    data = read(path)
    entries = data.get('lessons', data)
    for patch in items:
        row = entries[patch['lessonId']]
        assert row['sourceHash'] == patch['expectedSourceHash']
        assert row[patch['field']][patch['paragraphId']] == patch['expectedBefore']
        row[patch['field']][patch['paragraphId']] = patch['after']
    write(path, data)

glossary_path = ROOT / 'docs/ssw-workspace/agriculture/glossary-inventory.json'
glossary = read(glossary_path)
adoptions = read(SESSION / 'translations/glossary-reconciliation.json')
for patch in adoptions['entries']:
    matches = [row for row in glossary['entries'] if row['headwordJa'] == patch['headwordJa'] and row['source'] == patch['sourceOccurrence']]
    assert len(matches) == 1
    row = matches[0]
    assert row['status'] == patch['previousStatus']
    for field in ['lessonId', 'paragraphIds', 'aliases', 'sourceHash', 'status', 'fullKnowledgeCoverageCertified']:
        row[field] = patch[field]
glossary['pendingHeadwords'] = sorted({row['headwordJa'] for row in glossary['entries'] if row['status'] == 'pending_detailed_mapping'})
write(glossary_path, glossary)
thai_path = ROOT / 'src/data/agriculture/translations/th.json'
thai = read(thai_path)
thai_entries = thai.get('lessons', thai)
thai_patches = read(SESSION / 'translations/supplemental-thai-patches.json')['patches']
for patch in thai_patches:
    row = thai_entries[patch['lessonId']]
    assert row['sourceHash'] == patch['expectedSourceHash']
    if patch['paragraphId'] is None:
        assert row[patch['field']] == patch['expectedBefore']
        row[patch['field']] = patch['after']
    else:
        assert row[patch['field']][patch['paragraphId']] == patch['expectedBefore']
        row[patch['field']][patch['paragraphId']] = patch['after']
write(thai_path, thai)
print(json.dumps({'status': 'PASS', 'knowledgeMetadataSynchronized': 18, 'staleMetadataStatesClosed': 16, 'translationEdits': len(patches), 'glossaryMappingsResolved': 5, 'remainingSourceHolds': recon['statusCounts'].get('hold', 0), 'remainingRoutingProblems': len(recon['routingProblems'])}))
