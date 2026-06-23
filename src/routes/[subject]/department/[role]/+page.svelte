<script lang="ts">
	import { page } from '$app/stores';
	import { formatYearTrim } from '$lib/utils';
	import type { Professor, Course } from '$lib/types';

	let { data }: {
		data: {
			professors: Professor[];
			profCourses: Record<string, Course[]>;
			roleLabel: string;
		};
	} = $props();

	let subjectSlug = $derived($page.params.subject);
	let expanded = $state<Record<string, boolean>>({});

	$effect(() => {
		$page.params.role;
		expanded = {};
	});

	function toggle(id: string) {
		expanded[id] = !expanded[id];
	}

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((w) => w[0]?.toUpperCase())
			.join('')
			.slice(0, 2);
	}

	function sortedYears(courses: Course[]): string[] {
		const yts = new Set(courses.map((c) => c.year_trim));
		return [...yts].sort().reverse().slice(0, 3);
	}
</script>

<div class="page-header">
	<h1>{data.roleLabel}</h1>
	<span class="count">{data.professors.length} member{data.professors.length !== 1 ? 's' : ''}</span>
</div>

<div class="department-page">
	{#if data.professors.length === 0}
		<p class="empty">no {data.roleLabel} listed for this department</p>
	{:else}
		<div class="prof-list">
			{#each data.professors as prof}
				<div class="prof-item" class:open={expanded[prof.id]}>
					<button class="prof-toggle" onclick={() => toggle(prof.id)}>
						<span class="arrow">{expanded[prof.id] ? '−' : '+'}</span>
						<span class="prof-name">{prof.name}</span>
						{#if prof.date_of_joining}
							<span class="prof-joined">joined {prof.date_of_joining}</span>
						{/if}
					</button>

					{#if expanded[prof.id]}
						<div class="prof-detail">
							<div class="col-left">
								<div class="prof-header">
									{#if prof.image_url}
										<img src={prof.image_url} alt={prof.name} />
									{:else}
										<div class="initials">{getInitials(prof.name)}</div>
									{/if}
									<div class="prof-meta">
										<h2>{prof.name}</h2>
										<p class="position">{prof.position}</p>
									</div>
								</div>

								<div class="info-section">
									<h3>contact</h3>
									<div class="info-grid">
										<div class="row">
											<span class="label">email</span><span>{prof.email}</span>
										</div>
										<div class="row">
											<span class="label">office hours</span
											><span>{prof.office_hours}</span>
										</div>
										<div class="row">
											<span class="label">room</span><span>{prof.location}</span>
										</div>
									</div>
								</div>

								{#if prof.education.length}
									<div class="info-section">
										<h3>education</h3>
										<ul>
											{#each prof.education as edu}
												<li>{edu}</li>
											{/each}
										</ul>
									</div>
								{/if}
							</div>

							<div class="col-right">
								{#if data.profCourses[prof.id]?.length}
									<h3>courses taught</h3>
									{#each sortedYears(data.profCourses[prof.id]) as yt}
										<p class="year-label">{formatYearTrim(yt)}</p>
										<ul>
											{#each data.profCourses[prof.id].filter((c) => c.year_trim === yt) as course}
												<li>
													<a
														href="/{subjectSlug}/courses/{course.year_trim}/{course.code}"
													>
														<span class="course-code">{course.code}</span>
														{course.title}
													</a>
												</li>
											{/each}
										</ul>
									{/each}
								{:else}
									<h3>courses taught</h3>
									<p class="no-courses">no courses listed</p>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;

	.department-page {
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
			text-transform: capitalize;
		}

		.count {
			font-size: 1.2rem;
			color: var(--color-text-muted);
			margin-left: 1rem;
		}
	}

	.empty {
		@include empty-text;
		font-size: 1.4rem;
		padding: 2rem;
	}

	.prof-list {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.prof-item {
		@include card;
		padding: 0;
		overflow: hidden;

		&.open {
			border-color: var(--color-border-light);
			@include card-shine-hover;
		}
	}

	.prof-toggle {
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

		.prof-name {
			font-size: 1.5rem;
			font-weight: 600;
			color: var(--color-text);
		}

		.prof-joined {
			font-size: 1.2rem;
			color: var(--color-text-muted);
			margin-left: auto;
		}
	}

	.prof-detail {
		display: grid;
		grid-template-columns: 1fr 30rem;
		border-top: 1px solid var(--color-border-divider);

		@include mobile {
			grid-template-columns: 1fr;
		}
	}

	.col-left {
		padding: 1.2rem 1.6rem 1.6rem;
	}

	.col-right {
		padding: 1.4rem 1.6rem 1.6rem;
		background: linear-gradient(
			to bottom,
			var(--color-bg-warm-start) 0%,
			var(--color-bg-warm-end) 100%
		);
		border-left: 1px solid var(--color-border-warm);
		min-width: 22rem;

		h3 {
			@include section-label;
			margin-bottom: 0.6rem;
		}

		@include mobile {
			border-left: none;
			border-top: 1px solid var(--color-border-warm);
			min-width: 0;
		}
	}

	.no-courses {
		@include empty-text;
	}

	.prof-header {
		display: flex;
		gap: 1.6rem;
		padding-bottom: 1.2rem;
		align-items: center;

		img {
			width: 7rem;
			height: auto;
			border-radius: 4px;
			border: 1px solid var(--color-border);
			object-fit: cover;
		}
	}

	.initials {
		width: 7rem;
		height: 7rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			135deg,
			var(--color-initials-bg-start),
			var(--color-initials-bg-end)
		);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		font-size: 2.4rem;
		font-weight: bold;
		color: var(--color-initials-text);
		flex-shrink: 0;
	}

	.prof-meta {
		h2 {
			font-size: 1.8rem;
			font-weight: 600;
			color: var(--color-text);
		}

		.position {
			font-size: 1.3rem;
			color: var(--color-text-muted);
			margin-top: 0.2rem;
		}
	}

	.info-section {
		margin-top: 1.2rem;

		h3 {
			@include section-label;
			margin-bottom: 0.6rem;
		}
	}

	.info-grid {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.row {
		@include info-row(12rem);
		font-size: 1.3rem;

		.label {
			font-weight: 600;
		}

		@include mobile {
			grid-template-columns: 1fr;
			gap: 0.2rem;
		}
	}

	ul {
		list-style: none;
		font-size: 1.3rem;
		color: var(--color-text);
	}

	li {
		margin-bottom: 0.3rem;

		a {
			color: var(--color-text);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.course-code {
		font-weight: 600;
		color: var(--color-text-muted);
		font-size: 1.1rem;
	}

	.year-label {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--color-text);
		margin-top: 0.8rem;
		margin-bottom: 0.3rem;
		text-transform: capitalize;

		&:first-of-type {
			margin-top: 0;
		}
	}
</style>
