#!/usr/bin/env python3
"""Create one manufacturing acceptance registry; legacy ledgers are provenance only.

The denominator stays open. Only three source pages were freshly viewed in this
v2 session. Existing 267 bounded rows remain a legacy index, not 267 newly
accepted ideas or an additive parent/child denominator.
"""
import gzip
import hashlib
import json
import subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/ssw-workspace/source-coverage-v2'
MFG=ROOT/'docs/ssw-workspace/manufacturing'
BASELINE='5ff65af0fe2ec63eb0b47c250212fd5dcc7c3c6a'
REVIEW_REF='docs/ssw-workspace/source-coverage-v2/manufacturing-source-review.json'
SPECS=[('mechanical','mechanical-inventory.json',169),('electrical','electrical-inventory.json',198),('surface','surface-inventory.json',207)]
FRESH={('mechanical',89),('electrical',165),('surface',103)}
COVERED={'mfg47-mechanical-phantom-tool','mfg47-mechanical-center','mfg47-electrical-no-main-interruption'}
# Manual visual selection of claim-bearing areas. The source text/rows were
# actually viewed before these bounds were authored. They do not infer semantics.
ROW_BOXES={
 'outline':(.12,.10,.90,.138),'dimension':(.12,.135,.90,.173),
 'extension':(.12,.17,.90,.231),'hidden':(.12,.23,.90,.291),'center':(.12,.288,.90,.326),
 'phantom-neighbor':(.12,.325,.90,.355),'phantom-tool':(.12,.349,.90,.401),
 'phantom-motion':(.12,.40,.90,.44),'phantom-before-after':(.12,.438,.90,.47),
 'phantom-repeat':(.12,.466,.90,.493),'phantom-front':(.12,.49,.90,.522),
 'break-shape':(.12,.52,.90,.635),'break-role':(.12,.52,.90,.635),
 'cut-shape':(.12,.63,.90,.772),'cut-role':(.12,.63,.90,.772),
 'hatch-shape':(.12,.77,.90,.862),'hatch-role':(.12,.77,.90,.862),
 'assembly':(.16,.13,.90,.17),'alias':(.16,.13,.90,.19),
 'threshold-time':(.16,.17,.90,.225),'purpose':(.16,.223,.90,.25),
 'reset':(.16,.249,.90,.271),'photo':(.39,.28,.58,.46),
 'no-main-interruption':(.16,.59,.90,.726),
 'bimetal-material':(.16,.726,.90,.785),'bimetal-motion':(.16,.748,.90,.835),
 'solute':(.12,.14,.92,.18),'solvent':(.12,.18,.92,.21),'solution':(.12,.21,.92,.25),
 'salt-example':(.12,.28,.92,.445),'precipitate':(.12,.50,.92,.575),
 'solubility-condition':(.12,.545,.92,.59),'quantitative':(.12,.575,.92,.605),
 'silver-chloride':(.12,.675,.94,.72),'sulfate':(.12,.71,.94,.75),'sulfate-white':(.12,.675,.94,.75),
}

