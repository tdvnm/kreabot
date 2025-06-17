<script lang="ts">
    import { db } from '$lib/firebase';
    import { collection, addDoc } from 'firebase/firestore';

    let code = '';
    let title = '';
    let instructor = '';
    let credits = '';
    let is_req = false;
    let years = '';
    let year_trim = '';
    let subject = '';
    let description = '';
    let message = '';

    async function handleSubmit(event: Event) {
        event.preventDefault();
        if (!subject.trim()) {
            message = 'Subject is required.';
            return;
        }
        if (!credits || isNaN(Number(credits))) {
            message = 'Credits is required and must be a number.';
            return;
        }
        try {
            await addDoc(collection(db, 'courses'), {
                code,
                title,
                instructor: instructor.split(',').map(s => s.trim()).filter(Boolean),
                credits: Number(credits),
                is_req,
                elig_years: years,
                year_trim,
                subject,
                description
            });
            message = 'Course added!';
            code = title = instructor = description = '';
            is_req = false;
        } catch (e) {
            message = 'Error adding course.';
        }
    }
</script>

<form on:submit={handleSubmit} class="course-form">
    <label>
        Course Code:<br />
        <input bind:value={code} required />
    </label>
    <br />
    <label>
        Title:<br />
        <input bind:value={title} required />
    </label>
    <br />
    <label>
        Instructors (comma separated):<br />
        <textarea bind:value={instructor} rows="2" required></textarea>
    </label>
    <br />
    <label>
        Credits:<br />
        <input type="number" bind:value={credits} min="1" required />
    </label>
    <br />
    <label>
        Required Course:
        <input type="checkbox" bind:checked={is_req} />
    </label>
    <br />
    <label>
        Years (e.g. 2,3,4):<br />
        <input bind:value={years} required />
    </label>
    <br />
    <label>
        Year Trim:<br />
        <input bind:value={year_trim} />
    </label>
    <br />
    <label>
        Subject:<br />
        <input bind:value={subject} required />
    </label>
    <br />
    <label>
        Description:<br />
        <textarea bind:value={description} rows="3"></textarea>
    </label>
    <br />
    <button type="submit">Add Course</button>
</form>

{#if message}
    <p>{message}</p>
{/if}

<style>

</style>