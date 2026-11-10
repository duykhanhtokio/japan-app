#!/usr/bin/env python3
"""Lossless geometric census. Historical mappings stay candidates, never a denominator."""
import fitz,json,hashlib,gzip,pathlib,collections
R=pathlib.Path(__file__).resolve().parents[2];O=R/'docs/ssw-workspace/source-coverage-v2'
def digest(b):return hashlib.sha256(b).hexdigest()
def encoded(x):return json.dumps(x,ensure_ascii=False,separators=(',',':'),default=str).encode()
def census(sector,specs):
 ledger={'schemaVersion':2,'sector':sector,'baselineCommit':'5ff65af0fe2ec63eb0b47c250212fd5dcc7c3c6a','sources':[],'pages':[],'knowledgeUnits':[],'denominator':{'status':'open','reviewNote':'All physical pages and geometric elements retained. Historical page-level mappings are candidates; semantic atoms, tables, captions and visual review remain incomplete.'},'wholeSourceKnowledgeCovered':False,'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False},'unresolved':['Source semantic denominator remains open; no coverage percentage is established.','Every source region needs semantic classification and independent teaching/assessment evidence before closure.']}
 for sid,path,expected,pages in specs:
  path=pathlib.Path(path);b=path.read_bytes();assert digest(b)==expected
  doc=fitz.open(path);assert len(doc)==pages;artifact={'schemaVersion':1,'sector':sector,'sourceId':sid,'pages':[]}
  for i,page in enumerate(doc):
   els=[]
   def add(kind,bbox,value,**kw):
    els.append(dict(elementId=f'{sid}:p{i+1}:e{len(els)}',kind=kind,bbox=list(bbox),sha256=digest(encoded(value)),classification='pending',knowledgeIds=[],reason=None,**kw))
   for block in page.get_text('dict')['blocks']:
    if block['type']==0:
     for line in block['lines']:
      for s in line['spans']:add('text_span',s['bbox'],s['text'],font={'name':s['font'],'size':s['size'],'flags':s['flags']})
   for im in page.get_image_info(hashes=True):add('image',im['bbox'],im)
   for v in page.get_drawings():add('vector',v['rect'],v)
   for link in page.get_links():add('unknown',link.get('from',page.rect),link,originalKind='link')
   annotations=page.annots()
   if annotations:
    for a in annotations:add('unknown',a.rect,{'info':a.info,'type':a.type},originalKind='annotation')
   artifact['pages'].append({'pdfPage':i+1,'elements':els})
  name=f'{sector}-{sid}-regions.json.gz';raw=gzip.compress(encoded(artifact),mtime=0);(O/name).write_bytes(raw)
  ledger['sources'].append({'sourceId':sid,'sha256':expected,'pdfPages':pages,'aliases':[path.name],'byteVerified':True,'verificationRef':f'scripts/kaigo/build-source-coverage-v2.py; SHA256 bytes and PyMuPDF page count verified'})
  for p in artifact['pages']:ledger['pages'].append({'sourceId':sid,'pdfPage':p['pdfPage'],'disposition':'unclassified','exclusionReason':None,'regionCensus':{'artifactPath':str((O/name).relative_to(R)),'sha256':digest(raw),'elementCount':len(p['elements']),'status':'extracted','visualReviewRef':None},'semanticInventory':{'status':'pending','reviewRef':None},'knowledgeIds':[]})
 return ledger
kaigo=census('kaigo',[('KAI-VI-2025','/workspace/scratch/f8119bf67710/private-kaigo-source/source.pdf','997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54',276)])
# Preserve app paragraph audit separately. An app paragraph is not a source atom.
m=json.loads((R/'docs/ssw-workspace/kaigo/completion-20261102/paragraph-source-assessment-matrix.json').read_text());rows=m['rows'];counts=collections.Counter(x['sourceBindingStatus'] for x in rows)
appindex={'schemaVersion':1,'sector':'kaigo','role':'app_mapping_index_not_source_denominator','counts':dict(counts),'rows':rows,'unresolved':'666 summarized mappings require source-region and semantic verification; exact paragraph snapshots also do not prove source exhaustiveness.'}
(O/'kaigo-app-mapping-index.json.gz').write_bytes(gzip.compress(encoded(appindex),mtime=0));kaigo['appMappingIndex']={'artifactPath':str((O/'kaigo-app-mapping-index.json.gz').relative_to(R)),'appParagraphs':len(rows),'bindingCounts':dict(counts),'sourceDenominator':False}
agr=census('agriculture',[(sid,f'/workspace/scratch/f8119bf67710/agriculture-v2-private-sources/{name}',h,n) for sid,name,h,n in [('AGR-S1','耕種農業全般 特定技能1号.pdf','20e865c154d43f1d22c44bc36e00179ca5dea42b248f57a46fd7205a3241eb3f',105),('AGR-S2','耕種農業全般 特定技能2号.pdf','c19741bd8f6128a80d9d9f9e3ab39e8a5e9eb969a30f51771c47527ef6190a12',132)]])
legacy=json.loads((R/'docs/ssw-workspace/agriculture/knowledge-ledger.json').read_text())['knowledge']
for x in legacy:
 refs=[{'sourceId':s['documentId'],'pdfPage':s['pdfPage'],'elementIds':[]} for s in x.get('sources',[]) if s.get('documentId') in {'AGR-S1','AGR-S2'} and s.get('pdfPage')]
 if not refs:continue
 kid='agriculture-v2-'+x['id'];u={'knowledgeId':kid,'sourceRefs':refs,'statementJa':x['titleJa'],'conditionsJa':[],'exceptionsJa':[],'importance':'core','classification':'knowledge','before':{'teaching':'unknown','assessment':'unknown'},'after':{'teaching':'unknown','assessment':'unknown'},'teachingEvidence':[],'assessmentEvidence':[],'imageEvidence':[],'assessmentRequirement':'required','assessmentExemptionReason':None,'expressionReview':{'status':'pending','note':'Historical objective label; independent expression review pending.'},'status':'candidate','unresolved':['Historical page references do not identify exact source elements or establish atomic completeness.','Lesson/question IDs are inherited candidates, not semantically accepted evidence.'],'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False},'legacyRefs':{'path':'docs/ssw-workspace/agriculture/knowledge-ledger.json','id':x['id'],'lessonIds':x.get('lessonIds',[]),'questionIds':x.get('questionIds',[])}}
 agr['knowledgeUnits'].append(u)
 for ref in refs:
  for p in agr['pages']:
   if (p['sourceId'],p['pdfPage'])==(ref['sourceId'],ref['pdfPage']):p['knowledgeIds'].append(kid);p['semanticInventory']['status']='partial'
agr['preservedEditorialConstraints']={'resolvedEditorialDecisions':55,'humidityRange':'35–55%','humidityDenominatorRequired':False,'note':'Preserved user instruction; no numeric denominator invented.','existingLessons':241,'existingAssessmentQuestions':1227,'countsAreSourceCoverageEvidence':False}
for sector,data in [('kaigo',kaigo),('agriculture',agr)]:
 (O/f'{sector}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');print(sector,len(data['pages']),len(data['knowledgeUnits']))
