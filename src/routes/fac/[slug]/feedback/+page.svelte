<script lang="ts">
	import { db } from '$lib/firebase';
	import { collection, addDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
	import { page } from '$app/stores';
	import ProfHeaderCard from '../ProfHeaderCard.svelte';
	import Feedback from './Feedback.svelte';

	// Form field variables
	let overall = '';
	let workload = '';
	let grading = '';
	let clarity = '';
	let expectations = '';
	let structure = '';
	let prof_summary = '';

	let message = '';
	let professorId = '';
	type FeedbackItem = {
		id: string;
		comment?: string;
		overall?: string;
		workload?: string;
		grading?: string;
		clarity?: string;
		engaging?: string;
		exam_difficulty?: string;
		prerequisites?: string;
		planning_feedback?: string;
		prof_summary?: string;
		timestamp?: Date | null;
	};

	let feedbackList: FeedbackItem[] = [];
	let professor: any = null;

	// Get the URL slug
	$: slug = $page.params.slug;

	// Find the professor document by matching the URL field (lowercase)
	async function findProfessorByUrl(url: string) {
		const professorsRef = collection(db, 'professors');
		const q = query(professorsRef, where('url', '==', url));
		const snapshot = await getDocs(q);

		if (!snapshot.empty) {
			professorId = snapshot.docs[0].id;
			professor = snapshot.docs[0].data();
			console.log('Found professor ID:', professorId);
		} else {
			console.error('No professor found with URL:', url);
			message = 'Professor not found';
		}
	}

	// Load feedback for the given professor
	async function loadFeedback(profId: string) {
		try {
			const professorRef = doc(db, 'professors', profId);
			const feedbackRef = collection(professorRef, 'feedback');
			const q = query(feedbackRef, orderBy('timestamp', 'desc'));
			const snapshot = await getDocs(q);

			feedbackList = snapshot.docs.map((doc) => {
				const data = doc.data();
				const timestamp = data.timestamp ? new Date(data.timestamp.seconds * 1000) : null;
				return {
					id: doc.id,
					overall: data.overall,
					workload: data.workload,
					grading: data.grading,
					clarity: data.clarity,
					expectations: data.expectations,
					structure: data.structure,
					prof_summary: data.prof_summary,
					timestamp
				};
			});
		} catch (error) {
			console.error('Error loading feedback:', error);
			message = 'Failed to load feedback.';
		}
	}

	// Handle form submission: upload all field values to Firestore
	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!professorId) {
			message = 'Professor not found. Please check the URL.';
			return;
		}
		try {
			const professorRef = doc(db, 'professors', professorId);
			const feedbackRef = collection(professorRef, 'feedback');
			await addDoc(feedbackRef, {
				overall,
				workload,
				grading,
				clarity,
				expectations,
				structure,
				prof_summary,
				timestamp: new Date()
			});
			message = 'Feedback added successfully!';
			// Reset fields after submission
			overall = '';
			workload = '';
			grading = '';
			clarity = '';
			expectations = '';
			structure = '';
			prof_summary = '';
			loadFeedback(professorId);
		} catch (err) {
			console.error(err);
			message = 'Failed to add feedback.';
		}
	}

	// Format the date
	function formatDate(date: Date): string {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		};
		return date.toLocaleDateString(undefined, options);
	}

	// Reactively load professor and feedback when slug/professorId change.
	$: {
		if (slug) {
			findProfessorByUrl(slug);
		}
		if (professorId) {
			loadFeedback(professorId);
		}
	}
</script>

