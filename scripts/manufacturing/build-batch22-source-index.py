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
STAGE=BASE+'batch22/'
OUTPUT=STAGE+'source-object-index.json'
FREEZE=STAGE+'runtime-freeze.json'
INDEPENDENT=STAGE+'independent-source-review.json'
TARGET=STAGE+'target-coverage-review.json'
SOURCE_QA=BASE+'source-qa-report.json'
MATRIX=BASE+'knowledge-matrix.json'
PRIOR=BASE+'batch17/source-object-index.json'
SCOPE=BASE+'approved-scope.json'
REGISTRY='src/data/manufacturing/translations/manifest.json'
SPECIALTIES=('mechanical','electrical','surface')
PAGES={'mechanical':{72,73},'electrical':{103,104,105},'surface':{183,184}}
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


def ledger_path(specialty):return STAGE+specialty+'-source-ledger.json'


def expected_freeze_paths(locales,assets):
    history={SCOPE,SOURCE_QA,MATRIX,PRIOR,BASE+'page-object-inventory.json',BASE+'illustration-register.json',
             BASE+'batch12/frozen-source-inputs.json'}
    history|={BASE+'batch17/'+s+'-source-review.json' for s in SPECIALTIES}
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
    require(len(assets)==20,'Historical diagram asset count drift')
    pictures=set()
    for asset in assets:
        for key,extension in (('file','.svg'),('png','.png')):
            name=asset[key]
            require(Path(name).name==name and name.endswith(extension),'Unsafe historical diagram asset path')
            pictures.add('assets/manufacturing/diagrams/'+name)
    require(len(pictures)==40,'Duplicate historical diagram asset filename')
    return history|{data+p for p in fixed}|code|pictures


def load_inputs(root=ROOT):
    inputs={}
    def add(path):
        path=safe_path(path)
        if path not in inputs:inputs[path]=(root/path).read_bytes()
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
        if path=='src/components/manufacturing/ManufacturingCourse.tsx':
            import runpy
            raw=runpy.run_path(str(root/'scripts/manufacturing/supplement-practice-projection.py'))['historical_course'](raw)
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
    require(freeze['schemaVersion']==1 and freeze['batch']==22,'Freeze identity drift')
    require(freeze['runtimeFilesModified'] is False,'Freeze runtime mutation claim')
    for flag in ('nativeReviewed','domainReviewed','fullSourceAtomizationComplete','releaseReady'):
        require(freeze[flag] is False,'Unsupported freeze certification')
    required={SOURCE_QA,MATRIX,PRIOR,SCOPE,REGISTRY,BASE+'page-object-inventory.json'}
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
    require(receipts['schemaVersion']==1 and receipts['batch']==22
            and receipts['status']=='pass_scoped_ai_comparison'
            and receipts['independentAIComparisonPerformed'] is True,'Independent source review missing')
    false_flags(receipts,'Independent source review')
    reviews=index(receipts['reviews'],'specialty','independent specialty review')
    expected_ledgers={ledger_path(s) for s in SPECIALTIES}
    require(set(reviews)==set(SPECIALTIES) and set(receipts['ledgerFiles'])==expected_ledgers,'Independent source review scope drift')
    records=[];all_ids=set(prior);lesson_hashes={};lesson_objects={};summaries={};ledger_hashes={}
    for specialty in SPECIALTIES:
        path=ledger_path(specialty);report=read(path);sha=digest(inputs[path]);ledger_hashes[path]=sha
        require(report['schemaVersion']==1 and report['batch'] in (22,'22') and report['specialty']==specialty
                and report['scopeLevel']=='1','Ledger scope identity drift')
        require(report['baselineCommit']==freeze['baselineCommit'],'Ledger baseline commit drift')
        false_flags(report,specialty)
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
                require(isinstance(identifier,str) and re.fullmatch(r'mfg1-'+specialty+r'-b22-p'+f'{physical:03}'+r'-o[0-9]{2,}',identifier)
                        and identifier not in all_ids,'Invalid/duplicate source object ID')
                all_ids.add(identifier);objects.append(identifier)
                for field in ('type','summary','comparisonBasis'):
                    require(isinstance(obj[field],str) and obj[field].strip(),'Missing object '+field)
                status=obj['coverageStatus'];require(status in STATUSES,'Unknown source coverage status')
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
                require(all(prior_for_source[p]['pdfPage']==physical for p in predecessors),
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
    require(coverage['schemaVersion']==1 and coverage['batch']==22
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
    return {'schemaVersion':1,'batch':22,'scopeLevel':'1','baselineCommit':freeze['baselineCommit'],
            'scope':'Additive scoped source-object review occurrences with structural target bindings; not exhaustive source, semantic translation, native/domain or release certification.',
            'ledgerFiles':ledger_hashes,'independentSourceReviewSha256':digest(inputs[INDEPENDENT]),
            'targetCoverageReviewSha256':digest(inputs[TARGET]),'runtimeFreezeSha256':digest(inputs[FREEZE]),
            'specialties':summaries,'pageReviewOccurrences':sum(v['pageReviewOccurrences'] for v in summaries.values()),
            'detailedObjectOccurrences':len(records),'globallyNewPreviouslyUnseenPages':None,
            'newnessQualification':'Seven scoped page-review occurrences. Prior visual reading may exist; no globally unique-new-page count is asserted.',
            'referencedLessonsWithTwelveRevisionBoundTargets':len(lesson_hashes),'semanticTranslationReviewPerformed':False,
            'objects':records,'runtimeFilesModified':False,**{flag:False for flag in FLAGS}}


def main():
    require(sys.argv[1:] in ([],['--write']),'Usage: build-batch22-source-index.py [--write]')
    result=build_index(load_inputs())
    if sys.argv[1:]==['--write']:(ROOT/OUTPUT).write_bytes(encoded(result))
    else:require((ROOT/OUTPUT).read_bytes()==encoded(result),'Batch22 source index drift')
    print(json.dumps({'status':'PASS','pageReviewOccurrences':result['pageReviewOccurrences'],
                      'detailedObjectOccurrences':result['detailedObjectOccurrences'],'runtimeFilesModified':False,
                      'wholeCurriculumComplete':False}))


if __name__=='__main__':main()
