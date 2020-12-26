// Webpack version of https://github.com/davidbwaters/legacy-bundle-snowpack-plugin
// effectively a more selective version of @snowpack/plugin-webpack for just JS files
// TODO: refactor into a PR and/or fork once working?

const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const WebpackManifestPlugin = require('webpack-manifest-plugin').WebpackManifestPlugin;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
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

const webModuleRelativeMapping = new Map();
function convertWebModuleResolutionToNodeModuleResolutionForChunks ({ buildDirectory }) {
	// Get all js files from the output folder
	const pattern = buildDirectory + '/**/*.js';
	const jsFiles = glob.sync(pattern);

	jsFiles.forEach((jsFile) => {
		const contents = fs.readFileSync(jsFile, 'utf8');

		let relativePathToBuildDirectory = path.relative(jsFile, buildDirectory).replace(/\\/g, '/');
		if (relativePathToBuildDirectory.endsWith('/..')) {
			relativePathToBuildDirectory = relativePathToBuildDirectory.split('').reverse().join('').replace('/..', '').split('').reverse().join('');
		} else if (relativePathToBuildDirectory === '..') {
			relativePathToBuildDirectory = relativePathToBuildDirectory.replace('..', '.');
		}
		let nodeRelativeContents = contents;
		while (nodeRelativeContents.includes('from"/chunk')) {
			nodeRelativeContents = nodeRelativeContents.replace('from"/chunk', `from"${relativePathToBuildDirectory}/chunk`);
		}

		while (nodeRelativeContents.includes('import"/chunk')) {
			nodeRelativeContents = nodeRelativeContents.replace('import"/chunk', `import"${relativePathToBuildDirectory}/chunk`);
		}

		while (nodeRelativeContents.includes('import("/')) {
			nodeRelativeContents = nodeRelativeContents.replace('import("/', `import("${relativePathToBuildDirectory}/`);
		}

		if (nodeRelativeContents !== contents) {
			console.log(`changing chunk path for ${path.parse(jsFile).base} using relative path[${relativePathToBuildDirectory}]`);
			webModuleRelativeMapping.set(jsFile, contents);
			fs.writeFileSync(jsFile, nodeRelativeContents, 'utf8');
		}
	});
}

function restoreChangedChunks() {
	Array.from(webModuleRelativeMapping.entries()).forEach(([jsFile, contents]) => {
		console.log(`restoring ${path.parse(jsFile).base}`);
		fs.writeFileSync(jsFile, contents, 'utf8');
	});
}

