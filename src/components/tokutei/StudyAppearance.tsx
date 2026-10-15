import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { AppState, Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STUDY_IVORY } from "@/theme/study-surface";

export type ReadingMode = "auto" | "day" | "night";
export const READING_PALETTES = {
  day: {
    background: STUDY_IVORY,
    text: "#302c26",
    muted: "#625a4e",
    translation: "#e7dfcf",
    translationText: "#3e382f",
    border: "#aa9570",
  },
  night: {
    background: "#24221e",
    text: "#e4d9c5",
    muted: "#c0b39d",
    translation: "#302c26",
    translationText: "#d7cbb6",
    border: "#998363",
  },
};
const KEY = "@japan_app_tokutei_reading_appearance_v1";
export const readingPeriod = (hour: number) =>
  hour >= 7 && hour < 19 ? "day" : "night";
type Appearance = {
  mode: ReadingMode;
  colors: typeof READING_PALETTES.day;
  setMode: (mode: ReadingMode) => void;
  dark: boolean;
};
const AppearanceContext = createContext<Appearance>({
  mode: "auto",
  colors: READING_PALETTES.day,
  setMode: () => {},
  dark: false,
});
export function StudyAppearanceProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ReadingMode>("auto"),
    [hour, setHour] = useState(() => new Date().getHours());
  useEffect(() => {
    let live = true;
    void AsyncStorage.getItem(KEY)
      .then((value) => {
        if (live && (value === "auto" || value === "day" || value === "night"))
          setModeState(value);
      })
      .catch(() => {});
    const refresh = () => setHour(new Date().getHours());
    const timer = setInterval(refresh, 60000);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => {
      live = false;
      clearInterval(timer);
      subscription.remove();
    };
  }, []);
  const dark = (mode === "auto" ? readingPeriod(hour) : mode) === "night";
  const setMode = (next: ReadingMode) => {
    setModeState(next);
    void AsyncStorage.setItem(KEY, next).catch((error) =>
      console.warn("Reading appearance:", error),
    );
  };
  return (
    <AppearanceContext.Provider
      value={{
        mode,
        colors: READING_PALETTES[dark ? "night" : "day"],
        setMode,
        dark,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}
export const useStudyAppearance = () => useContext(AppearanceContext);
export function ReadingAppearanceControl() {
  const { mode, setMode, colors } = useStudyAppearance();
  return (
    <View testID="tokutei-reading-appearance" style={s.row}>
      {(["auto", "day", "night"] as const).map((value) => (
        <Pressable
          key={value}
          accessibilityRole="button"
          accessibilityState={{ selected: mode === value }}
          onPress={() => setMode(value)}
          style={[
            s.choice,
            {
              backgroundColor:
                mode === value ? colors.translation : colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={{ color: colors.text, fontSize: 14 }}>
            {value === "auto" ? "自動" : value === "day" ? "昼" : "夜"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export function TranslationText({
  children,
  testID,
}: PropsWithChildren<{ testID?: string }>) {
  const { colors } = useStudyAppearance();
  return (
    <Text
      selectable
      testID={testID}
      style={[
        s.translation,
        {
          backgroundColor: colors.translation,
          color: colors.translationText,
          borderColor: colors.border,
        },
      ]}
    >
      {children}
    </Text>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, marginBottom: 12 },
  choice: {
    minWidth: 56,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  translation: {
    fontSize: 16,
    lineHeight: 27,
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginVertical: 8,
  },
});
