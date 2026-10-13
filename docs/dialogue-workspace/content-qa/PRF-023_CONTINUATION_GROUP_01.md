# PRF-023 continuation independent editorial review — Group 01

All 48 complete source scripts / 528 turns / 240 goals read. Full corrected entries for all 48 are in `scripts/dialogue-authoring/prf-023-continuation-review-group-01.json`. Supplemental corrections pending root merge/runtime integration; no whole-prefecture CONTENT PASS, native/human/device/real-policy approval. This worker modified only the two owned new files; no runtime, canonical, existing source, UI, commit or push modifications.

Source final SHA-256: `d5c752a8d37256404bde7200c2dc1c136d3a8e6b769ccb18f425317afbcc5a02`.
Output SHA-256: `df574e8050c70704d33f7e02f50f779fcf04efa944443176612b0ebf4cc32d5f`.

Before-entry hashes below use SHA-256 of UTF-8 Python `json.dumps(entry, ensure_ascii=False, sort_keys=True, separators=(",", ":"))`. Root must compare each current source entry and skip or adapt repair if its before hash differs. Concurrent edits remain owned by the other workflow.

## All 48 decisions

| Scenario | Concrete repair | Before entry SHA-256 |
|---|---|---|
| SC-AIC-ICHINOMIYA-001 | turn 6, turn 10, turn 11, goal 3, goal 5 | `d1df06cd5cf9f0608ef79450c4f1f3c3dcc02c411271276b839d0e6511cbba40` |
| SC-LOC-AIC-ICHINOMIYA-02-001 | turn 2, turn 6, turn 8, goal 1, goal 4 | `f7a129e358335097ac69b100240843d38aef3fa827d88cf3957b31de940d5d20` |
| SC-LOC-AIC-ICHINOMIYA-03-001 | turn 4, turn 6, turn 8, goal 2, goal 4 | `9e94d5a9858f78ee0ed9818cd28aeb0fa8a2e58493ef97239c06baf400db5abb` |
| SC-LOC-AIC-ICHINOMIYA-04-001 | turn 11 | `dec67da2c3afd5ba490e7fd9969e1de5b24307f4c3524c67dfa3a9fabb8d778a` |
| SC-LOC-AIC-ICHINOMIYA-05-001 | turn 2, turn 4, turn 5, goal 1, goal 2 | `99588d580c0b1c92786609bbf65b9010dadbebdea6507d7d6db5e11d22d66702` |
| SC-LOC-AIC-ICHINOMIYA-06-001 | turn 4, turn 10, turn 11, goal 2, goal 5 | `92cacc83d1bfb9de672a600e82b825810d8fa2bca579c9c17db6421ba3f3d698` |
| SC-LOC-AIC-ICHINOMIYA-07-001 | turn 4, turn 10, goal 2, goal 5 | `752500c8e682154430b5e134de30087f552e1dbb8ec58fd45f7936f6c291d8f0` |
| SC-LOC-AIC-ICHINOMIYA-08-001 | full 11-turn causal replacement; all 5 goals; title/premise. Rejected prior absent-friend additional-order arc because SC-TKY-RES-002 already contains this sequence. | `792584a7caa7e4992ae5130420efcca79000e533c962a2c4bd128295c739ebb5` |
| SC-LOC-JP-23205-01-001 | turn 4, turn 8, goal 2, goal 4 | `4415d6efc76635f77938dcba065c2ac8a0ae4333cb926f10d09a462f2f68326a` |
| SC-LOC-JP-23205-02-001 | turn 6, turn 7, goal 3 | `11f2c9c7c03052aa137db1ac258356638605779addb1aa55fb6047a18aa3a3a7` |
| SC-LOC-JP-23205-03-001 | turn 6, turn 11, goal 3 | `9247021f33f09b72a26256b8e7cbbef1b60f52645a94ba14d048043c58469238` |
| SC-LOC-JP-23205-04-001 | turn 4, turn 10, turn 11, goal 2, goal 5 | `301ed6abb104a7dfb31c42b4f3f780a53c9b2d0d15e181c40ea7780b3a4852db` |
| SC-LOC-JP-23205-05-001 | turn 6, turn 8, turn 9, goal 3, goal 4 | `0f6f0170ef04fee1ab911e7324a961165a24fe1ce1d8f4f64dae5b0e309e4800` |
| SC-LOC-JP-23205-06-001 | turn 4, turn 6, turn 7, goal 2, goal 3 | `ab7ab365f6d1d62aba9f0126efbbe83098f347b54e1a29953980bec78ddc6a88` |
| SC-LOC-JP-23205-07-001 | turn 2, turn 6, turn 8, turn 9, goal 1, goal 3, goal 4 | `3d3c86c89a8970c3b9a5f94dec0ebedce81dfe9088085ccc137e0ce5e22f921d` |
| SC-LOC-JP-23205-08-001 | turn 6, turn 7, turn 10, turn 11, goal 3, goal 5 | `4fc1afbf24a6a4e8e2ac6453c4dce28bd94f954f855f6381898150a2747a1f4d` |
| SC-LOC-JP-23214-01-001 | turn 4, turn 8, turn 9, goal 2, goal 4 | `0cb3b4a1762fb0aed68f038aa9482e2d2ecf3b7950f697e8650072342925de59` |
| SC-LOC-JP-23214-02-001 | turn 4, turn 6, turn 8, goal 2, goal 3, goal 4 | `4a1da0b4a33271da3e803dc44ddc625b57526731a39dbfb7da6be4f3e854db17` |
| SC-LOC-JP-23214-03-001 | turn 6, turn 8, turn 11, goal 3, goal 4 | `dc46d9ac4a750ed1cd8c8d175c77e34254f671885762e35b0b6c79b7674ff5c1` |
| SC-LOC-JP-23214-04-001 | turn 6, turn 10, turn 11, goal 3, goal 5 | `d9bc7bdc4d7a4f62925c4072a014da642d88664bb8aa0ac7f5842547f302a46d` |
| SC-LOC-JP-23214-05-001 | turn 4, turn 8, goal 2, goal 4 | `f4fea0075771552e7dd0d36ef7084ec437aee92c161f2c7acfca77b196ee2770` |
| SC-LOC-JP-23214-06-001 | turn 4, turn 6, turn 8, turn 10, turn 11, goal 2, goal 3, goal 4, goal 5 | `bc50e24ac17e74fbd2449d52e60cd5ffff1a08343db91eb20fb1855c19d23187` |
| SC-LOC-JP-23214-07-001 | turn 4, turn 6, goal 2, goal 3 | `048d9f7aa61e837c16390f4fd7845051a1047b476ef189d99732293dc0cabc2b` |
| SC-LOC-JP-23214-08-001 | turn 4, turn 5, turn 6, turn 10, goal 2, goal 3, goal 5 | `cf3e5b99dc90dfd7ce32efefc88b14abaa4d3092571766f6585918f2316087ca` |
| SC-LOC-JP-23222-01-001 | turn 4, turn 8, goal 2, goal 4 | `e0d7b69788b5fed4b245930fd27047ffbe86fdb3a80571a839790cae729133cb` |
| SC-LOC-JP-23222-02-001 | turn 2, turn 10, goal 1, goal 5 | `a29e4c32e75d6caf06617f8daf141f149d2fd00b82e675951394f78c33ecdfa4` |
| SC-LOC-JP-23222-03-001 | turn 6, turn 8, turn 11, goal 4 | `b153b75783c62f9629d8f7bd78f5e6ef438720852e9fd9885d47e08bb3d98f55` |
| SC-LOC-JP-23222-04-001 | turn 6, turn 8, turn 11, goal 3, goal 4 | `c14abdda52b259490d19c22c75127e3d2b32f42d283306ef41da8a39ee6d27de` |
| SC-LOC-JP-23222-05-001 | turn 2, turn 4, turn 10, goal 2, goal 5 | `14f28964db8b04faa1abe3288835cae89f6e4eb22cfe26fe74878236646840c7` |
| SC-LOC-JP-23222-06-001 | turn 6, turn 10, turn 11, goal 3, goal 5 | `b5c783dc2b9234847e607b400ff9eded72aa13a605a38983553cbeeb73c93a28` |
| SC-LOC-JP-23222-07-001 | turn 4, turn 8, turn 10, goal 2, goal 4, goal 5 | `885f60b4628bc4ab7a904b52ad99d4e8a576977a80bd62b1966519f1a3053933` |
| SC-LOC-JP-23222-08-001 | turn 8, turn 10, goal 4, goal 5 | `d69b00de6e3d78fb0db06f878efb8723299c10c3db08b709ac6335487b1911c4` |
| SC-LOC-JP-23228-01-001 | turn 4, turn 6, turn 10, goal 2, goal 3, goal 5 | `883951b87b32a21b1ec911fcd1bc430104fa6a2638180f268ec228fd1226ffb5` |
| SC-LOC-JP-23228-02-001 | turn 4, turn 6, turn 7, goal 2, goal 3 | `dc82e51ae77029512c756937e6a1c7b31e1930f1ffc4132a5e305bef4d8c7da9` |
| SC-LOC-JP-23228-03-001 | turn 2, turn 4, turn 6, turn 7, goal 1, goal 2, goal 3 | `177af32d65b1477ab162e0740f21cfaf7bafa743da513ba2cd84fd1bd98c8bd6` |
| SC-LOC-JP-23228-04-001 | turn 4, turn 6, turn 10, goal 2, goal 3, goal 5 | `7f748947294dd3c7c1e7e7c57cab3371b4ba50569d37004a52d9d4ba834fa5b7` |
| SC-LOC-JP-23228-05-001 | turn 10, turn 11, goal 5 | `2e3db3b6eaf95304c1c158930f6d4936b22b4ebec95aa580a2447d82947d3d0f` |
| SC-LOC-JP-23228-06-001 | turn 10, turn 11, goal 5 | `ddba51c37934ea966283fb197eeae8220c8113174585cc5bfc4fc73748c784b5` |
| SC-LOC-JP-23228-07-001 | turn 4, turn 6, turn 8, turn 9, turn 10, turn 11, goal 2, goal 3, goal 4, goal 5 | `35424eda97ecb608a63fb41c1aa83b139aff688d9ca888f653e0836886d1b12d` |
| SC-LOC-JP-23228-08-001 | turn 4, turn 6, turn 10, goal 2, goal 3 | `41d2bf660142924096469aa8877cdb8bb21942e7ab99cd88b0ac064709b15cf6` |
| SC-LOC-JP-23234-01-001 | turn 4, turn 5, turn 6, turn 7, turn 8, turn 11, goal 2, goal 3, goal 4 | `b0dafbbfa843f0dd455151b841fe979b433993c7a96bf110a8a2f14dae9ef455` |
| SC-LOC-JP-23234-02-001 | turn 4, turn 8, turn 10, goal 2, goal 4, goal 5 | `093fa34d4335f9587212e09b4783f51e2d9ca95be506fd92c967bcaa3277f982` |
| SC-LOC-JP-23234-03-001 | turn 8, turn 9, turn 11, goal 4 | `fbed0fe05dc710799e3c1348dbe5a02288060ce9e804053df4adfae87ef39ee7` |
| SC-LOC-JP-23234-04-001 | turn 4, turn 6, turn 10, goal 2, goal 3, goal 5 | `b2136f4a7ebbba0eb4050d5b3ba553d74ae5da667a96577bf459a2f9c47c3258` |
| SC-LOC-JP-23234-05-001 | turn 4, turn 6, turn 10, turn 11, goal 2, goal 3 | `ee1c83aa9b47dc41945c5d2b6d2967d4b5f56a3c0c094ee669a9359a7bdd3f59` |
| SC-LOC-JP-23234-06-001 | turn 8, turn 10, goal 4, goal 5 | `3677bc3b2888c5db2dc8563de84f64b6b643ba5a1b49d2a9392cfe5743923041` |
| SC-LOC-JP-23234-07-001 | turn 6, turn 8, turn 10, goal 3, goal 4, goal 5 | `b6b1f74035990dce2b1235bca4d44bf6424a79422826f99b352fa96c56d1ff4c` |
| SC-LOC-JP-23234-08-001 | turn 4, turn 6, goal 2, goal 3 | `56494059a091d5d170cdec22475efaae80e289564b927fdf210646b202b509c1` |

