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

const args = process.argv.slice(2);
const allowUnrelatedAdvance = args[0] === '--allow-unrelated-advance';
if (allowUnrelatedAdvance) args.shift();
if (args.length && (args[0] !== '--paths' || args.length < 2)) fail('usage: check-work-persistence.mjs [--allow-unrelated-advance] [--paths FILE ...]');
const paths = [...new Set(args.slice(1))];
if (allowUnrelatedAdvance && !paths.length) fail('--allow-unrelated-advance requires explicit completed-unit paths');
for (const file of paths) {
  if (!file || path.isAbsolute(file) || file.startsWith('-') || file.split('/').includes('..') || path.posix.normalize(file) !== file) fail('unsafe completed-unit path');
}

try {
  git(['fetch', '--filter=blob:none', '--no-tags', remote, remoteBranch]);
} catch {
  fail(`cannot fetch ${remote}/${remoteBranch}`);
}

const trackingHead = git(['rev-parse', upstream]);
if (!allowUnrelatedAdvance && localHead !== trackingHead) {
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
if (!allowUnrelatedAdvance && advertisedHead !== localHead) {
  fail(`remote advertises ${advertisedHead}, expected local HEAD ${localHead}`);
}

// Opt-in coordination mode accepts only a descendant whose completed paths are
// byte-for-byte identical (including modes). It never relaxes local cleanliness.
if (allowUnrelatedAdvance && advertisedHead !== localHead) {
  try {
    if (advertisedHead !== trackingHead) {
      git(['fetch', '--filter=blob:none', '--no-tags', remote, advertisedHead]);
      if (git(['rev-parse', 'FETCH_HEAD']) !== advertisedHead) fail('fetched remote checkpoint identity differs');
    }
    git(['merge-base', '--is-ancestor', localHead, advertisedHead]);
  } catch {
    fail(`saved HEAD is not an ancestor of advertised remote checkpoint ${advertisedHead}`);
  }
  const changed = git(['--literal-pathspecs', 'diff-tree', '--no-commit-id', '--name-only', '-r', localHead, advertisedHead, '--', ...paths]);
  if (changed) fail(`remote changed completed-unit paths: ${changed.split('\n').join(', ')}`);
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
  const checkpoint = advertisedHead === localHead ? '' : `; descendant ${advertisedHead} preserves completed paths`;
  console.log(`WORK PERSISTENCE PASS: ${root}; ${branch}; ${localHead} exists on ${remote}/${remoteBranch}${checkpoint}; ${paths.length} completed files clean; unrelated unfinished work ${otherWork ? 'preserved' : 'absent'}`);
} else {
  console.log(`WORK PERSISTENCE PASS: ${root}; ${branch}; ${localHead} exists on ${remote}/${remoteBranch}; working tree clean`);
}
