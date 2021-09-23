<script lang="ts">
    import {loadTournament, toStore} from './lib/util/tournament'
    import EditableText from './lib/components/editable/EditableText.svelte'
    import MainMenu from './pages/MainMenu.svelte'
    import {setContext} from 'svelte'
    import EditContestants from './pages/EditContestants.svelte'
    import EditGroups from './pages/EditGroups.svelte'
    import type {Tournament} from './lib/Types'

    const tournament = loadTournament()
    setContext('tournament', tournament)

    const tournamentStore = toStore(tournament)
    $: localStorage.setItem('tournament', JSON.stringify($tournamentStore))

    const settings = tournament.settings
    const settingsStore = toStore(tournament.settings)

    $: state = $settingsStore.state

    const setPage = (state: Tournament['settings']['state']) => () => {
        settings.state = state
    }
</script>

{#if state === 'mainMenu'}
    <MainMenu/>
{:else}
    <main>
        <nav>
            <div class="buttons">
                <button on:click={setPage('editingContestants')}>Edit Contestants</button>
                <button on:click={setPage('editingGroups')}>Edit Groups</button>
            </div>
            <h1>
                <EditableText load={() => $settingsStore.name} save={value => settings.name = value}/>
            </h1>
            <div class="buttons">
                <button on:click={setPage('running')}>Tournament</button>
            </div>
        </nav>
        {#if state === 'editingContestants'}
            <EditContestants/>
        {:else if state === 'editingGroups'}
            <EditGroups/>
        {/if}
    </main>
{/if}

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }
    nav {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        font-size: 1.5rem;
    }
    .buttons {
        width: 100px;
        flex: 1;
        display: flex;
        margin: 1rem;
        justify-content: center;
    }
    button + button {
        margin-left: 1rem;
    }
</style>