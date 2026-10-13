# PRF-023 final remainder group 04 author evidence

Initial frozen input SHA-256: `8fdd58168acc097263e989fcbfd183ba9409792f4e549f9a6166333d35e73182`. Baseline790e5bd8356e5926faa867aa332b08b6ebb8fc05. This child owns37 frozen source entries and this report only.

## Actual rejected frozen variants

The following complete previous variants were read and rejected for the concrete reasons recorded in the final decisions; preserved here before replacement. They are historical evidence, not accepted runtime content.

### SC-LOC-AIC-ANJO-06-001

```json
{
  "title": "料理教室で包丁の作業を続けられないと申し出る",
  "premise": "安城市を背景にした架空の日本語学習場面。料理教室で、参加者が切り傷を教師へ報告し食品作業を中断する。応急処置や医学的な重症度判断を教材で指示しない。施設、設備、商品、受付条件と担当者の対応は教材の設定であり、実施設の運用を保証しない。",
  "turns": [
    "野菜を切る作業は進んでいますか。",
    "指を少し切りました。続けようと思いましたが、血が付くかもしれないので作業を止めました。",
    "包丁を置いて、担当を呼びます。どの指ですか。",
    "左手の人差し指です。切った野菜と、まだ切っていない物は、そのまま台にあります。",
    "食品の扱いはこちらで確認します。ご自身で全部を混ぜたり片づけたりしないでください。",
    "分かりました。汚れていないと思う物も勝手に使わず、先生に任せます。ほかの参加者にも近づかないよう伝えます。",
    "けがの対応を担当へ相談している間、座ってお待ちください。",
    "座ります。料理を完成させることより、まずけがと台の状態を確認してもらいたいです。",
    "続きに参加できるかも、確認してから相談しましょう。",
    "今日は包丁を使う作業へ戻らず、見学だけにできるか後で聞きます。友人の材料を借りて続けることもしません。",
    "承知しました。それでは、担当を呼んできます。失礼します。"
  ],
  "tasks": [
    [
      "sc_loc_aic_anjo_06_001_goal_1",
      "指を切ったため食品作業を止めたと報告する"
    ],
    [
      "sc_loc_aic_anjo_06_001_goal_2",
      "負傷した指と切った食品の所在を伝える"
    ],
    [
      "sc_loc_aic_anjo_06_001_goal_3",
      "食品を勝手に混ぜず台の扱いを教師へ任せる"
    ],
    [
      "sc_loc_aic_anjo_06_001_goal_4",
      "座ってけがと台の確認を優先すると述べる"
    ],
    [
      "sc_loc_aic_anjo_06_001_goal_5",
      "包丁作業再開をせず見学の可否を後で相談する"
    ]
  ]
}
```

### SC-LOC-JP-23209-05-001

```json
{
  "title": "送った書類に別の人の資料を混ぜたと気づき連絡する",
  "premise": "碧南市を背景にした架空の郵便相談で、差出人が別人の資料の混入に気づいて連絡する。回収、配達停止や中身の確認を保証しない。施設、設備、商品、書式と職員の対応は架空の教材設定で、実施設の運用を保証しない。",
  "turns": [
    "差し出したお荷物についてのご相談ですね。",
    "今朝送った書類に、別の人の資料を入れたかもしれません。届く前に相談したいです。",
    "発送の記録と、ご相談の内容を担当へ伝えます。控えはお持ちですか。",
    "こちらです。家に残るはずだった別の人の紙が見つからず、封筒に混ぜた可能性があります。",
    "中身をこちらから確かめることはできません。扱いの確認を担当へご相談ください。",
    "分かりました。勝手に郵便を取り出せると思って来たのではありません。差出した物の対応を聞きたいです。",
    "送り先にも、内容の確認について連絡できますか。",
    "できます。先に相手へ、別の資料が入った可能性と、開く前に私へ連絡してほしいことを伝えます。",
    "郵便側でできることは、担当の確認を受けてください。",
    "お願いします。控えの番号と差出しの時刻を伝えます。関係する人にも知らせ、資料が見つかったらその結果を追加で連絡します。",
    "それでは、担当へおつなぎします。早めにお知らせいただきありがとうございました。"
  ],
  "tasks": [
    [
      "sc_loc_jp_23209_05_001_goal_1",
      "差出書類へ別人資料を混ぜた可能性を配達前に相談する"
    ],
    [
      "sc_loc_jp_23209_05_001_goal_2",
      "控えを示し自宅に残るはずの紙がないと説明する"
    ],
    [
      "sc_loc_jp_23209_05_001_goal_3",
      "自己回収可と思わず発送後の対応を聞く"
    ],
    [
      "sc_loc_jp_23209_05_001_goal_4",
      "受取先へ可能性を伝え開封前連絡を頼むと述べる"
    ],
    [
      "sc_loc_jp_23209_05_001_goal_5",
      "番号時刻を伝え関係者へ知らせ発見結果を追加連絡する"
    ]
  ]
}
```

### SC-LOC-JP-23220-07-001

