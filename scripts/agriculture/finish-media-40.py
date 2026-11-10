"""Intake only manifest-listed original art; leave source documents private."""
import json,hashlib,shutil,re
from pathlib import Path
R=Path(__file__).resolve().parents[2];D=R/'src/data/agriculture';W=R/'docs/ssw-workspace/agriculture/completion-40';S=R.parent/'agri-final-work'
def read(p):return json.loads(p.read_text())
def put(p,j):p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')
def digest(j):return hashlib.sha256(json.dumps(j,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
lessons=read(D/'lessons.ja.json');by={l['id']:l for l in lessons['lessons']};ledger=read(W.parent/'knowledge-ledger.json');ks={k['id']:k for k in ledger['knowledge']};compat=read(D/'source-hash-compatibility.json');master=read(W/'japanese-integrated.json');course=read(D/'course-manifest.json')
proposals=read(S/'facility/level-metadata-proposals.json')['proposals'];proof=[]
for p in proposals:
 old=by[p['lessonId']];new=p['afterLesson'];oldhash=p['beforeSourceHash']
 def semantic(l):return {k:v for k,v in l.items() if k not in ['sourceHash','sources','levels','revision','nativeReviewed','domainReviewed','humanReviewed','sourceCheck']}
 assert semantic(old)==semantic(new);assert old['sourceHash'] in [oldhash,new['sourceHash']]
 compat['lessons'][old['id']]={'currentSourceHash':new['sourceHash'],'compatibleSourceHashes':[oldhash],'semanticPayloadSha256':digest(semantic(old)),'reason':'Verified metadata-only additional source/level; all Japanese learning strings and prior question revisions unchanged.'}
 if old['sourceHash']==oldhash:
  by[old['id']]=new;lessons['lessons'][lessons['lessons'].index(old)]=new
  for loc in read(D/'translations.json')['locales']:
   f=D/'translations'/f'{loc}.json';j=read(f);assert j[old['id']]['sourceHash']==oldhash;j[old['id']]['sourceHash']=new['sourceHash'];put(f,j)
  for k in ledger['knowledge']:
   if old['id'] in k['lessonIds']:
    k['scopeLevels']=sorted(set(k['scopeLevels']+new['levels']))
    for ref in p['additionalSources']:
     if ref not in k['sources']:k['sources'].append(ref)
  level=p['addedLevel'];weeks=course['levels'][level]['weeks']
  if not any(old['id'] in w['lessonIds'] for w in weeks):
   w=next((w for w in weeks if len(w['lessonIds'])<6 and any(by[i]['chapter']==new['chapter'] for i in w['lessonIds'])),None)
   if w is None:
    n=max(w['number'] for w in weeks)+1;w={'id':f'agr-{level}-w{n:02}','number':n,'titleJa':new['chapter']+'の補足確認','lessonIds':[]};weeks.append(w)
   w['lessonIds'].append(old['id'])
 proof.append({'lessonId':old['id'],'beforeSourceHash':oldhash,'afterSourceHash':new['sourceHash'],'JapaneseLearningFieldsUnchanged':True,'previousProgressCompatible':True,'sourceItemIds':p['sourceItemIds']})
put(D/'lessons.ja.json',lessons);put(D/'source-hash-compatibility.json',compat);put(D/'course-manifest.json',course);put(W/'metadata-scope-proof.json',proof)
for i,l in enumerate(master['lessons']):
 if l['id'] in by:master['lessons'][i]=by[l['id']]
put(W/'japanese-integrated.json',master)
files=['general/figures.json','general/newmedia.json','soil/new-media.json','soil/ridge-diagram.json','rice/newmedia.json','rice/newmedia-addendum.json','safety/new-media.json','flower/new-media.json','facility/figures/register.json','facility/newmedia.json','facility/final-support-media.json','facility-safety-support/new-media.json','facility-soil-support/new-media.json','visual-safety/scope-resolved-helper-media.json']
registry=read(D/'recognition-images.json');register=read(W.parent/'illustration-register.json');existing={i['id']:i for i in registry['images']};registered={i['id']:i for i in register['figures']};intake=[];replaced=set()
for name in files:
 j=read(S/name)
 for row in j.get('images',j.get('figures',[j] if 'assetSha256' in j else [])):
  if row.get('replacementForFigureId'):replaced.add(row['replacementForFigureId'])
for name in files:
 folder=(S/name).parent;j=read(S/name)
 if folder.name=='figures':folder=folder.parent
 archive=W/folder.name;archive.mkdir(exist_ok=True);shutil.copy2(S/name,archive/Path(name).name)
 for raw in j.get('images',j.get('figures',[j] if 'assetSha256' in j else [])):
  if raw['id'] in replaced:continue
  x=dict(raw);sha=x['assetSha256'];candidates=[]
  for key in ['localAssetPath','sourceAssetPath','localFile']:
   if x.get(key):candidates.append(Path(x[key]))
  basename=Path(x.get('assetPath',x.get('assetName',''))).name
  if basename:candidates+=list(folder.rglob(basename))
  # Some manifests use figure ID as filename rather than runtime basename.
  candidates+=list(folder.rglob(x['id']+'.png'))
  path=next((p for p in candidates if p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==sha),None)
  assert path, (name,x['id'],basename)
  target=R/'assets/agriculture/completion-40'/folder.name/path.name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(path,target)
  x['assetPath']=str(target.relative_to(R));x['assetKey']=x.get('assetKey',x['id']);x['scopeLevels']=list(map(str,x.get('scopeLevels',['1','2'])))
  fallback={'agr-fig-ridge-dimensions-v1':'agr-drainage-foundations','agr-fig-soil-three-factor-relations-v1':'agr-soil-building','agr-fig-rotation-two-year-examples-v1':'agr-f40-soil-common-reading','agr-fig-nutrient-entry-routes-v2':'agr-fertilizer-nutrients'}
  ids=x.get('lessonIds',[x.get('suggestedLessonId',fallback.get(x['id']))]);assert ids and all(i in by for i in ids),(name,x['id'],ids)
  if folder.name=='soil' and x['id'] in ['agr-recognition-tractors-appearance-v1','agr-recognition-tillage-attachments-appearance-v1'] and '1' in x['scopeLevels']:ids.append('agr-f40-soil-field-details')
  if folder.name=='safety' and '1' in x['scopeLevels'] and not any('1' in by[i]['levels'] for i in ids):ids.append('agr-f40-safety-s1-practical-details')
  if x['id'] in ['agr-f40-pf-source-range-comparison','agr-f40-soil-moisture-instrument-forms']:ids.append('agr-vegwork-environment')
  # Route one-level greenhouse equipment through its source-specific supplement.
  if folder.name=='facility-safety-support':
   if x['id']=='agr-f40-facility-support-greenhouse-flowers-b':x['scopeLevels']=['2'];x['sourceItemIds']=['AGR-A10-FACILITY-0241','AGR-A10-FACILITY-0242']
   if not any('1' in by[i]['levels'] for i in ids) and '1' in x['scopeLevels']:
    helpers=[l for l in by.values() if (l['id'].startswith('agr-f40-facility') or l['id'].startswith('agr-f40-fgs')) and '1' in l['levels']]
    # Explicit source overlap, not guessed level relabeling.
    matching=[l['id'] for l in helpers if any(a['documentId']=='AGR-S1' and any(b['documentId']=='AGR-S1' and a['pdfPage']==b['pdfPage'] for b in l['sources']) for a in x['sources'])]
    assert matching,('Need source-specific level1route',x['id'],[l['id'] for l in helpers]);ids+=matching
  assert set(x['scopeLevels'])<=set(v for i in ids for v in by[i]['levels']),(x['id'],ids,x['scopeLevels'])
  x['lessonIds']=list(dict.fromkeys(ids));x['lessonSourceHashes']={i:by[i]['sourceHash'] for i in ids};x['allowExpandedView']=True
  x['limitJa']=x.get('limitJa',x.get('limitsJa','教材の模式例です。実物の操作・安全性・品質の認定ではありません。'))
  if isinstance(x['limitJa'],list):x['limitJa']=' '.join(x['limitJa'])
  assert all(x.get(k) for k in ['titleJa','altJa','observationJa','limitJa','width','height'])
  for k in ['humanReviewed','nativeReviewed','domainReviewed','releaseReady']:x[k]=False
  for k in ['localAssetPath','sourceAssetPath','localFile','prompt']:x.pop(k,None)
  x['authorEvidencePath']=str((archive/Path(name).name).relative_to(R))
  existing[x['id']]=x;registered[x['id']]={**x,'implementation':'src/components/agriculture/RecognitionImages.tsx','sourceImagesRedistributed':False,'nativeDeviceTested':False}
  for kid in x.get('knowledgeIds',[]):
   assert kid in ks,(x['id'],kid)
   if x['id'] not in ks[kid]['figureIds']:ks[kid]['figureIds'].append(x['id'])
  intake.append({'figureId':x['id'],'assetPath':x['assetPath'],'assetSha256':sha,'manifest':name,'lessonIds':x['lessonIds'],'scopeLevels':x['scopeLevels']})
for id in replaced:existing.pop(id,None);registered.pop(id,None)
# Old images without explicit scope retain their existing source/lesson routing.
for x in existing.values():
 if not x.get('scopeLevels'):x['scopeLevels']=sorted({v for i in x['lessonIds'] for v in by[i]['levels']})
 for i in x['lessonIds']:
  if x['lessonSourceHashes'].get(i)!=by[i]['sourceHash']:
   assert x['lessonSourceHashes'].get(i) in compat['lessons'].get(i,{}).get('compatibleSourceHashes',[]),(x['id'],i)
   x['lessonSourceHashes'][i]=by[i]['sourceHash']
registry['images']=list(existing.values());register['figures']=list(registered.values());put(D/'recognition-images.json',registry);put(W.parent/'illustration-register.json',register);put(W.parent/'knowledge-ledger.json',ledger);put(W/'media-intake.json',{'originalBytesVerified':True,'figures':intake,'replacedUnpublishedFigures':sorted(replaced)})
f=R/'src/components/agriculture/RecognitionImages.tsx';text=f.read_text();start=text.index('const assets:');end=text.index('export function getAgricultureFigureAsset');assetmap={x['assetKey']:x['assetPath'] for x in registry['images']};body='const assets:Record<string,ImageSourcePropType>={\n'+''.join(' '+json.dumps(k)+":require('../../../"+v+"'),\n" for k,v in assetmap.items())+'};\n';f.write_text(text[:start]+body+text[end:])
a=R/'.gitattributes';text=a.read_text();line='assets/agriculture/completion-40/** -filter -diff -merge\n';a.write_text(text if line in text else text+'\n'+line)
print(json.dumps({'newFigures':len(intake),'allRasterFigures':len(existing),'metadataScopes':len(proof)}))
