#!/usr/bin/env python3
"""Reconcile the historical 33-page milestone and three explicitly read regions.

Source PDFs stay outside Git. This generates evidence, never acceptance by inference.
Run from the repository root with --source-dir /absolute/path/to/the/three/PDFs.
"""
import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'docs/ssw-workspace/manufacturing'
OUT = BASE / 'session-20261102/atomic47'


def digest(value):
    return hashlib.sha256(value if isinstance(value, bytes) else value.encode()).hexdigest()


def read(path):
    return json.loads((ROOT / path).read_text())


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


# Each row was compared by the author with the rendered source region and the
# named teaching paragraph. An empty/partial binding is deliberately not closed.
# shape: id, page, region, paraphrased knowledge, lesson suffix, paragraph, exact
# taught anchor, status/gap. No source paragraph or page artwork is redistributed.
ATOMS = {
 'mechanical': [
  ('outline',89,'table7-1/外形線','可視輪郭を太い実線で示す。','020','decision','見える輪郭は太い実線','taught'),
  ('dimension',89,'table7-1/寸法線','寸法の記入は細い実線を用いる。','020','decision','寸法線や寸法補助線は細い実線','taught'),
  ('extension',89,'table7-1/寸法補助線','寸法補助線は図形から寸法を引き出す役割。','020','decision','寸法線や寸法補助線は細い実線','partial_role_detail'),
  ('hidden',89,'table7-1/隠れ線','不可視輪郭は破線。表は細線と太線の両方を許す。','020','decision','見えない輪郭は破線','partial_thickness_alternatives'),
  ('center',89,'table7-1/中心線','中心線は細い一点鎖線で中心を示す。','020','decision','中心は通常細い一点鎖線','taught'),
  ('phantom-neighbor',89,'table7-1/想像線/use1','想像線は隣接部品の参考形状を示す。','080','section-2','隣の部品','taught'),
  ('phantom-tool',89,'table7-1/想像線/use2','想像線は工具や治具の参考位置を示す。','080','section-2','治具の位置','partial_tool_not_explicit'),
  ('phantom-motion',89,'table7-1/想像線/use3','想像線は可動部の移動後の位置を示す。','080','section-2','動いた位置','taught'),
  ('phantom-before-after',89,'table7-1/想像線/use4','想像線は加工前後の形を示す。','080','section-2','加工前後','taught'),
  ('phantom-repeat',89,'table7-1/想像線/use5','想像線は繰返しの表現にも用いる。','080','section-2','細い二点鎖線','gap_not_taught_in_named_paragraph'),
  ('phantom-front',89,'table7-1/想像線/use6','想像線は図示された断面の手前の表現にも用いる。','080','section-2','細い二点鎖線','gap_not_taught_in_named_paragraph'),
  ('break-shape',89,'table7-1/破断線/appearance','破断線には不規則な細い波形とジグザグがある。','080','section-2','破断線は一部を省いた境界','partial_appearance_only_in_supplement'),
  ('break-role',89,'table7-1/破断線/role','破断線は一部を除いた境界を示す。','080','section-2','破断線は一部を省いた境界','taught'),
  ('cut-shape',89,'table7-1/切断線/appearance','切断線は一点鎖線の端と方向変化箇所を太くする。','080','section-2','切断線は断面の切断位置','gap_exact_shape_not_taught'),
  ('cut-role',89,'table7-1/切断線/role','切断線は断面の位置を対応図へ示す。','080','section-2','切断線は断面の切断位置','taught'),
  ('hatch-shape',89,'table7-1/ハッチング/appearance','ハッチングは細い実線を規則的に並べる。','080','section-2','ハッチングは材料の切り口','partial_exact_shape_in_supplement_question'),
  ('hatch-role',89,'table7-1/ハッチング/role','ハッチングは断面の切り口を示す。','080','section-2','ハッチングは材料の切り口','taught'),
 ],
 'electrical': [
  ('exam-purpose',10,'intro/paragraph1','資料は技能水準を確認する評価試験として説明する。','043','section-2','試験の合格と、特定設備を担当できる資格・教育・社内承認は同じではありません','partial_general_purpose'),
  ('exam-level',10,'table1-1/level','資料時点で技能検定三級相当の水準を掲げる。','043','section-1','アップロード資料の2026年7月時点','reference_detail_not_taught_in_named_paragraph'),
  ('exam-cbt',10,'table1-1/method','資料時点の実施方法はCBT。','043','section-1','アップロード資料の2026年7月時点','reference_detail_not_taught_in_named_paragraph'),
  ('exam-theory-count',10,'table1-1/count/theory','資料の学科は真偽法三十問。','043','section-1','学科は真偽30問','taught_dated_source_not_current_policy_verification'),
  ('exam-practical-count',10,'table1-1/count/practical','資料の実技は判断・計画を問う多肢選択十問。','043','section-1','実技は判断や計画を問う多肢選択10問','taught_dated_source_not_current_policy_verification'),
  ('exam-theory-time',10,'table1-1/time/theory','資料は学科四十分を示す。','043','section-1','真偽30問・40分','taught_dated_source_not_current_policy_verification'),
  ('exam-practical-time',10,'table1-1/time/practical','資料は実技四十分を示す。','043','section-1','多肢選択10問・40分','taught_dated_source_not_current_policy_verification'),
  ('exam-theory-threshold',10,'table1-1/pass/theory','資料は学科正答率六十五パーセント以上を示す。','043','section-1','学科65%以上','taught_dated_source_not_current_policy_verification'),
  ('exam-practical-threshold',10,'table1-1/pass/practical','資料は実技正答率六十パーセント以上を示す。','043','section-1','実技60%以上','taught_dated_source_not_current_policy_verification'),
  ('exam-language',10,'table1-1/language','資料の日本語・漢字ルビという記載。','043','section-3','用語、単位、否定表現を最後まで読んで判断','reference_ruby_requirement_not_explicit_in_named_paragraph'),
  ('exam-eligibility',10,'table1-1/eligibility','資料時点の年齢・国籍別条件と日本就労意思。現在の資格案内とは分ける。','043','section-2','受験条件や当日の持ち物は申込時の公式案内で確認','dated_source_detail_deferred_to_current_official_application_guidance'),
  ('exam-job-table',11,'table1-2/all_job_entries','業務表は機械加工・組立・保全・包装・成形・基板等を含む。各列挙業務の個別対応は未完。','043','section-2','機械加工、保全、包装、樹脂や基板も含まれます','partial_individual_job_entry_mapping_pending'),
  ('exam-no-sharing',11,'section1-3/item1','問題・解答の部分情報を含む持出しと共有を禁じる。','043','section-3','試験会場の問題や解答を記録・持出し・共有せず','taught_general_rule_partial_information_detail_pending'),
  ('exam-monitoring',11,'section1-3/item2','会場の監督者・監視カメラという資料の注意。','043','section-3','試験会場の問題や解答を記録・持出し・共有せず','reference_monitoring_detail_not_taught_in_named_paragraph'),
  ('exam-invalidated',11,'section1-3/item3','不正時の結果無効などの対応を資料は記す。','043','section-3','新規問題で練習します','reference_sanction_detail_not_taught_in_named_paragraph'),
  ('exam-disqualification',12,'topbox/item1','資料は不正時の将来の受験資格剥奪を措置例として示す。','043','section-3','新規問題で練習します','dated_source_reference_not_current_legal_claim'),
  ('exam-report',12,'topbox/item2','資料は不正時の入管への通報を措置例として示す。','043','section-3','新規問題で練習します','dated_source_reference_not_current_legal_claim'),
  ('study-japanese',12,'study/item1','専門内容とあわせ日本語を学ぶ。','043','section-3','用語、単位、否定表現を最後まで読んで判断','partial_japanese_study_strategy'),
  ('study-ask',12,'study/item2','不明な専門語を上司や同僚に確認する。','043','section-3','苦手な理由を記録し','gap_explicit_ask_supervisor_or_colleague'),
  ('study-repeat',12,'study/item3','繰返し読んで理解し時間内に判断する練習。','043','section-3','説明できるようになってから時間付き演習へ進みます','partial_repeated_reading_strategy'),
  ('study-end',12,'study/item4','文末まで読み正誤と否定を取り違えない。','043','section-3','否定表現を最後まで読んで判断','taught'),
  ('assembly',165,'section5/paragraph1','電磁開閉器は接触器と熱動過電流リレーの組合せ。','094','section-1','電磁接触器とサーマルリレーを組み合わせた機器','taught'),
  ('alias',165,'section5/paragraph1','電磁開閉器はマグネットスイッチとも呼ばれる。','094','section-1','マグネットスイッチとも呼びます','taught'),
  ('threshold-time',165,'section5/paragraph1','熱動検出は電流と継続時間による発熱に関係する。','094','section-2','電流と継続時間による発熱','taught'),
  ('purpose',165,'section5/paragraph2','過負荷による電動機焼損を防ぐ用途。','094','section-1','サーマルは過負荷検出が役割','partial_burnout_purpose_not_explicit'),
  ('reset',165,'section5/paragraph2','安全確認後の手動リセットを資料は記す。','094','section-2','原因と安全を確認して承認された復帰','partial_manual_mode_not_explicit'),
  ('photo',165,'figure11-3','図は一組の電磁開閉器の外観例で、製品別配線図ではない。','094','section-1','接触器は負荷開閉','gap_exact_photo_component_identification'),
  ('no-main-interruption',165,'keyword/thermal','サーマル単独を主回路遮断機器と扱わない。','094','section-1','サーマル単独に主回路を遮断する機能を求めません','taught'),
  ('bimetal-material',165,'keyword/bimetal','熱膨張の異なる二種の金属を接合する。','077','section-1','熱膨張の異なる金属を組み合わせたもの','taught'),
  ('bimetal-motion',165,'keyword/bimetal','温度変化時の膨張差で曲がり、その性質を検出に使う。','094','section-2','二種金属の熱膨張差で曲がる部材','taught'),
 ],
 'surface': [
  ('solute',103,'section2-1/definition1','溶質は溶ける側の物質。','013','section-1','食塩が溶質','taught'),
  ('solvent',103,'section2-1/definition2','溶媒は溶かす側の液体。','013','section-1','水が溶媒','taught'),
  ('solution',103,'section2-1/definition3','溶液は溶質と溶媒による均一な液。','013','section-1','溶質が溶媒に溶けて均一になったものを溶液','taught'),
  ('salt-water-example',103,'examplebox/salt-water','食塩・水・食塩水の三役を対応させる。','013','section-1','例えば食塩水では、食塩が溶質、水が溶媒','taught'),
  ('precipitate',103,'section2-2/paragraph1','溶液中の反応で溶けにくい固体が生じる。','013','section-2','反応し、溶けにくい固体が現れるのが沈殿','taught'),
  ('analysis-use',103,'section2-2/paragraph2','沈殿を分離して定量する分析がある。','013','section-3','沈殿をつくり分離して量を調べる分析','taught'),
  ('silver-chloride',103,'examplebox/reaction1','銀と塩化物のイオンからAgCl固体を考える。印刷の塩化物電荷欠落をコピーしない。','013','section-2','Ag⁺+Cl⁻→AgCl','taught_with_source_notation_qualification'),
  ('silver-white',103,'examplebox/reaction1/color','AgCl例では白色の固体が示される。','013','section-2','白い固体なら必ず塩化銀という意味ではありません','partial_explicit_example_color'),
  ('sulfate',103,'examplebox/reaction2','SO₄²⁻とBa²⁺からBaSO₄固体を考える。',None,None,None,'taught_in_completion37_exact_binding'),
  ('sulfate-white',103,'examplebox/reaction2/color','BaSO₄例も白色であり色だけで化合物を同定できない。',None,None,None,'gap_explicit_example_color'),
 ]
}

