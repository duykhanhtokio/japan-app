import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import Constants from 'expo-constants';
import { AppState, Platform } from 'react-native';
import { npcAudioRelease, packedRecordingFor } from './dialogue-audio-packs';
import { npcAudioClips, npcAudioEntries } from '../data/dialogue-content/npc-audio.generated';
import casting from '../data/dialogue-content/npc-voice-casting.json';
import voices from '../data/jlpt-original/voice-casting.json';

export const voiceCredits = Object.values(voices.roles).map(v => `${v.credit}\n${v.termsUrl}`).join('\n\n');

type Options = { scenarioId: string; turnId: string; category?: string | null; language?: string; rate?: number; onBoundary?: (event: {charIndex: number; charLength: number}) => void; onDone?: () => void; onStopped?: () => void; onError?: () => void };
let current: AudioPlayer | null = null;
let subscription: { remove(): void } | null = null;
let watchdog: ReturnType<typeof setTimeout> | null = null;
let generation = 0;
let pending: AbortController | null = null;
let segmentTimer: ReturnType<typeof setInterval> | null = null;
let removeInterruption: (()=>void) | null = null;
function release() {
 pending?.abort(); pending = null;
 if(segmentTimer)clearInterval(segmentTimer);segmentTimer=null;
 removeInterruption?.();removeInterruption=null;
 subscription?.remove(); subscription = null;
 if (watchdog) clearTimeout(watchdog); watchdog = null;
 const player = current; current = null;
 if (player) { try { player.pause(); } finally { player.remove(); } }
}
export async function stop() {
 generation++;
 release();

}
export function approvedVoiceFor(category?: string | null) {
 const key = (category ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
 const role = (casting.categories as Record<string, string>)[key] ?? casting.fallbackRole;
 return { role, ...voices.roles[role as keyof typeof voices.roles] };
}
function voiceServer() {
 const configured = process.env.EXPO_PUBLIC_NPC_VOICE_URL;
 if (configured) return configured.replace(/\/$/, '');
 const hostUri = Constants.expoConfig?.hostUri;
 const host = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.hostname
  : hostUri ? new URL(hostUri.includes('://') ? hostUri : `http://${hostUri}`).hostname : null;
 return host ? `http://${host}:50130` : null;
}
/** Select recordings by exact source AND visual character voice, never just turn position. */
export function recordingFor(text: string, options: Pick<Options, 'scenarioId' | 'turnId' | 'category'>) {
 const entry = npcAudioEntries[options.scenarioId]?.[options.turnId];
 const { role, ...approved } = approvedVoiceFor(options.category);
 const packed = packedRecordingFor(text, options.scenarioId, options.turnId, role, approved.speakerId);
 if (packed) return packed;
 return entry && entry.sourceJa === text && entry.role === role && entry.speakerId === approved.speakerId && npcAudioClips[entry.clip] !== undefined
  ? { ...entry, source: npcAudioClips[entry.clip] } : null;
}
export function speak(text: string, options: Options) {
 const token = ++generation;
 release();
 const { scenarioId, turnId, category } = options;
 const recording = recordingFor(text, { scenarioId, turnId, category });
 const fail = () => {
  if (token !== generation) return;
  release();
  options.onError?.();
 };
 const play = (source: number | {uri: string}, durationMs?: number, startMs = 0, recover = false) => {
  if (token !== generation) return;
  const playbackFailure = () => recover ? requestLive() : fail();
  try {
   const start=startMs/1000,end=durationMs?start+durationMs/1000:0;
   const actualSource=packed&&Platform.OS==='web'&&typeof source==='object'?{uri:`${source.uri}#t=${start},${end}`}:source;
   const player = createAudioPlayer(actualSource, { updateInterval: 25 });
   current = player;
   let started = false;
   let seeking = false;
   let positioned = startMs === 0;
   const complete = () => { if (token !== generation || current !== player) return; generation++; release(); options.onDone?.(); };
   const interrupt = () => { if (token !== generation || current !== player) return; generation++; release(); options.onStopped?.(); options.onError?.(); };
   const app = AppState?.addEventListener('change', state => { if (state !== 'active') interrupt(); });
   const visibility = () => { if (typeof document !== 'undefined' && document.hidden) interrupt(); };
   if (Platform.OS === 'web' && typeof document !== 'undefined') document.addEventListener('visibilitychange', visibility);
   removeInterruption = () => { app?.remove(); if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', visibility); };
   const position=()=>{
    if(positioned||seeking||token!==generation||current!==player)return;
    seeking=true;
    void player.seekTo(startMs/1000,0,0).then(()=>{
     if(token!==generation||current!==player)return;
     positioned=true;player.play();
    }).catch(()=>{if(token===generation&&current===player)fail();});
   };
   subscription = player.addListener('playbackStatusUpdate', status => {
    if (token !== generation || current !== player) return;
    if (status.playbackState === 'error') { release(); playbackFailure(); return; }
    if(status.isLoaded&&!positioned)position();
    if (!positioned) return;
    if (status.playing) {
     started = true;
     if (watchdog) clearTimeout(watchdog); watchdog = null;
     const elapsed = Math.max(0, status.currentTime - startMs / 1000);
     const duration = durationMs ? durationMs / 1000 : status.duration;
     if (packed && durationMs && elapsed >= durationMs / 1000 - .01) { complete(); return; }
     if (duration > 0) options.onBoundary?.({charIndex: Math.min(text.length, Math.floor(elapsed / duration * text.length)), charLength: 0});
    }
    if(status.didJustFinish){if(!packed||status.currentTime>=end-.1)complete();else fail();}
   });
   watchdog = setTimeout(() => { if (!started) { release(); playbackFailure(); } }, 15000);
   if(packed)segmentTimer=setInterval(()=>{if(token===generation&&current===player&&started&&player.currentTime>=end-.01)complete();},20);
   if(positioned)player.play();else if(player.isLoaded)position();
  } catch { release(); playbackFailure(); }
 };
 const requestLive = () => {
 if (npcAudioRelease.complete) { fail(); return; }
 const server = voiceServer();
 if (!server) { fail(); return; }
 const controller = new AbortController(); pending = controller;
 const timeout = setTimeout(() => controller.abort(), 60000);
 void fetch(`${server}/speech`, {method:'POST', headers:{'Content-Type':'application/json'}, signal:controller.signal,
  body:JSON.stringify({text, speakerId:approvedVoiceFor(category).speakerId})})
  .then(async response => {
   if (!response.ok) throw new Error(`VOICEVOX ${response.status}`);
   const result = await response.json() as {url:string};
   if (!/^\/clip\/[a-f0-9]{64}\.wav$/.test(result.url)) throw new Error('Invalid voice clip');
   if (token !== generation) return;
   pending = null;
   play({uri:server+result.url});
  }).catch(fail).finally(()=>clearTimeout(timeout));
 };
 // Complete releases resolve every NPC through pre-generated recordings.
 if (recording) play(recording.source, recording.durationMs, 'startMs' in recording ? recording.startMs : 0, !('startMs' in recording));
 else requestLive();
}
