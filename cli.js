require("reflect-metadata");
const path        = require("path");
const Environment = require("./dist/AppContainer/Config/Environment").default;

Environment.load(path.join(__dirname, ".env"));

const {Envuso}                 = require("./dist");
const Log                      = require("./dist/Common/Logger/Log").default;
const {ConsoleServiceProvider} = require("./dist/Console/ConsoleServiceProvider");
const {
	      SessionServiceProvider,
	      AuthenticationServiceProvider,
	      AuthorizationServiceProvider,
	      RouteServiceProvider,
	      ServerServiceProvider,
      }                        = require('./dist/index.js');
const {InertiaServiceProvider} = require('./dist/Packages/Inertia/InertiaServiceProvider.js');
const cron                     = require('node-cron');

//Log.disable();

const envuso = new Envuso();

const runFrameworkLogic = async (dev = false, logic) => {

	const moduleImport = require(path.join(process.cwd(), 'dist', 'Config', 'Configuration.js'));

	moduleImport.default.initiate()
		.then(() => envuso.initiateWithoutServing([
			SessionServiceProvider,
			AuthenticationServiceProvider,
			AuthorizationServiceProvider,
			RouteServiceProvider,
			ServerServiceProvider,
			InertiaServiceProvider]))
		.then(() => logic())
		.then(() => process.exit())
		.catch(error => {
			console.error(error);
		});
};

runFrameworkLogic(true, async () => {
	const kernel = envuso._app._container.resolve('kernel');
	kernel.registerSchedules();
	for (let command of kernel.commands) {
		cron.schedule(command.schedule.getCronTab(), function () {
			console.log('Running cron: ' + command.name);
		});
	}
	debugger
});
