#!/usr/bin/env python3
"""Apply only the ten image-routing corrections; no pixels or lesson text change."""
import json,sys,hashlib
from pathlib import Path
from PIL import Image
root=Path(sys.argv[1]).resolve()
bundle=Path(__file__).parent
read=lambda p:json.loads((root/p).read_text())
write=lambda p,x:(root/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
patch= json.loads((bundle/'routing-patches.json').read_text())
images=read('src/data/agriculture/recognition-images.json')
figures=read('docs/ssw-workspace/agriculture/illustration-register.json')
recon=read('docs/ssw-workspace/agriculture/completion-40/source-reconciliation.json')
lessons={x['id']:x for x in read('src/data/agriculture/lessons.ja.json')['lessons']}
byid={x['id']:x for x in images['images']}
reg={x['id']:x for x in figures['figures']}
checks=[]
for p in patch['patches']:
    x=byid[p['figureId']]
    assert x['assetPath']==p['assetPath'] and x['assetSha256']==p['assetSha256']
    asset=root/x['assetPath']
    assert hashlib.sha256(asset.read_bytes()).hexdigest()==x['assetSha256'],x['id']
    with Image.open(asset) as im:
        assert im.size==(x['width'],x['height']),x['id']
        im.verify()
    for lid in p['addLessonIds']:
        assert p['level'] in lessons[lid]['levels'],lid
        assert lessons[lid]['sourceHash']==p['lessonSourceHashes'][lid],lid
        if lid not in x['lessonIds']:x['lessonIds'].append(lid)
        x['lessonSourceHashes'][lid]=lessons[lid]['sourceHash']
        if lid not in reg[x['id']]['lessonIds']:reg[x['id']]['lessonIds'].append(lid)
    x['scopeLevels']=sorted(set(x.get('scopeLevels',[])+[p['level']]))
    x['sourceItemIds']=list(dict.fromkeys(x.get('sourceItemIds',[])+[p['sourceItemId']]))
    for src in p['addSourceReferences']:
        if src not in x.get('sources',[]): x.setdefault('sources',[]).append(src)
    for row in recon['rows']:
        if row['id']==p['sourceItemId']:
            row['figureIds']=[p['figureId'] if f==p['oldFigureId'] else f for f in row.get('figureIds',[])]
            row['routingCorrectionEvidence']='session-20261031-six-ai/recognition-routing-validation.json'
    assert p['level'] in x['scopeLevels']
    assert any(p['level'] in lessons[lid]['levels'] and x['lessonSourceHashes'].get(lid)==lessons[lid]['sourceHash'] for lid in x['lessonIds'])
    assert not x.get('humanReviewed') and not x.get('domainReviewed') and not x.get('nativeReviewed') and not x.get('releaseReady')
    checks.append({'sourceItemId':p['sourceItemId'],'figureId':x['id'],'level':p['level'],'sha256Verified':True,'dimensionsVerified':True,'reachableLessonIds':[lid for lid in x['lessonIds'] if p['level'] in lessons[lid]['levels'] and x['lessonSourceHashes'].get(lid)==lessons[lid]['sourceHash']]})
ours={p['sourceItemId'] for p in patch['patches']}
recon['routingProblems']=[x for x in recon['routingProblems'] if x['id'] not in ours]
# Preserve non-image pending work and all source holds.
assert len(checks)==10 and len(ours)==10
for path,data in [('src/data/agriculture/recognition-images.json',images),('docs/ssw-workspace/agriculture/illustration-register.json',figures),('docs/ssw-workspace/agriculture/completion-40/source-reconciliation.json',recon)]:write(path,data)
report={'status':'PASS','imageRoutingCorrections':len(checks),'newRasterAssets':0,'sourcePhotoInventoryRows':48,'existingImagesRetained':len(images['images']),'remainingNonImageRoutingProblems':len(recon['routingProblems']),'checks':checks,'freshSourcePdfReReview':False,'pixelsChanged':False,'lessonTextsChanged':False,'nativeDeviceTested':False,'humanReviewed':False,'domainReviewed':False,'nativeReviewed':False}
(bundle/'recognition-routing-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},ensure_ascii=False))
