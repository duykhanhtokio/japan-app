"""Build an additive, bounded source-object review index; no closure claims.

Default mode verifies the recorded index. --write writes only that index after
all source, lesson, independent-review, target-binding and frozen-file checks.
"""
from collections import Counter
from pathlib import Path
import hashlib
import json
import math
import re
import sys

ROOT=Path(__file__).resolve().parents[2]
BASE='docs/ssw-workspace/manufacturing/'
STAGE=BASE+'batch25/'
OUTPUT=STAGE+'source-object-index.json'
FREEZE=STAGE+'runtime-freeze.json'
INDEPENDENT=STAGE+'independent-source-review.json'
TARGET=STAGE+'locale-binding-review.json'
SOURCE_QA=BASE+'source-qa-report.json'
MATRIX=BASE+'knowledge-matrix.json'
PRIOR=BASE+'batch17/source-object-index.json'
SCOPE=BASE+'approved-scope.json'
REGISTRY='src/data/manufacturing/translations/manifest.json'
AUTHORITY_SHA256={'docs/ssw-workspace/manufacturing/approved-scope.json': '4f13912fd92ed2d4d6aacd7276d36bac0f725f8ad4436981abfed39706d657c4', 'docs/ssw-workspace/manufacturing/source-qa-report.json': 'cdcaad94616076c7cc3f5503cc7eeea8e78e30ae1426c84f59168996ac97b0e0', 'docs/ssw-workspace/manufacturing/batch17/source-object-index.json': '786809b68c8c6b1d4a3b619aa33362cd8b24313377f5e678ee04d229d84ac098'}
SPECIALTIES=('mechanical','electrical','surface')
PAGES={'mechanical':{97},'electrical':{151},'surface':{175,176}}
STATUSES={'covered_concept','partial_detail_or_visual_gap','source_qualification_or_ambiguity','not_taught_in_current_scope'}
FLAGS=('nativeReviewed','domainReviewed','humanReviewed','fullKnowledgeAtomizationComplete','wholeCurriculumComplete','releaseReady')
COARSE_PRIOR={
    'mechanical':BASE+'batch12/mechanical/full-source-audit.json',
    'electrical':BASE+'batch12/electrical/source-knowledge-closure-audit.json',
    'surface':BASE+'batch12/surface/full-source-audit.json',
}


def require(condition,message):
    if not condition:raise ValueError(message)


def digest(payload):return hashlib.sha256(payload).hexdigest()


def object_digest(value):
    return digest(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())


def encoded(value):return (json.dumps(value,ensure_ascii=False,indent=2)+'\n').encode()


def safe_path(path):
    require(isinstance(path,str) and path and not Path(path).is_absolute()
            and '..' not in Path(path).parts and '\\' not in path,'Unsafe source-index input path')
    return path


def ledger_path(specialty):return STAGE+specialty+'-source-review.json'


def expected_freeze_paths(locales,assets):
    history={MATRIX,BASE+'page-object-inventory.json',BASE+'illustration-register.json'}
    data='src/data/manufacturing/'
    fixed={'course-manifest.json','diagram-translations.json','electrical.json','index.ts','mechanical.json',
           'mock-furigana.json','mock-reading-overrides.json','mock-translations.json','mock-ui-translations.json',
           'mock-ui.ts','mocks.ts','source-guide-translations.json','source-guides.json','source-guides.ts',
           'surface.json','translations.ts','ui-translations.json','ui.ts','translations/manifest.json'}
    fixed|={'mocks/'+s+'.json' for s in SPECIALTIES}
    fixed|={'translations/'+locale+'.json' for locale in locales}
    fixed|={'translations/questions.'+locale+'.json' for locale in locales}
    code={'src/components/manufacturing/'+n for n in ['ManufacturingCourse.tsx','ManufacturingDiagram.tsx',
                                                    'ManufacturingMocks.tsx','useManufacturingBack.ts']}
    code|={'src/services/manufacturing-'+n+'-state.ts' for n in ['mock','study']}
    require(len(assets)==22,'Historical diagram asset count drift')
    pictures=set()
    for asset in assets:
        for key,extension in (('file','.svg'),('png','.png')):
            name=asset[key]
            require(Path(name).name==name and name.endswith(extension),'Unsafe historical diagram asset path')
            pictures.add('assets/manufacturing/diagrams/'+name)
    require(len(pictures)==44,'Duplicate historical diagram asset filename')
    return history|{data+p for p in fixed}|code|pictures


