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
rows = []
for file in sorted(DOCS.glob('shared-session-*.json')):
    lesson = json.loads(file.read_text())
    if not any(ref['sourceId'] in {'kensetsu-src-05', 'kensetsu-src-06', 'kensetsu-src-07'} for ref in lesson.get('sourceReferences', [])):
        continue
    for cluster in lesson['clusters']:
        for paragraph in cluster['paragraphs']:
            fields = {}
            for field in ['building', 'civil']:
                approved = [s for s in inline['supplements'] if field in s['fields'] and paragraph['id'] in s['paragraphIds']]
                fields[field] = {
                    'existingWholeLessonLink': lesson['id'] in policy['canonicalPracticalAssignments'][field],
                    'freshDecision': 'approved_bounded_inline_reuse' if approved else 'pending_atomic_review',
                    'inlineTargets': [s['targetSessionId'] for s in approved],
                    'sourceBindings': [{**binding, 'sourceSha256': source_hashes[binding['sourceId']]} for s in approved for binding in s['sourceBindings'] if binding['sourceId'].endswith('k' if field == 'building' else 'd')],
                }
            rows.append({'sessionId': lesson['id'], 'clusterId': cluster['id'], 'paragraphId': paragraph['id'],
                         'japaneseSha256': hashlib.sha256(paragraph['ja'].encode()).hexdigest(), 'fields': fields})
assert len({r['sessionId'] for r in rows}) == 224
assert len(rows) == 1912
report = {'date': '2026-10-17', 'status': 'FULL_PARAGRAPH_INVENTORY_PARTIAL_SEMANTIC_REVIEW',
          'canonicalLessons': 224, 'canonicalParagraphs': len(rows), 'whole224AtomicReviewComplete': False,
          'knowledgeAtomDenominator': None,
          'freshApprovedParagraphFieldBindings': sum(f['freshDecision'] == 'approved_bounded_inline_reuse' for r in rows for f in r['fields'].values()),
          'method': 'A paragraph can contain several knowledge atoms. An existing link, a term match, an absent term or an indexed page is not a fresh semantic approval. Review figures, tables, conditions and exceptions before changing each pending disposition.',
          'rows': rows}
(DOCS / 'PARAGRAPH_REUSE_REVIEW_REGISTER_2026-10-17.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print({k:v for k,v in report.items() if k not in {'rows', 'method'}})
