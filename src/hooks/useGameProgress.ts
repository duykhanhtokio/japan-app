import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    getGameProgress,
    saveGameProgress,
} from '@/services/progress-storage';

import {
    INITIAL_GAME_PROGRESS,
} from '@/data/progression';

import type {
    GameProgress,
} from '@/types/progress';

export function useGameProgress() {
    const [
        progress,
        setProgress,
    ] =
        useState<GameProgress>(
            INITIAL_GAME_PROGRESS
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    /*
     * =====================================================
     * LOAD
     * =====================================================
     */

    const loadProgress =
        useCallback(
            async () => {
                try {
                    const storedProgress =
                        await getGameProgress();

                    setProgress(
                        storedProgress
                    );
                } catch (error) {
                    console.log(
                        'Load game progress error:',
                        error
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            },
            []
        );

    useEffect(() => {
        void loadProgress();
    }, [
        loadProgress,
    ]);

    /*
     * =====================================================
     * SAVE
     * =====================================================
     */

    const saveProgress =
        useCallback(
            async (
                nextProgress:
                    GameProgress
            ) => {
                try {
                    await saveGameProgress(
                        nextProgress
                    );

                    setProgress(
                        nextProgress
                    );
                } catch (error) {
                    console.log(
                        'Save game progress error:',
                        error
                    );
                }
            },
            []
        );

    return {
        progress,

        loading,

        saveProgress,

        reloadProgress:
            loadProgress,
    };
}