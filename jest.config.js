
module.exports = async () => {
	return {
		transform: {
			"^.+\\.js$": "babel-jest",
			"^.+\\.svelte$": [
				"svelte-jester",
				{
					preprocess: true
				}
			],
			"^.+\\.ts$": "ts-jest"
		},
		moduleFileExtensions: ["js", "ts", "svelte"],
		moduleNameMapper: {
			"@src/(.*)": "<rootDir>/src/$1"
		},
		testEnvironment: "jsdom"
	};
};