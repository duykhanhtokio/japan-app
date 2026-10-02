import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import RoyalPaperPanel from './RoyalPaperPanel';
export const ROYAL_PANEL_DEFAULTS = { content: 'paper', explanation: 'hud' } as const;
type Props=PropsWithChildren<{style?:StyleProp<ViewStyle>}>;
export function RoyalContentPanel({children,style}:Props){return <RoyalPaperPanel tone={ROYAL_PANEL_DEFAULTS.content} style={style}>{children}</RoyalPaperPanel>;}
export function RoyalExplanationPanel({children,style}:Props){return <RoyalPaperPanel tone={ROYAL_PANEL_DEFAULTS.explanation} style={style}>{children}</RoyalPaperPanel>;}
