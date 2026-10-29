"""Compile source-bound, exact-before AI translation corrections without rewriting historical banks."""
from pathlib import Path
import hashlib,json,re,sys,os,tempfile
ROOT=Path(__file__).resolve().parents[2]
STAGE='docs/ssw-workspace/manufacturing/batch33-full-review/'
OUTPUT='src/data/manufacturing/editorial-translations.json'
def read(p):return json.loads((ROOT/p).read_text())
def digest(p):return hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
def at(value,path):
    for key in path:value=value[key]
    return value
def field_path(field):
    field=re.sub(r'\[(\d+)\]',r'/\1',field)
    field=field.replace('.','/')
    parts=[int(x) if x.isdigit() else x for x in field.split('/')]
    assert parts and all(isinstance(x,int) and x>=0 or isinstance(x,str) and x in {'stem','options','reasons','title','objective','paragraphs','terms','meaning','text','activity','safety','summary'} for x in parts)
    return parts
def canonical_path(kind,path):
    if kind in {'mock','weekly'}:
        assert path[0] in {'stem','options','reasons'}
        assert len(path)==(1 if path[0]=='stem' else 2)
        return [{'stem':'stemJa','options':'optionsJa','reasons':'optionReasonsJa'}[path[0]],*path[1:]]
    if path[0] in {'title','objective','activity','summary'}:
        assert len(path)==1;return [path[0]+'Ja']
    if path[0]=='safety':assert len(path)==2;return ['safetyJa',path[1]]
    assert path[0] in {'paragraphs','terms'} and len(path)==3 and isinstance(path[1],int)
    assert path[2] in ({'title','text'} if path[0]=='paragraphs' else {'meaning'})
    return [*path[:2],path[2]+'Ja']
def build():
    scope='docs/ssw-workspace/manufacturing/approved-scope.json';approved=read(scope);assert approved['level']=='1' and len(approved['targetLocales'])==12
    allowed_locales=set(approved['targetLocales'])
    questions={};lessons={};inputs={scope:digest(scope)}
    for specialty in ['mechanical','electrical','surface']:
        cp='src/data/manufacturing/'+specialty+'.json';mp='src/data/manufacturing/mocks/'+specialty+'.json';inputs[cp]=digest(cp);inputs[mp]=digest(mp)
        course=read(cp);lessons.update({l['id']:l for l in course['lessons']})
        for exam in course['checks']:
            for q in exam['questions']:questions[('weekly',q['id'])]=q
        for exam in read(mp)['exams']:
            for section in exam['sections'].values():
                for q in section['questions']:questions[('mock',q['id'])]=q
    gp='src/data/manufacturing/source-guides.json';inputs[gp]=digest(gp);guides={g['id']:g for g in read(gp)['guides']}
    patches=[];seen=set();receipts=[];cache={}
    proposal_paths=[STAGE+'language-a/correction-proposals.json',STAGE+'language-a/lesson-correction-proposals.json',STAGE+'language-b/correction-proposals.json']
    for extra in ['language-a/supplementary-correction-proposals.json','language-b/supplementary-correction-proposals.json','language-a/terminology-round2-proposals.json','language-b/terminology-round2-proposals.json']:
        supplementary=STAGE+extra
        if (ROOT/supplementary).exists():proposal_paths.append(supplementary)
    for proposal_path in proposal_paths:
        inputs[proposal_path]=digest(proposal_path)
        for proposal in read(proposal_path)['proposals']:
            p=proposal.get('path',proposal.get('file'));locale=proposal['locale'];identifier=proposal['entryId'];path=field_path(proposal['field'])
            assert locale in allowed_locales,'Unapproved correction locale'
            if p=='src/data/manufacturing/mock-translations.json':kind='mock';source=questions[(kind,identifier)];container=['locales',locale,identifier]
            elif p=='src/data/manufacturing/source-guide-translations.json':kind='guide';source=guides[identifier];container=['locales',locale,identifier]
            elif p=='src/data/manufacturing/translations/questions.'+locale+'.json':kind='weekly';source=questions[(kind,identifier)];container=['questions',identifier]
            else:
                assert p=='src/data/manufacturing/translations/'+locale+'.json','Unexpected correction target:'+str(p)
                kind='lesson';source=lessons[identifier];container=['lessons',identifier]
            if p not in cache:cache[p]=read(p);inputs[p]=digest(p)
            entry=at(cache[p],container);assert entry['sourceHash']==source['sourceHash'],'Stale translation source'
            actual_ja=at(source,canonical_path(kind,path));assert actual_ja==proposal.get('canonicalJapanese',proposal.get('sourceJa')),'Japanese field drift:'+identifier
            assert at(entry,path)==proposal['before'],'Prior translation drift:'+identifier
            if 'canonicalSourceHash' in proposal:assert proposal['canonicalSourceHash']==source['sourceHash']
            if 'sourceHash' in proposal:assert proposal['sourceHash']==source['sourceHash']
            if 'sourceTextSha256' in proposal:assert hashlib.sha256(actual_ja.encode()).hexdigest()==proposal['sourceTextSha256']
            if 'beforeSha256' in proposal:assert hashlib.sha256(proposal['before'].encode()).hexdigest()==proposal['beforeSha256']
            assert all(proposal.get(f,False) is False for f in ['nativeReviewed','domainReviewed','humanReviewed'])
            assert isinstance(proposal['after'],str) and proposal['after'].strip() and proposal['after']!=proposal['before']
            key=(kind,locale,identifier,tuple(path));assert key not in seen,'Duplicate correction field';seen.add(key)
            patches.append({'kind':kind,'locale':locale,'entryId':identifier,'sourceHash':source['sourceHash'],'fieldPath':path,'before':proposal['before'],'after':proposal['after']})
            receipts.append({'kind':kind,'locale':locale,'entryId':identifier,'fieldPath':path,'proposalPath':proposal_path,'sourceJapaneseSha256':hashlib.sha256(actual_ja.encode()).hexdigest(),'severity':proposal.get('severity','unspecified')})
    runtime={'schemaVersion':1,'status':'independent_ai_editorial_corrections','nativeReviewed':False,'domainReviewed':False,'patches':patches}
    evidence={'schemaVersion':1,'inputsSha256':inputs,'correctionFields':len(patches),'correctedEntries':len({(p['kind'],p['locale'],p['entryId']) for p in patches}),'kindCounts':{k:sum(p['kind']==k for p in patches) for k in ['lesson','guide','weekly','mock']},'receipts':receipts,'originalBanksModified':False,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'releaseReady':False}
    return runtime,evidence
def encoded(d):return json.dumps(d,ensure_ascii=False,indent=2)+'\n'
if __name__=='__main__':
    runtime,evidence=build();outputs={OUTPUT:runtime,STAGE+'integration/applied-corrections.json':evidence}
    if sys.argv[1:]==['--write']:
        with tempfile.TemporaryDirectory(prefix='review33-',dir=ROOT) as folder:
            staged=[]
            for index,(p,value) in enumerate(outputs.items()):
                temporary=Path(folder)/str(index);temporary.write_text(encoded(value));staged.append((p,temporary))
            for p,temporary in staged:os.replace(temporary,ROOT/p)
    else:
        assert not sys.argv[1:]
        for p,value in outputs.items():assert (ROOT/p).read_text()==encoded(value),'Stale editorial corrections:'+p
    print(json.dumps({k:evidence[k] for k in ['correctionFields','correctedEntries','kindCounts','originalBanksModified','nativeReviewed','domainReviewed']}))
