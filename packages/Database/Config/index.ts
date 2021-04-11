import {DatabaseServiceProvider} from "../src/DatabaseServiceProvider";
import {default as Database} from './Database'

export const Config = {
	app      : {
		providers : [
			DatabaseServiceProvider
		]
	},
	database : Database
}
