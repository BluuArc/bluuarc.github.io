import { convertPostMetadataToBlogPostingSchema, getNormalizedPostMetadata, IPostMetadata } from './post-utilities';

describe('post-utilities', () => {
	describe('getNormalizedPostMetadata', () => {
		test('returns default values when nothing is passed in', () => {
			const timeBeforeFunctionCall = new Date();
			const result = getNormalizedPostMetadata();
			const expectedDefaultValues: Partial<IPostMetadata> = {
				pathName: void 0,
				title: 'Default Page Name | Blog Post on joshuacastor.me',
				description: 'Default Page Description',
				author: 'Joshua Castor',
				keywords: [],
				image: null,
				dateModified: null,
			};
			expect(result).toMatchObject(expect.objectContaining(expectedDefaultValues));

			// separate assertions due to datePublished defaulting to time when the function was called
			expect(result.datePublished).toBeTruthy();
			expect(result.datePublished >= timeBeforeFunctionCall).toBeTruthy();
		});

		test('uses passed in values for metadata', () => {
			const inputMetadata: IPostMetadata = {
				pathName: '/some/path/name',
				title: 'Some title',
				description: 'Some description',
				author: 'Some author',
				keywords: ['some', 'keywords'],
				image: '/absolute/path/to/image',
				datePublished: new Date(2022, 0, 0),
				dateModified: new Date(2022, 1, 2),
			};
			const expectedMetadata: IPostMetadata = {
				...inputMetadata,
				title: 'Some title | Blog Post on joshuacastor.me',
				image: 'https://joshuacastor.me/absolute/path/to/image',
			};
			const result = getNormalizedPostMetadata(inputMetadata);
			expect(result).toEqual(expectedMetadata);
		});

		test('does not override image URL from input metadata if it starts with the site name', () => {
			const inputUrl = 'https://joshuacastor.me/some/path/to/an/image.png';
			const result = getNormalizedPostMetadata({ image: inputUrl });
			expect(result).toEqual(expect.objectContaining({ image: inputUrl }));
		});

		test('prepends site name to relative image path from input metadata', () => {
			const inputUrl = 'relative/path/to/image';
			const expectedUrl = 'https://joshuacastor.me/relative/path/to/image';
			const result = getNormalizedPostMetadata({ image: inputUrl });
			expect(result).toEqual(expect.objectContaining({ image: expectedUrl }));
		});

		test('uses an empty array for the "keywords" property if it is not an array in the input metadata', () => {
			const inputKeywords = 'not-an-array';
			const result = getNormalizedPostMetadata({ keywords: inputKeywords as unknown as string[] });
			expect(result).toEqual(expect.objectContaining({ keywords: [] }));
		});
	});

	describe('convertPostMetadataToBlogPostingSchema', () => {
		test('converts metadata information to BlogPosting JSON schema', () => {
			const inputMetadata: IPostMetadata = {
				pathName: '/some/path/name',
				title: 'Some title',
				description: 'Some description',
				author: 'Some author',
				keywords: ['some', 'keywords'],
				image: '/absolute/path/to/image',
				datePublished: new Date(2022, 0, 0),
				dateModified: new Date(2022, 1, 2),
			};
			const expectedSchemaJson = {
				'@context': 'https://schema.org/',
				'@type': 'BlogPosting',
				headline: 'Some title',
				name: 'Some title',
				image: ['/absolute/path/to/image'],
				author: {
					'@type': 'Person',
					name: 'Some author',
				},
				description: 'Some description',
				datePublished: (new Date(2022, 0, 0)).toISOString(),
				dateModified: (new Date(2022, 1, 2)).toISOString(),
			};

			const result = convertPostMetadataToBlogPostingSchema(inputMetadata);
			expect(result).toEqual(expectedSchemaJson);
		});

		test('uses undefined as the value for dateModified if it is not present in the metadata', () => {
			const inputMetadata: IPostMetadata = {
				pathName: '/some/path/name',
				title: 'Some title',
				description: 'Some description',
				author: 'Some author',
				keywords: ['some', 'keywords'],
				image: '/absolute/path/to/image',
				datePublished: new Date(2022, 0, 0),
			};
			const result = convertPostMetadataToBlogPostingSchema(inputMetadata);
			expect(result).toEqual(expect.objectContaining({ dateModified: void 0 }));
		});
	});
});