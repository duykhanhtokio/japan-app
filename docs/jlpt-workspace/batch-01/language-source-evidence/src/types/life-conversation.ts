export type LifeCity = {
    id: string;
    name: string;
    nameJa: string;
    type: string | null;
    description: string | null;
    prefectureId: string | null;
    order: number;
    unlockLevel: number;
    status: string | null;
    population: number;
    locationIds: string[];
};

export type LifeLocation = {
    id: string;
    name: string;
    nameJa: string;
    cityId: string | null;
    category: string | null;
    type: string | null;
    npcJob: string | null;
    defaultNpcId: string | null;
    description: string | null;
    order: number;
    status: string | null;
    importance: string | null;
    sceneStyle: string | null;
    backgroundAsset: string | null;
    openHours: string | null;
    address: string | null;
    scenarioIds: string[];
};

export type LifeScenario = {
    id: string;
    name: string;
    locationId: string | null;
    cityId: string | null;
    locationType: string | null;
    type: string | null;
    difficulty: string | null;
    status: string | null;
    priority: string | null;
    trigger: string | null;
    order: number;
    situation: string | null;
    learningObjective: string | null;
    playerGoal: string | null;
    npcGoal: string | null;
    branching: string | null;
    description: string | null;
    evaluationCriteria: string | null;
    requiredGrammarIds: string[];
    requiredVocabularyIds: string[];
    reward: string | null;
    outcome: string | null;
    startingExpression: string | null;
    version: number;
};

export type LifeNpcTurn = {
    textJa: string | null;
    furigana: string | null;
    translationVi: string | null;

    /** Optional meanings keyed by the language selected during registration. */
    translations?: Record<string, string>;
};

export type SemanticComponents = Record<
    string,
    string | boolean
>;

export type LifePlayerTurn = {
    communicativeIntent: string | null;

    requiredSemanticComponents:
    SemanticComponents;

    optionalSemanticComponents:
    SemanticComponents;

    recommendedAnswerJa:
    string | null;

    recommendedAnswerFurigana:
    string | null;

    acceptableExamples:
    string[];

    hint:
    string | null;

    /** Meaning of the recommended answer keyed by the selected app language. */
    translations?: Record<string, string>;

    evaluationNotes:
    string | null;

    unexpectedIntents:
    string[];

    allowMinorGrammarErrors:
    boolean;

    targetGrammarIds:
    string[];

    targetVocabularyIds:
    string[];
};

export type LifeDialogueTurn = {
    id: string;

    scenarioId: string;

    turnOrder: number;

    speaker:
    | 'NPC'
    | 'PLAYER';

    npc:
    LifeNpcTurn | null;

    player:
    LifePlayerTurn | null;

    nextDialogueId:
    string | null;

    status:
    string | null;

    qualityCheck:
    string | null;

    mappingConfidence:
    string | null;

    jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
};

export type LifeDialogueLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type LifeDialogueLevelSet = Record<LifeDialogueLevel, LifeDialogueTurn[]>;

export type LifeScenarioIndexItem = {
    scenarioId: string;

    cityId:
    string | null;

    locationId:
    string | null;

    type:
    string | null;

    difficulty:
    string | null;

    dialogueCount:
    number;

    firstDialogueId:
    string | null;
};
