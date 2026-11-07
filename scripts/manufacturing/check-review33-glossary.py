"""Verify the two AI glossary-reading ledgers against every actual Japanese and target definition."""
from pathlib import Path
from collections import Counter
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[2]
BASE='docs/ssw-workspace/manufacturing/batch33-full-review/'
CACHE={}
def read(p):
    if p not in CACHE:CACHE[p]=json.loads((ROOT/p).read_text())
    return CACHE[p]
def sha(p):return hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
def text_sha(text):return hashlib.sha256(text.encode()).hexdigest()
def build():
    lessons={};inputs={}
    for s in ['mechanical','electrical','surface']:
        p='src/data/manufacturing/'+s+'.json';inputs[p]=sha(p)
        lessons.update({l['id']:l for l in read(p)['lessons']})
    gp='src/data/manufacturing/source-guides.json';inputs[gp]=sha(gp);guides={g['id']:g for g in read(gp)['guides']}
    locales=read('docs/ssw-workspace/manufacturing/approved-scope.json')['targetLocales'];assert len(locales)==12
    sources={**lessons,**guides};expected={(identifier,index,locale) for identifier,source in sources.items() for index,_ in enumerate(source['terms']) for locale in locales};seen=set()
    def accept(row,locale,evidence_path):
        identifier=row['entryId'];index=row['termIndex'];key=(identifier,index,locale)
        assert key in expected and key not in seen,'Missing/duplicate/unknown reviewed term field:'+str(key)
        source=sources[identifier];term=source['terms'][index]
        assert row.get('canonicalSourceHash',row.get('sourceHash'))==source['sourceHash'],'Stale glossary source binding'
        if 'sourceJa' in row:assert row['sourceJa']==term['meaningJa']
        definition_hash=row.get('canonicalDefinitionSha256',row.get('canonicalJapaneseSha256'))
        if definition_hash:assert definition_hash==text_sha(term['meaningJa'])
        if identifier in guides:
            p='src/data/manufacturing/source-guide-translations.json';entry=read(p)['locales'][locale][identifier]
        else:
            p='src/data/manufacturing/translations/'+locale+'.json';entry=read(p)['lessons'][identifier]
        if p not in inputs:inputs[p]=sha(p)
        assert entry['sourceHash']==source['sourceHash']
        target_hash=row.get('targetMeaningSha256')
        if isinstance(target_hash,dict):target_hash=target_hash[locale]
        if target_hash:assert target_hash==text_sha(entry['terms'][index]['meaning']),'Stale target glossary reading'
        seen.add(key)
    paths=[('language-a/supplementary-terminology-review.json','items'),('language-a/terminology-round2-review.json','reviewedTerms'),('language-b/supplementary-terminology-review.json','ledger'),('language-b/terminology-round2-review.json','ledger')]
    reading_counts={}
    for relative,field in paths:
        p=BASE+relative;inputs[p]=sha(p);d=read(p)
        for flag in ['nativeReviewed','domainReviewed','humanReviewed','releaseReady']:assert d.get(flag,False) is False
        before=len(seen)
        for row in d[field]:
            if row.get('status')=='pending_semantic_read':continue
            for locale in row.get('localesActuallyCompared',row.get('locales',[row.get('locale')])):accept(row,locale,p)
        reading_counts[p]=len(seen)-before
    assert seen==expected,'Unreviewed glossary fields remain'
    per_locale=Counter(locale for _,_,locale in seen);assert all(per_locale[l]==1018 for l in locales)
    return {'schemaVersion':1,'date':'2026-10-29','scope':'AI semantic comparison of glossary definition occurrences only; repeated terms in different lessons are separate occurrences. Not whole-content or native/professional certification.','inputsSha256':inputs,'japaneseDefinitionOccurrences':1018,'targetLocales':locales,'targetDefinitionFieldsReviewed':len(seen),'reviewedByLocale':dict(sorted(per_locale.items())),'readingLedgerContributions':reading_counts,'glossaryAiReadComplete':True,'glossaryPendingFields':0,'fullContentSemanticReviewComplete':False,'officialTargetGlossaryCompared':False,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'physicalDeviceVerified':False,'releaseReady':False}
def encoded(d):return json.dumps(d,ensure_ascii=False,indent=2)+'\n'
if __name__=='__main__':
    result=build();p=ROOT/BASE/'glossary-review-index.json'
    if sys.argv[1:]==['--write']:p.write_text(encoded(result))
    else:assert not sys.argv[1:] and p.read_text()==encoded(result),'Stale glossary review index'
    print(json.dumps({k:result[k] for k in ['japaneseDefinitionOccurrences','targetDefinitionFieldsReviewed','glossaryAiReadComplete','glossaryPendingFields','fullContentSemanticReviewComplete','nativeReviewed','domainReviewed']}))
