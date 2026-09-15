import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
    WorkConversationHistoryItem,
} from '@/types/work-conversation-history';

const STORAGE_KEY =
    '@japan_app_work_conversation_history';

/*
 * =========================================================
 * GET ALL HISTORY
 * =========================================================
 */

export async function getWorkConversationHistory():
    Promise<WorkConversationHistoryItem[]> {
    try {
        const stored =
            await AsyncStorage.getItem(
                STORAGE_KEY
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(
                stored
            );

        if (
            !Array.isArray(
                parsed
            )
        ) {
            return [];
        }

        return parsed as
            WorkConversationHistoryItem[];
    } catch (error) {
        console.log(
            'Get work conversation history error:',
            error
        );

        return [];
    }
}

/*
 * =========================================================
 * SAVE ONE COMPLETED CONVERSATION
 * =========================================================
 */

export async function saveWorkConversationHistory(
    item:
        WorkConversationHistoryItem
): Promise<void> {
    try {
        const history =
            await getWorkConversationHistory();

        /*
         * Session mới nhất nằm đầu danh sách.
         */

        const nextHistory:
            WorkConversationHistoryItem[] =
            [
                item,
                ...history,
            ];

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                nextHistory
            )
        );

        console.log(
            'Work conversation history saved:',
            item
        );
    } catch (error) {
        console.log(
            'Save work conversation history error:',
            error
        );

        throw error;
    }
}

/*
 * =========================================================
 * GET HISTORY BY OPERATION
 *
 * Ví dụ:
 * 3-7-1 鉄筋組立て
 * =========================================================
 */

export async function getWorkConversationHistoryByOperation(
    operationCode:
        string
): Promise<
    WorkConversationHistoryItem[]
> {
    const history =
        await getWorkConversationHistory();

    return history.filter(
        (item) =>
            item.operationCode ===
            operationCode
    );
}

/*
 * =========================================================
 * GET HISTORY BY SCENARIO
 * =========================================================
 */

export async function getWorkConversationHistoryByScenario(
    scenarioId:
        string
): Promise<
    WorkConversationHistoryItem[]
> {
    const history =
        await getWorkConversationHistory();

    return history.filter(
        (item) =>
            item.scenarioId ===
            scenarioId
    );
}

/*
 * =========================================================
 * GET LATEST SESSION
 * =========================================================
 */

export async function getLatestWorkConversationHistory():
    Promise<
        WorkConversationHistoryItem |
        null
    > {
    const history =
        await getWorkConversationHistory();

    return (
        history[0] ??
        null
    );
}

/*
 * =========================================================
 * COUNT COMPLETED SCENARIOS
 * =========================================================
 */

export async function getCompletedWorkConversationCount():
    Promise<number> {
    const history =
        await getWorkConversationHistory();

    return history.length;
}

/*
 * =========================================================
 * CLEAR
 *
 * Chỉ dùng cho development/debug.
 * =========================================================
 */

export async function clearWorkConversationHistory():
    Promise<void> {
    try {
        await AsyncStorage.removeItem(
            STORAGE_KEY
        );

        console.log(
            'Work conversation history cleared.'
        );
    } catch (error) {
        console.log(
            'Clear work conversation history error:',
            error
        );

        throw error;
    }
}