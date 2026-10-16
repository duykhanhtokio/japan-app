// This checks evidence structure and revision bindings, not clinical or native-language approval.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const reviewDir = 'docs/ssw-workspace/kaigo/reviews/';
const sourceSha = '997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54';
const baseline = 'ed3935df49c205432244ab6e72dccd377e2c5082';
const groups = [
  ['01_FOUNDATION_COMMUNICATION', ['foundation-source-atoms-2026-10-09.json', 'communication-source-atoms-2026-10-09.json']],
  ['02_BODY_AGING', ['body-source-atoms-2026-10-09.json', 'body-gap-source-atoms-2026-10-09.json', 'aging-source-atoms-2026-10-09.json']],
  ['03_MOVEMENT_CARE_JAPANESE', ['movement-source-atoms-2026-10-09.json', 'care-japanese-source-atoms-2026-10-10.json']],
  ['04_EATING_EXCRETION', ['eating-source-atoms-2026-10-10.json', 'excretion-source-atoms-2026-10-10.json']],
  ['05_GROOMING_BATH_HOUSEWORK', ['grooming-source-atoms-2026-10-10.json', 'bathing-source-atoms-2026-10-10.json', 'housework-source-atoms-2026-10-10.json']],
  ['06_LANGUAGE', []],
];
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const masterPath = week => `src/data/kaigo/japanese-master/week-${String(week).padStart(2, '0')}.json`;
// A later reviewed batch may revise the same paragraph. Validate its current chain first,
// then retain this audit as an exact, explicitly labelled historical snapshot.
const successorPath = reviewDir + 'JAPANESE_SOURCE_PAGE_RESOLUTION.json';
const successor = fs.existsSync(path.join(root, successorPath)) ? read(successorPath) : null;
let successorResult = null;
if (successor) {
  assert.equal(successor.baselineCommit, '8004eaa24f40df5448c348f781a942523e3c6639');
  successorResult = JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'check-kaigo-japanese-source-pages.cjs')], { cwd: root, encoding: 'utf8', maxBuffer: 2e6 }).trim());
}
const masters = {}, originals = {};
for (let week = 1; week <= 26; week++) {
  masters[week] = successor
    ? JSON.parse(execFileSync('git', ['show', `${successor.baselineCommit}:${masterPath(week)}`], { cwd: root, maxBuffer: 8e6 }))
    : read(masterPath(week));
  originals[week] = JSON.parse(execFileSync('git', ['show', `${baseline}:${masterPath(week)}`], { cwd: root, maxBuffer: 8e6 }));
}
const inventories = Object.fromEntries(groups.flatMap(([, names]) => names.map(name => [name, read(reviewDir + name).atoms])));
const reports = groups.map(([id]) => read(reviewDir + `JAPANESE_RECONCILIATION_${id}.json`));
const resolution = read(reviewDir + 'JAPANESE_RECONCILIATION_RESOLUTION.json');
const rowsOf = report => report.atoms ?? report.records ?? report.rows;
const targetsOf = row => row.japaneseTargets ?? row.targets;
const targetKey = target => `${target.week}:${target.sectionId}:${target.paragraphIndex}`;
function approvals(value) {
  for (const flag of ['humanReviewed', 'domainReviewed', 'nativeReviewed']) assert.equal(value[flag], false, flag);
  for (const flag of ['rightsReviewed', 'rightsApproved', 'nativeDeviceTested', 'releaseReady']) {
    if (flag in value) assert.equal(value[flag], false, flag);
  }
}
function paragraph(target, corpus) {
  assert(Number.isInteger(target.week) && target.week >= 1 && target.week <= 26, 'Invalid week');
  const paragraphs = corpus[target.week]?.sections[target.sectionId]?.paragraphsJa;
  assert(Array.isArray(paragraphs), 'Unknown Japanese section ' + target.sectionId);
  assert(Number.isInteger(target.paragraphIndex) && target.paragraphIndex >= 0 && target.paragraphIndex < paragraphs.length, 'Invalid paragraph pointer');
  return paragraphs[target.paragraphIndex];
}
function validate(inputReports = reports, current = masters, applied = resolution) {
  approvals(applied);
  assert.equal(applied.baselineCommit, baseline);
  assert.equal(applied.sourceKnowledgeCoveragePercent, null);
  const patchByTarget = new Map();
  for (const patch of applied.patches) {
    approvals(patch);
    const key = targetKey(patch);
    assert(!patchByTarget.has(key), 'Multiple unresolved patches for one paragraph');
    assert.equal(hash(paragraph(patch, current)), patch.afterParagraphSha256, 'Applied text changed');
    if (patch.operation === 'append_paragraph') {
      assert.equal(patch.beforeParagraphSha256, null);
      assert(patch.paragraphIndex >= originals[patch.week].sections[patch.sectionId].paragraphsJa.length);
    } else assert.equal(hash(paragraph(patch, originals)), patch.beforeParagraphSha256, 'Incorrect baseline text');
    assert.equal(patch.questionCoreChanged, false);
    const reportIndex = groups.findIndex(([id]) => patch.proposalReport === reviewDir + `JAPANESE_RECONCILIATION_${id}.json`);
    assert(reportIndex >= 0, 'Unknown proposal report');
    const report = inputReports[reportIndex];
    const proposals = report.proposedCorrections ?? report.proposedPatches ?? report.patchProposals ?? report.substantivePatchProposals;
    const proposal = proposals.find(item => (item.patchId ?? item.id ?? item.proposalId) === patch.patchId);
    assert(proposal, 'Unknown patch proposal');
    assert.equal(hash(proposal.afterJa), patch.afterParagraphSha256, 'Applied text differs from reviewed proposal');
    const target = { ...proposal, ...proposal.target };
    target.week ??= Number((target.masterPath ?? target.file).match(/week-(\d+)/)[1]);
    assert.equal(targetKey(target), key, 'Proposal applied at the wrong target');
    patchByTarget.set(key, patch);
  }
  // Every runtime paragraph edit must have an explicit reviewed resolution record.
  for (let week = 1; week <= 26; week++) {
    assert.deepEqual(Object.keys(current[week].sections), Object.keys(originals[week].sections));
    for (const [sectionId, section] of Object.entries(current[week].sections)) {
      const old = originals[week].sections[sectionId].paragraphsJa;
      assert(section.paragraphsJa.length >= old.length, 'Deleted Japanese paragraphs');
      section.paragraphsJa.forEach((text, paragraphIndex) => {
        if (text !== old[paragraphIndex]) assert(patchByTarget.has(targetKey({ week, sectionId, paragraphIndex })), 'Unrecorded Japanese edit');
      });
    }
  }
  let rowCount = 0, teachingCount = 0, targetCount = 0;
  const counts = {}, effectiveCounts = {}, reportCounts = [];
  let restoredInventoryRows = 0;
  inputReports.forEach((report, reportIndex) => {
    approvals(report);
    assert(JSON.stringify(report.source).includes(sourceSha), 'Wrong source edition/hash');
    const rows = rowsOf(report), actualCounts = {}, seen = new Set();
    const expectedAtoms = new Map(groups[reportIndex][1].flatMap(name => inventories[name].map(atom => [`${name}#${atom.id}`, atom])));
    const expectedLanguage = new Set();
    if (reportIndex === 5) {
      for (const file of ['language20-source-review-2026-10-10.json', 'language229-source-review-2026-10-10.json', 'language249-source-review-2026-10-10.json']) {
        const cards = read(reviewDir + file).cards;
        cards.forEach((card, index) => expectedLanguage.add(`${reviewDir}${file}#/cards/${index}`));
      }
      const vocabularyPath = 'docs/ssw-workspace/kaigo/drafts/source-vocabulary-inventory-2026-10-08.json';
      read(vocabularyPath).entries.forEach((entry, index) => {
        // The 245/246 inventory stores its source range as "245-246"; the stable ID retains the individual page.
        if ([213, 214, 219, 224, 230, 238, 245, 246].includes(Number(entry.id.split('-')[2]))) expectedLanguage.add(`${vocabularyPath}#/entries/${index}`);
      });
      assert.equal(expectedLanguage.size, report.finiteInventory.readingGoalRecords + report.finiteInventory.lexicalRecords);
    }
    for (const row of rows) {
      approvals(row);
      assert(['covered', 'partial', 'missing', 'pending', 'corrected_source_error'].includes(row.status), 'Unknown status');
      assert((row.knowledgePointJa ?? row.independentKnowledgePointJa)?.trim(), 'Missing independent knowledge point');
      actualCounts[row.status] = (actualCounts[row.status] ?? 0) + 1;
      counts[row.status] = (counts[row.status] ?? 0) + 1;
      let effectiveStatus = row.status;
      if (['partial', 'missing'].includes(row.status)) {
        const id = row.atomId ?? row.stableGoalId;
        assert(applied.patches.some(patch => patch.sourceAtomIds.includes(id) || patch.languageGoalIds.includes(id)), 'Unresolved content gap ' + id);
        effectiveStatus = 'covered';
        restoredInventoryRows++;
      }
      const evidence = report.pendingEvidenceResolution?.resolutions?.find(item => item.atomId === row.atomId);
      if (evidence) {
        assert.equal(evidence.baselineStatus, row.status);
        approvals(evidence);
        assert.equal(evidence.currentTextChangeNeeded, false);
        assert(['covered', 'corrected_source_error'].includes(evidence.resolvedEvidenceStatus));
        effectiveStatus = evidence.resolvedEvidenceStatus;
      }
      effectiveCounts[effectiveStatus] = (effectiveCounts[effectiveStatus] ?? 0) + 1;
      rowCount++;
      let structural = false;
      if (reportIndex < 5) {
        const inventory = path.basename(row.sourceInventoryFile ?? row.sourceInventory ?? '');
        const key = inventory + '#' + row.atomId, atom = expectedAtoms.get(key);
        assert(atom, 'Unknown inventory atom ' + key);
        assert(!seen.has(key), 'Duplicate inventory atom'); seen.add(key);
        const reference = row.sourceReference ?? row;
        assert.equal(reference.printedPage, atom.printedPage, 'Printed source page mismatch');
        assert.equal(reference.pdfPage, atom.pdfPage, 'PDF source page mismatch');
      } else {
        const key = row.stableGoalId;
        assert(!seen.has(key), 'Duplicate language goal'); seen.add(key);
        structural = row.auditLayer === 'source_page_role_not_learning_content';
        if (structural) assert([244, 270, 271, 272, 273, 274].some(page => key === `language-source-role-${page}`));
        else {
          assert(expectedLanguage.delete(row.inventoryPath), 'Unknown or duplicate language inventory reference');
          const [file, pointer] = row.inventoryPath.split('#');
          const [, collection, index] = pointer.split('/');
          const entry = read(file)[collection][Number(index)];
          assert(entry, 'Invalid language inventory pointer');
          if (collection === 'cards') assert.equal(key, `language-goal-${entry.printedPage}`);
          else assert.equal(key, entry.id);
        }
      }
      const targets = targetsOf(row);
      assert(Array.isArray(targets) && (structural ? targets.length === 0 : targets.length > 0), 'Missing semantic target');
      if (!structural) teachingCount++;
      for (const target of targets) {
        const oldText = paragraph(target, originals), text = paragraph(target, current);
        if (target.paragraphSha256) assert.equal(hash(oldText), target.paragraphSha256, 'Stale audit baseline pointer');
        if (text !== oldText) assert(patchByTarget.has(targetKey(target)), 'Changed semantic target lacks resolution');
        targetCount++;
      }
    }
    if (reportIndex < 5) assert.equal(seen.size, expectedAtoms.size, 'Missing inventory atoms');
    else {
      assert.equal(expectedLanguage.size, 0, 'Missing language inventory records');
      assert.equal(rows.length, report.finiteInventory.rows);
    }
    const declared = report.countsByStatus ?? report.counts?.statusCounts ?? report.counts?.byStatus ?? report.counts;
    for (const status of ['covered', 'partial', 'missing', 'pending', 'corrected_source_error']) assert.equal(declared[status] ?? 0, actualCounts[status] ?? 0, 'Misstated status count');
    reportCounts.push({ report: groups[reportIndex][0], rows: rows.length, byStatus: actualCounts });
  });
  return { status: 'PASS_KNOWN_INVENTORY_AND_APPLIED_REVISIONS', auditRows: rowCount, teachingInventoryRows: teachingCount, nonTeachingPageRows: rowCount - teachingCount, paragraphPointers: targetCount, appliedParagraphChanges: applied.patches.length, restoredInventoryRows, effectiveCountsIncludingStructuralPages: effectiveCounts, reportCounts, sourceKnowledgeCoveragePercent: null, humanReviewed: false, domainReviewed: false, nativeReviewed: false };
}
const result = validate();
result.comparisonCommit = successor?.baselineCommit ?? 'working_tree';
result.historicalSnapshotValidation = Boolean(successor);
result.currentSuccessorValidation = successorResult;
// Negative controls: a plausible-looking report must fail for real evidence defects.
for (const [label, mutate] of [
  ['unknown_atom', data => { data[0].atoms[0].atomId = 'not-a-real-atom'; }],
  ['out_of_bounds_pointer', data => { data[0].atoms[0].japaneseTargets[0].paragraphIndex = 99999; }],
  ['unearned_approval', data => { data[0].atoms[0].domainReviewed = true; }],
  ['misstated_count', data => { data[0].counts.statusCounts.covered++; }],
]) {
  const altered = structuredClone(reports); mutate(altered);
  assert.throws(() => validate(altered), undefined, 'Negative control failed: ' + label);
}
result.negativeControls = ['unknown_atom', 'out_of_bounds_pointer', 'unearned_approval', 'misstated_count'];
if (process.env.KAIGO_RECONCILIATION_REPORT) fs.writeFileSync(path.resolve(root, process.env.KAIGO_RECONCILIATION_REPORT), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
