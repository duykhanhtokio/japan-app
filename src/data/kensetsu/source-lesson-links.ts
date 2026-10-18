import type { Session } from './index';
import type { ReviewSourceReference } from './review-tests';

export type SourceLessonLink = { reference: ReviewSourceReference; lesson?: Session };
const normalized = (value: string) => value.normalize('NFKC').replace(/\s+/g, ' ').trim();

/** The reader opens a whole lesson, so cluster references must not repeat that link. */
export function representativeSourceLessons(references: readonly ReviewSourceReference[],
    resolve?: (id: string) => Session | undefined): SourceLessonLink[] {
    const seen = new Set<string>();
    return references.flatMap(reference => {
        const lesson = resolve?.(reference.sessionId);
        const paragraphs = lesson?.clusters.flatMap(cluster => cluster.paragraphs.map(p => normalized(p.ja))) ?? [];
        // Same rendered lesson body can occur through different shared-source IDs.
        // A different body, even with the same title, remains a separate link.
        const key = paragraphs.some(Boolean) ? JSON.stringify(paragraphs) : 'id:' + reference.sessionId;
        if (seen.has(key)) return [];
        seen.add(key);
        return [{ reference, lesson }];
    });
}
