exec((__import__('pathlib').Path(__file__).parent/'extend-assessment.py').read_text())
add('receipt-fine-checks',5,'棚卸し前の区分と検収の細目','返品予定品は納入業者ごとにまとめ、メモや箱への表示で誰でも区別できるようにする。サンプルや不良品も通常の使用可能在庫へ混ぜず、空箱を除き、計量用具を先に用意する。検収では発注書を基準に、納品書の形式、品名・単価・単位・計算を確かめる。現物は、合意したメーカーや産地、サイズ、格付け、入り数、鮮度・熟成、標準歩留まり、破損や温度変化の跡と指定日時を照合する。基準外の物は使用せず担当と業者へ確認する。常温・冷蔵・冷凍等の所定場所へ先入れ先出しで収納し、常温品以外への当日の日付や曜日表示は店の期限管理と合わせて実施する。',[29,30,32],[18,19,20])
for n in [29,30,32]:
 f=next(x for x in p['facts'] if uid(n) in x['unitIds']);f['additionIds'].append('rst31-operations2-receipt-fine-checks');f['decision']='covered_after_additions';p['additions'][-1]['factIds'].append(f['id']);next(x for x in p['units'] if x['unitId']==uid(n))['decision']='covered_after_additions'
a=next(a for a in p['additions'] if a['id']=='rst31-operations2-after-evacuation');a['textJa']=a['textJa'].replace('火災を周囲に知らせ、','119番では火事であること、消防車が向かう住所・店名・目印や状況を、指令員の質問に沿って落ち着いて伝える。火災を周囲に知らせ、');a['primarySourceIds'].append('119')
f=next(x for x in p['facts'] if uid(121) in x['unitIds']);f['additionIds'].append(a['id']);f['decision']='covered_after_additions';a['factIds'].append(f['id']);next(x for x in p['units'] if x['unitId']==uid(121))['decision']='covered_after_additions'
# Exact qualifications split into atomic records rather than one blanket table approval.
for statement,lesson,anchor,pages,units in [
 ('週44時間の対象でも一日8時間が自動的に延びるわけではない。',11,'mistakes',[22],[49,50]),
 ('通常の時間外上限は月45時間・年360時間。一年単位変形の一部等は別の限度を確認する。',13,'knowledge',[22],[49]),
 ('特別条項でも一般に年720時間以内、時間外と休日合計単月100時間未満、各2～6か月平均80時間以内、45時間超は年6か月まで。',13,'procedure',[22],[49]),
 ('法定時間外等の必要な36協定と届出は割増賃金の支払いで代替できない。',13,'knowledge',[22],[49]),
 ('週30時間以上又は週5日以上、年217日以上などは一般年休表の対象条件を確認する。',14,'mistakes',[22,23],[51]),
 ('Qの提供時間例は昼6～8分・夜12分・居酒屋等最初の一皿5分で、全店義務や安全条件ではない。',1,'qsc-complete-behavior-groups',[6],[5,'ref01']),
 ('人時売上高5000円、人時生産性4000円、月間一人粗利益70万円、労働分配率35～40％は資料参考説明で、法定賃金や全店合格線ではない。',17,'mistakes',[31],['ref05']),
 ('労働分配率45％・50％の評価を費用範囲や業態を無視して共通判定にしない。',17,'management-terms-and-trainee-roles',[31],['ref05'])]:extraFact(units,statement,lesson,anchor,pages)
qsc=read(ROOT/'src/data/restaurant/qsc-guide.json')
for group in qsc['groups']:
 for key in group['items']:
  statement=qsc['labels'][key]['ja'];fid=f'rst31-operations2-f{len(p["facts"])+1:03}';p['facts'].append(dict(id=fid,unitIds=[uid(5),uid('ref01')],statementJa=statement,sourceRefs=refs([6],'QSC '+group['id']),existingEvidence=[dict(kind='native_guide_label',lessonId='rst-2-ops-01',path='src/data/restaurant/qsc-guide.json',field='/labels/'+key+'/ja',textJa=statement,textSha256=sha(statement),reason='Exact behavioral group read in original PDF6 table, current guide label and lesson qsc-complete-behavior-groups.')],additionIds=[],questionIds=[],visualEvidence=[dict(kind='native_checklist',path='src/components/restaurant/RestaurantQscGuide.tsx',browserVerified=False)],decision='covered_existing'))
