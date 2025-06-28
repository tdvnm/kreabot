<script lang="ts">
    import { user, auth, db } from '$lib/firebase';
    import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
    import { doc, getDoc, setDoc } from 'firebase/firestore';

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const u = userCredential.user;

            // Check if user exists in Firestore
            const userRef = doc(db, 'users', u.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Add user to Firestore
                await setDoc(userRef, {
                    email: u.email,
                    is_student: true,
                    photoUrl: u.photoURL ?? null,
                    username: u.displayName?.replace(/\s+/g, '_').toLowerCase() ?? '',
                    year: new Date().getFullYear().toString()
                });
            }
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
    box-shadow: 0 1px 4px 0 #b5839220;
}
</style>
