<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let difficulty = '';
    export let workload = '';
    export let grading = '';
    export let clarity = '';
    export let take_again = '';
    export let grade_recd = '';
    export let structure = '';
    export let prof_summary = '';
    export let message = '';
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

<form on:submit={handleSubmit}>
    <!-- Overall Rating -->
    <div class="form-group">
        <label>Overall Rating:</label>
        <div class="radio-group connected">
            {#each ratingOptions as rating, i}
                <label class="radio-rect {difficulty == rating ? 'selected' : ''} {i === 0 ? 'first' : ''} {i === ratingOptions.length - 1 ? 'last' : ''}">
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

    <!-- Workload Rating -->
    <div class="form-group">
        <label>Workload Rating:</label>
        <div class="radio-group connected">
            {#each ratingOptions as rating, i}
                <label class="radio-rect {workload == rating ? 'selected' : ''} {i === 0 ? 'first' : ''} {i === ratingOptions.length - 1 ? 'last' : ''}">
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

    <!-- Grading Rating -->
    <div class="form-group">
        <label>Grading Rating:</label>
        <div class="radio-group connected">
            {#each ratingOptions as rating, i}
                <label class="radio-rect {grading == rating ? 'selected' : ''} {i === 0 ? 'first' : ''} {i === ratingOptions.length - 1 ? 'last' : ''}">
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

    <!-- Clarity Rating -->
    <div class="form-group">
        <label>Clarity Rating:</label>
        <div class="radio-group connected">
            {#each ratingOptions as rating, i}
                <label class="radio-rect {clarity == rating ? 'selected' : ''} {i === 0 ? 'first' : ''} {i === ratingOptions.length - 1 ? 'last' : ''}">
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

    <!-- Feedback Dropdowns -->
    <div class="form-group">
        <label>would take again</label>
        <select bind:value={take_again}>
            <option value="" disabled selected>Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="maybe">Maybe</option>
        </select>
    </div>
    <div class="form-group">
        <label>grade received</label>
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
    <div class="form-group">
        <label>course structure / planning</label>
        <textarea bind:value={structure} rows="2"></textarea>
    </div>
    <div class="form-group">
        <label>Professor/Course Summary:</label>
        <textarea bind:value={prof_summary} rows="2"></textarea>
    </div>

    <button type="submit">Submit Feedback</button>

    {#if message}
        <p class="message">{message}</p>
    {/if}
</form>