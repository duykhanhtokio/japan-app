/** Neutral, print-like visual system used only inside JLPT study and exam routes. */
export const JLPT_EXAM = {
  color: {
    page: '#e8e2d6',
    paper: '#e8e2d6',
    ink: '#24231f',
    secondaryInk: '#625f57',
    divider: '#B8B1A5',
    selectedFill: '#dce8dc',
    selected: '#50745c',
    selectedBorder: '#78917d',
    correct: '#3f6b4f',
    correctFill: '#dfeadf',
    wrong: '#8a514b',
    wrongFill: '#eee0dd',
    unanswered: '#756f65',
  },
  font: {
    content: 'RoyalSerifJP-SemiBold',
    interface: 'RoyalSansJP-Medium',
  },
  type: {
    sectionTitle: 22,
    problemTitle: 20,
    instruction: 16,
    passage: 18,
    question: 20,
    answer: 18,
    auxiliary: 14,
  },
  line: {
    instruction: 26,
    passage: 30,
    question: 32,
    answer: 28,
    auxiliary: 21,
  },
  space: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
  contentMaxWidth: 760,
  minimumTouch: 52,
} as const;

export type JlptFontScale = 0.9 | 1 | 1.1 | 1.2 | 1.3 | 1.4;
