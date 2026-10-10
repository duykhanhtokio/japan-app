import JlptStudyBackground from './JlptStudyBackground';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Image, Pressable, ScrollView, StyleSheet, Text, View, type ImageSourcePropType, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Asset } from 'expo-asset';

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
import { JLPT_EXAM, type JlptFontScale } from '@/theme/jlpt-exam-design-system';
import { clearJlptTrialSession, loadJlptTrialSession, saveJlptTrialSession, type N1TrialSession } from '@/services/jlpt-trial-session-storage';
import { getJlptListeningStart } from '@/services/jlpt-listening-start-storage';
import { loadJlptAttemptSummary, recordJlptAttempt } from '@/services/jlpt-exam-attempt-history';

type Mode = 'exam' | 'practice';
const CONTINUOUS_AUDIO_ID = '__full_listening_track__';
const FONT_SCALES: readonly JlptFontScale[] = [0.9, 1, 1.1, 1.2, 1.3, 1.4];
export default function N1OfficialTrial({ onExit, registerExit, exam, initialSession }: { onExit: () => void; registerExit: (handler: (() => void) | null) => void; exam: ApprovedN1Exam; initialSession?: N1TrialSession | null }) {
  const questions = exam.questions;
  const listening = questions.filter((question) => question.family === 'listening');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [sessionReady, setSessionReady] = useState(initialSession !== undefined);
  const [mode, setMode] = useState<Mode>('exam');
  const [fontScale, setFontScale] = useState<JlptFontScale>(1);
  const [navigatorVisible, setNavigatorVisible] = useState(false);
  const [submitConfirmationVisible, setSubmitConfirmationVisible] = useState(false);
  const [restartConfirmationVisible, setRestartConfirmationVisible] = useState(false);
  const savedCompleted = initialSession?.started && (initialSession.status === 'submitted' || initialSession.status === 'reviewing' || initialSession.submitted);
  const [pendingSession, setPendingSession] = useState<N1TrialSession | null>(initialSession?.started && !savedCompleted ? initialSession : null);
  const [completedSession, setCompletedSession] = useState<N1TrialSession | null>(savedCompleted ? initialSession ?? null : null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'unanswered'>('all');
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0].id);
  const [playedAudioSegments, setPlayedAudioSegments] = useState<string[]>([]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const compactN5Listening = exam.id === 'n5-2021-12-exam-07';
  const listeningStartMs = getJlptListeningStart(exam.id);
  const listeningPosition = useRef(0);
  const lastSavedAudioSecond = useRef(0);
  const [initialScrollY, setInitialScrollY] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<Record<string, number>>({});
  const playbackGeneration = useRef(0);
  const pendingAudioStart = useRef(false);
  const exitInProgress = useRef(false);
  const latestExit = useRef<() => void>(() => undefined);
  const latestBackgroundPause = useRef<() => void>(() => undefined);
  const player = useAudioPlayer(exam.audioSource, { updateInterval: 100 });
  const playerStatus = useAudioPlayerStatus(player);

  useEffect(() => { void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false }); }, []);
  useEffect(() => {
    if (!playerStatus.isLoaded) return;
    setAudioError(null);
    if (pendingAudioStart.current) {
      pendingAudioStart.current = false;
      void playListening();
    }
  }, [playerStatus.isLoaded]);

  const answeredIds = useMemo(() => new Set(Object.keys(answers)), [answers]);

  useEffect(() => {
    if (initialSession !== undefined) return;
    let active = true;
    void loadJlptTrialSession(exam.storageKey).then((session) => {
      if (!active || !session || !session.started) return;
      if (session.status === 'submitted' || session.status === 'reviewing' || session.submitted) setCompletedSession(session);
      else setPendingSession(session);
    }).catch((error) => { console.warn('Load JLPT session:', error); }).finally(() => { if (active) setSessionReady(true); });
    return () => { active = false; };
  }, [exam.storageKey, initialSession]);

  latestExit.current = () => { void exitExam(); };
  latestBackgroundPause.current = () => { if (audioPlaying) pauseListening(); };
  useEffect(() => {
    registerExit(() => latestExit.current());
    return () => registerExit(null);
  }, [registerExit]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') latestBackgroundPause.current();
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!audioPlaying) return;
    const seconds = playerStatus.currentTime;
    if (playerStatus.playing && seconds >= listeningStartMs / 1000) listeningPosition.current = Math.round(seconds * 1000);
    if (playerStatus.didJustFinish || playerStatus.duration > listeningStartMs / 1000 && seconds >= playerStatus.duration - 0.2 && !playerStatus.playing) {
      listeningPosition.current = 0;
      setAudioPlaying(false);
      void persist({ listeningPositionMs: 0 });
    } else if (playerStatus.playing && seconds >= listeningStartMs / 1000 && Math.floor(seconds / 5) > lastSavedAudioSecond.current) {
      lastSavedAudioSecond.current = Math.floor(seconds / 5);
      listeningPosition.current = Math.round(seconds * 1000);
      if (!submitted) void persist({ listeningPositionMs: listeningPosition.current });
    }
  }, [audioPlaying, playerStatus.currentTime, playerStatus.didJustFinish, playerStatus.duration, playerStatus.playing]);

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

  async function playListening() {
    if (audioPlaying || (mode === 'exam' && !submitted && playedAudioSegments.includes(CONTINUOUS_AUDIO_ID) && !listeningPosition.current)) return;
    if (!playerStatus.isLoaded) {
      pendingAudioStart.current = true;
      setAudioError('音声を読み込み中です。読み込み後に再生します。');
      return;
    }
    const generation = playbackGeneration.current + 1;
    playbackGeneration.current = generation;
    setAudioError(null);
    try {
      await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false });
      player.pause();
      const resumeSeconds = Math.max(listeningStartMs / 1000, listeningPosition.current / 1000);
      if (playerStatus.duration > 0 && resumeSeconds >= playerStatus.duration) {
        listeningPosition.current = 0;
        throw new Error('音声の開始位置がファイルの長さを超えています。');
      }
      lastSavedAudioSecond.current = Math.floor(resumeSeconds / 5);
      await player.seekTo(resumeSeconds);
      if (playbackGeneration.current !== generation) return;
      player.play();
      setAudioPlaying(true);
      if (mode === 'exam' && !submitted && !playedAudioSegments.includes(CONTINUOUS_AUDIO_ID)) {
        const nextPlayed = [...playedAudioSegments, CONTINUOUS_AUDIO_ID];
        setPlayedAudioSegments(nextPlayed);
        listeningPosition.current = listeningStartMs;
        void persist({ playedAudioSegments: nextPlayed, listeningPositionMs: listeningPosition.current });
      }
    } catch (error) {
      setAudioError(error instanceof Error ? error.message : String(error));
    }
  }

  function pauseListening() {
    pendingAudioStart.current = false;
    if (!audioPlaying) return;
    playbackGeneration.current += 1;
    listeningPosition.current = Math.max(listeningPosition.current, Math.round(player.currentTime * 1000));
    player.pause();
    setAudioPlaying(false);
    void persist({ listeningPositionMs: listeningPosition.current });
  }

  function exitExam() {
    if (exitInProgress.current) return;
    exitInProgress.current = true;
    playbackGeneration.current += 1;
    pendingAudioStart.current = false;
    if (audioPlaying) listeningPosition.current = Math.max(listeningPosition.current, Math.round(player.currentTime * 1000));
    player.pause();
    setAudioPlaying(false);
    if (started && !submitted) void persist({ listeningPositionMs: listeningPosition.current }).catch(() => { /* Keep the last periodic save. */ });
    onExit();
  }

  function persist(overrides: Partial<Omit<N1TrialSession, 'version' | 'updatedAt'>> = {}) {
    return saveJlptTrialSession(exam.storageKey, { answers, mode, status: submitted ? reviewing ? 'reviewing' : 'submitted' : started ? 'in_progress' : 'not_started', started, submitted, currentQuestion, scrollY: initialScrollY, playedAudioSegments, listeningPositionMs: listeningPosition.current, submittedAt, result: submitted ? calculateResult(questions, answers) : null, ...overrides });
  }

  function begin() {
    playbackGeneration.current += 1;
    pendingAudioStart.current = false;
    player.pause();
    setAudioPlaying(false);
    setAnswers({});
    setSubmitted(false);
    setCurrentQuestion(questions[0].id);
    setInitialScrollY(0);
    setPlayedAudioSegments([]);
    listeningPosition.current = 0;
    lastSavedAudioSecond.current = 0;
    setPendingSession(null);
    setStarted(true);
    setMode('exam');
    setCompletedSession(null);
    setReviewing(false);
    setSubmittedAt(null);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    void clearJlptTrialSession(exam.storageKey).then(() => saveJlptTrialSession(exam.storageKey, { answers: {}, mode: 'exam', status: 'in_progress', started: true, submitted: false, currentQuestion: questions[0].id, scrollY: 0, playedAudioSegments: [], listeningPositionMs: 0, submittedAt: null, result: null }));
  }

  function continueSession() {
    if (!pendingSession) return;
    setAnswers(pendingSession.answers);
    setMode('exam');
    setSubmitted(false);
    setCurrentQuestion(pendingSession.currentQuestion || questions[0].id);
    setInitialScrollY(pendingSession.scrollY);
    setPlayedAudioSegments(pendingSession.playedAudioSegments);
    listeningPosition.current = pendingSession.listeningPositionMs ?? 0;
    setPendingSession(null);
    setStarted(true);
    void saveJlptTrialSession(exam.storageKey, { ...pendingSession, mode: 'exam' });
  }

  function requestRestartSavedSession() {
    setRestartConfirmationVisible(true);
  }

  function confirmRestartSavedSession() {
    // Keep the current confirmation visible until the new exam can begin.
    void loadJlptAttemptSummary(exam.storageKey).then(() => {
      begin();
      setRestartConfirmationVisible(false);
    }).catch((error) => { console.warn('Restart JLPT session:', error); });
  }

  function submit() {
    playbackGeneration.current += 1;
    pendingAudioStart.current = false;
    listeningPosition.current = 0;
    player.pause();
    setAudioPlaying(false);
    setSubmitConfirmationVisible(false);
    setSubmitted(true);
    setReviewing(false);
    const now = new Date().toISOString();
    setSubmittedAt(now);
    const result = calculateResult(questions, answers);
    void persist({ status: 'submitted', submitted: true, submittedAt: now, result }).then(() => recordJlptAttempt(exam.storageKey, result, now));
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
    listeningPosition.current = 0;
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

  function continuousListeningControls() {
    const alreadyFinished = mode === 'exam' && !submitted && playedAudioSegments.includes(CONTINUOUS_AUDIO_ID) && !listeningPosition.current;
    return <View style={styles.audioControls}>
      <JlptActionButton
        disabled={audioPlaying || alreadyFinished}
        label={compactN5Listening ? audioPlaying ? '再生中' : alreadyFinished ? '再生済み' : listeningPosition.current ? '続きから再生' : '聴解を再生' : audioPlaying ? '聴解を連続再生中' : alreadyFinished ? '聴解は再生済み' : listeningPosition.current ? '聴解の続きから再生する' : '聴解全体を再生する'}
        onPress={() => void playListening()}
        style={compactN5Listening ? styles.compactAudioButton : undefined}
      />
      <JlptActionButton kind="secondary" disabled={!audioPlaying} label="一時停止" onPress={pauseListening} style={compactN5Listening ? styles.compactAudioButton : undefined} />
      {audioError ? <Text style={styles.audioError}>{audioError}</Text> : null}
    </View>;
  }

  if (!sessionReady) return <JlptStudyBackground><JlptExamHeader title={`${exam.level} · JLPT模擬試験`} transparent onBack={() => void exitExam()} /></JlptStudyBackground>;
  if (!started && restartConfirmationVisible) return <JlptStudyBackground><JlptRestartConfirmation visible inline onCancel={() => setRestartConfirmationVisible(false)} onConfirm={confirmRestartSavedSession} /></JlptStudyBackground>;
  if (!started && pendingSession) return <JlptResumePrompt
      visible
      examName={`${exam.title}・${exam.periodLabel}`}
      updatedAt={formatSavedAt(pendingSession.updatedAt)}
      answered={Object.keys(pendingSession.answers).length}
      total={questions.length}
      currentLabel={`${questionPositionLabel(questions, pendingSession.currentQuestion)}${pendingSession.listeningPositionMs ? `・聴解 ${formatListeningPosition(pendingSession.listeningPositionMs)} から再開できます` : ''}`}
      onContinue={continueSession}
      onRestart={requestRestartSavedSession}
      onCancel={exitExam}
    />;

  if (!started) return <View style={styles.startScreen}><JlptExamHeader title={`${exam.level} · JLPT模擬試験`} subtitle="日本語能力試験" transparent onBack={() => void exitExam()} /><ScrollView contentContainerStyle={styles.startPage}>
    <JlptPaper style={styles.startPaper}>
      <Text style={styles.examName}>{exam.title}</Text>
      <Text style={styles.trialName}>{exam.periodLabel}</Text>
      <View style={styles.rule} />
      <Text style={styles.startCopy}>全{questions.length}問を収録しています。提出後に正誤と正答を確認できます。</Text>
      <Text style={styles.startCopy}>聴解は連続再生されます。保存した位置から再開でき、正答は提出後に確認できます。</Text>
      <JlptActionButton label={exam.startLabel} onPress={begin} style={styles.startAction} />
      {completedSession ? <View style={styles.savedResult}>
        <Text style={styles.savedResultTitle}>提出済みの結果があります</Text>
        <Text style={styles.savedResultText}>{formatSavedAt(completedSession.submittedAt ?? completedSession.updatedAt)}</Text>
        <JlptActionButton label="結果を見る" onPress={() => openCompleted(false)} />
        <JlptActionButton kind="secondary" label="解答を確認する" onPress={() => openCompleted(true)} style={styles.savedResultAction} />
        <JlptActionButton kind="secondary" label="もう一度受験する" onPress={requestRestartSavedSession} style={styles.savedResultAction} />
      </View> : null}
    </JlptPaper>
  </ScrollView>

    {restartConfirmationVisible && <JlptRestartConfirmation visible={restartConfirmationVisible} onCancel={() => setRestartConfirmationVisible(false)} onConfirm={confirmRestartSavedSession} />}
  </View>;

  const written = questions.filter((question) => question.family !== 'listening');

  const correctCount = questions.filter((question) => answers[question.id] === question.correctOptionId).length;
  const unansweredCount = questions.filter((question) => !answers[question.id]).length;
  const wrongCount = questions.length - correctCount - unansweredCount;

  if (submitted && !reviewing) return <View style={styles.screen}>
    <JlptExamHeader title={`${exam.level} · 試験結果`} subtitle={exam.periodLabel} onBack={exitExam} />
    <ScrollView contentContainerStyle={styles.resultPage}><JlptPaper>
      <Text style={styles.resultTitle}>試験結果</Text>
      <Text style={styles.resultMode}>{formatSavedAt(submittedAt ?? '')}</Text>
      <View style={styles.scoreGrid}>
        <ResultMetric label="正解" value={correctCount} tone="correct" />
        <ResultMetric label="不正解" value={wrongCount} tone="wrong" />
        <ResultMetric label="未回答" value={unansweredCount} />
        <ResultMetric label="正答率" value={`${Math.round((correctCount / questions.length) * 100)}%`} />
      </View>
      <Text style={styles.rawScore}>正答数：{correctCount}/{questions.length}</Text>
      <View style={styles.notEligible}><Text style={styles.notEligibleTitle}>素点による結果</Text><Text style={styles.notEligibleText}>公式の尺度得点への換算式は公開されていないため、正答数のみを表示します。正答率をJLPT公式得点や合否に置き換えていません。</Text></View>
      <JlptActionButton label="解答を確認する" onPress={() => { setReviewing(true); void persist({ status: 'reviewing' }); }} style={styles.resultAction} />
      <JlptActionButton kind="secondary" label="もう一度受験する" onPress={() => setRestartConfirmationVisible(true)} style={styles.resultAction} />
      <JlptActionButton kind="secondary" label="JLPT一覧へ戻る" onPress={exitExam} style={styles.resultAction} />
    </JlptPaper></ScrollView>
    {restartConfirmationVisible && <JlptRestartConfirmation visible={restartConfirmationVisible} onCancel={() => setRestartConfirmationVisible(false)} onConfirm={confirmRestartSavedSession} />}
  </View>;

  if (submitted && reviewing) {
    const filtered = questions.filter((question) => reviewFilter === 'all' || reviewFilter === 'wrong' && !!answers[question.id] && answers[question.id] !== question.correctOptionId || reviewFilter === 'unanswered' && !answers[question.id]);
    return <View style={styles.screen}>
      <JlptExamHeader title="解答の確認" subtitle="提出後の確認" onBack={() => { playbackGeneration.current += 1; player.pause(); setAudioPlaying(false); listeningPosition.current = 0; setReviewing(false); void persist({ status: 'submitted', listeningPositionMs: 0 }); }} />
      <View style={styles.reviewFilters}>{(['all','wrong','unanswered'] as const).map((filter) => <Pressable key={filter} onPress={() => setReviewFilter(filter)} style={[styles.reviewFilter, reviewFilter === filter && styles.reviewFilterActive]}><Text style={[styles.reviewFilterText, reviewFilter === filter && styles.reviewFilterTextActive]}>{filter === 'all' ? 'すべて' : filter === 'wrong' ? '不正解' : '未回答'}</Text></Pressable>)}</View>
      <ScrollView contentContainerStyle={styles.content}><JlptPaper>
        {filtered.some((question) => !!question.audio) ? continuousListeningControls() : null}
        {filtered.length ? filtered.map((question, index) => {
          const previous = filtered[index - 1];
          const firstForPassage = !question.passageId || previous?.passageId !== question.passageId;
          return <View key={question.id}>
            <QuestionBlock question={question} scale={fontScale} selected={answers[question.id]} submitted visualOptions={exam.visualOptions} showPassage={firstForPassage} onChoose={choose} onLayout={() => undefined} onFocus={() => undefined} />
          </View>;
        }) : <Text style={styles.emptyReview}>該当する問題はありません。</Text>}
      </JlptPaper></ScrollView>
    </View>;
  }

  return <View style={styles.screen}>
    <JlptExamHeader title={`${exam.level} · JLPT模擬試験`} subtitle="日本語能力試験" onBack={exitExam} />
    <View style={styles.toolRow}>
      <Text style={styles.progress}>{answeredIds.size}/{questions.length} 回答済み</Text>
      <JlptFontControls scale={fontScale} onSmaller={() => changeFont(-1)} onLarger={() => changeFont(1)} />
      <Pressable accessibilityRole="button" onPress={() => setNavigatorVisible(true)} style={styles.navigatorButton}><Text style={styles.navigatorButtonText}>問題一覧</Text></Pressable>
    </View>
    <JlptProgressBar answered={answeredIds.size} total={questions.length} />
    {compactN5Listening ? <View style={styles.stickyAudio}>{continuousListeningControls()}</View> : null}
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
        {compactN5Listening ? null : continuousListeningControls()}
        {listening.map((question, index) => {
          const previous = listening[index - 1];
          const firstInProblem = !previous || previous.problemNumber !== question.problemNumber;
          return <View key={question.id}>
            {firstInProblem ? <><JlptSectionHeading problem={problemLabel(question)} detail={familyLabel(question)} /><JlptInstruction scale={fontScale}>{question.instructionJa}</JlptInstruction></> : null}
            {!compactN5Listening && question.audio && (audioPlaying || listeningPosition.current > 0) ? <View style={styles.audioControls}>
              <JlptActionButton kind="secondary" label={audioPlaying ? '聴解を一時停止' : '保存位置から聴解を再開'} onPress={() => { if (audioPlaying) pauseListening(); else void playListening(); }} />
            </View> : null}
            <QuestionBlock question={question} scale={fontScale} selected={answers[question.id]} submitted={false} visualOptions={exam.visualOptions} showProblemHeading={false} showInstruction={false} showPassage={false} onChoose={choose} onLayout={(event) => registerPosition(question.id, event)} onFocus={() => setCurrentQuestion(question.id)} />
          </View>;
        })}
        <JlptActionButton label="答案を提出する" onPress={requestSubmit} style={styles.submit} />
      </JlptPaper>
    </ScrollView>
    {navigatorVisible && <JlptQuestionNavigator visible={navigatorVisible} labels={questions.map((question) => question.id)} answered={answeredIds} current={currentQuestion} onChoose={goToQuestion} onClose={() => setNavigatorVisible(false)} />}
    {submitConfirmationVisible && <JlptSubmitConfirmation visible={submitConfirmationVisible} total={questions.length} answered={answeredIds.size} onCancel={() => setSubmitConfirmationVisible(false)} onSubmit={submit} />}
  </View>;
}

