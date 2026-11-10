"""Explicit same-topic pairings; no topic inference or fallback at runtime."""
import json,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];P=ROOT/'src/data/manufacturing'
read=lambda p:json.loads(p.read_text())
lessons={l['id']:l for s in ['mechanical','electrical','surface'] for l in read(P/(s+'.json'))['lessons']}
extra={l['id']:l for l in read(P/'source-guides.json')['guides']}
for s in ['mechanical','electrical','surface']:extra.update({l['id']:l for l in read(P/'completion37'/(s+'.json'))['lessons']})
def core(s,n):return f'mfg1-{s}-'+(f'l{n:03}' if s=='electrical' else f'lesson-{n:03}')
rows={}
def bind(s,ids,target,reason):
 t=extra.get(target) or lessons[target]
 for n in ids:
  l=lessons[core(s,n)];assert l['id'] not in rows
  rows[l['id']]={'lessonId':l['id'],'lessonSourceHash':l['sourceHash'],'companionId':t['id'],'companionSpecialty':t['specialty'],'sharedManufacturing1Foundation':l['specialty']!=t['specialty'],'companionSourceHash':t['sourceHash'],'paragraphIds':[p['id'] for p in (t['paragraphs'] if '-source-guide-' in t['id'] else t['paragraphs'][:2])],'reasonJa':reason,'mode':'same_topic_comparison_not_new_knowledge','nativeReviewed':False,'domainReviewed':False}
