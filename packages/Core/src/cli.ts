import {whenBootstrapped} from "@Core/Bootstrap";
import {resolve} from "@Core/Helpers";
import {ModelServiceProvider} from "@Providers/Model/ModelServiceProvider";
import {App} from "@Core/App";
import {Command} from 'commander';
import {StubGenerator} from "@Providers/Cli/StubGenerator";
import console from 'chalk-console';
import camelCase from 'lodash/camelCase';

whenBootstrapped().then(async () => {

	const app = new App();
	app.registerProviders();
	await app.registerProviderBindings();
	await app.bootProviders();

	const program = new Command();
	program.description('Welcome to aids.js')

	program
		.command('make:controller <name>')
		.description('Generate a new controller')
		.option('-r, --resource', 'Generate a resource controller')
		.option('-m, --model [model]', 'When generating a resource controller, you can specify a model to use for the methods')
		.action((args, options: any) => {
			const isResource  = !!options?.resource;
			const modelOption = options?.model;

			if (modelOption && !isResource) {
				console.yellow('You need to specify that this controller will use a resource to use -m, --model.\nYou can use "make:controller -r -m Model"', false)
				return;
			}

			if (isResource && modelOption) {

				const modelName = modelOption.split('/').pop();

				const models = resolve(ModelServiceProvider).getModels();
				const model  = models.find(model => model.name === modelName);

				if (!model) {
					console.yellow('This model "' + modelOption + '" does not exist.');
					return;
				}

				new StubGenerator(
					'resource-controller-w-models',
					'Controller',
					['src', 'App', 'Http', 'Controllers'],
					args
				)
					.replace({
						modelParamName : camelCase(model.name),
						modelName      : model.name,
						modelImport    : model.import,
					})
					.save()

				return;
			}

			if (isResource) {
				new StubGenerator('resource-controller', 'Controller', ['src', 'App', 'Http', 'Controllers'], args)
					.replace({})
					.save()

				return;
			}

			new StubGenerator('controller', 'Controller', ['src', 'App', 'Http', 'Controllers'], args)
				.replace({})
				.save()

		});

	program
		.command('make:model <name>')
		.description('Generate a new model')
		.action((args) => {

			new StubGenerator('model', '', ['src', 'App', 'Models'], args)
				.replace({})
				.save()

		});

	program
		.command('make:middleware <name>')
		.description('Generate a new middleware')
		.action((args) => {

			new StubGenerator('middleware', 'Middleware', ['src', 'App', 'Http', 'Middleware'], args)
				.replace({})
				.save()



		});

	program.parse();
});
