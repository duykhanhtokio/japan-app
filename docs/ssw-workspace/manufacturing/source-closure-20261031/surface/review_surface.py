"""Bounded source-to-lesson review decisions, separate from machine candidates."""
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
DOCS = ROOT / 'docs/ssw-workspace/manufacturing'
SOURCE = '08d7e9d6ae5fc5a442af227bbc690ed54cde06681ee8806eb7aadf87748b2eae'
PRIVATE = Path('/workspace/scratch/8c34e3cace7a/surface-audit-private39/surface-private-extraction.json')

# Each row is an independently worded, bounded concept checked against the
# exact source page and the named authored paragraph. It does NOT close a page.
# page, topic, source locator needle, lesson suffix, paragraph ID, conclusion,
# bound assessment IDs, qualification, current-session enlarged-page inspection.
SEEDS = [
 (53,'environment','水質','020','section-1','水洗後の水も成分に応じて管理し、透明さやpHだけで放流可否を決めない。',[], '源資料の排出値を現行の一律基準として採用しない。',False),
 (53,'environment','物理的','065','section-2','排水処理には分離・反応・生物作用など異なる方法があり、成分に応じて組み合わせる。',[], '危険な廃液系統の混合方法や投入処方は学習者へ指示しない。',False),
 (64,'bath_measurement','比重','009','section-2','比重計は指定された読み位置・温度・浮き方を確認して読む。全器具に同じ液面位置を適用しない。',[],None,True),
 (64,'bath_measurement','濃度','009','section-3','比重から濃度を求めるには対象液と温度などの換算条件が必要で、別の浴のグラフを流用しない。',[], '元資料のグラフ上の値は当該例の参照値であり、普遍的な補給式ではない。',True),
 (64,'bath_measurement','熱交換','c003','section-1','温度を測る器具と、液を加熱・冷却する設備とは役割が違う。',[],None,True),
 (67,'bath_measurement','フェノール','c003','section-4','指示薬の呈色は物質名と酸性・中性・アルカリ性の条件を対応させて読む。',['mfg37-required-indicator-color-recognition-q01','mfg37-required-indicator-color-recognition-q02','mfg37-required-indicator-color-recognition-q04'],None,True),
 (67,'bath_measurement','底部','066','section-2','ビューレット・ピペットの液面位置を器具に合わせて読む。比重計の上縁読みとの違いがある。',[],None,True),
 (67,'bath_measurement','ビューレット','010','section-2','滴定の使用体積は開始値と終了値の差で求め、反応比と体積単位も照合する。',[], '元の練習問題の数値や選択肢は再利用しない。',True),
 (70,'bath_measurement','電圧','066','section-1','図示された計器は単位・レンジ・区間数と針位置を対応させて読む。文字が少ない図のページも知識確認の対象に残す。',[], '源資料の設問・数値・解答は転記せず、読取り能力の目標だけを対応付ける。',True),
 (71,'thickness','測定','003','section-1','膜厚の評価では位置ごとの値と上下の偏りを残し、平均だけで局所不良を消さない。',['mfg38-sample-location-mean-q01','mfg38-sample-location-mean-q03'],None,True),
 (71,'thickness','渦','063','section-1','膜厚計の原理と、基材・皮膜・層構成への適合を分けて確認する。',['mfg38-coating-thickness-instrument-recognition-q03'],'源資料の渦電流の適用説明は装置方式や対象層構成の条件を外して一般化しない。',True),
 (71,'thickness','皮膜','063','section-2','断面法や質量差の方法では試料への影響と、面積・密度など換算に必要な情報を確認する。',[],None,True),
 (75,'thickness','蛍光','063','section-1','蛍光X線と渦電流は厚さへ換える観測原理が異なる。装置名だけから相互代用を判断しない。',['mfg38-coating-thickness-instrument-recognition-q01','mfg38-coating-thickness-instrument-recognition-q02'],None,False),
 (75,'thickness','非破壊','063','section-3','非破壊という分類は試料への影響に関するもので、人体への無危険や操作許可とは別である。',[],None,False),
 (76,'inspection','塩水','023','section-1','中性塩水・酢酸酸性・キャスは異なる試験条件であり、試験名を省略して結果を比較しない。',[],None,False),
 (76,'inspection','条件','023','section-2','試験条件と合格要求は指定された版・仕様で確認し、教科書の例だけで実設備の条件を決めない。',[], '資料に示された温度・濃度・pHを一律の操作指示や現行規格の証明へ転用しない。',False),
 (81,'inspection','濡','055','section-2','はんだ濡れ性は表面への広がり等で確認する性質であり、見えた付着と適合判定を分ける。',['mfg38-solder-wetting-observation-q01','mfg38-solder-wetting-observation-q02','mfg38-solder-wetting-observation-q03'], '合成図での識別は実物試片や実際の試験装置の専門認証ではない。',False),
 (96,'jigs','治','026','section-1','治具は保持・搬送に加えて通電の経路にもなり、接触や劣化が膜厚・外観へ影響する。',['mfg37-required-jig-contact-identification-q01','mfg37-required-jig-contact-identification-q02'],None,False),
 (96,'jigs','材料','c004','section-3','治具の保持材・通電接点・保護被覆を分け、材料や薬液の変更時は適合を確認する。',['mfg37-required-jig-contact-identification-q03'], '図は概念模型であり、実設備の接点配置や薬液適合を保証しない。',False),
 (106,'chemistry','酸性','012','section-1','酸性酸化物と塩基性酸化物は反応相手を取り違えず、訂正後の内容で区別する。',[], '教科書記述の既知訂正を維持する。今回、公式正誤表の現行性を別途再確認したとは主張しない。',False),
 (108,'chemistry','規定','050','section-1','当量に基づく濃度の扱いには対象反応が必要で、モル濃度へ一律の割り算を当てはめない。',[], '元資料の本文と例の不整合を、そのまま正答にしない。',False),
 (114,'chemistry','イオン化','c008','section-1','イオン化傾向の並びは比較の手掛かりであり、表面皮膜や環境を除外した腐食保証にはならない。',['mfg37-required-metal-order-hydrogen-comparison-q03'],None,True),
 (114,'chemistry','金属','027','section-2','当該表には水素を含む15項目が示される。水素前後など相対位置を読み、架空の16番目を加えない。',['mfg37-required-metal-order-hydrogen-comparison-q01','mfg37-required-metal-order-hydrogen-comparison-q02'],'15項目は当該教材の範囲で、全元素の完全順位表を意味しない。',True),
 (118,'electrochemistry','カソード','005','section-1','一般的な直流めっきの品物側では金属イオンが電子を受け取って析出する。陽極酸化と役割を混同しない。',[],None,False),
 (118,'electrochemistry','電流','028','section-1','一定電流の電気量は電流と時間の積で考え、秒と分の混在を避ける。',[], '時間変動する電流に同じ定数式を無条件で適用しない。',False),
 (118,'electrochemistry','効率','028','section-2','副反応があるため目的の析出へ使われた割合を分け、効率を用いて理論量と実際量を区別する。',[], '電気化学当量・電流・時間・効率が不足した設問に架空の値を補わない。',False),
 (141,'taxonomy','分類','057','section-1','めっき・陽極酸化・化成処理・塗装は皮膜のつくり方と目的を区別して対応させる。',['mfg37-required-treatment-taxonomy-q01','mfg37-required-treatment-taxonomy-q02','mfg37-required-treatment-taxonomy-q03','mfg37-required-treatment-taxonomy-q04'], '代表膜厚や基材の表は適用例であり、全材質への万能な仕様ではない。',False),
 (147,'pretreatment','リン酸','c004','section-4','リン酸塩系には複数の系列があり、塗装下地・耐食・潤滑などの目的と処理体系を照合する。',[], '名称一覧から薬液処方や任意の代用条件を作らない。',False),
 (156,'pretreatment','脱脂','016','section-1','油分等を除く脱脂と、酸化皮膜等を整える活性化は防ぎたい不具合と管理対象が異なる。',[],None,False),
 (156,'pretreatment','酸洗','016','section-2','活性化には濃度・温度・時間や次工程までの状態管理があり、強い液へ長く入れるほどよいとはしない。',[],None,False),
 (156,'pretreatment','下地','058','section-2','必要に応じた薄い下地処理と主皮膜の形成は役割を分ける。名称から通電条件を作らない。',['mfg37-required-plating-process-sequence-q02'],None,False),
 (157,'electrochemistry','電流密度','006','section-1','電流密度は電流と対象面積の関係で考え、面積に含める面・側面・除外部と単位をそろえる。',[],None,False),
 (157,'pretreatment','水洗','016','section-2','工程間の水洗は前の液の持込みを抑える役割があり、乾燥と同じ工程として扱わない。',['mfg37-required-plating-process-sequence-q04'],None,False),
 (163,'pretreatment','基材','058','section-1','基材と表面状態の変更時には前処理の承認範囲を再確認し、同じめっき名だけで同じ工程を流用しない。',[],None,False),
 (176,'anodizing','アノード','069','section-1','陽極酸化では品物側のアルミニウムが酸化物へ変わり、一般的な陰極析出めっきと区別される。',[],None,True),
 (176,'anodizing','反応','c008','section-3','反応式は原子数と電荷を照合して電極ごとの役割を読む。抽出時に欠落した上付き・下付き文字で計算しない。',[], '文字抽出はAlの電荷や酸化物の添字を落とす場合がある。拡大した原図の式を参照して意味を確認する。',True),
 (179,'anodizing','工程','033','section-1','染色・封孔・乾燥は別の目的を持つ後処理で、要否と順序は要求性能と処理体系に従う。',[], '源資料の必須表現をすべての硬質皮膜へ拡張しない。',True),
 (179,'environment','水素','c007','section-3','工程で生じる気体とミストは危険の性質を分け、換気等の管理を工程に合わせて確認する。',[], '水素の危険とアルカリミストの有害性を同一視しない。原文の説明だけから危険を一つにまとめない。',True),
 (179,'anodizing','乾燥','033','section-2','乾燥温度は皮膜・染色・基材・仕様との関係で確認し、教科書例の温度を全製品の上限にしない。',[], '源資料の代表温度を普遍的な加熱上限として出題しない。',True),
 (182,'anodizing','硬質','069','section-3','硬質皮膜の温度・厚さ・封孔は要求性能との兼合いであり、すべて同じ条件とはしない。',[], '0℃以下・封孔なし等の教科書例を全工程へ一般化しない。',False),
 (197,'polishing','番手','034','section-2','粗研磨から仕上げへの粒子や工具の使い分けを学び、番手からRaを普遍的に換算しない。',['mfg38-buff-stage-surface-change-q2'],'表の範囲は目安であり、合格基準や固定の番手–Ra対応表として扱わない。',True),
 (197,'polishing','バフ','c005','section-4','前工程の傷を残したまま仕上げへ進む場合と、目的の表面へ整った場合を観察して区別する。',['mfg38-buff-stage-surface-change-q1'],None,True),
 (201,'polishing','鏡面','061','section-1','鏡面等の最終仕上げの前に粗い傷を減らす工程があり、前工程の残留傷を確認する。',[], '解説中心で文字の少ないページでも、工程順や材料知識は対象から除かない。元の解答文は再利用しない。',True),
 (204,'defects','スクラッチ','062','section-1','線状傷・光沢不足など見えた状態を分け、外観だけで原因を一つに断定しない。',['mfg38-surface-defect-observation-q2'], '合成模型での違いの識別と実写真による検査能力は別である。',True),
 (204,'defects','バフ止まり','062','section-2','バフ止まりは同じ部位に研磨が集中して生じる外観不良の名称であり、モーター停止の意味ではない。',['mfg38-surface-defect-observation-q3'],None,True),
]


