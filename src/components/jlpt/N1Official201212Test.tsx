import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import writtenData from '@/data/jlpt-official/n1-2012-12/written.json';
import listeningData from '@/data/jlpt-official/n1-2012-12/listening.json';
import explanationData from '@/data/jlpt-official/n1-2012-12/explanations.zh-CN.json';
import translationCheckpoint from '@/data/jlpt-official/n1-2012-12/translation-batch-001-q001-q003.json';
import { JLPT_MAXIMUM_SCORE, scoreJlptMock } from '@/data/jlpt-exam-config';
import { saveSectionScore } from '@/services/jlpt-progress-storage';
import { useAppLanguage } from '@/context/LanguageContext';
import { RoyalButton, RoyalInfoPanel, RoyalOptionRow, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';

type Phase = 'written' | 'listening';
type Option = { optionId: string; textJa: string };
type Question = { questionId: string; sectionId: string; problemNumber: number; questionNumber: number; promptJa: string | null; options: Option[]; correctOptionId: string; passageId?: string; audio?: { transcriptJa: string } };
type Passage = { passageId: string; titleJa: string; textJa: string; attributionJa?: string; notes?: { noteId: number; textJa: string }[] };
type Explanation = { questionId: string; sourceExplanation: { text: string }; localizedExplanations: { localeCode: string; text: string }[] };
type AnswerMap = Record<string, string>;

const written = writtenData.questions as Question[];
const listening = listeningData.questions as Question[];
const passages = new Map((writtenData.passages as Passage[]).map(item => [item.passageId, item]));
const sourceExplanations = new Map((explanationData.records as Explanation[]).map(item => [item.questionId, item.sourceExplanation.text]));
const checkpoint = new Map((translationCheckpoint.records as Explanation[]).map(item => [item.questionId, item.localizedExplanations]));

function QuestionList({ questions, answers, choose, reveal }: { questions: Question[]; answers: AnswerMap; choose: (id: string, option: string) => void; reveal: boolean }) {
  const { language } = useAppLanguage();
  return <View>{questions.map((question, index) => {
    const passage = question.passageId ? passages.get(question.passageId) : undefined;
    const translated = checkpoint.get(question.questionId)?.find(item => item.localeCode === language)?.text;
    const explanation = translated ?? sourceExplanations.get(question.questionId);
    const correct = question.options.find(option => option.optionId === question.correctOptionId)?.textJa;
    return <RoyalInfoPanel key={question.questionId} label={`問題 ${index + 1}`} style={styles.question}>
      {passage ? <View style={styles.passage}><Text style={styles.passageTitle}>{passage.titleJa}</Text><Text style={styles.passageText}>{passage.textJa}</Text>{passage.attributionJa ? <Text style={styles.attribution}>{passage.attributionJa}</Text> : null}{passage.notes?.map(note => <Text key={note.noteId} style={styles.note}>（注{note.noteId}）{note.textJa}</Text>)}</View> : null}
      {question.audio?.transcriptJa ? <View style={styles.transcript}><Text style={styles.transcriptLabel}>確認済み音声スクリプト</Text><Text style={styles.passageText}>{question.audio.transcriptJa}</Text></View> : null}
      <Text style={styles.prompt}>{question.promptJa ?? '最もよい返事を選んでください。'}</Text>
      <View style={styles.options}>{question.options.map(option => <RoyalOptionRow key={option.optionId} onPress={() => choose(question.questionId, option.optionId)} contentStyle={styles.optionContent}><Text style={[styles.optionText, answers[question.questionId] === option.optionId && styles.selected]}>{option.optionId}. {option.textJa}</Text></RoyalOptionRow>)}</View>
      {reveal ? <View style={styles.review}><Text style={styles.correct}>正答: {question.correctOptionId}. {correct}</Text>{explanation ? <Text style={styles.explanation}>{translated ? explanation : `中文原文（未翻訳）\n${explanation}`}</Text> : null}</View> : null}
    </RoyalInfoPanel>;
  })}</View>;
}

export default function N1Official201212Test() {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>('written');
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const choose = (id: string, option: string) => setAnswers(current => ({ ...current, [id]: option }));
  const result = useMemo(() => scoreJlptMock('N1', {
    vocabulary: { correct: written.slice(0, 25).filter(q => answers[q.questionId] === q.correctOptionId).length, total: 25 },
    grammar: { correct: written.slice(25, 45).filter(q => answers[q.questionId] === q.correctOptionId).length, total: 20 },
    reading: { correct: written.slice(45).filter(q => answers[q.questionId] === q.correctOptionId).length, total: 25 },
    listening: { correct: listening.filter(q => answers[q.questionId] === q.correctOptionId).length, total: listening.length },
  }), [answers]);
  async function submit() { await saveSectionScore('N1', 'test', Math.round(result.total / result.maximum * 100)); setSubmitted(true); }
  function restart() { setStarted(false); setPhase('written'); setAnswers({}); setSubmitted(false); }

  if (!started) return <ScrollView contentContainerStyle={styles.content}><RoyalInfoPanel label="JLPT N1 · 第2回"><Text style={styles.title}>2012年12月 実題</Text><Text style={styles.copy}>筆記70問・聴解36回答を検証済みデータから収録しています。</Text><Text style={styles.warning}>元の音声ファイルは入力データに含まれていないため、聴解では検証済みスクリプトを表示します。</Text></RoyalInfoPanel><RoyalButton label="試験を始める" onPress={() => setStarted(true)} style={styles.action} /></ScrollView>;
  if (submitted) return <ScrollView contentContainerStyle={styles.content}><RoyalInfoPanel label="採点結果"><Text style={styles.score}>{result.total}/{JLPT_MAXIMUM_SCORE}</Text><Text style={result.passed ? styles.pass : styles.fail}>{result.passed ? '合格' : '不合格'}</Text><Text style={styles.copy}>公式の非公開尺度得点ではなく、正答率からの推定点です。</Text></RoyalInfoPanel><QuestionList questions={[...written, ...listening]} answers={answers} choose={choose} reveal /><RoyalButton label="もう一度受験する" onPress={restart} style={styles.action} /></ScrollView>;
  return <ScrollView contentContainerStyle={styles.content}>{phase === 'written' ? <><RoyalInfoPanel label="言語知識・読解"><Text style={styles.copy}>全70問 · 110分</Text></RoyalInfoPanel><QuestionList questions={written} answers={answers} choose={choose} reveal={false} /><RoyalButton label="聴解へ進む" onPress={() => setPhase('listening')} style={styles.action} /></> : <><RoyalInfoPanel label="聴解"><Text style={styles.copy}>全36回答</Text><Text style={styles.warning}>原音声が未収録のため、検証済みスクリプトで受験します。</Text></RoyalInfoPanel><QuestionList questions={listening} answers={answers} choose={choose} reveal={false} /><RoyalButton label="答案を提出する" onPress={() => void submit()} style={styles.action} /></>}</ScrollView>;
}

const styles = StyleSheet.create({
  content: { padding: 12, paddingBottom: 64, backgroundColor: '#f3f0e8' }, title: { color: ROYAL.lacquer, fontFamily: ROYAL_FONT.heading, fontSize: 25, textAlign: 'center' }, copy: { color: ROYAL.ink, fontFamily: ROYAL_FONT.body, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 8 }, warning: { color: '#8a3b12', fontFamily: ROYAL_FONT.body, lineHeight: 22, marginTop: 10, textAlign: 'center' }, action: { marginTop: 16 }, question: { marginTop: 14 }, passage: { paddingVertical: 8 }, passageTitle: { color: ROYAL.lacquer, fontFamily: ROYAL_FONT.heading, fontSize: 19, marginBottom: 8 }, passageText: { color: ROYAL.ink, fontFamily: ROYAL_FONT.body, fontSize: 15, lineHeight: 25 }, attribution: { color: '#665b49', fontFamily: ROYAL_FONT.body, textAlign: 'right', marginTop: 8 }, note: { color: '#665b49', fontFamily: ROYAL_FONT.body, lineHeight: 21, marginTop: 5 }, transcript: { paddingVertical: 8 }, transcriptLabel: { color: ROYAL.darkGold, fontFamily: ROYAL_FONT.heading, marginBottom: 7 }, prompt: { color: ROYAL.ink, fontFamily: ROYAL_FONT.heading, fontSize: 18, lineHeight: 28, marginTop: 10 }, options: { gap: 8, marginTop: 12 }, optionContent: { minHeight: 50, justifyContent: 'center' }, optionText: { color: ROYAL.ink, fontFamily: ROYAL_FONT.body, fontSize: 15, lineHeight: 23 }, selected: { color: ROYAL.lacquer, fontFamily: ROYAL_FONT.heading }, review: { marginTop: 12 }, correct: { color: '#166534', fontFamily: ROYAL_FONT.heading, lineHeight: 23 }, explanation: { color: ROYAL.ink, fontFamily: ROYAL_FONT.body, lineHeight: 23, marginTop: 8 }, score: { color: ROYAL.lacquer, fontFamily: ROYAL_FONT.heading, fontSize: 42 }, pass: { color: '#166534', fontFamily: ROYAL_FONT.heading, fontSize: 22 }, fail: { color: '#991b1b', fontFamily: ROYAL_FONT.heading, fontSize: 22 },
});
