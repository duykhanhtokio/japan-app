import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    active: boolean;

    recognizing: boolean;

    onPress: () => void;
};

export default function GameRecordButton({
    active,
    recognizing,
    onPress,
}: Props) {
    return (
        <View
            pointerEvents="box-none"
            style={
                styles.container
            }
        >
            <Pressable
                disabled={!active}
                onPress={onPress}
                style={({ pressed }) => [
                    styles.button,

                    !active &&
                    styles.buttonDisabled,

                    recognizing &&
                    styles.buttonRecording,

                    pressed &&
                    active &&
                    styles.buttonPressed,
                ]}
            >
                <Text style={styles.icon}>
                    {recognizing
                        ? '■'
                        : '🎤'}
                </Text>
            </Pressable>

            {active && (
                <Text style={styles.label}>
                    {recognizing
                        ? '録音中...'
                        : '押して話す'}
                </Text>
            )}
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            position: 'absolute',

            left: 0,
            right: 0,
            bottom: 8,

            alignItems: 'center',

            zIndex: 100,
        },

        button: {
            width: 66,
            height: 66,

            borderRadius: 33,

            backgroundColor:
                '#e53935',

            borderWidth: 5,
            borderColor:
                '#ffffff',

            alignItems: 'center',
            justifyContent:
                'center',

            shadowColor:
                '#000000',

            shadowOpacity: 0.25,
            shadowRadius: 8,

            shadowOffset: {
                width: 0,
                height: 4,
            },

            elevation: 8,
        },

        buttonRecording: {
            transform: [
                {
                    scale: 1.08,
                },
            ],
        },

        buttonDisabled: {
            opacity: 0.25,
        },

        buttonPressed: {
            opacity: 0.75,
        },

        icon: {
            fontSize: 28,
            color: '#ffffff',
        },

        label: {
            fontSize: 16,
            fontWeight: '700',

            marginTop: 3,

            color: '#333333',
        },
    });