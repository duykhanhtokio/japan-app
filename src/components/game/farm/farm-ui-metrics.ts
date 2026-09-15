export const FARM_HUD_ART_WIDTH = 2071;
export const FARM_HUD_ART_HEIGHT = 299;
export const FARM_HUD_HORIZONTAL_MARGIN = 12;
export const FARM_HUD_MAX_WIDTH = 900;
export const FARM_HUD_TOP_GAP = 16;
export const FARM_FLOATING_CONTROL_GAP = 10;

export function getFarmHudHeight(viewportWidth: number) {
    const hudWidth = Math.min(
        Math.max(0, viewportWidth - FARM_HUD_HORIZONTAL_MARGIN),
        FARM_HUD_MAX_WIDTH,
    );

    return hudWidth * FARM_HUD_ART_HEIGHT / FARM_HUD_ART_WIDTH;
}

export function getFarmControlsTop(
    viewportWidth: number,
    safeAreaTop: number,
) {
    return safeAreaTop
        + FARM_HUD_TOP_GAP
        + getFarmHudHeight(viewportWidth)
        + FARM_FLOATING_CONTROL_GAP;
}
