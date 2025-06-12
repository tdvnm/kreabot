<script lang="ts">
	import Container from './Container.svelte';
	import ContainerCard from './ContainerCard.svelte';
	import Sort from '$lib/components/icons/Sort.svelte';
	import Delete from '$lib/components/icons/Delete.svelte';
	import Search from '$lib/components/icons/Search.svelte';

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
	let showFilterOptions = false;
	let viewMode: 'subject' | 'alphabetical' = 'subject';

	// search
	let searchQuery = '';
	$: searchResult =
		searchQuery.length > 1 && data
			? data.alphabetical.filter(
					(prof) =>
						prof.id && // Only show professors with valid id
						(prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
							prof.subject.toLowerCase().includes(searchQuery.toLowerCase()))
				)
			: [];

	let expandedProfId: string | null = null;
</script>

<!-- Search + Filter -->
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

{#if showFilterOptions}
	<div class="filter-options">
		<label>
			<input type="radio" name="viewMode" value="subject" bind:group={viewMode} /> department
		</label>
		<label>
			<input type="radio" name="viewMode" value="alphabetical" bind:group={viewMode} /> alphabetical
		</label>
	</div>
{/if}

<main>
	{#if searchQuery.length > 1}
		{#if searchResult.length > 0}
			<Container heading="search results" collapsible={false}>
				<span slot="icon">
					<Search size="1.4rem" />
				</span>

				{#each searchResult.filter((prof) => prof.id && prof.name && prof.subject) as prof (prof.id)}
					<ContainerCard
						{...prof}
						position={`${prof.position}, ${prof.subject}`}
						expanded={expandedProfId === prof.id}
						onExpand={() => {
							expandedProfId = expandedProfId === prof.id ? null : prof.id;
						}}
					/>
				{/each}
			</Container>
		{:else}
			<p class="no-results">No results found for "{searchQuery}".</p>
		{/if}
	{:else if viewMode === 'subject'}
		{#each Object.entries(data.subject) as [subject, professors]}
			<Container heading={`${subject} (${professors.length})`}>
				{#each professors as prof (prof.id)}
					<ContainerCard
						{...prof}
						expanded={expandedProfId === prof.id}
						onExpand={() => {
							expandedProfId = expandedProfId === prof.id ? null : prof.id;
						}}
					/>
				{/each}
			</Container>
		{/each}
	{:else}
		{#each 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') as letter}
			{#if data.alphabetical.some((p) => p.name[0].toUpperCase() === letter)}
				<Container heading={letter}>
					{#each data.alphabetical.filter((p) => p.name[0].toUpperCase() === letter) as prof (prof.id)}
						<ContainerCard
							{...prof}
							position={`${prof.position}, ${prof.subject}`}
							expanded={expandedProfId === prof.id}
							onExpand={() => {
								expandedProfId = expandedProfId === prof.id ? null : prof.id;
							}}
						/>
					{/each}
				</Container>
			{/if}
		{/each}
	{/if}
</main>

<style lang="scss">
	.search-container {
		position: relative;
		display: flex;
		align-items: center;
		padding: 1.2rem;
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

	.filter-options {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1.2rem 0;
		font-size: 1.4rem;
		background-color: #f6f6f6;
		border-bottom: var(--gray__border);

		p {
			font-weight: 600;
		}

		label {
			margin-right: 2rem;
			cursor: pointer;
			color: var(--light__text);

			input {
				margin-right: 0.2rem;
			}
		}
	}

	main {
		padding: 0 1.2rem 5rem;

		.no-results {
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			font-size: 1.6rem;
			color: #545458;
			padding: 1rem;
			height: 50vh;
		}
	}
</style>
