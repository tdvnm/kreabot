<script lang="ts">
    import { page } from '$app/stores';
</script>

<h1>{$page.status} <br /> 
    {$page.error?.message}</h1>

<style lang="scss">
h1 {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    text-align: center;
    margin: 2rem;
}
</style>