"""Inventory every electrical PDF page/object without publishing source prose.

Extraction candidates and semantic coverage are deliberately separate. No block,
table cell, image placement or vector region becomes a certified knowledge atom
merely because PyMuPDF found it or an app source citation points to its page.
"""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path
import re
import fitz

ROOT = Path(__file__).resolve().parents[5]
SOURCE_ID = 'mfg1-electrical-source'
SOURCE_SHA = 'b846a05aa2c33a490e2bb706fe14ad55d587e7fd60718a4e09ab1cd28033bdcf'


def digest(value):
    return hashlib.sha256(value if isinstance(value, bytes) else value.encode()).hexdigest()


def save(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def normalize(text):
    return re.sub(r'\s+', '', text).strip()


def load_app():
    base = ROOT / 'src/data/manufacturing'
    lessons, questions = {}, {}
    paths = [base/'electrical.json', base/'completion37/electrical.json', base/'source-guides.json', base/'mocks/electrical.json', base/'supplement-practice.json', base/'reference-practice.json', base/'boolean-practice.json']
    paths += sorted((base/'recognition38/core').glob('*.json'))

    def visit(value, path):
        if isinstance(value, list):
            for item in value:
                visit(item, path)
        elif isinstance(value, dict):
            if 'id' in value and 'paragraphs' in value and (value.get('specialty') == 'electrical' or any(s.get('documentId') == SOURCE_ID for s in value.get('sources', []))):
                lessons[value['id']] = {**value, '_path': str(path.relative_to(ROOT))}
            if 'id' in value and ('stemJa' in value or 'promptJa' in value) and (str(value['id']).startswith('mfg1-electrical') or any(s.get('documentId') == SOURCE_ID for s in value.get('sources', []))):
                questions[value['id']] = {**value, '_path': str(path.relative_to(ROOT))}
            for key, item in value.items():
                if key not in ('translations', 'locales'):
                    visit(item, path)

    for path in paths:
        if path.exists():
            visit(json.loads(path.read_text()), path)
    return lessons, questions, paths


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--pdf', type=Path, required=True)
    ap.add_argument('--scratch', type=Path, required=True)
    args = ap.parse_args()
    assert digest(args.pdf.read_bytes()) == SOURCE_SHA
    pdf = fitz.open(args.pdf)
    assert len(pdf) == 198
    args.scratch.mkdir(parents=True, exist_ok=True)
    out = Path(__file__).parent
    historical_path = ROOT/'docs/ssw-workspace/manufacturing/batch33-full-review/electrical/page-ledger.json'
    historical = {p['physicalPage']:p for p in json.loads(historical_path.read_text())['pages']}
    matrix_path = ROOT/'docs/ssw-workspace/manufacturing/knowledge-matrix.json'
    matrix = [k for k in json.loads(matrix_path.read_text())['knowledge'] if k['sourceId'] == SOURCE_ID]
    lessons, questions, app_paths = load_app()
    by_page_l, by_page_q = defaultdict(list), defaultdict(list)
    for lid, lesson in lessons.items():
        for s in lesson.get('sources', []):
            if s.get('documentId') == SOURCE_ID:
                by_page_l[s['pdfPage']].append(lid)
    for qid, question in questions.items():
        for s in question.get('sources', []):
            if s.get('documentId') == SOURCE_ID:
                by_page_q[s['pdfPage']].append(qid)
    pages, objects, previous_text, previous_image = [], [], {}, {}
    for physical, page in enumerate(pdf, 1):
        page_text = page.get_text()
        (args.scratch/f'p{physical:03d}.txt').write_text(page_text)
        prior = historical[physical]
        classification = 'cover' if physical == 1 else 'table_of_contents' if physical <= 9 else 'colophon' if physical == 198 else 'body'
        page_id = f'mfg39-electrical-p{physical:03d}'
        units = []
        page_matrix = [k for k in matrix if k['pdfPageStart'] <= physical <= k.get('pdfPageEnd', k['pdfPageStart'])]
        l_candidates = sorted(set(by_page_l[physical]))
        q_candidates = sorted(set(by_page_q[physical]))

        def add(kind, bbox, checksum, *, chars=None, raw=None, index=None, extra=None):
            unit_id = f'{page_id}-u{len(units)+1:03d}'
            metadata = classification != 'body'
            if kind == 'text_block':
                caption = raw or ''
                if re.fullmatch(r'\s*\d{1,3}\s*', caption) and bbox[1] > page.rect.height*.88:
                    kind = 'page_number'
                    metadata = True
                elif len(normalize(caption)) < 4:
                    kind = 'short_text_or_label'
                elif re.search(r'[=＝ΩΩμµ]|\b(?:mA|kV|mm|Hz|kHz|MHz|W|kW|A|V)\b', caption):
                    kind = 'formula_or_unit_text_candidate'
            duplicate = None
            if raw and normalize(raw):
                key = digest(normalize(raw))
                duplicate = previous_text.get(key)
                previous_text.setdefault(key, unit_id)
            elif kind == 'embedded_image_placement':
                duplicate = previous_image.get(checksum)
                previous_image.setdefault(checksum, unit_id)
            context = prior.get('knowledgeFacets', [])
            item = {
                'id': unit_id, 'sourceId': SOURCE_ID, 'sourceSha256': SOURCE_SHA,
                'physicalPage': physical, 'printedPage': physical-9 if 10 <= physical <= 197 else None,
                'kind': kind, 'bbox': [round(float(n), 3) for n in bbox],
                'summaryJa': None,
                'contextFacetsHistorical': context,
                'evidence': {'method':'pymupdf_1.26.6_machine_extraction', 'objectSha256': checksum, 'sourceObjectIndex': index, 'textCharCount': chars, 'newVisualReviewPerformed':False, **(extra or {})},
                'status':'metadata_classified' if metadata else 'extracted_object_candidate_semantic_review_pending',
                'lessonBindings': [], 'termBindings': [], 'assessmentBindings': [],
                'candidateLessonIds':l_candidates if not metadata else [],
                'candidateQuestionIds':q_candidates if not metadata else [],
                'candidateKnowledgeIds':[k['id'] for k in page_matrix] if not metadata else [],
                'exclusionReason': 'Publication/navigation metadata; retained in page inventory, not a technical teaching atom.' if metadata else None,
                'duplicateOf':duplicate,
                'duplicateMeaning':'Exact extracted text/image digest only; repeated occurrence retained and context not assumed equivalent.' if duplicate else None,
                'semanticCoverageConfirmed':False,
            }
            units.append(item)

        dictionary = page.get_text('dict')
        for bi, block in enumerate(dictionary['blocks']):
            if block['type'] != 0:
                continue
            raw = '\n'.join(''.join(s['text'] for s in line['spans']) for line in block['lines'])
            sizes = [s['size'] for l in block['lines'] for s in l['spans']]
            add('text_block', block['bbox'], digest(raw), chars=len(raw), raw=raw, index=bi, extra={'fontSizeRange':[min(sizes),max(sizes)] if sizes else None, 'furiganaInterleavingRisk':True})
        for ii, image in enumerate(page.get_image_info(hashes=True, xrefs=True)):
            checksum = image.get('digest', b'')
            add('embedded_image_placement', image['bbox'], checksum.hex() if isinstance(checksum, bytes) else str(checksum), index=ii, extra={'xref':image.get('xref'), 'pixelWidth':image['width'], 'pixelHeight':image['height'], 'semantics':'Image can contain diagrams/tables/text; requires visual inspection even on low-text pages.'})
        tables = page.find_tables()
        for ti, table in enumerate(tables.tables):
            add('table_candidate', table.bbox, digest(json.dumps(table.extract(), ensure_ascii=False)), index=ti, extra={'rows':table.row_count, 'columns':table.col_count, 'detectionLimitation':'Geometric candidate; may overlap figures or miss borderless/image tables.'})
            for ci, cell in enumerate(table.cells):
                if cell:
                    cell_text=page.get_textbox(cell)
                    add('table_cell_candidate',cell,digest(cell_text),chars=len(cell_text), index=f'{ti}:{ci}',extra={'parentTableIndex':ti,'overlapMeaning':'Structural cell, not an additional independently counted semantic atom.'})
        try:
            clusters = page.cluster_drawings()
        except Exception:
            clusters = []
        for vi, rect in enumerate(clusters):
            # Retain even small/empty-text regions. Outlined glyphs, rules and
            # decorations remain unconfirmed candidates instead of disappearing.
            add('vector_region_candidate', list(rect), digest(json.dumps(list(rect))), index=vi,extra={'detectionLimitation':'May be a circuit, formula, table border, outlined glyph or decoration. Requires visual classification; never counted as a verified figure.'})
        if not units:
            add('page_area_without_extractable_objects',list(page.rect),digest(page.get_pixmap(matrix=fitz.Matrix(.2,.2)).samples),extra={'requiresFullPageVisualReview':True})
        objects.extend(units)
        prior_links = prior.get('candidateDirectLessonLinks', [])
        page_record = {
            'id':page_id,'sourceId':SOURCE_ID,'sourceSha256':SOURCE_SHA,'physicalPage':physical,
            'printedPage':physical-9 if 10 <= physical <= 197 else None,
            'classification':classification,'pageSizePoints':[page.rect.width,page.rect.height],
            'textChars':len(page_text),'lowText':len(normalize(page_text))<120,
            'extractionKinds':dict(Counter(u['kind'] for u in units)),
            'objectIds':[u['id'] for u in units],
            'tableOfContentsIds':[k['id'] for k in page_matrix],
            'candidateLessonIds':l_candidates,'candidateQuestionIds':q_candidates,
            'historicalReview':{'path':str(historical_path.relative_to(ROOT)), 'textConceptReview':prior.get('semanticReviewStatus'),'detailViewed':prior.get('detailPanelViewed',False) or prior.get('highResolutionDetailViewed',False), 'knowledgeFacets':prior.get('knowledgeFacets',[]), 'findings':prior.get('findings',[]),'candidateDirectLessonLinks':prior_links},
            'newVisualReviewPerformed':False,'wholePageSemanticallyClosed':False,
            'unusedDisposition':'metadata_retained_not_assessed' if classification!='body' else 'no_direct_runtime_page_citation_requires_review' if not l_candidates else 'runtime_page_citations_found_atom_level_mapping_pending',
            'requiredAction': 'Maintain document/navigation evidence; confirm no hidden technical illustration.' if classification!='body' else 'Review every text/table/formula/image/vector candidate; bind claim to exact teaching paragraph and relevant assessment, or record bounded exclusion.',
        }
        pages.append(page_record)
    save(out/'page-index.json',{'schemaVersion':1,'specialty':'electrical','sourceId':SOURCE_ID,'sourceSha256':SOURCE_SHA,'physicalPages':198,'sourceBytesVerified':True,'pages':pages})
    compact = [{'id':u['id'],'physicalPage':u['physicalPage'],'kind':u['kind'],'bbox':u['bbox'],'sha256':u['evidence']['objectSha256'],'index':u['evidence']['sourceObjectIndex'],'chars':u['evidence']['textCharCount'],'duplicateOf':u['duplicateOf'],**({'rows':u['evidence']['rows'],'columns':u['evidence']['columns']} if 'rows' in u['evidence'] else {}),**({'parentTableIndex':u['evidence']['parentTableIndex']} if 'parentTableIndex' in u['evidence'] else {})} for u in objects]
    (out/'objects.json').write_text(json.dumps({'schemaVersion':1,'specialty':'electrical','sourceId':SOURCE_ID,'sourceSha256':SOURCE_SHA,'method':'all_page_machine_object_occurrences_not_semantic_atom_certification','sourceProseOrImagesRedistributed':False,'allObjectsStatus':'extracted_candidate_unreviewed','bindingLookup':'page-index.json by physicalPage; page citations are candidates, not atom proof','objects':compact},ensure_ascii=False,separators=(',',':'))+'\n')
    summary = {'schemaVersion':1,'sourceId':SOURCE_ID,'sourceSha256':SOURCE_SHA,'physicalPages':len(pages),'pageClassification':dict(Counter(p['classification'] for p in pages)),'extractedObjectCandidates':len(objects),'objectKinds':dict(Counter(u['kind'] for u in objects)),'exactDuplicateObjectOccurrences':sum(u['duplicateOf'] is not None for u in objects),'lowTextPhysicalPages':[p['physicalPage'] for p in pages if p['lowText']],'bodyPagesWithoutDirectLessonCitations':[p['physicalPage'] for p in pages if p['classification']=='body' and not p['candidateLessonIds']],'bodyPagesWithoutDirectQuestionCitations':[p['physicalPage'] for p in pages if p['classification']=='body' and not p['candidateQuestionIds']],'currentCanonicalLessonsIndexed':len(lessons),'currentQuestionsIndexed':len(questions),'fullAtomicKnowledgeCoverageConfirmed':False,'professionalExpertSignoff':False,'nativeReviewed':False,'physicalDeviceVerified':False,'releaseReady':False,'provenanceInputs':{str(p.relative_to(ROOT)):digest(p.read_bytes()) for p in [historical_path,matrix_path]+app_paths if p.exists()}}
    save(out/'summary.json',summary)
    print(json.dumps({k:v for k,v in summary.items() if k!='provenanceInputs'}, ensure_ascii=False))


if __name__ == '__main__':
    main()
