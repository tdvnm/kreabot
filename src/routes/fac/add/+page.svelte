<script lang="ts">
    import { db } from '$lib/firebase'; // adjust path as needed
    import { collection, addDoc } from 'firebase/firestore';

    let name = '';
    let subject = '';
    let position = 'Assistant Professor';
    let url = '';
    let image_url = '';
    let bachelors = '';
    let masters = '';
    let phd = '';
    let location = '';
    let email = '';
    let office_hours = 'N/A';
    let message = '';

    function generateUrlAndEmail(name: string) {
        const parts = name.trim().split(/\s+/);
        const first = parts[0]?.toLowerCase() || '';
        const last = parts[1]?.toLowerCase() || '';
        const url = last ? `${first}_${last}` : first;
        const email = last ? `${first}.${last}@krea.edu.in` : `${first}@krea.edu.in`;
        return { url, email };
    }

    async function handleSubmit(event: Event) {
        event.preventDefault();
        const education = [];
        if (bachelors) education.push(bachelors);
        if (masters) education.push(masters);
        if (phd) education.push(phd);

        let finalUrl = url;
        let finalEmail = email;
        if (!finalUrl || finalUrl.trim() === '') {
            finalUrl = generateUrlAndEmail(name).url;
        }
        if (!finalEmail || finalEmail.trim() === '') {
            finalEmail = generateUrlAndEmail(name).email;
        }

        try {
            await addDoc(collection(db, 'professors'), {
                name,
                subject,
                position,
                url: finalUrl,
                image_url,
                education,
                location,
                email: finalEmail,
                office_hours
            });
            message = 'Professor added!';
            name = subject = url = image_url = bachelors = masters = phd = location = email = '';
        } catch (e) {
            message = 'Error adding professor.';
        }
    }
</script>

<form on:submit={handleSubmit}>
    <label>
        Name:
        <input bind:value={name} required />
    </label>
    <label>
        Subject:
        <input bind:value={subject} required />
    </label>
    <label>
        Position:
        <input bind:value={position} placeholder="Assistant professor" />
    </label>
    <label>
        URL:
        <input bind:value={url} placeholder="firstname_lastname" />
    </label>
    <label>
        Email:
        <input bind:value={email} placeholder="firstname.lastname@krea.edu.in" />
    </label>
    <label>
        Image URL:
        <input bind:value={image_url} />
    </label>
    <div>
        <label>
            Bachelors:
            <input bind:value={bachelors} placeholder="Bachelors" />
        </label>
        <label>
            Masters:
            <input bind:value={masters} placeholder="Masters" />
        </label>
        <label>
            PhD:
            <input bind:value={phd} placeholder="PhD" />
        </label>
    </div>
    <label>
        Location:
        <input bind:value={location} placeholder="Location" />
    </label>
    <label>
        Office Hours:
        <input bind:value={office_hours} placeholder="N/A" />
    </label>
    <button type="submit">Add Professor</button>
</form>

{#if message}
    <p>{message}</p>
{/if}