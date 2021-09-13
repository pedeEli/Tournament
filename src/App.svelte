<script lang="ts">
    import {loadTournament, toStore} from './lib/util/tournament'
    import EditableText from './lib/components/editable/EditableText.svelte'
    import MainMenu from './pages/MainMenu.svelte'
    import {setContext} from 'svelte'
    import EditContestants from './pages/EditContestants.svelte'

    const tournament = loadTournament()
    setContext('tournament', tournament)

    const tournamentStore = toStore(tournament)
    $: localStorage.setItem('tournament', JSON.stringify($tournamentStore))

    const settings = tournament.settings
    const settingsStore = toStore(tournament.settings)

    $: state = $settingsStore.state
</script>

{#if state === 'mainMenu'}
    <MainMenu/>
{:else}
    <main>
        <h1>
            <EditableText load={() => $settingsStore.name} save={value => settings.name = value}/>
        </h1>
        {#if state === 'editingContestants'}
            <EditContestants/>
        {/if}
    </main>
{/if}

<style>
    h1 {
        display: flex;
        justify-content: center;
    }
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }
</style>