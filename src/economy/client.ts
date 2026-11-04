/** Client uses a signed token issued by a trusted auth service. Never mint it locally. */
export interface EconomyAccount {
  plan: 'free' | 'premium';
  premiumVerified: boolean;
  availablePoints: number;
  heldPoints: number;
  redemptionEnabled: boolean;
}
export async function getEconomyAccount(baseUrl: string, signedToken: string): Promise<EconomyAccount> {
  if (!/^https:\/\//.test(baseUrl)) throw Error('Economy API requires HTTPS');
  const response = await fetch(baseUrl.replace(/\/$/, '') + '/v1/economy/me', {
    headers: { Authorization: 'Bearer ' + signedToken },
  });
  if (!response.ok) throw Error('Economy account unavailable (' + response.status + ')');
  return await response.json() as EconomyAccount;
}
export async function submitLearningSession(baseUrl: string, signedToken: string, activity: string, sessionId: string) {
  if (!/^https:\/\//.test(baseUrl)) throw Error('Economy API requires HTTPS');
  const response = await fetch(baseUrl.replace(/\/$/, '') + '/v1/economy/learning-sessions', {
    method: 'POST', headers: { 'Content-Type':'application/json', Authorization:'Bearer '+signedToken },
    body: JSON.stringify({ activity, sessionId }),
  });
  if (!response.ok) throw Error('Session submission failed (' + response.status + ')');
  return await response.json() as { status: string; creditedPoints: number };
}
