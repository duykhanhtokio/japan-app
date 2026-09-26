import AsyncStorage from '@react-native-async-storage/async-storage';

export type ListeningSegmentCorrection = {
  startMs: number;
  endMs: number;
  updatedAt: string;
  humanReviewed: false;
  perceptualApproval: false;
};

const key = (examId: string, questionId: string) => `jlpt:listening-review:${examId}:${questionId}:v1`;

export async function loadListeningSegmentCorrection(examId: string, questionId: string): Promise<ListeningSegmentCorrection | null> {
  const raw = await AsyncStorage.getItem(key(examId, questionId));
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as ListeningSegmentCorrection;
    return Number.isFinite(value.startMs) && Number.isFinite(value.endMs) && value.startMs >= 0 && value.endMs > value.startMs ? value : null;
  } catch { return null; }
}

export async function saveListeningSegmentCorrection(examId: string, questionId: string, startMs: number, endMs: number) {
  if (!Number.isInteger(startMs) || !Number.isInteger(endMs) || startMs < 0 || endMs <= startMs) throw new Error('Invalid listening interval');
  const correction: ListeningSegmentCorrection = { startMs, endMs, updatedAt: new Date().toISOString(), humanReviewed: false, perceptualApproval: false };
  await AsyncStorage.setItem(key(examId, questionId), JSON.stringify(correction));
  return correction;
}
