"""Apply two exact, evidence-bound electrical stem refinements reversibly.

No source receipt is rewritten. Historical validators use the exact predecessor
view; native/domain/full-source certification remains explicitly unclaimed.
"""
from copy import deepcopy
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
PATCH_PATH = 'docs/ssw-workspace/manufacturing/batch21/mock-editorial-patches.json'
SOURCE = 'src/data/manufacturing/mocks/electrical.json'
TRANSLATIONS = 'src/data/manufacturing/mock-translations.json'
FURIGANA = 'src/data/manufacturing/mock-furigana.json'
IDS = {'mfg1-electrical-mock-03-practical-q04', 'mfg1-electrical-mock-08-practical-q08'}
LOCALES = {'en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2)+'\n').encode()


def digest(value):
    return hashlib.sha256(value).hexdigest()


def object_digest(value):
    return digest(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())


def changed(before, after):
    return {k for k in set(before)|set(after) if before.get(k) != after.get(k)}


def load_patch(root=ROOT):
    patch = json.loads((root/PATCH_PATH).read_bytes())
    validate_patch(patch)
    expected = {
        'docs/ssw-workspace/manufacturing/batch21/canonical-revisions.json',
        'docs/ssw-workspace/manufacturing/batch21/source-review.json',
        'docs/ssw-workspace/manufacturing/batch21/canonical-review.json',
        'docs/ssw-workspace/manufacturing/batch21/stem-translations.json',
        'docs/ssw-workspace/manufacturing/batch21/translation-review.json',
    }
    require(set(patch['evidenceFiles']) == expected, 'Precision evidence path set drift')
    for path, expected_hash in patch['evidenceFiles'].items():
        require(digest((root/path).read_bytes()) == expected_hash, 'Precision evidence digest drift: '+path)
    stage=root/'docs/ssw-workspace/manufacturing/batch21'
    canonical=json.loads((stage/'canonical-revisions.json').read_bytes())
    stems=json.loads((stage/'stem-translations.json').read_bytes())
    source_review=json.loads((stage/'source-review.json').read_bytes())
    canonical_review=json.loads((stage/'canonical-review.json').read_bytes())
    translation_review=json.loads((stage/'translation-review.json').read_bytes())
    canonical_path='docs/ssw-workspace/manufacturing/batch21/canonical-revisions.json'
    source_review_path='docs/ssw-workspace/manufacturing/batch21/source-review.json'
    for report in (source_review,canonical_review):
        require(report['canonicalRevisions']=={'path':canonical_path,'sha256':patch['evidenceFiles'][canonical_path]},
                'Review canonical input binding drift')
    require(canonical_review['sourceReview']=={'path':source_review_path,'sha256':patch['evidenceFiles'][source_review_path]},
            'Independent source receipt binding drift')
    require(canonical_review['status']=='pass' and canonical_review['independentScopedReview'] is True
            and canonical_review['fullSourceCertified'] is False
            and source_review['fullSourceKnowledgeCoverageCertified'] is False,
            'Canonical review scope/certification drift')
    reviewed={r['questionId']:r for r in canonical_review['reviews']}
    source_findings={r['questionId']:r for r in source_review['findings']}
    require(len(reviewed)==len(canonical_review['reviews'])==2 and set(reviewed)==IDS
            and len(source_findings)==len(source_review['findings'])==2 and set(source_findings)==IDS,
            'Canonical/source review question set drift')
    for key in ('sourcePath','baselineSourceSha256','revisedSourceSha256','examRevisions'):
        require(patch[key]==canonical[key], 'Precision canonical manifest drift: '+key)
    cpatch={p['questionId']:p for p in canonical['patches']}
    require(set(stems['locales'])==LOCALES, 'Precision staged locale set drift')
    for p in patch['patches']:
        qid=p['questionId']; c=cpatch[qid]
        for key in ('before','after','furigana'):
            require(p[key]==c[key], 'Precision canonical object drift: '+qid+'/'+key)
        r=reviewed[qid]; sr=source_findings[qid]
        require(r['status']=='pass' and r['correctIndexPreserved']==p['after']['correctIndex']
                and r['optionsReasonsAndOtherFieldsPreserved'] is True
                and r['furiganaTextExactlyAligned'] is True and r['furiganaOptionsPreserved'] is True,
                'Canonical review verdict/preservation drift')
        for side in ('before','after'):
            require(r[side+'SourceHash']==p[side]['sourceHash']
                    and r[side+'ObjectSha256']==object_digest(p[side])
                    and r['furigana'+side.title()+'ObjectSha256']==object_digest(p['furigana'][side])
                    and sr[side+'SourceHash']==p[side]['sourceHash'], 'Canonical review object binding drift')
        require(sr['directPdfDefinitionSupport'] is False
                and sr['verdict']=='pass_scoped_editorial_consistency_not_direct_pdf_definition_certification',
                'Source limitation/verdict drift')
        require(r['examRevision']==patch['examRevisions'][c['examId']], 'Canonical review exam revision drift')
        binding=translation_review['questionBindings'][qid]
        require(binding=={'sourceJa':p['after']['stemJa'],'sourceJaSha256':digest(p['after']['stemJa'].encode()),
                          'sourceHash':p['after']['sourceHash'],'canonicalAfterObjectSha256':object_digest(p['after'])},
                'Translation review canonical binding drift')
        for locale in LOCALES:
            require(set(stems['locales'][locale])==IDS, 'Precision staged question set drift')
            t=stems['locales'][locale][qid]
            require(t['sourceJa']==p['after']['stemJa'] and t['sourceJaSha256']==digest(t['sourceJa'].encode())
                    and t['sourceHash']==p['after']['sourceHash'], 'Precision staged stem source drift')
            require(p['translations'][locale]['after']['stem']==t['text'], 'Precision staged target text drift')
            tr=translation_review['locales'][locale][qid]
            require(tr['entrySha256']==object_digest(t) and tr['textSha256']==digest(t['text'].encode())
                    and tr['sourceJaSha256']==t['sourceJaSha256'] and tr['sourceHash']==t['sourceHash']
                    and tr['comparedDirectlyWithJapanese'] is True and tr['verdict']=='pass_scoped_ai_comparison'
                    and not tr['findings'], 'Independent target entry review drift')
    require(translation_review['inputFileSha256']==patch['evidenceFiles']['docs/ssw-workspace/manufacturing/batch21/stem-translations.json']
            and translation_review['reviewedStemPairs']==24
            and translation_review['independentAIComparisonPerformed'] is True, 'Missing exact independent stem comparison')
    for report in (source_review,canonical_review,translation_review):
        for flag in ('nativeReviewed','domainReviewed','humanReviewed','releaseReady'):
            require(report[flag] is False, 'Unsupported bound review certification: '+flag)
    return patch


def validate_patch(patch):
    require(patch['sourcePath'] == SOURCE, 'Unexpected electrical source path')
    require(patch['review']['independentReviewed'] is True, 'Missing bounded independent revision review')
    for flag in ('nativeReviewed','domainReviewed','releaseReady','fullSourceCertified'):
        require(patch['review'][flag] is False, 'Unsupported precision certification: '+flag)
    require(set(patch['fileSnapshots']) == {SOURCE,TRANSLATIONS,FURIGANA}, 'Precision file set drift')
    require(patch['fileSnapshots'][SOURCE] == {'before':patch['baselineSourceSha256'],'after':patch['revisedSourceSha256']},
            'Inconsistent precision source hashes')
    ps=patch['patches']; require(len(ps)==2 and {p['questionId'] for p in ps}==IDS, 'Precision question set drift')
    require(set(patch['examRevisions']) == {'mfg1-electrical-mock-03','mfg1-electrical-mock-08'}, 'Precision exam set drift')
    for p in ps:
        before,after=p['before'],p['after']; qid=p['questionId']
        require(before['id']==after['id']==qid, 'Precision identity drift')
        require(changed(before,after)=={'stemJa','sourceHash'}, 'Precision exceeds Japanese stem scope')
        require(before['reviewStatus']==after['reviewStatus']=='ai_authored_draft_independent_review_pending',
                'Precision runtime review status overclaimed')
        require(set(p['translations'])==LOCALES, 'Precision target locale set drift')
        for side in ('before','after'):
            q=p[side]
            require(q['sourceHash']==object_digest({k:v for k,v in q.items() if k!='sourceHash'}), 'Precision question digest drift')
            r=p['furigana'][side]
            require(r['sourceHash']==q['sourceHash'], 'Precision ruby binding drift')
            require(''.join(t['text'] for t in r['stem'])==q['stemJa'], 'Precision ruby stem drift')
            require([''.join(t['text'] for t in option) for option in r['options']]==q['optionsJa'], 'Precision ruby options drift')
            require(all(isinstance(t.get('text'),str) and t['text'] for t in r['stem']), 'Empty precision ruby segment')
        require(changed(p['furigana']['before'],p['furigana']['after'])=={'stem','sourceHash'}, 'Precision ruby exceeds stem scope')
        for locale,t in p['translations'].items():
            require(changed(t['before'],t['after'])=={'stem','sourceHash'}, 'Precision target exceeds stem scope: '+locale)
            for side in ('before','after'):
                entry=t[side]
                require(entry['sourceHash']==p[side]['sourceHash'], 'Precision target source drift')
                require(entry['nativeReviewed'] is False and entry['domainReviewed'] is False
                        and entry['translatedDirectlyFrom']=='ja', 'Unsupported precision target provenance')
                require(isinstance(entry['stem'],str) and entry['stem'].strip(), 'Empty precision target stem')


def source_versions(payload, patch):
    validate_patch(patch)
    require(digest(payload) in patch['fileSnapshots'][SOURCE].values(), 'Unrecognized electrical mock snapshot')
    before=json.loads(payload); after=deepcopy(before); found=set()
    by_id={p['questionId']:p for p in patch['patches']}
    for old_exam,new_exam in zip(before['exams'],after['exams']):
        for name,section in old_exam['sections'].items():
            for i,q in enumerate(section['questions']):
                p=by_id.get(q['id'])
                if p:
                    require(q in (p['before'],p['after']), 'Precision source object drift')
                    old_exam['sections'][name]['questions'][i]=deepcopy(p['before'])
                    new_exam['sections'][name]['questions'][i]=deepcopy(p['after'])
                    found.add(q['id'])
        rev=patch['examRevisions'].get(old_exam['id'])
        if rev:
            require(old_exam['revision'] in rev.values(), 'Precision exam revision drift')
            old_exam['revision']=rev['before']; new_exam['revision']=rev['after']
            for exam in (old_exam,new_exam):
                require(exam['revision']=='v1-'+object_digest(exam['sections'])[:16], 'Precision revision/sections mismatch')
    require(found==IDS, 'Precision question missing')
    old_bytes,new_bytes=encoded(before),encoded(after)
    require(digest(old_bytes)==patch['baselineSourceSha256'], 'Electrical predecessor reconstruction drift')
    require(digest(new_bytes)==patch['revisedSourceSha256'], 'Electrical revised reconstruction drift')
    return old_bytes,new_bytes


def transform_files(inputs,patch,*,forward=True):
    """Only exact whole-file predecessor/current states are accepted."""
    validate_patch(patch); outputs=dict(inputs)
    for path in {SOURCE,TRANSLATIONS,FURIGANA}&set(inputs):
        require(digest(inputs[path]) in patch['fileSnapshots'][path].values(), 'Unrecognized precision file snapshot: '+path)
        if path==SOURCE:
            versions=source_versions(inputs[path],patch)
            outputs[path]=versions[1 if forward else 0]
            continue
        value=json.loads(inputs[path])
        for p in patch['patches']:
            qid=p['questionId']
            pairs=p['translations'] if path==TRANSLATIONS else {'ruby':p['furigana']}
            for locale,pair in pairs.items():
                table=value['locales'][locale] if path==TRANSLATIONS else value['questions']
                require(table[qid] in (pair['before'],pair['after']), 'Precision target/ruby object drift')
                table[qid]=deepcopy(pair['after' if forward else 'before'])
        outputs[path]=encoded(value)
        require(digest(outputs[path])==patch['fileSnapshots'][path]['after' if forward else 'before'],
                'Precision whole-file reconstruction drift: '+path)
    return outputs


def compile_outputs(inputs,patch):
    require({SOURCE,TRANSLATIONS,FURIGANA}<=set(inputs), 'Missing precision runtime input')
    return transform_files(inputs,patch)


def preflight(root=ROOT):
    patch=load_patch(root)
    inputs={p:(root/p).read_bytes() for p in (SOURCE,TRANSLATIONS,FURIGANA)}
    compile_outputs(inputs,patch)
    return {'status':'PASS','questionRevisions':2,'translationBindings':24,'nativeReviewed':False,'domainReviewed':False}


def main():
    patch=load_patch()
    inputs={p:(ROOT/p).read_bytes() for p in (SOURCE,TRANSLATIONS,FURIGANA)}
    outputs=compile_outputs(inputs,patch)
    changes=[]
    for path,payload in outputs.items():
        if payload!=inputs[path]:
            (ROOT/path).write_bytes(payload);changes.append(path)
    print(json.dumps({'status':'PASS','questionRevisions':2,'translationBindings':24,'changedFiles':changes,
                      'historicalEvidencePreserved':True,'nativeReviewed':False,'domainReviewed':False,'releaseReady':False}))


if __name__=='__main__':
    main()
