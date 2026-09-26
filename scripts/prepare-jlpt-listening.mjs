import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const selected = args.find(a => a.startsWith('--exam='))?.slice(7);
const all = args.includes('--all');
const convert = args.includes('--convert');
const applySource = args.includes('--apply-source');
const output = args.find(a => a.startsWith('--output='))?.slice(9);
class DiskSpaceError extends Error {}
class DurationMismatchError extends Error {}
if ((!selected && !all) || (selected && all) || (applySource && !convert) || args.some(a => !a.startsWith('--exam=') && !a.startsWith('--output=') && !['--all', '--convert', '--apply-source'].includes(a))) {
  console.error('Usage: node scripts/prepare-jlpt-listening.mjs --all|--exam=n1-2012-07-exam-01 [--convert] [--apply-source] [--output=report.json]');
  process.exit(2);
}
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
function run(command, argv) {
  const result = spawnSync(command, argv, { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw Error(`${command} failed: ${result.error?.message ?? result.stderr?.slice(-400)}`);
  return result.stdout;
}
function probe(file) {
  const parsed = JSON.parse(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name', '-of', 'json', file]));
  return { durationMs: Math.round(Number(parsed.format.duration) * 1000), codec: parsed.streams[0]?.codec_name };
}
function hash(file) {
  const sha = crypto.createHash('sha256');
  const fd = fs.openSync(file, 'r');
  const buffer = Buffer.alloc(1024 * 1024);
  try { for (let count; (count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0;) sha.update(buffer.subarray(0, count)); }
  finally { fs.closeSync(fd); }
  return sha.digest('hex');
}
function silence(file) {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'silencedetect=noise=-35dB:d=0.35', '-f', 'null', '-'],
    { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw Error(result.error?.message ?? result.stderr?.slice(-400));
  const openings = [...result.stderr.matchAll(/silence_start: ([\d.]+)/g)].map(m => Math.round(Number(m[1]) * 1000));
  const closings = [...result.stderr.matchAll(/silence_end: ([\d.]+)/g)].map(m => Math.round(Number(m[1]) * 1000));
  return openings.map((startMs, i) => ({ startMs, endMs: closings[i] ?? startMs, midpointMs: Math.round((startMs + (closings[i] ?? startMs)) / 2) }));
}
function near(ms, pauses) {
  const distance = p => ms < p.startMs ? p.startMs - ms : ms > p.endMs ? ms - p.endMs : 0;
  const found = pauses.filter(p => distance(p) <= 3000).sort((a, b) => distance(a) - distance(b))[0];
  return found ? { midpointMs: found.midpointMs, distanceMs: distance(found), pauseMs: found.endMs - found.startMs } : null;
}
function indexedAudio(absolute, original) {
  const indexed = absolute.replace(/\.mp3$/, '-indexed.m4a');
  if (!fs.existsSync(indexed)) {
    const stats = fs.statfsSync(path.dirname(indexed));
    const freeBytes = stats.bavail * stats.bsize;
    const reserveBytes = Math.max(1024 ** 3, fs.statSync(absolute).size * 3);
    if (freeBytes < reserveBytes) throw new DiskSpaceError(`free disk ${(freeBytes / 1024 ** 3).toFixed(2)} GiB; at least ${(reserveBytes / 1024 ** 3).toFixed(2)} GiB required before conversion`);
    const temp = indexed + '.tmp.m4a';
    try {
      run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', absolute, '-vn', '-c:a', 'aac', '-b:a', '80k', '-ar', '44100', '-movflags', '+faststart', temp]);
      const decodedDurationMs = probe(temp).durationMs;
      if (Math.abs(decodedDurationMs - original.durationMs) > 100) throw new DurationMismatchError(`source reports ${original.durationMs} ms but decoded AAC is ${decodedDurationMs} ms; source duration/timing needs independent audit`);
      fs.renameSync(temp, indexed);
    } finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
  }
  const result = probe(indexed);
  if (Math.abs(result.durationMs - original.durationMs) > 100) throw new DurationMismatchError(`source reports ${original.durationMs} ms but indexed AAC is ${result.durationMs} ms; source duration/timing needs independent audit`);
  return { file: path.relative(root, indexed), ...result, sha256: hash(indexed) };
}
function useIndexedAudio(source) {
  const basename = path.basename(source);
  const indexed = basename.replace(/\.mp3$/, '-indexed.m4a');
  const adapters = [path.join(root, 'src/data/jlpt-official/approved-n1-exams.ts'), ...walk(path.join(root, 'src/data/jlpt-mock')).filter(p => p.endsWith('.ts'))];
  const oldMatches = [], newMatches = [];
  for (const file of adapters) {
    const body = fs.readFileSync(file, 'utf8');
    if (body.includes(basename)) oldMatches.push(file);
    if (body.includes(indexed)) newMatches.push(file);
  }
  if (!oldMatches.length && newMatches.length === 1) return 'already_mapped';
  if (oldMatches.length !== 1 || newMatches.length) return 'mapping_ambiguous';
  const file = oldMatches[0], body = fs.readFileSync(file, 'utf8');
  const occurrences = body.split(basename).length - 1;
  if (occurrences !== 1) return 'mapping_ambiguous';
  fs.writeFileSync(file, body.replace(basename, indexed));
  return `mapped:${path.relative(root, file)}`;
}
const files = walk(path.join(root, 'src/data/jlpt-official')).filter(p => /(?:\.(?:verified|candidate)|\/listening)\.json$/.test(p));
const exams = [];
for (const file of files) {
  let dataset;
  try { dataset = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { continue; }
  const questions = dataset.questions?.filter(q => q.family === 'listening' && q.audio?.startMs !== undefined && q.audio?.endMs !== undefined) ?? [];
  if (dataset.examId && questions.length) exams.push({ dataset, file, questions });
}
const assetNames = execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD', 'assets/jlpt'], { cwd: root, encoding: 'utf8' }).split('\n')
  .filter(p => /\/audio\/[^/]+\.(?:mp3|m4a)$/.test(p));
const reports = [];
let diskBlocked = false;
function checkpoint() {
  if (!output) return;
  const destination = path.resolve(root, output);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const temporary = destination + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify({ policy: 'candidate_unverified; partial batch checkpoint',
    generatedAt: new Date().toISOString(), exams: reports }, null, 2) + '\n');
  fs.renameSync(temporary, destination);
}
for (const exam of exams.filter(e => all || e.dataset.examId === selected || e.dataset.examId.replace(/^jlpt-/, '') === selected)) {
  if (diskBlocked) break;
  const id = exam.dataset.examId;
  const stem = id.match(/(n[1-5]-\d{4}-\d{2})/i)?.[1];
  const originals = assetNames.filter(p => p.endsWith(`/audio/${stem}.mp3`) || p.endsWith(`/audio/${stem}.m4a`));
  const source = originals.find(p => p.endsWith('.mp3')) ?? originals[0];
  const record = { examId: id, dataset: path.relative(root, exam.file), responses: exam.questions.length,
    segments: new Set(exam.questions.map(q => q.audio.segmentId)).size, source: source ?? null, status: '', boundaries: [] };
  reports.push(record);
  if (!source) { record.status = 'source_audio_not_found'; checkpoint(); continue; }
  const absolute = path.join(root, source);
  if (!fs.existsSync(absolute) || fs.statSync(absolute).size < 100000) { record.status = 'source_audio_not_materialized'; checkpoint(); continue; }
  try {
    const original = probe(absolute);
    const hashes = new Set([exam.dataset.sourceAudioSha256, ...exam.questions.map(q => q.audio.sourceAudioHash)].filter(Boolean));
    record.original = { ...original, sha256: hash(absolute) };
    if (hashes.size && (hashes.size !== 1 || !hashes.has(record.original.sha256))) {
      record.status = 'source_hash_mismatch'; checkpoint(); continue;
    }
    let reviewFile = absolute;
    if (convert && source.endsWith('.mp3')) {
      record.indexed = indexedAudio(absolute, original);
      reviewFile = path.join(root, record.indexed.file);
      if (applySource) record.runtimeMapping = useIndexedAudio(source);
    }
    const pauses = silence(reviewFile);
    const seen = new Set();
    for (const q of exam.questions) {
      if (seen.has(q.audio.segmentId)) continue;
      seen.add(q.audio.segmentId);
      const { startMs, endMs } = q.audio;
      const prev = record.boundaries.at(-1);
      const flags = [];
      if (!(Number.isInteger(startMs) && Number.isInteger(endMs) && startMs >= 0 && endMs <= original.durationMs + 100 && endMs > startMs)) flags.push('out_of_range');
      if (prev && startMs < prev.endMs) flags.push('overlap');
      const startSilence = near(startMs, pauses), endSilence = near(endMs, pauses);
      if (!startSilence) flags.push('start_not_near_pause');
      const endsAtFile = Math.abs(endMs - original.durationMs) <= 150;
      if (!endSilence && !endsAtFile) flags.push('end_not_near_pause');
      if (startSilence && startSilence.distanceMs > 500) flags.push('start_over_0_5s_from_pause');
      if (endSilence && endSilence.distanceMs > 500 && !endsAtFile) flags.push('end_over_0_5s_from_pause');
      record.boundaries.push({ segmentId: q.audio.segmentId, problem: q.problemNumber, question: q.questionNumber,
        startMs, endMs, startSilence, endSilence, flags });
    }
    record.flagged = record.boundaries.filter(b => b.flags.length).length;
    const sample = new Map();
    for (const boundary of record.boundaries.filter(b => b.flags.length)) sample.set(boundary.segmentId, { segmentId: boundary.segmentId, reason: boundary.flags });
    for (const problem of new Set(record.boundaries.map(b => b.problem))) {
      const group = record.boundaries.filter(b => b.problem === problem);
      for (const offset of new Set([0, Math.floor((group.length - 1) / 2), group.length - 1])) {
        const boundary = group[offset];
        if (!sample.has(boundary.segmentId)) sample.set(boundary.segmentId, { segmentId: boundary.segmentId, reason: ['problem_start_middle_or_end_sample'] });
      }
    }
    record.reviewQueue = [...sample.values()];
    record.status = 'candidate_review_report';
  } catch (error) {
    record.status = error instanceof DiskSpaceError || /No space left on device|ENOSPC/.test(error.message) ? 'disk_space_blocked'
      : error instanceof DurationMismatchError ? 'source_duration_mismatch' : 'analysis_error';
    record.error = error.message;
    if (record.status === 'disk_space_blocked') diskBlocked = true;
  }
  checkpoint();
}
if (all && !diskBlocked) {
  const accounted = new Set(reports.map(r => r.source).filter(Boolean));
  for (const source of assetNames.filter(p => !accounted.has(p) && !/-indexed\.m4a$/.test(p))) {
    const record = { examId: path.basename(source).replace(/\.(?:mp3|m4a)$/, ''), dataset: null,
      responses: 0, segments: 0, source, status: 'audio_source_only', boundaries: [] };
    reports.push(record);
    const absolute = path.join(root, source);
    if (!fs.existsSync(absolute) || fs.statSync(absolute).size < 100000) { record.status = 'source_audio_not_materialized'; checkpoint(); continue; }
    try {
      record.original = { ...probe(absolute), sha256: hash(absolute) };
      if (convert && source.endsWith('.mp3')) record.indexed = indexedAudio(absolute, record.original);
    } catch (error) {
      record.status = error instanceof DiskSpaceError || /No space left on device|ENOSPC/.test(error.message) ? 'disk_space_blocked'
        : error instanceof DurationMismatchError ? 'source_duration_mismatch' : 'analysis_error';
      record.error = error.message;
      if (record.status === 'disk_space_blocked') diskBlocked = true;
    }
    checkpoint();
    if (diskBlocked) break;
  }
}
if (selected && !reports.length) throw Error(`No structured listening dataset for ${selected}`);
const result = { policy: 'candidate_unverified; silence proximity is a review hint, never automatic proof of a question boundary',
  generatedAt: new Date().toISOString(), exams: reports };
if (output) { const destination = path.resolve(root, output); fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, JSON.stringify(result, null, 2) + '\n'); }
for (const r of reports) console.log(`${r.examId}\t${r.status}\t${r.boundaries.length}/${r.segments} segments\t${r.flagged ?? '-'} flagged\t${r.reviewQueue?.length ?? '-'} review samples`);
console.log(`TOTAL ${reports.length}; ${reports.filter(r => r.status === 'candidate_review_report').length} analyzed; report ${output ?? 'stdout summary only'}`);
if (diskBlocked) { console.error('PAUSED: low disk space. Existing source and completed indexed files were preserved.'); process.exitCode = 3; }
