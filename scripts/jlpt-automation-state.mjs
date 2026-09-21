#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const digestPath = resolve(root, 'docs/jlpt-workspace/JLPT_RULE_DIGEST.json');
const digestInputs = [
  'AGENTS.md',
  'docs/AI_SESSION_START_HERE.md',
  'docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md',
  'docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED_V5.md',
  'docs/jlpt-workspace/JLPT_AUTOMATION_DECISIONS.json',
  'docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md',
  'scripts/run-jlpt-unattended.sh',
  'scripts/jlpt-codex-worker-wrapper.sh',
  'scripts/jlpt-unattended-supervisor.mjs',
  'scripts/jlpt-unattended-worker-io.mjs',
  'scripts/test-jlpt-unattended-production.sh',
  'scripts/test-run-jlpt-unattended.sh',
  'scripts/test-jlpt-unattended-fixtures.mjs',
  'scripts/test-support/fake-jlpt-codex.sh',
  'scripts/verify-jlpt-unattended-live-smoke.mjs',
  'scripts/persist-jlpt-unattended-maintenance.sh',
  'scripts/jlpt-automation-state.mjs',
  'scripts/jlpt-unattended-result.schema.json',
  'scripts/jlpt-automation-decisions.schema.json',
  'scripts/jlpt-active-progress.schema.json',
  'scripts/jlpt-work-manifest.schema.json',
  'scripts/validate-jlpt-unattended-result.mjs',
  'scripts/validate-jlpt-automation-state.mjs',
  'scripts/check-jlpt-approved-ui-lock.mjs',
  'scripts/check-work-persistence.mjs'
];

