<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	export let course_code: string;
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
			<h1>{course_code}</h1>
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

			<div class="rating-box">
				grade received<br />
				<span class="alpha-score">{grade_recd}</span>
			</div>
			<div class="rating-box">
				would take again<br />
				<span class="alpha-score">{take_again}</span>
			</div>

			<div class="rating-box half">
				<span class="heading-kinda">course structure</span>
				<p class="desc">{structure}</p>
			</div>

			<div class="cell wide">
				<p class="heading-kinda">professor summary</p>
				<p class="desc">{prof_summary}</p>
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
			background: linear-gradient(to bottom, #ffffff 1%, #f4f8fc 10%, #c9d8e6 95%, #cacfd4 100%);
			// background: linear-gradient(to bottom, #ffffff 1%, #CFEEFF 10%, #98C7FF 95%, #87b3e8 100%);
			border-bottom: 1px solid #3d4146a1;

			border-radius: 4px 4px 0 0;

			.heading {
				display: flex;
				justify-content: space-between; /* h1 left, h2 right */
				align-items: center;
				width: 100%;

				h1 {
					color: rgba(45, 50, 63, 0.6);
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
					.alpha-score {
						display: block;
						font-size: 1.8rem;
						font-weight: 600;
						color: #697a8e;
					}
				}

				.desc {
					font-size: 1.4rem;
					font-weight: 400;
					color: #000;
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

			// .container__content p {
			// 	white-space: normal;
			// 	word-wrap: break-word;
			// 	overflow-wrap: break-word;
			// 	max-width: 100%;
			// 	color: #4c5259;
			// }
		}
	}
</style>
