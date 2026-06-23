<div class="welcome">
	<h2>select a subject</h2>
	<p>choose a subject from the sidebar to browse faculty and courses</p>
</div>

<style lang="scss">
	.welcome {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: var(--color-text-muted);
		padding: 2rem;
		gap: 1.2rem;
		min-height: calc(100vh - 5.6rem);

		h2 {
			font-size: 2.4rem;
			font-weight: 500;
			color: var(--color-text);
		}

		p {
			font-size: 1.4rem;
		}
	}
</style>
