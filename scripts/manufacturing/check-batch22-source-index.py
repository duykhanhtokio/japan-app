"""Read-only index determinism and rejected source-ledger mutations."""
from copy import deepcopy
from pathlib import Path
import json
import runpy

ROOT=Path(__file__).resolve().parents[2]
M=runpy.run_path(str(ROOT/'scripts/manufacturing/build-batch22-source-index.py'))


def validate():
    inputs=M['load_inputs']();build=M['build_index'];encoded=M['encoded'];digest=M['digest']
    result=build(inputs)
    M['require'](build(dict(reversed(list(inputs.items()))))==result,'Index input-order nondeterminism')
    M['require'](result['pageReviewOccurrences']==7,'Wrong batch22 page review scope')
    rejected=[]

    def rejects(label,candidate):
        try:build(candidate)
        except (ValueError,KeyError,AssertionError):rejected.append(label)
        else:raise AssertionError('Invalid source index fixture accepted: '+label)

    def mutate(label,path,fn,rebind_ledger=False,extra_inputs=None):
        candidate={**inputs,**(extra_inputs or {})};value=json.loads(candidate[path]);fn(value);candidate[path]=encoded(value)
        if rebind_ledger:
            # Rebind receipt digests/object hashes to prove actual content gates
            # reject bad source facts, rather than just detecting stale receipts.
            receipt=json.loads(candidate[M['INDEPENDENT']]);receipt['ledgerFiles'][path]=digest(candidate[path])
            review=next(r for r in receipt['reviews'] if r['ledgerPath']==path)
            review['ledgerSha256']=digest(candidate[path])
            objects={o['id']:o for p in value['pages'] for o in p['objects']}
            for item in review['items']:
                if item['objectId'] in objects:item['objectSha256']=M['object_digest'](objects[item['objectId']])
            candidate[M['INDEPENDENT']]=encoded(receipt)
            coverage=json.loads(candidate[M['TARGET']]);coverage['ledgerFiles'][path]=digest(candidate[path])
            candidate[M['TARGET']]=encoded(coverage)
        rejects(label,candidate)

    ledger=M['ledger_path']('mechanical')
    def obj(value):return value['pages'][0]['objects'][0]
    cases=[
        ('scope2',lambda d:d.__setitem__('scopeLevel','2')),
        ('wrong-source',lambda d:d['source'].__setitem__('sha256','bad')),
        ('baseline-drift',lambda d:d.__setitem__('baselineCommit','bad')),
        ('wrong-offset',lambda d:d['pages'][0].__setitem__('printedPage',1)),
        ('unapproved-page',lambda d:d['pages'][0].__setitem__('pdfPage',74)),
        ('duplicate-page',lambda d:d['pages'].append(deepcopy(d['pages'][0]))),
        ('unperformed-visual',lambda d:d['pages'][0]['visualInspection'].__setitem__('performed',False)),
        ('redistributed-source',lambda d:d['pages'][0]['visualInspection'].__setitem__('sourceImagesRedistributed',True)),
        ('missing-method',lambda d:d['pages'][0]['visualInspection'].__setitem__('method','')),
        ('unknown-object-id',lambda d:obj(d).__setitem__('id','unknown')),
        ('duplicate-object-id',lambda d:d['pages'][0]['objects'].append(deepcopy(obj(d)))),
        ('invalid-box-order',lambda d:obj(d).__setitem__('bboxNormalized',[0.5,0.5,0.2,0.8])),
        ('invalid-box-range',lambda d:obj(d).__setitem__('bboxNormalized',[-0.1,0.1,0.2,0.3])),
        ('invalid-box-boolean',lambda d:obj(d).__setitem__('bboxNormalized',[False,0.1,0.2,0.3])),
        ('unknown-coverage',lambda d:obj(d).__setitem__('coverageStatus','complete_source_certified')),
        ('unknown-derivation',lambda d:obj(d).__setitem__('derivation','guessed')),
        ('empty-summary',lambda d:obj(d).__setitem__('summary','')),
        ('empty-comparison',lambda d:obj(d).__setitem__('comparisonBasis','')),
        ('missing-lesson-binding',lambda d:obj(d)['lessonBindings'].clear()),
        ('stale-lesson-binding',lambda d:obj(d)['lessonBindings'].__setitem__(obj(d)['lessonIds'][0],'bad')),
        ('unknown-knowledge',lambda d:obj(d).__setitem__('knowledgeIds',['unknown'])),
        ('unknown-predecessor',lambda d:obj(d).__setitem__('priorObjectIds',['unknown'])),
        ('native-certification',lambda d:d.__setitem__('nativeReviewed',True)),
        ('full-atomization',lambda d:d.__setitem__('fullKnowledgeAtomizationComplete',True)),
        ('release-certification',lambda d:d.__setitem__('releaseReady',True)),
    ]
    for label,fn in cases:mutate(label,ledger,fn,True)
    mutate('partial-without-gap',ledger,lambda d:(obj(d).__setitem__('coverageStatus','partial_detail_or_visual_gap'),obj(d).__setitem__('uncoveredFacets',[])),True)
    mutate('covered-with-gap',ledger,lambda d:(obj(d).__setitem__('coverageStatus','covered_concept'),obj(d).__setitem__('uncoveredFacets',['missingdetail'])),True)
    fake_path=M['STAGE']+'fabricated-prior.json'
    fake_id='mfg1-mechanical-b12-fabricated-prior'
    fake_payload=encoded({'objects':[{'id':fake_id,'sourceSha256':json.loads(inputs[ledger])['source']['sha256'],
                                     'pdfPage':72}]})
    mutate('fabricated-prior-shadow',ledger,
           lambda d:(d['inputsSha256'].__setitem__(fake_path,digest(fake_payload)),obj(d).__setitem__('priorObjectIds',[fake_id])),
           True,{fake_path:fake_payload})
    for label,fn in [
        ('missing-independent-object',lambda d:d['reviews'][0]['items'].pop()),
        ('duplicate-independent-object',lambda d:d['reviews'][0]['items'].append(deepcopy(d['reviews'][0]['items'][0]))),
        ('independent-stale-object',lambda d:d['reviews'][0]['items'][0].__setitem__('objectSha256','bad')),
        ('independent-pending-verdict',lambda d:d['reviews'][0]['items'][0].__setitem__('verdict','pending')),
        ('independent-no-source-comparison',lambda d:d['reviews'][0]['items'][0].__setitem__('directSourceCompared',False)),
        ('independent-full-certification',lambda d:d.__setitem__('wholeCurriculumComplete',True)),
    ]:mutate(label,M['INDEPENDENT'],fn)
    for label,fn in [
        ('target-semantic-overclaim',lambda d:d.__setitem__('semanticTranslationReviewPerformed',True)),
        ('target-missing-lesson',lambda d:d['items'].pop()),
        ('target-missing-locale',lambda d:d['items'][0]['locales'].pop('vi')),
        ('target-stale-object',lambda d:d['items'][0]['locales']['en'].__setitem__('targetObjectSha256','bad')),
        ('target-stale-source',lambda d:d['items'][0]['locales']['th'].__setitem__('sourceHash','bad')),
        ('target-false-status',lambda d:d['items'][0]['locales']['id'].__setitem__('status','native_approved')),
        ('target-core-paragraph-order',lambda d:d['items'][0]['coreParagraphIds'].reverse()),
        ('target-source-paragraph-hash',lambda d:d['items'][0]['fieldBindings']['paragraphs'][0].__setitem__('sourceObjectSha256','bad')),
        ('target-paragraph-hash',lambda d:d['items'][0]['locales']['en']['paragraphObjectSha256'].__setitem__(d['items'][0]['coreParagraphIds'][0],'bad')),
        ('target-coverage-qualification',lambda d:d['objectCoverage'][0].__setitem__('comparisonBasis','changed')),
        ('target-coverage-counts',lambda d:d['coverageStatusCounts'].__setitem__('covered_concept',999)),
    ]:mutate(label,M['TARGET'],fn)
    mutate('freeze-missing-runtime',M['FREEZE'],lambda d:d['files'].pop('src/data/manufacturing/mock-translations.json'))
    mutate('freeze-unsupported-certification',M['FREEZE'],lambda d:d.__setitem__('fullSourceAtomizationComplete',True))
    mutate('freeze-missing-asset',M['FREEZE'],lambda d:d['files'].pop(next(p for p in d['files'] if p.endswith('.png'))))
    candidate=dict(inputs);path='src/data/manufacturing/mock-translations.json';candidate[path]+=b' '
    rejects('unknown-frozen-runtime-bytes',candidate)
    return {'status':'PASS','pageReviewOccurrences':result['pageReviewOccurrences'],
            'detailedObjectOccurrences':result['detailedObjectOccurrences'],'deterministicIndex':True,
            'invalidFixturesRejected':len(rejected),'fixtures':rejected,'runtimeFilesModified':False,
            'nativeReviewed':False,'domainReviewed':False,'wholeCurriculumComplete':False}


if __name__=='__main__':print(json.dumps(validate()))
