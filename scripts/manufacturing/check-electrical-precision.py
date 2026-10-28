"""Read-only exact preservation, historical reconstruction and negative fixtures."""
from copy import deepcopy
from pathlib import Path
import json
import runpy
import tempfile

ROOT=Path(__file__).resolve().parents[2]
M=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-electrical-precision.py'))
require,encoded,digest=M['require'],M['encoded'],M['digest']


def validate():
    patch=M['load_patch']()
    inputs={p:(ROOT/p).read_bytes() for p in (M['SOURCE'],M['TRANSLATIONS'],M['FURIGANA'])}
    old=M['transform_files'](inputs,patch,forward=False)
    new=M['compile_outputs'](inputs,patch)
    require(M['compile_outputs'](new,patch)==new,'Precision replay not byte-idempotent')
    require(M['transform_files'](new,patch,forward=False)==old,'Precision predecessor not exactly reversible')
    old_source,new_source=[json.loads(x[M['SOURCE']]) for x in (old,new)]
    unchanged=0; revised=[]
    for a,b in zip(old_source['exams'],new_source['exams']):
        for name in a['sections']:
            for before,after in zip(a['sections'][name]['questions'],b['sections'][name]['questions']):
                if before['id'] in M['IDS']:
                    require(M['changed'](before,after)=={'stemJa','sourceHash'},'Unapproved Japanese field change')
                    revised.append(before['id'])
                else:
                    require(before==after,'Unrelated electrical question changed');unchanged+=1
        require((a['revision']!=b['revision'])==(a['id'] in patch['examRevisions']),'Unrelated exam revision changed')
    require(unchanged==398 and set(revised)==M['IDS'],'Wrong source preservation scope')
    old_t,new_t=[json.loads(x[M['TRANSLATIONS']]) for x in (old,new)]
    target_unchanged=0
    for locale,entries in old_t['locales'].items():
        for qid,before in entries.items():
            after=new_t['locales'][locale][qid]
            if qid in M['IDS']:
                require(M['changed'](before,after)=={'stem','sourceHash'},'Target options/rationales/provenance changed')
            else:
                require(before==after,'Unrelated target changed');target_unchanged+=1
    old_r,new_r=[json.loads(x[M['FURIGANA']]) for x in (old,new)]
    for qid,before in old_r['questions'].items():
        after=new_r['questions'][qid]
        require(M['changed'](before,after)=={'stem','sourceHash'} if qid in M['IDS'] else before==after,
                'Unrelated ruby/options changed')
    rejected=[]

    def rejects(label,action):
        try:
            action()
        except (ValueError,KeyError,AssertionError):
            rejected.append(label)
        else:
            raise AssertionError('Invalid precision fixture accepted: '+label)

    for path in inputs:
        rejects('unknown-file-'+Path(path).name,
                lambda path=path:M['compile_outputs']({**inputs,path:inputs[path]+b' '},patch))
    for label,mutator in [
        ('japanese-key',lambda p:p['patches'][0]['after'].__setitem__('correctIndex',0)),
        ('japanese-option',lambda p:p['patches'][0]['after']['optionsJa'].__setitem__(0,'changed')),
        ('japanese-rationale',lambda p:p['patches'][0]['after']['optionReasonsJa'].__setitem__(0,'changed')),
        ('runtime-review-status',lambda p:p['patches'][0]['after'].__setitem__('reviewStatus','independent_reviewed')),
        ('target-option',lambda p:p['patches'][0]['translations']['vi']['after']['options'].__setitem__(0,'changed')),
        ('target-rationale',lambda p:p['patches'][0]['translations']['en']['after']['reasons'].__setitem__(0,'changed')),
        ('target-binding',lambda p:p['patches'][0]['translations']['th']['after'].__setitem__('sourceHash','bad')),
        ('missing-locale',lambda p:p['patches'][0]['translations'].pop('km')),
        ('extra-locale',lambda p:p['patches'][0]['translations'].__setitem__('xx',p['patches'][0]['translations']['en'])),
        ('ruby-text',lambda p:p['patches'][0]['furigana']['after']['stem'][0].__setitem__('text','bad')),
        ('ruby-option',lambda p:p['patches'][0]['furigana']['after']['options'][0][0].__setitem__('text','bad')),
        ('extra-exam-revision',lambda p:p['examRevisions'].__setitem__('mfg1-electrical-mock-01',{'before':'x','after':'y'})),
        ('native-certification',lambda p:p['review'].__setitem__('nativeReviewed',True)),
        ('full-source-certification',lambda p:p['review'].__setitem__('fullSourceCertified',True)),
    ]:
        bad=deepcopy(patch);mutator(bad)
        rejects(label,lambda bad=bad:M['compile_outputs'](inputs,bad))

    # A separate temporary evidence root exercises semantic receipt bindings,
    # even if an attacker updates the patch's receipt digest to match a mutation.
    with tempfile.TemporaryDirectory(prefix='mfg-electrical-precision-') as td:
        root=Path(td)
        for path in patch['evidenceFiles']:
            p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes((ROOT/path).read_bytes())
        patchfile=root/M['PATCH_PATH']

        def load_bad(label,mutate_patch=None,receipt=None,mutate_receipt=None):
            bad=deepcopy(patch)
            original=None
            if receipt:
                p=root/receipt;original=p.read_bytes();value=json.loads(original);mutate_receipt(value)
                p.write_bytes(encoded(value));bad['evidenceFiles'][receipt]=digest(p.read_bytes())
            if mutate_patch:mutate_patch(bad)
            patchfile.write_bytes(encoded(bad))
            rejects(label,lambda:M['load_patch'](root))
            if original is not None:(root/receipt).write_bytes(original)

        load_bad('assembled-target-stem-not-reviewed',lambda p:p['patches'][0]['translations']['en']['after'].__setitem__('stem','Unreviewed different text'))

        def rehash_japanese(p):
            q=p['patches'][0]['after'];q['stemJa']+='追加。'
            q['sourceHash']=M['object_digest']({k:v for k,v in q.items() if k!='sourceHash'})
            r=p['patches'][0]['furigana']['after'];r['stem'].append({'text':'追加。'});r['sourceHash']=q['sourceHash']
            for t in p['patches'][0]['translations'].values():t['after']['sourceHash']=q['sourceHash']
        load_bad('assembled-japanese-rehashed-not-reviewed',rehash_japanese)
        base='docs/ssw-workspace/manufacturing/batch21/'
        load_bad('canonical-review-input-rebound',receipt=base+'canonical-review.json',
                 mutate_receipt=lambda r:r['canonicalRevisions'].__setitem__('sha256','bad'))
        load_bad('canonical-verdict-rebound',receipt=base+'canonical-review.json',
                 mutate_receipt=lambda r:r['reviews'][0].__setitem__('status','pending'))
        load_bad('canonical-ruby-review-rebound',receipt=base+'canonical-review.json',
                 mutate_receipt=lambda r:r['reviews'][0].__setitem__('furiganaAfterObjectSha256','bad'))
        load_bad('source-definition-overclaim-rebound',receipt=base+'source-review.json',
                 mutate_receipt=lambda r:r['findings'][0].__setitem__('directPdfDefinitionSupport',True))
        load_bad('target-review-verdict-rebound',receipt=base+'translation-review.json',
                 mutate_receipt=lambda r:r['locales']['en'][next(iter(M['IDS']))].__setitem__('verdict','pending'))
        load_bad('target-review-entry-rebound',receipt=base+'translation-review.json',
                 mutate_receipt=lambda r:r['locales']['vi'][next(iter(M['IDS']))].__setitem__('entrySha256','bad'))
    return {'status':'PASS','revisedJapaneseStems':2,'unchangedElectricalQuestions':unchanged,
            'reboundTargetStems':24,'unchangedOtherTargetRecords':target_unchanged,
            'revisedFuriganaStems':2,'byteIdempotent':True,'exactHistoricalReconstruction':True,
            'invalidFixturesRejected':len(rejected),'fixtures':rejected,
            'nativeReviewed':False,'domainReviewed':False,'fullSourceCertified':False}


if __name__=='__main__':
    print(json.dumps(validate()))
