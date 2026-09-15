const CATEGORY_LABELS: [RegExp, string][] = [
  [/amusement/, '遊園地'], [/station/, '駅'], [/cafe/, 'カフェ'], [/ramen/, 'ラーメン店'],
  [/izakaya/, '居酒屋'], [/restaurant/, '飲食店'], [/hotel/, 'ホテル'], [/onsen/, '温泉'],
  [/convenience/, 'コンビニ'], [/pharmacy/, '薬局'], [/hospital/, '病院'], [/police/, '警察署'],
  [/government/, '市役所'], [/tax/, '税務署'], [/bank/, '銀行'], [/post/, '郵便局'],
  [/supermarket/, 'スーパーマーケット'], [/shopping/, '商業施設'], [/construction/, '工事現場'],
  [/museum/, '博物館'], [/shrine|temple/, '神社・寺院'], [/castle/, '城'], [/park/, '公園'],
  [/nature/, '自然体験'], [/landmark|sightseeing/, '観光名所'],
];

const REGION_LABELS: Record<string,string> = {
  hokkaido:'北海道',tohoku:'東北',kanto:'関東',chubu:'中部',kansai:'近畿',chugoku:'中国',shikoku:'四国',kyushu:'九州・沖縄',
};

export function categoryLabelJa(category?: string | null) {
  const value=(category??'').trim().toLowerCase();
  return CATEGORY_LABELS.find(([pattern])=>pattern.test(value))?.[1] ?? '会話スポット';
}

export function regionLabelJa(region?: string | null) {
  return REGION_LABELS[(region??'').toLowerCase()] ?? '地域';
}
