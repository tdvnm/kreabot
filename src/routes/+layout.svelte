<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores';
	import AuthCheck from '$lib/components/AuthCheck.svelte';

	$: segments = $page.url.pathname.replace(/^\/+/, '').split('/').filter(Boolean);
	$: paths = segments.map((_, i, arr) => '/' + arr.slice(0, i + 1).join('/'));
</script>

<AuthCheck>
	<div class="layout">
		<Header {segments} {paths} />
		<slot />
		<nav>
			<button class:active={$page.url.pathname.startsWith('/fac')} on:click={() => goto('/fac')}>faculty</button>
			<button class:active={$page.url.pathname.startsWith('/crs')} on:click={() => goto('/crs/2025_t1')}>courses</button>
			<button class:active={$page.url.pathname.startsWith('/hb')} on:click={() => goto('/hb')}>handbook</button>
			<button class:active={$page.url.pathname.startsWith('/set')} on:click={() => goto('/set')}>settings</button>
		</nav>
	</div>
</AuthCheck>

<style lang="scss">
    .layout {
        min-height: 100vh;
        max-width: 580px;
        margin: 0 auto;
        font-size: 1.6rem;
        background-color: var(--main__bg);
        position: relative;
        border: #ccc 1px solid;

        nav {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100vw;
            max-width: 580px;
            display: flex;
            justify-content: space-around;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.5),
                inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                inset 0 0 16px 8px rgba(255, 255, 255, 0.8);
            z-index: 100;
            padding: 0;
            border-top: none;
            overflow: hidden;
            position: fixed;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.8),
                    transparent
                );
            }

            &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 100%;
                background: linear-gradient(
                    180deg,
                    rgba(255, 255, 255, 0.8),
                    transparent,
                    rgba(255, 255, 255, 0.3)
                );
            }

            button {
                flex: 1;
                background: none;
                border: none;
                color: #555555;
                font-size: 1.4rem;
                padding: 1.2rem 0 1rem 0;
                font-weight: 500;
                transition: background 0.2s, color 0.2s;
                border-radius: 0;
                box-shadow: none;
                position: relative;
            }

            button.active,
            button:focus,
            button[aria-current="page"] {
            //    kground: linear-gradient(to bottom, #aaaaaa 0%, #ebebeb 100%);
                color: #3c3c3c;
                font-weight: 700;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.24) inset;
            }
        }
    }
</style>
