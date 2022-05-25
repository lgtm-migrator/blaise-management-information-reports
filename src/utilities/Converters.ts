function convertSecondsToMinutesAndSeconds(seconds: number | ""): string {
    const secondNumber = seconds === "" ? 0 : seconds;
    const convertedMinutes = ("0" + Math.floor(secondNumber / 60)).slice(-2);
    const convertedSeconds = ("0" + (secondNumber - Math.floor(secondNumber / 60) * 60)).slice(-2);
    return convertedMinutes + ":" + convertedSeconds;
}

export {convertSecondsToMinutesAndSeconds};
