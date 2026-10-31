"""Aligned dictionary candidates for source31 runtime only; no native approval claim.
Reuse the existing conservative reading rules without running their bank writer.
Translation identities continue to bind the literal Japanese text, not annotation.
"""
from pathlib import Path
import sys,json,collections,subprocess

def annotate(rows, root):
 engine=root/'scripts/restaurant/build-furigana.py'
 prefix=engine.read_text().split("if '--self-test' in sys.argv:",1)[0]
 # A sparse checkout may omit the unchanged shared lexicon. Read its tracked
 # object directly rather than silently dropping readings or writing outside scope.
 needle='def read(p):return json.loads(p.read_text())'
 replacement='def read(p):return _source31_read(p)'
 assert prefix.count(needle)==1
 prefix=prefix.replace(needle,replacement)
 def source_read(path):
  if path.is_file():return json.loads(path.read_text())
  relative=path.relative_to(root).as_posix()
  return json.loads(subprocess.check_output(['git','show','HEAD:'+relative],cwd=root))
 saved=sys.argv;sys.argv=[str(engine),'--self-test']
 scope={'__file__':str(engine),'__name__':'restaurant_source31_reading_candidates','_source31_read':source_read}
 try:exec(compile(prefix,str(engine),'exec'),scope)
 finally:sys.argv=saved
 ruby=scope['ruby'];counts=collections.Counter()
 for row in rows.values():
  for s in row['sections']:
   s['furigana']={'title':ruby(s['titleJa']),'text':ruby(s['textJa'])};counts['sections']+=1
  for q in (row['exam'] or {}).get('questions',[]):
   q['furigana']={'stem':ruby(q['stemJa']),'options':[ruby(t) for t in q['optionsJa']],'explanation':ruby(q['explanationJa'])}
   q['reasonRuby']=[ruby(t) for t in q['optionReasonsJa']];counts['questions']+=1
 report={'status':'aligned_dictionary_candidates','nativeReviewed':False,'contextReviewComplete':False,'runtimeFieldsOnly':True,'counts':dict(counts),'stats':dict(scope['stats']),'unknownKanji':dict(scope['missing'].most_common()),'limitation':'Unknown/ambiguous compounds remain unannotated; literal segment alignment does not certify contextual pronunciation.'}
 return report
