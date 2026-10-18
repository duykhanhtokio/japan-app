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
    const parts = Children.toArray(children);
    const content = parts.every(part => typeof part === 'string' || typeof part === 'number')
        ? localizeRuntimeText(parts.join(''), language)
        : Children.map(children, (child) => localizeNode(child, language));
    return (
        <NativeText {...props}>
            {content}
        </NativeText>
    );
}

export type { TextProps };
