<script lang="ts">
	import '../app.scss';
	import { page } from '$app/stores';
	import { slugify } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { subjects: string[] }; children: Snippet } = $props();
	let currentSubject = $derived($page.params.subject || '');
	let menuOpen = $state(false);

	$effect(() => {
		$page.url.pathname;
		menuOpen = false;
	});
</script>

<div class="app">
	<header class="top-bar">
		<button class="menu-toggle" onclick={() => (menuOpen = !menuOpen)} aria-label="Toggle menu">
			{menuOpen ? '✕' : '☰'}
		</button>
		<!-- <h1 class="logo">kreabot</h1> -->
		<img src="/TEMOLOGO.png" alt="Logo" class="logo-img" />
		<div class="user-area">
			<span class="user-name">Student Name</span>
			<button class="sign-out">sign out</button>
		</div>
	</header>

	{#if menuOpen}
		<button class="backdrop" onclick={() => (menuOpen = false)} aria-label="Close menu"></button>
	{/if}

	<aside class="sidebar-subjects" class:open={menuOpen}>
		<nav>
			{#each data.subjects as subject}
				<a
					href="/{slugify(subject)}"
					class:active={currentSubject === slugify(subject)}
				>
					{subject}
				</a>
			{/each}
		</nav>
	</aside>

	<div class="content-area">
		{@render children()}
	</div>
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;

	.app {
		display: grid;
		grid-template-columns: 220px 1fr;
		grid-template-rows: 4rem 1fr;
		min-height: 100vh;
		background-color: var(--color-bg);

		@include mobile {
			grid-template-columns: 1fr;
		}
	}

	.top-bar {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		gap: 1.2rem;
		padding: 0 2rem;
		background: linear-gradient(
			to bottom,
			#f5eced 0%,
			#e8dce0 100%
		);
		border-bottom: 1px solid var(--color-border);
		box-shadow: var(--shadow-card);
		position: sticky;
		top: 0;
		z-index: 10;

		.logo-img {
			height: 2.8rem;
			width: auto;
		}
	}

	.user-area {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 1.2rem;
	}

	.user-name {
		font-size: 1.3rem;
		font-weight: 500;
		color: var(--color-text);
	}

	.sign-out {
		padding: 0.4rem 1rem;
		font-size: 1.2rem;
		font-weight: 500;
		color: var(--color-text);
		background: rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(0, 0, 0, 0.15);
		border-radius: 3px;
		cursor: pointer;

		&:hover {
			background: rgba(0, 0, 0, 0.14);
		}
	}

	.menu-toggle {
		display: none;
		background: none;
		border: none;
		font-size: 2rem;
		color: var(--color-text);
		cursor: pointer;

		@include mobile {
			display: block;
		}
	}

	.backdrop {
		display: none;

		@include mobile {
			display: block;
			position: fixed;
			inset: 0;
			top: 4rem;
			background: var(--color-backdrop);
			z-index: 15;
			border: none;
		}
	}

	.sidebar-subjects {
		background: linear-gradient(to bottom, var(--color-bg-light) 0%, var(--color-bg) 100%);
		border-right: 1px solid var(--color-border);
		height: calc(100vh - 4rem);
		position: sticky;
		top: 4rem;
		overflow-y: auto;
		padding-top: 0.8rem;

		nav {
			display: flex;
			flex-direction: column;

			a {
				padding: 0.8rem 1.6rem;
				color: var(--color-text);
				text-decoration: none;
				font-size: 1.4rem;
				font-weight: 400;
				transition: background 0.2s ease;
				border-left: 3px solid transparent;
				text-transform: capitalize;

				&:hover {
					background: var(--color-hover-medium);
				}

				&.active {
					background: var(--color-active);
					border-left-color: var(--color-text);
					font-weight: 600;
					@include card-shine;
				}
			}
		}

		@include mobile {
			position: fixed;
			left: 0;
			top: 4rem;
			width: 220px;
			z-index: 20;
			transform: translateX(-100%);
			transition: transform 0.2s ease;

			&.open {
				transform: translateX(0);
			}
		}
	}

	.content-area {
		min-height: calc(100vh - 4rem);
	}
</style>
