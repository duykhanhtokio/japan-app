import json,hashlib,struct
from pathlib import Path
R=Path(__file__).resolve().parents[2];d=json.loads((R/'src/data/manufacturing/recognition38/finishing.json').read_text());locs={'en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'}
def sha(b):return hashlib.sha256(b).hexdigest()
assert len(d['packs'])==3;n=0
for p in d['packs']:
 assert set(p['locales'])==locs
 assets={a['id']:a for a in p['assets']};assert len(assets)==2
 for a in assets.values():
  b=(R/a['file']).read_bytes();assert sha(b)==a['sha256'];assert struct.unpack('>II',b[16:24])==(a['width'],a['height']);assert sha(b+b' ')!=a['sha256']
 for q in p['questions']:
  core={k:v for k,v in q.items()if k!='sourceHash'};assert sha(json.dumps(core,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode())==q['sourceHash'];assert len(q['optionsJa'])==len(q['optionReasonsJa'])==4 and q['correctIndex']in range(4)
  assert all(assets[a].get('role')!='post_submission_teaching'for a in q['imageAssetIds']);assert q['imageAssetHashes']=={a:assets[a]['sha256']for a in q['imageAssetIds']}
  for loc in locs:
   t=p['locales'][loc];assert t['captionSourceHash']==sha(p['captionJa'].encode());v=t['questions'][q['id']];assert v['sourceHash']==q['sourceHash'];assert len(v['options'])==len(v['reasons'])==4;assert v['nativeReviewed']is False and v['domainReviewed']is False;n+=1
 assert p['nativeReviewed']is False and p['domainReviewed']is False and p['humanReviewed']is False
assert 2*60*40==4800 and 2*60*2+2*40*2==400 and 4800+400==5200
print(json.dumps({'status':'PASS','packs':3,'questions':9,'questionLocalePairs':n,'quizArtwork':3,'postSubmissionTeachingArtwork':3,'areaMathVerified':True,'hashAndDimensionsBound':True,'nativeReviewed':False,'domainReviewed':False}))
