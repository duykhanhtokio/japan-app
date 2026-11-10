"""Rebuild surface-source audit metadata from exact private PDF bytes.

Original text/table cells and page renders stay outside the repository. Region
counts are extraction candidates, never a claim of exhaustive semantic coverage.
"""
import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
DOCS = ROOT / 'docs/ssw-workspace/manufacturing'
SOURCE_HASH = '08d7e9d6ae5fc5a442af227bbc690ed54cde06681ee8806eb7aadf87748b2eae'
SOURCE_ID = 'mfg1-surface-source'


def sha(value):
    return hashlib.sha256(value).hexdigest()


def load(path):
    return json.loads(path.read_text())


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def compact_rect(rect):
    return [round(float(v), 2) for v in rect]


def build(pdf_path, private):
    assert sha(pdf_path.read_bytes()) == SOURCE_HASH, 'Wrong source revision'
    doc = fitz.open(pdf_path)
    assert len(doc) == 207
    private.mkdir(parents=True, exist_ok=True)
    inventory = load(DOCS / 'page-object-inventory.json')
    old_pages = {x['pdfPage']: x for x in inventory['pages'] if x['specialty'] == 'surface'}
    prior = load(DOCS / 'batch33-full-review/surface/page-ledger.json')
    prior_pages = {x['physicalPage']: x for x in prior['pages']}
    matrix = [x for x in load(DOCS / 'knowledge-matrix.json')['knowledge'] if x['sourceId'] == SOURCE_ID]
    lessons = []
    for path in [ROOT / 'src/data/manufacturing/surface.json', ROOT / 'src/data/manufacturing/completion37/surface.json']:
        lessons += [{**x, '_file': str(path.relative_to(ROOT))} for x in load(path)['lessons']]
    lessons += [{**x, '_file': 'src/data/manufacturing/source-guides.json'} for x in load(ROOT / 'src/data/manufacturing/source-guides.json')['guides'] if x['specialty'] == 'surface']
    questions = []
    for path in [ROOT / 'src/data/manufacturing/surface.json', ROOT / 'src/data/manufacturing/completion37/surface.json']:
        for check in load(path)['checks']:
            questions += [{**x, '_file': str(path.relative_to(ROOT)), '_checkId': check['id']} for x in check['questions']]
    mock = load(ROOT / 'src/data/manufacturing/mocks/surface.json')
    # Keep this independent of the mock-bank container name.
    def walk(value, pointer=''):
        if isinstance(value, dict):
            if 'stemJa' in value and 'id' in value:
                questions.append({**value, '_file': 'src/data/manufacturing/mocks/surface.json', '_pointer': pointer})
            else:
                for k, v in value.items():
                    walk(v, pointer + '/' + str(k))
        elif isinstance(value, list):
            for i, v in enumerate(value):
                walk(v, pointer + '/' + str(i))
    walk(mock)
    candidate_units, pages, private_pages = [], [], []
    text_signatures = {}
    for physical, page in enumerate(doc, 1):
        old = old_pages[physical]
        history = prior_pages[physical]
        current_matrix = [x for x in matrix if x['pdfPageStart'] <= physical <= x.get('pdfPageEnd', x['pdfPageStart'])]
        if not current_matrix:
            starts = [x for x in matrix if x['pdfPageStart'] <= physical]
            current_matrix = [max(starts, key=lambda x: x['pdfPageStart'])] if starts else []
        context = [x['id'] for x in current_matrix]
        contexts = list(dict.fromkeys(x.get('title', x.get('titleJa', x['id'])) for x in current_matrix))
        source_lessons = [x for x in lessons if any(s['documentId'] == SOURCE_ID and s['pdfPage'] == physical for s in x.get('sources', []))]
        source_questions = [x for x in questions if any(s.get('documentId') == SOURCE_ID and s.get('pdfPage') == physical for s in x.get('sources', []))]
        raw = page.get_text('dict')
        text = page.get_text('text')
        raw_objects = []
        page_units = []
        def add(kind, bbox, raw_value=None, **kwargs):
            uid = f'mfg39-surface-p{physical:03d}-u{len(page_units)+1:03d}'
            raw_bytes = json.dumps(raw_value, ensure_ascii=False, sort_keys=True).encode() if raw_value is not None else b''
            digest = sha(raw_bytes) if raw_value is not None else None
            duplicate = None
            if kind in ['paragraph_candidate', 'heading_candidate'] and isinstance(raw_value, str):
                normalized = re.sub(r'\s+', '', raw_value)
                # Exact repeated fragments are only duplicate candidates; repeated
                # safety knowledge in distinct context must not be silently dropped.
                if len(normalized) >= 12:
                    sig = sha(normalized.encode())
                    duplicate = text_signatures.get(sig)
                    text_signatures.setdefault(sig, uid)
            unit = {
                'id': uid, 'sourceId': SOURCE_ID, 'sourceSha256': SOURCE_HASH,
                'physicalPage': physical, 'kind': kind, 'bbox': compact_rect(bbox),
                'summaryJa': '／'.join(contexts[:3]) + 'に関連する抽出領域。意味単位と学習範囲の確定は保留。' if contexts else '資料の識別・構成に関する抽出領域。',
                'status': 'extracted_candidate_not_semantically_closed',
                'semanticReviewed': False, 'visualReviewedThisSession': False,
                'evidence': {'method': 'PyMuPDF region extraction from hash-verified private PDF', 'contentSha256': digest, 'sourceTextRepublished': False, **kwargs},
                'knowledgeContextIds': context,
                'lessonBindings': [], 'pageBindingId': f'mfg39-surface-p{physical:03d}',
                'termBindings': [],
                'assessmentBindings': [],
                'exclusionReason': None, 'duplicateOf': duplicate,
                'duplicateStatus': 'exact_normalized_text_candidate_requires_context_review' if duplicate else None,
            }
            page_units.append(unit)
            raw_objects.append({'id': uid, 'kind': kind, 'bbox': compact_rect(bbox), 'value': raw_value})
            return unit
        spans_all = [s for b in raw['blocks'] if b['type'] == 0 for line in b['lines'] for s in line['spans'] if s['text'].strip()]
        main_spans = [s for s in spans_all if s['size'] >= 8]
        small_spans = [s for s in spans_all if s['size'] < 8]
        # Furigana creates many separate blocks in these PDFs. Consolidate main
        # spans by baseline before proposing paragraph regions. Original raw
        # extraction still includes every small span outside the repository.
        baseline_rows = []
        for span in sorted(main_spans, key=lambda s: (s['origin'][1], s['bbox'][0])):
            baseline = span['origin'][1]
            row = next((r for r in baseline_rows[-3:] if abs(r['baseline'] - baseline) <= 2), None)
            if row is None:
                row = {'baseline': baseline, 'spans': []}
                baseline_rows.append(row)
            row['spans'].append(span)
        lines = []
        for row in baseline_rows:
            spans = sorted(row['spans'], key=lambda s: s['bbox'][0])
            box = fitz.Rect(spans[0]['bbox'])
            for span in spans[1:]:
                box |= fitz.Rect(span['bbox'])
            value = ''.join(s['text'] for s in spans).strip()
            lines.append({'text': value, 'bbox': box, 'maxSize': max(s['size'] for s in spans), 'spanCount': len(spans)})
        paragraphs = []
        for line in lines:
            box = line['bbox']
            heading = line['maxSize'] >= 13 and len(line['text']) < 100
            footer = box.y0 > page.rect.height - 45
            kind = 'navigation_footer_candidate' if footer else 'heading_candidate' if heading else 'paragraph_candidate'
            previous = paragraphs[-1] if paragraphs else None
            can_merge = previous and previous['kind'] == kind and kind == 'paragraph_candidate' and 0 <= box.y0 - previous['bbox'].y1 < 13 and abs(box.x0 - previous['lastX']) < 90
            if can_merge:
                previous['bbox'] |= box
                previous['texts'].append(line['text'])
                previous['spanCount'] += line['spanCount']
                previous['lastX'] = box.x0
            else:
                paragraphs.append({'kind': kind, 'bbox': box, 'texts': [line['text']], 'spanCount': line['spanCount'], 'lastX': box.x0})
        for paragraph in paragraphs:
            value = '\n'.join(paragraph['texts'])
            obj = add(paragraph['kind'], paragraph['bbox'], value, spanCount=paragraph['spanCount'], mainTextChars=len(value), geometricMainLineCount=len(paragraph['texts']), readingOrder='machine geometric grouping, not certified paragraph semantics')
            if paragraph['kind'] == 'navigation_footer_candidate':
                obj['exclusionReason'] = 'Page navigation/footer; kept in page inventory, not counted as technical learning objective.'
        table_warnings = []
        try:
            tables = page.find_tables().tables
            for table in tables:
                add('table_candidate', table.bbox, table.extract(), rows=table.row_count, columns=table.col_count,
                    boundaryStatus='geometric detector; borderless/image tables can be missed')
        except Exception as exc:
            tables = []
            table_warnings.append(type(exc).__name__ + ': ' + str(exc))
        image_infos = page.get_image_info(hashes=True, xrefs=True)
        for image in image_infos:
            add('embedded_image_region_candidate', image['bbox'], None, xref=image.get('xref'),
                rasterWidth=image['width'], rasterHeight=image['height'], imageDigest=image.get('digest', b'').hex(),
                interpretationStatus='Includes logos/decorations/photos/diagrams; visual semantic review required')
        drawings = page.get_drawings()
        try:
            clusters = page.cluster_drawings(x_tolerance=4, y_tolerance=4)
        except Exception:
            clusters = [d['rect'] for d in drawings]
        # Small tick marks belong to scale diagrams and are retained as regions,
        # rather than being discarded for having no text or tiny dimensions.
        for rect in clusters:
            add('vector_region_candidate', rect, None, drawingCluster=True,
                interpretationStatus='May include drawing/table/border/tick/symbol; not one verified semantic figure')
        for block in raw['blocks']:
            if block['type'] != 0:
                continue
            for line in block['lines']:
                value = ''.join(s['text'] for s in line['spans'] if s['size'] >= 8).strip()
                if value and re.search(r'[=＝→⇄±×÷]|(?:\b(?:pH|HV|Ra|A/dm|g/L|mol/L)\b)|[A-Z][a-z]?\d*[⁺⁻]', value):
                    add('formula_or_technical_unit_candidate', line['bbox'], value,
                        detectionStatus='heuristic; formulas split across spans/images may be missed')
        count_by_kind = dict(Counter(x['kind'] for x in page_units))
        # The old inventory pageKind is retained, never inferred from text length.
        page_type = old['pageKind']
        pages.append({
            'id': f'mfg39-surface-p{physical:03d}', 'sourceId': SOURCE_ID, 'sourceSha256': SOURCE_HASH,
            'physicalPage': physical, 'printedPage': old['printedPage'], 'classification': page_type,
            'classificationEvidence': 'Existing structural page inventory plus exact current PDF page count/hash',
            'pageWidthPt': round(page.rect.width, 2), 'pageHeightPt': round(page.rect.height, 2),
            'textChars': len(text), 'rawTextBlockCount': sum(b['type']==0 for b in raw['blocks']), 'mainSpanCount': len(main_spans), 'rubySmallSpanCount': len(small_spans), 'lowText': len(text.strip()) < 300,
            'textExtractionAttempted': True, 'tableExtractionAttempted': True,
            'imageInventoryAttempted': True, 'vectorInventoryAttempted': True, 'formulaScanAttempted': True,
            'candidateUnitIds': [x['id'] for x in page_units], 'candidateCounts': count_by_kind,
            'sourceTextSha256': sha(text.encode()), 'sourceStructureSha256': sha(json.dumps(raw, ensure_ascii=False, sort_keys=True, default=str).encode()),
            'priorAiPageReview': {'textRead': history['textRead'], 'visualDetailRead': history.get('visualDetailedRead', False),
                'status': history['status'], 'evidenceFile': 'docs/ssw-workspace/manufacturing/batch33-full-review/surface/page-ledger.json',
                'currentSessionReread': False, 'wholePageKnowledgeCoverageCertified': False},
            'sourceLessonIds': [x['id'] for x in source_lessons], 'sourceQuestionIds': [x['id'] for x in source_questions],
            'wholePageKnowledgeClosed': False, 'exclusionReason': 'Cover/contents/publication metadata retained for provenance, not counted as technical learning knowledge.' if page_type in ['cover','toc','colophon'] else None,
            'warnings': table_warnings + ['Extraction candidates are not proven atomic knowledge; image-only/table-only meaning and source errors require content review.'],
        })
        candidate_units.extend(page_units)
        private_pages.append({'physicalPage': physical, 'text': text, 'objects': raw_objects})
    private_path = private / 'surface-private-extraction.json'
    private_path.write_text(json.dumps({'sourceSha256': SOURCE_HASH, 'pages': private_pages}, ensure_ascii=False))
    source = {'sourceId': SOURCE_ID, 'specialty': 'surface', 'sourceSha256': SOURCE_HASH,
        'filename': '製造 分野 特定技能  1号 評価 試験機械 金属表面処理区分テキスト.pdf',
        'physicalPages': 207, 'pdfByteHashVerified': True, 'sourcePdfStoredInRepository': False,
        'privateExtractionSha256': sha(private_path.read_bytes())}
    write('page-index.json', {'schemaVersion': 1, 'date': '2026-10-31', 'source': source, 'pages': pages,
        'summary': {'classifiedPages': len(pages), 'classificationCounts': dict(Counter(x['classification'] for x in pages)),
            'lowTextPages': [x['physicalPage'] for x in pages if x['lowText']],
            'pagesWithNoTextStillInventoried': [x['physicalPage'] for x in pages if x['textChars'] == 0],
            'machineCandidateRegions': len(candidate_units), 'wholePagesSemanticallyClosed': 0}})
    write('object-candidates.json', {'schemaVersion': 1, 'date': '2026-10-31', 'source': source,
        'method': 'Bounding-box machine candidates. Not a complete semantic object inventory. Raw source text/table cells stay private.',
        'units': candidate_units, 'summary': {'candidateCount': len(candidate_units),
            'byKind': dict(Counter(x['kind'] for x in candidate_units)),
            'candidateDuplicateRegions': sum(bool(x['duplicateOf']) for x in candidate_units),
            'semanticClosureCertified': False}})
    print(json.dumps({'pages': len(pages), 'regions': len(candidate_units), 'kinds': dict(Counter(x['kind'] for x in candidate_units)), 'privateExtraction': str(private_path)}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--pdf', type=Path, required=True)
    parser.add_argument('--private-dir', type=Path, required=True)
    args = parser.parse_args()
    build(args.pdf, args.private_dir)
