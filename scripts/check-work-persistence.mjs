import { execFileSync } from 'node:child_process';

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

const status = git(['status', '--porcelain']);
if (status) {
  fail('working tree is not clean; commit and push the completed unit before continuing');
}

console.log(`WORK PERSISTENCE PASS: ${root}; ${branch}; ${localHead} exists on ${remote}/${remoteBranch}; working tree clean`);
