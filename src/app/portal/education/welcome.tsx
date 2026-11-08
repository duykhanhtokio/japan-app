import {Redirect} from 'expo-router';
import {RELEASE_FEATURES} from '@/config/release-features';
import { EducationWelcome } from '@/components/portal/EducationWelcome';
function Screen(){return <EducationWelcome />;}

/** Hidden in the learner-only first beta; direct links are gated too. */
export default function LearnerReleaseGate(){return RELEASE_FEATURES.organizationPortalsEnabled?<Screen/>:<Redirect href="/home"/>;}
