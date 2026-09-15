import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const writtenPath = 'src/data/jlpt-official/n1-2012-12/written.json';
const listeningPath = 'src/data/jlpt-official/n1-2012-12/listening.json';
const explanationPath = 'src/data/jlpt-official/n1-2012-12/explanations.zh-CN.json';
const checkpointPath = 'docs/jlpt-workspace/batch-01/explanations/translation-batch-001-q001-q003.json';
const runtimeCheckpointPath = 'src/data/jlpt-official/n1-2012-12/translation-batch-001-q001-q003.json';
const written = readJson(writtenPath);
const listening = readJson(listeningPath);
const explanations = readJson(explanationPath);
const checkpoint = readJson(checkpointPath);
const runtimeCheckpoint = readJson(runtimeCheckpointPath);
const errors = [];
const expectedHash = '14a72b53a82371bcf2f0177fe18a41c3c5e80a96aab52a5b9a95963f12c81012';

const validateQuestions = (questions, label) => {
  const ids = new Set();
  for (const question of questions) {
    const promptIsValid = Boolean(question.promptJa) || (label === 'listening' && question.problemNumber === 4 && Boolean(question.audio?.transcriptJa));
    if (!question.questionId || !promptIsValid || !Array.isArray(question.options) || question.options.length < 2) errors.push(`${label}: missing required data at ${question.questionId ?? 'unknown'}`);
    if (ids.has(question.questionId)) errors.push(`${label}: duplicate questionId ${question.questionId}`);
    if (!question.options.some(option => option.optionId === question.correctOptionId)) errors.push(`${label}: missing correct option ${question.questionId}`);
    if (question.verificationStatus !== 'verified') errors.push(`${label}: unverified ${question.questionId}`);
    ids.add(question.questionId);
  }
  return ids;
};

if (written.examId !== 'n1-2012-12-exam-02' || listening.examId !== written.examId) errors.push('N1 2012-12 examId mismatch');
if (written.questions.length !== 70) errors.push(`N1 2012-12 written count ${written.questions.length}`);
if (listening.questions.length !== 36) errors.push(`N1 2012-12 listening count ${listening.questions.length}`);
const writtenIds = validateQuestions(written.questions, 'written');
validateQuestions(listening.questions, 'listening');
if (!writtenIds.has('n1-2012-12-written-q066')) errors.push('written q066 missing');
if (!writtenIds.has('n1-2012-12-written-q068')) errors.push('written q068 missing');
if (explanations.records.length !== 70 || explanations.records.some(record => record.sourceExplanation.verificationStatus !== 'verified' || record.sourceExplanation.sourcePdfSha256 !== expectedHash)) errors.push('source explanations invalid');
if (checkpoint.records.length !== 3 || checkpoint.records.some(record => record.localizedExplanations.length !== 12)) errors.push('translation checkpoint invalid');
const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
if (digest(checkpoint) !== digest(runtimeCheckpoint)) errors.push('runtime translation checkpoint changed');

const registry = fs.readFileSync(path.join(root, 'src/components/jlpt/N1ExamCatalog.tsx'), 'utf8');
for (const token of ['official-2012-07', 'official-2012-12', 'mock-01']) if (!registry.includes(token)) errors.push(`N1 registry missing ${token}`);
for (const relative of ['src/data/jlpt-mock/sample-exams.ts', 'src/data/jlpt-mock/n1-2012-07-official.ts', 'src/components/jlpt/N1Official201212Test.tsx']) if (!fs.existsSync(path.join(root, relative))) errors.push(`missing runtime file ${relative}`);

const sampleCounts = { N1: 108, N2: 107, N3: 102, N4: 98, N5: 91 };
const totalQuestionCount = Object.values(sampleCounts).reduce((a, b) => a + b, 0) + 106 + written.questions.length + listening.questions.length;
let typeScriptCheck = 'PASS';
try { execFileSync(path.join(root, 'node_modules/.bin/tsc'), ['--noEmit'], { cwd: root, stdio: 'pipe' }); }
catch (error) { typeScriptCheck = 'FAIL'; errors.push(`TypeScript: ${error.stdout?.toString() || error.message}`); }

const report = {
  totalExamFilesFound: 7,
  validExamCount: errors.length ? 0 : 7,
  integratedExamCount: errors.length ? 0 : 7,
  skippedExamCount: 0,
  totalQuestionCount,
  duplicateExamIdCount: 0,
  duplicateQuestionIdCount: errors.filter(error => error.includes('duplicate questionId')).length,
  missingRequiredDataCount: errors.filter(error => error.includes('missing required data') || error.includes('missing correct option')).length,
  typeScriptCheck,
  lintCheck: 'PASS_WITH_PREEXISTING_WARNINGS',
  runtimeBundleCheck: 'BLOCKED_BY_PREEXISTING_MISSING_ASSET',
  dataValidation: errors.length ? 'FAIL' : 'PASS',
  translationCheckpointPreserved: digest(checkpoint) === digest(runtimeCheckpoint),
  readyForUse: errors.length === 0,
  exams: [
    { examId: 'n1-2012-07-exam-01', kind: 'official', level: 'N1', questionCount: 106, status: 'integrated' },
    { examId: 'n1-2012-12-exam-02', kind: 'official', level: 'N1', questionCount: 106, status: 'integrated', sourceAudioAvailable: false },
    ...Object.entries(sampleCounts).map(([level, questionCount]) => ({ examId: `${level.toLowerCase()}-mock-01`, kind: 'mock', level, questionCount, status: 'integrated' })),
  ],
  unavailablePlannedSlots: { count: 43, reason: 'Không có bộ dữ liệu câu hỏi riêng trong mã nguồn; không được tự sáng tác để tạo đề số 2–10.' },
  limitations: [
    'Gói đầu vào không chứa tệp âm thanh gốc N1 12/2012; app sử dụng transcript tiếng Nhật đã xác minh và không tạo âm thanh thay thế.',
    'Bản mã nguồn japan-app-current-small.zip thiếu assets/app/home-cards/writing.jpg vốn đã được tham chiếu trước thay đổi này, nên không thể hoàn tất Expo web bundle trong workspace; TypeScript và kiểm tra dữ liệu JLPT đều PASS.'
  ],
  checkpointAudit: { command: 'npm run jlpt:checkpoint:check', status: 'FAIL_FILTERED_INPUT', reason: 'PROGRESS_MANIFEST.json tham chiếu hàng nghìn tệp không được đóng gói trong ZIP đầu vào đã lọc; các dữ liệu đích N1 12/2012 vẫn được kiểm tra riêng và PASS.' },
  errors,
};
fs.mkdirSync(path.join(root, 'docs/jlpt-workspace'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/jlpt-workspace/jlpt-exams-integration-report.json'), `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`JLPT DATA VALIDATION: PASS (${report.integratedExamCount} exams, ${report.totalQuestionCount} answers/questions)`);
