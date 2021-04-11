export declare class Str {
    /**
     * Uses math.random() to get a quick and dirty random string
     * Lot's quicker but cannot guarantee it's unique in the moment.
     *
     * Quick perf test; 1000 iterations of 100 char string in 0.46-0.47ms
     *
     * @param length
     */
    static random(length?: number): string;
    /**
     * Uses node.js crypto module to give a more unique random string
     *
     * Quick perf test; 1000 iterations of 100 char string in 8.93-9.23ms
     *
     * @param length
     */
    static uniqueRandom(length?: number): any;
}
