# NPC role inventory and location corrections — 2026-10-06

User requested auditing duplicated NPCs across institutions and restoring correct roles.

## Findings

All 25 top-level NPC assets are distinct, including decoded pixel content. The runtime category-to-image mapping already points Convenience Store and Supermarket at different character assets. The actual defect is misclassified location metadata: 76 locations select another institution’s NPC, profession label and background.

Corrections are stored separately from generated source content and applied once in life-content-repository before getters build their location indexes. Stable IDs, city membership, scenario text, player answers and dialogue history remain unchanged. Category-based rewards and artwork preparation now consume the corrected role. Existing background resolver rejects incompatible old category assignments and selects an existing correct-category image.

| Correct role | Corrected locations |
|---|---:|
| Convenience Store | 22 |
| Post Office | 22 |
| Bank | 22 |
| Pharmacy | 9 |
| Supermarket | 1 |

## Exact reviewed corrections

| Location | Name | Previous category | Correct category |
|---|---|---|---|
| LOC-005-04 | ローソン秋田駅前店 | Supermarket | Convenience Store |
| LOC-005-06 | 秋田中央郵便局 | Government Office | Post Office |
| LOC-005-07 | 秋田銀行本店 | Government Office | Bank |
| LOC-006-04 | セブンイレブン山形駅前店 | Supermarket | Convenience Store |
| LOC-006-06 | 山形中央郵便局 | Government Office | Post Office |
| LOC-006-07 | 山形銀行本店 | Government Office | Bank |
| LOC-007-04 | ローソン福島駅前店 | Supermarket | Convenience Store |
| LOC-007-06 | 福島中央郵便局 | Government Office | Post Office |
| LOC-007-07 | 東邦銀行本店 | Government Office | Bank |
| LOC-008-04 | ローソン水戸駅前店 | Supermarket | Convenience Store |
| LOC-008-06 | 水戸中央郵便局 | Government Office | Post Office |
| LOC-008-07 | 常陽銀行水戸支店 | Government Office | Bank |
| LOC-010-04 | ローソン前橋駅前店 | Supermarket | Convenience Store |
| LOC-010-06 | 前橋中央郵便局 | Government Office | Post Office |
| LOC-010-07 | 群馬銀行本店 | Government Office | Bank |
| LOC-016-04 | セブンイレブン富山駅前店 | Supermarket | Convenience Store |
| LOC-016-06 | 富山中央郵便局 | Government Office | Post Office |
| LOC-016-07 | 富山銀行本店 | Government Office | Bank |
| LOC-016-12 | スギ薬局富山店 | Hospital | Pharmacy |
| LOC-018-04 | ローソン福井駅前店 | Supermarket | Convenience Store |
| LOC-018-06 | 福井中央郵便局 | Government Office | Post Office |
| LOC-018-07 | 福井銀行本店 | Government Office | Bank |
| LOC-020-04 | セブンイレブン長野駅前店 | Supermarket | Convenience Store |
| LOC-020-06 | 長野中央郵便局 | Government Office | Post Office |
| LOC-020-07 | 八十二銀行本店 | Government Office | Bank |
| LOC-021-04 | ファミリーマート岐阜駅前店 | Supermarket | Convenience Store |
| LOC-021-06 | 岐阜中央郵便局 | Government Office | Post Office |
| LOC-021-07 | 十六銀行本店 | Government Office | Bank |
| LOC-021-12 | スギ薬局岐阜店 | Hospital | Pharmacy |
| LOC-024-04 | ローソン近鉄津駅前店 | Supermarket | Convenience Store |
| LOC-024-06 | 津中央郵便局 | Government Office | Post Office |
| LOC-024-07 | 百五銀行本店 | Government Office | Bank |
| LOC-025-04 | ローソン大津駅前店 | Supermarket | Convenience Store |
| LOC-025-06 | 大津中央郵便局 | Government Office | Post Office |
| LOC-025-07 | 滋賀銀行本店 | Government Office | Bank |
| LOC-029-04 | ファミリーマート近鉄奈良駅前店 | Supermarket | Convenience Store |
| LOC-029-06 | 奈良中央郵便局 | Government Office | Post Office |
| LOC-029-07 | 南都銀行本店 | Government Office | Bank |
| LOC-029-12 | ウエルシア薬局奈良店 | Hospital | Pharmacy |
| LOC-030-04 | ファミリーマートJR和歌山駅前店 | Supermarket | Convenience Store |
| LOC-030-06 | 和歌山中央郵便局 | Government Office | Post Office |
| LOC-030-07 | 紀陽銀行本店 | Government Office | Bank |
| LOC-030-12 | コスモス薬局和歌山店 | Hospital | Pharmacy |
| LOC-035-04 | ローソン山口駅前店 | Supermarket | Convenience Store |
| LOC-035-06 | 山口中央郵便局 | Government Office | Post Office |
| LOC-035-07 | 山口銀行本店 | Government Office | Bank |
| LOC-036-04 | ローソン徳島駅前店 | Supermarket | Convenience Store |
| LOC-036-06 | 徳島中央郵便局 | Government Office | Post Office |
| LOC-036-07 | 阿波銀行本店 | Government Office | Bank |
| LOC-037-04 | ファミリーマート高松駅前店 | Supermarket | Convenience Store |
| LOC-037-06 | 高松中央郵便局 | Government Office | Post Office |
| LOC-037-07 | 百十四銀行本店 | Government Office | Bank |
| LOC-037-12 | ウエルシア薬局高松店 | Hospital | Pharmacy |
| LOC-038-04 | ローソン松山駅前店 | Supermarket | Convenience Store |
| LOC-038-06 | 松山中央郵便局 | Government Office | Post Office |
| LOC-038-07 | 伊予銀行本店 | Government Office | Bank |
| LOC-039-04 | ローソン高知駅前店 | Supermarket | Convenience Store |
| LOC-039-06 | 高知中央郵便局 | Government Office | Post Office |
| LOC-039-07 | 四国銀行本店 | Government Office | Bank |
| LOC-039-12 | スギ薬局高知店 | Hospital | Pharmacy |
| LOC-041-04 | ファミリーマート佐賀駅前店 | Supermarket | Convenience Store |
| LOC-041-06 | 佐賀中央郵便局 | Government Office | Post Office |
| LOC-041-07 | 佐賀銀行本店 | Government Office | Bank |
| LOC-042-04 | ローソン長崎駅前店 | Supermarket | Convenience Store |
| LOC-042-06 | 長崎中央郵便局 | Government Office | Post Office |
| LOC-042-07 | 十八銀行本店 | Government Office | Bank |
| LOC-042-12 | コスモス薬局長崎店 | Hospital | Pharmacy |
| LOC-044-04 | ローソン大分駅前店 | Supermarket | Convenience Store |
| LOC-044-06 | 大分中央郵便局 | Government Office | Post Office |
| LOC-044-07 | 大分銀行本店 | Government Office | Bank |
| LOC-044-12 | コスモス薬局大分店 | Hospital | Pharmacy |
| LOC-045-04 | ローソン宮崎駅前店 | Supermarket | Convenience Store |
| LOC-045-06 | 宮崎中央郵便局 | Government Office | Post Office |
| LOC-045-07 | 宮崎銀行本店 | Government Office | Bank |
| LOC-045-12 | コスモス薬局宮崎店 | Hospital | Pharmacy |
| LOC-010-13 | ケイヨースーパー前橋店 | Shopping | Supermarket |

