<script lang="ts">
    import {getContext} from 'svelte'
    import {Tournament} from '../../lib/Types'

    export let id: string

    const {matches, contestants} = getContext<Tournament>('tournament')

    $: match = matches[id]
    $: leftName = contestants[match.left].name
    $: rightName = contestants[match.right].name
</script>

<section>
    <div class="card">{leftName}</div>
    <div class="line-wrapper">
        <div class="line"></div>
    </div>
    <div class="card">{rightName}</div>
</section>

<style>
    section {
        display: contents;
        cursor: pointer;
    }
    section:hover .card {
        background-color: hsl(var(--clr-bg-light));
    }
    .card {
        text-align: center;
        min-width: 20ch;
    }
    .line-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 .5rem;
    }
    .line {
        background-color: hsl(var(--clr-bg-light));
        height: .5rem;
        width: 100%;
        border-radius: 100vh;
    }
</style>
