"""Distinguish direct content links from TOC-parent rollups, never semantics."""
from pathlib import Path
from collections import Counter
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[2]
OUTPUT='docs/ssw-workspace/manufacturing/batch30-link-reconciliation/source-links.json'
SPECIALTIES=['mechanical','electrical','surface']
def read(p):return json.loads((ROOT/p).read_bytes())
def sha(p):return hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
def build():
 matrix_path='docs/ssw-workspace/manufacturing/knowledge-matrix.json'
 guide_path='src/data/manufacturing/source-guides.json'
 rows=read(matrix_path)['knowledge'];matrix={r['id']:r for r in rows}
 assert len(rows)==len(matrix),'Duplicate knowledge IDs'
 actual={identifier:[] for identifier in matrix};guides={identifier:[] for identifier in matrix};lesson_ids=set()
 inputs={matrix_path:sha(matrix_path),guide_path:sha(guide_path)}
 for specialty in SPECIALTIES:
  p='src/data/manufacturing/'+specialty+'.json';inputs[p]=sha(p)
  for lesson in read(p)['lessons']:
   assert lesson['id'] not in lesson_ids and lesson['specialty']==specialty
   lesson_ids.add(lesson['id'])
   for identifier in lesson['knowledgeIds']:
    assert identifier in matrix and matrix[identifier]['sourceId']=='mfg1-'+specialty+'-source'
    actual[identifier].append({'id':lesson['id'],'sourceHash':lesson['sourceHash']})
 for r in rows:
  assert len(set(r.get('lessonIds',[])))==len(r.get('lessonIds',[]))
  assert set(r.get('lessonIds',[]))=={l['id'] for l in actual[r['id']]},'Core forward/backlink mismatch:'+r['id']
 all_guides=read(guide_path)['guides'];guide_ids=set()
 for guide in all_guides:
  assert guide['id'] not in guide_ids;guide_ids.add(guide['id'])
  for identifier in guide['knowledgeIds']:
   assert identifier in matrix and matrix[identifier]['sourceId']=='mfg1-'+guide['specialty']+'-source'
   guides[identifier].append({'id':guide['id'],'sourceHash':guide['sourceHash'],'reviewStatus':guide['reviewStatus']})
 direct={i for i in matrix if actual[i] or guides[i]};items=[];counts=Counter();by_source={}
 for r in rows:
  identifier=r['id'];descendants=[i for i in direct if matrix[i]['sourceId']==r['sourceId'] and i.startswith(identifier+'-')]
  if actual[identifier] and guides[identifier]:kind='direct_core_and_guide'
  elif actual[identifier]:kind='direct_core_only'
  elif guides[identifier]:kind='direct_guide_only'
  elif descendants:kind='hierarchy_only'
  else:kind='no_direct_or_descendant_link'
  counts[kind]+=1;by_source.setdefault(r['sourceId'],Counter())[kind]+=1
  items.append({'knowledgeId':identifier,'sourceId':r['sourceId'],'titleJa':r.get('title') or r.get('titleJa'),
    'coreLinks':sorted(actual[identifier],key=lambda v:v['id']),'guideLinks':sorted(guides[identifier],key=lambda v:v['id']),
    'linkKind':kind,'linkedDescendantIds':sorted(descendants) if kind=='hierarchy_only' else [],
    'semanticCoverageCertified':False})
 summary={'tocRows':len(rows),'actualCoreLessons':len(lesson_ids),'actualReferenceGuides':len(all_guides),
          'directCoreRows':sum(bool(v) for v in actual.values()),'directGuideRows':sum(bool(v) for v in guides.values()),
          'directUnionRows':len(direct),'hierarchyOnlyRows':counts['hierarchy_only'],
          'noDirectCoreLinkRows':len(rows)-sum(bool(v) for v in actual.values()),
          'noDirectContentLinkRows':len(rows)-len(direct),
          'noDirectOrDescendantLinkRows':counts['no_direct_or_descendant_link'],
          'classificationCounts':dict(sorted(counts.items()))}
 return {'schemaVersion':1,'date':'2026-10-28','evidenceType':'metadata_structure_only','inputsSha256':inputs,'summary':summary,
         'bySource':{k:dict(sorted(v.items())) for k,v in sorted(by_source.items())},'rows':items,
         'interpretation':['A parent TOC row may have no direct lesson while its child rows have content links.',
           'Hierarchy-only is an ID/source relationship inference, not a new lesson, source-page reading or semantic closure.',
           'Core-only, guide-only, overlapping and hierarchy-only counts must not be added as independent populations.',
           'A structural link does not prove that every sentence, diagram, formula or operational qualification is taught.'],
         'physicalPagesReadInThisAudit':0,'semanticCoveragePercent':None,'fullKnowledgeAtomizationComplete':False,
         'wholeCurriculumComplete':False,'nativeReviewed':False,'domainReviewed':False,'releaseReady':False}
if __name__=='__main__':
 value=build();path=ROOT/OUTPUT
 if sys.argv[1:]==['--write']:
  path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
 else:
  assert not sys.argv[1:],'Usage: check-source-link-reconciliation.py [--write]'
  assert read(OUTPUT)==value,'Stale structural source-link evidence; recompute after deliberate content changes'
 print(json.dumps({'status':'PASS_STRUCTURAL_ONLY',**value['summary'],'wholeCurriculumComplete':False,'semanticCoveragePercent':None}))
