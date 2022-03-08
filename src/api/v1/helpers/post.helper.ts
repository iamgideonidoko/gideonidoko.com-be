import { CountOptions } from '../interfaces/post.interface';

export const strToSlug = (str: string) => {
    //replace all non word characters with space
    const replaceNonWord = str.toLowerCase().replace(/\W+/gi, ' ');

    //replace underscores with spaces
    const replaceUnderScores = replaceNonWord.replace(/_/gi, ' ');

    // replace all space with single dash
    const replaceSpace = replaceUnderScores.trim().replace(/\s+/gi, '-');

    return replaceSpace;
};

export const decode = (string: string) => {
    const output = [];
    let counter = 0;
    const length = string.length;

    while (counter < length) {
        const value = string.charCodeAt(counter++);

        if (value >= 0xd800 && value <= 0xdbff && counter < length) {
            // It's a high surrogate, and there is a next character.

            const extra = string.charCodeAt(counter++);

            if ((extra & 0xfc00) == 0xdc00) {
                // Low surrogate.
                output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
            } else {
                // It's an unmatched surrogate; only append this code unit, in case the
                // next code unit is the high surrogate of a surrogate pair.

                output.push(value);
                counter--;
            }
        } else {
            output.push(value);
        }
    }

    return output;
};

export const count = (target: string, options?: CountOptions) => {
    let original = '' + target;

    options = options || {};

    if (options.stripTags) original = original.replace(/<\/?[a-z][^>]*>/gi, '');

    if (options.ignore) {
        original = original.replace(/ /i, '');
    }

    const trimmed = original.trim();

    return {
        paragraphs: trimmed ? (trimmed.match(options.hardReturns ? /\n{2,}/g : /\n+/g) || []).length + 1 : 0,
        sentences: trimmed ? (trimmed.match(/[.?!…]+./g) || []).length + 1 : 0,
        words: trimmed ? (trimmed.replace(/['";:,.?¿\-!¡]+/g, '').match(/\S+/g) || []).length : 0,
        characters: trimmed ? decode(trimmed.replace(/\s/g, '')).length : 0,
        all: decode(original).length,
    };
};

export const getReadTime = (string: string) => {
    const WPM = 200;

    const estimatedReadTime = count(string).words / WPM;

    const remainder = estimatedReadTime % 1;

    // const minutes = estimatedReadTime - remainder;

    const roundedMinutes = Math.round(estimatedReadTime);

    const seconds = Math.round(remainder * 60);

    return roundedMinutes < 1
        ? seconds <= 1
            ? seconds + ' sec read'
            : seconds + ' secs read'
        : roundedMinutes <= 1
        ? roundedMinutes + ' min read'
        : roundedMinutes + ' mins read';
};
