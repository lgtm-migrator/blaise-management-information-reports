import dayjs from "dayjs";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dateFormatter.extend(utc);
dateFormatter.extend(timezone);
dateFormatter.extend(customParseFormat);

export default function subtractYears(numOfYears: number, date: Date = new Date()): Date {
    return dayjs(date).subtract(numOfYears, "year").toDate();
}

export function bstDateFormatter(date: Date | string, includeTime = false): string {
    if (includeTime) {
        return dateFormatter(date).tz("Europe/London").format("DD/MM/YYYY HH:mm:ss");
    }
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

export function mirStandardNewDateFormatter(): string {
    return dateFormatter(new Date()).format("DD-MM-YYYY");
}
