<script lang="ts">
	import type { ProgrammeFaq } from '$lib/types';

	let { data }: { data: { faq: ProgrammeFaq[]; subjectName: string } } = $props();

	let expanded = $state<Record<number, boolean>>({ 0: true });

	function toggle(i: number) {
		expanded[i] = !expanded[i];
	}
</script>

<div class="page-header">
	<h1>programme faq</h1>
</div>

<div class="faq-page">
	{#each data.faq as item, i}
		<div class="faq-card" class:open={expanded[i]}>
			<button class="faq-toggle" onclick={() => toggle(i)}>
				<span class="arrow">{expanded[i] ? '−' : '+'}</span>
				<span class="question">{item.q}</span>
			</button>

			{#if expanded[i]}
				<div class="answer">
					{#each item.a.split('\n') as line}
						{#if line.trim() === ''}
							<br />
						{:else}
							<p>{line}</p>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;

	.faq-page {
		padding: 2.4rem;
		max-width: 800px;

		@include mobile {
			padding: 1.6rem;
		}
	}

	.page-header {
		@include card-header;

		h1 {
			font-size: 1.8rem;
			font-weight: 600;
			color: var(--color-text);
		}
	}

	.faq-card {
		@include card;
		padding: 0;
		overflow: hidden;
		margin-bottom: 0.8rem;

		&.open {
			border-color: var(--color-border-light);
			@include card-shine-hover;
		}
	}

	.faq-toggle {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		width: 100%;
		padding: 1.2rem 1.6rem;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s;

		&:hover {
			background: var(--color-hover);
		}

		.arrow {
			font-size: 1.2rem;
			color: var(--color-text-muted);
			width: 1.2rem;
			flex-shrink: 0;
			margin-top: 0.2rem;
		}

		.question {
			font-size: 1.5rem;
			font-weight: 600;
			color: var(--color-text);
		}
	}

	.answer {
		padding: 0 1.6rem 1.6rem 3.8rem;
		border-top: 1px solid var(--color-border-divider);
		padding-top: 1.2rem;

		p {
			font-size: 1.4rem;
			color: var(--color-text);
			line-height: 1.6;
			margin: 0;
		}

		br {
			display: block;
			content: '';
			margin-top: 0.6rem;
		}
	}
</style>
