<script lang="ts">
	import { convertPostMetadataToBlogPostingSchema, getNormalizedPostMetadata, IPostMetadata } from '@src/utilities/post-utilities';
	import { beforeUpdate } from 'svelte';

	export let metadata: Partial<IPostMetadata>;
	let normalizedMetadata: IPostMetadata;
	let structuredDataString = '';
	beforeUpdate(() => {
		// ensure only one script json tag exists
		const existingMetadataJsonElements = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
		if (existingMetadataJsonElements.length > 1) {
			// keep the bottom-most one
			existingMetadataJsonElements.reverse().slice(1).forEach((elem) => {
				elem.remove();
			});
		}
	});

	let ogUrl: string;
	$: {
		if (metadata) {
			normalizedMetadata = getNormalizedPostMetadata(metadata);
			ogUrl = `https://joshuacastor.me${normalizedMetadata.pathName}`;
			if (normalizedMetadata.image) {
				const schemaJson = convertPostMetadataToBlogPostingSchema(normalizedMetadata);
				// Need to define script characters separately otherwise the compiler errors out
				const tagOpen = '<';
				const tagClose = '>';
				structuredDataString = [
					`${tagOpen}script type="application/ld+json"${tagClose}`,
					JSON.stringify(schemaJson, null, 2),
					`${tagOpen}/script${tagClose}`,
				].join('\n');
			} else {
				structuredDataString = '';
			}
		}
	}
</script>

<svelte:head>
	<title>{normalizedMetadata.title}</title>
	<meta name="description" content={normalizedMetadata.description}>
	<link rel="canonical" href={ogUrl}>
	{#if normalizedMetadata.keywords}
		<meta name="keywords" content={normalizedMetadata.keywords.join(', ')}>
	{/if}
	<meta name="twitter:card" content={normalizedMetadata.description}>
	<meta property="og:url" content={ogUrl}>
	<meta property="og:title" content={normalizedMetadata.title}>
	<meta property="og:description" content={normalizedMetadata.description}>
	{#if normalizedMetadata.image}
		<meta property="og:image" content={normalizedMetadata.image}>
		{@html structuredDataString}
	{/if}
</svelte:head>
<slot/>