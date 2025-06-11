<script lang="ts">
    import { user, auth } from '$lib/firebase';
    import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
    import { onMount } from 'svelte';

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            console.log(userCredential.user);
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    }
</script>

{#if $user}
    <slot />
{:else}
    <div class="auth-center">
        <div class="auth-card">
            <h2 class="auth-title">Sign in to continue</h2>
            <button class="auth-btn" on:click={signInWithGoogle}>Sign in with Google</button>
        </div>
    </div>
{/if}

<style>
.auth-center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background: var(--main__bg-gradient, #F6EAEA);
}

.auth-card {
    background: #fff;
    border: var(--main__border, 1px solid #996A78);
    border-radius: 12px;
    padding: 2.5rem 2rem;
    box-shadow: 0 2px 16px 0 #b5839240;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.auth-title {
    color: var(--main__text, #623A52);
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 2rem;
    font-family: 'Ubuntu Sans', sans-serif;
}

.auth-btn {
    background: var(--gray__button-bg, #F6F6F6);
    color: var(--main__text, #623A52);
    border: var(--main__border, 1px solid #996A78);
    border-radius: 6px;
    padding: 0.8rem 2.5rem;
    font-size: 1.2rem;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 4px 0 #b5839220;
}

.auth-btn:hover {
    background: var(--peach__grad, #FFD5BF);
    color: #623A52;
}
</style>
