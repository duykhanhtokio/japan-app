import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { APPROVED_N1_EXAMS } from '@/data/jlpt-official/approved-n1-exams';
import { N4_2017_07_TRIAL } from '@/data/jlpt-official/n4-2017-07-trial';
import { loadListeningSegmentCorrection, saveListeningSegmentCorrection } from '@/services/jlpt-listening-segment-review';

const extraCandidates = [{ id: 'n4-2017-07-exam-06', level: 'N4', periodLabel: '2017年7月', questions: N4_2017_07_TRIAL, audioSource: require('../../assets/jlpt/n4/2017-07/audio/n4-2017-07.mp3') }];
const time = (milliseconds: number) => (milliseconds / 1000).toFixed(1);
export default function JlptListeningReview() {
  const router = useRouter();
  const { examId } = useLocalSearchParams<{ examId?: string }>();
  const exam = useMemo(() => APPROVED_N1_EXAMS.find(item => item.id === examId) ?? extraCandidates.find(item => item.id === examId), [examId]);
  const segments = useMemo(() => exam?.questions.filter(question => question.family === 'listening' && question.audio) ?? [], [exam]);
  const [index, setIndex] = useState(0);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [notice, setNotice] = useState('');
  const player = useAudioPlayer(exam?.audioSource ?? null, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);
  const question = segments[index];

  useEffect(() => {
    let live = true;
    player.pause();
    setNotice('');
    if (!exam || !question?.audio) return;
    setStart(time(question.audio.startMs));
    setEnd(time(question.audio.endMs));
    void loadListeningSegmentCorrection(exam.id, question.id).then(value => {
      if (live && value) { setStart(time(value.startMs)); setEnd(time(value.endMs)); }
    });
    return () => { live = false; player.pause(); };
  }, [exam, question, player]);

  useEffect(() => {
    if (question && status.playing && status.currentTime * 1000 >= milliseconds(end)) player.pause();
  }, [status.currentTime, status.playing, end, question, player]);

  function milliseconds(value: string) { return Math.round(Number(value.replace(',', '.')) * 1000); }
  async function preview() {
    const from = milliseconds(start);
    const to = milliseconds(end);
    if (!status.isLoaded || !Number.isFinite(from) || !Number.isFinite(to) || from < 0 || to <= from || to > status.duration * 1000) { setNotice('Mốc thời gian không hợp lệ.'); return; }
    player.pause();
    await player.seekTo(from / 1000);
    player.play();
    setNotice(`Đang phát từ ${time(from)} đến ${time(to)} giây.`);
  }
  async function save() {
    if (!exam || !question) return;
    const from = milliseconds(start);
    const to = milliseconds(end);
    if (!status.isLoaded || to > status.duration * 1000) { setNotice('Mốc kết thúc vượt thời lượng audio.'); return; }
    try { await saveListeningSegmentCorrection(exam.id, question.id, from, to); setNotice('Đã lưu bản chỉnh trên thiết bị này; chưa đồng bộ lên GitHub.'); }
    catch { setNotice('Không thể lưu: kiểm tra điểm bắt đầu và kết thúc.'); }
  }
  if (!exam) return <View style={styles.page}><Text>Chưa tìm thấy đề đã tích hợp.</Text><Pressable onPress={() => router.back()}><Text>Quay lại</Text></Pressable></View>;
  return <ScrollView contentContainerStyle={styles.page}>
    <Pressable onPress={() => { player.pause(); router.back(); }}><Text style={styles.link}>← Quay lại</Text></Pressable>
    <Text style={styles.title}>Chỉnh nghe · {exam.level} · {exam.periodLabel}</Text>
    <Text>Đây là bản chỉnh mốc câu nghe trên thiết bị; dữ liệu gốc và giao diện thi không đổi.</Text>
    <Text style={styles.heading}>Câu {index + 1}/{segments.length}: {question?.label}</Text>
    <Text>{question?.promptJa}</Text>
    <Text>Thời lượng audio: {status.isLoaded ? time(status.duration * 1000) : 'đang tải'} giây</Text>
    <Text>Bắt đầu (giây)</Text><TextInput style={styles.input} keyboardType="decimal-pad" value={start} onChangeText={setStart} />
    <Text>Kết thúc (giây)</Text><TextInput style={styles.input} keyboardType="decimal-pad" value={end} onChangeText={setEnd} />
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={() => void preview()}><Text>▶ Nghe từ đầu mốc</Text></Pressable>
      <Pressable style={styles.button} onPress={() => player.pause()}><Text>■ Dừng</Text></Pressable>
    </View>
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={() => setStart(time(Math.max(0, milliseconds(start) - 500)))}><Text>−0,5 s</Text></Pressable>
      <Pressable style={styles.button} onPress={() => setStart(time(milliseconds(start) + 500))}><Text>+0,5 s</Text></Pressable>
    </View>
    <Pressable style={styles.button} onPress={() => void save()}><Text>Lưu mốc câu này</Text></Pressable>
    <Text>{notice}</Text>
    <View style={styles.row}>
      <Pressable disabled={index === 0} style={styles.button} onPress={() => setIndex(index - 1)}><Text>Câu trước</Text></Pressable>
      <Pressable disabled={index >= segments.length - 1} style={styles.button} onPress={() => setIndex(index + 1)}><Text>Câu sau</Text></Pressable>
    </View>
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { padding: 20, gap: 12, backgroundColor: '#fff', flexGrow: 1 }, title: { fontSize: 22, fontWeight: 'bold' }, heading: { fontSize: 18, fontWeight: '600', marginTop: 18 }, link: { color: '#164c8b' }, input: { borderWidth: 1, borderColor: '#777', padding: 10, fontSize: 17 }, row: { flexDirection: 'row', gap: 12 }, button: { borderWidth: 1, borderColor: '#555', padding: 12, flex: 1, alignItems: 'center' } });
