<script lang="ts">
	import { goto } from '$app/navigation';

	export let code: string;
	export let title: string;
	export let year_trim: string;
	export let crosslisted: string[] = [];
</script>

<section class="course-card" on:click={() => goto(`/crs/${year_trim}/${code}`)}>
	<h4>{code}</h4>
	{#if crosslisted && crosslisted.length > 0}
		<p class="crosslisted">
			crosslisted with {crosslisted.join(', ')}
		</p>
	{/if}
	<h2>{title}</h2>
	
</section>

<style>
	.course-card {
		padding: 1.2rem 1rem;
		border-top: var(--main__border);
		h2 {
			font-size: 1.6rem;
			color: var(--main__text);
			font-weight: 500;
		}
		h4 {
			font-size: 1.4rem;
			color: var(--light__text);
			font-weight: 400;
		}
		.crosslisted {
			font-size: 1.1rem;
			color: #888;
			margin-bottom: 4px;
		}
	}
</style>