const formatText = (text: string): string => {
    text = convertFirstCharacterToUppercase(text);
    text = text.replaceAll("_", " ");
    return text;
};

const convertFirstCharacterToUppercase = (stringToConvert: string) => {
    const firstCharacter = stringToConvert.substring(0, 1);
    const restString = stringToConvert.substring(1);

    return firstCharacter.toUpperCase() + restString;
};

export default formatText;
