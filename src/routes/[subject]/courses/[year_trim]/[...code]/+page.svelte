<script lang="ts">
	import { formatYearTrim } from '$lib/utils';
	import type { Course } from '$lib/types';

	let { data }: { data: { course: Course } } = $props();
	let course = $derived(data.course);
	let showFull = $state(false);

	$effect(() => {
		data.course;
		showFull = false;
		activeTab = 'info';
	});

	let desc = $derived(course.description || '');
	let short = $derived(desc.length > 400 ? desc.slice(0, 400) : desc);
	let hasMore = $derived(desc.length > 400);

	let activeTab = $state<'info' | 'syllabus' | 'papers'>('info');

	const TABS = [
		{ key: 'info', label: 'info' },
		{ key: 'syllabus', label: 'syllabus & rubric' },
		{ key: 'papers', label: 'past papers' }
	] as const;

	// Mock rubric data
	const mockRubric = [
		{ component: 'End Term', weight: 30 },
		{ component: 'Mid Term', weight: 20 },
		{ component: 'Quiz', weight: 15 },
		{ component: 'Assignments', weight: 20 },
		{ component: 'Participation', weight: 15 }
	];

	// Mock resources
	const mockSyllabus = [
		{ id: '1', title: 'Course Syllabus 2025-26', uploadedBy: 'Anon Student', date: '2025-08-15' }
	];
	const mockPapers = [
		{ id: '1', title: 'Mid Term 2024-25 T1', uploadedBy: 'Anon Student', date: '2025-01-10' },
		{ id: '2', title: 'End Term 2024-25 T1', uploadedBy: 'Anon Student', date: '2025-04-20' }
	];
</script>

<div class="course-header">
	<span class="badge">{course.code}</span>
	<h1>{course.title}</h1>
</div>

