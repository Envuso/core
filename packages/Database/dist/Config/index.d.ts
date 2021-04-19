import { DatabaseServiceProvider } from "../src/DatabaseServiceProvider";
export declare const Config: {
    app: {
        providers: (typeof DatabaseServiceProvider)[];
    };
    database: {
        mongo: import("./Database").MongoConnectionConfiguration;
    };
};
