"""Attach verified current teaching/assessment/figure evidence to one source ledger."""
from pathlib import Path
import collections
import copy
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / 'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
DATA = ROOT / 'src/data/food-manufacturing'
read = lambda p: json.loads(p.read_text())
digest = lambda v: hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',', ':')).encode()).hexdigest()
text_digest = lambda v: hashlib.sha256(v.encode()).hexdigest()


def write(path, value):
    path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')


def main():
    for report in ['browser35-assessment-validation.json','browser35-accessibility-delta.json','browser37-validation.json','browser37-signs-validation.json']:
        assert read(AUDIT/report)['status']=='PASS', report
    aria = read(AUDIT/'browser35-accessibility-delta.json')
    component = ROOT/'src/components/food-manufacturing/FoodSourceAssessmentChecks.tsx'
    assert aria['componentSha256']==hashlib.sha256(component.read_bytes()).hexdigest()
    packs = [read(DATA/'lessons.1.ja.json'),read(DATA/'lessons.2.ja.json'),read(DATA/'exams.ja.json')]
    packs += [read(p) for p in sorted((DATA/'authoring-20261029').glob('part*.json'))]
    lessons = {l['id']:l for p in packs for l in p.get('lessons',[])}
    questions = {q['id']:q for p in packs for e in p.get('exams',[]) for q in e['questions']}
    checks = {c['id']:c for batch in [34,35] for c in read(DATA/f'source-assessment{batch}.json')['checks']}
    sections = {s['id']:s for batch in [31,34] for s in read(DATA/f'source-closure{batch}.json')['sections']}
    authoring_sections = {s['id']:s for name in ['source-teaching34.json','source-teaching34-tail.json'] for s in read(AUDIT/name)['sections']}
    assert len(questions)==848 and len(checks)==41 and len(sections)==40
    figures = {f['id']:f for path in AUDIT.glob('figures*.json')
               if re.fullmatch(r'figures\d+\.json',path.name) for f in read(path)['figures']}
    decisions = read(AUDIT/'decisions.json')
    for proposal in read(AUDIT/'closure31-review35.json')['decisions']:
        rid = proposal['recordId']
        current = copy.deepcopy(decisions[rid])
        if 'beforeFinal35' not in current:
            current['beforeFinal35'] = copy.deepcopy(current)
        current['scopedReview35'] = proposal
        current['status'] = 'scoped_teaching_assessment_and_visual_rechecked'
        current['reason'] = proposal['reason']
        current['sourceRefs'] = proposal['sourceRefs']
        current['lessonBindings'] = proposal['lessonBindings']
        for b in current['lessonBindings']:
            assert lessons[b['lessonId']]['sourceHash']==b['lessonSourceHash']
        for fid in proposal.get('figureIds',[]):assert fid in figures
        current['figureIds'] = sorted(set(current.get('figureIds',[])+proposal.get('figureIds',[])))
        evidence = copy.deepcopy(proposal['assessmentEvidence'])
        if 'id' in evidence:
            check = checks[evidence['id']]
            assert text_digest(check['promptJa'])==evidence['promptSha256']
            evidence.update(runtimeIntegrated=True,sourceHash=check['sourceHash'])
            current['assessmentCheckIds'] = sorted(set(current.get('assessmentCheckIds',[])+[check['id']]))
        elif evidence.get('type')=='canonical_activity':
            assert any(text_digest(l['activityJa'])==evidence['activitySha256'] for l in lessons.values())
        current['assessmentEvidence'] = evidence
        current['remaining'] = []
        current['wholePageCovered'] = False
        decisions[rid] = current
    for proposal in read(AUDIT/'visual-closure37.json')['decisions']:
        rid = proposal['recordId']
        visual = proposal['after']
        current = decisions[rid]
        if visual not in current.setdefault('visualDecisions35',[]):
            current['visualDecisions35'].append(visual)
        current['figureIds'] = sorted(set(current.get('figureIds',[])+visual.get('figureIds',[])))
    write(AUDIT/'decisions.json',decisions)
    subprocess.run(['python3',str(ROOT/'scripts/food-manufacturing/build-unified-source-ledger.py')],cwd=ROOT,check=True)
    ledger = read(AUDIT/'ledger.json')
    atomic = []
    for filename,key in [('atomic-evidence34.json','atomicRows'),('atomic-evidence34-previous.json','atomicRecords')]:
        for original in read(AUDIT/filename)[key]:
            row = copy.deepcopy(original)
            row['reviewerBeforeRuntimeIntegration35'] = copy.deepcopy(original['after'])
            assessable = False
            for binding in row['teachingBindings']:
                if 'lessonId' in binding:
                    l = lessons[binding['lessonId']]
                    assert binding['lessonSourceHash']==l['sourceHash']
                    if 'paragraphId' in binding and 'paragraphEvidenceJa' in binding:
                        p = next(p for p in l['paragraphs'] if p['id']==binding['paragraphId'])
                        assert p['textJa']==binding['paragraphEvidenceJa']
                    for p in binding.get('paragraphEvidenceJa',[]) if isinstance(binding.get('paragraphEvidenceJa'),list) else []:
                        actual = next(a for a in l['paragraphs'] if a['id']==p['id'])
                        assert actual['textJa']==p['textJa']
                if binding.get('type')=='source34_supplement':
                    s = sections[binding['sectionId']]
                    assert binding['textEvidenceJa'] in s['textJa']
                    authored = authoring_sections[binding['sectionId']]
                    authored_hash = digest({k:authored[k] for k in ['titleJa','textJa']})
                    assert binding['sourceHash'] in [s['sourceHash'],authored_hash], binding['sectionId']
                    assert s['textJa']==authored['textJa']+'\n\n'+authored['checkPromptJa']
                    binding['reviewedAuthoringSourceHash']=binding['sourceHash']
                    binding['sourceHash']=s['sourceHash']
            for binding in row['assessmentEvidence']:
                kind = binding['type']
                if kind=='no_assessment_required':continue
                assessable = True
                if kind=='existing_mcq':
                    q = questions[binding['questionId']]
                    assert binding['questionContentSha256']==digest(q)
                    assert binding['stemEvidenceJa']==q['promptJa']
                    assert binding['correctOptionEvidenceJa']==q['optionsJa'][q['answerIndex']]
                elif kind in ['new_open_response','existing_open_response']:
                    c = checks[binding['checkId']]
                    if 'checkContentSha256' in binding:assert binding['checkContentSha256']==c['sourceHash']
                    indices = binding['expectedPointIndices']
                    assert all(0<=i<len(c['expectedPointsJa']) for i in indices)
                    if 'expectedPointsEvidenceJa' in binding:
                        assert binding['expectedPointsEvidenceJa']==[c['expectedPointsJa'][i] for i in indices]
                    binding['sourceHash']=c['sourceHash']
                elif kind=='existing_activity':
                    l = lessons[binding['lessonId']]
                    assert l['sourceHash']==binding['lessonSourceHash']
                    assert binding['promptEvidenceJa']==l[binding['field']]
                elif kind=='source34_section_check':
                    assert binding['checkPromptJa'] in sections[binding['sectionId']]['textJa']
                elif kind=='existing_figure_activity':
                    assert figures[binding['figureId']]['sha256']==binding['figureSha256']
                else:raise AssertionError('Unknown assessment type '+kind)
                binding['runtimeIntegrated']=True
            for f in row['figureEvidence']:
                if f.get('assetFile'):
                    assert hashlib.sha256((ROOT/f['assetFile']).read_bytes()).hexdigest()==f['sha256']
            row['after']['status']='scoped_atomic_runtime_evidence_complete' if assessable else 'reference_or_navigation_no_assessment_required'
            row['after']['assessmentRuntimeBound']=assessable
            row['after']['humanReviewed']=False
            row['after']['nativeReviewed']=False
            row['after']['domainReviewed']=False
            row['localGaps']=[]
            row['evidencePacket']=filename
            atomic.append(row)
    assert len(atomic)==len({a['id'] for a in atomic})==150
    ledger['atomicRecords']=atomic
    ledger['regenerationCommand']='python3 scripts/food-manufacturing/finalize-source35.py'
    ledger['historicalOnlyBuilder']='build-unified-source-ledger.py is the internal historical consolidation step; use regenerationCommand to include current atomic evidence.'
    ledger['runtimeAssessmentInputs']=['src/data/food-manufacturing/exams.ja.json','src/data/food-manufacturing/authoring-20261029/part[1-6].json:exams']
    ledger['authoringExamShardsAreRuntimeInputs']=False
    ledger['parentAndChildCountsMustNotBeAddedAsCoveragePercentage']=True
    ledger['currentRuntimeEvidence35']={'sourceCompanionSections':40,'newSectionsThisTurn':36,
        'sourceBoundOpenResponseChecks':41,'expectedPoints':195,'canonicalQuestions':848,
        'canonicalAiReviewReceipts':848,'atomicRecords':150,
        'assessableAtomicRecords':sum(a['after']['assessmentRuntimeBound'] for a in atomic),
        'referenceAtomicRecords':sum(not a['after']['assessmentRuntimeBound'] for a in atomic)}
    for name in ['atomic-evidence34.json','atomic-evidence34-previous.json','closure31-review35.json',
                 'source-assessment35.json','browser35-assessment-validation.json','browser35-accessibility-delta.json','browser37-validation.json']:
        path=(DATA/name) if name=='source-assessment35.json' else (AUDIT/name)
        ledger['inputSha256'][str(path.relative_to(ROOT))]=hashlib.sha256(path.read_bytes()).hexdigest()
    write(AUDIT/'ledger.json',ledger)
    summary = ledger['currentRuntimeEvidence35']
    summary.update(status='PASS_SCOPED_EVIDENCE_NOT_HUMAN_CERTIFICATION',
        historicalRecordStatuses=dict(collections.Counter(r['after']['status'] for r in ledger['records'])),
        unresolvedHistoricalSemanticReviewRecords=sum(r['after']['status']=='semantic_recheck_pending' for r in ledger['records']),
        fullAtomicSourceDecompositionComplete=False,fullSourceCoverageCertified=False,
        humanReviewed=False,nativeReviewed=False,domainReviewed=False,physicalDeviceTested=False)
    write(AUDIT/'integration35-validation.json',summary)
    print(json.dumps(summary))


if __name__=='__main__':main()
