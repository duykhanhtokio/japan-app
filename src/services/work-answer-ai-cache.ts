import type {
    WorkAnswerAiFallbackResult,
} from '@/services/work-answer-ai-fallback';

const MAX_CACHE_SIZE =
    300;

const cache =
    new Map<
        string,
        WorkAnswerAiFallbackResult
    >();

function normalizeAnswer(
    value: string
) {
    return String(
        value ?? ''
    )
        .normalize(
            'NFKC'
        )
        .trim()
        .replace(
            /\s+/g,
            ''
        )
        .replace(
            /[。、！？!?「」『』（）()]/g,
            ''
        )
        .toLowerCase();
}

export function buildWorkAnswerAiCacheKey(
    turnId: string,
    answer: string
) {
    return [
        turnId,
        normalizeAnswer(
            answer
        ),
    ].join(
        '::'
    );
}

export function getWorkAnswerAiCache(
    turnId: string,
    answer: string
) {
    const key =
        buildWorkAnswerAiCacheKey(
            turnId,
            answer
        );

    const result =
        cache.get(
            key
        );

    if (
        !result
    ) {
        return undefined;
    }

    /*
     * LRU:
     *
     * Entry vừa được đọc sẽ được
     * chuyển xuống cuối Map.
     */

    cache.delete(
        key
    );

    cache.set(
        key,
        result
    );

    return result;
}

export function setWorkAnswerAiCache(
    turnId: string,
    answer: string,
    result:
        WorkAnswerAiFallbackResult
) {
    const key =
        buildWorkAnswerAiCacheKey(
            turnId,
            answer
        );

    /*
     * Nếu key đã tồn tại,
     * xóa trước để đưa nó xuống cuối.
     */

    if (
        cache.has(
            key
        )
    ) {
        cache.delete(
            key
        );
    }

    cache.set(
        key,
        result
    );

    /*
     * Bounded cache.
     *
     * Entry đầu tiên trong Map
     * là entry lâu không sử dụng nhất.
     */

    while (
        cache.size >
        MAX_CACHE_SIZE
    ) {
        const oldestKey =
            cache
                .keys()
                .next()
                .value;

        if (
            oldestKey ===
            undefined
        ) {
            break;
        }

        cache.delete(
            oldestKey
        );
    }
}

export function clearWorkAnswerAiCache() {
    cache.clear();
}

export function getWorkAnswerAiCacheSize() {
    return cache.size;
}

export function getWorkAnswerAiCacheLimit() {
    return MAX_CACHE_SIZE;
}