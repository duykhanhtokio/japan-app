"""Screen active Japanese paragraphs against private PDFs without publishing source text.

Exact spans are editorial candidates, never copyright or semantic-coverage approval.
"""
import argparse
import hashlib
import json
import unicodedata
from collections import defaultdict
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/ssw-workspace/kensetsu'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def normalize(text):
    return ''.join(c for c in unicodedata.normalize('NFKC', text) if c.isalnum())


def screen(paths, threshold=22):
    manifest = json.loads((DOCS / 'knowledge-reaudit-source-manifest.json').read_text())['sources']
    manifest += json.loads((DOCS / 'SOURCE_KD_INTAKE_2026-10-17.json').read_text())['sources']
    assert len(manifest) == len(paths) == 13
    index = defaultdict(list)
    pages = []
    source_records = []
    for source in manifest:
        file = Path(paths[source['sourceId']])
        assert digest(file.read_bytes()) == source['sha256'], file
        pdf = fitz.open(file)
        assert len(pdf) == source['pages']
        for number, page in enumerate(pdf, 1):
            # Tiny ruby annotations interrupt normal Japanese extraction order.
            # Keep body/table spans >=7pt. Image-only labels remain outside this screen.
            main = ''.join(span['text'] for block in page.get_text('dict')['blocks']
                           if 'lines' in block for line in block['lines']
                           for span in line['spans'] if span['size'] >= 7)
            text = normalize(main)
            pi = len(pages)
            pages.append((source['sourceId'], number, text))
            for offset in range(len(text) - threshold + 1):
                index[text[offset:offset + threshold]].append((pi, offset))
        source_records.append({'sourceId': source['sourceId'], 'sha256': source['sha256'],
                               'pages': len(pdf), 'sourceBytesVerified': True})
    policy = json.loads((ROOT / 'src/data/kensetsu/reuse-policy.json').read_text())
    lessons = [(p, None) for p in sorted(DOCS.glob('shared-session-*.json'))]
    for view in policy['deltaViews']:
        field = 'building' if '-building-' in view['sessionId'] else 'civil'
        number = view['sessionId'].split('-')[-1]
        lessons.append((DOCS / field / 'practical' / f'session-{number}.json',
                        set(view['activeParagraphIds'])))
    matches = []
    private = []
    paragraphs = 0
    lesson_hashes = {}
    for file, active in lessons:
        lesson = json.loads(file.read_text())
        lesson_hashes[str(file.relative_to(ROOT))] = digest(file.read_bytes())
        for cluster in lesson['clusters']:
            for paragraph in cluster['paragraphs']:
                if active is not None and paragraph['id'] not in active:
                    continue
                paragraphs += 1
                target = normalize(paragraph['ja'])
                covered = {}
                for offset in range(len(target) - threshold + 1):
                    for pi, si in index.get(target[offset:offset + threshold], []):
                        if offset < covered.get((pi, si - offset), 0):
                            continue
                        text = pages[pi][2]
                        length = threshold
                        while (offset + length < len(target) and si + length < len(text)
                               and target[offset + length] == text[si + length]):
                            length += 1
                        covered[(pi, si - offset)] = offset + length
                        span = target[offset:offset + length]
                        row = {'lessonId': lesson['id'], 'paragraphId': paragraph['id'],
                               'paragraphSha256': digest(paragraph['ja'].encode()),
                               'sourceId': pages[pi][0], 'pdfPage': pages[pi][1],
                               'normalizedCharacters': length, 'targetOffset': offset,
                               'sourceOffset': si, 'matchingSpanSha256': digest(span.encode()),
                               'decision': 'requires_editorial_context_review'}
                        matches.append(row)
                        private.append(dict(row, matchingText=span, targetText=paragraph['ja']))
    report = {'date': '2026-10-17', 'status': 'EXACT_EXPRESSION_SCREEN_NOT_RIGHTS_APPROVAL',
              'thresholdNormalizedCharacters': threshold, 'minimumSourceFontPoints': 7,
              'sourcePdfs': source_records, 'sourcePages': len(pages),
              'activeLessonRecords': len(lessons), 'activeJapaneseParagraphs': paragraphs,
              'activeLessonFileSha256': lesson_hashes, 'exactSpanCandidates': len(matches),
              'paragraphsWithCandidates': len({r['paragraphId'] for r in matches}),
              'candidates': matches, 'rawSourceTextOrImagesIncluded': False,
              'scope': 'Active paragraph text only; headings, terms, translations, questions, images and audio are outside this screen.',
              'limits': ['Font-based ruby filtering can omit small body/figure labels.',
                         'Exact character overlap is not a semantic copying or legal assessment.',
                         'No numeric threshold establishes rights clearance.',
                         'Common technical/legal phrases require contextual classification.'],
              'humanReviewed': False, 'rightsReviewed': False,
              'wholeSourceCoverageConfirmed': False, 'releaseReady': False}
    return report, private


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-paths', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--private-candidates', type=Path, required=True)
    args = parser.parse_args()
    report, private = screen(json.loads(args.source_paths.read_text()))
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    args.private_candidates.write_text(json.dumps(private, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: report[k] for k in ['sourcePages', 'activeLessonRecords',
                     'activeJapaneseParagraphs', 'exactSpanCandidates', 'paragraphsWithCandidates']}))
