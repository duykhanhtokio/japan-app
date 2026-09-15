export type JlptSpeechDriver = {
    stop: () => Promise<void>;
    speak: (text: string, options: { language: string; rate: number; pitch: number; onDone?: () => void }) => void;
};

type SequenceInput = {
    prompt: string;
    script: string;
    driver: JlptSpeechDriver;
    isCurrent: () => boolean;
    schedule?: (callback: () => void, milliseconds: number) => unknown;
};

/** Testable sequence contract: stop old audio -> question -> 3000 ms -> dialogue. */
export async function playQuestionThenScript({ prompt, script, driver, isCurrent, schedule = setTimeout }: SequenceInput) {
    await driver.stop();
    if (!isCurrent()) return;
    driver.speak(prompt, {
        language: 'ja-JP', rate: 0.78, pitch: 1,
        onDone: () => {
            if (!isCurrent()) return;
            schedule(() => {
                if (!isCurrent()) return;
                driver.speak(script, { language: 'ja-JP', rate: 0.82, pitch: 1 });
            }, 3000);
        },
    });
}
