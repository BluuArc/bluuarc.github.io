<script lang="ts">
	export let options: { label: string, value: any }[] = [];
	export let groupTitle: string = '';
	export let value: any = null;
</script>

<fieldset>
	<legend>{groupTitle}</legend>
	{#each options as option}
		<label>
			<input type="radio" bind:group={value} value={option.value}>
			{option.label}
		</label>
	{/each}
</fieldset>
