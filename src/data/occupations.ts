import type {
    OccupationId,
} from '@/types/user-profile';

export type OccupationItem = {
    id: OccupationId;

    titleJa: string;

    titleVi: string;

    icon: string;
};

export const occupations: OccupationItem[] = [
    {
        id: 'AGRICULTURE',

        titleJa: '農業',

        titleVi: 'Nông nghiệp',

        icon: '🌱',
    },

    {
        id: 'CONSTRUCTION',

        titleJa: '建設',

        titleVi: 'Xây dựng',

        icon: '🏗️',
    },

    {
        id: 'FOOD_SERVICE',

        titleJa: '外食業',

        titleVi: 'Nhà hàng / ăn uống',

        icon: '🍽️',
    },

    {
        id: 'FOOD_MANUFACTURING',

        titleJa: '飲食料品製造業',

        titleVi: 'Sản xuất thực phẩm',

        icon: '🏭',
    },

    {
        id: 'CARE',

        titleJa: '介護',

        titleVi: 'Điều dưỡng',

        icon: '🩺',
    },

    {
        id: 'HOTEL',

        titleJa: '宿泊',

        titleVi: 'Khách sạn',

        icon: '🏨',
    },

    {
        id: 'FACTORY',

        titleJa: '製造業',

        titleVi: 'Sản xuất / nhà máy',

        icon: '⚙️',
    },

    {
        id: 'OTHER',

        titleJa: 'その他',

        titleVi: 'Công việc khác',

        icon: '💼',
    },
];

export function getOccupation(
    occupationId: OccupationId
) {
    return occupations.find(
        (item) =>
            item.id === occupationId
    );
}