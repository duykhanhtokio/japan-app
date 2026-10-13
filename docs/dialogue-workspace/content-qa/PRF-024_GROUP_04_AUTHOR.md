# PRF-024 Group04 — author evidence

24 assigned existing IDs; new Japanese expression,11 turns and5 goals each. No translations, runtime edits or human/native approval. All facilities and operations are fictional teaching settings.

## Actual rejected drafts after full-script comparisons

Two completed first drafts were rejected rather than describing imaginary revisions. The cold-goods draft repeats the causal spine of prf-003-final-causal-rewrites.json SC-LOC-JP-03211-07-001 (held cold item→do not return→tell clerk→delegate condition judgment). The nervous medical memo draft repeats prf-008-mito.json SC-LOC-008-02-001 (nervous patient→memo use→date/sleep details→handoff). Complete actual rejected drafts follow.

```json
{
  "title": "診察で話す内容を練習したメモを看護師に見せる",
  "premise": "名張市を背景にした架空の日本語学習場面。診察で話す内容を練習したメモを看護師に見せる。人物、施設内の設備、書式、担当者の対応は教材上の設定で、実施設の運用や専門判断を保証しない。",
  "turns": [
    "診察前に伝えておきたいことはありますか。",
    "家で症状を説明する練習をしましたが、緊張すると全部忘れます。このメモを診察で見ながら話してもよいですか。",
    "メモを使いたいと、先生にも伝えておきます。",
    "痛かった日を赤丸にしました。医学的な言い方は知らないので、赤丸は痛みの強さではなく日付の目印です。",
    "その区別が分かるよう、メモに意味を添えられますか。",
    "上に「赤丸は日付」と書きました。症状の説明とは別に、夜勤の日も記録しています。",
    "先生に一番相談したい点は、どれでしょうか。",
    "眠れなかった翌日に痛みがあったことです。夜勤が原因だと決めず、関係があるかを聞きたいです。",
    "原因については、診察で先生にご相談ください。",
    "はい。自分の考えと実際に起きたことを分けて話します。最初にメモを使うとお伝えします。",
    "そのご希望を申し送ります。それでは、失礼します。"
  ],
  "tasks": [
    [
      "sc_loc_jp_24208_03_001_goal_1",
      "緊張対策として症状メモを見ながら話したいと伝える"
    ],
    [
      "sc_loc_jp_24208_03_001_goal_2",
      "赤丸は強さでなく日付の目印と説明する"
    ],
    [
      "sc_loc_jp_24208_03_001_goal_3",
      "目印の意味を追記し夜勤記録もあると述べる"
    ],
    [
      "sc_loc_jp_24208_03_001_goal_4",
      "夜勤を原因と断定せず痛みとの関係を医師に聞きたいと伝える"
    ],
    [
      "sc_loc_jp_24208_03_001_goal_5",
      "観察事実と推測を分けて診察で話す方針を示す"
    ]
  ]
}
```

```json
{
  "title": "冷凍品を棚の常温菓子と同じ所へ戻さない",
  "premise": "亀山市を背景にした架空の日本語学習場面。冷凍品を棚の常温菓子と同じ所へ戻さない。人物、施設内の設備、書式、担当者の対応は教材上の設定で、実施設の運用や専門判断を保証しない。",
  "turns": [
    "その商品をお戻しになりますか。",
    "冷凍のケーキをかごへ入れましたが、常温の菓子も買うので戻したいです。近くの棚へ置いてしまいそうになりました。",
    "冷凍品は、違う売場の棚へ戻さず私にお渡しください。",
    "こちらです。冷凍庫から出してからほかの買物をしました。どのくらい経ったか正確には分かりません。",
    "お渡しいただいた後の扱いは、こちらで確認します。",
    "触って冷たいから大丈夫だと自分で判断して、冷凍庫へ戻すのもやめます。",
    "ほかに冷凍庫から出した物はありますか。",
    "このケーキだけです。買うのをやめた理由は持ち帰る時間が長くなるからで、商品に不具合があったわけではありません。",
    "承知しました。常温の商品をお探しでしょうか。",
    "はい。持ち帰りに合う保存表示を見て選びます。冷凍品を買わないことにしても、出した物は黙って置かずお渡しします。",
    "お預かりします。お知らせいただきありがとうございました。失礼します。"
  ],
  "tasks": [
    [
      "sc_loc_jp_24210_07_001_goal_1",
      "購入中止の冷凍ケーキを別棚へ置きかけたと伝える"
    ],
    [
      "sc_loc_jp_24210_07_001_goal_2",
      "職員へ渡し庫外時間は正確に不明と説明する"
    ],
    [
      "sc_loc_jp_24210_07_001_goal_3",
      "触感だけで安全判断し自分で再冷凍しないと述べる"
    ],
    [
      "sc_loc_jp_24210_07_001_goal_4",
      "取出品は一つで理由は持帰時間と不具合ではないと示す"
    ],
    [
      "sc_loc_jp_24210_07_001_goal_5",
      "保存表示で選び不要冷凍品は職員へ渡す方針を伝える"
    ]
  ]
}
```

