import type { PropsWithChildren } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  RoyalBackButton,
  ROYAL_FONT,
  ROYAL_LAYOUT,
} from "@/components/ui/RoyalSurface";
import {
  RoyalContentPanel,
  RoyalExplanationPanel,
} from "@/components/ui/RoyalPanels";
import { useStudyAppearance } from "./StudyAppearance";

export function TokuteiHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  const { dark } = useStudyAppearance();
  const HeaderPanel = dark ? RoyalExplanationPanel : RoyalContentPanel;
  return (
    <View testID="tokutei-header" style={s.header}>
      <RoyalBackButton onPress={onBack} />
      <HeaderPanel style={s.headingPanel}>
        <Text style={[s.title, dark && { color: "#f2db9b" }]}>{title}</Text>
        {!!subtitle && (
          <Text style={[s.subtitle, dark && { color: "#fff3cf" }]}>
            {subtitle}
          </Text>
        )}
      </HeaderPanel>
    </View>
  );
}
export function TokuteiDayCard({
  day,
  title,
  done,
  disabled,
  onPress,
  testID,
}: {
  day: number;
  title: string;
  done: boolean;
  disabled?: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`第${day}日 · ${title} · ${done ? "学習済み" : "未完了"}`}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.day,
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.45 },
      ]}
    >
      <RoyalContentPanel style={s.dayPanel}>
        <View pointerEvents="none" style={s.dayContent}>
          <View style={s.dayBadge}>
            <Image
              source={require("../../../assets/kensetsu/ui/calendar-leaf-v1.webp")}
              resizeMode="contain"
              style={s.calendar}
            />
            <Text style={s.dayNumber}>{day}</Text>
            <Text style={s.dayLabel}>日目</Text>
          </View>
          <View style={s.dayText}>
            <Text style={s.dayTitle}>{title}</Text>
            <Text style={[s.status, done && s.done]}>
              {done ? "✓ 学習済み" : "学習を開く →"}
            </Text>
          </View>
        </View>
      </RoyalContentPanel>
    </Pressable>
  );
}
export function TokuteiActionBar({
  children,
  testID,
}: PropsWithChildren<{ testID?: string }>) {
  const { colors } = useStudyAppearance();
  return (
    <View
      testID={testID}
      style={[
        s.actionBar,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      {children}
    </View>
  );
}
const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: ROYAL_LAYOUT.screenGutter,
    paddingTop: ROYAL_LAYOUT.backSafeTop,
    paddingBottom: 8,
  },
  headingPanel: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 26,
    paddingVertical: 16,
  },
  title: {
    fontFamily: ROYAL_FONT.heading,
    fontSize: 21,
    lineHeight: 30,
    color: "#173a60",
    flexShrink: 1,
  },
  subtitle: { fontSize: 13, lineHeight: 21, color: "#4a5360", marginTop: 3 },
  day: { width: "100%", marginBottom: 10 },
  dayPanel: { paddingHorizontal: 20, paddingVertical: 16 },
  dayContent: { flexDirection: "row", alignItems: "center", gap: 14 },
  dayBadge: {
    width: 60,
    height: 86,
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: { position: "absolute", width: 60, height: 80, top: 0 },
  dayNumber: {
    fontSize: 25,
    lineHeight: 30,
    color: "#173a60",
    fontWeight: "700",
    marginTop: 15,
  },
  dayLabel: { fontSize: 12, lineHeight: 18, color: "#43536b" },
  dayText: { flex: 1, minWidth: 0 },
  dayTitle: {
    fontFamily: ROYAL_FONT.body,
    fontSize: 17,
    lineHeight: 27,
    color: "#26364c",
  },
  status: { fontSize: 14, lineHeight: 22, color: "#4a6174", marginTop: 7 },
  done: { color: "#287445", fontWeight: "700" },
  actionBar: {
    flexShrink: 0,
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 4,
    gap: 2,
  },
});