Each repair removes a specific unnatural utterance or unanswered request while retaining situation-specific intent. The recurrent defect was volunteered hypothetical wrongdoing and self-commentary; replacements use concrete requests, observations, decisions and thanks. Relevant precautions remain. Clinical/police staff handoffs end with leaving to check/call a responsible person, giving the mandatory farewell a plausible context. Choir permission stays unconfirmed pending staff check. Opened snack reaches an explicit simulated checkout instruction. Bank date inquiry receives contact information via an offered notice.

One full causal replacement: Ichinomiya -08 repeated absent-friend additional-order deferral in SC-TKY-RES-002. All 11 turns, 5 goal texts, title and premise replaced. New story: black line on plate, uncertain crack/design, staff inspection identifies simulated decoration, learner requests plain plate and staff transfers food/soup. Focused runtime queries `皿.*(模様|ひび)` and `模様.*(汚|皿)` returned no match. This is screening, not exhaustive uniqueness proof.

## Full prior scripts actually read

| Prior script | Conceptual decision | File SHA-256 |
|---|---|---|
| SC-LOC-TYM-UOZU-06-001 | Tool-name/holding demonstration versus loom foot sequence and repeat practice. | `73789cb81a0adf74bffeac0083887af1b71372d4155d06a50700f3586db128df` |
| SC-LOC-JP-19212-02-001 | Exchange participant versus organizer role; current shop opening observation is different. | `69079fb661e595497551e1408e07e9c7fd67d0920c7df704cc083db0ca103f7e` |
| SC-LOC-GIF-GERO-05-001 | Uneaten portion complaint versus usable utensils/chopstick placement. | `b261871cd2976deb3cc171c8af144089f34810541ac2ac5510a8ab89b0878da8` |
| SC-TKY-RES-002 | Absent-friend additional-order deferral repeats source Ichinomiya -08. Rejected and fully replaced with plate-design uncertainty. | `a37af826cca9c965911a4c734d5036e4dbb67db1ad76f99df2f606a68b2f48ce` |
| SC-LOC-JP-04216-01-001 | Runaway suitcase wheels versus mechanically stuck extended handle and carrying orientation. | `ef6d20c10ced4bbf3ea0981a87ba1c5ef2ad70a5da532e5bdd94d291c11681ef` |
| SC-LOC-JP-16211-08-001 | Microphone-test meaning/alternate quiet path versus dog proximity/owner request. | `bc1454b96a5854a97a228343e5b8aaf3a575d9c2d00230d31f209bf074f182a2` |
| SC-LOC-JP-08212-02-001 | Meaning of 持参 in translated clean-up notice versus continuous bicycle parking after relocation. | `3b1079c9909c7736be468c04463ad9d2b678a9853169d30648dd53f5ce9d7a17` |
| SC-LOC-JP-21207-08-001 | Video call voice and captured bystanders versus station fan interfering with announcements. | `9c7830460b8006f61e6348e4d04f74bf5b0236ede7b4c2502064b21ccd03886f` |
| SC-LOC-GIF-SEKI-05-001 | Smile misread as no pain versus examination sound anxiety and clothing privacy. | `a78335bb95b162a0499040f90eea1931b4651720381b5c695d2086f571ed131c` |
| SC-LOC-JP-19204-01-001 | Backpack string contact/retie versus extended suitcase handle and fixed grip. | `355c6038f523ba0b70493eb5c0779dcbad58547914007fdc1a0aa30d59489885` |
| SC-LOC-JP-17212-04-001 | Unknown bicycle scratch culprit/chronology versus accompanied-child consultation constraints. | `87fa796de89fe4d4248765dcd30158c5ff216b1f22690b96a07ca947a9f397d0` |
| SC-LOC-JP-21204-05-001 | Scented letter/recipient tolerance versus new incoming letter postpones outgoing reply. | `e2f116625bfdf0871b0d17a88177c3eb32eb1ebba711edf78860103c4d0b9e0e` |
| SC-LOC-019-08-001 | Family phone/account-number disclosure versus earphones causing own loud voice; same privacy motif, different cause/action. | `e7281f9787d47eb2dd551556b5eafd82a51e3540737cfbe1b6b6f5a17e079516` |
| SC-LOC-JP-22207-08-001 | Windblown song sheets/relocation photo versus reading glare/changing shade; shared park relocation motif only. | `79c208d73847825195603fba194d3b6b310e009013fc55c1a0d14028339483d1` |
| SC-LOC-JP-20204-04-001 | Unknown nighttime doorstep visitor versus written future-visit threat from known unwanted contact, with family-contact concern. | `b9a15d1c31e2babbbe2246a7a3be81743bede2e6aa42eb0794cd7ff4eff7adc3` |
| SC-LOC-JP-15217-03-001 | Worsening abdominal pain after triage versus forgotten glasses/measurement conditions. | `ae8bf228c9bd51ba8057e7dd0dd3b0e1ec0c9a9c17cb8a2367f8d500f6eff1e5` |
| SC-LOC-006-19-001 | Shared hotpot individual spice adjustment: considered and rejected as replacement alternative because already exists. | `f172db8f623c17bcc320af7875241c261e93300a0940aa9d9bf8e5e41de98a7e` |
| SC-LOC-AKT-YOKOTE-02-001 | Raw/cooked serving tools: considered and rejected as replacement alternative. | `c34d94a7e653fa68c087321fcf157733e7eae6f8255b4de646d37cca17266f9d` |
| SC-LOC-YMN-FUJIKAWAGUCHIKO-04-001 | Shared bento changed to individual order: not plate-design uncertainty. | `502fc680a52c0e2d3edd8933a45ac14b47d15d29f5dbc3518e11087bef18207e` |
| SC-LOC-MYG-KESENNUMA-08-001 | Hotpot ladle/bowls/reach: considered and rejected serving-utensil replacement alternative. | `e0ca76a70d4cd2de5ceb60caffcb16be0cc388a61401eee2d3f9af174cf75df0` |

