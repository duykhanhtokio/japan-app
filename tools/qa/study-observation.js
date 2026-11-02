/* Manual observation clock. Never certifies native/device/domain acceptance. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudyObservation = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const phases = ['japanese', 'translation', 'figures', 'application', 'questions'];
  const sectors = ['agriculture', 'manufacturing', 'food', 'restaurant', 'hospitality', 'construction', 'kaigo'];
  const checks = ['coldStart', 'openScheduledDay', 'instructionalImage', 'readingAndTranslation', 'portraitLandscape', 'answerAndResume', 'backgroundAndRelaunch', 'submissionAndReview'];
  function finite(n) { return typeof n === 'number' && Number.isFinite(n) && n >= 0; }
  function create(metadata, now) {
    if (!Number.isFinite(now)) throw Error('Invalid wall clock');
    if (!sectors.includes(metadata.sector)) throw Error('Choose a sector');
    for (const key of ['anonymousLearner', 'deviceModel', 'os', 'buildLabel', 'locale', 'courseScope', 'studyDay', 'contentIds']) {
      if (typeof metadata[key] !== 'string' || !metadata[key].trim()) throw Error('Missing ' + key);
    }
    if (!/^[a-f0-9]{40}$/.test(metadata.buildCommit)) throw Error('Use exact 40-character app commit');
    if (!['nativeApp', 'mobileWeb', 'desktopWeb', 'simulator'].includes(metadata.target)) throw Error('Choose actual test target');
    return { schemaVersion: 1, kind: 'manual_learner_observation', metadata: { ...metadata }, startedAt: new Date(now).toISOString(), status: 'paused', segments: [], events: [], deviceChecks: Object.fromEntries(checks.map(k => [k, { status: 'not_run', note: '', evidence: '' }])), observation: { completed: null, comprehension: '', difficulty: '', notes: '' }, evidenceFiles: [], review: { physicalDeviceVerified: false, learnerDurationAccepted: false, nativeReviewed: false, domainReviewed: false } };
  }
  function segment(session, phase, elapsedMs, start, end) {
    if (session.status === 'finished') throw Error('Session already finished');
    if (!phases.includes(phase)) throw Error('Invalid learning phase');
    if (!finite(elapsedMs) || !Number.isFinite(start) || !Number.isFinite(end) || end < start || elapsedMs > end - start + 1000) throw Error('Invalid measured interval');
    session.segments.push({ phase, activeMs: elapsedMs, startedAt: new Date(start).toISOString(), endedAt: new Date(end).toISOString(), method: 'operator_monotonic_clock' });
  }
  function setCheck(session, key, status, note, evidence) {
    if (session.status === 'finished') throw Error('Session already finished');
    if (!checks.includes(key) || !['not_run', 'pass', 'fail', 'blocked'].includes(status)) throw Error('Invalid device check');
    if (status !== 'not_run' && (!note.trim() || !evidence.trim())) throw Error('Observed checks need actual result and evidence reference');
    session.deviceChecks[key] = { status, note: note.trim(), evidence: evidence.trim() };
  }
  function summary(session) {
    const byPhaseMs = Object.fromEntries(phases.map(k => [k, 0]));
    for (const s of session.segments) {
      if (!phases.includes(s.phase) || !finite(s.activeMs)) throw Error('Corrupt segment');
      byPhaseMs[s.phase] += s.activeMs;
    }
    const activeMs = Object.values(byPhaseMs).reduce((a, b) => a + b, 0);
    return { byPhaseMs, activeMs, activeMinutes: activeMs / 60000, targetMinutes: 30, targetIsNotMeasuredAcceptance: true };
  }
  function finish(session, now) {
    if (session.status === 'finished') throw Error('Session already finished');
    if (!Number.isFinite(now) || now < Date.parse(session.startedAt)) throw Error('Invalid end time');
    if (typeof session.observation.completed !== 'boolean') throw Error('Record whether the planned content was completed');
    if (!session.observation.comprehension.trim()) throw Error('Record learner understanding');
    session.summary = summary(session);
    if (session.summary.activeMs <= 0) throw Error('No actual active learning measured');
    if (session.summary.activeMs > now - Date.parse(session.startedAt) + 1000) throw Error('Active time exceeds observation span');
    session.endedAt = new Date(now).toISOString();
    session.status = 'finished';
    session.acceptance = 'human_report_pending_evidence_review';
    return session;
  }
  function recover(session, now) {
    if (session.status === 'finished') return session;
    // A reload never fills the unobserved gap with assumed learning time.
    session.status = 'paused';
    session.events.push({ type: 'recovered_paused', at: new Date(now).toISOString(), unobservedGapCounted: false });
    return session;
  }
  return { phases, sectors, checks, create, segment, setCheck, summary, finish, recover };
});
