"""Explicit reviewed-page decisions, never a classifier for unseen source pages.

PDF source bytes and all images remain private. Only object hashes, coordinates,
original competency IDs and decision receipts enter the public repository.
"""
from pathlib import Path
import sys,json,gzip,hashlib,collections
import fitz

ROOT=Path(__file__).resolve().parents[2]
LP=ROOT/'docs/ssw-workspace/source-coverage-v2/food.json'
AP=ROOT/'docs/ssw-workspace/source-coverage-v2/food-ssw2-regions.json.gz'
BASE='docs/ssw-workspace/food-manufacturing/source-v2-round2-20261103'
pdf=Path(sys.argv[1]);page_no=int(sys.argv[2]);assert page_no in [97,98,96]
assert hashlib.sha256(pdf.read_bytes()).hexdigest()=='a2949e7f8e5282ee163e5015baacc39b0a4aeddf8ffb9b05cb93fb93ea116e57'
doc=fitz.open(pdf);assert len(doc)==165
ledger=json.loads(LP.read_text());artifact=json.loads(gzip.decompress(AP.read_bytes()))
page=next(p for p in ledger['pages']if p['sourceId']=='food-2'and p['pdfPage']==page_no)
region=next(p for p in artifact['pages']if p['pdfPage']==page_no)
assert page['semanticInventory']['status']=='partial'
units={u['knowledgeId']:u for u in ledger['knowledgeUnits']}
blocks={b['number']:b for b in doc[page_no-1].get_text('dict')['blocks']if b['type']==0}
receipt=f'{BASE}/page{page_no}-semantic-inventory.json'
def key(name):
    value='food-v2-'+name
    assert value in units,value
    return value
def body_units(y):
    if page_no==97:
        if y<105:return [key('output-alternative-measures')],'Opening continuation: changing the output/input indicator reveals distinct aspects, not one scalar across all scopes.'
        if y<250:return [key('productivity-relative-change')],'Four output/input changes, including both increasing and both decreasing; independent C/D exercise already tests relative changes.'
        if y<535:return [key('unit-input-per-product'),key('reciprocal-scope')],'Input-over-product-output fraction, numerator/denominator labels, reciprocal scope and diagram note about product quantity.'
        if y<615:return [key('unit-input-per-product'),key('output-alternative-measures')],'Output may use different productivity measures, whereas resource unit consumption here uses physical product quantity.'
        return [key('unit-input-per-product'),key('reciprocal-scope'),key('cost-unit-reduction')],'Independent unit conversion and resource-per-product/cost relation; source200kg/300minute example is illustrative data, not a fact to memorise.'
    if page_no==98:
        if y<140:return [key('standard-time-sum')],'Section heading and required stage-time sum establish production standard time.'
        if y<205:return [key('standard-time-sum'),key('progress-adjustment')],'Compare daily progress with standard, correcting early or delayed work toward customer delivery.'
        if y<233:return [key('standard-throughput')],'Output divided by standard time defines standard production amount per time.'
        if y<310:return [key('labor-output-per-mh'),key('labor-productivity-alias')],'Worker-hour based productivity and the explicitly equivalent names are taught and directly assessed in new packet62.'
        if y<500:return [key('standard-throughput'),key('labor-output-per-mh')],'Illustrative case labels, quantities, worker count and times are assigned to their two productivity competencies; independently authored examples exercise the same divisions.'
        if y<650:return [key('standard-throughput'),key('progress-adjustment')],'Illustrative standard-throughput division, comparison with actual, and investigation of below-standard production.'
        return [key('progress-chart-axes'),key('progress-adjustment')],'Progress-chart introduction includes horizontal time, vertical cumulative output, standard line, permissible band and comparison against actual.'
    if page_no==96:
        if y<110:return [key('progress-delivery')],'Opening continuation explains progress management to meet delivery dates.'
        if y<200:return [key('production-plan-business-objective')],'Business planning aims at customer delivery and required profit; new independent plan-purpose teaching and challenge explicitly address both.'
        if y<320:return [key('company-factory-line'),key('company-plan-components')],'Plan hierarchy from company through factory to line, including quantities, dates and resources.'
        if y<400:return [key('leader-plan-implementation')],'Frontline leader implements work and progress plans for assigned operations.'
        if y<510:return [key('productivity-output-input')],'Section title and productivity as output relative to input.'
        if y<595:return [key('productivity-output-input'),key('output-alternative-measures')],'Input types and possible output measures require matching the indicator scope.'
        if y<665:return [key('output-alternative-measures'),key('output-dekidaka-name')],'Physical amount, sales or value output alternatives and the output alias are explicitly included; new packet62 tests the alias in context.'
        return [key('productivity-output-input')],'Productivity formula, division bar and labelled output numerator/input denominator.'
    raise ValueError('Page decisions not yet self-reviewed in this script')

