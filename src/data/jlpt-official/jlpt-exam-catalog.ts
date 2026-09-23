import type { JlptLevel } from '@/data/jlpt-learning';

export type JlptExamCatalogStatus = 'structured_ready' | 'converting' | 'scanned_only' | 'incomplete' | 'not_verified' | 'mock_ready';

export type JlptExamCatalogEntry = {
  id: string;
  level: JlptLevel;
  title: string;
  periodLabel: string;
  status: JlptExamCatalogStatus;
  sourceId: string;
};

const scannedSourceIds = [
  'n4-2011-12',
  'n4-2012-12',
  'n4-2013-07',
  'n4-2013-12',
  'n4-2014-07',
  'n4-2017-07',
  'n4-2018-07',
  'n4-2021-07',
  'n4-2021-12',
  'n5-2011-12',
  'n5-2012-12',
  'n5-2013-07',
  'n5-2017-07',
  'n5-2018-12',
  'n5-2020-12',
  'n5-2021-12',
] as const;
const incompleteSourceIds = new Set<string>(scannedSourceIds);

export const PENDING_JLPT_EXAMS: readonly JlptExamCatalogEntry[] = scannedSourceIds.map((sourceId) => {
  const [level, year, month] = sourceId.split('-');
  const upperLevel = level.toUpperCase() as JlptLevel;
  return {
    id: sourceId,
    level: upperLevel,
    title: `日本語能力試験 ${upperLevel}`,
    periodLabel: `${year}年${Number(month)}月`,
    status: incompleteSourceIds.has(sourceId) ? 'incomplete' : 'scanned_only',
    sourceId: level === 'n4' || level === 'n5'
      ? `external-source:${upperLevel}/${year}-${month}`
      : `src/data/jlpt-mock/${sourceId}-official.ts`,
  };
});

export const MOCK_JLPT_EXAMS: readonly JlptExamCatalogEntry[] = (['N1', 'N2', 'N3', 'N4', 'N5'] as const).map((level) => ({
  id: `${level.toLowerCase()}-mock-01`,
  level,
  title: `日本語能力試験 ${level}`,
  periodLabel: '模擬試験',
  status: 'mock_ready',
  sourceId: 'src/data/jlpt-mock/sample-exams.ts',
}));
