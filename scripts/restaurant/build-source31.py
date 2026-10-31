"""Compile source-author packets without changing frozen days, mocks or translations."""
from pathlib import Path
import json,hashlib,collections,random,argparse,re
ROOT=Path(__file__).resolve().parents[2];DOC=ROOT/'docs/ssw-workspace/restaurant/source-closure31';DATA=ROOT/'src/data/restaurant';OUT=DATA/'source31'
SHARDS=['hygiene1','cooking1','service1','hygiene2','operations2','cooking-service2'];LOCALES=['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
def read(p):return json.loads(p.read_text())
def save(p,d):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def stable(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def digest(v):return hashlib.sha256(stable(v).encode()).hexdigest()
def textsha(t):return hashlib.sha256(t.encode()).hexdigest()
def signature(l):return stable({k:l[k] for k in ['id','level','sourceHash','titleJa','objectiveJa','summaryJa']}|{'paragraphs':[{k:p[k] for k in ['id','titleJa','textJa']} for p in l['paragraphs']]})
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--japanese-only',action='store_true');ap.add_argument('--allow-partial',action='store_true',help='Integrate only frozen packets, retaining explicit missing-unit/page gaps');args=ap.parse_args()
 lessons={l['id']:l for level in ['1','2'] for l in read(DATA/f'lessons.{level}.ja.json')['lessons']};oldq={q['id']:q for level in ['1','2'] for e in read(DATA/f'exams.{level}.ja.json')['exams'] for q in e['questions']};ledger=read(DOC.parent/'knowledge-ledger.json');units={u['id']:u for u in ledger['units']}
 lock=read(DOC/'source-lock.json');pdfs={d['documentId']:d for d in lock['documents']};pagehash={(d['documentId'],p['pdfPage']):p['textSha256'] for d in lock['documents'] for p in d['pages']}
 packets=[];allunits={};facts={};additions={};questions={};figures={};terms={};pages={};inputhashes={}
 for shard in SHARDS:
  p=DOC/shard/'packet.json'
  if args.allow_partial and not p.is_file():continue
  assert p.is_file(),f'Missing frozen source packet: {shard}';packet=read(p);assert packet['shard']==shard;packets.append(packet);inputhashes[str(p.relative_to(ROOT))]=hashlib.sha256(p.read_bytes()).hexdigest()
  docs=packet['documentIds'];assert docs and all(x in pdfs for x in docs)
  for doc in docs:assert packet['pdfSha256ByDocument'][doc]==pdfs[doc]['pdfSha256']
  for page in packet['pages']:
   key=(page['documentId'],page['pdfPage']);assert key not in pages and key in pagehash;assert page['textSha256']==pagehash[key];assert page['textRead'] is True;pages[key]=page
  for unit in packet['units']:
   key=unit['unitId'];assert key in units and key not in allunits,key;assert units[key]['sourceRefs'][0]['documentId'] in docs;allunits[key]={**unit,'shard':shard}
  for name,dest in [('facts',facts),('additions',additions),('questions',questions),('figures',figures),('glossaryAdditions',terms)]:
   for item in packet.get(name,[]):
    key=item['id'];assert key and key not in dest,(name,key);dest[key]={**item,'shard':shard}
 missingunits=sorted(set(units)-set(allunits));missingpages=sorted(set(pagehash)-set(pages))
 if not args.allow_partial:
  assert not missingunits,'Every639 hierarchy unit must have an explicit source decision'
  assert not missingpages,'Every271 source page must be reviewed'
 for id,fact in facts.items():
  assert fact.get('statementJa','').strip() and fact.get('unitIds'),id
  assert all(x in units for x in fact['unitIds']),id
  assert fact.get('sourceRefs'),id
  for ref in fact['sourceRefs']:
   if ref['documentId'] in pdfs:assert ref['pdfPages'] and all((ref['documentId'],p) in pages for p in ref['pdfPages']),id
  for a in fact.get('additionIds',[]):assert a in additions,(id,a)
  for q in fact.get('questionIds',[]):assert q in oldq or q in questions,(id,q)
  for evidence in fact.get('existingEvidence',[]):
   if evidence.get('lessonId'):assert evidence['lessonId'] in lessons,(id,evidence)
   if evidence.get('questionId'):assert evidence['questionId'] in oldq,(id,evidence)
   if evidence.get('path'):assert (ROOT/evidence['path'].split('#')[0]).is_file(),(id,evidence)
 for id,unit in allunits.items():
  assert unit['decision'] in ['covered_existing','covered_after_additions','structural_aggregate','reference_excluded','blocked'],id
  assert all(f in facts for f in unit.get('factIds',[])),id
  if unit['decision'] in ['covered_existing','covered_after_additions']:assert unit.get('factIds'),id
  else:assert unit.get('reason','').strip(),id
 rows={}
 def row(lessonid):
  assert lessonid in lessons,lessonid
  if lessonid not in rows:
   l=lessons[lessonid];rows[lessonid]=dict(lessonId=lessonid,lessonSourceHash=l['sourceHash'],lessonSignature=signature(l),sections=[],figures=[],terms=[],exam=None)
  return rows[lessonid]
 item_registry={};ja_questions=[]
 for id,a in additions.items():
  assert a['titleJa'].strip() and a['textJa'].strip();assert len(a['textJa'])>=30,(id,'No label-only teaching panels')
  assert a.get('factIds') and all(f in facts for f in a['factIds']),id
  section={k:a[k] for k in ['id','titleJa','textJa','factIds','sourceRefs']};section['sourceHash']=digest(section)
  if a.get('furigana'):section['furigana']=a['furigana']
  elif a.get('rubySegments'):section['furigana']={'text':a['rubySegments']}
  row(a['lessonId'])['sections'].append(section);item_registry[id]={'kind':'section','lessonId':a['lessonId'],**section}
 for id,f in figures.items():
  p=ROOT/f['assetFile'];assert p.is_file(),str(p);raw=p.read_bytes();assert raw.startswith(b'\x89PNG\r\n\x1a\n'),id;assert hashlib.sha256(raw).hexdigest()==f['sha256'],id
  assert f['captionJa'].strip() and f['altJa'].strip();figure={k:f[k] for k in ['id','assetFile','sha256','width','height','captionJa','altJa']};figure['quizSafe']=bool(f.get('quizSafe'));figure['sourceHash']=digest(figure);row(f['lessonId'])['figures'].append(figure);item_registry[id]={'kind':'figure','lessonId':f['lessonId'],**figure}
 for id,t in terms.items():
  assert t['termJa'].strip() and t['reading'].strip() and t['explanationJa'].strip();term={k:t[k] for k in ['id','termJa','reading','explanationJa']};term['sourceHash']=digest(term)
  for lessonid in t.get('lessonIds',[t.get('lessonId')]):row(lessonid)['terms'].append(term)
  item_registry[id]={'kind':'term',**term}
 # Balance new keys without changing old question IDs, answers or saved attempts.
 keymap={}
 for level in ['1','2']:
  ids=sorted(id for id,q in questions.items() if lessons[q['lessonId']]['level']==level);keys=[i%4 for i in range(len(ids))];rng=random.Random(int(digest(ids)[:16],16))
  for _ in range(200):
   rng.shuffle(keys)
   if not any(keys[i]==keys[i+1]==keys[i+2] for i in range(len(keys)-2)):break
  keymap.update(zip(ids,keys))
 for id,q in sorted(questions.items()):
  assert id not in oldq and len(q['optionsJa'])==4 and len(set(q['optionsJa']))==4,id
  assert len(q['optionReasonsJa'])==4 and all(x.strip() for x in q['optionReasonsJa']),id
  assert 0<=q['correctIndex']<4 and q.get('factIds') and all(f in facts for f in q['factIds']),id
  lesson=lessons[q['lessonId']];targetkey=keymap[id];wrong=[i for i in range(4) if i!=q['correctIndex']];random.Random(int(textsha(id)[:16],16)).shuffle(wrong);order=wrong[:];order.insert(targetkey,q['correctIndex'])
  item=dict(id=id,level=lesson['level'],topic=lesson['topic'],objectiveJa=q['objectiveJa'],stemJa=q['stemJa'],optionsJa=[q['optionsJa'][i] for i in order],correctIndex=targetkey,explanationJa=q['explanationJa'],optionReasonsJa=[q['optionReasonsJa'][i] for i in order],sourceRefs=q['sourceRefs'],knowledgeIds=q['unitIds'],factIds=q['factIds'])
  if q.get('figureIds'):
   assert all(f in figures and figures[f].get('quizSafe') for f in q['figureIds']),id;item['figureIds']=q['figureIds']
  item['sourceHash']=digest(item)
  if q.get('ruby'):
   ruby=q['ruby'];item['furigana']={k:ruby[k] for k in ['stem','explanation'] if k in ruby}
   if 'options' in ruby:item['furigana']['options']=[ruby['options'][i] for i in order]
   if 'reasons' in ruby:item['reasonRuby']=[ruby['reasons'][i] for i in order]
  r=row(q['lessonId'])
  if not r['exam']:r['exam']=dict(id=f"{lesson['id']}-source31",level=lesson['level'],kind='practice',titleJa=lesson['titleJa']+' · 練習問題',questions=[])
  r['exam']['questions'].append(item);item_registry[id]={'kind':'question','lessonId':lesson['id'],**item};ja_questions.append(item)
 for r in rows.values():
  if r['exam']:r['exam']['sourceHash']=digest(r['exam'])
  r['sourceHash']=digest(r)
 for level in ['1','2']:save(OUT/f'{level}.json',dict(schemaVersion=1,lessons={id:r for id,r in rows.items() if lessons[id]['level']==level}))
 save(DOC/'canonical-ja.json',dict(schemaVersion=1,inputSha256=inputhashes,items=item_registry))
 save(DOC/'unit-crosswalk.json',dict(schemaVersion=1,units=allunits,facts=facts,pages=list(pages.values()),inputSha256=inputhashes,humanReviewed=False,nativeReviewed=False,domainReviewed=False))
 art=['/** Lazy literal image modules; no image is loaded merely by importing this module. */','export function source31AssetByFile(file:string):number|null{',' switch(file){']
 for f in figures.values():
  relative=__import__('os').path.relpath(ROOT/f['assetFile'],DATA).replace('\\','/');art.append(f" case {json.dumps(f['assetFile'])}:return require({json.dumps(relative)});")
 art+=[' default:return null;',' }','}',''];(DATA/'source31-assets.ts').write_text('\n'.join(art))
 pending=[]
 if not args.japanese_only:
  for locale in LOCALES:
   path=DOC/'translations'/f'{locale}.json';assert path.is_file(),f'Missing locale {locale}';target=read(path);assert set(target['items'])==set(item_registry),(locale,'exact authored item scope')
   for id,item in item_registry.items():
    t=target['items'][id];assert t['sourceHash']==item['sourceHash'],(locale,id)
    fields=['title','text'] if item['kind'] in ['section','term'] else ['caption','alt'] if item['kind']=='figure' else ['stem','objective','explanation']
    assert all(isinstance(t.get(k),str) and t[k].strip() for k in fields),(locale,id)
    if item['kind']=='question':assert len(t.get('options',[]))==4 and len(t.get('reasons',[]))==4 and all(x.strip() for x in t['options']+t['reasons']),(locale,id)
   save(OUT/f'{locale}.json',dict(schemaVersion=1,locale=locale,items=target['items']))
 else:
  pending=LOCALES
  for locale in LOCALES:save(OUT/f'{locale}.json',dict(schemaVersion=1,locale=locale,status='translation_pending',items={}))
 unresolved=[id for id,u in allunits.items() if u['decision']=='blocked' or u.get('remainingFactGaps') or u.get('remainingImageGaps')]
 save(DOC/'build-validation.json',dict(status='PARTIAL_JAPANESE_INTEGRATION' if missingunits else 'JAPANESE_FROZEN_TRANSLATIONS_PENDING' if args.japanese_only else 'PASS',sourceUnits=len(units),decidedUnits=len(allunits),missingPacketUnits=missingunits,missingPacketPages=[dict(documentId=d,pdfPage=p) for d,p in missingpages],integratedShards=[p['shard'] for p in packets],reviewedPages=len(pages),visualReadPages=sum(bool(p.get('visualRead')) for p in pages.values()),facts=len(facts),newSections=len(additions),newQuestions=len(questions),newFigures=len(figures),newTerms=len(terms),boundLessons=len(rows),unitDecisions=dict(collections.Counter(u['decision'] for u in allunits.values())),unresolvedUnits=unresolved,pendingLocales=pending,allCanonicalBanksPreserved=True,nativeReviewed=False,domainReviewed=False))
 print('PASS',len(units),'units;',len(facts),'facts;',len(additions),'new sections;',len(questions),'new questions;',len(unresolved),'unresolved')
if __name__=='__main__':main()
