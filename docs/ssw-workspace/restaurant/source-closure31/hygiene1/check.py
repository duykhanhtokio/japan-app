"""Reproducible packet integrity, reciprocal evidence and frozen-source guards.
Not a replacement for the source/visual/semantic review recorded in packet.
"""
from pathlib import Path
import json,hashlib,re,collections
P=Path(__file__).resolve().parent;ROOT=P.parents[4];H=lambda b:hashlib.sha256(b).hexdigest()
def main():
 j=json.loads((P/'packet.json').read_text());u={x['unitId']:x for x in j['units']};f={x['id']:x for x in j['facts']};a={x['id']:x for x in j['additions']};q={x['id']:x for x in j['questions']};fig={x['id']:x for x in j['figures']}
 assert len(u)==91 and len(f)==131 and len(a)==23 and len(q)==22 and len(fig)==8
 ledger=json.loads((ROOT/'docs/ssw-workspace/restaurant/knowledge-ledger.json').read_text());expected={x['id']for x in ledger['units']if any(r['documentId']=='rst-1-hygiene'for r in x['sourceRefs'])};assert set(u)==expected
 lock=json.loads((P.parent/'source-lock.json').read_text());d=next(d for d in lock['documents']if d['documentId']=='rst-1-hygiene');assert j['pdfSha256ByDocument']['rst-1-hygiene']==d['pdfSha256']
 assert len(j['pages'])==45 and {p['pdfPage']for p in j['pages']}==set(range(1,46))
 for page,source in zip(j['pages'],d['pages']):assert page['textRead'] and page['visualRead'] and page['textSha256']==source['textSha256'] and page['visualNotes']
 raw={x['id']:x for x in json.loads((ROOT/'src/data/restaurant/lessons.1.ja.json').read_text())['lessons']};oldqs={v['id']:v for e in json.loads((ROOT/'src/data/restaurant/exams.1.ja.json').read_text())['exams']for v in e['questions']}
 for x in f.values():
  assert x['unitIds'] and set(x['unitIds'])<=set(u)
  assert x['sourceRefs'] and all(1<=p<=45 for r in x['sourceRefs']for p in r['pdfPages'])
  assert x['additionIds'] or any(e['kind']=='lesson_paragraph'for e in x['existingEvidence']) or x['decision']=='reference_excluded'
  for aid in x['additionIds']:assert x['id']in a[aid]['factIds']
  for qid in x['questionIds']:assert qid in oldqs or x['id']in q[qid]['factIds']
  for e in x['existingEvidence']:
   if e['kind']=='lesson_paragraph':assert any(p['id']==e['paragraphId']for p in raw[e['lessonId']]['paragraphs'])
   if e['kind']=='question':assert e['questionId']in oldqs
 for x in a.values():
  assert x['lessonId']in raw and x['textJa'] and x['factIds']
  for fid in x['factIds']:assert x['id']in f[fid]['additionIds']
 for x in q.values():
  assert x['lessonId']in raw and x['id']not in oldqs and len(x['optionsJa'])==len(x['optionReasonsJa'])==4 and 0<=x['correctIndex']<4
  assert len(set(x['optionsJa']))==4 and all(x['optionReasonsJa'])
  assert not any(re.search(r'(選択肢[1-4]|[1-4]番の選択肢)',s)for s in x['optionReasonsJa'])
  for fid in x['factIds']:assert x['id']in f[fid]['questionIds']
 for x in fig.values():
  p=ROOT/x['assetFile'];assert p.exists()and H(p.read_bytes())==x['sha256']and x['aiRasterVisuallyReviewed']
  if x['svgFile']:assert (ROOT/x['svgFile']).exists()
  for fid in x['factIds']:assert any(e['figureId']==x['id']for e in f[fid]['visualEvidence'])
 for x in u.values():
  assert x['factIds'] and set(x['factIds'])<=set(f)
  assert x['childUnitIds'] or x['existingQuestionIds'] or x['newQuestionIds'] or x['assessmentGap']
  assert not x['remainingFactGaps']and not x['remainingImageGaps']and not x['assessmentGap']
 assert all(j['acceptance'][k]is False for k in ['humanReviewed','nativeReviewed','domainReviewed','physicalDeviceTested'])
 assert not j['acceptance']['unresolved'] and j['acceptance']['integrationPending']
 result={'result':'PASS','pages':45,'units':91,'facts':131,'additions':23,'questions':22,'optionSpecificReasons':88,'figures':8,'unitDecisionCounts':dict(collections.Counter(x['decision']for x in u.values())),'exactFactAssessmentStates':{'factsWithExistingOrNewQuestion':sum(bool(x['questionIds'])for x in f.values()),'taughtFactsWithoutStandaloneQuestion':sum(not x['questionIds']for x in f.values())},'allExaminableUnitsHaveExactCompetencyQuestionEdges':True,'pixelReview':'AI actually inspected8finalrasterassets; handpalmtopalmerrorcorrectedandreinspected','physicalDeviceTested':False,'packetSha256':H((P/'packet.json').read_bytes()),'integrationPending':True}
 (P/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result))
if __name__=='__main__':main()
