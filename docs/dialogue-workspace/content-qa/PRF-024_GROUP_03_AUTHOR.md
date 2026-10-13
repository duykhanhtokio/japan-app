# PRF-024 group 03 — author evidence

Authored 24 assigned canonical scenarios, Yokkaichi / Kuwana / Suzuka, with 264 alternating Japanese turns and 120 scenario-specific Player goals. Source SHA-256: `37132c5ce7b6dcc031d986e0ae22639688a0be6d58b0e816a91d3f2cf84ddc27`. This is author evidence, not independent peer approval, native approval, runtime integration, or remote durability proof.

Read AGENTS.md and the complete session-start guide; UI lock rules and V10 checkpoint; PRF-023 checkpoint including final editorial gate. Actual HEAD and origin/recovery HEAD both 7ae6b6b53598a9fc20db5095fea6a4fed0ef47ca. The parent assigned an isolated work/mie-20261014 branch. Existing input bundles were preserved. The two new output files were absent before this work.

Read all 24 full previous exchanges from PRF-024_GROUP_03_INPUT.json. Those old dialogues repeatedly use hospital medical-form clarification, station accessibility, post-office sending conditions, bank transfer information, and park walking routes. All were replaced with separate situation-specific incidents. No old utterance was transplanted.

Selected prior authoring comparisons below were read in full, including all eleven turns and all five goals. File group numbers refer to `scripts/dialogue-authoring/prf-023-final-remainder-group-XX.json`.

| Prior full exchange | Current comparison and conclusion |
|---|---|
| group03 SC-LOC-JP-23231-03-001, unable to eat before medication consultation | Yokkaichi05 concerns friend-interpreter departure, phone ownership and explanation handoff. No medication/meal plot reused. |
| group04 SC-LOC-JP-23220-04-001, threatened overwrite of traffic video | Suzuka04 concerns auditory evidence, later clock reading, no collision witnessed and uncertain colour. No video preservation, operator instructions or clipping plot. |
| group04 SC-LOC-JP-23226-08-001, light use at stargazing | Kuwana08 concerns used water from a watercolour activity; Suzuka08 concerns missing stamp sheet and separation of past marks from present mark. Neither uses lighting, darkness or observation-route plot. |
| group05 SC-LOC-JP-23204-01-001, split-train carriage destinations and friend in wrong carriage | Yokkaichi02 concerns next/first departure display and stop pattern; Suzuka01 concerns temporary exit vs permanent exit and one person remaining still. No split train/carriage relocation plot. |
| group05 SC-LOC-JP-23204-06-001, first passbook entry with debit/credit/balance columns | Yokkaichi08 concerns unupdated physical record after an incoming-payment message, distinguishing nonprinting from nonpayment. No reading debit/balance columns or salary-row identification exercise. |
| group05 SC-LOC-JP-23213-04-001, bicycle key lost while bicycle remains | Kuwana04 concerns a picked-up key initially mistaken for one's lost key, physical comparison, separate discovery/last-use places and returning another person's property first. No bicycle-recovery/spare-key plan reused. |
| group05 SC-LOC-JP-23227-05-001, sealed employer parcel with unknown contents | Kuwana05 concerns unopened wrong-addressee mail at one's own address. No sender's content confirmation or shipment acceptance plot. |
| group05 SC-LOC-JP-23227-08-001, novice flowerbed participation without tools | Kuwana08 concerns collecting pigment water and keeping it out of drinking-water facilities/flowerbeds. No gardening recruitment or weather/borrowed-tools plot. |

The first attempted prior-file paths (`prf-023-final-group-03.json`, `prf-023-continuation-group-03.json`) did not exist; they were not read. A subsequent title-only inventory was used to choose relevant full exchanges. The title inventory is not counted as full semantic review.

No complete authored draft was rejected in this author's pass; no imaginary rejected exchange or invented review is claimed. All assigned old recipe exchanges were replaced, and the selected comparisons above did not require a further rewrite. Peer review may still identify semantic overlap elsewhere; no exhaustive semantic uniqueness against every prior script is claimed.