```json
{
  "title": "スーパーの短時間勤務に応募する連絡先を聞く",
  "premise": "稲沢市を背景にした架空の日本語学習場面。スーパーの買物客が求人を見て接客担当へ採用連絡先を尋ねる。採用、就労資格や勤務条件を保証しない。施設、設備、表示と担当者の対応は教材上の設定であり、実施設の運用を保証しない。",
  "turns": [
    "店内で、何かお探しですか。",
    "入口で求人の紙を見ました。夕方の短い時間に働けるか、応募する連絡先を聞きたいです。",
    "採用の担当へお問い合わせください。どの募集をご覧になりましたか。",
    "品出しの募集です。昼は日本語の授業があるので、夕方から週に三日を希望しています。",
    "その時間と日数を担当へお伝えください。ここで採用のお約束はできません。",
    "分かりました。応募する前に、仕事の内容と勤務時間を聞くことはできますか。",
    "募集の案内にある連絡先へ、ご質問ください。",
    "こちらに電話番号がありました。仕事中の店員さんを長く引き止めず、家から連絡します。",
    "ご応募の際の持ち物も、担当へ確認してください。",
    "はい。面接が決まる前に履歴書をレジへ預けず、連絡してから案内どおり用意します。",
    "それでは、採用担当へお問い合わせください。ご来店ありがとうございました。"
  ],
  "tasks": [
    [
      "sc_loc_jp_23220_07_001_goal_1",
      "短時間勤務へ応募する連絡先を尋ねる"
    ],
    [
      "sc_loc_jp_23220_07_001_goal_2",
      "品出し募集と夕方週三日希望を説明する"
    ],
    [
      "sc_loc_jp_23220_07_001_goal_3",
      "応募前に仕事内容と時間を聞けるか相談する"
    ],
    [
      "sc_loc_jp_23220_07_001_goal_4",
      "募集番号から家で連絡し接客を長く止めないと述べる"
    ],
    [
      "sc_loc_jp_23220_07_001_goal_5",
      "面接持ち物を確認し履歴書をレジへ預けない"
    ]
  ]
}
```

### SC-LOC-JP-23226-06-001

```json
{
  "title": "夜勤の生活で貸金庫を利用できる時間を聞く",
  "premise": "尾張旭市を背景にした架空の日本語学習場面。銀行窓口で、夜勤の本人が貸金庫の取扱いや時間を相談する。サービスの存在、空きや保管適性を保証しない。施設、設備、条件と対応は教材の設定であり、実施設の運用を保証しない。",
  "turns": [
    "貸金庫についてのお問い合わせでしょうか。",
    "書類を保管する場所を探しています。夜勤なので、利用できる時間を先に知りたいです。",
    "取扱いや時間、契約条件は専用の担当がご案内します。",
    "お願いします。夜に必要な物を取り出せると思って契約するのは避けたいです。",
    "保管したい物を使う時間も、担当へお伝えください。",
    "仕事で夜に使う物は家に残す予定です。普段使わない書類の保管を考えています。",
    "利用の空きや確認に必要な物も、担当へご相談ください。",
    "今ここで箱を借りて書類を入れられるということではないのですね。今日は資料をもらって家で考えたいです。",
    "そのご希望でお伝えします。料金も含めて、説明をお聞きください。",
    "使える時間と料金を確認します。家の保管と比べて、取り出す時に困らないか家族とも相談します。",
    "それでは、担当へご案内します。お問い合わせありがとうございました。"
  ],
  "tasks": [
    [
      "sc_loc_jp_23226_06_001_goal_1",
      "夜勤の生活で貸金庫利用時間を先に尋ねる"
    ],
    [
      "sc_loc_jp_23226_06_001_goal_2",
      "夜間に取出せると思って契約しない希望を伝える"
    ],
    [
      "sc_loc_jp_23226_06_001_goal_3",
      "夜に必要な物は家に残し普段使わない書類を検討する"
    ],
    [
      "sc_loc_jp_23226_06_001_goal_4",
      "即利用でなく資料を持帰り検討したいと述べる"
    ],
    [
      "sc_loc_jp_23226_06_001_goal_5",
      "時間料金を聞き家の保管と家族で比較する"
    ]
  ]
}
```

### SC-LOC-JP-23232-06-001

```json
{
  "title": "毎月の積立額を下げる相談と今月の処理を分けて聞く",
  "premise": "愛西市を背景にした架空の日本語学習場面。銀行で、減収予定の本人が積立額の変更を相談する。金額を推奨せず契約条件と処理は担当へ確認する。設備、条件、職員の対応は教材の設定であり、実施設の運用を保証しない。",
  "turns": [
    "積立についてのご相談でしょうか。",
    "来月から収入が減るので、毎月の積立額を下げたいです。今月の分まで変えられるかも確認したいです。",
    "担当が現在の契約と処理の状況を確認します。",
    "お願いします。引き落としが済んだ分を、額の変更だけで戻せると思ってはいません。今後の額を相談したいです。",
    "変更の時期や方法について、担当からご案内します。",
    "まだ新しい額は決めていません。家賃と生活費を計算して、無理なく続けられるか家で考えたいです。",
    "今日は説明をお聞きになるご希望ですね。",
    "はい。相談しただけで額が変わるのではなく、手続きの内容を理解してから決めたいです。",
    "そのご希望で担当へおつなぎします。",
    "今月の処理がどこまで進んだかと、変更を始められる月を聞きます。今日は新しい金額を書かず説明をお願いします。",
    "承知しました。それでは、担当窓口へどうぞ。失礼いたします。"
  ],
  "tasks": [
    [
      "sc_loc_jp_23232_06_001_goal_1",
      "減収予定で積立額と変更対象月を相談する"
    ],
    [
      "sc_loc_jp_23232_06_001_goal_2",
      "処理済額が変更のみで戻ると思わず将来額を相談する"
    ],
    [
      "sc_loc_jp_23232_06_001_goal_3",
      "新額未決で生活費と家賃を家で計算したいと述べる"
    ],
    [
      "sc_loc_jp_23232_06_001_goal_4",
      "説明のみ希望し手続理解後に決定すると伝える"
    ],
    [
      "sc_loc_jp_23232_06_001_goal_5",
      "今月処理と変更開始月を聞き金額記入を待つ"
    ]
  ]
}
```

