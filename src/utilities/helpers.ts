export default function subtractYears(numOfYears: any, date: Date = new Date()) {
    date.setFullYear(date.getFullYear() - numOfYears);
    return date;
}
