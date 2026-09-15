import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export type DialogueVideoState = 'intro' | 'listen' | 'reply' | 'farewell';

const WEB_SOURCES = {
  intro: require('../../../assets/app/life/video/bank-intro-alpha.webm'),
  listen: require('../../../assets/app/life/video/bank-listen-alpha.webm'),
  reply: require('../../../assets/app/life/video/bank-reply-alpha.webm'),
  farewell: require('../../../assets/app/life/video/bank-farewell-alpha.webm'),
} as const;

const NATIVE_SOURCES = {
  intro: require('../../../assets/app/life/video/bank-intro-alpha.webp'),
  listen: require('../../../assets/app/life/video/bank-listen-alpha.webp'),
  reply: require('../../../assets/app/life/video/bank-reply-alpha.webp'),
  farewell: require('../../../assets/app/life/video/bank-farewell-alpha.webp'),
} as const;

const DURATION_MS: Record<DialogueVideoState, number> = {
  intro: 7250,
  listen: 6375,
  reply: 4709,
  farewell: 5709,
};

type Props = { state: DialogueVideoState; onFinished?: () => void };

function WebNpcVideo({ state }: { state: DialogueVideoState }) {
  const player = useVideoPlayer(WEB_SOURCES[state], instance => {
    instance.loop = state === 'listen';
    instance.play();
  });
  return <VideoView player={player} nativeControls={false} contentFit="contain" style={StyleSheet.absoluteFill} />;
}

function NativeNpcAnimation({ state }: { state: DialogueVideoState }) {
  return <Image autoplay cachePolicy="memory-disk" contentFit="contain" priority="high" recyclingKey={state} source={NATIVE_SOURCES[state]} style={StyleSheet.absoluteFill} transition={0} />;
}

export function DialogueNpcVideo({ state, onFinished }: Props) {
  useEffect(() => {
    if (state === 'listen' || !onFinished) return undefined;
    const timer = setTimeout(onFinished, DURATION_MS[state]);
    return () => clearTimeout(timer);
  }, [onFinished, state]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Platform.OS === 'web' ? <WebNpcVideo state={state} /> : <NativeNpcAnimation state={state} />}
    </View>
  );
}
