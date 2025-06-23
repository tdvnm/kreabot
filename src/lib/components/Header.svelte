<script lang="ts">
    import { goto } from '$app/navigation';
    export let segments: string[] = [];
    export let paths: string[] = [];
</script>

<div>
    <h2>
        {#each segments as segment, i}
            <span
                on:click={() => goto(paths[i])}
                class:last={i === segments.length - 1}
            >
                {segment}<span class="sep">/</span>
            </span>
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

            span.last {
                color: #5e2e3cde; 
                font-weight: 600;
            }
        }
        .sep {
            margin: 0 0.3rem;
            color: #996a78;
        }
    }
</style>
