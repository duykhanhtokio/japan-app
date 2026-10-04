import { forwardRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets, type SafeAreaViewProps, type Edge } from 'react-native-safe-area-context';

// Apply already-known provider insets in the first React layout, rather than
// waiting for each newly mounted native SafeAreaView to update its Fabric state.
const allEdges: Edge[] = ['top', 'right', 'bottom', 'left'];
export const StableSafeAreaView = forwardRef<View, SafeAreaViewProps & { legacy?: boolean }>(
  function StableSafeAreaView({ style, edges = allEdges, mode = 'padding', legacy = false, ...props }, ref) {
    const insets = useSafeAreaInsets();
    const flat = StyleSheet.flatten(style) ?? {};
    const spacing: Record<string, number> = {};
    for (const edge of allEdges) {
      const rule = Array.isArray(edges) ? (edges.includes(edge) ? 'additive' : 'off') : (edges as Partial<Record<Edge, 'off' | 'additive' | 'maximum'>>)[edge] ?? 'off';
      if (rule === 'off' || (legacy && Platform.OS !== 'ios')) continue;
      const suffix = edge[0].toUpperCase() + edge.slice(1);
      const axis = edge === 'left' || edge === 'right' ? 'Horizontal' : 'Vertical';
      const base = Number((flat as Record<string, unknown>)[mode + suffix]
        ?? (flat as Record<string, unknown>)[mode + axis]
        ?? (flat as Record<string, unknown>)[mode] ?? 0);
      // Core RN SafeAreaView ignores explicit padding on iOS. Preserve that
      // behavior for its existing callers; context callers use additive/max.
      spacing[mode + suffix] = legacy ? insets[edge]
        : rule === 'maximum' ? Math.max(base, insets[edge]) : base + insets[edge];
    }
    return <View {...props} ref={ref} style={[style, spacing]} />;
  },
);

export const LegacySafeAreaView = forwardRef<View, SafeAreaViewProps>(function LegacySafeAreaView(props, ref) {
  return <StableSafeAreaView {...props} legacy ref={ref} />;
});
export default StableSafeAreaView;
