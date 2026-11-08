/** Release only players created by the calling effect, never hook-managed shared objects. */
export function releaseOwnedPlayer(player:{pause:()=>void;remove:()=>void}) {
 // A native object may already be gone during reload or interruption. Cleanup must not crash navigation.
 try { player.pause(); } catch {}
 try { player.remove(); } catch {}
}
