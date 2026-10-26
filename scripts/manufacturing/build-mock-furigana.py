"""Compile offline draft readings. Janome is authoring-only, never an app dependency."""
from pathlib import Path
import hashlib,json,re
from janome.tokenizer import Tokenizer

ROOT=Path(__file__).resolve().parents[2]
KANJI=re.compile(r'[一-龯々〆]')
tokenizer=Tokenizer()
overrides_path=ROOT/'src/data/manufacturing/mock-reading-overrides.json'
overrides=json.loads(overrides_path.read_text()) if overrides_path.exists() else {}
unknown=[]
def hira(text):
 return ''.join(chr(ord(c)-0x60) if '\u30a1'<=c<='\u30f6' else c for c in text)
def reading_parts(text,qid,field):
 parts=[]
 for token in tokenizer.tokenize(text):
  surface=token.surface
  reading=overrides.get(surface)
  if KANJI.search(surface) and not reading:
   candidate=token.reading
   if candidate and candidate!='*' and not KANJI.search(candidate):reading=hira(candidate)
  if KANJI.search(surface) and not reading:unknown.append({'questionId':qid,'field':field,'text':surface})
  if reading:parts.append({'text':surface,'reading':reading})
  elif parts and 'reading' not in parts[-1]:parts[-1]['text']+=surface
  else:parts.append({'text':surface})
 assert ''.join(p['text'] for p in parts)==text
 return parts
questions={}
for specialty in ['mechanical','electrical','surface']:
 data=json.loads((ROOT/f'src/data/manufacturing/mocks/{specialty}.json').read_text())
 for exam in data['exams']:
  for section in exam['sections'].values():
   for q in section['questions']:
    assert q['id'] not in questions
    questions[q['id']]={'sourceHash':q['sourceHash'],'stem':reading_parts(q['stemJa'],q['id'],'stem'),'options':[reading_parts(t,q['id'],str(i)) for i,t in enumerate(q['optionsJa'])]}
result={'sourceLocale':'ja','status':'offline_dictionary_draft','reviewedByNativeSpeaker':False,'generator':'Janome0.5.0 plus explicit reviewed overrides','allTextAligned':True,'unknownKanjiCount':len(unknown),'questions':questions}
(ROOT/'src/data/manufacturing/mock-furigana.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
out=ROOT/'docs/ssw-workspace/manufacturing/batch12/mock-furigana-qa.json';out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps({'questionCount':len(questions),'allTextAligned':True,'unknown':unknown,'nativeReviewed':False,'coverageDoesNotCertifyContextualReadings':True},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'questions':len(questions),'unknownKanji':len(unknown),'allTextAligned':True}))
