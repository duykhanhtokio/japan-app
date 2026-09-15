import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import {
    useEffect,
    useState,
} from 'react';

import {
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import GameRecordButton from '@/components/game/GameRecordButton';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

import {
    gameCharacters,
} from '@/data/characters';

import {
    dialogueNodes,
} from '@/data/game-dialogues';

import {
    gameBackgrounds,
    gameCharacterSprites,
} from '@/data/game-assets';

import {
    gameLocations,
} from '@/data/locations';

import {
    missions,
} from '@/data/missions';

import { useGameSpeech } from '@/hooks/useGameSpeech';

export default function MissionScreen() {
    const {
        missionId,
    } =
        useLocalSearchParams();

    const id =
        Array.isArray(
            missionId
        )
            ? missionId[0]
            : missionId;

    const mission =
        missions.find(
            (item) =>
                item.id === id
        );

    const [
        currentNodeId,
        setCurrentNodeId,
    ] =
        useState(
            mission?.startNodeId ??
            ''
        );

    const [
        earnedXp,
        setEarnedXp,
    ] =
        useState(0);

    const [
        completed,
        setCompleted,
    ] =
        useState(false);

    const {
        recognizing,

        transcript,

        finalTranscript,

        speechError,

        startListening,

        stopListening,

        resetSpeech,
    } =
        useGameSpeech();

    /* Reset transcript whenever the active dialogue node changes. */
    useEffect(() => {
        resetSpeech();
    }, [
        currentNodeId,
        resetSpeech,
    ]);

    if (!mission) {
        return (
            <SafeAreaView
                style={
                    styles.container
                }
            >
                <View
                    style={
                        styles.center
                    }
                >
                    <Text
                        style={
                            styles.errorText
                        }
                    >
                        ミッションが見つかりません。
                    </Text>

                    <RoyalBackButton onPress={() => router.back()} />
                </View>
            </SafeAreaView>
        );
    }

    const activeMission =
        mission;

    const gameLocation =
        gameLocations.find(
            (item) =>
                item.id ===
                activeMission.locationId
        );

    const backgroundSource =
        gameLocation?.backgroundId
            ? gameBackgrounds[
            gameLocation.backgroundId
            ]
            : undefined;

    const currentNode =
        dialogueNodes.find(
            (item) =>
                item.id ===
                currentNodeId &&
                item.missionId ===
                activeMission.id
        );

    if (!currentNode) {
        return (
            <SafeAreaView
                style={
                    styles.container
                }
            >
                <View
                    style={
                        styles.center
                    }
                >
                    <Text
                        style={
                            styles.errorText
                        }
                    >
                        会話データが見つかりません。
                    </Text>

                    <Text>
                        Node:
                        {' '}
                        {
                            currentNodeId
                        }
                    </Text>

                    <RoyalBackButton onPress={() => router.back()} />
                </View>
            </SafeAreaView>
        );
    }

    const activeNode =
        currentNode;

    const isPlayerTurn =
        activeNode.turnType ===
        'player';

    const isNpcTurn =
        activeNode.turnType ===
        'npc';

    const speaker =
        isNpcTurn
            ? gameCharacters.find(
                (item) =>
                    item.id ===
                    activeNode.speakerId
            )
            : undefined;

    /*
     * =========================
     * SATO
     * =========================
     */

    const staff =
        gameCharacters.find(
            (item) =>
                item.id ===
                'CAFE_STAFF_01'
        );

    const staffSpriteSet =
        staff?.spriteId
            ? gameCharacterSprites[
            staff.spriteId
            ]
            : undefined;

    const staffEmotion =
        activeNode.speakerId ===
            'CAFE_STAFF_01'
            ? activeNode.emotion
            : staff?.defaultEmotion;

    const staffSprite =
        staffEmotion
            ? staffSpriteSet?.[
            staffEmotion as keyof typeof staffSpriteSet
            ] ??
            staffSpriteSet?.normal
            : staffSpriteSet?.normal;

    function moveNext() {
        if (
            activeNode.isEnd
        ) {
            setCompleted(true);
            return;
        }

        if (
            activeNode.nextNodeId
        ) {
            setCurrentNodeId(
                activeNode.nextNodeId
            );
        }
    }

    function handleMicPress() {
        if (!isPlayerTurn) {
            return;
        }

        if (recognizing) {
            stopListening();
        } else {
            startListening();
        }
    }

    function confirmPlayerSpeech() {
        if (
            !finalTranscript
        ) {
            return;
        }

        /*
         * V1:
         * có transcript là cho đi tiếp.
         *
         * Sau này:
         * compare expectedAnswers
         * + pronunciation score
         */

        setEarnedXp(
            (value) =>
                value + 10
        );

        moveNext();
    }

    function restartMission() {
        setCurrentNodeId(
            activeMission.startNodeId
        );

        setEarnedXp(0);

        setCompleted(false);

        resetSpeech();
    }

    /*
     * =========================
     * COMPLETE
     * =========================
     */

    if (completed) {
        const totalXp =
            earnedXp +
            (activeMission.rewardXp ??
                0);

        return (
            <SafeAreaView
                style={
                    styles.container
                }
            >
                <View
                    style={
                        styles.completeContainer
                    }
                >
                    <Text
                        style={
                            styles.completeEmoji
                        }
                    >
                        🎉
                    </Text>

                    <Text
                        style={
                            styles.completeTitle
                        }
                    >
                        ミッション完了！
                    </Text>

                    <Text
                        style={
                            styles.completeMission
                        }
                    >
                        {
                            activeMission.titleJa
                        }
                    </Text>

                    <Text
                        style={
                            styles.completeVi
                        }
                    >
                        {
                            activeMission.titleVi
                        }
                    </Text>

                    <View
                        style={
                            styles.rewardCard
                        }
                    >
                        <Text
                            style={
                                styles.rewardLabel
                            }
                        >
                            獲得XP
                        </Text>

                        <Text
                            style={
                                styles.rewardValue
                            }
                        >
                            +{totalXp}
                        </Text>
                    </View>

                    <Pressable
                        style={
                            styles.retryButton
                        }
                        onPress={
                            restartMission
                        }
                    >
                        <Text
                            style={
                                styles.retryText
                            }
                        >
                            🔁 もう一度
                        </Text>
                    </Pressable>

                    <Pressable
                        style={
                            styles.finishButton
                        }
                        onPress={() =>
                            router.back()
                        }
                    >
                        <Text
                            style={
                                styles.finishText
                            }
                        >
                            ミッションを終了
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    /*
     * =========================
     * MAIN
     * =========================
     */

    return (
        <SafeAreaView
            style={
                styles.container
            }
            edges={[
                'top',
                'bottom',
            ]}
        >
            <View
                style={
                    styles.game
                }
            >
                {/* HUD */}

                <View
                    style={
                        styles.hud
                    }
                >
                    <Pressable
                        style={
                            styles.closeButton
                        }
                        onPress={() =>
                            router.back()
                        }
                    >
                        <Text
                            style={
                                styles.closeText
                            }
                        >
                            ←
                        </Text>
                    </Pressable>

                    <View
                        style={
                            styles.hudCenter
                        }
                    >
                        <Text
                            style={
                                styles.locationName
                            }
                        >
                            {gameLocation?.nameJa ??
                                ''}
                        </Text>

                        <Text
                            style={
                                styles.missionName
                            }
                        >
                            {
                                activeMission.titleJa
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.xpBadge
                        }
                    >
                        <Text
                            style={
                                styles.xpText
                            }
                        >
                            XP {earnedXp}
                        </Text>
                    </View>
                </View>

                {/* SCENE */}

                <View
                    style={
                        styles.scene
                    }
                >
                    {backgroundSource ? (
                        <ImageBackground
                            source={
                                backgroundSource
                            }
                            style={
                                styles.background
                            }
                            resizeMode="cover"
                        >
                            <View
                                style={
                                    styles.backgroundOverlay
                                }
                            />

                            {staffSprite && (
                                <View
                                    style={
                                        styles.satoContainer
                                    }
                                >
                                    <Image
                                        source={
                                            staffSprite
                                        }
                                        style={
                                            styles.satoImage
                                        }
                                        resizeMode="contain"
                                    />
                                </View>
                            )}
                        </ImageBackground>
                    ) : (
                        <View
                            style={
                                styles.backgroundFallback
                            }
                        >
                            {staffSprite && (
                                <View
                                    style={
                                        styles.satoContainer
                                    }
                                >
                                    <Image
                                        source={
                                            staffSprite
                                        }
                                        style={
                                            styles.satoImage
                                        }
                                        resizeMode="contain"
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* DIALOGUE PANEL */}

                <View
                    style={
                        styles.dialoguePanel
                    }
                >
                    <View
                        style={
                            styles.speakerRow
                        }
                    >
                        <Text
                            style={
                                styles.speakerName
                            }
                        >
                            {isPlayerTurn
                                ? 'あなた'
                                : speaker?.nameJa ??
                                ''}
                        </Text>

                        <Text
                            style={
                                styles.speakerSub
                            }
                        >
                            {isPlayerTurn
                                ? 'PLAYER'
                                : speaker?.roleJa ??
                                ''}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.dialogueFixedBox
                        }
                    >
                        {isNpcTurn && (
                            <>
                                <Text
                                    style={
                                        styles.dialogueJa
                                    }
                                >
                                    {
                                        activeNode.textJa
                                    }
                                </Text>

                                {activeNode.reading && (
                                    <Text
                                        style={
                                            styles.reading
                                        }
                                    >
                                        {
                                            activeNode.reading
                                        }
                                    </Text>
                                )}

                                {activeNode.textVi && (
                                    <Text
                                        style={
                                            styles.dialogueVi
                                        }
                                    >
                                        {
                                            activeNode.textVi
                                        }
                                    </Text>
                                )}

                                <Pressable
                                    style={
                                        styles.nextButton
                                    }
                                    onPress={
                                        moveNext
                                    }
                                >
                                    <Text
                                        style={
                                            styles.nextText
                                        }
                                    >
                                        {activeNode.isEnd
                                            ? 'ミッション完了'
                                            : '次へ ▶'}
                                    </Text>
                                </Pressable>
                            </>
                        )}

                        {isPlayerTurn && (
                            <>
                                <Text
                                    style={
                                        styles.playerPromptJa
                                    }
                                >
                                    {activeNode.playerPromptJa ??
                                        'マイクを押して話してください。'}
                                </Text>

                                {activeNode.playerPromptVi && (
                                    <Text
                                        style={
                                            styles.playerPromptVi
                                        }
                                    >
                                        {
                                            activeNode.playerPromptVi
                                        }
                                    </Text>
                                )}

                                <View
                                    style={
                                        styles.transcriptArea
                                    }
                                >
                                    {transcript ? (
                                        <Text
                                            style={
                                                styles.transcriptText
                                            }
                                        >
                                            {
                                                transcript
                                            }
                                        </Text>
                                    ) : (
                                        <Text
                                            style={
                                                styles.transcriptPlaceholder
                                            }
                                        >
                                            {recognizing
                                                ? '聞いています…'
                                                : 'あなたの答えがここに表示されます。'}
                                        </Text>
                                    )}
                                </View>

                                {speechError && (
                                    <Text
                                        style={
                                            styles.speechError
                                        }
                                    >
                                        {
                                            speechError
                                        }
                                    </Text>
                                )}

                                {finalTranscript &&
                                    !recognizing && (
                                        <Pressable
                                            style={
                                                styles.confirmButton
                                            }
                                            onPress={
                                                confirmPlayerSpeech
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.confirmText
                                                }
                                            >
                                                決定 ✓
                                            </Text>
                                        </Pressable>
                                    )}
                            </>
                        )}
                    </View>
                </View>

                {/* RECORD BUTTON */}

                <GameRecordButton
                    active={
                        isPlayerTurn
                    }
                    recognizing={
                        recognizing
                    }
                    onPress={
                        handleMicPress
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                '#ffffff',
        },

        game: {
            flex: 1,
            position: 'relative',
        },

        center: {
            flex: 1,
            alignItems: 'center',
            justifyContent:
                'center',
            padding: 24,
        },

        errorText: {
            fontSize: 18,
            fontWeight: '700',
        },

        simpleButton: {
            marginTop: 20,
        },

        /*
         * HUD
         */

        hud: {
            height: 66,

            flexDirection: 'row',
            alignItems: 'center',

            paddingHorizontal: 14,

            backgroundColor:
                'rgba(255,255,255,0.96)',

            zIndex: 10,
        },

        closeButton: {
            width: 44,
            height: 44,

            alignItems: 'center',
            justifyContent:
                'center',

            borderRadius: 22,

            backgroundColor:
                'rgba(0,0,0,0.08)',
        },

        closeText: {
            fontSize: 26,
            fontWeight: '700',
        },

        hudCenter: {
            flex: 1,
            alignItems: 'center',
        },

        locationName: {
            fontSize: 15,
            fontWeight: '800',
        },

        missionName: {
            fontSize: 16,
            marginTop: 2,
        },

        xpBadge: {
            minWidth: 58,

            backgroundColor:
                '#222222',

            paddingVertical: 7,
            paddingHorizontal: 9,

            borderRadius: 17,

            alignItems: 'center',
        },

        xpText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '800',
        },

        /*
         * SCENE
         */

        scene: {
            flex: 1,

            overflow: 'hidden',

            backgroundColor:
                '#ddd1bc',
        },

        background: {
            flex: 1,

            position: 'relative',

            overflow: 'hidden',
        },

        backgroundFallback: {
            flex: 1,

            backgroundColor:
                '#ddd1bc',

            position: 'relative',

            overflow: 'hidden',
        },

        backgroundOverlay: {
            position: 'absolute',

            top: 0,
            right: 0,
            bottom: 0,
            left: 0,

            backgroundColor:
                'rgba(0,0,0,0.04)',
        },

        /*
         * SATO HALF BODY
         */

        satoContainer: {
            position: 'absolute',

            left: '50%',
            bottom: -105,

            width: 430,
            height: 555,

            marginLeft: -215,

            alignItems: 'center',
            justifyContent:
                'flex-end',
        },

        satoImage: {
            width: '100%',
            height: '100%',
        },

        /*
         * FIXED DIALOGUE
         */

        dialoguePanel: {
            height: 310,

            backgroundColor:
                '#ffffff',

            paddingHorizontal: 18,
            paddingTop: 14,
            paddingBottom: 62,

            borderTopWidth: 1,
            borderTopColor:
                '#dddddd',
        },

        speakerRow: {
            flexDirection: 'row',
            alignItems: 'center',

            marginBottom: 8,
        },

        speakerName: {
            fontSize: 18,
            fontWeight: '900',
        },

        speakerSub: {
            fontSize: 16,

            color: '#777777',

            marginLeft: 10,
        },

        dialogueFixedBox: {
            height: 205,

            backgroundColor:
                '#fffaf4',

            borderRadius: 22,

            borderWidth: 2,
            borderColor:
                '#d8cec3',

            paddingHorizontal: 20,
            paddingVertical: 16,

            position: 'relative',
        },

        dialogueJa: {
            fontSize: 21,
            lineHeight: 31,
            fontWeight: '800',
        },

        reading: {
            fontSize: 16,
            color: '#555555',
            marginTop: 5,
        },

        dialogueVi: {
            fontSize: 15,
            lineHeight: 21,

            marginTop: 12,

            color: '#444444',
        },

        nextButton: {
            position: 'absolute',

            right: 14,
            bottom: 10,

            paddingVertical: 8,
            paddingHorizontal: 10,
        },

        nextText: {
            fontSize: 16,
            fontWeight: '800',
        },

        /*
         * PLAYER
         */

        playerPromptJa: {
            fontSize: 16,
            fontWeight: '800',
        },

        playerPromptVi: {
            fontSize: 16,
            color: '#555555',
            marginTop: 4,
        },

        transcriptArea: {
            flex: 1,

            justifyContent:
                'center',

            marginTop: 8,
        },

        transcriptText: {
            fontSize: 22,
            lineHeight: 31,

            fontWeight: '800',

            color: '#111111',
        },

        transcriptPlaceholder: {
            fontSize: 15,

            color: '#999999',

            textAlign: 'center',
        },

        speechError: {
            fontSize: 16,
            color: '#d32f2f',
        },

        confirmButton: {
            position: 'absolute',

            right: 14,
            bottom: 10,

            backgroundColor:
                '#222222',

            paddingVertical: 9,
            paddingHorizontal: 17,

            borderRadius: 16,
        },

        confirmText: {
            color: '#ffffff',

            fontSize: 16,
            fontWeight: '800',
        },

        /*
         * COMPLETE
         */

        completeContainer: {
            flex: 1,

            alignItems: 'center',
            justifyContent:
                'center',

            paddingHorizontal: 24,

            backgroundColor:
                '#ffffff',
        },

        completeEmoji: {
            fontSize: 70,
        },

        completeTitle: {
            fontSize: 30,
            fontWeight: '900',

            marginTop: 16,
        },

        completeMission: {
            fontSize: 20,
            fontWeight: '700',

            marginTop: 16,
        },

        completeVi: {
            fontSize: 16,

            marginTop: 5,
        },

        rewardCard: {
            width: '100%',

            backgroundColor:
                '#f3f3f3',

            borderRadius: 18,

            padding: 22,

            alignItems: 'center',

            marginTop: 28,
        },

        rewardLabel: {
            fontSize: 16,
            fontWeight: '700',
        },

        rewardValue: {
            fontSize: 36,
            fontWeight: '900',

            marginTop: 8,
        },

        retryButton: {
            width: '100%',

            backgroundColor:
                '#eeeeee',

            padding: 17,

            borderRadius: 14,

            alignItems: 'center',

            marginTop: 28,
        },

        retryText: {
            fontSize: 16,
            fontWeight: '700',
        },

        finishButton: {
            width: '100%',

            backgroundColor:
                '#222222',

            padding: 17,

            borderRadius: 14,

            alignItems: 'center',

            marginTop: 12,
        },

        finishText: {
            color: '#ffffff',

            fontSize: 16,
            fontWeight: '700',
        },
    });
