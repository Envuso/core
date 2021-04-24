import "reflect-metadata";
import {App} from "../AppContainer";
import {Config} from "../Config";
import {Server} from "../Core";

const bootApp = async function () {
	const app = await App.bootInstance({config : Config});
	await app.loadServiceProviders();

	await app.container().resolve(Server).initialise();
};

beforeAll(() => {
	return bootApp();
});
