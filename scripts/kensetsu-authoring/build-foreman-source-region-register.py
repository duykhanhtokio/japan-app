"""Index every PDF region without redistributing source text or certifying coverage.

Usage: python scripts/kensetsu-authoring/build-foreman-source-region-register.py private/leader.pdf
The pinned PDF remains outside Git. Page references locate candidate lessons only.
"""
import argparse
import hashlib
import json
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'docs/ssw-workspace/kensetsu/foreman'
EXPECTED = 'fa094327913a14047de32ad734b552d6911af281566076ec327e50608c5106f7'


def build(source):
    raw = source.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == EXPECTED, 'Wrong source edition'
    doc = fitz.open(source)
    assert len(doc) == 131
    lessons = [json.loads(p.read_text()) for p in sorted(BASE.glob('session-*.json'))]
    pages = []
    for page in doc:
        number = page.number + 1
        regions = []
        blocks = page.get_text('dict')['blocks']
        text_groups = []
        for block in sorted((b for b in blocks if b['type'] == 0), key=lambda b: (b['bbox'][1], b['bbox'][0])):
            if text_groups and block['bbox'][1] <= text_groups[-1]['bbox'][3] + 9:
                group = text_groups[-1]
                group['blocks'].append(block)
                group['bbox'] = [min(group['bbox'][0], block['bbox'][0]), min(group['bbox'][1], block['bbox'][1]),
                                 max(group['bbox'][2], block['bbox'][2]), max(group['bbox'][3], block['bbox'][3])]
            else:
                text_groups.append({'type': 0, 'bbox': list(block['bbox']), 'blocks': [block]})
        for i, block in enumerate(text_groups + [b for b in blocks if b['type'] != 0]):
            box = [round(v, 2) for v in block['bbox']]
            region_id = f'foreman-leader-p{number:03}-b{i:03}'
            if block['type'] == 0:
                text = '\n'.join(''.join(s['text'] for s in line['spans']) for original in block['blocks'] for line in original['lines'])
                if not text.strip():
                    continue
                regions.append({'id': region_id, 'kind': 'text_with_possible_ruby_or_figure_labels',
                                'bbox': box, 'sha256': hashlib.sha256(text.encode()).hexdigest(),
                                'characters': len(text), 'originalBlockCount': len(block['blocks']),
                                'semanticDisposition': 'unreviewed'})
            else:
                regions.append({'id': region_id, 'kind': 'embedded_image', 'bbox': box,
                                'sha256': hashlib.sha256(block.get('image', b'')).hexdigest(),
                                'semanticDisposition': 'unreviewed'})
        drawings = page.get_drawings()
        candidates = [s['id'] for s in lessons if any(number in r.get('pdfPages', []) for r in s.get('sourceReferences', []))]
        pages.append({'pdfPage': number, 'pageRole': 'front_matter_requires_classification' if number <= 6 else 'instructional_body',
                      'regions': regions, 'vectorDrawingObjects': len(drawings),
                      'vectorContentDisposition': 'requires_grouping_and_semantic_review' if drawings else 'none_detected',
                      'candidateLessonIdsFromExistingPageReferences': candidates,
                      'candidateLinksAreSemanticCoverage': False, 'allIdeasAccepted': False})
    result = {'schemaVersion': 1, 'date': '2026-11-02', 'sourceId': 'kensetsu-2go-foreman-leader-20250115',
              'sourceSha256': EXPECTED, 'pdfPages': 131,
              'status': 'COMPLETE_MECHANICAL_REGION_INDEX_NOT_ATOMIC_KNOWLEDGE_ACCEPTANCE',
              'sourceTextOrImagesIncluded': False, 'wholeSourceCoverageConfirmed': False,
              'knowledgeDenominator': None,
              'methodLimits': ['Text blocks are merged by vertical overlap or a gap of at most9PDFpoints; regions are not knowledge atoms.',
                               'Ruby, headers, footers, labels and body are intentionally retained for later classification.',
                               'Vector drawings are counted per page, not interpreted as complete figures.',
                               'Existing lesson page references are navigation candidates, never proof of teaching.',
                               'No source-derived words, raster bytes or drawings are copied into this register.'],
              'pages': pages}
    ids = [r['id'] for p in pages for r in p['regions']]
    assert len(ids) == len(set(ids))
    assert [p['pdfPage'] for p in pages] == list(range(1, 132))
    out = BASE / 'source-region-register-20261102.json'
    out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pagesIndexed': len(pages), 'regionsIndexed': len(ids),
                      'pagesWithEmbeddedImages': sum(any(r['kind'] == 'embedded_image' for r in p['regions']) for p in pages),
                      'pagesWithVectorObjects': sum(bool(p['vectorDrawingObjects']) for p in pages),
                      'semanticCoverageAccepted': False}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    build(parser.parse_args().source)
