"""Rebuild runtime-only locale packs from unchanged canonical authoring JSON."""
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
LOCALES=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
def read(p):return json.loads((ROOT/p).read_text())
def write(p,value):
 out=ROOT/p;payload=json.dumps(value,ensure_ascii=False,separators=(',',':'))+'\n'
 if '--check' in sys.argv:assert out.read_text()==payload,'Runtime pack drift: '+p
 else:out.parent.mkdir(parents=True,exist_ok=True);out.write_text(payload)
base='src/data/manufacturing/'
for locale,entries in read(base+'mock-translations.json')['locales'].items():write(base+'mock-locales/'+locale+'.json',entries)
base='src/data/food-manufacturing/'
parts=[read(base+f'authoring-20261029/part{i}.json') for i in range(1,7)]
for kind in ['lessons','exams'] :write(base+'runtime-supplemental/'+kind+'.json',[entry for part in parts for entry in part.get(kind,[])])
for kind,field in [('lesson-ruby','ruby'),('question-ruby','questionRuby')]:
 entries={}
 for part in parts:entries.update(part.get(field,{}).get('lessons' if field=='ruby' else 'questions',{}))
 write(base+'runtime-supplemental/'+kind+'.json',entries)
for locale in LOCALES:
 lessons={};questions={};titles={}
 for part in parts:
  lessons.update(part['translations'].get(locale,{}));pack=part.get('testTranslations',{}).get(locale,{})
  questions.update(pack.get('questions',{}));titles.update(pack.get('examTitles',{}))
 write(base+'runtime-supplemental/lessons.'+locale+'.json',lessons)
 write(base+'runtime-supplemental/tests.'+locale+'.json',dict(questions=questions,examTitles=titles))
print('Runtime locale packs '+('verified' if '--check' in sys.argv else 'rebuilt')+' without modifying canonical authoring inputs.')
