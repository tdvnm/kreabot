<script lang="ts">
	import ContainerCard from './ContainerCard.svelte';
	import Container from '../../fac/Container.svelte';

	export let data: {
		bySubject: Record<string, any[]>;
	};

	let isRequired = false;
	let isElective = false;

	let credits2 = false;
	let credits3 = false;
	let credits4 = false;

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
</script>

<label>
	<input type="checkbox" bind:checked={isRequired} />
	Required Only
</label>
<label>
	<input type="checkbox" bind:checked={isElective} />
	Electives Only
</label>
<label>
	<input type="checkbox" bind:checked={credits2} />
	Credits 2
</label>
<label>
	<input type="checkbox" bind:checked={credits3} />
	Credits 3
</label>
<label>
	<input type="checkbox" bind:checked={credits4} />
	Credits 4
</label>

<main>
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
