import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const workspace = path.join(root, 'docs/jlpt-workspace/batch-01');
const output = path.join(workspace, 'PROGRESS_MANIFEST.json');
const stamp = new Date().toISOString();

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full === output ? [] : [full];
  });
}

function purpose(relativePath) {
  if (relativePath.includes('/written/')) return 'verified written extraction';
  if (relativePath.includes('/listening/')) return 'listening extraction under review';
  if (relativePath.includes('/audio-review/')) return 'human audio boundary review';
  if (relativePath.includes('/ocr/')) return 'OCR navigation aid; not official source';
  if (relativePath.includes('/whisper/')) return 'Whisper navigation aid; not official source';
  if (relativePath.includes('/rendered-pdf/')) return 'rendered source evidence and reports';
  if (relativePath.includes('/approved-sources/')) return 'approved source paths and hashes';
  if (relativePath.includes('/checkpoint/')) return 'historical checkpoint';
  return 'batch progress metadata';
}

const files = walk(workspace).sort().map((full) => {
  const relativePath = path.relative(root, full).split(path.sep).join('/');
  const bytes = fs.readFileSync(full);
  const name = relativePath.toLowerCase();
  return {
    relativePath,
    sizeBytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    purpose: purpose(relativePath),
    examId: name.includes('2012-12') ? 'n1-2012-12-exam-02' : name.includes('2013-07') ? 'n1-2013-07-exam-03' : name.includes('2013-12') ? 'n1-2013-12-exam-04' : null,
    status: name.includes('.review.') ? 'needs_review' : name.includes('ocr/') || name.includes('whisper/') ? 'support_only' : 'saved',
    sourceOrDerived: name.includes('approved-sources/') ? 'source_manifest' : 'derived',
    copiedAt: stamp,
  };
});

fs.writeFileSync(output, `${JSON.stringify({ schemaVersion: 1, generatedAt: stamp, manifestSelfExcluded: true, files }, null, 2)}\n`);
console.log(`Manifest written: ${output}`);
console.log(`Files recorded: ${files.length}`);

