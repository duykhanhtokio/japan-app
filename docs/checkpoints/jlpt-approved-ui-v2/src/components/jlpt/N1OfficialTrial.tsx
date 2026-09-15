import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, type ImageSourcePropType, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

import {
  JlptActionButton,
  JlptAnswerOption,
  JlptExamHeader,
  JlptFontControls,
  JlptInstruction,
  JlptPaper,
  JlptQuestionNavigator,
  JlptQuestionText,
  JlptReadingPassage,
  JlptRestartConfirmation,
  JlptResumePrompt,
  JlptReviewFeedback,
  JlptSectionHeading,
  JlptSubmitConfirmation,
  JlptProgressBar,
} from '@/components/jlpt/ui/JlptExamUI';
import type { ApprovedN1Exam } from '@/data/jlpt-official/approved-n1-exams';
import type { TrialQuestion } from '@/data/jlpt-official/n1-2012-07-trial';
import { getCurrentAppLanguage } from '@/i18n/localization-runtime';
import { JLPT_EXAM, type JlptFontScale } from '@/theme/jlpt-exam-design-system';
import { clearJlptTrialSession, loadJlptTrialSession, saveJlptTrialSession, type N1TrialSession } from '@/services/jlpt-trial-session-storage';

type Mode = 'exam' | 'practice';
const FONT_SCALES: readonly JlptFontScale[] = [0.9, 1, 1.1, 1.2, 1.3, 1.4];
export default function N1OfficialTrial({ onExit, exam }: { onExit: () => void; exam: ApprovedN1Exam }) {
  const questions = exam.questions;
  const listening = questions.filter((question) => question.family === 'listening');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<Mode>('exam');
  const [fontScale, setFontScale] = useState<JlptFontScale>(1);
  const [navigatorVisible, setNavigatorVisible] = useState(false);
  const [submitConfirmationVisible, setSubmitConfirmationVisible] = useState(false);
  const [restartConfirmationVisible, setRestartConfirmationVisible] = useState(false);
  const [pendingSession, setPendingSession] = useState<N1TrialSession | null>(null);
  const [completedSession, setCompletedSession] = useState<N1TrialSession | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'unanswered'>('all');
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0].id);
  const [playedAudioSegments, setPlayedAudioSegments] = useState<string[]>([]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [activeAudioSegment, setActiveAudioSegment] = useState<string | null>(null);
  const [initialScrollY, setInitialScrollY] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<Record<string, number>>({});
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playbackGeneration = useRef(0);
  const activeRange = useRef<{ generation: number; endMs: number } | null>(null);
  const player = useAudioPlayer(exam.audioSource, { updateInterval: 100 });
  const playerStatus = useAudioPlayerStatus(player);

  const answeredIds = useMemo(() => new Set(Object.keys(answers)), [answers]);

  useEffect(() => {
    let active = true;
    void loadJlptTrialSession(exam.storageKey).then((session) => {
      if (!active || !session || !session.started) return;
      if (session.status === 'submitted' || session.status === 'reviewing' || session.submitted) setCompletedSession(session);
      else setPendingSession(session);
    });
    return () => { active = false; };
  }, [exam.storageKey]);

  useEffect(() => () => {
    playbackGeneration.current += 1;
    activeRange.current = null;
    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = null;
  }, []);

  useEffect(() => {
    const range = activeRange.current;
    if (!range || range.generation !== playbackGeneration.current || !playerStatus.playing) return;
    if (playerStatus.currentTime * 1000 < range.endMs) return;
    player.pause();
    activeRange.current = null;
    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = null;
    setAudioPlaying(false);
    setActiveAudioSegment(null);
  }, [player, playerStatus.currentTime, playerStatus.playing]);

  function changeFont(direction: -1 | 1) {
    const index = FONT_SCALES.indexOf(fontScale);
    setFontScale(FONT_SCALES[Math.max(0, Math.min(FONT_SCALES.length - 1, index + direction))]);
  }

  function choose(questionId: string, optionId: string) {
    if (submitted) return;
    const next = { ...answers, [questionId]: optionId };
    setAnswers(next);
    void persist({ answers: next, currentQuestion: questionId });
  }

  function registerPosition(questionId: string, event: LayoutChangeEvent) {
    positions.current[questionId] = event.nativeEvent.layout.y;
  }

  function goToQuestion(questionId: string) {
    setNavigatorVisible(false);
    setCurrentQuestion(questionId);
    void persist({ currentQuestion: questionId });
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: Math.max(0, (positions.current[questionId] ?? 0) - 12), animated: true }));
  }

  async function playListening(question: TrialQuestion) {
    const audio = question.audio;
    if (!audio || audioPlaying || (mode === 'exam' && !submitted && playedAudioSegments.includes(audio.segmentId))) return;
    const generation = playbackGeneration.current + 1;
    playbackGeneration.current = generation;
    activeRange.current = null;
    if (stopTimer.current) clearTimeout(stopTimer.current);
    player.pause();
    await player.seekTo(audio.startMs / 1000);
    if (playbackGeneration.current !== generation) return;
    activeRange.current = { generation, endMs: audio.endMs };
    player.play();
    setAudioPlaying(true);
    setActiveAudioSegment(audio.segmentId);
    if (mode === 'exam') {
      const nextPlayed = [...new Set([...playedAudioSegments, audio.segmentId])];
      setPlayedAudioSegments(nextPlayed);
      void persist({ playedAudioSegments: nextPlayed });
    }
    stopTimer.current = setTimeout(() => {
      if (playbackGeneration.current !== generation) return;
      player.pause();
      activeRange.current = null;
      setAudioPlaying(false);
      setActiveAudioSegment(null);
      stopTimer.current = null;
    }, audio.endMs - audio.startMs + 5000);
  }

  function pauseListening() {
    if (mode !== 'practice') return;
    playbackGeneration.current += 1;
    activeRange.current = null;
    if (stopTimer.current) clearTimeout(stopTimer.current);
    player.pause();
    setAudioPlaying(false);
    setActiveAudioSegment(null);
  }

  function exitExam() {
    playbackGeneration.current += 1;
    activeRange.current = null;
    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = null;
    if (audioPlaying) player.pause();
    setAudioPlaying(false);
    setActiveAudioSegment(null);
    onExit();
  }

  function resetLocalState() {
    playbackGeneration.current += 1;
    activeRange.current = null;
    if (stopTimer.current) clearTimeout(stopTimer.current);
    player.pause();
    setAnswers({});
    setSubmitted(false);
    setStarted(false);
    setMode('exam');
    setPlayedAudioSegments([]);
    setAudioPlaying(false);
    setReviewing(false);
    setSubmittedAt(null);
    setCurrentQuestion(questions[0].id);
    setInitialScrollY(0);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }

  function persist(overrides: Partial<Omit<N1TrialSession, 'version' | 'updatedAt'>> = {}) {
    return saveJlptTrialSession(exam.storageKey, { answers, mode, status: submitted ? reviewing ? 'reviewing' : 'submitted' : started ? 'in_progress' : 'not_started', started, submitted, currentQuestion, scrollY: initialScrollY, playedAudioSegments, submittedAt, result: submitted ? calculateResult(questions, answers) : null, ...overrides });
  }

  function begin() {
    setAnswers({});
    setSubmitted(false);
    setCurrentQuestion(questions[0].id);
    setInitialScrollY(0);
    setPlayedAudioSegments([]);
    setPendingSession(null);
    setStarted(true);
    setCompletedSession(null);
    void clearJlptTrialSession(exam.storageKey).then(() => saveJlptTrialSession(exam.storageKey, { answers: {}, mode, status: 'in_progress', started: true, submitted: false, currentQuestion: questions[0].id, scrollY: 0, playedAudioSegments: [], submittedAt: null, result: null }));
  }

  function continueSession() {
    if (!pendingSession) return;
    setAnswers(pendingSession.answers);
    setMode(pendingSession.mode);
    setSubmitted(false);
    setCurrentQuestion(pendingSession.currentQuestion || questions[0].id);
    setInitialScrollY(pendingSession.scrollY);
    setPlayedAudioSegments(pendingSession.playedAudioSegments);
    setPendingSession(null);
    setStarted(true);
  }

  function requestRestartSavedSession() {
    setRestartConfirmationVisible(true);
  }

  function confirmRestartSavedSession() {
    setRestartConfirmationVisible(false);
    setPendingSession(null);
    resetLocalState();
    void clearJlptTrialSession(exam.storageKey);
  }

  function selectMode(next: Mode) {
    setMode(next);
    void persist({ mode: next });
  }

  function submit() {
    playbackGeneration.current += 1;
    activeRange.current = null;
    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = null;
    player.pause();
    setAudioPlaying(false);
    setActiveAudioSegment(null);
    setSubmitConfirmationVisible(false);
    setSubmitted(true);
    setReviewing(false);
    const now = new Date().toISOString();
    setSubmittedAt(now);
    void persist({ status: 'submitted', submitted: true, submittedAt: now, result: calculateResult(questions, answers) });
  }

  function openCompleted(nextReviewing: boolean) {
    if (!completedSession) return;
    setAnswers(completedSession.answers);
    setMode(completedSession.mode);
    setSubmitted(true);
    setStarted(true);
    setSubmittedAt(completedSession.submittedAt);
    setCompletedSession(null);
    setReviewing(nextReviewing);
  }

  function requestSubmit() {
    if (answeredIds.size < questions.length) setSubmitConfirmationVisible(true);
    else submit();
  }

  function saveScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const scrollY = Math.max(0, event.nativeEvent.contentOffset.y);
    setInitialScrollY(scrollY);
    void persist({ scrollY });
  }

  if (!started) return <View style={styles.startScreen}><JlptExamHeader title="N1 · JLPT模擬試験" subtitle="日本語能力試験" onBack={onExit} /><ScrollView contentContainerStyle={styles.startPage}>
    <JlptPaper>
      <Text style={styles.examName}>{exam.title}</Text>
      <Text style={styles.trialName}>{exam.periodLabel}</Text>
      <View style={styles.rule} />
      <Text style={styles.startCopy}>原本と照合済みの全{questions.length}問を収録しています。解答と聴解スクリプトは提出後の詳しい解説で確認できます。</Text>
      <Text style={styles.modeLabel}>受験モード</Text>
      <Pressable accessibilityRole="radio" accessibilityState={{ checked: mode === 'exam' }} onPress={() => selectMode('exam')} style={[styles.modeRow, mode === 'exam' && styles.modeSelected]}>
        <View style={[styles.radio, mode === 'exam' && styles.radioSelected]} />
        <View style={styles.modeCopy}><Text style={styles.modeTitle}>試験モード</Text><Text style={styles.modeDescription}>聴解は一度だけ再生され、提出前に正答・スクリプトは表示されません。</Text></View>
      </Pressable>
      <Pressable accessibilityRole="radio" accessibilityState={{ checked: mode === 'practice' }} onPress={() => selectMode('practice')} style={[styles.modeRow, mode === 'practice' && styles.modeSelected]}>
        <View style={[styles.radio, mode === 'practice' && styles.radioSelected]} />
        <View style={styles.modeCopy}><Text style={styles.modeTitle}>練習モード</Text><Text style={styles.modeDescription}>聴解を繰り返し再生・一時停止できます。正答は提出後に表示されます。</Text></View>
      </Pressable>
      <JlptActionButton label={exam.startLabel} onPress={begin} style={styles.startAction} />
      {completedSession ? <View style={styles.savedResult}>
        <Text style={styles.savedResultTitle}>提出済みの結果があります</Text>
        <Text style={styles.savedResultText}>{formatSavedAt(completedSession.submittedAt ?? completedSession.updatedAt)}</Text>
        <JlptActionButton label="結果を見る" onPress={() => openCompleted(false)} />
        <JlptActionButton kind="secondary" label="詳しい解説を見る" onPress={() => openCompleted(true)} style={styles.savedResultAction} />
        <JlptActionButton kind="secondary" label="もう一度受験する" onPress={requestRestartSavedSession} style={styles.savedResultAction} />
      </View> : null}
    </JlptPaper>
  </ScrollView>
    {pendingSession ? <JlptResumePrompt
      visible={!restartConfirmationVisible}
      examName={`${exam.title}・${exam.periodLabel}`}
      mode={pendingSession.mode}
      updatedAt={formatSavedAt(pendingSession.updatedAt)}
      answered={Object.keys(pendingSession.answers).length}
      total={questions.length}
      currentLabel={questionPositionLabel(questions, pendingSession.currentQuestion)}
      onContinue={continueSession}
      onRestart={requestRestartSavedSession}
      onCancel={() => setPendingSession(null)}
    /> : null}
    <JlptRestartConfirmation visible={restartConfirmationVisible} onCancel={() => setRestartConfirmationVisible(false)} onConfirm={confirmRestartSavedSession} />
  </View>;

  const written = questions.filter((question) => question.family !== 'listening');

  const correctCount = questions.filter((question) => answers[question.id] === question.correctOptionId).length;
  const unansweredCount = questions.filter((question) => !answers[question.id]).length;
  const wrongCount = questions.length - correctCount - unansweredCount;

  if (submitted && !reviewing) return <View style={styles.screen}>
    <JlptExamHeader title="N1 · 試験結果" subtitle={exam.periodLabel} onBack={onExit} />
    <ScrollView contentContainerStyle={styles.resultPage}><JlptPaper>
      <Text style={styles.resultTitle}>試験結果</Text>
      <Text style={styles.resultMode}>{mode === 'exam' ? '試験モード' : '練習モード'}　{formatSavedAt(submittedAt ?? '')}</Text>
      <View style={styles.scoreGrid}>
        <ResultMetric label="正解" value={correctCount} tone="correct" />
        <ResultMetric label="不正解" value={wrongCount} tone="wrong" />
        <ResultMetric label="未回答" value={unansweredCount} />
        <ResultMetric label="正答率" value={`${Math.round((correctCount / questions.length) * 100)}%`} />
      </View>
      <Text style={styles.rawScore}>正答数：{correctCount}/{questions.length}</Text>
      <View style={styles.notEligible}><Text style={styles.notEligibleTitle}>素点による結果</Text><Text style={styles.notEligibleText}>公式の尺度得点への換算式は公開されていないため、正答数のみを表示します。正答率をJLPT公式得点や合否に置き換えていません。{`\n`}Chỉ hiển thị số câu đúng; không tự quy đổi thành điểm hoặc kết luận đỗ/trượt chính thức.</Text></View>
      <JlptActionButton label="詳しい解説を見る" onPress={() => { setReviewing(true); void persist({ status: 'reviewing' }); }} style={styles.resultAction} />
      <JlptActionButton kind="secondary" label="もう一度受験する" onPress={() => setRestartConfirmationVisible(true)} style={styles.resultAction} />
      <JlptActionButton kind="secondary" label="JLPT一覧へ戻る" onPress={onExit} style={styles.resultAction} />
    </JlptPaper></ScrollView>
    <JlptRestartConfirmation visible={restartConfirmationVisible} onCancel={() => setRestartConfirmationVisible(false)} onConfirm={confirmRestartSavedSession} />
  </View>;

  if (submitted && reviewing) {
    const filtered = questions.filter((question) => reviewFilter === 'all' || reviewFilter === 'wrong' && !!answers[question.id] && answers[question.id] !== question.correctOptionId || reviewFilter === 'unanswered' && !answers[question.id]);
    return <View style={styles.screen}>
      <JlptExamHeader title="詳しい解説" subtitle="提出後の確認" onBack={() => { setReviewing(false); void persist({ status: 'submitted' }); }} />
      <View style={styles.reviewFilters}>{(['all','wrong','unanswered'] as const).map((filter) => <Pressable key={filter} onPress={() => setReviewFilter(filter)} style={[styles.reviewFilter, reviewFilter === filter && styles.reviewFilterActive]}><Text style={[styles.reviewFilterText, reviewFilter === filter && styles.reviewFilterTextActive]}>{filter === 'all' ? 'すべて' : filter === 'wrong' ? '不正解' : '未回答'}</Text></Pressable>)}</View>
      <ScrollView contentContainerStyle={styles.content}><JlptPaper>
        {filtered.length ? filtered.map((question, index) => {
          const previous = filtered[index - 1];
          const firstForSegment = !!question.audio && (index === 0 || filtered[index - 1].audio?.segmentId !== question.audio.segmentId);
          const firstForPassage = !question.passageId || previous?.passageId !== question.passageId;
          const isPlaying = !!question.audio && activeAudioSegment === question.audio.segmentId && audioPlaying;
          return <View key={question.id}>
            {firstForSegment ? <View style={styles.audioControls}><JlptActionButton disabled={audioPlaying} label={isPlaying ? '再生中' : 'この問題の音声を再生する'} onPress={() => void playListening(question)} />{mode === 'practice' ? <JlptActionButton kind="secondary" disabled={!isPlaying} label="一時停止" onPress={pauseListening} /> : null}</View> : null}
            <QuestionBlock question={question} scale={fontScale} selected={answers[question.id]} submitted explanation={exam.explanationFor?.(question.id, getCurrentAppLanguage())} visualOptions={exam.visualOptions} showPassage={firstForPassage} showTranscript={!question.audio || firstForSegment} onChoose={choose} onLayout={() => undefined} onFocus={() => undefined} />
          </View>;
        }) : <Text style={styles.emptyReview}>該当する問題はありません。</Text>}
      </JlptPaper></ScrollView>
    </View>;
  }

  return <View style={styles.screen}>
    <JlptExamHeader title="N1 · JLPT模擬試験" subtitle="日本語能力試験" onBack={exitExam} />
    <View style={styles.toolRow}>
      <View><Text style={styles.progress}>{answeredIds.size}/{questions.length} 回答済み</Text><Text style={styles.modeIndicator}>{mode === 'exam' ? '試験モード' : '練習モード'}</Text></View>
      <JlptFontControls scale={fontScale} onSmaller={() => changeFont(-1)} onLarger={() => changeFont(1)} />
      <Pressable accessibilityRole="button" onPress={() => setNavigatorVisible(true)} style={styles.navigatorButton}><Text style={styles.navigatorButtonText}>問題一覧</Text></Pressable>
    </View>
    <JlptProgressBar answered={answeredIds.size} total={questions.length} />
    <ScrollView ref={scrollRef} contentOffset={{ x: 0, y: initialScrollY }} onMomentumScrollEnd={saveScroll} contentContainerStyle={styles.content}>
      <JlptPaper>
        <Text style={styles.sectionTitle}>言語知識（文字・語彙・文法）・読解</Text>
        {written.map((question, index) => {
          const previous = written[index - 1];
          const firstInProblem = !previous || previous.sectionId !== question.sectionId || previous.problemNumber !== question.problemNumber;
          const firstForPassage = !question.passageId || previous?.passageId !== question.passageId;
          return <QuestionBlock key={question.id} question={question} scale={fontScale} selected={answers[question.id]} submitted={false} visualOptions={exam.visualOptions} showProblemHeading={firstInProblem} showInstruction={firstInProblem} showPassage={firstForPassage} onChoose={choose} onLayout={(event) => registerPosition(question.id, event)} onFocus={() => setCurrentQuestion(question.id)} />;
        })}
        <View style={styles.majorDivider} />
        <Text style={styles.sectionTitle}>聴解</Text>
        {listening.map((question, index) => {
          const previous = listening[index - 1];
          const firstInProblem = !previous || previous.problemNumber !== question.problemNumber;
          const firstForSegment = index === 0 || listening[index - 1].audio?.segmentId !== question.audio?.segmentId;
          const played = !!question.audio && playedAudioSegments.includes(question.audio.segmentId);
          const isPlaying = !!question.audio && activeAudioSegment === question.audio.segmentId && audioPlaying;
          return <View key={question.id}>
            {firstInProblem ? <><JlptSectionHeading problem={problemLabel(question)} detail={familyLabel(question)} /><JlptInstruction scale={fontScale}>{question.instructionJa}</JlptInstruction></> : null}
            {firstForSegment && question.audio ? <View style={styles.audioControls}>
              <JlptActionButton
                disabled={audioPlaying || (mode === 'exam' && played)}
                label={isPlaying ? '再生中' : mode === 'exam' && played ? '再生済み' : `${question.label}を再生する`}
                onPress={() => void playListening(question)}
              />
              {mode === 'practice' ? <JlptActionButton kind="secondary" disabled={!isPlaying} label="一時停止" onPress={pauseListening} /> : null}
            </View> : null}
            <QuestionBlock question={question} scale={fontScale} selected={answers[question.id]} submitted={false} visualOptions={exam.visualOptions} showProblemHeading={false} showInstruction={false} showPassage={false} onChoose={choose} onLayout={(event) => registerPosition(question.id, event)} onFocus={() => setCurrentQuestion(question.id)} />
          </View>;
        })}
        <JlptActionButton label="答案を提出する" onPress={requestSubmit} style={styles.submit} />
      </JlptPaper>
    </ScrollView>
    <JlptQuestionNavigator visible={navigatorVisible} labels={questions.map((question) => question.id)} answered={answeredIds} current={currentQuestion} onChoose={goToQuestion} onClose={() => setNavigatorVisible(false)} />
    <JlptSubmitConfirmation visible={submitConfirmationVisible} total={questions.length} answered={answeredIds.size} onCancel={() => setSubmitConfirmationVisible(false)} onSubmit={submit} />
  </View>;
}

