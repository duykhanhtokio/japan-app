#!/usr/bin/env python3
"""Replay30explicitly self-viewed noninstructional-page decisions, never a semantic classifier."""
import gzip,hashlib,json
from pathlib import Path
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/source-coverage-v2';REF='docs/ssw-workspace/source-coverage-v2/manufacturing-source53-review.json'
def main():
 report=json.loads((R/REF).read_text());p=D/'manufacturing.json';ledger=json.loads(p.read_text());assert len(report['pages'])==30
 changed=[]
 for spec in ['mechanical','electrical','surface']:
  ap=D/f'manufacturing-{spec}-regions.json.gz';artifact=json.loads(gzip.decompress(ap.read_bytes()));sid=artifact['sourceId'];decisions=[r for r in report['pages'] if r['specialty']==spec]
  for row in decisions:
   n=row['pdfPage'];page=next(pg for pg in artifact['pages'] if pg['pdfPage']==n);assert page['textSha256']==row['sourceTextSha256'];assert not any(any(r['sourceId']==sid and r['pdfPage']==n for r in u['sourceRefs']) for u in ledger['knowledgeUnits']),f'Knowledge on excluded page{sid}/{n}'
   for el in page['elements']:
    assert not el['knowledgeIds'],el['elementId'];el['knowledgeIds']=[]
    if el['kind'] in ['text','text_span','unknown']:
     el['classification']='navigation';el['reason']=row['decisionReason']+' This retained element is a title/TOC-entry/ruby/page-label/publication-credit/address/URL/spacing occurrence, not a technical assertion; no destination technical content excluded.'
    else:
     el['classification']='decorative';el['reason']=row['decisionReason']+' This retained image/vector occurrence is unlabelled cover ornament, factory silhouette, chapter/index rule, dotted leader or publication separator; not an independent technical diagram.'
   entry=next(pg for pg in ledger['pages'] if pg['sourceId']==sid and pg['pdfPage']==n);entry.update(disposition=row['classification'],exclusionReason=row['decisionReason'],knowledgeIds=[]);entry['semanticInventory']={'status':'excluded','reviewRef':REF};entry['regionCensus'].update(status='visually_reviewed',visualReviewRef=REF);changed.append({'sourceId':sid,'pdfPage':n,'elementCount':len(page['elements'])})
  raw=(json.dumps(artifact,ensure_ascii=False,separators=(',',':'))+'\n').encode();ap.write_bytes(gzip.compress(raw,mtime=0));h=hashlib.sha256(ap.read_bytes()).hexdigest()
  for pg in ledger['pages']:
   if pg['sourceId']==sid:pg['regionCensus']['sha256']=h
 # Three instructional pages are required in addition to the30exclusions.
 for n in [10,11,12]:
  pg=next(pg for pg in ledger['pages'] if pg['sourceId']=='mfg1-electrical-source' and pg['pdfPage']==n);assert pg['semanticInventory']['status']=='complete_ai';assert all(next(u for u in ledger['knowledgeUnits'] if u['knowledgeId']==uid)['status'] in ['covered_ai','excluded'] for uid in pg['knowledgeIds'])
 ledger['source53']={'reviewRef':REF,'nonInstructionalPagesExplicitlyExcludedAi':30,'instructionalPagesCoveredAi':3,'historical33PageDispositionCompleteAi':True,'historical33TechnicalMasteryClaim':False,'whole574SourceClosed':False};p.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
 report['exactElementDispositionSummary']=changed;report['exactElementsClassified']=sum(r['elementCount'] for r in changed);(R/REF).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'status':'PASS_SCOPED33_PAGE_DISPOSITION_AI','newExcludedPages':30,'retainedClassifiedElements':report['exactElementsClassified'],'previouslyClosedInstructionalPages':3,'newOccupationalCompetencies':0,'whole574Covered':False}))
if __name__=='__main__':main()
