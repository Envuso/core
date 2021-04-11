import { MongoClientOptions } from "mongodb";
export interface MongoConnectionConfiguration {
    name: string;
    url: string;
    clientOptions: MongoClientOptions;
}
declare const _default: {
    mongo: MongoConnectionConfiguration;
};
export default _default;
