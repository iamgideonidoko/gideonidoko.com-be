export const strToSlug = (str: string) => {
    //replace all non word characters with space
    const replaceNonWord = str.toLowerCase().replace(/\W+/gi, ' ');

    //replace underscores with spaces
    const replaceUnderScores = replaceNonWord.replace(/_/gi, ' ');

    // replace all space with single dash
    const replaceSpace = replaceUnderScores.trim().replace(/\s+/gi, '-');

    return replaceSpace;
};
