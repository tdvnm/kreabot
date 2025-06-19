<script lang="ts">
	import { goto } from "$app/navigation";

    export let code: string;
    export let title: string;
    export let year_trim: string;
</script>

<section class="course-card" on:click={() => goto(`/crs/${year_trim}/${code}`)}>
    <div><strong>{code}</strong> {title}</div>
</section>

<style>
.course-card {
    padding: 1rem;
    border-top: var(--main__border);
    color: var(--light__text);
}
.course-card strong {
    color: var(--main__text);
    font-weight: 500;
    margin-right: 0.5em;
}
</style>