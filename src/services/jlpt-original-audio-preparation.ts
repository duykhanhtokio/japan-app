import { createOriginalAudioRevisionMigrator, type OriginalAudioRevision } from './jlpt-original-audio-revision';

type Storage = Parameters<typeof createOriginalAudioRevisionMigrator>[0];
type Activation = {
  schemaVersion: number; installedCompleteSet: boolean; forms: number;
  levels: string[]; profileSha256?: string;
  installedAudioSha256ByExamId?: Record<string, string>;
};
type LevelIndex = {
  schemaVersion: number; level: string; profileSha256: string;
  forms: OriginalAudioRevision[];
};
const LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5'];
const EXAMS = LEVELS.flatMap(level => Array.from({ length: 6 },
  (_, offset) => `jpapp-${level.toLowerCase()}-original-0${offset + 1}-v1`));

/** The catalog's required-state callback must read the session AFTER this gate. */
export function createOriginalAudioRoutePreparation(dependencies: {
  activation?: Activation;
  storage: () => Storage;
  loadLevel: (level: string) => LevelIndex;
}) {
  const preparations = new Map<string, ReturnType<typeof createOriginalAudioRevisionMigrator>>();
  return async (path: string) => {
    const route = path.split(/[?#]/)[0].replace(/\/$/, '');
    const match = /^\/(N[1-5])\/test$/.exec(route);
    if (!match) return;
    const activation = dependencies.activation;
    // Baseline builds deliberately have no installed replacement collection.
    if (!activation?.installedCompleteSet) return;
    if (activation.schemaVersion !== 1 || activation.forms !== 30
        || !/^[a-f0-9]{64}$/.test(activation.profileSha256 ?? '')
        || !Array.isArray(activation.levels)
        || [...activation.levels].sort().join(',') !== LEVELS.join(',')
        || !activation.installedAudioSha256ByExamId
        || Object.keys(activation.installedAudioSha256ByExamId).sort().join(',') !== EXAMS.join(',')
        || Object.values(activation.installedAudioSha256ByExamId).some(hash => !/^[a-f0-9]{64}$/.test(hash))) {
      throw new Error('Incomplete original audio activation');
    }
    const level = match[1];
    let prepare = preparations.get(level);
    if (!prepare) {
      const index = dependencies.loadLevel(level);
      if (index.schemaVersion !== 1 || index.level !== level
          || index.profileSha256 !== activation.profileSha256
          || !Array.isArray(index.forms) || index.forms.length !== 6
          || index.forms.some(row => row.level !== level)
          || index.forms.some(row => row.toAudioSha256 !== activation.installedAudioSha256ByExamId?.[row.examId])
          || index.forms.map(row => row.examId).sort().join(',') !== Array.from({ length: 6 },
            (_, offset) => `jpapp-${level.toLowerCase()}-original-0${offset + 1}-v1`).join(',')) {
        throw new Error('Incomplete original audio level index');
      }
      prepare = createOriginalAudioRevisionMigrator(dependencies.storage(), index.forms);
      preparations.set(level, prepare);
    }
    await prepare(level);
  };
}

let prepareRoute: ReturnType<typeof createOriginalAudioRoutePreparation> | undefined;
export async function prepareOriginalJlptAudioForRoute(path: string) {
  if (!prepareRoute) {
    prepareRoute = createOriginalAudioRoutePreparation({
      activation: require('@/data/jlpt-original/audio-revisions/activation.json') as Activation,
      storage: () => require('@react-native-async-storage/async-storage').default as Storage,
      loadLevel: level => {
        // Literal, lazy requires keep the indexes independently loadable by Metro.
        switch (level) {
          case 'N1': return require('@/data/jlpt-original/audio-revisions/n1.json') as LevelIndex;
          case 'N2': return require('@/data/jlpt-original/audio-revisions/n2.json') as LevelIndex;
          case 'N3': return require('@/data/jlpt-original/audio-revisions/n3.json') as LevelIndex;
          case 'N4': return require('@/data/jlpt-original/audio-revisions/n4.json') as LevelIndex;
          case 'N5': return require('@/data/jlpt-original/audio-revisions/n5.json') as LevelIndex;
          default: throw new Error('Unknown original audio level');
        }
      },
    });
  }
  await prepareRoute(path);
}
