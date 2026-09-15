import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { playQuestionThenScript } from '@/components/jlpt/jlpt-speech-sequence';
import { RoyalButton } from '@/components/ui/RoyalSurface';

type Props = { prompt?: string; script: string; disabled?: boolean };

/** Reads the question, pauses for three seconds, then plays the authored dialogue. */
export default function JlptAudioButton({ prompt, script, disabled }: Props) {
    const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const playbackSession = useRef(0);
    useEffect(() => () => {
        playbackSession.current += 1;
        if (pauseTimer.current) clearTimeout(pauseTimer.current);
        void Speech.stop();
    }, []);
    async function play() {
        const session = playbackSession.current + 1;
        playbackSession.current = session;
        if (pauseTimer.current) clearTimeout(pauseTimer.current);
        await playQuestionThenScript({
            prompt: prompt ?? '',
            script,
            driver: { stop: Speech.stop, speak: Speech.speak },
            isCurrent: () => session === playbackSession.current,
            schedule: (callback, milliseconds) => {
                pauseTimer.current = setTimeout(callback, milliseconds);
                return pauseTimer.current;
            },
        });
    }
    return <RoyalButton compact disabled={disabled} onPress={() => { void play(); }} style={styles.button} label="問題と音声を聞く" />;
}

const styles = StyleSheet.create({
    button: { alignSelf: 'stretch', marginTop: 12 },
});
