/** Server-side domain primitives. Execute inside an authenticated DB transaction only. */
export type LedgerKind = 'learning' | 'referral' | 'redemption_hold' | 'redemption_release' | 'redemption_complete' | 'admin_adjustment';
export interface LedgerEntry {
  id: string;
  userId: string;
  idempotencyKey: string;
  kind: LedgerKind;
  deltaPoints: number;
  createdAt: string;
  referenceId: string;
}
export interface WalletSnapshot { availablePoints: number; heldPoints: number; }
export function calculateWallet(entries: readonly LedgerEntry[]): WalletSnapshot {
  const seen = new Set<string>();
  let availablePoints = 0;
  let heldPoints = 0;
  for (const e of entries) {
    if (!e.userId || !e.referenceId || !e.idempotencyKey || !Number.isSafeInteger(e.deltaPoints)) throw new Error('Invalid ledger entry');
    const unique = e.userId + ':' + e.idempotencyKey;
    if (seen.has(unique)) throw new Error('Duplicate idempotency key');
    seen.add(unique);
    if (e.kind === 'redemption_hold') {
      if (e.deltaPoints >= 0) throw new Error('Hold must debit available points');
      availablePoints += e.deltaPoints;
      heldPoints -= e.deltaPoints;
    } else if (e.kind === 'redemption_release') {
      if (e.deltaPoints <= 0) throw new Error('Release must credit available points');
      availablePoints += e.deltaPoints;
      heldPoints -= e.deltaPoints;
    } else if (e.kind === 'redemption_complete') {
      if (e.deltaPoints >= 0) throw new Error('Completion must consume held points');
      heldPoints += e.deltaPoints;
    } else {
      availablePoints += e.deltaPoints;
    }
    if (!Number.isSafeInteger(availablePoints) || !Number.isSafeInteger(heldPoints) || availablePoints < 0 || heldPoints < 0) throw new Error('Insufficient balance or overflow');
  }
  return { availablePoints, heldPoints };
}
export function redemptionPoints(yen: number): number {
  if (!Number.isSafeInteger(yen) || yen < 1000) throw new Error('Minimum redemption is 1000 JPY');
  const points = yen * 10;
  if (!Number.isSafeInteger(points)) throw new Error('Invalid redemption amount');
  return points;
}
