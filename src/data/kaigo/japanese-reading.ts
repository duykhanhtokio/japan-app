import { kaigoCourse } from "./index";
import { sectionsFor, type ReadingSection } from "./weekly-learning";
import type { CatalogEntry, TopicId } from "./catalog";
import { japaneseMasterSections } from './japanese-master';

export const topicTitlesJa: Record<TopicId, string> = {
  dignity: "尊厳と自立支援",
  safety: "安全と感染予防",
  body: "こころとからだ",
  communication: "コミュニケーション",
  movement: "移動の介護",
  meals: "食事の介護",
  excretion: "排泄の介護",
  hygiene: "身じたく・入浴・清潔",
  "daily-life": "生活支援とサービス",
  handoff: "記録と申し送り",
  review: "総合復習",
};
export const titleForDay = (entry: CatalogEntry) =>
  `${topicTitlesJa[entry.topicId]} · 第${entry.day}日`;
export type JapaneseReadingSection = ReadingSection & {
  headingJa: string;
  paragraphsJa: string[];
  japaneseComplete: boolean;
  masterStatus?: string;
};
const placeholder = /^知識を確かめて、理由を説明しましょう。$/;

/** Preserve every original teaching paragraph. Missing Japanese is explicit;
 * a generic instruction or a short summary never substitutes for a full lesson. */
export function japaneseSectionsFor(
  entry: CatalogEntry,
): JapaneseReadingSection[] {
  const lessons = [...kaigoCourse.lessons, ...kaigoCourse.candidates];
  return sectionsFor(entry).map((section, index) => {
    const master = japaneseMasterSections[section.id];
    if (master) return {
      ...section,
      headingJa: master.headingJa,
      paragraphsJa: master.paragraphsJa,
      japaneseComplete: true,
      masterStatus: master.editorialStatus,
    };
    const lesson = lessons.find((l) => section.id.startsWith(l.id + "-"));
    let paragraphsJa =
      section.japanese && !placeholder.test(section.japanese)
        ? [section.japanese]
        : [];
    let headingJa = `学習項目 ${index + 1}`;
    let complete = section.paragraphs.length === 0 && paragraphsJa.length > 0;
    if (lesson && section.id === lesson.id + "-words") {
      headingJa = "語彙と表現";
      paragraphsJa = [
        ...kaigoCourse.terms.filter((t) => lesson.termIds.includes(t.id ?? "")),
        ...lesson.inlineNotes,
      ].map((t) => `${t.termJa}（${t.readingJa}）`);
      paragraphsJa.push(...lesson.expressions.map((e) => e.textJa));
      complete = true;
    } else if (lesson && section.id === lesson.id + "-dialogue") {
      headingJa = "場面の会話";
      paragraphsJa = lesson.dialogue.map(
        (t) =>
          `${t.speaker === "npc" ? (kaigoCourse.npcs.find((n) => n.id === t.npcId)?.nameJa ?? "相手") : "介護職員"}：${t.textJa}`,
      );
      // The Japanese context is still missing when only contextVi exists.
      complete = !lesson.contextVi;
    } else if (section.id.endsWith("-reading")) headingJa = "文章を読む";
    else if (section.id.endsWith("-summary")) headingJa = "知識の要点";
    else if (section.id.endsWith("-terms")) headingJa = "語彙の確認";
    const transfer = lessons
      .flatMap((l) => l.transfers)
      .find((t) => t.id === section.id);
    if (transfer) {
      headingJa = "場面で使う表現";
      paragraphsJa = transfer.steps.flatMap((t) =>
        [t.promptJa, t.modelJa, ...t.alternativesJa, t.replyJa].filter(Boolean),
      );
      complete = false;
    }
    return { ...section, headingJa, paragraphsJa, japaneseComplete: complete };
  });
}
