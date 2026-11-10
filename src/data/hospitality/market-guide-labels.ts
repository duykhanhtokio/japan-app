/* Independent example disclaimer; native review pending. */
const labels:Record<string,string>={
  "ja": "分類後にB群を選ぶ図は、手順を区別するための架空例です。",
  "en": "Selecting group B after grouping is a fictional example to distinguish the two steps.",
  "vi": "Chọn nhóm B sau khi phân nhóm là ví dụ giả định để phân biệt hai bước.",
  "id": "Memilih kelompok B setelah pengelompokan adalah contoh rekaan untuk membedakan kedua langkah.",
  "zh-CN": "分类后选择B组是用于区分两个步骤的虚构示例。",
  "zh-TW": "分類後選擇B組是用於區分兩個步驟的虛構示例。",
  "hi": "समूहीकरण के बाद समूह B चुनना दोनों चरणों का अंतर समझाने के लिए एक काल्पनिक उदाहरण है।",
  "bn": "বিভাগ করার পরে B দল বেছে নেওয়া দুই ধাপের পার্থক্য বোঝানোর একটি কাল্পনিক উদাহরণ।",
  "ne": "समूह बनाएपछि B समूह छान्नु दुई चरण छुट्याउने काल्पनिक उदाहरण हो।",
  "my": "အုပ်စုခွဲပြီး B အုပ်စုကိုရွေးခြင်းသည် အဆင့်နှစ်ဆင့်ကွာခြားမှုကိုပြသသည့် စိတ်ကူးနမူနာဖြစ်သည်။",
  "th": "การเลือกกลุ่ม B หลังแบ่งกลุ่มเป็นตัวอย่างสมมติเพื่อแยกความต่างของสองขั้นตอน",
  "km": "ការជ្រើសក្រុម B បន្ទាប់ពីបែងចែកក្រុម គឺជាឧទាហរណ៍ប្រឌិតដើម្បីបែងចែកជំហានទាំងពីរ។",
  "tl": "Ang pagpili sa pangkat B matapos magpangkat ay kathang halimbawa upang maiba ang dalawang hakbang."
};
export function hotelMarketExampleLabel(language:string){return labels[language]||labels.ja;}
