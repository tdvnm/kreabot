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
	};
	const professor = data.professor;
</script>

<main>
	<ProfHeaderCard
		image_url={professor.image_url}
		name={professor.name}
		position={professor.position}
		subject={professor.subject}
	/>

	<Container heading="Contact Information">
		<div class="profile-grid">
			<div class="detail-pair">
				<div class="label">Office Hours</div>
				<div class="value">{professor.office_hours}</div>
			</div>
			{#if professor.courses}
				<div class="detail-pair">
					<div class="label">Teaching Courses</div>
					<div class="value">
						<ul>
							{#each professor.courses as course}
								<li>{course}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}
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
</main>

<style>
    main {
        padding: 1.2rem;
        min-height: 100vh;
        background: linear-gradient(to bottom, #fffcfc 0%, var(--main-bg) 30%);

        .profile-grid {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
            color: var(--main-text);
            padding: 1.2rem;
            font-size: 1.4rem;

            .detail-pair {
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: 1.2rem;
                margin-bottom: 0.6rem;

                .label {
                    font-weight: 600;
                    opacity: 0.75;
                }
                .value {
                    white-space: pre-line;
                    ul {
                        list-style-type: none;
                        li {
                            margin-bottom: 0.5rem  ;
                        }
                    }
                }
            }
        }
    }
</style>
