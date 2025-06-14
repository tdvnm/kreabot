<script lang="ts">
    import Container from '../fac/Container.svelte';
    export let data: {
        byYear: Record<string, Course[]>;
        bySubject: Record<string, Course[]>;
    };

    type Course = {
        id: string;
        code: string;
        title: string;
        instructor: string[];
        credits: number;
        is_req: boolean;
        years: string;
        subject?: string;
    };

    let viewMode: 'year' | 'subject' = 'year';
</script>

<div class="sort-toggle">
    <label>
        <input type="radio" name="viewMode" value="year" bind:group={viewMode} />
        Sort by Year
    </label>
    <label>
        <input type="radio" name="viewMode" value="subject" bind:group={viewMode} />
        Sort by Subject
    </label>
</div>

<main>
    {#if viewMode === 'year'}
        {#each Object.entries(data.byYear) as [year, courses]}
            <Container heading={`Year ${year} (${courses.length})`}>
                {#each courses as course (course.id)}
                    <a class="course-link" href={`/crs/${course.code}`}>
                        <span class="course-code">{course.code}</span>
                        <span class="course-title">{course.title}</span>
                    </a>
                {/each}
            </Container>
        {/each}
    {:else}
        {#each Object.entries(data.bySubject) as [subject, courses]}
            <Container heading={`${subject} (${courses.length})`}>
                {#each courses as course (course.id)}
                    <a class="course-link" href={`/crs/${course.code}`}>
                        <span class="course-code">{course.code}</span>
                        <span class="course-title">{course.title}</span>
                    </a>
                {/each}
            </Container>
        {/each}
    {/if}
</main>

<style>
.sort-toggle {
    margin-bottom: 1.5rem;
    display: flex;
    gap: 2rem;
}
.course-link {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 0.7rem 0;
    text-decoration: none;
    color: #623A52;
    border-bottom: 1px solid #eee;
    transition: background 0.2s;
}
.course-link:hover {
    background: #f6eaec;
    text-decoration: underline;
}
.course-code {
    font-weight: bold;
    min-width: 5.5rem;
}
.course-title {
    font-size: 1.08em;
}
</style>