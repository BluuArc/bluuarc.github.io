const glob = require('glob');
const fs = require('fs');

const allFiles = glob.sync('**/*.svx');

const allPostMetadataPromises = allFiles.map((filePath) => {
	return new Promise((resolve, reject) => {
		console.log(`Parsing file [${filePath}]`);
		fs.readFile(filePath, 'utf8', (err, contents) => {
			if (err) {
				reject(err);
			} else {
				// extract the metadata from the script tag
				const scriptStartIndex = contents.indexOf('export const metadata');
				const scriptEndIndex = contents.indexOf('</script', scriptStartIndex);
				const functionBodyContents = contents.substring(scriptStartIndex, scriptEndIndex).replace('export const metadata =', 'return');
				const metadata = new Function(functionBodyContents)();
				metadata.url = filePath.replace('src/routes/posts', '/posts').replace('.svx', '');
				resolve(metadata);
			}
		});
	});
});

Promise.all(allPostMetadataPromises)
	.then((metadataEntries) => {
		metadataEntries.sort((a, b) => (new Date(a.dateModified || a.datePublished)).valueOf() - (new Date(b.dateModified || a.datePublished)).valueOf());
		fs.writeFileSync('static/post-metadata.json', JSON.stringify(metadataEntries, null, 2), 'utf8');
		console.log('wrote post-metadata.json');
	});
