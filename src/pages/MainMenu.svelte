<script lang="ts">
    import {getContext} from 'svelte'
    import {Tournament} from '../lib/Types'

    const tournament = getContext<Tournament>('tournament')
</script>

<main>
    <h1>Tournament</h1>
    <section>
        <button on:click={() => tournament.settings.state = 'editingContestants'}>New</button>
        <button>Load</button>
    </section>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    h1 {
        font-size: 4rem;
        letter-spacing: .2rem;
    }
    section {
        display: flex;
        flex-direction: column;
        width: 20ch;
    }
    button {
        font-size: 1.6rem;
        text-align: center;
    }
    button + button {
        margin-top: 1rem;
    }
</style>