<script lang="ts">
	import Container from '../fac/Container.svelte';
	import ContainerCard from './ContainerCard.svelte';

	export let data: {
		bySubject: Record<string, any[]>;
	};

	// Get subjects in alphabetical order
	$: sortedSubjects = Object.keys(data.bySubject).sort();
</script>

<main>
	{#if sortedSubjects.length === 0}
		<p class="no-results">No results found.</p>
	{:else}
		{#each sortedSubjects as subject}
			<Container heading={`${subject} (${data.bySubject[subject].length})`}>
				{#each data.bySubject[subject] as course (course.id)}
					<ContainerCard {...course} />
				{/each}
			</Container>
		{/each}
	{/if}
</main>

<style>
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
</style>
