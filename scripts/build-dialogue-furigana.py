# Offline build only. Install Janome==0.5.0 in a build environment and run this script.
# The app consumes committed source-bound token IDs; no tokenizer/network at runtime.
import json,re,pathlib,collections,hashlib
r=pathlib.Path(__file__).resolve().parents[1];
from janome.tokenizer import Tokenizer
tokenizer=Tokenizer();rows={}
# Read each active canonical sentence once, not translations or historical levels.
for sid in {s['id'] for p in ['src/data/generated/scenarios.json','src/data/dialogue-content/scenario-overrides.json','src/data/dialogue-content/independent-city-overrides.json'] for s in json.loads((r/p).read_text())}:
 p=r/f'src/data/generated/dialogues/{sid}.json'
 if not p.exists():p=r/f"src/data/generated/dialogues/GENERIC-CITY-{sid.split('-')[-2]}.json"
 d=json.loads(p.read_text());turns=d if isinstance(d,list) else d.get('shared',d.get('N5'))
 for t in turns:
  text=t['npc']['textJa'] if t['speaker']=='NPC' else t['player']['recommendedAnswerJa']
  if text not in rows:rows[text]=[[token.surface,token.reading] if re.search(r'[\u3400-\u9fff々〆ヵヶ]',token.surface) else [token.surface] for token in tokenizer.tokenize(text)]
ov=json.loads((r/'scripts/furigana/reading-overrides.json').read_text());han=re.compile(r'[\u3400-\u9fff々〆ヵヶ]')
def hira(s):return ''.join(chr(ord(c)-96) if '\u30a1'<=c<='\u30f6' else c for c in s)
nums={'零':0,'〇':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};units={'十':10,'百':100,'千':1000}
def parse(s):
 if not any(c in units for c in s):return int(''.join(str(nums[c]) for c in s))
 n=0;cur=0
 for c in s:
  if c in nums:cur=nums[c]
  else:n+=(cur or 1)*units[c];cur=0
 return n+cur
def number(n):
 if n==0:return 'ぜろ'
 ds=['','いち','に','さん','よん','ご','ろく','なな','はち','きゅう'];out=''
 for unit,label,special in [(1000,'せん',{3:'さんぜん',8:'はっせん'}),(100,'ひゃく',{3:'さんびゃく',6:'ろっぴゃく',8:'はっぴゃく'}),(10,'じゅう',{})]:
  d,n=divmod(n,unit)
  if d:out+=special.get(d,('' if d==1 else ds[d])+label)
 return out+ds[n]
def counted(n,c):
 nr=number(n);tail=n%10;prefix=number(n-tail) if n>tail else ''
 if c=='人':return {1:'ひとり',2:'ふたり',4:'よにん'}.get(n,nr+'にん')
 if c=='日':return {1:'いちにち',2:'ふつか',3:'みっか',4:'よっか',5:'いつか',6:'むいか',7:'なのか',8:'ようか',9:'ここのか',10:'とおか',14:'じゅうよっか',20:'はつか',24:'にじゅうよっか'}.get(n,nr+'にち')
 if c=='時':return (prefix+{4:'よ',7:'しち',9:'く'}[tail] if tail in [4,7,9] else nr)+'じ'
 if c=='月':return {4:'しがつ',7:'しちがつ',9:'くがつ'}.get(n,nr+'がつ')
 tables={'分':{1:'いっぷん',3:'さんぷん',4:'よんぷん',6:'ろっぷん',8:'はっぷん',0:'じゅっぷん'},'本':{1:'いっぽん',3:'さんぼん',6:'ろっぽん',8:'はっぽん',0:'じゅっぽん'},'匹':{1:'いっぴき',3:'さんびき',6:'ろっぴき',8:'はっぴき',0:'じゅっぴき'},'杯':{1:'いっぱい',3:'さんばい',6:'ろっぱい',8:'はっぱい',0:'じゅっぱい'},'階':{1:'いっかい',3:'さんがい',6:'ろっかい',8:'はっかい',0:'じゅっかい'},'回':{1:'いっかい',6:'ろっかい',8:'はっかい',0:'じゅっかい'},'冊':{1:'いっさつ',8:'はっさつ',0:'じゅっさつ'},'歳':{1:'いっさい',8:'はっさい',0:'じゅっさい'}}
 if c=='歳' and n==20:return 'はたち'
 if c in tables and tail in tables[c]:
  if tail==0:return (number(n-10) if n>10 else '')+tables[c][0]
  return prefix+tables[c][tail]
 defaults={'分':'ふん','本':'ほん','匹':'ひき','杯':'はい','階':'かい','回':'かい','冊':'さつ','歳':'さい'}
 return nr+defaults[c]
pattern=re.compile(r'[〇零一二三四五六七八九十百千]+(?:人|分|時|階|本|匹|杯|歳|日|月|回|冊)')
lex=[];lookup={};shards=[{'version':1,'scenarios':{}} for _ in range(32)];missing=collections.Counter();corrections=collections.Counter();sentence_cache={}
def intern(p):
 k=tuple(p)
 if k not in lookup:lookup[k]=len(lex);lex.append(p)
 return lookup[k]
