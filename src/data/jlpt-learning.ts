import scenariosJson from '@/data/generated/scenarios.json';
import type { GeneratedScenario } from './jlpt-study-data';
export * from './jlpt-study-data';
export const generatedScenarios = scenariosJson as GeneratedScenario[];
