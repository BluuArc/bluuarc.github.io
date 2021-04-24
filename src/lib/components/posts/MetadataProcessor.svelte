<script lang="ts">
	import type { SiteMetadata } from '$lib/types/SiteMetadata';
	import { beforeUpdate, onMount } from 'svelte';
	const siteName = 'https://joshuacastor.me';
	function getNormalizedSiteMetadata (metadata?: SiteMetadata): SiteMetadata {
		let imageUrl = metadata?.image || null;
		if (imageUrl && !imageUrl.startsWith(siteName)) {
			imageUrl = `${siteName}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
		}
		return {
			title: `${metadata?.title || 'Default Page Name'} | Blog Post on joshuacastor.me`,
			description: metadata?.description || 'Default Page Description',
			author: metadata?.author || 'Joshua Castor',
			keywords: Array.isArray(metadata?.keywords) && metadata.keywords.length > 0 ? metadata.keywords : null,
			image: imageUrl,
			datePublished: metadata?.datePublished || new Date(),
			dateModified: metadata?.dateModified || null,
		};
	}

	export let metadata: SiteMetadata = getNormalizedSiteMetadata();
	let normalizedMetadata: SiteMetadata = getNormalizedSiteMetadata();
	let ogUrl: string = '';
	let structuredDataString: string = '';
	let hasMounted = false;
	onMount(() => {
		ogUrl = `https://joshuacastor.me${location.pathname}`;
		hasMounted = true;
	});

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

	$: {
		normalizedMetadata = getNormalizedSiteMetadata(metadata);
		if (hasMounted) {
			ogUrl = `https://joshuacastor.me${location.pathname}`;
		}
		if (normalizedMetadata.image) {
			const jsonString = JSON.stringify({
				'@context': 'https://schema.org/',
				'@type': 'BlogPosting',
				headline: normalizedMetadata.title,
				name: normalizedMetadata.title,
				image: [normalizedMetadata.image],
				author: {
					'@type': 'Person',
					name: normalizedMetadata.author,
				},
				description: normalizedMetadata.description,
				datePublished: normalizedMetadata.datePublished.toISOString(),
				dateModified: normalizedMetadata?.dateModified ? normalizedMetadata.dateModified.toISOString() : (void 0),
			}, null, 2);
			// Need to define these separately otherwise the compiler errors out
			const tagOpen = '<';
			const tagClose = '>';
			structuredDataString = [
				`${tagOpen}script type="application/ld+json"${tagClose}`,
				jsonString,
				`${tagOpen}/script${tagClose}`,
			].join('\n');
		} else {
			structuredDataString = '';
		}
	}
</script>

<svelte:head>
	<title>{normalizedMetadata.title}</title>
	<meta name="description" content={normalizedMetadata.description}>
	<link rel="canonical" href="hrl">
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