Author-side 48 comparison references were read as evidence, not a substitute for current-script review. This reviewer fully read the 20 prior scripts above; no claim to have fully read the whole previous corpus. No global text-substitution/template operation was used; each changed utterance was independently written for its own exchange.

## Local bounded validation

- 48 entries / 528 turns / 240 goals; original key order and every goal ID preserved.
- 240 internally unique player utterances; exact player collision screening against 7088 other runtime files: zero.
- Alternation is represented by 11 fixed positional turns (6 NPC / 5 player); root must verify runtime speakers and links after integration.
- Current source hash and per-entry before hashes support conflict-safe supplemental merge. Structural and exact-match checks alone are not semantic approval.

## Concrete per-scene wording evidence

First changed utterance for each scene is shown below; the all-decisions table records every other changed turn/goal, and the JSON contains the full final script.

### SC-AIC-ICHINOMIYA-001

Turn 6, before: 踏みっぱなしではないのですね。機械に手を入れず、足の動きだけ一組練習したいです。

After: 踏んで戻すところまでで一回なのですね。足の動きだけ、私も試していいですか。

### SC-LOC-AIC-ICHINOMIYA-02-001

Turn 2, before: 今日は店が開く前の準備を見てみたいです。商品を買うつもりで早く来たのではありません。