def load_inputs(root=ROOT):
    inputs={}
    def add(path):
        path=safe_path(path)
        add_bytes(path,inputs,root)
        return json.loads(inputs[path])
    freeze=add(FREEZE)
    for path in freeze['files']:add_bytes(path,inputs,root)
    for path in (SOURCE_QA,MATRIX,PRIOR,SCOPE,REGISTRY,INDEPENDENT,TARGET):add(path)
    for specialty in SPECIALTIES:
        report=add(ledger_path(specialty))
        for path in report['inputsSha256']:add_bytes(path,inputs,root)
        add(f'src/data/manufacturing/{specialty}.json')
    coverage=add(TARGET)
    for path in coverage['translationFiles']:add_bytes(path,inputs,root)
    return inputs


def add_bytes(path,inputs,root):
    path=safe_path(path)
    if path not in inputs:
        raw=(root/path).read_bytes()
        if path=='src/data/manufacturing/mocks.ts':
            import runpy
            raw=runpy.run_path(str(root/'scripts/manufacturing/reference-practice-projection.py'))['historical_loader'](raw)
        if path in {'src/data/manufacturing/source-guides.json','src/data/manufacturing/source-guide-translations.json','src/data/manufacturing/course-manifest.json'}:
            import runpy
            layer=runpy.run_path(str(root/'scripts/manufacturing/apply-guide-extension26.py'))
            raw=layer['historical_bytes'](path,raw)
        inputs[path]=raw


def index(items,field,label):
    result={v[field]:v for v in items}
    require(len(result)==len(items),'Duplicate '+label)
    return result


def false_flags(value,label):
    for flag in FLAGS:require(value.get(flag) is False,label+': unsupported or omitted '+flag)


