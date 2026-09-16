import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export function buildExplanations() {
  const dir = 'docs/jlpt-workspace/conversion/n1-2013-12/explanations';
  const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
  const dataset = read('src/data/jlpt-official/n1-2013-12/exam.candidate.json');
  const questions = new Map(dataset.questions.filter((q) => q.sectionId === 'written').map((q) => [q.questionNumber, q]));
  const files = fs.readdirSync(dir).sort();
  const sources = files.filter((f) => /^source-page-\d+\.json$/.test(f)).flatMap((f) => read(`${dir}/${f}`));
  const targets = files.filter((f) => /^translations-q\d+-q\d+\.json$/.test(f)).flatMap((f) => read(`${dir}/${f}`));
  const targetByNumber = new Map(targets.map((r) => [r.questionNumber, r]));
  const locales = ['zh-CN', 'ja', 'en', 'vi', 'id', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl'];
  assert.equal(sources.length, 70);
  assert.equal(targets.length, 70);
  assert.equal(targetByNumber.size, 70);
  assert.equal(new Set(sources.map((r) => r.questionNumber)).size, 70);
  const records = sources.sort((a, b) => a.questionNumber - b.questionNumber).map((source) => {
    const question = questions.get(source.questionNumber);
    const target = targetByNumber.get(source.questionNumber);
    assert.ok(question && target);
    assert.equal(source.correctOptionId, question.correctOptionId);
    const sourceTextSha256 = createHash('sha256').update(source.text).digest('hex');
    assert.equal(target.sourceTextSha256, sourceTextSha256);
    assert.equal(source.verificationStatus, 'verified_against_source_image');
    assert.deepEqual(target.localizedExplanations.map((e) => e.localeCode).sort(), locales.slice(1).sort());
    for (const entry of target.localizedExplanations) {
      assert.equal(entry.generatedBy, 'AI');
      assert.equal(entry.reviewedByNativeSpeaker, false);
      assert.equal(entry.status, 'translated_ai_unreviewed');
      assert.ok(entry.text.trim());
    }
    const sourceImages = (source.sourcePages ?? [source.sourcePage]).map((page) => {
      const imagePath = `assets/jlpt/n1/2013-12/answer-script/page-${String(page).padStart(2, '0')}.jpg`;
      const sha256 = createHash('sha256').update(fs.readFileSync(imagePath)).digest('hex');
      assert.equal(sha256, dataset.source.assets[imagePath]);
      return { page, path: imagePath, sha256 };
    });
    return {
      explanationId: `n1-2013-12-explanation-q${String(source.questionNumber).padStart(2, '0')}`,
      examId: dataset.examId, questionId: question.questionId,
      sourceExplanation: {
        language: 'zh-CN', text: source.text, correctOptionId: source.correctOptionId,
        sourcePage: source.sourcePage, sourceImages, sourceTextSha256,
        verificationStatus: source.verificationStatus,
        ...(source.sourceNote ? { sourceNote: source.sourceNote } : {}),
      },
      localizedExplanations: locales.map((localeCode) => localeCode === 'zh-CN'
        ? { localeCode, text: source.text, status: 'translated_verified', verificationScope: 'source_transcription_only', derivedFrom: 'sourceExplanation' }
        : { ...target.localizedExplanations.find((e) => e.localeCode === localeCode), derivedFrom: 'sourceExplanation' }),
    };
  });
  return {
    schemaVersion: 1, examId: dataset.examId, status: 'translation_completed_ai_unreviewed',
    sourceVerifiedCount: 70, sourceVerificationScope: 'Image-verified transcription only; printed errors are retained, not endorsed as correct explanations.',
    targetTranslationCount: 840, targetLocaleCount: 12, totalLocalizedExplanationCount: 910,
    translationMethod: 'Authored in the Codex session using repository sources only; no external translation service.',
    runtimeTranslationApiRequired: false,
    localizedStatus: Object.fromEntries(locales.map((locale) => [locale, { verified: locale === 'zh-CN' ? 70 : 0, aiUnreviewed: locale === 'zh-CN' ? 0 : 70, missing: 0 }])),
    records,
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  fs.writeFileSync('src/data/jlpt-official/n1-2013-12/explanations.13-locales.json', `${JSON.stringify(buildExplanations(), null, 2)}\n`);
  console.log('N1 2013-12 explanations built: 70 source + 840 AI-unreviewed translations; offline only.');
}