## Other selected full readings and distinction

Read complete11-turn/five-goal records: Aichi23209-01 delayed text notices vs current24210-01 meeting timezone confusion;23223-03 other hospital card vs current24210-03 forgotten workplace earplugs;23230-08 walking-group poster permission vs current24208-08 painting equipment occupies bench;23204-05 swapped mother/brother mail contents vs current24210-05 fragile pressed flower replaced by photo;23208-06 mixed currencies vs current24210-06 signature practice sheet submitted accidentally. Fukushima SC-LOC-007-07-001 exposed PIN on clerk memo differs from current24208-06 proposed household shared expense sheet: no PIN written, operation sharing versus expense reporting. These are selected narrative comparisons, not an exhaustive semantic read of all previous scenarios.

Roles:24208/24209/24210-08 park interaction is Park Staff, not Community Staff; root should make supported role correction during integration. Precisely21 nonpark roles remain their input roles. Medical24208/03 is nursing preparation for BP; no diagnosis. Government referrals remain Government Officer. No category conversion required.

Final mechanical evidence:24 exact assignedIDs,264 turns,120 distinct Playerutterances,120 goals, no exact Player collision in prior author files. Final sourceSHA256 c7f5dfef286b5f470fd6fe084c65cfca5d33a1ecf433b60b5bd62c161f2264d9. AI editorial only; no human/native, real-policy or device approval.

## Peer-requested rejected actual drafts

Independent peer identified three old narrative overlaps and two crossgroup motifs. Complete actual replaced versions follow; not invented outlines.

```json
{
  "title": "乗車直前にヘルメット袋のひもが荷物に絡んだと伝える",
  "premise": "名張市を背景にした架空の日本語学習場面。乗車直前にヘルメット袋のひもが荷物に絡んだと伝える。人物、施設内の設備、書式、担当者の対応は教材上の設定で、実施設の運用や専門判断を保証しない。",
  "turns": [
    "その袋のひもが足元まで垂れていますね。",
    "自転車用のヘルメットを袋に入れています。ひもがキャリーケースの車輪に絡んで、すぐには乗れそうにありません。",
    "発車に合わせて無理に引っ張らず、まず通路から離れましょう。",
    "この列車に飛び乗るのはやめます。荷物を動かす前に、端へ寄せるのを見ていてもらえますか。",
    "人の通りが切れたら、こちらへ寄せてください。",
    "移せました。袋のひもをほどきたいので、平らな所でケースを倒してもよいでしょうか。",
    "こちらの通行を妨げない場所で、荷物が転がらないようにしてください。",
    "ひもが外れました。長い部分は袋の中へ入れて、車輪から離して持ちます。",
    "次の列車は、案内表示で確認してからお乗りください。",
    "表示を確認して待ちます。ヘルメットの袋はケースの上へ載せず、手に持って移動します。",
    "では、足元に気をつけてお進みください。失礼します。"
  ],
  "tasks": [
    [
      "sc_loc_jp_24208_01_001_goal_1",
      "ヘルメット袋のひもが車輪に絡んだ状況を申告する"
    ],
    [
      "sc_loc_jp_24208_01_001_goal_2",
      "乗車を見送り荷物を端へ移す際の見守りを頼む"
    ],
    [
      "sc_loc_jp_24208_01_001_goal_3",
      "ひもをほどくためケースを倒す場所を尋ねる"
    ],
    [
      "sc_loc_jp_24208_01_001_goal_4",
      "ほどいたひもを収納して車輪から離すと報告する"
    ],
    [
      "sc_loc_jp_24208_01_001_goal_5",
      "次の表示を確認し袋を手で持つ方針を伝える"
    ]
  ]
}
```

