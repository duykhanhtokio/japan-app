#!/usr/bin/env python3
"""Byte-backed manufacturing source census: retain ALL text spans, never semantic closure.

PDF text and pixels remain private. Public receipts store geometry, counts and
fingerprints only. Font size, equation heuristics and existing lesson matches do
not authorize deleting a region or declaring an idea taught.
"""
import argparse
import hashlib
import gzip
import json
from collections import Counter
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[2]
DOC = ROOT / 'docs/ssw-workspace/manufacturing'
OUT = ROOT / 'docs/ssw-workspace/source-coverage-v2'
INVENTORIES = [('mechanical', 'mechanical-inventory.json', 169),
               ('electrical', 'electrical-inventory.json', 198),
               ('surface', 'surface-inventory.json', 207)]


def sha(b):
    return hashlib.sha256(b if isinstance(b, bytes) else b.encode()).hexdigest()


def box(r, page):
    return [round(r[0] / page.rect.width, 6), round(r[1] / page.rect.height, 6),
            round(r[2] / page.rect.width, 6), round(r[3] / page.rect.height, 6)]


def build(source_dir):
    old = json.loads((DOC / 'source-closure-20261031/coverage-matrix.json').read_text())
    old_pages = {(p['specialty'], p['physicalPage']): p for p in old['pages']}
    sources, pages = [], []
    for specialty, name, count in INVENTORIES:
        inv = json.loads((DOC / name).read_text())
        path = source_dir / inv['filename']
        assert sha(path.read_bytes()) == inv['sha256'], str(path) + ': source hash mismatch'
        pdf = fitz.open(path)
        assert len(pdf) == count
        source_id = inv['canonicalDocumentId']
        sources.append({'sourceId': source_id, 'specialty': specialty,
                        'sha256': inv['sha256'], 'pageCount': count,
                        'sourceBytesVerified': True, 'edition': '2026-07 second edition',
                        'sourcePdfRedistributed': False})
        for number, page in enumerate(pdf, 1):
            page_id = f'mfg2-{specialty}-p{number:03}'
            text_dict = page.get_text('dict', flags=fitz.TEXTFLAGS_DICT & ~fitz.TEXT_PRESERVE_IMAGES)
            regions, all_spans = [], []
            for bi, block in enumerate(text_dict['blocks']):
                if block['type'] != 0:
                    continue
                lines = block.get('lines', [])
                spans = [s for line in lines for s in line['spans']]
                all_spans.extend(spans)
                text = '\n'.join(''.join(s['text'] for s in line['spans']) for line in lines)
                # Even empty visible text blocks are retained for disposition.
                regions.append({'regionId': f'{page_id}-text-{bi:03}', 'kind': 'text_block',
                    'bbox': box(block['bbox'], page), 'textSha256': sha(text),
                    'characters': len(text), 'lines': len(lines), 'spanCount': len(spans),
                    'smallFontSpansRetained': sum(s['size'] < 10 for s in spans),
                    'fontSizesPt': sorted(set(round(s['size'], 3) for s in spans)),
                    'allSpansFingerprint': sha(json.dumps([
                        [s['text'], round(s['size'], 3), list(s['bbox'])] for s in spans],
                        ensure_ascii=False, separators=(',', ':'))),
                    'status': 'unclassified_source_region', 'sourceTextStored': False})
            for ii, im in enumerate(page.get_image_info(hashes=True, xrefs=True)):
                regions.append({'regionId': f'{page_id}-image-{ii:03}', 'kind': 'image_placement',
                    'bbox': box(im['bbox'], page), 'imageDigest': im.get('digest', b'').hex(),
                    'pixels': [im['width'], im['height']],
                    'contentSha256':sha(pdf.extract_image(im['xref'])['image']) if im.get('xref') else sha(im.get('digest', b'')),
                    'contentHashBasis':'embedded_image_bytes' if im.get('xref') else 'inline_decoded_image_digest',
                    'status': 'unclassified_source_region', 'sourcePixelsStored': False})
            drawings = page.get_drawings()
            if drawings:
                # Individual path boxes are all retained, with no low-area filter.
                regions.append({'regionId': f'{page_id}-vectors', 'kind': 'vector_paths',
                    'pathCount': len(drawings), 'contentSha256':sha(repr(drawings)),
                    'primitiveCount': sum(len(d.get('items', [])) for d in drawings),
                    'pathBoxes': [box(d['rect'], page) for d in drawings],
                    'status': 'unclassified_source_region',
                    'semanticGroupingComplete': False})
            for kind, objects in [('link',page.get_links()),('annotation',list(page.annots() or [])),('widget',list(page.widgets() or []))]:
                for oi, obj in enumerate(objects):
                    rect = obj.get('from',page.rect) if isinstance(obj,dict) else obj.rect
                    regions.append({'regionId':f'{page_id}-{kind}-{oi:03}', 'kind':'unknown',
                        'originalKind':kind,'bbox':box(rect,page),'contentSha256':sha(repr(obj)),
                        'status':'unclassified_source_region'})
            old_page = old_pages[(specialty, number)]
            pages.append({'pageId': page_id, 'sourceId': source_id, 'page': number,
                'printedPage': old_page.get('printedPage'), 'sizePt': [page.rect.width, page.rect.height],
                'textSha256': sha(page.get_text('text')), 'regions': regions,
                'retainedTextSpans': len(all_spans),
                'retainedSmallFontSpans': sum(s['size'] < 10 for s in all_spans),
                'fontSizeBasedExclusions': 0, 'allTextBlocksEnumerated': True,
                'allImagePlacementsEnumerated': True, 'allVectorPathBoxesEnumerated': True,
                'tableAndFormulaSemanticInventoryComplete': False,
                'legacyClassification': old_page['classification'],
                'legacyClassificationIsCurrentAcceptance': False,
                'legacyPageReceipt': old_page['pageReceiptFile'],
                'legacySemanticOccurrenceIds': old_page['boundedUnitOccurrenceIds'],
                'pageVisuallyReviewedInV2': False,
                'allImportantIdeasEnumerated': False, 'allImportantIdeasTaught': False,
                'nextAction': 'Read every region; classify ruby/footnotes/table cells/formulas/labels; create independent knowledge units and exact app evidence. No closure by geometry or font size.'})
    assert len(pages) == 574
    kinds = Counter(r['kind'] for p in pages for r in p['regions'])
    return {'schemaVersion': 2, 'sector': 'manufacturing', 'sources': sources, 'pages': pages,
        'summary': {'pages': len(pages), 'regionsByKind': dict(kinds),
                    'textSpansRetained': sum(p['retainedTextSpans'] for p in pages),
                    'smallFontSpansRetained': sum(p['retainedSmallFontSpans'] for p in pages),
                    'fontSizeBasedExclusions': 0},
        'method': 'PyMuPDF all text blocks/spans without a font-size filter; all image placements and vector path boxes. Receipts contain hashes/geometry, not source prose or pixels.',
        'classificationPolicy': 'All regions begin unresolved. Small text can be ruby, unit, footnote, warning or label; only source reading can classify it. Tables and formulas are knowledge, not layout counts.',
        'knowledgeDenominatorComplete': False, 'coveragePercent': None,
        'wholeSourceKnowledgeClosed': False, 'humanReviewed': False,
        'nativeReviewed': False, 'domainReviewed': False,
        'physicalDeviceTested': False, 'learnerDurationMeasured': False}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-dir', required=True, type=Path)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    result = build(args.source_dir)
    artifacts = []
    for source in result['sources']:
        specialty = source['specialty']
        pages = []
        for page in result['pages']:
            if page['sourceId'] != source['sourceId']:
                continue
            elements = []
            for region in page['regions']:
                metadata = dict(region)
                rid = metadata.pop('regionId')
                old_kind = metadata.pop('kind')
                metadata.pop('status', None)
                digest = metadata.pop('textSha256', None) or metadata.pop('contentSha256',None) or hashlib.sha256(json.dumps(metadata, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
                elements.append({'elementId': rid, 'kind': {'text_block':'text','image_placement':'image','vector_paths':'vector','unknown':'unknown'}[old_kind],
                    'bbox': metadata.pop('bbox', [0,0,1,1]), 'sha256': digest,
                    'classification':'pending', 'knowledgeIds':[], 'reason':None,
                    'bboxCoordinateSystem':'normalized_top_left', **metadata})
            pages.append({'pdfPage':page['page'],'elements':elements,
                'textSha256':page['textSha256'], 'retainedTextSpans':page['retainedTextSpans'],
                'retainedSmallFontSpans':page['retainedSmallFontSpans'], 'fontSizeBasedExclusions':0,
                'allImportantIdeasEnumerated':False,'legacyPageReceipt':page['legacyPageReceipt']})
        disposition_path = OUT / 'manufacturing-region-dispositions.json'
        dispositions = json.loads(disposition_path.read_text())['elements'] if disposition_path.exists() else {}
        for pg in pages:
            for element in pg['elements']:
                if element['elementId'] in dispositions:
                    element.update(dispositions[element['elementId']])
        artifact = {'schemaVersion':1,'sector':'manufacturing','sourceId':source['sourceId'],
            'sourceSha256':source['sha256'],'sourceBytesVerified':True,'pages':pages,
            'method':result['method'],'classificationPolicy':result['classificationPolicy'],
            'knowledgeDenominatorComplete':False,'sourceTextOrPixelsStored':False}
        output = OUT / f'manufacturing-{specialty}-regions.json.gz'
        data = gzip.compress((json.dumps(artifact, ensure_ascii=False, separators=(',', ':'))+'\n').encode(), mtime=0)
        if args.check:
            assert output.read_bytes() == data, str(output)+': census drift'
        else:
            OUT.mkdir(parents=True, exist_ok=True)
            output.write_bytes(data)
        artifacts.append({'path':str(output.relative_to(ROOT)),'bytes':len(data),'sha256':sha(data)})
    receipt = {'schemaVersion':1,'sector':'manufacturing','status':'PASS_CENSUS_NOT_SEMANTIC_ACCEPTANCE',
        **result['summary'],'sources':result['sources'],'artifacts':artifacts,
        'method':result['method'],'knowledgeDenominatorComplete':False,
        'wholeSourceKnowledgeClosed':False,'coveragePercent':None,
        'humanReviewed':False,'domainReviewed':False,'nativeReviewed':False}
    rp = OUT / 'manufacturing-census-validation.json'
    if args.check:
        assert json.loads(rp.read_text()) == receipt, 'Census receipt drift'
    else:
        rp.write_text(json.dumps(receipt, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({'status':'PASS_CENSUS_NOT_SEMANTIC_ACCEPTANCE', **result['summary'], 'artifactBytes':sum(a['bytes'] for a in artifacts)}))


if __name__ == '__main__':
    main()
