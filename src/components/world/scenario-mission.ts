import type { LifeScenario } from '@/types/life-conversation';

export function scenarioMission(scenario?: LifeScenario | null, category?: string | null): string {
  if (!scenario) return '相手に用件を伝え、必要な情報を確認しましょう。';
  const text = `${scenario.name} ${scenario.situation ?? ''}`;
  if (/新幹線|特急|切符|きっぷ|乗車券/.test(text)) return '新幹線・特急の行き先と時間を伝え、必要な切符を購入しましょう。';
  if (/番線|ホーム/.test(text)) return '目的地へ向かう電車の番線と発車時刻を駅員に確認しましょう。';
  if (/乗り換え|乗換/.test(text)) return '目的地までの乗り換え駅・路線・番線を確認しましょう。';
  if (/行き方|道/.test(text) && /station|駅/i.test(`${category ?? ''} ${text}`)) return '目的地までの路線・乗り換え・番線を駅員に尋ね、案内を確認しましょう。';
  if (/予約|チェックイン/.test(text)) return '予約内容を伝え、必要な手続きと案内を確認しましょう。';
  if (/注文|メニュー/.test(text)) return '希望の商品を注文し、数量・料金・受け取り方法を確認しましょう。';
  if (/買|購入|支払/.test(text)) return '欲しい商品を伝え、在庫・料金・支払い方法を確認しましょう。';
  if (/病院|薬|症状/.test(text)) return '症状を具体的に伝え、受診や薬の案内を確認しましょう。';
  const goal = scenario.playerGoal?.replace(/。$/, '');
  if (goal && !/場所に合った|基本的な用件/.test(goal)) return `${goal}。相手の返答を確認して目的を達成しましょう。`;
  return `「${scenario.name}」を実践し、相手に用件を伝えて必要な情報を確認しましょう。`;
}