After: 開店前の準備を少し見学できますか。値札を並べているところに興味があります。

### SC-LOC-AIC-ICHINOMIYA-03-001

Turn 4, before: 両方お願いします。箸を使う練習もしたいですが、今日の食事では無理に練習を続けないようにします。

After: フォークとれんげを両方お願いします。家では箸を練習していますが、今日は温かいうちに食べたいです。

### SC-LOC-AIC-ICHINOMIYA-04-001

Turn 11, before: それでは、準備を進めます。ご協力ありがとうございます。失礼します。

After: 合図を確認できました。先生にもお伝えしてきます。それでは、少しお待ちください。失礼します。

### SC-LOC-AIC-ICHINOMIYA-05-001

Turn 2, before: 帰宅したいですが、最終列車が行ったと聞きました。ホームで待ち続けず、ほかの帰り方を相談したいです。

After: 最終列車に間に合いませんでした。家へ帰るには、ほかにどんな方法がありますか。

### SC-LOC-AIC-ICHINOMIYA-06-001

Turn 4, before: 座る前に聞けてよかったです。洗面器を裏返して椅子の代わりにするのも、やめておきます。

After: ありがとうございます。椅子を使いたいのですが、空いている物はありますか。

### SC-LOC-AIC-ICHINOMIYA-07-001

