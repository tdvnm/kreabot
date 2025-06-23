<script lang="ts">
	import Checkbox from '$lib/components/icons/Checkbox.svelte';
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';

	async function handleSignOut() {
		await signOut(auth);
	}
	let darkMode = false;

	function toggleDarkMode() {
		darkMode = !darkMode;
		document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
	}
</script>

<h1>Settings</h1>
<button on:click={handleSignOut}>Sign out</button>

<button on:click={toggleDarkMode}>
	{darkMode ? 'Light Mode' : 'Dark Mode'}
</button>

<Checkbox />
	

