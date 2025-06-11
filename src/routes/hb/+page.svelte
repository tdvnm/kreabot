<script lang="ts">
	import { onMount } from 'svelte';

	let searchQuery = '';
	let showFilterOptions = false;

	onMount(() => {
		document.title = 'SvelteKit Example';
	});
	import Sort from '$lib/components/icons/Sort.svelte';
	import Delete from '$lib/components/icons/Delete.svelte';
    import AuthCheck from '$lib/components/AuthCheck.svelte';

	export let data: {
		subject: Record<string, Professor[]>;
		alphabetical: Professor[];
	};

	type Professor = {
		id: string;
		name: string;
		subject: string;
		email: string;
		location: string;
		office_hours: string;
		image_url: string;
		position: string;
		url: string;
	};

	// filters
	let viewMode: 'subject' | 'alphabetical' = 'subject';

	// search
	$: searchResult =
		searchQuery.length > 1 && data
			? data.alphabetical.filter(
					(prof) =>
						prof.id && // Only show professors with valid id
						(prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
							prof.subject.toLowerCase().includes(searchQuery.toLowerCase()))
				)
			: [];
</script>
<h1>Welcome to SvelteKit</h1>


<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<AuthCheck />

<div class="search-container">
	<input
		type="text"
		placeholder="search for professor or department ..."
		bind:value={searchQuery}
	/>
	{#if searchQuery}
		<button
			class="clear-btn"
			type="button"
			on:click={() => (searchQuery = '')}
			aria-label="Clear search"
		>
			<Delete size="5rem" />
		</button>
	{/if}
	<button on:click={() => (showFilterOptions = !showFilterOptions)}>
		<Sort />
	</button>
</div>

<style lang="scss">
	.search-container {
		position: relative;
		display: flex;
		align-items: center;
		padding: 1rem;
		background: linear-gradient(to top, #e9e9e9 0%, #f6f6f6 100%);
		box-shadow: 0px 2px 6px -2px rgba(99, 76, 76, 0.25);
		border-bottom: var(--gray__border);

		input {
			flex: 1;
			padding: 1rem;
			padding-right: 2.5rem; // space for clear button
			border: var(--gray__border);
			border-right: none;
			color: var(--light__text);
			background-color: white;
			border-radius: 4px 0 0 4px;
			box-shadow: inset 0px 4px 6px 1px #c4ced868;
			height: 4rem;
			font-size: 1.5rem;
		}
		.clear-btn {
			position: absolute;
			right: 6rem;
			background: none;
			border: none;
			color: var(--light__text);
			font-size: 1.4rem;
			padding: 0;
			z-index: 2;
			height: 2rem;
			width: 2.5rem;
			display: flex;
			align-items: center;
			justify-content: center;
			opacity: 0.8;
		}
		button:not(.clear-btn) {
			background: rgb(189, 202, 220);
			background: var(--gray__grad);
			color: var(--light__text);
			border: var(--gray__border);
			padding: 1rem;
			font-weight: 600;
			height: 4rem;
			font-size: 1.8rem;
			border-radius: 0 4px 4px 0;
		}
	}
</style>