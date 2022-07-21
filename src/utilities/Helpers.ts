import dayjs from "dayjs";
import dateFormatter from "dayjs";

export default function subtractYears(numOfYears: any, date: Date = new Date()) {
    return dayjs(date).subtract(numOfYears, "year").toDate();
}

export function bstDateFormatter(date: Date): string {
    return dateFormatter(date).tz("Europe/London").format("DD/MM/YYYY");
}

export function bstDateFormatterWithTime(date: Date): string {
    // I am aware this is horrific but it keeps the tests passing for now.
    const valid_date = dateFormatter(date).tz("Europe/London").format("DD/MM/YYYY HH:mm:ss");
    if (valid_date == "Invalid Date") {
        return valid_date;
    }
    return ` (${valid_date})`;
}

export function bstStringDateFormatterWithTime(date: string): string {
    return dateFormatter(date).tz("Europe/London").format("DD/MM/YYYY HH:mm:ss");
}

export function mirStandardFormatForNewDate(): string {
    return dateFormatter(new Date()).format("DD-MM-YYYY");
}
