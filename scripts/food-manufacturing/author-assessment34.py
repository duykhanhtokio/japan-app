"""Build ungraded source-bound practice, retaining every expected point and locale."""
from pathlib import Path
import hashlib
import json
import re
from janome.tokenizer import Tokenizer

ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / 'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
DATA = ROOT / 'src/data/food-manufacturing'
read = lambda p: json.loads(p.read_text())
LABELS = {
    'ja': ['ポイントをみる','ポイントをとじる'],
    'en': ['Show key points','Hide key points'],
    'vi': ['Xem ý trả lời','Ẩn ý trả lời'],
    'id': ['Lihat poin jawaban','Sembunyikan poin jawaban'],
    'zh-CN': ['查看要点','隐藏要点'], 'zh-TW': ['查看要點','隱藏要點'],
    'th': ['ดูประเด็นคำตอบ','ซ่อนประเด็นคำตอบ'],
    'hi': ['उत्तर के मुख्य बिंदु देखें','उत्तर के मुख्य बिंदु छिपाएँ'],
    'bn': ['উত্তরের মূল বিষয় দেখুন','উত্তরের মূল বিষয় লুকান'],
    'ne': ['उत्तरका मुख्य बुँदा हेर्नुहोस्','उत्तरका मुख्य बुँदा लुकाउनुहोस्'],
    'my': ['အဖြေ၏ အဓိကအချက်များကို ကြည့်ရန်','အဖြေ၏ အဓိကအချက်များကို ဖျောက်ရန်'],
    'km': ['មើលចំណុចសំខាន់នៃចម្លើយ','លាក់ចំណុចសំខាន់នៃចម្លើយ'],
    'tl': ['Ipakita ang mahahalagang punto','Itago ang mahahalagang punto'],
}


def digest(check):
    return hashlib.sha256(json.dumps({k:check[k] for k in ['titleJa','promptJa','expectedPointsJa']},
                                    ensure_ascii=False,sort_keys=True,separators=(',', ':')).encode()).hexdigest()


def main():
    source = read(AUDIT / 'assessment-link34.json')['newOpenResponseChecks']
    translations = {}
    for suffix in 'abcd':
        for locale, entries in read(AUDIT / f'assessment-check34-translations-{suffix}.json')['translations'].items():
            assert locale not in translations
            translations[locale] = entries
    assert set(translations) == set(LABELS)-{'ja'}
    lessons = {}
    for path in [DATA/'lessons.1.ja.json',DATA/'lessons.2.ja.json',
                 *sorted((DATA/'authoring-20261029').glob('part*.json'))]:
        lessons.update({l['id']:l for l in read(path)['lessons']})
    tokenizer = Tokenizer()
    def ruby(text):
        tokens = []
        overrides = {'人時':'にんじ','原単位':'げんたんい','残渣':'ざんさ','歩留り':'ぶどまり','工数':'こうすう','層別':'そうべつ','次亜塩素酸ナトリウム':'じあえんそさんなとりうむ','圧傷':'あっしょう','置場':'おきば'}
        from types import SimpleNamespace
        token_stream = []
        cursor = 0
        pattern = '|'.join(re.escape(term) for term in overrides)+r'|角(?=を丸く)'
        for match in re.finditer(pattern, text):
            token_stream.extend(tokenizer.tokenize(text[cursor:match.start()]))
            surface = match.group()
            token_stream.append(SimpleNamespace(surface=surface, reading=overrides.get(surface,'かど')))
            cursor = match.end()
        token_stream.extend(tokenizer.tokenize(text[cursor:]))
        for t in token_stream:
            token = {'text':t.surface}
            if re.search(r'[一-龯]',t.surface):
                assert t.reading != '*', t.surface
                token['reading'] = ''.join(chr(ord(c)-96) if 'ァ' <= c <= 'ヶ' else c for c in t.reading)
            tokens.append(token)
        assert ''.join(t['text'] for t in tokens) == text
        return tokens
    checks = []
    for original in source:
        assert original['lessonSourceHash'] == lessons[original['lessonId']]['sourceHash']
        item = dict(original)
        source_hash = digest(item)
        item['sourceHash'] = source_hash
        item['titleRuby'] = ruby(item['titleJa'])
        item['promptRuby'] = ruby(item['promptJa'])
        item['expectedPointsRuby'] = [ruby(point) for point in item['expectedPointsJa']]
        item['translations'] = {}
        for locale, pack in translations.items():
            t = pack[item['id']]
            assert t['sourceHash'] == source_hash, f'Stale check translation: {locale}/{item["id"]}'
            assert all(isinstance(t.get(k),str) and t[k].strip() for k in ['title','prompt'])
            assert len(t['expectedPoints']) == len(item['expectedPointsJa'])
            assert all(isinstance(point,str) and point.strip() for point in t['expectedPoints'])
            item['translations'][locale] = t
        item['runtimeIntegrated'] = True
        item['status'] = 'ai_source_checked_open_response_not_human_certified'
        checks.append(item)
    result = {'schemaVersion':1,'checks':checks,
              'uiLabels':{locale:{'show':pair[0],'hide':pair[1]} for locale,pair in LABELS.items()},
              'graded':False,'mutatesLearnerProgress':False,
              'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False}
    (DATA/'source-assessment34.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'checks':len(checks),'fullTranslations':len(checks)*12,
                      'expectedPoints':sum(len(c['expectedPointsJa']) for c in checks),
                      'graded':False,'mutatesLearnerProgress':False}))


if __name__ == '__main__':
    main()
