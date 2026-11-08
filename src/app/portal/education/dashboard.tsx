import {Redirect} from 'expo-router';
import {RELEASE_FEATURES} from '@/config/release-features';
import { EducationDashboard } from '@/components/portal/EducationDashboard';
function Screen(){return <EducationDashboard />;}

/** Hidden in the learner-only first beta; direct links are gated too. */
export default function LearnerReleaseGate(){return RELEASE_FEATURES.organizationPortalsEnabled?<Screen/>:<Redirect href="/home"/>;}
