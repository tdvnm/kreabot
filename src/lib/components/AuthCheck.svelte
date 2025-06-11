<script lang="ts">
	import { user } from '$lib/firebase';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	import { auth } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

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
	{@render children?.()}
{:else}
	<p class="text-error my-10">
		You must be signed in to view this page.
		{#if $user}
			<h2>Welcome, {$user.displayName}</h2>
			<p>You are logged in</p>
			<button onclick={() => signOut(auth)}>Sign out</button>
		{:else}
			<button onclick={signInWithGoogle}>Sign in with Google</button>
		{/if}
		<a class="btn btn-primary" href="/">Sign in</a>
	</p>
{/if}
