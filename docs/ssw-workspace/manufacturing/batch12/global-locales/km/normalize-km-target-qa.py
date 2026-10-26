from pathlib import Path
import json,hashlib
P=Path(__file__).parent
# Reviewed Khmer wording only. Canonical Japanese, glossary JA and readings remain untouched.
REPL={**{f' ({s})':''for s in ['整理','整頓','清掃','清潔','躾','定位','定品','定量']},'ឯកតាមូលដ្ឋាន SI មាន 7៖':'ឯកតាមូលដ្ឋាន SI មាន ប្រាំពីរ៖','គុណតម្លៃកំពូលបាត12Vពីរដងថែម':'គុណតម្លៃកំពូលបាត12V2ដងថែម'}
changed=[]
def clean(v,key=None):
 if key in ['ja','reading']:return v
 if isinstance(v,str):
  for a,b in REPL.items():v=v.replace(a,b)
  return v
 if isinstance(v,list):return[clean(x)for x in v]
 if isinstance(v,dict):return{k:clean(x,k)for k,x in v.items()}
 return v
for f in P.rglob('*.json'):
 if 'qa'in f.name or 'checkpoint'in f.name or 'provenance'in f.name:continue
 raw=f.read_bytes();x=json.loads(raw);y=clean(x)
 if x!=y:
  f.write_text(json.dumps(y,ensure_ascii=False,indent=2)+'\n');changed.append({'path':str(f.relative_to(P)),'beforeSha256':hashlib.sha256(raw).hexdigest(),'afterSha256':hashlib.sha256(f.read_bytes()).hexdigest()})
(P/'target-wording-cleanup-qa.json').write_text(json.dumps({'locale':'km','status':'ai_checked_draft','nativeReviewed':False,'domainReviewed':False,'changes':changed,'reason':'Remove redundant parenthetical Japanese labels from already complete Khmer prose; retain glossary JA and readings. Spell seven as Khmer where source uses 七, retain all SI unit information. Write 2 as digit where source uses 2倍 in one reason.'},ensure_ascii=False,indent=2)+'\n')
print('Reviewedtargetwording normalization files',len(changed))
