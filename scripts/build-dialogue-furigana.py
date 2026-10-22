# Offline build only. Install Janome==0.5.0 in a build environment and run this script.
# The app consumes committed source-bound token IDs; no tokenizer/network at runtime.
import json,re,pathlib,collections,hashlib,os
r=pathlib.Path(__file__).resolve().parents[1];
from janome.tokenizer import Tokenizer
tokenizer=Tokenizer();rows={}
cache=json.loads(pathlib.Path(os.environ['DIALOGUE_FURIGANA_TOKEN_CACHE']).read_text()) if os.environ.get('DIALOGUE_FURIGANA_TOKEN_CACHE') else {}
# Read each active canonical sentence once, not translations or historical levels.
for sid in {s['id'] for p in ['src/data/generated/scenarios.json','src/data/dialogue-content/scenario-overrides.json','src/data/dialogue-content/independent-city-overrides.json'] for s in json.loads((r/p).read_text())}:
 p=r/f'src/data/generated/dialogues/{sid}.json'
 if not p.exists():p=r/f"src/data/generated/dialogues/GENERIC-CITY-{sid.split('-')[-2]}.json"
 d=json.loads(p.read_text());turns=d if isinstance(d,list) else d.get('shared',d.get('N5'))
 for t in turns:
  text=t['npc']['textJa'] if t['speaker']=='NPC' else t['player']['recommendedAnswerJa']
  if text in cache:
   assert ''.join(p[0] for p in cache[text])==text
   rows[text]=cache[text]
  elif text not in rows:rows[text]=[[token.surface,token.reading] if re.search(r'[\u3400-\u9fff々〆ヵヶ]',token.surface) else [token.surface] for token in tokenizer.tokenize(text)]
