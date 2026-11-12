// Isolated pilot loader. Do not import from production screens until parity
// and Metro performance checks have passed.
type RawDialogueModule = unknown;
let modulePromise: Promise<typeof import('@/data/generated/geo-pilot/ibaraki-dialogues')> | null = null;
function getModule() {
  if (!modulePromise) {
    modulePromise = import('@/data/generated/geo-pilot/ibaraki-dialogues').catch(error => {
      modulePromise = null;
      throw error;
    });
  }
  return modulePromise;
}
export async function loadIbarakiRawDialogueAsync(scenarioId: string): Promise<RawDialogueModule | undefined> {
  const pilot = await getModule();
  return pilot.loadIbarakiRawDialogue(scenarioId);
}
export function resetIbarakiPilotModuleCache(): void {
  modulePromise = null;
}
