"""Validate inventory completeness and exact current app links, not coverage by fiat."""
import hashlib
import importlib.util
import json
from pathlib import Path

HERE=Path(__file__).parent
spec=importlib.util.spec_from_file_location('electrical39',HERE/'build_inventory.py')
lib=importlib.util.module_from_spec(spec)
spec.loader.exec_module(lib)
lessons,questions,_=lib.load_app()
page_data=json.loads((HERE/'page-index.json').read_text())
objects=json.loads((HERE/'objects.json').read_text())['objects']
units=json.loads((HERE/'knowledge-units.json').read_text())['units']
pages=page_data['pages']
assert page_data['sourceSha256']==lib.SOURCE_SHA
assert len(pages)==198 and [p['physicalPage'] for p in pages]==list(range(1,199))
assert len(objects)==36216
assert len({o['id'] for o in objects})==len(objects)
assert len({u['id'] for u in units})==len(units)==39
assert not {u['id'] for u in units}&{o['id'] for o in objects}
assert sum(len(p['objectIds']) for p in pages)==len(objects)
assert {i for p in pages for i in p['objectIds']}=={o['id'] for o in objects}
assert all(not p['wholePageSemanticallyClosed'] for p in pages)
assert all(p['extractedObjectsSemanticReviewPending']==len(p['objectIds']) for p in pages)
object_ids={o['id'] for o in objects}
assert all(o['duplicateOf'] is None or o['duplicateOf'] in object_ids for o in objects)
for unit in units:
    assert unit['sourceId']==lib.SOURCE_ID and unit['sourceSha256']==lib.SOURCE_SHA
    assert unit['lessonBindings'] and unit['summaryJa']
    for binding in unit['lessonBindings']:
        lesson=lessons[binding['lessonId']]
        paragraph=next(p for p in lesson['paragraphs'] if p['id']==binding['paragraphId'])
        assert lesson['sourceHash']==binding['lessonSourceHash']
        assert lib.digest(paragraph['textJa'])==binding['paragraphSha256']
        if binding.get('effectiveTextOverlay'):
            overlay=json.loads((lib.ROOT/binding['effectiveTextOverlay']).read_text())
            assert lib.digest(overlay['wording']['ja']['after'])==binding['effectiveParagraphSha256']
    for binding in unit['termBindings']:
        term=next(t for t in lessons[binding['lessonId']]['terms'] if t['ja']==binding['termJa'])
        assert lib.digest(json.dumps(term,ensure_ascii=False,sort_keys=True))==binding['termDefinitionSha256']
    for binding in unit['assessmentBindings']:
        assert questions[binding['questionId']]['sourceHash']==binding['sourceHash']
        assert binding['answerAndDistractorCertification'] is False
    assert unit['professionalExpertSignoff'] is False
result={'status':'PASS_inventory_and_current_binding_integrity_only','sourceId':lib.SOURCE_ID,'pages':198,'objectOccurrences':len(objects),'boundedKnowledgeUnits':len(units),'unitSourcePages':len({u['physicalPage'] for u in units}),'wholePageClosureCount':0,'professionalExpertSignoff':False,'nativeReviewed':False,'physicalDeviceVerified':False,'reviewedFilesSha256':{p.name:lib.digest(p.read_bytes()) for p in [HERE/'page-index.json',HERE/'objects.json',HERE/'knowledge-units.json',HERE/'remaining-work.json']}}
lib.save(HERE/'validation.json',result)
print(json.dumps(result,ensure_ascii=False))