function QuestionBlock({ question, scale, selected, submitted, explanation, visualOptions, showProblemHeading = true, showInstruction = true, showPassage = true, showTranscript = true, onChoose, onLayout, onFocus }: { question: TrialQuestion; scale: number; selected?: string; submitted: boolean; explanation?: string; visualOptions: Readonly<Record<number, ImageSourcePropType>>; showProblemHeading?: boolean; showInstruction?: boolean; showPassage?: boolean; showTranscript?: boolean; onChoose: (questionId: string, optionId: string) => void; onLayout: (event: LayoutChangeEvent) => void; onFocus: () => void }) {
  return <View onLayout={onLayout} style={styles.questionBlock}>
    {showProblemHeading ? <JlptSectionHeading problem={problemLabel(question)} detail={familyLabel(question)} /> : null}
    {showInstruction ? <JlptInstruction scale={scale}>{question.instructionJa}</JlptInstruction> : null}
    {showPassage && question.passageJa ? <JlptReadingPassage scale={scale}>{question.passageJa}</JlptReadingPassage> : null}
    <Text style={styles.questionNumber}>{displayQuestionNumber(question)}</Text>
    <JlptQuestionText scale={scale} style={question.family === 'sentenceComposition' ? styles.starQuestion : undefined}>{question.promptJa}</JlptQuestionText>
    {question.visualOptionPage && visualOptions[question.visualOptionPage] ? <Image source={visualOptions[question.visualOptionPage]} resizeMode="contain" style={[styles.visualOptions, question.visualOptionPage === 12 ? styles.visualOptionsPage12 : styles.visualOptionsPage13]} accessibilityLabel={`${question.label}の選択肢図`} /> : null}
    {question.family === 'sentenceComposition' ? <Text style={styles.starNote}>★ に入るものを一つ選んでください。</Text> : null}
    <View accessibilityRole="radiogroup" onTouchStart={onFocus} style={styles.options}>
      {question.options.map((option) => <JlptAnswerOption key={option.id} number={option.id} selected={selected === option.id} disabled={submitted} scale={scale} onPress={() => { onFocus(); onChoose(question.id, option.id); }}>{option.textJa}</JlptAnswerOption>)}
    </View>
    {submitted ? <><JlptReviewFeedback correct={selected === question.correctOptionId} answer={question.correctOptionId} sourcePage={question.sourcePage} /><Text style={styles.sourceReference}>問題PDF：{question.sourcePage}ページ　解答PDF：{question.answerSourcePage}ページ</Text><Text style={styles.explanationPending}>{explanation ?? `この問題の詳しい解説は現在準備中です。\nPhần giải thích chi tiết của câu này đang được chuẩn bị.`}</Text>{showTranscript && question.audio?.transcriptJa ? <View style={styles.transcriptBlock}><Text style={styles.transcriptTitle}>聴解スクリプト（解答PDF {question.audio.transcriptSourcePage}ページ）</Text><Text style={styles.transcript}>{question.audio.transcriptJa}</Text></View> : null}</> : null}
  </View>;
}

