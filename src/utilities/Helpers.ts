import dayjs from "dayjs";
import dateFormatter from "dayjs";

export default function subtractYears(numOfYears: any, date: Date = new Date()) {
    return dayjs(date).subtract(numOfYears, "year").toDate();
}

export function bstDateFormatter(date: Date): string {
    return dateFormatter(date).tz("Europe/London").format("DD/MM/YYYY");
}

export function bstStringDateFormatterWithTime(date: string): string {
    return dateFormatter(date).tz("Europe/London").format("DD/MM/YYYY HH:mm:ss");
}
