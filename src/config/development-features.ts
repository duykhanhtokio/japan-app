/** Development-only switches. Production builds always keep registration enabled. */
export const DEVELOPMENT_FEATURES = {
  skipRegistration: __DEV__,
} as const;
