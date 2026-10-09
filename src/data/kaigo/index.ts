import data from './content.json';
import type {Course, AtomicKnowledgeCourse} from './types';
import supplements from './atomic-supplements.json';
export const kaigoCourse = data as Course;
export const kaigoAtomicKnowledge = supplements as AtomicKnowledgeCourse;
export const KAIGO_TEST_ONLY = true;
