"""Screen revision-bound supplement translations for changed Arabic/local digits.
Flags require contextual review; word-numbers and date conversion are not auto-errors.
"""
from pathlib import Path
import json,re,unicodedata,collections
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/restaurant/source-closure31';DATA=R/'src/data/restaurant/source31'
read=lambda p:json.loads(p.read_text())
def numbers(text,locale="ja"):
 s=unicodedata.normalize('NFKC',text).replace('−','-').replace('～','~')
 s=''.join(str(unicodedata.digit(c)) if c.isdigit() and c.isdecimal() else c for c in s)
 s=re.sub(r'令和(\d+)年',lambda m:str(2018+int(m.group(1)))+'年',s)
 for word,num in [('一万円','10000円'),('五千円','5000円'),('二千円','2000円'),('千円','1000円'),('五百円','500円'),('百円','100円'),('五十円','50円'),('十円','10円'),('五円','5円'),('一円','1円')]:s=s.replace(word,num)
 s=re.sub(r'(?<!\d)[1-9]\d{0,2}(?:[.,]\d{3})+(?!\d)',lambda m:m.group().replace(',','').replace('.',''),s)
 if locale=='id':s=re.sub(r'(?<=\d),(?=\d)','.',s)
 s=re.sub(r'CO[₂2]','COtwo',s)
 return collections.Counter(re.findall(r'(?<!\d)\d+(?:\.\d+)?',s))
canonical=read(D/'canonical-ja.json')['items'];flags=[];fields=0;coverage={}
for locale in ['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']:
 targets=read(DATA/f'{locale}.json')['items'];coverage[locale]=len(targets)
 for id,t in targets.items():
  source=canonical[id];assert t['sourceHash']==source['sourceHash']
  pairs=[('title','titleJa'),('text','textJa')] if source['kind'] in ['section','reference'] else [('title','termJa'),('text','explanationJa')] if source['kind']=='term' else [('caption','captionJa'),('alt','altJa')] if source['kind']=='figure' else [('stem','stemJa'),('objective','objectiveJa'),('explanation','explanationJa')]
  values=[(key,source[jakey],t[key]) for key,jakey in pairs]
  if source['kind']=='question':
   values += [(f'options[{i}]',a,b) for i,(a,b) in enumerate(zip(source['optionsJa'],t['options']))]
   values += [(f'reasons[{i}]',a,b) for i,(a,b) in enumerate(zip(source['optionReasonsJa'],t['reasons']))]
  for field,ja,target in values:
   fields+=1;a=numbers(ja);b=numbers(target,locale)
   if set(a)!=set(b):flags.append(dict(locale=locale,id=id,field=field,sourceNumbers=dict(a),targetNumbers=dict(b),sourceJa=ja,target=target,status='needs_context_review'))
report=dict(status='CONTEXT_REVIEW_REQUIRED' if flags else 'SCREEN_PASS',fields=fields,coverage=coverage,flags=flags,semanticReviewComplete=False,nativeReviewed=False,normalizationNotes=['Era year converted arithmetically','Common yen denominations normalized','Locale grouping separators normalized; Indonesian decimal comma normalized','Repeated occurrence counts do not imply changed quantities; only value-set differences flagged','CO2 formula digit excluded; word numerals remain context-review flags'])
(D/'translation-number-screen.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(status=report['status'],fields=fields,flags=len(flags),flagCounts=dict(collections.Counter(f['locale'] for f in flags)))))
