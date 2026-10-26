"""Offline aligned restaurant reading candidates; unknown/ambiguous kanji are never guessed.
Existing lexicon + explicitly authored restaurant term readings. Context review is separate.
"""
from pathlib import Path
import json,re,collections,sys
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/restaurant';HAN=re.compile(r'[一-龯々〆ヵヶ]')
sys.path.insert(0,str(ROOT/'scripts'))
from furigana.reading_rules import counted,number,parse_number
DURATION=re.compile(r'(?<![0-9０-９.．])([0-9０-９]+)(時間|秒|分|℃)')
def read(p):return json.loads(p.read_text())
def write(p,x):
 temporary=p.with_name(p.name+'.furigana-tmp');temporary.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n');temporary.replace(p)
def hira(s):return ''.join(chr(ord(c)-96) if 'ァ'<=c<='ヶ' else c for c in s)
# These are dictionary readings, not a claim of native contextual approval.
CUSTOM='''事故事例 じこじれい
紫外線 しがいせん
外食業 がいしょくぎょう
衛生管理 えいせいかんり
飲食物調理 いんしょくぶつちょうり
接客全般 せっきゃくぜんぱん
店舗運営 てんぽうんえい
交差汚染 こうさおせん
二次汚染 にじおせん
食物アレルギー しょくもつあれるぎー
異物混入 いぶつこんにゅう
中心温度 ちゅうしんおんど
危害要因 きがいよういん
重要管理点 じゅうようかんりてん
加熱済み かねつずみ
非加熱 ひかねつ
原材料 げんざいりょう
原価率 げんかりつ
標準原価率 ひょうじゅんげんかりつ
実際原価率 じっさいげんかりつ
原価差異 げんかさい
損益分岐点 そんえきぶんきてん
棚卸し たなおろし
棚卸 たなおろし
歩留まり ぶどまり
歩留り ぶどまり
収益 しゅうえき
粗利益 あらりえき
売上総利益 うりあげそうりえき
売上原価 うりあげげんか
売上高 うりあげだか
客単価 きゃくたんか
人時生産性 にんじせいさんせい
人件費 じんけんひ
損失 そんしつ
指差し確認 ゆびさしかくにん
誤食 ごしょく
配膳 はいぜん
下膳 げぜん
食中毒 しょくちゅうどく
黄色ブドウ球菌 おうしょくぶどうきゅうきん
腸炎ビブリオ ちょうえんびぶりお
腸管出血性大腸菌 ちょうかんしゅっけつせいだいちょうきん
芽胞 がほう
毒素 どくそ
殺菌 さっきん
消毒 しょうどく
清拭 せいしき
次亜塩素酸ナトリウム じあえんそさんなとりうむ
濃度 のうど
希釈 きしゃく
飛沫 ひまつ
嘔吐 おうと
嘔吐物 おうとぶつ
手指 しゅし
手洗い てあらい
可食部 かしょくぶ
不可食部 ふかしょくぶ
粗熱 あらねつ
冷却 れいきゃく
解凍 かいとう
冷凍 れいとう
冷蔵 れいぞう
保温 ほおん
保冷 ほれい
再加熱 さいかねつ
蒸気 じょうき
蒸す むす
炒める いためる
揚げる あげる
煮る にる
焼く やく
漬ける つける
和える あえる
秤 はかり
計量 けいりょう
検収 けんしゅう
検食 けんしょく
在庫 ざいこ
先入れ先出し さきいれさきだし
献立 こんだて
食材 しょくざい
包丁 ほうちょう
俎板 まないた
まな板 まないた
砥石 といし
盛付け もりつけ
盛り付け もりつけ
注文 ちゅうもん
復唱 ふくしょう
敬語 けいご
謙譲語 けんじょうご
尊敬語 そんけいご
丁寧語 ていねいご
嚥下 えんげ
誤嚥 ごえん
車椅子 くるまいす
車いす くるまいす
避難 ひなん
初期消火 しょきしょうか
消火器 しょうかき
火傷 やけど
熱傷 ねっしょう
切創 せっそう
切傷 きりきず
汚染区域 おせんくいき
非汚染区域 ひおせんくいき
是正措置 ぜせいそち
再発防止 さいはつぼうし
根本原因 こんぽんげんいん
労務管理 ろうむかんり
労働条件 ろうどうじょうけん
就業規則 しゅうぎょうきそく
勤怠 きんたい
未払い みばらい
有給休暇 ゆうきゅうきゅうか
原価 げんか
客数 きゃくすう
客席 きゃくせき
回転率 かいてんりつ
稼働率 かどうりつ
稼働 かどう
販促 はんそく
購買 こうばい
発注 はっちゅう
欠品 けっぴん
欠員 けついん
欠勤 けっきん
廃棄 はいき
廃棄物 はいきぶつ
分別 ぶんべつ
収支 しゅうし
売掛金 うりかけきん
買掛金 かいかけきん
現金 げんきん
釣銭 つりせん
釣り銭 つりせん
決済 けっさい
返金 へんきん
会計 かいけい
日報 にっぽう
月報 げっぽう
日次 にちじ
月次 げつじ
差異 さい
帳簿 ちょうぼ
帳票 ちょうひょう
伝票 でんぴょう
仕入れ しいれ
仕入 しいれ
人員配置 じんいんはいち
進捗 しんちょく
継続 けいぞく
引継ぎ ひきつぎ
引き継ぎ ひきつぎ
繁忙 はんぼう
閑散 かんさん
動線 どうせん
導線 どうせん
生肉 なまにく
生魚 なまざかな
鶏肉 とりにく
豚肉 ぶたにく
牛肉 ぎゅうにく
魚介類 ぎょかいるい
二枚貝 にまいがい
根菜 こんさい
葉菜 ようさい
果菜 かさい
卵殻 らんかく
乳製品 にゅうせいひん
乳 にゅう
小麦 こむぎ
落花生 らっかせい
甲殻類 こうかくるい
甲殻 こうかく
宗教 しゅうきょう
食習慣 しょくしゅうかん
断定 だんてい
提供 ていきょう
遵守 じゅんしゅ
徹底 てってい
統一 とういつ
照合 しょうごう
検証 けんしょう
監視 かんし
記載 きさい
記録 きろく
遡及 そきゅう
遡る さかのぼる
遡れる さかのぼれる
追跡 ついせき
誤記 ごき
誤差 ごさ
定量 ていりょう
定性 ていせい
実測 じっそく
測定 そくてい
校正 こうせい
校正済み こうせいずみ
記入 きにゅう
未記入 みきにゅう
未確認 みかくにん
不明 ふめい
判断 はんだん
対処 たいしょ
対策 たいさく
対応 たいおう
症状 しょうじょう
腹痛 ふくつう
下痢 げり
発熱 はつねつ
咳 せき
飛散 ひさん
飛沫感染 ひまつかんせん
接触感染 せっしょくかんせん
監督 かんとく
指導 しどう
責任者 せきにんしゃ
担当者 たんとうしゃ
従業員 じゅうぎょういん
新人 しんじん
業務 ぎょうむ
中止 ちゅうし
停止 ていし
隔離 かくり
保留 ほりゅう
承認 しょうにん
再開 さいかい
再確認 さいかくにん
改善 かいぜん
異常 いじょう
正常 せいじょう
基準 きじゅん
手順 てじゅん
順序 じゅんじょ
履歴 りれき
署名 しょめい
報告 ほうこく
共有 きょうゆう
周知 しゅうち
証拠 しょうこ
保存 ほぞん
保管 ほかん
残留 ざんりゅう
残存 ざんそん
接客 せっきゃく
案内 あんない
予約 よやく
満席 まんせき
空席 くうせき
応対 おうたい
傾聴 けいちょう
謝罪 しゃざい
苦情 くじょう
要望 ようぼう
主訴 しゅそ
個人情報 こじんじょうほう
個別 こべつ
配慮 はいりょ
合理的配慮 ごうりてきはいりょ
視覚障害 しかくしょうがい
聴覚障害 ちょうかくしょうがい
筆談 ひつだん
介助 かいじょ
補助犬 ほじょけん
盲導犬 もうどうけん
緊急 きんきゅう
安全 あんぜん
確認 かくにん
説明 せつめい
衛生 えいせい
管理 かんり
作業 さぎょう
道具 どうぐ
器具 きぐ
設備 せつび
洗浄 せんじょう
乾燥 かんそう
汚れ よごれ
清潔 せいけつ
汚染 おせん
清掃 せいそう
清掃済み せいそうずみ
消毒済み しょうどくずみ
洗浄済み せんじょうずみ
直前 ちょくぜん
直後 ちょくご
終了 しゅうりょう
開始 かいし
温度 おんど
湿度 しつど
温度計 おんどけい
湿度計 しつどけい
従う したがう
従って したがって
従い したがい
測る はかる
量る はかる
計る はかる
防ぐ ふせぐ
防ぎ ふせぎ
防い ふせい
防止 ぼうし
守る まもる
守り まもり
含む ふくむ
含ま ふくま
含み ふくみ
含め ふくめ
含有 がんゆう
混入 こんにゅう
混ぜる まぜる
混ぜ まぜ
混合 こんごう
触る さわる
触れ ふれ
触ら さわら
触り さわり
外す はずす
外し はずし
外さ はずさ
外れ はずれ
戻す もどす
戻し もどし
戻さ もどさ
戻る もどる
戻り もどり
戻ら もどら
運ぶ はこぶ
運び はこび
運ば はこば
除く のぞく
除き のぞき
除け のぞけ
除去 じょきょ
除菌 じょきん
把握 はあく
飲酒 いんしゅ
飲食 いんしょく
営業 えいぎょう
開店 かいてん
閉店 へいてん
施錠 せじょう
解錠 かいじょう
点検 てんけん
保守 ほしゅ
故障 こしょう
電源 でんげん
刃 は
刃物 はもの
刃先 はさき
濡れ ぬれ
濡ら ぬら
濡らす ぬらす
拭く ふく
拭き ふき
拭い ふい
拭か ふか
拭け ふけ
縛る しばる
縛り しばり
縛ら しばら
切る きる
切り きり
切ら きら
切っ きっ
蒸気圧 じょうきあつ
感電 かんでん
転倒 てんとう
転落 てんらく
巻き込まれ まきこまれ
巻き込む まきこむ
挟まれ はさまれ
挟む はさむ
火元 ひもと
避難口 ひなんぐち
非常口 ひじょうぐち
通路 つうろ
誘導 ゆうどう
避難経路 ひなんけいろ
訓練 くんれん
警報 けいほう
通報 つうほう
消防 しょうぼう
発煙 はつえん
煙 けむり
火災 かさい
引火 いんか
油火災 あぶらかさい
食用油 しょくようゆ
油温 ゆおん
火気 かき
油 あぶら
水 みず
酸 さん
塩 しお
糖 とう
酢 す
生食 せいしょく
生鮮 せいせん
鮮度 せんど
品質 ひんしつ
期限 きげん
消費期限 しょうひきげん
賞味期限 しょうみきげん
期限切れ きげんぎれ
受入れ うけいれ
受け入れ うけいれ
受入 うけいれ
仕込み しこみ
仕込 しこみ
盛付 もりつけ
検温 けんおん
歩留 ぶどまり
損耗 そんもう
正味 しょうみ
総量 そうりょう
重量 じゅうりょう
容量 ようりょう
体積 たいせき
質量 しつりょう
比率 ひりつ
割合 わりあい
分母 ぶんぼ
分子 ぶんし
百分率 ひゃくぶんりつ
費用 ひよう
利益 りえき
売上 うりあげ
売り上げ うりあげ
変動費 へんどうひ
固定費 こていひ
損益 そんえき
利益率 りえきりつ
限界利益 げんかいりえき
率 りつ
'''
lex=collections.defaultdict(set)
for p in read(ROOT/'src/data/dialogue-content/furigana-lexicon.json'):
 if len(p)==2 and HAN.search(p[0]) and re.fullmatch('[ぁ-ゖー]+',p[1]):lex[p[0]].add(p[1])
