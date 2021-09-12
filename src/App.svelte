<script lang="ts">
    import {loadTournament, toStore} from './lib/util/tournament'
    import EditableText from './lib/components/editable/EditableText.svelte'
    import MainMenu from './pages/MainMenu.svelte'
    import {setContext} from 'svelte'

    const tournament = loadTournament()
    setContext('tournament', tournament)

    const tournamentStore = toStore(tournament)
    $: localStorage.setItem('tournament', JSON.stringify($tournamentStore))

    const settings = tournament.settings
    const settingsStore = toStore(tournament.settings)

</script>

{#if $settingsStore.state === 'mainMenu'}
    <MainMenu/>
{:else}
    <main>
        <h1>
            <EditableText load={() => $settingsStore.name} save={value => settings.name = value}/>
        </h1>
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