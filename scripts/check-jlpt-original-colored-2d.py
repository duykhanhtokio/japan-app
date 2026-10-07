"""Validate current original asset mappings, casting, colors and stable answer IDs.
Pixel checks detect monochrome/empty files, not semantic style; AI inspection is recorded separately.
"""
import argparse,hashlib,json,pathlib,re
from PIL import Image
R=pathlib.Path(__file__).resolve().parent.parent;D=R/'docs/jlpt-workspace/repair-colored-2d-2026-10-07'
ap=argparse.ArgumentParser();ap.add_argument('--write-report',action='store_true');args=ap.parse_args()
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
baseline=read(D/'baseline-answer-fingerprints.json')['examFingerprints'];seen=set();rows=[];exams=[]
for p in sorted((R/'src/data/jlpt-original').glob('n*/??/master.ja.json')):
 m=read(p);lev,num=p.parts[-3:-1];a=read(p.with_name('audio.manifest.json'));im=read(p.with_name('images.manifest.json'));exams.append(m['examId']);assert im['style']=='colored_2d';assert len(im['items'])==(4 if lev=='n3' else 5);assert a['masterSha256']==sha(p)
 fingerprint=hashlib.sha256(json.dumps([[q['id'],q['correctOptionId'],[o['id'] for o in q['options']]] for q in m['questions']],separators=(',',':')).encode()).hexdigest();assert fingerprint==baseline[m['examId']],m['examId']
 for i in im['items']:
  q=next(q for q in m['questions'] if q['id']==i['questionId']);file=R/i['path'];assert sha(file)==i['sha256'];assert i['sha256'] not in seen;seen.add(i['sha256']);assert q['visualSheetPath']==i['path'];assert q['imageStyle']==i['style']=='colored_2d';assert q['optionVoiceRole']==i['mainActorRole'];assert i['mainActorGender']==('female' if i['mainActorRole'] in ['adultFemale','femaleStudent'] else 'male');assert i['aiVisualReview'] and i['visualReviewNote'].startswith('PASS');assert not i['publisherReviewed'] and not i['rightsReleaseReviewCompleted'];recording=next(x for x in a['items'] if x['questionId']==q['id']);assert all(t['role']==i['mainActorRole'] for t in recording['turns'] if t['actor'].startswith('option-'))
  image=Image.open(file).convert('RGB');assert list(image.size)==[i['width'],i['height']];assert image.width>=1000 and image.height>=500;pixels=list(image.resize((128,128)).getdata());colored=sum(max(v)-min(v)>24 for v in pixels)/len(pixels);assert colored>.15,(file,colored);rows.append({'questionId':q['id'],'path':i['path'],'sha256':i['sha256'],'coloredPixelRatio':round(colored,4),'actorRole':i['mainActorRole']})
 assert m['runtimeIntegrated'];assert not m['releaseReady'] and not m['publisherReviewed'] and not m['reviewedByNativeSpeaker'];assert not a['perceptualApproval'] and not a['nativeReviewCompleted'] and not a['rightsReleaseReviewCompleted']
assert len(exams)==14 and len(rows)==68
report={'status':'PASS','scope':'14 current independent originals; 68 mapped PNGs, distinct hashes, color pixels, recorded AI visual inspection, image/option voice alignment, immutable answer IDs/order against baseline, current master/audio provenance. Pixel checks do not certify 2D style or semantic uniqueness.','baselineCommit':'6375522dc35123550340f2e07b48f65375228e68','examCount':14,'imageCount':68,'images':rows}
if args.write_report:(D/'asset-consistency-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'PASS','examCount':14,'imageCount':68,'answersUnchanged':True}))
