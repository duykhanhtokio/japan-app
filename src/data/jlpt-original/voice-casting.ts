import casting from './voice-casting.json';

/** Publisher-approved voices for newly authored JLPT audio; runtime integration is pending. */
export const JLPT_ORIGINAL_VOICE_CASTING = casting;
export type JlptOriginalVoiceRole = keyof typeof casting.roles;
export const JLPT_ORIGINAL_VOICE_CREDITS = Object.values(casting.roles).map((voice) => voice.credit);
