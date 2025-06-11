<script lang="ts">
	// Import Firestore functions and Svelte stores
	import { db } from '$lib/firebase';
	import { collection, addDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
	import { page } from '$app/stores';
	import { getAuth } from "firebase/auth";

	// Import child components
	import ProfHeaderCard from '../ProfHeaderCard.svelte';
	import Feedback from './Feedback.svelte';
	import FeedbackForm from './FeedbackForm.svelte';

	// ---------- Form Field Variables ----------
	let difficulty = '';
	let workload = '';
	let grading = '';
	let clarity = '';
	let take_again = '';
	let grade_recd = '';
	let structure = '';
	let prof_summary = '';

	// Define an array with ratings from 1 to 5 in 0.5 increments
	const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	// ---------- UI State ----------
	let message = '';
	let professorId = '';
	let hasSubmitted = false;

	// ---------- Type Definitions ----------
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

	// ---------- Data Holders ----------
	let feedbackList: FeedbackItem[] = [];
	let professor: any = null;

	// Get the slug parameter from the URL using Svelte's page store
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

		if (!professorId) {
			message = 'Professor not found. Please check the URL.';
			return;
		}

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

			// Immediately hide the form
			hasSubmitted = true;

			// Reset form fields
			difficulty = '';
			workload = '';
			grading = '';
			clarity = '';
			take_again = '';
			structure = '';
			prof_summary = '';

			// Reload the feedback list
			loadFeedback(professorId);
		} catch (err) {
			console.error(err);
			message = 'Failed to add feedback.';
		}
	}

	// ---------- Function: Check User Feedback ----------
	// Checks if the current user has already submitted feedback for the professor
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

	// ---------- Function: Format Date ----------
	// Converts a Date object to a more readable string format
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

	// ---------- Reactive Block ----------
	// When the slug changes, try to find a professor; when professorId is set, load feedback.
	$: {
		if (slug) {
			findProfessorByUrl(slug);
		}
		if (professorId) {
			loadFeedback(professorId);
			checkUserFeedback(professorId);
		}
	}
</script>

<!-- ---------- Page Content ---------- -->
<main>
	<!-- Display the professor header if data is available -->
	{#if professor}
		<ProfHeaderCard
			image_url={professor.image_url}
			name={professor.name}
			position={professor.position}
			subject={professor.subject}
		/>
	{/if}

	<h2>Add Feedback</h2>

	<!-- Feedback Submission Form -->
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
			{message}
			ratingOptions={[1, 2, 3, 4, 5]}
			on:submit={handleSubmit}
		/>
	{:else}
		<p>You have already submitted feedback for this professor.</p>
	{/if}

	<!-- Display a message if any -->
	{#if message}
		<p class="message">{message}</p>
	{/if}

	<!-- Feedback List -->
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
        padding: 1rem;
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

        textarea,
        button {
            width: 100%;
        }

        .radio-group {
            display: flex;
        }
    }

    input, textarea {
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
        margin-top: 1rem
    }

    .radio-group.connected {
        display: flex;
    }

    .radio-rect {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        background: #eee;
        border: var(--gray__border);
        border-right: none;
        padding: 0.5rem 1rem;
        user-select: none;
        transition: background 0.2s, border-color 0.2s;

        &.first {
            border-radius: 4px 0 0 4px;
        }
        &.last {
            border-radius: 0 4px 4px 0;
            border-right: 1px solid #ccc;
        }
        &.selected {
            background: #b58392;
            color: #fff;
            border-color: #b58392;
            z-index: 1;
			box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        input[type="radio"] {
            display: none;
        }
        span {
            font-size: 1rem;
        }
    }

    /* Remove double border between segments */
    .radio-rect:not(.last) {
        margin-right: -1px;
    }

    select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #fff;
        font-size: 1rem;
    }
</style>
