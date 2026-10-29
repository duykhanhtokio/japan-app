"""Append one complete source/12-locale packet without changing prior prose or lesson IDs."""
import argparse,hashlib,json,shutil
from pathlib import Path
R=Path(__file__).resolve().parents[2];D=R/'src/data/agriculture';W=R/'docs/ssw-workspace/agriculture/completion-40'
def read(p):return json.loads(p.read_text())
def put(p,j):p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')
def digest(j):return hashlib.sha256(json.dumps(j,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def append(source,domain,content_name,translation_name):
 c=read(source/content_name);t=read(source/translation_name);content=read(D/'lessons.ja.json');old={l['id'] for l in content['lessons']};ids={l['id'] for l in c['lessons']}
 if ids<=old:
  assert all(next(x for x in content['lessons'] if x['id']==l['id'])==l for l in c['lessons']);print('Already integrated '+content_name);return
 assert not ids&old and len(ids)==len(c['lessons'])
 index=read(D/'translations.json');locales=index['locales'];assert set(t['locales'])==set(locales)
 # Short source-reading units still need important Japanese terms/readings.
 term_bank={term['ja']:term for prior in content['lessons'] for term in prior['terms']}
 term_bank.update({ja:{'ja':ja,'reading':reading} for ja,reading in [('資料','しりょう'),('統計','とうけい'),('割合','わりあい'),('分母','ぶんぼ'),('品種','ひんしゅ'),('栽培','さいばい'),('気象','きしょう'),('分類','ぶんるい'),('条件','じょうけん'),('登録','とうろく'),('許可','きょか'),('属名','ぞくめい'),('種小名','しゅしょうめい'),('木質化','もくしつか'),('塊茎','かいけい'),('草本','そうほん')]})
 term_adoptions=[]
 for l in c['lessons']:
  if l['terms']:continue
  before_hash=l['sourceHash'];text=l['titleJa']+' '+''.join(p['textJa'] for p in l['paragraphs'])
  found=[term for ja,term in term_bank.items() if ja in text]
  assert found,'Supply verified importantterm readings: '+l['id']
  l['terms']=found[:12];l['sourceHash']=digest({k:v for k,v in l.items() if k!='sourceHash'})
  for locale in locales:
   tr=t['locales'][locale][l['id']];assert tr['sourceHash']==before_hash;tr['sourceHash']=l['sourceHash']
  term_adoptions.append({'lessonId':l['id'],'field':'terms','before':[],'after':l['terms'],'beforeSourceHash':before_hash,'afterSourceHash':l['sourceHash'],'translationTextUnchanged':True,'reason':'Fill required importantterm readings from existingcanonicalglossary; ordinarysource-readingtermsverifiedbyintegrator; no nativecertification.'})
 for l in c['lessons']:
  assert len(l['paragraphs'])>=1 and l['sourceHash']==digest({k:v for k,v in l.items() if k!='sourceHash'})
  assert l['levels'] and set(l['levels'])<=set(['1','2']) and l['terms']
  assert all(not l.get(k,False) for k in ['humanReviewed','domainReviewed','nativeReviewed'])
  for locale in locales:
   tr=t['locales'][locale][l['id']];assert tr['sourceHash']==l['sourceHash'] and tr['translatedDirectlyFrom']=='ja' and tr['status']=='translated_ai_unreviewed'
   pids={p['id'] for p in l['paragraphs']};assert set(tr['paragraphs'])==set(tr['paragraphTitles'])==pids
   assert all(tr[f].strip() for f in ['title','objective','activity']) and all(v.strip() for f in ['paragraphs','paragraphTitles'] for v in tr[f].values())
 for locale in locales:
  assert set(t['locales'][locale])==ids
  p=D/'translations'/f'{locale}.json';j=read(p);assert not ids&set(j);j.update(t['locales'][locale]);put(p,j)
 ledger=read(W.parent/'knowledge-ledger.json');assert not {k['id'] for k in ledger['knowledge']}&{k['id'] for k in c['knowledge']};ledger['knowledge']+=c['knowledge'];put(W.parent/'knowledge-ledger.json',ledger)
 master=read(W/'japanese-integrated.json');prior_domain_ids={id for p in master['packets'] if p['domain']==domain for id in p['lessonIds']}
 course=read(D/'course-manifest.json')
 for level in ['1','2']:
  pending=[l['id'] for l in c['lessons'] if level in l['levels']]
  while pending:
   weeks=course['levels'][level]['weeks'];candidates=[w for w in weeks if set(w['lessonIds'])&prior_domain_ids and len(w['lessonIds'])<6]
   if candidates:w=candidates[-1]
   else:
    num=max(w['number'] for w in weeks)+1;w={'id':f'agr-{level}-w{num:02}','number':num,'titleJa':c['lessons'][0]['chapter']+'の補足確認','lessonIds':[]};weeks.append(w)
   n=min(6-len(w['lessonIds']),len(pending));w['lessonIds']+=pending[:n];prior_domain_ids.update(pending[:n]);pending=pending[n:]
 put(D/'course-manifest.json',course);content['lessons']+=c['lessons'];put(D/'lessons.ja.json',content)
 index['authoredLessonCoverage'].update({'authoredLessons':len(content['lessons']),'fullyDraftTranslatedLessons':len(content['lessons']),'lessonLocalePairs':len(content['lessons'])*len(locales)});put(D/'translations.json',index)
 master['lessons']+=c['lessons'];master['knowledge']+=c['knowledge'];master['packets'].append({'domain':domain,'contentFile':content_name,'translationFile':translation_name,'archiveDirectory':source.name,'lessonIds':[l['id'] for l in c['lessons']],'knowledgeIds':[k['id'] for k in c['knowledge']]});put(W/'japanese-integrated.json',master)
 target=W/source.name;target.mkdir(exist_ok=True)
 if term_adoptions:
  raw=target/'raw';raw.mkdir(exist_ok=True)
  for name in [content_name,translation_name]:shutil.copy2(source/name,raw/name)
  put(target/content_name,c);put(target/translation_name,t)
  evidence=target/(content_name.replace('.json','-term-adoptions.json'));put(evidence,term_adoptions)
 else:
  for name in [content_name,translation_name]:shutil.copy2(source/name,target/name)
 print(json.dumps({'domain':domain,'newLessons':len(ids),'newUnits':len(c['knowledge']),'newLocalePairs':len(ids)*12,'lessonTotal':len(content['lessons'])}))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('domain');p.add_argument('content_name');p.add_argument('translation_name');a=p.parse_args();append(a.source,a.domain,a.content_name,a.translation_name)
