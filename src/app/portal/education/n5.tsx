import {Redirect} from 'expo-router';
import {RELEASE_FEATURES} from '@/config/release-features';
import { N5Curriculum } from '@/components/portal/N5Curriculum';

function N5CurriculumScreen() {
  return <N5Curriculum />;
}

/** Hidden in the learner-only first beta; direct links are gated too. */
export default function LearnerReleaseGate(){return RELEASE_FEATURES.organizationPortalsEnabled?<N5CurriculumScreen/>:<Redirect href="/home"/>;}
