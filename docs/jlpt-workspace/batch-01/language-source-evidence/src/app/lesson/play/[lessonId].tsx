import { lessonSteps } from '@/data/lesson-steps';
import { lessons } from '@/data/lessons';
import { quizzes } from '@/data/quizzes';
import { vocabulary } from '@/data/vocabulary';

import { saveLessonProgress } from '@/services/progress-storage';

import type {
    DialogueLine,
    LessonExpression,
} from '@/types/lesson';

import type { QuizQuestion } from '@/types/quiz';
import type { VocabularyItem } from '@/types/vocabulary';

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioPlayer,
    useAudioRecorder,
    useAudioRecorderState,
} from 'expo-audio';

export default function LessonPlayerScreen() {
    const { lessonId } = useLocalSearchParams();

    const id = Array.isArray(lessonId)
        ? lessonId[0]
        : lessonId;

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [quizCompleted, setQuizCompleted] =
        useState(false);

    const [quizScore, setQuizScore] =
        useState(0);

    const lesson = lessons.find(
        (item) => item.id === id
    );

    const steps = lessonSteps
        .filter(
            (item) => item.lessonId === id
        )
        .sort(
            (a, b) => a.order - b.order
        );

    if (!lesson || steps.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        レッスンデータが見つかりません。
                    </Text>

                    <RoyalBackButton onPress={() => router.back()} />
                </View>
            </SafeAreaView>
        );
    }
    const activeLesson =
        lesson;

    const step = steps[currentIndex];

    const progress =
        ((currentIndex + 1) /
            steps.length) *
        100;

    const lessonQuizzes = quizzes
        .filter(
            (item) =>
                item.lessonId === id
        )
        .sort(
            (a, b) =>
                a.order - b.order
        );

    const lessonWords =
        vocabulary.filter(
            (item) =>
                activeLesson
                    .vocabularyIds
                    ?.includes(
                        item.id
                    )
        );

    function goNext() {
        if (
            currentIndex <
            steps.length - 1
        ) {
            setCurrentIndex(
                (value) => value + 1
            );
        }
    }

    function goPrevious() {
        if (currentIndex > 0) {
            setCurrentIndex(
                (value) => value - 1
            );
        }
    }

    async function completeLesson() {
        try {
            const total =
                lessonQuizzes.length;

            const percent =
                total > 0
                    ? Math.round(
                        (
                            quizScore /
                            total
                        ) *
                        100
                    )
                    : 0;

            console.log(
                'DEBUG before save:',
                {
                    lessonId:
                        activeLesson.id,

                    quizScore,

                    total,

                    percent,
                }
            );

            await saveLessonProgress({
                lessonId:
                    activeLesson.id,

                status:
                    'completed',

                quizScore,

                quizTotal:
                    total,

                quizPercent:
                    percent,

                completedAt:
                    new Date().toISOString(),
            });

            console.log(
                'Lesson progress saved:',
                activeLesson.id
            );

            Alert.alert(
                '保存完了',
                `Lesson: ${activeLesson.id}\nQuiz: ${quizScore}/${total}\n${percent}%`,
                [
                    {
                        text:
                            'OK',

                        onPress:
                            () =>
                                router.back(),
                    },
                ]
            );
        } catch (error) {
            console.log(
                'Complete lesson error:',
                error
            );

            Alert.alert(
                'エラー',
                '学習進捗を保存できませんでした。'
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={
                    styles.content
                }
            >
                <View style={styles.topBar}>
                    <Pressable
                        onPress={() =>
                            router.back()
                        }
                    >
                        <Text style={styles.close}>
                            ✕
                        </Text>
                    </Pressable>

                    <Text
                        style={styles.stepCount}
                    >
                        {currentIndex + 1} /{' '}
                        {steps.length}
                    </Text>
                </View>

                <View
                    style={
                        styles.progressBackground
                    }
                >
                    <View
                        style={[
                            styles.progressBar,
                            {
                                width: `${progress}%`,
                            },
                        ]}
                    />
                </View>

                <Text style={styles.stepType}>
                    {step.type.toUpperCase()}
                </Text>

                <Text style={styles.title}>
                    {step.titleJa}
                </Text>

                {step.titleVi && (
                    <Text
                        style={
                            styles.translation
                        }
                    >
                        {step.titleVi}
                    </Text>
                )}

                {step.instructionJa && (
                    <Text
                        style={
                            styles.instructionJa
                        }
                    >
                        {step.instructionJa}
                    </Text>
                )}

                {step.instructionVi && (
                    <Text
                        style={
                            styles.instructionVi
                        }
                    >
                        {step.instructionVi}
                    </Text>
                )}

                <View style={styles.activity}>
                    {step.type ===
                        'intro' && (
                            <IntroContent />
                        )}

                    {step.type ===
                        'vocabulary' && (
                            <VocabularyContent
                                words={
                                    lessonWords
                                }
                            />
                        )}

                    {step.type ===
                        'expression' && (
                            <ExpressionContent
                                expressions={
                                    activeLesson.expressions ?? []
                                }
                            />
                        )}

                    {step.type ===
                        'dialogue' && (
                            <DialogueContent
                                dialogue={
                                    activeLesson.dialogue ?? []
                                }
                            />
                        )}

                    {step.type ===
                        'quiz' && (
                            <QuizContent
                                questions={
                                    lessonQuizzes
                                }
                                onComplete={(
                                    score
                                ) => {
                                    setQuizScore(
                                        score
                                    );

                                    setQuizCompleted(
                                        true
                                    );
                                }}
                            />
                        )}

                    {step.type ===
                        'speaking' && (
                            <SpeakingContent />
                        )}

                    {step.type ===
                        'complete' && (
                            <CompleteContent
                                score={
                                    quizScore
                                }
                                total={
                                    lessonQuizzes.length
                                }
                                onRetry={() => {
                                    setCurrentIndex(
                                        0
                                    );

                                    setQuizCompleted(
                                        false
                                    );

                                    setQuizScore(
                                        0
                                    );
                                }}
                                onFinish={
                                    completeLesson
                                }
                            />
                        )}
                </View>

                {step.type !==
                    'complete' && (
                        <View
                            style={
                                styles.navigation
                            }
                        >
                            {currentIndex >
                                0 ? (
                                <Pressable
                                    style={
                                        styles.previousButton
                                    }
                                    onPress={
                                        goPrevious
                                    }
                                >
                                    <Text
                                        style={
                                            styles.previousText
                                        }
                                    >
                                        ← 戻る
                                    </Text>
                                </Pressable>
                            ) : (
                                <View />
                            )}

                            <Pressable
                                style={[
                                    styles.nextButton,

                                    step.type ===
                                    'quiz' &&
                                    !quizCompleted &&
                                    styles.nextButtonDisabled,
                                ]}
                                disabled={
                                    step.type ===
                                    'quiz' &&
                                    !quizCompleted
                                }
                                onPress={
                                    goNext
                                }
                            >
                                <Text
                                    style={[
                                        styles.nextText,

                                        step.type ===
                                        'quiz' &&
                                        !quizCompleted &&
                                        styles.nextTextDisabled,
                                    ]}
                                >
                                    {step.type ===
                                        'quiz' &&
                                        !quizCompleted
                                        ? 'クイズを完了してください'
                                        : '次へ →'}
                                </Text>
                            </Pressable>
                        </View>
                    )}
            </ScrollView>
        </SafeAreaView>
    );
}

function IntroContent() {
    return (
        <View style={styles.centerBox}>
            <Text style={styles.bigEmoji}>
                🍽️
            </Text>

            <Text
                style={styles.centerTitle}
            >
                注文を聞いてみよう
            </Text>

            <Text
                style={
                    styles.centerDescription
                }
            >
                店員として、お客様との基本的な会話を練習します。
            </Text>
        </View>
    );
}

function VocabularyContent({
    words,
}: {
    words: VocabularyItem[];
}) {
    return (
        <View>
            {words.map((word) => (
                <View
                    key={word.id}
                    style={styles.wordCard}
                >
                    <Text
                        style={styles.word}
                    >
                        {word.word}
                    </Text>

                    <Text
                        style={
                            styles.reading
                        }
                    >
                        {word.reading}
                    </Text>

                    <Text
                        style={
                            styles.meaning
                        }
                    >
                        {word.meaningVi}
                    </Text>
                </View>
            ))}
        </View>
    );
}

function ExpressionContent({
    expressions,
}: {
    expressions: LessonExpression[];
}) {
    return (
        <View>
            {expressions.map(
                (item) => (
                    <View
                        key={item.id}
                        style={
                            styles.card
                        }
                    >
                        <Text
                            style={
                                styles.expression
                            }
                        >
                            {
                                item.expression
                            }
                        </Text>

                        <Text
                            style={
                                styles.meaning
                            }
                        >
                            {
                                item.meaningVi
                            }
                        </Text>

                        {item.exampleJa && (
                            <View
                                style={
                                    styles.exampleBox
                                }
                            >
                                <Text
                                    style={
                                        styles.example
                                    }
                                >
                                    {
                                        item.exampleJa
                                    }
                                </Text>

                                {item.exampleVi && (
                                    <Text
                                        style={
                                            styles.exampleVi
                                        }
                                    >
                                        {
                                            item.exampleVi
                                        }
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                )
            )}
        </View>
    );
}

function DialogueContent({
    dialogue,
}: {
    dialogue: DialogueLine[];
}) {
    return (
        <View>
            {dialogue.map((line) => (
                <View
                    key={line.id}
                    style={styles.card}
                >
                    <Text
                        style={
                            styles.speaker
                        }
                    >
                        {line.speakerJa}
                        {line.speakerVi
                            ? ` / ${line.speakerVi}`
                            : ''}
                    </Text>

                    <Text
                        style={
                            styles.dialogue
                        }
                    >
                        {line.textJa}
                    </Text>

                    {line.reading && (
                        <Text
                            style={
                                styles.reading
                            }
                        >
                            {line.reading}
                        </Text>
                    )}

                    <Text
                        style={
                            styles.meaning
                        }
                    >
                        {line.textVi}
                    </Text>
                </View>
            ))}
        </View>
    );
}

function QuizContent({
    questions,
    onComplete,
}: {
    questions: QuizQuestion[];
    onComplete: (
        score: number
    ) => void;
}) {
    const [
        questionIndex,
        setQuestionIndex,
    ] = useState(0);

    const [
        selectedOptionId,
        setSelectedOptionId,
    ] = useState<string | null>(
        null
    );

    const [score, setScore] =
        useState(0);

    const [completed, setCompleted] =
        useState(false);

    const [answeredQuestions, setAnsweredQuestions] =
        useState<Record<string, boolean>>({});

    if (questions.length === 0) {
        return (
            <View
                style={styles.centerBox}
            >
                <Text>
                    問題がありません。
                </Text>
            </View>
        );
    }

    const question =
        questions[questionIndex];

    const answered =
        selectedOptionId !== null;

    const isCorrect =
        selectedOptionId ===
        question.correctOptionId;

    function selectOption(optionId: string) {
        if (answered) {
            return;
        }

        setSelectedOptionId(optionId);

        const correct =
            optionId === question.correctOptionId;

        setAnsweredQuestions((current) => ({
            ...current,
            [question.id]: correct,
        }));

        if (correct) {
            setScore((value) => value + 1);
        }
    }

    function nextQuestion() {
        if (
            questionIndex <
            questions.length - 1
        ) {
            setQuestionIndex(
                (value) => value + 1
            );

            setSelectedOptionId(
                null
            );
        }
    }

    return (
        <View>
            <Text
                style={styles.quizCounter}
            >
                問題 {questionIndex + 1}{' '}
                / {questions.length}
            </Text>

            <Text
                style={
                    styles.quizQuestion
                }
            >
                {question.questionJa}
            </Text>

            {question.questionVi && (
                <Text
                    style={
                        styles.quizQuestionVi
                    }
                >
                    {
                        question.questionVi
                    }
                </Text>
            )}

            <View
                style={
                    styles.quizOptions
                }
            >
                {question.options.map(
                    (option) => {
                        const selected =
                            selectedOptionId ===
                            option.id;

                        const correct =
                            answered &&
                            option.id ===
                            question.correctOptionId;

                        const wrong =
                            answered &&
                            selected &&
                            option.id !==
                            question.correctOptionId;

                        return (
                            <Pressable
                                key={
                                    option.id
                                }
                                style={[
                                    styles.quizOption,

                                    selected &&
                                    styles.quizOptionSelected,

                                    correct &&
                                    styles.quizOptionCorrect,

                                    wrong &&
                                    styles.quizOptionWrong,
                                ]}
                                onPress={() =>
                                    selectOption(
                                        option.id
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.quizOptionLetter
                                    }
                                >
                                    {
                                        option.id
                                    }
                                </Text>

                                <Text
                                    style={
                                        styles.quizOptionText
                                    }
                                >
                                    {
                                        option.text
                                    }
                                </Text>
                            </Pressable>
                        );
                    }
                )}
            </View>

            {answered && (
                <View
                    style={
                        styles.quizResult
                    }
                >
                    <Text
                        style={
                            styles.quizResultTitle
                        }
                    >
                        {isCorrect
                            ? '✅ 正解！'
                            : '❌ 不正解'}
                    </Text>

                    {question.explanationJa && (
                        <Text
                            style={
                                styles.quizExplanation
                            }
                        >
                            {
                                question.explanationJa
                            }
                        </Text>
                    )}

                    {question.explanationVi && (
                        <Text
                            style={
                                styles.quizExplanationVi
                            }
                        >
                            {
                                question.explanationVi
                            }
                        </Text>
                    )}

                    {questionIndex <
                        questions.length -
                        1 && (
                            <Pressable
                                style={
                                    styles.quizNextButton
                                }
                                onPress={
                                    nextQuestion
                                }
                            >
                                <Text
                                    style={
                                        styles.quizNextText
                                    }
                                >
                                    次の問題 →
                                </Text>
                            </Pressable>
                        )}

                    {questionIndex ===
                        questions.length -
                        1 && (
                            <>
                                {!completed ? (
                                    <Pressable
                                        style={styles.quizFinishButton}
                                        onPress={() => {
                                            const finalResults = {
                                                ...answeredQuestions,
                                                [question.id]: isCorrect,
                                            };

                                            const finalScore =
                                                Object.values(finalResults).filter(
                                                    (result) => result === true
                                                ).length;

                                            setScore(finalScore);
                                            setCompleted(true);

                                            onComplete(finalScore);

                                            console.log(
                                                'Quiz completed:',
                                                {
                                                    finalScore,
                                                    total: questions.length,
                                                    percent: Math.round(
                                                        (finalScore / questions.length) * 100
                                                    ),
                                                }
                                            );
                                        }}
                                    >
                                        <Text
                                            style={
                                                styles.quizFinishButtonText
                                            }
                                        >
                                            クイズを完了する
                                        </Text>
                                    </Pressable>
                                ) : (
                                    <View
                                        style={
                                            styles.quizSummary
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.quizFinished
                                            }
                                        >
                                            ✓
                                            クイズ完了
                                        </Text>

                                        <Text
                                            style={
                                                styles.quizScore
                                            }
                                        >
                                            正解数：
                                            {
                                                score
                                            }{' '}
                                            /{' '}
                                            {
                                                questions.length
                                            }
                                        </Text>

                                        <Text
                                            style={
                                                styles.quizPercent
                                            }
                                        >
                                            正答率：
                                            {Math.round(
                                                (score /
                                                    questions.length) *
                                                100
                                            )}
                                            %
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                </View>
            )}
        </View>
    );
}

function SpeakingContent() {
    const recorder =
        useAudioRecorder(
            RecordingPresets.HIGH_QUALITY
        );

    const recorderState =
        useAudioRecorderState(
            recorder
        );

    const [
        recordingUri,
        setRecordingUri,
    ] = useState<string | null>(
        null
    );

    const player =
        useAudioPlayer(null);

    useEffect(() => {
        async function setupAudio() {
            const permission =
                await AudioModule.requestRecordingPermissionsAsync();

            if (
                !permission.granted
            ) {
                Alert.alert(
                    'Microphone',
                    'マイクの使用を許可してください。'
                );

                return;
            }

            await setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true,
            });
        }

        setupAudio();
    }, []);

    async function startRecording() {
        try {
            setRecordingUri(null);

            await setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true,
            });

            await recorder.prepareToRecordAsync();

            recorder.record();
        } catch (error) {
            console.log(
                'Start recording error:',
                error
            );
        }
    }

    async function stopRecording() {
        try {
            await recorder.stop();

            const uri =
                recorder.uri;

            if (uri) {
                setRecordingUri(uri);
            }

            await setAudioModeAsync({
                allowsRecording: false,
                playsInSilentMode: true,
            });
        } catch (error) {
            console.log(
                'Stop recording error:',
                error
            );
        }
    }

    async function playRecording() {
        if (!recordingUri) {
            return;
        }

        try {
            player.replace(
                recordingUri
            );

            await player.seekTo(0);

            player.play();
        } catch (error) {
            console.log(
                'Playback error:',
                error
            );
        }
    }

    return (
        <View
            style={styles.centerBox}
        >
            <Text
                style={styles.bigEmoji}
            >
                🎤
            </Text>

            <Text
                style={
                    styles.speakingPrompt
                }
            >
                ご注文はお決まりですか。
            </Text>

            <Text
                style={
                    styles.centerDescription
                }
            >
                Hãy đọc câu trên thành
                tiếng.
            </Text>

            {recorderState.isRecording && (
                <Text
                    style={
                        styles.recordingStatus
                    }
                >
                    録音中...
                </Text>
            )}

            {recorderState.isRecording && (
                <Text
                    style={
                        styles.recordingTime
                    }
                >
                    {Math.round(
                        recorderState.durationMillis /
                        1000
                    )}
                    秒
                </Text>
            )}

            {!recorderState.isRecording &&
                !recordingUri && (
                    <Pressable
                        style={
                            styles.microphoneButton
                        }
                        onPress={
                            startRecording
                        }
                    >
                        <Text
                            style={
                                styles.microphoneText
                            }
                        >
                            🎤 録音開始
                        </Text>
                    </Pressable>
                )}

            {recorderState.isRecording && (
                <Pressable
                    style={
                        styles.stopButton
                    }
                    onPress={
                        stopRecording
                    }
                >
                    <Text
                        style={
                            styles.microphoneText
                        }
                    >
                        ⏹ 録音停止
                    </Text>
                </Pressable>
            )}

            {!recorderState.isRecording &&
                recordingUri && (
                    <>
                        <Pressable
                            style={
                                styles.playButton
                            }
                            onPress={
                                playRecording
                            }
                        >
                            <Text
                                style={
                                    styles.microphoneText
                                }
                            >
                                ▶
                                録音を聞く
                            </Text>
                        </Pressable>

                        <Pressable
                            style={
                                styles.retryButton
                            }
                            onPress={
                                startRecording
                            }
                        >
                            <Text
                                style={
                                    styles.retryText
                                }
                            >
                                🔁
                                もう一度録音する
                            </Text>
                        </Pressable>
                    </>
                )}
        </View>
    );
}

function CompleteContent({
    score,
    total,
    onRetry,
    onFinish,
}: {
    score: number;
    total: number;
    onRetry: () => void;
    onFinish: () => void;
}) {
    const percentage =
        total > 0
            ? Math.round(
                (score / total) * 100
            )
            : 0;

    return (
        <View
            style={
                styles.completeContainer
            }
        >
            <Text
                style={
                    styles.completeEmoji
                }
            >
                🎉
            </Text>

            <Text
                style={
                    styles.completeTitle
                }
            >
                レッスン完了！
            </Text>

            <Text
                style={
                    styles.completeSubtitle
                }
            >
                Bạn đã hoàn thành bài
                học.
            </Text>

            <View
                style={
                    styles.resultCard
                }
            >
                <Text
                    style={
                        styles.resultLabel
                    }
                >
                    クイズ
                </Text>

                <Text
                    style={
                        styles.resultScore
                    }
                >
                    {score} / {total}
                </Text>

                <Text
                    style={
                        styles.resultDescription
                    }
                >
                    正解
                </Text>

                <View
                    style={
                        styles.resultDivider
                    }
                />

                <Text
                    style={
                        styles.resultPercent
                    }
                >
                    {percentage}%
                </Text>

                <Text
                    style={
                        styles.resultDescription
                    }
                >
                    正答率
                </Text>
            </View>

            <View
                style={
                    styles.speakingCompleteCard
                }
            >
                <Text
                    style={
                        styles.speakingCompleteIcon
                    }
                >
                    🎤
                </Text>

                <View
                    style={
                        styles.speakingCompleteContent
                    }
                >
                    <Text
                        style={
                            styles.speakingCompleteTitle
                        }
                    >
                        スピーキング
                    </Text>

                    <Text
                        style={
                            styles.speakingCompleteText
                        }
                    >
                        練習完了
                    </Text>
                </View>

                <Text
                    style={
                        styles.completeCheck
                    }
                >
                    ✓
                </Text>
            </View>

            <Pressable
                style={
                    styles.retryLessonButton
                }
                onPress={onRetry}
            >
                <Text
                    style={
                        styles.retryLessonText
                    }
                >
                    🔁
                    もう一度学習する
                </Text>
            </Pressable>

            <Pressable
                style={
                    styles.finishButton
                }
                onPress={onFinish}
            >
                <Text
                    style={
                        styles.finishText
                    }
                >
                    モジュールに戻る
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d6',
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 50,
    },

    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    errorText: {
        fontSize: 17,
    },

    backLink: {
        fontSize: 16,
        marginTop: 20,
    },

    topBar: {
        flexDirection: 'row',
        justifyContent:
            'space-between',
        alignItems: 'center',
    },

    close: {
        fontSize: 22,
        fontWeight: '700',
    },

    stepCount: {
        fontSize: 16,
        fontWeight: '700',
    },

    progressBackground: {
        height: 8,
        backgroundColor: '#eeeeee',
        borderRadius: 4,
        marginTop: 18,
        overflow: 'hidden',
    },

    progressBar: {
        height: '100%',
        backgroundColor: '#222222',
    },

    stepType: {
        fontSize: 15,
        fontWeight: '700',
        marginTop: 30,
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
        marginTop: 6,
    },

    translation: {
        fontSize: 17,
        marginTop: 5,
    },

    instructionJa: {
        fontSize: 16,
        lineHeight: 24,
        marginTop: 18,
    },

    instructionVi: {
        fontSize: 16,
        lineHeight: 21,
        marginTop: 6,
    },

    activity: {
        marginTop: 28,
    },

    centerBox: {
        alignItems: 'center',
        paddingVertical: 24,
    },

    bigEmoji: {
        fontSize: 64,
    },

    centerTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 18,
    },

    centerDescription: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 10,
    },

    wordCard: {
        backgroundColor: '#f3f3f3',
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
    },

    word: {
        fontSize: 28,
        fontWeight: '800',
    },

    reading: {
        fontSize: 15,
        marginTop: 4,
    },

    meaning: {
        fontSize: 15,
        marginTop: 10,
    },

    card: {
        backgroundColor: '#f3f3f3',
        padding: 18,
        borderRadius: 16,
        marginBottom: 12,
    },

    expression: {
        fontSize: 20,
        fontWeight: '700',
    },

    exampleBox: {
        backgroundColor: '#e8e2d6',
        padding: 14,
        borderRadius: 12,
        marginTop: 14,
    },

    example: {
        fontSize: 16,
    },

    exampleVi: {
        fontSize: 16,
        marginTop: 5,
    },

    speaker: {
        fontSize: 16,
        fontWeight: '700',
    },

    dialogue: {
        fontSize: 18,
        lineHeight: 26,
        marginTop: 8,
    },

    quizCounter: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },

    quizQuestion: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 32,
    },

    quizQuestionVi: {
        fontSize: 15,
        lineHeight: 22,
        marginTop: 8,
    },

    quizOptions: {
        marginTop: 24,
        gap: 12,
    },

    quizOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        padding: 16,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    quizOptionSelected: {
        borderColor: '#222222',
    },

    quizOptionCorrect: {
        backgroundColor: '#dff7e5',
        borderColor: '#35a853',
    },

    quizOptionWrong: {
        backgroundColor: '#ffe2e2',
        borderColor: '#d94b4b',
    },

    quizOptionLetter: {
        width: 32,
        fontSize: 17,
        fontWeight: '800',
    },

    quizOptionText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 23,
    },

    quizResult: {
        backgroundColor: '#f3f3f3',
        borderRadius: 16,
        padding: 18,
        marginTop: 24,
    },

    quizResultTitle: {
        fontSize: 21,
        fontWeight: '800',
    },

    quizExplanation: {
        fontSize: 15,
        lineHeight: 23,
        marginTop: 12,
    },

    quizExplanationVi: {
        fontSize: 16,
        lineHeight: 21,
        marginTop: 6,
    },

    quizNextButton: {
        backgroundColor: '#222222',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 18,
    },

    quizNextText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },

    quizFinishButton: {
        backgroundColor: '#222222',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 18,
    },

    quizFinishButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },

    quizSummary: {
        marginTop: 18,
        alignItems: 'center',
    },

    quizFinished: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },

    quizScore: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 10,
    },

    quizPercent: {
        fontSize: 16,
        marginTop: 6,
    },

    nextButtonDisabled: {
        backgroundColor: '#cccccc',
    },

    nextTextDisabled: {
        color: '#777777',
    },

    speakingPrompt: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 20,
    },

    recordingStatus: {
        fontSize: 17,
        fontWeight: '700',
        marginTop: 22,
    },

    recordingTime: {
        fontSize: 30,
        fontWeight: '800',
        marginTop: 8,
    },

    microphoneButton: {
        backgroundColor: '#222222',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginTop: 24,
    },

    stopButton: {
        backgroundColor: '#222222',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginTop: 24,
    },

    playButton: {
        backgroundColor: '#222222',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginTop: 24,
    },

    microphoneText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '700',
    },

    retryButton: {
        backgroundColor: '#eeeeee',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginTop: 14,
        alignItems: 'center',
    },

    retryText: {
        color: '#222222',
        fontSize: 17,
        fontWeight: '700',
    },

    completeContainer: {
        alignItems: 'center',
        paddingVertical: 24,
    },

    completeEmoji: {
        fontSize: 72,
    },

    completeTitle: {
        fontSize: 28,
        fontWeight: '800',
        marginTop: 18,
    },

    completeSubtitle: {
        fontSize: 15,
        marginTop: 8,
        textAlign: 'center',
    },

    resultCard: {
        width: '100%',
        backgroundColor: '#f3f3f3',
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        alignItems: 'center',
    },

    resultLabel: {
        fontSize: 16,
        fontWeight: '700',
    },

    resultScore: {
        fontSize: 34,
        fontWeight: '800',
        marginTop: 12,
    },

    resultDescription: {
        fontSize: 16,
        marginTop: 3,
    },

    resultDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#dddddd',
        marginVertical: 18,
    },

    resultPercent: {
        fontSize: 30,
        fontWeight: '800',
    },

    speakingCompleteCard: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        borderRadius: 16,
        padding: 18,
        marginTop: 14,
    },

    speakingCompleteIcon: {
        fontSize: 28,
        marginRight: 14,
    },

    speakingCompleteContent: {
        flex: 1,
    },

    speakingCompleteTitle: {
        fontSize: 16,
        fontWeight: '700',
    },

    speakingCompleteText: {
        fontSize: 16,
        marginTop: 3,
    },

    completeCheck: {
        fontSize: 24,
        fontWeight: '800',
        color: '#35a853',
    },

    retryLessonButton: {
        width: '100%',
        backgroundColor: '#eeeeee',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 14,
        marginTop: 24,
        alignItems: 'center',
    },

    retryLessonText: {
        color: '#222222',
        fontSize: 17,
        fontWeight: '700',
    },

    navigation: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 36,
    },

    previousButton: {
        padding: 17,
        borderRadius: 14,
        backgroundColor: '#eeeeee',
    },

    previousText: {
        fontSize: 16,
        fontWeight: '700',
    },

    nextButton: {
        flex: 1,
        padding: 17,
        borderRadius: 14,
        backgroundColor: '#222222',
        alignItems: 'center',
    },

    nextText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '700',
    },

    finishButton: {
        width: '100%',
        backgroundColor: '#222222',
        paddingVertical: 17,
        paddingHorizontal: 30,
        borderRadius: 14,
        marginTop: 14,
        alignItems: 'center',
    },

    finishText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '700',
    },
});
