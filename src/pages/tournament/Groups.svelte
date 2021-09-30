<script lang="ts">
    import {getContext} from 'svelte'
    import {Tournament} from '../../lib/Types'
    import {toStore, values} from '../../lib/util/tournament'
    import GroupMatch from './GroupMatch.svelte'
    import {clickOutside, mouseDownOutside} from '../../lib/util/actions'


    const tournament = getContext<Tournament>('tournament')
    const {groups, contestants, matches} = tournament

    const groupsStore = toStore(groups)
    $: groupsList = values($groupsStore)

    let selectedGroup: string | false = false

    let clickedInsideSelected = false
    const deselectGroup = () => {
        if (clickedInsideSelected) return
        selectedGroup = false
        clickedInsideSelected = false
    }
</script>

<div class="wrapper">
    <section>
        {#each groupsList as {members, id, name} (id)}
            <div use:clickOutside on:clickoutside={deselectGroup} class="card group" on:click={() => selectedGroup = id}>
                <div class="name underline">{name}</div>
                {#each members as member (member)}
                    <div>{contestants[member].name}</div>
                {/each}
            </div>
        {/each}
    </section>
    {#if selectedGroup}
        <section class="selected-group" use:mouseDownOutside on:mousedownoutside={() => clickedInsideSelected = false} on:mousedown={() => clickedInsideSelected = true}>
            <h2>{$groupsStore[selectedGroup].name}</h2>
            {#each $groupsStore[selectedGroup].matches as id (id)}
                <GroupMatch {id}/>
            {/each}
        </section>
    {/if}
</div>

<style>
    .wrapper {
        display: flex;
        align-items: flex-start;
    }
    section {
        display: flex;
        flex-direction: column;
        width: fit-content;
        align-items: flex-start;
    }
    section + section {
        margin-left: 1rem;
    }
    .group {
        cursor: pointer;
    }
    .group + .group {
        margin-top: 1rem;
    }
    .selected-group {
        display: grid;
        grid-template-columns: auto 6.5rem auto;
        grid-row-gap: 1rem;
        align-items: center;
        user-select: none;
    }
    .selected-group h2 {
        grid-column: 1 / 4;
    }
</style>