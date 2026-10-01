# PRF-001 editorial rewrite checkpoint

Status: **FAIL CONTENT QA — SEMANTIC AUDIT IN PROGRESS**.

Current continuation (supersedes historical next-actions below): 16 remaining police exchanges read in full; Kitami fully replaced, five record/evidence/receipt repairs and two premise clarifications. Twenty-seven full replacements documented; 188 distinct exchanges covered by full comparison-group records. CONTENT QA remains FAIL. Next: remaining transport and other unreviewed corpus, first reconciling current remote. No translations or PRF-002.

Branch: `recovery/jlpt-n3-n1`. This continuation started from remote-verified `f687aed169babf8e40ca85659273bc0687d3a964` (251/299), preserving all existing data. Original input: `dd1ecd44cc9537efc79b578ac636d5f68792ceff`.

## Current authoritative state

All 299 canonical exchanges in 35 cities have individual editorial sources under `scripts/dialogue-authoring/prf-001-*.json`: 3289 alternating turns and 1495 separately specified player tasks. The last 48 are Noboribetsu, Eniwa, Date, Kitahiroshima, Ishikari and Hokuto (eight each). Runtime IDs, location IDs, turn order, next links and UI are preserved. All changed utterances clear stale translations/furigana. No translations authored.

Full player answers and task descriptions are unique across the 299 sources. Structural audit has zero errors, exact or place/quantity-normalized duplicate groups and zero near-duplicate script candidates. These are screening results and do not award CONTENT PASS.

## Next action

All 299 have been rewritten. The four previously pending comparison groups have now been read in full and their distinct information gaps, decisions and outcomes documented in `PRF-001_SEMANTIC_REVIEW.json`. This closes those groups only. Twenty-one identified overlaps have been replaced. Latest full replacement: Muroran bank (-06) completes fictional surname/given-name field transcription and resolves an omitted surname component. The group-review records below preserve earlier decisions.

299/299 complete exchanges have had their five player instructions manually read and rewritten into natural Japanese (1495 tasks). The final 70 cover Obihiro, remaining Otaru, Rumoi, Shibetsu, Wakkanai, all Tomakomai and remaining Yubari, plus Sapporo’s twenty remaining exchanges. Source/runtime goals, hints and evaluation notes match. NPC fourth-wall references in Rumoi/Yubari/Sapporo are removed; workplace and unfinished procedure closings are repaired. Unspecified notice title, dorm room and child age become concrete fictional details.

Twenty-one semantic overlaps have been replaced in total. Earlier replacements: Obihiro tax (-08) now compares employer-specific salary documents and reimbursements rather than duplicating Nayoro’s uncertain prior-payment period. Sapporo market (-11) now concerns returning a borrowed cooler with its original strap and reconciling the loan/deposit record. An order-addition draft was discarded before publication after comparison with Furano’s pickup scenario. No actual named business loan service or tax treatment is certified.

All 299 canonical titles, situations and initial player goals align with their individual sources. The earlier instruction/metadata completion batch changed the final 134 PRF-001 records while preserving the previous 165. Subsequent semantic repairs update only individually documented PRF-001 records; all other prefectures remain preserved. No JLPT or grammar/vocabulary cap was introduced.

**Still FAIL CONTENT QA.** The instruction/metadata milestone and reviewed comparison groups do not clear whole-corpus repetition of misconceptions, referrals and resolutions. Latest continuation compared 29 complete exchanges across missing bicycles, postal records, administrative notices, bank transfers/references/salary, bank address changes and identity/name evidence. **Next groups: clinic appointment/identity/result and police lost-document/scam exchanges**, using the current source inventory. No translations or PRF-002 until CONTENT PASS is justified and persisted.

