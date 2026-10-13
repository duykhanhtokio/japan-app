# PRF-025 group03 author evidence

## Actual complete rejected banking drafts

After initial24 creation, read full Yotsukaido12228-06 and Yamagata006-07: closing account with outstanding refund, and stopping rent while keeping salary account. Omihachiman08 closing account before unsettled electricity change reproduces closing-with-pending-transaction causality despite debit rather than refund; wholly rejected. Ritto06 also used postpone-closing pending records, so rejected proactively to avoid repeated account-closure developments in this group. Actual complete drafts follow:

```json
{
  "SC-LOC-SHG-OMIHACHIMAN-08-001": {
    "title": "使用しない口座を閉じる前に毎月の引落し予定を確認する",
    "premise": "近江八幡市を背景にした架空の日本語学習場面。使用しない口座を閉じる前に毎月の引落し予定を確認する。施設、物品、日時、利用条件と職員の対応は教材上の創作であり、実在施設の運用や専門判断を保証しない。",
    "turns": [
      "口座の解約についてのご相談ですね。",
      "引っ越したので使わない口座を閉じたいです。ただ、今月の電気代はこの口座から落ちる予定でした。",
      "引落し先の変更は、もう済んでいますか。",
      "新しい口座を電力会社へ伝えましたが、いつ切り替わるかは聞いていません。今日閉じてよいと思って来ました。",
      "切替えの時期と未処理の取引を確認してから、解約の手続きを相談しましょう。",
      "先に電力会社へ聞きます。新しい口座を伝えた日と、実際にそこから払う月を分けて確認します。",
      "こちらではその会社の変更完了日までは分かりません。確認結果をお持ちください。",
      "今日、残高を全部出すことも待ちます。引落しが残るなら、必要な金額を確かめたいです。",
      "口座の取引を確認する際は、ほかの定期的な支払いも見てください。",
      "通帳でほかの引落しも探します。今日は解約を進めず、支払先の切替えが確認できてから相談します。",
      "では、確認後に改めてご来店ください。本日はありがとうございました。失礼いたします。"
    ],
    "tasks": [
      [
        "sc_loc_shg_omihachiman_08_001_goal_1",
        "解約希望口座に電気代引落し予定が残ると話す"
      ],
      [
        "sc_loc_shg_omihachiman_08_001_goal_2",
        "変更申告済みだが適用時期未確認と説明する"
      ],
      [
        "sc_loc_shg_omihachiman_08_001_goal_3",
        "電力会社へ切替え開始月を尋ねると決める"
      ],
      [
        "sc_loc_shg_omihachiman_08_001_goal_4",
        "全額出金も保留し必要残高を確かめる"
      ],
      [
        "sc_loc_shg_omihachiman_08_001_goal_5",
        "他引落しも調べ本日の解約を延期する"
      ]
    ]
  },
  "SC-LOC-JP-25208-06-001": {
    "title": "別々の口座を統合したいが明細の必要期間を先に相談する",
    "premise": "栗東市を背景にした架空の日本語学習場面。別々の口座を統合したいが明細の必要期間を先に相談する。施設、物品、日時、利用条件と職員の対応は教材上の創作であり、実在施設の運用や専門判断を保証しない。",
    "turns": [
      "口座を整理したいというご相談ですね。",
      "同じ銀行の口座を二つ持っています。一つにまとめたいですが、古い方の取引を来年の書類に使う予定があります。",
      "どの期間の記録が必要なのか、お分かりですか。",
      "今年一年分です。ただ、提出先が紙の通帳でよいか、別の明細を求めるかはまだ聞いていません。",
      "記録の取得方法を確認できます。口座を閉じてから慌てないよう、先に必要な形式を確かめましょう。",
      "口座の残高を移すことと、取引の記録を残すことを別に考えます。今日は解約の書類は出しません。",
      "現在お持ちの記録はどこまでありますか。",
      "通帳は先月まで記帳済みです。家で複写した物もありますが、それで提出条件を満たすとはまだ思っていません。",
      "提出先の回答が分かりましたら、取得できる資料の種類と費用をご案内します。",
      "先に提出先へ一年分の形式を聞きます。口座を整理しても必要な記録が欠けないよう、案内を受けてから進めます。",
      "確認の順序はそれで結構です。それでは、回答が分かりましたらまたご相談ください。失礼します。"
    ],
    "tasks": [
      [
        "sc_loc_jp_25208_06_001_goal_1",
        "二口座整理と古い口座の記録使用予定を話す"
      ],
      [
        "sc_loc_jp_25208_06_001_goal_2",
        "必要期間一年と提出形式未確認を説明する"
      ],
      [
        "sc_loc_jp_25208_06_001_goal_3",
        "残高移動と記録保全を分け解約を保留する"
      ],
      [
        "sc_loc_jp_25208_06_001_goal_4",
        "現記帳範囲と手元コピーの未認定を伝える"
      ],
      [
        "sc_loc_jp_25208_06_001_goal_5",
        "提出先形式確認後に明細取得案内を求める"
      ]
    ]
  }
}
```

