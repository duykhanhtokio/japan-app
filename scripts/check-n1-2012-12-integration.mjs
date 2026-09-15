import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const written = read('src/data/jlpt-official/n1-2012-12/written.json');
const listening = read('src/data/jlpt-official/n1-2012-12/listening.json');
const explanations = read('src/data/jlpt-official/n1-2012-12/explanations.13-locales.json');
const audioPath = path.join(root, 'assets/jlpt/n1/2012-12/audio/n1-2012-12.mp3');
const locales = ['zh-CN', 'ja', 'en', 'vi', 'id', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl'];

if (written.questions.length !== 70) throw new Error('Written question count must be 70');
if (listening.questions.length !== 36) throw new Error('Listening answer-unit count must be 36');
if (explanations.records.length !== 70) throw new Error('Explanation count must be 70');
if (new Set(written.questions.map(item => item.questionId)).size !== 70) throw new Error('Duplicate written question ID');
for (const item of [...written.questions, ...listening.questions]) {
  if (item.verificationStatus !== 'verified') throw new Error(`${item.questionId}: not verified`);
  if (!item.options.some(option => option.optionId === item.correctOptionId)) throw new Error(`${item.questionId}: answer missing from options`);
}
for (const item of listening.questions) {
  if (item.transcriptVerificationStatus !== 'verified') throw new Error(`${item.questionId}: transcript not verified`);
}
let aiTranslations = 0;
for (const record of explanations.records) {
  const entries = record.localizedExplanations;
  if (entries.map(item => item.localeCode).join('|') !== locales.join('|')) throw new Error(`${record.questionId}: locale set/order mismatch`);
  if (entries.some(item => !item.text?.trim())) throw new Error(`${record.questionId}: empty explanation`);
  for (const entry of entries.slice(1)) {
    if (entry.status !== 'translated_ai_unreviewed' || entry.generatedBy !== 'AI' || entry.reviewedByNativeSpeaker !== false) throw new Error(`${record.questionId}/${entry.localeCode}: invalid AI status`);
    aiTranslations += 1;
  }
}
if (aiTranslations !== 840) throw new Error(`Expected 840 AI translations, received ${aiTranslations}`);
const audioSha = crypto.createHash('sha256').update(fs.readFileSync(audioPath)).digest('hex');
if (audioSha !== '848356bbfd00e0c4e91b5a20c55bae9a44b4d440fbdad76f912c4974b94b1919') throw new Error('Audio SHA-256 mismatch');
console.log('N1 12/2012 INTEGRATION PASS: written 70; listening 36; explanations 840/840; audio verified');
