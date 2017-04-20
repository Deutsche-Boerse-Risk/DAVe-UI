export function parseServerDate(utcTimestamp: number): Date {
    let date = new Date(0);
    date.setUTCMilliseconds(utcTimestamp);
    return date;
}