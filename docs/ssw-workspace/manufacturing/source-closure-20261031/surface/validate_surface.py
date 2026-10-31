"""Integrity validation of surface source audit; not domain certification."""
import hashlib
import json
import math
from collections import Counter
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[4]
load = lambda path: json.loads(path.read_text())


def validate():
    pages = load(OUT / 'page-index.json')
    candidates = load(OUT / 'object-candidates.json')['units']
    knowledge = load(OUT / 'knowledge-units.json')['units']
    assert [p['physicalPage'] for p in pages['pages']] == list(range(1, 208))
    by_page = {p['physicalPage']: p for p in pages['pages']}
    all_units = candidates + knowledge
    by_id = {u['id']: u for u in all_units}
    assert len(by_id) == len(all_units), 'Duplicate unit identity'
    counts = Counter()
    for unit in all_units:
        p = by_page[unit['physicalPage']]
        assert unit['sourceSha256'] == pages['source']['sourceSha256']
        assert unit['sourceId'] == pages['source']['sourceId']
        box = unit['bbox']
        assert len(box) == 4 and all(math.isfinite(v) for v in box)
        assert box[0] <= box[2] and box[1] <= box[3]
        assert box[0] >= -2 and box[1] >= -2 and box[2] <= p['pageWidthPt'] + 2 and box[3] <= p['pageHeightPt'] + 2, (unit['id'], box)
        if unit['duplicateOf']:
            assert unit['duplicateOf'] in by_id and unit['duplicateOf'] != unit['id']
        if unit['kind'] != 'bounded_reviewed_knowledge_unit':
            counts[unit['physicalPage']] += 1
            assert unit['semanticReviewed'] is False
        for binding in unit['lessonBindings']:
            data = load(ROOT / binding['file'])
            lesson = next(l for l in data['lessons'] if l['id'] == binding['lessonId'])
            para = next(p for p in lesson['paragraphs'] if p['id'] == binding['paragraphId'])
            assert hashlib.sha256(para['textJa'].encode()).hexdigest() == binding['paragraphTextSha256']
        for binding in unit['assessmentBindings']:
            packs = load(ROOT / binding['file'])['packs']
            pack = next(p for p in packs if p['id'] == binding['packId'])
            q = next(q for q in pack['questions'] if q['id'] == binding['questionId'])
            assert q.get('sourceHash') == binding['sourceHash']
        if unit['kind'] == 'bounded_reviewed_knowledge_unit':
            assert unit['evidence']['sourceRegionIds'], 'Source review without any precise current extraction region'
            assert all(uid in by_id for uid in unit['evidence']['sourceRegionIds'])
            assert unit['wholeSourceObjectClosed'] is False
    for page in pages['pages']:
        assert counts[page['physicalPage']] == len(page['candidateUnitIds']) > 0
        assert all(page[k] for k in ['textExtractionAttempted','tableExtractionAttempted','imageInventoryAttempted','vectorInventoryAttempted','formulaScanAttempted'])
        assert page['wholePageKnowledgeClosed'] is False
    # Both low-text pages must remain classified/inventoried, and have their
    # underlying knowledge separately compared, despite source-expression limits.
    low_text = pages['summary']['lowTextPages']
    assert set(low_text) == {70, 201}
    assert all(any(u['physicalPage'] == p for u in knowledge) for p in low_text)
    assert pages['summary']['wholePagesSemanticallyClosed'] == 0
    report = {'status':'PASS_integrity_not_semantic_closure','pages':207,'candidateRegions':len(candidates),
        'boundedReviewedUnits':len(knowledge),'preciseSourceRegionBindings':len(knowledge),
        'lowTextPagesRetainedAndCompared':low_text,'allPageIdsRangesBboxesForeignKeysAndHashesValid':True,
        'wholeKnowledgeAtomizationCertified':False,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceVerified':False}
    (OUT / 'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False))


if __name__ == '__main__':
    validate()
