import path from "path";
import {config} from 'dotenv';

config({path : path.join(__dirname, '..', '..', 'Components', '.env')});
import {Log} from "@envuso/common";
import {Envuso} from "./Envuso";

const envuso = new Envuso();

envuso.prepare().catch(error => {
	Log.error(error)
	console.trace(error);
});
