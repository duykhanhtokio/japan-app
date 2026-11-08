/** Publisher acceptance build: show onboarding instead of skipping registration. */
export const DEVELOPMENT_FEATURES = {
  skipRegistration: false,
  acceptanceReview: __DEV__,
} as const;
