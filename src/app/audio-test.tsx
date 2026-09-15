import { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioPlayer,
    useAudioRecorder,
    useAudioRecorderState,
} from 'expo-audio';
import * as Speech from 'expo-speech';

const PRACTICE_SENTENCES = [
    { ja: 'おはようございます。', vi: 'Chào buổi sáng.' },
    { ja: 'よろしくお願いします。', vi: 'Rất mong được giúp đỡ.' },
    { ja: 'もう一度お願いします。', vi: 'Xin hãy nói lại một lần nữa.' },
    { ja: '日本語を勉強しています。', vi: 'Tôi đang học tiếng Nhật.' },
];

export default function AudioTestScreen() {
    const recorder = useAudioRecorder(
        RecordingPresets.HIGH_QUALITY
    );

    const recorderState =
        useAudioRecorderState(recorder);

    const [recordingUri, setRecordingUri] =
        useState<string | null>(null);
    const [sentenceIndex, setSentenceIndex] = useState(0);
    const sentence = PRACTICE_SENTENCES[sentenceIndex];

    const player = useAudioPlayer(null);
    useEffect(() => {
        async function setupAudio() {
            const permission =
                await AudioModule.requestRecordingPermissionsAsync();

            if (!permission.granted) {
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

            await recorder.prepareToRecordAsync();

            recorder.record();

            console.log('Recording started');
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

            const uri = recorder.uri;

            console.log(
                'Recording stopped:',
                uri
            );

            if (uri) {
                setRecordingUri(uri);
            }
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
            console.log('Playing:', recordingUri);

            player.replace(recordingUri);

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
        <View style={styles.container}>

            <Text style={styles.title}>
                🎤 発音練習室
            </Text>

            <Text style={styles.subtitle}>Nghe câu mẫu → tự ghi âm → nghe lại và so sánh.</Text>

            <View style={styles.practiceCard}>
                <Text style={styles.practiceJa}>{sentence.ja}</Text>
                <Text style={styles.practiceVi}>{sentence.vi}</Text>
                <Pressable style={styles.referenceButton} onPress={() => Speech.speak(sentence.ja, { language: 'ja-JP', rate: 0.75 })}>
                    <Text style={styles.buttonText}>🔊 Nghe giọng mẫu</Text>
                </Pressable>
            </View>

            <Text style={styles.status}>
                {recorderState.isRecording
                    ? '録音中...'
                    : '録音していません'}
            </Text>

            {recorderState.isRecording && (
                <Text style={styles.duration}>
                    {Math.round(
                        recorderState.durationMillis / 1000
                    )}
                    秒
                </Text>
            )}

            {!recorderState.isRecording && (
                <Pressable
                    style={styles.recordButton}
                    onPress={startRecording}
                >
                    <Text style={styles.buttonText}>
                        🎤 録音開始
                    </Text>
                </Pressable>
            )}

            {recorderState.isRecording && (
                <Pressable
                    style={styles.stopButton}
                    onPress={stopRecording}
                >
                    <Text style={styles.buttonText}>
                        ⏹ 録音停止
                    </Text>
                </Pressable>
            )}

            {recordingUri && (
                <Pressable
                    style={styles.playButton}
                    onPress={playRecording}
                >
                    <Text style={styles.buttonText}>
                        ▶ 録音を聞く
                    </Text>
                </Pressable>
            )}

            <Pressable style={styles.nextButton} onPress={() => { setRecordingUri(null); setSentenceIndex((value) => (value + 1) % PRACTICE_SENTENCES.length); }}>
                <Text style={styles.nextText}>Câu luyện tiếp theo →</Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e2d6',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
    },
    subtitle:{fontSize:15,color:'#667085',textAlign:'center',marginTop:8},
    practiceCard:{width:'100%',backgroundColor:'#f6f8fc',padding:18,borderRadius:16,alignItems:'center',marginTop:22},
    practiceJa:{fontSize:22,fontWeight:'800',textAlign:'center'},practiceVi:{color:'#667085',marginTop:7},
    referenceButton:{backgroundColor:'#4263eb',paddingVertical:12,paddingHorizontal:22,borderRadius:22,marginTop:15},

    status: {
        fontSize: 17,
        marginTop: 24,
    },

    duration: {
        fontSize: 32,
        fontWeight: '800',
        marginTop: 10,
    },

    recordButton: {
        backgroundColor: '#222222',
        paddingVertical: 17,
        paddingHorizontal: 36,
        borderRadius: 30,
        marginTop: 30,
    },

    stopButton: {
        backgroundColor: '#222222',
        paddingVertical: 17,
        paddingHorizontal: 36,
        borderRadius: 30,
        marginTop: 30,
    },

    playButton: {
        backgroundColor: '#222222',
        paddingVertical: 17,
        paddingHorizontal: 36,
        borderRadius: 30,
        marginTop: 16,
    },
    nextButton:{padding:15,marginTop:12},nextText:{color:'#4263eb',fontWeight:'800'},

    buttonText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '700',
    },
});