ov=json.loads((r/'scripts/furigana/reading-overrides.json').read_text());han=re.compile(r'[\u3400-\u9fff々〆ヵヶ]')
def hira(s):return ''.join(chr(ord(c)-96) if '\u30a1'<=c<='\u30f6' else c for c in s)
from furigana.reading_rules import parse_number, number, counted, COUNTER_PATTERN, INTEGER_PATTERN, correct_phrases, correct_context, integer_reading
phrase_rules=collections.defaultdict(list)
for rule in json.loads((r/'scripts/furigana/context-reading-corrections.json').read_text()):phrase_rules[rule['text']].append(rule)
occurrence_rules=collections.defaultdict(list)
for rule in json.loads((r/'scripts/furigana/source-occurrence-readings.json').read_text()):occurrence_rules[rule['sourceJa']].append(rule)
assert set(occurrence_rules).issubset(rows), 'Source-specific reading corrections must be refreshed after source edits'
phrase_pattern=re.compile('|'.join(re.escape(k) for k in sorted(phrase_rules,key=len,reverse=True)))
lex=json.loads((r/'src/data/dialogue-content/furigana-lexicon.json').read_text());lookup={tuple(p):i for i,p in enumerate(lex)};shards=[{'version':1,'scenarios':{}} for _ in range(32)];missing=collections.Counter();corrections=collections.Counter();sentence_cache={}
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
 for m in COUNTER_PATTERN.finditer(text):
  if m.start() not in bounds or m.end() not in bounds:continue
  a,b=bounds[m.start()],bounds[m.end()]
  # Keep lexical 十分 (=enough), 分の (=fraction) and whole compound words.
  if m.group().endswith('分') and a+1==b and parts[a][1:] in [['ジュウブン'],['ジュップン']]:continue
  if m.group()=='千歳':continue
  n=parse_number(m.group(1));c=m.group(2)
  if 0<n<100000000:
   reading=counted(n,c)
   if c=='日' and n==1 and (text[max(0,m.start()-1):m.start()]=='月' or text[m.end():m.end()+1]=='付' or text[m.end():].startswith('が契約開始') or '一日付' in m.group()+text[m.end():m.end()+1]):reading='ついたち'
   replacements[a]=(b,[m.group(),reading]);corrections['numericCounter']+=1
 for m in INTEGER_PATTERN.finditer(text):
  if not any(c in m.group() for c in '十百千万') or m.start() not in bounds or m.end() not in bounds:continue
  a,b=bounds[m.start()],bounds[m.end()]
  if any(a<end and b>start for start,(end,_) in replacements.items()):continue
  n=parse_number(m.group())
  if 0<n<100000000:replacements[a]=(b,[m.group(),integer_reading(m.group())]);corrections['integerReading']+=1
 result=[];i=0
 while i<len(parts):
  if i in replacements:b,p=replacements[i];result.append(p);i=b;continue
  p=parts[i];surf=p[0]
  if surf=='〇':result.append(['〇','ぜろ']);i+=1;continue
  if not han.search(surf):result.append([surf]);i+=1;continue
  reading=ov.get(surf,hira(p[1]) if len(p)>1 else '*')
  if surf in ov:corrections['explicitDictionaryOverride']+=1
  if surf=='後' and reading in ['のち','こう']:reading='あと';corrections['afterContext']+=1
  if surf=='今' and reading=='こん' and (i+1==len(parts) or parts[i+1][0] not in ['年','月','週','朝','晩','夜','度','回','期','春','夏','秋','冬','世紀','日','季','学期']):reading='いま';corrections['nowContext']+=1
  if surf=='来' and i+1<len(parts):
   following=parts[i+1][0]
   if following.startswith(('られ','ない','なかっ','なく','よう','れ')):reading='こ';corrections['comeContext']+=1
   elif following.startswith(('て','た','ます','まし','ませ')):reading='き';corrections['comeContext']+=1
  if surf=='方' and reading=='ほう' and re.search(r'(される|している|していた|お持ちの|ご希望の|希望する|利用する|初めての|お待ちの|来る|来た|お越しの|お連れの|ご利用の|来られる|お探しの)$',''.join(p[0] for p in parts[:i])):reading='かた';corrections['personContext']+=1
  if surf=='後' and i and parts[i-1][0].endswith(('た','る','の','この','その')):reading='あと'
  if surf=='米' and i and parts[i-1][0]=='お':reading='こめ'
  if surf=='間' and reading=='ま':reading='あいだ'
  if surf=='払' and i and parts[i-1][0].endswith('人'):reading='ばらい'
  if reading=='*':missing[surf]+=1;result.append([surf])
  else:result+=split_kana(surf,reading)
  i+=1
 # No newline or whitespace token was dropped by the dictionary.
 assert ''.join(p[0] for p in result)==text
 result=correct_context(text,result,corrections)
 result=correct_phrases(text,result,phrase_rules,phrase_pattern,split_kana,corrections)
 assert ''.join(p[0] for p in result)==text
 if text in occurrence_rules:
  offsets={};off=0
  for j,part in enumerate(result):offsets[off]=j;off+=len(part[0])
  for rule in occurrence_rules[text]:
   j=offsets[rule['start']];assert result[j][0]==rule['text']
   if result[j][1]!=rule['to']:
    assert result[j][1]==rule['from'], (text,rule,result[j])
    result[j]=[rule['text'],rule['to']];corrections['sourceSpecificContextCorrections']+=1
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
# Drop superseded dictionary pairs; no active turn may retain an obsolete index.
used=sorted({i for shard in shards for turns in shard['scenarios'].values() for turn in turns.values() for i in turn['tokens']})
remap={old:new for new,old in enumerate(used)}
removed=len(lex)-len(used);lex=[lex[i] for i in used]
for shard in shards:
 for turns in shard['scenarios'].values():
  for turn in turns.values():turn['tokens']=[remap[i] for i in turn['tokens']]
folder=r/'src/data/dialogue-content/furigana-indexed';folder.mkdir(exist_ok=True)
for i,s in enumerate(shards):(folder/f'{i:02}.json').write_text(json.dumps(s,ensure_ascii=False,separators=(',',':'))+'\n')
(r/'src/data/dialogue-content/furigana-lexicon.json').write_text(json.dumps(lex,ensure_ascii=False,separators=(',',':'))+'\n')
report={'status':'OFFLINE_DICTIONARY_GENERATED_UNREVIEWED','canonicalScenarios':len(scenarios),'counts':counts,'uniqueSourceSentences':len(sentence_cache),'lexiconEntries':len(lex),'unknownKanjiTokens':dict(missing),'supersededUnusedLexiconPairsRemoved':removed,'corrections':dict(corrections),'engine':'Janome0.5.0/IPADIC, offline build only','nativeReviewed':False,'sourceAlignment':'Full reconstructed Japanese must match exactly at runtime','precedence':'Existing source-bound authored bundles override dictionary readings; existing player hint readings preserved','editorialRules':len(sum(phrase_rules.values(),[])),'sourceSpecificRules':sum(map(len,occurrence_rules.values())),'limits':['Dictionary-generated pronunciation is not native-reviewed; contextual homographs and proper names may require further editorial correction.']}
(r/'docs/localization-workspace/dialogue-furigana-generation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
