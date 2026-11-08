import {Redirect} from 'expo-router';
import {RELEASE_FEATURES} from '@/config/release-features';
import { EducationPayment } from '@/components/portal/EducationPayment';
function Screen(){return <EducationPayment />;}

/** Hidden in the learner-only first beta; direct links are gated too. */
export default function LearnerReleaseGate(){return RELEASE_FEATURES.organizationPortalsEnabled?<Screen/>:<Redirect href="/home"/>;}
