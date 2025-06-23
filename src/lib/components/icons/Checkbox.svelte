<script>
	export let checked = false;
	export let label = '';
</script>

<label class="custom-checkbox">
	<input type="checkbox" bind:checked />
	{#if checked}
		<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path
				d="M5 3H3v18h18V3H5zm0 2h14v14H5V5zm4 7H7v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2H9v-2z"
				fill="#7c4b69a4"
			/>

			<rect x="3" y="3" width="18" height="18" rx="2" fill="#e74c3c25" />
		</svg>
	{:else}
		<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" fill="#7c4b69a4" />
		</svg>
	{/if}
	<span>{label}</span>
</label>

<style>
	.custom-checkbox input[type='checkbox'] {
		display: none;
	}
	.custom-checkbox {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		cursor: pointer;
		margin-right: 0.8rem;
	}

	label {
		font-weight: 450;
	}
</style>
