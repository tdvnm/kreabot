<script lang="ts">
	import { goto } from '$app/navigation';

	export let code: string;
	export let title: string;
	export let year_trim: string;
</script>

<section class="course-card" on:click={() => goto(`/crs/${year_trim}/${code}`)}>
	<h4>{code}</h4>
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
            margin-bottom: 4px;
			color: var(--light__text);
			font-weight: 400;
		}
	}
</style>