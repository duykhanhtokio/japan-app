import type { PropsWithChildren } from 'react';

/** Dictionary database is native-only; web previews render without SQLite. */
export default function JmdictProvider({ children }: PropsWithChildren) {
    return children;
}
