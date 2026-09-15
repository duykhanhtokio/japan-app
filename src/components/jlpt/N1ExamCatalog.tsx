import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import JlptMockTest from '@/components/jlpt/JlptMockTest';
import N1Official201207Test from '@/components/jlpt/N1Official201207Test';
import N1Official201212Test from '@/components/jlpt/N1Official201212Test';
import { RoyalButton, RoyalInfoPanel, ROYAL, ROYAL_FONT } from '@/components/ui/RoyalSurface';

type Exam = 'official-2012-07' | 'official-2012-12' | 'mock-01';

export default function N1ExamCatalog() {
  const [selected, setSelected] = useState<Exam | null>(null);
  if (selected === 'official-2012-07') return <N1Official201207Test />;
  if (selected === 'official-2012-12') return <N1Official201212Test />;
  if (selected === 'mock-01') return <JlptMockTest level="N1" />;

  return <ScrollView contentContainerStyle={styles.content}>
    <RoyalInfoPanel label="JLPT N1"><Text style={styles.title}>試験を選択</Text><Text style={styles.copy}>収録済みの問題だけを表示しています。</Text></RoyalInfoPanel>
    <RoyalButton label="第1回 · 2012年7月 実題" onPress={() => setSelected('official-2012-07')} style={styles.action} />
    <RoyalButton label="第2回 · 2012年12月 実題" onPress={() => setSelected('official-2012-12')} style={styles.action} />
    <RoyalButton label="模擬試験 · 第1回" onPress={() => setSelected('mock-01')} style={styles.action} />
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { padding: 12, paddingBottom: 64, backgroundColor: '#f3f0e8' },
  title: { color: ROYAL.lacquer, fontFamily: ROYAL_FONT.heading, fontSize: 25, textAlign: 'center' },
  copy: { color: ROYAL.ink, fontFamily: ROYAL_FONT.body, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 8 },
  action: { marginTop: 14 },
});