`PRF-001_LOCATION_LABEL_REPAIRS.json` records 240 PRF-001-only record changes: ambiguous Monbetsu/Mikasa/Utashinai/Ishikari/Date/Hokuto station-like names become transport learning enquiries; fictitious hospital/bank/police/post/park labels explicitly describe simulations; synthetic operating hours removed. IDs, categories and other prefectures preserved. This is honest labelling rather than certification that real staffed counters or services exist. The later operational-metadata report removes the remaining twenty sets of unverified hours, incomplete addresses and service assertions; venue authenticity is not certified. Official JR reference URLs are recorded in the report.

Effective canonical difficulty is None for all 299; all shared rewritten turns have unrestricted grammar/vocabulary targets. No UI/route/loader changes. Native-speaker review is not claimed. Translation remains deferred. Do not begin PRF-002 until full content QA and remote verification.

## Concurrent checkpoint reconciliation

Remote advanced to `b893911a130dadaea94be73c6e87497809c7d0dd` while this batch was being prepared. Preserved its reviewed instruction/title edits for all 42 overlapping scenarios, remote Tomakomai bank procedure repair and continuation history. Kept independent nonconflicting clarifications and the documented Obihiro semantic replacement; both original histories remain in the reconciliation commit parents. Re-ran source/runtime parity after merging.

## Durability

Direct shell push lacks credentials; use the authenticated GitHub connection to create tree/commit and fast-forward the required branch with force=false. Fetch, verify the local staged tree matches the remote commit, merge fast-forward, and require `node scripts/check-work-persistence.mjs` to report WORK PERSISTENCE PASS. Original utterances remain in Git history and timestamped backups.

Additional continuation reconciliation: preserve remote `32a2d3b1f3caa24a70401ec4ef2f8fd6e5b5f407` semantic repairs and all source/canonical alignment. Local independent instruction/title history is retained as a merge parent `6faf87ddf34508a40e68614d6c1c4c41d034c9b2`; expanded duplicate and canonical parity checks remain active. No CONTENT PASS claimed.

## Station-accessibility and operational-metadata continuation

Complete exchanges read together: Wakkanai -01, Akabira -01, Iwamizawa -01 and Mikasa -01. Wakkanai now concerns a supplied fictional stroller-folding condition, child/bag roles, preparation time and onboard storage instead of another stair-free route enquiry. Akabira NPC supplies the requested short first segment, confirms the player's orientation/landmark teachback and agrees a rest point; all route features are explicitly fictional in authoring/canonical situation. Iwamizawa retains connection feasibility/later-candidate choice; Mikasa retains pre-trip wrong-station-diagram correction across two stations. This closes only that comparison group, not whole-corpus semantic QA.

`PRF-001_OPERATIONAL_METADATA_REPAIRS.json` records 20 narrow PRF-001 location changes: unverified hours, incomplete addresses and service assertions removed; an invented Gusto branch and a supposedly current construction site relabelled as imagined settings. All 293 locations used by the 299 exchanges now have no asserted opening hours or street addresses. Real venue/service verification is not claimed; IDs, categories, routing, ordering and all other prefectures remain unchanged.

Full task/answer/title exact-duplicate checks and canonical premise/initial-goal parity are clear for 299. Content remains FAIL CONTENT QA until remaining causal/misconception/referral/resolution groups are reviewed; translations and PRF-002 remain deferred. Next group remains the four missing-bicycle stories listed above, unless the newest remote checkpoint has already advanced it.

Missing-bicycle group read in full and compared: Wakkanai, Kushiro, Akabira and Takikawa -04. Kushiro now updates an existing consultation after manager storage is located, distinguishes matching numbers from next-day physical collection, and asks about follow-up. Snow-clearance uncertainty, used-bicycle ownership proof and resolved parking-memory error remain distinct in the other three. CONTENT QA remains pending. Next comparison group: postal dispatch/receipt records (Akabira -05, Wakkanai -05, Mikasa -05, Asahikawa -08 and Abashiri -05).

