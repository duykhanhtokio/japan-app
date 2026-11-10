"""Build offline, source-aligned reading candidates. Requires fugashi/unidic-lite.

No tokenizer or translation service is shipped in the app. Readings are a
separate derived layer, so adding them does not reset lesson progress/revisions.
Unknown kanji remain a validation failure rather than receiving invented kana.
"""
from pathlib import Path
import hashlib,json,re
from fugashi import Tagger

ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'src/data/hospitality'
DOC=ROOT/'docs/ssw-workspace/hospitality'
HAN=re.compile(r'[一-龯々〆]')
tagger=Tagger()
def hira(s):
    return ''.join(chr(ord(c)-96) if 'ァ'<=c<='ヶ' else c for c in s)
def write(p,d):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':'))+'\n')

# Whole compounds take priority over dictionary segmentation. Glossary entries
# below supplement these with the canonical author-supplied term readings.
lexicon={
 # Hotel-1 PDF p8/p9: read the whole date compound, not 日=ひ.
 '宿泊日':'しゅくはくび',
 # Hotel-1 p7 / Hotel-2 p10: desired accommodation date.
 '希望日':'きぼうび',
 # Hotel-2 p48 beverage name, not the dictionary's 日本=ニッポン default.
 '日本酒':'にほんしゅ',
 '一汁三菜':'いちじゅうさんさい','水菓子':'みずがし','香の物':'こうのもの',
 '椀盛':'わんもり','燗酒':'かんざけ','冷酒':'れいしゅ','食物':'しょくもつ',
 '次亜塩素酸ナトリウム':'じあえんそさんなとりうむ',
 '腸管出血性大腸菌':'ちょうかんしゅっけつせいだいちょうきん',
 '二方向避難':'にほうこうひなん','会釈':'えしゃく','最敬礼':'さいけいれい',
 '謙譲語':'けんじょうご','尊敬語':'そんけいご','吐物':'とぶつ',
 '入湯税':'にゅうとうぜい','客室':'きゃくしつ','客層':'きゃくそう',
 '下膳':'げぜん','配膳':'はいぜん','什器':'じゅうき','防除':'ぼうじょ',
 '手指':'しゅし','一人':'ひとり','二人':'ふたり','一泊':'いっぱく',
 '二泊':'にはく','三泊':'さんぱく','二食':'にしょく',
 # Context review of the actual course found dictionary defaults such as
 # 一日=ついたち (here a whole day), 室=むろ, and 四本=よんぽん.
 '一日':'いちにち','室':'しつ','乳':'にゅう','鏡':'かがみ',
 '空の':'からの','空容器':'からようき','配膳札':'はいぜんふだ',
 '縁':'ふち','一本':'いっぽん','二本':'にほん','三本':'さんぼん',
 '四本':'よんほん','何本':'なんぼん','何室':'なんしつ',
 '何時':'なんじ','何日':'なんにち','何度':'なんど','何階':'なんかい',
 '何の':'なんの','何':'なに',
}
groups=['front','planning','service','restaurant','safety']
lessons=[]
for group in groups:
    lessons+=json.loads((DATA/(group+'.json')).read_text())['lessons']
lessons+=json.loads((DATA/'mocks.json').read_text())['mocks']
groups+=['mock']
for l in lessons:
    for t in l['terms']:
        if HAN.search(t['ja']):lexicon.setdefault(t['ja'],t['reading'])
pattern=re.compile('|'.join(re.escape(s) for s in sorted(lexicon,key=len,reverse=True)))
def tokens(text):
    result=[];cursor=0
    for m in pattern.finditer(text):
        result+=dictionary(text[cursor:m.start()])
        result.append({'text':m.group(),'reading':hira(lexicon[m.group()])})
        cursor=m.end()
    result+=dictionary(text[cursor:])
    # Hotel-2 p48: raw rice among sake ingredients is こめ. Apply on the
    # full text after lexicon splitting so 麹 matches do not hide the context.
    cursor=0
    for t in result:
        if t['text']=='米' and text.startswith('米・麹・水',cursor):
            t['reading']='こめ'
        cursor+=len(t['text'])
    assert ''.join(t['text'] for t in result)==text
    return result
unknown={}
def dictionary(text):
    parts=[];cursor=0
    for t in tagger(text):
        start=text.find(t.surface,cursor)
        if start>cursor:parts.append({'text':text[cursor:start]})
        part={'text':t.surface}
        if HAN.search(t.surface):
            kana=t.feature.kana
            if not kana or not re.fullmatch(r'[ァ-ヶー]+',kana):
                unknown[t.surface]=unknown.get(t.surface,0)+1
            else:part['reading']=hira(kana)
        parts.append(part);cursor=start+len(t.surface)
    if cursor<len(text):parts.append({'text':text[cursor:]})
    return parts

def strings(l):
    yield l['title']
    for o in l['objectives']:yield o['text']
    for s in l['sections']:yield s['title'];yield s['body']
    for t in l['terms']:yield t['meaning']
    yield l['example']['situation'];yield from l['example']['steps']
    yield l['practice']['prompt'];yield from l['practice']['expectedPoints']
    yield l['illustration']['caption'];yield l['illustration']['alt']
    for q in l['questions']:
        yield q['prompt'];yield from q['choices'];yield q['explanation']

summary=[]
for group in groups:
    entries={};bindings={}
    for l in [l for l in lessons if l['id'].split('-')[1]==group]:
        values=[s for s in strings(l) if HAN.search(s)]
        for s in values:
            cursor=0;spans=[]
            for t in tokens(s):
                length=len(t['text'].encode('utf-16-le'))//2
                if t.get('reading'):spans.append([cursor,length,t['reading']])
                cursor+=length
            entries[s]=spans
        bindings[l['id']]={'sourceRevision':l['revision'],'textCount':len(values)}
    write(DATA/'readings'/(group+'.json'),{'schemaVersion':1,'status':'dictionary_candidate_ai_unreviewed','lessons':bindings,'entries':entries})
    summary.append({'group':group,'uniqueTexts':len(entries),'kanjiSegments':sum(map(len,entries.values()))})
write(DOC/'reading-build-status.json',{'schemaVersion':1,'generator':'fugashi + unidic-lite; explicit hospitality compounds and canonical terms','groups':summary,'unknownKanjiTokens':unknown,'nativeReviewed':False,'domainReviewed':False,'contextualReadingsAccepted':False})
print(json.dumps({'groups':summary,'unknown':unknown},ensure_ascii=False))
if unknown:raise SystemExit(1)