Roles for parent integration: Yokkaichi01 requires Construction Site / construction foreman or worker (concrete placement before pouring), not Factory Worker. Yokkaichi07 requires Museum / Museum Staff (replica vs original), not Librarian/Teacher. Yokkaichi06 is municipal employment-consultation desk / Job Counselor. Both parks need Park Staff, rather than a generic Community Staff. Other assigned categories/roles fit their exchanges. All premises explicitly identify fictional service conditions; no real timetables, policy guarantees, medical decision, or bank eligibility claim is made.

Local mechanical check: all 24 exact assigned IDs present, eleven turns each, five goals each, 120 distinct Player utterances and 120 distinct goal texts. Exact Player comparison against readable prior dictionary-shaped author JSON returned zero collisions. This is an exact string check only, not corpus semantic proof. Source/runtime/shared metadata remain untouched by this worker; the parent owns integration and independent checks.

## Parent reread: actual rejected complete variants

The parent identified the actual venue names as 四日市精密部品検査室 and 四日市図書館カウンター. Categories in the input were wrong. My initial category-first readings were incorrect; Factory and Library corrections stand. The parent also directed a full comparison with Shizuoka customer-reference banking. The following actual drafts are rejected in full and replaced.

```json
{
  "SC-MIE-YOKKAICHI-001": {
    "title": "コンクリート打設前に埋め込み部品の位置違いを報告する",
    "premise": "四日市市を舞台にした架空の日本語学習場面。コンクリート打設前に埋め込み部品の位置違いを報告する。登場する施設、物品、手順、職員の対応は教材上の創作であり、実在施設の運用や専門判断を示さない。",
    "turns": [
      "打設前の見回りは終わりましたか。",
      "まだ一か所気になります。壁の埋め込み部品が、図面では右側なのに左側にあります。",
      "どの壁か、図面の番号で教えてください。私も確認します。",
      "三番の壁です。図面には改訂の印があるので、古い図を見ている可能性もあります。",
      "私の図面と版を合わせましょう。部品を動かしたり、打設を始めたりはしないでください。",
      "この紙は昨日受け取りました。右上の改訂日は月曜日です。責任者が持つ図と照合したいです。",
      "責任者を呼びます。その間、打設担当には確認中だと伝えてください。",
      "担当には、位置の相違があり確認を待っていると伝えます。不良と断定して伝えてよいですか。",
      "まだ断定はしません。見た位置と図の違いを分けて報告しましょう。",
      "現物は左、手元の図は右と報告します。責任者の確認が済むまで、ここで待ちます。",
      "私も立ち会います。まず責任者へ連絡しますので、いったん失礼します。"
    ],
    "tasks": [
      [
        "sc_mie_yokkaichi_001_goal_1",
        "現物と図面の位置相違を報告する"
      ],
      [
        "sc_mie_yokkaichi_001_goal_2",
        "壁番号と図面改訂の可能性を示す"
      ],
      [
        "sc_mie_yokkaichi_001_goal_3",
        "手元の版を責任者の図と照合したいと頼む"
      ],
      [
        "sc_mie_yokkaichi_001_goal_4",
        "打設担当への連絡内容と断定の可否を尋ねる"
      ],
      [
        "sc_mie_yokkaichi_001_goal_5",
        "観察事実を分けて確認待ちを伝える"
      ]
    ]
  },
  "SC-LOC-MIE-YOKKAICHI-07-001": {
    "title": "展示品の複製と原資料を区別して見学する",
    "premise": "四日市市を舞台にした架空の日本語学習場面。展示品の複製と原資料を区別して見学する。登場する施設、物品、手順、職員の対応は教材上の創作であり、実在施設の運用や専門判断を示さない。",
    "turns": [
      "この模型の説明で気になることがありますか。",
      "ガラスの中の道具は、昔の工場で実際に使われた物ですか。そばの札には「複製」とあります。",
      "こちらは原資料を基に作った展示用の複製です。実際に使われた原資料とは分けています。",
      "形は昔の物を再現していても、この物自体が昔からあるわけではないのですね。",
      "はい。製作された時期と、再現している時代は説明札の別の欄にあります。",
      "二つの日付を一つだと思っていました。再現した時代を見学ノートへ書きたいです。",
      "ノートには「複製」と添えると、現物の年代と混同しにくいですね。",
      "そう書きます。原資料もこの館内に展示されていますか。",
      "今日は原資料の展示はありません。この解説では写真をご覧いただけます。",
      "写真と複製を比べます。原資料を見たとは書かず、複製で構造を学んだとまとめます。",
      "その区別でご覧ください。それでは、続きの展示もお楽しみください。"
    ],
    "tasks": [
      [
        "sc_loc_mie_yokkaichi_07_001_goal_1",
        "展示道具が実物か複製か尋ねる"
      ],
      [
        "sc_loc_mie_yokkaichi_07_001_goal_2",
        "再現形状と物自体の年代を区別する"
      ],
      [
        "sc_loc_mie_yokkaichi_07_001_goal_3",
        "二つの日付の読み違いを修正する"
      ],
      [
        "sc_loc_mie_yokkaichi_07_001_goal_4",
        "複製と記録し原資料展示の有無を聞く"
      ],
      [
        "sc_loc_mie_yokkaichi_07_001_goal_5",
        "写真比較の結果を実物見学と混同せず記録する"
      ]
    ]
  },
  "SC-LOC-JP-24207-06-001": {
    "title": "振込依頼の番号が口座番号でなく顧客番号だと気づく",
    "premise": "鈴鹿市を舞台にした架空の日本語学習場面。振込依頼の番号が口座番号でなく顧客番号だと気づく。登場する施設、物品、手順、職員の対応は教材上の創作であり、実在施設の運用や専門判断を示さない。",
    "turns": [
      "振込先の案内はお持ちですか。",
      "はい。この紙に長い番号があり、それを口座番号の欄へ書こうとしていました。",
      "番号の見出しは何と書かれていますか。",
      "「お客様番号」です。別の欄に銀行名と支店名があり、その下にも番号があります。",
      "お客様番号と口座番号は用途が違います。請求元の案内に沿って、それぞれの欄を確認しましょう。",
      "口座番号として使うのは銀行の欄の番号ですね。お客様番号は振込人の名前に付ける指定かもしれません。",
      "指定が読めない時は、請求元へ確かめてください。こちらではその請求の指定を決められません。",
      "請求元へ電話します。長い番号を適当に短くして入力せず、どこへ入れる番号か聞きます。",
      "確認を終えてから手続きを始めましょう。まだ振込は実行していませんね。",
      "まだです。口座情報と顧客番号の用途が分かるまで、用紙も提出しません。",
      "では、確認後に改めてお声がけください。本日のご相談ありがとうございました。失礼します。"
    ],
    "tasks": [
      [
        "sc_loc_jp_24207_06_001_goal_1",
        "長い番号を口座番号へ書こうとしたと相談する"
      ],
      [
        "sc_loc_jp_24207_06_001_goal_2",
        "見出しと銀行欄の別番号を示す"
      ],
      [
        "sc_loc_jp_24207_06_001_goal_3",
        "口座番号と顧客番号の用途を区別する"
      ],
      [
        "sc_loc_jp_24207_06_001_goal_4",
        "番号を省略せず請求元へ入力先を尋ねる"
      ],
      [
        "sc_loc_jp_24207_06_001_goal_5",
        "未実行と用途確認まで提出保留を伝える"
      ]
    ]
  }
}
```

