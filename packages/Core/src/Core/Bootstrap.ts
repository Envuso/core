import {config} from "dotenv";

config();

//import "reflect-metadata";
//import "regenerator-runtime";

import fetch from "node-fetch";

declare var global: any;
global.fetch = fetch;

export const whenBootstrapped = async () => {

};
