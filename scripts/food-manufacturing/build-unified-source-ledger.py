"""Consolidate historical evidence without promoting coverage by page overlap.

Only explicit human/AI decisions in decisions.json can change after.status.
Missing bindings remain visible; input hashes make later changes detectable.
"""
from pathlib import Path
import json, hashlib, collections, re

ROOT = Path(__file__).resolve().parents[2]
DOC = ROOT / 'docs/ssw-workspace/food-manufacturing'
OUT = DOC / 'source-closure-20261031'
DATA = ROOT / 'src/data/food-manufacturing'

def read(p): return json.loads(p.read_text())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,d): p.parent.mkdir(parents=True,exist_ok=True); p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def refs(value,key):
    out=[]
    if isinstance(value,dict):
        if isinstance(value.get(key),str): out.append(value[key])
        for v in value.values(): out.extend(refs(v,key))
    elif isinstance(value,list):
        for v in value: out.extend(refs(v,key))
    return sorted(set(out))

def build():
    OUT.mkdir(parents=True,exist_ok=True)
    decisions=read(OUT/'decisions.json') if (OUT/'decisions.json').exists() else {}
    supplement_paths=sorted(p for p in DATA.glob('source-closure*.json') if re.fullmatch(r'source-closure\d+\.json',p.name))
    supplement_ids={s['id'] for path in supplement_paths for s in read(path)['sections']}
    assessment_paths=sorted(p for p in DATA.glob('source-assessment*.json') if re.fullmatch(r'source-assessment\d+\.json',p.name))
    assessment_ids={c['id'] for path in assessment_paths for c in read(path)['checks']}
    figure_manifests=sorted(p for p in OUT.glob('figures*.json') if re.fullmatch(r'figures\d+\.json',p.name))
    figures32={f['id']:f for path in figure_manifests for f in read(path)['figures']}
    lessons={};questions={};input_hashes={}
    inputs=[DATA/'lessons.1.ja.json',DATA/'lessons.2.ja.json',DATA/'exams.ja.json']+sorted((DATA/'authoring-20261029').glob('part[1-6].json'))
    for p in inputs:
        d=read(p);input_hashes[str(p.relative_to(ROOT))]=sha(p)
        for l in d.get('lessons',[]): lessons[l['id']]=l
        for e in d.get('exams',[]):
            for q in e['questions']: questions[q['id']]=q
    records=[];pages=[]
    for part,key in [(1,'competencies'),(2,'units'),(3,'records'),(4,'units'),(5,'pages'),(6,'competencies')]:
        p=DOC/f'competency-audit-part{part}-20261029.json';d=read(p);input_hashes[str(p.relative_to(ROOT))]=sha(p)
        doc='ssw1' if part<=2 else 'ssw2'
        page_rows=d.get('pages',d.get('pageAudit',d.get('pageReview',d.get('pageRecords',[]))))
        for row in page_rows:
            pages.append({'document':doc,'pdfPage':row['pdfPage'],'historicalTextRead':row.get('textRead',False),'historicalVisualRead':any(row.get(k,False) for k in ['visualRead','visuallyRead','renderedPageInspected'])})
        for raw in d[key]:
            rid=raw.get('id',raw.get('auditId',f"{doc}-p{raw.get('pdfPage',0):03d}-page-outcomes"))
            source=raw.get('source',{})
            pp=raw.get('pdfPages',source.get('pdfPages',[]))
            if not pp: pp=[raw.get('pdfPage',source.get('pdfPage'))]
            pp=[p for p in pp if isinstance(p,int)]
            pp+=source.get('continuationPdfPages',[])
            outcome=next((raw[k] for k in ['competencyJa','knowledgeOutcomeJa','competency','learningTargetJa','topic'] if raw.get(k)),rid)
            old=raw.get('status',raw.get('coverageStatus','unclassified'))
            lessons_evidence=raw.get('lessonParagraphs',raw.get('lessonEvidence',raw.get('lessonBindings',[])))
            qids=sorted(set(raw.get('questionIds',[])+refs(raw.get('questionEvidence',[]),'questionId')))
            gaps=next((raw[k] for k in ['gaps','remainingDetails','remainingDetail','provenRemainingDetail','supplementRequirementJa','supplementRequirement'] if raw.get(k)),[])
            candidates=[]
            for l in lessons.values():
                if l['id'] not in {f'food-{l["level"]}-{n:03d}' for n in range(43 if l['level']=='1' else 37)}:
                    overlap=sorted(set(pp)&{r['pdfPage'] for r in l.get('sourceRefs',[]) if r.get('document')==doc})
                    if overlap:candidates.append({'lessonId':l['id'],'matchingSourcePages':overlap,'basis':'candidate_only_requires_semantic_decision'})
            decision=decisions.get(rid)
            if decision:
                assert decision.get('reason') and decision.get('status')
                assert all(s in supplement_ids for s in decision.get('supplementIds',[]))
                assert all(c in assessment_ids for c in decision.get('assessmentCheckIds',[]))
                assert all(f in figures32 for f in decision.get('figureIds',[]))
                for b in decision.get('lessonBindings',[]):
                    assert b['lessonId'] in lessons
                    assert all(any(p['id']==pid for p in lessons[b['lessonId']]['paragraphs']) for pid in b.get('paragraphIds',[]))
            figure_bindings=[{k:figures32[f][k] for k in ['id','assetFile','sha256','lessonId','paragraphId','objectiveJa','sourceRefs']} for f in (decision or {}).get('figureIds',[])]
            records.append({'id':rid,'document':doc,'pdfPages':sorted(set(pp)),'learningOutcome':outcome,'granularity':'page_summary_not_atomic' if part==5 else 'historical_scoped_outcome_not_exhaustive','before':{'status':old,'lessonBindings':lessons_evidence,'questionIds':qids,'remainingDetails':gaps},'supplementCandidates':candidates,'after':decision or {'status':'semantic_recheck_pending','reason':'Historical status preserved; no automatic promotion from supplemental page overlap.'},'figures':figure_bindings,'provenance':{'path':str(p.relative_to(ROOT)),'recordKey':key,'recordId':rid}})
    # Page review is separate from semantic knowledge coverage.
    visual=read(OUT/'visual-review.json') if (OUT/'visual-review.json').exists() else {'pages':[]}
    viewed={(p['document'],p['pdfPage']):p for p in visual['pages']}
    for p in pages:p['currentVisualReview']=viewed.get((p['document'],p['pdfPage']));p['visualEvidenceAvailable']=p['historicalVisualRead'] or bool(p['currentVisualReview'])
    assert len(pages)==251 and len({(p['document'],p['pdfPage']) for p in pages})==251
    assert len(records)==len({r['id'] for r in records})
    for p in [OUT/'decisions.json',OUT/'visual-review.json',*supplement_paths,*assessment_paths,OUT/'question-audit.json',OUT/'source-coverage34.json',OUT/'assessment-link34.json',*figure_manifests,*sorted(OUT.glob('atomic-knowledge[0-9]*.json')),*sorted(OUT.glob('question-semantic[0-9]*.json'))]:
        if p.exists():input_hashes[str(p.relative_to(ROOT))]=sha(p)
    identity=[{k:d[k] for k in ['id','level','filename','version','editionDate','pdfPageCount','sha256','printedPageOffset']} for d in read(DOC/'source-map.json')['documents']]
    write(OUT/'ledger.json',{'schemaVersion':1,'sourceDocuments':identity,'inputSha256':input_hashes,'pages':pages,'records':records,'scopeComplete':False,'fullAtomicSourceDecompositionComplete':False,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False})
    write(OUT/'validation.json',{'status':'PASS_CONSOLIDATION_NOT_FULL_COVERAGE','sourcePages':len(pages),'historicalVisualPages':sum(p['historicalVisualRead'] for p in pages),'newVisualPages':len(viewed),'pagesWithVisualEvidence':sum(p['visualEvidenceAvailable'] for p in pages),'records':len(records),'beforeStatuses':dict(collections.Counter(r['before']['status'] for r in records)),'afterStatuses':dict(collections.Counter(r['after']['status'] for r in records)),'runtimeLessons':len(lessons),'runtimeQuestions':len(questions),'fullSourceCoverageCertified':False})
    print(json.dumps(read(OUT/'validation.json'),ensure_ascii=False))

if __name__=='__main__':build()
