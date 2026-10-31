"""Validate the frozen-PDF link inventory and explicitly scoped HTTP observations."""
from pathlib import Path
import collections
import json
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
p=OUT/'video-reference34.json'
d=json.loads(p.read_text())
rows=d['references']
assert len(rows)==len({r['embeddedUrl'] for r in rows})==88
assert collections.Counter(r['sourceRefs'][0]['pdfPage'] for r in rows)=={71:24,72:24,73:20,74:20}
assert len({r['language'] for r in rows})==11 and len({r['topicId'] for r in rows})==8
assert len({(r['language'],r['topicId']) for r in rows})==88
assert d['sourceFunctionClassification']=='reference_video_navigation_catalogue'
assert d['runtimeExternalLinksAdded'] is False and d['fullSourceCoverageCertified'] is False
for row in rows:
    assert row['recordId']==f"ssw1-p{row['sourceRefs'][0]['pdfPage']:03d}-video-catalogue"
    assert row['videoContentReviewed'] is False and row['humanReviewed'] is False
    assert row['mediaAvailabilityProbe']['playbackWatched'] is False
    assert row['topicLevelLessonBindings'] and row['bindingScope']
    assert urlparse(row['embeddedUrl']).netloc=='otaff.or.jp'
    assert urlparse(row['currentOfficialUrl']).netloc=='otaff.or.jp'
    for binding in row['topicLevelLessonBindings']:
        assert binding['lessonSourceHash'] and binding['paragraphIds']
    if row['currentEndpointObservation'].get('videoMediaUrl'):
        assert urlparse(row['currentEndpointObservation']['videoMediaUrl']).netloc=='otaff.or.jp'
report={'status':'PASS_REFERENCE_INVENTORY_NOT_VIDEO_CONTENT_CERTIFICATION','references':88,'sourcePageCounts':dict(collections.Counter(r['sourceRefs'][0]['pdfPage'] for r in rows)),'exactOldUrlsRecorded':88,'currentCatalogueCandidatesRecorded':88,'fullVideoContentReviews':0,'networkObservationSummary':d['summary'],'runtimeExternalLinksAdded':False}
(OUT/'video-reference34-validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
