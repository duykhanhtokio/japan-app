import {Redirect,Slot} from 'expo-router';
import {RELEASE_FEATURES} from '@/config/release-features';
/** Covers taps, restored routes and direct links without mounting the farm. */
export default function GameReleaseGate(){return RELEASE_FEATURES.farmEnabled?<Slot/>:<Redirect href="/tasks"/>;}