def split_kana(surface,reading):
 # Put only the kanji core under the reading; preserve okurigana beside it.
 a=0;b=len(surface)
 while a<b and not han.search(surface[a]):a+=1
 while b>a and not han.search(surface[b-1]):b-=1
 lead,core,trail=surface[:a],surface[a:b],surface[b:]
 if (lead and not reading.startswith(hira(lead))) or (trail and not reading.endswith(hira(trail))):return [[surface,reading]]
 mid=reading[len(lead):len(reading)-len(trail) if trail else None]
 if not mid:return [[surface,reading]]
 return ([[lead]] if lead else [])+[[core,mid]]+([[trail]] if trail else [])
def sentence(text):
 if text in sentence_cache:return sentence_cache[text]
 parts=rows[text];bounds={0:0};offset=0
 for i,p in enumerate(parts):offset+=len(p[0]);bounds[offset]=i+1
 replacements={}
 for m in pattern.finditer(text):
  if m.start() not in bounds or m.end() not in bounds:continue
  a,b=bounds[m.start()],bounds[m.end()]
  # Keep lexical 十分 (=enough), 分の (=fraction) and whole compound words.
  if m.group().endswith('分') and a+1==b and parts[a][1:] in [['ジュウブン'],['ジュップン']]:continue
  n=parse(m.group()[:-1]);c=m.group()[-1]
  if 0<n<10000:
   reading=counted(n,c)
   if m.group()=='一日' and (text[max(0,m.start()-1):m.start()]=='月' or text[m.end():m.end()+1]=='付' or text[m.end():].startswith('が契約開始')):reading='ついたち'
   replacements[a]=(b,[m.group(),reading]);corrections['numericCounter']+=1
 result=[];i=0
 while i<len(parts):
  if i in replacements:b,p=replacements[i];result.append(p);i=b;continue
  p=parts[i];surf=p[0]
  if surf=='〇':result.append(['〇','ぜろ']);i+=1;continue
  if not han.search(surf):result.append([surf]);i+=1;continue
  reading=ov.get(surf,hira(p[1]) if len(p)>1 else '*')
  if surf in ov:corrections['explicitDictionaryOverride']+=1
  if surf=='後' and reading in ['のち','こう']:reading='あと';corrections['afterContext']+=1
  if surf=='米' and i and parts[i-1][0]=='お':reading='こめ'
  if surf=='間' and reading=='ま':reading='あいだ'
  if surf=='払' and i and parts[i-1][0].endswith('人'):reading='ばらい'
  if reading=='*':missing[surf]+=1;result.append([surf])
  else:result+=split_kana(surf,reading)
  i+=1
 # No newline or whitespace token was dropped by the dictionary.
 assert ''.join(p[0] for p in result)==text
 result=[intern(p) for p in result];sentence_cache[text]=result;return result
scenarios={s['id']:s for p in ['src/data/generated/scenarios.json','src/data/dialogue-content/scenario-overrides.json','src/data/dialogue-content/independent-city-overrides.json'] for s in json.loads((r/p).read_text())};counts={'NPC':0,'PLAYER':0}
for sid in scenarios:
 p=r/f'src/data/generated/dialogues/{sid}.json';generic=not p.exists()
 if generic:p=r/f"src/data/generated/dialogues/GENERIC-CITY-{sid.split('-')[-2]}.json"
 d=json.loads(p.read_text());ts=d if isinstance(d,list) else d.get('shared',d.get('N5'));h=0
 for c in sid:h=(h*31+ord(c))&0xffffffff
 out=shards[h%32]['scenarios'].setdefault(sid,{})
 for t in ts:
  source=t['npc']['textJa'] if t['speaker']=='NPC' else t['player']['recommendedAnswerJa'];tid=re.sub(r'GENERIC-CITY-\d{2}',sid,t['id']) if generic else t['id'];out[tid]={'speaker':t['speaker'],'tokens':sentence(source)};counts[t['speaker']]+=1
assert not missing,missing
folder=r/'src/data/dialogue-content/furigana-indexed';folder.mkdir(exist_ok=True)
for i,s in enumerate(shards):(folder/f'{i:02}.json').write_text(json.dumps(s,ensure_ascii=False,separators=(',',':'))+'\n')
(r/'src/data/dialogue-content/furigana-lexicon.json').write_text(json.dumps(lex,ensure_ascii=False,separators=(',',':'))+'\n')
report={'status':'OFFLINE_DICTIONARY_GENERATED_UNREVIEWED','canonicalScenarios':len(scenarios),'counts':counts,'uniqueSourceSentences':len(sentence_cache),'lexiconEntries':len(lex),'unknownKanjiTokens':dict(missing),'corrections':dict(corrections),'engine':'Janome0.5.0/IPADIC, offline build only','nativeReviewed':False,'sourceAlignment':'Full reconstructed Japanese must match exactly at runtime','precedence':'Existing source-bound authored bundles override dictionary readings; existing player hint readings preserved','limits':['Dictionary-generated pronunciation is not native-reviewed; contextual homographs and proper names may require further editorial correction.']}
(r/'docs/localization-workspace/dialogue-furigana-generation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
