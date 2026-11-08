/** Educational figures use contain geometry; scene backgrounds keep their own cover policy. */
export function fitFigure(sourceWidth: number, sourceHeight: number, width: number, height: number) {
  const ratio = Number.isFinite(sourceWidth / sourceHeight) && sourceWidth > 0 && sourceHeight > 0 ? sourceWidth / sourceHeight : 1;
  const availableWidth = Math.max(1, width), availableHeight = Math.max(1, height);
  const fittedWidth = Math.min(availableWidth, availableHeight * ratio);
  return {width: fittedWidth, height: fittedWidth / ratio};
}
export const STUDY_CONTENT_WIDTH = 900;
export const FIGURE_PREVIEW_HEIGHT = 260;
