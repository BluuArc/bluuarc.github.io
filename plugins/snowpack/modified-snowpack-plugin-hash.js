// Identical to the original snowpack-plugin-hash module
// except without sourcemapping due to odd errors appearing
// on the default module.

"use strict";
const fs_1 = require("fs");
const path_1 = require("path");
const ts_morph_1 = require("ts-morph");
const typed_colors_1 = require("typed-colors");
const typed_figures_1 = require("typed-figures");
const createFileReference_1 = require("snowpack-plugin-hash/lib/createFileReference");
const deleteSourceMaps_1 = require("snowpack-plugin-hash/lib/deleteSourceMaps");
const generateAssetManifest_1 = require("snowpack-plugin-hash/lib/generateAssetManifest");
const generateSourceMaps_1 = require("snowpack-plugin-hash/lib/generateSourceMaps");
const getFileSnapshot_1 = require("snowpack-plugin-hash/lib/getFileSnapshot");
const readAllFiles_1 = require("snowpack-plugin-hash/lib/readAllFiles");
const renameFiles_1 = require("snowpack-plugin-hash/lib/renameFiles");
const rewriteHashes_1 = require("snowpack-plugin-hash/lib/rewriteHashes");
const rewriteHtmlFiles_1 = require("snowpack-plugin-hash/lib/rewriteHtmlFiles");
const rewriteImportMap_1 = require("snowpack-plugin-hash/lib/rewriteImportMap");
const writeAllFiles_1 = require("snowpack-plugin-hash/lib/writeAllFiles");
const DEFAULT_HASH_LENGTH = 12;
const DEFAULT_ASSET_MANIFEST = 'asset-manifest.json';
const jsFileExtensions = ['.js', '.jsx'];
const prefix = typed_colors_1.gray('[modified-snowpack-plugin-hash]');
const log = (msg) => console.info(prefix, msg);
const plugin = (config, pluginOptions = {}) => {
	const { tsConfig, hashLength = DEFAULT_HASH_LENGTH, assetManifest = DEFAULT_ASSET_MANIFEST, } = pluginOptions;
	const project = new ts_morph_1.Project({
		tsConfigFilePath: tsConfig,
		compilerOptions: { allowJs: true },
		addFilesFromTsConfig: false,
	});
	return {
		name: 'modified-snowpack-plugin-hash',
		optimize: async (options) => {
			const metaDir = path_1.join(options.buildDirectory, config.buildOptions.metaDir);
			const webModulesDir = path_1.join(options.buildDirectory, config.buildOptions.webModulesUrl);
			const allFiles = readAllFiles_1.readAllFiles(options.buildDirectory).filter((f) => !f.includes(metaDir));
			// Find all the files we know how to apply hashes to
			const jsFiles = allFiles
				.filter((f) => jsFileExtensions.includes(path_1.extname(f)))
				.map((f) => project.addSourceFileAtPath(f));
			const cssFiles = allFiles.filter((f) => path_1.extname(f) === '.css');
			const allFilePaths = [...jsFiles.map((s) => s.getFilePath()), ...cssFiles];
			if (allFilePaths.length === 0) {
				log(`${typed_colors_1.red(typed_figures_1.cross)} No supported files found to apply content hashes.`);
				return;
			}
			// Get an initial snapshot of all our files
			const initialSnapshot = await getFileSnapshot_1.getFileSnapshot(allFilePaths);
			// Generate a map of all the hashes
			log(`${typed_colors_1.yellow('!')} Generating Hashes...`);
			const hashes = new Map(await Promise.all(allFilePaths.map((filePath) => createFileReference_1.createFileReference(filePath, initialSnapshot.get(filePath), hashLength))));
			await rewriteHashes_1.rewriteHashesInSourceFiles({
				log,
				buildDirectory: options.buildDirectory,
				baseUrl: config.buildOptions.baseUrl,
				jsFiles,
				cssFiles,
				hashes,
				initialSnapshot,
			});
			// Get a snapshot of all of the updated source files
			const updatedSnapshot = await getFileSnapshot_1.getFileSnapshot(allFilePaths);
			// Rename files on disk to also have hashes
			await renameFiles_1.renameFiles(allFilePaths, hashes);
			// Update HTML file references
			const htmlFiles = allFiles.filter((f) => path_1.extname(f) === '.html');
			if (htmlFiles.length > 0) {
				log(`${typed_colors_1.yellow('!')} Rewriting HTML imports...`);
				await rewriteHtmlFiles_1.rewriteHtmlFiles(htmlFiles, hashes, options.buildDirectory, config.buildOptions.baseUrl);
			}
			// Generate SourceMaps for hash additions
			// log(`${typed_colors_1.yellow('!')} Generating SourceMaps...`);
			// await writeAllFiles_1.writeAllFiles(await generateSourceMaps_1.generateSourceMaps(initialSnapshot, updatedSnapshot, hashes));
			// // Delete previously-created sourceMaps
			// await deleteSourceMaps_1.deleteSourceMaps(allFilePaths);
			// // Try to rewrite the import map with hashes
			const importMapPath = path_1.join(webModulesDir, 'import-map.json');
			let importMap = null;
			if (fs_1.existsSync(importMapPath)) {
				log(`${typed_colors_1.yellow('!')} Rewriting Import Map...`);
				importMap = await rewriteImportMap_1.rewriteImportMap(importMapPath, webModulesDir, hashes);
			}
			log(`${typed_colors_1.yellow('!')} Generating Asset Manifest [${assetManifest}]...`);
			// Generate an asset manifest for all files at configured path
			await generateAssetManifest_1.generateAssetManifest(options.buildDirectory, webModulesDir, path_1.join(options.buildDirectory, assetManifest), importMap || {}, hashes);
			log(`${typed_colors_1.green(typed_figures_1.tick)} Complete`);
		},
	};
};
module.exports = plugin;
//# sourceMappingURL=index.js.map
