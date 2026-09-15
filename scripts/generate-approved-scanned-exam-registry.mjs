import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'src/data/jlpt-mock');
const files = fs.readdirSync(dataDir)
  .filter((name) => /^n[123]-\d{4}-(07|12)-official\.ts$/.test(name) && name !== 'n1-2012-07-official.ts')
  .sort();

const imports = files.map((name, index) => `import * as E${index} from '@/data/jlpt-mock/${name.replace(/\.ts$/, '')}';`).join('\n');
const rows = files.map((name, index) => {
  const [, levelDigit, year, month] = name.match(/^n([123])-(\d{4})-(07|12)-official\.ts$/);
  const level = `N${levelDigit}`;
  const prefix = `${level}_${year}_${month}`;
  const minutes = level === 'N1' ? 110 : level === 'N2' ? 105 : 100;
  const listening = level === 'N1' ? '約60分' : level === 'N2' ? '約50分' : '約40分';
  return `  { id: '${level.toLowerCase()}-${year}-${month}', level: '${level}', dateLabel: '${year}年${Number(month)}月', writtenMinutes: ${minutes}, listeningMinutesLabel: '${listening}', audio: E${index}.${prefix}_AUDIO, answerKeyPage: E${index}.${prefix}_ANSWER_KEY_PAGE, writtenKey: E${index}.${prefix}_WRITTEN_KEY, listeningKey: E${index}.${prefix}_LISTENING_KEY, writtenPages: E${index}.${prefix}_WRITTEN_PAGES, listeningPages: E${index}.${prefix}_LISTENING_PAGES, scriptPages: E${index}.${prefix}_SCRIPT_PAGES },`;
}).join('\n');

const output = `import type { ImageSourcePropType } from 'react-native';\nimport type { JlptLevel } from '@/data/jlpt-learning';\n${imports}\n\nexport type ApprovedScannedExam = {\n  id: string; level: JlptLevel; dateLabel: string; writtenMinutes: number; listeningMinutesLabel: string;\n  audio: number; answerKeyPage: ImageSourcePropType; writtenKey: readonly number[]; listeningKey: readonly number[];\n  writtenPages: readonly ImageSourcePropType[]; listeningPages: readonly ImageSourcePropType[]; scriptPages: readonly ImageSourcePropType[];\n};\n\nexport const APPROVED_SCANNED_EXAMS: readonly ApprovedScannedExam[] = [\n${rows}\n];\n`;

fs.writeFileSync(path.join(root, 'src/data/jlpt-official/approved-scanned-exams.generated.ts'), output);
