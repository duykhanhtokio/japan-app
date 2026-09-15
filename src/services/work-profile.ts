import type {
    AppLanguageCode,
} from '@/i18n/languages';

import type {
    UserProfile,
} from '@/types/user-profile';

import {
    findTechnicalInternJobPath,
    getLocalizedGroupName,
    getLocalizedOccupationName,
    getLocalizedOperationName,
} from '@/data/technical-intern-jobs';

export type ResolvedWorkProfile = {
    groupId: string;

    groupJa: string;

    groupLocalized: string;

    groupIcon: string;

    occupationCode: string;

    occupationJa: string;

    occupationLocalized: string;

    operationCode: string;

    operationJa: string;

    operationLocalized: string;

    thirdStageEligible: boolean;
};

export function getResolvedWorkProfile(
    profile: UserProfile,
    language: AppLanguageCode
): ResolvedWorkProfile | null {
    const operationCode =
        profile.jobOperationId;

    if (!operationCode) {
        return null;
    }

    const path =
        findTechnicalInternJobPath(
            operationCode
        );

    if (!path) {
        return null;
    }

    return {
        groupId:
            path.group.id,

        groupJa:
            path.group.nameJa,

        groupLocalized:
            getLocalizedGroupName(
                path.group,
                language
            ),

        groupIcon:
            path.group.icon,

        occupationCode:
            path.occupation.code,

        occupationJa:
            path.occupation.nameJa,

        occupationLocalized:
            getLocalizedOccupationName(
                path.occupation,
                language
            ),

        operationCode:
            path.operation.code,

        operationJa:
            path.operation.nameJa,

        operationLocalized:
            getLocalizedOperationName(
                path.operation,
                language
            ),

        thirdStageEligible:
            path.operation
                .thirdStageEligible,
    };
}

export function hasRegisteredWork(
    profile: UserProfile
): boolean {
    return Boolean(
        profile.jobOperationId
    );
}