def sup(s,n):return f'mfg1-{s}-completion37-lesson-{n:03}'
def guide(s,n):return f'mfg1-{s}-source-guide-{n}'
bind('mechanical',[2,3],guide('mechanical','5s4s'),'5Sの五要素と4S・三定の役割を、継続する職場管理として比べる。')
bind('mechanical',[8,71,72],sup('mechanical',1),'表示の名称だけでなく形・枠・場所と必要な行動を照合する。')
bind('mechanical',[9,10,11,12,14,61,62,74],sup('mechanical',2),'集計・分布・時間順・関係を同じ品質管理の目的から読み分ける。')
bind('mechanical',[15,75],sup('mechanical',4),'硬さの名称と圧痕の形・読む長さを照合し、他の試験量と区別する。')
bind('mechanical',[17,19,40,41,42,51,52,77,78,79],sup('mechanical',3),'測る道具・支える道具・基準と目盛を比較し、測定値の意味をそろえる。')
bind('mechanical',[18],guide('mechanical','caliper-increments-zero'),'ノギスの使用前確認を、読取単位・光のすき間・ゼロ表示に分けて確かめる。')
bind('mechanical',[20,43,80],sup('mechanical',5),'尺度の比と実寸、線の太さと繰返しを図面の用途に結び付ける。')
bind('mechanical',[21],guide('mechanical','tolerance-annotation'),'公差等級と数値の記入方法は別の判断であることを例で比較する。')
bind('mechanical',[44,45,46,47,48],sup('mechanical',6),'立体をどこから見るか、切断位置と寸法の対象を同じ部品で追う。')
bind('mechanical',[28,49],sup('mechanical',7),'引出線の先と表面性状・溶接の対象を対比し、指示箇所を特定する。')
bind('mechanical',[23,24,25,83,84,85,86],sup('mechanical',8),'材料名の例を使用許可にせず、工作機械の部位と仕様への照合を分ける。')
bind('mechanical',[81],guide('mechanical','arc-diameter-condition'),'円と球、円弧条件の違いを補助記号の具体例で確かめる。')
bind('electrical',[3,4,38,91],core('electrical',73),'目盛の読み方だけでなく、測定原理・基準と誤差の意味を比べる。')
bind('electrical',[5],guide('electrical','resistance-methods'),'テスターの名称だけでなく抵抗測定法と測定系の影響を整理する。')
bind('electrical',[7,69], 'mfg1-electrical-completion37-scope','波形と周期の読取りを、帯域・サンプリング・記録容量の異なる条件に結び付ける。')
bind('electrical',[16,22,66,92], 'mfg1-electrical-completion37-lcr','受動部品の機能を、L・C・Rの測定量と測定条件の違いから確かめる。')
bind('electrical',[31,44,58,80],guide('electrical','leakage-earth'),'接地は故障の修理ではないことを、漏電経路と組み合わせる保護から確認する。')
bind('electrical',[39], 'mfg1-electrical-completion37-thermocouple','計器が測る量を温度差の例で具体化し、計測側と基準側を区別する。')
bind('electrical',[42], 'mfg1-electrical-completion37-hall','電流・磁束密度・電圧の三方向を紙面の視点と対応させる。')
bind('electrical',[68,70,93], 'mfg1-electrical-completion37-resistance','理想回路の紙上計算と測定系を含む値を混同しないよう比較する。')
bind('electrical',[81],core('electrical',21),'予防保全と事後保全の選択を、故障後の記録だけでなく兆候の観察まで戻って考える。')
bind('electrical',[89],core('electrical',36),'締結部品の形の識別を、指定工具と締付条件の確認につなげる。')
bind('electrical',[90],core('electrical',40),'残す形状から、下穴・タップの役割と加工前確認を追う。')
bind('electrical',[94],core('electrical',28),'リレーの役割を自己保持の起動・停止の状態変化と照合する。')
bind('surface',[1,43,44,71],guide('surface','basic-safety'),'知らない工具、異常時の停止と報告を具体的な行動へ結び付ける。')
bind('surface',[2,51],guide('surface','ph'),'資料のpH7という基準例と測定条件を分け、無条件の判断にしない。')
bind('surface',[9,14],guide('surface','specific-gravity'),'比重の無次元量と密度の単位を区別し、基準温度の例を確認する。')
bind('surface',[5,27,28],guide('surface','electrode-reactions'),'陽極と陰極の電子の出入りを、液中と外部電路の場所を分けて追う。')
bind('surface',[16,26,58],guide('surface','pretreatment-jig'),'前処理と治具の保持・通電・耐薬品性は別々に確認する。')
bind('surface',[7,23,33,55,69],sup('surface',1),'評価したい性質と試験名を対応させ、試験条件を普遍的な合格基準にしない。')
bind('surface',[10,11,12,13,48,49,50,67],sup('surface',2),'分析の目的と反応の式を区別し、原子・電荷・対象量を確認する。')
bind('surface',[24,66],sup('surface',3),'液面と目線、液温・比較条件を分けて読む。')
bind('surface',[15,29,54],sup('surface',4),'合金名と系列を、治具材料や処理目的と対比して照合する。')
bind('surface',[8,34,35,61,62,70],sup('surface',5),'バフと研磨剤の硬さ・供給形式を前後の表面状態とつなげる。')
bind('surface',[3,6,17,36,37,38,39,64],sup('surface',6),'独立した工程記録で管理条件と不良の判定を読み分ける。')
bind('surface',[20,21,56,65],sup('surface',7),'小さな異常と公害の経路を、発見場所・記録・報告の対象に分ける。')
bind('surface',[4,19,30,40,57,59,68],sup('surface',8),'金属と液、皮膜の領域、塗装の付着・電着・硬化を模式図と説明で区別する。')
# Resolve every core reader under300body characters with a concrete related comparison.
bind('mechanical',[60],core('mechanical',11),'手順書の改訂と、工程で何を管理するかを資料の目的から照合する。')
bind('mechanical',[63],core('electrical',69),'直流と交流を時間軸上の波形・過渡状態と対応させて比較する。')
bind('mechanical',[65],core('electrical',95),'回転機と変圧器を構造・動く部分・使用条件に分けて比べる。')
bind('mechanical',[66],core('electrical',15),'導電・磁性・絶縁の違いを用途と適用条件から比較する。')
bind('mechanical',[67],core('electrical',22),'蓄えるエネルギーと回路内の働きを、コイルとコンデンサで具体的に比べる。')
bind('mechanical',[68],core('electrical',18),'ダイオードの向きと整流を、半導体の役割の具体例として確かめる。')
bind('electrical',[45],core('electrical',74),'定位置と数量を作業終了時の返却・引継ぎの場面で確認する。')
bind('electrical',[47,48],core('electrical',85),'表示の分類を実際に避ける危険と行動の組合せに結び付ける。')
bind('electrical',[50,52],core('electrical',8),'品質の段階と工程管理の目的を、組立検査で記録する事実から考える。')
bind('electrical',[51],core('electrical',9),'現物で確認した事実と推測を分け、改善へつなぐ報告を組み立てる。')
bind('electrical',[53],core('electrical',12),'QC道具の使い分けをパレート図の集計と改善順位の例で確かめる。')
bind('electrical',[55],core('electrical',6),'基本単位と接頭語を、電圧・電流・抵抗を計算する場面で照合する。')
bind('electrical',[56],core('mechanical',36),'pHと酸化還元を同じ数値の大小だけで判断しないことを比較する。')
bind('electrical',[60],core('electrical',13),'見る方向や図面の用途の前に、尺度と線の意味を具体例で確認する。')
bind('electrical',[61],core('mechanical',21),'寸法公差と補助記号を、図面で指定する対象と数値に結び付ける。')
bind('electrical',[64],core('electrical',1),'電線の種類・導体断面・端子と工具を具体的な組合せで比較する。')
# Select the comparison relevant to the day, rather than inserting a whole atlas.
for n,sections in {3:[1,4],6:[1,4],17:[1,4],36:[1,2],37:[1,4],38:[1,4],39:[2,3],64:[1,4],24:[3,4],66:[1,3],4:[1],19:[2,3],30:[4],40:[1],57:[1,2],59:[1],68:[4]}.items():
 key=core('surface',n)
 if key in rows:rows[key]['paragraphIds']=['section-'+str(i) for i in sections]
result={'schemaVersion':1,'purpose':'Existing sourced content explicitly attached inside the scheduled day. No lesson/question/state payload changes.','bindings':rows}
(P/'daily-support-bindings.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print({'companionDays':len(rows),'bySpecialty':{s:sum(lessons[k]['specialty']==s for k in rows) for s in ['mechanical','electrical','surface']}})
