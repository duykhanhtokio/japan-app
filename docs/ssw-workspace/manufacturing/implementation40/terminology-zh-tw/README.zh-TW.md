# 繁體中文術語定義語義比對 — implementation40

本輪完整閱讀1077個有效目標定義欄位，依「日文術語＋完整日文定義＋完整有效繁中譯文」組成1072個不同三元組。八批均已逐項讀取；僅五個完全相同三元組的重複欄位共享判斷，仍保留每個key、目標hash、日文來源hash與實際JSON欄位位置。沒有依非空、字串長度或hash相同自動通過語義。

結果：1060欄保留；14欄提供精確修改前後文字；3欄譯文跟隨日文本身的含糊定義，保留目標並送日文原作者確認。未讀欄位0。這是AI定義語義比對，不是母語人士或領域專家簽核，也不是全文、所有考題翻譯或譯後術語名稱欄位的完整驗收。

## 建議整合的14個精確修正

| 術語 | 修正原因 | 新譯文 |
|---|---|---|
| 指揮系統 | role_relation | 進行指示與報告時，各職責之間的指揮與通報關係。 |
| チェックシート | wrong_word | 按已定義的項目收集資料的表格。 |
| 相関 | scope_narrowing | 兩個量之間可觀察到的關聯。 |
| 第三角法 | drawing_term_precision | 將投影圖配置在與觀察方向相對應一側的正投影法。 |
| 正面図 | drawing_term_precision | 主要用來表示形狀或功能的投影圖。 |
| フラックス | process_scope | 軟銲時幫助處理氧化膜並促進潤濕的材料。 |
| 始動 | machine_context | 從停機狀態開始運轉。 |
| 構造検査 | incomplete_phrase | 按要求核對產品的構成、重量、強度等的檢驗。 |
| 円筒度 | geometric_meaning | 與圓柱形狀規整程度有關的幾何特性。 |
| メニスカス | wrong_character | 因與器壁相互作用而彎曲的液面。 |
| 照度 | photometric_quantity | 表示照射到表面之光照程度的量。 |
| 接合性 | process_scope | 容易透過軟銲等方式接合的性質。 |
| 報連相 | wrong_action | 結合報告、聯絡與諮詢的資訊共享方式。 |
| 一液型 | formulation_vs_quantity | 作為單一塗料使用的形式。 |

`corrections.json`包含每筆key、locale、targetField、targetSha256、lessonSourceHash、before、after與具體日文理由。整合者應以全部before/hash/日文版本守衛寫入，不可依術語名稱全域取代；例如軟銲助焊劑與熱浸鍍前處理フラックス必須保留不同語境。此分工未寫入任何runtime/core/翻譯檔案。

## 日文原定義待精密化

端数：整數部分為0、取整餘量等情況的範圍不清；圧力：入門定義未明示每單位面積的區別；質量：物質の量容易與mol的物質量混淆。三筆保存在`japanese-definition-holds.json`，不把原文問題偽裝成目標語錯誤，也不只修改譯文而留下原文版本失配。

## 接受但保留語境的用語

閘／柵、二極體／二極管等區域慣用形式未僅因詞形差異判為技術誤譯。半導體junction的結／接面仍保留專業用語統一候選；本輪確認其多數載子減少的意思沒有反轉。pH7的兩筆保留「入門例」限定，不追加所有溫度與材料下的普遍中性條件。

## 驗證

build_review.py可依固定輸入重新產生判斷紀錄。validation.json檢查1077個key完全相等、每個有效目標hash、分組成員、14個before≠after與1072組明確語義決定；此技術檢查不等於語義閱讀本身。保留nativeReviewed/domainReviewed/physicalDeviceVerified=false。
