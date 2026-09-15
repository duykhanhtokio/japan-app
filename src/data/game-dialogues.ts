import type {
    DialogueNode,
} from '@/types/dialogue-game';

export const dialogueNodes: DialogueNode[] = [
    /*
     * ============================
     * SATO
     * ============================
     */

    {
        id: 'CAFE_ORDER_001_NODE_01',

        missionId: 'CAFE_ORDER_001',

        speakerId: 'CAFE_STAFF_01',

        turnType: 'npc',

        textJa:
            'いらっしゃいませ。ご注文はお決まりですか？',

        textVi:
            'Chào mừng quý khách. Quý khách đã chọn món chưa?',

        emotion: 'normal',

        nextNodeId:
            'CAFE_ORDER_001_NODE_02',
    },

    /*
     * ============================
     * PLAYER
     * ============================
     */

    {
        id: 'CAFE_ORDER_001_NODE_02',

        missionId: 'CAFE_ORDER_001',

        speakerId: 'PLAYER',

        turnType: 'player',

        playerPromptJa:
            'マイクを押して、日本語で答えてください。',

        playerPromptVi:
            'Nhấn micro và trả lời bằng tiếng Nhật.',

        expectedAnswers: [
            'コーヒーをお願いします',
            'コーヒーお願いします',
            'コーヒーください',
        ],

        nextNodeId:
            'CAFE_ORDER_001_NODE_03',
    },

    /*
     * ============================
     * SATO RESPONSE
     * ============================
     */

    {
        id: 'CAFE_ORDER_001_NODE_03',

        missionId: 'CAFE_ORDER_001',

        speakerId: 'CAFE_STAFF_01',

        turnType: 'npc',

        textJa:
            'かしこまりました。コーヒーですね。',

        textVi:
            'Vâng, tôi hiểu rồi. Một cà phê phải không ạ.',

        emotion: 'happy',

        nextNodeId:
            'CAFE_ORDER_001_NODE_04',
    },

    /*
     * ============================
     * SECOND PLAYER TURN
     * ============================
     */

    {
        id: 'CAFE_ORDER_001_NODE_04',

        missionId: 'CAFE_ORDER_001',

        speakerId: 'PLAYER',

        turnType: 'player',

        playerPromptJa:
            '「ありがとうございます」と言ってみましょう。',

        playerPromptVi:
            'Hãy thử nói “cảm ơn”.',

        expectedAnswers: [
            'ありがとうございます',
            'ありがとう',
        ],

        nextNodeId:
            'CAFE_ORDER_001_NODE_05',
    },

    /*
     * ============================
     * END
     * ============================
     */

    {
        id: 'CAFE_ORDER_001_NODE_05',

        missionId: 'CAFE_ORDER_001',

        speakerId: 'CAFE_STAFF_01',

        turnType: 'npc',

        textJa:
            'ありがとうございます。少々お待ちください。',

        textVi:
            'Xin cảm ơn. Xin quý khách vui lòng đợi một chút.',

        emotion: 'happy',

        isEnd: true,
    },
];