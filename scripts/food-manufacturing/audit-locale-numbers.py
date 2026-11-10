#!/usr/bin/env python3
"""Flag numeric differences for AI/editorial review; worded numbers are not errors."""
import json,pathlib,re,unicodedata,collections
root=pathlib.Path(__file__).resolve().parents[2];data=root/'src/data/food-manufacturing'
lessons={l['id']:l for level in ('1','2') for l in json.loads((data/f'lessons.{level}.ja.json').read_text())['lessons']}
def numbers(text):
 text=unicodedata.normalize('NFKC',text);out=''
 for c in text:
  try:out+=str(unicodedata.digit(c))
  except (TypeError,ValueError):out+=c
 return collections.Counter(re.findall(r'\d+(?:\.\d+)?',out))
flags=[];counts={}
for locale in ['hi','bn','ne','my','th','km','tl']:
 path=data/'translations'/f'{locale}.json';pack=json.loads(path.read_text());counts[locale]=len(pack)
 for lid,t in pack.items():
  l=lessons[lid];pairs=[('title',l['titleJa'],t['title']),('objective',l['objectiveJa'],t['objective']),('activity',l['activityJa'],t['activity']),('summary',l['summaryJa'],t['summary'])]
  pairs += [(f'paragraph:{p["id"]}',p['textJa'],t['paragraphs'][p['id']]) for p in l['paragraphs']]
  for field,ja,target in pairs:
   a,b=numbers(ja),numbers(target)
   if a!=b:flags.append({'locale':locale,'lessonId':lid,'field':field,'sourceNumbers':dict(a),'targetNumbers':dict(b),'status':'needs_semantic_review_not_automatic_error'})
report={'lessonCounts':counts,'numericReviewCandidates':flags,'meaning':'Unicode digits normalized; numbers written in words and redistributed headings can be valid. No automatic correction.'}
out=root/'docs/ssw-workspace/food-manufacturing/batch-03-numeric-audit.json';out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'lessonCounts':counts,'numericCandidates':len(flags)},ensure_ascii=False))