lookup={s:next(iter(rs)) for s,rs in lex.items() if len(rs)==1}
for line in CUSTOM.strip().splitlines():
 s,r=line.split();lookup[s]=r
extra=DATA/'reading-overrides.json'
if extra.exists():
 for surface,reading in read(extra)['readings'].items():
  assert HAN.search(surface) and re.fullmatch('[ぁ-ゖー]+',reading)
  lookup[surface]=reading
files=[] if '--self-test' in sys.argv else [p for p in DATA.glob('lessons.*.ja.json' if '--lessons-only' in sys.argv else '*.ja.json')];packs={p:read(p) for p in files}
for x in packs.values():
 for l in x.get('lessons',[]):
  for t in l.get('terms',[]):
   if HAN.search(t['ja']):lookup[t['ja']]=hira(t['reading'])
# Do not annotate context-sensitive isolated words using arbitrary one-reading defaults.
for ambiguous in ('生','方','間','後','前','上','下','中','日','月','分','人','本','行','開','空','角','一','二','三','四','五','六','七','八','九','十','何','等','度','食'):
 lookup.pop(ambiguous,None)
byfirst=collections.defaultdict(list)
for s,r in lookup.items():byfirst[s[0]].append((s,r))
for xs in byfirst.values():xs.sort(key=lambda p:len(p[0]),reverse=True)
missing=collections.Counter();stats=collections.Counter()
def ruby(text):
 result=[];i=0;unknown=False
 while i<len(text):
  duration=DURATION.match(text,i)
  if duration and not (duration.group(2)=='分' and text[duration.end():].startswith('の')):
   value=parse_number(duration.group(1));unit=duration.group(2)
   if 0<value<100000:
    reading=counted(value,'分') if unit=='分' else counted(value,'時')+'かん' if unit=='時間' else number(value)+('びょう' if unit=='秒' else 'ど')
    result.append({'text':duration.group(),'reading':reading});i=duration.end();stats['numericDurationTemperatureTokens']+=1;continue
  kanji_end=i
  if HAN.search(text[i]):
   while kanji_end<len(text) and HAN.search(text[kanji_end]):kanji_end+=1
  # Never split an unknown contiguous compound into arbitrary dictionary readings.
  match=next(((s,r) for s,r in byfirst.get(text[i],[]) if text.startswith(s,i) and len(s)>=kanji_end-i and (not HAN.search(s[-1]) or i+len(s)==len(text) or not HAN.search(text[i+len(s)]))),None)
  if match:
   s,r=match;result.append({'text':s,'reading':r});i+=len(s);stats['readKanjiTokens']+=1
  else:
   j=i+1
   if HAN.search(text[i]):
    while j<len(text) and HAN.search(text[j]):j+=1
    missing[text[i:j]]+=1;unknown=True
   else:
    while j<len(text) and not HAN.search(text[j]) and not byfirst.get(text[j]) and not text[j].isdecimal():j+=1
   result.append({'text':text[i:j]});i=j
 assert ''.join(p['text'] for p in result)==text
 stats['fields']+=1
 if unknown:stats['fieldsWithUnknownKanji']+=1
 return result
