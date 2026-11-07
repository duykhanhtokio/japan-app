"""Integrate six disjoint source author packets, preserving all earlier runtime data."""
import argparse,copy,hashlib,json,shutil
from pathlib import Path
R=Path(__file__).resolve().parents[2];W=R/'docs/ssw-workspace/agriculture/completion-40';D=R/'src/data/agriculture'
DOMAINS=['general','soil','safety','rice','facility','flower']
LOCALES=['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
def read(p):return json.loads(p.read_text())
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def digest(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def integrate(source):
 baseline=read(W/'baseline.json')
 for path,h in baseline['files'].items():assert hashlib.sha256((R/path).read_bytes()).hexdigest()==h,'Changed baseline '+path
 content=read(D/'lessons.ja.json');ledger=read(W.parent/'knowledge-ledger.json');course=read(D/'course-manifest.json');index=read(D/'translations.json')
 old_ids={l['id'] for l in content['lessons']};alllessons=[];allknowledge=[];packets=[]
 for domain in DOMAINS:
  a=source/domain;c=read(a/'content.json');t=read(a/'translations.json')
  assert c['lessons'] and set(t['locales'])==set(LOCALES)
  lesson_ids={l['id'] for l in c['lessons']};assert not old_ids&lesson_ids
  assert len(lesson_ids)==len(c['lessons']);old_ids|=lesson_ids
  for l in c['lessons']:
   assert len(l['paragraphs'])>=6 and l['sourceHash']==digest({k:v for k,v in l.items() if k!='sourceHash'})
   assert all(not l.get(f,False) for f in ['nativeReviewed','domainReviewed','humanReviewed'])
   assert l['sources'] and set(l['levels'])<=set(['1','2'])
  for locale in LOCALES:
   entries=t['locales'][locale];assert set(entries)==lesson_ids
   p=D/'translations'/f'{locale}.json';shard=read(p);assert not set(entries)&set(shard)
   for l in c['lessons']:
    tr=entries[l['id']];assert tr['sourceHash']==l['sourceHash'] and tr['translatedDirectlyFrom']=='ja' and tr['status']=='translated_ai_unreviewed'
    ids={p['id'] for p in l['paragraphs']};assert set(tr['paragraphs'])==set(tr['paragraphTitles'])==ids
    assert all(tr[f].strip() for f in ['title','objective','activity'])
    assert all(v.strip() for f in ['paragraphs','paragraphTitles'] for v in tr[f].values())
    assert not tr.get('nativeReviewed',False) and not tr.get('domainReviewed',False)
   shard.update(entries);write(p,shard)
  # Each level receives real lessons only, in a new bounded weekly group per domain.
  for level in ['1','2']:
   ids=[l['id'] for l in c['lessons'] if level in l['levels']]
   if ids:
    num=max(w['number'] for w in course['levels'][level]['weeks'])+1
    course['levels'][level]['weeks'].append({'id':f'agr-{level}-w{num:02}','number':num,'titleJa':c['lessons'][0]['chapter']+'の補足確認','lessonIds':ids})
  content['lessons']+=c['lessons'];ledger['knowledge']+=c['knowledge'];alllessons+=c['lessons'];allknowledge+=c['knowledge']
  target=W/domain;target.mkdir(exist_ok=True)
  for f in ['content.json','translations.json','reconciliation.json','questions.json','review.json','summary.json','diagram.json']:
   if (a/f).exists():shutil.copy2(a/f,target/f)
  packets.append({'domain':domain,'lessonIds':list(lesson_ids),'knowledgeIds':[k['id'] for k in c['knowledge']]})
 write(D/'lessons.ja.json',content);write(D/'course-manifest.json',course);write(W.parent/'knowledge-ledger.json',ledger)
 index['authoredLessonCoverage']['authoredLessons']=len(content['lessons']);index['authoredLessonCoverage']['fullyDraftTranslatedLessons']=len(content['lessons']);index['authoredLessonCoverage']['lessonLocalePairs']=len(content['lessons'])*12
 write(D/'translations.json',index)
 # Add the independent calendar sequence; this is not a reproduction of the source layout.
 if (source/'rice/diagram.json').exists():
  diagram=read(source/'rice/diagram.json');p=D/'diagrams.json';j=read(p);j['diagrams'].append(diagram);write(p,j)
  p=W.parent/'illustration-register.json';j=read(p);j['figures'].append({'id':diagram['id'],'kind':'concept_process_diagram','implementation':'src/components/agriculture/ConceptDiagrams.tsx','lessonIds':diagram['lessonIds'],'labelsJa':[x['titleJa'] for x in diagram['panels']],'creation':'original_native_layout_no_source_image_copy','aiReviewed':True,'domainReviewed':False,'nativeDeviceTested':False,'notARecognitionPhotograph':True});write(p,j)
  byk={k['id']:k for k in ledger['knowledge']}
  for kid in diagram['knowledgeIds']:byk[kid]['figureIds'].append(diagram['id'])
  write(W.parent/'knowledge-ledger.json',ledger)
 write(W/'japanese-integrated.json',{'schemaVersion':1,'lessons':alllessons,'knowledge':allknowledge,'packets':packets,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'independentPeerReviewed':False})
 write(W/'reader-lessons.json',{'lessons':alllessons+[next(l for l in content['lessons'] if l['id']=='agr-water-methods'),next(l for l in content['lessons'] if l['id']=='agr-water-equipment-2')]})
 print(json.dumps({'newLessons':len(alllessons),'newUnits':len(allknowledge),'newLocalePairs':len(alllessons)*12,'lessons':len(content['lessons'])}))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('packet_directory',type=Path);args=p.parse_args();integrate(args.packet_directory)
