"""Mechanical source receipts and bounded atomic mapping; no source text redistribution."""
import argparse, collections, hashlib, json, re
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
DOCS = ROOT / 'docs/ssw-workspace/manufacturing'
SOURCE_ID = 'mfg1-mechanical-source'
EXPECTED_SHA = '35096524ce12c830ce7765311f536b5d1d0a8bde7268e5385f90588abba04622'

def sha(b): return hashlib.sha256(b).hexdigest()
def read(p): return json.loads(p.read_text())
def save(name, data): (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
def clean(s): return re.sub(r'\s+', '', s)
def norm_bbox(b, page): return [round(b[0]/page.rect.width,6),round(b[1]/page.rect.height,6),round(b[2]/page.rect.width,6),round(b[3]/page.rect.height,6)]

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--pdf',required=True);args=ap.parse_args()
    pdf=Path(args.pdf);assert sha(pdf.read_bytes())==EXPECTED_SHA
    doc=fitz.open(pdf);assert len(doc)==169
    core=read(ROOT/'src/data/manufacturing/mechanical.json')
    supplements=read(ROOT/'src/data/manufacturing/completion37/mechanical.json')
    guides=read(ROOT/'src/data/manufacturing/source-guides.json')
    lesson_list=core['lessons']+supplements['lessons']
    # Reference guides are retained only if they actually belong to this specialty.
    guide_rows=guides.get('guides',[]) if isinstance(guides,dict) else guides
    lesson_list += [g for g in guide_rows if g.get('specialty')=='mechanical']
    lessons={l['id']:l for l in lesson_list}
    old_pages={p['pdfPage']:p for p in read(DOCS/'batch33-full-review/mechanical/page-ledger.json')['pages']}
    inventory={p['pdfPage']:p for p in read(DOCS/'page-object-inventory.json')['pages'] if p['specialty']=='mechanical'}
    matrix=[k for k in read(DOCS/'knowledge-matrix.json')['knowledge'] if k['sourceId']==SOURCE_ID]
    extractions=[];pages=[];page_text={};extraction_no=collections.Counter()
    for n,page in enumerate(doc,1):
        raw=page.get_text('dict');body_lines=[];ruby=0;headings=[];paragraphs=0
        # PDF blocks are ruby-interleaved fragments, not paragraphs. Reconstruct
        # main-text baselines before counting extraction candidates.
        baseline_groups=[]
        for block in raw['blocks']:
            if block['type']!=0:continue
            for line in block['lines']:
                for span in line['spans']:
                    if span['size']<9:
                        ruby+=1;continue
                    if not span['text'].strip():continue
                    y=span['origin'][1]
                    group=next((g for g in baseline_groups if abs(g['baseline']-y)<.8),None)
                    if group is None:group={'baseline':y,'spans':[]};baseline_groups.append(group)
                    group['spans'].append(span)
        normalized_blocks=[]
        for group in sorted(baseline_groups,key=lambda g:g['baseline']):
            spans=sorted(group['spans'],key=lambda s:s['bbox'][0]);box=fitz.Rect(spans[0]['bbox'])
            for span in spans[1:]:box|=fitz.Rect(span['bbox'])
            normalized_blocks.append({'type':0,'bbox':list(box),'lines':[{'bbox':list(box),'spans':spans}]})
        def add(kind,bbox,receipt):
            extraction_no[n]+=1
            record={'id':f'mfg39-mechanical-p{n:03d}-x{extraction_no[n]:03d}','sourceId':SOURCE_ID,'sourceSha256':EXPECTED_SHA,'physicalPage':n,'kind':kind,'bbox':bbox,'bboxCoordinateSystem':'normalized_top_left','status':'extracted_candidate_not_semantically_closed',**receipt}
            extractions.append(record);return record['id']
        ids=[]
        for b in normalized_blocks:
            if b['type']!=0: continue
            lines=[]
            for l in b['lines']:
                spans=[s for s in l['spans'] if s['size']>=9]
                ruby+=sum(1 for s in l['spans'] if s['size']<9)
                if not spans:continue
                text=''.join(s['text'] for s in spans).strip()
                if not text:continue
                body_lines.append(text);lines.append(text)
                if max(s['size'] for s in spans)>=13 and len(clean(text))<=60 and 35<l['bbox'][1]<page.rect.height-65:
                    headings.append(text)
            text='\n'.join(lines)
            if not clean(text):continue
            paragraphs+=1
            ids.append(add('main_text_line_candidate',norm_bbox(b['bbox'],page),{'textSha256':sha(text.encode()),'characterCount':len(clean(text)),'lineCount':len(lines),'sourceTextStored':False,'semanticSegmentation':'main spans grouped by baseline; line/cell fragments require paragraph grouping and semantic atomization'}))
        # Paragraph regions are layout candidates, distinct from knowledge units.
        paragraph_regions=[]
        for block in normalized_blocks:
            spans=block['lines'][0]['spans'];txt=''.join(x['text'] for x in spans)
            if block['bbox'][1]<40 or block['bbox'][3]>page.rect.height-55:continue
            heading=max(x['size'] for x in spans)>=13
            if paragraph_regions and not heading and block['bbox'][1]-paragraph_regions[-1]['bbox'][3]<14 and not paragraph_regions[-1]['heading']:
                paragraph_regions[-1]['text']+=txt
                paragraph_regions[-1]['bbox']=list(fitz.Rect(paragraph_regions[-1]['bbox'])|fitz.Rect(block['bbox']))
                paragraph_regions[-1]['lineCount']+=1
            else:paragraph_regions.append({'bbox':block['bbox'],'text':txt,'lineCount':1,'heading':heading})
        for region in paragraph_regions:
            ids.append(add('heading_region_candidate' if region['heading'] else 'paragraph_region_candidate',norm_bbox(region['bbox'],page),{'textSha256':sha(region['text'].encode()),'characterCount':len(clean(region['text'])),'lineCount':region['lineCount'],'sourceTextStored':False,'semanticSegmentation':'layout-only grouping; may combine columns or image labels and requires reviewer separation'}))
        text='\n'.join(body_lines);page_text[n]=clean(text)
        table_error=None;tables=[]
        try:
            for t in page.find_tables().tables:
                rows=t.extract();cells=[c for row in rows for c in row if c]
                tid=add('table_candidate',norm_bbox(t.bbox,page),{'rowCount':t.row_count,'columnCount':t.col_count,'nonemptyCellCount':len(cells),'cellTextSha256':sha(json.dumps(rows,ensure_ascii=False).encode()),'sourceTextStored':False,'semanticSegmentation':'row/cell meaning requires visual review; geometric borders may be decoration'})
                ids.append(tid);tables.append(tid)
                for row_index,row in enumerate(rows):
                    row_box=t.rows[row_index].bbox
                    ids.append(add('table_row_candidate',norm_bbox(row_box,page),{'parentTableId':tid,'rowIndex':row_index,'cellCount':len(row),'cellTextSha256':sha(json.dumps(row,ensure_ascii=False).encode()),'sourceTextStored':False,'semanticSegmentation':'table row geometry/text receipt; headers, merged cells and mathematical conditions still require semantic review'}))
        except Exception as e:table_error=type(e).__name__
        images=[]
        for im in page.get_image_info(hashes=True):
            rid=add('image_placement',norm_bbox(im['bbox'],page),{'pixelWidth':im['width'],'pixelHeight':im['height'],'imageDigestMd5':im['digest'].hex(),'sourceImageStored':False,'semanticSegmentation':'pending picture/subfigure/label review; repeated placements are not unique concepts'})
            ids.append(rid);images.append(rid)
        vectors=[]
        drawings=page.get_drawings()
        for box in page.cluster_drawings(drawings=drawings):
            if box.width*box.height<60:continue
            rid=add('vector_cluster_candidate',norm_bbox(box,page),{'sourceVectorStored':False,'semanticSegmentation':'unverified geometry may include table border/page decoration; never counted as a semantic figure automatically'})
            ids.append(rid);vectors.append(rid)
        formulas=[]
        for idx,line in enumerate(body_lines):
            if re.search(r'[=＝×÷]|\b(?:mm|N/mm|V|A|W|Hz)\b|[＋−]',line):
                rid=add('formula_or_unit_line_candidate',None,{'bodyLineIndex':idx,'textSha256':sha(line.encode()),'characterCount':len(line),'sourceTextStored':False,'semanticSegmentation':'heuristic only; unit labels and examples may not be calculation formulae'})
                ids.append(rid);formulas.append(rid)
        role='cover' if n==1 else 'table_of_contents' if n<=8 else 'colophon' if n==169 else 'instructional_and_exercise' if '練習問題' in clean(text) else 'instructional_body'
        exclusion='Document identity/navigation only; retained in inventory, not a technical learning outcome.' if n<=8 or n==169 else None
        source_lessons=[l['id'] for l in lesson_list if any(s.get('pdfPage')==n and s.get('documentId')==SOURCE_ID for s in l.get('sources',[]))]
        pages.append({'sourceId':SOURCE_ID,'sourceSha256':EXPECTED_SHA,'physicalPage':n,'printedPage':n-8 if 9<=n<=168 else None,'pageKind':role,'classificationStatus':'all_pages_retained_and_classified','sourceExercisePolicy':{'sourceExercisePresent': '練習問題' in clean(text), 'exerciseStemOrOptionsReproduced':False,'excludeReason':'Original source exercise wording/options/answers are not copied; explanatory knowledge remains eligible and must be atomized, not skipped with the page.','learningObjectiveKnowledgeIds':[k['id'] for k in matrix if k.get('pdfPageStart',0)<=n<=k.get('pdfPageEnd',0)]},'exclusionReason':exclusion,'widthPt':page.rect.width,'heightPt':page.rect.height,'textCharactersExcludingSmallRuby':len(clean(text)),'smallRubySpansFiltered':ruby,'headingsJa':list(dict.fromkeys(headings)),'sourceTextBlockFragments':sum(b['type']==0 for b in raw['blocks']),'mainTextLineCandidates':paragraphs,'tableCandidateIds':tables,'imagePlacementIds':images,'vectorClusterCandidateIds':vectors,'formulaOrUnitCandidateIds':formulas,'extractionCandidateIds':ids,'lowTextPage':len(clean(text))<200,'lowTextPolicy':'Retain and inspect graphics/tables regardless of text count.','tableExtractionError':table_error,'historicalReview':{'ledger':'batch33-full-review/mechanical/page-ledger.json','textRead':old_pages[n].get('sourceTextRead',False),'visualDetailInspected':old_pages[n].get('sourceHighResolutionInspected',False),'notNewSessionReview':True},'declaredSourceLessonIds':source_lessons,'tocKnowledgeIds':[k['id'] for k in matrix if k.get('pdfPageStart',0)<=n<=k.get('pdfPageEnd',0)],'candidateAssessmentIds':old_pages[n].get('structuralCandidateQuestionIds',[]),'wholePageKnowledgeClosed':False,'semanticAtomicInventoryComplete':False})
    save('extraction-candidates.json',{'schemaVersion':1,'sourceId':SOURCE_ID,'sourceSha256':EXPECTED_SHA,'sourceBytesVerifiedThisSession':True,'physicalPages':169,'method':'PyMuPDF body spans>=9pt grouped by baseline; exact extraction hashes and geometry, no source prose/images redistributed. Ruby filtering is a layout heuristic and is not OCR or semantic approval.','candidates':extractions,'semanticObjectCount':None,'fullKnowledgeAtomizationComplete':False})
    save('page-index.json',{'schemaVersion':1,'sourceId':SOURCE_ID,'sourceSha256':EXPECTED_SHA,'physicalPages':169,'sourceBytesVerifiedThisSession':True,'pages':pages,'classificationComplete':True,'wholeSourceKnowledgeClosed':False})
    units=[];old_to_new={};counter=collections.Counter()
    def allocate(n):counter[n]+=1;return f'mfg39-mechanical-p{n:03d}-u{counter[n]:03d}'
    def binding(lid,paragraph_id=None,basis='page-source candidate',checked=False):
        lesson=lessons.get(lid)
        if not lesson:return {'lessonId':lid,'paragraphId':paragraph_id,'resolved':False,'status':'unresolved_reference','reason':'Not found in current core/completion37/reference-guide data'}
        ps=lesson.get('paragraphs',[])
        if paragraph_id is not None:
            ps=[p for p in ps if p['id']==paragraph_id]
        editorial_path=ROOT/'src/data/manufacturing/lesson-editorial.json'
        editorial=read(editorial_path)
        effective=None
        if editorial.get('lessonId')==lid and editorial.get('paragraphId')==paragraph_id:
            assert ps and ps[0]['textJa']==editorial['wording']['ja']['before']
            effective={'path':str(editorial_path.relative_to(ROOT)),'fileSha256':sha(editorial_path.read_bytes()),'beforeTextSha256':sha(editorial['wording']['ja']['before'].encode()),'effectiveAfterTextSha256':sha(editorial['wording']['ja']['after'].encode()),'status':'exact_guarded_Japanese_editorial_overlay_read_and_compared'}
        return {'lessonId':lid,'effectiveEditorialParagraph':effective,'lessonSourceHash':lesson.get('sourceHash'),'paragraphId':paragraph_id,'paragraphSha256':sha(json.dumps(ps,ensure_ascii=False,sort_keys=True).encode()) if ps else None,'resolved':bool(ps),'status':'ai_compared_current_paragraph_to_source' if checked else 'historical_or_source_page_navigation_candidate','basis':basis,'allParagraphFactsSourceVerified':False}
    for ledger in ['batch17/mechanical-source-review.json','batch22/mechanical-source-ledger.json','batch25/mechanical-source-review.json']:
        record=read(DOCS/ledger)
        for page in record['pages']:
            n=page['pdfPage']
            for obj in page.get('objects',[]):
                uid=allocate(n);old_to_new[obj['id']]=uid
                match=re.search(r'(\d{3})/(section-\d+|principle|example|decision|explanation)',obj.get('comparisonBasis',''))
                lid=f'mfg1-mechanical-lesson-{match[1]}' if match else None
                bound=[binding(l,match[2] if match and lid==l else None,obj.get('comparisonBasis','historical ledger')) for l in obj.get('lessonIds',[])]
                duplicate_ids=obj.get('priorObjectIds',[])
                units.append({'id':uid,'sourceId':SOURCE_ID,'sourceSha256':EXPECTED_SHA,'physicalPage':n,'kind':obj['type'],'bbox':obj.get('bboxNormalized'),'bboxCoordinateSystem':'normalized_top_left','bboxPrecision':obj.get('bboxPrecision'),'summaryJa':None,'summaryEn':obj.get('summary'),'status':'historical_atomic_review_preserved_current_coverage_not_certified','historicalCoverageStatus':obj.get('coverageStatus'),'evidence':[{'path':str((DOCS/ledger).relative_to(ROOT)),'sha256':sha((DOCS/ledger).read_bytes()),'objectId':obj['id'],'freshSourceBytesHashVerified':True,'historicalVisualReviewNotRepeated':True}],'lessonBindings':bound,'termBindings':[],'assessmentBindings':[{'questionId':q,'status':'page_level_navigation_candidate_not_unit_verified'} for q in old_pages[n].get('structuralCandidateQuestionIds',[])],'exclusionReason':None,'duplicateOf':None,'possibleDuplicateHistoricalObjectIds':duplicate_ids,'uncoveredFacets':obj.get('uncoveredFacets',[]),'qualifications':obj.get('qualification'),'newSessionSemanticReview':False,'humanReviewed':False,'domainReviewed':False})
    for u in units:
        prior=[old_to_new[p] for p in u['possibleDuplicateHistoricalObjectIds'] if p in old_to_new]
        u['duplicateOf']=prior[0] if prior else None
    # Fresh, narrow source-to-current-paragraph comparisons, authored independently.
    fresh_specs=read(OUT/'reviewed-units-input.json')
    for spec in fresh_specs['units']:
        n=spec['physicalPage'];uid=allocate(n)
        check_terms=[]
        for lid,pid in spec['bindings']:
            lesson=lessons[lid]
            assert any(p['id']==pid for p in lesson.get('paragraphs',[])),(lid,pid)
            for idx,t in enumerate(lesson.get('terms',[])):
                if t['ja'] in spec.get('terms',[]):check_terms.append({'lessonId':lid,'termIndex':idx,'termJa':t['ja'],'status':'exact_current_term_in_compared_concept','termSha256':sha(json.dumps(t,ensure_ascii=False,sort_keys=True).encode())})
        render=Path('/workspace/scratch/8c34e3cace7a/mechanical-audit39')/f'p{n:03d}.png'
        units.append({'id':uid,'sourceId':SOURCE_ID,'sourceSha256':EXPECTED_SHA,'physicalPage':n,'kind':spec['kind'],'bbox':spec.get('bbox'),'bboxCoordinateSystem':'normalized_top_left','bboxPrecision':'approximate reviewed source region; exact extraction candidates separately retained','summaryJa':spec['summaryJa'],'summaryEn':None,'status':spec.get('status','ai_compared_bounded_concept'),'evidence':[{'sourcePhysicalPage':n,'sourcePdfBytesVerified':True,'bodyTextReadThisSession':True,'sourceVisualReadThisSession':spec.get('visual',False),'renderSha256':sha(render.read_bytes()) if spec.get('visual') and render.exists() else None,'sourceImageRedistributed':False}],'lessonBindings':[binding(l,p,'Fresh exact-PDF text/visual concept compared against named current paragraph',True) for l,p in spec['bindings']],'termBindings':check_terms,'assessmentBindings':[{'questionId':q,'status':'page_level_candidate_requires_question_lane_validation'} for q in old_pages[n].get('structuralCandidateQuestionIds',[])],'exclusionReason':None,'duplicateOf':None,'possibleDuplicateHistoricalObjectIds':[],'uncoveredFacets':spec.get('uncoveredFacets',[]),'qualifications':spec.get('qualification'),'newSessionSemanticReview':True,'humanReviewed':False,'domainReviewed':False})
    # Attach every knowledge unit to its physical page; no page becomes closed from one link.
    for page in pages:page['knowledgeUnitIds']=[u['id'] for u in units if u['physicalPage']==page['physicalPage']]
    save('page-index.json',{'schemaVersion':1,'sourceId':SOURCE_ID,'sourceSha256':EXPECTED_SHA,'physicalPages':169,'sourceBytesVerifiedThisSession':True,'pages':pages,'classificationComplete':True,'wholeSourceKnowledgeClosed':False})
    save('knowledge-units.json',{'schemaVersion':1,'sourceId':SOURCE_ID,'sourceSha256':EXPECTED_SHA,'units':units,'atomicInventoryComplete':False,'lessonBindingPolicy':'Only named fresh comparisons are AI-compared; page/TOC/historical candidates never imply full atom coverage. Assessment candidates are not certified answers/distractors.','wholeCurriculumComplete':False})
    # Exhaustive page coverage accounting is separate from semantic coverage.
    summary={'schemaVersion':1,'sourceId':SOURCE_ID,'sourceSha256':EXPECTED_SHA,'physicalPages':169,'classifiedPages':len(pages),'coverPages':1,'tocPages':7,'bodyPages':160,'colophonPages':1,'lowTextPages':[p['physicalPage'] for p in pages if p['lowTextPage']],'extractionCandidates':len(extractions),'extractionCandidateKinds':dict(collections.Counter(x['kind'] for x in extractions)),'knowledgeUnits':len(units),'historicalNarrowUnitOccurrences':sum(not u['newSessionSemanticReview'] for u in units),'freshBoundedConceptUnits':sum(u['newSessionSemanticReview'] for u in units),'freshTextReviewedPhysicalPages':sorted(set(u['physicalPage'] for u in units if u['newSessionSemanticReview'])),'freshVisualReviewedPhysicalPages':sorted(set(u['physicalPage'] for u in units if u['newSessionSemanticReview'] and u['evidence'][0].get('sourceVisualReadThisSession'))),'pagesWithAnyKnowledgeUnit':sum(bool(p['knowledgeUnitIds']) for p in pages),'bodyPagesWithoutFineGrainedUnits':[p['physicalPage'] for p in pages if 9<=p['physicalPage']<=168 and not p['knowledgeUnitIds']],'wholePageKnowledgeClosed':0,'semanticObjectDenominatorKnown':False,'semanticCoveragePercent':None,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'releaseReady':False,'allSourceKnowledgeComplete':False}
    save('coverage-summary.json',summary)
    assert [p['physicalPage'] for p in pages]==list(range(1,170))
    assert len({u['id'] for u in units})==len(units)
    assert all(e['sourceSha256']==EXPECTED_SHA for e in extractions+units)
    assert all(not p['wholePageKnowledgeClosed'] for p in pages)
    assert all(e['bbox'] is None or len(e['bbox'])==4 for e in extractions+units)
    save('validation.json',{'status':'PASS_STRUCTURAL_RECEIPTS_AND_BOUNDED_BINDINGS','validatedSourceSha256':EXPECTED_SHA,'all169PagesRetained':True,'uniqueUnitIds':True,'freshParagraphBindingsResolve':True,'extractionSourceTextOrImagesRedistributed':False,'semanticClosureClaimed':False,'counts':summary})
    print(json.dumps({k:summary[k] for k in ['classifiedPages','extractionCandidates','knowledgeUnits','freshBoundedConceptUnits','wholePageKnowledgeClosed']},ensure_ascii=False))

if __name__=='__main__':main()
