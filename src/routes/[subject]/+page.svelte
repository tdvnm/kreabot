<script lang="ts">
	import type { Professor, Course } from '$lib/types';
	import { ROLE_LABELS } from '$lib/utils';

	let { data }: {
		data: {
			subjectName: string;
			faculty: Professor[];
			coursesByTrim: Record<string, Course[]>;
		};
	} = $props();

	let query = $state('');
	let q = $derived(query.toLowerCase().trim());

	let allCourses = $derived(
		Object.entries(data.coursesByTrim).flatMap(([yt, courses]) =>
			courses.map((c) => ({ ...c, year_trim: yt }))
		)
	);

	let filteredCourses = $derived(
		q.length < 2
			? []
			: allCourses.filter(
					(c) =>
						c.title.toLowerCase().includes(q) ||
						c.code.toLowerCase().includes(q) ||
						(c.faculty && c.faculty.toLowerCase().includes(q))
				)
	);

	let filteredProfs = $derived(
		q.length < 2
			? []
			: data.faculty.filter(
					(p) =>
						p.name.toLowerCase().includes(q) ||
						p.position.toLowerCase().includes(q)
				)
	);

	let hasResults = $derived(filteredCourses.length > 0 || filteredProfs.length > 0);

	let subjectSlug = $derived(data.subjectName.toLowerCase().replace(/\s+/g, '-'));
</script>

<div class="search-page">
	<h2>{data.subjectName}</h2>
	<div class="search-box">
		<input
			type="text"
			placeholder="search courses, codes, or professors..."
			bind:value={query}
		/>
	</div>

	{#if q.length >= 2}
		{#if !hasResults}
			<p class="empty">no results for "{query}"</p>
		{/if}

		{#if filteredCourses.length > 0}
			<div class="results-section">
				<h3>courses</h3>
				<div class="results-list">
					{#each filteredCourses as course}
						<a href="/{subjectSlug}/courses/{course.year_trim}/{course.code}" class="result-item">
							<span class="result-code">{course.code}</span>
							<span class="result-title">{course.title}</span>
							{#if course.faculty}
								<span class="result-meta">{course.faculty}</span>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		{/if}

		{#if filteredProfs.length > 0}
			<div class="results-section">
				<h3>professors</h3>
				<div class="results-list">
					{#each filteredProfs as prof}
						<a href="/{subjectSlug}/department/{prof.role}" class="result-item">
							<span class="result-title">{prof.name}</span>
							<span class="result-meta">{ROLE_LABELS[prof.role] || prof.role}</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<p class="hint">type at least 2 characters to search</p>
	{/if}
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;

	.search-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 6rem 2rem 2rem;
		max-width: 600px;
		margin: 0 auto;

		h2 {
			font-size: 2.4rem;
			font-weight: 500;
			text-transform: capitalize;
			color: var(--color-text);
			margin-bottom: 2rem;
		}
	}

	.search-box {
		width: 100%;
		margin-bottom: 2.4rem;

		input {
			width: 100%;
			padding: 1rem 1.4rem;
			font-size: 1.4rem;
			color: var(--color-text);
			background: var(--color-hover);
			border: 1px solid var(--color-border-light);
			border-radius: 4px;
			outline: none;
			transition: border-color 0.15s;

			&::placeholder {
				color: var(--color-text-muted);
			}

			&:focus {
				border-color: var(--color-accent);
			}
		}
	}

	.hint {
		font-size: 1.3rem;
		color: var(--color-text-muted);
		font-style: italic;
	}

	.empty {
		@include empty-text;
	}

	.results-section {
		width: 100%;
		margin-bottom: 2rem;

		h3 {
			@include section-label;
			margin-bottom: 0.8rem;
		}
	}

	.results-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.2rem;
		background: var(--color-hover);
		border: 1px solid var(--color-border-divider);
		border-radius: 3px;
		text-decoration: none;
		color: var(--color-text);
		transition: background 0.15s;

		&:hover {
			background: var(--color-active);
		}
	}

	.result-code {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.result-title {
		font-size: 1.4rem;
		font-weight: 500;
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.result-meta {
		font-size: 1.2rem;
		color: var(--color-text-muted);
		flex-shrink: 0;
	}
</style>