### SC-LOC-JP-23238-03-001

```json
{
  "title": "診察待ちの赤ちゃんの授乳場所を看護師に尋ねる",
  "premise": "長久手市を背景にした架空の日本語学習場面。本人が受診する際、同伴赤ちゃんの授乳場所と呼出しを看護師へ相談する。授乳の医学的な方法や設備の存在は断定しない。設備、条件と職員の対応は教材の設定であり、実施設の運用を保証しない。",
  "turns": [
    "待合でお困りのことはありますか。",
    "私の診察を待っていますが、連れてきた赤ちゃんが泣き始めました。授乳できる場所を相談したいです。",
    "ご案内できる場所を確認します。お一人でお連れですか。",
    "はい。赤ちゃんを置いて一人で場所を探しには行けないので、こちらで聞きました。",
    "お呼び出しの順番についても確認します。お名前を教えてください。",
    "この受付票の名前です。授乳で離れる間に呼ばれたら、戻った時にどう伝えるか知りたいです。",
    "受付と相談し、離れる場所と戻り方をご案内します。",
    "お願いします。呼び出しを聞けないから診察を取り消したいということではなく、続けて待ちたいです。",
    "そのご希望もお伝えします。赤ちゃんのお荷物はお持ちですか。",
    "授乳に使う布とおむつを持っています。案内された場所へ赤ちゃんと一緒に行き、戻ったら受付へ知らせます。",
    "それでは、場所を確認しますのでお待ちください。失礼します。"
  ],
  "tasks": [
    [
      "sc_loc_jp_23238_03_001_goal_1",
      "本人診察待ちで同伴赤ちゃんの授乳場所を相談する"
    ],
    [
      "sc_loc_jp_23238_03_001_goal_2",
      "一人同伴で赤ちゃんを置いて探索しないと伝える"
    ],
    [
      "sc_loc_jp_23238_03_001_goal_3",
      "受付票を示し離席中呼出しと復帰方法を聞く"
    ],
    [
      "sc_loc_jp_23238_03_001_goal_4",
      "取消でなく診察を継続して待ちたいと説明する"
    ],
    [
      "sc_loc_jp_23238_03_001_goal_5",
      "同伴用品を持ち授乳後受付へ復帰を知らせる"
    ]
  ]
}
```

### SC-LOC-JP-23220-01-001

```json
{
  "title": "駅のコンセントから焦げたようなにおいがすると知らせる",
  "premise": "稲沢市を背景にした架空の日本語学習場面。駅の待合室で、乗客が電源付近の異臭を駅員へ報告する。電気設備の点検や修理を自分で行わない。施設、設備、表示と担当者の対応は教材上の設定であり、実施設の運用を保証しない。",
  "turns": [
    "こちらへお声がけいただきましたか。",
    "待合室の壁のコンセントの近くで、焦げたようなにおいがします。確認してもらえますか。",
    "近づかずにお待ちください。煙や火が見えましたか。",
    "煙も火も見ていません。においに気づいたので、何も差したり抜いたりせずこちらへ来ました。",
    "場所を確認します。どちらの壁ですか。",
    "入口から見て左の壁です。青い椅子の後ろですが、私が戻って触る必要はありませんよね。",
    "はい、こちらで確認します。その周辺は使わず、離れてお待ちください。",
    "友人もそこで充電しようとしていました。使わないよう伝えて、二人で案内のそばへ移ります。",
    "対応する職員に状況を伝えます。",
    "お願いします。何か壊れたと決めつけず、においを感じた場所と、まだ煙は見ていないことを伝えます。",
    "お知らせありがとうございます。それでは、確認に向かいます。失礼します。"
  ],
  "tasks": [
    [
      "sc_loc_jp_23220_01_001_goal_1",
      "待合室の電源付近の焦げたような臭いを報告する"
    ],
    [
      "sc_loc_jp_23220_01_001_goal_2",
      "煙火は未目撃で電源に触れていないと説明する"
    ],
    [
      "sc_loc_jp_23220_01_001_goal_3",
      "入口左の青椅子後ろと場所を具体的に示す"
    ],
    [
      "sc_loc_jp_23220_01_001_goal_4",
      "友人にも使用を待つよう伝え共に離れて待つ"
    ],
    [
      "sc_loc_jp_23220_01_001_goal_5",
      "感じた場所と未目撃の状態を職員へ伝える"
    ]
  ]
}
```

