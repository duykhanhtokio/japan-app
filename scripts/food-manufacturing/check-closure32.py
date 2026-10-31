"""Check independent numeric invariants and exact runtime asset bindings."""
from pathlib import Path
import json,hashlib
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
m=json.loads((OUT/'figures32.json').read_text());by={x['id'].split('food-source32-')[1]:x for x in m['figures']}
registry=(ROOT/'src/data/food-manufacturing/source-practice32.ts').read_text()
for f in m['figures']:
 p=ROOT/f['assetFile'];assert hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256'];im=Image.open(p);assert im.size==(f['width'],f['height']);im.verify()
 assert (ROOT/f['svgFile']).is_file() and f['assetFile'] in registry and f['lessonSourceHash'] in registry
a=by['stacked']['teachingData'];assert all(sum(a[k])==100 for k in ['A','B']) and a['A'][1]>a['B'][1]
a=by['stop-timeline']['teachingData'];assert a['plannedMinutes']-a['delayMinutes']-a['stopMinutes']==a['runningMinutes']==355
assert sum(b-a for a,b in a['plannedIntervalsMinutes'])==390
v=by['mean-range-series']['teachingData'];assert v['meansG']==[11]*4 and v['rangesG']==[2,4,2,6]
p=by['progress-band']['teachingData'];assert p['planKg'][3]-p['illustrativeBandKg']==165>p['actualKg'][3]
s=by['control-patterns']['teachingData']['sequences'];assert max(s['A'])>3 and len(s['B'])==9 and min(s['B'])>0
assert len(s['C'])==6 and all(a<b for a,b in zip(s['C'],s['C'][1:]));assert len(s['D'])==14 and all(a*b<0 for a,b in zip(s['D'],s['D'][1:]))
assert sum(x>2 for x in s['E'])==2 and sum(x>1 for x in s['F'])==4
assert len(s['G'])==15 and all(abs(x)<1 for x in s['G']);assert len(s['H'])==8 and all(abs(x)>1 for x in s['H'])
q=json.loads((OUT/'question-audit.json').read_text());review=json.loads((OUT/'question-semantic32.json').read_text());qa={x['questionId']:x for x in q['items']}
assert len(qa)==848 and len(review['reviews'])==26
for r in review['reviews']:assert qa[r['questionId']]['contentSha256']==r['contentSha256']
report={'status':'PASS','decodedFigures':8,'independentMathAndPatternChecks':'PASS','scopedQuestionEvidenceHashes':26,'humanReviewed':False,'domainReviewed':False,'totalWebpBytes':sum((ROOT/f['assetFile']).stat().st_size for f in m['figures'])}
(OUT/'figures32-validation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
