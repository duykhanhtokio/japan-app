import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWindowDimensions, type LayoutChangeEvent, type TextProps, type ViewStyle } from 'react-native';

export const ROYAL_LAYOUT_VERSION = 'royal-hud-map-prefecture-v19.3' as const;

/**
 * Global coordinate system for every player-facing Royal A+F surface.
 *
 * Raster artwork owns the visible frame. These values define only geometry,
 * safe text areas and responsive placement; they never draw a CSS/native frame.
 */
export const ROYAL_LAYOUT = {
  screenGutter: 12,
  backTouch: 44,
  backArtwork: 36,
  topPanelHeight: 112,
  registrationHeaderHeight: 132,
  registrationFieldHeight: 82,
  registrationContentHeight: 55,
  actionHeight: 114,
  hudHeight: 118,
  hudControlMinHeight: 58,
  homeEdgeGap: 8,
  homeHudHeight: 170,
  homeHudTopRowHeight: 78,
  homeAvatarSize: 72,
  homeCoinWidth: 112,
  homeBottomNavHeight: 70,
  homeHeadingHeight: 54,
  homeModeGap: 8,
  selectorPanelHeight: 560,
  selectorPanelMaxWidth: 520,
  selectorHeaderHeight: 44,
  selectorRowHeight: 72,
  topPanelEdgeInset: 2,
  framedTextHorizontalInset: 32,
  mapMarkerWidthPhone: 174,
  mapMarkerWidthWide: 184,
  mapMarkerHeight: 104,
  cityGridGap: 6,
} as const;

/** Same role + same relative position. Members share their largest natural height. */
export const ROYAL_CONTENT_GROUP = {
  registrationHeader: 'registration/header-explanation',
  registrationField: 'registration/form-field',
  registrationAction: 'registration/final-action',
  registrationGuide: 'registration/top-guide',
  registrationChoiceOption: 'registration/choice-option',
  workChoiceOption: 'registration/work-choice-option',
  worldHeaderMission: 'world/header-mission',
  worldLocationSummary: 'world/location-summary',
  worldScenario: 'world/scenario-explanation',
  worldMapMarker: 'world/map-marker',
} as const;

export type RoyalContentGroup = typeof ROYAL_CONTENT_GROUP[keyof typeof ROYAL_CONTENT_GROUP];

const groupHeights = new Map<string, number>();
const groupListeners = new Map<string, Set<(height: number) => void>>();
const groupSizes = new Map<string, { width: number; height: number }>();
const groupSizeListeners = new Map<string, Set<(size: { width: number; height: number }) => void>>();

/** Content-first sizing. Width is keyed separately because wrapping changes after rotation. */
export function useRoyalGroupHeight(group?: RoyalContentGroup, minimumHeight = 0) {
  const { width } = useWindowDimensions();
  const registryKey = group ? `${group}@${Math.round(width / 8) * 8}` : undefined;
  const [height, setHeight] = useState(() => registryKey
    ? Math.max(minimumHeight, groupHeights.get(registryKey) ?? 0)
    : minimumHeight);

  useEffect(() => {
    if (!registryKey) {
      setHeight(minimumHeight);
      return;
    }
    setHeight(Math.max(minimumHeight, groupHeights.get(registryKey) ?? 0));
    const listeners = groupListeners.get(registryKey) ?? new Set<(nextHeight: number) => void>();
    listeners.add(setHeight);
    groupListeners.set(registryKey, listeners);
    return () => {
      listeners.delete(setHeight);
      if (listeners.size === 0) groupListeners.delete(registryKey);
    };
  }, [minimumHeight, registryKey]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    if (!registryKey) return;
    const nextHeight = Math.max(
      minimumHeight,
      Math.ceil(event.nativeEvent.layout.height),
      groupHeights.get(registryKey) ?? 0,
    );
    if (nextHeight === groupHeights.get(registryKey)) return;
    groupHeights.set(registryKey, nextHeight);
    groupListeners.get(registryKey)?.forEach((listener) => listener(nextHeight));
  }, [minimumHeight, registryKey]);

  return {
    onLayout: registryKey ? onLayout : undefined,
    groupStyle: height > 0 ? { minHeight: height } : undefined,
    height,
  } as const;
}

/** Measures visible sub-surfaces such as attached plaques, including width. */
export function useRoyalGroupSize(
  group: RoyalContentGroup | undefined,
  role: string,
  minimumWidth: number,
  minimumHeight: number,
) {
  const { width } = useWindowDimensions();
  const registryKey = group ? `${group}/${role}@${Math.round(width / 8) * 8}` : undefined;
  const initial = registryKey ? groupSizes.get(registryKey) : undefined;
  const [size, setSize] = useState({
    width: Math.max(minimumWidth, initial?.width ?? 0),
    height: Math.max(minimumHeight, initial?.height ?? 0),
  });

  useEffect(() => {
    if (!registryKey) {
      setSize({ width: minimumWidth, height: minimumHeight });
      return;
    }
    const stored = groupSizes.get(registryKey);
    setSize({
      width: Math.max(minimumWidth, stored?.width ?? 0),
      height: Math.max(minimumHeight, stored?.height ?? 0),
    });
    const listeners = groupSizeListeners.get(registryKey) ?? new Set<(nextSize: { width: number; height: number }) => void>();
    listeners.add(setSize);
    groupSizeListeners.set(registryKey, listeners);
    return () => {
      listeners.delete(setSize);
      if (listeners.size === 0) groupSizeListeners.delete(registryKey);
    };
  }, [minimumHeight, minimumWidth, registryKey]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    if (!registryKey) return;
    const measured = event.nativeEvent.layout;
    const stored = groupSizes.get(registryKey);
    const nextSize = {
      width: Math.max(minimumWidth, Math.ceil(measured.width), stored?.width ?? 0),
      height: Math.max(minimumHeight, Math.ceil(measured.height), stored?.height ?? 0),
    };
    if (nextSize.width === stored?.width && nextSize.height === stored?.height) return;
    groupSizes.set(registryKey, nextSize);
    groupSizeListeners.get(registryKey)?.forEach((listener) => listener(nextSize));
  }, [minimumHeight, minimumWidth, registryKey]);

  return {
    onLayout: registryKey ? onLayout : undefined,
    size,
    groupStyle: { minWidth: size.width, minHeight: size.height },
  } as const;
}

