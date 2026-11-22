import "reflect-metadata";
import Environment from "./AppContainer/Config/Environment";

Environment.load();

import Configuration from "./Config/Configuration";
import {Envuso} from "./Envuso";
import {Log} from "./Common/Logger/Log";

const envuso = new Envuso();

Configuration.initiate()
	.then(() => envuso.boot())
	.then(() => envuso.serve())
	.catch(error => Log.exception(error));
