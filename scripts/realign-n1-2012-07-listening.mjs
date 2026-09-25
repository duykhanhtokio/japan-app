import fs from 'node:fs';

const path = new URL('../src/data/jlpt-official/n1-2012-07-exam-01.verified.json', import.meta.url);
const exam = JSON.parse(fs.readFileSync(path, 'utf8'));
const listening = exam.questions.filter((q) => q.family === 'listening');
// Boundaries in seconds, measured from the source MP3 using silence detection.
// The two responses to 問題5 問3 intentionally share the same segment.
const ranges = [
  [15.30, 80.84], [89.73, 173.12], [179.79, 238.78],
  // Q6 starts after the 450.088–455.957 silence; starting at 450.09
  // played the preceding Q5 audio in the app's player (runtime report).
  [243.63, 344.07], [349.86, 450.09], [455.96, 554.17],
  // 問題2 has a spoken prompt before each 20-second answer pause.
  // The opening instruction starts at 558.71, before the first pause.
  [554.17, 657.24], [657.24, 786.55], [786.55, 886.66],
  [886.66, 990.08], [990.08, 1072.58], [1072.58, 1197.35],
  [1197.35, 1286.45], [1286.45, 1379.53], [1379.53, 1482.82],
  [1482.82, 1571.73], [1571.73, 1662.04], [1662.04, 1766.40],
  [1766.40, 1889.30], [1889.30, 1923.69], [1923.69, 1950.36],
  [1950.36, 1980.55], [1980.55, 2011.43], [2011.43, 2038.90],
  [2038.90, 2069.33], [2069.33, 2097.68], [2097.68, 2126.11],
  [2126.11, 2151.42], [2151.42, 2183.09], [2183.09, 2210.87],
  [2210.87, 2238.60], [2238.60, 2254.72], [2254.72, 2360.90],
  [2360.90, 2504.52], [2504.52, 2662.64], [2504.52, 2662.64],
];
if (listening.length !== ranges.length) throw new Error('Unexpected listening response count');
for (let i = 0; i < listening.length; i++) {
  const [start, end] = ranges[i];
  if (!(end > start && end <= 2664.098)) throw new Error('Invalid audio range');
  listening[i].audio.startMs = Math.round(start * 1000);
  listening[i].audio.endMs = Math.round(end * 1000);
  listening[i].audio.timingConfidence = 'candidate_unverified';
  listening[i].audio.verificationStatus = 'needs_runtime_review';
}
fs.writeFileSync(path, JSON.stringify(exam, null, 2) + '\n');
