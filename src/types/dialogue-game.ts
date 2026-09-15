export type CharacterEmotion =
    | 'normal'
    | 'happy'
    | 'sad'
    | 'angry'
    | 'surprised';

export type DialogueTurnType =
    | 'npc'
    | 'player';

export type GameCharacter = {
    id: string;

    nameJa: string;
    nameVi: string;

    roleJa?: string;
    roleVi?: string;

    defaultEmotion?: CharacterEmotion;

    spriteId?: string;
};

export type GameLocation = {
    id: string;

    cityId: string;

    nameJa: string;
    nameVi: string;

    descriptionJa?: string;
    descriptionVi?: string;

    backgroundId?: string;

    bgmId?: string;
};

export type MissionType =
    | 'dialogue'
    | 'quiz'
    | 'speaking'
    | 'battle';

export type Mission = {
    id: string;

    locationId: string;

    titleJa: string;
    titleVi: string;

    descriptionJa?: string;
    descriptionVi?: string;

    type: MissionType;

    startNodeId: string;

    rewardXp?: number;

    order: number;
};

export type DialogueChoice = {
    id: string;

    textJa: string;
    textVi?: string;

    nextNodeId: string;

    result?:
    | 'correct'
    | 'wrong'
    | 'neutral';

    xp?: number;
};

export type DialogueNode = {
    id: string;

    missionId: string;

    speakerId: string;

    turnType: DialogueTurnType;

    textJa?: string;
    textVi?: string;

    reading?: string;

    emotion?: CharacterEmotion;

    choices?: DialogueChoice[];

    nextNodeId?: string;

    isEnd?: boolean;

    /*
     * PLAYER TURN
     */

    expectedAnswers?: string[];

    playerPromptJa?: string;
    playerPromptVi?: string;
};