```json
{
  "title": "暮らしの説明会で質問を他人に読まれない形で出す",
  "premise": "名張市を背景にした架空の日本語学習場面。暮らしの説明会で質問を他人に読まれない形で出す。人物、施設内の設備、書式、担当者の対応は教材上の設定で、実施設の運用や専門判断を保証しない。",
  "turns": [
    "説明会について、ご質問を受け付けています。",
    "住まいのことで聞きたいのですが、会場で名前を呼ばれて質問を読まれるのは困ります。",
    "個別の内容でしょうか。ここでは詳しい事情を声に出さなくても結構です。",
    "同じ建物の人も参加します。質問用紙には部屋番号まで書かないほうがよいですか。",
    "全員に共有する用紙には個人が特定される情報を書かず、個別の相談方法を担当へ確認しましょう。",
    "では、この紙には一般的な質問だけにします。詳しい部分は折って渡すより、別の相談に分けたいです。",
    "相談を希望する分野を伺ってもよろしいですか。",
    "住まいの相談です。今ここで事情を説明せず、予約先だけ教えていただきたいです。",
    "担当へ、相談方法の案内を希望されていると伝えます。",
    "お願いします。みんなの前では読まないでほしいという希望も、一緒に伝えてください。",
    "その希望を添えておつなぎします。それでは、失礼いたします。"
  ],
  "tasks": [
    [
      "sc_loc_jp_24208_02_001_goal_1",
      "説明会で記名質問を読み上げられたくないと伝える"
    ],
    [
      "sc_loc_jp_24208_02_001_goal_2",
      "同じ建物の参加者がいて部屋番号の記入を心配する"
    ],
    [
      "sc_loc_jp_24208_02_001_goal_3",
      "共有質問と個別事情を分ける方針を述べる"
    ],
    [
      "sc_loc_jp_24208_02_001_goal_4",
      "住まいの個別相談予約先だけを希望する"
    ],
    [
      "sc_loc_jp_24208_02_001_goal_5",
      "公開読み上げを避けたい希望の引継ぎを頼む"
    ]
  ]
}
```

```json
{
  "title": "写生の道具をベンチいっぱいに広げたと気づき片づける",
  "premise": "名張市を背景にした架空の日本語学習場面。写生の道具をベンチいっぱいに広げたと気づき片づける。人物、施設内の設備、書式、担当者の対応は教材上の設定で、実施設の運用や専門判断を保証しない。",
  "turns": [
    "少し失礼します。こちらのベンチを使いたい方がいらっしゃいます。",
    "絵を描く道具を広げて、座れる所をなくしてしまいました。すぐまとめます。",
    "絵はそのまま続けられそうですか。",
    "画板は膝へ載せます。水の入った容器だけ倒れそうなので、先にふたを閉めます。",
    "筆の洗い水は、公園の地面へ流さないでください。",
    "流さず容器に入れて持ち帰ります。ベンチに置いた布が濡れているので、その下も確認します。",
    "座面の汚れはありますか。",
    "絵の具はついていませんが、水滴がありました。自分の乾いた布で拭いてから道具をしまいます。",
    "片づいた所は、ほかの方にも使っていただきます。",
    "空きました。人が座ったら、その方の顔を勝手に絵へ入れず、景色だけを描きます。",
    "ありがとうございます。それでは、写生をお楽しみください。失礼します。"
  ],
  "tasks": [
    [
      "sc_loc_jp_24208_08_001_goal_1",
      "写生道具でベンチを占有したと認め片づける"
    ],
    [
      "sc_loc_jp_24208_08_001_goal_2",
      "画板を膝へ移し水容器を先に閉める"
    ],
    [
      "sc_loc_jp_24208_08_001_goal_3",
      "洗い水を持帰り濡れ布の下を確認する"
    ],
    [
      "sc_loc_jp_24208_08_001_goal_4",
      "絵の具でない水滴を自分の布で拭くと伝える"
    ],
    [
      "sc_loc_jp_24208_08_001_goal_5",
      "席を空け他人の顔を無断で描かないと述べる"
    ]
  ]
}
```