### SC-LOC-JP-23232-04-001

```json
{
  "title": "外国の免許証で運転する前に確認の担当を聞く",
  "premise": "愛西市を背景にした架空の日本語学習場面。警察の案内窓口で、外国の免許を持つ本人が運転前の確認先を尋ねる。日本での運転資格や法的条件を断定しない。設備、条件、職員の対応は教材の設定であり、実施設の運用を保証しない。",
  "turns": [
    "運転免許についてのお問い合わせですね。",
    "外国の免許証を持っています。友人の車を借りる前に、日本で運転できるか確認したいです。",
    "免許の担当へご確認ください。免許証と関係する書類はお持ちですか。",
    "こちらです。日本語の翻訳もありますが、翻訳があるだけで運転できるとは決めていません。",
    "書類とご本人の状況を担当が確認します。",
    "今日は電車で来ました。確認が済むまで車を借りず、友人には別の移動方法を頼みます。",
    "そのように、先に条件をご確認ください。",
    "免許証の期限も気になります。外国で有効なことと、日本での扱いを分けて聞きたいです。",
    "受付できる場所や必要な物も、担当の案内を受けてください。",
    "分かりました。免許と翻訳を一緒に持ち、行く前に受付の場所と持ち物を確認します。",
    "それでは、免許を担当する窓口をご案内します。失礼いたします。"
  ],
  "tasks": [
    [
      "sc_loc_jp_23232_04_001_goal_1",
      "国外免許で借りた車を運転する前に確認を希望する"
    ],
    [
      "sc_loc_jp_23232_04_001_goal_2",
      "免許翻訳を示し翻訳だけで有効と思っていないと述べる"
    ],
    [
      "sc_loc_jp_23232_04_001_goal_3",
      "電車で来署し確認まで車を借りないと伝える"
    ],
    [
      "sc_loc_jp_23232_04_001_goal_4",
      "国外期限と日本での扱いを分けて相談する"
    ],
    [
      "sc_loc_jp_23232_04_001_goal_5",
      "資料を持参し担当窓口と必要物を来訪前に確認する"
    ]
  ]
}
```

### SC-LOC-JP-23220-05-001

```json
{
  "title": "土の入った鉢を梱包する前に発送の条件を聞く",
  "premise": "稲沢市を背景にした架空の日本語学習場面。郵便窓口で、国内へ鉢植えを送りたい客が受付と梱包を相談する。植物の配送可否や生存を保証しない。施設、設備、表示と担当者の対応は教材上の設定であり、実施設の運用を保証しない。",
  "turns": [
    "お送りになる物について、お尋ねですか。",
    "鉢植えを家族へ送りたいです。土が入ったままですが、先に梱包の条件を聞きたいです。",
    "送り先と、植物の状態を確認します。国内へお送りですか。",
    "国内です。鉢の底から水が出ることがあるので、ふたを閉めればよいと決めずに聞きに来ました。",
    "受付できる内容や梱包は、担当が確認します。今、植物をお持ちですか。",
    "今日は写真だけです。高さと鉢の大きさを測りました。土や水が漏れない方法も説明を受けたいです。",
    "写真と寸法を担当へお見せください。植物が無事届くことまでは保証できません。",
    "分かりました。受け取る家族が留守の日もあるので、発送してから知らせるのではなく、受取予定を先に相談します。",
    "受取予定も踏まえて、ご希望を担当へお伝えください。",
    "お願いします。植物の種類、鉢の寸法、水が出ることを伝えて、受付と梱包の説明を聞いてから用意します。",
    "鉢の写真と寸法を、発送の担当へお見せください。それでは、ご案内します。失礼いたします。"
  ],
  "tasks": [
    [
      "sc_loc_jp_23220_05_001_goal_1",
      "土入り鉢植えの発送前に条件を聞く"
    ],
    [
      "sc_loc_jp_23220_05_001_goal_2",
      "国内宛で底から水が出る可能性を申告する"
    ],
    [
      "sc_loc_jp_23220_05_001_goal_3",
      "写真寸法を示し漏れ対策の説明を希望する"
    ],
    [
      "sc_loc_jp_23220_05_001_goal_4",
      "無事到着保証はなく家族の受取予定を先に相談する"
    ],
    [
      "sc_loc_jp_23220_05_001_goal_5",
      "種類寸法と水を伝え説明後に梱包する"
    ]
  ]
}
```

## Actual discarded authored attempts after cross-group reading

### SC-LOC-JP-23220-01-001

