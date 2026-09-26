import fs from 'node:fs';

const path = new URL('../src/data/jlpt-official/n1-2012-07-exam-01.verified.json', import.meta.url);
const exam = JSON.parse(fs.readFileSync(path, 'utf8'));
const listening = exam.questions.filter((q) => q.family === 'listening');
// Boundaries in seconds, measured from the source MP3 using silence detection.
// The two responses to 問題5 問3 intentionally share the same segment.
const ranges = [
  [6.79, 84.22], [89.64, 174.98], [179.58, 241.59],
  // Q6 starts after the 450.088–455.957 silence; starting at 450.09
  // played the preceding Q5 audio in the app's player (runtime report).
  // Keep Q4 as approved; Q5 started with 4–5 seconds from Q4 in the app.
  [243.93, 345.54], [349.63, 452.90], [455.79, 555.74],
  // 問題2 has a spoken prompt before each 20-second answer pause.
  // The opening instruction starts at 558.71, before the first pause.
  [559.00, 658.55], [661.99, 787.44], [791.40, 887.73],
  [892.16, 991.05], [994.15, 1073.51], [1078.10, 1199.37],
  [1202.09, 1292.27], [1293.95, 1380.64], [1385.25, 1484.28],
  [1488.27, 1573.02], [1577.85, 1663.36], [1668.69, 1767.52],
  [1772.35, 1863.88], [1865.92, 1890.05], [1894.44, 1920.70],
  [1922.26, 1951.27], [1954.48, 1981.62], [1984.16, 2012.61],
  [2016.42, 2040.03], [2042.87, 2070.16], [2074.21, 2098.62],
  [2101.25, 2126.69], [2129.01, 2152.66], [2156.29, 2184.35],
  [2185.75, 2211.86], [2214.06, 2239.82], [2241.62, 2361.96],
  [2366.33, 2505.81], [2508.15, 2664.07], [2508.15, 2664.07],
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