Turn 4, before: 白黒で一枚です。スマートフォンから印刷するのではなく、この紙をそのまま写したいです。

After: 白黒で一枚お願いします。この紙を原稿に使います。

### SC-LOC-AIC-ICHINOMIYA-08-001

Turn 1, before: 追加のお料理はいかがですか。

After: お皿について、何かございましたか。

### SC-LOC-JP-23205-01-001

Turn 4, before: 工事の音なのですね。子どもには、列車からの音ではないと伝えます。確かめるために工事の中へ連れて行くことはしません。

After: 工事の音なのですね。子どもにそう説明します。この辺りより音の小さい場所で待てますか。

### SC-LOC-JP-23205-02-001

Turn 6, before: 「前回は洗う場所が分からなかった。次回は始めに教えてほしい」と言います。誰かを責めたいのではありません。

After: では「前回は道具を洗う場所が分からなかったので、次回は最初に教えてください」と言ってみます。これで伝わりますか。

### SC-LOC-JP-23205-03-001

Turn 6, before: 待ちます。眠っていた間に診察が済んだとは思っていません。今の順番を教えていただきたいです。

After: こちらで待ちます。私の診察はこれからなのですね。今の順番が分かったら教えてください。

### SC-LOC-JP-23205-04-001

Turn 4, before: 座ります。今は別の人をここへ呼んで対決したいという希望ではありません。

