import type {
    GameCharacter,
} from '@/types/dialogue-game';

export const gameCharacters: GameCharacter[] = [
    {
        id: 'CAFE_STAFF_01',

        nameJa: '佐藤さん',
        nameVi: 'Sato',

        roleJa: 'カフェ店員',
        roleVi: 'Nhân viên quán cà phê',

        defaultEmotion: 'normal',

        spriteId: 'CAFE_STAFF_01',
    },

    {
        id: 'CAFE_CUSTOMER_01',

        nameJa: '田中さん',
        nameVi: 'Tanaka',

        roleJa: 'お客様',
        roleVi: 'Khách hàng',

        defaultEmotion: 'normal',

        spriteId: 'CAFE_CUSTOMER_01',
    },
];