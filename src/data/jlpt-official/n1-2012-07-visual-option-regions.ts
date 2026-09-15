export type VisualOptionRegion = {
  questionId: string;
  sourcePage: number;
  sourceAsset: string;
  crop: { x: number; y: number; width: number; height: number };
  outputAsset: string;
  verificationStatus: 'verified' | 'needs_review';
};

/** Pixel coordinates refer to the 1531 × 2063 full-resolution approved page render. */
export const N1_2012_07_VISUAL_OPTION_REGIONS: readonly VisualOptionRegion[] = [
  {
    questionId: 'n1-2012-07-l-p1-q01',
    sourcePage: 12,
    sourceAsset: 'assets/jlpt/n1/2012-07/question/page-12.jpg',
    crop: { x: 465, y: 1030, width: 430, height: 350 },
    outputAsset: 'assets/jlpt/n1/2012-07/visual-options/problem1-item1.jpg',
    verificationStatus: 'needs_review',
  },
  {
    questionId: 'n1-2012-07-l-p1-q06',
    sourcePage: 13,
    sourceAsset: 'assets/jlpt/n1/2012-07/question/page-13.jpg',
    crop: { x: 65, y: 45, width: 620, height: 410 },
    outputAsset: 'assets/jlpt/n1/2012-07/visual-options/problem1-item6.jpg',
    verificationStatus: 'needs_review',
  },
] as const;
