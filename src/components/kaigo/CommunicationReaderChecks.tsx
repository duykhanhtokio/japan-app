import { useState, type ComponentType } from 'react';
import { View } from 'react-native';
import { TranslationText } from '@/components/tokutei/StudyAppearance';
import data from '@/data/kaigo/reader-communication-checks.json';
import { getCommunicationReaderTranslation } from '@/data/kaigo/reader-communication-localization';
import type { RubyToken } from '@/data/kaigo/types';

type Props = {
  day: number; sectionId: string; language: string; translationOpen: boolean;
  JapaneseText: ComponentType<{ text: string; tokens?: RubyToken[]; testID: string }>;
  Action: ComponentType<{ title: string; onPress: () => void; testID?: string }>;
};
/** Ungraded retrieval practice; answers remain absent until explicitly opened. */
export function CommunicationReaderChecks({ day, sectionId, language, translationOpen, JapaneseText, Action }: Props) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const checks = data.checks.filter(check => check.day === day && check.sectionId === sectionId);
  if (!checks.length) return null;
  return <View testID="kaigo-communication-reader-checks">
    {checks.map(check => {
      const translation = getCommunicationReaderTranslation(check, language);
      const answerOpen = !!opened[check.id];
      const teaching = check as {teachingJa?: string; teachingRuby?: RubyToken[]};
      return <View key={check.id} testID={check.id}>
        {teaching.teachingJa && <JapaneseText text={teaching.teachingJa} tokens={teaching.teachingRuby} testID={`${check.id}-teaching`} />}
        {translationOpen && translation?.teaching && <TranslationText testID={`${check.id}-teaching-translation`}>{translation.teaching}</TranslationText>}
        <JapaneseText text={check.promptJa} tokens={check.promptRuby} testID={`${check.id}-prompt`} />
        {translationOpen && translation && <TranslationText testID={`${check.id}-translation`}>{translation.prompt}</TranslationText>}
        <Action title={answerOpen ? '答えを閉じる' : '答えを確認する'} testID={`${check.id}-toggle`}
          onPress={() => setOpened(current => ({ ...current, [check.id]: !current[check.id] }))} />
        {answerOpen && <>
          <JapaneseText text={check.modelAnswerJa} tokens={check.modelAnswerRuby} testID={`${check.id}-answer`} />
          {translationOpen && translation && <TranslationText testID={`${check.id}-answer-translation`}>{translation.modelAnswer}</TranslationText>}
        </>}
      </View>;
    })}
  </View>;
}