```json
{
  "title": "四両の列車でいつもの六号車の乗車位置を使えないと気づく",
  "premise": "稲沢市の架空の駅案内。次の列車が四両という表示を見た客が、普段の六号車位置との違いを聞き、同行者にも待つ位置を伝え直す。編成、乗車位置と案内は架空。施設、設備、表示と担当者の対応は架空の教材設定で、実施設の運用や条件を保証しない。",
  "turns": [
    "次の列車の乗車位置について、お尋ねですか。",
    "いつも六号車の所で待っていますが、次の列車は四両と表示されています。今日はどこで待てばよいでしょうか。",
    "次の列車はこちらの四両の案内です。後ろの車両をご希望でしたら、四号車の表示をご確認ください。",
    "一番後ろに乗りたいです。六号車の表示をそのまま使わず、四号車の場所へ移ればよいのですね。",
    "はい。こちらの案内図で、四号車の位置をご確認いただけます。",
    "図の位置が分かりました。友人には六号車で待つと送ったので、四号車へ変えると連絡します。",
    "お連れの方が、もうホームにいらっしゃるかも確認してください。",
    "友人はまだ駅へ来る途中です。間違った所で探さないよう、この四号車の表示の写真も送ります。",
    "列車が来るまでは、通路を空けて表示の付近でお待ちください。",
    "写真を送りました。今日は四両で、待つのは四号車の所と確認できました。友人が来たら一緒に表示を見ます。",
    "それでは、こちらの乗車位置へどうぞ。お二人ともお気をつけてご乗車ください。"
  ],
  "tasks": [
    [
      "sc_loc_jp_23220_01_001_goal_1",
      "次列車四両と普段六号車位置の違いを示し待機位置を尋ねる"
    ],
    [
      "sc_loc_jp_23220_01_001_goal_2",
      "最後尾希望を伝え四号車の表示へ移ると確認する"
    ],
    [
      "sc_loc_jp_23220_01_001_goal_3",
      "案内図で位置を見つけ友人へ待機位置変更を連絡する"
    ],
    [
      "sc_loc_jp_23220_01_001_goal_4",
      "友人は未到着と伝え四号車表示写真を送る"
    ],
    [
      "sc_loc_jp_23220_01_001_goal_5",
      "四両と四号車を確認し友人合流後も表示を見ると述べる"
    ]
  ]
}
```

### SC-LOC-JP-23232-04-001

```json
{
  "title": "外国免許の日本語訳と旅券で氏名が違うため相談先を聞く",
  "premise": "愛西市の架空の警察案内。外国免許の日本語訳で氏名の一部が抜けているように見える本人が、原本と旅券を変更せず担当へ照合相談を求める。運転資格や翻訳の有効性を判定しない。施設、設備、表示と担当者の対応は架空の教材設定で、実施設の運用や条件を保証しない。",
  "turns": [
    "免許に関する書類について、ご相談ですか。",
    "外国の免許の日本語訳を受け取りましたが、旅券と比べると名前の一部がありません。どこで確認すればよいでしょうか。",
    "免許を担当する窓口をご案内します。原本と日本語訳はお持ちですか。",
    "両方あります。旅券には家族の名前が二つありますが、日本語訳には一つだけです。自分で書き足さず持ってきました。",
    "書類の表記の違いを、担当へお見せください。訳を作成した所の資料もありますか。",
    "受け取った時の控えがあります。作成した所へ聞く前に、どの部分を確認してもらう必要があるか整理したいです。",
    "担当が書類を見て、必要な確認先をご案内します。",
    "お願いします。友人の車を運転する話もありましたが、この書類が使えるか分からないので、まだ約束していません。",
    "運転できるかの条件も含め、担当へご確認ください。",
    "原本、日本語訳、旅券と控えを一緒に見せます。名前の違いと運転の条件を確認してから、友人へ返事をします。",
    "それでは、免許を担当する窓口へご案内します。資料をお持ちください。失礼いたします。"
  ],
  "tasks": [
    [
      "sc_loc_jp_23232_04_001_goal_1",
      "外国免許日本語訳で旅券の氏名一部が抜けて見えると相談する"
    ],
    [
      "sc_loc_jp_23232_04_001_goal_2",
      "原本訳旅券を示し二つの家族名と訳の一つを改変せず説明する"
    ],
    [
      "sc_loc_jp_23232_04_001_goal_3",
      "訳作成時の控えを提示し作成元へ確認する箇所を整理したいと述べる"
    ],
    [
      "sc_loc_jp_23232_04_001_goal_4",
      "書類の扱い未確認で友人車の運転をまだ約束していないと説明する"
    ],
    [
      "sc_loc_jp_23232_04_001_goal_5",
      "四資料を照合し氏名差と運転条件を確認後友人へ回答する"
    ]
  ]
}
```

First new Inazawa01 attempt retained friend rendezvous/photo correction too close to full-read Fuji02 and current Chiryu01; final removes all friend/message steps. First new Aisai04 attempt used a document-name mismatch too close to full-read Chita02; final uses foreign renewal pending/original absent versus saved old photo and postpones friend driving commitment.

## Final author decisions

Read AGENTS and full startup afresh, current PRF023 checkpoint and input manifest; verified real branch/repository/remotes and working tree. Baseline790e5bd8356e5926faa867aa332b08b6ebb8fc05 equals local remote-tracking HEAD at startup. Existing concurrent work preserved. All37 source titles/premises/407 turns/185 goals read fully, with effective roles. Nine complete11-turn/5-goal replacements; eight narrow title/wording/closure corrections; remaining20 retained. No runtime, metadata, UI or translation edits.

