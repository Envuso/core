export declare class Log {
    static isLoggingDisabled(): boolean;
    static log(message: any, ...args: any[]): void;
    static success(message: any, ...args: any[]): void;
    static warn(message: any, ...args: any[]): void;
    static error(message: any, ...args: any[]): void;
    static exception(message: any, error: Error): void;
    static info(message: any, ...args: any[]): void;
}
