import fs from 'node:fs';

const path = new URL('../src/data/jlpt-official/n1-2012-07-exam-01.verified.json', import.meta.url);
const exam = JSON.parse(fs.readFileSync(path, 'utf8'));
const listening = exam.questions.filter((q) => q.family === 'listening');
// Boundaries in seconds, measured from the source MP3 using silence detection.
// The two responses to 問題5 問3 intentionally share the same segment.
const ranges = [
  [15.30, 80.84], [89.73, 173.12], [179.79, 238.78],
  [243.63, 344.07], [349.86, 450.09], [455.96, 571.47],
  [591.66, 676.65], [696.99, 805.31], [825.61, 907.95],
  [928.14, 1009.19], [1029.42, 1092.72], [1113.02, 1214.84],
  [1235.14, 1286.45], [1292.78, 1393.98], [1401.16, 1482.82],
  [1488.44, 1571.73], [1578.33, 1662.04], [1668.88, 1766.40],
  [1772.54, 1889.30], [1894.58, 1923.69], [1926.04, 1950.36],
  [1954.59, 1980.55], [1984.42, 2011.43], [2016.59, 2038.90],
  [2043.04, 2069.33], [2074.38, 2097.68], [2101.38, 2126.11],
  [2130.21, 2151.42], [2156.44, 2183.09], [2186.76, 2210.87],
  [2214.23, 2238.60], [2241.81, 2254.72], [2254.72, 2360.90],
  [2366.53, 2504.52], [2508.20, 2634.99], [2508.20, 2634.99],
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
