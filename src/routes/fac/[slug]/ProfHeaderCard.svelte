<script lang="ts">
	export let image_url: string;
	export let name: string;
	export let position: string;
	export let subject: string;
</script>

<div class="top-box">
	<img src={image_url} alt={name} />
	<div class="info">
		<h2>{name}</h2>
		<h4>{position}</h4>
		<h4>{subject}</h4>
	</div>
</div>

<style>
	.top-box {
		display: grid;
		grid-template-columns: 8rem 1fr;
		gap: 1.6rem;

		background-color: rgb(255, 255, 255);
		padding: 1.6rem;
		border: 1px solid #cfbcbc;
		border-radius: 4px;
		box-shadow: 0 4px 10px -4px rgba(144, 114, 114, 0.1);
		padding: 1.6rem;

		img {
			width: 100%;
			height: auto;
			border-radius: 2px;
		}

		.info {
			h2 {
				color: var(--main__text);
				font-size: 2.2rem;
				font-weight: 600;
			}
			h4 {
				color: var(--light__text);
				font-size: 1.6rem;
				font-weight: 400;
			}
		}
	}
</style>