<main>
	{#if professor}
		<ProfHeaderCard
			image_url={professor.image_url}
			name={professor.name}
			position={professor.position}
			subject={professor.subject}
		/>
	{/if}

	<h2>Add Feedback</h2>
	<form on:submit|preventDefault={handleSubmit}>
		<!-- Overall Rating -->
		<div class="form-group">
			<label>Overall Rating:</label><br />
			<div class="radio-group">
				<label><input type="radio" name="overall" bind:group={overall} value="1" /> 1</label>
				<label><input type="radio" name="overall" bind:group={overall} value="2" /> 2</label>
				<label><input type="radio" name="overall" bind:group={overall} value="3" /> 3</label>
				<label><input type="radio" name="overall" bind:group={overall} value="4" /> 4</label>
				<label><input type="radio" name="overall" bind:group={overall} value="5" /> 5</label>
			</div>
		</div>

		<!-- Workload Rating -->
		<div class="form-group">
			<label>Workload Rating:</label><br />
			<div class="radio-group">
				<label><input type="radio" name="workload" bind:group={workload} value="1" /> 1</label>
				<label><input type="radio" name="workload" bind:group={workload} value="2" /> 2</label>
				<label><input type="radio" name="workload" bind:group={workload} value="3" /> 3</label>
				<label><input type="radio" name="workload" bind:group={workload} value="4" /> 4</label>
				<label><input type="radio" name="workload" bind:group={workload} value="5" /> 5</label>
			</div>
		</div>

		<!-- Grading Rating -->
		<div class="form-group">
			<label>Grading Rating:</label><br />
			<div class="radio-group">
				<label><input type="radio" name="grading" bind:group={grading} value="1" /> 1</label>
				<label><input type="radio" name="grading" bind:group={grading} value="2" /> 2</label>
				<label><input type="radio" name="grading" bind:group={grading} value="3" /> 3</label>
				<label><input type="radio" name="grading" bind:group={grading} value="4" /> 4</label>
				<label><input type="radio" name="grading" bind:group={grading} value="5" /> 5</label>
			</div>
		</div>

		<!-- Clarity Rating -->
		<div class="form-group">
			<label>Clarity Rating:</label><br />
			<div class="radio-group">
				<label><input type="radio" name="clarity" bind:group={clarity} value="1" /> 1</label>
				<label><input type="radio" name="clarity" bind:group={clarity} value="2" /> 2</label>
				<label><input type="radio" name="clarity" bind:group={clarity} value="3" /> 3</label>
				<label><input type="radio" name="clarity" bind:group={clarity} value="4" /> 4</label>
				<label><input type="radio" name="clarity" bind:group={clarity} value="5" /> 5</label>
			</div>
		</div>


		<!-- Course Planning Feedback -->
		<div class="form-group">
			<label>Course Planning / Structure Feedback:</label><br />
			<textarea name="planning_feedback" rows="3" cols="50" bind:value={structure}
			></textarea>
		</div>

		<div class="form-group">
			<label>what to epect:</label><br />
			<textarea name="engaging" rows="3" cols="50" bind:value={expectations}></textarea>
		</div>

		<!-- Professor Summary -->
		<div class="form-group">
			<label>description of the porfessor / course</label><br />
			<textarea name="prof_summary" rows="2" cols="50" bind:value={prof_summary}></textarea>
		</div>

		<button type="submit">Submit Feedback</button>
	</form>

	{#if message}
		<p class="message">{message}</p>
	{/if}

	<!-- Render the Feedback component -->

	<!-- List loaded feedback -->
	<div>
		{#each feedbackList as fb (fb.id)}
			<Feedback
				course_name={'Sample Course'}
				timestamp={fb.timestamp ? formatDate(fb.timestamp) : ''}
				overall={fb.overall}
				workload={fb.workload}
				grading={fb.grading}
				clarity={fb.clarity}
				expectations={fb.expectations}
				structure={fb.structure}
				prof_summary={fb.prof_summary}
			/>
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		padding: 1.2rem;
		background-color: #F4F6FA;
	}

	form {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;

		.form-group {
			flex: 1 1 45%;
		}

		/* Remove full-width from radio-group elements */
		.radio-group {
			display: flex;
			gap: 0.5rem;
		}

		textarea,
		button {
			width: 100%;
		}
	}

	input,
	textarea {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		padding: 0.5rem 1rem;
		background: var(--primary-color, #007bff);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;

		&:hover {
			background: var(--primary-color-dark, #0056b3);
		}
	}

	.message {
		color: var(--secondary-text);
		margin-top: 1rem;
	}
</style>