Postal-record group: five complete exchanges compared. Mikasa fully rewritten as two-parcel status reconciliation, correcting an all-delivered report and enquiring only about the second parcel; fictional status updates do not guarantee arrival or prove contents. Dispatch-date evidence, current redelivery notice, arrive-by deadline and signed-original return remain distinct in the other four. CONTENT QA remains pending; next compare administrative notice/payment/reference-number misunderstandings across the current source inventory.

Administrative notices: Yubari, Iwamizawa, Ebetsu, Nayoro and Tomakomai -02 compared in full, with Asahikawa postal deadline cross-check. Yubari fully replaced to resolve a changed booking date/time and venue under the same reference; NPC confirms the fictional current booking, player corrects the calendar and coordinates leave without claiming attendance or another slot guaranteed. Twenty replacement records now documented. CONTENT QA remains pending; next compare bank transfer recipient/reference/ownership and address-change groups.

Bank transfer/reference/salary group: six complete exchanges compared (Abashiri -06, Kushiro -06-002, Monbetsu -06, Furano -06, Kitami -06, Hokuto -06). Furano NPC now actually answers the truncated-display question with fictional whole-field evidence; one order/account field repair remains different from Monbetsu two-bill recipient identification. Known-contact unavailable vs confirmed, wrong own account vs staged account migration also remain distinct. No new full-replacement record added; twenty remain. CONTENT QA pending. Next: bank address-change and identity-proof groups, then remaining corpus causal comparisons.

Bank address-change and identity-name groups: nine complete exchanges compared. Address-change decisions remain distinct; Muroran fully rewritten to complete an explicitly fictional surname/given-name transcription, catch an omitted family-name component and obtain an NPC field comparison instead of another opening-document referral. Twenty-one full replacement records are now documented. CONTENT QA remains pending. Next: clinic appointment/identity/result and police lost-document/scam comparison groups; do not start translations or PRF-002.

Concurrent continuation reconciled: preserve published Mikasa parcel-status replacement, Yubari booking repair and all bank-group changes at `4d0df355c6df2069014067d8721931fc9d0e8f7d`. Independent postal comparison and alternative work/private-postage draft retained in parent history `5e1c47ad2f60f85896d8eaf49562761954945796`, not canonical runtime. No CONTENT PASS. This continuation will audit postal contents/packing to avoid repeating the clinic/police groups assigned in the concurrent checkpoint.

## Postal continuation: 23 complete exchanges

Read all eleven turns of six contents/packing, nine receipt/move-scope and eight label/correspondence/signature exchanges. Bibai completely replaced because its battery declaration/removal path duplicated Muroran. New fictional case identifies and returns a just-accepted wrong-size gift, corrects the family notification and avoids a duplicate dispatch. Date NPC now actually supplies the requested fictional work space. Retained other exchanges with scenario-specific decision/evidence and explicit pending outcomes in semantic review. No real postal procedure, facility or service availability certified. Twenty-two canonical full replacements now documented; alternative Mikasa postage draft is history only. CONTENT QA remains FAIL; no translations or PRF-002. This continuation next audits supermarket packaging/quantity/order-resolution groups to avoid duplicating concurrent clinic/police work; newest remote may supersede that assignment.

## Supermarket continuation: 32 complete exchanges

Read 32 full price/packaging, ingredient/preparation/quantity, payment/grouping/order and post-purchase/gift exchanges. Ebetsu replaced by five-person recipe, 100ml graduation and 200+100ml packages; an unpublished household-stock draft was rejected after Hokuto/Utashinai comparison. Ashibetsu replaced by excess change: incorrect tender entry corrected, 500 yen returned and 320 yen counted. Bibai and Monbetsu NPCs now answer card-order/split-payment questions with explicitly fictional terminal rules. Numerical calculations checked. Twenty-four canonical replacements documented. No real store policy or allergy/product certification. CONTENT QA remains FAIL; no translations or PRF-002. Next independent group: cafe/restaurant orders, seating and payment resolution; preserve concurrent clinic/police audits and reconcile latest remote before publication.