Final source SHA-256: `572cea4c34bd5921e73fdf00cce3f4111bacf6ac05faede8dbaf7f26d0e748c4`. No native/human/operator-policy/device/release approval. Parent handles independent review, integration and remote persistence.

| Scenario | Decision | Reason | Current entry SHA-256 | Effective role |
|---|---|---|---|---|
| SC-AIC-ANJO-001 | NARROW CORRECTION | Title aligned post-tour calf feeding observation; access and next experience remain pending. | 23ef32d99ce49bf29ac1fbf093685a3aac0d31d5d2eefcd3496c20de491c0836 | Nature/Farmer |
| SC-LOC-AIC-ANJO-04-001 | RETAIN | Bakery delivery boxes retained for customer orders; display preparation uses designated stock. | cfc2dac457c0f75d5851c5eaf7725003ef473bd43c5d57df91c4174786538179 | Restaurant/Baker |
| SC-LOC-AIC-ANJO-05-001 | RETAIN | Privacy before sharing domestic problem; loud calls, family phone and notifications all expressly confirmed. | 7519cd576a61271c5c3c8b82a5aa22d03ac84ea0e02d7ccdb3905ea2cfd54ecd | Government Office/Government Officer |
| SC-LOC-AIC-ANJO-06-001 | REWRITE | Removed contrived friend-material substitute; actual injury left-food state, seating and later observation change. | 6daf3187d443b2bafa192a8fa7cd615e04f07b0893495dcda4f0a9e0e85c38e0 | Classroom/Teacher |
| SC-LOC-AIC-ANJO-07-001 | RETAIN | Vomiting after medicine, timing and no extra dose communicated without dosage decision. | eb6e39c8df73fc5024d25cd69dd57f7f1eed1f86a78ebe381abacf04335e9127 | Pharmacy/Pharmacist |
| SC-LOC-AIC-ANJO-08-001 | RETAIN | One same box now at counter; prior pickup booking cancellation separately confirmed. | 2dfd6bf5b8a7664ece30bf977425fa1980782b768d8f0b49f03dbf2e61f5e3c9 | Post Office/Postal Clerk |
| SC-LOC-JP-23209-01-001 | NARROW CORRECTION | Map identifies destination, written suspended-service notice and pending alternative travel. | fc99ff7a73465fc5a43d982e7b201207d38080529f91850630f1c6282b0d54e0 | Station/Station Staff |
| SC-LOC-JP-23209-02-001 | NARROW CORRECTION | Fixed weekday after-school need differs from variable shift schedule; forms and timing pending. | fe5511a1336a399e9254134cd0711a9574bcde01abe112374dd6ed4cf780bca8 | Government Office/Government Officer |
| SC-LOC-JP-23209-03-001 | RETAIN | Own home breathing device, unused power and accessories reported to nurse before setup. | 6a2da72ec6921a5d7e8b9bdf7aeb6fd4e7b516cbe3fe91d7ac86aa2bd82aebd9 | Hospital/Nurse |
| SC-LOC-JP-23209-04-001 | RETAIN | Work blade transport purpose and holiday storage discussed without legal clearance. | 34a886f5c87607947086ede722d1dbf15f49a6c7dd2a6bd83e3a291c37da3e8b | Police Station/Police |
| SC-LOC-JP-23209-05-001 | REWRITE | Full replacement of mis-enclosed already-posted documents plot: existing120 print order, extra30 same text, total150, status/cost/Friday timing pending. | 4cb8cbf37ceba8adf5c555de66f67fedcdab2c844dbcdd1b61be27a0765f7df1 | Post Office/Postal Clerk |
| SC-LOC-JP-23209-06-001 | RETAIN | Old-device app not updated; own-account inquiry and next visit material preparation. | 18bef56a6c564d7e76de20d8169c66b553ec8c9913bf2226589e0e06163d96b8 | Bank/Bank Clerk |
| SC-LOC-JP-23209-08-001 | RETAIN | Mother cannot stand long; seating/event support and her own preference determine participation. | ccf85a9abff2f38ae44317be1d2f38fc63d98d0385e386adaa65d47233ab91f0 | Park/Park Staff |
| SC-LOC-JP-23220-01-001 | REWRITE | Full replacement of odor/fire report: short4-car train versus usual6-car mark; train length vs car number and stop range clarified; all friend rendezvous steps rejected. | 7b013cc555a1f95c4b044b18ab24c979280f54e562263b7f35d792d7a881dd2b | Station/Station Staff |
| SC-LOC-JP-23220-02-001 | RETAIN | Remaining occupant queries water account in departed cotenant name, own payment and contact conditions. | c965ed6c5ef4de49b8056d58fcd19cdd3225e3b77b263c385456d0f60de12bcf | Government Office/Government Officer |
| SC-LOC-JP-23220-03-001 | RETAIN | Present near-faintness before blood draw reported from chair; no assumption of anxiety-only cause. | 5aaf2a5bd4c0770947553f6eb57ff7403dc07be3a956464ba5c80127f4c6a9ef | Hospital/Nurse |
| SC-LOC-JP-23220-04-001 | RETAIN | Traffic witness parked safely; original dashcam handling and device manual separated from policing. | ceea17401d4a8bcb351b7111b69729ecb15858e648a0f3b32831cebe360a0d60 | Police Station/Police |
| SC-LOC-JP-23220-05-001 | REWRITE | Full restructuring of plant dispatch: mistaken15-cm pot vs60-cm whole plant vs35-cm box; new width/photo consultation, no recipient absence/arrival-guarantee chain. | 0679d0e7931f321ff80a220079f544f535caf005d1c8f535821eafe918bd502c | Post Office/Postal Clerk |
| SC-LOC-JP-23220-06-001 | RETAIN | Deceased father account documents and family preparation referred without inheritance authorization. | e1da83edafbc19a83c17f25ac59e9a9c253bb1eec98b46853fb89915257e5099 | Bank/Bank Clerk |
| SC-LOC-JP-23220-07-001 | REWRITE | Removed unprompted counter-resume denial; staffing advertisement, classes, evening3day availability and phone受付 window practical. | 89656661f06992659657735a7b5f28a4f0394bc2b89699ee4d6e1d35b485a4e0 | Supermarket/Supermarket Staff |
| SC-LOC-JP-23220-08-001 | RETAIN | Missing hearing aid in mower zone; visible communication and boundary-aware search referral. | 39a6a05a0cee3ca8df832ea6641d5774b14fe5f0330f9056f8e444cab4d4d8df | Park/Park Staff |
| SC-LOC-JP-23226-01-001 | RETAIN | Phone on tracks, observed position/appearance, staff retrieval and separate friend contact concern. | 7a02d9290270242dbea6eaae6a969097229af17f653e7745d3896acd585cca5e | Station/Station Staff |
| SC-LOC-JP-23226-02-001 | NARROW CORRECTION | Preparedness cats2/carrier1 and shy cat; refuge conditions not assumed. | e823f69b26a4311e697e8e71eb0ac437bc028b3fa77817b18efcfa77cfd36b7e | Government Office/Government Officer |
| SC-LOC-JP-23226-04-001 | RETAIN | Father late from shopping, phone at home, blue jacket and recent getting-lost episode stated. | 87b1c66a5c384f85ad1f5a6cc320663db785735629cd09b7e47f48561591c071 | Police Station/Police |
| SC-LOC-JP-23226-06-001 | REWRITE | Removed repeated denial of immediate safe-box use; Tuesday-morning availability, family comparison and fee/availability inquiry. | 5982c4c396af4ac79dc62c40ba604adc43f95f218620c356dc49ebfb65006f53 | Bank/Bank Clerk |
| SC-LOC-JP-23226-07-001 | NARROW CORRECTION | Broken fridge changes chilled foods before payment while everyday supplies retained. | eee0f087c3caf3f2e9e5b084e173e72c3566c38fc78b092e2e3dd543bba652e4 | Supermarket/Supermarket Staff |
| SC-LOC-JP-23226-08-001 | RETAIN | Night stargazing torch brightness/movement and return route coordinated with event staff. | 1c451b2922cae7c6c70f8a1dd340d427043beeb5204de215f3af346c6b92a2e9 | Park/Park Staff |
| SC-LOC-JP-23232-01-001 | RETAIN | Unwanted touch on platform; private disclosure, no return alone and limited employer message. | 76aee4d4e42867553f55c7350962bb662aa765ac8392de762c0a230a3dec9757 | Station/Station Staff |
| SC-LOC-JP-23232-02-001 | NARROW CORRECTION | Foreign marriage originals and informal Japanese memo distinguished, spouse attendance conditions pending. | 71a445df8f2d7c7bbc413e7aaed682df861f791688c424e7f44e61eaeb2c298a | Government Office/Government Officer |
| SC-LOC-JP-23232-03-001 | RETAIN | Prior post-injection rash facts reported with cause/drug name unconfirmed. | 5ec4499ddc67baa5793473223aa2c96fbffd409e4748bbeaf5ae71218b1c351a | Hospital/Nurse |
| SC-LOC-JP-23232-04-001 | REWRITE | Full replacement of generic foreign-license check; pending foreign renewal/original absent versus saved old photograph and renewal receipt; timing/preparation and friend driving commitment deferred. | 88fe6c7eff926efa4ba48af82735672f53dc8dbed276fb8a76b1e2c677b48db2 | Police Station/Police |
| SC-LOC-JP-23232-05-001 | NARROW CORRECTION | Carrier-label proxy inquiry retained; unsupported international title/goal qualifier removed, unopened unknown contents confirmed with friend before correct carrier. | faad66d8170eef9a959197e64329ca8c5347e9600ab77a88baa1833258ef8944 | Post Office/Postal Clerk |
| SC-LOC-JP-23232-06-001 | REWRITE | Changed repetitive explain-only exchange into contract evidence, current debit state and separate future-change questions, household calculation after leaflet. | 68f1db8a4726f8c4eaaf3e69316e0dabcff9f993ad531657d080b360b71616d9 | Bank/Bank Clerk |
| SC-LOC-JP-23232-07-001 | NARROW CORRECTION | Own container refused under fictional prepackaged-fish policy; dry own carry bag preserves retailer wrapping. | 01b62a21d8586236d4a98f2e1f785f09b56ea8dd8665d5942d2ecb64b7fe3268 | Supermarket/Supermarket Staff |
| SC-LOC-JP-23232-08-001 | RETAIN | Event organizer asks tent stakes/size/wind and diagram before venue/invitations. | 91799ef9c186c8ca77a4b6bb6100e4990507ef5fba6d9d6afa31f8def31d560f | Park/Park Staff |
| SC-LOC-JP-23238-02-001 | RETAIN | Unemployment living cost first, job-search second; current paperwork and pending missing documents. | e4bfbed5617b91e6e31e40fea6094feb586f7358092a940ade66f0761864ec6f | Government Office/Government Officer |
| SC-LOC-JP-23238-03-001 | REWRITE | Removed imagined baby-alone search/cancellation; actual own visit queue, one-parent transport route and return-desk contact pending. | bcbe0a474f689cfdfb1f12a5eb19354c4413bb3f98d486c1c932ba1700666a86 | Hospital/Nurse |

