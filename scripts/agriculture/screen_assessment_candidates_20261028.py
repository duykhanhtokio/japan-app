"""Preserve a bounded editorial screen; do not certify global uniqueness."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'docs/ssw-workspace/agriculture'
FROZEN_REVIEW_INPUTS = {'lessons': 'a195fbc073bc88fb28d4d98016f430f52473f8857134ad52bc781cfdb18f30a5', 'weekly': 'e7e5e9fcbc9bd9dbb8f7950425412cfa1328daf9c57d8a6e0b0ad90d445a1b31', 'mocks': '877232d847c195dca9ac647936096080ed868e2e7f2b0fca47141940d8e97d5e', 'candidates': 'd6d74e0bfd4d77ba52cfe7939bd11f5452cbaeecc58b438642498e6d24b551e6'}

# Decisions concern the proposed objective, not removal of lesson knowledge.
NOTES = {
 'fertilizer': [
  ('exclude', '硫安の別名を問う既存問題と同じ名称対応操作で、肥料名を替えた追加枠として数えない。', ['agr-par08-fertilizer-formulations-q01']),
  ('retain', '既存問題は配合肥料という分類名の対応。候補は原料の傾向と全製品への一般化の区別だが、設問化時に分類名だけの再出題にしない。', ['agr-par08-fertilizer-formulations-q03']),
  ('retain', '既存問題は堆肥の二つの役割。発酵した資材と未処理原料の区別は異なる操作候補。発酵条件や完熟判定を本文外から追加しない。', ['agr-par03-fertilizer-q04']),
  ('retain', '既存問題の速効性・被膜の説明と区別し、微生物分解と難溶性の二経路を比較する候補。溶出速度の数値を創作しない。', ['agr-par03-fertilizer-q06','agr-par03-fertilizer-q07']),
  ('exclude', '現候補は期間例を全製品保証へ広げないという読み方で、既存の耐久年数問題と同型。持続年数や資材名を替えるだけの追加問題にしない。', ['agr-1-m01-q04']),
  ('retain', 'ペレットの形状と原料組成を分ける候補。既存の固体・液体区分や単肥区分の名称選択を再利用しない。', ['agr-par03-fertilizer-q03','agr-par03-fertilizer-q05']),
 ],
 'hormones': [
  ('retain', '体内でできる物質と外から行う処理を区別する候補。外部処理の量・登録・効能を推定しない。', []),
  ('retain', 'オーキシンと側芽抑制の関係を、物理的な芽かきの作業名とは分けて問う候補。', []),
  ('retain', '茎の伸長と休眠打破という複数対象を保持する候補。種なしブドウの処理名の再出題だけにしない。', []),
  ('retain', 'サイトカイニンの側芽・葉の老化という対象を比較する候補。オーキシン問題との識別表が必要。', []),
  ('retain', '休眠促進と休眠打破の方向の比較候補。ジベレリン候補と同じ対応を逆向きに問うだけなら一方を除外する。離層の保留事項は対象外。', []),
  ('retain', '気体という性質と対象ごとに異なる作用を残す候補。切り花の品質保持と混同せず、全植物への一方向作用を問わない。', ['agr-par21-g5-q03']),
 ],
 'weeds': [
  ('retain', '既存の早期防除や種子散布防止に対し、雑草が病害虫の生息環境となる経路の候補。すべての雑草が感染しているという断定を避ける。', ['agr-cm-weekly-q15','agr-cm-weekly-q16']),
  ('retain', '影響する植物の範囲による分類候補。分類名を現行製品の使用許可へ読み替えない。', ['agr-par04-safety-q07']),
  ('retain', '茎葉からの吸収経路と選択性の分類軸を区別する候補。前候補との重複を設問の操作で判定する。', []),
  ('retain', '土壌処理と雑草の生育段階の条件を結び付ける候補。製品一般の散布日や有効量には広げない。', []),
  ('retain', '除草用途器材の分離と洗浄を同一視しない判断候補。既存の使用簿記録や保管場所問題とは別。', ['agr-par04-safety-q08','agr-par21-g2-q02']),
  ('retain', '器材内の残留と周辺への飛散の経路比較候補。距離やノズル仕様の数値を補わない。', []),
 ],
 'vegetables': [
  ('exclude', '夏の高冷地という例だけでは、既存の地域差を使う供給・作型問題から独立する操作が未指定。地域名・作物名の置換で追加しない。', ['agr-1-w01-q06','agr-par11-general-q07']),
  ('retain', '寒玉・春玉・丸玉の形と結球の特徴を対応させる候補。名称から播種日や全品種の性質を推定しない。', []),
  ('exclude', '料理例と全国共通の栽培日を混同しないという現候補だけでは、新しい農作業能力が明確でない。料理名を替えた数合わせに使わない。', []),
  ('retain', 'レタスの形と移植方式を別欄で扱う候補。分類軸という一般的な読解だけに留めず、具体的に何を確認するか再設計が必要。', ['agr-1-w01-q04']),
  ('exclude', '現候補は周年栽培を一株の連続収穫と誤解しない説明。既存の周年栽培の意味の再出題を作物名置換で追加しない。', ['agr-1-w01-q05']),
  ('retain', '既存問題はタマネギの食用器官。移植方式は別の知識だが、直まきとの差を実作業の判断として設計し、器官問題の言換えにしない。', ['agr-vegwork-weekly-q06']),
 ],
 'facility': [
  ('retain', '歴史的な年・施設生産という対象・重量と面積の指標を同時に保持する一つの統計読解候補。イチゴの値の置換版を別枠に数えない。', ['agr-2-w01-q12']),
  ('exclude', '産地リレーによる周年供給は既存問題で扱う操作。県名やトマトという作物名の変更だけでは独立目標にならない。', ['agr-1-w01-q06']),
  ('retain', '栄養成長と生殖成長を並行して観察する候補。光合成の材料・産物を問う既存問題とは別の観察対象。', ['agr-shared-w02-q05','agr-shared-w02-q06']),
  ('exclude', '同じ候補群の施設トマト統計と、年・対象・数量単位を保持する操作が重なる。作物名と数量だけを替えた第二問にしない。', []),
  ('exclude', '県名を作物別に記憶照合する提案は、地域名置換の枠を増やしやすい。現候補を独立した新規問題数に算入しない。', []),
  ('retain', '総面積と10a当たり収量という分母の異なる指標を比較する候補。未掲載の年・増減率・総生産量の変化を推定しない。', []),
 ],
 'fruit': [
  ('retain', '浮皮防止という果皮を対象にした目的を識別する候補。下の三候補と目的表として一体化すべきか全体マトリクスで判定する。', []),
  ('retain', '収穫前という時点を伴う落果防止の候補。成熟促進との対象・時点の比較を設計し、作物名だけの変更で別問にしない。', []),
  ('retain', '成熟の進行と落果抑制は異なる変化。ただし前候補と同じ目的対応を逆向きに問うだけの別問を認めない。', []),
  ('retain', '根・枝の発生という器官対象と、挿し木・接ぎ木という繁殖方法名を区別する候補。製品の処方は含めない。', ['agr-1-m01-q30']),
  ('retain', '運搬用途と乗用・非乗用の型を別情報として扱う候補。機械名から乗車可否を判断する問題にしない。', ['agr-par06-fruit-management-q16']),
  ('retain', 'クローラ・自走・乗車許可を分ける候補。ただしモノレール候補と乗車可否の同じ判断しか問わない場合は統合する。', []),
 ],
}


def main():
    from assessment_inventory import load, digest
    inputs = load()
    if {k: digest(inputs[k]) for k in FROZEN_REVIEW_INPUTS} != FROZEN_REVIEW_INPUTS:
        raise ValueError('Review input snapshot changed; manual reassessment required')
    candidates = json.loads((BASE / 'session-20261027/assessment-audit.json').read_text())['new2goCandidateObjectives']
    decisions = []
    for c in candidates:
        group = c['lessonId'].removeprefix('agr-par22-')
        index = int(c['paragraphId'].rsplit('-p', 1)[1]) - 1
        decision, reason, related = NOTES[group][index]
        decisions.append({'candidateId': c['candidateId'],
                          'decision': 'exclude_from_new_question_count' if decision == 'exclude' else 'retain_for_global_review',
                          'reasonJa': reason, 'relatedQuestionIds': related,
                          'reviewScope': 'local_editorial_screen_against_current_prose_and_selected_existing_assessments',
                          'humanReviewed': False, 'domainReviewed': False, 'nativeReviewed': False})
    report = {
        'schemaVersion': 1, 'date': '2026-10-28',
        'reviewedInputHashes': FROZEN_REVIEW_INPUTS,
        'scope': '36_existing_2go_candidates_only_no_new_questions_or_pdf_reverification',
        'reviewer': 'AI', 'globalSemanticDedupComplete': False,
        'capacityFor800Certified': False, 'decisions': decisions,
        'next': 'Resolve retained cross-candidate overlaps and source holds in a global objective matrix; author new Japanese questions only for distinct accepted operations.',
    }
    (BASE / 'session-20261028/assessment-review.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
