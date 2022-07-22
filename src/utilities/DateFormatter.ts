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

export function outputDateFormat(): string {
    return "DD/MM/YYYY";
}

export function formatDate(date: Date | string): string {
    return dateFormatter(date).tz("Europe/London").format(outputDateFormat());
}

export function formatDateAndTime(date: Date | string): string {
    return dateFormatter(date).tz("Europe/London").format(`${outputDateFormat()} HH:mm:ss`);
}
