from pathlib import Path
import json,hashlib,collections
from PIL import Image
import fitz
R=Path(__file__).resolve().parents[5];O=Path(__file__).parent;p=json.loads((O/'packet.json').read_text());units=json.loads((R/'docs/ssw-workspace/restaurant/knowledge-ledger.json').read_text())['units'];expected={u['id'] for u in units if any(r['documentId']=='rst-2-hygiene' for r in u['sourceRefs'])};assert {u['unitId'] for u in p['units']}==expected and len(p['units'])==192
assert [x['pdfPage'] for x in p['pages']]==list(range(1,43));assert all(x['textRead'] and x['visualRead'] for x in p['pages'])
pdf=next(Path('/workspace/scratch/8c34e3cace7a/restaurant-source31').glob('*２号*衛生*'));assert hashlib.sha256(pdf.read_bytes()).hexdigest()==p['pdfSha256ByDocument']['rst-2-hygiene'];assert len(fitz.open(pdf))==42
fids={f['id'] for f in p['facts']};aids={a['id'] for a in p['additions']};qids={q['id'] for q in p['questions']};assert len(fids)==len(p['facts']);assert len(aids)==len(p['additions']);assert len(qids)==len(p['questions'])
existingq={q['id'] for x in (R/'src/data/restaurant').glob('exams.*.ja.json') for e in json.loads(x.read_text()).get('exams',[]) for q in e['questions']};lessondata={l['id']:l for l in json.loads((R/'src/data/restaurant/lessons.2.ja.json').read_text())['lessons']}
for f in p['facts']:
 assert f['statementJa'].strip() and set(f['unitIds'])<=expected;assert set(f['additionIds'])<=aids;assert set(f['questionIds'])<=existingq|qids
 assert f['existingEvidence'] or f['additionIds'];assert f['sourceRefs']
 for sr in f['sourceRefs']:assert sr['documentId']=='rst-2-hygiene' and all(1<=n<=42 for n in sr['pdfPages'])
 for e in f['existingEvidence']:
  if e['kind']=='lesson_paragraph':
   lesson=lessondata[e['lessonId']];assert e['paragraphId'] in {x['id'] for x in lesson['paragraphs']}
   if 'lessonSourceHash'in e:assert e['lessonSourceHash']==lesson['sourceHash']
for q in p['questions']:
 assert len(q['optionsJa'])==4 and len(set(q['optionsJa']))==4;assert len(q['optionReasonsJa'])==4 and len(set(q['optionReasonsJa']))==4;assert 0<=q['correctIndex']<4
 assert set(q['testedFactIds'])<=fids and q['factIds']==q['testedFactIds'];assert q['coverageLimit'] and all(x.strip() for x in q['optionReasonsJa'])
for a in p['additions']:assert a['lessonId'] in lessondata and set(a['factIds'])<=fids
for u in p['units']:
 assert u['factIds'] and set(u['factIds'])<=fids
 if u['decision']=='structural_aggregate':assert u['childUnitIds'] and set(u['childUnitIds'])<=expected
 elif u['decision'].startswith('covered'):
  assert any(f['questionIds'] or f['competencyQuestionIds'] for f in p['facts'] if f['id'] in u['factIds'])
for f in p['figures']:
 raw=(R/f['assetFile']).read_bytes();assert hashlib.sha256(raw).hexdigest()==f['sha256'];assert Image.open(R/f['assetFile']).size==(f['width'],f['height']);assert (R/f['svgFile']).is_file();assert not raw.startswith(b'version https://git-lfs');assert set(f['factIds'])<=fids
assert len(p['referenceFormCoverage']['rows'])==40;assert all(x['factIds'] for x in p['referenceFormCoverage']['rows']);assert 6/(6+4)*100==60
stats=json.loads((R/'assets/restaurant/source31/hygiene2/historical-series-data.json').read_text());assert len(stats['years'])==len(stats['events'])==len(stats['patients'])==20;assert stats['events'][-2:]==[717,962] and stats['patients'][-2:]==[11080,6856];assert max(stats['patients'][10:])<25000
assert all(p['acceptance'][x] is False for x in ['humanReviewed','nativeReviewed','domainReviewed'])
r=dict(status='PASS',pages=42,units=192,facts=len(fids),additions=len(aids),newQuestions=len(qids),figures=len(p['figures']),referenceFormRows=40,semanticDuplicateAliases=len(p['factAliases']),decisions=dict(collections.Counter(x['decision'] for x in p['units'])),assessment=p['assessmentSummary'],sourceExclusions=len(p['sourceExclusions']),packetSha256=hashlib.sha256((O/'packet.json').read_bytes()).hexdigest(),humanReviewed=False,nativeReviewed=False,domainReviewed=False,browserTested=False,physicalDeviceTested=False)
(O/'validation.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in r.items() if k!='assessment'},ensure_ascii=False))