if '--self-test' in sys.argv:
 cases={'生食':'せいしょく','食用油':'しょくようゆ','紫外線':'しがいせん','事故事例':'じこじれい','30分':'さんじゅっぷん','1分':'いっぷん','24時間':'にじゅうよじかん','75℃':'ななじゅうごど','90秒':'きゅうじゅうびょう','１分':'いっぷん','使った':'つかった','同じ':'おなじ'}
 for source,expected in cases.items():
  tokens=ruby(source);assert ''.join(t.get('reading',t['text']) for t in tokens)==expected,(source,tokens)
 for source in ('事故事例集','紫外線未知群','4分の1','3.5℃'):
  tokens=ruby(source);assert not any(t.get('reading') for t in tokens),(source,tokens)
 print(json.dumps({'status':'PASS','cases':len(cases)+4,'scope':'known readings/durations/temperatures/unknown-compound and fraction safety','nativeReviewed':False}));sys.exit(0)
for p,x in packs.items():
 for l in x.get('lessons',[]):
  l['furigana']={k:ruby(l[field]) for k,field in [('title','titleJa'),('objective','objectiveJa'),('summary','summaryJa'),('activity','activityJa')]}
  for para in l['paragraphs']:para['furigana']=ruby(para['textJa'])
 for e in x.get('exams',[]):
  for q in e['questions']:q['furigana']={'stem':ruby(q['stemJa']),'options':[ruby(v) for v in q['optionsJa']],'explanation':ruby(q['explanationJa'])}
 write(p,x)
write(ROOT/'docs/ssw-workspace/restaurant/furigana-report.json',{'status':'aligned_dictionary_candidates','nativeReviewed':False,'contextReviewComplete':False,'stats':dict(stats),'unknownKanji':dict(missing.most_common()),'ambiguousStandaloneWordsIntentionallyUnannotated':True,'remaining':'Contextual pronunciation and all uncovered kanji require editorial review; exact alignment is not pronunciation certification.'})
print(json.dumps({'stats':dict(stats),'unknownTypes':len(missing)},ensure_ascii=False))
