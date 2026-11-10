"""Reproduce integrity/coverage checks; does not substitute for recorded semantic reading."""
from pathlib import Path
import hashlib,json,collections
P=Path(__file__).resolve().parent
H=lambda x:hashlib.sha256(x).hexdigest()
def main():
 report=json.loads((P/'semantic-decisions.json').read_text());inputs={l:json.loads((P.parent/'language/term-review-inputs'/f'{l}.json').read_text())for l in ['my','th']}
 seen=set();counts=collections.Counter();corrections=collections.Counter()
 for l,source in inputs.items():
  assert len(source['records'])==1077
  assert len({r['key'] for r in source['records']})==1077
  assert H((P.parent/'language/term-review-inputs'/f'{l}.json').read_bytes())==report['inputFileSha256'][l]
 for row in report['decisions']:
  locale=row['locale'];r=next(x for x in inputs[locale]['records'] if x['key']==row['key']);ident=(locale,row['key']);assert ident not in seen;seen.add(ident)
  assert row['key']==r['key'] and row['targetSha256']==r['targetSha256']==H(r['target'].encode())
  for k in ['termJa','meaningJa','targetField','lessonSourceHash']:assert row[k]==r[k]
  assert row['contextnote'] and not any(row[k]for k in ['nativeReviewed','domainReviewed','humanReviewed'])
  if 'after'in row:
   assert row['before']==r['target'] and row['after']!=row['before'] and row['afterSha256']==H(row['after'].encode());corrections[locale]+=1
  counts[locale]+=1
 assert counts=={'my':1077,'th':1077}
 assert report['actuallyReadSlots']==report['expectedSlots']==2154 and report['pendingUnreadSlots']==0 and not report['pending'] and report['allSlotsActuallyReviewed']
 result={'result':'PASS','slots':dict(counts),'totalSlots':2154,'unread':0,'proposedCorrections':dict(corrections),'totalProposedCorrections':sum(corrections.values()),'scope':'Integrity checks only; semantic evidence resides in explicit read batches and per-record decisions.','semanticDecisionsSha256':H((P/'semantic-decisions.json').read_bytes())}
 (P/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result))
if __name__=='__main__':main()
