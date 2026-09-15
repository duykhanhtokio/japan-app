export type WorkConversationHistoryItem = {
    id: string;

    operationCode: string;

    scenarioId: string;

    scenarioTitleJa: string;

    completedAt: string;

    playerLevel:
    | 'N5'
    | 'N4'
    | 'N3'
    | 'N2'
    | 'N1';

    completedPlayerTurns: number;

    totalPlayerTurns: number;

    totalHintsUsed: number;

    usedAnswerReveal: boolean;

    earnedXp: number;

    earnedCoins: number;

    /*
     * =====================================================
     * CONVERSATION QUALITY
     * =====================================================
     */

    correctCount: number;

    understandableCount: number;

    retryCount: number;
};