Read in full `scripts/dialogue-authoring/prf-022-cluster-06-shimoda.json` SC-LOC-JP-22219-06-001, eleven turns/five goals. Its specified customer number before the payer name shares the customer-reference remittance subject with the rejected Suzuka06; replaced the complete remittance plot with privacy-sensitive in-person account enquiry and numbered, neutral call-up. Factory01 now deals with unstable repeated measurement, earlier decisions held, no unapproved adjustment or record overwrite. Library07 now deals with adhesive notes left in a borrowed book, fragile page movement, product/locations and staff examination. These are complete rewrites, not label-only changes. Earlier evidence paragraph saying no complete drafts were rejected is superseded by these three actual full rejections.

Current source SHA-256: `875fc23dfd22f553d2eae535aa293ed6d12ecc3a90e61e05ab25a1acc64c1bda`.

## Cross-group rejection reported by parent

Parent full cross-group reading found that Kuwana04 repeats the picked-up-object ownership-disambiguation causality in Tsu11/Matsusaka04. I have not read those complete counterparts; this evidence reports the parent finding rather than claiming an independent read. Actual rejected Kuwana04 follows:

```json
{
  "SC-LOC-JP-24205-04-001": {
    "title": "鍵を拾った場所と自分の落とした場所を区別して届ける",
    "premise": "桑名市を舞台にした架空の日本語学習場面。鍵を拾った場所と自分の落とした場所を区別して届ける。登場する施設、物品、手順、職員の対応は教材上の創作であり、実在施設の運用や専門判断を示さない。",
    "turns": [
      "お持ちになった物の届け出でしょうか。",
      "はい。この鍵を公園で拾いました。私も別の鍵をなくしているので、自分のかと思って持ち帰りました。",
      "拾った鍵がご自身の物でないと分かった理由を教えてください。",
      "自宅の写真には丸い札が付いていますが、拾った鍵には四角い札があります。形も違いました。",
      "では、拾得物として状況を伺います。拾った場所と時刻は分かりますか。",
      "昨日の夕方、池のそばのベンチです。自分の鍵を最後に使ったのは、駅の駐輪場でした。",
      "二つの場所は分けて記録します。ご自身の鍵についての相談も、この後できます。",
      "まず拾った鍵を届けます。自分の鍵だと思ったことを理由に、これを持ち続けたくありません。",
      "承知しました。拾ってからここまでの経過も教えてください。",
      "自宅で写真と比べて別物と分かり、今日は袋に入れて持ってきました。届け終えたら、自分の鍵の相談をします。",
      "順番にお話を伺います。それでは、届け出の担当へご案内します。失礼します。"
    ],
    "tasks": [
      [
        "sc_loc_jp_24205_04_001_goal_1",
        "拾得鍵と自分の紛失を併せて説明する"
      ],
      [
        "sc_loc_jp_24205_04_001_goal_2",
        "札と形を比較して自分の物でないと示す"
      ],
      [
        "sc_loc_jp_24205_04_001_goal_3",
        "拾得場所と自分の最終使用場所を分ける"
      ],
      [
        "sc_loc_jp_24205_04_001_goal_4",
        "先に拾得鍵を届けると決める"
      ],
      [
        "sc_loc_jp_24205_04_001_goal_5",
        "持ち帰り後の照合経過と相談順を伝える"
      ]
    ]
  }
}
```

