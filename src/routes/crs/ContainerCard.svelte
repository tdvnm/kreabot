<script lang="ts">
    export let code: string;
    export let credits: number;
    export let faculty: string;
    export let title: string;
</script>

<section class="course-card">
    <div><strong>{code}</strong> {title}</div>
    <!-- <p>{credits} credits by {faculty}</p> -->
</section>

<style>
.course-card {
    padding: 1.2rem;
    border-top: var(--main__border);
    color: #5d5656;
}
.course-card strong {
    color: #5a5454;
    font-weight: 500;
    margin-right: 0.5em;
}
</style>