<script lang="ts">
	export let options: { label: string, value: any }[] = [];
	export let groupTitle: string = '';
	export let value: any[] = [];
</script>

<fieldset>
	<legend>{groupTitle}</legend>
	{#each options as option}
		<label>
			<input type="checkbox" bind:group={value} value={option.value}>
			{option.label}
		</label>
	{/each}
</fieldset>
