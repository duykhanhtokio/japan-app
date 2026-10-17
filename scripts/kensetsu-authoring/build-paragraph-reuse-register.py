"""Track every canonical paragraph without pretending inventory is semantic review."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/ssw-workspace/kensetsu'
policy = json.loads((ROOT / 'src/data/kensetsu/reuse-policy.json').read_text())
inline = json.loads((ROOT / 'src/data/kensetsu/paragraph-reuse-policy.json').read_text())
manifest = json.loads((DOCS / 'SOURCE_KD_INTAKE_2026-10-17.json').read_text())
source_hashes = {s['sourceId']: s['sha256'] for s in manifest['sources']}
audits = {}
for audit_path in sorted(DOCS.glob('SHARED_TOOLS_REUSE_AUDIT_*.json')):
    audit = json.loads(audit_path.read_text())
    assert audit['whole224AtomicReviewComplete'] is False
    for lesson in audit['rows']:
        lesson_file = DOCS / ('shared-session-' + lesson['sessionId'].split('-')[-1] + '.json')
        assert hashlib.sha256(lesson_file.read_bytes()).hexdigest() == lesson['lessonSha256'], 'Stale lesson audit: ' + lesson['sessionId']
        for cluster in lesson['clusters']:
            for paragraph in cluster['paragraphChecks']:
                for field in lesson['fields']:
                    key = (paragraph['paragraphId'], field)
                    assert key not in audits, 'Conflicting audit decisions: ' + str(key)
                    audits[key] = {'ledger': audit_path.name, 'lesson': lesson, 'paragraph': paragraph}
authorized = json.loads((DOCS / 'AUTHORIZED_REUSE_INPUT_REVISIONS_2026-10-17.json').read_text())
rows = []
for file in sorted(DOCS.glob('shared-session-*.json')):
    lesson = json.loads(file.read_text())
    if not any(ref['sourceId'] in {'kensetsu-src-05', 'kensetsu-src-06', 'kensetsu-src-07'} for ref in lesson.get('sourceReferences', [])):
        continue
    for cluster in lesson['clusters']:
        for paragraph in cluster['paragraphs']:
            fields = {}
            for field in ['building', 'civil']:
                reviewed = audits.get((paragraph['id'], field))
                if reviewed:
                    assert reviewed['paragraph']['japaneseSha256'] == hashlib.sha256(paragraph['ja'].encode()).hexdigest()
                approved = [s for s in inline['supplements'] if field in s['fields'] and paragraph['id'] in s['paragraphIds']]
                fields[field] = {
                    'existingWholeLessonLink': lesson['id'] in policy['canonicalPracticalAssignments'][field],
                    'freshDecision': 'approved_bounded_inline_reuse' if approved else 'needs_content_correction' if reviewed and reviewed['paragraph']['decision'] == 'needs_content_correction' else 'confirmed_existing_bounded_reuse' if reviewed else 'pending_atomic_review',
                    **({'boundedAuditLedger': reviewed['ledger'], 'sourceAtomExhaustivenessConfirmed': False} if reviewed else {}),
                    'inlineTargets': [s['targetSessionId'] for s in approved],
                    'sourceBindings': [{**binding, 'sourceSha256': source_hashes[binding['sourceId']]} for s in (approved if approved else [reviewed['lesson']] if reviewed else []) for binding in s['sourceBindings'] if binding['sourceId'].endswith('k' if field == 'building' else 'd')],
                }
            rows.append({'sessionId': lesson['id'], 'clusterId': cluster['id'], 'paragraphId': paragraph['id'],
                         'japaneseSha256': hashlib.sha256(paragraph['ja'].encode()).hexdigest(), 'fields': fields})
assert len({r['sessionId'] for r in rows}) == 224
assert len(rows) == authorized['baselineParagraphs'] + len(authorized['addedCanonicalParagraphs'])
report = {'date': '2026-10-17', 'status': 'FULL_PARAGRAPH_INVENTORY_PARTIAL_SEMANTIC_REVIEW',
          'canonicalLessons': 224, 'baselineCanonicalParagraphs': authorized['baselineParagraphs'], 'canonicalParagraphs': len(rows), 'whole224AtomicReviewComplete': False,
          'knowledgeAtomDenominator': None,
          'freshApprovedParagraphFieldBindings': sum(f['freshDecision'] == 'approved_bounded_inline_reuse' for r in rows for f in r['fields'].values()),
          'freshConfirmedExistingParagraphFieldBindings': sum(f['freshDecision'] == 'confirmed_existing_bounded_reuse' for r in rows for f in r['fields'].values()),
          'paragraphFieldBindingsNeedingContentCorrection': sum(f['freshDecision'] == 'needs_content_correction' for r in rows for f in r['fields'].values()),
          'crossSubjectSupplementsOutside224CanonicalLessons': [s for s in inline['supplements'] if s['sourceSessionId'] not in {r['sessionId'] for r in rows}],
          'method': 'A paragraph can contain several knowledge atoms. An existing link, a term match, an absent term or an indexed page is not a fresh semantic approval. Review figures, tables, conditions and exceptions before changing each pending disposition.',
          'rows': rows}
(DOCS / 'PARAGRAPH_REUSE_REVIEW_REGISTER_2026-10-17.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print({k:v for k,v in report.items() if k not in {'rows', 'method', 'crossSubjectSupplementsOutside224CanonicalLessons'}})
