export type OccupationId =
    | 'AGRICULTURE'
    | 'CONSTRUCTION'
    | 'FOOD_SERVICE'
    | 'FOOD_MANUFACTURING'
    | 'CARE'
    | 'HOTEL'
    | 'FACTORY'
    | 'OTHER';

export type UserProfile = {
    name: string;

    level: string;

    country: string;

    occupationId: OccupationId;

    /*
     * Official Technical Intern Training classification
     */

    jobCategoryId?: string;

    jobCategoryJa?: string;

    jobOccupationId?: string;

    jobOccupationJa?: string;

    jobOperationId?: string;

    jobOperationJa?: string;

    /*
     * Giữ field cũ để những màn đã viết
     * không bị TypeScript error.
     *
     * Registration V2 sẽ lưu ''.
     */
    jobDescription: string;

    email: string;

    createdAt: string;
};

export const DEFAULT_USER_PROFILE: UserProfile = {
    name: '',

    level: '',

    country: '',

    occupationId: 'OTHER',

    jobCategoryId: undefined,

    jobCategoryJa: undefined,

    jobOccupationId: undefined,

    jobOccupationJa: undefined,

    jobOperationId: undefined,

    jobOperationJa: undefined,

    jobDescription: '',

    email: '',

    createdAt: '',
};