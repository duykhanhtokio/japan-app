"""Build author-reviewed JA revision payloads; no learner bank mutation."""
from pathlib import Path
import copy,hashlib,json,re
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'AGENTS.md').exists())
OUT=Path(__file__).resolve().parent
BASE=ROOT/'src/data/manufacturing'
AUDIT=ROOT/'docs/ssw-workspace/manufacturing/source-closure-20261031/assessment'
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def raw(q):
 p=ROOT/q['sourcePath'];v=json.loads(p.read_text())
 for k in q['jsonPointer'].strip('/').split('/'):v=v[int(k)] if isinstance(v,list) else v[k]
 return copy.deepcopy(v)
def jaun(q):return {k:copy.deepcopy(q[k]) for k in ['stemJa','optionsJa','correctIndex','optionReasonsJa','explanationJa'] if k in q}
ledger={q['id']:q for q in json.loads((AUDIT/'question-ledger.json').read_text())['questions']}
backlog=json.loads((AUDIT/'option-rationale-backlog.json').read_text())['questions']
# Meaning labels checked against actual PNGs and current SVGs, not only tuples.
labels={
1:{'A':'一般禁止','B':'禁煙','C':'火気厳禁','D':'立入禁止','E':'走るな','F':'さわるな','G':'飲めない','H':'携帯電話使用禁止','I':'電子機器使用禁止','J':'進入禁止'},
2:{'A':'一般注意','B':'障害物注意','C':'上り段差注意','D':'下り段差注意','E':'滑り注意','F':'転落注意','G':'頭上注意','H':'感電注意','I':'津波危険','J':'崖崩れ・地すべり注意'},
3:{'A':'可燃・引火性','B':'腐食性','C':'健康有害性','D':'水生環境有害性','E':'急性毒性（有害）や皮膚・目への刺激等に関わる感嘆符'},
4:{'A':'消火器','B':'AED','C':'広域避難場所','D':'避難場所（建物）','E':'津波避難場所'},
}
image_for={1:'sign-prohibition',2:'sign-prohibition',3:'sign-prohibition',4:'sign-warning',5:'sign-warning',6:'sign-chemical',7:'sign-emergency',8:'sign-chemical',9:'sign-emergency',10:'metrology-micrometer',11:'metrology-dial',12:'metrology-lever',13:'metrology-bore',14:'annotations-holes',15:'annotations-holes',16:'annotations-holes',17:'annotations-weld',18:'annotations-weld',19:'annotations-intermittent',20:'annotations-intermittent',21:'annotations-intermittent'}
updates=[]
for item in backlog:
 old=raw(ledger[item['questionId']]);assert sha(old)==item['recordSha256'];new=copy.deepcopy(old)
 rs=[o['proposedReasonJa'] for o in item['options']]
 if item['questionId'].startswith('mfg38-mechanical-q'):
  n=int(item['questionId'][-3:]);figure=int(re.search(r'図(\d+)',old['stemJa']).group(1));asset=image_for[n]
  if n<=7:
   expected=old['optionsJa'][old['correctIndex']].split('/')
   for i,s in enumerate(old['optionsJa']):
    got=s.split('/')
    if i==old['correctIndex']:rs[i]='この模式図では、'+ '、'.join(f'{p}は{labels[figure][p]}' for p in expected)+'を示し、指定の順に一致します。'
    else:
     mismatches=[f'{j+1}番目の{a}は{labels[figure][a]}で、求める{labels[figure][b]}の{b}ではありません' for j,(a,b) in enumerate(zip(got,expected)) if a!=b]
     rs[i]='。'.join(mismatches)+'。'
  if n==16:rs[2]='7 mmは板厚16 mmから穴の深さ9 mmを引いた底部の残り厚さです。穴Aの深さそのものではありません。'
  if n==19:
   rs[0]='90 mmは最初の赤区間の始点から最後の終点までの距離（35×2＋20）で、二つの空きを含みます。赤区間だけの合計ではありません。'
   rs[1]='始点間ピッチ35 mmを3回足した値です。赤区間1本の長さ20 mmを3本分足す計算とは違います。'
   rs[3]='45 mmは赤区間20 mmの3本分とは一致しません。区間長と空きの長さを分けて数えます。'
  evidence={'kind':'actual_PNG_author_visual_comparison_with_SVG_hash_binding','assetPath':f'assets/manufacturing/recognition38/{asset}.png','assetSha256':hashlib.sha256((ROOT/f'assets/manufacturing/recognition38/{asset}.png').read_bytes()).hexdigest(),'svgPath':f'assets/manufacturing/recognition38/{asset}.svg','svgSha256':hashlib.sha256((ROOT/f'assets/manufacturing/recognition38/{asset}.svg').read_bytes()).hexdigest(),'figure':figure,'operationalEquipmentCertification':False}
 else:
  evidence={'kind':'actual_sourcePDF72_visual_plus_authored_guide_paragraph_comparison','sourceId':'mfg1-mechanical-source','sourceSha256':'35096524ce12c830ce7765311f536b5d1d0a8bde7268e5385f90588abba04622','physicalPage':72,'guideId':'mfg1-mechanical-source-guide-caliper-increments-zero','guideSourceHash':'d00a9f1eadbfec6f09c473e7b0b397224d78ae914478e1414b389573e707ef3d','paragraphId':ledger[old['id']]['taughtBinding']['explicitParagraphId'],'operationalEquipmentCertification':False}
 new['optionReasonsJa']=rs
 assert len(rs)==4 and len(set(rs))==4
 updates.append({'questionId':old['id'],'sourcePath':ledger[old['id']]['sourcePath'],'jsonPointer':ledger[old['id']]['jsonPointer'],'expectedSourceHash':old['sourceHash'],'expectedRecordSha256':sha(old),'beforeQuestion':old,'afterQuestion':new,'before':jaun(old),'after':jaun(new),'canonicalJaHash':sha(jaun(new)),'proposedRevisionHash':sha({'kind':'reason_only_implementation40','previousSourceHash':old['sourceHash'],'afterJa':jaun(new)}),'scope':'option_reasons_only_stem_options_key_unchanged','retainOldAttempts':True,'authorComparison':evidence,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False})
