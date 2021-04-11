export declare class Encryption {
    static encrypt(content: any): string;
    static decrypt(content: any): import("simple-crypto-js").PlainData;
    static random(length?: number): string;
}