Read full Kisarazu SC-LOC-CHB-KISARAZU-07-001: mother's薬袋 taken as own, pause explanation, unconsumed, separate ownership/retell correct explanation. Current Moriyama03 added stale/current remote-photo retrieval, but initial family薬袋 mix-up is the same foundational plot; reject complete draft rather than making mother another relative.

```json
{
  "SC-LOC-JP-25207-03-001": {
    "title": "病院へ持参した薬の袋が家族の物だったと服薬相談前に気づく",
    "premise": "守山市を背景にした架空の日本語学習場面。病院へ持参した薬の袋が家族の物だったと服薬相談前に気づく。施設、物品、日時、利用条件と職員の対応は教材上の創作であり、実在施設の運用や専門判断を保証しない。",
    "turns": [
      "普段お使いのお薬を確認してもよろしいですか。",
      "袋を持ってきましたが、名前を見ると母の薬です。似た袋を並べていたので、自分の物と取り違えました。",
      "その袋の内容をご本人の服薬として記録しないようにします。ご自身の薬の情報は別にありますか。",
      "スマートフォンに自分の薬の写真があります。ただ、去年の写真なので今と同じか確信はありません。",
      "古い写真だけでは現在の内容が分からないこともあります。最近の資料を確認できる方はいらっしゃいますか。",
      "家にいる姉へ連絡できます。自分の袋の名前と日付を読んでもらい、どの資料か分かる写真を頼みます。",
      "確認のため少し待ちましょう。お母様の薬を飲んだというお話ではありませんね。",
      "飲んではいません。持参した袋だけの取り違えです。母の袋はかばんへ戻し、自分の資料が来たら見せます。",
      "届いた資料も、ご自身のお名前と日付を確認してください。",
      "姉から写真が届きました。私の名前で今月の日付です。古い写真でなく、この資料を担当へ見てもらえますか。",
      "では、届いた資料を確認します。知らせてくださりありがとうございます。お大事に。"
    ],
    "tasks": [
      [
        "sc_loc_jp_25207_03_001_goal_1",
        "持参薬袋が母の物だったと申告する"
      ],
      [
        "sc_loc_jp_25207_03_001_goal_2",
        "本人薬の写真は古く現状未確認と説明する"
      ],
      [
        "sc_loc_jp_25207_03_001_goal_3",
        "姉へ氏名日付が分かる本人資料を頼む"
      ],
      [
        "sc_loc_jp_25207_03_001_goal_4",
        "誤服用ではなく袋の取り違えと区別する"
      ],
      [
        "sc_loc_jp_25207_03_001_goal_5",
        "届いた本人氏名今月日付の資料を確認して提示する"
      ]
    ]
  }
}
```

## Reading scope and final author pass

Session continuation read PRF-024_CHECKPOINT and all24 GROUP_03_INPUT previous full11-turn exchanges; preserved completed Mie. Existing earlier-session AGENTS/startup/UI contracts remain in the worker context; parent supplied durable baseline d438d81a6fd71b1ca35e97098184a27946aaa172 and owns the startup/persistence gate. No branch mutation, runtime integration or durable-save claim by this author.

Before writing the new24, retrieved and read in full the following current Mie counterparts including every11turns and five goals:

- `prf-024-group-03.json` SC-MIE-YOKKAICHI-001: repeated measurement instability, hold inspected pieces, no adjust/overwrite. Omihachiman05 instead admits personal clothing contamination on a pre-use tray, separates touched/untouched surfaces and consults hygiene lead; no measuring, previous acceptance decisions or device substitution plot.
- Same file Yokkaichi05: departing friend interpreter with borrowed-phone problem and transition continuity. Ritto02 instead protects a young daughter from translating complex administrative matters and arranges independent support before decision; no interpreter handoff/phone replacement or explanation-resume plot.
- Same file Kuwana04: later witness colour uncertainty and selective correction. Moriyama04 recounts self-blocked passage and angry exchange honestly, no injury/threat inference, wishes to apologise rather than compel apology. Ritto04 distinguishes social-media source from direct witness and avoids invented personal accusation. Neither uses corrected colour/new-memory plot.
- Same file Suzuka07: cold food mistakenly placed ambient, report location rather than refreeze. Moriyama07 instead takes control of a child's suddenly swerving trolley, pauses together and approaches sampling calmly. Ritto07 concerns per-person discounted quantity, no evasion via another register, family substitution consent and final reduced purchase. Neither reuses displaced food state assessment.
- `prf-024-group-04.json` Owase06: declined recording due other voices, segment notes/readback. No new bank script uses recording, note-writing pace or readback. Moriyama06 existing accumulation schedule adjustment is specifically contract-change vs new-contract creation and transition timing.
- Same file Kameyama05: fractured pressed flower, replace content with photograph and envelope. Moriyama05 independently plans shipment departure around absent addressee/homecoming and confirms accommodation storage (not postal custody); Ritto05 family addressee unreachable so condition enquiry without making their receiving choice. No fragile-content replacement/repacking plot.

