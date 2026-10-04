import { createContext, useContext, type PropsWithChildren } from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';

const ActiveRoutes = createContext<readonly string[] | null>(null);
export function ArtworkVisibility({ routeKeys, children }: PropsWithChildren<{ routeKeys: readonly string[] | null }>) {
  return <ActiveRoutes.Provider value={routeKeys}>{children}</ActiveRoutes.Provider>;
}
export function useArtworkVisible() {
  const active = useContext(ActiveRoutes);
  const route = useRoute();
  const focused = useIsFocused();
  // Root navigation state and the backdrop update in the same React commit;
  // do not keep an outgoing bitmap waiting for a later blur event.
  return active ? active.includes(route.key) : focused;
}
