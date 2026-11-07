"""Validate bounded draft review without promoting partials into runtime forms."""
import json,hashlib,copy
from pathlib import Path
R=Path(__file__).resolve().parents[2];W=R/'docs/ssw-workspace/agriculture/mock-35'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def check():
 baseline=read(W/'baseline-file-hashes.json')
 for path,h in baseline['files'].items():
  if path not in ['docs/ssw-workspace/agriculture/CHECKPOINT.md','docs/ssw-workspace/agriculture/progress.json','docs/ssw-workspace/agriculture/exam-authoring-blueprint.json']:assert sha(R/path)==h,'frozen runtime/source input changed: '+path
 adopted=read(W/'peer-adopted-candidates.json');queue=read(W/'reviewed-question-queue.json');assert queue['peerAdoptedSha256']==sha(W/'peer-adopted-candidates.json')
 lessons={l['id']:l for l in read(R/'src/data/agriculture/lessons.ja.json')['lessons']}
 oldqs={q['id']:q for name in ['weekly-checks.ja.json','mock-exams.ja.json'] for e in read(R/'src/data/agriculture'/name)['exams'] for q in e['questions']}
 assert len(oldqs)==581
 refs={};accepted={};patches=0;reviewers=set()
 for b in adopted['packetBindings']:
  assert sha(W/b['authorFile'])==b['authorSha256'] and sha(W/b['reviewFile'])==b['reviewSha256']
  a=read(W/b['authorFile']);v=read(W/b['reviewFile']);assert v['authorPacketSha256']==b['authorSha256'] and v['author']!=v['reviewer'];assert not v['unresolvedBlockingIssues'];reviewers.add(v['reviewer']);dec={d['questionId']:d for d in v['decisions']};objs={o['id']:o for o in a['objectives']}
  assert a['level']=='1' and set(dec)=={q['id'] for q in a['questions']}
  for raw in a['questions']:
   q=copy.deepcopy(raw);ref=str(b['worker'])+':'+q['id'];assert ref not in refs and q['id'] not in oldqs
   for p in v['patches']:
    if p['questionId']==q['id']:assert p['field'] in ['stemJa','optionsJa','optionReasonsJa','correctIndex'];assert q[p['field']]==p['before'];q[p['field']]=p['after'];patches+=1
   l=lessons[q['lessonId']];o=objs[q['objectiveId']];assert '1'in l['levels'] and q['lessonSourceHash']==l['sourceHash'];assert len(q['optionsJa'])==len(q['optionReasonsJa'])==len(set(q['optionsJa']))==4;assert type(q['correctIndex'])is int and 0<=q['correctIndex']<4;assert all(isinstance(t,str)and t.strip() for t in q['optionsJa']+q['optionReasonsJa']);assert q['nativeReviewed']is False and q['domainReviewed']is False
   paragraphs={p['id']:p for p in l['paragraphs']};assert o['lessonId']==q['lessonId'] and o['paragraphIds'] and set(o['paragraphIds'])<=set(paragraphs);bound={k for pid in o['paragraphIds'] for k in paragraphs[pid]['knowledgeIds']};assert set(q['knowledgeIds'])<=set(o['knowledgeIds'])<=bound
   refs[ref]=q
   if dec[q['id']]['decision']=='accept':accepted[ref]=q
 assert len(refs)==37 and len(accepted)==27 and len(reviewers)==6 and patches==12
 assert {x['ref'] for x in adopted['candidateRows']}==set(accepted)
 for x in adopted['candidateRows']+adopted['excludedRows']:assert x['question']==refs[x['ref']]
 globals={}
 for b in queue['globalReviewBindings']:
  assert sha(W/b['file'])==b['sha256'];v=read(W/b['file']);assert v['adoptedPacketSha256']==sha(W/'peer-adopted-candidates.json');assert v['global800CapacityCertified']is False
  for d in v['decisions']:
   assert d['ref']not in globals and d['ref']in accepted;assert d['decision']in ['retain_candidate','exclude','hold'];assert d['reasonJa'].strip();assert set(d.get('existingQuestionIds',[]))<=set(oldqs);assert set(d.get('overlapRefs',[]))<=set(accepted);globals[d['ref']]=d
 assert set(globals)==set(accepted)
 retained={ref for ref,d in globals.items() if d['decision']=='retain_candidate'};assert len(retained)==20 and {x['ref']for x in queue['retainedCandidates']}==retained
 assert len(queue['excludedCandidates'])==17 and {x['ref']for x in queue['excludedCandidates']}==set(refs)-retained
 for x in queue['retainedCandidates']+queue['excludedCandidates']:
  assert x['question']==refs[x['ref']] and x['runtimeIntegrated']is False and x['globalCapacityCertified']is False
 assert queue['counts']['runtimeFormsAdded']==queue['counts']['runtimeQuestionsAdded']==0 and queue['counts']['shortfallWithinThisBatch']==20
 assert queue['sourceCapacityFor800Certified']is False and all(queue[k]is False for k in ['humanReviewed','domainReviewed','nativeReviewed'])
 rec=read(W/'historical-queue-reconciliation.json');assert sha(R/'docs/ssw-workspace/agriculture'/rec['previousQueue'])==rec['previousQueueSha256'];assert len(rec['rows'])==13 and sum(x['currentRef']is not None for x in rec['rows'])==8
 for x in rec['rows']:
  if x['currentRef']:assert x['currentRef']in refs;assert (x['disposition']=='retained_by_current_bounded_review')==(x['currentRef']in retained)
 bank=read(R/'src/data/agriculture/mock-exams.ja.json');assert len(bank['exams'])==4 and sum(len(e['questions'])for e in bank['exams'])==160
 print(json.dumps({'status':'PASS','authors':6,'independentPeers':6,'boundedGlobalReviews':3,'rawDrafts':37,'peerRetained':27,'finalRetainedCandidates':20,'excluded':17,'exactBeforePatches':12,'historicalRowsMapped':13,'runtimeFormsAdded':0,'runtimeQuestionsAdded':0,'existingQuestionsPreserved':581,'complete40QuestionFormAvailableInBatch':False,'capacityFor800Certified':False}))
if __name__=='__main__':check()
