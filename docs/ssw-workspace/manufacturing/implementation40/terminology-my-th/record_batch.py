"""Materialize EXPLICITLY READ batch decisions, not an autoacceptor.

Only ranges entered in read-batches.json after actual model comparison are emitted.
Unread input slots are never accepted. No learner data is edited.
"""
from pathlib import Path
import hashlib,json
OUT=Path(__file__).resolve().parent
BASE=OUT.parent/'language/term-review-inputs'

def main():
 batches=json.loads((OUT/'read-batches.json').read_text())['batches'];inputs={l:json.loads((BASE/f'{l}.json').read_text()) for l in ['my','th']};decisions=[];seen=set()
 for batch in batches:
  for index in batch['actuallyReadIndices']:
   for locale,value in inputs.items():
    if locale=='th' and index<30:continue
    r=value['records'][index];ident=(locale,r['key']);assert ident not in seen;seen.add(ident)
    key=f'{locale}:{index}';override=batch.get('decisions',{}).get(key,{})
    decision=override.get('decision','ai_semantic_no_concrete_mismatch_found')
    note=override.get('contextnote',f"{r['termJa']}: compared this target definition against Japanese meaning «{r['meaningJa']}» with its supplied lesson binding retained (full lesson prose not re-read in this glossary pass). No concrete meaning/condition/unit contradiction found in this bounded glossary pass; synonym variation retained.")
    row={'key':r['key'],'index':index,'locale':locale,'targetSha256':r['targetSha256'],'lessonSourceHash':r['lessonSourceHash'],'termJa':r['termJa'],'meaningJa':r['meaningJa'],'targetField':r['targetField'],'decision':decision,'contextnote':note,'batchId':batch['id'],'comparisonMethod':'actual_model_read_Japanese_definition_and_target_not_string_matching','nativeReviewed':False,'domainReviewed':False,'humanReviewed':False}
    if 'after' in override:
     assert override['after']!=r['target'];row.update(before=r['target'],after=override['after'],afterSha256=hashlib.sha256(override['after'].encode()).hexdigest())
    decisions.append(row)
 for locale in ['my','th']:
  receipt=json.loads((OUT/f'inherited-{locale}.json').read_text())
  for r in receipt['records']:
   if r['decision']=='pending_unread':continue
   ident=(locale,r['key']);assert ident not in seen;seen.add(ident)
   r=dict(r)
   if r.get('before')==r.get('after'):r.pop('after',None);r.pop('before',None)
   decisions.append(dict(r,locale=locale,contextnote=r['contextNote'],provenance=f'Inherited actually-read frozen receipt from /root/surface_coverage: inherited-{locale}.json',humanReviewed=False,domainReviewed=False))
 pending=[{'locale':l,'key':r['key'],'index':i,'targetSha256':r['targetSha256'],'decision':'not_reviewed_in_this_pass'} for l,j in inputs.items() for i,r in enumerate(j['records']) if (l,r['key']) not in seen]
 report={'schemaVersion':1,'date':'2026-10-31','scope':'glossary_definition_semantics_only_not_all_prose/options_or_source_domain_acceptance','expectedSlots':sum(j['count'] for j in inputs.values()),'actuallyReadSlots':len(decisions),'pendingUnreadSlots':len(pending),'allSlotsActuallyReviewed':not pending,'decisions':decisions,'pending':pending,'inputFileSha256':{l:hashlib.sha256((BASE/f'{l}.json').read_bytes()).hexdigest() for l in inputs},'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False}
 (OUT/'semantic-decisions.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print('Actuallyread',len(decisions),'pending',len(pending),'corrections',sum('after'in x for x in decisions))
if __name__=='__main__':main()