function parseHTMLFiles({ buildDirectory }) {
	// Get all html files from the output folder
	const pattern = buildDirectory + '/**/*.html';
	const htmlFiles = glob.sync(pattern).map((htmlPath) => path.relative(buildDirectory, htmlPath));

	const doms = {};
	const jsEntries = {};
	for (const htmlFile of htmlFiles) {
		const dom = new JSDOM(fs.readFileSync(path.join(buildDirectory, htmlFile)));

		//Find all local script, use it as the entrypoint
		const scripts = Array.from(dom.window.document.querySelectorAll('script'))
			.filter((el) => el.hasAttribute('nomodule'))
			.filter((el) => !/^[a-zA-Z]+:\/\//.test(el.src));

		for (const el of scripts) {
			const src = el.src.trim();
			const parsedPath = path.parse(src);
			const name = parsedPath.name;
			if (!(name in jsEntries)) {
				jsEntries[name] = {
					path: path.join(buildDirectory, src),
					occurrences: [],
				};
			}
			jsEntries[name].occurrences.push({ script: el, dom });
		}

		doms[htmlFile] = dom;
	}
	return { doms, jsEntries };
}

function getSplitChunksConfig({ numEntries }) {
	const isCss = (module) => module.type === `css/mini-extract`;
	/**
	 * Implements a version of granular chunking, as described at https://web.dev/granular-chunking-nextjs/.
	 */
	return {
		chunks: 'all',
		maxInitialRequests: 25,
		minSize: 20000,
		cacheGroups: {
			default: false,
			vendors: false,
			/**
			 * NPM libraries larger than 100KB are pulled into their own chunk
			 *
			 * We use a smaller cutoff than the reference implementation (which does 150KB),
			 * because our babel-loader config compresses whitespace with `compact: true`.
			 */
			lib: {
				test(module) {
					return (
						!isCss(module) && module.size() > 100000 && /web_modules[/\\]/.test(module.identifier())
					);
				},
				name(module) {
					/**
					 * Name the chunk based on the filename in /web_modules.
					 *
					 * E.g. /web_modules/moment.js -> lib-moment.HASH.js
					 */
					const ident = module.libIdent({ context: 'dir' });
					const lastItem = ident
						.split('/')
						.reduceRight((item) => item)
						.replace(/\.js$/, '');
					return `lib-${lastItem}`;
				},
				priority: 30,
				minChunks: 1,
				reuseExistingChunk: true,
			},
			// modules used by all entrypoints end up in commons
			commons: {
				test(module) {
					return !isCss(module);
				},
				name: 'commons',
				// don't create a commons chunk until there are 2+ entries
				minChunks: Math.max(2, numEntries),
				priority: 20,
			},
			// modules used by multiple chunks can be pulled into shared chunks
			shared: {
				test(module) {
					return !isCss(module);
				},
				name(module, chunks) {
					const hash = crypto
						.createHash(`sha1`)
						.update(chunks.reduce((acc, chunk) => acc + chunk.name, ``))
						.digest(`hex`);

					return hash;
				},
				priority: 10,
				minChunks: 2,
				reuseExistingChunk: true,
			},
			// Bundle all css & lazy css into one stylesheet to make sure lazy components do not break
			styles: {
				test(module) {
					return isCss(module);
				},
				name: `styles`,
				priority: 40,
				enforce: true,
			},
		},
	};
}

module.exports = function (snowpackConfig, args = {}) {
	// const jsEntries = {};
	// if (Array.isArray(args.entrypoints)) {
	// 	args.entrypoints.forEach((entrypoint) => {
	// 		// path should be relative to `build` directory
	// 		const parsedPath = path.parse(entrypoint);
	// 		const name = parsedPath.name;
	// 		if(!(name in jsEntries)) {
	// 			jsEntries[name] = entrypoint;
	// 		}
	// 	});
	// }

	// if (Object.keys(jsEntries).length === 0) {
	// 	throw new Error('Missing or empty plugin args.entrypoints array');
	// }

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
		name: 'legacy-bundler',
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

			const { doms, jsEntries } = parseHTMLFiles({ buildDirectory });
			if (Object.keys(jsEntries).length === 0) {
				throw new Error("Can't bundle without script tag in html");
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
				// 	// minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
				// },
			};

			const plugins = [];
			if (manifest) {
				plugins.push(new WebpackManifestPlugin({ fileName: manifest }));
			}

			const entry = {};
			// for (name in jsEntries) {
			// 	entry[name] = path.join(buildDirectory, jsEntries[name]);
			// }
			for (name in jsEntries) {
				entry[name] = jsEntries[name].path;
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

			convertWebModuleResolutionToNodeModuleResolutionForChunks({ buildDirectory });
			const stats = await new Promise((resolve, reject) => {
				compiler.run((err, stats) => {
					if (err) {
						reject(err);
						return;
					}
					const info = stats.toJson(extendedConfig.stats);
					if (stats.hasErrors()) {
						console.error('Webpack errors:\n' + info.errors.join('\n-----\n'));
						reject(Error(`Webpack failed with ${info.errors.length} error(s). See legacy-bundler-errors.json for more info.`));
						fs.writeFileSync(path.join(buildDirectory, 'legacy-bundler-errors.json'), JSON.stringify(info.errors, null, 2), 'utf8');
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
			restoreChangedChunks();

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
