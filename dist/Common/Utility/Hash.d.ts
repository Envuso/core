export declare class Hash {
    /**
     * Make a hash of the content
     *
     * @param content
     * @param rounds
     */
    static make(content: string, rounds?: number): Promise<string>;
    /**
     * Check if the content matches the hashed content
     *
     * @param content
     * @param hashedContent
     */
    static check(content: string, hashedContent: string): boolean;
}
