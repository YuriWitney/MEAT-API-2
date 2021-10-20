module.exports = {
	"rootDir": "../",
	"globals": {
		"address": "http://localhost:3001"
	},
	"testEnvironment": "node",
	"transform": {
		"^.+\\.tsx?$": "ts-jest"
	},
	"testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	"moduleFileExtensions": [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node"
	]
};