<script lang="ts">
    import { goto } from '$app/navigation';
    export let segments: string[] = [];
    export let paths: string[] = [];
</script>

<div>
    <h2>
        {#each segments as segment, i}
            <span
                class="breadcrumb"
                style="cursor: pointer;"
                on:click={() => goto(paths[i])}
            >
                {segment}
            </span>
            {#if i < segments.length - 1}
                <span class="sep">/</span>
            {/if}
        {/each}
    </h2>
</div>

<style lang="scss">
    div {
        height: 36px;
        max-width: 580px;
        background: linear-gradient(to bottom, #fff8f8 0%, #eacbc0bf 30%);
        display: flex;
        align-items: center;
        border-bottom: 1px solid #b58392;
        padding: 2rem 1.2rem;

        h2 {
            color: #996a78;
            font-size: 2rem;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .sep {
            margin: 0 0.1em;
            color: #b58392;
        }
    }
</style>
