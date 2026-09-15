import { TextInput as NativeTextInput, type TextInputProps } from 'react-native';
import { useAppLanguage } from '@/context/LanguageContext';
import { localizeRuntimeText } from '@/i18n/localization-runtime';

export function TextInput({ placeholder, ...props }: TextInputProps) {
    const { language } = useAppLanguage();
    return (
        <NativeTextInput
            {...props}
            placeholder={placeholder ? localizeRuntimeText(placeholder, language) : placeholder}
        />
    );
}

export type { TextInputProps };
