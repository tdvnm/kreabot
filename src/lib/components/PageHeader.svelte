<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="page-header">
	{@render children()}
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;

	.page-header {
		@include card-header;
		border-bottom: 1px solid var(--color-border);
		gap: 1rem;
	}
</style>