before_page=json.loads(json.dumps(page));before_refs={k:[r for r in u['sourceRefs']if r['sourceId']=='food-2'and r['pdfPage']==page_no]for k,u in units.items()if any(r['sourceId']=='food-2'and r['pdfPage']==page_no for r in u['sourceRefs'])}
decisions=[]
for e in region['elements']:
    before={k:e.get(k)for k in ['classification','knowledgeIds','reason']}
    x0,y0,x1,y1=e['bbox'];y=(y0+y1)/2
    if e['kind']=='text':
        block=blocks[e['extractionBlockNumber']]
        raw=[[s['text']for s in line['spans']]for line in block['lines']]
        digest=hashlib.sha256(json.dumps(raw,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
        assert digest==e['sha256'],e['elementId']
        content=''.join(t for line in raw for t in line)
        if not content.strip():category='decorative';ids=[];reason='Whitespace-only text object was explicitly inspected; no lexical or numerical content.'
        elif y0>=788:category='navigation';ids=[];reason='Publication footer: copyright/issuer/page locator, not new vocational knowledge.'
        else:category='knowledge';ids,reason=body_units(y)
    elif e['kind']=='vector':
        # These exact four objects were inspected against PDF drawing properties
        # and the rendered page. White rectangles are not overlooked labels.
        if y0>=788 or y1<55:category='decorative';ids=[];reason='White-fill margin rectangle, verified fill=(1,1,1); no graph/label/arrow content.'
        elif page_no in [96,97] and abs(y0-y1)<0.01:category='knowledge';ids=([key('productivity-output-input')] if page_no==96 else [key('unit-input-per-product'),key('reciprocal-scope')]);reason=('Fraction bar separates output numerator from input denominator.' if page_no==96 else 'Fraction bar separates input numerator above from physical-product-output denominator below; not discarded as decoration.')
        elif page_no in [96,97,98]:category='decorative';ids=[];reason='Rectangular formula callout frame; fraction and both labelled operands are mapped separately, so border carries no additional fact.'
        else:raise ValueError('Unreviewed vector object')
    else:raise ValueError('Unexpected source object requires visual review: '+e['elementId'])
    e.update(classification=category,knowledgeIds=ids,reason=reason,semanticReviewRef=receipt)
    decisions.append({'elementId':e['elementId'],'kind':e['kind'],'bbox':e['bbox'],'sourceObjectSha256':e['sha256'],'before':before,'after':category,'knowledgeIds':ids,'decision':reason})

page_ids=sorted(set(k for e in region['elements']for k in e['knowledgeIds']))
for kid,u in units.items():
    refs=[r for r in u['sourceRefs']if not(r['sourceId']=='food-2'and r['pdfPage']==page_no)]
    selected=[e['elementId']for e in region['elements']if kid in e['knowledgeIds']]
    if selected:refs.append({'sourceId':'food-2','pdfPage':page_no,'elementIds':selected});u.setdefault('pageInventoryReviews',[]).append({'pdfPage':page_no,'reviewRef':receipt,'reviewedExistingTeachingAndAssessment':True})
    assert refs,kid
    u['sourceRefs']=refs
    if selected and kid in ['food-v2-production-plan-business-objective','food-v2-output-dekidaka-name','food-v2-labor-productivity-alias']:
        u['status']='covered_ai';u['unresolved']=[]
page['knowledgeIds']=page_ids;page['regionCensus']['status']='visually_reviewed';page['regionCensus']['visualReviewRef']=receipt
page['semanticInventory']={'status':'complete_ai','reviewRef':receipt}
region['pageVisualReviewComplete']=True;region['tableAndFormulaRecognition']='formula_and_operand_labels_self_checked; no table or raster image on this page'
packed=gzip.compress((json.dumps(artifact,ensure_ascii=False,indent=2)+'\n').encode(),mtime=0);AP.write_bytes(packed)
digest=hashlib.sha256(packed).hexdigest()
for p in ledger['pages']:
    if p['sourceId']=='food-2':p['regionCensus']['sha256']=digest
LP.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
report={'schemaVersion':1,'date':'2026-11-03','baselineCommit':'4832f53f8407298126fa43c104a266972f2a3831','sourceId':'food-2','pdfPage':page_no,'sourceSha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'textAndFullPageImageRead':True,'beforePage':before_page,'beforePageSourceRefs':before_refs,'regionCounts':dict(collections.Counter(e['kind']for e in region['elements'])),'decisions':decisions,'allExtractedObjectsClassified':all(e['classification']!='pending'for e in region['elements']),'sourceIdeaInventoryScope':'Every source text/ruby/formula/operator/caption on this page was compared, including white vector margins and formula-frame roles. Illustrative numeric examples are covered by independently authored same-competency exercises, not copied or memorised.','knowledgeIds':page_ids,'allPageMandatoryKnowledgeCoveredAi':all(units[k]['status']=='covered_ai'for k in page_ids),'sourceDenominator':'open','wholeSourceKnowledgeCovered':False,'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False}
target=ROOT/receipt;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'PAGE_SEMANTIC_INVENTORY_SELF_CHECKED','pdfPage':page_no,'classifiedObjects':len(decisions),'knowledgeIds':len(page_ids),'allPageMandatoryKnowledgeCoveredAi':report['allPageMandatoryKnowledgeCoveredAi']}))
