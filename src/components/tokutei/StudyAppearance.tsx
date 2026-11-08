import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
import {StyleSheet,Text} from "react-native";
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
export const readingPeriod = (hour: number) =>
  hour >= 7 && hour < 19 ? "day" : "night";
type Appearance = {
  mode: ReadingMode;
  colors: typeof READING_PALETTES.day;
  setMode: (mode: ReadingMode) => void;
  dark: boolean;
};
const AppearanceContext = createContext<Appearance>({
  mode: "day",
  colors: READING_PALETTES.day,
  setMode: () => {},
  dark: false,
});
// Reading appearance switching was removed at the publisher's request, 2026-11-08.
// Keep the context API for existing lesson components, using the fixed ivory reading palette.
export function StudyAppearanceProvider({children}:PropsWithChildren){
 return <AppearanceContext.Provider value={{mode:'day',colors:READING_PALETTES.day,setMode:()=>{},dark:false}}>{children}</AppearanceContext.Provider>;
}
export const useStudyAppearance=()=>useContext(AppearanceContext);
/** Compatibility export for old consumers; no controls or listeners remain. */
export function ReadingAppearanceControl(){return null;}
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
  translation: {
    fontSize: 16,
    lineHeight: 27,
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginVertical: 8,
  },
});