replacements=[]
def replace(qid,stem,options,key,reasons,paragraphs,pages,task):
 old=raw(ledger[qid]);new=copy.deepcopy(old);new.update(stemJa=stem,optionsJa=options,correctIndex=key,optionReasonsJa=reasons)
 assert key==old['correctIndex'] and len(options)==len(reasons)==4 and len(set(options))==4 and len(set(reasons))==4
 replacements.append({'questionId':qid,'sourcePath':ledger[qid]['sourcePath'],'jsonPointer':ledger[qid]['jsonPointer'],'expectedSourceHash':old['sourceHash'],'expectedRecordSha256':sha(old),'beforeQuestion':old,'afterQuestion':new,'before':jaun(old),'after':jaun(new),'canonicalJaHash':sha(jaun(new)),'proposedRevisionHash':sha({'kind':'new_task_implementation40','previousSourceHash':old['sourceHash'],'afterJa':jaun(new)}),'scope':'genuinely_reauthored_task_with_original_question_ID_and_key_position','retainOldAttemptsAsHistoricalOnly':True,'rejectOldRevisionForNewTask':True,'taughtLessonId':old['lessonId'],'taughtLessonSourceHash':old['lessonSourceHash'],'taughtParagraphIds':paragraphs,'sourceId':'mfg1-electrical-source','sourceSha256':'b846a05aa2c33a490e2bb706fe14ad55d587e7fd60718a4e09ab1cd28033bdcf','sourcePhysicalPagesActuallyTextCompared':pages,'newDecisionTask':task,'dataSufficiency':'all required inputs and ideal-model conditions supplied; no numerical operating limit inferred','nativeReviewed':False,'domainReviewed':False,'humanReviewed':False})
