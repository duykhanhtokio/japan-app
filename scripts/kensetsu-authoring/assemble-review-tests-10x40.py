from pathlib import Path
import json,hashlib,random,re,unicodedata
d=Path('docs/ssw-workspace/kensetsu/exams/ten-by-forty')
read=lambda p:json.loads(p.read_text())
write=lambda p,v:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
norm=lambda s:re.sub(r'[\W_]+','',unicodedata.normalize('NFKC',s))
blueprint=read(d/'blueprint.json')
rng=random.Random(20261015)
seen_stems=set();seen_objectives=set();seen_ids=set();all_questions=[];exams=[];tail=[]
paragraph_map={};cluster_map={};lessons={}
for n in range(1,386):
 p=Path(f'docs/ssw-workspace/kensetsu/shared-session-{n:03d}.json');s=read(p);lessons[s['id']]=(p,s)
 for c in s['clusters']:
  cluster_map[c['id']]={'sessionId':s['id'],'clusterTitleJa':c['titleJa'],'questionIds':[]}
  for para in c['paragraphs']:
   paragraph_map[para['id']]={'sessionId':s['id'],'clusterId':c['id'],'questionIds':[]}
for plan in blueprint['exams']:
 en=plan['examNumber'];author=read(d/f'author-exam-{en:02d}.json')
 assert author['examNumber']==en and len(author['questions'])==40
 positions=list(range(4))*10
 while True:
  rng.shuffle(positions);a=tail+positions
  if not any(a[i]==a[i+1]==a[i+2] for i in range(len(a)-2)):break
 tail=a[-2:]
 questions=[]
 for slot,q,target in zip(plan['slots'],author['questions'],positions):
  assert q['number']==slot['number'];assert q['correctIndex']==0
  assert len(q['choicesJa'])==len(q['distractorRationalesJa'])==4
  assert len(set(map(norm,q['choicesJa'])))==4
  for k in ['promptJa','explanationJa','objectiveKey','claimJa']:
   assert isinstance(q[k],str) and q[k].strip(),(en,q['number'],k)
  stem=norm(q['promptJa']);objective=norm(q['objectiveKey'])
  assert stem not in seen_stems,(en,q['number'],'duplicate stem')
  assert objective not in seen_objectives,(en,q['number'],'duplicate objective')
  seen_stems.add(stem);seen_objectives.add(objective)
  qid=f'kensetsu-review-v2-{en:02d}-q{q["number"]:02d}'
  assert qid not in seen_ids;seen_ids.add(qid)
  refs=[]
  assert q['sourceReferences']
  for r in q['sourceReferences']:
   p,s=lessons[r['sessionId']]
   c=next(c for c in s['clusters'] if c['id']==r['clusterId'])
   assert r['paragraphIds'] and len(set(r['paragraphIds']))==len(r['paragraphIds'])
   for pid in r['paragraphIds']:
    assert any(para['id']==pid for para in c['paragraphs'])
    paragraph_map[pid]['questionIds'].append(qid)
   cluster_map[c['id']]['questionIds'].append(qid)
   refs.append({**r,'lessonFile':str(p),'lessonSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'weekId':s['weekId'],'sessionRevision':s['revision'],'contentRevision':s.get('contentRevision',s['revision'])})
  assert f'kensetsu-common-session-{slot["session"]:03d}' in [r['sessionId'] for r in refs],(en,q['number'],'wrong blueprint lesson')
  wrong=[1,2,3];rng.shuffle(wrong);order=wrong[:];order.insert(target,0)
  item={'id':qid,'number':q['number'],'points':1,'promptJa':q['promptJa'],'choicesJa':[q['choicesJa'][i] for i in order],'correctIndex':target,'explanationJa':q['explanationJa'],'objectiveKey':q['objectiveKey'],'claimJa':q['claimJa'],'sourceReferences':refs,'distractorRationalesJa':[q['distractorRationalesJa'][i] for i in order],'review':{'aiAuthorSelfReviewed':True,'humanDomainReviewed':False,'nativeJapaneseReviewed':False,'releaseReady':False}}
  questions.append(item);all_questions.append(item)
 exams.append({'id':f'kensetsu-review-v2-{en:02d}','revision':'kensetsu-10x40-ja-2026-10-15-v1','titleJa':author['titleJa'],'language':'ja','questionCount':40,'maxPoints':40,'timeLimitSeconds':None,'passThreshold':None,'isOfficialExam':False,'sessionRange':plan['sessionRange'],'questions':questions})
bank={'schemaVersion':2,'revision':'kensetsu-10x40-ja-2026-10-15-v1','language':'ja','examCount':10,'questionCount':400,'aiAuthored':True,'humanDomainReviewed':False,'nativeJapaneseReviewed':False,'releaseReady':False,'exams':exams}
write(Path('src/data/kensetsu/review-tests.ja.json'),bank)
for v in paragraph_map.values():v['questionIds']=sorted(set(v['questionIds']))
for v in cluster_map.values():v['questionIds']=sorted(set(v['questionIds']))
referenced_lessons={r['sessionId'] for q in all_questions for r in q['sourceReferences']}
assert len(referenced_lessons)==385
coverage={'status':'PASS_385_LESSON_COVERAGE_WITH_EXPLICIT_PARAGRAPH_GAPS','questionCount':400,'lessonCount':385,'referencedLessonCount':len(referenced_lessons),'totalClusters':len(cluster_map),'referencedClusters':sum(bool(v['questionIds']) for v in cluster_map.values()),'totalParagraphs':len(paragraph_map),'referencedParagraphs':sum(bool(v['questionIds']) for v in paragraph_map.values()),'exhaustiveAtomicKnowledgeAssessed':False,'limits':['References are author-identified evidence, not independent human confirmation.','Every lesson is represented; paragraphs without question references remain explicitly unassessed.','A referenced paragraph can contain more knowledge claims than the question evaluates.'],'clusters':cluster_map,'paragraphs':paragraph_map}
write(d/'coverage-matrix.json',coverage)
lines=['# 建設 学習確認テスト — 10回・各40問','','既存の第1〜55週の日本語教材に基づく独自問題です。各問で最も適切なものを一つ選んでください。時間制限と合格基準は設けていません。','','385の学習回を参照しますが、全段落の全知識を評価したという意味ではありません。専門家・日本語母語話者の審査前です。']
for exam in exams:
 lines+=['',f'## {exam["titleJa"]}','']
 for q in exam['questions']:
  lines+=[f'### 問{q["number"]}',q['promptJa'],'']+[f'{i+1}. {t}' for i,t in enumerate(q['choicesJa'])]+['']
lines+=['','## 解答・解説（提出後の復習用）','']
for exam in exams:
 lines+=[f'### {exam["titleJa"]}','']
 for q in exam['questions']:
  refs='、'.join(r['sessionId'].replace('kensetsu-common-session-','学習') for r in q['sourceReferences'])
  lines+=[f'問{q["number"]}：正解{q["correctIndex"]+1}。{q["explanationJa"]}（{refs}）','']
(d/'KENSETSU_REVIEW_TESTS_10x40_JA.md').write_text('\n'.join(lines)+'\n')
print('ASSEMBLY PASS:400new questions,10x40,385lessons; balanced keys; explicit cluster/paragraph coverage gaps')
print({k:coverage[k] for k in ['totalClusters','referencedClusters','totalParagraphs','referencedParagraphs']})
