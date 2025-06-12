<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	export let course_name: string;
	export let timestamp: string;

	export let difficulty: number;
	export let workload: number;
	export let grading: number;
	export let clarity: number;

	export let take_again: string;
	export let grade_recd: string;

	export let structure: string;
	export let prof_summary: string;
</script>

<div class="container">
	<div class="container__header">
		<div class="heading">
			<h1>{course_name}</h1>
			<h2>{timestamp}</h2>
		</div>
	</div>
	<div class="container__content">
		<div class="prof-feedback">
			<div class="rating-box">
				difficulty<br />
				<span class="score">{difficulty}</span>
			</div>
			<div class="rating-box">
				workload<br />
				<span class="score">{workload}</span>
			</div>
			<div class="rating-box">
				grading<br />
				<span class="score">{grading}</span>
			</div>
			<div class="rating-box">
				clarity<br />
				<span class="score">{clarity}</span>
			</div>

			<div class="cell half">
				<p><span class="heading-kinda">grade received</span>  
				{grade_recd}</p>
				<p class="heading-kinda">would take again</p>
				<p>{take_again}</p>
			</div>
			<div class="cell half">
				<p class="heading-kinda">course structure</p>
				<p>{structure}</p>
			</div>

			<div class="cell wide">
				<p class="heading-kinda">professor summary</p>
				<p>{prof_summary}</p>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		width: 100%;
		border: 1px solid #505357a1;
		border-radius: 4px;
		margin-top: 1.2rem;

		.container__header {
			display: flex;
			flex-direction: row;
			padding: 0.5rem 0.8rem;
			background: linear-gradient(to bottom, #f9fbff 1%, #ebf2ff 10%, #ebf2ff 45%, #b5cceb 100%);
			border-bottom: 1px solid #3d4146a1;

			border-radius: 4px 4px 0 0;

			.heading {
				display: flex;
				justify-content: space-between; /* h1 left, h2 right */
				align-items: center;
				width: 100%;

				h1 {
					color: rgba(60, 65, 77, 0.621);
					font-size: 1.6rem;
					font-weight: 600;
					margin: 0;
				}
				h2 {
					color: #4b5158ce;
					font-size: 1.2rem;
					font-weight: 400;
					text-align: right;
					opacity: 0.8;
					margin: 0;
				}
			}
		}

		.container__content {
			padding: 0rem;
			background-color: #ffffff;
			border-radius: 0 0 4px 4px;
		}

		.prof-feedback {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 1px;

			background-color: #505357a1;
			width: 100%;
			border-radius: 4px;

			.rating-box {
				padding: 10px;
				background: #ffffff;
				font-weight: 500;
				font-size: 1.4rem;
				color: #818890ce;

				.score {
					display: block;
					font-size: 2.5rem;
					font-weight: 800;
					color: #697a8e;
				}
			}

			.cell {
				padding: 10px;
				background: white;
				font-size: 1.2rem;

				.heading-kinda {
					font-weight: 500;
					font-size: 1.4rem;
					color: #818890ce;
					margin-bottom: 0.5rem;
				}
			}

			/* Merged cells */
			.half {
				grid-column: span 2;
			}

			.wide {
				grid-column: span 4;
				border-radius: 0 0 4px 4px;
			}
		}

		.container__content p {
			white-space: normal;
			word-wrap: break-word;
			overflow-wrap: break-word;
			max-width: 100%;
			color: #4c5259;
		}
	}
</style>
