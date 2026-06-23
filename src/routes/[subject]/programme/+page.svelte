<script lang="ts">
	import type { Programme } from '$lib/types';

	let { data }: { data: { requirements: Programme[]; subjectName: string } } = $props();

	let expanded = $state<Record<string, boolean>>({});

	function toggle(key: string) {
		expanded[key] = !expanded[key];
	}

	function is4Year(prog: Programme) {
		return prog.name.includes('4 Year') || prog.name.includes('(4 Year)');
	}

	function is3Year(prog: Programme) {
		return prog.name.includes('3 Year') || prog.name.includes('(3 Year)');
	}

	let fourYear = $derived(data.requirements.filter(is4Year));
	let threeYear = $derived(data.requirements.filter(is3Year));
	let shared = $derived(data.requirements.filter((p) => !is4Year(p) && !is3Year(p)));
</script>

{#snippet progCard(prog: Programme, key: string)}
	<div class="programme-card" class:open={expanded[key]}>
		<button class="prog-toggle" onclick={() => toggle(key)}>
			<span class="arrow">{expanded[key] ? '−' : '+'}</span>
			<span class="prog-name">{prog.name}</span>
			{#if prog.total_credits}
				<span class="credits">{prog.total_credits} credits</span>
			{/if}
		</button>

		{#if expanded[key]}
			<div class="prog-detail">
				<div class="req-section">
					<h3>required courses</h3>
					<div class="course-tags">
						{#each prog.required as code}
							<span class="tag required">{code}</span>
						{/each}
					</div>
				</div>

				{#if prog.elective_pool?.length}
					<div class="req-section">
						<h3>elective courses (pick {prog.elective_pick})</h3>
						<div class="course-tags">
							{#each prog.elective_pool as code}
								<span class="tag elective">{code}</span>
							{/each}
						</div>
					</div>
				{/if}

				{#if prog.additional}
					<p class="additional">{prog.additional}</p>
				{/if}

				{#if prog.notes}
					<p class="notes">{prog.notes}</p>
				{/if}

				{#if prog.pathways?.length}
					{#each prog.pathways as pathway}
						<div class="pathway">
							<h3>{pathway.label}</h3>
							<div class="grid-wrapper">
								<table class="pathway-grid">
									<thead>
										<tr>
											<th></th>
											<th>Term 1</th>
											<th>Term 2</th>
											<th>Term 3</th>
										</tr>
									</thead>
									<tbody>
										{#each pathway.grid as row}
											<tr>
												<td class="year-cell">Year {row.year}</td>
												<td>
													{#each row.t1 as code}
														<span class="grid-course" class:req={prog.required.includes(code)} class:elec={prog.elective_pool?.includes(code)}>{code}</span>
													{/each}
												</td>
												<td>
													{#each row.t2 as code}
														<span class="grid-course" class:req={prog.required.includes(code)} class:elec={prog.elective_pool?.includes(code)}>{code}</span>
													{/each}
												</td>
												<td>
													{#each row.t3 as code}
														<span class="grid-course" class:req={prog.required.includes(code)} class:elec={prog.elective_pool?.includes(code)}>{code}</span>
													{/each}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{/each}

					<div class="legend">
						<span class="legend-item"><span class="swatch req"></span> required</span>
						<span class="legend-item"><span class="swatch elec"></span> elective</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/snippet}

<div class="page-header">
	<h1>programme</h1>
</div>

<div class="requirements-page">
	{#if shared.length}
		<div class="shared-section">
			{#each shared as prog}
				{@render progCard(prog, `shared-${prog.name}`)}
			{/each}
		</div>
	{/if}

	<div class="columns">
		<div class="column">
			<h2 class="column-heading">4 Year</h2>
			{#each fourYear as prog}
				{@render progCard(prog, `4y-${prog.name}`)}
			{/each}
		</div>
		<div class="column">
			<h2 class="column-heading">3 Year</h2>
			{#each threeYear as prog}
				{@render progCard(prog, `3y-${prog.name}`)}
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;

	.requirements-page {
		padding: 2.4rem;

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

	.shared-section {
		max-width: 900px;
		margin-bottom: 2rem;
	}

	.columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;

		@include mobile {
			grid-template-columns: 1fr;
		}
	}

	.column-heading {
		@include section-label;
		font-size: 1.6rem;
		margin-bottom: 1rem;
	}

	.programme-card {
		@include card;
		padding: 0;
		overflow: hidden;
		margin-bottom: 0.8rem;

		&.open {
			border-color: var(--color-border-light);
			@include card-shine-hover;
		}
	}

	.prog-toggle {
		display: flex;
		align-items: center;
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
		}

		.prog-name {
			font-size: 1.5rem;
			font-weight: 600;
			color: var(--color-text);
		}

		.credits {
			font-size: 1.2rem;
			color: var(--color-text-muted);
			margin-left: auto;
		}
	}

	.prog-detail {
		padding: 1.2rem 1.6rem 1.6rem;
		border-top: 1px solid var(--color-border-divider);
	}

	.req-section {
		margin-bottom: 1.2rem;

		h3 {
			@include section-label;
			margin-bottom: 0.6rem;
		}
	}

	.course-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.tag {
		padding: 0.3rem 0.8rem;
		border-radius: 2px;
		font-size: 1.2rem;
		font-weight: 600;
		border: 1px solid var(--color-border-card);

		&.required {
			background: rgba(100, 140, 200, 0.15);
			color: var(--color-text);
		}

		&.elective {
			background: rgba(100, 180, 120, 0.15);
			color: var(--color-text);
		}
	}

	.additional,
	.notes {
		font-size: 1.3rem;
		color: var(--color-text-muted);
		margin-bottom: 0.8rem;
	}

	.pathway {
		margin-top: 1.6rem;

		h3 {
			@include section-label;
			margin-bottom: 0.8rem;
		}
	}

	.grid-wrapper {
		overflow-x: auto;
	}

	.pathway-grid {
		width: 100%;
		border-collapse: collapse;
		font-size: 1.3rem;

		th,
		td {
			padding: 0.6rem 0.8rem;
			border: 1px solid var(--color-border-card);
			vertical-align: top;
		}

		th {
			background: var(--color-hover);
			font-weight: 600;
			color: var(--color-text);
			text-align: left;
		}

		.year-cell {
			font-weight: 600;
			white-space: nowrap;
			background: var(--color-hover);
		}
	}

	.grid-course {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		margin: 0.2rem;
		border-radius: 2px;
		font-size: 1.2rem;
		font-weight: 500;

		&.req {
			background: rgba(100, 140, 200, 0.2);
		}

		&.elec {
			background: rgba(100, 180, 120, 0.2);
		}
	}

	.legend {
		display: flex;
		gap: 1.6rem;
		margin-top: 1.2rem;
		font-size: 1.2rem;
		color: var(--color-text-muted);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 2px;

		&.req {
			background: rgba(100, 140, 200, 0.3);
		}

		&.elec {
			background: rgba(100, 180, 120, 0.3);
		}
	}
</style>
