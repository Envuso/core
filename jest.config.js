module.exports = {
	preset               : 'ts-jest',
	testEnvironment      : 'node',
	transform            : {
		'^.+\\.ts?$' : 'ts-jest'
	},
	testRegex            : '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
	moduleFileExtensions : ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	moduleDirectories    : [
		'node_modules',
		'<rootDir>/node_modules',
		'<rootDir>/socket-client',
		'src',
	],
	setupFilesAfterEnv: ["jest-extended"]
};
