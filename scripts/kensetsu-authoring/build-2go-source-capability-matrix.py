"""Verify all17 received PDFs and index page-to-runtime candidates, never acceptance.

Usage: python scripts/kensetsu-authoring/build-2go-source-capability-matrix.py SOURCE_DIRECTORY LEADER_PDF
Source PDFs and extracted source text remain outside the repository.
"""
import argparse
import hashlib
import json
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'docs/ssw-workspace/kensetsu'


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def main(directory, leader):
    intake = json.loads((BASE / 'SOURCE_INTAKE_2GO_2026-10-17.json').read_text())
    canonical = json.loads((BASE / 'knowledge-reaudit-source-manifest.json').read_text())['sources']
    canonical += json.loads((BASE / 'SOURCE_KD_INTAKE_2026-10-17.json').read_text())['sources']
    by_hash = {s['sha256']: s['sourceId'] for s in canonical}
    by_hash['fa094327913a14047de32ad734b552d6911af281566076ec327e50608c5106f7'] = 'kensetsu-2go-foreman-leader-20250115'
    runtime = json.loads((BASE / 'TWO_GO_RUNTIME_SOURCE_MATRIX_20261102.json').read_text())
    lessons = runtime['lessonEvidence']
    sources = []
    unique = {}
    docs = {}
    for source in intake['sources']:
        file = leader if 'leader' in source['filename'] else directory / source['filename']
        raw = file.read_bytes()
        assert digest(raw) == source['sha256'], source['filename']
        pdf = fitz.open(file)
        assert len(pdf) == source['pages']
        docs[source['filename']] = pdf
        sources.append({**source, 'bytes': len(raw), 'freshBytesAndPageCountVerified': True,
                        'readStatus': 'fresh_byte_verification_only_not_full_semantic_review',
                        'canonicalSourceIdByIdenticalBytes': by_hash.get(source['sha256']),
                        'duplicateOfSha256': source['sha256'] if source['sha256'] in unique else None})
        if source['sha256'] in unique:
            continue
        source_id = by_hash.get(source['sha256'])
        page_rows = []
        for page in pdf:
            number = page.number + 1
            blocks = page.get_text('dict')['blocks']
            text = '\n'.join(''.join(s['text'] for s in l['spans']) for b in blocks if 'lines' in b for l in b['lines'])
            candidate_keys = [key for key, s in lessons.items() if any(r['sourceId'] == source_id and number in r.get('pdfPages', []) for r in s['sourceReferences'])]
            page_rows.append({'pdfPage': number, 'extractedTextSha256': digest(text.encode()),
                              'extractedCharacters': len(text), 'textBlockCount': sum(b['type'] == 0 for b in blocks),
                              'embeddedImageCount': sum(b['type'] == 1 for b in blocks),
                              'vectorDrawingObjects': len(page.get_drawings()),
                              'candidateRuntimeLessonEvidenceKeys': candidate_keys,
                              'allParagraphTableFigureIdeasAccepted': False,
                              'unmappedPageRole': 'requires_source_role_review' if not candidate_keys else None})
        unique[source['sha256']] = {'canonicalSourceId': source_id, 'pages': page_rows}
    # The two different PDF hashes differ on their cover. Compare every extracted
    # main-font body page, without inferring image/layout/annotation equivalence.
    def body_pages(pdf):
        return [''.join(s['text'] for b in page.get_text('dict')['blocks'] if 'lines' in b for l in b['lines'] for s in l['spans'] if s['size'] >= 10) for page in pdf]
    a = body_pages(docs['学科-テキスト-学科テキスト-text1k.pdf'])
    b = body_pages(docs['学科-テキスト-学科テキスト-text1l(1).pdf'])
    equal = [i + 1 for i, (x, y) in enumerate(zip(a, b)) if x == y]
    assert equal == list(range(2, 13))
    for source in sources:
        if source['filename'].endswith('text1k.pdf'):
            source['mainFontTextReuseCandidate'] = {'sourceId': 'kensetsu-src-01', 'pdfPages': equal,
                                                    'minimumFontPoints': 10, 'coverDiffers': True,
                                                    'imageLabelAndLayoutEquivalenceVerified': False,
                                                    'semanticCoverageAccepted': False}
    scopes = []
    for scope in runtime['scopes']:
        evidence = [lessons[k] for k in scope['lessonEvidenceKeys']]
        paragraphs = [p for s in evidence for p in s['paragraphs']]
        scopes.append({k: v for k, v in scope.items() if k != 'lessonEvidenceKeys'} | {
            'paragraphReferenceOccurrences': len(paragraphs),
            'paragraphOccurrencesWithQuestionReference': sum(p['hasIndividualQuestion'] for p in paragraphs),
            'paragraphOccurrencesWithoutQuestionReference': sum(not p['hasIndividualQuestion'] for p in paragraphs),
            'theseCountsAreNotUniqueSourceIdeasOrAssessmentRequirements': True})
    report = {'date': '2026-11-02', 'status': 'ALL17_RECEIVED_PDFS_BYTE_VERIFIED_CAPABILITY_MATRIX_STILL_INCOMPLETE',
              'filesVerified': len(sources), 'nominalPages': sum(s['pages'] for s in sources),
              'uniquePdfHashes': len(unique), 'uniquePdfPages': sum(len(s['pages']) for s in unique.values()),
              'reuseAuthority': intake['reuseDecision'], 'sources': sources, 'uniqueSourcePageIndex': unique,
              'runtimeMatrix': 'TWO_GO_RUNTIME_SOURCE_MATRIX_20261102.json', 'scopeSummary': scopes,
              'twoGoIndependentCompetenceEvidence': {
                  'theoryAndPractical': 'Publisher-authorized matching1go canonical content; runtime identity and distinct learner/test state verified. No independent2go competence inferred from reuse.',
                  'foreman': 'Separate leader131page source;28draftlessons; atomic source denominator, all images and complete competence assessment remain open.',
                  'all17FilesAreIndependentSources': False,
                  'wholeSourceAtomicCoverageVerified': False},
              'missingEvidence': ['Complete atomic source ideas with conditions, exceptions, tables, figures and labels.',
                                  'Per-idea semantic teaching and assessment sufficiency; page candidates do not close ideas.',
                                  'Actual specialist2go competence acceptance; the reused banks are knowledge checks, not official2go exams.',
                                  'Specialist/native/rights review, actual-device testing, audio and measured learning duration.'],
              'sourceTextOrImagesRedistributed': False, 'domainReviewed': False, 'nativeReviewed': False,
              'physicalDeviceTested': False, 'releaseReady': False}
    assert len(sources) == 17 and report['nominalPages'] == 604 and len(unique) == 15 and report['uniquePdfPages'] == 530
    (BASE / 'TWO_GO_SOURCE_CAPABILITY_MATRIX_20261102.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: report[k] for k in ['status', 'filesVerified', 'nominalPages', 'uniquePdfHashes', 'uniquePdfPages']}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('directory', type=Path)
    parser.add_argument('leader', type=Path)
    args = parser.parse_args()
    main(args.directory, args.leader)
