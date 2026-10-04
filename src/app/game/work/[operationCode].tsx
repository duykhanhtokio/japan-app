import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import ImageBackground from '@/components/ui/FocusedImageBackground';
import {
    logWorkAnswerAiDebugStats,
} from '@/services/work-answer-ai-debug';

import {
    incrementWorkAnswerAiMetric,
} from '@/services/work-answer-ai-metrics';

import {
    evaluateWorkAnswerFallbackPolicy,
} from '@/services/work-answer-fallback-policy';

import {
    evaluateWorkAnswerWithAi,
} from '@/services/work-answer-ai-fallback';
import {
    evaluateWorkAnswerPipeline,
} from '@/services/work-answer-evaluation-pipeline';
import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Image,

    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';
import { RoyalBackButton, RoyalButton, RoyalNavyFrame, ROYAL_LAYOUT, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';

import {
    detectUnexpectedConversationIntent,
    getConversationBranchInstruction,
    getConversationBranchTranslation,
    type ConversationBranch,
} from '@/data/conversation-intent-router';

import {
    useAppLanguage,
} from '@/context/LanguageContext';

import {
    getHintsForLevel,
    getWorkDialogueInstruction,
    getWorkDialogueScenario,
    getWorkDialogueTranslation,
    getWorkScenarioTitle,
    type AnswerEvaluationResult,
    type JapaneseLevel,
} from '@/data/work-dialogues';

import {
    findTechnicalInternJobPath,
    getLocalizedOperationName,
} from '@/data/technical-intern-jobs';

import {
    useGameSpeech,
} from '@/hooks/useGameSpeech';

import {
    useUserProfile,
} from '@/hooks/useUserProfile';
import { rewardWorkMission } from '@/services/progress-storage';
import { saveWorkConversationHistory } from '@/services/work-conversation-history-storage';

/*
 * =========================================================
 * EXP
 * =========================================================
 */

const BASE_XP =
    100;

const XP_PER_HINT =
    10;

const MIN_COMPLETED_XP =
    20;

/*
 * UserProfile hiện có thể đã dùng
 * nhiều tên field khác nhau trong quá trình phát triển.
 *
 * Cast any ở đây giúp màn này không làm TypeScript
 * phụ thuộc cứng vào một tên field.
 */
function getProfileLevel(
    profile: unknown
): JapaneseLevel {
    const value =
        (
            profile as any
        )?.japaneseLevel ??
        (
            profile as any
        )?.jlptLevel ??
        (
            profile as any
        )?.level ??
        'N5';

    if (
        value === 'N1' ||
        value === 'N2' ||
        value === 'N3' ||
        value === 'N4' ||
        value === 'N5'
    ) {
        return value;
    }

    return 'N5';
}

export default function WorkConversationScreen() {
    /*
     * =====================================================
     * ROUTE
     * =====================================================
     */

    const params =
        useLocalSearchParams<{
            operationCode?: string;
        }>();

    const operationCode =
        typeof params.operationCode ===
            'string'
            ? params.operationCode
            : '';

    /*
     * =====================================================
     * LANGUAGE
     * =====================================================
     */

    const {
        language,
    } =
        useAppLanguage();

    /*
     * =====================================================
     * PROFILE
     * =====================================================
     */

    const {
        profile,
    } =
        useUserProfile();

    const japaneseLevel =
        getProfileLevel(
            profile
        );

    /*
     * =====================================================
     * DATA
     * =====================================================
     */

    const scenario =
        useMemo(
            () => {
                if (
                    !operationCode
                ) {
                    return null;
                }

                return getWorkDialogueScenario(
                    operationCode
                );
            },
            [
                operationCode,
            ]
        );

    const jobPath =
        useMemo(
            () => {
                if (
                    !operationCode
                ) {
                    return undefined;
                }

                return findTechnicalInternJobPath(
                    operationCode
                );
            },
            [
                operationCode,
            ]
        );

    /*
     * =====================================================
     * SPEECH
     * =====================================================
     */

    const {
        recognizing,
        transcript,
        finalTranscript,
        speechError,
        startListening,
        stopListening,
        resetSpeech,
        speechAvailable,
    } =
        useGameSpeech();

    /*
     * =====================================================
     * STATE
     * =====================================================
     */

    const [
        activeBranch,
        setActiveBranch,
    ] =
        useState<
            ConversationBranch |
            null
        >(null);
    const [
        aiCallsForCurrentTurn,
        setAiCallsForCurrentTurn,
    ] =
        useState(0);

    const [
        aiFallbackCache,
        setAiFallbackCache,
    ] =
        useState<
            Set<string>
        >(
            () =>
                new Set()
        );
    const [
        missionRunId,
    ] =
        useState(
            () =>
                [
                    'work',
                    operationCode ||
                    'unknown',
                    Date.now(),
                    Math.random()
                        .toString(36)
                        .slice(
                            2,
                            10
                        ),
                ].join(
                    '_'
                )
        );

    const [
        nodeIndex,
        setNodeIndex,
    ] =
        useState(0);

    const [
        playerAnswer,
        setPlayerAnswer,
    ] =
        useState('');

    const [
        speechSessionStarted,
        setSpeechSessionStarted,
    ] =
        useState(false);

    /*
     * Số hint đã mở
     * TRONG LƯỢT hiện tại.
     */

    const [
        turnHintCount,
        setTurnHintCount,
    ] =
        useState(0);

    /*
     * Tổng hint đã sử dụng
     * trong toàn bài.
     */

    const [
        totalHintsUsed,
        setTotalHintsUsed,
    ] =
        useState(0);

    /*
     * null:
     * chưa kiểm tra.
     *
     * true:
     * đạt.
     *
     * false:
     * chưa đạt.
     */

    const [
        answerResult,
        setAnswerResult,
    ] =
        useState<
            AnswerEvaluationResult |
            null
        >(null);

    /*
     * User xem đáp án.
     *
     * Khi đó toàn bài 0 EXP.
     */

    const [
        gaveUpCurrentTurn,
        setGaveUpCurrentTurn,
    ] =
        useState(false);

    const [
        missionFailed,
        setMissionFailed,
    ] =
        useState(false);

    const [
        finished,
        setFinished,
    ] =
        useState(false);
    const [
        historySaved,
        setHistorySaved,
    ] =
        useState(false);

    const [
        completedPlayerTurns,
        setCompletedPlayerTurns,
    ] =
        useState(0);

    const [
        correctCount,
        setCorrectCount,
    ] =
        useState(0);

    const [
        understandableCount,
        setUnderstandableCount,
    ] =
        useState(0);

    const [
        retryCount,
        setRetryCount,
    ] =
        useState(0);

    /*
     * =====================================================
     * CURRENT NODE
     * =====================================================
     */

    const currentNode =
        scenario?.nodes[
        nodeIndex
        ];

    const totalPlayerTurns =
        scenario?.nodes.filter(
            (
                node
            ) =>
                node.speaker ===
                'player'
        ).length ?? 0;

    /*
     * =====================================================
     * SPEECH RESULT
     *
     * Chỉ lấy result nếu:
     *
     * - đúng player turn
     * - user đã bấm mic
     * - không ở conversation branch
     * =====================================================
     */

    useEffect(() => {
        if (
            !currentNode ||
            activeBranch
        ) {
            return;
        }

        if (
            currentNode.speaker !==
            'player'
        ) {
            return;
        }

        if (
            !speechSessionStarted
        ) {
            return;
        }

        if (
            !finalTranscript
        ) {
            return;
        }

        setPlayerAnswer(
            finalTranscript
        );
    }, [
        currentNode,
        activeBranch,
        finalTranscript,
        speechSessionStarted,
    ]);

    /*
     * =====================================================
     * RESET TURN
     * =====================================================
     */

    useEffect(() => {
        resetSpeech();

        setPlayerAnswer(
            ''
        );
        setAiCallsForCurrentTurn(
            0
        );
        setSpeechSessionStarted(
            false
        );

        setTurnHintCount(
            0
        );

        setAnswerResult(
            null
        );

        setGaveUpCurrentTurn(
            false
        );

        setActiveBranch(
            null
        );
    }, [
        nodeIndex,
        resetSpeech,
    ]);

    useEffect(() => {
        if (
            !finished ||
            historySaved ||
            !scenario
        ) {
            return;
        }

        const earnedXp =
            missionFailed
                ? 0
                : Math.max(
                    MIN_COMPLETED_XP,
                    BASE_XP -
                    totalHintsUsed *
                    XP_PER_HINT
                );

        const saveHistory =
            async () => {
                try {
                    const historyId =
                        [
                            scenario.id,
                            operationCode,
                            Date.now(),
                        ].join(
                            '_'
                        );

                    await saveWorkConversationHistory({
                        id:
                            historyId,

                        operationCode,

                        scenarioId:
                            scenario.id,

                        scenarioTitleJa:
                            scenario.titleJa,

                        completedAt:
                            new Date()
                                .toISOString(),

                        playerLevel:
                            japaneseLevel,

                        completedPlayerTurns,

                        totalPlayerTurns,

                        totalHintsUsed,

                        usedAnswerReveal:
                            missionFailed,

                        earnedXp,

                        earnedCoins:
                            missionFailed
                                ? 0
                                : scenario.rewardCoins,

                        correctCount,

                        understandableCount,

                        retryCount,
                    });

                    await rewardWorkMission({
                        missionRunId,

                        xp:
                            earnedXp,

                        coins:
                            missionFailed
                                ? 0
                                : scenario
                                    .rewardCoins,

                        completedSuccessfully:
                            !missionFailed,

                        correctCount,

                        understandableCount,

                        retryCount,

                        totalPlayerTurns,
                    });


                    setHistorySaved(
                        true
                    );
                } catch (error) {
                    console.log(
                        'Save mission history error:',
                        error
                    );
                }
            };

        void saveHistory();
    }, [
        finished,
        historySaved,
        scenario,
        operationCode,
        japaneseLevel,
        completedPlayerTurns,
        totalHintsUsed,
        missionFailed,
        missionRunId,
        correctCount,
        understandableCount,
        retryCount,
        totalPlayerTurns,
    ]);
    /*
     * =====================================================
     * ERROR GUARD
     * =====================================================
     */

    if (
        !operationCode ||
        !scenario ||
        !currentNode
    ) {
        return (
            <RoyalPageBackground source={require('../../../../assets/app/backgrounds/profile-details.png')}><SafeAreaView
                style={
                    styles.errorContainer
                }
            >
                <Text
                    style={
                        styles.errorTitle
                    }
                >
                    会話データがありません
                </Text>

                <Text
                    style={
                        styles.errorText
                    }
                >
                    Work dialogue data has not been created for this job yet.
                </Text>

                <RoyalBackButton onPress={() => router.back()} />
            </SafeAreaView></RoyalPageBackground>
        );
    }

    /*
     * =====================================================
     * NON NULL
     * =====================================================
     */

    const activeScenario =
        scenario;

    const activeNode =
        currentNode;

    /*
     * =====================================================
     * DERIVED
     * =====================================================
     */

    const isPlayerTurn =
        activeNode.speaker ===
        'player';

    const branchTranslation =
        activeBranch
            ? getConversationBranchTranslation(
                activeBranch,
                language
            )
            : '';

    const branchInstruction =
        activeBranch
            ? getConversationBranchInstruction(
                activeBranch,
                language
            )
            : '';

    const translation =
        getWorkDialogueTranslation(
            activeNode,
            language
        );

    const instruction =
        getWorkDialogueInstruction(
            activeNode,
            language
        );

    const availableHints =
        isPlayerTurn
            ? getHintsForLevel(
                activeNode,
                japaneseLevel
            )
            : [];

    const visibleHints =
        availableHints.slice(
            0,
            turnHintCount
        );

    const canUseMoreHints =
        isPlayerTurn &&
        turnHintCount <
        availableHints.length &&
        !gaveUpCurrentTurn &&
        answerResult !==
        'correct' &&
        answerResult !==
        'understandable';

    const title =
        getWorkScenarioTitle(
            activeScenario,
            language
        );

    const operationLocalized =
        jobPath
            ? getLocalizedOperationName(
                jobPath.operation,
                language
            )
            : '';

    /*
     * EXP luôn hiển thị realtime.
     */

    const potentialXp =
        missionFailed
            ? 0
            : Math.max(
                MIN_COMPLETED_XP,
                BASE_XP -
                totalHintsUsed *
                XP_PER_HINT
            );

    const finalXp =
        missionFailed
            ? 0
            : potentialXp;

    /*
     * =====================================================
     * NEXT
     * =====================================================
     */

    function goNext() {
        const lastIndex =
            activeScenario
                .nodes
                .length -
            1;

        resetSpeech();

        setSpeechSessionStarted(
            false
        );

        if (
            nodeIndex >=
            lastIndex
        ) {
            setFinished(
                true
            );

            return;
        }

        setNodeIndex(
            (
                current
            ) =>
                current +
                1
        );
    }

    /*
     * =====================================================
     * NPC
     * =====================================================
     */

    function handleNpcNext() {
        goNext();
    }

    /*
     * =====================================================
     * HINT
     * =====================================================
     */

    function handleHint() {
        if (
            !canUseMoreHints
        ) {
            return;
        }

        setTurnHintCount(
            (
                current
            ) =>
                current +
                1
        );

        setTotalHintsUsed(
            (
                current
            ) =>
                current +
                1
        );
    }

    /*
     * =====================================================
     * MIC
     * =====================================================
     */

    async function handleMic() {
        if (
            gaveUpCurrentTurn
        ) {
            return;
        }

        if (
            !speechAvailable
        ) {
            resetSpeech();

            return;
        }

        if (
            recognizing
        ) {
            stopListening();

            return;
        }

        resetSpeech();

        setPlayerAnswer(
            ''
        );

        setAnswerResult(
            null
        );

        const started =
            await startListening();

        setSpeechSessionStarted(
            started
        );
    }
    /*
     * =====================================================
     * CHECK ANSWER
     * =====================================================
     */

    async function checkPlayerAnswer() {
        const answer =
            (
                playerAnswer ||
                transcript
            ).trim();

        if (!answer) {
            return;
        }

        if (
            recognizing
        ) {
            stopListening();
        }

        /*
         * =====================================================
         * 1. UNEXPECTED INTENT
         *
         * Luôn chạy TRƯỚC mission evaluator.
         * =====================================================
         */

        const branch =
            detectUnexpectedConversationIntent(
                answer
            );

        if (branch) {
            setActiveBranch(
                branch
            );

            setAnswerResult(
                null
            );

            setSpeechSessionStarted(
                false
            );

            resetSpeech();

            return;
        }

        /*
         * =====================================================
         * 2. LOCAL-FIRST EVALUATION PIPELINE
         *
         * Level 1:
         * - exact / semantic fast-pass
         *
         * Level 2:
         * - work-specific concept / pattern rules
         *
         * Level 3:
         * - ai_fallback chỉ khi local rules không chắc
         * =====================================================
         */

        const pipelineResult =
            evaluateWorkAnswerPipeline(
                activeNode,
                answer
            );

        if (
            pipelineResult.status ===
            'correct'
        ) {
            const result:
                AnswerEvaluationResult =
                'correct';

            setAnswerResult(
                result
            );

            setCompletedPlayerTurns(
                current =>
                    current + 1
            );

            setCorrectCount(
                current =>
                    current + 1
            );
            logWorkAnswerAiDebugStats();

            return;
        }

        if (
            pipelineResult.status ===
            'understandable'
        ) {
            const result:
                AnswerEvaluationResult =
                'understandable';

            setAnswerResult(
                result
            );

            setCompletedPlayerTurns(
                current =>
                    current + 1
            );

            setUnderstandableCount(
                current =>
                    current + 1
            );
            logWorkAnswerAiDebugStats();


            return;
        }

        if (
            pipelineResult.status ===
            'incorrect'
        ) {
            const result:
                AnswerEvaluationResult =
                'incorrect';

            setAnswerResult(
                result
            );
            logWorkAnswerAiDebugStats();


            return;
        }

        /*
 * =====================================================
 * 3. AI FALLBACK
 *
 * Chỉ chạy khi local pipeline trả về:
 * ai_fallback
 *
 * Trước khi gọi AI:
 * - kiểm tra policy
 * - giới hạn số lần gọi mỗi turn
 * - kiểm tra cache
 *
 * Hiện AI service vẫn là placeholder,
 * nên actualAiCalls vẫn bằng 0.
 * =====================================================
 */
        const fallbackPolicy =
            evaluateWorkAnswerFallbackPolicy({
                answer,

                turnId:
                    activeNode.id,

                aiCallsForTurn:
                    aiCallsForCurrentTurn,

                cachedAnswers:
                    aiFallbackCache,

                maxAiCallsPerTurn:
                    1,

                minJapaneseLength:
                    4,
            });
        if (
            !fallbackPolicy.allowAi
        ) {
            incrementWorkAnswerAiMetric(
                'aiFallbackBlocked'
            );

            setAnswerResult(
                'incorrect'
            );

            logWorkAnswerAiDebugStats();

            return;
        }

        setAiCallsForCurrentTurn(
            current =>
                current + 1
        );

        setAiFallbackCache(
            current => {
                const next =
                    new Set(
                        current
                    );

                next.add(
                    fallbackPolicy
                        .cacheKey
                );

                return next;
            }
        );
        const aiResult =
            await evaluateWorkAnswerWithAi({
                node:
                    activeNode,

                answer,
            });

        const fallbackResult:
            AnswerEvaluationResult =
            aiResult.status;

        setAnswerResult(
            fallbackResult
        );
        logWorkAnswerAiDebugStats();

        if (
            fallbackResult ===
            'correct' ||
            fallbackResult ===
            'understandable'
        ) {
            setCompletedPlayerTurns(
                current =>
                    current + 1
            );

            if (
                fallbackResult ===
                'correct'
            ) {
                setCorrectCount(
                    current =>
                        current + 1
                );
            } else {
                setUnderstandableCount(
                    current =>
                        current + 1
                );
            }
        }
    }
    /*
     * =====================================================
     * RETRY
     * =====================================================
     */

    async function retryAnswer() {
        if (
            !speechAvailable
        ) {
            resetSpeech();

            return;
        }

        setRetryCount(
            (current) =>
                current + 1
        );

        resetSpeech();

        setPlayerAnswer(
            ''
        );

        setAnswerResult(
            null
        );

        const started =
            await startListening();

        setSpeechSessionStarted(
            started
        );
    }

    /*
     * =====================================================
     * GIVE UP / SHOW ANSWER
     *
     * Đây là trường hợp:
     * "đã gợi ý nhưng vẫn không làm được".
     *
     * Bài vẫn tiếp tục,
     * nhưng EXP cuối = 0.
     * =====================================================
     */

    function revealAnswer() {
        if (
            !isPlayerTurn
        ) {
            return;
        }

        if (
            recognizing
        ) {
            stopListening();
        }

        resetSpeech();

        setSpeechSessionStarted(
            false
        );

        setMissionFailed(
            true
        );

        setGaveUpCurrentTurn(
            true
        );

        setAnswerResult(
            'incorrect'
        );

        setPlayerAnswer(
            activeNode
                .recommendedAnswerJa ??
            activeNode.textJa
        );
    }
    /*
     * =====================================================
     * RESULT
     * =====================================================
     */

    if (
        finished
    ) {
        return (
            <RoyalPageBackground source={require('../../../../assets/app/backgrounds/profile-details.png')}><SafeAreaView
                style={
                    styles.resultContainer
                }
            >
                <ScrollView style={{width:'100%'}} contentContainerStyle={{flexGrow:1,alignItems:'center',justifyContent:'center',paddingVertical:12}}>
                <RoyalPaperPanel tone="hud" style={styles.resultCard}>
                    <Image
                        source={missionFailed
                            ? require('../../../../assets/app/ui/royal-af/learning-grammar-v1.png')
                            : require('../../../../assets/app/ui/royal-af/mission-trophy-v1.png')}
                        resizeMode="contain"
                        style={styles.resultIcon}
                    />

                    <Text
                        style={
                            styles.resultTitle
                        }
                    >
                        ミッション完了
                    </Text>

                    <Text
                        style={
                            styles.resultLocalized
                        }
                    >
                        {title}
                    </Text>

                    {language !==
                        'ja' && (
                            <Text
                                style={
                                    styles.resultJapanese
                                }
                            >
                                {
                                    activeScenario.titleJa
                                }
                            </Text>
                        )}

                    <View
                        style={
                            styles.resultStatCard
                        }
                    >
                        <View style={styles.resultStatRow}>
                            <Text style={styles.resultStatLabel}>
                                完了した会話
                            </Text>
                            <Text style={styles.resultStatValue}>
                                {completedPlayerTurns}/{totalPlayerTurns}
                            </Text>
                        </View>

                        <View style={styles.resultStatRow}>
                            <Text style={styles.resultStatLabel}>
                                自然に伝わった
                            </Text>
                            <Text style={styles.resultStatValue}>
                                {correctCount}
                            </Text>
                        </View>

                        <View style={styles.resultStatRow}>
                            <Text style={styles.resultStatLabel}>
                                意味は通じた
                            </Text>
                            <Text style={styles.resultStatValue}>
                                {understandableCount}
                            </Text>
                        </View>

                        <View style={styles.resultStatRow}>
                            <Text style={styles.resultStatLabel}>
                                やり直した
                            </Text>
                            <Text style={styles.resultStatValue}>
                                {retryCount}
                            </Text>
                        </View>

                        <View style={styles.resultStatRow}>
                            <Text style={styles.resultStatLabel}>
                                使用したヒント
                            </Text>
                            <Text style={styles.resultStatValue}>
                                {totalHintsUsed}
                            </Text>
                        </View>

                        <View style={styles.resultStatRow}>
                            <Text style={styles.resultStatLabel}>
                                EXP
                            </Text>
                            <Text style={styles.resultXp}>
                                +{finalXp}
                            </Text>
                        </View>
                    </View>

                    {missionFailed ? (
                        <Text
                            style={
                                styles.failedMessage
                            }
                        >
                            答えを確認したため、このミッションのEXPは0です。
                        </Text>
                    ) : (
                        <Text
                            style={
                                styles.successMessage
                            }
                        >
                            完璧です！
                        </Text>
                    )}

                    <Text
                        style={
                            styles.coinReward
                        }
                    >
                        +
                        {
                            missionFailed
                                ? 0
                                : activeScenario.rewardCoins
                        }{' '}
                        <Image source={require('../../../../assets/app/ui/royal-af/hud-coin-v1.png')} style={{width:20,height:20}} resizeMode="contain"/>
                    </Text>

                    <RoyalButton
                        style={
                            styles.finishButton
                        }
                        onPress={() => {
                            router.replace(
                                '/tasks'
                            );
                        }}
                    >
                        <Text
                            style={
                                styles.finishButtonText
                            }
                        >
                            ミッションへ戻る
                        </Text>
                    </RoyalButton>
                </RoyalPaperPanel>
                </ScrollView>
            </SafeAreaView></RoyalPageBackground>
        );
    }
    /*
     * =====================================================
     * UI
     * =====================================================
     */

    return (
        <ImageBackground source={operationCode?.startsWith('1-')?require('../../../../assets/game/farm/background/vegetable_map_background_v2.png'):require('../../../../assets/app/life/location-backgrounds/construction-site/01-clear-morning.jpg')} resizeMode="cover" style={{flex:1}}><SafeAreaView
            style={[styles.container,{backgroundColor:'transparent'}]}
            edges={[
                'top',
                'bottom',
            ]}
        >
            {/* HEADER */}

            <View
                style={
                    styles.header
                }
            >
                <RoyalBackButton onPress={() => router.back()} />

                <RoyalPaperPanel tone="hud" style={styles.headerContent}>
                    <Text
                        style={
                            styles.job
                        }
                        numberOfLines={
                            1
                        }
                    >
                        {
                            operationLocalized
                        }
                    </Text>

                    {language !==
                        'ja' &&
                        jobPath && (
                            <Text
                                style={
                                    styles.jobJapanese
                                }
                            >
                                {
                                    jobPath
                                        .operation
                                        .nameJa
                                }
                            </Text>
                        )}
                </RoyalPaperPanel>

                <RoyalPaperPanel tone="hud" style={styles.expBadge}>
                    <Text
                        style={
                            styles.expBadgeLabel
                        }
                    >
                        EXP
                    </Text>

                    <Text
                        style={
                            styles.expBadgeValue
                        }
                    >
                        {
                            potentialXp
                        }
                    </Text>
                </RoyalPaperPanel>
            </View>

            <ScrollView style={{flex:1}} contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false}>
            {/* MISSION */}

            <RoyalPaperPanel style={styles.missionHeader}>
                <Text
                    style={
                        styles.missionLabel
                    }
                >
                    WORK MISSION
                </Text>

                <Text
                    style={
                        styles.missionTitle
                    }
                >
                    {title}
                </Text>

                {language !==
                    'ja' && (
                        <Text
                            style={
                                styles.missionJapanese
                            }
                        >
                            {
                                activeScenario.titleJa
                            }
                        </Text>
                    )}

                <View
                    style={
                        styles.levelRow
                    }
                >
                    <Text
                        style={
                            styles.levelBadge
                        }
                    >
                        {
                            japaneseLevel
                        }
                    </Text>

                    <Text
                        style={
                            styles.nodeProgress
                        }
                    >
                        {
                            nodeIndex +
                            1
                        }
                        /
                        {
                            activeScenario
                                .nodes
                                .length
                        }
                    </Text>
                </View>
            </RoyalPaperPanel>

            {/* CHARACTER */}

            <View
                style={
                    styles.characterArea
                }
            >
                <Image source={operationCode?.startsWith('1-')?require('../../../../assets/app/ui/royal-af/work-farm-supervisor-v1.png'):require('../../../../assets/app/life/npcs/construction-site.png')} resizeMode="contain" style={styles.characterSprite}/>
                <Text
                    style={
                        styles.npcName
                    }
                >
                    {
                        activeScenario
                            .npcNameJa
                    }
                </Text>
            </View>

            {/* DIALOGUE AREA */}

            <View
                style={
                    styles.dialogueArea
                }
            >
                <RoyalPaperPanel style={styles.dialogueBox}>
                    <View
                        style={
                            styles.speakerRow
                        }
                    >
                        <Text
                            style={
                                styles.speaker
                            }
                        >
                            {activeBranch
                                ? activeScenario.npcNameJa
                                : isPlayerTurn
                                    ? 'あなた'
                                    : activeScenario.npcNameJa}
                        </Text>

                        <Text
                            style={[
                                styles.turnType,

                                isPlayerTurn &&
                                !activeBranch &&
                                styles.turnTypeSpeak,
                            ]}
                        >
                            {activeBranch
                                ? 'LISTEN'
                                : isPlayerTurn
                                    ? 'SPEAK'
                                    : 'LISTEN'}
                        </Text>
                    </View>

                    <ScrollView
                        style={
                            styles.dialogueScroll
                        }
                        contentContainerStyle={
                            styles.dialogueContent
                        }
                        showsVerticalScrollIndicator={
                            false
                        }
                    >
                        {/* BRANCH */}
                        {activeBranch && (
                            <>
                                <View
                                    style={
                                        styles.branchBox
                                    }
                                >
                                    <Text
                                        style={
                                            styles.branchLabel
                                        }
                                    >
                                        CONVERSATION BRANCH
                                    </Text>

                                    {activeBranch
                                        .npcResponseReadingJa ? (
                                        <Text
                                            style={
                                                styles.branchReading
                                            }
                                        >
                                            {
                                                activeBranch
                                                    .npcResponseReadingJa
                                            }
                                        </Text>
                                    ) : null}

                                    <Text
                                        style={
                                            styles.branchJapanese
                                        }
                                    >
                                        {
                                            activeBranch
                                                .npcResponseJa
                                        }
                                    </Text>

                                    {branchTranslation ? (
                                        <Text
                                            style={
                                                styles.branchTranslation
                                            }
                                        >
                                            {
                                                branchTranslation
                                            }
                                        </Text>
                                    ) : null}
                                </View>

                                {branchInstruction ? (
                                    <View
                                        style={
                                            styles.branchGoalBox
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.branchGoalIcon
                                            }
                                        >
                                            🎯
                                        </Text>

                                        <Text
                                            style={
                                                styles.branchGoalText
                                            }
                                        >
                                            {
                                                branchInstruction
                                            }
                                        </Text>
                                    </View>
                                ) : null}
                            </>
                        )}
                        {/* NORMAL NPC */}

                        {!activeBranch &&
                            !isPlayerTurn && (
                                <>
                                    {activeNode.readingJa ? (
                                        <Text
                                            style={
                                                styles.dialogueReading
                                            }
                                        >
                                            {
                                                activeNode.readingJa
                                            }
                                        </Text>
                                    ) : null}

                                    <Text
                                        style={
                                            styles.dialogueJapanese
                                        }
                                    >
                                        {
                                            activeNode.textJa
                                        }
                                    </Text>

                                    {translation ? (
                                        <Text
                                            style={
                                                styles.translation
                                            }
                                        >
                                            {
                                                translation
                                            }
                                        </Text>
                                    ) : null}
                                </>
                            )}
                        {/* NORMAL PLAYER */}

                        {!activeBranch &&
                            !speechAvailable && (
                                <View
                                    style={
                                        styles.speechUnavailableBox
                                    }
                                >
                                    <Text
                                        style={
                                            styles.speechUnavailableText
                                        }
                                    >
                                        音声認識を利用するには
                                        音声認識対応ビルドが必要です。
                                    </Text>
                                </View>
                            )}
                        {!activeBranch &&
                            isPlayerTurn && (
                                <>
                                    {!gaveUpCurrentTurn &&
                                        answerResult !==
                                        'correct' &&
                                        answerResult !==
                                        'understandable' && (
                                            <>
                                                <View
                                                    style={
                                                        styles.goalBox
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.goalLabel
                                                        }
                                                    >
                                                        🎯
                                                    </Text>

                                                    <Text
                                                        style={
                                                            styles.goalText
                                                        }
                                                    >
                                                        {
                                                            instruction
                                                        }
                                                    </Text>
                                                </View>

                                                {visibleHints.length >
                                                    0 && (
                                                        <View
                                                            style={
                                                                styles.hintsBox
                                                            }
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.hintTitle
                                                                }
                                                            >
                                                                ヒント
                                                            </Text>

                                                            {visibleHints.map(
                                                                (
                                                                    hint,
                                                                    index
                                                                ) => (
                                                                    <View
                                                                        key={`${hint}-${index}`}
                                                                        style={
                                                                            styles.hintChip
                                                                        }
                                                                    >
                                                                        <Text
                                                                            style={
                                                                                styles.hintText
                                                                            }
                                                                        >
                                                                            {
                                                                                hint
                                                                            }
                                                                        </Text>
                                                                    </View>
                                                                )
                                                            )}
                                                        </View>
                                                    )}
                                            </>
                                        )}

                                    {(playerAnswer ||
                                        transcript) && (
                                            <Text
                                                style={
                                                    styles.dialogueJapanese
                                                }
                                            >
                                                {
                                                    playerAnswer ||
                                                    transcript
                                                }
                                            </Text>
                                        )}

                                    {answerResult ===
                                        'correct' && (
                                            <View
                                                style={
                                                    styles.correctBox
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.correctText
                                                    }
                                                >
                                                    ✅ 通じました！
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.correctSubtext
                                                    }
                                                >
                                                    自然に伝わっています。
                                                </Text>
                                            </View>
                                        )}

                                    {answerResult ===
                                        'understandable' && (
                                            <View
                                                style={
                                                    styles.understandableBox
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.understandableText
                                                    }
                                                >
                                                    🟡 意味は通じます
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.understandableSubtext
                                                    }
                                                >
                                                    少し不自然ですが、相手には意味が伝わります。
                                                </Text>

                                                {activeNode
                                                    .recommendedAnswerJa && (
                                                        <View
                                                            style={
                                                                styles.naturalAnswerBox
                                                            }
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.naturalAnswerLabel
                                                                }
                                                            >
                                                                より自然な言い方
                                                            </Text>

                                                            <Text
                                                                style={
                                                                    styles.naturalAnswerText
                                                                }
                                                            >
                                                                {
                                                                    activeNode
                                                                        .recommendedAnswerJa
                                                                }
                                                            </Text>
                                                        </View>
                                                    )}
                                            </View>
                                        )}

                                    {answerResult ===
                                        'incorrect' &&
                                        !gaveUpCurrentTurn && (
                                            <View
                                                style={
                                                    styles.wrongBox
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.wrongText
                                                    }
                                                >
                                                    🔄 意図が十分に伝わっていません
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.wrongSubtext
                                                    }
                                                >
                                                    もう一度、伝えたい内容を考えて話してみましょう。
                                                </Text>
                                            </View>
                                        )}

                                    {gaveUpCurrentTurn && (
                                        <View
                                            style={
                                                styles.answerBox
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.answerLabel
                                                }
                                            >
                                                例文
                                            </Text>

                                            <Text
                                                style={
                                                    styles.answerText
                                                }
                                            >
                                                {
                                                    activeNode
                                                        .recommendedAnswerJa ??
                                                    activeNode.textJa
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.zeroXpText
                                                }
                                            >
                                                EXP
                                                0
                                            </Text>
                                        </View>
                                    )}

                                    {speechError ? (
                                        <Text
                                            style={
                                                styles.speechError
                                            }
                                        >
                                            {
                                                speechError
                                            }
                                        </Text>
                                    ) : null}
                                </>
                            )}
                    </ScrollView>
                </RoyalPaperPanel>

                {/* BRANCH CONTROLS */}

                {activeBranch && (
                    <View
                        style={
                            styles.branchControls
                        }
                    >
                        <RoyalButton
                            style={
                                styles.branchResumeButton
                            }
                            onPress={() => {
                                setActiveBranch(
                                    null
                                );

                                setPlayerAnswer(
                                    ''
                                );

                                setAnswerResult(
                                    null
                                );

                                setSpeechSessionStarted(
                                    false
                                );

                                resetSpeech();
                            }}
                        >
                            <Text
                                style={
                                    styles.branchResumeText
                                }
                            >
                                ミッションに戻る
                            </Text>
                        </RoyalButton>
                    </View>
                )}

                {/* NPC CONTROLS */}

                {!activeBranch &&
                    !isPlayerTurn && (
                        <RoyalButton
                            style={
                                styles.nextButton
                            }
                            onPress={
                                handleNpcNext
                            }
                        >
                            <Text
                                style={
                                    styles.nextButtonText
                                }
                            >
                                次へ →
                            </Text>
                        </RoyalButton>
                    )}

                {/* PLAYER CONTROLS */}

                {!activeBranch &&
                    isPlayerTurn &&
                    !gaveUpCurrentTurn &&
                    answerResult !==
                    'correct' &&
                    answerResult !==
                    'understandable' && (
                        <View
                            style={
                                styles.playerControls
                            }
                        >
                            {canUseMoreHints && (
                                <Pressable
                                    style={
                                        styles.hintButton
                                    }
                                    onPress={
                                        handleHint
                                    }
                                >
                                    <Image source={require('../../../../assets/app/ui/royal-af/hint-gold-grape-v1.png')} resizeMode="contain" style={{width:28,height:32}}/>
                                    <Text
                                        style={
                                            styles.hintButtonText
                                        }
                                    >
                                        ヒント
                                    </Text>

                                    <Text
                                        style={
                                            styles.hintPenalty
                                        }
                                    >
                                        -10 EXP
                                    </Text>
                                </Pressable>
                            )}

                            <Pressable
                                style={[
                                    styles.micButton,

                                    recognizing &&
                                    styles.micRecording,
                                ]}
                                onPress={
                                    answerResult ===
                                        'incorrect'
                                        ? retryAnswer
                                        : handleMic
                                }
                            >
                                <Image source={require('../../../../assets/app/ui/royal-af/microphone-v2.png')} resizeMode="contain" style={{width:38,height:38}}/>
                            </Pressable>

                            {(playerAnswer ||
                                transcript) &&
                                answerResult ===
                                null && (
                                    <RoyalButton
                                        style={
                                            styles.checkButton
                                        }
                                        onPress={
                                            checkPlayerAnswer
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.checkButtonText
                                            }
                                        >
                                            確認
                                        </Text>
                                    </RoyalButton>
                                )}
                        </View>
                    )}

                {/* WRONG / GIVE UP */}

                {!activeBranch &&
                    isPlayerTurn &&
                    answerResult ===
                    'incorrect' &&
                    !gaveUpCurrentTurn && (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="答えを見る"
                            style={
                                styles.giveUpButton
                            }
                            onPress={
                                revealAnswer
                            }
                        >
                            <Image source={require('../../../../assets/app/ui/royal-af/hint-red-lantern-v2.png')} resizeMode="contain" style={{width:38,height:48}}/>
                            <Text
                                style={
                                    styles.giveUpText
                                }
                            >
                                答えを見る
                            </Text>
                        </Pressable>
                    )}

                {/* CORRECT / UNDERSTANDABLE */}

                {!activeBranch &&
                    isPlayerTurn &&
                    (
                        answerResult ===
                        'correct' ||
                        answerResult ===
                        'understandable'
                    ) && (
                        <RoyalButton
                            style={
                                styles.nextButton
                            }
                            onPress={
                                goNext
                            }
                        >
                            <Text
                                style={
                                    styles.nextButtonText
                                }
                            >
                                次へ →
                            </Text>
                        </RoyalButton>
                    )}

                {/* GAVE UP */}

                {!activeBranch &&
                    isPlayerTurn &&
                    gaveUpCurrentTurn && (
                        <RoyalButton
                            style={
                                styles.nextButton
                            }
                            onPress={
                                goNext
                            }
                        >
                            <Text
                                style={
                                    styles.nextButtonText
                                }
                            >
                                次へ →
                            </Text>
                        </RoyalButton>
                    )}

            </View>
            </ScrollView>
        </SafeAreaView></ImageBackground>
    );
}

