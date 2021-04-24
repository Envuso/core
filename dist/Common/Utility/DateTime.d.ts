import dayjs from "dayjs";
export declare class DateTime {
    private _date;
    constructor(date?: string);
    static now(): dayjs.Dayjs;
    static parse(date: string): dayjs.Dayjs;
}
