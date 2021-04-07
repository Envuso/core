export declare class Cache {
    get(key: string, defaultValue?: any): Promise<any>;
    put(key: string, value: any, ttl?: number): Promise<void>;
    remove(key: string): Promise<void>;
    has(key: string): Promise<boolean>;
}
