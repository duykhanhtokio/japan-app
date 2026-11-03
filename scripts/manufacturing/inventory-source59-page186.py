"""Apply a manually read whole-page inventory, retaining unresolved teaching facets.

Only coordinates, fingerprints, concise independently stated objectives and app
evidence are persisted. PDF text, pixels, drawing commands and link URL stay private.
"""
from pathlib import Path
import json,gzip,hashlib,sys,fitz,subprocess

ROOT=Path(__file__).resolve().parents[2]
DIR=ROOT/'docs/ssw-workspace/source-coverage-v2'
ledger_path=DIR/'manufacturing.json'
artifact_path=DIR/'manufacturing-surface-regions.json.gz'
receipt_path=DIR/'manufacturing-source59-page186-inventory-review.json'
receipt_ref=str(receipt_path.relative_to(ROOT))
pdf=Path(sys.argv[1]);assert hashlib.sha256(pdf.read_bytes()).hexdigest()=='08d7e9d6ae5fc5a442af227bbc690ed54cde06681ee8806eb7aadf87748b2eae'
doc=fitz.open(pdf);page=doc[185];blocks=page.get_text('blocks')
ledger=json.loads(ledger_path.read_text());artifact=json.loads(gzip.decompress(artifact_path.read_bytes()));regions=next(p for p in artifact['pages'] if p['pdfPage']==186)
assert len(regions['elements'])==160
purpose_id='mfg59-buff-purposes'
purpose=next(u for u in ledger['knowledgeUnits'] if u['knowledgeId']==purpose_id)
definitions=[
 ('mfg59-buff-tool-definition','綿・麻等による円形のバフへ研磨剤を付け、回転する工具と材料の関係を図で説明する。','src/data/manufacturing/surface.json','/lessons/7/paragraphs/0/textJa','Current paragraph names buff and abrasive but does not teach all cotton/hemp, circular form, rotation and diagram-label relations; the stopped-tool recognition question does not assess these definition details.'),
 ('mfg59-buff-mirror-example','資料のステンレス・アルミニウム等は鏡面仕上げが可能な金属製品の例として読み、全品種の達成保証にしない。','src/data/manufacturing/surface.json','/lessons/60/paragraphs/1/textJa','Current paragraph explains mirror finish but does not bind both source material examples or assess their scope; do not close a source example from a generic finish question.'),
 ('mfg59-buff-precision-quality','精密部品に残るバリや傷が性能・品質へ影響することを、光沢の目的だけと区別して説明する。','src/data/manufacturing/surface.json','/lessons/7/paragraphs/3/textJa','Current app scenario discusses retained scratches and dimensional checks, but no focused assessment tests the source performance/quality consequence for precision parts.'),
]
new=[]
def jhash(v):
 # Source-selected strings are delegated to Node for exact canonical JSON hashing.
 result=subprocess.run(['node','-e',"const c=require('crypto');let s='';process.stdin.on('data',b=>s+=b);process.stdin.on('end',()=>process.stdout.write(c.createHash('sha256').update(JSON.stringify(JSON.parse(s))).digest('hex')));"],input=json.dumps(v,ensure_ascii=False),text=True,capture_output=True,check=True)
 return result.stdout
