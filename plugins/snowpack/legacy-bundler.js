// Webpack version of https://github.com/davidbwaters/legacy-bundle-snowpack-plugin
// effectively a more selective version of @snowpack/plugin-webpack for just JS files
// TODO: refactor into a PR and/or fork once working?

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const WebpackManifestPlugin = require('webpack-manifest-plugin').WebpackManifestPlugin;
const cwd = process.cwd();

function getPresetEnvTargets({ browserslist }) {
	if (Array.isArray(browserslist) || typeof browserslist === 'string') {
		return browserslist;
	} else if (typeof browserslist === 'object' && 'production' in browserslist) {
		return browserslist.production;
	} else {
		return '>0.75%, not ie 11, not UCAndroid >0, not OperaMini all';
	}
}

module.exports = function (snowpackConfig, args = {}) {
	const jsEntries = {};
	if (Array.isArray(args.entrypoints)) {
		args.entrypoints.forEach((entrypoint) => {
			// path should be relative to `build` directory
			const parsedPath = path.parse(entrypoint);
			const name = parsedPath.name;
			if(!(name in jsEntries)) {
				jsEntries[name] = entrypoint;
			}
		});
	}

	if (Object.keys(jsEntries).length === 0) {
		throw new Error('Missing or empty plugin args.entrypoints array');
	}

	args.outputPattern = args.outputPattern || {};
	const jsOutputPattern = args.outputPattern.js || 'js/[name].[contenthash].js';
	if (!jsOutputPattern.endsWith('.js')) {
		throw new Error('Output Pattern for JS must end in .js');
	}

	// no HTML minifier support as these only apply to specific JS files

	const manifest =
		typeof args.manifest === 'string'
			? args.manifest
			: !!args.manifest
				? './asset-manifest.json'
				: undefined;

	return {
		name: 'legacy-bundle',
		async optimize({ buildDirectory }) {
			const buildOptions = snowpackConfig.buildOptions || {};
			let baseUrl = buildOptions.baseUrl || '/';
			const tempBuildManifest = JSON.parse(
				await fs.readFileSync(path.join(cwd, 'package.json'), {
					encoding: 'utf-8',
				}),
			);
			const presetEnvTargets = getPresetEnvTargets(tempBuildManifest);

			let extendConfig = (cfg) => cfg;
			if (typeof args.extendConfig === 'function') {
				extendConfig = args.extendConfig;
			} else if (typeof args.extendConfig === 'object') {
				extendConfig = (cfg) => ({ ...cfg, ...args.extendConfig });
			}

			//Compile files using webpack
			let webpackConfig = {
				context: buildDirectory,
				resolve: {
					alias: {
						'/__snowpack__': path.join(buildDirectory, '__snowpack__'),
						'/web_modules': path.join(buildDirectory, 'web_modules'),
					},
				},
				module: {
					rules: [
						{
							test: /\.js$/,
							exclude: /node_modules/,
							use: [
								{
									loader: require.resolve('babel-loader'),
									options: {
										cwd: buildDirectory,
										configFile: false,
										babelrc: false,
										compact: true,
										presets: [
											[
												require.resolve('@babel/preset-env'),
												{
													targets: presetEnvTargets,
													bugfixes: true,
													modules: false,
													useBuiltIns: 'usage',
													corejs: 3,
												},
											],
										],
									},
								},
								{
									loader: require.resolve('@snowpack/plugin-webpack/plugins/import-meta-fix.js'),
								},
								{
									loader: require.resolve('@snowpack/plugin-webpack/plugins/proxy-import-resolve.js'),
								},
							],
						},
						// TODO: inline instead?
						// {
						// 	test: /.*/,
						// 	exclude: [/\.js?$/, /\.json?$/, /\.css$/],
						// 	use: [
						// 		{
						// 			loader: require.resolve('file-loader'),
						// 			options: {
						// 				name: assetsOutputPattern,
						// 			},
						// 		},
						// 	],
						// },
					],
				},
				mode: 'production',
				devtool: args.sourceMap ? 'source-map' : undefined,
				// optimization: {
				// 	// extract webpack runtime to its own chunk: https://webpack.js.org/concepts/manifest/#runtime
				// 	runtimeChunk: {
				// 		name: `webpack-runtime`,
				// 	},
				// 	splitChunks: getSplitChunksConfig({ numEntries: Object.keys(jsEntries).length }),
				// 	minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
				// },
			};

			const plugins = [];
			if (manifest) {
				plugins.push(new WebpackManifestPlugin({ fileName: manifest }));
			}

			const entry = {};
			for (name in jsEntries) {
				entry[name] = path.join(buildDirectory, jsEntries[name]);
			}
			const extendedConfig = extendConfig({
				...webpackConfig,
				plugins,
				entry,
				output: {
					path: buildDirectory,
					publicPath: baseUrl,
					filename: jsOutputPattern,
				},
			});
			const compiler = webpack(extendedConfig);

			const stats = await new Promise((resolve, reject) => {
				compiler.run((err, stats) => {
					if (err) {
						reject(err);
						return;
					}
					const info = stats.toJson(extendedConfig.stats);
					if (stats.hasErrors()) {
						console.error('Webpack errors:\n' + info.errors.join('\n-----\n'));
						reject(Error(`Webpack failed with ${info.errors} error(s).`));
						return;
					}
					if (stats.hasWarnings()) {
						console.error('Webpack warnings:\n' + info.warnings.join('\n-----\n'));
						if (args.failOnWarnings) {
							reject(Error(`Webpack failed with ${info.warnings} warnings(s).`));
							return;
						}
					}
					resolve(stats);
				});
			});

			if (extendedConfig.stats !== 'none') {
				console.log(
					stats.toString(
						extendedConfig.stats
							? extendedConfig.stats
							: {
								colors: true,
								all: false,
								assets: true,
							},
					),
				);
			}

			// TODO: multiple file support
			// const fullPath = path.join(buildDirectory, options.filePath);
			// console.log(`[legacy-bundler/log] checking file at [${fullPath}]`);
			// // console.log(`[legacy-bundler/log] babel config\n${JSON.stringify(options.babelOptions, null, 2)}`);
			// if (fs.existsSync(fullPath)) {
			// 	// await babel.transformFileAsync(fullPath, options.babelOptions);
			// 	const bundle = await rollup.rollup({
			// 		input: fullPath,
			// 		plugins: [
			// 			nodeResolve(),
			// 			commonjs(),
			// 			rollupBabel({ babelHelpers: 'bundled' }),
			// 			uglify({
			// 				mangle: false,
			// 			}), // assumes using <= ES5
			// 		],
			// 	});
			// 	await bundle.write({
			// 		format: 'iife',
			// 		file: fullPath,
			// 	});
			// } else {
			// 	console.warn(`[legacy-bundler/WARN] cannot find file at [${fullPath}]`);
			// }
		}
	}
}
