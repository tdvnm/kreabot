<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores'; // <-- import the page store

	$: headerText = (() => {
		const segments = $page.url.pathname.replace(/^\/+/, '').split('/');
		return segments.join('/') || 'heading';
	})();
</script>

<div class="layout">
	<Header heading="{headerText}/" />
	<slot />
	<nav>
		<button on:click={() => goto('/fac')}>faculty</button>
		<button on:click={() => goto('/crs')}>courses</button>
		<button on:click={() => goto('/hb')}>handbook</button>
		<button on:click={() => goto('/set')}>settings</button>
	</nav>
</div>

<style lang="scss">
	.layout {
		min-height: 100vh;
		max-width: 580px;
		margin: 0 auto;
		font-size: 1.6rem;
		background-color: var(--main__bg);
		position: relative;
		border: #ccc 1px solid;

		nav {
			position: fixed;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 100vw;
			max-width: 580px;
			display: flex;
			justify-content: space-around;
			background-color: #ffffff;
			padding: 10px 0;
			border-top: 1px solid #ccc;
			z-index: 100;
		}
	}
</style>
