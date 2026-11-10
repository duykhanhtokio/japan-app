"""Match each numeric screen flag to an authored exact-field context review.
No automatic acceptance of date conversion/word numerals without a pinned review.
"""
from pathlib import Path
import json,hashlib,re,sys
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/restaurant/source-closure31';read=lambda p:json.loads(p.read_text());sha=lambda s:hashlib.sha256(s.encode()).hexdigest();screen=read(D/'translation-number-screen.json');locales=set(screen['coverage']);candidates=[]
fields=['targetFieldTextSha256','targetFieldSha256','targetSha256','screenTargetSha256']
def visit(v,path,locale=None):
 if isinstance(v,list):
  for x in v:visit(x,path,locale)
 elif isinstance(v,dict):
  loc=v.get('locale',locale)
  if v.get('id') and v.get('field') and v.get('decision'):
   hashes=[v[k] for k in fields if v.get(k)]
   if hashes:
    field=re.sub(r'^(options|reasons)[./](\d+)$',r'\1[\2]',v['field']);candidates.append(dict(locale=loc,id=v['id'],field=field,hashes=hashes,decision=v['decision'],note=v.get('contextNote') or v.get('reviewNote') or v.get('reason') or '',receipt=str(path.relative_to(R))))
  for child in v.values():
   if isinstance(child,(dict,list)):visit(child,path,loc)
for path in (D/'translations').rglob('*.json'):
 if not re.search('number|numeric|completion',path.name):continue
 locale=next((part for part in path.parts if part in locales),None)
 if 'my-service1' in path.parts:locale='my'
 visit(read(path),path,locale)
matched=[];unmatched=[]
for f in screen['flags']:
 h=sha(f['target']);hits=[r for r in candidates if r['locale']==f['locale'] and r['id']==f['id'] and r['field']==f['field'] and h in r['hashes'] and r['note']]
 if hits:matched.append(dict(locale=f['locale'],id=f['id'],field=f['field'],targetFieldSha256=h,receipt=hits[0]['receipt'],decision=hits[0]['decision'],contextNote=hits[0]['note']))
 else:unmatched.append(dict(locale=f['locale'],id=f['id'],field=f['field'],targetFieldSha256=h))
report=dict(status='PASS_AI_CONTEXT_REVIEWS' if not unmatched else 'REVIEW_PENDING',screenSha256=hashlib.sha256((D/'translation-number-screen.json').read_bytes()).hexdigest(),screenFlags=len(screen['flags']),matchedCount=len(matched),unmatched=unmatched,matched=matched,nativeReviewed=False,domainReviewed=False,limitation='AI authors reviewed the meaning of flagged numerical expressions; this gate only verifies the exact current target field and receipt binding. It is not native/expert certification or independent semantic proof.')
(D/'numeric-context-final-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ['matched','limitation']}))
if '--require-complete' in sys.argv:assert not unmatched,'Every current numeric flag requires an exact-field authored disposition'
