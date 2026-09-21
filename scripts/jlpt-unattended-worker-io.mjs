import { closeSync, existsSync, readFileSync, renameSync, statSync } from 'node:fs';

const compact = (value) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, 1600);

export function parseWorkerEventStream(eventPath) {
  const events = [];
  const malformedLines = [];
  if (!existsSync(eventPath)) return { events, malformedLines, threadId: null, completed: false, errors: [], finalAssistantMessage: '' };
  for (const [index, line] of readFileSync(eventPath, 'utf8').split('\n').entries()) {
    if (!line.trim()) continue;
    try { events.push(JSON.parse(line)); }
    catch { malformedLines.push({ line: index + 1, text: compact(line) }); }
  }
  const errors = [];
  let threadId = null;
  let completed = false;
  let finalAssistantMessage = '';
  for (const event of events) {
    if (event.type === 'thread.started' && event.thread_id) threadId = event.thread_id;
    if (event.type === 'turn.completed') completed = true;
    if (event.type === 'error' && event.message) errors.push(compact(event.message));
    if (event.type === 'turn.failed' && event.error?.message) errors.push(compact(event.error.message));
    if (event.type === 'item.completed' && event.item?.type === 'agent_message' && typeof event.item.text === 'string') finalAssistantMessage = event.item.text;
  }
  return { events, malformedLines, threadId, completed, errors: [...new Set(errors)], finalAssistantMessage };
}

export function classifyWorkerFailure({ code, signal, eventPath, stderrPath, resultPartialPath }) {
  const parsed = parseWorkerEventStream(eventPath);
  const stderr = existsSync(stderrPath) ? readFileSync(stderrPath, 'utf8') : '';
  const evidence = compact([...parsed.errors, stderr, ...parsed.malformedLines.map((entry) => entry.text)].filter(Boolean).join(' | '));
  const normalized = evidence.toLowerCase();
  let category = 'WORKER';
  if (/rate.?limit|too many requests|quota|resource exhausted|usage limit/.test(normalized)) category = 'RATE_LIMIT';
  else if (/capacity|temporarily unavailable|overloaded|service unavailable/.test(normalized)) category = 'CAPACITY';
  else if (/invalid_json_schema|output schema|response_format|schema/.test(normalized)) category = 'SCHEMA';
  else if (/unknown (?:argument|option)|unexpected argument|failed to initialize|local database|not found|enoent/.test(normalized)) category = 'CLI';
  else if (/network|connection|dns|timed out|timeout/.test(normalized)) category = 'NETWORK';
  const resultState = !existsSync(resultPartialPath)
    ? 'missing'
    : statSync(resultPartialPath).size === 0 ? 'empty' : 'present';
  return {
    category,
    detail: evidence || 'Codex exited without a structured error event',
    code,
    signal,
    resultState,
    parsed
  };
}

export function assertNonEmptyFile(path, label) {
  if (!existsSync(path)) throw new Error(`${label} missing: ${path}`);
  if (statSync(path).size === 0) throw new Error(`${label} empty: ${path}`);
}

export function promoteResultAtomically(resultPartialPath, resultPath) {
  assertNonEmptyFile(resultPartialPath, 'worker final message');
  renameSync(resultPartialPath, resultPath);
  assertNonEmptyFile(resultPath, 'worker result');
}

export function closeQuietly(descriptor) {
  try { closeSync(descriptor); } catch {}
}
