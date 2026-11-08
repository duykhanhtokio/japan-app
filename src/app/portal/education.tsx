import {Redirect} from 'expo-router';
import {RELEASE_FEATURES} from '@/config/release-features';
import { OrganizationDashboard } from '@/components/portal/OrganizationDashboard';

function EducationPortalScreen() {
  return <OrganizationDashboard kind="education" />;
}

/** Hidden in the learner-only first beta; direct links are gated too. */
export default function LearnerReleaseGate(){return RELEASE_FEATURES.organizationPortalsEnabled?<EducationPortalScreen/>:<Redirect href="/home"/>;}
