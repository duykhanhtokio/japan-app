"""Offline reading compilation for the frozen JA payload only; no runtime writes."""
from pathlib import Path
import hashlib,json,re
from janome.tokenizer import Tokenizer
OUT=Path(__file__).resolve().parent
ROOT=next(p for p in OUT.parents if (p/'AGENTS.md').exists())
source=json.loads((OUT/'final-authoring.json').read_text())
K=re.compile(r'[一-龯々〆]');tokenizer=Tokenizer();unknown=[]
overrides=json.loads((ROOT/'src/data/manufacturing/mock-reading-overrides.json').read_text())
overrides.update({'励磁':'れいじ','媒質':'ばいしつ','副尺':'ふくしゃく','本尺':'ほんじゃく','端数':'はすう','読取':'よみとり','下限':'かげん','上限':'じょうげん','肉厚':'にくあつ','開先':'かいさき','公差':'こうさ','符号':'ふごう','正電荷':'せいでんか','負電荷':'ふでんか','引力':'いんりょく','斥力':'せきりょく','拭':'しょく'})
def hira(s):return ''.join(chr(ord(c)-0x60) if '\u30a1'<=c<='\u30f6' else c for c in s)
SPECIAL={'本尺':'ほんじゃく','副尺':'ふくしゃく','最小読取値':'さいしょうよみとりち','読取値':'よみとりち','測定値':'そくていち','表示値':'ひょうじち','指示値':'しじち','基準値':'きじゅんち','目盛り値':'めもりち','清拭':'せいしょく'}
PATTERN=re.compile('('+'|'.join(re.escape(w) for w in sorted(SPECIAL,key=len,reverse=True))+')')
def tokens(text):
 for chunk in PATTERN.split(text):
  if not chunk:continue
  if chunk in SPECIAL:yield chunk,SPECIAL[chunk]
  else:
   for token in tokenizer.tokenize(chunk):yield token.surface,token.reading

def parts(text,qid,field):
 result=[]
 for value,candidate in tokens(text):
  rd=SPECIAL.get(value) or overrides.get(value)
  if value=='値':rd='あたい'
  if value=='負':rd='ふ'
  if K.search(value) and not rd:
   cand=candidate
   if cand and cand!='*' and not K.search(cand):rd=hira(cand)
  if K.search(value) and not rd:unknown.append({'id':qid,'field':field,'text':value})
  if rd:result.append({'text':value,'reading':rd})
  elif result and 'reading' not in result[-1]:result[-1]['text']+=value
  else:result.append({'text':value})
 assert ''.join(p['text'] for p in result)==text
 return result
count=0
for q in source['rationaleUpdates']+source['replacementQuestions']:
 a=q['afterQuestion'];qid=q['questionId']
 q['ruby']={'status':'offline_author_dictionary_checked_not_native','canonicalJaHash':q['canonicalJaHash'],'stem':parts(a['stemJa'],qid,'stem'),'options':[parts(t,qid,f'option{i}') for i,t in enumerate(a['optionsJa'])],'reasons':[parts(t,qid,f'reason{i}') for i,t in enumerate(a['optionReasonsJa'])]}
 count+=1
(OUT/'final-authoring.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
(OUT/'ruby-qa.json').write_text(json.dumps({'questionCount':count,'allTextAligned':True,'unknownKanji':unknown,'nativeReviewed':False,'overridesAdded':{k:overrides[k] for k in ['励磁','媒質','副尺','本尺','端数','読取','肉厚','開先','公差','符号','引力','斥力']},'canonicalJaBundleHash':source['canonicalJaBundleHash']},ensure_ascii=False,indent=2)+'\n')
print('Ruby',count,'unknown',len(unknown),unknown)
