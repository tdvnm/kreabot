<script lang="ts">
	import Mail from '$lib/components/icons/Mail.svelte';
	import Map from '$lib/components/icons/Map.svelte';
	import Clock from '$lib/components/icons/Clock.svelte';
	import Script from '$lib/components/icons/Script.svelte';
	import Edit from '$lib/components/icons/Edit.svelte';
	import Star from '$lib/components/icons/Star.svelte';

	export let name: string = 'professor name';
	export let image_url: string;
	export let position: string = 'assistant Professor';
	export let email: string = 'firstname.lastname@krea.edu.in';
	export let location: string = 'room number';
	export let office_hours: string = 'office hours';
	export let url: string = '/fac/' + name.replace(/\s+/g, '_').toLowerCase();
	export const subject: string = 'subject name';

	export let expanded: boolean = false;
	export let onExpand: () => void = () => {};

	const getInitials = (name: string): string => {
		return name
			.split(' ')
			.map((word) => word[0]?.toUpperCase())
			.join('')
			.slice(0, 2);
	};

	$: initials = getInitials(name);

	let is_expanded = false;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<section class:is-expanded={expanded} on:click={onExpand}>
	<!-- image -->
	{#if image_url}
		<div class="card__image" style="background-image: url({image_url});"></div>
	{:else}
		<div class="card__image fallback">
			<span>{initials}</span>
		</div>
	{/if}

	<!-- main stuff -->
	<div class="card">
		<main>
			<h2>{name}</h2>
			<h4>{position}</h4>
		</main>

		<!-- mail, location, office hours -->
		<div class="details">
			<p class="detail__child">
				<Mail />
				<span>{email}</span>
			</p>
			<p class="detail__child">
				<Map />
				<span>{location}</span>
			</p>
			<p class="detail__child">
				<Clock />
				<span>{office_hours}</span>
			</p>

			<!-- buttons -->
			<div class="buttons">
				<a href="{url}/feedback" class="info">
					<span>
						<Star /> feedback
					</span>
				</a>
				<a href={url} class="info">
					<span>
						<Script /> more info
					</span>
				</a>
				<a href="{url}/update" class="edit">
					<span>
						<Edit /> edit
					</span>
				</a>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	section {
		padding: 1rem;
		background-color: var(--container__bg);
		border-top: var(--main__border);
		border-radius: 0 0 4px 4px;

		display: grid;
		grid-template-columns: 5.6rem 2fr;
		gap: 1.4rem;

		transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1.5);

		&.is-expanded {
			background-color: var(--container__bg);
			background: var(--container__grad);
		}

		.card__image {
			height: 5.6rem;
			background-size: cover;
			background-position: center;

			border-radius: 2px;
			border: var(--main__border);

			display: flex;
			align-items: center;
			justify-content: center;

			font-size: 2rem;
			font-weight: bold;
			text-transform: uppercase;

			&.fallback {
				background: rgb(216, 193, 202);
				border: var(--main__border);
				span {
					color: rgba(110, 63, 79, 0.486);
				}
			}
		}

		main {
			h2 {
				font-size: 1.8rem;
				color: var(--main__text);
				font-weight: 500;
			}
			h4 {
				font-size: 1.4rem;
				color: var(--light__text);
				font-weight: 400;
			}
		}

		// detail
		.details {
			margin-top: 1rem;
			font-size: 1.2rem;
			max-height: 0;
			overflow: hidden;
			transition:
				max-height 0.3s ease,
				opacity 0.3s ease;
			opacity: 0;

			.detail__child {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin-bottom: 0.4rem;

				color: var(--main__text);
			}

			.buttons {
				display: flex;
				gap: 0.8rem;
				margin-top: 1.2rem;

				a {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 0.4rem;

					padding: 0.3rem 0.6rem;

					border: var(--main__border);
					border-radius: 2px;

					font-size: 1.2rem;
					font-weight: 500;
					text-decoration: none;
					color: var(--main__text);

					width: auto;
					white-space: nowrap;
					margin-top: 0;

					&.info {
						background: linear-gradient(to top, #fbd0c3 0%, #fff4f2 80%);
						box-shadow: inset 0px 1px 1px rgba(231, 148, 148, 0.1);
					}

					&.edit {
						opacity: 0.8;
					}

					span {
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 0.4rem;

						width: 100%;
						height: 100%;
						text-align: center;
					}
				}
			}
		}

		&.is-expanded .details {
			max-height: 200px;
			opacity: 1;
		}
	}
</style>
