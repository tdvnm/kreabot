<script lang="ts">
	export let heading: string = 'mathematics';
	export let collapsible: boolean = true;
	export let variant: 'default' | 'green' = 'default';
	let isContentVisible: boolean = true;

	// Unique key per heading for localStorage
	const storageKey = `container-visible-${heading.replace(/\s+/g, '_').toLowerCase()}`;

	import { onMount } from 'svelte';
	onMount(() => {
		const stored = localStorage.getItem(storageKey);
		if (stored !== null) {
			isContentVisible = stored === 'true';
		}
	});

	function toggleContent() {
		if (collapsible) {
			isContentVisible = !isContentVisible;
			localStorage.setItem(storageKey, String(isContentVisible));
		}
	}
</script>

<div class="container {variant}">
	<div class="container__header" on:click={toggleContent}>
		<div class="heading">
			{#if $$slots.icon}
				<span class="icon-slot"><slot name="icon" /></span>
			{/if}
			<h1>{heading}</h1>
		</div>
		{#if collapsible}
			<button class="toggle-button" tabindex="-1" aria-label="Toggle section">
				{isContentVisible ? '-' : '+'}
			</button>
		{/if}
	</div>
	{#if isContentVisible || !collapsible}
		<div class="container__content">
			<slot />
		</div>
	{/if}
</div>

<style lang="scss">
	.container {
		width: 100%;
		border: var(--main__border);
		border-radius: 4px;
		margin-top: 1rem;

		.container__header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0.5rem 1rem;
			background: var(--peach__grad);
			border-radius: 4px 4px 0 0;

			.heading {
				display: flex;
				align-items: center;
				gap: 1rem;

				.icon-slot {
					display: flex;
					align-items: center;
					margin-right: 0;
				}

				h1 {
					color: var(--main__text);
					font-size: 1.6rem;
					font-weight: 500;
					margin: 0;
				}
			}

			.toggle-button {
				background: linear-gradient(0deg, #5db192bb 1%, #7fbeb2 55%, #d2feff);
				border: #162922 1px solid;
				border-radius: 1px;
				font-size: 1rem;
				color: #284138;
				width: 1.5rem;
			}
		}

		.container__content {
			padding: 0rem;
			background-color: #ffffff;
			border-radius: 0 0 4px 4px;
		}
	}

	.card-image {
		height: 5.2rem;
		width: 5.2rem;
		background-size: cover;
		background-position: center;
		border-radius: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: bold;
	}
</style>