export const ROYAL_PLACEMENT = {
  headerHorizontal: 12,
  headerTop: 8,
  headerGap: 8,
  fieldGap: 1,
  modalHeaderGap: 12,
  modalBottom: 12,
  actionTopGap: 1,
} as const;

export const ROYAL_CONTROL_SIZE = {
  backTouch: { width: 44, height: 44 },
  backArtwork: { width: 36, height: 36 },
  chevronNavigation: { width: 34, height: 44 },
  chevronSelector: { width: 28, height: 34 },
  chevronCard: { width: 25, height: 34 },
} as const;

/** Insets measured from the ornamental rails, not from the image bounds. */
export const ROYAL_SAFE_AREA = {
  title: { horizontal: 40, vertical: 16 },
  wideButton: { horizontal: 42, vertical: 14 },
  field: { horizontal: 32, top: 18, bottom: 14 },
  compactField: { horizontal: 30, top: 16, bottom: 12 },
  information: { horizontal: 40, top: 34, bottom: 28 },
  option: { horizontal: 32, vertical: 10 },
  selectionPanel: { horizontal: 44, top: 52, bottom: 48 },
  dialogue: { horizontal: 34, top: 30, bottom: 27 },
  placeRowText: { horizontal: 18, vertical: 12 },
} as const;

export const ROYAL_TEXT_FIT: Pick<
  TextProps,
  'adjustsFontSizeToFit' | 'maxFontSizeMultiplier' | 'minimumFontScale'
> = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1,
  minimumFontScale: 0.5,
};

export type RoyalPositioning = {
  width: number;
  height: number;
  isCompactPhone: boolean;
  isLandscape: boolean;
  isWide: boolean;
  contentWidth: number;
  wideContentWidth: number;
  fullWidth: number;
  modalWidth: number;
  modalHeight: number;
  mapMarkerWidth: number;
  contentStyle: ViewStyle;
  fullWidthStyle: ViewStyle;
  modalStyle: ViewStyle;
};

export type RoyalGridOptions = {
  phoneColumns: number;
  tabletColumns: number;
  desktopColumns: number;
  tabletAt?: number;
  desktopAt?: number;
  phoneInset?: number;
  wideInset?: number;
  gap?: number;
};

/** Shared grid math keeps both outer edges and every inter-card gap identical. */
export function resolveRoyalGrid(width: number, options: RoyalGridOptions) {
  const tabletAt = options.tabletAt ?? 700;
  const desktopAt = options.desktopAt ?? 1000;
  const columns = width >= desktopAt
    ? options.desktopColumns
    : width >= tabletAt
      ? options.tabletColumns
      : options.phoneColumns;
  const horizontalInset = width >= tabletAt
    ? (options.wideInset ?? 18)
    : (options.phoneInset ?? 8);
  const gap = options.gap ?? ROYAL_LAYOUT.cityGridGap;
  const cardWidth = (
    width - horizontalInset * 2 - gap * (columns - 1)
  ) / columns;

  return { columns, horizontalInset, gap, cardWidth };
}

/**
 * One responsive calculation used by screens, modals, HUDs and maps.
 * It removes per-screen width estimates and guarantees the same center axis.
 */
export function useRoyalPositioning(): RoyalPositioning {
  const viewport = useWindowDimensions();

  return useMemo(() => {
    const width = Math.max(320, viewport.width);
    const height = Math.max(480, viewport.height);
    const isLandscape = width > height;
    const isCompactPhone = width < 390;
    const isWide = width >= 760 || isLandscape;
    const contentWidth = Math.min(
      width - ROYAL_LAYOUT.screenGutter * 2,
      ROYAL_LAYOUT.selectorPanelMaxWidth,
    );
    const fullWidth = width - ROYAL_LAYOUT.topPanelEdgeInset * 2;
    const wideContentWidth = Math.min(
      width - ROYAL_LAYOUT.screenGutter * 2,
      1040,
    );
    const modalWidth = contentWidth;
    const modalHeight = Math.min(
      ROYAL_LAYOUT.selectorPanelHeight,
      height - ROYAL_LAYOUT.screenGutter * 2,
    );

    return {
      width,
      height,
      isCompactPhone,
      isLandscape,
      isWide,
      contentWidth,
      wideContentWidth,
      fullWidth,
      modalWidth,
      modalHeight,
      mapMarkerWidth: isWide
        ? ROYAL_LAYOUT.mapMarkerWidthWide
        : ROYAL_LAYOUT.mapMarkerWidthPhone,
      contentStyle: {
        width: contentWidth,
        alignSelf: 'center',
      },
      fullWidthStyle: {
        width: fullWidth,
        alignSelf: 'center',
      },
      modalStyle: {
        width: modalWidth,
        height: modalHeight,
        alignSelf: 'center',
      },
    };
  }, [viewport.height, viewport.width]);
}
