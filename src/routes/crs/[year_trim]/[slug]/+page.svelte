<script lang="ts">
    export let data = { course: { title: '', description: '', credits: '', year_trim: '', code: '' } };

    // Get crosslisted codes (excluding the main code)
    let crosslistedCodes: string[] = [];
    if (data.course.code) {
        const codes = data.course.code.split('|').map(s => s.trim());
        crosslistedCodes = codes.slice(1).map(code => code.slice(0, 7));
    }

    // Description logic
    let showFullDescription = false;
    const description = data.course.description || 'No description available.';
    const shortDescription = description.length > 300 ? description.slice(0, 300) : description;
    const hasMore = description.length > 300;
</script>

<main>
    <h1>{data.course.title}</h1>
	<hr />
    <p><strong>credits: </strong> {data.course.credits}</p>
    {#if crosslistedCodes.length}
        <p>
            <strong>crosslisted with: </strong>
            {crosslistedCodes.join(', ')}
        </p>
    {/if}
    <p><strong>faculty</strong>: {data.course.faculty || 'N/A'}</p>
	<p><strong>years: </strong> {data.course.elig_years || 'N/A'}</p>
    <div class="description">
        {#if !showFullDescription && hasMore}
            <span>{shortDescription}...</span>
            <button class="more-btn" on:click={() => showFullDescription = true}>more</button>
        {:else if hasMore}
            <span>{description}</span>
            <button class="more-btn" on:click={() => showFullDescription = false}>less</button>
        {:else}
            <span>{description}</span>
        {/if}
    </div>
</main>

<style lang="scss">
	main {
		padding: 1rem;
		background: linear-gradient(to bottom, #ffffff 0%, var(--main__bg) 100%);
		min-height: 90vh;
		h1 {
			font-size: 2rem;
		}
		hr {
			margin: 1rem 0;
			border: none;
			border-top: var(--light__border);
		}
		p {
			font-size: 1.4rem;
			margin: 0.5rem 0;
		}
		.description {
			font-size: 1.4rem;
			margin-top: 0.5rem;
			display: inline; // or inline-block
			strong {
				font-weight: 600;
			}
			span {
				display: inline;
				max-width: 100%;
				overflow-wrap: break-word;
			}
			.more-btn {
				background: none;
				border: none;
				color: #7c4b69;
				font-weight: 600;
				cursor: pointer;
				margin: 0;
				padding: 0 0.2rem;
				font-size: 1em;
			}
		}
	}
</style>