for uid,statement,pointer_path,pointer,note in definitions:
 assert not any(u['knowledgeId']==uid for u in ledger['knowledgeUnits'])
 value=json.loads((ROOT/pointer_path).read_text())
 for k in pointer.strip('/').split('/'):value=value[int(k)] if isinstance(value,list) else value[k]
 evidence={'path':pointer_path,'jsonPointer':pointer,'sha256':jhash(value),'sha256Mode':'json-value','relation':'candidate','semanticReviewed':False,'reviewNote':note}
 u={'knowledgeId':uid,'sourceRefs':[{'sourceId':'mfg1-surface-source','pdfPage':186,'elementIds':[],'sourceLocator':'Whole-page semantic inventory: manually enumerated source blocks, ruby, diagram labels and related graphical elements.'}],'statementJa':statement,'conditionsJa':['資料例の条件を保持し、実機操作・全材質の適合・仕上げ合格の保証を与えない。'],'exceptionsJa':[],'importance':'supporting' if 'mirror' in uid else 'core','classification':'knowledge','before':{'teaching':'unknown','assessment':'unknown'},'after':{'teaching':'partial','assessment':'missing'},'teachingEvidence':[evidence],'assessmentEvidence':[],'imageEvidence':[],'assessmentRequirement':'required','assessmentExemptionReason':None,'expressionReview':{'status':'pending','note':'Source objective is independently stated; complete app expression/assessment for this objective is not yet accepted.'},'sourceReview':{'status':'self_checked_ai','conditionsChecked':True,'reviewRef':receipt_ref},'status':'partial','unresolved':[note],'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False}}
 ledger['knowledgeUnits'].append(u);new.append(u)
by_id={u['knowledgeId']:u for u in [purpose,*new]}
# Every text block (including ruby fragments and whitespace) was read by ID
# against page186, not selected by font size or keyword/topic similarity.
definition_indices=set(range(14,52))|set(range(54,61))|set(range(140,155))
purpose_indices=set(range(66,86))|set(range(102,123))
mirror_indices=set(range(86,102));quality_indices=set(range(123,140))
navigation_indices=set(range(0,14))|{52,53}|set(range(61,66))
assert definition_indices|purpose_indices|mirror_indices|quality_indices|navigation_indices==set(range(155))
assigned={uid:[] for uid in by_id};decisions=[]
for e in regions['elements']:
 ids=[];kind=e['kind'];reason=''
 if kind=='text':
  i=int(e['elementId'].rsplit('-',1)[1]);assert len(blocks)>i
  b=blocks[i];assert b[6]==0
  assert max(abs(a-c) for a,c in zip(e['bbox'],[b[0]/page.rect.width,b[1]/page.rect.height,b[2]/page.rect.width,b[3]/page.rect.height]))<0.000002
  if not b[4].strip():classification='navigation';reason='Whitespace-only PDF positioning fragment; no visible instructional claim, retained with original fingerprint.'
  elif i in navigation_indices:classification='navigation';reason='Chapter/section heading, introductory continuation or repeated footer/page navigation; no separate factual objective beyond retained body.'
  else:
   classification='knowledge'
   uid='mfg59-buff-tool-definition' if i in definition_indices else purpose_id if i in purpose_indices else 'mfg59-buff-mirror-example' if i in mirror_indices else 'mfg59-buff-precision-quality'
   ids=[uid];reason='Body/ruby/label manually assigned to the specific definition, purpose, material example or precision-quality consequence; mapping is not automatic app acceptance.'
 elif kind=='image':
  classification='duplicate';ids=['mfg59-buff-tool-definition'];reason='Rasterized buff/abrasive, material/product or rotation label duplicates the independently retained text labels of figure13-1; keep source image fingerprint and semantic binding.'
 elif kind=='vector':
  classification='knowledge';ids=['mfg59-buff-tool-definition'];reason='Combined vector aggregate contains figure13-1 buff/workpiece/rotation geometry together with page decoration. Entire original aggregate retained; its instructional diagram is bound to definition without inferring dimensions or operational permission.'
 elif kind=='unknown' and e.get('originalKind')=='link':
  classification='navigation';reason='External-reference hyperlink annotation over the mirror-finish example. Embedded text/example is separately retained; destination content is not consulted or accepted as further knowledge.'
 else:raise AssertionError('Unreviewed element kind '+kind)
 e['classification']=classification;e['knowledgeIds']=ids;e['reason']=reason
 for uid in ids:assigned[uid].append(e['elementId'])
 decisions.append({'elementId':e['elementId'],'kind':kind,'classification':classification,'knowledgeIds':ids,'reason':reason})
for uid,u in by_id.items():assert assigned[uid];u['sourceRefs'][0]['elementIds']=assigned[uid]
purpose['sourceReview']['reviewRef']=receipt_ref
artifact_path.write_bytes(gzip.compress((json.dumps(artifact,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0));ah=hashlib.sha256(artifact_path.read_bytes()).hexdigest()
for pg in ledger['pages']:
 if pg['sourceId']=='mfg1-surface-source':
  pg['regionCensus']['sha256']=ah
  if pg['pdfPage']==186:
   pg['regionCensus']['status']='visually_reviewed';pg['regionCensus']['visualReviewRef']=receipt_ref;pg['semanticInventory']={'status':'complete_ai','reviewRef':receipt_ref};pg['knowledgeIds']=list(by_id);pg['disposition']='instructional'
ledger['source59']['wholePageInventoriesCompleted']=[186];ledger['source59']['wholePageInventoriesAreNotCoveredPages']=True
ledger_path.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
summary={'schemaVersion':1,'sector':'manufacturing','batch':'source59','status':'WHOLE_PAGE_SEMANTIC_INVENTORY_COMPLETE_AI_NOT_PAGE_COVERED','sourceId':'mfg1-surface-source','pdfPage':186,'sourceSha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'sourcePageReadAsTextAndImage':True,'elements':len(decisions),'textBlocksIncludingRubyAndWhitespace':155,'rasterLabelPlacements':3,'combinedVectorAggregates':1,'linkAnnotations':1,'allRegionsClassified':True,'knowledgeIds':list(by_id),'newUnresolvedSourceFacets':[u['knowledgeId'] for u in new],'existingAssessedPurposePreserved':purpose_id,'allPageKnowledgeCovered':False,'wholeSourceKnowledgeCovered':False,'sourceCoveragePercent':None,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False,'sourceTextOrPixelsRedistributed':False,'decisions':decisions}
receipt_path.write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in summary.items() if k!='decisions'}))
