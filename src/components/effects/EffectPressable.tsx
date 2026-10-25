import { forwardRef, type ComponentProps, type ComponentRef } from 'react';
import { Pressable } from 'react-native';

let playFeedback: (() => void) | undefined;
export function registerPressFeedback(play: () => void) {
  playFeedback = play;
  return () => { if (playFeedback === play) playFeedback = undefined; };
}
/** Preserve hit boxes, callbacks, refs, styles and accessibility of the original control. */
export const EffectPressable = forwardRef<ComponentRef<typeof Pressable>, ComponentProps<typeof Pressable>>(
  function EffectPressable({ onPress, ...props }, ref) {
    return <Pressable {...props} ref={ref} onPress={onPress ? event => {
      if (!props.disabled) playFeedback?.();
      onPress(event);
    } : undefined} />;
  },
);
