const assert = require('node:assert/strict');

// Preserve historical all-locale receipts; a later confirmed field correction
// supplies a strict revision chain without claiming a new whole-scenario review.
function loadReviewAmendments({read, hash, digest, exists, reviewFiles}) {
  const base = 'docs/localization-workspace/fast-screen-all-7128/';
  const manifest = base + 'review-amendments.json';
  const evidenceFiles = [], entries = [], used = new Set();
  const safeProofPath = p => typeof p === 'string' && p.startsWith(base) && !p.split('/').includes('..');
  const key = a => [a.reviewReceiptPath, a.scenarioId, a.locale, a.turnId, a.field].join('|');
  if (exists(manifest)) {
    const data = read(manifest);
    assert.equal(data.nativeReviewed, false);
    evidenceFiles.push(manifest);
    for (const a of data.amendments) {
      assert(reviewFiles.includes(a.reviewReceiptPath), 'Unknown historical receipt');
      assert.equal(hash(a.reviewReceiptPath), a.reviewReceiptSha256, 'Historical receipt changed');
      assert(safeProofPath(a.fixReceiptPath), 'Unsafe amendment proof path');
      assert.equal(hash(a.fixReceiptPath), a.fixReceiptSha256, 'Changed field-fix receipt');
      const fix = read(a.fixReceiptPath);
      assert.equal(fix.status, 'APPLIED_CONFIRMED_FLAGGED_FIELD_FIX');
      assert.equal(fix.nativeReviewed, false);
      assert.equal(fix.wholeScenarioReviewedThisPass, false);
      assert.equal(fix.fullContextCountIncrement, 0);
      for (const field of ['scenarioId', 'locale', 'turnId', 'field', 'sourceSha256', 'previousTargetSha256', 'currentTargetSha256']) {
        assert.equal(fix[field], a[field], 'Amendment/proof mismatch: ' + field);
      }
      assert.equal(fix.priorReviewReceiptPath, a.reviewReceiptPath);
      assert.equal(fix.priorReviewReceiptSha256, a.reviewReceiptSha256);
      assert.equal(digest(fix.before), a.previousTargetSha256);
      assert.equal(digest(fix.after), a.currentTargetSha256);
      assert.notEqual(a.previousTargetSha256, a.currentTargetSha256);
      assert(safeProofPath(fix.decisionPath), 'Unsafe decision path');
      assert.equal(hash(fix.decisionPath), fix.decisionSha256, 'Changed author decision');
      const decisions = read(fix.decisionPath);
      assert.equal(decisions.nativeReviewed, false);
      const matches = decisions.items.filter(d => d.id === fix.id);
      assert.equal(matches.length, 1);
      const decision = matches[0];
      assert.equal(decision.decision, 'propose_fix');
      assert.equal(decision.confirmedFix, true);
      assert(decision.selfValidationReason?.trim());
      assert.equal(decision.sourceSha256, a.sourceSha256);
      assert.equal(decision.translationSha256, a.previousTargetSha256);
      assert.equal(decision.proposedTarget, fix.after);
      assert(!entries.some(e => key(e) === key(a)), 'Duplicate field amendment');
      entries.push(a);
      evidenceFiles.push(a.fixReceiptPath, fix.decisionPath);
    }
  }
  return {
    evidenceFiles: [...new Set(evidenceFiles)],
    resolve(input) {
      const a = entries.find(e => key(e) === key(input));
      if (!a) return input.previousTargetSha256;
      assert.equal(input.sourceSha256, a.sourceSha256, 'Amended source is stale');
      assert.equal(input.previousTargetSha256, a.previousTargetSha256, 'Amended historical target differs');
      assert(!used.has(key(a)), 'Field amendment applied twice');
      used.add(key(a));
      return a.currentTargetSha256;
    },
    assertAllUsed() { assert.equal(used.size, entries.length, 'Unused field amendment'); },
    get count() { return used.size; },
  };
}
module.exports = {loadReviewAmendments};