Read the complete current Ise03, SC-LOC-MIE-ISE-03-001, in group02 author source, eleven turns and five goals. Both that plot and Yokkaichi04 use extra noodles vs a separate companion meal; rejected complete Yokkaichi04 below and replaced with a time-limited cancellation discussion already partly in cooking.

```json
{
  "SC-LOC-MIE-YOKKAICHI-04-001": {
    "title": "替え玉と新しい一杯を区別して注文する",
    "premise": "四日市市を舞台にした架空の日本語学習場面。替え玉と新しい一杯を区別して注文する。登場する施設、物品、手順、職員の対応は教材上の創作であり、実在施設の運用や専門判断を示さない。",
    "turns": [
      "食券の追加についてお尋ねですか。",
      "はい。「替え玉」は別のラーメンが一杯出てくる意味ですか。友人の分を買おうと思っています。",
      "この店の設定では、替え玉は今のお客様の丼へ追加する麺です。スープ付きの一杯とは違います。",
      "友人はまだ注文していません。友人の食事なら、通常のラーメンの券を買うのですね。",
      "そのとおりです。友人は席にいらっしゃいますか。",
      "入口で待っています。私の替え玉として出されないよう、友人の一杯だと伝えたいです。",
      "通常の券を受け取る際に、別のお客様の注文として扱います。",
      "それなら友人が自分で券を渡します。私は今の一杯で十分なので、麺の追加はありません。",
      "承知しました。ご友人が来るまで、入口の通路は空けておいてください。",
      "横の待機場所へ呼びます。替え玉の券を先に買わずに確認できてよかったです。",
      "ご友人のご注文をお待ちしております。それでは、ごゆっくりどうぞ。"
    ],
    "tasks": [
      [
        "sc_loc_mie_yokkaichi_04_001_goal_1",
        "替え玉が別の一杯か質問する"
      ],
      [
        "sc_loc_mie_yokkaichi_04_001_goal_2",
        "未注文の友人には通常券が必要と確認する"
      ],
      [
        "sc_loc_mie_yokkaichi_04_001_goal_3",
        "友人用の食事と自分の追加を区別したいと述べる"
      ],
      [
        "sc_loc_mie_yokkaichi_04_001_goal_4",
        "券は友人が渡し自分の麺追加は不要と伝える"
      ],
      [
        "sc_loc_mie_yokkaichi_04_001_goal_5",
        "友人を待機場所へ呼ぶと話す"
      ]
    ]
  }
}
```

