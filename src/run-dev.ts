import "reflect-metadata";
import path from "path";
import Environment from "./AppContainer/Config/Environment";

Environment.load(path.join(__dirname, "..", ".env"));

import Configuration from "./Config/Configuration";
import {Envuso} from "./Envuso";
import {Log} from "./Common";

const envuso = new Envuso();

Configuration.initiate()
	.then(() => envuso.boot())
	.then(() => envuso.serve())
	.catch(error => Log.exception(error));