After: ありがとうございます。少し座ってから話したいです。今は息を整える時間をください。

### SC-LOC-JP-23205-05-001

Turn 6, before: 二枚あります。書いた順番を見て、どちらも手紙の内容だと確認しました。中を職員の方に読んでほしいという意味ではありません。

After: 便箋は二枚そろっています。上から順に読めるよう、重ね直しました。

### SC-LOC-JP-23205-06-001

Turn 4, before: 自分が希望するのが相談だけか、今日申し込むことかです。説明を聞く前に申込用紙を取ってしまいました。

After: 口座の手続きについてです。申込用紙は取りましたが、まず内容を聞いてから申し込むか決めたいです。

### SC-LOC-JP-23205-07-001

Turn 2, before: はい。袋の上から押して柔らかさを確かめそうになりました。押さずに、柔らかい物を選ぶ方法を教えてください。

After: 家族が柔らかいパンを食べたいと言っています。この二つは、食感がどう違いますか。

### SC-LOC-JP-23205-08-001

Turn 6, before: 離れた場所を使えるか確認します。歌う間も通路をふさがず、三人が道の真ん中へ並ばないようにします。

After: ベンチから離れた所にしたいです。三人が通路に並ばずに練習できる場所はありますか。

### SC-LOC-JP-23214-01-001

Turn 4, before: 止めました。首に掛けたまま回し続けるのではなく、かばんへしまいます。

After: 止めたら聞こえやすくなりました。今はかばんへしまっておきます。

### SC-LOC-JP-23214-02-001

Turn 4, before: 毎日置くつもりですが、引っ越し日はまだ決まっていません。一日だけの利用と同じと思わず、継続利用について聞きたいです。

After: 毎日通勤に使いたいです。来月引っ越しますが、日付はまだ決まっていません。月単位の利用について相談できますか。

### SC-LOC-JP-23214-03-001

Turn 6, before: お願いします。音が全くしないと約束してほしいのではありません。どんな音か、困った時にどう知らせるかを知りたいです。

After: どんな音がするかと、怖くなった時の合図を先に教えてもらえると助かります。

### SC-LOC-JP-23214-04-001

Turn 6, before: 今朝八時ごろです。言葉は画面でお見せします。何の事件になるかを私が先に決めず、内容を確認してほしいです。

After: 今朝八時ごろです。画面に「今夜お前の家へ行く」とあります。前にも会いたくないと伝えた人なので怖いです。

### SC-LOC-JP-23214-05-001

Turn 4, before: ありがとうございます。子どもを一人で行かせず、私が一緒に行きます。この順番を取ったままにしようとはしません。

After: 手紙を持って、子どもと一緒に行きます。戻ったら並び直しますね。

### SC-LOC-JP-23214-06-001

Turn 4, before: お願いします。反応がないと思って同じ所を連続で押さず、今どうなっているか見ていただきたいです。

