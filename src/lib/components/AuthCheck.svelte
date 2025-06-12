<script lang="ts">
    import { user, auth } from '$lib/firebase';
    import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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
            <button class="auth-btn" on:click={signInWithGoogle}>sign in with google</button>
    </div>
{/if}

<style>
.auth-center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--main__bg-gradient, #F6EAEA);
}


.auth-btn {
    background: var(--peach__grad, #FFD5BF);
    color: #623A52;
    border: var(--main__border, 1px solid #996A78);
    border-radius: 6px;
    padding: 0.8rem 2.5rem;
    font-size: 1.2rem;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 4px 0 #b5839220;
}
</style>