## Unresolved source-role gaps

Nine coin laundries are currently categorized as Convenience Store. There is no laundry NPC or scene category/artwork in the approved 25-category asset set. They are recorded as unresolved; they are not included in the 76 corrected claims. A dedicated laundry role and appropriate approved artwork are still needed.

- LOC-AIC-TOYOTA-02: 豊田コインランドリー
- LOC-HYG-AMAGASAKI-02: 尼崎コインランドリー
- LOC-KNG-KAWASAKI-02: 川崎コインランドリー
- LOC-KUM-AMAKUSA-05: 天草コインランドリー
- LOC-OSK-HIGASHIOSAKA-03: 東大阪コインランドリー
- LOC-SIT-KAWAGUCHI-03: 川口コインランドリー
- LOC-SMN-ODA-06: 大田コインランドリー
- LOC-TKY-HACHIOJI-02: 八王子コインランドリー
- LOC-TTR-IWAMI-07: 岩美コインランドリー

## Validation

scripts/check-location-npc-roles.cjs checks all 7,112 locations through the real TypeScript repository implementation, asserts the 76 corrected roles and job labels, checks asset existence and distinct per-role images, and preserves the historical Iwate Bank landmark exception. JLPT UI lock, route transition contract and diff whitespace pass. Scoped ESLint passes. TypeScript retains the known missing type in SC-HKD-HAKODATE-001 at life-content-repository.ts (line moves to 47); no new diagnostics. Native simulator visual acceptance remains pending. Full web export was killed by the environment (exit 137), including a single-worker retry. Browser visual acceptance could not be completed; no browser pass is claimed.
