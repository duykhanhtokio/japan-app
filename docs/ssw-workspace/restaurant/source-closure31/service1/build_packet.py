import pathlib,json,hashlib,collections
R=pathlib.Path(__file__).resolve().parents[5]
O=pathlib.Path(__file__).resolve().parent
# Repository root derived explicitly to avoid ambient cwd differences.
R=pathlib.Path('/workspace/scratch/8c34e3cace7a/japan-app')
J=lambda p:json.loads((R/p).read_text())
H=lambda b:hashlib.sha256(b).hexdigest()
lessons={x['id']:x for x in J('src/data/restaurant/lessons.1.ja.json')['lessons']}
questions={q['id']:q for e in J('src/data/restaurant/exams.1.ja.json')['exams'] for q in e['questions']}
ledger=[u for u in J('docs/ssw-workspace/restaurant/knowledge-ledger.json')['units'] if u['id'].startswith('rst-1-service-')]
facts=[];additions=[];newq=[];figures=[]
def ref(page,section):return [{'documentId':'rst-1-service','pdfPages':[page] if isinstance(page,int) else page,'section':section}]
def F(tag,k,page,l,pid,statements,qids=None,visual=None,excluded=None):
 for i,s in enumerate(statements.split('；'),1):
  fid='rst31-service1-'+tag+(f'-{i:02}' if '；' in statements else '')
  ev=[];additionids=[]
  if pid and not pid.startswith('@'):
   para=next(x for x in lessons[f'rst-1-svc-{l:02}']['paragraphs'] if x['id']==pid)
   ev=[{'kind':'lesson_paragraph','lessonId':f'rst-1-svc-{l:02}','paragraphId':pid,'questionId':None,'path':'src/data/restaurant/lessons.1.ja.json','field':f"lessons[id=rst-1-svc-{l:02}].paragraphs[id={pid}].textJa",'sha256':H(para['textJa'].encode()),'reason':'本文の具体的な説明と照合した。対応する意味：'+s}]
  elif pid and pid.startswith('@'):additionids=[f'rst31-service1-a{int(pid[1:]):03}']
  qq=[]
  for q in (qids or []):
   qid=f'rst-1-q{q:03}';assert qid in questions
   qq.append(qid)
   ev.append({'kind':'assessment','lessonId':f'rst-1-svc-{l:02}','paragraphId':None,'questionId':qid,'path':'src/data/restaurant/exams.1.ja.json','field':f'exams[].questions[id={qid}]','reason':'設問と四択を読んで、この事実・条件の識別を確認した。','sha256':H(json.dumps(questions[qid],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())})
  facts.append({'id':fid,'unitIds':[f'rst-1-service-k{k:03}'] if isinstance(k,int) else [k],'statementJa':s,'sourceRefs':ref(page,tag),'existingEvidence':ev,'additionIds':additionids,'questionIds':qq,'visualEvidence':visual or [],'decision':'reference_excluded' if excluded else 'covered_after_additions' if additionids else 'covered_existing','exclusionReason':excluded})
 return [f['id'] for f in facts if f['id'].startswith('rst31-service1-'+tag)]
# Manual fact boundary and exact paragraph comparisons; never source-range/topic auto-coverage.
F('hospitality',3,5,1,'hospitality-practice','おもてなしは相手を大切にする姿勢を清潔・親切・礼儀ある行動へ表すこと；心を伝える基本動作を覚え、繰り返し練習して表せるようにする')
F('expectations',4,6,1,'@1','利用前の期待は過去の経験・知識・店の印象・価格から影響を受ける；体験が期待を上回る・同程度・下回る場合を、それぞれ満足・普通・不満として比較する')
F('repeat-guest',4,6,1,None,'同じ店へ繰り返し来る人をリピーターと呼ぶ')
# Glossary is exact definition evidence, separately bound below.
F('value-price',5,7,1,'@1','価格に対して得た価値が見合うかが満足に関係する')
F('qsca-quality',5,7,1,'knowledge','料理の品質では味・分量・盛付け・温度・提供の速さを合わせて見る',[23,126])
F('qsca-four',5,7,1,'knowledge','QSCAは料理の品質・接客サービス・清潔感・雰囲気の四つを示す',[123,129])
F('qsca-freshness',5,7,1,'@1','料理のおいしさには味だけでなく素材の鮮度と見た目も関係する')
F('qsca-service',5,7,1,'hospitality-practice','店で定めた接客方法を学び、実際の動作として行う')
F('qsca-clean',5,7,1,'procedure','店内の清掃・整理整頓・従業員の身だしなみを点検する')
F('qsca-atmosphere',5,8,1,'@1','外観・設備・室内の様子は雰囲気の物的な側面である；料理・接客・従業員の態度も雰囲気を形づくる；室温、時間帯に合う照明や音楽は快適さに関係する')
F('greeting',7,9,2,'knowledge','あいさつは相手との応対を始める行為である',[57])
F('greet-first',7,9,2,'@2','相手の様子に合わせ、こちらから先にあいさつする')
F('smile',7,9,2,'expression-posture-bow','笑顔はやさしい目線・口の両端・相手を思う気持ちを合わせて練習する')
F('hair',8,10,2,'appearance-check-detail','長い髪はまとめ、前髪を顔にかからないようにする')
F('dandruff',8,10,2,'appearance-final-points','フケへの注意と、身だしなみ例としての毎日のひげそり・歯みがきを点検する')
F('face',8,10,2,'appearance-check-detail','口臭や強い香水に注意し、化粧は控えめにする例を店の規定と照合する',[363])
F('nails',8,10,2,'appearance-check-detail','指先と爪の間を清潔にし、着色や装飾の異物混入に注意する')
F('short-nails',8,10,2,'appearance-final-points','爪を短く切った状態を始業時に確かめる')
F('accessories',8,10,2,'appearance-final-points','装飾品や派手な時計を避ける教材例を店の規定と照合する')
F('uniform',8,10,2,'appearance-check-detail','清潔な制服を正しく着てボタンを留める')
F('creases',8,10,2,'appearance-final-points','制服の汚れだけでなくしわも点検する')
F('shoes',8,10,2,'appearance-check-detail','かかとを踏まず、教材例ではサンダルを使わない')
F('standing',9,10,2,'expression-posture-bow','背筋とひざを伸ばし手を前で組む；客席に目を配り、じろじろ見つめ続けない',[132])
F('no-lean',9,10,2,'mistakes','壁にもたれたり腕を組んだりせずに応対する')
F('passage',9,10,2,'procedure','急ぐ時も通路で客へ譲り、トレイがぶつからない距離を保つ',[5])
F('bow-angles',10,11,2,'knowledge','会釈・敬礼・最敬礼の目安は順に約15度・30度・45度である',[135,138,141])
F('bow-gaze',10,11,2,'expression-posture-bow','教材の会釈・敬礼・最敬礼の視線例は順に約2m先・1m先・足元である')
F('bow-purpose',10,11,2,'expression-posture-bow','会釈はすれ違い、敬礼は歓迎や感謝、最敬礼は見送りやお詫びなどの例がある')
F('bow-movement',10,11,2,'expression-posture-bow','止まってかかとをそろえ、あごを引き肩を水平にして上体を倒す；首だけを曲げず背筋を保ち、一呼吸止めてゆっくり戻り目線を合わせる',[120,144])
F('tray-support',11,12,3,'tray-loading-sequence','利き手と反対の手で中心を支え、指を広げひじを直角に曲げる',[147])
F('tray-load',11,12,3,'tray-loading-sequence','重い物を手前から載せ、手先側から下ろす；背の高い物や不安定な物を手先側へ載せない',[102])
F('tray-near-guest',11,12,3,'procedure','客の近くでトレイを当てず安全な位置から静かに置く')
F('empty-tray',11,12,3,'tray-loading-sequence','空のトレイは利き手と反対の側で押さえ脇に抱える',[150])
F('glass-grip',11,12,3,'tray-loading-sequence','グラスは下半分を持ち、飲み口へ指を触れない',[47])
F('glass-place',11,12,3,'procedure','グラスや皿は音を立てず静かに置く')
F('plate-grip',11,12,3,'tray-loading-sequence','親指を外向きに縁へ添え、他の指で皿の底を支える')
F('plate-direction',11,12,3,'knowledge','料理の正面を客へ向ける',[153])
F('manners-context',13,13,4,'mistakes','食事の作法は地域や文化で違い、客の希望も確かめる')
F('chopsticks',13,13,4,'chopstick-seating-context','右利きの教材例は左手で中央を持ち上げ右手を下から添える；下の箸を保ち、上の箸を動かす')
F('meal-definition',13,13,4,None,'一汁三菜はごはん・汁物一品・おかず三品を組み合わせる基本構成である')
F('meal-placement',13,13,4,None,'客から見て飯は左、汁は右に置く；主菜は奥右、副菜は奥左、酢の物や和え物は中央に置く例がある；香の物は飯と汁の間に置く例がある',[9,156])
F('kaiseki',13,14,4,'knowledge','教材の会席の提供例は前菜、吸い物、お造り、煮物や焼き物、揚げ物、酢の物、ごはん、水菓子の順である',[162])
F('seating',13,14,4,'@3','上座は心地よく安全に過ごせる側、下座は迎える側などが座る位置として学ぶ；入口と床の間を手がかりに席を考え、客の希望や移動の条件を優先して確認する',[159])
F('tokonoma',13,14,4,'chopstick-seating-context','床の間は掛け軸などを飾る場所で、入口から遠いことが多い')
F('small-bowls',13,14,4,'chopstick-seating-context','茶碗・椀・小皿を手に持つ例、大皿から小皿へ取り分ける例を学ぶ',[165])
F('cutlery-place',14,15,5,'knowledge','ナイフは右で刃を内側に、フォークは左に置く；複数の道具は使用順に外側から内側へ配置する',[168,171])
F('spoon-place',14,15,5,'western-setting-progress','スープスプーンはナイフの右に置く例がある',[174])
F('cutlery-signal',14,15,5,'western-setting-progress','8時20分の形は食事中、斜めにそろえた形は終了の目安で、下膳前には本人へ確認する',[117])
F('dropped-tool',14,15,5,'procedure','道具を落とした客へ清潔な代わりを渡し、拾わせない',[78])
F('western-names',14,15,5,'western-setting-progress','シルバーはナイフなど、カスターセットは調味料の組、ゴブレットは水用グラスの例である',[180])
F('western-service-side',14,15,5,'western-setting-progress','教材では料理は左、飲み物は右からの例を示すが、自店の方式と席の条件で確認する')
F('western-eating',14,15,5,'@4','教材の食べ方例では一部のデザートを除き左から食べ、残したものを皿の手前へまとめる')
F('napkin',14,15,5,'western-setting-progress','ナプキンの折り目は手前にする；離席中は椅子、終了時は卓の左へ軽く畳む例がある',[177])
F('french-course',14,16,5,'western-setting-progress','教材の順序例は前菜・スープ・魚・肉・デザート・デミコーヒーである')
F('round-seats',15,16,6,'round-table-context','入口から遠い側を上座、近い側を下座とする例を希望と照合する',[186])
F('round-new-plate',15,16,6,'knowledge','味が混ざらないよう取り皿を料理ごとに替える',[183])
F('round-motion',15,16,6,'round-table-context','座ったまま料理を取り、器は卓に置いて食べる；回転卓は時計回りの例で、他の人が取っていないか確認して動かす',[189])
F('round-personal',15,16,6,'procedure','個人の箸やグラスを回転卓へ載せない',[112,192])
F('round-serving-self',15,16,6,'round-table-context','自分の希望量を取り、残す習慣を客へ一律に押しつけない')
F('round-leftovers',15,16,6,'round-table-context','大皿に1/3〜1/4残す記述は習慣の一例で、すべての客の義務ではない')
F('care-consent',17,17,7,'knowledge','必要な支援は人ごとに違うため、外見で決めず本人へ尋ねる',[12])
F('children',17,17,7,'care-seating-payment','子どもの急な動きを考え保護者と席を相談し、通路や周囲の客の安全を確かめる',[107,207])
F('elderly',18,17,7,'care-seating-payment','退店時に忘れ物を確認し、会計は相手が確かめられる速さと声で伝える')
F('large-menu',18,17,7,'procedure','必要に応じて大きい文字のメニューを用意する',[66])
F('wheelchair-types',19,17,7,'@5','介助用車椅子は主に介助者が操作し、自走式は本人が車輪を操作する；種類だけで介助の要否を決めず本人の希望と段差・通路などを確認する')
F('wheelchair-seat',19,17,7,'@5','テーブルの高さが合えば車椅子のまま利用できる席へ案内する')
F('wheelchair-eye',19,17,7,'care-seating-payment','相手の表情が見える目の高さで話す',[195])
F('assist-dog-types',20,18,7,'supportMarks','補助犬には盲導犬・介助犬・聴導犬の三種類がある',[198])
F('assist-dog-acceptance',20,18,7,'mistakes','補助犬を普通のペットと一律に扱って断らず、受入れに対応する',[39])
F('assist-dog-identification',20,18,7,'@6','盲導犬のハーネス、介助犬や聴導犬の表示は確認の手がかりになる；確認が必要な時は使用者へ認定証等を丁寧に確認する')
F('assist-dog-no-distraction',20,18,7,'supportMarks','仕事中の補助犬へ食べ物を与えたり注意をそらしたりしない',[201])
F('marks',21,18,7,'@7','補助犬マークは身体障害者補助犬法の理解を広めるためのマークである；耳マークは聞こえにくさへの配慮や対応を示す；オストメイトマークは人工肛門・人工膀胱を使用する人や対応設備に関係する；ハート・プラスマークは外から分かりにくい身体内部の障害を示す；ヘルプマークは外から分からなくても援助・配慮が必要なことを知らせる；マタニティマークは妊産婦への配慮につなげる')
F('prompt-service',23,19,8,'knowledge','完成後も時間と温度が品質と衛生へ影響するため、適切な状態で速やかに提供する',[126])
F('two-hour-limit',23,19,8,'mistakes','教材の二時間という目安だけで全食品の安全を保証しない',[216])
F('leftover-policy',24,19,8,'procedure','食べ残しの持ち帰りは店の方針・保存・期限を確認して案内する',[55,213])
F('leftover-refusal',24,19,8,'scenario','衛生上対応できない時は理由を説明し、自己判断で渡さない')
F('takeout-definition',25,19,8,'knowledge','テイクアウトは店で調理した料理を店外へ持ち帰る提供形式である')
F('takeout-conditions',25,19,8,'@8','教材の10℃以下の冷却管理は一例であり、料理ごとに確認する；温度・保存方法・食べる期限を正確に伝え、客が実行できるようにする',[85,210])
F('greeting-phrases',27,20,9,'phrase-purpose-payment','入店にはいらっしゃいませ、感謝にはありがとうございますを使う；待たせた後はお待たせいたしましたを使う；依頼を受ける時はかしこまりました、お詫びには申し訳ございませんを使う；恐れ入りますは感謝やお詫び、頼みにくい用件への配慮を表す',[11,219])
F('excuse-approach-leave',27,20,9,'@9','客の席へ近づく時も離れる時も、失礼いたしますなどと声をかける')
F('phrase-errors',28,20,9,'mistakes','現在の注文確認に不要な過去形やのほうを重ねず簡潔に伝える',[222])
F('receipt-language',28,20,9,'mistakes','レシートを渡す時はレシートでございますと伝える')
F('cash-language',28,20,9,'phrase-purpose-payment','受領額に不要なからを付けず金額を伝える',[225])
F('respectful-address',29,[20,21],9,'respectful-address-objects','お客様・お子様・ご一緒の方・お一人様など対象に合う丁寧な呼び方を学ぶ；店側をわたくし・わたくしども、衣服をお召し物、靴をお履物と呼ぶ例がある')
F('polite-questions',29,21,9,'questions-confirmation-language','人数・席・商品・数量など確認する対象に応じた尋ね方を使う；アイコなど店内の略語を出さずアイスコーヒーと客へ伝える',[228])
F('affirmation',29,21,9,'questions-confirmation-language','さようでございますは肯定、かしこまりましたは依頼を受ける返事として使い分ける')
F('knowing-permission',29,21,9,'@9','知っていることを丁寧に伝える表現と、了承を得た行動を伝える表現を使い分ける')
F('unknown-unavailable',29,21,10,'uncertainty-handoff-language','不明なことは確認へつなぎ、品切れ・不在は事実と次の対応を伝える',[231])
F('suggestion',30,22,9,'procedure','商品を理解してから客の希望に合う料理を提案する',[234])
F('suggestion-benefits',30,22,9,'phrase-purpose-payment','提案は追加注文や満足につながることがあるが、断る自由を尊重する')
F('phone-nonvisual',31,22,10,'knowledge','電話では表情が見えないため、声・聞き返し・記録で正確に伝える',[53,90])
F('phone-opening',31,22,10,'telephone-opening-ending','呼出しが三回以上の時は待たせたことへのお詫びを添え、店名と名前を伝える例がある',[240])
F('phone-listen',31,22,10,'@10','相づちを打ちながら聞き、質問や取次ぎの前に相手へ説明する',[237])
F('phone-end',31,22,10,'telephone-opening-ending','相手が切ったのを確かめて静かに終話する',[246])
F('phone-callback',31,22,10,'telephone-opening-ending','即答できない時は理由・連絡先・用件を記録して責任者や担当者へ引き継ぐ',[243])
F('food-allergy',34,24,11,'knowledge','食物アレルギーは発しん・吐き気だけでなく呼吸や意識の異常など生命に関わる症状になり得る',[258])
F('allergy-materials',35,24,11,'procedure','最新の原材料と調理工程を確認し、分からなければ責任者へつなぐ',[37,106,249,252,255])
F('allergy-label-scope',35,24,11,'@11','容器包装された加工食品のアレルゲン表示制度と、外食料理の情報提供は区別する；2026年4月1日にカシューナッツが特定原材料へ加わり九品目となった；カシューナッツには2028年3月31日まで経過措置があり、表示が見当たらないだけで不使用と判断しない')
F('allergy-nine',35,24,11,'@11','九品目はえび・かに・くるみ・小麦・そば・卵・乳・落花生・カシューナッツである')
F('fermentation',37,25,12,'beverage-process-materials','醸造酒は酵母による発酵で造る；蒸留酒は発酵後にさらに蒸留して造る',[261,264])
F('wine-family',37,25,12,'beverage-process-materials','ワインはぶどうが原料例で、赤・白・発泡性などがある')
F('beer-family',37,25,12,'beverage-process-materials','ビールの原料例は麦などである',[267])
F('fruit-family',37,25,12,'beverage-subtype-families','果実酒はりんごやももなどを原料とし、シードルはりんごの例である')
F('sake-family',37,25,12,'beverage-process-materials','日本酒の原料例は米で、清酒・にごり酒などがある',[270])
F('laojiu-family',37,25,12,'beverage-subtype-families','老酒の例に紹興酒があり、米などを原料とする')
F('brandy-family',37,25,12,'beverage-subtype-families','ブランデーの例にコニャックがある')
F('brandy-grape',37,25,12,'beverage-process-materials','ブランデーの原料例はぶどうである')
F('whisky-family',37,25,12,'beverage-subtype-families','ウイスキーにはモルト・ブレンデッドなどの名称がある')
F('gin-family',37,25,12,'beverage-subtype-families','ジンにはジェネヴァ・ロンドンジンなどの名称がある')
F('grain-spirits',37,25,12,'beverage-process-materials','ウイスキーやジンの原料例は麦などである')
F('shochu-family',37,25,12,'beverage-process-materials','焼酎は芋・麦などの原料例があり名称と商品表示を照合する')
F('age-check',38,25,12,'procedure','20歳未満の人には酒類を提供せず必要な年齢確認を行う',[276])
F('adulthood',38,25,12,'mistakes','民法の成年と酒類の20歳という年齢条件を混同しない')
F('driver',38,[25,26],12,'procedure','車や自転車を運転する予定を確認し、運転者へ酒を提供しない',[56,273])
F('keeper',38,26,12,None,'ハンドルキーパーは酒を飲まず同席者を車で送る人である',[279])
F('nutrition-three',39,26,13,'knowledge','三大栄養素はたんぱく質・脂質・炭水化物である；ビタミン・ミネラルを加えて五大栄養素とする',[285])
F('protein',39,26,13,'nutrient-food-examples','たんぱく質は体の構成に関わり、肉・魚・卵・大豆製品が食品例である',[19])
F('fat',39,26,13,'nutrient-food-examples','脂質はエネルギー源で、バター・マーガリン・植物油・肉の脂が食品例である',[282])
F('carbohydrate',39,26,13,'nutrient-food-examples','炭水化物はエネルギー源で、ごはん・パン・麺・いもが食品例である')
F('vitamin',39,26,13,'nutrient-food-examples','ビタミンは体の調子に関係し、緑黄色野菜・果物・レバーが食品例である')
F('mineral',39,26,13,'nutrient-food-examples','ミネラルは骨・歯や体の調子に関わり、わかめ・牛乳・乳製品が食品例である',[297])
F('nutrition-balance',39,26,13,'@12','特定の栄養素だけに偏らず、毎日の食事で五大栄養素をバランスよく組み合わせる')
F('taste-variable',40,27,13,'taste-food-comparison','味の感じ方は人や体調で異なる',[294])
F('sweet',40,27,13,'taste-food-comparison','甘味の例は砂糖・チョコレート・ケーキ・まんじゅうである')
F('salty',40,27,13,'taste-food-comparison','塩味の例は塩・しょうゆ・みそである')
F('sour',40,27,13,'taste-food-comparison','酸味の例は酢・梅干し・レモン・グレープフルーツである',[291])
F('bitter',40,27,13,'taste-food-comparison','苦味の例はコーヒー・ビール・パセリ・ピーマンである')
F('umami',40,27,13,'taste-food-comparison','うま味の例はこんぶだし・かつおぶしである',[60,288])
F('halal',42,27,14,'knowledge','ハラールはイスラム法で許されることを示す',[303])
F('haram',42,27,14,None,'ハラームはイスラム法で許されないことを示す')
F('vegetarian',43,27,14,'vegetarian-vegan-contrast','一般にベジタリアンは肉や魚を避け、ヴィーガンは卵・乳製品などの動物性食品も避ける',[300])
F('diet-needs',43,27,14,'procedure','呼び名だけで決めず、本人の条件と原料・だし・調味料・器具を照合する',[48,98,306,309])
F('open-clean',46,29,15,'procedure','入口・客席・トイレなどの清掃状態を開店前に点検する')
F('open-stock',46,29,15,'opening-closing-stock','トイレットペーパー・伝票・食器・グラス・氷・調味料の実物と必要量を確認する；物の置き場所と机・椅子の配置を確認する',[312])
F('open-reservations',46,29,15,'opening-closing-stock','予約の料理は厨房と、席は客席担当と照合する',[17])
F('open-cash-staff',46,29,15,'opening-closing-stock','釣り銭と担当者の配置を確認する',[318])
F('closing-customer',47,29,15,'mistakes','閉店時刻を過ぎても客の食事を妨げる片付けをしない',[315])
F('closing-work',47,29,15,'opening-closing-stock','調味料容器の洗浄補充、机椅子の整列、清掃・精算・廃棄を行う')
F('clean-separation',49,30,16,'knowledge','清潔な場所と汚染した場所で清掃用具を分け交差汚染を防ぐ')
F('clean-chemical',49,30,16,'@13','強い洗剤も名称・用途・注意表示を確認し、自分の判断で混ぜたり濃くしたりしない')
F('clean-topdown',50,30,16,'procedure','ほこりが落ちる方向を考え高い所から低い所へ、床は後に清掃する',[321])
F('dry-dirt',50,30,16,'procedure','乾いたほこりは先に適した方法で取り除き、いきなり濡らして取りにくくしない',[324])
F('soak-example',50,30,16,'@13','教材の約40℃の湯と洗剤によるつけおきは汚れを緩める例で、実作業は材質と洗剤の指定条件を確認する',[327])
F('dirty-tools',50,30,16,'mistakes','汚れたダスターを使い続けず、汚れを広げないよう用具を清潔にする')
F('clean-schedule',51,31,16,'mistakes','見えにくい場所や空調フィルターも計画に含めて継続して清掃する',[330])
F('clean-guest-view',51,31,16,'procedure','清掃後はいろいろな客席に座った目線でも点検する',[105])
F('clean-maintenance',51,31,16,'mistakes','じゅうたんのほつれなどは報告して補修へつなげる',[333])
F('clean-staffspace',51,31,16,'knowledge','客用だけでなく従業員スペースも清潔な状態を保つ')
F('banknote-values',53,32,17,'knowledge','紙幣の額面には一万円・五千円・二千円・千円がある',[336])
F('coin-values',53,33,17,'knowledge','硬貨の額面は五百円・百円・五十円・十円・五円・一円である',[339])
F('currency-old',53,[32,33],17,'mistakes','古い教材の図だけを現在の全図柄と考えず、店の最新の案内で確認する')
F('credit',54,34,17,'cashless-mechanisms','クレジットは後払いという基本の仕組みである',[345])
F('debit',54,34,17,'cashless-mechanisms','デビットは利用額が銀行口座からすぐ引き落とされる',[342])
F('prepaid',54,34,17,'cashless-mechanisms','チャージ式電子マネーは事前に入れた残高を使う',[348])
F('qr-routes',54,34,17,'cashless-mechanisms','店が客のコードを読む方法と、客が店のコードを読む方法がある',[351])
F('cashless-contract',54,34,17,'knowledge','利用できる決済方法は契約と端末で異なるため確認する',[354])
F('complaint-small',57,36,18,'complaint-and-object-detail','小さな待ち時間や説明不足が重なって苦情になる場合がある')
F('complaint-listen',58,36,18,'knowledge','まず苦情を最後まで聞き、何が起きたか確認する',[68])
F('complaint-branches',58,36,18,'@14','自店のミスと確認した時はお詫びして責任者へ報告する；判断できない時は責任者を呼ぶことを客へ伝えて報告し、責任者が確認・判断する',[357])
F('complaint-change',58,36,18,'complaint-and-object-detail','解決が難しければ担当者・場所・話す時機の変更を検討し、必要に応じ退店時にもお詫びする')
F('foreign-definition',60,37,18,'complaint-and-object-detail','異物は本来その食品に入らないものである')
F('foreign-hard',60,37,18,'complaint-and-object-detail','硬い異物の例は石・金属片・ガラス片・プラスチック片である')
F('foreign-soft',60,37,18,'complaint-and-object-detail','軟らかい異物の例は虫・毛髪・ビニール片・紙片である')
F('foreign-harm',60,37,18,'knowledge','硬い異物による口のけがや、骨など食材の一部への申し出も軽視しない',[364])
F('foreign-action',61,37,18,'procedure','異物を確認し料理を下げ、現物を捨てず責任者・調理担当へ報告する',[33,360])
F('foreign-remedy',61,37,18,'procedure','作り直しは客の意向、料金や返金は責任者の権限を確認する',[361,367])
F('prevention-door',62,38,18,'prevention','ドアの開放とごみの放置を防ぐ')
F('prevention-insect',62,38,18,'@15','虫を見つけた時は食品へ影響しない店の方法で対応し、発生・侵入原因まで調べて再発を防ぐ',[373])
F('prevention-filter',62,38,18,'prevention','空調フィルターなどを定期清掃する')
F('prevention-office',62,38,18,'prevention','食品の近くでクリップ・ホッチキス・えんぴつを使わない',[370])
F('prevention-appearance',62,38,18,'prevention','身だしなみと備品の破損を確認して異物を防ぐ')
F('illness-cause',65,40,19,'knowledge','客の体調不良は原因を店員だけで診断せず、生命の危険を見逃さない',[67])
F('illness-rest',65,40,19,'@16','気分不良でも呼吸・意識などを確認し、本人が安全に休めるよう応援を求める')
F('vomit',65,40,19,'@16','吐物には感染性がある可能性があり、人を近づけず専用の保護具・用具で静かに処理し、処理後の手洗いも行う')
F('choking',65,40,19,'@17','咳が十分できる間は咳を続けてもらい、注意深く見守る；声が出ない・咳が弱いなど窒息が疑われたら、除去できるまで待たず119番通報と応援を依頼する')
F('emergency-call',65,40,19,'procedure','119番へ場所・症状・意識・呼吸を伝え、指令員の指示と受講した手順に従う',[379,385])
F('allergy-emergency',65,40,19,'scenario','呼吸の苦しさなど重いアレルギー反応が疑われたら原因調査を待たず応援と救急要請を優先し一人にしない',[382])
F('no-forced-water',65,40,19,'mistakes','意識や飲み込みに問題がある人へ無理に水・食べ物を与えない',[376])
F('disaster-self',67,41,20,'procedure','強い揺れの間はまず落下物から身を守り、周囲にも安全確保を呼びかける',[388])
F('earthquake-cover',67,41,20,'@18','丈夫なテーブルの下など、落ちる・倒れる・動く物から離れた場所で揺れが収まるまで身を守る')
F('quake-after',67,41,20,'procedure','揺れが収まって周囲と通路の安全を確認してから店の計画に従い誘導する',[400])
F('tsunami',67,41,20,'mistakes','津波の恐れがある地域では事前に高い避難先と経路を確認する',[391])
F('fire-alarm',68,42,20,'procedure','火災を周囲へ知らせ、通報・初期消火・避難誘導を役割分担する',[397])
F('fire-withdraw',68,42,20,'@18','火が天井へ届く・煙で視界が悪いなど危険が増したら初期消火を続けず避難を優先する')
F('fire-low',68,42,20,'@18','煙を避けるため低い姿勢で安全な経路へ誘導し、タオル等を探して避難を遅らせない')
F('fire-no-return',68,42,20,'mistakes','避難後に忘れ物のため戻らず、客も戻らないよう案内する',[394])
# Non-operational / superseded source propositions are retained with reasons.
F('source-cultural-generalization',3,5,1,None,'日本人全体や訪日客全体を一つの特性として述べる記述',excluded='文化的な一般化を個人の行動基準や試験知識にしない。職場で学ぶ清潔・親切・型の練習は別の事実として保持した。')
F('source-olympic',3,5,1,None,'東京五輪招致時のおもてなしという歴史的紹介',excluded='歴史上の背景で接客技能の必須条件ではない。ホスピタリティの行動上の意味は別に学ぶ。')
F('source-lady-first',14,15,5,None,'高級店で女性・年配者を先にするという教材例',excluded='特定様式の慣習例であり全客への強制規則にしない。店の方式・本人や同席者の希望を確認する。用語自体は既存の個別用語説明に残っている。')
F('source-prevalence',34,24,11,None,'人口1〜2％・乳幼児約10％という教材の有病率例',excluded='調査時点・母集団が確定しない数値で現在の有病率として出題しない。症状と情報照会は保持した。')
F('source-no-treatment',34,24,11,None,'食物アレルギーには有効な治療方法がないという教材の断定',excluded='医療の説明を現在の普遍的事実として転記しない。医師の判断による治療や経過管理があり、接客者は治療を指導せず原材料照会と緊急対応を行う。')
F('source-eight-allergens',35,24,11,None,'教材は特定原材料を八品目として列記する',excluded='2026年4月1日のカシューナッツ追加後の制度とは異なる。日付と経過措置を伴う九品目の補足へ接続した。')
F('source-minor20',38,25,12,None,'教材は20歳未満を未成年と呼ぶ',excluded='成年年齢18歳と飲酒年齢20歳を区別する既存本文・設問・用語説明を使用する。')
F('source-muslim-population',42,27,14,None,'世界のムスリム人口を16億人とする教材例',excluded='時点不明の人口推計は食事条件の確認技能に不要。ハラールと本人への確認は保持した。')
F('source-cash-share',53,32,17,None,'現金80％・キャッシュレス20％という教材例',excluded='現在の普及率として使えない時点依存値。決済の仕組みと契約確認を学ぶ。')
F('source-discontinued-brands',54,34,17,None,'特定のコード決済ブランド名を現行例として扱うこと',excluded='提供終了等で変わる固有名は固定の受入可能一覧にしない。自店の契約・端末を確認する。')
F('source-water-everyone',65,40,19,None,'気分不良・吐き気・アレルギー時に一律に水を提供する教材例',excluded='意識・嚥下・症状によらない飲水は教えない。既存本文の無理に飲ませない条件と救急の指示を優先する。')
F('source-late-choking-call',65,40,19,None,'異物が取れない又は意識喪失後に救急車を呼ぶという順序',excluded='消防庁は窒息と判断したら直ちに119番依頼とする。補足はこの順序へ訂正し、年齢別手技は正式講習へ接続する。')
A={
1:(1,'期待・価値・快適さを分けて点検する','お客様の期待は、これまでの経験や知識、店の雰囲気、価格などから生まれます。期待よりよい体験なら満足、同程度なら普通、下回れば不満という比較で振り返ります。価格に見合う価値かどうかも関係します。料理では味だけでなく鮮度や見た目、客席では外観・設備と接客態度の両方を見ます。例えば、料理はそろっていても室温や照明、時間帯に合わない音楽で落ち着けない時は、雰囲気と快適さの改善が必要です。',[6,7,8]),
2:(2,'あいさつを待たずに始める','入口でお客様に気づいたら、相手の様子に合わせて、こちらから先にあいさつします。自分の気分だけで応対を変えず、やさしい目線と届く声で歓迎を伝えます。大声や長い凝視を一律に求めるものではありません。例えば手が離せない時も、気づいたことを伝えて案内担当へつなぐ練習をします。',[9]),
3:(4,'上座・下座は配置と希望を照合する','上座はその場で心地よく安全に過ごせる側、下座は迎える側などが使う位置として学びます。和室では床の間や入口の位置が手がかりになります。ただし役職を外見で決めて座席を強制する方法ではありません。予約の代表者へ席の希望を確かめ、出入りのしやすさと配膳経路も照合して案内します。',[14]),
4:(5,'洋食の食べ方例と片付けを区別する','教材の食べ方例では、一部のデザートを除いて料理を左側から食べ、食べ残したものは皿の手前へまとめます。これは食事の作法を理解するための例で、客を急かす基準ではありません。担当者は料理の進行と道具やナプキンの状態を見て、下膳前に続けて召し上がるか確認します。',[15]),
5:(7,'車椅子の型と席の条件を確認する','介助用車椅子は主に介助者が操作し、自走式車椅子は本人が車輪を操作して移動する型です。ただし、型だけで手助けの必要性を決めません。段差や通路、本人の希望を確認してから、店で安全にできる支援を考えます。机の高さや足元の空間が合えば、車椅子から移らずに利用できる席へ案内します。移動や移乗を本人に断りなく行ってはいけません。',[17]),
6:(7,'補助犬の表示と書類を丁寧に確認する','盲導犬は白や黄色のハーネス、介助犬や聴導犬は種類などの表示が見分ける手がかりです。厚生労働省の案内では、使用者は認定証等と健康管理の記録を携帯します。補助犬かどうかの確認が必要な時は、本人へ理由を伝え、認定証などを丁寧に確認します。犬を呼び寄せて試したり、本人を置いて犬だけを動かしたりする方法ではありません。',[18]),
7:(7,'六つのマークの意味を支援へつなぐ','補助犬マークは身体障害者補助犬法の理解を広めるもので、耳マークは聞こえにくさへの配慮を考える手がかりです。オストメイトマークは人工肛門・人工膀胱を使う方や対応する設備、ハート・プラスマークは外から分かりにくい身体内部の障害に関係します。ヘルプマークは外見では分からなくても援助や配慮が必要なことを知らせ、マタニティマークは妊産婦への配慮につなげます。病名を決めつけず、筆談、設備の案内、休める席など、必要な対応を本人へ尋ねます。',[18]),
8:(8,'テイクアウトの数値は条件付きの例として読む','教材には冷却管理の例として10℃以下という数値があります。すべての料理を同じ温度・期限で扱えるという意味ではありません。実際には料理、調理後の経過、容器、保存方法などを責任者と確認し、店で定めた温度管理と食べる期限を伝えます。例えば保存方法の質問に答えられなければ、他の商品から数値を流用せず確認してから案内します。',[19]),
9:(9,'丁寧な表現の役割を確かめる','席へ近づく時だけでなく離れる時も「失礼いたします」と声をかける例があります。「存じ上げております」は知っている内容を丁寧に述べる表現、「そうさせていただきます」は相手の了承などを踏まえて行う内容を述べる表現です。丁寧に聞こえる語を機械的に足さず、事実と許可の有無を確認します。お客様の呼び方では「奥様」「旦那様」「お使いの方」などの教材例もありますが、分かっている名前や本人が望む呼び方を尊重します。',[20,21]),
10:(10,'電話は聞いていることを声で伝える','電話ではうなずきや表情が相手に見えません。相づちで聞いていることを伝え、分からない所は聞き返します。質問の前は「恐れ入りますが」、取次ぎの前は担当へつなぐことと待っていただくことを説明します。例えば連絡先の数字は復唱して記録し、聞こえたつもりで次の担当へ渡さないようにします。',[22]),
11:(11,'アレルゲン表示は日付と対象を確かめる','容器包装された加工食品のアレルゲン表示制度と、外食料理の情報提供は区別します。消費者庁の2026年4月1日の改正で、カシューナッツが特定原材料へ加わりました。九品目は、えび、かに、くるみ、小麦、そば、卵、乳、落花生、カシューナッツです。カシューナッツには2028年3月31日まで経過措置があるため、表示にないだけで不使用と断定しません。八品目と書かれた旧資料の暗記で回答せず、仕入先の最新情報と調理工程を責任者へ確認します。',[24]),
12:(13,'栄養素は食事全体で組み合わせる','たんぱく質だけ、野菜だけという一つの要素で食事を評価しません。五大栄養素を毎日の食事でバランスよく組み合わせるという基本を学びます。例えば献立の主食、主菜、副菜にどの食品があるかを整理し、一つの食材にも複数の栄養素が含まれることを確かめます。個別の治療や栄養量の保証は店員の推測で行いません。',[26]),
13:(16,'洗剤とつけおきは指定条件で扱う','強い洗剤を使う時も、用途、注意表示、必要な保護具や店の手順を確認します。自己判断で薬剤を混ぜたり濃くしたりせず、食品や客へ影響しないようにします。教材の約40℃の湯と洗剤によるつけおきは、こびり付き汚れを緩める一例です。すべての器や洗剤の指定温度ではないため、材質と製品の条件を優先して確認します。',[30]),
14:(18,'苦情は確認できたことと判断できないことを分ける','話を聞いた後、自分や店のミスと確認できた時は速やかにお詫びして責任者へ報告します。原因や対応を自分で判断できない時は「責任者を呼んでまいります」と伝えて引き継ぎます。責任者が内容を確かめて対応を判断し、必要に応じ担当者も同席します。まだ感情がおさまらない場合は、人・場所・話す時機の変更を検討し、許可なく返金などを約束しません。',[36]),
15:(18,'虫は現物への対応だけで終えない','客席で虫を見つけたら、食品や客へ広げないよう店の方法で速やかに対応し、責任者へ場所と時刻を伝えます。その後も、入口の開放、ごみ、設備のすき間など発生・侵入の原因を調べます。捕まえた数だけで完了とせず、清掃や侵入防止の改善につなげます。食品の近くで自己判断の薬剤散布を行わないようにします。',[38]),
16:(19,'気分不良と吐物処理では役割を分ける','気分が悪い方には呼吸や意識の様子を確認し、応援を求めて見守ります。休める場所への案内も、本人の状態と安全を確認して行い、全員へ一律に水を勧めません。吐物には感染性がある可能性があるため、人が踏んで広げないようにし、担当者が使い捨ての手袋・マスク・エプロンなどを用いて静かに処理します。専用の用具と店の消毒手順を使い、廃棄と手洗いまで行います。薬剤の濃度をこの場で推測して作る方法は教えません。',[40]),
17:(19,'窒息では通報を後回しにしない','消防庁の案内では、十分に咳ができる間は咳を続けてもらい、注意深く見守ります。声が出ない、咳が弱いなど窒息が疑われる時は、異物が取れるか様子を見続けず、直ちに119番通報と応援を依頼します。反応がなくなった時はそのことを伝え、指令員の指示と受講した救命手順に従います。乳児とそれ以外では手技が異なるため、この文章を正式な実技講習の代わりにしません。',[40]),
18:(20,'揺れと火煙の条件で安全な行動を選ぶ','強い揺れでは、丈夫なテーブルの下など、物が落ちる・倒れる・動く危険の少ない場所で身を守ります。揺れが収まって周囲と経路を確かめてから客を誘導します。火災では天井へ炎が届く、煙で視界が悪くなるなど危険が増したら初期消火を続けず避難を優先します。煙を吸いにくい低い姿勢で安全な経路へ案内し、タオル等を探して避難を遅らせません。避難後に荷物を取りに戻らないことも伝えます。',[41,42])}
for n,(l,title,text,pages) in A.items():
 aid=f'rst31-service1-a{n:03}';fs=[f for f in facts if aid in f['additionIds']]
 additions.append({'id':aid,'lessonId':f'rst-1-svc-{l:02}','titleJa':title,'textJa':text,'unitIds':sorted(set(u for f in fs for u in f['unitIds'])),'factIds':[f['id'] for f in fs],'sourceRefs':ref(pages,title),'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False})
# Exact glossary definitions / existing independent meal placement evidence, not topic matches.
gloss=J('src/data/restaurant/glossary.ja.json')['groups'][2]['entries']
for tag,term in [('repeat-guest','リピーター'),('meal-definition','一汁三菜'),('keeper','ハンドルキーパー'),('haram','ハラーム')]:
 e=next(e for e in gloss if e['termJa']==term)
 for f in facts:
  if f['id']=='rst31-service1-'+tag:
   f['existingEvidence'].append({'kind':'glossary_definition','lessonId':None,'paragraphId':None,'questionId':None,'path':'src/data/restaurant/glossary.ja.json','field':f"groups[id=1-service].entries[id={e['id']}].explanationJa",'sha256':H(e['explanationJa'].encode()),'reason':'定義を実際に読んで該当する意味と照合した。','entryId':e['id']})
for f in facts:
 if f['id'].startswith('rst31-service1-meal-placement'):
  f['existingEvidence'].append({'kind':'existing_interactive_diagram','lessonId':'rst-1-svc-04','paragraphId':None,'questionId':None,'path':'src/data/restaurant/meal-placement.json','field':'back,front,viewpointJa','reason':'六つの器の名前と位置を客の視点で具体的に保持する。RestaurantMealPlacement.tsxの描画コードも読んだ。新しい配置図は重複になるため作らない。'})
  f['visualEvidence'].append({'kind':'existing_code_native_diagram','path':'src/components/restaurant/RestaurantMealPlacement.tsx','sourceData':'src/data/restaurant/meal-placement.json','scope':'Six positions and guest orientation checked in data and render code. No new runtime screenshot claimed.','runtimePixelReviewedThisBatch':False})
# Parent's own greeting fact is not silently placed under smile-only child.
for f in facts:
 if f['id'] in ['rst31-service1-greeting','rst31-service1-greet-first']:f['unitIds']=['rst-1-service-k006']
def Q(tags,l,obj,stem,opts,key,reasons,ex):
 assert len(opts)==len(reasons)==4 and len(set(opts))==4
 ids=[f['id'] for f in facts if any(f['id']=='rst31-service1-'+t or f['id'].startswith('rst31-service1-'+t+'-') for t in tags)]
 assert ids,tags
 units=sorted(set(u for f in facts if f['id'] in ids for u in f['unitIds']))
 refs=[]
 for f in facts:
  if f['id'] in ids:
   for r in f['sourceRefs']:
    if r not in refs:refs.append(r)
 qid=f'rst31-service1-q{len(newq)+1:03}'
 newq.append({'id':qid,'lessonId':f'rst-1-svc-{l:02}','unitIds':units,'factIds':ids,'objectiveJa':obj,'stemJa':stem,'optionsJa':opts,'correctIndex':key,'optionReasonsJa':reasons,'explanationJa':ex,'sourceRefs':refs})
 for f in facts:
  if f['id'] in ids:f['questionIds'].append(qid)
Q(['expectations'],1,'期待と体験を比較する','客は事前の期待と同程度の体験だったと話した。教材の比較で最も合うのはどれか。',['期待を下回った不満','期待を大きく上回った感動','期待と同程度の普通','価格を問わない最高の満足'],2,['体験は期待を下回っていない。','大きく上回ったという情報はない。','期待と体験が同程度の比較に合う。','価格と価値の関係を無視した断定になる。'],'期待より上・同程度・下という関係を分ける。同程度という条件は普通の比較に当たる。')
Q(['expectations'],1,'期待に影響する要素を識別する','初来店の客が「この価格と店構えなら落ち着いて食べられると思った」と言った。何を示すか。',['期待は料理を食べる前には生まれない','価格と店の印象が期待へ影響する','期待は従業員の勤続年数だけで決まる','同じ価格なら全員の期待は同じである'],1,['利用前にも予想する水準がある。','価格や雰囲気から予想する水準を述べている。','客の経験や知識なども影響する。','過去の経験や知識は人により違う。'],'客の言葉から利用前に想定した水準を読み取る。期待に影響する要素は一つだけではない。')
Q(['qsca-atmosphere'],1,'雰囲気の物的側面と応対側面を分ける','店の雰囲気をハードとソフトで点検する。組合せが適切なのはどれか。',['ハードは従業員の態度、ソフトは入口の設備','ハードは店の外観、ソフトは接客の態度','ハードもソフトも料理の値段だけ','ハードは予約の電話、ソフトは客席の照明'],1,['態度と設備の区分が逆である。','外観は物的な側面、態度は応対の側面に当たる。','雰囲気は価格だけでは説明できない。','電話応対と照明の区分が逆である。'],'外観・設備などと料理・接客・態度などを分けると、どこを改善するか具体化できる。')
Q(['smile'],2,'笑顔の目元と口元を確認する','接客の笑顔を練習する時、教材の三つの観点に合うのはどれか。',['口の両端だけ動かし客の様子は見ない','目元・口元・相手を思う気持ちを合わせる','目を大きく開き客を見つめ続ける','声を大きくすれば表情の確認は不要にする'],1,['口元だけでは視線や気持ちの伝わり方を確認できない。','やさしい目線、口元、心を合わせる観点である。','凝視を続けることを勧める内容ではない。','声量だけで表情の役割を置き換えない。'],'相手がどう受け止めるかを仲間と確認し、やさしい目線と口元を練習する。')
Q(['bow-gaze'],2,'敬礼の教材上の視線例を選ぶ','背筋を保って敬礼を練習する。教材の視線の目安はどれか。',['足元から約2m先','足元から約1m先','自分の足元','客の頭の上'],1,['約2m先は会釈の教材例である。','敬礼の教材例は約1m先である。','足元は最敬礼の教材例である。','客の頭上を見るという例ではない。'],'会釈・敬礼・最敬礼では、角度だけでなく視線の例も区別する。実際の応対は姿勢と店の方法を確かめる。')
Q(['tray-load'],3,'トレイの載せる側と下ろす側を区別する','安定した位置へ載せる教材例と、下ろす順序を組み合わせるとどれか。',['重い物を手先側へ先に載せ、手前から下ろす','重い物を手前から載せ、手先側から下ろす','高い物を手先側へ集め、片側だけから下ろす','重さに関係なく外側の縁へ載せ、近い順に下ろす'],1,['重い物の位置も下ろす側も教材例と逆である。','手前の安定した位置へ重い物から載せ、手先側から下ろす例に合う。','高い物を不安定な手先側へ置かない。','縁への集中は重心を不安定にする。'],'手前と手先側を支える手との関係で確認し、途中で重心が変わることにも注意する。')
Q(['tray-support'],3,'支える手のひらとひじの関係を確認する','トレイの基本の支え方として教材例に合うのはどれか。',['利き手で縁だけをつまみひじを伸ばし切る','反対の手のひらで中心を支え指を広げる','指を閉じて一点で支え腕を客へ伸ばす','肩へ載せて両手を空ける'],1,['縁だけの支持は中心を支える例と異なる。','中心を手のひらで支え指を広げ、ひじを直角にする例に合う。','一点支持や客側への突き出しは安定を損ねる。','肩へ載せる方法ではない。'],'支える位置、広げた指、ひじの形を一緒に確認する。')
Q(['chopsticks'],4,'箸の上下の動きを区別する','右利きの箸の操作を教材例で練習する。適切なのはどれか。',['下の箸を保ち、上の箸を動かす','上の箸を保ち、下の箸だけ動かす','二本を交差させたまま同時に動かす','二本を縦に握り先端で突き刺す'],0,['教材が示す上下の役割に合う。','動かす箸の上下が逆である。','二本を交差させる例ではない。','握って突き刺す持ち方を示していない。'],'二本とも動かすのではなく、下の箸を安定させ上の箸を動かす例として学ぶ。')
Q(['tokonoma'],4,'床の間と上座の手がかりを理解する','和室の床の間について合う説明はどれか。',['料理を下げるための通路で入口の外にある','掛け軸などを飾る空間で席を考える手がかりになる','すべての部屋で入口のすぐ横にある','客の希望より必ず優先する座席そのもの'],1,['床の間を下膳通路とする説明は違う。','飾る空間と席配置の手がかりという関係に合う。','入口から遠い例が多く、一律に入口横ではない。','空間の名称であり客の希望を無視する規則でもない。'],'床の間の位置を把握しても、実際の席は希望や移動の条件も照合して案内する。')
Q(['cutlery-signal'],5,'二つのカトラリー配置例を区別する','教材の食事進行の目安として正しい組合せはどれか。',['ハの字は終了、斜めにそろえた形は食事中','ハの字は食事中、斜めにそろえた形は終了','どちらも追加注文の合図である','どちらも道具の交換を断る合図である'],1,['教材例の意味が逆である。','二つの教材例の区別に合う。','追加注文の意味として示されていない。','交換を断る意味ではない。'],'道具の状態は目安であり、下げる前には本人へ食事の状況を確認する。')
Q(['napkin'],5,'ナプキンの折り目と位置を理解する','ナプキンの教材例として適切な説明はどれか。',['折り目を奥へ向け、離席時は食事にかぶせる','折り目を手前へ向け、終了時は卓の左へ軽く畳む','折り目は常に右へ向け、終了時は椅子へ投げる','離席も終了も必ず床へ置く'],1,['折り目と離席時の扱いが教材例と異なる。','折り目と終了時の位置の例に合う。','向きと乱暴な置き方が適切でない。','床へ置く例ではない。'],'離席中の椅子と終了時の卓の左も区別し、食事の進行を本人へ確かめる。')
Q(['wheelchair-types'],7,'車椅子の型から支援を決めつけない','介助用と自走式の車椅子について適切なのはどれか。',['介助用は主に介助者が操作するが、必要な支援は本人へ確認する','自走式なら段差があっても支援は絶対に不要','介助用なら本人を通さず必ず店員が押す','車椅子の型だけで移乗の可否を決める'],0,['型の特徴と本人への確認を分けている。','自走式でも環境により支援が必要になる。','本人の了承なしに操作しない。','移乗の判断は型だけではできない。'],'型は観察の手がかりであり、希望・段差・通路と安全な方法を確認する。')
Q(['wheelchair-seat'],7,'車椅子のまま使える席を選ぶ','本人が車椅子のままでの食事を希望した。席で確認する条件はどれか。',['机の高さや足元の空間が合うか','椅子へ必ず移ってもらえるかだけ','車椅子の色が内装に合うかだけ','同行者がいるかだけで決める'],0,['実際に利用できる空間を確認する条件である。','希望を無視して必ず移乗させない。','色は使いやすさの条件ではない。','同行者の有無だけで決めない。'],'通路と机の条件を確かめ、本人が利用できる席へ案内する。')
Q(['assist-dog-identification'],7,'補助犬の確認方法を選ぶ','補助犬であることの確認が必要になった。適切なのはどれか。',['犬に命令し従うか試す','本人へ丁寧に認定証等の確認をお願いする','表示を見ずすべてペットとして断る','犬を本人から離して別室で確認する'],1,['店員が仕事を妨げて試す方法ではない。','厚生労働省の案内に沿う確認方法である。','補助犬の受入れを一律に拒まない。','本人と犬を無断で引き離さない。'],'表示や必要な書類を本人へ確認し、犬の注意を引く行動は避ける。')
Q(['marks'],7,'支援マークの異なる意味を区別する','人工肛門・人工膀胱を使う方や対応するトイレ設備に関係するマークはどれか。',['耳マーク','オストメイトマーク','マタニティマーク','補助犬マーク'],1,['聞こえにくさへの配慮に関係する。','オストメイトの方や対応設備に関係する。','妊産婦への配慮に関係する。','身体障害者補助犬法の理解を広める趣旨である。'],'マーク名だけを暗記せず、設備案内などどの対応へつなぐかを確認する。')
Q(['marks'],7,'内部障害の表示を理解する','ハート・プラスマークの説明として合うのはどれか。',['外から分かりにくい身体内部の障害を示す','聞こえない方だけを表す','妊娠している方だけを表す','補助犬の種類を証明する'],0,['身体内部の障害への理解につなぐ。','聞こえにくさの耳マークと混同している。','妊産婦のマタニティマークと混同している。','補助犬の表示や書類を代替するものではない。'],'外見で健康状態を判断せず、必要な配慮を本人へ尋ねる。')
Q(['marks'],7,'ヘルプマークの条件を理解する','ヘルプマークを示す方への理解として適切なのはどれか。',['見た目で困っていなければ配慮は不要','援助や配慮が必要なことが外から分からない場合もある','すべての着用者は同じ病気である','身体障害者用設備の場所だけを示す'],1,['外見で必要性を否定しない。','見えにくい配慮の必要性を知らせる趣旨に合う。','特定の病気だけを示すものではない。','施設の場所だけを示すマークではない。'],'支援の内容を一律に決めず、困っている様子なら希望を尋ねる。')
Q(['allergy-label-scope'],11,'表示制度の改正日と経過措置を理解する','2026年4月改正のカシューナッツ表示について適切なのはどれか。',['特定原材料へ加わったが経過措置中は表示だけで不使用と決めない','飲食店のすべての料理に包装食品と全く同じ表示義務が生じた','以前の八品目の一覧だけで原材料確認を終える','表示がなければ共用器具の確認も不要になる'],0,['追加と経過措置の両方を踏まえた判断である。','包装加工食品の制度と外食の情報提供を混同している。','旧資料だけでは改正と原材料の変更を見落とす。','表示だけで混入の可能性を否定しない。'],'日付と対象を確かめ、最新の仕入情報と工程を照会する。')
Q(['allergy-nine'],11,'旧一覧との差を確認する','2026年4月1日に特定原材料へ追加された品目はどれか。',['アーモンド','カシューナッツ','ごま','大豆'],1,['この改正で追加された品目ではない。','この改正で特定原材料へ移った品目である。','この改正の追加品目ではない。','この改正の追加品目ではない。'],'旧資料の八品目にカシューナッツを加えた九品目を、経過措置も含めて確認する。')
Q(['fruit-family','gin-family','brandy-family'],12,'酒の名称を大分類へ結び付ける','教材の種類と例の組合せで正しいのはどれか。',['コニャック―ジン','ジェネヴァ―ジン','シードル―ブランデー','ロンドンジン―日本酒'],1,['コニャックはブランデーの例である。','ジェネヴァはジンの名称例である。','シードルはりんごを発酵させた果実酒の例である。','ロンドンジンはジンの名称例である。'],'名称を種類と結び付け、個々の商品は表示で確認する。')
Q(['clean-chemical','soak-example'],16,'つけおきの例と指定条件を区別する','教材の約40℃のつけおき例を作業へ使う時、適切なのはどれか。',['どの洗剤と器にも約40℃を強制する','汚れを緩める例として学び、材質と製品の指定条件を確かめる','温度を上げれば注意表示を読まなくてよい','複数の洗剤を混ぜて同じ効果を得る'],1,['特定例を全製品の条件へ一般化しない。','目的と実作業の指定条件を区別している。','注意表示を温度だけで置き換えない。','自己判断の混合は行わない。'],'つけおきの目的は汚れを緩めること。実作業では材質、洗剤、保護具や店の手順を確認する。')
Q(['complaint-branches'],18,'苦情の判断不能時と確認済みミスを分ける','苦情を聞いたが、自分では事実関係を判断できない。次の説明として適切なのはどれか。',['原因を店のミスと決めつけ返金を約束する','責任者を呼ぶことを伝え、聞いた内容を報告する','客の説明が間違いだと決めて対応を終える','原因が分かるまで客へ何も伝えず離れる'],1,['確認と権限を越えた約束を行っている。','判断する人へ内容を引き継ぐ方法に合う。','事実を確認せず客の責任としない。','客へ次の対応を説明する必要がある。'],'分からないことを断定せず、責任者が内容を確認して判断できるようにする。')
Q(['vomit'],19,'吐物の二次汚染を防ぐ','客席でおう吐があった。感染拡大を防ぐ対応として適切なのはどれか。',['通常のテーブル用布で広くこすり続ける','人を近づけず専用の保護具・用具で静かに処理する','乾くまで客にそのまま歩いてもらう','飲酒していた客なら保護具を使わない'],1,['他の場所へ汚れを広げるおそれがある。','人の出入りと処理用具を管理して広がりを防ぐ。','踏むことや乾燥による広がりを防ぐ必要がある。','原因を推測して保護具を省かない。'],'責任者へ知らせ、担当者が店の消毒・廃棄手順と処理後の手洗いまで行う。')
Q(['choking'],19,'窒息で通報を遅らせない','食事中の客が声を出せず咳も弱い。救急要請の時機として適切なのはどれか。',['何度か処置しても取れない時まで待つ','意識を失ってから初めて依頼する','窒息が疑われた時点で直ちに119番通報と応援を依頼する','閉店後に記録をまとめてから依頼する'],2,['通報を処置の成否待ちにしない。','意識喪失まで遅らせない。','疑われた時点で応援と通報を確保する。','業務の区切りまで待つ状況ではない。'],'現在の消防庁の案内は、窒息と判断したら直ちに119番通報を依頼する順序である。')
Q(['choking'],19,'十分な咳が可能な時の対応を選ぶ','食べ物が詰まった様子だが、十分に咳ができている。基本の対応はどれか。',['咳をやめさせ水を一気に飲ませる','咳を続けてもらい注意深く見守る','一人にして自然に治るまで離れる','手技を知らなくても口の奥へ指を入れる'],1,['咳による排出を妨げ、飲水の危険もある。','十分に咳ができる条件では咳を続けてもらい変化を見守る。','弱くなるなどの変化を見逃さない。','見えない異物を自己流で探る方法ではない。'],'咳が弱くなる、声が出ないなどの変化があれば直ちに通報と応援を依頼する。')
Q(['earthquake-cover'],20,'揺れの最中に身を守る場所を選ぶ','強い揺れが続いている。落下物から身を守る場所の基本はどれか。',['丈夫なテーブルの下など危険物が落ちない空間','ガラス窓のすぐ前','高く積んだ食器棚の横','熱い鍋のある作業台の近く'],0,['落下・転倒・移動の危険を避ける場所を選ぶ。','割れたり落ちたりする危険がある。','棚や物の落下・転倒の危険がある。','熱い物が飛び出す危険がある。'],'まず身の安全を確保し、揺れが収まってから周囲と避難経路を確認する。')
Q(['fire-withdraw'],20,'初期消火の中止条件を理解する','初期消火中に炎が天井へ達し、煙で見通しも悪くなった。どうするか。',['消火器が空になるまで必ず続ける','道具を取りに火元へ近づく','消火を続けず避難を優先する','客に消火を交代してもらう'],2,['危険が増してから残量を使い切ることを優先しない。','火元へ近づいて危険を増やさない。','初期消火が困難になる条件として避難を優先する。','客へ危険な消火を任せない。'],'天井への延焼や視界の悪化は消火を続ける根拠ではない。安全な経路へ避難し戻らない。')
Q(['fire-low'],20,'煙を避ける避難姿勢を選ぶ','煙のある場所から安全な避難経路へ案内する時、基本として適切なのはどれか。',['できるだけ低い姿勢で避難する','煙を確認するため顔を高く上げ続ける','タオルを探し終わるまで全員を待たせる','エレベーターなら必ず煙を避けられると案内する'],0,['煙を吸い込みにくくする基本に合う。','上方にたまりやすい煙へ顔を近づけない。','物を探すため避難を遅らせない。','火災時にエレベーターへ一律に誘導しない。'],'低い姿勢で安全な経路へ進み、持ち物のため遅れたり避難後に戻ったりしない。')
# Existing rst-1-q357 already tests the same escalation choice; do not add a paraphrased duplicate.
newq=[q for q in newq if q['id']!='rst31-service1-q022']
for f in facts:f['questionIds']=[q for q in f['questionIds'] if q!='rst31-service1-q022']
# Independent visual review is recorded only after the final pixels have actually been viewed.
figures=J('docs/ssw-workspace/restaurant/source-closure31/service1/figures.json')
for fig in figures:
 tags=fig.pop('factTags'); fig['factIds']=[f['id'] for f in facts if any(f['id']=='rst31-service1-'+t or f['id'].startswith('rst31-service1-'+t+'-') for t in tags)]
 fig['authorPixelReviewed']=True
 if fig['id'].endswith('002'):fig['altJa']='トレイの下を透視した手のひらと広げた指、体側の重い皿、手先側の小皿を上から示す。'
 for f in facts:
  if f['id'] in fig['factIds']:
   f['visualEvidence'].append({'kind':'new_independent_controlled_diagram','figureId':fig['id'],'assetFile':fig['assetFile'],'authorPixelReviewed':True,'scopeLimits':fig['scopeLimits']})
   if f['decision']=='covered_existing':f['decision']='covered_after_additions'
# Only concise paraphrased verification metadata is retained from primary sites.
authorities=[
('caa-allergy-20260401','消費者庁','https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/assets/food_labeling_cms204_260401_03.pdf','2026-04-01改正。カシューナッツを特定原材料へ追加し、二年間の経過措置を設ける。'),
('tokyo-allergy-nine','東京都保健医療局','https://www.hokeniryo1.metro.tokyo.lg.jp/shokuhin/hyouji/tomin_alle.html','九品目の具体名と2028-03-31までのカシューナッツ移行期間を確認。'),
('gov-allergy-scope','政府広報','https://www.gov-online.go.jp/tokusyu/allergy/','容器包装された加工食品の表示制度と外食・中食の情報提供の違いを確認。'),
('fdma-choking','総務省消防庁','https://www.fdma.go.jp/relocation/kyukyukikaku/oukyu/01futsu/08test/01_08_01.html','十分な咳は継続して見守る。窒息と判断した時点で直ちに119番依頼。反応消失時の通報・心肺蘇生への切替を確認。年齢別実技の習得は別途必要。'),
('fdma-fire','総務省消防庁','https://www.fdma.go.jp/relocation/e-college/cat65/cat64/cat49/7-4.html','天井へ延焼したら避難を優先、煙の中は低い姿勢、避難階段を利用する基本を確認。'),
('chiba-fire','千葉県','https://www.pref.chiba.lg.jp/bousaik/jibun/sonae/shokishokahinan.html','天井に達する炎や視界を遮る煙は避難優先。避難後は戻らない。'),
('tokyo-earthquake','東京都防災','https://www.bousai.metro.tokyo.lg.jp/bousai/1000026/1005642.html','丈夫なテーブルの下や落下・転倒・移動のない空間で身を守り、揺れが収まるまで待つ。'),
('mhlw-assistance-dogs','厚生労働省','https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/shougaishahukushi/hojoken/ukeire.html','盲導犬のハーネス、介助犬・聴導犬の表示、認定証等と必要時の確認を検証。'),
('cao-support-marks','内閣府','https://www8.cao.go.jp/shougai/mark/mark.html','耳・オストメイト・ハートプラスなどの異なる意味を確認。マークの権利所管も個別である。'),
('tokyo-helpmark','東京都福祉局','https://www.fukushi.metro.tokyo.lg.jp/shougai/shougai_shisaku/helpmark','外見では分かりにくい援助・配慮の必要性を知らせる趣旨を確認。'),
('mhlw-maternity','厚生労働省','https://www.bosei-navi.mhlw.go.jp/glossary/life02.html','妊産婦への周囲の理解・配慮につなげる意味を確認。'),
('mhlw-norovirus','厚生労働省','https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/syokuchu/kanren/yobou/040204-1.html','吐物には感染性があり、使い捨て保護具を着用して静かに処理し、処理後に手洗いする。ここで薬剤濃度を一般化しない。'),
('nta-under20','国税庁','https://www.nta.go.jp/publication/pamph/koho/campaign/r8/Apr/05.htm','2022年の成年年齢変更後も飲酒の条件は20歳で、業者の年齢確認等が必要。'),
('police-alcohol','警視庁','https://www.keishicho.metro.tokyo.lg.jp/kotsu/torishimari/inshu_info/inshu_bassoku.html','2026-07-24更新。道路交通法65条3項の酒類提供・勧酒禁止を確認。'),
('jsa-anaphylaxis','日本アレルギー学会','https://www.jsaweb.jp/modules/citizen_qa/index.php?content_id=14','アナフィラキシーと血圧低下・意識低下を伴うショックの違い、医師による治療の存在を確認。接客員へ治療実施を勧めない。')]
external=[{'id':a,'authority':b,'url':c,'checkedAt':'2026-10-31','method':'primary_authority_search_result_text_read','verificationJa':d} for a,b,c,d in authorities]
legal_map={6:['mhlw-assistance-dogs'],7:['cao-support-marks','tokyo-helpmark','mhlw-maternity','mhlw-assistance-dogs'],11:['caa-allergy-20260401','tokyo-allergy-nine','gov-allergy-scope'],16:['mhlw-norovirus'],17:['fdma-choking'],18:['fdma-fire','chiba-fire','tokyo-earthquake']}
for a in additions:
 n=int(a['id'][-3:]);a['externalEvidenceIds']=legal_map.get(n,[]);a['authoredTextSha256']=H(a['textJa'].encode())
for f in facts:
 ext=set()
 for a in f['additionIds']:ext.update(legal_map.get(int(a[-3:]),[]))
 if 'age-check' in f['id'] or 'adulthood' in f['id'] or 'minor20' in f['id']:ext.add('nta-under20')
 if f['id']=='rst31-service1-driver':ext.add('police-alcohol')
 if 'no-treatment' in f['id'] or 'food-allergy' in f['id']:ext.add('jsa-anaphylaxis')
 if 'late-choking' in f['id']:ext.add('fdma-choking')
 if 'assist-dog' in f['id']:ext.add('mhlw-assistance-dogs')
 f['externalEvidenceIds']=sorted(ext)
# The index is reference navigation; rows are reconciled, not counted as extra teaching facts.
raw=json.loads(pathlib.Path('/workspace/scratch/8c34e3cace7a/service1-indexrows.json').read_text())
raw=[r for r in raw if r['readingAsPrinted']!='ひらがな']
assert len(raw)==201
for r in raw:
 if r['readingAsPrinted']=='わいん':r['termAsPrinted']='ワイン'
byterm={e['termJa']:e for e in gloss};aliases={'身分証明証':'身分証明書'}
glossaryCrosswalk=[]
for i,r in enumerate(raw,1):
 term=r['termAsPrinted'];lookup=aliases.get(term,term);e=byterm.get(lookup)
 row={'rowId':f'rst31-service1-index-{i:03}',**r,'canonicalTermJa':lookup,'existingEntryId':e['id'] if e else None,'existingDefinitionField':f"groups[2].entries[id={e['id']}].explanationJa" if e else None,'definitionSha256':H(e['explanationJa'].encode()) if e else None,'definitionRead':e is not None,'decision':'existing_definition' if e else 'glossary_addition','sourceIndexMeaningScope':'索引の語と本文の参照先を照合した。索引の備考自体は定義文ではない。','notes':[]}
 if lookup=='トレイ':row['notes'].append('原索引の読み「といれ」は誤記として使わず、既存の「とれい」を使用する。')
 if lookup=='身分証明書':row['notes'].append('原索引の「身分証明証」と現行の「身分証明書」を透明な表記差として照合。')
 if lookup=='ごはん':row['notes'].append('本文の配置例と提供順に対応して二行掲載される。同一語の重複で新しい語は増えない。')
 glossaryCrosswalk.append(row)
missing=[r for r in glossaryCrosswalk if not r['existingEntryId']];assert [r['canonicalTermJa'] for r in missing]==['ジェネヴァ']
glossaryAdditions=[{'id':'rst31-service1-term-genever','termJa':'ジェネヴァ','reading':'じぇねゔぁ','explanationJa':'教材でジンの種類の例として挙げられる名称。提供する商品の種類や原料はメニューと表示で確認する。','lessonIds':['rst-1-svc-12'],'unitIds':['rst-1-service-k037','rst-1-service-ref01'],'factIds':['rst31-service1-gin-family'],'sourceRefs':ref([25,45],'ジンの名称例・索引'),'existingTeachingEvidence':{'path':'src/data/restaurant/lessons.1.ja.json','lessonId':'rst-1-svc-12','paragraphId':'beverage-subtype-families'},'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False}]
# Official specimens retained byte-for-byte; source-book artwork is never copied.
official=J('docs/ssw-workspace/restaurant/source-closure31/service1/official-assets.json')
for g in official:
 g['factIds']=[f['id'] for f in facts if f['id'] in ['rst31-service1-banknote-values','rst31-service1-currency-old','rst31-service1-coin-values']]
 g.pop('factTags',None);g['authorPixelReviewed']=True
 g['scopeLimits']='公式の低解像度見本。額面・図柄の比較用で真贋判定・実寸印刷用ではない。全ての歴史的な券種は網羅しない。'
 if 'mof-2004-' in g['assetFile']:
  side='表' if g['assetFile'].endswith('-11.jpg') else '裏'
  g['captionJa']='2004年発行開始の旧様式紙幣の'+side+'の公式見本。額面表示と図柄を確認する。出典：財務省。'
  g['altJa']=g['captionJa']
 figures.append(g)
marks=[J('docs/ssw-workspace/restaurant/source-closure31/service1/official-mark.json')]+J('docs/ssw-workspace/restaurant/source-closure31/service1/official-more-marks.json')
for g,num in zip(marks,[1,3,6]):
 g.pop('factTags',None);g['factIds']=[f'rst31-service1-marks-{num:02}'];g['authorPixelReviewed']=True
 if num==6:g['altJa']='ピンク色のハートの中に母子を描いた公式マタニティマーク。'
 figures.append(g)
 for f in facts:
  if f['id'] in g['factIds']:f['visualEvidence'].append({'kind':'official_unchanged_asset','figureId':g['id'],'assetFile':g['assetFile'],'authorPixelReviewed':True})
text='紙幣は額面の数字と図柄を一緒に確認します。2024年発行開始の券は、一万円の表が渋沢栄一・裏が東京駅、五千円の表が津田梅子・裏がフジ、千円の表が北里柴三郎・裏が富嶽三十六景の神奈川沖浪裏です。旧様式の福沢諭吉・樋口一葉・野口英世の券や二千円券も区別します。二千円券は表が守礼門、裏が源氏物語に関係する図柄です。新券の発行だけを理由に旧券を使えないと判断しません。硬貨は一・五・十・五十・百・五百円の数字を読み、五円と五十円には穴があることを公式の表裏画像で比較します。五百円にも新旧の図柄があるため、色だけで額面や有効性を決めません。会計では客から預かった額を読み上げ、機器や店の確認手順を使います。画像は財務省が公開する見本で、真贋判定の教材ではありません。'
aid='rst31-service1-a019'
additions.append({'id':aid,'lessonId':'rst-1-svc-17','titleJa':'公式見本で紙幣と硬貨を見分ける','textJa':text,'unitIds':['rst-1-service-k053'],'factIds':[],'sourceRefs':ref([32,33],'現金の図柄と現在の公式見本'),'externalEvidenceIds':['mof-current-currency'],'authoredTextSha256':H(text.encode()),'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False})
external.append({'id':'mof-current-currency','authority':'財務省','url':'https://www.mof.go.jp/policy/currency/index.html','checkedAt':'2026-10-31','method':'official_image_bytes_and_context_read','verificationJa':'新旧紙幣・二千円券と硬貨の公式見本を取得し、実際の画像を確認。財務省の利用規約・通貨画像利用案内を別記。'})
for i,statement in enumerate(text.split('。')[:-1],1):
 fid=f'rst31-service1-currency-visual-{i:02}'
 facts.append({'id':fid,'unitIds':['rst-1-service-k053'],'statementJa':statement+'。','sourceRefs':ref([32,33],'教材の額面識別を公式現行・旧様式見本で補足'),'existingEvidence':[],'additionIds':[aid],'questionIds':[],'visualEvidence':[{'kind':'official_unchanged_assets','figureIds':[g['id'] for g in official],'authorPixelReviewed':True}],'decision':'covered_after_additions','exclusionReason':None,'externalEvidenceIds':['mof-current-currency']});additions[-1]['factIds'].append(fid)
for g in official:g['factIds']+=additions[-1]['factIds']
# Each specimen demonstrates only its observable face, not unrelated legal/procedural assertions.
for g in official:
 name=g['assetFile'];nums=[1]
 if '2024' in name:nums.append(2)
 if '2004' in name:nums.append(3)
 if '2000-2000' in name:nums.extend([3,4])
 if 'coin-' in name:nums.append(6)
 if 'coin-500' in name:nums.append(7)
 g['factIds']=[f'rst31-service1-currency-visual-{n:02}' for n in nums]
for f in facts:
 if f['id'].startswith('rst31-service1-currency-visual-'):
  matching=[g['id'] for g in official if f['id'] in g['factIds']]
  f['visualEvidence']=([{'kind':'official_unchanged_assets','figureIds':matching,'authorPixelReviewed':True}] if matching else [])

# Link-only for marks whose reporting/permission conditions have not been fulfilled.
figures=[g for g in figures if g['id'] not in ['rst31-service1-official-assistance-law','rst31-service1-official-maternity']]
for f in facts:f['visualEvidence']=[v for v in f['visualEvidence'] if v.get('figureId') not in ['rst31-service1-official-assistance-law','rst31-service1-official-maternity']]
marklinks=[('assistance','ほじょ犬マーク','https://www.mhlw.go.jp/stf/newpage_15684.html',1,'利用後報告の履行をまだ確認できないためリンクのみ。'),('ear','耳マーク','https://www.zennancho.or.jp/mimimark/mimimark/',2,'ウェブ媒体等の事前許諾を得ていないためリンクのみ。'),('ostomate','オストメイト','https://www8.cao.go.jp/shougai/mark/mark.html',3,'教育用図記号の公式原画像を出典付きで別に掲載。'),('heart','ハート・プラスマーク','https://h-plus-hp.normanet.ne.jp/DL.html',4,'商用利用条件の適合が未確認のためリンクのみ。'),('help','ヘルプマーク','https://www.fukushi.metro.tokyo.lg.jp/shougai/shougai_shisaku/helpmark',5,'事前使用報告を送っていないためリンクのみ。'),('maternity','マタニティマーク','https://sukoyaka21.cfa.go.jp/maternitymark/',6,'利用後報告の履行をまだ確認できないためリンクのみ。')]
officialReferenceLinks=[]
for slug,title,url,num,why in marklinks:
 officialReferenceLinks.append({'id':'rst31-service1-link-'+slug,'lessonId':'rst-1-svc-07','titleJa':title+'を公式ページで確認','textJa':title+'の正式な形と説明を、権利者・行政の公式ページで確認します。','url':url,'factIds':[f'rst31-service1-marks-{num:02}'],'sourceRefs':ref(18,'配慮に関係するマーク'),'rightsReason':why,'offlineVisualGap':num!=3})
aid='rst31-service1-a020'
text='窒息が疑われたら、処置が終わるのを待たず119番通報と応援を依頼します。反応のある成人では、まず背部叩打法、効果がなければ腹部突き上げ法という区別があります。背部叩打法は左右の肩甲骨の間を手の付け根でたたく方法です。腹部突き上げ法を乳児・妊婦・高度な肥満の方へ一律に行ってはいけません。乳児には別の方法があり、最新の公式資料と講習で対象に合う方法を確認します。反応がなくなったら、未通報なら119番通報し、心肺蘇生の手順へ移ります。反応がなくても普段どおりの呼吸がある場合は回復体位で横向きにし、状態を見守るという区別があります。店では公式動画で理論を確認し、実技講習で姿勢や力を練習します。模式図だけで手技の習得を認定しません。'
additions.append({'id':aid,'lessonId':'rst-1-svc-19','titleJa':'窒息の手技と反応による切替','textJa':text,'unitIds':['rst-1-service-k065'],'factIds':[],'sourceRefs':ref(40,'窒息と反応の条件を現行資料で補う'),'externalEvidenceIds':['fdma-choking','cfa-2026-choking'],'authoredTextSha256':H(text.encode()),'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False})
for i,t in enumerate(text.split('。')[:7],1):
 fid=f'rst31-service1-choking-method-{i:02}'
 facts.append({'id':fid,'unitIds':['rst-1-service-k065'],'statementJa':t+'。','sourceRefs':ref(40,'背部叩打と現行の対象・反応条件'),'existingEvidence':[],'additionIds':[aid],'questionIds':[],'visualEvidence':[],'decision':'covered_after_additions','exclusionReason':None,'externalEvidenceIds':['fdma-choking','cfa-2026-choking']});additions[-1]['factIds'].append(fid)
external.append({'id':'cfa-2026-choking','authority':'こども家庭庁・政府広報','url':'https://www.cfa.go.jp/policies/child-safety-actions/handbook/content-7','additionalUrl':'https://www.gov-online.go.jp/article/202212/entry-9901.html','checkedAt':'2026-10-31','method':'primary_authority_search_text_read','verificationJa':'2026年公開の乳児手技資料はJRC2025を明記。乳児の具体的な指の本数を旧消防庁ページから転載せず、最新版へ接続。政府広報の腹部突き上げ対象外条件も確認。'})
for g in J('docs/ssw-workspace/restaurant/source-closure31/service1/firstaid-figures.json'):
 g.pop('factTags',None);g['factIds']=['rst31-service1-choking-01','rst31-service1-choking-02'] if g['id'].endswith('009') else ['rst31-service1-choking-method-02','rst31-service1-choking-method-03','rst31-service1-choking-method-06'];g['authorPixelReviewed']=True;figures.append(g)
 for f in facts:
  if f['id'] in g['factIds']:f['visualEvidence'].append({'kind':'new_independent_controlled_diagram','figureId':g['id'],'authorPixelReviewed':True,'scopeLimits':g['scopeLimits']})
for slug,title,num,fids in [('choking-conscious','気道異物の除去（反応がある場合）',22,['rst31-service1-choking-method-02','rst31-service1-choking-method-03']),('choking-unresponsive','気道異物の除去（反応がない場合）',23,['rst31-service1-choking-method-06']),('recovery','回復体位',25,['rst31-service1-choking-method-07'])]:
 officialReferenceLinks.append({'id':'rst31-service1-link-'+slug,'lessonId':'rst-1-svc-19','titleJa':title+'の公式教材','textJa':'消防庁の公式動画教材で、対象・姿勢・手順を確認します。実技の習得は救命講習で練習します。','url':f'https://www.fdma.go.jp/relocation/kyukyukikaku/oukyu/05kobetsu/01/05_01_{num:02}.html','factIds':fids,'sourceRefs':ref(40,'窒息の応急手当'),'rightsReason':'消防庁はリンク自由・連絡不要と明示。動画の転載や変更はしない。','offlineVisualGap':True,'videoPlaybackReviewedByAuthor':False})
officialReferenceLinks.append({'id':'rst31-service1-link-infant-current','lessonId':'rst-1-svc-19','titleJa':'乳児の方法を最新の公式教材で確認','textJa':'乳児は成人と方法が異なります。JRC2025に基づくこども家庭庁の最新図と公式動画への案内を確認します。','url':'https://www.cfa.go.jp/policies/child-safety-actions/handbook/content-7','factIds':['rst31-service1-choking-method-04','rst31-service1-choking-method-05'],'sourceRefs':ref(40,'対象別の手技'),'rightsReason':'公式ページへのリンク。イラストや動画を転載しない。','offlineVisualGap':True})

F('source-backblow-count',65,40,19,None,'肩甲骨付近を四～五回たたくという元教材の回数例',excluded='回数だけで終了・通報を遅らせる一律手順へしない。反応・対象に応じた公式教材と通報優先の現行説明へ接続する。')
newq.append({'id':'rst31-service1-q029','lessonId':'rst-1-svc-19','unitIds':['rst-1-service-k065'],'factIds':['rst31-service1-choking-method-02','rst31-service1-choking-method-04'],'objectiveJa':'成人の手技を全対象へ一般化しない','stemJa':'窒息の手当について正しい理解はどれか。','optionsJa':['成人の腹部突き上げ法を乳児にも同じように行う','妊婦にも体型に関係なく腹部突き上げ法を行う','対象や反応によって方法が異なり、乳児には別の方法を確認する','反応がなくなっても立たせたまま同じ方法を続ける'],'correctIndex':2,'optionReasonsJa':['乳児には別の方法があり成人の方法を一般化しない。','妊婦は腹部突き上げ法の対象外条件に含まれる。','対象・反応別に確認する理解が適切。','反応消失時は心肺蘇生の手順へ切り替える。'],'explanationJa':'119番通報を遅らせず、対象と反応の状態に合う公式の手順を用いる。理論図だけで実技習得を認定しない。','sourceRefs':ref(40,'対象別の気道異物除去')})
reusedFigureBindings=[{'figureId':'rst31-cs2-fig-emergency-roles','assetFile':'assets/restaurant/source31/cooking-service2/emergency-roles.png','lessonId':'rst-1-svc-19','factIds':['rst31-service1-choking-method-06'],'sourceRefs':ref(40,'反応消失時の通報・AEDの応援'),'authorPixelReviewed':True,'scopeLimit':'通報・AEDの手配と誘導の役割だけ。手技・パッド位置を教える図ではない。'}]

# Assessment statements describe the competency actually tested, never all neighbouring atoms.
for q in newq:
 ids=q['factIds'][:]
 narrow={'rst31-service1-q029':'rst31-service1-choking-method-04','rst31-service1-q015':'rst31-service1-marks-03','rst31-service1-q016':'rst31-service1-marks-04','rst31-service1-q017':'rst31-service1-marks-05'}
 q['testedFactIds']=[narrow[q['id']]] if q['id'] in narrow else ids
 q['coverageLimit']='この設問の場面・選択肢で確認する代表的な判断。関連する全ての用語・実技・図柄の網羅的評価ではない。'
for f in facts:
 f['newAssessmentTestedBy']=[q['id'] for q in newq if f['id'] in q['testedFactIds']]
 f['assessmentCoverage']='representative_existing_or_new_question' if f['newAssessmentTestedBy'] or any(e['kind']=='assessment' for e in f['existingEvidence']) else 'not_individually_assessed'

# Explicit tree, preserving chapter/section boundaries instead of promoting broad parents.
children={1:[2,6,12,16,22,26],2:[3,4,5],6:[7,8,9,10,11],12:[13,14,15],16:[17,18,19,20,21],22:[23,24,25],26:[27,28,29,30,31],32:[33,36,39,40,41],33:[34,35],36:[37,38],41:[42,43],44:[45,48,52],45:[46,47],48:[49,50,51],52:[53,54],55:[56,59],56:[57,58],59:[60,61,62],63:[64,66],64:[65],66:[67,68]}
unitFacts=collections.defaultdict(list)
for f in facts:
 for u in f['unitIds']:unitFacts[u].append(f['id'])
def collect(n):
 ids=unitFacts[f'rst-1-service-k{n:03}'][:]
 for c in children.get(n,[]):ids+=collect(c)
 return list(dict.fromkeys(ids))
units=[]
for u in ledger:
 uid=u['id'];n=int(uid[-3:]) if '-k' in uid else None
 ids=collect(n) if n is not None else [f['id'] for f in facts if f['decision']!='reference_excluded']
 remainFacts=[];remainImages=[]
 if n in children:
  decision='structural_aggregate';reason='見出しの範囲。明記した子単位と事実を参照し、子の未解決事項を隠して本文全体を合格扱いにしない。'
 elif n is None:
  decision='structural_aggregate';reason='索引201行・200語を既存199語と新規ジェネヴァの経路へ照合。ごはんの重複一行と読み誤記を別記した。索引だけを新しい技能の証拠にしない。'
 elif n==21:
  decision='blocked';reason='六つの意味の本文・設問と公式形状へのリンクを補った。オストメイトの正式画像は掲載。他の五つは権利・報告条件を守ってリンクのみとし、オフライン現物識別の未完を別記する。';remainImages=['オストメイトのみ許容条件付き公式原画像を掲載。他の五マークは事前許諾・商用条件・事前/事後報告条件が未充足なので公式ページへリンクし、オフラインの形状識別は未完。']
 elif n==53:
  decision='covered_after_additions';reason='財務省の変更なし公式見本28画像と、現行・旧様式・二千円券・六額面硬貨の比較説明を追加。学習上の識別であり真贋判定技能や実機表示検証を含まない。'
 elif n==65:
  decision='covered_after_additions';reason='頁40の四症状を本文・補足へ対応。窒息判断と背部位置の独立理論図、対象・反応別の説明、正式な手技動画・最新乳児図へのリンクを追加。AIは実技習得を認定しない。';remainImages=['オフラインでは正式な手技動画と対象別の全姿勢を再生できない。オンライン公式教材へのリンクを提供。']
 else:
  decision='covered_after_additions' if any(f['id'] in ids and f['decision']=='covered_after_additions' for f in facts) else 'covered_existing'
  reason='担当単位の本文・表の区別・条件を事実へ分け、記した既存の段落・用語定義・設問又は独立した補足へ直接対応させた。人の実技・母語・専門家の認定は含まない。'
 units.append({'unitId':uid,'decision':decision,'factIds':ids,'reason':reason,'childUnitIds':[f'rst-1-service-k{c:03}' for c in children.get(n,[])],'remainingFactGaps':remainFacts,'remainingImageGaps':remainImages})
# Keep learning, offline visual availability and practical certification as distinct axes.
for u in units:
 if u['unitId']=='rst-1-service-k021':
  u['learningDecision']='covered_after_additions';u['visualDecision']='official_reference_links_with_offline_gaps';u['offlineVisualGap']=True;u['barrierAxis']='third_party_permission_or_usage_report'
 if u['unitId']=='rst-1-service-k065':
  u['learningDecision']='covered_after_additions';u['visualDecision']='original_theory_figures_and_official_method_links';u['offlineVisualGap']=True;u['practicalTrainingCertified']=False

# Keep unresolved descendant references visible on structural aggregates.
byunit={u['unitId']:u for u in units}
def openchildren(uid):
 result=[]
 for ch in byunit[uid]['childUnitIds']:
  if byunit[ch]['decision']=='blocked':result.append(ch)
  result+=openchildren(ch)
 return result
for u in units:
 u['unresolvedChildUnitIds']=openchildren(u['unitId'])
roles={1:'cover',2:'introduction',3:'contents',4:'chapter_divider',23:'chapter_divider',28:'chapter_divider',35:'chapter_divider',39:'chapter_divider',49:'credits',50:'rights_notice'}
notes={9:'目元・口元・心の三点を示す挿絵を確認。',10:'身だしなみ六分類の表を確認。',11:'三種類の角度・視線・目的の表と側面姿勢を拡大して確認。',12:'手前と手先、肘角度、手のひら、グラスの上下半分、皿の支えの図を拡大確認。',13:'箸の動く側と一汁三菜写真の客側の向きを確認。',14:'会席順、床の間・入口・上座下座の図と和室写真を確認。',15:'カトラリー配置、食事中と終了の形、調味料セット・ゴブレットを確認。',16:'フランス料理順序の図を確認。円卓の条件は本文から切り出した。',17:'親子・高齢客・二つの車椅子の挿絵を確認。',18:'補助犬三種と六つの実際のマークを拡大確認。名称だけで認識教材が完成したとしない。',19:'配膳・持ち帰りの条件と教材の数値例を確認。',20:'用語と意味・誤用修正の表を確認。',21:'二列の接客表現対応表を確認。',22:'提案例と電話場面の表を確認。',24:'八品目の表と周囲の古い医療記述を確認。現行法と分離。',25:'醸造酒五行・蒸留酒四行の例と原料表を確認。',26:'ハンドルキーパーのワッペンと栄養素五行の表を確認。',27:'味覚五行の表を確認。',29:'開店・閉店の各チェック項目を確認。',30:'上から下、つけおきの挿絵と条件例を確認。',31:'客席・従業員スペース・空調の説明を確認。',32:'旧図柄四額面の紙幣の表裏と見本表示を確認。現在の図柄を網羅していない。',33:'六額面の硬貨の表裏写真を確認。現物の識別教材を再現したとはしない。',34:'四方式の決済表、二つのコード読取方法、古いブランド例を確認。',36:'苦情の二つの初動分岐と、責任者判断後の人・場所・時間の分岐を図で確認。',37:'硬質/軟質例と異物申出後の順序図を確認。',38:'ドア、ごみ、虫、フィルター、文房具の予防場面を確認。',40:'症状別四行の表と挿絵を確認。飲水・通報順序等をそのまま現在の処置にしない。',41:'地震時の身の安全・避難の挿絵と災害写真を確認。',42:'火災通報・消火中止・低姿勢避難の説明と挿絵を確認。'}
sourceDoc=next(d for d in J('docs/ssw-workspace/restaurant/source-closure31/source-lock.json')['documents'] if d['documentId']=='rst-1-service')
pages=[]
for page in sourceDoc['pages']:
 n=page['pdfPage'];file=pathlib.Path('/workspace/scratch/8c34e3cace7a/restaurant-source31-extracted/rst-1-service')/f'p{n:03}.txt';assert H(file.read_bytes())==page['textSha256']
 pages.append({'documentId':'rst-1-service','pdfPage':n,'textSha256':page['textSha256'],'textRead':True,'visualRead':True,'visualNotes':notes.get(n,'索引の語・読み・参照ページを行単位で照合。' if 43<=n<=48 else '表紙・目次・扉・前後記・権利表示を実際のレンダリングで確認し本文の知識量と混同しない。'),'role':'reference_index' if 43<=n<=48 else roles.get(n,'instructional_content'),'visualMethod':'四ページ比較レンダリングを実際に閲覧。11・12・18は単ページ原寸相当も閲覧。','factIds':[f['id'] for f in facts if any(n in r['pdfPages'] for r in f['sourceRefs'])]})
packet={'schemaVersion':1,'shard':'service1','documentIds':['rst-1-service'],'baseCommit':'8a0ebfe5f799847ac1fd590a3b610cb0837f7667','pdfSha256ByDocument':{'rst-1-service':sourceDoc['pdfSha256']},'pages':pages,'units':units,'facts':facts,'additions':additions,'questions':newq,'figures':figures,'officialReferenceLinks':officialReferenceLinks,'reusedFigureBindings':reusedFigureBindings,'glossaryAdditions':glossaryAdditions,'glossaryCrosswalk':glossaryCrosswalk,'externalAuthorities':external,'sourceErrata':[{'pdfPages':[24],'issue':'八品目の表は2026年4月改正後の制度としては不足。','handling':'日付と経過措置を付けた九品目の補足へ接続。'},{'pdfPages':[25],'issue':'20歳未満を未成年と呼ぶ旧い表現。','handling':'現行の成年年齢と飲酒年齢を区別。既存本文は正しく対応。'},{'pdfPages':[46],'issue':'トレイの索引読みがといれ。','handling':'既存の正しいとれいを使用。'},{'pdfPages':[43,44,45,46,47,48],'issue':'索引は201物理行・200固有語。既存199語にはジェネヴァの経路がない。','handling':'ごはんの重複行は増語とせず、本文の既存説明へ新規語経路を追加。'}],'legacyDisplayedErrata':[],'reviewScope':{'all50TextPagesActuallyRead':True,'all50RenderedPagesActuallyViewed':True,'singlePageDetailViews':[11,12,18],'all10NewFinalPngsActuallyViewed':True,'existingRuntimeScreenshotReviewedThisBatch':False,'reusesExistingMealPlacement':True,'existingOrderingAndCuttingNotDuplicated':True,'sourceArtworkCopied':False,'newJapaneseFrozen':True,'translationsStarted':False,'existingLessonAndQuestionIdsUnchanged':True},'acceptance':{'aiSourceComparison':True,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'allAssignedUnitsDecided':len(units)==69,'unresolved':[{'unitId':u['unitId'],'factGaps':u['remainingFactGaps'],'imageGaps':u['remainingImageGaps']} for u in units if u['decision']=='blocked'],'runtimeIntegrationPending':True,'translationPendingLocales':['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']}}
(O/'packet.json').write_text(json.dumps(packet,ensure_ascii=False,indent=2)+'\n')
summary={'pages':len(pages),'assignedUnits':len(units),'unitDecisions':dict(collections.Counter(u['decision'] for u in units)),'facts':len(facts),'factDecisions':dict(collections.Counter(f['decision'] for f in facts)),'additions':len(additions),'questions':len(newq),'figures':len(figures),'glossaryPhysicalRows':len(glossaryCrosswalk),'glossaryUniqueTerms':len(set(r['canonicalTermJa'] for r in glossaryCrosswalk)),'glossaryAdditions':len(glossaryAdditions),'packetSha256':H((O/'packet.json').read_bytes()),'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False}
(O/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False))
