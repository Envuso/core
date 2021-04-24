import "reflect-metadata";
import path from "path";
import {config} from 'dotenv';

config({path : path.join(__dirname, '..', '..', 'Components', '.env')});

import {Config} from "../Config";
import {Envuso} from "./Envuso";
import {Log} from "../Common";

const envuso = new Envuso();

envuso.prepare(Config).catch(error => {
	Log.error(error)
	console.trace(error);
});
