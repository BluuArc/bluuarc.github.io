export interface IPostMetadata {
	pathName: string;
	title: string;
	description: string;
	author: string;
	keywords?: string[];
	image?: string;
	datePublished: Date;
	dateModified?: Date;
	url?: string;
}

export function getNormalizedPostMetadata (metadata?: Partial<IPostMetadata>): IPostMetadata {
	const siteName = 'https://joshuacastor.me';
	let imageUrl = metadata?.image || null;
	if (imageUrl && !imageUrl.startsWith(siteName)) {
		imageUrl = `${siteName}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
	}
	return {
		pathName: metadata?.pathName || void 0,
		title: `${metadata?.title || 'Default Page Name'} | Blog Post on joshuacastor.me`,
		description: metadata?.description || 'Default Page Description',
		author: metadata?.author || 'Joshua Castor',
		keywords: Array.isArray(metadata?.keywords) && metadata.keywords.length > 0 ? metadata.keywords : [],
		image: imageUrl,
		datePublished: metadata?.datePublished || new Date(),
		dateModified: metadata?.dateModified || null,
	};
}

export function convertPostMetadataToBlogPostingSchema(metadata: IPostMetadata) {
	return {
		'@context': 'https://schema.org/',
		'@type': 'BlogPosting',
		headline: metadata.title,
		name: metadata.title,
		image: [metadata.image],
		author: {
			'@type': 'Person',
			name: metadata.author,
		},
		description: metadata.description,
		datePublished: metadata.datePublished.toISOString(),
		dateModified: metadata?.dateModified ? metadata.dateModified.toISOString() : (void 0),
	};
}