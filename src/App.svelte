<script lang="ts">
    import {loadTournament, toStore} from './lib/util/tournament'

    const tournament = loadTournament()

    const tournamentStore = toStore(tournament)
    $: localStorage.setItem('tournament', JSON.stringify($tournamentStore))

</script>

<style>

</style>