# Source glossary atomic definitions, not translations or spellings-only coverage.
for statement,lesson,anchor in [
 ('OJTは現場で技能を体得し、原則一対一で指導する。',9,'procedure'),('OFFJTは現場を離れ理念知識を学ぶ集合教育で、OJTと組む。',9,'knowledge'),('オペレーションは自社QSCを維持実現する店舗作業全体。',17,'management-terms-and-trainee-roles'),('客単価は一人当たり平均売上で、時間帯や一日等の集計範囲を確認する。',2,'knowledge'),('QSCは商品の品質、サービス、清潔を組み合わせる。',1,'qsc-complete-behavior-groups'),('経営理念は社会への貢献と経営目的、商品や人の判断の方向になる。',17,'procedure'),('原価率は売上に対する原価の割合。',3,'knowledge'),('人事考課は成果・能力・勤務行動の具体的事実で評価し配置訓練へ使う。',1,'mistakes'),('スタンダードは自社QSC等の具体的な基準で現場へ実現する。',1,'roles-and-qsc-checks'),('トレーナーは対象技能を教える担当、トレーニーは習得する側。',17,'management-terms-and-trainee-roles'),('トレーニングプログラムは必要技能と目標、道具、確認方法を組む教育訓練計画。',17,'procedure'),('人時売上高と人時生産性は、売上か粗利益か分子を区別する。',17,'knowledge'),('人時接客数は客数を総労働時間で割る。',2,'knowledge'),('管理サイクルは計画・実施・評価・修正を次の計画へ戻す。',17,'scenario'),('予算制度では年計画から各月の粗利益と管理可能費を計画する。',17,'procedure'),('労働生産性は一人当たり粗利益で、人時当たり指標と単位をそろえる。',17,'knowledge'),('労働分配率の分母は粗利益。',17,'knowledge'),('ワークスケジュールは個人別・時間帯別の作業割当てで、訓練も組み込む。',17,'procedure')]:extraFact(['ref05'],statement,lesson,anchor,[30,31])
# Current primary legal/notification sources are supplementary safeguards, not copied PDF text.
for k,url,title,finding in [
 ('119','https://www.fdma.go.jp/mission/enrichment/kyukyumusen_kinkyutuhou/119.html','消防庁119番緊急通報','Location/address and landmark when address unknown; follow dispatcher.'),
 ('working-time','https://www.check-roudou.mhlw.go.jp/parttime/','厚生労働省 アルバイト前のポイント','Daily8 weekly40; covered small establishments fewer10 workers weekly44.'),
 ('premiums','https://www.mhlw.go.jp/content/000930914.pdf','厚生労働省 月60時間超割増資料','60h overtime50%, night addition25%=75%; statutory holiday excluded from60h count; SME transition ended2023-04.'),
 ('overtime','https://hatarakikatakaikaku.mhlw.go.jp/overtime.html','厚生労働省 時間外上限規制','45/360 ordinary, 720 annual and100exclusive/80average special limits; annual6months rule.')]:p['primarySourceVerification'].append(dict(id=k,url=url,title=title,checkedAt='2026-10-31',finding=finding))
for f in p['facts']:
 if uid(49) in f['unitIds']:f['primarySourceIds']=['working-time','premiums','overtime']
 if uid(50) in f['unitIds']:f['primarySourceIds']=['working-time']
 if uid(51) in f['unitIds'] or uid(52) in f['unitIds']:f['primarySourceIds']=['annual-leave']
for q in p['questions']:
 q['primarySourceIds']=sorted({pid for a in p['additions'] if any(n in a['unitIds'] for n in q['unitIds']) for pid in a.get('primarySourceIds',[])})
# Ensure all current fact links are reciprocal on unit and supplement rows.
for u in p['units']:
 own=[f for f in p['facts'] if u['unitId'] in f['unitIds']]
 if u['decision']=='structural_aggregate':own=[f for f in p['facts'] if any(c in f['unitIds'] for c in u['childUnitIds'])]
 u['factIds']=[f['id'] for f in own];u['questionIds']=sorted({q for f in own for q in f['questionIds']})
 u['assessmentStatus']='assessed_existing_or_new' if u['questionIds'] else 'reference_application_exempt';
 if u['assessmentStatus']=='reference_application_exempt':u['assessmentExemptionReason']='QSC source reference is an application checklist; exact15 child behavioral facts and current native guide are provided, while k005 links general QSC standard competency assessment. Not separately certified per checklist item.'
for a in p['additions']:a['factIds']=[f['id'] for f in p['facts'] if a['id'] in f['additionIds']]
# Disposition statements are authored; native/expert certainty remains false.
p['reviewMethod']='All33 source page texts read; all rendered pages visually inspected in contact sheets, detailed separate images for6/11/18/25/28/29. All17 current operations lessons, all136 operations questions, current QSC/ordering/ratio native data/components read. Full contextual original source examples are not republished.'
p['jaFreeze']=dict(status='frozen_for_parent_translation_assignment',additions=len(p['additions']),questions=len(p['questions']),figures=len(p['figures']))
p['jaFreeze']['sha256']=sha(json.dumps({k:p[k] for k in ['additions','questions','figures']},ensure_ascii=False,sort_keys=True,separators=(',',':')))
(OUT/'packet.json').write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')
print('FROZEN',len(p['facts']),'facts',len(p['additions']),'additions',len(p['questions']),'questions',len(p['figures']),'figures',p['jaFreeze']['sha256'])
