import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type SpeechModule = {
    addListener?: (
        eventName: string,
        listener: (
            event?: any
        ) => void
    ) => {
        remove?: () => void;
    };

    requestPermissionsAsync?: () =>
        Promise<{
            granted?: boolean;
        }>;

    start?: (
        options: {
            lang: string;
            interimResults: boolean;
            continuous: boolean;
            maxAlternatives: number;
        }
    ) => void;

    stop?: () => void;

    abort?: () => void;
};

/*
 * =========================================================
 * SAFE NATIVE MODULE LOADER
 * =========================================================
 *
 * Không import trực tiếp ở đầu file.
 *
 * Nếu binary hiện tại chưa chứa
 * ExpoSpeechRecognition:
 *
 * - app vẫn mở được
 * - không crash
 * - UI biết speechAvailable = false
 */

let speechModule:
    SpeechModule | null =
    null;

try {
    const speechPackage =
        // Dynamic loading keeps Expo Go/web alive when the native module is absent.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require(
            'expo-speech-recognition'
        );

    speechModule =
        speechPackage
            ?.ExpoSpeechRecognitionModule ??
        null;
} catch (error) {
    console.log(
        '[Speech] Native module unavailable:',
        error
    );

    speechModule =
        null;
}

/*
 * =========================================================
 * HOOK
 * =========================================================
 */

