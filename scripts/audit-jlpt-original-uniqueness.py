"""Candidate detection across independent originals only; similarity is not semantic proof."""
import argparse,collections,difflib,hashlib,itertools,json,pathlib,re,unicodedata
R=pathlib.Path(__file__).resolve().parent.parent
ap=argparse.ArgumentParser();ap.add_argument('--output',required=True);args=ap.parse_args()
def norm(s):return re.sub(r'[\W_]+','',unicodedata.normalize('NFKC',s))
def spoken(script):
 return '\n'.join(re.sub(r'(?:右の|左の)?絵を見てください。|男の人のことばを聞いて、返事を選んでください。|女の人のことばを聞いて、返事を選んでください。|何と言いますか。','',t[1]) for t in script)
units=[];masters=[];counts=collections.Counter()
for p in sorted((R/'src/data/jlpt-original').glob('n*/??/master.ja.json')):
 d=json.loads(p.read_text());masters.append({'path':str(p.relative_to(R)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
 for id,text in d['passages'].items():units.append({'id':d['examId']+':passage:'+id,'text':text,'kind':'passage','passage':id,'exam':d['examId']});counts['passages']+=1
 for q in d['questions']:
  text=q.get('completedSentence') or q.get('ordering',{}).get('completedSentence') or q.get('sentence') or q['prompt']
  if q['section']=='listening':text=spoken([t for t in q['script'] if not (t[0] in ['narrator','adultFemale'] and re.fullmatch(r'(?:短い言葉|ことば).*返事を選んでください。',t[1]))])
  if q['section']=='vocabulary' and q['group']==5:text='\n'.join(o['text'] for o in q['options'])
  text=re.sub(r'\n(?:【.*?】のことば.*|.*読み方.*|.*漢字.*どれですか。)$','',text)
  if q['section']!='listening' and not q.get('passageId') and not (q['section']=='vocabulary' and q['group']==5):
   quoted=re.search(r'「(.*?)」',text)
   text=quoted.group(1) if quoted and q['section']=='vocabulary' and q['group'] in [1,2,4] else text.split('\n')[0]
  if q.get('passageId'):text=d['passages'][q['passageId']]+'\n'+text
  units.append({'id':q['id'],'text':text,'kind':'question','passage':q.get('passageId'),'exam':d['examId']});counts['questions']+=1
 org=json.loads(p.with_name('listening-organization.ja.json').read_text())
 for g in org['groups']:
  e=g['example'];units.append({'id':e['id'],'text':spoken(e['script']),'kind':'example'});counts['examples']+=1
for u in units:u['norm']=norm(u['text']);u['grams']=set(u['norm'][i:i+3] for i in range(max(0,len(u['norm'])-2)))
exact=[];near=[]
for a,b in itertools.combinations(units,2):
 if a.get('passage') and a.get('exam')==b.get('exam') and a.get('passage')==b.get('passage'):continue
 if min(len(a['norm']),len(b['norm']))<12:continue
 if a['norm']==b['norm']:exact.append({'a':a['id'],'b':b['id'],'aText':a['text'],'bText':b['text']});continue
 if not a['grams'] or not b['grams']:continue
 if 2*len(a['grams']&b['grams'])/(len(a['grams'])+len(b['grams']))<.40:continue
 score=difflib.SequenceMatcher(None,a['norm'],b['norm']).ratio()
 if score>=.64:near.append({'a':a['id'],'b':b['id'],'similarity':round(score,4),'aText':a['text'],'bText':b['text']})
near.sort(key=lambda x:-x['similarity']);out={'scope':f'All {len(masters)} current independently authored masters and practices. Exact/near lexical candidate detection only; human/native semantic uniqueness is not certified. Common knowledge may repeat; noun-swapped same objectives/situations require editorial replacement. No legacy inputs.','counts':dict(counts),'masters':masters,'exact':exact,'near':near};pathlib.Path(args.output).write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'counts':dict(counts),'exact':len(exact),'nearCandidates':len(near)}))
