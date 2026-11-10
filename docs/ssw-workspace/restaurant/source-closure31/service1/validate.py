import pathlib,json,hashlib,re
from PIL import Image
O=pathlib.Path(__file__).resolve().parent;R=pathlib.Path('/workspace/scratch/8c34e3cace7a/japan-app');J=lambda p:json.loads(p.read_text());H=lambda b:hashlib.sha256(b).hexdigest();p=J(O/'packet.json')
assert len(p['pages'])==50 and len(p['units'])==69
assert len({u['unitId'] for u in p['units']})==69
ids={f['id'] for f in p['facts']};aids={a['id'] for a in p['additions']};qids={q['id'] for q in p['questions']};gids={g['id'] for g in p['figures']}
assert len(ids)==len(p['facts']) and len(qids)==len(p['questions']) and len(gids)==len(p['figures'])
lessons=J(R/'src/data/restaurant/lessons.1.ja.json')['lessons'];qs=[q for e in J(R/'src/data/restaurant/exams.1.ja.json')['exams'] for q in e['questions']];old={q['id']:q for q in qs}
for page in p['pages']:
 f=pathlib.Path('/workspace/scratch/8c34e3cace7a/restaurant-source31-extracted/rst-1-service')/f"p{page['pdfPage']:03}.txt"
 assert H(f.read_bytes())==page['textSha256'];assert page['textRead'] and page['visualRead']
for f in p['facts']:
 assert set(f['additionIds'])<=aids
 assert f['existingEvidence'] or f['additionIds'] or f['visualEvidence'] or f['decision']=='reference_excluded'
 for ref in f['sourceRefs']:assert all(1<=v<=50 for v in ref['pdfPages'])
 for e in f['existingEvidence']:
  if e['kind']=='lesson_paragraph':
   lesson=next(l for l in lessons if l['id']==e['lessonId']);para=next(x for x in lesson['paragraphs'] if x['id']==e['paragraphId']);assert H(para['textJa'].encode())==e['sha256']
  elif e['kind']=='assessment':assert H(json.dumps(old[e['questionId']],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())==e['sha256']
for a in p['additions']:
 assert set(a['factIds'])<=ids;assert H(a['textJa'].encode())==a['authoredTextSha256']
for q in p['questions']:
 assert len(q['optionsJa'])==len(set(q['optionsJa']))==len(q['optionReasonsJa'])==4
 assert 0<=q['correctIndex']<4 and all(q['optionReasonsJa'])
 assert set(q['testedFactIds'])<=set(q['factIds'])<=ids
 assert q['stemJa'] not in {x['stemJa'] for x in qs}
for g in p['figures']:
 f=R/g['assetFile'];im=Image.open(f);assert im.size==(g['width'],g['height']);assert H(f.read_bytes())==g['sha256'];assert g['authorPixelReviewed'];assert set(g['factIds'])<=ids
 if g.get('officialSourceUrl'):assert g['rights']['byteIdenticalToOfficialDownload'] and g['rights']['modifications']=='none'
 else:
  assert (R/g['svgFile']).exists();fonts=[float(v) for v in re.findall(r'font-size="(\d+)"',(R/g['svgFile']).read_text())];assert not fonts or min(fonts)>=26
assert len(p['glossaryCrosswalk'])==201 and len({x['canonicalTermJa'] for x in p['glossaryCrosswalk']})==200
assert p['acceptance']['humanReviewed']==p['acceptance']['nativeReviewed']==p['acceptance']['domainReviewed']==False
receipt={'result':'PASS','packetSha256':H((O/'packet.json').read_bytes()),'facts':len(ids),'figures':len(gids),'newQuestions':len(qids),'all50PageTextHashesVerified':True,'existingParagraphAndQuestionEvidenceHashesVerified':True,'allAssetBytesAndDimensionsVerified':True,'humanReviewed':False,'runtimeDeviceTested':False,'assessmentUntestedFactIds':[f['id'] for f in p['facts'] if f['decision']!='reference_excluded' and f['assessmentCoverage']=='not_individually_assessed'],'manualQuestionDuplicateRemoved':'rst31-service1-q022 duplicated competency already tested by rst-1-q357'}
(O/'validation.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print('PASS',receipt['packetSha256'],'untested atoms',len(receipt['assessmentUntestedFactIds']))