def build_index(inputs):
    def read(path):return json.loads(inputs[path])
    freeze=read(FREEZE)
    for authority,expected in AUTHORITY_SHA256.items():require(digest(inputs[authority])==expected,'Historical authority drift: '+authority)
    require(freeze['schemaVersion']==1 and freeze['batch']==25 and freeze['baselineCommit']=='dd3b19bfb3bac33ee3c33a8f88e80949d4714762','Freeze identity drift')
    require(freeze['runtimeFilesModified'] is False,'Freeze runtime mutation claim')
    for flag in ('nativeReviewed','domainReviewed','fullSourceAtomizationComplete','releaseReady'):
        require(freeze[flag] is False,'Unsupported freeze certification')
    required={MATRIX,REGISTRY,BASE+'page-object-inventory.json'}
    required|={f'src/data/manufacturing/{s}.json' for s in SPECIALTIES}
    require(required<=set(freeze['files']),'Missing core historical/source freeze')
    for path,expected in freeze['files'].items():
        require(digest(inputs[safe_path(path)])==expected,'Frozen file drift: '+path)
    scope=read(SCOPE)
    require(scope['level']=='1' and set(scope['specialties'])==set(SPECIALTIES),'Unsupported source scope')
    locales=set(scope['targetLocales']);require(len(locales)==12,'Target scope drift')
    require(set(freeze['files'])==expected_freeze_paths(locales,read(BASE+'illustration-register.json')['assets']),
            'Missing/extra frozen runtime/history path')
    sources=index(read(SOURCE_QA)['sources'],'specialty','registered source specialty')
    knowledge=index(read(MATRIX)['knowledge'],'id','knowledge ID')
    prior=index(read(PRIOR)['objects'],'id','prior source object')
    receipts=read(INDEPENDENT)
    require(receipts['schemaVersion']==1 and receipts['batch']==25
            and receipts['status']=='pass_scoped_ai_comparison'
            and receipts['independentAIComparisonPerformed'] is True,'Independent source review missing')
    false_flags(receipts,'Independent source review')
    reviews=index(receipts['reviews'],'specialty','independent specialty review')
    expected_ledgers={ledger_path(s) for s in SPECIALTIES}
    require(set(reviews)==set(SPECIALTIES) and set(receipts['ledgerFiles'])==expected_ledgers,'Independent source review scope drift')
    records=[];all_ids=set(prior);lesson_hashes={};lesson_objects={};summaries={};ledger_hashes={}
    for specialty in SPECIALTIES:
        path=ledger_path(specialty);report=read(path);sha=digest(inputs[path]);ledger_hashes[path]=sha
        require(report['schemaVersion']==1 and report['batch'] in (25,'25') and report['specialty']==specialty
                and report['scopeLevel']=='1','Ledger scope identity drift')
        require(report['baselineCommit']==freeze['baselineCommit'],'Ledger baseline commit drift')
        false_flags(report,specialty)
        if specialty=='electrical':
            require(report['requestedTaxonomyClarification']['explicitlyPresentOnInspectedPage'] is False,'Unsupported electrical four-way taxonomy attribution')
            require(report['requestedTaxonomyClarification']['actualTaxonomy']=='Resistance bridge methods versus voltage-drop methods.','Electrical source taxonomy drift')
        require(report['runtimeModified'] is False,'Unsupported ledger runtime modification')
        source=report['source'];registered=sources[specialty];doc='mfg1-'+specialty+'-source'
        require(source['documentId']==doc and source['sha256']==registered['sha256'],'Unregistered ledger source')
        course_path=f'src/data/manufacturing/{specialty}.json'
        require(course_path in report['inputsSha256'] and MATRIX in report['inputsSha256'],'Missing actual comparison input binding')
        for compared,expected in report['inputsSha256'].items():
            require(digest(inputs[safe_path(compared)])==expected,'Stale ledger comparison input: '+compared)
        # Coarse batch12 source objects are valid predecessors too. Resolve them
        # only from exact digest-bound comparison reports, never guessed IDs.
        prior_for_source={k:v for k,v in prior.items() if v['documentId']==doc}
        for compared in report['inputsSha256']:
            if compared != COARSE_PRIOR[specialty]:continue
            candidate=read(compared)
            if not isinstance(candidate,dict):continue
            for previous in candidate.get('objects',[]):
                if not isinstance(previous,dict) or not isinstance(previous.get('id'),str):continue
                if previous.get('sourceSha256')==source['sha256']:
                    prior_for_source[previous['id']]=previous
        lessons=index(read(course_path)['lessons'],'id','lesson ID')
        review=reviews[specialty]
        require(review['ledgerPath']==path and review['ledgerSha256']==sha==receipts['ledgerFiles'][path],
                'Independent ledger digest drift')
        items=index(review['items'],'objectId','independent reviewed object')
        require(set(review['reviewedPageNumbers'])==PAGES[specialty]
                and len(review['reviewedPageNumbers'])==len(PAGES[specialty]) and review['scope'].strip(),
                'Independent page/scope drift')
        seen_pages=set();objects=[];statuses=Counter()
        for page in report['pages']:
            physical,printed=page['pdfPage'],page['printedPage']
            require(type(physical) is int and type(printed) is int and physical in PAGES[specialty]
                    and 1<=physical<=registered['pdfPages']
                    and physical-printed==registered['printedToPhysicalOffset'],'Invalid source page identity')
            require(physical not in seen_pages,'Duplicate source ledger page');seen_pages.add(physical)
            require(isinstance(page['priorEvidenceStatus'],str) and page['priorEvidenceStatus'].strip(),'Missing prior-page qualification')
            require(isinstance(page['visualInspection'],dict) and page['visualInspection'],'Missing actual visual inspection record')
            visual=page['visualInspection']
            require(visual['performed'] is True and isinstance(visual['method'],str) and visual['method'].strip()
                    and visual['sourceImagesRedistributed'] is False,'Missing/unsupported actual source visual inspection')
            require(page['objects'],'Empty source ledger page')
            for obj in page['objects']:
                identifier=obj['id']
                require(isinstance(identifier,str) and re.fullmatch(r'mfg1-'+specialty+r'-b25-p'+f'{physical:03}'+r'-o[0-9]{2,}',identifier)
                        and identifier not in all_ids,'Invalid/duplicate source object ID')
                all_ids.add(identifier);objects.append(identifier)
                for field in ('type','summary','comparisonBasis'):
                    require(isinstance(obj[field],str) and obj[field].strip(),'Missing object '+field)
                status=obj['coverageStatus'];require(status in STATUSES,'Unknown source coverage status')
                if identifier in {'mfg1-surface-b25-p175-o02','mfg1-surface-b25-p176-o03'}:
                    require(obj['derivation']=='canonical_editorial_inference' and status=='source_qualification_or_ambiguity','Surface interpretive qualification changed to literal source')
                require(obj['derivation'] in {'explicit_source','canonical_editorial_inference'},'Unknown source derivation')
                require(isinstance(obj['uncoveredFacets'],list) and all(isinstance(v,str) and v.strip() for v in obj['uncoveredFacets']),
                        'Invalid uncovered facet list')
                if status in {'partial_detail_or_visual_gap','not_taught_in_current_scope'}:
                    require(obj['uncoveredFacets'],'Incomplete object lacks explicit uncovered facets')
                if status=='covered_concept':require(not obj['uncoveredFacets'],'Covered concept contradicts uncovered facets')
                box=obj['bboxNormalized']
                require(isinstance(box,list) and len(box)==4 and all(type(v) in (int,float) and math.isfinite(v) and 0<=v<=1 for v in box)
                        and box[0]<box[2] and box[1]<box[3],'Invalid source object region')
                kids=obj['knowledgeIds'];lids=obj['lessonIds'];bindings=obj['lessonBindings']
                require(kids and len(kids)==len(set(kids)) and all(k in knowledge and knowledge[k]['sourceId']==doc for k in kids),
                        'Unknown/duplicate/wrong-source knowledge ID')
                require(len(lids)==len(set(lids)) and set(bindings)==set(lids),'Incomplete/duplicate lesson binding set')
                require(lids or status=='not_taught_in_current_scope','Taught object lacks lesson comparison')
                for lid,expected in bindings.items():
                    require(lid in lessons and lessons[lid]['sourceHash']==expected,'Stale/unknown source lesson binding')
                    lesson_hashes[lid]=expected
                    lesson_objects[lid]=lessons[lid]
                predecessors=obj['priorObjectIds']
                require(len(predecessors)==len(set(predecessors)) and all(p in prior_for_source for p in predecessors),
                        'Invalid prior-object provenance')
                require(all(prior_for_source[p]['pdfPage']==physical or (identifier=='mfg1-surface-b25-p176-o05' and p=='mfg1-b17-surface-p175-o04' and prior_for_source[p]['pdfPage']==175 and physical==176) for p in predecessors),
                        'Prior-object page provenance drift')
                r=items.get(identifier)
                require(r is not None and r['objectSha256']==object_digest(obj)
                        and r['verdict']=='pass_scoped_ai_comparison' and r['directSourceCompared'] is True
                        and isinstance(r['note'],str) and r['note'].strip(),'Unreviewed/stale source object')
                statuses[status]+=1
                records.append({**obj,'specialty':specialty,'documentId':doc,'sourceSha256':source['sha256'],
                                'pdfPage':physical,'printedPage':printed,'priorEvidenceStatus':page['priorEvidenceStatus'],
                                'ledgerPath':path,'ledgerSha256':sha,'objectSha256':object_digest(obj)})
        require(seen_pages==PAGES[specialty] and set(items)==set(objects),'Ledger page/review object set drift')
        summaries[specialty]={'reviewedPhysicalPages':sorted(seen_pages),'pageReviewOccurrences':len(seen_pages),
                              'detailedObjectOccurrences':len(objects),'coverageStatusCounts':dict(sorted(statuses.items()))}
    coverage=read(TARGET)
    require(coverage['schemaVersion']==1 and coverage['batch']==25
            and coverage['status']=='pass_structural_coverage_check'
            and coverage['semanticTranslationReviewPerformed'] is False,'Target structural review scope drift')
    require(coverage['objectHashAlgorithm']=='sha256-canonical-json-utf8-sortkeys-noascii-compact',
            'Target coverage object hash algorithm drift')
    for flag in ('nativeReviewed','domainReviewed','humanReviewed','wholeCurriculumComplete','releaseReady'):
        require(coverage.get(flag) is False,'Unsupported target coverage claim')
    require(coverage['ledgerFiles']==ledger_hashes,'Target coverage ledger identity drift')
    registry=read(REGISTRY)['locales'];require(set(registry)==locales,'Registry locale scope drift')
    expected_target_files={'src/data/manufacturing/translations/'+registry[l]['file'] for l in locales}
    require(set(coverage['translationFiles'])==expected_target_files,'Target coverage input file set drift')
    for path,expected in coverage['translationFiles'].items():
        require(digest(inputs[path])==expected,'Target coverage input digest drift')
    target_items=index(coverage['items'],'lessonId','covered target lesson')
    require(set(target_items)==set(lesson_hashes),'Incomplete/excess target coverage lesson set')
    for lid,expected in lesson_hashes.items():
        item=target_items[lid];require(item['lessonSourceHash']==expected and set(item['locales'])==locales,'Target coverage lesson binding drift')
        paragraphs=lesson_objects[lid]['paragraphs'];paragraph_ids=[p['id'] for p in paragraphs]
        require(len(paragraph_ids)==len(set(paragraph_ids)) and item['coreParagraphIds']==paragraph_ids
                and item['fieldBindings']=={'paragraphs':[{'id':p['id'],'sourceObjectSha256':object_digest(p)} for p in paragraphs]},
                'Target source paragraph binding/order drift')
        for locale,r in item['locales'].items():
            path='src/data/manufacturing/translations/'+registry[locale]['file']
            entry=read(path)['lessons'][lid]
            require(entry['sourceHash']==r['sourceHash']==expected and object_digest(entry)==r['targetObjectSha256']
                    and r['status']=='revision_bound_ai_draft','Stale target lesson object binding')
            require([p['id'] for p in entry['paragraphs']]==paragraph_ids==r['paragraphIds']
                    and r['paragraphObjectSha256']=={p['id']:object_digest(p) for p in entry['paragraphs']},
                    'Target paragraph binding/order drift')
    expected_coverage=[{key:r[key] for key in ('ledgerPath','objectId','lessonIds','coverageStatus','uncoveredFacets','comparisonBasis')}
                       for r in [{**record,'objectId':record['id']} for record in records]]
    require(index(coverage['objectCoverage'],'objectId','target reviewed source object')
            ==index(expected_coverage,'objectId','indexed source object'),
            'Target review changed source-object coverage/gap qualification')
    require(coverage['coverageStatusCounts']==dict(sorted(Counter(r['coverageStatus'] for r in records).items())),
            'Target coverage status counts drift')
    return {'schemaVersion':1,'batch':25,'scopeLevel':'1','baselineCommit':freeze['baselineCommit'],
            'scope':'Additive scoped source-object review occurrences with structural target bindings; not exhaustive source, semantic translation, native/domain or release certification.',
            'ledgerFiles':ledger_hashes,'independentSourceReviewSha256':digest(inputs[INDEPENDENT]),
            'targetCoverageReviewSha256':digest(inputs[TARGET]),'runtimeFreezeSha256':digest(inputs[FREEZE]),
            'specialties':summaries,'pageReviewOccurrences':sum(v['pageReviewOccurrences'] for v in summaries.values()),
            'detailedObjectOccurrences':len(records),'globallyNewPreviouslyUnseenPages':None,
            'newnessQualification':'Four scoped page-review occurrences. Prior visual reading may exist; no globally unique-new-page count is asserted.',
            'referencedLessonsWithTwelveRevisionBoundTargets':len(lesson_hashes),'semanticTranslationReviewPerformed':False,
            'objects':records,'runtimeFilesModified':False,**{flag:False for flag in FLAGS}}


