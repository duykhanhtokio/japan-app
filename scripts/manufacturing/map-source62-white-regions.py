"""Exact bounded region mapping after self-reading the two source103 white examples."""
from pathlib import Path
import json,gzip,hashlib,subprocess
ROOT=Path(__file__).resolve().parents[2];base=ROOT/'docs/ssw-workspace/source-coverage-v2';lp=base/'manufacturing.json';ap=base/'manufacturing-surface-regions.json.gz'
ledger=json.loads(lp.read_text());artifact=json.loads(gzip.decompress(ap.read_bytes()));page=next(p for p in artifact['pages']if p['pdfPage']==103)
selections={'mfg47-surface-silver-white':set(range(136,140)),'mfg47-surface-sulfate-white':set(range(143,147))}
receipt='docs/ssw-workspace/source-coverage-v2/manufacturing-source62-white-regions.json'
baseline=json.loads(subprocess.check_output(['git','show','f72e3e6c:docs/ssw-workspace/source-coverage-v2/manufacturing.json'],cwd=ROOT))
rows=[]
for uid,indices in selections.items():
 u=next(u for u in ledger['knowledgeUnits']if u['knowledgeId']==uid);ref=next(r for r in u['sourceRefs']if r['sourceId']=='mfg1-surface-source'and r['pdfPage']==103);ids=[]
 for e in page['elements']:
  if e['kind']=='text'and int(e['elementId'].rsplit('-',1)[1])in indices:
   e['classification']='knowledge';e['knowledgeIds']=sorted(set(e['knowledgeIds']+[uid]));e['reason']='Manually read source103 named reaction/product, white-colour term and ruby/precipitate label in this specific example; no whole-page or real-liquid analytical acceptance.';ids.append(e['elementId'])
 assert len(ids)==4,(uid,ids)
 # Preserve prior correct source assignments while adding the previously missing colour rows.
 ref['elementIds']=sorted(set(ref['elementIds']+ids));ref['sourceLocator']='Source103 example reaction/product and its adjacent white-precipitate label/ruby; manually selected text blocks136–139(AgCl) or143–146(BaSO4), not a keyword match across page.'
 pg=next(p for p in ledger['pages']if p['sourceId']=='mfg1-surface-source'and p['pdfPage']==103);pg['knowledgeIds']=sorted(set(pg['knowledgeIds']+[uid]));rows.append({'knowledgeId':uid,'selectedElementIds':ids,'actuallyAddedSinceBaseline':sorted(set(ref['elementIds'])-set(next(x for x in baseline['knowledgeUnits']if x['knowledgeId']==uid)['sourceRefs'][0]['elementIds'])),'priorElementIdsPreserved':len(next(x for x in baseline['knowledgeUnits']if x['knowledgeId']==uid)['sourceRefs'][0]['elementIds'])})
ap.write_bytes(gzip.compress((json.dumps(artifact,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0));h=hashlib.sha256(ap.read_bytes()).hexdigest()
for p in ledger['pages']:
 if p['sourceId']=='mfg1-surface-source':p['regionCensus']['sha256']=h
lp.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
(base/'manufacturing-source62-white-regions.json').write_text(json.dumps({'schemaVersion':1,'sector':'manufacturing','sourceId':'mfg1-surface-source','pdfPage':103,'sourceSha256':'08d7e9d6ae5fc5a442af227bbc690ed54cde06681ee8806eb7aadf87748b2eae','sourceTextAndImageSelfRead':True,'mappings':rows,'allExtractionFingerprintsPreserved':True,'wholePageClosed':False,'sourcePayloadRedistributed':False},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'EXACT_WHITE_REGIONS_MAPPED','units':2,'selectedElements':8,'newReferencesSinceBaseline':sum(len(r['actuallyAddedSinceBaseline'])for r in rows),'wholePageClosed':False}))