## Actual comparisons and rejected plots

Full selected prior scripts read independently in this authoring task: SC-LOC-GIF-GERO-02-001; SC-LOC-JP-20207-01-001; SC-LOC-JP-20208-05-001; SC-LOC-JP-20204-04-001; SC-LOC-JP-21214-03-001; SC-LOC-JP-19213-07-001; SC-LOC-JP-21206-03-001; SC-LOC-JP-22208-02-001; SC-LOC-TTR-IWAMI-06-001; SC-LOC-JP-23205-06-001; SC-LOC-GIF-OGAKI-02-001; SC-NGN-UEDA-001; SC-LOC-JP-08219-03-001; SC-LOC-015-07-001; SC-LOC-JP-21212-08-001; SC-LOC-JP-22224-06-001; SC-LOC-JP-08236-05-001; SC-LOC-JP-21206-02-001; SC-LOC-004-01-001 (source author bundle); SC-LOC-SZO-FUJI-02-001; SC-LOC-JP-20213-07-001; SC-LOC-FKS-AIZUWAKAMATSU-07-001.

Full peer scripts read:23231-05,23237-02,23204-05,23233-06,23221-02,23223-03,23224-02,23225-01,23221-05,23221-07. All four peer bundles titles/IDs screened; selected full scripts and current runtime317 were covered by mechanical lexical/exact screening. This does not mean every prior or peer scene was manually read.

