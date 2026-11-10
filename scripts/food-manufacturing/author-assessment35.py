"""Compile additive ungraded practice from the frozen source-audit35 checks.

Reuse the verified34 label/hash contract, preserve each expected point, and never
modify the already tested34 packet or saved learner revisions.
"""
from pathlib import Path
import hashlib
import importlib.util
import json
import re
from types import SimpleNamespace
from janome.tokenizer import Tokenizer

ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / 'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
DATA = ROOT / 'src/data/food-manufacturing'
read = lambda path: json.loads(path.read_text())
sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()

spec = importlib.util.spec_from_file_location('assessment34_authoring_contract',
                                            Path(__file__).with_name('author-assessment34.py'))
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
LABELS, digest = base.LABELS, base.digest

# Same source-verified whole-term readings and context-only corner reading as34.
# This does not certify all pronunciation or change unrelated occurrences of角.
OVERRIDES = {'人時':'にんじ','原単位':'げんたんい','残渣':'ざんさ',
             '歩留り':'ぶどまり','工数':'こうすう','層別':'そうべつ',
             '次亜塩素酸ナトリウム':'じあえんそさんなとりうむ',
             '圧傷':'あっしょう','置場':'おきば','就活等':'しゅうかつとう'}


def ruby(text, tokenizer):
    stream, cursor = [], 0
    pattern = '|'.join(re.escape(term) for term in OVERRIDES) + r'|角(?=を丸く)'
    for match in re.finditer(pattern, text):
        stream.extend(tokenizer.tokenize(text[cursor:match.start()]))
        surface = match.group()
        stream.append(SimpleNamespace(surface=surface, reading=OVERRIDES.get(surface, 'かど')))
        cursor = match.end()
    stream.extend(tokenizer.tokenize(text[cursor:]))
    result = []
    for token in stream:
        item = {'text':token.surface}
        if re.search(r'[一-龯]', token.surface):
            assert token.reading != '*', f'Unknown kanji reading: {token.surface}'
            item['reading'] = ''.join(chr(ord(c)-96) if 'ァ' <= c <= 'ヶ' else c
                                      for c in token.reading)
            assert item['reading'].strip()
        result.append(item)
    assert ''.join(t['text'] for t in result) == text
    return result


def main():
    preserved_paths = [DATA/'source-assessment34.json', DATA/'source-closure34.json']
    preserved_hashes = {str(p.relative_to(ROOT)):sha(p) for p in preserved_paths}
    sources = [AUDIT/name for name in ['assessment35-previous-gaps.json',
                                      'assessment35-gaps.json',
                                      'assessment35-source-gaps.json']]
    source = []
    for path in sources:
        packet = read(path)
        assert packet.get('japaneseFrozen', True) is True
        source.extend(packet['newOpenResponseChecks'])
    assert len(source) == len({c['id'] for c in source}) == 21
    assert sum(len(c['expectedPointsJa']) for c in source) == 105
    ids = {c['id'] for c in source}
    translations = {}
    translation_paths = [AUDIT/f'assessment-check35-translations-{suffix}.json'
                         for suffix in 'abcd']
    for path in translation_paths:
        for locale, entries in read(path)['translations'].items():
            assert locale not in translations, f'Duplicate locale: {locale}'
            assert set(entries) == ids, f'Incomplete translation IDs: {locale}'
            translations[locale] = entries
    assert set(translations) == set(LABELS)-{'ja'}
    lessons = {}
    for path in [DATA/'lessons.1.ja.json', DATA/'lessons.2.ja.json',
                 *sorted((DATA/'authoring-20261029').glob('part*.json'))]:
        lessons.update({lesson['id']:lesson for lesson in read(path)['lessons']})
    tokenizer, checks = Tokenizer(), []
    for original in source:
        assert original['lessonSourceHash'] == lessons[original['lessonId']]['sourceHash']
        assert original.get('humanReviewed', False) is False
        item, source_hash = dict(original), digest(original)
        item['sourceHash'] = source_hash
        item['titleRuby'] = ruby(item['titleJa'], tokenizer)
        item['promptRuby'] = ruby(item['promptJa'], tokenizer)
        item['expectedPointsRuby'] = [ruby(point, tokenizer) for point in item['expectedPointsJa']]
        item['translations'] = {}
        for locale, pack in translations.items():
            translated = pack[item['id']]
            assert translated['sourceHash'] == source_hash, f'Stale translation: {locale}/{item["id"]}'
            assert all(isinstance(translated.get(k),str) and translated[k].strip()
                       for k in ['title','prompt'])
            assert len(translated['expectedPoints']) == len(item['expectedPointsJa'])
            assert all(isinstance(point,str) and point.strip() for point in translated['expectedPoints'])
            item['translations'][locale] = translated
        item['runtimeIntegrated'] = True
        item['status'] = 'ai_source_checked_open_response_not_human_certified'
        checks.append(item)
    old_ids = {c['id'] for c in read(DATA/'source-assessment34.json')['checks']}
    assert not (old_ids & ids), 'New practice must remain additive'
    result = {'schemaVersion':1, 'checks':checks,
              'uiLabels':{locale:{'show':pair[0],'hide':pair[1]}
                          for locale,pair in LABELS.items()},
              'graded':False, 'mutatesLearnerProgress':False,
              'humanReviewed':False, 'nativeReviewed':False, 'domainReviewed':False}
    output = DATA/'source-assessment35.json'
    output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    assert all(sha(ROOT/path) == digest_value for path,digest_value in preserved_hashes.items())
    report = {'status':'PASS_STRUCTURAL_SOURCE_BINDINGS_NOT_NATIVE_CERTIFICATION',
              'checks':21,'fullLocaleTranslations':21*12,
              'japaneseExpectedPoints':105,'translatedExpectedPoints':105*12,
              'rubyFields':sum(2+len(c['expectedPointsJa']) for c in checks),
              'rubyTextAlignment':'PASS','unknownKanjiReadings':0,
              'inheritedWholeTermReadings':OVERRIDES,
              'contextCornerReading':'角を丸く→かど',
              'additionalVerifiedReading':{'surface':'就活等','reading':'しゅうかつとう',
                                           'sourceDocument':'ssw2','pdfPage':29,
                                           'evidence':'frozen_PDF_furigana_visually_read'},
              'inputSha256':{str(p.relative_to(ROOT)):sha(p)
                             for p in [*sources,*translation_paths,Path(__file__).resolve(),
                                       Path(__file__).resolve().with_name('author-assessment34.py')]},
              'outputSha256':sha(output),'preserved34Sha256':preserved_hashes,
              'graded':False,'mutatesLearnerProgress':False,
              'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False}
    (AUDIT/'assessment35-runtime-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k in ['status','checks',
        'fullLocaleTranslations','japaneseExpectedPoints','translatedExpectedPoints',
        'rubyFields','unknownKanjiReadings','outputSha256']}))


if __name__ == '__main__':
    main()
