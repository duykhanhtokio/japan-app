import {Redirect} from 'expo-router';
import {RELEASE_FEATURES} from '@/config/release-features';
import { NewEducationClass } from '@/components/portal/NewEducationClass';

function NewEducationClassScreen() {
  return <NewEducationClass />;
}

/** Hidden in the learner-only first beta; direct links are gated too. */
export default function LearnerReleaseGate(){return RELEASE_FEATURES.organizationPortalsEnabled?<NewEducationClassScreen/>:<Redirect href="/home"/>;}
