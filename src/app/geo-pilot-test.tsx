import { useCallback, useState } from 'react';
import { ScrollView, Text, Pressable, View } from 'react-native';
import { loadIbarakiRawDialogueAsync } from '@/services/geo-ibaraki-pilot-loader';

// Explicitly opened development-only route. Never used by normal navigation.
const SAMPLES = ['SC-LOC-JP-08203-01-001', 'SC-LOC-JP-08220-01-001'];
const now = () => globalThis.performance?.now?.() ?? Date.now();
export default function GeoPilotTestScreen() {
  const [result, setResult] = useState('Chưa chạy thử nghiệm');
  const run = useCallback(async () => {
    if (!__DEV__) return;
    setResult('Đang thử tải module Ibaraki...');
    const start = now();
    try {
      // A scenario outside the pilot must not silently resolve to another file.
      const absent = await loadIbarakiRawDialogueAsync('__NOT_A_SCENARIO__');
      const loadedAt = now();
      const data = await import('@/data/generated/geo-pilot/ibaraki-dialogues');
      const id = data.ibarakiScenarioIds[0];
      const value = await loadIbarakiRawDialogueAsync(id);
      const end = now();
      const payload = value && typeof value === 'object' && 'default' in value ? value.default : value;
      const rows: unknown = Array.isArray(payload)
        ? payload
        : payload && typeof payload === 'object' && 'shared' in payload
          ? payload.shared
          : payload && typeof payload === 'object' && 'N5' in payload
            ? payload.N5
            : null;
      const valid = Array.isArray(rows) && rows.length > 0 &&
        rows.every((turn: unknown) => !!turn && typeof turn === 'object' &&
          'scenarioId' in turn && turn.scenarioId === id);
      const turnCount = Array.isArray(rows) ? rows.length : 0;
      const summary = JSON.stringify({
        scenarioId: id, turns: turnCount, valid, absent: absent === undefined,
        firstImportMs: Math.round(loadedAt - start),
        sampleLoadMs: Math.round(end - loadedAt),
        note: 'Warm/cold Metro and processed locale parity not yet measured.'
      }, null, 2);
      console.log('[geo-pilot]',summary);
      setResult(summary);
    } catch (error) {
      setResult('ERROR: '+String(error));
      console.error('[geo-pilot]',error);
    }
  },[]);
  if (!__DEV__) return <View />;
  return <ScrollView contentContainerStyle={{ flexGrow:1, padding:24, justifyContent:'center', gap:18, backgroundColor:'#10263D' }}>
    <Text style={{ color:'#FFF',fontSize:24,fontWeight:'bold' }}>Ibaraki — Geo Pilot</Text>
    <Text style={{color:'#EEE'}}>Thử nghiệm riêng; không thay loader Hội thoại chính.</Text>
    <Pressable accessibilityRole="button" onPress={run} style={{padding:16,backgroundColor:'#D3A64E',borderRadius:12}}>
      <Text style={{fontWeight:'bold',textAlign:'center'}}>Chạy thử tải 277 Scenario</Text>
    </Pressable>
    <Text selectable style={{color:'#FFF',fontSize:13}}>{result}</Text>
  </ScrollView>;
}
