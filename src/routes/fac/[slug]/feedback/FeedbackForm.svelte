<script lang="ts">
	import Container from '../../Container.svelte';
	import { createEventDispatcher } from 'svelte';

	export let difficulty = '';
	export let workload = '';
	export let grading = '';
	export let clarity = '';
	export let take_again = '';
	export let grade_recd = '';
	export let structure = '';
	export let prof_summary = '';
	export let ratingOptions = [1, 2, 3, 4, 5];

	const dispatch = createEventDispatcher();

	function handleSubmit(event: Event) {
		event.preventDefault();
		dispatch('submit', {
			difficulty,
			workload,
			grading,
			clarity,
			take_again,
			grade_recd,
			structure,
			prof_summary
		});
	}
</script>

<Container heading="feedback form" isContentVisible={false}>
	<form on:submit={handleSubmit}>
		<!-- Overall Rating -->
		<div>
			<label>Overall Rating:</label>
			<div>
				{#each ratingOptions as rating}
					<label>
						<input
							type="radio"
							name="difficulty"
							bind:group={difficulty}
							value={rating}
							aria-label={rating}
						/>
						{rating}
					</label>
				{/each}
			</div>
		</div>

		<!-- Workload Rating -->
		<div>
			<label>Workload Rating:</label>
			<div>
				{#each ratingOptions as rating}
					<label>
						<input
							type="radio"
							name="workload"
							bind:group={workload}
							value={rating}
							aria-label={rating}
						/>
						{rating}
					</label>
				{/each}
			</div>
		</div>

		<!-- Grading Rating -->
		<div>
			<label>Grading Rating:</label>
			<div>
				{#each ratingOptions as rating}
					<label>
						<input
							type="radio"
							name="grading"
							bind:group={grading}
							value={rating}
							aria-label={rating}
						/>
						{rating}
					</label>
				{/each}
			</div>
		</div>

		<!-- Clarity Rating -->
		<div>
			<label>Clarity Rating:</label>
			<div>
				{#each ratingOptions as rating}
					<label>
						<input
							type="radio"
							name="clarity"
							bind:group={clarity}
							value={rating}
							aria-label={rating}
						/>
						{rating}
					</label>
				{/each}
			</div>
		</div>

		<!-- Feedback Dropdowns -->
		<div>
			<label>would take again</label>
			<select bind:value={take_again}>
				<option value="" disabled selected>Select an option</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="maybe">Maybe</option>
			</select>
		</div>
		<div>
			<label>grade received</label>
			<select bind:value={grade_recd}>
				<option value="" disabled selected>Select grade</option>
				<option value="A+">A+</option>
				<option value="A">A</option>
				<option value="A-">A-</option>
				<option value="B+">B+</option>
				<option value="B">B</option>
				<option value="B-">B-</option>
				<option value="C+">C+</option>
				<option value="C">C</option>
				<option value="C-">C-</option>
				<option value="D">D</option>
				<option value="F">F</option>
			</select>
		</div>
		<div>
			<label>course structure / planning</label>
			<textarea bind:value={structure} rows="2"></textarea>
		</div>
		<div>
			<label>Professor/Course Summary:</label>
			<textarea bind:value={prof_summary} rows="2"></textarea>
		</div>

		<button type="submit">Submit Feedback</button>
	</form>
</Container>

<style lang="scss">
	form {
		padding: 1rem;
	}
</style>
