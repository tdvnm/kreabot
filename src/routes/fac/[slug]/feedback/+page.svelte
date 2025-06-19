<script lang="ts">
	import { db } from '$lib/firebase';
	import { collection, addDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
	import { page } from '$app/stores';
	import { getAuth } from 'firebase/auth';

	import ProfHeaderCard from '../ProfHeaderCard.svelte';
	import FeedbackForm from './FeedbackForm.svelte';
	import Feedback from './Feedback.svelte';

	let formFields = {
		course_code: '',
		difficulty: '',
		workload: '',
		grading: '',
		clarity: '',
		take_again: '',
		grade_recd: '',
		structure: '',
		prof_summary: ''
	};

	// ui state
	let professorId = '';
	let professor: any = null;
	let feedbackList: any[] = [];
	let hasSubmitted = false;
	let message = '';

	let courseCodes: string[] = [];

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
	async function loadFeedback() {
		try {
			const feedbackRef = collection(doc(db, 'professors', professorId), 'feedback');
			const snap = await getDocs(query(feedbackRef, orderBy('timestamp', 'desc')));
			feedbackList = snap.docs.map(doc => {
				const d = doc.data();
				return {
					id: doc.id,
					...d,
					timestamp: d.timestamp ? new Date(d.timestamp.seconds * 1000) : null
				};
			});
		} catch (e) {
			message = 'Failed to load feedback.';
			console.error(e);
		}
	}

	// ---------- Function: Handle Form Submission ----------
	// Submits the feedback form to Firestore and reloads the feedback list
	async function handleSubmit(event: Event) {
		event.preventDefault();
		const auth = getAuth();
		const user = auth.currentUser;
		if (!user) {
			message = 'You must be logged in to submit feedback.';
			return;
		}
		try {
			const feedbackRef = collection(doc(db, 'professors', professorId), 'feedback');
			await addDoc(feedbackRef, {
				userId: user.uid,
				userName: user.displayName || 'anonymous',
				...formFields,
				timestamp: new Date()
			});
			hasSubmitted = true;
			await loadFeedback();
			message = 'Feedback added successfully!';
		} catch (err) {
			message = 'Failed to add feedback.';
			console.error(err);
		}
	}

	// ---------- Function: Check User Feedback ----------
	// Checks if the current user has already submitted feedback for the professor
	async function checkUserFeedback() {
		const auth = getAuth();
		const user = auth.currentUser;
		if (!user) return;
		const feedbackRef = collection(doc(db, 'professors', professorId), 'feedback');
		const snap = await getDocs(query(feedbackRef, where('userId', '==', user.uid)));
		hasSubmitted = !snap.empty;
	}

	// Fetch course codes from 'courses' collection
	async function loadCourseCodes() {
		try {
			const snap = await getDocs(collection(db, 'courses'));
			courseCodes = snap.docs
				.map(doc => doc.data().code)
				.filter(Boolean)
				.sort((a, b) => a.localeCompare(b)); // Sort alphabetically
			console.log('Loaded course codes:', courseCodes);
		} catch (e) {
			console.error('Failed to load course codes', e);
		}
	}

	// Load courses on component mount
	loadCourseCodes();

	// readable timestamp
	function formatDate(date: Date): string {
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		});
	}

	// when the slug changes, try to find a professor
	// when professorId is set, load feedback.
	$: {
		if (slug) {
			findProfessorByUrl(slug);
		}
		if (professorId) {
			loadFeedback();
			checkUserFeedback();
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
			bind:course_code={formFields.course_code}
			bind:difficulty={formFields.difficulty}
			bind:workload={formFields.workload}
			bind:grading={formFields.grading}
			bind:clarity={formFields.clarity}
			bind:take_again={formFields.take_again}
			bind:grade_recd={formFields.grade_recd}
			bind:structure={formFields.structure}
			bind:prof_summary={formFields.prof_summary}
			ratingOptions={[1, 2, 3, 4, 5]}
			courseCodes={courseCodes}
			on:submit={handleSubmit}
		/>
	{/if}

	<div>
		{#each feedbackList as fb (fb.id)}
			<Feedback
				data={{ path: fb.id }}
				course_code={fb.course_code}
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
