import {
    Alert as NativeAlert,
    type AlertButton,
    type AlertOptions,
} from 'react-native';
import { localizeRuntimeText } from '@/i18n/localization-runtime';

export const Alert = {
    ...NativeAlert,
    alert(
        title: string,
        message?: string,
        buttons?: AlertButton[],
        options?: AlertOptions,
    ): void {
        NativeAlert.alert(
            localizeRuntimeText(title),
            message ? localizeRuntimeText(message) : message,
            buttons?.map((button) => ({
                ...button,
                text: button.text ? localizeRuntimeText(button.text) : button.text,
            })),
            options,
        );
    },
};
