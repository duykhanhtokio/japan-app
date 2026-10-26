"""Recover reviewed manual propositions; never mutate frozen Japanese lessons."""
import copy,hashlib,json,random,re
from pathlib import Path
P=Path(__file__).resolve().parent
R=P.parents[4]
def stable(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def sha(v):return hashlib.sha256(stable(v).encode()).hexdigest()
def write(n,v):(P/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
new=json.loads((P/'new-content.json').read_text())
base=json.loads((R/'src/data/manufacturing/electrical.json').read_text())
ls={l['id']:l for l in base['lessons']+new['lessons']}
manual=json.loads((P/'theory-draft.json').read_text())
assert hashlib.sha256((P/'theory-draft.json').read_bytes()).hexdigest()=='480d73bfabd1c6dd7bf242d7320e9b61f9b3a47398edf6b10be5cf079d2a1e8e'
reasons={int(s.split('|')[0]):s.split('|')[1:] for s in (P/'practical-option-review.txt').read_text().splitlines()}
assert len(reasons)==100
# Replacement distractors stay inside the concept tested and carry a separate diagnosis.
fix={
14:[('同じ接続図の線の色だけ','線色は回路識別を助けても物理的配置を示す情報にはならない。'),('展開接続図だけ','展開接続図は機能的接続を展開して示すため取付位置の根拠にはできない。'),('端子接続表だけ','端子間の対応表は取付位置と寸法を示す配置図の代わりにはならない。')],
18:[('極性だけを確認して定格を省く','極性が合っても逆耐圧や電流容量が不足する場合がある。'),('電流定格だけを確認して極性を省く','電流容量だけでは逆向きの取付けや端子違いを防げない。'),('外形だけを確認して端子資料を省く','外形一致だけで極性や定格の互換性は保証されない。')],
24:[('D/A変換','D/Aはデジタル値をアナログ信号へ戻す逆方向の変換である。'),('電圧の増幅だけ','増幅だけでは連続電圧はデジタル数値へ符号化されない。'),('ローパスフィルタだけ','フィルタは周波数成分を選択するが数値への変換そのものは行わない。')],
26:[('レジストの露光だけ','露光は感光膜へパターンを与える工程で銅の除去ではない。'),('レジストの塗布だけ','保護膜を塗るだけでは不要な銅は除去されない。'),('部品のはんだ実装','実装は部品の接合工程で、配線板の不要銅を除く工程ではない。')],
29:[('全負荷でも必ず軸の実測値と一致する','負荷時の誘導機にはすべりがあり軸速度と同期速度は区別する。'),('負荷で変わる実回転子速度だけを指す','同期速度は周波数と極数による回転磁界の速度であり軸の実測値の別名ではない。'),('電源周波数だけで決まり極数には関係しない','同期速度Ns=120f/pは周波数だけでなく極数にも依存する。')],
37:[('適合する下穴用ドリルとダイス','下穴は必要だがダイスはおねじ用で、穴内のめねじはタップで加工する。'),('センタポンチとリーマだけ','位置決めと穴仕上げだけではめねじのねじ山を形成できない。'),('適合するドリルだけ','ドリルで下穴をあけてもめねじの山はまだ作られていない。')],
57:[('Recycle','材料へ戻して再資源化するのでなく、箱の形のまま再使用している。'),('Reduceだけ','箱を繰り返し使う直接の分類はReuseであり、使用量を減らす説明だけではない。'),('廃棄処分','再使用しているので廃棄による処分を行う活動ではない。')],
61:[('公称径の数字だけ','公称径だけでは最大・最小の寸法とすきま・しまりを判断できない。'),('軸の公差だけ','穴側の許容寸法も合わせなければ組合せのはめあいは決まらない。'),('穴の公差だけ','軸側の許容寸法を欠くため最小・最大すきまを判断できない。')],
66:[('バリスタ','バリスタは主に印加電圧による抵抗変化を利用し、温度検出のサーミスタとは異なる。'),('CdSセル','CdSセルは主に光による抵抗変化を利用する素子である。'),('固定抵抗器','固定抵抗器は指定抵抗値を使う部品で、温度による抵抗変化を主に利用する素子の名称ではない。')],
67:[('フライス盤','フライス盤は主に工具を回転させる機械で、工作物回転が基本の旋盤とは異なる。'),('ボール盤','ボール盤は主に回転するドリルを工作物へ送って穴を加工する。'),('平面研削盤','平面研削盤は砥石による平面仕上げが主で、旋削の外径・ねじ加工とは異なる。')],
71:[('n型は正孔、p型は電子','n型とp型の多数キャリアの対応を逆にしている。'),('n型もp型も電子が多数','p型は正孔が多数キャリアなので両方を電子とはしない。'),('n型もp型も正孔が多数','n型は電子が多数キャリアなので両方を正孔とはしない。')],
72:[('メモリIC','メモリICの主機能は情報の記憶でありアナログ信号増幅ではない。'),('基本論理ゲートIC','基本論理ゲートは二値論理の演算を行い、連続信号を線形増幅する機能とは異なる。'),('マイクロプロセッサ','マイクロプロセッサは命令を実行する演算制御が主機能で、増幅器の名称ではない。')],
76:[('通常の電磁リレー','通常の電磁リレーは電磁力で機械接点を動かす方式である。'),('電磁接触器','電磁接触器は主に可動接点を開閉するため、無接点半導体のSSRとは異なる。'),('リードリレー','リードリレーも接点を磁気で動作させる機構で、半導体開閉だけの機器ではない。')],
83:[('スプルー','スプルーは溶融材料の流路であり、固まった製品の押出し部品ではない。'),('ランナー','ランナーは金型内の材料流路で、離型時に製品を押すピンとは役割が違う。'),('ゲート','ゲートはキャビティへの入口であり成形後の製品押出しを担う部品ではない。')],
84:[('未露光で硬化していない膜','負型の概念例では未硬化部を現像で除去する。'),('露光した膜も未露光膜も全て','現像は選択的に膜を除き、全膜をそのまま残す工程ではない。'),('全てのレジストを除いた銅だけ','現像段階では必要銅を保護する硬化膜が残り、全面剥離とは違う。')],
}
rows=[]
for n,s in enumerate((P/'mock-practical-bank.txt').read_text().splitlines(),1):
 if not s:continue
 lid,stem,answer,*tail=s.split('|');wrongs=tail[:3];why=tail[3]
 if n==72: why='オペアンプはアナログ信号処理に使う増幅器で、メモリや論理・演算制御ICとは主機能が異なる。'
 if n==43:
  stem=stem.replace('本教材に示す基準','このアプリの各問同点の練習基準')
  why='このアプリの同点採点では学科20/30以上・実技6/10以上を各区分で必要とする。今回は実技5/10で基準未満。公式試験の非公表配点や正答数を保証しない。'
 pairs=fix.get(n,list(zip(wrongs,reasons[n])))
 rows.append((f'mfg1-electrical-l{int(lid):03d}',stem,answer,pairs,why))
assert len(rows)==100
rng=random.Random(261026);rng.shuffle(rows)
# Forms 1–2,5–6,9–10 receive extra positions0/1; forms3–4,7–8 extra2/3: totals25 each.
forms=[];seen=set()
for f in range(1,11):
 e=copy.deepcopy(manual['exams'][f-1]);eid=e['id'];qs=e['sections']['theory']['questions']
 for q in qs:
  l=ls[q['lessonId']];q['lessonSourceHash']=l['sourceHash'];q['sources']=l['sources'];q['knowledgeIds']=l['knowledgeIds']
  q['sourceHash']=sha({k:v for k,v in q.items() if k!='sourceHash'})
 seq=[0,1,2,3]*2+([[0,1],[1,2],[2,3],[3,0]][f-1] if f<=4 else [[0,1],[1,2],[2,3],[3,0]][f-5] if f<=8 else [0,2] if f==9 else [1,3])
 while True:
  rng.shuffle(seq)
  if not any(seq[i]==seq[i-1]==seq[i-2] for i in range(2,10)):break
 ps=[]
 for i,c in enumerate(seq,1):
  lid,stem,answer,wrongpairs,why=rows[(f-1)*10+i-1];l=ls[lid];wrongpairs=wrongpairs[:];rng.shuffle(wrongpairs)
  pairs=wrongpairs[:];pairs.insert(c,(answer,why))
  q={'id':f'{eid}-practical-q{i:02d}','lessonId':lid,'lessonSourceHash':l['sourceHash'],'knowledgeIds':l['knowledgeIds'],'stemJa':stem,'optionsJa':[x[0] for x in pairs],'correctIndex':c,'optionReasonsJa':[x[1] for x in pairs],'sources':l['sources'],'reviewStatus':'ai_authored_draft_independent_review_pending'}
  q['sourceHash']=sha(q);ps.append(q)
 e['sections']['practical']={'id':eid+'-practical','durationMs':2400000,'passMinimumCorrect':6,'questions':ps}
 e.pop('status',None);e['revision']='v1-'+sha(e['sections'])[:16];forms.append(e)
for e in forms:
 for sn,s in e['sections'].items():
  ans=[q['correctIndex'] for q in s['questions']]
  assert len(ans)==(30 if sn=='theory' else 10)
  assert not any(ans[i]==ans[i-1]==ans[i-2] for i in range(2,len(ans))),e['id']
  assert sorted(ans.count(i) for i in range(2 if sn=='theory' else 4))==([15,15] if sn=='theory' else [2,2,3,3])
  for q in s['questions']:
   assert q['stemJa'] not in seen;qkey=re.sub(r'\s','',q['stemJa']);seen.add(q['stemJa'])
   assert len(q['optionsJa'])==len(q['optionReasonsJa'])
   assert len(set(q['optionReasonsJa']))==len(q['optionReasonsJa'])
write('mocks.json',{'specialty':'electrical','exams':forms})
print({'forms':len(forms),'questions':len(seen),'sha256':hashlib.sha256((P/'mocks.json').read_bytes()).hexdigest(),'practicalPositionCounts':[sum(q['correctIndex']==i for e in forms for q in e['sections']['practical']['questions']) for i in range(4)]})
