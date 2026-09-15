export type ConversationCategory =
    | 'life'
    | 'work';

export type ConversationMastery =
    | 'new'
    | 'review'
    | 'mastered';

export type ConversationLogLine = {
    id: string;

    speaker:
    | 'npc'
    | 'player';

    speakerNameJa: string;

    textJa: string;

    textVi?: string;

    userTranscript?: string;

    recommendedAnswer?: string;

    score?: number;
};

export type ConversationLog = {
    id: string;

    completedAt: string;

    category:
    ConversationCategory;

    prefectureId?: string;

    prefectureJa?: string;

    cityId?: string;

    cityJa?: string;

    locationId?: string;

    locationJa?: string;

    missionId: string;

    titleJa: string;

    titleVi: string;

    score: number;

    accuracy: number;

    fluency: number;

    pronunciation: number;

    listening: number;

    mastery:
    ConversationMastery;

    favorite: boolean;

    lines:
    ConversationLogLine[];
};