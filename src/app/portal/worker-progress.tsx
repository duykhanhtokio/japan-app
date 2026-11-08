import {Redirect} from 'expo-router';
import {RELEASE_FEATURES} from '@/config/release-features';
import { WorkerProgressDashboard } from '@/components/portal/WorkerProgressDashboard';

function WorkerProgressScreen() {
  return <WorkerProgressDashboard />;
}

/** Hidden in the learner-only first beta; direct links are gated too. */
export default function LearnerReleaseGate(){return RELEASE_FEATURES.organizationPortalsEnabled?<WorkerProgressScreen/>:<Redirect href="/home"/>;}
