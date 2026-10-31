"""Reconcile source/visual review proposals with exact integrated runtime evidence.

Historical before states and reviewer packets remain intact. A scoped after state
never certifies all other knowledge on its source page.
"""
from pathlib import Path
import copy
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / 'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
DATA = ROOT / 'src/data/food-manufacturing'
read = lambda p: json.loads(p.read_text())


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')


def main():
    decisions = read(AUDIT / 'decisions.json')
    source = read(AUDIT / 'source-coverage34.json')
    runtime = {s['id']:s for s in read(DATA / 'source-closure34.json')['sections']}
    checks = {c['id']:c for c in read(DATA / 'source-assessment34.json')['checks']}
    assert len(runtime)==36 and len(checks)==20
    figures = {f['id']:f for p in sorted(AUDIT.glob('figures*.json'))
               if re.fullmatch(r'figures\d+\.json',p.name) for f in read(p)['figures']}
    integration = []
    for rid, original in source['reviewedRecordDecisions'].items():
        current = copy.deepcopy(original)
        ids = current.get('proposedClosureSectionIds', [])
        if ids:
            assert all(sid in runtime for sid in ids), rid
            current['sourceReviewBeforeRuntimeIntegration34'] = copy.deepcopy(original)
            current['status'] = 'scoped_teaching_additions_integrated_ai_checked'
            current['supplementIds'] = ids
            current['supplementEvidence'] = [{k:runtime[sid][k] for k in
                ['id','sourceHash','lessonId','lessonSourceHash','sourceRefs']} for sid in ids]
            current['runtimeSupplementPending'] = False
            current['remaining'] = ['Unlisted atomic outcomes and human/native/domain acceptance are not certified by this scoped decision.']
            current['reason'] += ' The named independently authored additions, exercises, twelve translations and offline readings are now in the actual Reader, with revision-bound evidence.'
            integration.append({'recordId':rid,'supplementIds':ids})
        decisions[rid] = current
    for name in ['visual-closure34.json','visual-closure35.json','visual-closure36.json']:
        for proposal in read(AUDIT / name)['decisions']:
            rid = proposal['recordId']
            visual = proposal['after']
            assert all(fid in figures for fid in visual.get('figureIds',[]))
            current = copy.deepcopy(decisions.get(rid, visual))
            current.setdefault('visualDecisions34',[]).append({'provenance':name,**visual})
            current['figureIds'] = sorted(set(current.get('figureIds',[])+visual.get('figureIds',[])))
            for binding in visual.get('lessonBindings',[]):
                if binding not in current.setdefault('lessonBindings',[]):
                    current['lessonBindings'].append(binding)
            section_ids = visual.get('supplementSectionIds',[])
            assert all(sid in runtime for sid in section_ids)
            current['supplementIds'] = sorted(set(current.get('supplementIds',[])+section_ids))
            current['status'] = 'scoped_teaching_and_visual_evidence_integrated'
            current['reason'] += ' Named visual outcomes also have original figures, exact source/lesson bindings, image review and Reader checks.'
            decisions[rid] = current
    for classification in read(AUDIT / 'video-reference34.json')['recordClassifications']:
        rid = classification['recordId']
        current = decisions[rid]
        current['status'] = classification['classification']
        current['videoReferenceAudit34'] = classification
        current['reason'] = classification['reason']
        current['remaining'] = ['External audiovisual content has not been watched/reviewed; these QR-navigation pages are not standalone prose lessons.']
    # The three late sections address four newly separated outcomes of older parent records.
    for sid, section in runtime.items():
        raw = next(s for packet in ['source-teaching34.json','source-teaching34-tail.json']
                   for s in read(AUDIT / packet)['sections'] if s['id']==sid)
        for rid in raw.get('historicalRecordIds',[]):
            assert rid in decisions, rid
            current = decisions[rid]
            current['supplementIds'] = sorted(set(current.get('supplementIds',[])+[sid]))
            if sid.startswith('food34-tail-'):
                current.setdefault('lateAtomicTeachingEvidence34',[]).append({
                    'id':sid,'sourceHash':section['sourceHash'],'lessonId':section['lessonId'],
                    'lessonSourceHash':section['lessonSourceHash'],'sourceRefs':section['sourceRefs']})
    assessment = read(AUDIT / 'assessment-link34.json')
    assessment_after = []
    for unit in assessment['units']:
        revised = copy.deepcopy(unit)
        for outcome in revised['outcomes']:
            for binding in outcome['assessmentBindings']:
                if binding['type'] == 'new_open_response':
                    c = checks[binding['checkId']]
                    binding['runtimeIntegrated'] = True
                    binding['sourceHash'] = c['sourceHash']
                    binding['lessonId'] = c['lessonId']
                    binding['lessonSourceHash'] = c['lessonSourceHash']
                    outcome['closureStatus'] = 'source_bound_self_check_integrated'
        revised['runtimeNewChecksIntegrated'] = True
        revised['beforeIntegration34'] = {'wholeUnitAssessmentCovered':unit.get('wholeUnitAssessmentCovered')}
        revised['enumeratedOutcomesAssessmentIntegrated'] = all(outcome['assessmentBindings'] for outcome in revised['outcomes'])
        revised['coverageMeaning'] = 'Only the explicitly enumerated outcomes within the declared section span; not every prerequisite or source page.'
        assessment_after.append(revised)
    write(AUDIT / 'assessment-integration34.json', {'units':assessment_after,
          'newRuntimeChecks':len(checks),'newRuntimeExpectedPoints':sum(len(c['expectedPointsJa']) for c in checks.values()),
          'historicalPrimaryTagsPreserved':True,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False})
    write(AUDIT / 'decisions.json', decisions)
    write(AUDIT / 'integration34.json', {'runtimeTeachingSections':len(runtime),
          'runtimeTeachingLocalePairs':len(runtime)*12,'runtimeOpenResponseChecks':len(checks),
          'runtimeAssessmentLocalePairs':len(checks)*12,'integratedReviewedSourceGaps':integration,
          'allOriginal292Reviewed':source['counts']['remainingNotReviewed']==0,
          'lateAtomicGapsHaveNamedTailSections':True,
          'parentChildCountsMustNotBeAddedAsCoveragePercentage':True,
          'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,
          'fullSourceCoverageCertified':False})
    print(json.dumps({'reviewedSourceRecords':len(source['reviewedRecordDecisions']),
                      'sourceGapsIntegrated':len(integration),'runtimeSections':len(runtime),
                      'runtimeChecks':len(checks),'decisions':len(decisions)}))


if __name__ == '__main__':
    main()
