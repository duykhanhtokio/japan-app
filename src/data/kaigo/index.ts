import data from './content.json';
import type {Course, AtomicKnowledgeCourse} from './types';
import supplements from './atomic-supplements.json';
import gapSupplements from './gap-supplements.json';
import depthSupplements from './depth-supplements.json';
export const kaigoCourse = data as Course;
export const kaigoAtomicKnowledge = {...supplements, units: [...supplements.units, ...gapSupplements.units, ...depthSupplements.units], days: [...supplements.days, ...gapSupplements.days, ...depthSupplements.days]} as AtomicKnowledgeCourse;
export const KAIGO_TEST_ONLY = true;

import dailyPlan from './daily-plan.json';
export const kaigoDailyPlan = dailyPlan;

import languageSupplements from "./language-supplements.json";
import type {LanguageSupplementCourse} from "./types";
export const kaigoLanguageSupplements=languageSupplements as LanguageSupplementCourse;
