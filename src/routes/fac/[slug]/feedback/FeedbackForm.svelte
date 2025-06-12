<script lang="ts">
	import Container from '../../Container.svelte';
	import { createEventDispatcher } from 'svelte';

	export let difficulty = '';
	export let workload = '';
	export let grading = '';
	export let clarity = '';
	export let take_again = '';
	export let grade_recd = '';
	export let structure = '';
	export let prof_summary = '';
	export let ratingOptions = [1, 2, 3, 4, 5];

	const dispatch = createEventDispatcher();

	function handleSubmit(event: Event) {
		event.preventDefault();
		dispatch('submit', {
			difficulty,
			workload,
			grading,
			clarity,
			take_again,
			grade_recd,
			structure,
			prof_summary
		});
	}
</script>

<Container heading="feedback form" isContentVisible={false}>
    <form on:submit={handleSubmit}>

        <div class="rating-row">
            <span>difficulty</span>
            <div class="rating-options">
                {#each ratingOptions as rating}
                    <label>
                        <input
                            type="radio"
                            name="difficulty"
                            bind:group={difficulty}
                            value={rating}
                            aria-label={rating}
                        />
                        <span>{rating}</span>
                    </label>
                {/each}
            </div>
        </div>

        <div class="rating-row">
            <span>workload</span>
            <div class="rating-options">
                {#each ratingOptions as rating}
                    <label>
                        <input
                            type="radio"
                            name="workload"
                            bind:group={workload}
                            value={rating}
                            aria-label={rating}
                        />
                        <span>{rating}</span>
                    </label>
                {/each}
            </div>
        </div>

        <div class="rating-row">
            <span>grading</span>
            <div class="rating-options">
                {#each ratingOptions as rating}
                    <label>
                        <input
                            type="radio"
                            name="grading"
                            bind:group={grading}
                            value={rating}
                            aria-label={rating}
                        />
                        <span>{rating}</span>
                    </label>
                {/each}
            </div>
        </div>

        <div class="rating-row">
            <span>clarity</span>
            <div class="rating-options">
                {#each ratingOptions as rating}
                    <label>
                        <input
                            type="radio"
                            name="clarity"
                            bind:group={clarity}
                            value={rating}
                            aria-label={rating}
                        />
                        <span>{rating}</span>
                    </label>
                {/each}
            </div>
        </div>
        
        <div class="rating-row">
            <span>would take again</span>
            <div class="rating-options">
                <label>
                    <input
                        type="radio"
                        name="take_again"
                        bind:group={take_again}
                        value="yes"
                        aria-label="yes"
                    />
                    <span>Yes</span>
                </label>
                <label>
                    <input
                        type="radio"
                        name="take_again"
                        bind:group={take_again}
                        value="no"
                        aria-label="no"
                    />
                    <span>No</span>
                </label>
                <label>
                    <input
                        type="radio"
                        name="take_again"
                        bind:group={take_again}
                        value="maybe"
                        aria-label="maybe"
                    />
                    <span>Maybe</span>
                </label>
            </div>
        </div>

        <!-- Grade received row -->
        <div class="rating-row">
            <span>grade received</span>
            <div class="rating-options select-options">
                <select bind:value={grade_recd}>
                    <option value="" disabled selected>Select grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="C-">C-</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                </select>
            </div>
        </div>

        <!-- Textareas -->
        <div class="textarea-row">
            <label>course structure / planning</label>
            <textarea bind:value={structure} rows="2"></textarea>
        </div>
        <div class="textarea-row">
            <label>professor summary</label>
            <textarea bind:value={prof_summary} rows="2"></textarea>
        </div>

        <button type="submit">Submit Feedback</button>
    </form>
</Container>

<style lang="scss">
.rating-form {
  max-width: 100%;
  margin: 40px auto;
}

.rating-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  border-bottom: var(--light__border);

  span {
    font-size: 1.6rem;
    color: var(--main__text);
    font-weight: 600;
    flex: 2;
  }

  .rating-options {
    display: flex;
    gap: 10px;
    flex: 2;

    input[type="radio"] {
      display: none;
    }

    label {
      position: relative;
    }

    span {
      display: inline-block;
      min-width: 3.6rem;
      height: 3.6rem;
      line-height: 3.4rem;
      text-align: center;
      background-color: #fbefedde;
      border: var(--light__border);
      border-radius: 4px;
      padding: 0 1rem;
      box-shadow: 0 1px 2px 1px #b5839235 inset;
    }

    input[type="radio"]:checked + span {
      background: var(--peach__grad, #FFD5BF);
      color: white;
      font-weight: 800;
      box-shadow: 0 1px 4px 0 #b5839200 inset;
    }
  }

  .select-options {
    flex: 2;
    display: flex;
    align-items: center;
    select {
      width: 100%;
      padding: 0.8rem 1rem;
      border: var(--light__border);
      border-radius: 4px;
      background: #fbefedde;
      color: var(--main__text);
      outline: none;
      box-shadow: 0 1px 4px 0 #b5839220 inset;
      transition: border 0.2s;
      &:focus {
        border-color: #b58392;
      }
    }
  }
}

.textarea-row {
  display: flex;
  flex-direction: column;
  padding: 1.2rem;
  border-bottom: var(--light__border);

  label {
    color: var(--main__text);
    font-weight: 600;
    margin-bottom: 0.8rem;
  }

  textarea {
    width: 100%;
    min-height: 10rem;
    padding: 0.8rem 1rem;
    border: var(--light__border);
    border-radius: 4px;
    background: #fbefedde;
    color: var(--main__text);
    resize: vertical;
    box-shadow: 0 1px 4px 0 #b5839220 inset;
    &:focus {
      border-color: #b58392;
    }
  }
}

button[type="submit"] {
  width: 100%;
  padding: 1.2rem 0;
  background: var(--green__grad);
  color: #3a625a;
  border: 0;
  border-radius: 0 0 4px 4px;
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
