import dayjs from "dayjs";

export default function subtractYears(numOfYears: any, date: Date = new Date()) {
    return dayjs(date).subtract(numOfYears, "year").toDate();
}