QUESTIONS = [
 ('mfg1-mechanical-weekly-12-q03','mechanical','080','section-2',['phantom-tool'],[0,1,2,3],
  ['参考形状の判断が線の用途に一致する。','参考位置を加工外形に変える誤り。','想像線と隠れた穴輪郭を混同する誤り。','線種が用途を区別するため無関係とはいえない。']),
 ('mfg1-mechanical-completion37-q0503','mechanical','020','decision',['center','hidden'],[0,1,2,3],
  ['禁止表示はこの製図線ではない。','破断境界と中心の位置を混同する。','細い一点鎖線の中心線が出題条件に一致する。','寸法の数値と中心を示す線は異なる。']),
 ('mfg1-electrical-weekly-14-q03','electrical','094','section-1',['assembly','threshold-time','no-main-interruption'],[0,1,2,3],
  ['開閉と過負荷検出の二役を正しく分ける。','検出器を主回路の直接遮断器と扱う誤り。','継続する電流と熱の関係を無視する誤り。','接触器の負荷開閉を全短絡保護の完成と同一視する誤り。最後の範囲制限は本文に明記されるが、この一頁だけで全保護協調を認証しない。']),
 ('mfg1-electrical-mock-09-theory-q25','electrical','077','section-1',['bimetal-material'],[0,1],
  ['熱膨張差のある金属の組合せという命題は資料と本文に一致。','同じ命題を否定するため不適切。']),
 ('mfg1-surface-weekly-02-q06','surface','013','section-2',['precipitate','silver-chloride'],[0,1,2,3],
  ['溶液から難溶性固体が生じる条件は沈殿。','固体生成を全気化とする相違。','溶解だけと固体生成を混同する相違。','単位換算はこの化学変化の名称でない。イオン電荷は現行の保存則が整合する紙上モデルを対象とし、欠落した印刷電荷を正しいとはしない。']),
 ('mfg1-surface-completion37-check-002-q01','surface',None,None,['sulfate'],[0,1,2,3],
  ['H⁺では指定生成物の硫酸基を満たさない。','Na⁺とBa²⁺の二陽イオンでは指定生成物にならない。','Cl⁻は指定の硫酸塩ではない。','SO₄²⁻とBa²⁺は原子と電荷がBaSO₄へ対応する。'])
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-dir', type=Path, required=True)
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    source_register = read('docs/ssw-workspace/manufacturing/source-closure-20261031/source-register.json')
    documents, verified = {}, []
    for s in source_register['sources']:
        source = args.source_dir / s['filename']
        assert digest(source.read_bytes()) == s['sha256'], s['specialty']
        doc = fitz.open(source)
        assert len(doc) == s['physicalPages']
        documents[s['specialty']] = doc
        verified.append({k:s[k] for k in ('specialty','sourceId','sha256','physicalPages')})
    history = read('docs/ssw-workspace/manufacturing/batch33-full-review/review-index.json')
    prior = [p for p in history['pages'] if not p['visualDetailReviewed']]
    assert len(prior) == 33
    old33 = []
    for row in prior:
        s,n = row['specialty'],row['physicalPage']
        kind = 'instructional_exam_overview' if s == 'electrical' and n in (10,11,12) else 'cover' if n == 1 else 'colophon' if n == len(documents[s]) else 'table_of_contents'
        old33.append({**row,'currentDisposition':kind,
          'currentVisualReview':'source_render_contact_sheet_compared_by_author',
          'pageTextSha256':digest(documents[s][n-1].get_text()),
          'coverageMeaning':'requires_fine_grained_teaching_and_assessment_mapping' if kind.startswith('instructional') else 'bibliographic_or_navigation_information_not_an_extra_technical_lesson',
          'wholePageKnowledgeClosed':False})
    write('historical33.json',{'schemaVersion':1,'date':'2026-11-02','historicalDefinition':'pages lacking detail-view flag in batch33; not 33 unprocessed technical pages',
      'sourceRegister':verified,'counts':dict(Counter(p['currentDisposition'] for p in old33)),
      'pages':old33,'all33TechnicalKnowledgeClosed':False})

    courses = {s:read(f'src/data/manufacturing/{s}.json') for s in ATOMS}
    lessons = {l['id']:(f'src/data/manufacturing/{s}.json',l) for s,c in courses.items() for l in c['lessons']}
    for s in courses:
        for l in read(f'src/data/manufacturing/completion37/{s}.json')['lessons']:
            lessons[l['id']] = (f'src/data/manufacturing/completion37/{s}.json',l)

    def binding(s,suffix,pid,anchor=None):
        lid = f'mfg1-electrical-l{suffix}' if s == 'electrical' else f'mfg1-{s}-lesson-{suffix}'
        file,l = lessons[lid]
        p = next(p for p in l['paragraphs'] if p['id'] == pid)
        assert anchor is None or anchor in p['textJa'], (lid,pid,anchor)
        return {'file':file,'lessonId':lid,'lessonSourceHash':l['sourceHash'],'paragraphId':pid,'paragraphSha256':digest(p['textJa'])}

    atoms = []
    clarification = read('src/data/manufacturing/source47-clarification.json')
    resolved47 = {'extension','hidden','phantom-tool','phantom-repeat','phantom-front','break-shape','cut-shape','hatch-shape'}
    for s,definitions in ATOMS.items():
        source = next(x for x in verified if x['specialty']==s)
        for short,n,region,claim,suffix,pid,anchor,status in definitions:
            atom = {'id':f'mfg47-{s}-{short}','sourceId':source['sourceId'],'sourceSha256':source['sha256'],
              'physicalPage':n,'printedPage':n-(8 if s=='mechanical' else 9 if s=='electrical' else 10),
              'sourceLocator':region,'summaryJa':claim,'pageTextSha256':digest(documents[s][n-1].get_text()),
              'sourceRegionVisuallyRead':True,'sameAuthorSourceMeaningCompared':True,'teachingStatus':status,
              'wholePageClosed':False,'nativeReviewed':False,'domainReviewed':False}
            if suffix: atom['lessonBinding'] = binding(s,suffix,pid,anchor)
            elif short=='sulfate':
                file,l = lessons['mfg1-surface-completion37-lesson-002'];p=l['paragraphs'][0]
                assert 'Ba²⁺とSO₄²⁻' in p['textJa']
                atom['lessonBinding']={'file':file,'lessonId':l['id'],'lessonSourceHash':l['sourceHash'],'paragraphId':p['id'],'paragraphSha256':digest(p['textJa'])}
            if s=='mechanical' and short in resolved47:
                assert clarification['sourceHash']==lessons['mfg1-mechanical-lesson-080'][1]['sourceHash']
                atom['before47Status']=status
                atom['teachingStatus']='taught_by_source47_reader_appendix'
                atom['supplementBinding']={'file':'src/data/manufacturing/source47-clarification.json',
                  'lessonId':clarification['lessonId'],'paragraphId':clarification['paragraphId'],
                  'canonicalAfterSha256':digest(clarification['wording']['ja']['after']),
                  'targetLocales':sorted(k for k in clarification['wording'] if k!='ja'),
                  'activation':'exact_source_hash_canonical_before_and_effective_target_before_guard',
                  'scope':'teaching_text_only_not_visual_recognition_or_individual_assessment_closure'}
            atoms.append(atom)
        write(s+'-atoms.json',{'schemaVersion':1,'groupOrder':list(ATOMS).index(s)+1,'sourcePageRegionScope':'mechanical89, electrical10-12/165, surface103; rendered complete pages; exact individual gaps retained',
          'source':source,'atoms':[a for a in atoms if a['sourceId']==source['sourceId']],
          'allPageAtomsExhaustiveCertified':False,'sourceImagesRepublished':False})

    existing = read('docs/ssw-workspace/manufacturing/source-closure-20261031/assessment/question-ledger.json')['questions']
    existing = {q['id']:q for q in existing}
    qreviews = []
    for qid,s,suffix,pid,aids,indices,reasons in QUESTIONS:
        q=existing[qid]
        obj=read(q['sourcePath'])
        for part in q['jsonPointer'].split('/')[1:]:obj=obj[int(part)] if isinstance(obj,list) else obj[part]
        assert obj['id']==qid and obj['sourceHash']==q['authoredSourceHash']
        assert obj['stemJa']==q['stemJa'] and obj['correctIndex']==q['correctIndex']
        assert obj['optionsJa']==[o['textJa'] for o in q['options']]
        assert len(indices)==len(reasons)==len(q['options'])
        if suffix:b=binding(s,suffix,pid)
        else:
            file,l=lessons['mfg1-surface-completion37-lesson-002'];p=l['paragraphs'][1]
            b={'file':file,'lessonId':l['id'],'lessonSourceHash':l['sourceHash'],'paragraphId':p['id'],'paragraphSha256':digest(p['textJa'])}
        qreviews.append({'questionId':qid,'sourcePath':q['sourcePath'],'jsonPointer':q['jsonPointer'],
          'questionSha256':digest(json.dumps(obj,ensure_ascii=False,separators=(',',':'),sort_keys=True)),
          'sourceAtomIds':[f'mfg47-{s}-{x}' for x in aids],'exactTeachingBinding':b,
          'options':[{'index':i,'keyedCorrect':i==q['correctIndex'],'meaningDispositionJa':r} for i,r in zip(indices,reasons)],
          'meaningReview':'same_author_compared_all_options_and_rationales','sourceScope':'bounded_support_not_whole_source_page_closure',
          'translationSemanticReview':'not_repeated_or_certified_here','nativeReviewed':False,'domainReviewed':False})
    write('question-bindings.json',{'schemaVersion':1,'questions':qreviews,'newQuestionsAuthored':0,'reasonForReuse':'Existing questions assess these outcomes; avoid filler duplicates.'})

    # A source register is kept distinct from knowledge acceptance. Join every
    # physical page to its existing semantic records without fabricating atoms.
    matrix=read('docs/ssw-workspace/manufacturing/source-closure-20261031/coverage-matrix.json')
    assert len(matrix['pages'])==574
    write('validation.json',{'status':'PASS','sourceFilesHashVerified':3,'sourcePhysicalPagesVerified':574,
      'historical33ExactRows':33,'historical33Classification':dict(Counter(p['currentDisposition'] for p in old33)),
      'sourceClustersCompletedSequentially':3,'newBoundedAtomComparisons':len(atoms),
      'atomTeachingStatuses':dict(Counter(a['teachingStatus'] for a in atoms)),
      'exactQuestionTeachingBindings':len(qreviews),'optionMeaningDispositions':sum(len(q['options']) for q in qreviews),
      'runtimeFilesChanged':['src/data/manufacturing/lesson-editorial.ts','src/data/manufacturing/source47-clarification.json'],
      'mechanicalTeachingDetailsResolved47':len(resolved47),'whole574KnowledgeClosed':False,'fullPageKnowledgeClosureClaimed':0,
      'physicalDeviceVerified':False,'learningDurationMeasured':False,
      'inputsSha256':{str(p.relative_to(ROOT)):digest(p.read_bytes()) for p in [BASE/'batch33-full-review/review-index.json',BASE/'source-closure-20261031/coverage-matrix.json',*[ROOT/f'src/data/manufacturing/{s}.json' for s in ATOMS],*[ROOT/f'src/data/manufacturing/completion37/{s}.json' for s in ATOMS]]}})
    print(json.dumps({'status':'PASS','atoms':len(atoms),'questions':len(qreviews),'options':sum(len(q['options']) for q in qreviews),'old33':len(old33)}))


if __name__ == '__main__':
    main()
