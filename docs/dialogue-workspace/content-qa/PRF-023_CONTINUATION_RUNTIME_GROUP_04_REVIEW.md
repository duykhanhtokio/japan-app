# PRF023 continuation runtime GROUP04 review

Checkout: `/workspace/scratch/306bd1f5e3be/aichi-integration`; branch `recovery/jlpt-n3-n1`; comparison base `7ace5ede`. Correction-file SHA256 `86f476d5fb7b78e616bc3955035f6670881c10b95470319890b797c4446b00de`.

Independently read current actual88 runtime Japanese turns and40 goals in full, plus all eight effective scenario rows and location roles. Scenario resolution follows life-content-repository.ts: override replaces base row by ID; location correction replaces category/npcJob only. Titles, premises and first goals resolve to current final replacements. Komaki02 prior-source drift is expressly superseded by final replacement and root review; this report validates the current integrated form.

Scoped result: 8 scenarios checked, 0 open issues. All are11 alternating NPC-first turns, five responsive Player goals and final NPC polite closure. Stable dialogue IDs/scenario IDs/order/speakers/next chains match comparison base, terminal next=null. Effective categories/roles appropriate; no level gating. Both NPC and Player translation maps empty, Vietnamese translation absent/null, furigana absent/null; no parallel legacy level lanes in these runtime packages.

| Scenario | Effective category / role | Exact runtime SHA256 | Effective scenario entry SHA256 | Effective location entry SHA256 | Decision |
|---|---|---|---|---|---|
| SC-AIC-INUYAMA-001 | Castle / Guide | `4e24045e9bfb7aee09ce782774e068cd893a1d082036c1129c52026ff370d1d0` | `3fe61eed0d9173080aea7e3d819b52d82b4c4b79aed9c6f92264b4aec103bcf7` | `1b5f2d11aaeef7fc1bc556aed731e208c7f0a916a502653a854ae44f51405632` | PASS |
| SC-LOC-AIC-INUYAMA-07-001 | Pharmacy / Pharmacist | `97f211e223615ca6c0ab5f366bf4af12539b986e7766ffe97aca80d43efca13c` | `200a1a0f2b041afd4a2dd3026f768373393da69298573600052b7b33e898f6ab` | `a09ddefd8f52590cca737cdca3c0d6a31f3f156ad6fa1e604efba02e32c193eb` | PASS |
| SC-LOC-AIC-INUYAMA-08-001 | Tax Office / Tax Officer | `df08e79e407686f60c81e09dc4c182c7a7586e56b9dc25a9e53a33dfccdbe4fb` | `5537718087832efb79a9195c76a4b3e971c5652716fb6aa3956925847d591bf1` | `f8a15ad8c45686ceee3744f32e5d439cb48d4580dbb816c7035648154e83ae1d` | PASS |
| SC-LOC-JP-23208-02-001 | Government Office / Government Officer | `c44d193cabccc8823ce70232da4cd17145580ed23f9a061b34051760cd69cfd8` | `bfbd6cacbc05cdd57ace566c9ef26de5535a900d11c70512e59148b4500827f3` | `5cac980d1c836a22b9141f5c4ab1e4db88b88f2529adbf075a843e440fcacb66` | PASS |
| SC-LOC-JP-23208-06-001 | Bank / Bank Clerk | `485acbeb8d1cbd01f97b74be6c8d14058c2d996901b0b5b0f0a8ff90c71bfa1b` | `74e0d9f9b8205231b83160c01fba0791792d0253d47a1cd667f5c2c923f218a7` | `c4fd0b6603fdb6c6267d2d45b37003711108a906669c437a940c1d32ac519d46` | PASS |
| SC-LOC-JP-23219-02-001 | Government Office / Government Officer | `e671375aa2871a9c0c3fe78b3750428f6288c4b561168d3862efcbb0914d51a7` | `e7dab80fe05bb5a9a49be186134298d00c4cd95b03298087ddd622913875ab4e` | `c1f94fe4e48d24fdba0bd173a243c7d1a961ecb5af6d954044e3487180da8dfa` | PASS |
| SC-LOC-JP-23231-06-001 | Bank / Bank Clerk | `1fc359c9d112f5be893573f4fc1202286cd5b410046f25f37233ef1538e50406` | `6a65b25fbb99b4088810389bb723d71364b941e8840bff91fd0f4cbfdd008638` | `abbe5a582b5b2768ceadd526ca8d49612b8c6ce8f6c339dd1e6214c8709143ce` | PASS |
| SC-LOC-JP-23231-08-001 | Park / Park Staff | `c46203b3e49084a3c928deb55475fec20378669ae39e18dd254adf1f60ec43f2` | `bfc0175528f40cafb0409e30d3e4f1ed963ef57c3ad46cd5656d3674310b025e` | `bf6c2a3dd2fb100ef180f97c1f2065b54c511eca500100f92bbc583ec559da08` | PASS |

## Editorial/role findings

- Inuyama01: Guide explains stone-wall term and figure, distinguishes visible joints from damage without determining condition; farewell invites continued viewing.
- Inuyama07: Pharmacist at drugstore daily-goods area provides toothbrush labeling/sample/pack facts, without medical claims; all five goals and purchase closure match.
- Inuyama08: Tax Officer confines response to the current customer and supplies inquiry route for friend; no tax eligibility conclusion.
- Tsushima02: Government Officer collects two course questions for course staff, without acting as knife instructor; bounded handoff ends politely.
- Tsushima06: Bank Clerk separates own yen deposit from foreign notes taken home; three1000-yen notes=3000. Five goals and final processing acknowledgment match.
- Komaki02: Government Officer gives enrolment-stage Q&A procedure. Title/premise specify before enrolment; microphone returned to staff, collection no longer inferred.
- Tahara06: Bank Clerk differentiates balance50000, withdrawal30000, remaining20000, and pending procedural check; arithmetic and goals coherent.
- Tahara08: Park Staff gives permitted waiting position; parents retain child supervision and swap only after return. No staff child-care promise.

Exact entry hash convention: UTF-8 compact JSON, sorted keys, ensure_ascii=false. Whole JSON file hashes refer to byte content. AI scoped source/runtime/metadata acceptance only: no whole-prefecture CONTENT PASS, native/human, actual service, device visual or remote persistence approval. Reviewer wrote only this report.
