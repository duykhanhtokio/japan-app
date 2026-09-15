import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View, type ImageSourcePropType } from 'react-native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { JLPT_MAXIMUM_SCORE, scoreJlptMock } from '@/data/jlpt-exam-config';
import { saveSectionScore } from '@/services/jlpt-progress-storage';
import { RoyalButton, RoyalInfoPanel, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';
import {
  N1_2012_07_AUDIO,
  N1_2012_07_ANSWER_KEY_PAGE,
  N1_2012_07_LISTENING_KEY,
  N1_2012_07_LISTENING_PAGES,
  N1_2012_07_SCRIPT_PAGES,
  N1_2012_07_WRITTEN_KEY,
  N1_2012_07_WRITTEN_PAGES,
  type OfficialExamPhase,
} from '@/data/jlpt-mock/n1-2012-07-official';

type AnswerMap = Record<string, number>;
const answerId = (phase: OfficialExamPhase, index: number) => `${phase}-${index + 1}`;
const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

function SourcePages({ pages, label }: { pages: readonly ImageSourcePropType[]; label: string }) {
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(920, width - 24);
  return <View style={styles.pages}>{pages.map((source, index) => <View key={`${label}-${index}`} style={styles.pageWrap}>
    <Text style={styles.pageLabel}>{label} · {index + 1}/{pages.length}</Text>
    <Image source={source} resizeMode="contain" style={{ width: pageWidth, height: pageWidth * 1.4142 }} />
  </View>)}</View>;
}

function AnswerGrid({ phase, count, answers, onChoose }: { phase: OfficialExamPhase; count: number; answers: AnswerMap; onChoose: (id: string, value: number) => void }) {
  return <View style={styles.grid}>{Array.from({ length: count }, (_, index) => {
    const id = answerId(phase, index);
    return <View key={id} style={styles.answerCard}>
      <Text style={styles.answerNumber}>{index + 1}</Text>
      <View style={styles.answerOptions}>{[1, 2, 3, 4].map((value) => <Pressable accessibilityRole="radio" accessibilityState={{ checked: answers[id] === value }} key={value} onPress={() => onChoose(id, value)} style={[styles.answerOption, answers[id] === value && styles.answerSelected]}>
        <Text style={[styles.answerOptionText, answers[id] === value && styles.answerSelectedText]}>{value}</Text>
      </Pressable>)}</View>
    </View>;
  })}</View>;
}

export default function N1Official201207Test() {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<OfficialExamPhase>('written');
  const [remaining, setRemaining] = useState(110 * 60);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const player = useAudioPlayer(N1_2012_07_AUDIO);

  useEffect(() => { void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false }); }, []);
  useEffect(() => {
    if (!started || submitted || phase !== 'written') return;
    const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [phase, started, submitted]);
  useEffect(() => { if (started && phase === 'written' && remaining === 0) setPhase('listening'); }, [phase, remaining, started]);
  useEffect(() => () => player.pause(), [player]);

  const result = useMemo(() => {
    const correct = (key: readonly number[], currentPhase: OfficialExamPhase) => key.filter((value, index) => answers[answerId(currentPhase, index)] === value).length;
    return scoreJlptMock('N1', {
      vocabulary: { correct: N1_2012_07_WRITTEN_KEY.slice(0, 25).filter((value, index) => answers[answerId('written', index)] === value).length, total: 25 },
      grammar: { correct: N1_2012_07_WRITTEN_KEY.slice(25, 45).filter((value, index) => answers[answerId('written', index + 25)] === value).length, total: 20 },
      reading: { correct: N1_2012_07_WRITTEN_KEY.slice(45).filter((value, index) => answers[answerId('written', index + 45)] === value).length, total: 25 },
      listening: { correct: correct(N1_2012_07_LISTENING_KEY, 'listening'), total: N1_2012_07_LISTENING_KEY.length },
    });
  }, [answers]);

  const choose = (id: string, value: number) => setAnswers((current) => ({ ...current, [id]: value }));
  async function submit() { player.pause(); await saveSectionScore('N1', 'test', Math.round(result.total / result.maximum * 100)); setSubmitted(true); }
  function restart() { player.pause(); void player.seekTo(0); setStarted(false); setPhase('written'); setRemaining(110 * 60); setAnswers({}); setSubmitted(false); }

  if (!started) return <ScrollView contentContainerStyle={styles.content}>
    <RoyalInfoPanel label="JLPT N1 · 第1回"><Text style={styles.title}>2012年7月 実題</Text><Text style={styles.copy}>原本の問題ページ、正答表、聴解音声をそのまま収録した確認版です。</Text><Text style={styles.copy}>文字・語彙・文法・読解 110分 · 聴解 約44分</Text></RoyalInfoPanel>
    <RoyalButton label="試験を始める" onPress={() => setStarted(true)} style={styles.action} />
  </ScrollView>;

  if (submitted) return <ScrollView contentContainerStyle={styles.content}>
    <RoyalInfoPanel label="採点結果"><Text style={styles.score}>{result.total}/{JLPT_MAXIMUM_SCORE}</Text><Text style={result.passed ? styles.pass : styles.fail}>{result.passed ? '合格' : '不合格'}</Text><Text style={styles.note}>公式JLPTの非公開尺度得点ではなく、正答率からの推定点です。</Text>{result.sections.map((item) => <Text key={item.id} style={styles.sectionScore}>{item.label}: {item.score}/{item.maximum}</Text>)}</RoyalInfoPanel>
    <RoyalInfoPanel label="正答"><Text style={styles.keyText}>筆記: {N1_2012_07_WRITTEN_KEY.join(' · ')}</Text><Text style={styles.keyText}>聴解: {N1_2012_07_LISTENING_KEY.join(' · ')}</Text></RoyalInfoPanel>
    <Text style={styles.heading}>正答表（原本）</Text><SourcePages pages={[N1_2012_07_ANSWER_KEY_PAGE]} label="ANSWER KEY" />
    <Text style={styles.heading}>聴解スクリプト（原本）</Text><SourcePages pages={N1_2012_07_SCRIPT_PAGES} label="SCRIPT" />
    <RoyalButton label="もう一度受験する" onPress={restart} style={styles.action} />
  </ScrollView>;

  if (phase === 'written') return <ScrollView contentContainerStyle={styles.content}>
    <View style={styles.phaseHeader}><Text style={styles.heading}>言語知識・読解</Text><Text style={styles.timer}>{clock(remaining)}</Text></View>
    <SourcePages pages={N1_2012_07_WRITTEN_PAGES} label="問題冊子" />
    <Text style={styles.heading}>解答欄（1–70）</Text><AnswerGrid phase="written" count={70} answers={answers} onChoose={choose} />
    <RoyalButton label="聴解へ進む" onPress={() => setPhase('listening')} style={styles.action} />
  </ScrollView>;

  return <ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.heading}>聴解</Text>
    <RoyalInfoPanel label="音声"><Text style={styles.copy}>音声は全編を順番どおり再生します。問題冊子の図や選択肢は下に表示されます。</Text><View style={styles.audioRow}><Pressable style={styles.audioButton} onPress={() => player.play()}><Text style={styles.audioText}>▶ 再生</Text></Pressable><Pressable style={styles.audioButton} onPress={() => player.pause()}><Text style={styles.audioText}>Ⅱ 一時停止</Text></Pressable><Pressable style={styles.audioButton} onPress={() => { player.pause(); void player.seekTo(0); }}><Text style={styles.audioText}>↺ 最初へ</Text></Pressable></View></RoyalInfoPanel>
    <SourcePages pages={N1_2012_07_LISTENING_PAGES} label="聴解問題" />
    <Text style={styles.heading}>解答欄（36回答）</Text><Text style={styles.note}>問題5の(3)には、原本の正答表どおり2つの解答欄があります。</Text><AnswerGrid phase="listening" count={36} answers={answers} onChoose={choose} />
    <RoyalButton label="答案を提出する" onPress={() => void submit()} style={styles.action} />
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { padding: 12, paddingBottom: 64, backgroundColor: '#f3f0e8' },
  title: { color: ROYAL.lacquer, fontFamily: ROYAL_FONT.heading, fontSize: 25, textAlign: 'center' },
  copy: { color: ROYAL.ink, fontFamily: ROYAL_FONT.body, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 8 },
  action: { marginTop: 16 }, phaseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { color: ROYAL.lacquer, fontFamily: ROYAL_FONT.heading, fontSize: 22, marginVertical: 14 }, timer: { color: '#9b1c1c', fontFamily: ROYAL_FONT.body, fontSize: 20 },
  pages: { alignItems: 'center', gap: 12 }, pageWrap: { backgroundColor: '#fff', borderWidth: 1, borderColor: ROYAL.gold }, pageLabel: { padding: 6, color: ROYAL.darkGold, fontFamily: ROYAL_FONT.body },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, answerCard: { width: 150, padding: 8, backgroundColor: ROYAL.ivory, borderColor: ROYAL.gold, borderWidth: 1, borderRadius: 8 }, answerNumber: { color: ROYAL.lacquer, fontFamily: ROYAL_FONT.heading, fontSize: 15, marginBottom: 6 }, answerOptions: { flexDirection: 'row', gap: 5 },
  answerOption: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: ROYAL.gold, alignItems: 'center', justifyContent: 'center' }, answerSelected: { backgroundColor: ROYAL.lacquer }, answerOptionText: { color: ROYAL.ink, fontFamily: ROYAL_FONT.body }, answerSelectedText: { color: ROYAL.white },
  audioRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 12 }, audioButton: { backgroundColor: ROYAL.lacquer, borderColor: ROYAL.gold, borderWidth: 1, borderRadius: 9, paddingHorizontal: 14, paddingVertical: 11 }, audioText: { color: ROYAL.white, fontFamily: ROYAL_FONT.body },
  score: { color: ROYAL.lacquer, fontFamily: ROYAL_FONT.heading, fontSize: 42 }, pass: { color: '#166534', fontFamily: ROYAL_FONT.heading, fontSize: 22 }, fail: { color: '#991b1b', fontFamily: ROYAL_FONT.heading, fontSize: 22 }, note: { color: '#665b49', fontFamily: ROYAL_FONT.body, lineHeight: 21, marginVertical: 8 }, sectionScore: { color: ROYAL.ink, fontFamily: ROYAL_FONT.body, lineHeight: 23 }, keyText: { color: ROYAL.ink, fontFamily: ROYAL_FONT.body, lineHeight: 22, marginVertical: 5 },
});