## Restaurant continuation and NPC immersion

Five full restaurant exchanges compared. Susukino now resolves fictional late-guest seats, separate-payment and cover charge conditions and receives a concrete two-person decision; Hakodate explains beer/tea receipt abbreviations and resolves one-payer settlement; Asahikawa ramen returns the chef response and takes a concrete less-noodles order. Sapporo luggage seating and Asahikawa expense-document format remain honestly pending. Six NPC utterances referencing this scenario were removed from the previously repaired postal/market dialogues; fictional conditions remain in metadata. Latest source/runtime replacement hashes refreshed. No real business policy certified. This continuation has now read 60 distinct complete postal/market/restaurant exchanges. All 299 still require complete whole-corpus semantic signoff: CONTENT QA remains FAIL, no translations or PRF-002. Next independent comparison group: park lost-property/walking/observation/permission stories, starting Abashiri -08, Ashibetsu -08, Rumoi -08, Fukagawa -08, Furano -08 and Akabira -08; check latest remote first to preserve concurrent work.

## Park, observation and viewpoint continuation: 33 full exchanges

Mikasa replaced repeated snow-return plot with fictional stamp-location evidence, folded-card review and completed postcard selection. Monbetsu identifies/returns the right glove; Akabira gives actual fictional entrance-route instructions. Kitami, Muroran, Iwamizawa and Shibetsu supply requested route/facility/transport evidence rather than another promise to check. Nayoro, Tomakomai, Yubari, Ebetsu, Takikawa, Eniwa and Noboribetsu supply bounded fictional participation/space conditions and obtain concrete choices. Fourteen canonical scenarios changed, runtime IDs/turns/links/UI and other prefectures preserved. Weather-return and generic referral overlap addressed without certifying real conditions. Twenty-five full replacements documented. No CONTENT PASS, translations or PRF-002. Continue with remaining named sightseeing/culture/transport cases and remaining clinic/police comparisons, checking the latest remote first.


## Named culture, transport and retail continuation: 23 full exchanges

Craft supplies fictional next-day delivery and 2300 yen total; gear demonstration supplies two opposite rotations for 20/10 teeth; onsen supplies rental return and locker-key handling; coffee completes one 200ml order after stating two-cup carrier unavailable. Asahikawa learning metadata removes inconsistent Shinkansen-gate assertion. Other genuinely unknown stock, contract, transit or setup conditions remain pending. No new full replacement or real venue certification. CONTENT QA remains FAIL.


## Clinic continuation: 23 full exchanges

Yubari now checks two sleep bouts (3+2=5, not continuous five hours) and next-day sleepiness, replacing wrist-pain overlap with Sapporo. Nine targeted repairs: Abashiri named-test reception, Akabira separate child IDs, Ashibetsu actual fictional certificate response, Mikasa current booking/calendar, Kitahiroshima A/B document sequence, Ebetsu symptom timeline, Ishikari cross-midnight date correction, Tomakomai completed patient-name comparison, Noboribetsu number-screen and written enquiry. Medical judgments remain with clinicians. No real hospital handling or medical content approval. Twenty-six full replacements; CONTENT QA remains FAIL. Next police comparison group.


## Police continuation: 16 full exchanges

Kitami claimant-verification overlap replaced by correction of existing recordK-27 using original versus forwarded photograph time. Abashiri updates contact regained/reunion pending, Ashibetsu reads answered/pending searches and current photo, Mikasa separates battery/frame identifiers, Nayoro receives only found umbrella, Rumoi distinguishes18:10 last use from16:40 stale update. Nemuro premise does not defer consultation for photos; Monbetsu sender identity remains undetermined.27 full replacements and188 distinct full exchanges in comparison records; CONTENT QA remains FAIL. The main shared workspace contains concurrent unfinished UI edits; this batch uses an isolated repository copy to preserve them and verify only published audit work. Next unreviewed transport cases.
