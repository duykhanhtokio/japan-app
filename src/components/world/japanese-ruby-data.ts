import type { RubySegment } from '@/types/japanese-ruby';

export function hasAlignedRuby(text: string, segments: unknown): segments is RubySegment[] {
 return Array.isArray(segments) && segments.length > 0 && segments.every(part =>
  part && typeof part.text === 'string' && part.text.length > 0 &&
  (part.reading === undefined || (typeof part.reading === 'string' && /^[\p{Script=Hiragana}ー\s]+$/u.test(part.reading)))
 ) && segments.map(part => part.text).join('') === text;
}

// A partial word has no displayed reading until its full base has appeared.
export function visibleRuby(segments: RubySegment[], length: number): RubySegment[] {
 const result: RubySegment[] = [];
 let remaining = Math.max(0, Math.floor(length));
 for (const part of segments) {
  if (remaining <= 0) break;
  if (remaining >= part.text.length) result.push(part);
  else result.push({ text: part.text.slice(0, remaining) });
  remaining -= part.text.length;
 }
 return result;
}