function ResultMetric({ label, value, tone }: { label: string; value: string | number; tone?: 'correct' | 'wrong' }) {
  return <View style={styles.resultMetric}><Text style={styles.resultMetricLabel}>{label}</Text><Text style={[styles.resultMetricValue, tone === 'correct' && styles.resultCorrect, tone === 'wrong' && styles.resultWrong]}>{value}</Text></View>;
}

function calculateResult(questions: readonly TrialQuestion[], answers: Record<string, string>) {
  const correct = questions.filter((question) => answers[question.id] === question.correctOptionId).length;
  const unanswered = questions.filter((question) => !answers[question.id]).length;
  return { correct, wrong: questions.length - correct - unanswered, unanswered, total: questions.length };
}

function formatSavedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '不明' : date.toLocaleString('ja-JP');
}

function questionPositionLabel(questions: readonly TrialQuestion[], questionId: string) {
  const index = questions.findIndex((question) => question.id === questionId);
  const question = questions[index];
  return question ? `${question.label}（${index + 1}/${questions.length}）` : '先頭';
}

function problemLabel(question: TrialQuestion) {
  const match = question.label.match(/問題\d+/);
  return match?.[0] ?? question.label;
}

function familyLabel(question: TrialQuestion) {
  if (question.family === 'vocabulary') return '文字・語彙';
  if (question.family === 'grammar' || question.family === 'sentenceComposition') return '文法';
  if (question.family === 'reading') return '読解';
  return '聴解';
}