def main():
    require(sys.argv[1:] in ([],['--write']),'Usage: check-batch25-source-review.py [--write]')
    result=build_index(load_inputs())
    if sys.argv[1:]==['--write']:(ROOT/OUTPUT).write_bytes(encoded(result))
    else:require((ROOT/OUTPUT).read_bytes()==encoded(result),'Batch25 source index drift')
    print(json.dumps({'status':'PASS','pageReviewOccurrences':result['pageReviewOccurrences'],
                      'detailedObjectOccurrences':result['detailedObjectOccurrences'],'runtimeFilesModified':False,
                      'wholeCurriculumComplete':False}))




from copy import deepcopy

def validate_fixtures():
    M=globals()
    inputs=M['load_inputs']();build=M['build_index'];encoded=M['encoded'];digest=M['digest']
    result=build(inputs)
    M['require'](build(dict(reversed(list(inputs.items()))))==result,'Index input-order nondeterminism')
    M['require'](result['pageReviewOccurrences']==4,'Wrong batch25 page review scope')
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
                                     'pdfPage':97}]})
    mutate('fabricated-prior-shadow',ledger,
           lambda d:(d['inputsSha256'].__setitem__(fake_path,digest(fake_payload)),obj(d).__setitem__('priorObjectIds',[fake_id])),
           True,{fake_path:fake_payload})
    mutate('electrical-unsupported-taxonomy',ledger_path('electrical'),lambda d:d['requestedTaxonomyClarification'].__setitem__('explicitlyPresentOnInspectedPage',True),True)
    for identifier in ['mfg1-surface-b25-p175-o02','mfg1-surface-b25-p176-o03']:
        mutate('surface-inference-as-explicit:'+identifier,ledger_path('surface'),lambda d:next(o for p in d['pages'] for o in p['objects'] if o['id']==identifier).__setitem__('derivation','explicit_source'),True)
    mutate('unapproved-cross-page-predecessor',ledger_path('surface'),lambda d:d['pages'][0]['objects'][0].__setitem__('priorObjectIds',['mfg1-b17-surface-p176-o04']),True)
    forged_prior=json.loads(inputs[PRIOR]);forged_prior['objects'].append({'id':'mfg1-mechanical-b17-forged','documentId':'mfg1-mechanical-source','pdfPage':97})
    forged_prior_bytes=encoded(forged_prior)
    mutate('forged-authority-with-rebound-receipts',ledger,lambda d:obj(d).__setitem__('priorObjectIds',['mfg1-mechanical-b17-forged']),True,{PRIOR:forged_prior_bytes})
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
    for authority in AUTHORITY_SHA256:
        candidate=dict(inputs);candidate[authority]+=b' ';rejects('historical-authority-drift:'+authority,candidate)
    return {'status':'PASS','pageReviewOccurrences':result['pageReviewOccurrences'],
            'detailedObjectOccurrences':result['detailedObjectOccurrences'],'deterministicIndex':True,
            'invalidFixturesRejected':len(rejected),'fixtures':rejected,'runtimeFilesModified':False,
            'nativeReviewed':False,'domainReviewed':False,'wholeCurriculumComplete':False}


if __name__=='__main__':
    fixture_result=validate_fixtures()
    main()
    print(json.dumps(fixture_result))
