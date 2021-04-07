const path          = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	cache     : false,
	entry     : {
		main : './src/index.ts',
		cli  : './src/cli.ts',
	},
	devtool   : 'inline-source-map',
	target    : 'node',
	module    : {
		rules : [
			{
				test : /\.tsx?$/,
				use  : [
					{loader : 'babel-loader', options : {babelrc : true}},
					{loader : 'ts-loader'},
				],
//				loader  : 'babel-loader',
				exclude : /node_modules/,
			},
		],
	},
	resolve   : {
		modules    : [
			path.resolve(__dirname, 'src', 'App', 'Http', 'Controller'),
		],
		alias      : {
			'@Core'           : path.resolve(__dirname, 'src', 'Core'),
			'@Providers'      : path.resolve(__dirname, 'src', 'Core', 'Providers'),
			'@Decorators'     : path.resolve(__dirname, 'src', 'Core', 'Decorators', 'index.ts'),
			'@App'            : path.resolve(__dirname, 'src', 'App'),
			'@AppControllers' : path.resolve(__dirname, 'src', 'App', 'Http', 'Controller'),
			'@AppMiddlewares' : path.resolve(__dirname, 'src', 'App', 'Http', 'Middleware'),
			'@Config'         : path.resolve(__dirname, 'src', 'Config', 'index.ts'),
		},
		extensions : ['.tsx', '.ts', '.js'],
	},
	externals : [nodeExternals()],
	output    : {
		filename : '[id].js',
		path     : path.resolve(__dirname, 'dist'),
	},
	plugins   : [],
};
