import {Redirect} from 'expo-router';
import {RELEASE_FEATURES} from '@/config/release-features';
import { OnlineClassroom } from '@/components/portal/OnlineClassroom';
function Screen(){return <OnlineClassroom />;}

/** Hidden in the learner-only first beta; direct links are gated too. */
export default function LearnerReleaseGate(){return RELEASE_FEATURES.organizationPortalsEnabled?<Screen/>:<Redirect href="/home"/>;}
