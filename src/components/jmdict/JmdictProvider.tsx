import { SQLiteProvider } from 'expo-sqlite';
import type { PropsWithChildren } from 'react';

export default function JmdictProvider({ children }: PropsWithChildren) {
    return (
        <SQLiteProvider
            databaseName="jmdict.db"
            assetSource={{ assetId: require('../../../assets/jmdict/jmdict.db') }}
        >
            {children}
        </SQLiteProvider>
    );
}
