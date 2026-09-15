import { Children, type ReactNode } from 'react';
import {
    Text as NativeText,
    type TextProps,
} from 'react-native';

import { useAppLanguage } from '@/context/LanguageContext';
import { localizeRuntimeText } from '@/i18n/localization-runtime';

function localizeNode(node: ReactNode, language: Parameters<typeof localizeRuntimeText>[1]): ReactNode {
    return typeof node === 'string'
        ? localizeRuntimeText(node, language)
        : node;
}

export function Text({ children, ...props }: TextProps) {
    const { language } = useAppLanguage();
    return (
        <NativeText {...props}>
            {Children.map(children, (child) => localizeNode(child, language))}
        </NativeText>
    );
}

export type { TextProps };
