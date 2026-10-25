export type DialoguePanelCopy = { text: string; lineHeight: number };
export type DialoguePanelSpec = { copy: DialoguePanelCopy[]; alternatives?: DialoguePanelCopy[][]; context: boolean };

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

export function rubyDialogueLineHeight(fontSize: number) {
  return 1.25 + 1.25 * Math.max(9, fontSize * .56) / fontSize;
}

export function dialoguePanelLayout({ width, height, headerBottom, bottom, npcWaist, wide, compact = false, panels }: {
  width: number; height: number; headerBottom: number; bottom: number; npcWaist: number; wide: boolean; compact?: boolean; panels: DialoguePanelSpec[];
}) {
  const gap = 12, inset = 40;
  const topLimit = Math.max(0, headerBottom + 8, npcWaist), bottomLimit = Math.min(height, bottom);
  const available = Math.max(0, bottomLimit - topLimit);
  const normalWidth = wide && !compact ? width * .46 : width - 20;
  function required(spec: DialoguePanelSpec, panelWidth: number, fontSize: number) {
    const copyWidth = Math.max(80, panelWidth - (wide || compact ? 44 : 56) - 8);
    const copyHeight = Math.max(...[spec.copy, ...(spec.alternatives ?? [])].map(copy => copy.reduce((sum, row) => sum + dialogueCopyLines(row.text, copyWidth, fontSize) * fontSize * (row.lineHeight >= 2 ? Math.max(row.lineHeight, rubyDialogueLineHeight(fontSize)) : row.lineHeight), 0)));
    return Math.ceil(copyHeight + inset + 8);
  }
  const atFourteen = panels.map(spec => required(spec, normalWidth, 14));
  const columns = panels.length === 2 && (wide || (available < 200 && atFourteen.reduce((sum, value) => sum + value, gap) > available));
  const panelWidth = columns ? (width - 20 - gap) / 2 : normalWidth;
  const fonts = panels.map(() => 17);
  const heights = () => panels.map((spec, i) => required(spec, panelWidth, fonts[i]));
  const total = () => columns ? Math.max(0, ...heights()) : heights().reduce((sum, value) => sum + value, gap * Math.max(0, panels.length - 1));
  // The waist is a hard boundary. Long copy is paged inside the allocated frame.
  // Never borrow space above the character waist to fit a transcript.
  const order = panels.map((_, i) => i).sort((a, b) => Number(panels[b].context) - Number(panels[a].context));
  for (const i of order) {
    const minimum = panels[i].context ? 12 : 14;
    while (fonts[i] > minimum && (columns ? heights()[i] > available : total() > available)) fonts[i] -= .5;
  }
  const budget = columns ? available : Math.max(0, (available - gap * Math.max(0, panels.length - 1)) / Math.max(1, panels.length));
  const sizes = heights().map(value => Math.min(value, budget));
  const top = topLimit;
  let next = 0;
  const placements = sizes.map((panelHeight, i) => {
    const placement = { left: columns ? i * (panelWidth + gap) : 0, top: columns ? 0 : next, width: panelWidth, height: panelHeight, fontSize: fonts[i] };
    next += panelHeight + gap;
    return placement;
  });
  return { top, bottom: height - bottomLimit, columns, placements, fits: budget >= 64 };
}

export type DialogueRubyPart = { text: string; reading?: string };
/** Page complete source copy inside a fixed frame, retaining aligned ruby groups. */
export function dialogueTextPages(text: string, width: number, fontSize: number, maxHeight: number, lineFactor: number, ruby?: DialogueRubyPart[]) {
  const rows = Math.max(1, Math.floor(maxHeight / (fontSize * lineFactor)));
  const aligned = ruby?.map(part => part.text).join('') === text;
  const units: DialogueRubyPart[] = aligned ? ruby! : (text.match(/[A-Za-zÀ-ž0-9]+|[^A-Za-zÀ-ž0-9]/gu) ?? []).flatMap(token => dialogueCopyLines(token,width,fontSize)>1 ? graphemes(token).map(text=>({text})) : [{text:token}]);
  const pages: { text: string; ruby?: DialogueRubyPart[] }[] = [];
  let current: DialogueRubyPart[] = [];
  const flush = () => {
    if (!current.length) return;
    pages.push({ text: current.map(part => part.text).join(''), ...(aligned ? { ruby: current } : {}) });
    current = [];
  };
  for (const unit of units) {
    const candidate = current.map(part => part.text).join('') + unit.text;
    let lines = 1;
    if (aligned) {
      let used = 0;
      for (const part of [...current, unit]) {
        const units = (value: string) => graphemes(value).reduce((sum, char) => sum + advance(char), 0);
        const size = Math.max(units(part.text) * fontSize, units(part.reading ?? '') * Math.max(9,fontSize*.56));
        if (used && used + size > width) { lines++; used = 0; }
        used += size;
      }
    } else lines = dialogueCopyLines(candidate, width, fontSize);
    if (current.length && lines > rows) flush();
    current.push(unit);
  }
  flush();
  return pages.length ? pages : [{ text: '' }];
}