After: お願いします。一度押したつもりなのですが、次の画面へ進んでいるか見てもらえますか。

### SC-LOC-JP-23214-07-001

Turn 4, before: ここへ置きます。瓶の口と底を見ます。ほかの商品にひびがある物を隠して入れないよう、先に確認します。

After: こちらへ置きます。口のところも底も、今のところひびは見えません。

### SC-LOC-JP-23214-08-001

Turn 4, before: その道へ回ります。犬を触るように勧められても、今日は触らずに通りたいです。

After: その道を通りたいです。犬がこちらへ近づいて来たら、少し待ってから進んでもいいですか。

### SC-LOC-JP-23222-01-001

Turn 4, before: 上の固定した取っ手なら持てます。長い部分を押し込むために床へ強くたたくのはやめます。

After: 上の固定した取っ手なら持てます。重さも一人で持てる範囲です。

### SC-LOC-JP-23222-02-001

Turn 2, before: はい。この写真を見て元気が出ました。作者に感想を伝えたいですが、展示から住所を探して直接訪ねるつもりはありません。

After: この写真を見て元気が出ました。作者へ感想を届ける方法はありますか。

### SC-LOC-JP-23222-03-001

Turn 6, before: お願いします。光が見えたので、熱くなると思って手を引きました。実際に熱を感じたわけではありません。

After: 光が見えて驚きました。熱くなるのかと思いましたが、今は熱さは感じません。

### SC-LOC-JP-23222-04-001

Turn 6, before: 道路の端の箱です。中は開けていません。相手を責める紙より、場所と箱の状態を伝えたいです。

After: 段ボール箱が二つ、道路の端にあります。中は見ていません。今朝から置かれたままです。

### SC-LOC-JP-23222-05-001

Turn 2, before: まだ相談したいです。友人へのハンカチを何重にも包んだら、形が大きくなりました。中身は小さいので、包装を見直してから送りたいです。

After: 友人へのハンカチを何重にも包んだら、中身よりずいぶん大きくなりました。飾り紙を減らしてから送りたいです。

### SC-LOC-JP-23222-06-001

Turn 6, before: そうです。数が分からなくならないよう、私も途中で金額を言い換えないようにします。

After: はい、その束です。自分で数えた金額はメモに書いてあります。後で照らし合わせます。

### SC-LOC-JP-23222-07-001

Turn 4, before: 移ったのですね。元の棚の前で待つのではなく、その売り場へ行きます。ほかのお客様のかごを探すこともしません。

After: ありがとうございます。端の売り場へ行ってみます。場所が変わったことに気づきませんでした。

### SC-LOC-JP-23222-08-001

Turn 8, before: はい。雨を避けたくても、濡れていない今から走って転ぶことはしません。友人が来るまでここで待ちます。

After: 分かりました。友人が来るまでここで待ちます。急いで戻ると疲れてしまうので、二人でゆっくり歩きます。

### SC-LOC-JP-23228-01-001

Turn 4, before: 袋はすぐそこです。人を押して戻らず、空いている側から歩いて取ります。

After: すぐそこに見えます。空いている側から歩いて取ってきます。

### SC-LOC-JP-23228-02-001

Turn 4, before: 全部を書き写すのではなく、覚えていることを一つずつ書くのですね。分からなかった所も分けて残したいです。

After: 覚えていることを先に書くのですね。うまく説明できなかった所は、質問としてメモしておきます。

### SC-LOC-JP-23228-03-001

Turn 2, before: 普段は眼鏡を使っていますが、今日は家へ忘れて来ました。眼鏡を掛けた状態の結果として測られると違うので、先に伝えます。

After: 普段は眼鏡を使っていますが、今日は家に忘れて来ました。裸眼のままでも、予定していた確認はできますか。

### SC-LOC-JP-23228-04-001

Turn 4, before: 知らない人が訪ねて来た時に、すぐドアを開けないという話です。家族が悪いことをしたと責めるつもりはありません。

After: 知らない人が訪ねて来ても、すぐドアを開けずに相手を確認するという話です。家でも確認の仕方を決めたいです。

### SC-LOC-JP-23228-05-001

Turn 10, before: 春の花と伝えて、父がこれにすると答えました。使うために切り離したり貼ったりせず、この形で持ち帰ります。

