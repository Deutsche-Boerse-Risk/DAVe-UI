export function parseServerDate(dateString: string): Date {
    let dateParts = dateString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/).slice(1)
        .map((part: string) => parseInt(part, 10));
    debugger;
    return new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3],
        dateParts[4], dateParts[5], dateParts[6]));
}