function displayQuestionNumber(question: TrialQuestion) {
  if (question.family !== 'listening') return `${question.questionNumber}`;
  const parts = question.label.split('／');
  return parts.slice(2).join('／');
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:JLPT_EXAM.color.page},startScreen:{flex:1,backgroundColor:JLPT_EXAM.color.page},startPage:{flexGrow:1,justifyContent:'center',padding:16,backgroundColor:JLPT_EXAM.color.page},examName:{fontFamily:JLPT_EXAM.font.content,fontSize:24,lineHeight:34,color:JLPT_EXAM.color.ink,textAlign:'center'},trialName:{fontFamily:JLPT_EXAM.font.interface,fontSize:15,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,textAlign:'center',marginTop:4},rule:{height:2,backgroundColor:JLPT_EXAM.color.ink,marginVertical:20},startCopy:{fontFamily:JLPT_EXAM.font.content,fontSize:16,lineHeight:27,color:JLPT_EXAM.color.ink},modeLabel:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:23,color:JLPT_EXAM.color.ink,marginTop:24,marginBottom:9},modeRow:{minHeight:70,flexDirection:'row',alignItems:'center',gap:12,padding:12,borderWidth:1,borderColor:JLPT_EXAM.color.divider,marginBottom:10},modeSelected:{borderColor:JLPT_EXAM.color.selected,backgroundColor:JLPT_EXAM.color.selectedFill},radio:{width:22,height:22,borderRadius:11,borderWidth:2,borderColor:JLPT_EXAM.color.secondaryInk},radioSelected:{borderWidth:6,borderColor:JLPT_EXAM.color.selected,backgroundColor:JLPT_EXAM.color.paper},modeCopy:{flex:1},modeTitle:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:23,color:JLPT_EXAM.color.ink},modeDescription:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.secondaryInk,marginTop:3},startAction:{marginTop:14},
  toolRow:{minHeight:58,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,paddingHorizontal:10,paddingVertical:7,backgroundColor:JLPT_EXAM.color.paper,borderBottomWidth:1,borderBottomColor:JLPT_EXAM.color.divider},progress:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:19,color:JLPT_EXAM.color.ink},modeIndicator:{fontFamily:JLPT_EXAM.font.interface,fontSize:12,lineHeight:17,color:JLPT_EXAM.color.secondaryInk},navigatorButton:{minWidth:68,minHeight:44,alignItems:'center',justifyContent:'center',paddingHorizontal:8,borderWidth:1,borderColor:JLPT_EXAM.color.divider},navigatorButtonText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,color:JLPT_EXAM.color.ink},content:{paddingVertical:12,paddingHorizontal:8,backgroundColor:JLPT_EXAM.color.page},sectionTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:JLPT_EXAM.type.sectionTitle,lineHeight:31,color:JLPT_EXAM.color.ink,marginBottom:22},questionBlock:{paddingBottom:28,marginBottom:26,borderBottomWidth:1,borderBottomColor:JLPT_EXAM.color.divider},questionNumber:{fontFamily:JLPT_EXAM.font.content,fontSize:19,lineHeight:27,color:JLPT_EXAM.color.ink,marginBottom:6},options:{width:'100%'},visualOptions:{width:'100%',marginBottom:16},visualOptionsPage12:{aspectRatio:430/350},visualOptionsPage13:{aspectRatio:620/410},starQuestion:{letterSpacing:1.5},starNote:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.secondaryInk,marginTop:-7,marginBottom:12},majorDivider:{height:3,backgroundColor:JLPT_EXAM.color.ink,marginVertical:16},audioControls:{flexDirection:'row',gap:8,marginBottom:22},transcriptBlock:{borderWidth:1,borderColor:JLPT_EXAM.color.divider,padding:16,marginTop:12},transcriptTitle:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:23,color:JLPT_EXAM.color.ink,marginBottom:10},transcript:{fontFamily:JLPT_EXAM.font.content,color:JLPT_EXAM.color.ink,lineHeight:26},submit:{marginTop:10},
  savedResult:{marginTop:24,paddingTop:20,borderTopWidth:1,borderTopColor:JLPT_EXAM.color.divider},savedResultTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:18,lineHeight:27,color:JLPT_EXAM.color.ink},savedResultText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.secondaryInk,marginVertical:8},savedResultAction:{marginTop:8},sourceReference:{fontFamily:JLPT_EXAM.font.interface,fontSize:13,lineHeight:20,color:JLPT_EXAM.color.secondaryInk,marginTop:8},
  resultPage:{flexGrow:1,padding:16,backgroundColor:JLPT_EXAM.color.page},resultTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:28,lineHeight:38,color:JLPT_EXAM.color.ink,textAlign:'center'},resultMode:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,textAlign:'center',marginTop:5,marginBottom:20},scoreGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},resultMetric:{flexGrow:1,flexBasis:'45%',minHeight:90,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:JLPT_EXAM.color.divider,padding:12},resultMetricLabel:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,color:JLPT_EXAM.color.secondaryInk},resultMetricValue:{fontFamily:JLPT_EXAM.font.content,fontSize:27,lineHeight:37,color:JLPT_EXAM.color.ink,marginTop:4},resultCorrect:{color:JLPT_EXAM.color.correct},resultWrong:{color:JLPT_EXAM.color.wrong},rawScore:{fontFamily:JLPT_EXAM.font.content,fontSize:18,lineHeight:27,color:JLPT_EXAM.color.ink,textAlign:'center',marginTop:18},notEligible:{marginTop:18,padding:16,borderLeftWidth:4,borderLeftColor:JLPT_EXAM.color.unanswered,backgroundColor:JLPT_EXAM.color.paper},notEligibleTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:19,lineHeight:27,color:JLPT_EXAM.color.unanswered},notEligibleText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:23,color:JLPT_EXAM.color.secondaryInk,marginTop:7},resultAction:{marginTop:10},
  reviewFilters:{flexDirection:'row',gap:8,padding:10,backgroundColor:JLPT_EXAM.color.page,borderBottomWidth:1,borderBottomColor:JLPT_EXAM.color.divider},reviewFilter:{flex:1,minHeight:44,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:JLPT_EXAM.color.divider},reviewFilterActive:{backgroundColor:JLPT_EXAM.color.selectedFill,borderColor:JLPT_EXAM.color.selectedBorder},reviewFilterText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,color:JLPT_EXAM.color.secondaryInk},reviewFilterTextActive:{color:JLPT_EXAM.color.selected},emptyReview:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:25,color:JLPT_EXAM.color.secondaryInk,textAlign:'center',paddingVertical:30},explanationPending:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,marginTop:10,padding:12,borderWidth:1,borderColor:JLPT_EXAM.color.divider},
});
