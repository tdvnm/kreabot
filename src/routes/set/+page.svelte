<script lang="ts">
    import { auth } from '$lib/firebase';
    import { signOut } from 'firebase/auth';

    async function handleSignOut() {
        await signOut(auth);
    }
</script>

<h1>Settings</h1>
<button on:click={handleSignOut}>Sign out</button>
