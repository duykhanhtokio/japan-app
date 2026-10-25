"""Merge batch04's disjoint content/locale cohorts after independent AI reviews.
One-shot guarded by baseline43lessons. Never overwrites an existing content ID.
"""
import hashlib,json,pathlib,re
ROOT=pathlib.Path(__file__).resolve().parents[2];D=ROOT/'src/data/agriculture';W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-04'
def read(p):return json.loads(p.read_text())
def write(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def edits(packet,review):
 applied=[]
 covered={c['targetId'] for c in review.get('patches',[])}
 assert all(i['targetId'] in covered for i in review.get('factualBlockingIssues',[])),'Unresolved factual blocker'
 for c in review.get('patches',[]):
  if c['targetType']=='question':
   q=next(q for q in packet['questions'] if q['id']==c['targetId']);m=re.fullmatch(r'(optionsJa|optionReasonsJa)\[(\d)\]',c['field']);assert m;field,i=m.group(1),int(m.group(2));assert i!=q['correctIndex'];assert q[field][i]==c['before'];q[field][i]=c['after']
  elif c['targetType']=='paragraph':
   p=next(p for l in packet['lessons'] for p in l['paragraphs'] if p['id']==c['targetId']);assert c['field'] in ['textJa','titleJa'];assert p[c['field']]==c['before'];p[c['field']]=c['after']
  else:raise ValueError(c)
  applied.append(c)
 for l in packet['lessons']:l['sourceHash']=sha({k:v for k,v in l.items() if k!='sourceHash'})
 byid={l['id']:l for l in packet['lessons']}
 for q in packet['questions']:q['lessonSourceHash']=byid[q['lessonId']]['sourceHash']
 return applied

def main():
 content=read(D/'lessons.ja.json');assert len(content['lessons'])==43,'Already merged or wrong baseline'
 ledger=read(W/'knowledge-ledger.json');course=read(D/'course-manifest.json');checks=read(D/'weekly-checks.ja.json');inv=read(W/'source-inventory.json');diff=read(W/'source-differences.json');index=read(D/'translations.json');locales={loc:read(D/index['shards'][loc]) for loc in index['locales']};reports=[]
 lids={l['id'] for l in content['lessons']};kids={k['id'] for k in ledger['knowledge']};qids={q['id'] for e in checks['exams'] for q in e['questions']};stems={q['stemJa'] for e in checks['exams'] for q in e['questions']};newids=[]
 titles={'safety':'安全衛生','rice-work':'稲作の仕事','vegetable-work':'畑作・野菜の仕事'}
 for tag in titles:
  packet=read(P/(tag+'.json'));originalsha=sha(packet);repair=edits(packet,read(P/('review-'+tag+'.json')));ids=[]
  for l in packet['lessons']:
   assert l['id'] not in lids;assert l['sourceHash']==sha({k:v for k,v in l.items() if k!='sourceHash'});assert len(l['paragraphs'])>=6;assert set(l['levels'])<={'1','2'};assert l['humanReviewed'] is l['nativeReviewed'] is l['domainReviewed'] is False
   content['lessons'].append(l);lids.add(l['id']);ids.append(l['id']);newids.append(l['id'])
  for k in packet['knowledge']:assert k['id'] not in kids;kids.add(k['id']);ledger['knowledge'].append(k)
  weeks={}
  for level in ['1','2']:
   selected=[l['id'] for l in packet['lessons'] if level in l['levels']]
   for offset in range(0,len(selected),6):
    n=max(w['number'] for w in course['levels'][level]['weeks'])+1;wid=f'agr-{level}-w{n:02}';course['levels'][level]['weeks'].append({'id':wid,'number':n,'titleJa':titles[tag],'lessonIds':selected[offset:offset+6]});weeks.setdefault(level,[]).append(wid)
  qs=packet['questions'];assert len(qs)==16;bylesson={l['id']:l for l in content['lessons']};levels=sorted(set.intersection(*(set(bylesson[q['lessonId']]['levels']) for q in qs)));assert levels;counts=[0]*4
  for i,q in enumerate(qs):
   assert q['id'] not in qids and q['stemJa'] not in stems;qids.add(q['id']);stems.add(q['stemJa']);assert q['lessonSourceHash']==bylesson[q['lessonId']]['sourceHash'];counts[q['correctIndex']]+=1
   if i>=2:assert not(q['correctIndex']==qs[i-1]['correctIndex']==qs[i-2]['correctIndex'])
  assert counts==[4]*4
  checks['exams'].append({'id':'agr-shared-par04-'+tag,'revision':'v1-'+sha(qs)[:16],'level':levels[0],'levels':levels,'kind':'weekly','weekId':weeks[levels[0]][0],'weekNumber':int(weeks[levels[0]][0].rsplit('w',1)[1]),'weekIdsByLevel':{l:weeks[l][0] for l in levels},'studyWeekIdsByLevel':weeks,'titleJa':titles[tag]+'の確認','officialSimulation':False,'timeLimitMinutes':None,'passThreshold':None,'questions':qs})
  for r in packet['sourceImagesChecked']:
   doc=next(d for d in inv['documents'] if d['id']==r['documentId']);assert 1<=r['pdfPage']<=doc['pdfPages'];doc['pages'][r['pdfPage']-1]['visualReview']='ai_page_image_checked_not_human_review'
  ledger['holds'].extend(packet.get('holds',[]));diff['verifiedComparisons'].extend(packet.get('comparisons',[]));reports.append({'worker':tag,'originalPayloadSha256':originalsha,'integratedPayloadSha256':sha(packet),'lessonIds':ids,'questions':16,'repairs':repair,'holds':packet.get('holds',[])})
 bylesson={l['id']:l for l in content['lessons']};pairs=0;translatedids=set()
 for tag in ['translations-a','translations-b','translations-c','translations-a-extra','translations-a-extra-2','translations-b-extra','translations-b-extra-2','translations-c-extra','translations-c-extra-2']:
  packet=read(P/(tag+'.json'));originalsha=sha(packet);applied=[]
  reviewfile=P/('review-'+tag+'.json')
  repairs=read(reviewfile).get('patches',[]) if reviewfile.exists() else []
  for reportname in ['review-translations-numeric.json','review-translations-soil.json']:
   rp=P/reportname
   if rp.exists():repairs += [c for c in read(rp).get('patches',[]) if pathlib.Path(c['packetFile']).name==tag+'.json']
  for c in repairs:
   t=packet['locales'][c['locale']][c['lessonId']];assert t['sourceHash']==bylesson[c['lessonId']]['sourceHash'];field,pid=c['field'].split('.',1);assert field in ['paragraphs','paragraphTitles'];assert t[field][pid]==c['before'];t[field][pid]=c['after'];applied.append(c)
  for locale,entries in packet['locales'].items():
   assert locale in locales
   for lid,t in entries.items():
    assert lid not in locales[locale],(locale,lid);l=bylesson[lid];assert t['sourceHash']==l['sourceHash'];ids={p['id'] for p in l['paragraphs']};assert set(t['paragraphs'])==set(t['paragraphTitles'])==ids;assert all(t['paragraphs'].values()) and all(t['paragraphTitles'].values());assert t['nativeReviewed'] is False and t['translatedDirectlyFrom']=='ja';locales[locale][lid]=t;pairs+=1;translatedids.add(lid)
  reports.append({'worker':tag,'payloadSha256':originalsha,'integratedPayloadSha256':sha(packet),'pairs':sum(map(len,packet['locales'].values())),'repairs':applied,'review':packet.get('review',{})})
 assert pairs==336 and len(translatedids)==28
 for lid in translatedids:assert all(lid in entries for entries in locales.values())
 for locale,entries in locales.items():write(D/'translations'/f'{locale}.json',entries)
 for k in ledger['knowledge']:k['questionIds']=sorted(set(k.get('questionIds',[]))|{q['id'] for e in checks['exams'] for q in e['questions'] if k['id'] in q['knowledgeIds']})
 for doc in inv['documents']:
  for p in doc['pages']:
   p['knowledgeIds']=[k['id'] for k in ledger['knowledge'] if any(r['documentId']==doc['id'] and r['pdfPage']==p['pdfPage'] for r in k['sources'])]
   if p['knowledgeIds']:p['status']='partially_mapped_to_authored_content'
 
 for old in diff['verifiedComparisons']:
  if '光飽和点' in old.get('topic','') and old.get('scope')=='level2_specific_extensions':
   old['scope']='early_chapter_level2_extension_with_cross_chapter_overlap';old['globalExclusivity']=False;old['laterSource1References']=[{'documentId':'AGR-S1','pdfPage':60,'printedPage':54}];old['resolutionNote']='Later1go vegetable chapter also covers light saturation; previous curriculum placement is retained without changing lesson hashes.'
 inv['visualPagesChecked']=sum(p['visualReview']!='pending' for d in inv['documents'] for p in d['pages']);course['revision']='v4'
 for p,x in [(D/'lessons.ja.json',content),(D/'course-manifest.json',course),(D/'weekly-checks.ja.json',checks),(W/'knowledge-ledger.json',ledger),(W/'source-inventory.json',inv),(W/'source-differences.json',diff)]:write(p,x)
 write(W/'parallel-04-manifest.json',{'schemaVersion':1,'status':'integrated_pending_checks','workers':reports,'newLessonIds':newids,'newTranslations':pairs,'counts':{'lessons':len(content['lessons']),'knowledgeUnits':len(ledger['knowledge']),'weeklyQuestions':sum(len(e['questions']) for e in checks['exams']),'lessonLocalePairs':sum(map(len,locales.values())),'pageImagesChecked':inv['visualPagesChecked']},'nativeReviewed':False,'domainReviewed':False,'courseComplete':False})
 print(json.dumps({'newLessons':len(newids),'newTranslations':pairs,'totalLessons':len(content['lessons'])}))
if __name__=='__main__':main()
