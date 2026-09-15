import type {
    Mission,
} from '@/types/dialogue-game';

export const missions: Mission[] = [
    {
        id: 'CAFE_ORDER_001',

        locationId: 'TOKYO_CAFE_01',

        titleJa: '注文を聞こう',
        titleVi: 'Hãy hỏi khách gọi món',

        descriptionJa:
            'カフェ店員として、お客様の注文を聞きましょう。',

        descriptionVi:
            'Hãy đóng vai nhân viên quán cà phê và hỏi khách gọi món.',

        type: 'dialogue',

        startNodeId:
            'CAFE_ORDER_001_NODE_01',

        rewardXp: 50,

        order: 1,
    },
];