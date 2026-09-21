#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const statuses = new Set(['LOCAL_CHANGES_READY', 'NO_CHANGE_CONTINUE', 'RATE_LIMITED', 'BLOCKED_GLOBAL', 'COMPLETE_ALL_AVAILABLE']);
const topKeys = ['blockers', 'changedFiles', 'commitMessage', 'contextHandoff', 'examComplete', 'examId', 'nextAction', 'sourceChecksum', 'status', 'toolVersion', 'unit', 'validations'];
const forbiddenInteraction = /NEED_USER_INPUT|(?:ask|hỏi|chờ).{0,30}(?:user|người dùng|stdin)|(?:choose|chọn)\s+(?:1|one)\s*[\/]\s*(?:2|two)\s*[\/]\s*(?:3|three)/iu;
function die(message) { console.error(`INVALID CHILD RESULT: ${message}`); process.exit(1); }
function load(file) {
  let value;
  try { value = JSON.parse(readFileSync(file, 'utf8')); } catch (error) { die(`JSON parse failed: ${error.message}`); }
  if (!value || Array.isArray(value) || typeof value !== 'object') die('top level must be an object');
  if (JSON.stringify(Object.keys(value).sort()) !== JSON.stringify(topKeys)) die(`keys must be exactly: ${topKeys.join(', ')}`);
  for (const key of ['status', 'examId', 'unit', 'commitMessage', 'nextAction', 'sourceChecksum', 'toolVersion', 'contextHandoff']) if (typeof value[key] !== 'string') die(`${key} must be a string`);
  if (typeof value.examComplete !== 'boolean' || !statuses.has(value.status)) die('invalid status or examComplete');
  if (forbiddenInteraction.test(`${value.nextAction}\n${value.contextHandoff}`)) die('fully unattended result attempted to ask the user or read stdin');
  if (value.contextHandoff.length > 8000) die('compact handoff exceeds 8000 characters');
  if (value.sourceChecksum && !/^[0-9a-f]{64}$/.test(value.sourceChecksum)) die('sourceChecksum must be empty or SHA-256');
  if (!Array.isArray(value.changedFiles) || !Array.isArray(value.validations) || !Array.isArray(value.blockers)) die('array fields invalid');
  const paths = new Set();
  for (const path of value.changedFiles) {
    if (typeof path !== 'string' || !path || path.startsWith('/') || path.split('/').includes('..') || /[\0\r\n]/.test(path) || paths.has(path)) die(`unsafe or duplicate changed path: ${path}`);
    if (/\.tmp(?:-|$)|\.partial$/.test(path)) die(`temporary output cannot be committed: ${path}`);
    paths.add(path);
  }
  for (const validation of value.validations) if (!validation || typeof validation !== 'object' || Array.isArray(validation) || JSON.stringify(Object.keys(validation).sort()) !== JSON.stringify(['evidence', 'name', 'status']) || !validation.name || !['PASS', 'FAIL'].includes(validation.status) || typeof validation.evidence !== 'string') die('invalid validation entry');
  for (const blocker of value.blockers) if (!blocker || typeof blocker !== 'object' || Array.isArray(blocker) || JSON.stringify(Object.keys(blocker).sort()) !== JSON.stringify(['code', 'details', 'evidence', 'scope']) || !['LOCAL', 'GLOBAL'].includes(blocker.scope) || !blocker.code || !blocker.details || !blocker.evidence) die('invalid blocker entry');
  if (value.status === 'LOCAL_CHANGES_READY') {
    if (!value.examId || !value.unit || !value.commitMessage || !value.changedFiles.length || !value.sourceChecksum || !value.toolVersion) die('LOCAL_CHANGES_READY missing batch metadata');
    if (!value.validations.length || value.validations.some((entry) => entry.status !== 'PASS')) die('LOCAL_CHANGES_READY requires passing validations');
    if (!paths.has('docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json')) die('validated batch must atomically update JLPT_ACTIVE_PROGRESS.json');
    if (!value.changedFiles.some((path) => /\/WORK_MANIFEST\.json$/.test(path))) die('validated batch must update WORK_MANIFEST.json');
    if (!value.changedFiles.some((path) => /\/CONVERSION_CHECKPOINT\.md$/.test(path))) die('validated batch must update CONVERSION_CHECKPOINT.md');
  } else if (value.changedFiles.length || value.commitMessage) die(`${value.status} must have no changed files or commit message`);
  if (value.status === 'BLOCKED_GLOBAL' && (!value.blockers.length || value.blockers.some((entry) => entry.scope !== 'GLOBAL'))) die('BLOCKED_GLOBAL requires evidenced GLOBAL blockers only');
  if (value.status === 'NO_CHANGE_CONTINUE' && !value.nextAction) die('NO_CHANGE_CONTINUE requires nextAction');
  return value;
}
function actualChanges(root) {
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'buffer' });
  const decode = (buffer) => buffer.toString('utf8').split('\0').filter(Boolean);
  return [...new Set([...decode(git('diff', '--name-only', '-z')), ...decode(git('diff', '--cached', '--name-only', '-z')), ...decode(git('ls-files', '--others', '--exclude-standard', '-z'))])].sort();
}
const [command, resultFile, argument] = process.argv.slice(2);
if (!command || !resultFile) die('usage: validate|field|paths|compare <result> [argument]');
const result = load(resultFile);
if (command === 'validate') console.log('CHILD RESULT JSON PASS');
else if (command === 'field') {
  if (!['status', 'examId', 'unit', 'commitMessage', 'nextAction', 'sourceChecksum', 'toolVersion', 'contextHandoff', 'examComplete'].includes(argument)) die(`unsupported field: ${argument}`);
  process.stdout.write(String(result[argument]));
} else if (command === 'paths') result.changedFiles.forEach((path) => console.log(path));
else if (command === 'compare') {
  const actual = actualChanges(argument);
  const declared = [...result.changedFiles].sort();
  if (JSON.stringify(actual) !== JSON.stringify(declared)) die(`changedFiles mismatch; declared=${JSON.stringify(declared)} actual=${JSON.stringify(actual)}`);
  console.log('CHANGED FILE MANIFEST PASS');
} else die(`unsupported command: ${command}`);