const styles =
    StyleSheet.create({
        container: {flex:1,backgroundColor:'transparent'},
        correctSubtext: {
            color:
                '#14764a',

            fontSize:
                9,

            textAlign:
                'center',

            marginTop:
                4,
        },

        understandableBox: {
            marginTop:
                15,

            padding:
                10,

            borderRadius:
                10,

            backgroundColor:
                '#fff4cc',
        },

        understandableText: {
            color:
                '#8a6500',

            fontSize:
                12,

            fontWeight:
                '900',

            textAlign:
                'center',
        },

        understandableSubtext: {
            color:
                '#8a6500',

            fontSize:
                9,

            lineHeight:
                14,

            textAlign:
                'center',

            marginTop:
                4,
        },

        naturalAnswerBox: {
            marginTop:
                10,

            paddingHorizontal:
                10,

            paddingVertical:
                8,

            borderRadius:
                8,

            backgroundColor:
                'rgba(255,255,255,0.65)',
        },

        naturalAnswerLabel: {
            color:
                '#8a6500',

            fontSize:
                8,

            fontWeight:
                '800',

            textAlign:
                'center',
        },

        naturalAnswerText: {
            color:
                '#342a0b',

            fontSize:
                13,

            fontWeight:
                '800',

            textAlign:
                'center',

            marginTop:
                4,
        },

        wrongSubtext: {
            color:
                '#b22929',

            fontSize:
                9,

            lineHeight:
                14,

            textAlign:
                'center',

            marginTop:
                4,
        },

        header: {minHeight:64,flexDirection:'row',alignItems:'center',paddingHorizontal:ROYAL_LAYOUT.screenGutter,paddingTop:ROYAL_LAYOUT.backSafeTop,paddingBottom:8},

        backButton: {
            width: 40,

            height: 40,

            borderRadius:
                20,

            alignItems:
                'center',

            justifyContent:
                'center',

            backgroundColor:
                '#202a40',
        },

        backText: {
            color:
                '#ffffff',

            fontSize: 24,
        },

        headerContent: {flex:1,minWidth:0,marginHorizontal:8,paddingHorizontal:16,paddingVertical:16,minHeight:70},

        job: {
            color:
                '#ffffff',

            fontSize: 15,

            fontWeight:
                '900',
        },

        jobJapanese: {
            color:
                '#8490a2',

            fontSize: 15,

            marginTop: 2,
        },

        expBadge: {width:80,minHeight:70,paddingHorizontal:12,paddingVertical:16,alignItems:'center'},

        expBadgeLabel: {
            color:
                '#8d98aa',

            fontSize: 15,

            fontWeight:
                '800',
        },

        expBadgeValue: {
            color:
                '#ffd75e',

            fontSize: 16,

            fontWeight:
                '900',

            marginTop: 1,
        },

        missionHeader: {marginHorizontal:ROYAL_LAYOUT.screenGutter,marginTop:8,paddingHorizontal:28,paddingVertical:24},

        missionLabel: {color:'#77531b',fontFamily:ROYAL_FONT.heading,fontSize:14,letterSpacing:1},

        missionTitle: {color:ROYAL.lacquer,fontFamily:ROYAL_FONT.heading,fontSize:18,lineHeight:25,marginTop:4},

        missionJapanese: {color:ROYAL.lacquerLight,fontFamily:ROYAL_FONT.body,fontSize:15,lineHeight:22,marginTop:4},

        levelRow: {
            flexDirection:
                'row',

            alignItems:
                'center',

            marginTop: 8,

            gap: 8,
        },

        levelBadge: {color:ROYAL.lacquer,fontFamily:ROYAL_FONT.heading,fontSize:14},

        nodeProgress: {
            color:
                '#8995a6',

            fontSize: 15,

            fontWeight:
                '800',
        },

        characterArea: {flex:1,minHeight:180,alignItems:'center',justifyContent:'center',paddingVertical:8},

        characterSprite:{width:'100%',height:190},
        characterCircle: {
            width: 140,

            height: 140,

            borderRadius:
                70,

            alignItems:
                'center',

            justifyContent:
                'center',

            backgroundColor:
                '#202a40',

            borderWidth: 3,

            borderColor:
                '#38445d',
        },

        characterEmoji: {
            fontSize: 74,
        },

        npcName: {color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:15,textShadowColor:ROYAL.lacquer,textShadowOffset:{width:0,height:1},textShadowRadius:4},

        dialogueArea: {paddingHorizontal:ROYAL_LAYOUT.screenGutter,paddingBottom:12},

        dialogueBox: {height:250,paddingHorizontal:30,paddingVertical:28},

        speakerRow: {
            flexDirection:
                'row',

            justifyContent:
                'space-between',

            alignItems:
                'center',
        },

        speaker: {
            color:
                '#1c2533',

            fontSize: 16,

            fontWeight:
                '900',
        },

        turnType: {
            color:
                '#687386',

            fontSize: 15,

            fontWeight:
                '900',
        },

        turnTypeSpeak: {
            color:
                '#ef3340',
        },

        dialogueScroll: {
            flex: 1,

            marginTop: 8,
        },

        dialogueContent: {
            flexGrow: 1,

            justifyContent:
                'center',
        },
        dialogueReading: {
            color:
                '#667085',

            fontSize:
                11,

            lineHeight:
                16,

            fontWeight:
                '700',

            textAlign:
                'center',

            marginBottom:
                4,
        },

        dialogueJapanese: {
            color:
                '#111827',

            fontSize: 18,

            lineHeight: 27,

            fontWeight:
                '800',

            textAlign:
                'center',
        },

        translation: {
            color:
                '#667085',

            fontSize: 16,

            lineHeight: 16,

            textAlign:
                'center',

            marginTop: 9,
        },

        goalBox: {
            alignItems:
                'center',

            paddingHorizontal:
                6,
        },

        goalLabel: {
            fontSize: 24,
        },

        goalText: {
            color:
                '#283141',

            fontSize: 16,

            lineHeight: 21,

            fontWeight:
                '800',

            textAlign:
                'center',

            marginTop: 7,
        },

        hintsBox: {
            marginTop: 15,

            alignItems:
                'center',
        },

        hintTitle: {
            color:
                '#9a7110',

            fontSize: 16,

            fontWeight:
                '900',

            marginBottom: 7,
        },

        hintChip: {
            backgroundColor:
                '#fff3c7',

            borderRadius:
                9,

            paddingHorizontal:
                11,

            paddingVertical:
                5,

            marginBottom: 5,
        },

        hintText: {
            color:
                '#4a3a0f',

            fontSize: 15,

            fontWeight:
                '800',
        },

        branchBox: {
            paddingHorizontal:
                14,

            paddingVertical:
                12,

            borderRadius:
                14,

            backgroundColor:
                '#fff3d6',

            alignItems:
                'center',
        },

        branchLabel: {
            color:
                '#a36a00',

            fontSize:
                8,

            fontWeight:
                '900',

            letterSpacing:
                0.8,
        },

        branchReading: {
            color:
                '#8a6a25',

            fontSize:
                10,

            lineHeight:
                15,

            fontWeight:
                '700',

            textAlign:
                'center',

            marginTop:
                7,

            marginBottom:
                2,
        },

        branchJapanese: {
            color:
                '#1c2533',

            fontSize:
                17,

            lineHeight:
                26,

            fontWeight:
                '900',

            textAlign:
                'center',

            marginTop:
                7,
        },

        branchTranslation: {
            color:
                '#667085',

            fontSize:
                10,

            lineHeight:
                16,

            textAlign:
                'center',

            marginTop:
                7,
        },

        branchGoalBox: {
            alignItems:
                'center',

            marginTop:
                13,
        },

        branchGoalIcon: {
            fontSize:
                20,
        },

        branchGoalText: {
            color:
                '#283141',

            fontSize:
                13,

            lineHeight:
                20,

            fontWeight:
                '800',

            textAlign:
                'center',

            marginTop:
                5,
        },

        branchControls: {
            marginTop:
                10,
        },

        branchResumeButton: {
            height:
                48,

            borderRadius:
                24,

            backgroundColor:
                '#d88918',

            alignItems:
                'center',

            justifyContent:
                'center',
        },

        branchResumeText: {
            color:
                '#ffffff',

            fontSize:
                12,

            fontWeight:
                '900',
        },

        correctBox: {
            marginTop: 15,

            padding: 9,

            borderRadius:
                10,

            backgroundColor:
                '#dcf7e8',
        },

        correctText: {
            color:
                '#14764a',

            fontSize: 15,

            fontWeight:
                '900',

            textAlign:
                'center',
        },

        wrongBox: {
            marginTop: 15,

            padding: 9,

            borderRadius:
                10,

            backgroundColor:
                '#ffe7e7',
        },

        wrongText: {
            color:
                '#b22929',

            fontSize: 16,

            fontWeight:
                '800',

            textAlign:
                'center',
        },

        answerBox: {
            alignItems:
                'center',
        },

        answerLabel: {
            color:
                '#7b8494',

            fontSize: 16,

            fontWeight:
                '800',
        },

        answerText: {
            color:
                '#111827',

            fontSize: 18,

            fontWeight:
                '900',

            textAlign:
                'center',

            lineHeight: 27,

            marginTop: 8,
        },

        zeroXpText: {
            color:
                '#d73535',

            fontSize: 16,

            fontWeight:
                '900',

            marginTop: 10,
        },

        speechError: {
            color:
                '#d73535',

            fontSize: 16,

            textAlign:
                'center',

            marginTop: 10,
        },

        playerControls: {
            height: 78,

            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'center',

            gap: 12,
        },

        hintButton: {minWidth:88,minHeight:64,alignItems:'center',justifyContent:'center'},

        hintButtonText: {color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:14},

        hintPenalty: {color:ROYAL.paleGold,fontSize:13},

        micButton: {width:52,height:52,alignItems:'center',justifyContent:'center'},

        micRecording: {
            transform: [
                {
                    scale:
                        1.08,
                },
            ],
        },

        micIcon: {
            color:
                '#ffffff',

            fontSize: 24,

            fontWeight:
                '900',
        },

        checkButton: {minWidth:96,minHeight:64},

        checkButtonText: {
            color:
                '#ffffff',

            fontSize: 16,

            fontWeight:
                '900',
        },

        nextButton: {height:64,marginTop:8},

        nextButtonText: {
            color:
                '#ffffff',

            fontSize: 16,

            fontWeight:
                '900',
        },

        giveUpButton: {
            alignSelf:
                'center',

            marginTop: 8,

            alignItems: 'center',

            marginBottom: 8,

            paddingHorizontal:
                16,

            paddingVertical:
                7,
        },

        giveUpText: {
            color:
                ROYAL.paleGold,

            fontSize: 16,

            textDecorationLine:
                'underline',
        },

        resultContainer: {
            flex: 1,

            backgroundColor:
                'transparent',

            alignItems:
                'center',

            justifyContent:
                'center',

            padding: 22,
        },

        resultCard: {width:'100%',maxWidth:680,paddingHorizontal:30,paddingVertical:24,alignItems:'center'},

        resultIcon: {width:64,height:64},

        resultTitle: {
            color:
                '#ffffff',

            fontSize: 25,

            fontWeight:
                '900',

            marginTop: 10,
        },

        resultLocalized: {
            color:
                '#ffffff',

            fontSize: 15,

            fontWeight:
                '800',

            textAlign:
                'center',

            marginTop: 13,
        },

        resultJapanese: {
            color:
                '#909bae',

            fontSize: 16,

            marginTop: 4,
        },

        resultStatCard: {
            alignSelf:
                'stretch',

            marginTop: 20,

            borderRadius:
                15,

            padding: 14,

            backgroundColor:
                '#151d2e',
        },

        resultStatRow: {
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',

            minHeight: 31,
        },

        resultStatLabel: {
            color:
                '#8995a6',

            fontSize: 16,
        },

        resultStatValue: {
            color:
                '#ffffff',

            fontSize: 15,

            fontWeight:
                '900',
        },

        resultXp: {
            color:
                '#ffd75e',

            fontSize: 18,

            fontWeight:
                '900',
        },

        failedMessage: {
            color:
                '#ff9e9e',

            fontSize: 16,

            textAlign:
                'center',

            lineHeight: 14,

            marginTop: 13,
        },

        successMessage: {
            color:
                '#65dcaa',

            fontSize: 16,

            fontWeight:
                '900',

            marginTop: 13,
        },

        coinReward: {
            color:
                '#ffd75e',

            fontSize: 15,

            fontWeight:
                '900',

            marginTop: 10,
        },

        finishButton: {minHeight:64,alignSelf:'stretch',marginTop:20},

        finishButtonText: {
            color:
                '#ffffff',

            fontSize: 15,

            fontWeight:
                '900',
        },

        errorContainer: {
            flex: 1,

            backgroundColor:
                'transparent',

            alignItems:
                'center',

            justifyContent:
                'center',

            padding: 25,
        },

        errorTitle: {
            color:
                '#ffffff',

            fontSize: 20,

            fontWeight:
                '900',
        },

        errorText: {
            color:
                '#8995a6',

            fontSize: 16,

            textAlign:
                'center',

            marginTop: 8,
        },

        errorButton: {
            width: 50,

            height: 50,

            borderRadius:
                25,

            backgroundColor:
                '#6558f5',

            alignItems:
                'center',

            justifyContent:
                'center',

            marginTop: 20,
        },

        errorButtonText: {
            color:
                '#ffffff',

            fontSize: 24,
        },

        speechUnavailableBox: {
            marginTop: 10,

            borderRadius: 12,

            backgroundColor:
                '#ffe7e7',

            paddingHorizontal: 14,

            paddingVertical: 10,
        },

        speechUnavailableTitle: {
            color:
                '#a82727',

            fontSize: 16,

            fontWeight: '900',

            textAlign: 'center',
        },

        speechUnavailableText: {
            color:
                '#b94b4b',

            fontSize: 15,

            lineHeight: 13,

            textAlign: 'center',

            marginTop: 4,
        },
    });
