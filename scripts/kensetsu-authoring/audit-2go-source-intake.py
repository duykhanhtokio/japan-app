"""Register a separately downloaded JAC PDF; index existing lessons for later review.

The PDF stays outside the repository. Keyword hits are navigation, never coverage.
"""
import argparse
import hashlib
import json
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'docs/ssw-workspace/kensetsu'
GROUPS = [
    ('leader-role', 1, 23, 'Vai trò tổ trưởng và năng lực hướng dẫn nhóm', ['職長', 'コーチング']),
    ('site-management', 24, 68, 'Điều phối nguồn lực, tiến độ, chi phí và chất lượng', ['原価', '工程表']),
    ('safety-leadership', 69, 104, 'Tổ chức phòng ngừa rủi ro và giao tiếp an toàn', ['リスクアセスメント', 'リスク低減']),
    ('drawing-coordination', 105, 115, 'Dùng hồ sơ và bản vẽ để điều phối thi công', ['施工図', '作業手順書']),
    ('industry-context', 116, 125, 'Bối cảnh ngành, nhân lực và trách nhiệm doanh nghiệp', ['建設業法', '担い手']),
]


def audit(pdf_path):
    data = pdf_path.read_bytes()
    doc = fitz.open(pdf_path)
    assert len(doc) == 131, 'Source edition/page count changed; inspect before proceeding'
    cover = ''.join(doc[0].get_text().split())
    assert '2025.1.15' in cover and '2号' in cover
    lessons = [(p, json.loads(p.read_text())) for p in sorted(BASE.glob('shared-session-*.json'))]
    assert len(lessons) == 385
    source_ids = sorted({r['sourceId'] for _, lesson in lessons for r in lesson.get('sourceReferences', [])})
    rows = []
    for key, start, end, label, terms in GROUPS:
        matches = []
        for path, lesson in lessons:
            found = []
            for cluster in lesson.get('clusters', []):
                for paragraph in cluster.get('paragraphs', []):
                    hit = [term for term in terms if term in paragraph.get('ja', '')]
                    if hit:
                        found.append({'clusterId': cluster['id'], 'paragraphId': paragraph['id'], 'matchedTerms': hit})
            if found:
                matches.append({'lessonId': lesson['id'], 'path': str(path.relative_to(ROOT)),
                                'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'paragraphs': found})
        # Check the displayed page number on both endpoints rather than assume offset alone.
        for printed in (start, end):
            assert str(printed) in doc[printed + 5].get_text().split(), ('page label', printed)
        rows.append({'id': 'kensetsu-2go-' + key, 'planningLabelVi': label,
                     'printedPages': [start, end], 'pdfPagesOneBased': [start + 6, end + 6],
                     'candidateSearchTerms': terms, 'candidateLessonCount': len(matches),
                     'candidateLessons': matches, 'status': 'requires_full_source_and_lesson_comparison',
                     'knowledgeCoverageConfirmed': False})
    return {
        'date': '2026-10-17', 'status': 'SOURCE_BYTES_VERIFIED_CANDIDATE_INDEX_ONLY',
        'source': {'id': 'kensetsu-2go-jac-leader-20250115',
                   'url': 'https://jac-skill.or.jp/exam/files/leader.pdf',
                   'printedVersion': '2025.1.15', 'bytes': len(data),
                   'sha256': hashlib.sha256(data).hexdigest(), 'pdfPages': len(doc),
                   'coverAndContentsTextReadPdfPages': [1, 2, 3, 4, 5, 6],
                   'coverAndContentsAiVisuallyCheckedPdfPages': [1, 2, 3, 4, 5, 6],
                   'instructionalBodyFullyReviewed': False, 'privateBinaryArchiveVerified': False,
                   'sourceBinaryCommitted': False},
        'existingCommonLessons': len(lessons), 'existingSourceReferenceIds': source_ids,
        'existingLessonIndexMethod': 'Japanese paragraph exact-keyword navigation; not semantic or completeness assessment',
        'groups': rows, 'newLessonsAuthored': 0, 'appContentChanged': False,
        'knowledgeDenominator': None, 'knowledgeCoveragePercent': None,
        'humanReviewed': False, 'domainReviewed': False, 'rightsReviewed': False, 'releaseReady': False,
        'nextStep': 'Read and visually inspect chapter1 PDF7–29; decompose knowledge and compare candidate lesson paragraphs before new Japanese authorship. Recheck current official law for any legal claim. Keep six existing route/progress identities.'
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('pdf', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    report = audit(args.pdf)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'status': report['status'], 'sourceSha256': report['source']['sha256'],
                      'groups': len(report['groups']), 'existingLessons': report['existingCommonLessons']}, ensure_ascii=False))