replace('mfg1-electrical-mock-03-practical-q01',
'本尺18 mm、副尺の端数0.45 mmを読む紙上例で、担当者Aは18.45 mm、Bは18.90 mmと記録した。Bの記録の問題点と合否判断の扱いとして適切なのはどれか。',
['Bは単位をmmからcmへ直した値なので正しい。','Bは最小読取値0.05 mmを示すため、そのまま測定値にできる。','Bは副尺の端数0.45 mmを二重に加えている。合否は図面の許容範囲と判定方法を別に確認する。','AとBは同じ値の書き方であり、どちらも合格と確定できる。'],2,
['18.90 mmという記録はmmからcmへの換算ではありません。単位換算と端数を足す処理を混同しています。','最小読取値0.05 mmは目盛りの刻みで、Bの18.90 mmや今回の端数0.45 mmそのものを表しません。','18＋0.45＝18.45 mmです。18.90 mmは端数を二度足した値です。寸法の計算と、図面・手順に基づく合否判断は分けます。','18.45 mmと18.90 mmは同じ値ではありません。また、許容範囲と判定方法が示されていないので合格を確定できません。'],
['section-2','formulae'],[93,94],'Diagnose double-counted vernier remainder and separate numerical record correction from unsupported acceptance; replaces direct addition task, not merely numbers.')
replace('mfg1-electrical-mock-08-practical-q02',
'紙上の基本的な自己保持回路を考える。通常の非保持形リレーを用い、起動入力は既に戻っている。保持中に電源が切れ、その後電源だけが復帰した場合、この教材例での状態の説明はどれか。',
['電源断で保持が解除され、電源が戻っただけでは再起動しない。','自己保持なので、電源断中もコイルは励磁されたままである。','電源が戻れば入力条件に関係なく必ず自動再起動する。','停止用接点がある回路では、電源断による状態変化を考えなくてよい。'],0,
['この条件の基本例では、電源断でコイルの励磁と自己接点による保持が解除されます。起動入力も戻っているため、電源だけが復帰しても起動経路は成立しません。','自己保持は無電源で永久に励磁を保つ意味ではありません。この問題は通常の非保持形リレーを前提とします。','問題では起動入力が既に戻っています。電源復帰だけで必ず自動再起動するという説明は、この基本例の条件と異なります。','停止用接点の有無だけで電源断・復帰時の状態を省略できません。実設備の再起動防止や安全機能の妥当性は別途確認します。'],
['section-2','section-3'],[169,170],'Trace power-loss/restoration state under explicit non-latching and returned-start conditions; replaces why-contact-holds explanation task.')
replace('mfg1-electrical-mock-09-practical-q03',
'同じ媒質・距離の理想点電荷モデルで、二つの電荷の大きさは変えず、一方の符号だけを正から負へ変えた。初めは二つとも正だった。力の大きさと向きの変化はどれか。',
['力の大きさは2倍になり、反発のままである。','力の大きさは変わらず、反発から引力に変わる。','力の大きさは0になり、力は働かなくなる。','力の大きさは変わらず、反発のままである。'],1,
['電荷の大きさ、距離、媒質は同じなので、力の大きさが2倍になる条件ではありません。異符号どうしでは向きも引力に変わります。','電荷の大きさの積と距離・媒質は同じなので、力の大きさは変わりません。同符号から異符号になるため、反発から引力に変わります。','符号を変えても電荷の大きさを0にしたわけではありません。異符号間には引力が働きます。','力の大きさが変わらない点は合いますが、符号が異なるため反発のままではなく引力になります。'],
['section-1'],[120],'Distinguish direction reversal from unchanged force magnitude under charge-sign change; replaces triple-distance inverse-square calculation.')
# Ruby token compilation is added separately so translation can start from this
# frozen Japanese snapshot while exact token alignments are validated.
result={'schemaVersion':1,'date':'2026-10-31','baselineCommit':'dfb2af5120b963aaa3f6f22e79a251fd6d00ebae','status':'author_compared_Japanese_ready_for_guarded_integration_not_human_or_native_approval','rationaleUpdates':updates,'replacementQuestions':replacements,'counts':{'rationaleQuestions':29,'optionSpecificRationaleTexts':116,'genuinelyReauthoredTasks':3,'unchangedKeyPositions':32},'retainedNearPairs':[{'questionIds':['mfg1-mechanical-weekly-03-q05','mfg1-mechanical-mock-09-practical-02'],'decision':'keep_as_spaced_competency_practice','reason':'Different sleeve/thimble values and half-mm carry reinforce reading process across weekly and mock settings; no identical-data task. Retain explicit pedagogy rather than inflate unique competencies.'},{'questionIds':['mfg1-surface-weekly-06-q06','mfg1-surface-mock-01-practical-q07'],'decision':'keep_as_spaced_competency_practice','reason':'Different voltage/current values yield4ohm vs3ohm; preserve prefix conversion practice and teaching-to-transfer link. These are related exercises, not new source-knowledge units.'}],'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False}
result['canonicalJaBundleHash']=sha({'rationaleUpdates':[{k:u[k] for k in ['questionId','after','canonicalJaHash']} for u in updates],'replacementQuestions':[{k:u[k] for k in ['questionId','after','canonicalJaHash']} for u in replacements]})
(OUT/'final-authoring.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('FrozenJA',result['canonicalJaBundleHash'],result['counts'])
