import {Redirect} from 'expo-router';
import {RELEASE_FEATURES} from '@/config/release-features';
import { OrganizationDashboard } from '@/components/portal/OrganizationDashboard';

function SupportPortalScreen() {
  return <OrganizationDashboard kind="support" />;
}

/** Hidden in the learner-only first beta; direct links are gated too. */
export default function LearnerReleaseGate(){return RELEASE_FEATURES.organizationPortalsEnabled?<SupportPortalScreen/>:<Redirect href="/home"/>;}
