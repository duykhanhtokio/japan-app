import savedStarts from '@/data/jlpt-official/listening-start-overrides.json';

export const DEFAULT_JLPT_LISTENING_START_MS = 6500;

export function getJlptListeningStart(examId: string): number {
  const shared = (savedStarts as Record<string, number>)[examId];
  return Number.isInteger(shared) && shared >= 0 ? shared : DEFAULT_JLPT_LISTENING_START_MS;
}