Final author repairs source SHA-256: `6c1bcbd6ec4355563756bc3ed59a94d7eb365895bb1b0425eaa39f90ec1abd7c`. Five complete original variants are retained as rejected evidence: factory01, library07, bankSuzuka06, policeKuwana04 and ramenYokkaichi04.

## Peer02 prior-corpus cart rejection

Read in full Ninohe SC-LOC-JP-03213-07-001 from `prf-003-final-causal-rewrites.json`, all eleven turns/five goals: heavy purchases, prohibited offsite cart, alternative transport and cart return. Despite different endpoint and transport sequence, the same causal mechanism is present; rejected Suzuka07 in full. Also read in full Kimitsu SC-LOC-JP-12216-01-001 from `prf-012-cty-jp-12216.json`: stamp outside ticket gate, seven-minute constraint, check ticket then postpone until return. Kuwana01 uses a luggage locker and later outward departure instead of stamping after return, but both share short layover/gate exit/alternative timing. To avoid a noun-swap risk, both will receive complete unrelated replacements.

```json
{
  "SC-LOC-JP-24207-07-001": {
    "title": "店内用カートを持ち出さず車までの運び方を組み直す",
    "premise": "鈴鹿市を舞台にした架空の日本語学習場面。店内用カートを持ち出さず車までの運び方を組み直す。登場する施設、物品、手順、職員の対応は教材上の創作であり、実在施設の運用や専門判断を示さない。",
    "turns": [
      "お買い上げの箱を運ぶ方法でお困りですか。",
      "水の箱が重いので、このカートに載せたまま向かいの駐車場へ行きたいです。",
      "この店内用カートは入口までの設定です。向かいの駐車場へは出せません。",
      "駐車場も店の一部だと思っていました。道路を渡るので、店内用では行けないのですね。",
      "車に積むまでの方法を考えましょう。箱を一度に運ばず分けることはできますか。",
      "二箱あるので、一箱ずつ運びます。ただ、もう一箱を通路へ置いておくのは避けたいです。",
      "未搬出の箱は、こちらの受取り台でお預かりできます。ご自身の箱を確認してから戻ってください。",
      "先に一箱を車へ運び、残りはこの台へ置きます。車を入口前の道路に停め直すことはしません。",
      "戻られたら、レシートと箱の数量を照合します。",
      "一箱を運んで戻りました。レシートの二箱のうち残り一箱を受け取り、カートは入口で返します。",
      "残りの箱はこちらです。足元にお気をつけてお帰りください。ありがとうございました。"
    ],
    "tasks": [
      [
        "sc_loc_jp_24207_07_001_goal_1",
        "店内カートで道路向かいまで運びたいと頼む"
      ],
      [
        "sc_loc_jp_24207_07_001_goal_2",
        "別駐車場とカート範囲の誤解を修正する"
      ],
      [
        "sc_loc_jp_24207_07_001_goal_3",
        "二箱を分けるが通路に放置したくないと話す"
      ],
      [
        "sc_loc_jp_24207_07_001_goal_4",
        "受取台保管と路上停車しない運び方を決める"
      ],
      [
        "sc_loc_jp_24207_07_001_goal_5",
        "一箱搬出後に残数量を照合して受け取る"
      ]
    ]
  },
  "SC-LOC-JP-24205-01-001": {
    "title": "改札外のロッカーを使う前に乗換えの時間を組み直す",
    "premise": "桑名市を舞台にした架空の日本語学習場面。改札外のロッカーを使う前に乗換えの時間を組み直す。登場する施設、物品、手順、職員の対応は教材上の創作であり、実在施設の運用や専門判断を示さない。",
    "turns": [
      "荷物を預ける場所をお探しでしょうか。",
      "次の列車まで十五分あります。このロッカーは改札を出ないと使えませんか。",
      "案内図では改札の外にあります。預けた後、また乗車されるのですね。",
      "はい。財布だけ取り出せば、荷物を預けてすぐホームへ戻れると思っていました。",
      "移動と再入場にも時間がかかります。切符の扱いも確認してから出てください。",
      "十五分で全部済ませるのは心配です。次の列車を見送って、余裕のある便に変えたいです。",
      "その場合は、今の切符で利用できる便を確認しましょう。お持ちの券を見せてください。",
      "こちらです。荷物を預けることを優先したいので、まず利用できる後の便を聞きます。",
      "この練習の券では、この後の便も利用できます。時刻を控えてからロッカーへ向かってください。",
      "後の便をメモしました。財布と切符を荷物から取り出し、預けた場所も記録しておきます。",
      "お戻りの際は時間に余裕を持ってお越しください。それでは、いってらっしゃいませ。"
    ],
    "tasks": [
      [
        "sc_loc_jp_24205_01_001_goal_1",
        "改札外ロッカーと乗換え時間を質問する"
      ],
      [
        "sc_loc_jp_24205_01_001_goal_2",
        "荷物預けだけを考え再入場を見落としたと話す"
      ],
      [
        "sc_loc_jp_24205_01_001_goal_3",
        "余裕ある後便へ変更を希望する"
      ],
      [
        "sc_loc_jp_24205_01_001_goal_4",
        "手持ち券で後便利用を確認する"
      ],
      [
        "sc_loc_jp_24205_01_001_goal_5",
        "必要物と預け場所を記録して向かう"
      ]
    ]
  }
}
```

Peer02 title alignment: vegetable title now reflects desired-weight adjustment, deli title reflects reservation-only purchase. Removed fictional-setting metacommentary inside spoken NPC lines; fiction caveats remain in premises. Final source at this stage SHA-256 `0637b67ffc59d265f633c0280c35cda598732a767549564eb7b806484fb81180`. Seven complete rejected scripts are preserved above.

Final peer02 corrections align hospital queue number with 受付票 (not patient card identifier), and make bank numbered-call speech natural. Vegetable/deli premise titles aligned to amended titles. Current final source SHA-256 `53014091d21b85696c72eadf38efaa84cc6fe191354e6e7905c1f4383a11d48f`.
