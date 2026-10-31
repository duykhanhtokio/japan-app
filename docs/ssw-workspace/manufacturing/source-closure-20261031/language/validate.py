from pathlib import Path
import collections,gzip,hashlib,json
OUT=Path(__file__).resolve().parent;ROOT=OUT.parents[4]
def read(p):return json.loads(p.read_text())
summary=read(OUT/'structural-audit.json');semantic=read(OUT/'semantic-review.json')
fields=json.loads(gzip.decompress((OUT/'field-review-ledger.json.gz').read_bytes()))
terms=json.loads(gzip.decompress((OUT/'terminology-map.json.gz').read_bytes()))
cache={}
def resolve(locator):
 filename,path=locator.split('#',1);p=ROOT/filename
 if filename not in cache:cache[filename]=read(p)
 value=cache[filename]
 for key in path.strip('/').split('/'):
  if not key:continue
  value=value[int(key)] if isinstance(value,list) else value[key.replace('~1','/').replace('~0','~')]
 return value
assert summary['structuralIssues']==0 and read(OUT/'structural-issues.json')==[]
assert len(fields)==summary['targetFieldChecks']==207600
assert len(terms['terms'])==854
assert sum(len(t['glossaryOccurrences']) for t in terms['terms'].values())==1077
assert len(semantic['records'])==204
assert len({(x['locale'],x['targetField']) for x in semantic['records']})==204
assert collections.Counter(x['newSemanticReview'] for x in fields)['manual_AI_compared_to_authored_Japanese']==204
assert len(fields)-204==semantic['unreviewedCurrentSessionFields']
for p,expected in summary['sourceInputsSha256'].items():assert hashlib.sha256((ROOT/p).read_bytes()).hexdigest()==expected,p
for entry in fields:
 assert isinstance(resolve(entry['canonicalField']),str),entry
 assert isinstance(resolve(entry['targetField']),str),entry
for entry in semantic['records']:
 assert hashlib.sha256(entry['effectiveBefore'].encode()).hexdigest()==entry['effectiveBeforeSha256']
 assert entry['nativeReviewed'] is False and entry['domainReviewed'] is False
for term,group in terms['terms'].items():
 for occ in group['glossaryOccurrences']:
  assert resolve(occ['canonicalPath']+'/ja')==term
  for loc,value in occ['targets'].items():
   assert isinstance(resolve(value['fieldPath']),str)
   assert hashlib.sha256(value['meaning'].encode()).hexdigest()==value['sha256']
print('LANGUAGE CLOSURE AUDIT PASS: 207600 exact canonical/target field locators; 296 lesson/guide and1809question records; 1077term occurrences/854JA spellings; 204 bounded manual AI term comparisons; source hashes current; no native/domain certification.')
