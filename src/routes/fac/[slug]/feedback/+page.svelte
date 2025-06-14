<script lang="ts">
	// Import Firestore functions and Svelte stores
	import { db } from '$lib/firebase';
	import { collection, addDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
	import { page } from '$app/stores';
	import { getAuth } from 'firebase/auth';

	// Import child components
	import ProfHeaderCard from '../ProfHeaderCard.svelte';
	import FeedbackForm from './FeedbackForm.svelte';
	import Feedback from './Feedback.svelte';

	// form field variables
	let difficulty = '';
	let workload = '';
	let grading = '';
	let clarity = '';
	let take_again = '';
	let grade_recd = '';
	let structure = '';
	let prof_summary = '';

	// ui state
	let message = '';
	let professorId = '';
	let hasSubmitted = false;

	// type definition for feedback items
	type FeedbackItem = {
		id: string;
		difficulty?: string;
		workload?: string;
		grading?: string;
		clarity?: string;
		take_again?: string;
		grade_recd?: string;
		structure?: string;
		prof_summary?: string;
		timestamp?: Date | null;
	};

	// data holders
	let feedbackList: FeedbackItem[] = [];
	let professor: any = null;

	// get the slug parameter from the URL using Svelte's page store
	$: slug = $page.params.slug;

	// ---------- Function: Find Professor ----------
	// This function searches the Firestore 'professors' collection for a document
	// whose 'url' field matches the provided slug.
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

	// ---------- Function: Load Feedback ----------
	// Loads feedback for a given professor ID from a subcollection and orders them by timestamp
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
					difficulty: data.difficulty,
					workload: data.workload,
					grading: data.grading,
					clarity: data.clarity,
					take_again: data.take_again,
					grade_recd: data.grade_recd,
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

	// ---------- Function: Handle Form Submission ----------
	// Submits the feedback form to Firestore and reloads the feedback list
	async function handleSubmit(event: Event) {
		event.preventDefault();

		try {
			const auth = getAuth();
			const user = auth.currentUser;

			if (!user) {
				message = 'You must be logged in to submit feedback.';
				return;
			}

			const professorRef = doc(db, 'professors', professorId);
			const feedbackRef = collection(professorRef, 'feedback');
			await addDoc(feedbackRef, {
				userId: user.uid,
				userName: user.displayName || 'anonymous',
				difficulty,
				workload,
				grading,
				clarity,
				take_again,
				grade_recd,
				structure,
				prof_summary,
				timestamp: new Date()
			});
			message = 'Feedback added successfully!';

			// immediately hide the form
			hasSubmitted = true;

			// reset form fields
			difficulty = '';
			workload = '';
			grading = '';
			clarity = '';
			take_again = '';
			structure = '';
			prof_summary = '';

			// reload the feedback list
			loadFeedback(professorId);
		} catch (err) {
			console.error(err);
			message = 'Failed to add feedback.';
		}
	}

// cehck if user already submitted feedback
	async function checkUserFeedback(profId: string) {
		const auth = getAuth();
		const currentUser = auth.currentUser;
		if (!currentUser) return;

		const professorRef = doc(db, 'professors', profId);
		const feedbackRef = collection(professorRef, 'feedback');
		const q = query(feedbackRef, where('userId', '==', currentUser.uid));
		const snapshot = await getDocs(q);

		hasSubmitted = !snapshot.empty;
	}

// readable timestamp
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

	// when the slug changes, try to find a professor
	// when professorId is set, load feedback.
	$: {
		if (slug) {
			findProfessorByUrl(slug);
		}
		if (professorId) {
			loadFeedback(professorId);
			checkUserFeedback(professorId);
		}
	}

	$: if (message) {
		console.log('Alert:', message);
		message = '';
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

	{#if !hasSubmitted}
		<FeedbackForm
			bind:difficulty
			bind:workload
			bind:grading
			bind:clarity
			bind:take_again
			bind:grade_recd
			bind:structure
			bind:prof_summary
			ratingOptions={[1, 2, 3, 4, 5]}
			on:submit={handleSubmit}
		/>
	{:else}
		<p></p>
	{/if}

	<div>
		{#each feedbackList as fb (fb.id)}
			<Feedback
				course_name="course name"
				timestamp={fb.timestamp ? formatDate(fb.timestamp) : ''}
				difficulty={fb.difficulty}
				workload={fb.workload}
				grading={fb.grading}
				clarity={fb.clarity}
				take_again={fb.take_again}
				grade_recd={fb.grade_recd}
				structure={fb.structure}
				prof_summary={fb.prof_summary}
			/>
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		padding: 1.2rem 1.2rem 5rem 1.2rem;
		background-color: #f3f7fd;
		min-height: 100vh;
	}
</style>
