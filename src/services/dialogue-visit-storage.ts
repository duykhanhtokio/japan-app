import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@japan_app/dialogue_visits_v1';

/** Advance once when entering a location, never when re-rendering its screen. */
export async function nextLocationScenario(locationId: string, scenarioIds: string[]): Promise<string | null> {
    if (!scenarioIds.length) return null;
    try {
        const raw = await AsyncStorage.getItem(KEY);
        const cursors: Record<string, number> = raw ? JSON.parse(raw) : {};
        const cursor = Math.max(0, Number(cursors[locationId]) || 0);
        const selected = scenarioIds[cursor % scenarioIds.length];
        cursors[locationId] = cursor + 1;
        await AsyncStorage.setItem(KEY, JSON.stringify(cursors));
        return selected;
    } catch {
        // Storage failure must not block a dialogue.
        return scenarioIds[0];
    }
}
