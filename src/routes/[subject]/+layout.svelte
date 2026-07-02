<script lang="ts">
	import { page } from '$app/stores';
	import { formatYearTrim, ROLE_LABELS, ROLES, LAB_SUBJECTS } from '$lib/utils';
	import type { Professor, Course } from '$lib/types';
	import type { Snippet } from 'svelte';

	let { data, children }: {
		data: { subjectName: string; faculty: Professor[]; coursesByTrim: Record<string, Course[]> };
		children: Snippet;
	} = $props();

	let currentPath = $derived($page.url.pathname);
	let subjectSlug = $derived($page.params.subject);
	let sortedTrims = $derived(Object.keys(data.coursesByTrim).sort().reverse());
	let roleCounts = $derived(
		ROLES.reduce(
			(acc, role) => {
				acc[role] = data.faculty.filter((p) => p.role === role).length;
				return acc;
			},
			{} as Record<string, number>
		)
	);

	let hasLabs = $derived(LAB_SUBJECTS.includes(data.subjectName));
	let expandedTrims = $state<Record<string, boolean>>({});
	let navOpen = $state(false);

	$effect(() => {
		$page.url.pathname;
		navOpen = false;
	});

	$effect(() => {
		data.subjectName;
		expandedTrims = sortedTrims.length > 0 ? { [sortedTrims[0]]: true } : {};
	});

	function toggleTrim(yt: string) {
		if (expandedTrims[yt]) {
			expandedTrims = {};
		} else {
			expandedTrims = { [yt]: true };
		}
	}
</script>

<div class="subject-grid">
	<aside class="sidebar-nav" class:nav-open={navOpen}>
		<button class="sidebar-header" onclick={() => (navOpen = !navOpen)}>
			<h2>{data.subjectName}</h2>
			<span class="nav-arrow">{navOpen ? '−' : '+'}</span>
		</button>

		<div class="section">
			<h3>department</h3>
			<nav>
				{#each ROLES as role}
					{#if roleCounts[role] > 0}
						<a
							href="/{subjectSlug}/department/{role}"
							class:active={currentPath === `/${subjectSlug}/department/${role}`}
						>
							{ROLE_LABELS[role]}
							<span class="count">{roleCounts[role]}</span>
						</a>
					{/if}
				{/each}
			</nav>
		</div>

		<div class="section">
			<h3>courses</h3>
			<nav>
				{#each sortedTrims as yt}
					<button class="trim-toggle" class:expanded={expandedTrims[yt]} onclick={() => toggleTrim(yt)}>
						<span class="arrow">{expandedTrims[yt] ? '−' : '+'}</span>
						{formatYearTrim(yt)}
					</button>
					<div class="trim-courses" class:collapsed={!expandedTrims[yt]}>
						{#each data.coursesByTrim[yt] as course}
							<a
								href="/{subjectSlug}/courses/{yt}/{course.code}"
								class:active={currentPath ===
									`/${subjectSlug}/courses/${yt}/${course.code}`}
							>
								<span class="code">{course.code}</span>
								<span class="title">{course.title}</span>
							</a>
						{/each}
					</div>
				{/each}
				{#if sortedTrims.length === 0}
					<span class="empty">no courses listed</span>
				{/if}
			</nav>
		</div>
		<a
			class="section section-link"
			href="/{subjectSlug}/programme"
			class:active={currentPath === `/${subjectSlug}/programme`}
		>
			<h3>programme structure</h3>
		</a>
		<div class="section">
			<h3>research</h3>
		</div>

		{#if hasLabs}
			<div class="section">
				<h3>labs</h3>
			</div>
		{/if}

		<div class="section">
			<h3>forum</h3>
		</div>
	</aside>

	<main class="main-content">
		{@render children()}
	</main>
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;

	.subject-grid {
		display: grid;
		grid-template-columns: 280px 1fr;
		min-height: calc(100vh - 4rem);

		@include mobile {
			grid-template-columns: 1fr;
		}
	}

	.sidebar-nav {
		background: linear-gradient(
			to bottom,
			var(--color-bg-sidebar) 0%,
			var(--color-bg-sidebar-end) 100%
		);
		border-right: 1px solid var(--color-border-light);
		height: calc(100vh - 4rem);
		position: sticky;
		top: 4rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;

		@include mobile {
			position: static;
			height: auto;
			border-right: none;
			border-bottom: 1px solid var(--color-border-light);

			.sidebar-header {
				cursor: pointer;
			}

			.section {
				display: none;
			}

			&.nav-open .section {
				display: block;
			}
		}
	}

	.sidebar-header {
		padding: 1.6rem;
		height: 5.6rem;
		display: flex;
		align-items: center;
		background: linear-gradient(
			to bottom,
			var(--color-bg-header-start) 0%,
			var(--color-bg-header-end) 30%
		);
		box-shadow: var(--shadow-card);
		width: 100%;
		border: none;
		border-bottom: 1px solid var(--color-border);
		cursor: default;

		h2 {
			font-size: 1.8rem;
			font-weight: 600;
			color: var(--color-text);
			margin: 0;
			text-transform: capitalize;
		}
	}

	.nav-arrow {
		display: none;
		margin-left: auto;
		font-size: 1.2rem;
		color: var(--color-text-muted);

		@include mobile {
			display: block;
		}
	}

	.section {
		border-bottom: 1px solid var(--color-border-light);

		h3 {
			@include section-label;
			padding: 1.2rem 1.6rem;
		}

		nav {
			display: flex;
			flex-direction: column;
			padding-bottom: 0.8rem;

			> a {
				@include nav-link;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}

	.section-link {
		text-decoration: none;
		cursor: pointer;

		&:hover {
			background: var(--color-hover);
		}

		&.active h3 {
			color: var(--color-text);
			font-weight: 700;
		}
	}

	.count {
		font-size: 1.1rem;
		color: var(--color-text-muted);
		background: var(--color-subtle);
		padding: 0.1rem 0.5rem;
		border-radius: 8px;
	}

	.trim-toggle {
		display: flex;
		align-items: center;
		gap: 0.5.6rem;
		padding: 0.5rem 1.6rem;
		background: var(--color-trim-toggle);
		border: none;
		color: var(--color-text);
		font-size: 1.3rem;
		font-weight: 600;
		cursor: pointer;
		text-align: left;
		width: 100%;

		&:hover {
			background: var(--color-trim-toggle-hover);
		}

		&.expanded {
			background: rgba(150, 106, 120, 0.42);
		}

		.arrow {
			font-size: 1rem;
			width: 1.2rem;
		}
	}

	.trim-courses {
		&.collapsed {
			display: none;
		}

		display: flex;
		flex-direction: column;

		a {
			@include nav-link;
			padding-left: 3rem;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			gap: 0.1rem;
			overflow: hidden;
		}

		.code {
			font-size: 1.2rem;
			font-weight: 600;
			color: var(--color-text-muted);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 100%;
		}

		.title {
			font-size: 1.3rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 100%;
		}
	}

	.empty {
		@include empty-text;
		padding: 0.5rem 1.6rem;
	}

	.main-content {
		min-height: calc(100vh - 4rem);
		overflow-y: auto;
	}
</style>