<div class="tabs">
	{#each TABS as tab}
		<button
			class="tab"
			class:active={activeTab === tab.key}
			onclick={() => (activeTab = tab.key)}
		>
			{tab.label}
		</button>
	{/each}
</div>

<div class="course-detail">
	{#if activeTab === 'info'}
		<section class="card">
			<h2>course information</h2>
			<div class="info-grid">
				{#if course.faculty}
					<div class="row">
						<span class="label">faculty</span><span>{course.faculty}</span>
					</div>
				{/if}
				<div class="row">
					<span class="label">eligible years</span><span>{course.elig_years}</span>
				</div>
				<div class="row">
					<span class="label">type</span><span>{course.type}</span>
				</div>
				{#if course.required_for}
					<div class="row">
						<span class="label">required for</span><span>{course.required_for}</span>
					</div>
				{/if}
				{#if course.prereqs}
					<div class="row">
						<span class="label">prerequisites</span><span>{course.prereqs}</span>
					</div>
				{/if}
			</div>
		</section>

		{#if desc}
			<section class="card">
				<h2>description</h2>
				<p class="desc">
					{#if !showFull && hasMore}
						{short}...
						<button class="more" onclick={() => (showFull = true)}>more</button>
					{:else if hasMore}
						{desc}
						<button class="more" onclick={() => (showFull = false)}>less</button>
					{:else}
						{desc}
					{/if}
				</p>
			</section>
		{/if}

	{:else if activeTab === 'syllabus'}
		<section class="card">
			<div class="section-head">
				<h2>syllabus</h2>
				<button class="upload-btn">+ upload</button>
			</div>
			{#if mockSyllabus.length > 0}
				<div class="resource-list">
					{#each mockSyllabus as item}
						<div class="resource-item">
							<div class="resource-icon">PDF</div>
							<div class="resource-info">
								<span class="resource-title">{item.title}</span>
								<span class="resource-meta">uploaded by {item.uploadedBy} on {item.date}</span>
							</div>
							<button class="download-btn">view</button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="empty">no syllabus uploaded yet</p>
			{/if}
		</section>

		<section class="card">
			<div class="section-head">
				<h2>course structure</h2>
				<button class="upload-btn">+ upload</button>
			</div>
			<p class="empty">no course structure uploaded yet</p>
		</section>

		<section class="card">
			<div class="section-head">
				<h2>evaluation rubric</h2>
				<button class="upload-btn">+ edit</button>
			</div>
			{#if mockRubric.length > 0}
				<div class="rubric-table">
					<div class="rubric-header">
						<span>component</span>
						<span>weight</span>
					</div>
					{#each mockRubric as item}
						<div class="rubric-row">
							<span>{item.component}</span>
							<span class="weight">
								<span class="bar" style="width: {item.weight}%"></span>
								{item.weight}%
							</span>
						</div>
					{/each}
					<div class="rubric-row total">
						<span>total</span>
						<span class="weight">{mockRubric.reduce((s, r) => s + r.weight, 0)}%</span>
					</div>
				</div>
			{:else}
				<p class="empty">no rubric added yet</p>
			{/if}
		</section>

	{:else if activeTab === 'papers'}
		<section class="card">
			<div class="section-head">
				<h2>past question papers</h2>
				<button class="upload-btn">+ upload</button>
			</div>
			{#if mockPapers.length > 0}
				<div class="resource-list">
					{#each mockPapers as item}
						<div class="resource-item">
							<div class="resource-icon">PDF</div>
							<div class="resource-info">
								<span class="resource-title">{item.title}</span>
								<span class="resource-meta">uploaded by {item.uploadedBy} on {item.date}</span>
							</div>
							<button class="download-btn">view</button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="empty">no past papers uploaded yet</p>
			{/if}
		</section>

	{/if}
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;

	.course-detail {
		padding: 2.4rem;
		max-width: 800px;

		@include mobile {
			padding: 1.6rem;
		}
	}

	.course-header {
		@include card-header;
		gap: 1rem;
		border-bottom: 1px solid var(--color-border);

		.badge {
			padding: 0.2rem 0.6rem;
			background: var(--gradient-peach);
			border: 1px solid var(--color-border);
			border-radius: 2px;
			font-size: 1.1rem;
			font-weight: 600;
			color: var(--color-text);
		}

		h1 {
			font-size: 1.8rem;
			font-weight: 600;
			color: var(--color-text);
		}
	}

	.tabs {
		display: flex;
		gap: 0;
		border-bottom: 1px solid var(--color-border-light);
		padding: 0 2.4rem;
		background: linear-gradient(to bottom, var(--color-bg-card-start), var(--color-bg-card-end));

		@include mobile {
			padding: 0 1rem;
			overflow-x: auto;
		}
	}

	.tab {
		padding: 1rem 1.6rem;
		font-size: 1.3rem;
		font-weight: 500;
		color: var(--color-text-muted);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.15s;

		&:hover {
			color: var(--color-text);
			background: var(--color-hover);
		}

		&.active {
			color: var(--color-text);
			font-weight: 600;
			border-bottom-color: var(--color-accent);
		}
	}

	.card {
		@include card;
		margin-bottom: 1.6rem;

		h2 {
			font-size: 1.4rem;
			font-weight: 600;
			color: var(--color-text-muted);
			text-transform: uppercase;
			letter-spacing: 0.05em;
			margin-bottom: 1rem;
		}
	}

	.section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;

		h2 {
			margin-bottom: 0;
		}
	}

	.upload-btn {
		padding: 0.4rem 1rem;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--color-accent);
		background: var(--color-hover);
		border: 1px solid var(--color-border-light);
		border-radius: 3px;
		cursor: pointer;
		transition: all 0.15s;

		&:hover {
			background: var(--color-active);
		}
	}

	.info-grid {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.row {
		@include info-row;
		font-size: 1.6rem;

		.label {
			font-weight: 600;
		}

		@include mobile {
			grid-template-columns: 1fr;
			gap: 0.2rem;
		}
	}

	.desc {
		font-size: 1.6rem;
		color: var(--color-text);
		line-height: 1.6;
	}

	.more {
		background: none;
		border: none;
		color: var(--color-accent);
		font-weight: 600;
		cursor: pointer;
		padding: 0;
		font-size: 1.3rem;
	}

	.empty {
		@include empty-text;
	}

	// Resource list
	.resource-list {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.resource-item {
		display: flex;
		align-items: center;
		gap: 1.2rem;
		padding: 1rem 1.2rem;
		background: var(--color-hover);
		border: 1px solid var(--color-border-divider);
		border-radius: 3px;
		transition: background 0.15s;

		&:hover {
			background: var(--color-active);
		}
	}

	.resource-icon {
		width: 3.6rem;
		height: 3.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gradient-peach);
		border: 1px solid var(--color-border);
		border-radius: 3px;
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text);
		flex-shrink: 0;
	}

	.resource-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
		flex: 1;
	}

	.resource-title {
		font-size: 1.4rem;
		font-weight: 500;
		color: var(--color-text);
	}

	.resource-meta {
		font-size: 1.1rem;
		color: var(--color-text-muted);
	}

	.download-btn {
		padding: 0.4rem 1rem;
		font-size: 1.2rem;
		font-weight: 500;
		color: var(--color-text);
		background: var(--color-bg-light);
		border: 1px solid var(--color-border-card);
		border-radius: 3px;
		cursor: pointer;
		flex-shrink: 0;

		&:hover {
			background: var(--color-active);
		}
	}

	// Rubric
	.rubric-table {
		display: flex;
		flex-direction: column;
	}

	.rubric-header {
		display: grid;
		grid-template-columns: 1fr 16rem;
		padding: 0.6rem 1rem;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid var(--color-border-divider);

		@include mobile {
			grid-template-columns: 1fr 10rem;
		}
	}

	.rubric-row {
		display: grid;
		grid-template-columns: 1fr 16rem;
		padding: 0.8rem 1rem;
		font-size: 1.4rem;
		color: var(--color-text);
		border-bottom: 1px solid var(--color-border-divider);

		&.total {
			font-weight: 700;
			border-bottom: none;
			border-top: 1px dotted var(--color-border-light);
		}

		@include mobile {
			grid-template-columns: 1fr 10rem;
		}
	}

	.weight {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		font-weight: 600;
	}

	.bar {
		height: 0.6rem;
		background: var(--gradient-peach);
		border: 1px solid var(--color-border);
		border-radius: 2px;
		display: inline-block;
	}
</style>
