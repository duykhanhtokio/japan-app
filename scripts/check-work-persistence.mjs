import { execFileSync } from 'node:child_process';
import path from 'node:path';

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function fail(message) {
  console.error(`WORK PERSISTENCE FAILED: ${message}`);
  process.exit(1);
}

let root;
try {
  root = git(['rev-parse', '--show-toplevel']);
} catch {
  fail('current directory is not inside a Git repository');
}

const branch = git(['branch', '--show-current']);
if (!branch) fail('detached HEAD is not allowed for a durable checkpoint');

let upstream;
try {
  upstream = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}']);
} catch {
  fail(`branch ${branch} has no configured upstream`);
}

const separator = upstream.indexOf('/');
if (separator < 1) fail(`cannot parse upstream ${upstream}`);
const remote = upstream.slice(0, separator);
const remoteBranch = upstream.slice(separator + 1);
const localHead = git(['rev-parse', 'HEAD']);

try {
  git(['fetch', remote, remoteBranch]);
} catch {
  fail(`cannot fetch ${remote}/${remoteBranch}`);
}

const trackingHead = git(['rev-parse', upstream]);
if (localHead !== trackingHead) {
  fail(`local HEAD ${localHead} does not equal ${upstream} ${trackingHead}`);
}

let advertisedHead;
try {
  const output = git(['ls-remote', '--heads', remote, `refs/heads/${remoteBranch}`]);
  advertisedHead = output.split(/\s+/)[0];
} catch {
  fail(`cannot query remote branch ${remote}/${remoteBranch}`);
}
if (!advertisedHead) fail(`remote branch ${remote}/${remoteBranch} was not found`);
if (advertisedHead !== localHead) {
  fail(`remote advertises ${advertisedHead}, expected local HEAD ${localHead}`);
}

// Parallel workers may retain unrelated unfinished files. A scoped gate still
// requires the exact HEAD advertised remotely and every completed file in HEAD.
const args = process.argv.slice(2);
if (args.length && (args[0] !== '--paths' || args.length < 2)) fail('usage: check-work-persistence.mjs [--paths FILE ...]');
const paths = [...new Set(args.slice(1))];
for (const file of paths) {
  if (!file || path.isAbsolute(file) || file.startsWith('-') || file.split('/').includes('..') || path.posix.normalize(file) !== file) fail('unsafe completed-unit path');
}
if (paths.length) {
  const tracked = new Set(git(['--literal-pathspecs', 'ls-tree', '-r', '--name-only', 'HEAD', '--', ...paths]).split('\n'));
  for (const file of paths) if (!tracked.has(file)) fail(`completed file is absent from HEAD: ${file}`);
}
const status = git(['--literal-pathspecs', 'status', '--porcelain', ...(paths.length ? ['--', ...paths] : [])]);
if (status) {
  fail(paths.length ? 'completed-unit paths have uncommitted changes' : 'working tree is not clean; commit and push the completed unit before continuing');
}
if (paths.length) {
  const otherWork = git(['status', '--porcelain']);
  console.log(`WORK PERSISTENCE PASS: ${root}; ${branch}; ${localHead} exists on ${remote}/${remoteBranch}; ${paths.length} completed files clean; unrelated unfinished work ${otherWork ? 'preserved' : 'absent'}`);
} else {
  console.log(`WORK PERSISTENCE PASS: ${root}; ${branch}; ${localHead} exists on ${remote}/${remoteBranch}; working tree clean`);
}
