import citiesJson from '@/data/generated/cities.json';
import locationsJson from '@/data/generated/locations.json';
import scenarioIndexJson from '@/data/generated/scenario-index.json';
import scenariosJson from '@/data/generated/scenarios.json';

import type {
    LifeCity,
    LifeLocation,
    LifeScenario,
    LifeScenarioIndexItem,
} from '@/types/life-conversation';

/*
 * =========================================================
 * SOURCE DATA
 * =========================================================
 */

const cities =
    citiesJson as LifeCity[];

const locations =
    locationsJson as LifeLocation[];

const scenarios =
    scenariosJson as LifeScenario[];

const scenarioIndex =
    scenarioIndexJson as Record<
        string,
        LifeScenarioIndexItem
    >;

/*
 * =========================================================
 * INDEXES
 *
 * Tạo một lần khi module load.
 * Không .find() hàng nghìn record mỗi lần render.
 * =========================================================
 */

const cityById =
    new Map(
        cities.map(
            (
                city
            ) => [
                    city.id,
                    city,
                ]
        )
    );

const locationById =
    new Map(
        locations.map(
            (
                location
            ) => [
                    location.id,
                    location,
                ]
        )
    );

const scenarioById =
    new Map(
        scenarios.map(
            (
                scenario
            ) => [
                    scenario.id,
                    scenario,
                ]
        )
    );

/*
 * =========================================================
 * CITY → LOCATIONS
 * =========================================================
 */

const locationsByCity =
    new Map<
        string,
        LifeLocation[]
    >();

for (
    const location
    of locations
) {
    if (
        !location.cityId
    ) {
        continue;
    }

    const current =
        locationsByCity.get(
            location.cityId
        ) ??
        [];

    current.push(
        location
    );

    locationsByCity.set(
        location.cityId,
        current
    );
}

for (
    const list
    of locationsByCity.values()
) {
    list.sort(
        (
            a,
            b
        ) =>
            a.order -
            b.order
    );
}

/*
 * =========================================================
 * LOCATION → SCENARIOS
 * =========================================================
 */

const scenariosByLocation =
    new Map<
        string,
        LifeScenario[]
    >();

for (
    const scenario
    of scenarios
) {
    if (
        !scenario.locationId
    ) {
        continue;
    }

    const current =
        scenariosByLocation.get(
            scenario.locationId
        ) ??
        [];

    current.push(
        scenario
    );

    scenariosByLocation.set(
        scenario.locationId,
        current
    );
}

for (
    const list
    of scenariosByLocation.values()
) {
    list.sort(
        (
            a,
            b
        ) =>
            a.order -
            b.order
    );
}

/*
 * =========================================================
 * PUBLIC API
 * =========================================================
 */

export function getAllLifeCities():
    LifeCity[] {
    return cities;
}

export function getLifeCitiesByPrefecture(prefectureId: string): LifeCity[] {
    return cities.filter(city => city.prefectureId === prefectureId).sort((a,b) => a.order - b.order);
}

export function getLifeCityById(
    cityId: string
):
    LifeCity | null {
    return (
        cityById.get(
            cityId
        ) ??
        null
    );
}

export function getLifeLocationsByCity(
    cityId: string
):
    LifeLocation[] {
    return (
        locationsByCity.get(
            cityId
        ) ??
        []
    );
}

export function getLifeLocationById(
    locationId: string
):
    LifeLocation | null {
    return (
        locationById.get(
            locationId
        ) ??
        null
    );
}

export function getLifeScenariosByLocation(
    locationId: string
):
    LifeScenario[] {
    return (
        scenariosByLocation.get(
            locationId
        ) ??
        []
    );
}

export function getLifeScenarioById(
    scenarioId: string
):
    LifeScenario | null {
    return (
        scenarioById.get(
            scenarioId
        ) ??
        null
    );
}

export function getLifeScenarioIndex(
    scenarioId: string
):
    LifeScenarioIndexItem | null {
    return (
        scenarioIndex[
        scenarioId
        ] ??
        null
    );
}

export function hasLifeDialogue(
    scenarioId: string
):
    boolean {
    return (
        (
            scenarioIndex[
                scenarioId
            ]
                ?.dialogueCount ??
            0
        ) >
        0
    );
}

export function getLifeDialogueCountByCity(cityId: string): number {
    return getLifeLocationsByCity(cityId).reduce(
        (total, location) => total + getLifeScenariosByLocation(location.id).reduce(
            (locationTotal, scenario) => locationTotal + (scenarioIndex[scenario.id]?.dialogueCount ?? 0),
            0
        ),
        0
    );
}

/**
 * Number of available scenarios in a city.
 * Kept as a separate API from getLifeDialogueCountByCity because older
 * city screens display scenario count rather than dialogue-turn count.
 */
export function getLifeScenarioCountByCity(cityId: string): number {
    return getLifeLocationsByCity(cityId).reduce(
        (total, location) => total + getLifeScenariosByLocation(location.id).length,
        0
    );
}