Further actual full readings after creation: Yamagata006-07, Yotsukaido12228-06, Suzaka20207-06 and Kisarazu pharmacy family-bag confusion, as documented above. Suzaka20207-06 monthly vs four-week semantics differs from Moriyama06 changing an existing debit date after payday shift, no amount change/no second account, exact switch-month count. Kitamoto11233-06 was reread in full: chosen signature style changed with old sample vs identity document; Omihachiman08 injured writing hand, no spouse tracing/代筆 before official-method review, thick pen on separate trial sheet, personal explanation and verification differs in cause and actions. Ritto06 final is peer-pressure to commit all savings, segregating upcoming rent/undated return-travel funds, comparison literature and deferring product decision, not account closing.

These are selected actual full semantic comparisons. Search hits and title inventories are navigation only; no claim of reading the entire outside corpus. Three exact complete rejected drafts are preserved above; before bank and medication rewrites, no fictitious rejections are claimed. All final24 written individually, not expanded from a common exchange or noun-swapped city recipe. Interactions end with differing resolutions: join reduced boat group, doorway-only visit, plain confectionery order, equipment briefing, hygiene hold, completed food carrying, drill debrief, signature handoff, reunited travel group, infrastructure management routing, nurse inspection, self-accountability consultation, shipment deferral, contract-change inquiry, controlled shopping, hat returned, meal-location change, child relieved of translator duty, alarm recurrence disabled, source-origin clarification, deferred recipient choice, literature-only bank visit, single authorised purchase and changed parent-child observation activity.

Roles: actual labels dominate. Confectionery shop is Shopping/ShopOwner; gym is gym operation not amusement-park ride; brewery is Factory/Brewer rather than Construction Site. Boat guide discusses rollcall and refers ticket conditions to reception. Firefighter debriefs evacuation exercise. Nurse scripts only solicit professional assessment, no diagnosis or medication instructions. Parks require ParkStaff. Other current municipality/station/bank/post roles fit. No NPC describes itself as fictional or says 教材/設定; all fictional-operation qualifications remain in premises.

Author mechanical validation:24 assignedIDs,264 alternating lines,120 internally distinct Player answers and120 distinct Japanese goal texts; exact Player-string check across readable existing author dictionaries returned0 hits. This is not exhaustive semantic proof, native/human/policy approval, runtime validation or remote persistence. Initial final source SHA-256 `edc90fda1e027936bafd5df8e2cbb3963c0de5409f04017ac7a6e323a217bf05`. Await independent peer/parent reading before integration.

## Current Shiga cross-group full comparisons

Read full group04 Koka04 SC-LOC-JP-25209-04-001 (video from colleague, eyewitness correction, source may be forwarded, event/viewing date uncertainty) against current Ritto04 (SNS theft allegation, not direct knowledge, unsure owner already reported, no invented suspect, viewing time vs fact). Both use transferable media-as-observation/source-origin structure; requested group04 whole rewrite, not a video-to-photo swap. Current Ritto04 remains unchanged pending the peer disposition.

Read full group05 Maibara06 SC-LOC-JP-25214-06-001 and all five goals: injured right hand, self left-hand writing, oversized writing, incomplete form retained during rest, legibility assessment and resume. Current Omihachiman08 also starts with writing-hand injury at a bank, but specifically concerns proposed spousal signing/tracing, trial of thick pen on a separate sheet, official signing method and self identity/own explanation. Recommended acceptance of common context with distinct causal developments; not a noun-swapped equivalent. Independent peer makes final decision.

Read full group05 Maibara03 SC-LOC-JP-25214-03-001 and goals: workplace ringtone still active, complete a pending work handoff before outpatient appointment, designated call place, return/checkin then silence. Current Ritto03 is inpatient personal medication alarm already disturbing neighbour, apology/source identification, next-day automatic recurrence and unknown ward medication times, cancel own recurrence without changing hospital equipment. Distinct causes and resolution despite hospital-phone topic. No source changes from these comparisons; current hash above remains valid.

Peer02 minors repaired: no unverified balance-preparation advice while accumulation-date change pending; food already opened title/premise aligned; bank clerk uses ご主人 naturally; Ritto06 now explicitly talks term-based deposit rather than implying ordinary deposits always restrict funds. Current source SHA-256 `a43101c1517e96f677569ae656bf243f9dcea21e952e6f8db2ce9666990d2b01`.
