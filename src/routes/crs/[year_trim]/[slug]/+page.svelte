<script lang="ts">
	export let data = { course: { title: '', description: '', credits: '', year_trim: '', code: '' } };
</script>

<main>
	<h1>{data.course.title}</h1>
    <p><strong>credits: </strong> {data.course.credits}</p>
	<p>{data.course.description}</p>
	<p>{data.course.year_trim}</p>
	<p>{data.course.code}</p>
</main>

<style lang="scss">
	main {
		padding: 1rem;
		h1 {
			font-size: 2rem;
		}
		p {
			font-size: 1.4rem;
			margin: 0.5rem 0;
		}
	}
</style>