function QuestionBlock({ question, scale, selected, submitted, visualOptions, showProblemHeading = true, showInstruction = true, showPassage = true, onChoose, onLayout, onFocus }: { question: TrialQuestion; scale: number; selected?: string; submitted: boolean; visualOptions: Readonly<Record<number, ImageSourcePropType>>; showProblemHeading?: boolean; showInstruction?: boolean; showPassage?: boolean; onChoose: (questionId: string, optionId: string) => void; onLayout: (event: LayoutChangeEvent) => void; onFocus: () => void }) {
  const imageSource = question.visualOptionPage ? visualOptions[question.visualOptionPage] : undefined;
  const imageSize = imageSource ? typeof Image.resolveAssetSource === 'function' ? Image.resolveAssetSource(imageSource)
    : typeof imageSource === 'number' ? Asset.fromModule(imageSource)
      : Array.isArray(imageSource) ? imageSource[0] : imageSource : undefined;
  const originalIllustration = question.id.startsWith('jpapp-') && Boolean(imageSource);
  const practicePair = originalIllustration && question.id.includes('-n5-') && question.visualOptionPage === 301;
  return <View onLayout={onLayout} style={styles.questionBlock}>
    {showProblemHeading ? <JlptSectionHeading problem={problemLabel(question)} detail={familyLabel(question)} /> : null}
    {showInstruction ? <JlptInstruction scale={scale}>{question.instructionJa}</JlptInstruction> : null}
    {showPassage && question.passageJa ? <JlptReadingPassage scale={scale}>{question.passageJa}</JlptReadingPassage> : null}
    <Text style={styles.questionNumber}>{displayQuestionNumber(question)}</Text>
    <JlptQuestionText scale={scale} style={question.family === 'sentenceComposition' ? styles.starQuestion : undefined}>{question.promptJa}</JlptQuestionText>
    {originalIllustration && imageSource ? <View style={styles.originalIllustration}>
      {practicePair ? <View style={styles.illustrationLabels}><Text style={styles.illustrationLabel}>練習（採点なし）</Text><Text style={styles.illustrationLabel}>本問１番</Text></View> : null}
      <View style={{ width: '100%', aspectRatio: imageSize?.width && imageSize?.height ? imageSize.width / imageSize.height : 3 / 2 }}>
        <Image fadeDuration={0} source={imageSource} resizeMode="contain" style={StyleSheet.absoluteFillObject} accessibilityLabel={`${question.label}の選択肢図`} />
      </View>
    </View> : imageSource ? <Image fadeDuration={0} source={imageSource} resizeMode="contain" style={[styles.visualOptions, question.visualOptionPage && question.visualOptionPage >= 101 && imageSize?.width && imageSize?.height ? { aspectRatio: imageSize.width / imageSize.height } : question.visualOptionPage === 12 ? styles.visualOptionsPage12 : styles.visualOptionsPage13]} accessibilityLabel={`${question.label}の選択肢図`} /> : null}
    {question.family === 'sentenceComposition' ? <Text style={styles.starNote}>★ に入るものを一つ選んでください。</Text> : null}
    <View accessibilityRole="radiogroup" onTouchStart={onFocus} style={styles.options}>
      {question.options.map((option) => <JlptAnswerOption key={option.id} number={option.id} selected={selected === option.id} disabled={submitted} scale={scale} onPress={() => { onFocus(); onChoose(question.id, option.id); }}>{option.textJa}</JlptAnswerOption>)}
    </View>
    {submitted ? <JlptReviewFeedback correct={selected === question.correctOptionId} answer={question.correctOptionId} unanswered={!selected} /> : null}
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

function formatListeningPosition(positionMs: number) {
  const seconds = Math.floor(positionMs / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
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
  originalIllustration:{width:'100%',marginTop:10,marginBottom:16},illustrationLabels:{flexDirection:'row',gap:16,marginBottom:8},illustrationLabel:{flex:1,textAlign:'center',fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.secondaryInk},
  screen:{flex:1,backgroundColor:'transparent'},startScreen:{flex:1,backgroundColor:'transparent'},startPage:{flexGrow:1,justifyContent:'center',padding:16,backgroundColor:'transparent'},startPaper:{backgroundColor:'transparent'},examName:{fontFamily:JLPT_EXAM.font.content,fontSize:24,lineHeight:34,color:JLPT_EXAM.color.ink,textAlign:'center'},trialName:{fontFamily:JLPT_EXAM.font.interface,fontSize:15,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,textAlign:'center',marginTop:4},rule:{height:2,backgroundColor:JLPT_EXAM.color.ink,marginVertical:20},startCopy:{fontFamily:JLPT_EXAM.font.content,fontSize:16,lineHeight:27,color:JLPT_EXAM.color.ink},modeLabel:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:23,color:JLPT_EXAM.color.ink,marginTop:24,marginBottom:9},modeRow:{minHeight:70,flexDirection:'row',alignItems:'center',gap:12,padding:12,borderWidth:1,borderColor:JLPT_EXAM.color.divider,marginBottom:10},modeSelected:{borderColor:JLPT_EXAM.color.selected,backgroundColor:JLPT_EXAM.color.selectedFill},radio:{width:22,height:22,borderRadius:11,borderWidth:2,borderColor:JLPT_EXAM.color.secondaryInk},radioSelected:{borderWidth:6,borderColor:JLPT_EXAM.color.selected,backgroundColor:JLPT_EXAM.color.paper},modeCopy:{flex:1},modeTitle:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:23,color:JLPT_EXAM.color.ink},modeDescription:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.secondaryInk,marginTop:3},startAction:{marginTop:14},
  toolRow:{minHeight:58,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,paddingHorizontal:10,paddingVertical:7,backgroundColor:'transparent',borderBottomWidth:1,borderBottomColor:JLPT_EXAM.color.divider},progress:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:19,color:JLPT_EXAM.color.ink},modeIndicator:{fontFamily:JLPT_EXAM.font.interface,fontSize:12,lineHeight:17,color:JLPT_EXAM.color.secondaryInk},navigatorButton:{minWidth:68,minHeight:44,alignItems:'center',justifyContent:'center',paddingHorizontal:8,borderWidth:1,borderColor:JLPT_EXAM.color.divider},navigatorButtonText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,color:JLPT_EXAM.color.ink},content:{width:'100%',paddingVertical:12,paddingHorizontal:8,backgroundColor:'transparent'},sectionTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:JLPT_EXAM.type.sectionTitle,lineHeight:31,color:JLPT_EXAM.color.ink,marginBottom:22},questionBlock:{width:'100%',paddingBottom:28,marginBottom:26,borderBottomWidth:1,borderBottomColor:JLPT_EXAM.color.divider},questionNumber:{fontFamily:JLPT_EXAM.font.content,fontSize:19,lineHeight:27,color:JLPT_EXAM.color.ink,marginBottom:6},options:{width:'100%'},visualOptions:{width:'100%',maxWidth:'100%',alignSelf:'center',marginBottom:16},visualOptionsPage12:{aspectRatio:430/350},visualOptionsPage13:{aspectRatio:620/410},starQuestion:{letterSpacing:1.5},starNote:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,marginTop:-7,color:JLPT_EXAM.color.secondaryInk},majorDivider:{height:3,backgroundColor:JLPT_EXAM.color.ink,marginVertical:16},audioControls:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:22},stickyAudio:{backgroundColor:'transparent',paddingHorizontal:10,paddingTop:8},compactAudioButton:{flex:1,minWidth:0},audioError:{width:'100%',fontFamily:JLPT_EXAM.font.interface,fontSize:13,color:JLPT_EXAM.color.ink},submit:{marginTop:10},
  savedResult:{marginTop:24,paddingTop:20,borderTopWidth:1,borderTopColor:JLPT_EXAM.color.divider},savedResultTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:18,lineHeight:27,color:JLPT_EXAM.color.ink},savedResultText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:21,color:JLPT_EXAM.color.secondaryInk,marginVertical:8},savedResultAction:{marginTop:8},
  resultPage:{flexGrow:1,padding:16,backgroundColor:'transparent'},resultTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:28,lineHeight:38,color:JLPT_EXAM.color.ink,textAlign:'center'},resultMode:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:22,color:JLPT_EXAM.color.secondaryInk,textAlign:'center',marginTop:5,marginBottom:20},scoreGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},resultMetric:{flexGrow:1,flexBasis:'45%',minHeight:90,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:JLPT_EXAM.color.divider,padding:12},resultMetricLabel:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,color:JLPT_EXAM.color.secondaryInk},resultMetricValue:{fontFamily:JLPT_EXAM.font.content,fontSize:27,lineHeight:37,color:JLPT_EXAM.color.ink,marginTop:4},resultCorrect:{color:JLPT_EXAM.color.correct},resultWrong:{color:JLPT_EXAM.color.wrong},rawScore:{fontFamily:JLPT_EXAM.font.content,fontSize:18,lineHeight:27,color:JLPT_EXAM.color.ink,textAlign:'center',marginTop:18},notEligible:{marginTop:18,padding:16,borderLeftWidth:4,borderLeftColor:JLPT_EXAM.color.unanswered,backgroundColor:'transparent'},notEligibleTitle:{fontFamily:JLPT_EXAM.font.content,fontSize:19,lineHeight:27,color:JLPT_EXAM.color.unanswered},notEligibleText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,lineHeight:23,color:JLPT_EXAM.color.secondaryInk,marginTop:7},resultAction:{marginTop:10},
  reviewFilters:{flexDirection:'row',gap:8,padding:10,backgroundColor:'transparent',borderBottomWidth:1,borderBottomColor:JLPT_EXAM.color.divider},reviewFilter:{flex:1,minHeight:44,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:JLPT_EXAM.color.divider},reviewFilterActive:{backgroundColor:JLPT_EXAM.color.selectedFill,borderColor:JLPT_EXAM.color.selectedBorder},reviewFilterText:{fontFamily:JLPT_EXAM.font.interface,fontSize:14,color:JLPT_EXAM.color.secondaryInk},reviewFilterTextActive:{color:JLPT_EXAM.color.selected},emptyReview:{fontFamily:JLPT_EXAM.font.interface,fontSize:16,lineHeight:25,color:JLPT_EXAM.color.secondaryInk,textAlign:'center',paddingVertical:30},
});