const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
const atomicJson = (path, value) => {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.tmp-${process.pid}`;
  writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temp, path);
};
const atomicText = (path, value) => {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.tmp-${process.pid}`;
  writeFileSync(temp, value);
  renameSync(temp, path);
};
const computeDigest = () => {
  const files = Object.fromEntries(digestInputs.map((path) => [path, hash(readFileSync(resolve(root, path)))]));
  return { schemaVersion: 1, algorithm: 'sha256', files, combined: hash(Buffer.from(JSON.stringify(files))) };
};
const runtimeDir = () => {
  const temp = process.env.TMPDIR || '/tmp';
  return resolve(temp, 'japan-app-jlpt-runtime', hash(Buffer.from(root)).slice(0, 16));
};
const repoPath = (path) => relative(root, path).split('\\').join('/');
const sourcePaths = (text, declaration, constant) => {
  const block = new RegExp(`export const ${constant}[^=]*=\\s*\\[([\\s\\S]*?)\\]`).exec(text)?.[1] || '';
  return [...block.matchAll(/require\(['"]([^'"]+)['"]\)/g)].map((match) => repoPath(resolve(dirname(declaration), match[1])));
};
const buildNextManifest = (sourceId, head) => {
  const declaration = resolve(root, `src/data/jlpt-mock/${sourceId}-official.ts`);
  const text = readFileSync(declaration, 'utf8');
  const level = sourceId.slice(0, 2).toUpperCase();
  const examId = /export const [A-Z0-9_]+_EXAM_ID = ['"]([^'"]+)['"]/.exec(text)?.[1] || `${sourceId}-exam-pending`;
  const written = sourcePaths(text, declaration, `${sourceId.replaceAll('-', '_').toUpperCase()}_WRITTEN_PAGES`);
  const listening = sourcePaths(text, declaration, `${sourceId.replaceAll('-', '_').toUpperCase()}_LISTENING_PAGES`);
  const scripts = sourcePaths(text, declaration, `${sourceId.replaceAll('-', '_').toUpperCase()}_SCRIPT_PAGES`);
  const answer = [...text.matchAll(/require\(['"]([^'"]*answer-script\/page-01\.jpg)['"]\)/g)].map((match) => repoPath(resolve(dirname(declaration), match[1])))[0];
  const audio = [...text.matchAll(/require\(['"]([^'"]*\/audio\/[^'"]+)['"]\)/g)].map((match) => repoPath(resolve(dirname(declaration), match[1])))[0];
  const checksumPaths = [...new Set([...written, ...listening, ...scripts, answer, audio, repoPath(declaration)].filter((path) => path && existsSync(resolve(root, path))))];
  const sourceChecksums = Object.fromEntries(checksumPaths.map((path) => [path, hash(readFileSync(resolve(root, path)))]));
  const catalogText = readFileSync(resolve(root, 'src/data/jlpt-official/jlpt-exam-catalog.ts'), 'utf8');
  const levelSources = [...catalogText.matchAll(new RegExp(`'(${level.toLowerCase()}-[0-9]{4}-[0-9]{2})'`, 'g'))].map((match) => match[1]);
  const chronologicalOrder = Math.max(1, levelSources.indexOf(sourceId) + 1);
  const conversionDir = `docs/jlpt-workspace/conversion/${sourceId}`;
  const manifestPath = `${conversionDir}/WORK_MANIFEST.json`;
  const checkpointPath = `${conversionDir}/CONVERSION_CHECKPOINT.md`;
  const checkpointExists = existsSync(resolve(root, checkpointPath));
  const checkpointText = checkpointExists ? readFileSync(resolve(root, checkpointPath), 'utf8') : '';
  const existingFiles = existsSync(resolve(root, conversionDir)) ? readdirSync(resolve(root, conversionDir), { recursive: true }).map(String) : [];
  const existingUnits = existingFiles.filter((path) => /\.(?:json|ts)$/.test(path) && path !== 'WORK_MANIFEST.json').map((path) => `existing:${path}`);
  const checkpointNext = [...checkpointText.matchAll(/^(?:- )?Next(?: action)?:\s*(.+)$/gmi)].at(-1)?.[1]?.trim();
  const writtenComplete = /(?:70\/70 written|70 written questions|written[^\n]*complete)/i.test(checkpointText);
  const audioChecksum = audio && sourceChecksums[audio] ? sourceChecksums[audio] : '0'.repeat(64);
  const manifest = {
    schemaVersion: 1, examId, level, chronologicalOrder,
    questionSourcePages: [...written, ...listening],
    writtenRanges: written.map((path) => ({ pages: [basename(path)], questions: 'inventory_pending', status: existingFiles.some((file) => file.includes(`written-${basename(path, '.jpg')}`)) || writtenComplete ? 'remote_verified' : 'pending' })),
    answerKeyPaths: [answer, repoPath(declaration)].filter(Boolean),
    answerKeyChecksums: Object.fromEntries([answer, repoPath(declaration)].filter(Boolean).map((path) => [path, sourceChecksums[path]])),
    listeningSource: { questionPages: listening, audioPath: audio || '', status: audio ? 'pending' : 'blocked', requiredCandidateStatus: 'candidate_unverified', humanReviewed: false, perceptualApproval: false, needsLaterReview: true },
    audioChecksum, scriptTranscriptPaths: scripts, explanationSources: scripts,
    translationState: { status: 'pending', generatedBy: 'AI', reviewedByNativeSpeaker: false, requiredStatus: 'translated_ai_unreviewed' },
    integrationState: { adapter: 'pending', runtime: 'pending', registry: 'pending', catalog: 'pending', validation: 'pending' },
    completedUnits: existingUnits, remoteVerifiedUnits: [], localOnlyCommittedUnits: [],
    blockedUnits: audio ? [] : [{ scope: 'LOCAL', code: 'BLOCKED_SOURCE_MISSING', sourcePath: `assets/jlpt/${level.toLowerCase()}/${sourceId.slice(3)}/audio`, details: 'No source audio was declared.' }],
    pendingUnits: ['written:remaining-available', 'listening:remaining-candidate', 'explanations:remaining-available', 'translations:remaining-locales', 'integration:full-exam', 'validation:per-exam'],
    nextUnit: checkpointNext || 'source-inventory and first written source-page batch',
    validationCommands: ['node scripts/validate-jlpt-automation-state.mjs', 'node scripts/check-jlpt-approved-ui-lock.mjs', 'git diff --check'],
    allowedOutputPaths: [`${conversionDir}/**`, 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json', `src/data/jlpt-official/${sourceId}/**`, `src/data/jlpt-official/${sourceId}-trial.ts`, 'src/data/jlpt-official/approved-n1-exams.ts', 'src/data/jlpt-official/jlpt-exam-catalog.ts', `scripts/check-${sourceId}-*.mjs`, `scripts/build-${sourceId}-structured.mjs`],
    sourceChecksums
  };
  if (!checkpointExists) atomicText(resolve(root, checkpointPath), `# ${level} ${sourceId.slice(3)} conversion checkpoint\n\n- Exam ID: \`${examId}\`.\n- Status: \`SOURCE_INVENTORY_PENDING\`.\n- Next: source inventory and first written source-page batch from \`${written[0] || 'BLOCKED_SOURCE_MISSING'}\`.\n- Previous exam transition HEAD: \`${head}\`.\n`);
  atomicJson(resolve(root, manifestPath), manifest);
  const progress = {
    schemaVersion: 1, activeLevel: level, activeExamId: examId, phase: writtenComplete ? 'listening' : 'written', completedWrittenThrough: writtenComplete ? 70 : 0,
    completedUnits: existingUnits, blockedUnits: manifest.blockedUnits,
    nextAction: checkpointNext || `Build source inventory, then recover the first available written batch for ${sourceId}.`,
    checkpointPath, manifestPath, lastValidatedLocalCommit: head, lastDurableUnitSHA: head, lastRemoteHeadSHA: head, pushPending: false, updatedAt: new Date().toISOString()
  };
  atomicJson(resolve(root, 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json'), progress);
  return { sourceId, examId, checkpointPath, manifestPath };
};

const [command, ...args] = process.argv.slice(2);
if (command === 'digest-write') {
  atomicJson(digestPath, computeDigest());
  console.log(`RULE DIGEST WRITTEN: ${digestPath}`);
} else if (command === 'digest-check') {
  const current = computeDigest();
  const saved = existsSync(digestPath) ? JSON.parse(readFileSync(digestPath, 'utf8')) : null;
  if (!saved || saved.combined !== current.combined) process.exit(1);
  console.log(`RULE DIGEST MATCH: ${current.combined}`);
} else if (command === 'runtime-dir') {
  process.stdout.write(runtimeDir());
} else if (command === 'runtime-init') {
  const dir = runtimeDir();
  mkdirSync(resolve(dir, 'cache'), { recursive: true });
  const state = resolve(dir, 'state.json');
  if (!existsSync(state)) atomicJson(state, { schemaVersion: 1, status: 'idle', workerSessionId: null, pushPending: false, updatedAt: new Date().toISOString() });
  if (!existsSync(resolve(dir, 'progress.jsonl'))) writeFileSync(resolve(dir, 'progress.jsonl'), '');
  console.log(dir);
} else if (command === 'cache-key') {
  const [toolVersion, ...paths] = args;
  if (!toolVersion || paths.length === 0) process.exit(64);
  const parts = [toolVersion, ...paths.map((path) => `${path}:${hash(readFileSync(resolve(root, path)))}`)];
  process.stdout.write(hash(Buffer.from(parts.join('\n'))));
} else if (command === 'cache-put') {
  const [key, source] = args;
  if (!/^[0-9a-f]{64}$/.test(key) || !source) process.exit(64);
  const target = resolve(runtimeDir(), 'cache', `${key}-${basename(source)}.json`);
  atomicJson(target, JSON.parse(readFileSync(resolve(root, source), 'utf8')));
  console.log(target);
} else if (command === 'cache-has') {
  const [key] = args;
  const dir = resolve(runtimeDir(), 'cache');
  const found = existsSync(dir) && (await import('node:fs')).readdirSync(dir).some((name) => name.startsWith(`${key}-`));
  console.log(found ? 'CACHE HIT' : 'CACHE MISS');
  process.exit(found ? 0 : 1);
} else if (command === 'advance-exam') {
  const [head] = args;
  if (!/^[0-9a-f]{40}$/.test(head || '')) process.exit(64);
  const progress = JSON.parse(readFileSync(resolve(root, 'docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json'), 'utf8'));
  const catalog = readFileSync(resolve(root, 'src/data/jlpt-official/jlpt-exam-catalog.ts'), 'utf8');
  const block = /const scannedSourceIds = \[([\s\S]*?)\] as const;/.exec(catalog)?.[1] || '';
  const pending = [...block.matchAll(/'(n[123]-[0-9]{4}-[0-9]{2})'/g)].map((match) => match[1]);
  const currentSource = progress.activeExamId.match(/^(n[123]-[0-9]{4}-[0-9]{2})/)?.[1];
  const next = pending.find((sourceId) => sourceId !== currentSource);
  if (!next) { console.log(JSON.stringify({ completeAll: true })); process.exit(0); }
  console.log(JSON.stringify({ completeAll: false, ...buildNextManifest(next, head) }));
} else {
  console.error('usage: jlpt-automation-state.mjs digest-write|digest-check|runtime-dir|runtime-init|cache-key|cache-put|cache-has|advance-exam');
  process.exit(64);
}