export function useGameSpeech() {
    const [
        recognizing,
        setRecognizing,
    ] =
        useState(false);

    const [
        transcript,
        setTranscript,
    ] =
        useState('');

    const [
        finalTranscript,
        setFinalTranscript,
    ] =
        useState('');

    const [
        speechError,
        setSpeechError,
    ] =
        useState<
            string | null
        >(null);

    /*
     * Session hiện tại có đang hoạt động không.
     *
     * Ref được dùng thay state để tránh
     * event native cũ ghi transcript sang lượt mới.
     */

    const sessionActiveRef =
        useRef(false);

    /*
     * Tăng sau mỗi lần bắt đầu recognition.
     *
     * Sau này nếu native gửi event cũ,
     * ta có thêm lớp bảo vệ session.
     */

    const sessionIdRef =
        useRef(0);

    /*
     * =====================================================
     * AVAILABILITY
     * =====================================================
     */

    const speechAvailable =
        Boolean(
            speechModule &&
            typeof speechModule.start ===
            'function'
        );

    /*
     * =====================================================
     * NATIVE EVENTS
     * =====================================================
     */

    useEffect(() => {
        if (
            !speechModule ||
            typeof speechModule.addListener !==
            'function'
        ) {
            return;
        }

        const startSubscription =
            speechModule.addListener(
                'start',
                () => {
                    sessionActiveRef.current =
                        true;

                    setRecognizing(
                        true
                    );

                    setSpeechError(
                        null
                    );
                }
            );

        const endSubscription =
            speechModule.addListener(
                'end',
                () => {
                    sessionActiveRef.current =
                        false;

                    setRecognizing(
                        false
                    );
                }
            );

        const resultSubscription =
            speechModule.addListener(
                'result',
                (
                    event:
                        any
                ) => {
                    /*
                     * Quan trọng:
                     *
                     * Nếu recognition không thuộc
                     * session đang hoạt động thì bỏ.
                     *
                     * Đây là lớp ngăn transcript cũ
                     * kiểu:
                     *
                     * コーヒーをお願いします。
                     */

                    if (
                        !sessionActiveRef.current
                    ) {
                        return;
                    }

                    const text =
                        event
                            ?.results?.[0]
                            ?.transcript;

                    if (
                        typeof text !==
                        'string'
                    ) {
                        return;
                    }

                    const cleanText =
                        text.trim();

                    if (
                        !cleanText
                    ) {
                        return;
                    }

                    setTranscript(
                        cleanText
                    );

                    if (
                        event?.isFinal
                    ) {
                        setFinalTranscript(
                            cleanText
                        );
                    }
                }
            );

        const errorSubscription =
            speechModule.addListener(
                'error',
                (
                    event:
                        any
                ) => {
                    sessionActiveRef.current =
                        false;

                    setRecognizing(
                        false
                    );

                    const message =
                        event?.message ??
                        event?.error ??
                        '音声認識エラー';

                    console.log(
                        '[Speech] recognition error:',
                        event
                    );

                    setSpeechError(
                        String(
                            message
                        )
                    );
                }
            );

        return () => {
            startSubscription
                ?.remove?.();

            endSubscription
                ?.remove?.();

            resultSubscription
                ?.remove?.();

            errorSubscription
                ?.remove?.();
        };
    }, []);

    /*
     * =====================================================
     * CLEAR CURRENT TEXT
     * =====================================================
     */

    const clearTranscript =
        useCallback(() => {
            setTranscript(
                ''
            );

            setFinalTranscript(
                ''
            );
        }, []);

    /*
     * =====================================================
     * START LISTENING
     *
     * return:
     *
     * true  → recognition start request thành công
     * false → không thể bắt đầu
     * =====================================================
     */

    const startListening =
        useCallback(
            async (): Promise<boolean> => {
                /*
                 * Binary chưa có native module.
                 *
                 * Không crash.
                 * Không giả vờ rằng mic đang hoạt động.
                 */

                if (
                    !speechModule ||
                    typeof speechModule.start !==
                    'function'
                ) {
                    sessionActiveRef.current =
                        false;

                    setRecognizing(
                        false
                    );

                    setSpeechError(
                        '現在のアプリでは音声認識を利用できません。'
                    );

                    return false;
                }

                try {
                    /*
                     * Hủy session trước nếu còn.
                     */

                    sessionIdRef.current +=
                        1;

                    sessionActiveRef.current =
                        false;

                    setRecognizing(
                        false
                    );

                    setTranscript(
                        ''
                    );

                    setFinalTranscript(
                        ''
                    );

                    setSpeechError(
                        null
                    );

                    /*
                     * Permission.
                     */

                    if (
                        typeof speechModule
                            .requestPermissionsAsync ===
                        'function'
                    ) {
                        const permission =
                            await speechModule
                                .requestPermissionsAsync();

                        if (
                            !permission
                                ?.granted
                        ) {
                            setSpeechError(
                                'マイクと音声認識の許可が必要です。'
                            );

                            return false;
                        }
                    }

                    /*
                     * Native start event sẽ chuyển
                     * recognizing => true.
                     */

                    speechModule.start(
                        {
                            lang:
                                'ja-JP',

                            interimResults:
                                true,

                            continuous:
                                false,

                            maxAlternatives:
                                1,
                        }
                    );

                    return true;
                } catch (error) {
                    sessionActiveRef.current =
                        false;

                    setRecognizing(
                        false
                    );

                    console.log(
                        '[Speech] start error:',
                        error
                    );

                    setSpeechError(
                        '音声認識を開始できません。'
                    );

                    return false;
                }
            },
            []
        );

    /*
     * =====================================================
     * STOP
     * =====================================================
     */

    const stopListening =
        useCallback(() => {
            if (
                !speechModule
            ) {
                sessionActiveRef.current =
                    false;

                setRecognizing(
                    false
                );

                return;
            }

            try {
                speechModule
                    .stop?.();
            } catch (error) {
                console.log(
                    '[Speech] stop error:',
                    error
                );

                sessionActiveRef.current =
                    false;

                setRecognizing(
                    false
                );
            }
        }, []);

    /*
     * =====================================================
     * ABORT
     *
     * Khác stop:
     *
     * abort bỏ toàn bộ session hiện tại.
     * Dùng khi đổi dialogue node.
     * =====================================================
     */

    const abortListening =
        useCallback(() => {
            sessionIdRef.current +=
                1;

            sessionActiveRef.current =
                false;

            try {
                speechModule
                    ?.abort?.();
            } catch (error) {
                console.log(
                    '[Speech] abort error:',
                    error
                );
            }

            setRecognizing(
                false
            );

            setTranscript(
                ''
            );

            setFinalTranscript(
                ''
            );
        }, []);

    /*
     * =====================================================
     * RESET
     * =====================================================
     */

    const resetSpeech =
        useCallback(() => {
            sessionIdRef.current +=
                1;

            sessionActiveRef.current =
                false;

            /*
             * Không abort native ở đây.
             *
             * resetSpeech được gọi khá thường xuyên
             * trong UI.
             */

            setRecognizing(
                false
            );

            setTranscript(
                ''
            );

            setFinalTranscript(
                ''
            );

            setSpeechError(
                null
            );
        }, []);

    /*
     * =====================================================
     * RETURN
     * =====================================================
     */

    return {
        recognizing,

        transcript,

        finalTranscript,

        speechError,

        speechAvailable,

        startListening,

        stopListening,

        abortListening,

        resetSpeech,

        clearTranscript,
    };
}
