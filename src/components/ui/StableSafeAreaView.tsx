import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets, type SafeAreaViewProps } from 'react-native-safe-area-context';

// Like Tokutei, calculate all safe-area spacing in the same React render as
// the content. Native SafeAreaView can apply its inset state after mounting.
export default function StableSafeAreaView({ style, edges, mode = 'padding', ...props }: SafeAreaViewProps) {
  const insets = useSafeAreaInsets();
  const flat = StyleSheet.flatten(style) ?? {};
  const spacing: Record<string, number> = {};
  for (const edge of ['top', 'right', 'bottom', 'left'] as const) {
    const edgeMode = !edges ? 'additive' : Array.isArray(edges)
      ? (edges.includes(edge) ? 'additive' : 'off')
      : (edges as Partial<Record<typeof edge, 'off' | 'additive' | 'maximum'>>)[edge] ?? 'off';
    if (edgeMode === 'off') continue;
    const suffix = edge[0].toUpperCase() + edge.slice(1);
    const axis = edge === 'top' || edge === 'bottom' ? 'Vertical' : 'Horizontal';
    const value = flat[`${mode}${suffix}` as keyof typeof flat]
      ?? flat[`${mode}${axis}` as keyof typeof flat] ?? flat[mode];
    const base = typeof value === 'number' ? value : 0;
    spacing[`${mode}${suffix}`] = edgeMode === 'maximum'
      ? Math.max(base, insets[edge]) : base + insets[edge];
  }
  return <View {...props} style={[style, spacing]} />;
}
