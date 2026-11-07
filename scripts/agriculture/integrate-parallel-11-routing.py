"""Split batch11 mulch questions into shared and level2-only banks after source review."""
import argparse,copy,hashlib,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2];W=ROOT/'docs/ssw-workspace/agriculture';D=ROOT/'src/data/agriculture';P=W/'parallel-11'
def read(p):return json.loads(p.read_text())
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def main(dry_run=False):
 review=read(P/'review-management-bank-routing.json');assert review['status']=='complete' and not review.get('unresolvedBlockingIssues',[])
 assert review['packetSha256']==hashlib.sha256((P/'management-safety.json').read_bytes()).hexdigest()
 assert not any(review.get(f,False) for f in ['humanReviewed','domainReviewed','nativeReviewed'])
 checks=read(D/'weekly-checks.ja.json');course=read(D/'course-manifest.json');manifest=read(W/'parallel-11-manifest.json');prior=copy.deepcopy(checks['exams'][:25])
 at=next(i for i,e in enumerate(checks['exams']) if e['id']=='agr-par11-management-safety-2-check');bank=checks['exams'][at];assert len(bank['questions'])==8
 questions=copy.deepcopy(bank['questions']);byid={q['id']:q for q in questions}
 for patch in review['patches']:
  assert patch['targetType']=='question' and patch['field']=='levels';q=byid[patch['targetId']];assert q['levels']==patch['before'];q['levels']=patch['after']
 groups={}
 for q in questions:groups.setdefault(tuple(q['levels']),[]).append(q)
 assert set(groups)=={('1','2'),('2',)}
 banks=[]
 for levels,qs in groups.items():
  assert len(qs)==4 and sorted(q['correctIndex'] for q in qs)==[0,1,2,3]
  item=copy.deepcopy(bank);item.update(id='agr-par11-management-safety-'+'-'.join(levels)+'-check',level=levels[0],levels=list(levels),questions=qs,revision='v1-'+sha(qs)[:16])
  weeks={}
  for level in levels:
   matches=[w for w in course['levels'][level]['weeks'] if all(q['lessonId'] in w['lessonIds'] for q in qs)];assert len(matches)==1;weeks[level]=matches[0]['id']
  item.update(weekId=weeks[levels[0]],weekNumber=int(weeks[levels[0]].rsplit('w',1)[1]),weekIdsByLevel=weeks,studyWeekIdsByLevel={level:[wid] for level,wid in weeks.items()});banks.append(item)
 checks['exams'][at:at+1]=banks;assert checks['exams'][:25]==prior and sum(len(e['questions']) for e in checks['exams'])==344
 manifest['newWeeklyBanks']=7;manifest['sourceBankRoutingReview']={'file':'parallel-11/review-management-bank-routing.json','appliedQuestionLevelPatches':review['patches'],'sharedQuestions':4,'level2OnlyQuestions':4,'priorBanksChanged':0}
 if not dry_run:write(D/'weekly-checks.ja.json',checks);write(W/'parallel-11-manifest.json',manifest)
 print(json.dumps({'dryRun':dry_run,'newWeeklyBanks':7,'newWeeklyQuestions':48,'newSharedMulchQuestions':4,'newLevel2OnlyPhysicalQuestions':4,'priorWeeklyBanksUnchanged':25}))
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--dry-run',action='store_true');args=parser.parse_args();main(args.dry_run)
