<script lang="ts">
	import { db } from '$lib/firebase';
	import { collection, addDoc, doc, getDocs, query, where, orderBy, arrayUnion, updateDoc, doc as firestoreDoc, deleteDoc } from 'firebase/firestore';
	import { page } from '$app/stores';
	import { getAuth } from 'firebase/auth';

	import ProfHeaderCard from '../ProfHeaderCard.svelte';
	import FeedbackForm from './FeedbackForm.svelte';
	import Feedback from './Feedback.svelte';
	import AveragesTable from './AveragesTable.svelte';

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
			feedbackList = snap.docs.map((doc) => {
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
			const feedbackDoc = await addDoc(feedbackRef, {
				userId: user.uid,
				userName: user.displayName || 'anonymous',
				...formFields,
				timestamp: new Date()
			});

			// Add feedback ID to user's feedbacks array
			const userRef = firestoreDoc(db, 'users', user.uid);
			await updateDoc(userRef, {
				feedbacks: arrayUnion(feedbackDoc.id)
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
				.map((doc) => doc.data().code)
				.filter(Boolean)
				.sort((a, b) => a.localeCompare(b)); // Sort alphabetically
			console.log('Loaded course codes:', courseCodes);
		} catch (e) {
			console.error('Failed to load course codes', e);
		}
	}

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

	function avg(key: string) {
		if (!Array.isArray(feedbackList) || !feedbackList.length) return '';
		const nums = feedbackList
			.map((fb) => Number(fb?.[key]))
			.filter((n) => typeof n === 'number' && !isNaN(n));
		return nums.length
			? (nums.reduce((sum, n) => sum + n, 0) / nums.length).toFixed(1)
			: '';
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

	// Get current user ID for edit checks
	let currentUserId: string | null = null;
	$: {
		const auth = getAuth();
		currentUserId = auth.currentUser ? auth.currentUser.uid : null;
	}

	// Delete feedback and remove its ID from user's feedbacks array
	async function deleteFeedback(fb) {
		const auth = getAuth();
		const user = auth.currentUser;
		if (!user) {
			message = 'You must be logged in to delete feedback.';
			return;
		}
		try {
			// Delete feedback document
			const feedbackDocRef = doc(db, 'professors', professorId, 'feedback', fb.id);
			await deleteDoc(feedbackDocRef);

			// Remove feedback ID from user's feedbacks array
			const userRef = firestoreDoc(db, 'users', user.uid);
			await updateDoc(userRef, {
				feedbacks: feedbackList
					.filter(f => f.id !== fb.id && f.userId === user.uid)
					.map(f => f.id)
			});

			hasSubmitted = false;
			await loadFeedback();
			await checkUserFeedback();
			message = 'Feedback deleted successfully!';
		} catch (err) {
			message = 'Failed to delete feedback.';
			console.error(err);
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

		<AveragesTable
			averageDifficulty={avg('difficulty')}
			averageWorkload={avg('workload')}
			averageGrading={avg('grading')}
			averageClarity={avg('clarity')}
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
			{courseCodes}
			on:submit={handleSubmit}
		/>
	{/if}

	<div>
		{#each feedbackList as fb (fb.id)}
			<div>
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
				{#if currentUserId === fb.userId}
					<button class="edit-btn" on:click={() => deleteFeedback(fb)}>Delete</button>
				{/if}
			</div>
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		padding: 12px 12px 5rem;
		background-color: #f4f6f9;
		min-height: 100vh;
	}
	.edit-btn {
		margin: 0.5rem 0 1.5rem 0;
		padding: 0.3rem 1.2rem;
		border-radius: 4px;
		border: 1px solid #c0392b;
		background: #fff;
		color: #c0392b;
		font-weight: 600;
		cursor: pointer;
		font-size: 1rem;
		display: block;
	}
</style>
