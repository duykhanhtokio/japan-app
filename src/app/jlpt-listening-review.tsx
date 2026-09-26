import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { REVIEW_SOURCES, type ReviewSource } from '@/data/jlpt-official/n4-n5-listening-review-sources';
import { loadListeningSegmentCorrection, saveListeningSegmentCorrection } from '@/services/jlpt-listening-segment-review';

const time = (milliseconds: number) => (milliseconds / 1000).toFixed(1);
const milliseconds = (value: string) => Math.round(Number(value.replace(',', '.')) * 1000);

function Editor({ source }: { source: ReviewSource }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [notice, setNotice] = useState('');
  const player = useAudioPlayer(source.audioSource, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);
  const segment = source.segments[index];
  useEffect(() => {
    let live = true;
    player.pause();
    setNotice('');
    setStart(time(segment.startMs));
    setEnd(time(segment.endMs));
    void loadListeningSegmentCorrection(source.id, segment.id).then(value => {
      if (live && value) { setStart(time(value.startMs)); setEnd(time(value.endMs)); }
    });
    return () => { live = false; player.pause(); };
  }, [source.id, segment.id, player]);
  useEffect(() => {
    if (status.playing && status.currentTime * 1000 >= milliseconds(end)) player.pause();
  }, [status.currentTime, status.playing, end, player]);
  function valid() {
    const from = milliseconds(start), to = milliseconds(end);
    return status.isLoaded && Number.isFinite(from) && Number.isFinite(to) && from >= 0 && to > from && to <= status.duration * 1000;
  }
  async function preview() {
    if (!valid()) { setNotice('Mốc thời gian không hợp lệ.'); return; }
    player.pause();
    await player.seekTo(milliseconds(start) / 1000);
    player.play();
  }
  async function save() {
    if (!valid()) { setNotice('Mốc thời gian không hợp lệ.'); return; }
    try {
      await saveListeningSegmentCorrection(source.id, segment.id, milliseconds(start), milliseconds(end));
      setNotice('Đã lưu trên thiết bị; chưa đồng bộ GitHub hoặc sửa đề gốc.');
    } catch { setNotice('Không lưu được.'); }
  }
  return <ScrollView contentContainerStyle={styles.page}>
    <Pressable onPress={() => { player.pause(); router.back(); }}><Text style={styles.link}>← Danh sách đề</Text></Pressable>
    <Text style={styles.title}>Chỉnh nghe · {source.id}</Text>
    <Text>Timing ứng viên chưa được duyệt. Bản sửa được lưu riêng trên thiết bị.</Text>
    <Text style={styles.heading}>Câu {index + 1}/{source.segments.length}: {segment.label}</Text>
    <Text>Audio: {status.isLoaded ? time(status.duration * 1000) : 'đang tải'} giây</Text>
    <Text>Bắt đầu (giây)</Text><TextInput style={styles.input} keyboardType="decimal-pad" value={start} onChangeText={setStart} />
    <Text>Kết thúc (giây)</Text><TextInput style={styles.input} keyboardType="decimal-pad" value={end} onChangeText={setEnd} />
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={() => void preview()}><Text>▶ Nghe đoạn</Text></Pressable>
      <Pressable style={styles.button} onPress={() => player.pause()}><Text>■ Dừng</Text></Pressable>
    </View>
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={() => setStart(time(Math.max(0, milliseconds(start) - 500)))}><Text>Đầu −0,5 s</Text></Pressable>
      <Pressable style={styles.button} onPress={() => setStart(time(milliseconds(start) + 500))}><Text>Đầu +0,5 s</Text></Pressable>
    </View>
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={() => setEnd(time(Math.max(0, milliseconds(end) - 500)))}><Text>Cuối −0,5 s</Text></Pressable>
      <Pressable style={styles.button} onPress={() => setEnd(time(milliseconds(end) + 500))}><Text>Cuối +0,5 s</Text></Pressable>
    </View>
    <Pressable style={styles.button} onPress={() => void save()}><Text>Lưu mốc câu này</Text></Pressable>
    <Text>{notice}</Text>
    <View style={styles.row}>
      <Pressable disabled={index === 0} style={styles.button} onPress={() => setIndex(index - 1)}><Text>Câu trước</Text></Pressable>
      <Pressable disabled={index === source.segments.length - 1} style={styles.button} onPress={() => setIndex(index + 1)}><Text>Câu sau</Text></Pressable>
    </View>
  </ScrollView>;
}

export default function JlptListeningReview() {
  const router = useRouter();
  const { examId } = useLocalSearchParams<{ examId?: string }>();
  const source = REVIEW_SOURCES.find(item => item.id === examId || `${item.id}-exam-06` === examId);
  if (source) return <Editor key={source.id} source={source} />;
  return <ScrollView contentContainerStyle={styles.page}>
    <Pressable onPress={() => router.back()}><Text style={styles.link}>← Quay lại</Text></Pressable>
    <Text style={styles.title}>Rà soát nghe N4/N5</Text>
    <Text>Chọn đề có mốc nghe ứng viên để chỉnh từng câu. Các đề chưa có mốc sẽ bổ sung sau.</Text>
    {REVIEW_SOURCES.map(item => <Pressable key={item.id} style={styles.button} onPress={() => router.push({ pathname: '/jlpt-listening-review', params: { examId: item.id } })}><Text>{item.id} · {item.segments.length} câu</Text></Pressable>)}
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { padding: 20, gap: 12, backgroundColor: '#fff', flexGrow: 1 }, title: { fontSize: 22, fontWeight: 'bold' }, heading: { fontSize: 18, fontWeight: '600', marginTop: 18 }, link: { color: '#164c8b' }, input: { borderWidth: 1, borderColor: '#777', padding: 10, fontSize: 17 }, row: { flexDirection: 'row', gap: 12 }, button: { borderWidth: 1, borderColor: '#555', padding: 12, flex: 1, alignItems: 'center' } });
