<script lang="ts">
    import { auth } from "$lib/firebase";
    import { user } from "$lib/firebase";

    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";


    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user)
    }

</script>

<h2>Login</h2>

{#if $user}
  <h2>Welcome, {$user.displayName}</h2>
  <p>You are logged in</p>
  <button onclick={() => signOut(auth)}>Sign out</button>
{:else}
  <button onclick={signInWithGoogle}>Sign in with Google</button>
{/if}