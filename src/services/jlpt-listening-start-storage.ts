import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_JLPT_LISTENING_START_MS = 6500;

const keyFor = (examId: string) => `jlpt:listening-start:${examId}`;

export async function loadJlptListeningStart(examId: string): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(examId));
    if (raw === null) return DEFAULT_JLPT_LISTENING_START_MS;
    const milliseconds = Number(raw);
    return Number.isInteger(milliseconds) && milliseconds >= 0 ? milliseconds : DEFAULT_JLPT_LISTENING_START_MS;
  } catch {
    return DEFAULT_JLPT_LISTENING_START_MS;
  }
}

export async function saveJlptListeningStart(examId: string, milliseconds: number): Promise<void> {
  if (!Number.isInteger(milliseconds) || milliseconds < 0) throw new Error('Invalid listening start');
  await AsyncStorage.setItem(keyFor(examId), String(milliseconds));
}
