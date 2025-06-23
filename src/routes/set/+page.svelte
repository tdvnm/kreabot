<script lang="ts">
	import Checkbox from '$lib/components/icons/Checkbox.svelte';
	import { auth } from '$lib/firebase';
	import { signOut, updateProfile } from 'firebase/auth';
	import { onMount } from 'svelte';

	let user: null | {
		displayName: string | null;
		photoURL: string | null;
	} = null;

	let newPhotoURL = '';

	async function handleSignOut() {
		await signOut(auth);
	}
	let darkMode = false;

	function toggleDarkMode() {
		darkMode = !darkMode;
		document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
	}

	async function handleProfilePicChange() {
		if (auth.currentUser && newPhotoURL.trim()) {
			await updateProfile(auth.currentUser, { photoURL: newPhotoURL.trim() });
			user = {
				...user,
				photoURL: newPhotoURL.trim()
			};
			newPhotoURL = '';
		}
	}

	onMount(() => {
		const currentUser = auth.currentUser;
		if (currentUser) {
			user = {
				displayName: currentUser.displayName,
				photoURL: currentUser.photoURL
			};
		}
	});
</script>

<main>
	<h1>Settings</h1>

	{#if user}
		<div class="profile">
			{#if user.photoURL}
				<img
					src={user.photoURL}
					alt="User photo"
					width="48"
					height="48"
					style="border-radius: 50%;"
				/>
			{/if}
			<span>{user.displayName}</span>
		</div>
		<div style="margin: 1rem 0;">
			<label for="photo-url">Change profile picture URL:</label>
			<input
				id="photo-url"
				type="url"
				bind:value={newPhotoURL}
				placeholder="Paste image URL"
				style="margin-left: 0.5rem; width: 220px;"
			/>
			<button on:click={handleProfilePicChange} disabled={!newPhotoURL.trim()}>Update</button>
		</div>
	{/if}

	<button on:click={handleSignOut}>Sign out</button>

	<button on:click={toggleDarkMode}>
		{darkMode ? 'Light Mode' : 'Dark Mode'}
	</button>
</main>

<style lang="scss">
	main {
		padding: 1.2rem;

	}
	.profile {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 1rem;
		font-size: 2rem;
	}
</style>
