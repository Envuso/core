export declare class Hash {
    static make(content: string, rounds?: number): Promise<string>;
    static check(content: string, hashedContent: string): boolean;
}