def main():
    read = lambda p: json.loads(p.read_text())
    pages = read(OUT / 'page-index.json')
    candidates = read(OUT / 'object-candidates.json')['units']
    private = {p['physicalPage']: p for p in read(PRIVATE)['pages']}
    core = read(ROOT / 'src/data/manufacturing/surface.json')['lessons']
    supplement = read(ROOT / 'src/data/manufacturing/completion37/surface.json')['lessons']
    lessons = {l['id']: (l, 'src/data/manufacturing/surface.json') for l in core}
    lessons.update({l['id']: (l, 'src/data/manufacturing/completion37/surface.json') for l in supplement})
    questions = {}
    for name in ['measurement','materials','processes','finishing']:
        path = ROOT / f'src/data/manufacturing/recognition38/{name}.json'
        for pack in read(path)['packs']:
            for q in pack['questions']:
                questions[q['id']] = (q, str(path.relative_to(ROOT)), pack['id'])
    asset_receipt_path = OUT.parent / 'asset-revision-applied.json'
    asset_receipt = read(asset_receipt_path) if asset_receipt_path.exists() else None
    asset_questions = {q['id']: q for q in asset_receipt['questions']} if asset_receipt else {}
    units, counters = [], Counter()
    for page, topic, needle, suffix, paragraph_id, summary, qids, qualification, visual in SEEDS:
        counters[page] += 1
        uid = f'mfg39-surface-p{page:03d}-u{900+counters[page]:03d}'
        lesson_id = 'mfg1-surface-' + ('completion37-lesson-' + suffix[1:] if suffix.startswith('c') else 'lesson-' + suffix)
        lesson, file = lessons[lesson_id]
        paragraph = next(x for x in lesson['paragraphs'] if x['id'] == paragraph_id)
        matching = [o for o in private[page]['objects'] if isinstance(o['value'], str) and needle in ''.join(o['value'].split()) and o['kind'] in ['paragraph_candidate','heading_candidate']]
        region_ids = [x['id'] for x in matching]
        bbox = None
        if matching:
            bbox = [min(x['bbox'][0] for x in matching), min(x['bbox'][1] for x in matching), max(x['bbox'][2] for x in matching), max(x['bbox'][3] for x in matching)]
        else:
            bbox = [0,0,pages['pages'][page-1]['pageWidthPt'],pages['pages'][page-1]['pageHeightPt']]
        term_bindings = [{'lessonId':lesson_id,'termIndex':i,'ja':t['ja'],'meaningSha256':hashlib.sha256(t['meaningJa'].encode()).hexdigest(),'status':'present_in_compared_lesson_not_all_locale_semantic_approval'} for i,t in enumerate(lesson['terms']) if t['ja'] in summary or t['ja'] in paragraph['textJa']]
        assessed = []
        for qid in qids:
            q, qfile, packid = questions[qid]
            binding = {'questionId':qid,'file':qfile,'packId':packid,'sourceHash':q.get('sourceHash'), 'status':'learning_goal_binding_compared_not_all_options_or_real_device_certification'}
            if qid in asset_questions:
                revision = asset_questions[qid]
                assert revision['authoredStemOptionsKeyAndReasonsUnchanged'] is True
                assert q['sourceHash'] == revision['newSourceHash']
                binding['assetRevisionMetadataRefresh'] = {'receipt':'docs/ssw-workspace/manufacturing/source-closure-20261031/asset-revision-applied.json','previousSourceHash':revision['oldSourceHash'],'refreshReason':'New PNG encoding from unchanged SVG changes image-bound question hash only; authored wording/options/key/reasons and semantic review scope unchanged.','semanticReviewExpanded':False}
            assessed.append(binding)
        units.append({'id':uid,'sourceId':'mfg1-surface-source','sourceSha256':SOURCE,'physicalPage':page,'kind':'bounded_reviewed_knowledge_unit','topic':topic,'bbox':bbox,
            'summaryJa':summary,'status':'ai_source_lesson_goal_compared_bounded','semanticReviewed':True,'wholeSourceObjectClosed':False,
            'evidence':{'sourcePageTextReadThisSession':True,'sourceRegionIds':region_ids,'locatorPrecision':'matched_extraction_region' if matching else 'page_only_no_precise_region_match',
                'visualEnlargementReadThisSession':visual,'sourceSha256Verified':True,'sourceTextRepublished':False},
            'lessonBindings':[{'lessonId':lesson_id,'file':file,'paragraphId':paragraph_id,'paragraphTextSha256':hashlib.sha256(paragraph['textJa'].encode()).hexdigest(),'status':'bounded_concept_semantically_compared','remainingGap':'Not a claim that every source detail is taught in this paragraph.'}],
            'termBindings':term_bindings,'assessmentBindings':assessed,'assessmentStatus':'bounded_goal_linked' if assessed else 'no_semantically_verified_question_bound_in_this_lane',
            'exclusionReason':None,'duplicateOf':None,'sourceQualification':qualification,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False})
    for unit in units:
        if unit['physicalPage'] == 179 and unit['topic'] == 'environment':
            unit['status'] = 'reviewed_gap_requires_external_qualification'
            unit['summaryJa'] = '水素ガスとアルカリミストの危険を区分する説明は、結び付けた現行段落だけでは確認できない。'
            unit['lessonBindings'][0]['status'] = 'related_environment_paragraph_only_not_full_concept_coverage'
            unit['lessonBindings'][0]['remainingGap'] = 'Add a source-qualified gas/mist hazard distinction after authoritative technical verification; no recipe or gas experiment.'
            unit['sourceQualification'] = '源資料の一括した有害性説明と、爆発・酸素欠乏・ミストばく露の区別を公的技術資料で確認する必要がある。'
    # Retain earlier page-level audit facets as historical evidence; do not
    # relabel them as newly closed atomic knowledge or assign invented bboxes.
    old = read(DOCS/'batch33-full-review/surface/page-ledger.json')
    inherited = []
    for page in old['pages']:
        if page['physicalPage'] <= 10 or page['physicalPage'] == 207:
            continue
        for i, facet in enumerate(page['facets'],1):
            inherited.append({'id':f"mfg39-surface-p{page['physicalPage']:03d}-prior-{i:03d}",'sourceId':'mfg1-surface-source','sourceSha256':SOURCE,
                'physicalPage':page['physicalPage'],'kind':'inherited_page_review_facet_not_atomic_closure','bbox':None,
                'bboxUnavailableReason':'Prior page-level semantic review did not record per-facet bounding boxes; current page regions are separately inventoried.',
                'summaryEn':facet,'status':'historical_review_facet_requires_atomized_mapping','semanticReviewedThisSession':False,
                'evidence':{'path':'docs/ssw-workspace/manufacturing/batch33-full-review/surface/page-ledger.json','physicalPage':page['physicalPage'],'historicalStatus':page['status']},
                'lessonBindings':[{'lessonId':x['id'],'sourceHash':x.get('sourceHash'),'status':'historical_page_binding_not_all_atom_proof'} for x in page.get('lessonBindings',[])],
                'termBindings':[],'assessmentBindings':[],'exclusionReason':'Do not reuse original source exercise wording/options/answers.' if 'exercise' in page.get('pageType','') else None,'duplicateOf':None,'wholeSourceObjectClosed':False})
    excluded = []
    for p in pages['pages']:
        if p['classification'] in ['cover','toc','colophon']:
            excluded.append({'sourceId':'mfg1-surface-source','physicalPage':p['physicalPage'],'reason':'Identification/contents/publication metadata, retained for provenance rather than a technical learning objective.','scope':'page_document_role_only','technicalKnowledgeExcluded':False})
    for p in old['pages']:
        if 'exercise' in p.get('pageType',''):
            excluded.append({'sourceId':'mfg1-surface-source','physicalPage':p['physicalPage'],'reason':'Original exercise expressions/options/solutions are not redistributed or imitated. Underlying knowledge remains in scope and needs independent teaching/assessment.','scope':'source_expression_only_not_underlying_knowledge','technicalKnowledgeExcluded':False})
    summary={'physicalPagesClassified':207,'sourcePdfSha256Verified':True,'currentSessionMachineCandidateRegions':len(candidates),
        'boundedUnitsSourceAndLessonCompared':len(units),'unitsWithComparedAssessmentGoals':sum(bool(x['assessmentBindings']) for x in units),
        'reviewedUnresolvedTeachingGaps':sum(x['status']=='reviewed_gap_requires_external_qualification' for x in units),
        'boundedUnitsWithSourceQualification':sum(bool(x['sourceQualification']) for x in units),
        'sourcePagesTextReadThisSession':sorted({s[0] for s in SEEDS}),
        'sourcePagesVisuallyEnlargedReadThisSession':[64,67,70,71,114,176,179,197,201,204],
        'inheritedPageReviewFacets':len(inherited),'wholePagesKnowledgeClosed':0,
        'candidateRegionsAreKnowledgeCount':False,'fullKnowledgeAtomizationComplete':False,'wholeCurriculumComplete':False,'releaseReady':False}
    (OUT/'knowledge-units.json').write_text(json.dumps({'schemaVersion':1,'date':'2026-10-31','units':units,'summary':summary},ensure_ascii=False,indent=2)+'\n')
    (OUT/'prior-facets-and-exclusions.json').write_text(json.dumps({'schemaVersion':1,'date':'2026-10-31','inheritedReviewFacets':inherited,'exclusions':excluded,'allExclusionsRetainUnderlyingTechnicalKnowledge':True},ensure_ascii=False,indent=2)+'\n')
    (OUT/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(summary,ensure_ascii=False))


if __name__=='__main__':
    main()
