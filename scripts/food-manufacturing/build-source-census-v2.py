#!/usr/bin/env python3
"""Loss-averse PDF object census; never equates geometry with knowledge acceptance.

Only source hashes, coordinates and structural metadata leave the private input
directory. Every extracted object starts pending. The semantic authoring sidecar
is deliberately separate and must be source-read rather than keyword-derived.
"""
from pathlib import Path
import argparse
import hashlib
import gzip
import json
import fitz

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/ssw-workspace/source-coverage-v2'
EXPECTED = {
    'ssw1': ('food-1', 86, 'bb26b5447dc6ffc628ad81966f73151b2d5b088accc830750ba66b5464d286fb'),
    'ssw2': ('food-2', 165, 'a2949e7f8e5282ee163e5015baacc39b0a4aeddf8ffb9b05cb93fb93ea116e57'),
}

def digest_bytes(value):
    return hashlib.sha256(value).hexdigest()

def json_hash(value):
    return digest_bytes(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), default=str).encode())

def rect(value):
    return [round(float(v), 3) for v in value]

def source_census(key, path):
    source_id, count, expected = EXPECTED[key]
    actual = digest_bytes(path.read_bytes())
    assert actual == expected, f'{key}: source bytes differ'
    doc = fitz.open(path)
    assert len(doc) == count, f'{key}: source page count differs'
    pages = []
    for number, page in enumerate(doc, 1):
        elements = []
        def add(kind, bbox, content_hash, **metadata):
            e = {'elementId': f'{source_id}:p{number}:e{len(elements):04d}', 'kind': kind,
                 'bbox': rect(bbox), 'sha256': content_hash, 'classification': 'pending',
                 'knowledgeIds': [], 'reason': None}
            e.update(metadata)
            elements.append(e)
        for block in page.get_text('dict')['blocks']:
            if block['type'] != 0:
                continue  # image placements are separately enumerated below
            lines = block.get('lines', [])
            spans = [span for line in lines for span in line['spans']]
            add('text', block['bbox'], json_hash([[s['text'] for s in line['spans']] for line in lines]),
                extractionBlockNumber=block.get('number'), spanCount=len(spans),
                characterCount=sum(len(s['text']) for s in spans),
                fontSizes=sorted(set(round(s['size'], 3) for s in spans)),
                containsSmallText=any(s['size'] < 9 for s in spans),
                smallTextPreserved=True)
        for info in page.get_image_info(hashes=True, xrefs=True):
            # Digest is a PDF decoder MD5; bind it inside a SHA256 metadata record.
            add('image', info['bbox'], json_hash({k: (v.hex() if isinstance(v, bytes) else v)
                for k, v in info.items()}), width=info['width'], height=info['height'],
                xref=info.get('xref'), appearance='image_placement_not_semantically_reviewed')
        # Individual paths are kept, not silently collapsed into a chart/topic.
        for drawing in page.get_drawings():
            add('vector', drawing['rect'], json_hash(drawing),
                pathItemCount=len(drawing.get('items', [])),
                vectorRole='unclassified_path_not_a_knowledge_unit')
        for link in page.get_links():
            add('unknown', link['from'], json_hash(link),
                objectRole='link_annotation', linkKind=link.get('kind'),
                destinationHash=json_hash({k: v for k, v in link.items() if k != 'from'}))
        annotations = list(page.annots() or [])
        for annotation in annotations:
            add('unknown', annotation.rect, json_hash(annotation.info),
                objectRole='annotation', annotationType=annotation.type[0])
        pages.append({'pdfPage': number, 'width': round(page.rect.width, 3),
                      'height': round(page.rect.height, 3), 'elements': elements,
                      'emptyExtractionRequiresVisualReview': not bool(elements),
                      'tableAndFormulaRecognition': 'pending_semantic_visual_inventory',
                      'pageVisualReviewComplete': False})
    result = {'schemaVersion': 1, 'sector': 'food', 'sourceId': source_id,
              'sourceSha256': actual, 'pdfPages': count,
              'method': 'PyMuPDF text blocks including ruby/small fonts, every image placement, every vector path, links and annotations',
              'limitations': ['Object extraction is not a semantic or visual completeness certificate.',
                             'Tables/formulas/labels are not automatically accepted or discarded.',
                             'Every object starts pending; empty extractions require visual inspection.'],
              'sourceTextRedistributed': False, 'pages': pages}
    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--ssw1', required=True, type=Path)
    parser.add_argument('--ssw2', required=True, type=Path)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    summary = []
    for key in EXPECTED:
        data = source_census(key, getattr(args, key))
        target = OUT / f'food-{key}-regions.json.gz'
        if args.check:
            current = json.loads(gzip.decompress(target.read_bytes()))
            def geometry_only(doc):
                for p in doc['pages']:
                    for e in p['elements']:
                        for field in ['classification', 'knowledgeIds', 'reason']:
                            e.pop(field, None)
                return doc
            assert geometry_only(current) == geometry_only(data), f'census extraction drift: {target}'
        else:
            target.write_bytes(gzip.compress((json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n').encode(), mtime=0))
        summary.append({'sourceId': data['sourceId'], 'pages': len(data['pages']),
                        'elements': sum(len(p['elements']) for p in data['pages'])})
    print(json.dumps({'status': 'PASS_SOURCE_OBJECT_CENSUS_ONLY', 'sources': summary,
                      'semanticInventoryComplete': False, 'wholeSourceKnowledgeCovered': False}))

if __name__ == '__main__':
    main()
