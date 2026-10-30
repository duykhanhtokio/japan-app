"""Read-only exact-image, arithmetic and source-bound checks for three original packs."""
from pathlib import Path
from decimal import Decimal
import hashlib,json,re,struct,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'src/data/manufacturing/recognition38/measurement.json'
def sha(b):return hashlib.sha256(b).hexdigest()
def obj(o):return sha(json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
def check():
 d=json.loads(DATA.read_text());scope=json.loads((ROOT/'docs/ssw-workspace/manufacturing/approved-scope.json').read_text());locales=set(scope['targetLocales']);lessons={l['id']:l for l in json.loads((ROOT/'src/data/manufacturing/surface.json').read_text())['lessons']}
 required={'mfg37-required-sample-location-mean','mfg37-required-coating-thickness-instrument-recognition','mfg37-required-solder-wetting-observation'}
 assert len(d['packs'])==3 and {p['id'] for p in d['packs']}==required
 ids=[];assetcount=targets=0
 for p in d['packs']:
  assert p['captionSourceHash']==sha(p['captionJa'].encode())
  assert p['lessonSourceHashes']=={id:lessons[id]['sourceHash'] for id in p['lessonIds']}
  assets={a['id']:a for a in p['assets']};assetcount+=len(assets)
  for a in assets.values():
   raw=(ROOT/a['file']).read_bytes();assert raw[:8]==b'\x89PNG\r\n\x1a\n';width,height=struct.unpack('>II',raw[16:24]);assert (width,height)==(a['width'],a['height'])==(1400,1000)
   assert sha(raw)==a['sha256'];assert (ROOT/a['file']).with_suffix('.svg').is_file()
  assert len(p['questions'])==3
  for q in p['questions']:
   ids.append(q['id']);assert q['sourceHash']==obj({k:v for k,v in q.items() if k!='sourceHash'})
   assert len(q['optionsJa'])==len(set(q['optionsJa']))==len(q['optionReasonsJa'])==4 and 0<=q['correctIndex']<4
   assert q['lessonId'] in p['lessonIds'] and q['lessonSourceHash']==lessons[q['lessonId']]['sourceHash']
   assert q['imageAssetIds'] and set(q['imageAssetIds'])<=set(assets)
   assert q['imageAssetHashes']=={id:assets[id]['sha256'] for id in q['imageAssetIds']}
   assert all(s['documentId']=='mfg1-surface-source' and s['pdfPage']-s['printedPage']==10 for s in q['sources'])
  assert set(p['locales'])==locales
  for locale,t in p['locales'].items():
   assert t['captionSourceHash']==p['captionSourceHash'] and t['caption'].strip();assert set(t['questions'])=={q['id'] for q in p['questions']}
   prose=[t['caption']]
   for q in p['questions']:
    qt=t['questions'][q['id']];assert qt['sourceHash']==q['sourceHash'];assert len(qt['options'])==len(qt['reasons'])==4
    prose += [qt['stem'],*qt['options'],*qt['reasons']];targets+=1
    assert qt['nativeReviewed'] is qt['domainReviewed'] is False
   assert all(isinstance(s,str) and s.strip() for s in prose)
   if locale not in ['zh-CN','zh-TW']:assert not any(re.search(r'[一-龯ぁ-ゖァ-ヺ가-힣]',s) for s in prose),(locale,'unintendedscript')
  for flag in ['nativeReviewed','domainReviewed','humanReviewed','releaseReady']:assert p[flag] is False
 assert len(ids)==len(set(ids))==9 and assetcount==4 and targets==108
 values=list(map(Decimal,['8','10','12','14','16']));mean=sum(values)/len(values);assert mean==12 and min(values)==8 and max(values)==16
 assert [chr(65+i) for i,x in enumerate(values) if not Decimal(10)<=x<=Decimal(14)]==['A','E']
 svg=(ROOT/'assets/manufacturing/recognition38/sampling-map.svg').read_text();tree=ET.fromstring(svg);ns={'s':'http://www.w3.org/2000/svg'}
 plate=next(e for e in tree.findall('s:rect',ns) if e.attrib.get('x')=='300');assert Decimal(plate.attrib['width'])/Decimal(plate.attrib['height'])==Decimal(100)/Decimal(60)
 # The original quiz panels contain givens, not a worked numeric result or instrument-name answer.
 assert '平均12' not in svg and '平均 12' not in svg
 for filename in ['thickness-xrf.svg','thickness-eddy.svg']:
  text=(ROOT/'assets/manufacturing/recognition38'/filename).read_text();assert '蛍光X線' not in text and '渦電流式' not in text
 wet=(ROOT/'assets/manufacturing/recognition38/wetting-observation.svg').read_text();assert '観察分類' not in wet and '広がりがある例' not in wet
 return {'status':'PASS','packs':3,'originalSvgPngPairs':4,'imageBoundQuestions':9,'targetQuestionPairs':108,'translatedCaptions':36,'meanUm':str(mean),'minimumUm':'8','maximumUm':'16','outsidePerPointRequirement':['A','E'],'dimensionRatioExact':True,'imageAndQuestionHashesMatched':True,'quizAssetAnswerLabelsExcluded':True,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'physicalDeviceCertified':False}
if __name__=='__main__':print(json.dumps(check(),ensure_ascii=False))