```json
{
  "title": "落葉の下に隠れた名札を探すため熊手を借りようとする",
  "premise": "尾鷲市を背景にした架空の日本語学習場面。落葉の下に隠れた名札を探すため熊手を借りようとする。人物、施設内の設備、書式、担当者の対応は教材上の設定で、実施設の運用や専門判断を保証しない。",
  "turns": [
    "何かお探しですか。",
    "子どもの名札が落葉の中へ落ちました。掃除用の熊手で探せるかと思って声を掛けました。",
    "先のとがった道具で探す前に、落とした範囲を確認しましょう。",
    "この木のそばです。名札には留め具があるので、人が踏む前に見つけたいです。",
    "お子さんは少し離れてお待ちください。職員が落葉を確認します。",
    "子どもをベンチの横で待たせます。急いで熊手を引いたら名札が飛ぶかもしれないので、道具は借りません。",
    "名札の大きさと色を教えてください。",
    "手のひらより小さく、黄色い布に名前を書いてあります。見つけても名前を大声で読まないでいただけますか。",
    "名前は公表せず、ご本人へ確認します。",
    "お願いします。見つかった後は留め具も残っているか確かめて、子どもに付け直す前に状態を見ます。",
    "特徴を確認しました。こちらで探しますのでお待ちください。それでは、失礼します。"
  ],
  "tasks": [
    [
      "sc_loc_jp_24209_08_001_goal_1",
      "落葉へ落ちた子の名札を熊手で探したいと相談する"
    ],
    [
      "sc_loc_jp_24209_08_001_goal_2",
      "落下位置と留め具による踏みつけ懸念を述べる"
    ],
    [
      "sc_loc_jp_24209_08_001_goal_3",
      "子を離して待たせ飛散懸念から熊手借用をやめる"
    ],
    [
      "sc_loc_jp_24209_08_001_goal_4",
      "布名札の特徴を示し氏名の公開読み上げを避けるよう頼む"
    ],
    [
      "sc_loc_jp_24209_08_001_goal_5",
      "発見後に留め具状態を確認してから子へ付けると伝える"
    ]
  ]
}
```

```json
{
  "title": "相談の録音ではなく要点のメモを取ると決める",
  "premise": "尾鷲市を背景にした架空の日本語学習場面。相談の録音ではなく要点のメモを取ると決める。人物、施設内の設備、書式、担当者の対応は教材上の設定で、実施設の運用や専門判断を保証しない。",
  "turns": [
    "銀行の説明で確認したいことがございますか。",
    "後で忘れそうなので、説明を録音しようとスマートフォンを出しました。先に撮ってよいか聞くべきでした。",
    "まだ録音は始めていませんか。",
    "始めていません。隣のお客様の声も入るかもしれないので、ここでは録音をやめます。",
    "必要な点は、メモを取りながらご確認いただけます。",
    "メモに口座番号を全部書くのは避けたいです。今日質問したい手続きの名前だけ、書いてもらえますか。",
    "手続きの名称をお伝えします。内容が分からない時は、その場でお尋ねください。",
    "今のお話で「受付」と「完了」を同じ意味に取ってしまいました。申込みを受けた段階と、処理が終わった段階は別ですか。",
    "はい、別の段階です。実際の手続きの進み方は、担当がご説明します。",
    "二つの言葉を別々にメモしました。電話で聞き返す時も、申込みを出しただけなのか、完了したのか区別して尋ねます。",
    "担当へご案内します。メモをお持ちください。それでは、失礼いたします。"
  ],
  "tasks": [
    [
      "sc_loc_jp_24209_06_001_goal_1",
      "事前確認せず録音準備したと申告する"
    ],
    [
      "sc_loc_jp_24209_06_001_goal_2",
      "録音未開始を伝え周囲の声を理由に取りやめる"
    ],
    [
      "sc_loc_jp_24209_06_001_goal_3",
      "口座番号を残さず手続き名のメモを求める"
    ],
    [
      "sc_loc_jp_24209_06_001_goal_4",
      "受付と完了という段階の違いを質問する"
    ],
    [
      "sc_loc_jp_24209_06_001_goal_5",
      "両語を別記し後の問い合わせでも段階を区別すると述べる"
    ]
  ]
}
```

