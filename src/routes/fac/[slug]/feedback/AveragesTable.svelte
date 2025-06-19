<script lang="ts">
	import { get } from 'svelte/store';

	export let averageDifficulty: string;
	export let averageWorkload: string;
	export let averageGrading: string;
	export let averageClarity: string;

	function getColorClass(val: string) {
		const num = parseFloat(val);
		if (isNaN(num)) return '';
		if (num >= 4 && num <= 5) return 'avg-green';
		if (num >= 3 && num < 4) return 'avg-yellow';
		if (num >= 1 && num < 3) return 'avg-red';
		return '';
	}
</script>

<div class="averages-table">
	<div class={getColorClass(averageDifficulty)}>
		<span class="avg-label">difficulty</span>
		<span class="avg-value">{averageDifficulty}</span>
	</div>
	<div class={getColorClass(averageWorkload)}>
		<span class="avg-label">workload</span>
		<span class="avg-value">{averageWorkload}</span>
	</div>
	<div class={getColorClass(averageGrading)}>
		<span class="avg-label">grading</span>
		<span class="avg-value">{averageGrading}</span>
	</div>
	<div class={getColorClass(averageClarity)}>
		<span class="avg-label">clarity</span>
		<span class="avg-value">{averageClarity}</span>
	</div>
</div>

<style lang="scss">
	.averages-table {
		display: flex;
		margin-top: 1rem;
		border: 1px solid #505357a1;
		border-radius: 4px;
		overflow: hidden;
		> div {
			flex: 1 1 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 1rem;
			border-right: 1px solid #505357a1;
			.avg-label {
				font-size: 1.3rem;
				color: rgba(68, 68, 68, 0.455);
				font-weight: 500;
				margin-bottom: 0.4rem;
			}
		}
		> div:last-child {
			border-right: none;
		}
		.avg-green {
			background: linear-gradient(to bottom, #c5ebc5 1%, #b2e6b2 10%, #8cd58c 94%, #6eb66ece 100%);

			.avg-value {
				font-size: 2.5rem;
				font-weight: 700;
				color: #2e7d32;
				line-height: 1;
				transition: color 0.2s;
			}
		}
		.avg-yellow {
			background: linear-gradient(to bottom, #fdf2c5 1%, #fbe6b2 10%, #f8d58c 94%, #f6b66e 100%);

			.avg-value {
				font-size: 2.5rem;
				font-weight: 700;
				color: #d8972ddd;
				line-height: 1;
				transition: color 0.2s;
			}
		}
		.avg-red {
			background: linear-gradient(to bottom, #fdd2c5 1%, #fbc6b2 10%, #f8b58c 94%, #f6a66e 100%);

			.avg-value {
				font-size: 2.5rem;
				font-weight: 700;
				color: #72262691;
				line-height: 1;
				transition: color 0.2s;
			}
		}
	}
</style>
