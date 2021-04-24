import { MongoClientOptions } from "mongodb";
import { ClientOpts } from "redis";
export interface MongoConnectionConfiguration {
    name: string;
    url: string;
    clientOptions: MongoClientOptions;
}
declare const _default: {
    mongo: MongoConnectionConfiguration;
    redis: ClientOpts;
};
export default _default;
