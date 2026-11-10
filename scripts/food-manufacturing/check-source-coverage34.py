"""Check source-review evidence integrity; never certify complete knowledge coverage."""
from pathlib import Path
import collections
import hashlib
import json

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
DATA=ROOT/'src/data/food-manufacturing'
read=lambda p:json.loads(p.read_text())
coverage=read(OUT/'source-coverage34.json')
ledger=read(OUT/'ledger.json')
records={r['id']:r for r in ledger['records']}
lessons={}
for p in [DATA/'lessons.1.ja.json',DATA/'lessons.2.ja.json',*sorted((DATA/'authoring-20261029').glob('part*.json'))]:
    lessons.update({l['id']:l for l in read(p)['lessons']})
expected=set(coverage['originalPendingRecordIds'])
assert len(expected)==292 and expected==set(coverage['reviewedRecordDecisions'])
assert coverage['pendingNotSemanticallyReviewedIds']==[]
assert coverage['fullSourceCoverageCertified'] is False
assert coverage['fullAtomicSourceDecompositionComplete'] is False
for rid,decision in coverage['reviewedRecordDecisions'].items():
    assert rid in records and decision['reason']
    assert decision['wholePageCovered'] is False
    assert decision['assessmentCoverageCertified'] is False
    assert all(decision[f] is False for f in ['humanReviewed','nativeReviewed','domainReviewed'])
    for ref in decision['sourceRefs']:
        assert 1<=ref['pdfPage']<=(86 if ref['document']=='ssw1' else 165)
        assert ref['printedPage'] is None or ref['printedPage']>0
    for binding in decision['lessonBindings']:
        lesson=lessons[binding['lessonId']]
        assert binding['lessonSourceHash']==lesson['sourceHash']
        paragraphs={p['id']:p for p in lesson['paragraphs']}
        assert set(binding['paragraphIds'])<=set(paragraphs)
        for evidence in binding.get('paragraphEvidence',[]):
            assert evidence['textSha256']==hashlib.sha256(paragraphs[evidence['paragraphId']]['textJa'].encode()).hexdigest()
sections=read(OUT/'source-teaching34.json')['sections']+read(OUT/'source-teaching34-tail.json')['sections']
assert len(sections)==len({s['id'] for s in sections})==36
for section in sections:
    assert section['lessonSourceHash']==lessons[section['lessonId']]['sourceHash']
    assert section['titleJa'].strip() and section['textJa'].strip() and section['checkPromptJa'].strip()
    assert section['sourceRefs'] and section['learningOutcomesJa']
    assert set(section['historicalRecordIds'])<=set(records)
    assert all(section[f] is False for f in ['humanReviewed','nativeReviewed','domainReviewed'])
atomic=coverage['historicalPageSummaryAtomicBreakdown']
assert atomic['pages']==41 and len(atomic['atomicRows'])==112
assert atomic['parentChildCountsMustNotBeAddedAsCoveragePercentage'] is True
assert len({a['id'] for a in atomic['atomicRows']})==112
assert {a['sourceRefs'][0]['pdfPage'] for a in atomic['atomicRows']}==set(range(84,125))
report={'status':'PASS_EVIDENCE_INTEGRITY_ONLY','reviewedOriginalPendingRecords':292,'decisionStatuses':dict(collections.Counter(d['status'] for d in coverage['reviewedRecordDecisions'].values())),'proposedTeachingSections':36,'decomposedHistoricalPageSummaries':41,'scopedAtomicRows':112,'lateAdditionalAtomicGaps':4,'fullSourceCoverageCertified':False,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False}
(OUT/'source-coverage34-validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
