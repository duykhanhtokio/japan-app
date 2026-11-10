"""Bind independently authored source additions, full translations and offline ruby."""
from pathlib import Path
import hashlib
import json
import re
from janome.tokenizer import Tokenizer

ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / 'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
DATA = ROOT / 'src/data/food-manufacturing'
LOCALES = ['en','vi','id','zh-CN','zh-TW','th','hi','bn','ne','my','km','tl']
read = lambda p: json.loads(p.read_text())


def digest(title, text):
    return hashlib.sha256(json.dumps({'titleJa':title,'textJa':text}, ensure_ascii=False,
                                    sort_keys=True,separators=(',', ':')).encode()).hexdigest()


def main():
    original = read(AUDIT / 'source-teaching34.json')['sections']
    tail = AUDIT / 'source-teaching34-tail.json'
    if tail.exists():
        original += read(tail)['sections']
    translated = {}
    for suffix in 'abcd':
        for locale, entries in read(AUDIT / f'source-teaching34-translations-{suffix}.json')['translations'].items():
            assert locale not in translated, locale
            translated[locale] = entries
    assert set(translated) == set(LOCALES)
    lessons = {}
    for path in [DATA/'lessons.1.ja.json',DATA/'lessons.2.ja.json',
                 *sorted((DATA/'authoring-20261029').glob('part*.json'))]:
        lessons.update({l['id']:l for l in read(path)['lessons']})
    tokenizer = Tokenizer()
    def ruby(text):
        result = []
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
                reading = {'渣':'さ'}.get(t.surface,t.reading)
                assert reading != '*', 'Reading required: '+t.surface
                token['reading'] = ''.join(chr(ord(c)-96) if 'ァ' <= c <= 'ヶ' else c for c in reading)
            result.append(token)
        assert ''.join(t['text'] for t in result) == text
        return result
    sections = []
    for source in original:
        assert source['lessonSourceHash'] == lessons[source['lessonId']]['sourceHash']
        raw_hash = digest(source['titleJa'],source['textJa'])
        text = source['textJa']+'\n\n'+source['checkPromptJa']
        source_hash = digest(source['titleJa'],text)
        entries = {}
        for locale in LOCALES:
            t = translated[locale][source['id']]
            assert t['sourceHash'] == raw_hash, f'Stale translation: {locale}/{source["id"]}'
            assert all(isinstance(t.get(k),str) and t[k].strip() for k in ['title','text','checkPrompt'])
            entries[locale] = {'title':t['title'], 'text':t['text']+'\n\n'+t['checkPrompt'],
                                'sourceHash':source_hash}
        sections.append({'id':source['id'],'lessonId':source['lessonId'],
                         'lessonSourceHash':source['lessonSourceHash'],
                         'titleJa':source['titleJa'],'textJa':text,
                         'titleRuby':ruby(source['titleJa']),'ruby':ruby(text),
                         'sourceHash':source_hash,'sourceRefs':source['sourceRefs'],
                         'translations':entries,'status':'authored_ai_source_checked_not_human_certified',
                         'nativeReviewed':False,'domainReviewed':False,'pronunciationReviewed':False})
    result = {'schemaVersion':1,'sections':sections,'pendingLocales':[]}
    (DATA/'source-closure34.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'sections':len(sections),'fullTranslations':len(sections)*len(LOCALES),
                      'rubyFields':len(sections)*2,'nativeReviewed':False,'domainReviewed':False}))


if __name__ == '__main__':
    main()
