<script lang="ts">
	import ContainerCard from './ContainerCard.svelte';
	import Container from '../../fac/Container.svelte';

	import Sort from '$lib/components/icons/Sort.svelte';
	import Delete from '$lib/components/icons/Delete.svelte';

	export let data: {
		bySubject: Record<string, any[]>;
	};

	let isRequired = false;
	let isElective = false;

	let credits2 = false;
	let credits3 = false;
	let credits4 = false;

	let searchQuery = '';

	// alphabetic subject sort
	$: sortedSubjects = Object.keys(data.bySubject).sort();

	// filter functions
	function showCourse(course: any) {
		const req = (course.is_req ?? '').toLowerCase() === 'required';
		const elec = (course.is_req ?? '').toLowerCase() === 'elective';

		let creditsMatch = true;
		if (credits2 || credits3 || credits4) {
			creditsMatch = false;
			if (credits2 && Number(course.credits) === 2) creditsMatch = true;
			if (credits3 && Number(course.credits) === 3) creditsMatch = true;
			if (credits4 && Number(course.credits) === 4) creditsMatch = true;
		}

		if (isRequired && isElective) return creditsMatch;
		if (isRequired) return req && creditsMatch;
		if (isElective) return elec && creditsMatch;
		return creditsMatch;
	}

	$: searchResult =
		searchQuery.length > 1
			? Object.values(data.bySubject)
					.flat()
					.filter(
						(course) =>
							course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
							course.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
							course.faculty?.toLowerCase().includes(searchQuery.toLowerCase())
					)
			: [];

	let showFilterOptions = false;
	$: if (searchQuery.length > 1) {
		showFilterOptions = false; // Hide filter options when searching
	}
</script>

<div class="search-container">
	<input type="text" placeholder="search faculty, course code, or title" bind:value={searchQuery} />
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
		<div class="filter-row">
			<span>show only</span>
			<div class="filter-labels">
				<label>
					<input type="checkbox" bind:checked={isRequired} />
					required
				</label>
				<label>
					<input type="checkbox" bind:checked={isElective} />
					electives
				</label>
			</div>
		</div>
		<div class="filter-row">
			<span>credits</span>
			<div class="filter-labels">
				<label>
					<input type="checkbox" bind:checked={credits2} />
					2
				</label>
				<label>
					<input type="checkbox" bind:checked={credits3} />
					3
				</label>
				<label>
					<input type="checkbox" bind:checked={credits4} />
					4
				</label>
			</div>
		</div>
	</div>
{/if}

<main>
	{#if searchQuery.length > 1}
		{#if searchResult.length > 0}
			<Container heading="search results" collapsible={false}>
				{#each searchResult as course (course.id)}
					<ContainerCard {...course} />
				{/each}
			</Container>
		{:else}
			<p class="no-results">No results found for "{searchQuery}".</p>
		{/if}
	{:else}
		{#each sortedSubjects as subject}
			<Container heading={`${subject} (${data.bySubject[subject].length})`}>
				{#if data.bySubject[subject].length === 0}
					<p class="no-results">No courses available for {subject}</p>
				{/if}
				{#each data.bySubject[subject] as course (course.id)}
					{#if showCourse(course)}
						<ContainerCard {...course} />
					{/if}
				{/each}
			</Container>
		{/each}
	{/if}
</main>

<style lang="scss">
	main {
		padding: var(--main__padding);
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
		padding: 1.2rem 1.6rem;
		font-size: 1.4rem;
		background-color: #f6f6f6;
		border-bottom: var(--gray__border);

		.filter-row {
			display: flex;
			align-items: center;
			margin-bottom: 10px;

			span {
				flex: 1 1 25%;
				font-weight: 600;
				margin-right: 16px;
				color: var(--main__text);
				min-width: 90px;
			}
			.filter-labels {
				flex: 1 1 75%;
				display: flex;
				gap: 1rem;

				label {
					color: var(--light__text);
					display: flex;
					align-items: center;
					margin-right: 1rem;
					input {
						margin-right: 0.5rem;
					}
				}
			}
		}
	}
</style>