Peer revisions: replaced bag-wheel with ticket/notebook stamp preparation; personal-public consultation with作文字数vs行数; paint-washwater with keyboard power permission; leaf-covered lost namebadge with windy paper-plane decision; bank受付/完了 ending with note-taking pace and readback. Full peer-cited prior Inazawa23220-08 was read: lost hearing aid/grass cutter/staff search/traits; final windy paper-plane has no lost object, recovery or search. Crossgroup final comparison: Kuwana painting water vs final electronic-keyboard power; Suzuka privacy vs final作文count; saved/submit vs bank explanatory pace. Actual rejected full versions above. Superseding final sourceSHA256: ccbde7b9dee5947c02247b1a43681dffc9eb7e0d60ed17eccdba408d75fe2697.24 scripts/264 turns/120 distinct Playerlines verified.

Additional actual rejected paper-plane draft, after full priorTamura07211-08 comparison requested by peer:
```json
{
  "title": "風の強い日に紙飛行機の向きを見て投げるのをやめる",
  "premise": "尾鷲市を背景にした架空の日本語学習場面。風の強い日に紙飛行機の向きを見て投げるのをやめる。人物、施設内の設備、書式、担当者の対応は教材上の設定で、実施設の運用や専門判断を保証しない。",
  "turns": [
    "紙飛行機を飛ばすご予定ですか。",
    "子どもと試したかったのですが、持っただけで風に引かれます。飛ばすと園路まで流れそうです。",
    "人が通る方向へ飛ばさないようにしてください。",
    "広い芝生なら必ず安全と思っていましたが、今日は投げずに折り方を見せるだけにします。",
    "その紙が風で散らないよう、ご注意ください。",
    "軽い紙をベンチへ置いたままにせず、使わない分はかばんへ戻します。子どもにも走って追わせません。",
    "風が弱まってから使う場合も、周囲を確認してください。",
    "この場所なら飛ばしてよいという許可をもらったわけではないのですね。次に来た時も、場所の条件を確かめます。",
    "はい、利用の案内をご確認ください。",
    "今日は一枚を折って持ち帰ります。飛び方の実験は別の日にして、人がいる園路へ向けて投げません。",
    "それでは、お気をつけてお過ごしください。失礼します。"
  ],
  "tasks": [
    [
      "sc_loc_jp_24209_08_001_goal_1",
      "風に引かれる紙飛行機が園路へ流れそうと伝える"
    ],
    [
      "sc_loc_jp_24209_08_001_goal_2",
      "芝生でも安全を決めず投げず折り方説明へ替える"
    ],
    [
      "sc_loc_jp_24209_08_001_goal_3",
      "予備紙を収納し子に飛行機を追わせないと述べる"
    ],
    [
      "sc_loc_jp_24209_08_001_goal_4",
      "場所の飛行許可ではないと理解し次回も条件を確認する"
    ],
    [
      "sc_loc_jp_24209_08_001_goal_5",
      "今日は折紙を持帰り人の園路へ投げないと決める"
    ]
  ]
}
```

Final bench-mud replacement supersedes all earlier hashes. CurrentSHA256 ce808b5e0cb2bd3116bb515b29e8273f6e90cbf8a132a83650370071ddc83234. No invented rejected outlines: actual replaced versions above.

Final peer precision:Owase06撮ってよい→録音してよい. Final finalSHA256 0eb6f997bbb054850eb368bbd87b226006ba061880f72ff064867567fa531569.
