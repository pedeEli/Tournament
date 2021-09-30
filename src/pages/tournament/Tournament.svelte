<script lang="ts">
    import Groups from './Groups.svelte'

    let state = 'groups'
</script>


<main>
    <div class="buttons">
        <button class:active={state === 'groups'} on:click={() => state = 'groups'}>Groups</button>
        <button class:active={state === 'finale'} on:click={() => state = 'finale'}>Finale</button>
        <button class:active={state === 'contestants'} on:click={() => state = 'contestants'}>Contestants</button>
    </div>
    <div class="card">
        {#if state === 'groups'}
            <Groups/>
        {/if}
    </div>
</main>


<style>
    main {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        padding: 0 1rem;
        margin-bottom: 1rem;
        overflow: hidden;
    }
    .buttons {
        align-self: flex-start;
    }
    .card {
        margin-top: 1rem;
        width: 100%;
        flex: 1;
        overflow: auto;
    }
</style>