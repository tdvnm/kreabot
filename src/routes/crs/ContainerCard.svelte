<script lang="ts">
    export let code: string;
    export let credits: number;
    export let faculty: string;
    export let is_req: string;
    export let title: string;
</script>

<section class="course-card">
    <div><strong>Code:</strong> {code}</div>
    <div><strong>Title:</strong> {title}</div>
    <div><strong>Credits:</strong> {credits}</div>
    <div><strong>Faculty:</strong> {faculty}</div>
    <div><strong>Type:</strong> {is_req}</div>
</section>

<style>
.course-card {
    padding: 1.2rem;
    border-bottom: 1px solid #d1bdbd;
    color: #5d5656;
}
.course-card strong {
    color: #5a5454;
    font-weight: 500;
    margin-right: 0.5em;
}
</style>