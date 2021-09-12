<script lang="ts">
    import {loadTournament, toStore} from './lib/util/tournament'
    import EditableText from './lib/components/editable/EditableText.svelte'

    const tournament = loadTournament()

    const tournamentStore = toStore(tournament)
    $: localStorage.setItem('tournament', JSON.stringify($tournamentStore))

    const settings = tournament.settings
    const settingsStore = toStore(tournament.settings)

</script>

<h1>
    <EditableText load={() => $settingsStore.name} save={value => settings.name = value}/>
</h1>

<style>
    h1 {
        display: flex;
        justify-content: center;
        margin-top: 0;
    }
</style>