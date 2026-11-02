"""Reproducible current paragraph/source/assessment inventory; never certifies source completeness."""
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/ssw-workspace/kaigo/completion-20261102'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def refs(x):
 result=set()
 if isinstance(x,dict):
  for k,v in x.items():
   if k in ('pdfPages','sourcePdfPages') and isinstance(v,list):result.update(p for p in v if type(p)==int)
   else:result.update(refs(v))
 elif isinstance(x,list):
  for v in x:result.update(refs(v))
 return result
rows=[];weeks=[];problems=[]
for w in range(1,27):
 mp=ROOT/f'src/data/kaigo/japanese-master/week-{w:02}.json';lp=ROOT/f'docs/ssw-workspace/kaigo/japanese-master/week-{w:02}-source-ledger.json';qp=ROOT/f'src/data/kaigo/japanese-master/questions/week-{w:02}.json'
 m,l,q=map(read,[mp,lp,qp]);records=next((l[k] for k in ('rows','entries','records','paragraphs') if isinstance(l.get(k),list)),[])
 idx={}
 for i,r in enumerate(records):idx.setdefault((r.get('sectionId'),r.get('paragraphIndex')),[]).append((i,r))
 n=0;exact=0
 for sid,s in m['sections'].items():
  candidates=[qid for qid in q['questions'] if sid in qid]
  for i,p in enumerate(s['paragraphsJa']):
   matches=idx.get((sid,i),[]);current=[(j,r) for j,r in matches if r.get('knowledgePointJa')==p];pages=sorted(set().union(*(refs(r) for j,r in matches))) if matches else []
   # knowledgePointJa may intentionally summarize a paragraph. Different wording is not a failed source review.
   state='verbatim_current_paragraph_record' if current else 'mapped_concept_summary_not_verbatim_snapshot' if matches else 'missing_paragraph_record'
   row={'week':w,'sectionId':sid,'paragraphIndex':i,'paragraphSha256':hashlib.sha256(p.encode()).hexdigest(),'sourceLedgerPath':str(lp.relative_to(ROOT)),'sourceRecordIndices':[j for j,r in matches],'sourcePdfPages':pages,'sourceBindingStatus':state,'sectionQuestionCandidates':candidates,'individualParagraphAssessmentAcceptance':'not_established_by_section_id','freshSourceVisualReview':False}
   rows.append(row);n+=1;exact+=bool(current)
   if not matches:problems.append({'week':w,'sectionId':sid,'paragraphIndex':i,'status':state})
 weeks.append({'week':w,'paragraphs':n,'exactCurrentParagraphRecords':exact,'weeklyQuestions':len(q['questions']),'japaneseSha256':sha(mp),'ledgerSha256':sha(lp),'questionsSha256':sha(qp),'questionsBoundToCurrentJapanese':q.get('sourceJapaneseSha256')==sha(mp)})
OUT.mkdir(exist_ok=True)
for name,obj in [('paragraph-source-assessment-matrix.json',{'schemaVersion':1,'rows':rows}),('summary.json',{'date':'2026-11-02','scope':'all26currentJapaneseweeks;paragraphmetadataandsection-IDquestioncandidates','weeks':weeks,'totals':{'paragraphs':len(rows),'exactCurrentParagraphRecords':sum(w['exactCurrentParagraphRecords'] for w in weeks),'weeklyQuestions':sum(w['weeklyQuestions'] for w in weeks)},'reconciliationRequired':problems,'sourceKnowledgeCoveragePercent':None,'allSourceIdeasInventoried':False,'individualParagraphAssessmentCoverageCertified':False,'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False})]:
 (OUT/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'paragraphs':len(rows),'exactCurrentParagraphRecords':sum(w['exactCurrentParagraphRecords'] for w in weeks),'reconciliationRequired':len(problems),'weeklyQuestions':sum(w['weeklyQuestions'] for w in weeks)}))
