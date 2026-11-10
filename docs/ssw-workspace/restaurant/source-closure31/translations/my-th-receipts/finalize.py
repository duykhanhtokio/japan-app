from pathlib import Path
import subprocess,json,re
B=Path(__file__).resolve().parents[2];r=[]
for l in ['my','th']:
 for sh in ['hygiene1','hygiene2','operations2','cooking-service2','integration']+(['service1'] if l=='th' else []):
  p=subprocess.run(['python',str(B/'translations/my-th-receipts/validate.py'),l,sh],capture_output=True,text=True);assert p.returncode==0,p.stderr;r.append(json.loads(p.stdout));o=json.loads((B/f'translations/{l}/{sh}.json').read_text())
  for id,v in o['items'].items():
   for k,x in v.items():
    if k=='sourceHash':continue
    for s in x if isinstance(x,list) else [x]:assert not re.search('[ก-๛]' if l=='my' else '[က-႟]',s),(l,sh,id,k)
receipt={'schemaVersion':1,'status':'PASS','assignedOutputFiles':len(r),'translatedItems':sum(x['items'] for x in r),'checks':r,'mixedMyThScriptCheck':True,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'ownershipExclusions':{'my/service1.json':'terminology_audit','my/cooking1.json':'mechanical_coverage','th/cooking1.json':'mechanical_coverage'},'limitations':['AI-authored translations; no native or domain expert certification.','Question q019 service1 source has repeated generic Japanese distractor reasons; Thai reasons name corresponding ingredients without changing meaning.'],'numberReview':'number-dispositions.json'};(B/'translations/my-th-receipts/final-validation.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:receipt[k] for k in ['status','assignedOutputFiles','translatedItems','mixedMyThScriptCheck']}))
