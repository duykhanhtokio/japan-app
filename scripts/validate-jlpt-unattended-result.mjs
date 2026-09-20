#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const statuses = new Set(['LOCAL_CHANGES_READY', 'NO_CHANGE_CONTINUE', 'RATE_LIMITED', 'BLOCKED_GLOBAL', 'COMPLETE_ALL_AVAILABLE']);
const topKeys = ['blockers', 'changedFiles', 'commitMessage', 'examId', 'nextAction', 'status', 'unit', 'validations'];

function die(message) {
  console.error(`INVALID CHILD RESULT: ${message}`);
  process.exit(1);
}

function load(file) {
  let value;
  try { value = JSON.parse(readFileSync(file, 'utf8')); }
  catch (error) { die(`JSON parse failed: ${error.message}`); }
  if (!value || Array.isArray(value) || typeof value !== 'object') die('top level must be an object');
  if (JSON.stringify(Object.keys(value).sort()) !== JSON.stringify(topKeys)) die(`keys must be exactly: ${topKeys.join(', ')}`);
  for (const key of ['status', 'examId', 'unit', 'commitMessage', 'nextAction']) {
    if (typeof value[key] !== 'string') die(`${key} must be a string`);
  }
  if (!statuses.has(value.status)) die(`unknown status: ${value.status}`);
  if (!Array.isArray(value.changedFiles) || !Array.isArray(value.validations) || !Array.isArray(value.blockers)) {
    die('changedFiles, validations, and blockers must be arrays');
  }
  const pathSet = new Set();
  for (const filePath of value.changedFiles) {
    if (typeof filePath !== 'string' || !filePath || filePath.includes('\0') || /[\r\n]/.test(filePath)) die('changedFiles contains an invalid path');
    if (filePath.startsWith('/') || filePath.split('/').includes('..')) die(`unsafe changed path: ${filePath}`);
    if (pathSet.has(filePath)) die(`duplicate changed path: ${filePath}`);
    pathSet.add(filePath);
  }
  for (const validation of value.validations) {
    if (!validation || Array.isArray(validation) || typeof validation !== 'object') die('validation must be an object');
    if (JSON.stringify(Object.keys(validation).sort()) !== JSON.stringify(['evidence', 'name', 'status'])) die('validation keys must be exactly evidence, name, status');
    if (typeof validation.name !== 'string' || !validation.name || !['PASS', 'FAIL'].includes(validation.status) || typeof validation.evidence !== 'string') die('invalid validation entry');
  }
  for (const blocker of value.blockers) {
    if (!blocker || Array.isArray(blocker) || typeof blocker !== 'object') die('blocker must be an object');
    if (JSON.stringify(Object.keys(blocker).sort()) !== JSON.stringify(['code', 'details', 'evidence', 'scope'])) die('blocker keys must be exactly code, details, evidence, scope');
    if (!['LOCAL', 'GLOBAL'].includes(blocker.scope) || !blocker.code || !blocker.details || !blocker.evidence) die('invalid blocker entry');
  }
  if (value.status === 'LOCAL_CHANGES_READY') {
    if (!value.examId || !value.unit || !value.commitMessage || value.changedFiles.length === 0) die('LOCAL_CHANGES_READY requires examId, unit, commitMessage, and changedFiles');
    if (value.validations.length === 0 || value.validations.some((entry) => entry.status !== 'PASS')) die('LOCAL_CHANGES_READY requires at least one validation and all must PASS');
  } else if (value.changedFiles.length || value.commitMessage) {
    die(`${value.status} must have empty changedFiles and commitMessage`);
  }
  if (value.status === 'BLOCKED_GLOBAL' && (value.blockers.length === 0 || value.blockers.some((entry) => entry.scope !== 'GLOBAL'))) {
    die('BLOCKED_GLOBAL requires only GLOBAL blockers with evidence');
  }
  if (value.status === 'NO_CHANGE_CONTINUE' && !value.nextAction) die('NO_CHANGE_CONTINUE requires nextAction');
  return value;
}

function actualChanges(root) {
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'buffer' });
  const decode = (buffer) => buffer.toString('utf8').split('\0').filter(Boolean);
  return [...new Set([
    ...decode(git('diff', '--name-only', '-z')),
    ...decode(git('diff', '--cached', '--name-only', '-z')),
    ...decode(git('ls-files', '--others', '--exclude-standard', '-z')),
  ])].sort();
}

const [command, resultFile, argument] = process.argv.slice(2);
if (!command || !resultFile) die('usage: validate|field|paths|compare <result> [argument]');
const result = load(resultFile);
if (command === 'validate') console.log('CHILD RESULT JSON PASS');
else if (command === 'field') {
  if (!['status', 'examId', 'unit', 'commitMessage', 'nextAction'].includes(argument)) die(`unsupported field: ${argument}`);
  process.stdout.write(result[argument]);
} else if (command === 'paths') {
  for (const filePath of result.changedFiles) console.log(filePath);
} else if (command === 'compare') {
  if (!argument) die('compare requires repository root');
  const actual = actualChanges(argument);
  const declared = [...result.changedFiles].sort();
  if (JSON.stringify(actual) !== JSON.stringify(declared)) die(`changedFiles mismatch; declared=${JSON.stringify(declared)} actual=${JSON.stringify(actual)}`);
  console.log('CHANGED FILE MANIFEST PASS');
} else die(`unsupported command: ${command}`);
