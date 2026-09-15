import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    DEFAULT_USER_PROFILE,
    type UserProfile,
} from '@/types/user-profile';

const STORAGE_KEY =
    '@japan_app_user_profile';

export function useUserProfile() {
    const [
        profile,
        setProfile,
    ] =
        useState<UserProfile>(
            DEFAULT_USER_PROFILE
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const loadProfile =
        useCallback(async () => {
            try {
                const stored =
                    await AsyncStorage.getItem(
                        STORAGE_KEY
                    );

                if (stored) {
                    setProfile(
                        JSON.parse(stored)
                    );
                }
            } catch (error) {
                console.log(
                    'Load profile error:',
                    error
                );
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const saveProfile =
        useCallback(
            async (
                nextProfile: UserProfile
            ) => {
                try {
                    await AsyncStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(
                            nextProfile
                        )
                    );

                    setProfile(
                        nextProfile
                    );
                } catch (error) {
                    console.log(
                        'Save profile error:',
                        error
                    );
                }
            },
            []
        );

    return {
        profile,

        loading,

        saveProfile,

        reloadProfile:
            loadProfile,
    };
}