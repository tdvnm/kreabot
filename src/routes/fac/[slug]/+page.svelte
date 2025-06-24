<script lang="ts">
	import ProfHeaderCard from './ProfHeaderCard.svelte';
	import Container from '../Container.svelte';

	export let data: {
		professor: {
			name: string;
			email: string;
			location: string;
			office_hours: string;
			position: string;
			subject: string;
			image_url: string;
			education?: string[]; // optional, if present in DB
			courses?: string[]; // optional, if present in DB
			date_of_joining?: string;
		};
		courses: {
			title: string;
			code: string;
			year_trim: string;
			crosslisted?: string[];
		}[];
	};
	const professor = data.professor;
	const courses = data.courses || [];

	$: coursesByYear = courses.reduce(
		(acc, course) => {
			if (!acc[course.year_trim]) acc[course.year_trim] = [];
			acc[course.year_trim].push(course);
			return acc;
		},
		{} as Record<string, typeof courses>
	);
</script>

<main>
	<ProfHeaderCard
		image_url={professor.image_url}
		name={professor.name}
		position={professor.position}
		subject={professor.subject}
	/>

	<Container heading="contact information" collapsible={false}>
		<div class="profile-grid">
			<div class="detail-pair">
				<div class="label">Office Hours</div>
				<div class="value">{professor.office_hours}</div>
			</div>
			<div class="detail-pair">
				<div class="label">Contact</div>
				<div class="value">{professor.email}</div>
			</div>
			{#if professor.education}
				<div class="detail-pair">
					<div class="label">Education</div>
					<div class="value">
						<ul>
							{#each professor.education as edu}
								<li>{edu}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}
			{#if professor.date_of_joining}
				<div class="detail-pair">
					<div class="label">Date of Joining</div>
					<div class="value">{professor.date_of_joining}</div>
				</div>
			{/if}
			<div class="detail-pair">
				<div class="label">Room No</div>
				<div class="value">{professor.location}</div>
			</div>
		</div>
	</Container>

	<Container heading="courses taught" collapsible={false}>
		<div class="courses-list">
			{#if !courses.length}
				<p class="no-results">no courses available for this professor.</p>
			{:else}
				{#each Object.keys(coursesByYear).sort() as yearTrim}
					<h2>{yearTrim}</h2>
					<ul>
						{#each coursesByYear[yearTrim] as course}
							<li>
								<a href={`/crs/${course.year_trim}/${course.code.slice(0, 7)}`}>
									{course.code}
									{course.title}
								</a>
							</li>
						{/each}
					</ul>
				{/each}
			{/if}
		</div>
	</Container>
</main>

<style>
	main {
		padding: 12px 12px 5rem;
		min-height: 90vh;

		.profile-grid {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			color: var(--main__text);
			padding: 1rem;
			font-size: 1.4rem;

			.detail-pair {
				display: grid;
				grid-template-columns: 1fr 2fr;
				gap: 1.2rem;
				margin-bottom: 0.6rem;

				.label {
					font-weight: 600;
				}
				.value {
					white-space: pre-line;
					ul {
						list-style-type: none;
						li {
							margin-bottom: 0.5rem;
						}
					}
				}
			}
		}

		.courses-list {
			padding: 1rem;
			color: var(--main__text);
			font-size: 1.4rem;

			h2 {
				margin-top: 1rem;
				font-size: 1.4rem;
			}

			h2:first-child {
				margin-top: 0;
			}

			ul {
				list-style-type: none;
				padding-left: 0;

				li {
					margin-bottom: 0.2rem;
					a {
						color: var(--main__text);
						text-decoration: none;
					}
				}
			}
		}
	}
</style>
