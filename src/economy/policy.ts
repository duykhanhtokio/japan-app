/**
 * Japan App economy policy — client-side projections and eligibility hints.
 * SECURITY: Never issue rewards, verify purchases, or redeem gift cards on device.
 * A trusted backend must authenticate sessions, purchases, referrals and ledger entries.
 */
export type Plan = 'free' | 'premium';
export type Activity = 'jlpt' | 'dialogue' | 'daily' | 'weekly' | 'monthly';
export const ECONOMY_POLICY = Object.freeze({
  premiumMonthlyYen: 3000,
  platformFeeStressRate: 0.26,
  consumptionTaxRate: 0.10,
  premiumPointsPerValidMinute: 1,
  pointsPerYen: 10,
  minimumAmazonRedemptionYen: 1000,
  freeDailyAds: { min: 2, max: 4 },
  premiumDailyAds: { min: 0, max: 2 },
  referral: {
    free: { rewardYen: 100, minimumElapsedDays: 30, minimumValidHours: 50 },
    premium: { rewardYen: 500, minimumPaidMonths: 3, minimumValidHours: 100 },
  },
} as const);

export interface LearningEvidence {
  foreground: boolean;
  interactive: boolean;
  verificationPassed: boolean;
  elapsedSeconds: number;
  idleSeconds: number;
}
export function eligibleLearningSeconds(e: LearningEvidence): number {
  if (!e.foreground || !e.interactive || !e.verificationPassed) return 0;
  if (![e.elapsedSeconds, e.idleSeconds].every(Number.isFinite)) return 0;
  return Math.max(0, Math.floor(e.elapsedSeconds) - Math.max(0, Math.floor(e.idleSeconds)));
}
export function projectedPoints(plan: Plan, verifiedSeconds: number): number {
  if (plan !== 'premium' || !Number.isFinite(verifiedSeconds)) return 0;
  return Math.max(0, Math.floor(verifiedSeconds / 60));
}
export function yenFromPoints(points: number): number {
  return Number.isFinite(points) ? Math.max(0, Math.floor(points / ECONOMY_POLICY.pointsPerYen)) : 0;
}
export function canRequestAmazonRedemption(plan: Plan, availablePoints: number): boolean {
  return plan === 'premium' && yenFromPoints(availablePoints) >= ECONOMY_POLICY.minimumAmazonRedemptionYen;
}
export interface ReferralEvidence {
  accountAgeDays: number;
  validLearningHours: number;
  paidMonths: number;
  rewardAlreadyIssued: boolean;
  isSelfReferral: boolean;
}
export function eligibleReferralRewardYen(kind: Plan, e: ReferralEvidence): number {
  if (e.rewardAlreadyIssued || e.isSelfReferral) return 0;
  if (![e.accountAgeDays, e.validLearningHours, e.paidMonths].every(Number.isFinite)) return 0;
  if (kind === 'free') {
    return e.accountAgeDays > ECONOMY_POLICY.referral.free.minimumElapsedDays &&
      e.validLearningHours >= ECONOMY_POLICY.referral.free.minimumValidHours ? 100 : 0;
  }
  return e.paidMonths > ECONOMY_POLICY.referral.premium.minimumPaidMonths &&
    e.validLearningHours >= ECONOMY_POLICY.referral.premium.minimumValidHours ? 500 : 0;
}
export function shouldOfferAd(plan: Plan, activity: Activity, completed: boolean, adsToday: number): boolean {
  if (!completed || !Number.isInteger(adsToday) || adsToday < 0) return false;
  const eligible = ['jlpt', 'dialogue', 'daily', 'weekly', 'monthly'].includes(activity);
  return eligible && adsToday < (plan === 'premium' ? 2 : 4);
}
export function premiumNetRevenueStressYen(paidUsers: number): number {
  if (!Number.isFinite(paidUsers) || paidUsers < 0) return 0;
  // Illustrative only: 26% platform fee; VAT/tax handling depends on storefront and jurisdiction.
  return Math.floor(paidUsers * ECONOMY_POLICY.premiumMonthlyYen * (1 - ECONOMY_POLICY.platformFeeStressRate));
}