Concrete findings: original Hekinan05 mis-enclosed posted documents repeats Tahara05 (and pre-posting Owariasahi23204-05 cousin); replaced all11 and5. Original Inazawa01 odor/no fire/do-not-touch/companion safe/hand-off repeats Gero02; replaced whole plot. First replacement4-car scene unnecessarily repeated Fuji02/Chiryu01 friend-position/message chain; discarded full variant above, final focuses short train stopping range and length versus car number without friend steps. Generic foreign-license conditions enquiry repeats Iwami06; initial document-name replacement was too close to Chita02 evidence mismatch, so discarded full variant and final separates actual foreign renewal pending/old-photo/current-original status. Original potplant plan copied cut-flower recipient absence/no-arrival-guarantee sequence from Hitachiomiya08236-05; final retains only plant knowledge and develops dimensional measurement error,60vs35cm box and photo/full-width consultation. Fish own-container initial refusal shares Yamanashi19213-07 wording/topic but final prepackaged-fish handling and unopened tray differs from choosing bean types/weight/bag-number and two independent weighed bags; no weight-tare scenario. Hekinan childcare fixed Monday-Friday late finish differs from variable shift dates/unknown second-half roster. Inazawa current faintness differs from Toyoake prior needle-fear but presently well. Nagakute nursing leave/return consultation differs from Kaizu hearing assistance and Ama keeping calls audible while staying in same room. Anjo domestic privacy/family notification differs from Toyoake bank amount spoken aloud; safe-box availability differs from term-deposit maturity handling.

## Mechanical verification and limitations

37 IDs/order equal manifest; all407 turns and185 goal IDs preserved in number;185 unique Player answers and185 unique goal texts. Exact screening across7128 readonly shared runtime packages finds no utterance collision touching current37 outside own IDs. Four peer frozen bundles have no exact Player answer collision with current37. Nine actual rejected input variants and two discarded authored attempts retained in this report; no invented earlier drafts or candidate rejection counts. Trigram lookup against full readonly corpus and all peer bundles is retrieval only. Whole317 Aichi actual runtime inventory also screened mechanically; unintegrated remaining old drafts are not accepted by their counts.

Parent confirmed four park venues now use Park Staff and will align Aisai station display with source Saya/佐屋駅; categories and progression IDs unchanged. Generic venues and all service conditions remain fictional. This report is authorship evidence for37 only, not independent AI CONTENT PASS, exhaustive semantic uniqueness, whole-prefecture completion or durable proof.

Independent group03 second reading resolved Nagakute03 NPC9: explicit window to approach after return replaces ambiguous contact destination wording. Parent has aligned Anjo06 effective cooking-class role Classroom/Teacher and Aisai station display Saya/佐屋駅; sources/runtime remain outside this child edits. Final source SHA-256: `572cea4c34bd5921e73fdf00cce3f4111bacf6ac05faede8dbaf7f26d0e748c4`.
