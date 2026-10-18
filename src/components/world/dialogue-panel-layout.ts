export type DialoguePanelCopy = { text: string; lineHeight: number };
export type DialoguePanelSpec = { copy: DialoguePanelCopy[]; context: boolean };

const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
function graphemes(text: string): string[] {
  if (segmenter) {
    return Array.from(segmenter.segment(text), part => part.segment);
  }
  return Array.from(text).filter(char => !/[\p{Mark}\u200d\ufe0f]/u.test(char));
}

// Count a shaped cluster once: marks in Hindi, Khmer and Myanmar are not full
// extra cells. Keep room for word wrapping instead of shrinking every mark.
function advance(cluster: string): number {
  if (/^\s+$/u.test(cluster)) return .34;
  if (/^[ilI.,'!:;|]$/.test(cluster)) return .34;
  if (/^[mwMW]$/.test(cluster)) return .86;
  if (/^[A-Z0-9]$/.test(cluster)) return .68;
  if (/^[\u0020-\u007e]$/.test(cluster)) return .58;
  if (/\p{Script=Thai}/u.test(cluster)) return .82;
  if (/[\p{Script=Devanagari}\p{Script=Bengali}\p{Script=Myanmar}\p{Script=Khmer}]/u.test(cluster)) return 1.2;
  return 1.05;
}

export function dialogueCopyLines(text: string, width: number, size: number): number {
  const capacity = Math.max(1, width / size);
  let lines = 1, used = 0;
  for (const paragraph of text.split('\n')) {
    if (used < 0) { lines++; used = 0; }
    // Latin words wrap together; other scripts retain their native cluster
    // boundaries. A small width reserve covers platform line-break differences.
    const tokens = paragraph.match(/[A-Za-zÀ-ž0-9]+|[^A-Za-zÀ-ž0-9]+/gu) ?? [];
    for (const token of tokens) {
      const clusters = graphemes(token), word = /^[A-Za-zÀ-ž0-9]+$/u.test(token);
      const units = clusters.reduce((sum, cluster) => sum + advance(cluster), 0);
      if (word && units <= capacity && used && used + units > capacity) { lines++; used = 0; }
      for (const cluster of clusters) {
        const unit = advance(cluster);
        if (used && used + unit > capacity) { lines++; used = 0; }
        used += unit;
      }
    }
    used = -1;
  }
  return lines;
}

export function nativeDialogueLineHeight(language: string): number {
  return ['hi', 'bn', 'ne', 'my', 'th', 'km'].includes(language) ? 1.45 : 1.3;
}

export function dialoguePanelLayout({ width, height, headerBottom, bottom, npcWaist, wide, compact = false, panels }: {
  width: number; height: number; headerBottom: number; bottom: number; npcWaist: number; wide: boolean; compact?: boolean; panels: DialoguePanelSpec[];
}) {
  const gap = 16, inset = wide || compact ? 40 : 60;
  const topLimit = Math.max(0, headerBottom + 8), bottomLimit = Math.min(height, bottom);
  const available = Math.max(0, bottomLimit - topLimit);
  const normalWidth = wide && !compact ? width * .46 : width - 20;
  function required(spec: DialoguePanelSpec, panelWidth: number, fontSize: number) {
    const copyWidth = Math.max(80, panelWidth - (wide || compact ? 44 : 56) - 8);
    return Math.ceil(spec.copy.reduce((sum, copy) => sum + dialogueCopyLines(copy.text, copyWidth, fontSize) * fontSize * copy.lineHeight, 0) + inset + 8);
  }
  const atFourteen = panels.map(spec => required(spec, normalWidth, 14));
  const columns = wide && panels.length === 2 && atFourteen.reduce((sum, value) => sum + value, gap) > available;
  const panelWidth = columns ? (width - 20 - gap) / 2 : normalWidth;
  const fonts = panels.map(() => 17);
  const heights = () => panels.map((spec, i) => required(spec, panelWidth, fonts[i]));
  const total = () => columns ? Math.max(0, ...heights()) : heights().reduce((sum, value) => sum + value, gap * Math.max(0, panels.length - 1));
  // Give complete copy the empty space above the NPC's waist before reducing
  // type. The current prompt stays at least 14; context may use 12.
  const order = panels.map((_, i) => i).sort((a, b) => Number(panels[b].context) - Number(panels[a].context));
  for (const i of order) {
    const minimum = panels[i].context ? 12 : 14;
    while (fonts[i] > minimum && (columns ? heights()[i] > available : total() > available)) fonts[i] -= .5;
  }
  const sizes = heights(), extent = total();
  const top = Math.max(topLimit, Math.min(npcWaist, bottomLimit - extent));
  let next = 0;
  const placements = sizes.map((panelHeight, i) => {
    const placement = { left: columns ? i * (panelWidth + gap) : 0, top: columns ? 0 : next, width: panelWidth, height: panelHeight, fontSize: fonts[i] };
    next += panelHeight + gap;
    return placement;
  });
  return { top, bottom: height - bottomLimit, columns, placements, fits: extent <= available };
}
