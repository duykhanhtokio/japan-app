"""Serialize hand-authored new forms04–06. No question templates or runtime shuffle."""
from pathlib import Path
import json,re,random,copy,hashlib
from fugashi import Tagger
R=Path(__file__).resolve().parents[1];D=R/'docs/ssw-workspace/kaigo/drafts';A=D/'mock-expansion-12';tagger=Tagger();inventory={}
def save(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def hira(s):return ''.join(chr(ord(c)-96) if '\u30a1'<=c<='\u30f6' else c for c in s)
overrides={'帰室':'きしつ','便':'べん','便秘':'べんぴ','蝸牛':'かぎゅう','義歯':'ぎし','口腔':'こうくう','麻痺':'まひ','咀嚼':'そしゃく','嚥下':'えんげ','恒常性':'こうじょうせい','清拭':'せいしき','端座位':'たんざい','側臥位':'そくがい','仰臥位':'ぎょうがい','左心室':'さしんしつ','左心房':'さしんぼう','右心室':'うしんしつ','右心房':'うしんぼう','腎臓':'じんぞう','尿意':'にょうい','膀胱':'ぼうこう','未実施':'みじっし','総義歯':'そうぎし','部分義歯':'ぶぶんぎし','手の甲':'てのこう','手指衛生':'しゅしえいせい','移乗':'いじょう','除圧':'じょあつ','発語':'はつご','食物':'しょくもつ','爪':'つめ','袖':'そで','健側':'けんそく','一口':'ひとくち','一枚':'いちまい','二人':'ふたり','一人':'ひとり'}
pattern=re.compile('|'.join(map(re.escape,sorted(overrides,key=len,reverse=True))))
def ruby(text):
 out=[]
 def segment(s):
  for part in re.split(r'(\s+)',s):
   if not part:continue
   if part.isspace():out.extend({'text':c} for c in part);continue
   offset=0
   for w in tagger(part):
    at=part.find(w.surface,offset);assert at>=offset
    if at>offset:out.append({'text':part[offset:at]})
    t={'text':w.surface}
    if re.search('[一-龯々]',w.surface):
     k=hira(w.feature.kana or '');assert k and not re.search('[一-龯]',k),(w.surface,k)
     t['readingKana']=k;inventory.setdefault(w.surface,set()).add(k)
    out.append(t);offset=at+len(w.surface)
   if offset<len(part):out.append({'text':part[offset:]})
 start=0
 for m in pattern.finditer(text):
  segment(text[start:m.start()]);word=m.group();k=overrides[word];out.append({'text':word,'readingKana':k});inventory.setdefault(word,set()).add(k);start=m.end()
 segment(text[start:]);assert ''.join(t['text'] for t in out)==text;return out
support=[];manifest=[]
for kind in ['skills','japanese']:
 for number in range(4,7):
  base=json.loads((D/f'kaigo-{kind}-mock-03.json').read_text());form={k:copy.deepcopy(v) for k,v in base.items() if k not in ['questions','answerArrangementEvidence']};form['id']=f'kaigo-{kind}-mock-{number:02}';form['structureSource']['checkedAt']='2026-10-10';form['version']=1
  rows=[];section=None
  for line in (A/f'{kind}-{number:02}.authored.txt').read_text().splitlines():
   if line.startswith('# '):section=line[2:];continue
   if not line:continue
   fields=line.split('|');assert len(fields) in [7,8],(kind,number,len(fields),fields[1]);rows.append((section,fields))
  assert len(rows)==(45 if kind=='skills' else 15),(kind,number,len(rows))
  # Different surplus positions across three forms produce globally even counts.
  extra={('skills',4):1,('skills',5):2,('skills',6):3,('japanese',4):1,('japanese',5):2,('japanese',6):3}[(kind,number)]
  targets=[i for i in range(4) for _ in range(len(rows)//4+(i==extra if kind=='skills' else i!=extra))];rng=random.Random(20261010+number+(100 if kind=='japanese' else 0))
  while True:
   rng.shuffle(targets)
   if all(not(targets[i]==targets[i-1]==targets[i-2]) for i in range(2,len(targets))):break
  qs=[];practical=0
  for i,((section,f),target) in enumerate(zip(rows,targets)):
   pages=[int(x) for x in f[0].split(',')];opts=[x.split('~') for x in f[3:7]];assert all(len(x)==3 for x in opts)
   order=list(range(1,4));rng.shuffle(order);order.insert(target,0);o=[opts[j] for j in order];qid=form['id']+f'-q{i+1:02}'
   q=dict(id=qid,sectionId=section,promptJa=f[1],optionsJa=[x[0] for x in o],correctIndex=target,rationalesVi=[('Đúng: ' if j==target else 'Sai: ')+x[2] for j,x in enumerate(o)],sourceRefs=[dict(printedPage=p,pdfPage=p+2,purpose='knowledge or language objective only; independent expression') for p in pages],review=copy.deepcopy(base['review']),pointValue=1,practiceScope='independent_full_mock_for_internal_test_not_official',editorialCompetencyVi=f[2],furigana=dict(prompt=ruby(f[1]),options=[ruby(x[0]) for x in o]))
   vi=dict(questionId=qid,promptVi=f[2],optionsVi=[x[1] for x in o],displayGate='after_submission_only')
   if len(f)==8:
    passage,translation=f[7].split('~');q['passageJa']=passage;q['furigana']['passage']=ruby(passage);vi['passageVi']=translation
   if section=='cbt_practical':
    practical+=1;key=f's{number:02}-judgement-{practical:02}';q['figurePath']='mock-figures/'+key+'.svg';q['figureDescriptionJa']=f[1].split('。')[0]+'。';q['furigana']['figureDescription']=ruby(q['figureDescriptionJa']);vi['figureDescriptionVi']=f[2];q['visualDataMode']='original_schematic_with_accessible_equivalent'
   qs.append(q);support.append(vi)
  form['questions']=qs;form['answerArrangementEvidence']=dict(seed=20261010+number,algorithm='balanced_per_form_static_shuffle_max_run_two',runtimeShuffle=False);save(D/(form['id']+'.json'),form);manifest.append(dict(id=form['id'],path=form['id']+'.json'))
collection=json.loads((D/'mock-collection.json').read_text());old=[x for x in collection['forms'] if int(x['id'][-2:])<=3];collection.update(version=2,approvedAt='2026-10-10',scopeVi='12 đề: 6 kỹ năng và 6 tiếng Nhật; 360 câu; sáu đề mới do dự án tự soạn',forms=old+manifest)
collection['reviewSupportPaths']=[p for p in collection['reviewSupportPaths'] if 'twelve' not in p]+['kaigo-mock-review-support-twelve-vi.json'];save(D/'mock-collection.json',collection)
save(D/'kaigo-mock-review-support-twelve-vi.json',dict(version=1,entries=support,humanReviewed=False,releaseReady=False))
save(R/'docs/ssw-workspace/kaigo/reviews/twelve-mocks-furigana-inventory.json',dict(method='dictionary plus contextual editorial overrides',entries=[dict(surface=k,readings=sorted(v)) for k,v in sorted(inventory.items())],nativeReviewed=False))
print(json.dumps(dict(newForms=6,newQuestions=len(support),rubySurfaces=len(inventory))))
