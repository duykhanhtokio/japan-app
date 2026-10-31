import json,hashlib,collections
from pathlib import Path
ROOT=Path(__file__).resolve().parents[5];OUT=Path(__file__).parent
read=lambda p:json.loads(p.read_text());sha=lambda b:hashlib.sha256(b).hexdigest()
p=read(OUT/'packet.json');lock=next(x for x in read(OUT.parent/'source-lock.json')['documents'] if x['documentId']=='rst-2-operations');units=[x for x in read(ROOT/'docs/ssw-workspace/restaurant/knowledge-ledger.json')['units'] if any(r['documentId']=='rst-2-operations' for r in x['sourceRefs'])]
assert {x['unitId'] for x in p['units']}=={x['id'] for x in units};assert len(p['units'])==128
assert [x['pdfPage'] for x in p['pages']]==list(range(1,34))
for pg in p['pages']:
 text=Path(f'/workspace/scratch/8c34e3cace7a/restaurant-source31-extracted/rst-2-operations/p{pg["pdfPage"]:03}.txt').read_bytes();assert sha(text)==pg['textSha256'];assert pg['textRead'] and pg['visualRead']
pdf=Path('/workspace/scratch/8c34e3cace7a/restaurant-source31/外食業特定技能２号 技能測定試験 学習テキスト 【店舗運営】.pdf');assert sha(pdf.read_bytes())==lock['pdfSha256']
ids={k:{x['id'] for x in p[k]} for k in ['facts','additions','questions','figures']}
for k,arr in ids.items():assert len(arr)==len(p[k])
for u in p['units']:assert set(u['factIds'])<=ids['facts'] and u['factIds'];assert u['assessmentStatus']!='unassessed_explicit_gap'
for f in p['facts']:
 assert f['existingEvidence'] or f['additionIds'];assert set(f['additionIds'])<=ids['additions'];assert f['sourceRefs']
 for r in f['sourceRefs']:assert r['documentId']=='rst-2-operations' and all(1<=n<=33 for n in r['pdfPages'])
for a in p['additions']:assert a['textJa'].strip() and len(a['textJa'])>=100 and a['factIds'];assert set(a['factIds'])<=ids['facts']
for q in p['questions']:
 assert len(q['optionsJa'])==len(set(q['optionsJa']))==4 and len(q['optionReasonsJa'])==4
 assert all(t.strip() for t in q['optionReasonsJa']) and len(set(q['optionReasonsJa']))==4
 assert q['correctIndex'] in range(4) and q['explanationJa']==q['optionReasonsJa'][q['correctIndex']]
 assert set(q['factIds'])<=ids['facts'] and q['factIds']
for f in p['figures']:
 assert sha((ROOT/f['assetFile']).read_bytes())==f['sha256'] and sha((ROOT/f['svgFile']).read_bytes())==f['svgSha256']
assert (200*30+300*20)==12000
assert (900000-270000)*.4/150==1680
assert (100000+330000-110000)==320000
assert (320000-300000)==20000
assert p['jaFreeze']['sha256']==sha(json.dumps({k:p[k] for k in ['additions','questions','figures']},ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
assert all(p['acceptance'][k] is False for k in ['humanReviewed','nativeReviewed','domainReviewed'])
result=dict(status='PASS',pages=33,sourcePdfAndTextHashesChecked=34,units=128,atomicFacts=len(p['facts']),additions=len(p['additions']),questions=len(p['questions']),figures=len(p['figures']),questionOptionAndRationaleShapeChecked=True,independentArithmeticChecks=4,assignedUnitsComplete=True,unitsByDecision=dict(collections.Counter(x['decision'] for x in p['units'])),assessmentStatus=dict(collections.Counter(x['assessmentStatus'] for x in p['units'])),jaFreezeSha256=p['jaFreeze']['sha256'],packetSha256=sha((OUT/'packet.json').read_bytes()),primarySourceChecks=len(p['primarySourceVerification']),sourceConflictDispositions=len(p['sourceConflicts']),humanReviewed=False,nativeReviewed=False,domainReviewed=False,limitations=p['acceptance']['unresolved'])
(OUT/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False))
