import { Logger } from "winston";
export declare class LogService {
    loggerInstance: Logger;
    create(): void;
    static get(): Logger;
}
