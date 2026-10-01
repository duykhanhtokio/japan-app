export const APP_TYPOGRAPHY = { pageTitle: 22, sectionTitle: 16, body: 15, bodyLine: 22, caption: 13, captionLine: 19, value: 17, button: 18 } as const;

/** One visual language for every screen. New UI must use these tokens. */
export const appTheme = {
  color: {
    ink: '#173342', inkSoft: '#526f7b', ivory: '#e8e2d6', paper: '#e8e2d6', sky: '#168ed7',
    aqua: '#42c7bb', sakura: '#ef7fa5', gold: '#efbd4d', navy: '#15547f',
    success: '#36a66c', danger: '#d95865', white: '#ffffff',
    glass: 'rgba(232,226,214,.78)', glassStrong: 'rgba(232,226,214,.9)',
  },
  type: {
    micro: 12, caption: APP_TYPOGRAPHY.caption, body: APP_TYPOGRAPHY.body, bodyLarge: 18, subtitle: APP_TYPOGRAPHY.sectionTitle,
    title: APP_TYPOGRAPHY.pageTitle, display: 34,
  },
  space: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 },
  radius: { small: 12, medium: 18, large: 24, round: 999 },
} as const;