def read(p):return json.loads((ROOT/p).read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def value_at(d,ptr):
 for key in ptr.strip('/').split('/'):
  key=key.replace('~1','/').replace('~0','~')
  d=d[int(key)] if isinstance(d,list) else d[key]
 return d

def evidence(path,ptr,reviewed,note):
 return {'path':path,'jsonPointer':ptr,'sha256':'0'*64,'sha256Mode':'json-value',
         'relation':'direct' if reviewed else 'candidate','semanticReviewed':reviewed,'reviewNote':note}

def pointer_for_lesson(binding):
 path=binding['file'];d=read(path)
 for li,l in enumerate(d['lessons']):
  if l['id']!=binding['lessonId']:continue
  for pi,p in enumerate(l['paragraphs']):
   if p['id']==binding['paragraphId']:return path,f'/lessons/{li}/paragraphs/{pi}/textJa'
 return None,None

def main():
 census=json.loads((OUT/'manufacturing-census-validation.json').read_text())
 sources=[];artifacts={};all_pages={};specialty={}
 for spec,inv_name,total in SPECS:
  inv=json.loads((MFG/inv_name).read_text());sid=inv['canonicalDocumentId'];specialty[sid]=spec
  sources.append({'sourceId':sid,'sha256':inv['sha256'],'pdfPages':total,'aliases':[],
     'byteVerified':True,'verificationRef':'docs/ssw-workspace/source-coverage-v2/manufacturing-census-validation.json'})
  path=f'docs/ssw-workspace/source-coverage-v2/manufacturing-{spec}-regions.json.gz'
  doc=json.loads(gzip.decompress((ROOT/path).read_bytes()));artifacts[sid]=(path,doc)
  for p in doc['pages']:all_pages[(sid,p['pdfPage'])]=p
 # Legacy rows are retained separately so coarser parent rows cannot inflate
 # the active atomic-unit count or silently become independent accepted ideas.
 legacy=read('docs/ssw-workspace/manufacturing/source-closure-20261031/coverage-matrix.json')
 legacy_index=[{'legacyId':u['id'],'sourceId':u['sourceId'],'pdfPage':u['physicalPage'],
   'legacyRef':u['sourceUnitFile'],'status':'legacy_candidate_not_recounted_as_unique_knowledge'} for u in legacy['semanticUnitIndex']]
 qrows=read('docs/ssw-workspace/manufacturing/session-20261102/atomic47/question-bindings.json')['questions']
 units=[];dispositions={};page_ids={key:[] for key in all_pages}
 for spec,_,_ in SPECS:
  atom_file=f'docs/ssw-workspace/manufacturing/session-20261102/atomic47/{spec}-atoms.json'
  for ai,a in enumerate(read(atom_file)['atoms']):
   uid=a['id'];sid=a['sourceId'];number=a['physicalPage'];fresh=(spec,number) in FRESH
   suffix=uid.replace('mfg47-'+spec+'-','');box=ROW_BOXES.get(suffix)
   elements=[]
   if fresh and box:
    for el in all_pages[(sid,number)]['elements']:
     x1,y1,x2,y2=el['bbox'];cx=(x1+x2)/2;cy=(y1+y2)/2
     if box[0]<=cx<=box[2] and box[1]<=cy<=box[3] and el['kind']==('image' if suffix=='photo' else 'text'):
      elements.append(el['elementId']);disp=dispositions.setdefault(el['elementId'],{'classification':'knowledge','knowledgeIds':[],'reason':None});disp['knowledgeIds'].append(uid)
   unresolved=[]
   if not fresh:unresolved.append('Historical source comparison retained; v2 exact source-element assignment and current condition review pending.')
   if not elements:unresolved.append('Exact claim-bearing source elements have not been assigned in v2.')
   path,ptr=pointer_for_lesson(a['lessonBinding']) if a.get('lessonBinding') else (None,None);te=[]
   status=a['teachingStatus'];taught=fresh and status.startswith('taught')
   if spec=='electrical' and suffix in ['threshold-time','bimetal-material']:
    taught=False  # Fresh source check found conditions/physical construction not fully explicit.
   if a.get('supplementBinding'):
    path=a['supplementBinding']['file'];ptr='/wording/ja/after';taught=fresh
   if suffix in ['purpose','reset','threshold-time','bimetal-material'] and spec=='electrical':
    path='src/data/manufacturing/source49-thermal-clarification.json';ptr='/wording/ja/after';taught=True
   if path:
    te=[evidence(path,ptr,taught,'Self-compared claim against actual current Japanese teaching; reference is to app-authored wording.' if taught else 'Current paragraph binding retained as a candidate; a topic/page match alone is not acceptance.')]
   ae=[];assessment=False
   for q in qrows:
    if uid in q['sourceAtomIds']:
     # Only the three specifically reviewed competencies have direct exact tests.
     direct=uid in COVERED;assessment|=direct
     ae.append(evidence(q['sourcePath'],q['jsonPointer'],direct,
        'Self-compared stem, keyed answer and distractors test the stated role, not a broader page topic.' if direct else 'Historical question is related; the entire atomic condition is not established as assessed.'))
   if not taught:unresolved.append('Current direct teaching of every claim/condition is not established.')
   if not assessment:unresolved.append('Direct assessment is not established within the imported source47 question mappings; the complete app question bank has not been exhaustively searched for this claim.')
   if suffix=='photo':unresolved.append('Photographic component identification and licensed/original replacement are not established.')
   conditions=[];exceptions=[]
   if suffix in ['purpose','reset','threshold-time','bimetal-material'] and spec=='electrical':
    conditions=['教材で説明する電磁開閉器の文脈。','復帰前に安全を確認する。' if suffix=='reset' else '過負荷による電動機の焼損を防ぐという目的。']
    exceptions=['実機の復帰設定や操作の承認を、この説明だけで与えない。']
   statement=a['summaryJa']
   if spec=='electrical' and suffix=='threshold-time':
    statement='資料は、電流が設定値以上の状態で一定時間以上続いたとき、発熱とバイメタル動作で過負荷を検出する条件を説明する。'
    conditions=['設定電流以上であること。','一定時間以上流れ続けること。']
    exceptions=['瞬間的な変化だけで、この条件を満たすとは判定しない。','資料は製品ごとの数値や実際の整定操作を指定していない。']
    unresolved.append('The source49 reader now teaches both inclusive thresholds; a role-distribution question does not establish assessment of those conditions.')
   if spec=='electrical' and suffix=='bimetal-material':
    conditions=['熱膨張率が異なる二種類の金属板を貼り合わせた材料として説明する。']
    unresolved.append('The source49 reader now teaches two bonded plates; the legacy true/false item does not explicitly assess the full construction.')
   covered=uid in COVERED and bool(elements) and taught and assessment
   if covered:unresolved=[]
   unit={'knowledgeId':uid,'sourceRefs':[{'sourceId':sid,'pdfPage':number,'elementIds':elements,
         'sourceLocator':a['sourceLocator'],'manualRegionBBox':list(box) if box else None}],
     'statementJa':statement,'legacyStatementJa':a['summaryJa'],'conditionsJa':conditions,'exceptionsJa':exceptions,
     'importance':'safety' if suffix in ['purpose','reset','no-main-interruption'] else ('reference' if number in [10,11,12] and spec=='electrical' else 'core'),
     'classification':'knowledge','before':{'teaching':'present' if status.startswith('taught') else 'partial' if status.startswith('partial') else 'missing' if status.startswith('gap') else 'unknown','assessment':'unknown'},
     'legacyTeachingStatus':status,'legacyBefore47Status':a.get('before47Status'),
     'after':{'teaching':'present' if taught else ('partial' if path else 'unknown'),'assessment':'present' if assessment else ('partial' if ae else 'unknown')},
     'teachingEvidence':te,'assessmentEvidence':ae,'imageEvidence':[],
     'assessmentRequirement':'required','assessmentExemptionReason':None,
     'expressionReview':{'status':'independent_ai_checked' if fresh else 'pending',
       'note':'Concise factual objective and existing independently authored app example; source page image, exercise and prose are not republished.' if fresh else 'Legacy authoring provenance retained; v2 expression/rights disposition not automatically accepted.'},
     'sourceReview':{'status':'self_checked_ai' if fresh else 'pending','conditionsChecked':fresh,'reviewRef':REVIEW_REF},
     'status':'covered_ai' if covered else ('partial' if taught else 'candidate'),
     'unresolved':unresolved,'v2InitialTeachingFinding':'partial_then_source49_repaired' if spec=='electrical' and suffix in ['purpose','reset','threshold-time','bimetal-material'] else None,
     'legacyRefs':[{'path':atom_file,'jsonPointer':f'/atoms/{ai}'}],
     'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False}}
   units.append(unit);page_ids[(sid,number)].append(uid)
 # Store classification decisions, then reproduce exact census bytes with them.
 disp_doc={'schemaVersion':1,'sector':'manufacturing','basis':'Author visual reading of mechanical89/electrical165/surface103; bounded claim areas only; other regions remain pending.','elements':dispositions}
 (OUT/'manufacturing-region-dispositions.json').write_text(json.dumps(disp_doc,ensure_ascii=False,separators=(',',':'))+'\n')
 # Existing artifacts are updated from the same manual decisions. The census
 # builder independently reproduces these exact bytes when run with --check.
 for sid,(path,doc) in artifacts.items():
  for page in doc['pages']:
   for e in page['elements']:
    if e['elementId'] in dispositions:e.update(dispositions[e['elementId']])
  raw=(json.dumps(doc,ensure_ascii=False,separators=(',',':'))+'\n').encode();(ROOT/path).write_bytes(gzip.compress(raw,mtime=0))
 pages=[]
 for sid,(path,doc) in artifacts.items():
  digest=sha(ROOT/path)
  for p in doc['pages']:
   fresh=(specialty[sid],p['pdfPage']) in FRESH
   pages.append({'sourceId':sid,'pdfPage':p['pdfPage'],'disposition':'instructional' if fresh else 'unclassified',
      'exclusionReason':None,'regionCensus':{'artifactPath':path,'sha256':digest,'elementCount':len(p['elements']),
        'status':'visually_reviewed' if fresh else 'extracted','visualReviewRef':REVIEW_REF if fresh else None},
      'semanticInventory':{'status':'partial' if page_ids[(sid,p['pdfPage'])] else 'pending','reviewRef':REVIEW_REF if fresh else None},
      'knowledgeIds':page_ids[(sid,p['pdfPage'])]})
 ledger={'schemaVersion':2,'sector':'manufacturing','baselineCommit':BASELINE,'sources':sources,
    'pages':pages,'knowledgeUnits':units,'legacyCandidateIndex':legacy_index,
    'assessmentSearchScope':{'scope':'Imported source47 question mappings and three specifically self-compared direct competencies; no exhaustive search of the complete app bank.','unmappedMeans':'unknown; not proof that the app lacks a suitable question'},
    'legacyIndexCountIsNotUniqueKnowledgeDenominator':True,
    'denominator':{'status':'open','reviewNote':'574 source pages and all extracted spans are retained. The57 bounded atomic rows are not all important ideas.267 older coarser rows remain provenance outside the active unit count.'},
    'wholeSourceKnowledgeCovered':False,'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False},
    'unresolved':['All-important-idea inventory across574pages is still open; every unresolved region remains visible.','Three newly visually read pages have bounded source/app checks; no whole-page semantic closure is inferred.','Legacy267candidate rows require exact element and condition disposition before joining a unique denominator.','Device recognition, all-language semantic review, audio, real-device and learner timing acceptance remain open.']}
 out=OUT/'manufacturing.json';out.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
 # Use exactly the validator's JavaScript serialization for JSON-value hashes.
 subprocess.run(['node','-e',r'''const fs=require('fs'),crypto=require('crypto');const p=process.argv[1],d=JSON.parse(fs.readFileSync(p));for(const u of d.knowledgeUnits)for(const key of ['teachingEvidence','assessmentEvidence','imageEvidence'])for(const e of u[key]){let v=JSON.parse(fs.readFileSync(e.path));for(const token of e.jsonPointer.slice(1).split('/'))v=v[token.replace(/~1/g,'/').replace(/~0/g,'~')];e.sha256=crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');}fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');''',str(out)],cwd=ROOT,check=True)
 review={'schemaVersion':1,'sector':'manufacturing','date':'2026-11-02','sourcePagesFreshlyViewed':[{'sourceId':sid,'pdfPage':n} for spec,n in sorted(FRESH) for sid in specialty if specialty[sid]==spec],
    'sourceReviewMethod':'Rendered full pages read by author; manually bounded claim areas assigned to text/image blocks. No geometry or keyword match is treated as semantic acceptance.',
    'newTeachingRepairs':['mfg47-electrical-purpose','mfg47-electrical-reset','mfg47-electrical-threshold-time','mfg47-electrical-bimetal-material'],
    'newlyFoundConditionsNowTaughtButAssessmentPending':['mfg47-electrical-threshold-time','mfg47-electrical-bimetal-material'],
    'source49Scope':'Prevent overload burnout; source describes manual signal reset after safety check. App wording explicitly does not authorize changing an actual device setting.',
    'directAssessmentDecisions':sorted(COVERED),'broaderAssessmentLinksRemainCandidates':True,
    'allPageIdeasInventoried':False,'sourceExpressionCopied':False,'sourceImagesRepublished':False,
    'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False}
 (OUT/'manufacturing-source-review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n')
 for replay in ['extend-source50-registry.py','extend-source51-registry.py','extend-source52-registry.py','extend-source53-registry.py','extend-source54-registry.py','extend-source56-registry.cjs','sync-source-v2-artifacts.py']:
  subprocess.run(['node' if replay.endswith('.cjs') else 'python3',str(ROOT/'scripts/manufacturing'/replay)],cwd=ROOT,check=True)
 print(json.dumps({'legacyBasePages':len(pages),'boundedUnits':len(units),'legacyCandidatesNotAddedToDenominator':len(legacy_index),'coveredAi':sum(u['status']=='covered_ai' for u in units),'source49TeachingRepairs':4}))

if __name__=='__main__':main()