After: 「春の花」と伝えたら、父もこれがいいと言いました。一組お願いします。折れないように持って帰りたいです。

### SC-LOC-JP-23228-06-001

Turn 10, before: 待つ予定と追記します。手帳に書けたので、次の説明へ進んでください。変更時の連絡先も聞きます。

After: 担当の方からの連絡を待つ、と追記しました。事情が変わった時の連絡先も、この手帳へ書きたいです。

### SC-LOC-JP-23228-07-001

Turn 4, before: こちらです。角が開いています。開いていない別の袋へ取り替えて隠すのはやめて、お見せします。

After: この袋です。角のところを開けましたが、食べてはいません。

### SC-LOC-JP-23228-08-001

Turn 4, before: あのベンチですね。道の縁に座って足を通路へ出すより、そこへ移ります。

After: あちらですね。友人も疲れているので、二人でベンチへ移ります。

### SC-LOC-JP-23234-01-001

Turn 4, before: 閉めたままにします。家と同じように腕へ抱けば大丈夫、と考えて開けるのはやめます。

After: 分かりました。閉めたまま持っています。鳴いているのですが、このまま相談して大丈夫ですか。

### SC-LOC-JP-23234-02-001

Turn 4, before: 二つの確認があるのですね。主催者がよいと言っただけで、食品の条件も全部済んだとは考えないようにします。

After: 出店の申込みは主催者、食品については別の窓口なのですね。両方へ相談したいです。

### SC-LOC-JP-23234-03-001

Turn 8, before: ありがとうございます。説明を聞いた範囲だけ動かします。分からない時は、手を動かす前に聞きます。

After: ありがとうございます。服はどの辺りまで動かせばいいですか。指で示してもらえると助かります。

### SC-LOC-JP-23234-04-001

Turn 4, before: 今は眠っています。子どもを見ながら話せる場所が希望です。ここへ来たことで、預かってもらえると思ったわけではありません。

After: 今は眠っています。子どもの様子が見える席で話せると助かります。

### SC-LOC-JP-23234-05-001

Turn 4, before: 持ち帰ります。今書いた手紙が間違っているわけではありませんが、友人の話を知らないまま同じことを聞かないようにしたいです。

After: ありがとうございます。先に友人の近況を知ってから、返事も一緒に書きたいです。

### SC-LOC-JP-23234-06-001

Turn 8, before: 取引の確認をしたいです。私の聞こえ方に合わせて大きな声にしてほしいのではなく、聞こえなければ自分で聞き直します。

After: 取引の記録を確認したいです。イヤホンを外したらよく聞こえるので、この声の大きさで大丈夫です。

### SC-LOC-JP-23234-07-001

Turn 6, before: 家族に表示を見せます。余った分を必ず使うと言い切らず、今日使う量で決めます。

After: これなら二人分に足りそうです。家族にも表示を見てもらってから決めます。

### SC-LOC-JP-23234-08-001

Turn 4, before: そのベンチへ行きます。枝を引いて影を作るのではなく、今ある日陰を使います。

After: あの木のそばですね。本をしまってから、そちらへ移ります。


## Independent second-read follow-up

All four findings in `PRF-023_CONTINUATION_GROUP_01_SECOND_READ.md` repaired in the supplemental JSON only. Source/runtime untouched.

- `SC-LOC-JP-23205-03-001` turn 6: こちらで待ちます。私の診察がまだこれからか、今の順番と一緒に確認して教えてください。
- `SC-LOC-JP-23205-08-001` turn 2: 友人二人と、三人で歌の練習をしたいです。大声や楽器は使いませんが、ここで練習してよいか先に確認したいです。
- `SC-LOC-JP-23205-04-001` turn 9: はい、途中でもいったん休めます。休みたい時はお知らせください。
- `SC-LOC-JP-23214-05-001` turn 9: はい、戻られましたら料金と投函の準備を確認します。

Handa clinic goal 3 also now requests confirmation of consultation status and current queue instead of asserting an unchecked state. Choir now explicitly has learner + two friends = three people. Pause permission and return-to-counter postage check now have direct NPC answers. Before-entry hashes still refer to original author source for conflict-safe merge; independent review should bind acceptance to the updated output SHA above.
