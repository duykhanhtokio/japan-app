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
  'n1-2014-12', 'n1-2015-07',
  'n2-2013-12', 'n2-2014-07', 'n2-2014-12',
  'n2-2015-07', 'n2-2015-12', 'n2-2016-07', 'n2-2016-12', 'n2-2017-07', 'n2-2017-12', 'n2-2018-12',
  'n3-2012-07', 'n3-2012-12', 'n3-2013-07', 'n3-2013-12', 'n3-2014-07', 'n3-2014-12',
  'n3-2015-12', 'n3-2016-07', 'n3-2016-12', 'n3-2017-07', 'n3-2017-12', 'n3-2018-07',
  'n3-2018-12', 'n3-2020-12', 'n3-2021-07', 'n3-2021-12', 'n3-2022-07',
] as const;

export const PENDING_JLPT_EXAMS: readonly JlptExamCatalogEntry[] = scannedSourceIds.map((sourceId) => {
  const [level, year, month] = sourceId.split('-');
  const upperLevel = level.toUpperCase() as JlptLevel;
  return {
    id: sourceId,
    level: upperLevel,
    title: `日本語能力試験 ${upperLevel}`,
    periodLabel: `${year}年${Number(month)}月`,
    status: 'scanned_only',
    sourceId: `src/data/jlpt-mock/${sourceId}-official.ts`,
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
