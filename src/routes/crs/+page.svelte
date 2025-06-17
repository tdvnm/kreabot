<script lang="ts">
	import ContainerCard from './ContainerCard.svelte';
	import Sort from '$lib/components/icons/Sort.svelte';
	import Delete from '$lib/components/icons/Delete.svelte';

	import Container from '../fac/Container.svelte';

	export let data: {
		bySubject: Record<string, any[]>;
	};

	let showFilterOptions = false;
	let searchQuery = '';
	let selectedYears: string[] = [];
	let creditsOnly = false;
	let showElectives = false;

	function matchesFilters(course) {
		// Credits filter
		if (creditsOnly && Number(course.credits) !== 4) return false;
		// Year filter
		if (selectedYears.length > 0) {
			const years = String(course.elig_years ?? '')
				.split(',')
				.map((y) => y.trim());
			if (!selectedYears.some((sel) => years.includes(sel))) return false;
		}
		// Elective filter
		const isElective = (course.is_req ?? '').toLowerCase() === 'elective';
		if (!showElectives && isElective) return false;
		return true;
	}

	$: filteredSubjects = Object.entries(data.bySubject).reduce((acc, [subject, courses]) => {
		const filtered = courses.filter(
			(course) =>
				matchesFilters(course) &&
				(!searchQuery ||
					course.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					course.faculty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					course.subject?.toLowerCase().includes(searchQuery.toLowerCase()))
		);
		if (filtered.length) acc[subject] = filtered;
		return acc;
	}, {});
</script>

<!-- Search + Filter -->
<div class="search-container">
	<input
		type="text"
		placeholder="search for course, code, subject, or faculty ..."
		bind:value={searchQuery}
	/>
	{#if searchQuery}
		<button
			class="clear-btn"
			type="button"
			on:click={() => (searchQuery = '')}
			aria-label="Clear search"
		>
			<Delete size="1.4rem" />
		</button>
	{/if}
	<button on:click={() => (showFilterOptions = !showFilterOptions)}>
		<Sort />
	</button>
</div>

{#if showFilterOptions}
	<div class="filter-options">
		<label><input type="checkbox" value="1" bind:group={selectedYears} /> 1</label>
		<label><input type="checkbox" value="2" bind:group={selectedYears} /> 2</label>
		<label><input type="checkbox" value="3" bind:group={selectedYears} /> 3</label>
		<label><input type="checkbox" value="4" bind:group={selectedYears} /> 4</label>
		<label style="margin-left:2rem;"
			><input type="checkbox" bind:checked={creditsOnly} /> 4 credits only</label
		>
		<label style="margin-left:2rem;"
			><input type="checkbox" bind:checked={showElectives} /> Elective</label
		>
	</div>
{/if}

<main>
	{#if Object.keys(filteredSubjects).length === 0}
		<p class="no-results">No results found.</p>
	{:else}
		{#each Object.entries(filteredSubjects) as [subject, courses]}
			<Container heading={subject}>
				{#each courses as course (course.id)}
					<ContainerCard {...course} />
				{/each}
			</Container>
		{/each}
	{/if}
</main>

<style>
	main {
		padding: 0 1.2rem 5rem;
	}
	.search-container {
		position: relative;
		display: flex;
		align-items: center;
		padding: 1.2rem;
		background: linear-gradient(to top, #e9e9e9 0%, #f6f6f6 100%);
		box-shadow: 0px 2px 6px -2px rgba(99, 76, 76, 0.25);
		border-bottom: var(--gray__border);
	}
	.search-container input {
		flex: 1;
		padding: 1rem;
		padding-right: 2.5rem;
		border: var(--gray__border);
		border-right: none;
		color: var(--light__text);
		background-color: white;
		border-radius: 4px 0 0 4px;
		box-shadow: inset 0px 4px 6px 1px #c4ced868;
		height: 4rem;
		font-size: 1.5rem;
	}
	.search-container .clear-btn {
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
	.search-container button:not(.clear-btn) {
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
	.filter-options {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1.2rem 0;
		font-size: 1.4rem;
		background-color: #f6f6f6;
		border-bottom: var(--gray__border);
	}
	.filter-options label {
		margin-right: 2rem;
		cursor: pointer;
		color: var(--light__text);
	}
	.filter-options input {
		margin-right: 0.2rem;
	}
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
</style>
