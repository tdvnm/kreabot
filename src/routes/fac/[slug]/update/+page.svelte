<script lang="ts">
    import { db } from '$lib/firebase';
    import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let professors: { id: string; name: string; education?: string[]; url?: string }[] = [];
    let selectedId = '';
    let selectedName = '';
    let bsc = '';
    let masters = '';
    let phd = '';
    let message = '';

    // Get the slug from the URL
    let slug = '';
    $: slug = $page.params.slug;

    // Additional fields for update
    let email = '';
    let subject = '';
    let location = '';
    let office_hours = '';
    let image_url = '';
    let position = '';

    onMount(async () => {
        const snapshot = await getDocs(collection(db, 'professors'));
        professors = snapshot.docs.map(d => ({
            id: d.id,
            name: d.data().name,
            education: d.data().education ?? [],
            url: d.data().url ?? '',
            email: d.data().email ?? '',
            subject: d.data().subject ?? '',
            location: d.data().location ?? '',
            office_hours: d.data().office_hours ?? '',
            image_url: d.data().image_url ?? '',
            position: d.data().position ?? ''
        }));

        // Try to auto-select the professor based on slug
        const match = professors.find(p => p.url && p.url.toLowerCase().endsWith(slug.toLowerCase()));
        if (match) {
            selectedId = match.id;
            selectedName = match.name;
            bsc = match.education?.[0] ?? '';
            masters = match.education?.[1] ?? '';
            phd = match.education?.[2] ?? '';
            email = match.email;
            subject = match.subject;
            location = match.location;
            office_hours = match.office_hours;
            image_url = match.image_url;
            position = match.position;
        }
    });

    function handleSubmit(event: Event) {
        event.preventDefault();
        const prof = professors.find(p => p.id === selectedId);
        if (prof) {
            selectedName = prof.name;
            const educationArr = [bsc, masters, phd].map(e => e.trim()).filter(e => e.length > 0);
            updateDoc(doc(db, 'professors', selectedId), {
                education: educationArr,
                email,
                subject,
                location,
                office_hours,
                image_url,
                position
            })
                .then(() => {
                    message = `Professor "${selectedName}" updated!`;
                    prof.education = educationArr;
                    prof.email = email;
                    prof.subject = subject;
                    prof.location = location;
                    prof.office_hours = office_hours;
                    prof.image_url = image_url;
                    prof.position = position;
                })
                .catch(() => {
                    message = 'Failed to update professor.';
                });
        } else {
            message = 'Please select a professor.';
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <label for="professor">Select Professor:</label>
    <select id="professor" bind:value={selectedId} required>
        <option value="" disabled>Select a professor</option>
        {#each professors as prof}
            <option value={prof.id}>{prof.name}</option>
        {/each}
    </select>

    <label for="bsc">BSc:</label>
    <input id="bsc" type="text" bind:value={bsc} placeholder="e.g. BSc in Physics" />

    <label for="masters">Masters:</label>
    <input id="masters" type="text" bind:value={masters} placeholder="e.g. MSc in Math" />

    <label for="phd">PhD:</label>
    <input id="phd" type="text" bind:value={phd} placeholder="e.g. PhD in Chemistry" />

    <label for="position">Position:</label>
    <input type="text" id="position" bind:value={position} required />

    <label for="email">Email:</label>
    <input type="email" id="email" bind:value={email} />

    <label for="subject">Subject:</label>
    <input type="text" id="subject" bind:value={subject} required />

    <label for="location">Room No:</label>
    <input type="text" id="location" bind:value={location} required />

    <label for="office_hours">Office Hours:</label>
    <input type="text" id="office_hours" bind:value={office_hours} required />

    <label for="image">Image URL:</label>
    <input type="text" id="image" bind:value={image_url} />

    <button type="submit">Update Professor</button>
</form>

{#if message}
    <p>{message}</p>
{/if}

<style lang="scss">
    form {
        max-width: 600px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    label {
        font-weight: bold;
        margin-bottom: 0.5rem;
    }
    input, select {
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        color: white;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            background-color: #0056b3;
        }
    }
</style>