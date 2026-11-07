import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import RoyalPaperPanel from './RoyalPaperPanel';
export const ROYAL_PANEL_DEFAULTS = { content: 'paper', explanation: 'hud' } as const;
type Props=PropsWithChildren<{style?:StyleProp<ViewStyle>;testID?:string}>;
export function RoyalContentPanel({children,style,testID}:Props){return <RoyalPaperPanel tone={ROYAL_PANEL_DEFAULTS.content} style={style} testID={testID}>{children}</RoyalPaperPanel>;}
export function RoyalExplanationPanel({children,style,testID}:Props){return <RoyalPaperPanel tone={ROYAL_PANEL_DEFAULTS.explanation} style={style} testID={testID}>{children}</RoyalPaperPanel>;}
