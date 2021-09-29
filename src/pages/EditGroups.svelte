<script lang="ts">
    import {getContext} from 'svelte'
    import type {Contestant, Tournament} from '../lib/Types'
    import {createId, keys, toStore, values} from '../lib/util/tournament'
    import Checkbox from '../lib/components/Checkbox.svelte'
    import Add from '../lib/components/svg/Add.svelte'
    import Minus from '../lib/components/svg/Minus.svelte'
    import {
        createAndAssignMatches,
        getAssignedContestants, reassignMatchesAfterRandomize,
        removeMatches,
        removeMatchesOfContestant
    } from '../lib/util/groups'

    const tournament = getContext<Tournament>('tournament')

    const {settings, contestants, groups, matches} = tournament
    const contestantsList: Contestant[] = values(contestants)
    const groupsStore = toStore(groups)
    const settingsStore = toStore(settings)

    $: luckyLoserPossible = Math.log2($settingsStore.winnerPerGroup * keys($groupsStore).length) % 1 !== 0

    const assignRandom = () => {
        const groupsList = values(groups)
        if (!groupsList.length) return
        groupsList.forEach(group => group.members = [])
        assignedContestants = []

        let index = 0
        while (assignedContestants.length < contestantsList.length) {
            const group = groupsList[index]
            const contestant = getRandomContestant()
            group.members.push(contestant)
            assignedContestants = [...assignedContestants, contestant]
            index = (index + 1) % groupsList.length
        }

        reassignMatchesAfterRandomize(groupsList, matches)
    }

    const getRandomContestant = () => {
        while (true) {
            const index = Math.floor(Math.random() * contestantsList.length)
            const {id} = contestantsList[index]
            if (assignedContestants.find(_id => _id === id)) continue
            return id
        }
    }

    let assignedContestants: string[] = getAssignedContestants(values(groups))
    let grabbedContestant: string | false = false
    let top: number
    let left: number

    const addGroup = () => {
        const ids = keys($groupsStore)
        const id = createId(ids)
        groups[id] = {
            id,
            name: `Group ${ids.length + 1}`,
            matches: [],
            members: []
        }
    }
    const handleDrop = (id: string) => () => {
        if (!grabbedContestant) return
        groups[id].members.push(grabbedContestant)
        assignedContestants = [...assignedContestants, grabbedContestant]
        grabbedContestant = false
        createAndAssignMatches(groups[id], matches)
    }
    const removeGroup = (id: string) => () => {
        groups[id].members.forEach(member => assignedContestants = assignedContestants.filter(contestant => contestant !== member))
        removeMatches(groups[id], matches)
        delete groups[id]
        renameAllGroups()
    }
    const renameAllGroups = () => {
        values(groups).forEach((group, index) => group.name = `Group ${index + 1}`)
    }
    const removeContestant = (id: string, memberIndex: number) => () => {
        const contestantId = groups[id].members.splice(memberIndex, 1)[0]
        assignedContestants = assignedContestants.filter(id => id !== contestantId)
        removeMatchesOfContestant(contestantId, groups[id], matches)
    }

    const startDrag = (id: string) => ({clientX, clientY}: MouseEvent) => {
        grabbedContestant = id
        left = clientX
        top = clientY
    }
    const handleMouseMove = ({clientX, clientY}: MouseEvent) => {
        if (!grabbedContestant) return
        left = clientX
        top = clientY
    }
</script>

<svelte:body on:click={() => grabbedContestant = false} on:mousemove={handleMouseMove}/>

<main>
    <header>
        <h2>Configure groups</h2>
        <Checkbox bind:value={settings.haveGroups} />
    </header>
    {#if $settingsStore.haveGroups}
        <div class="contestant-count">There are in total {contestantsList.length} contestants</div>
        <section class="inputs">
            <label for="winner-per-group">Winner per group</label>
            <input id="winner-per-group" type="text" bind:value={settings.winnerPerGroup}>
            {#if luckyLoserPossible}
                <div class="label">Lucky Loser</div>
                <Checkbox bind:value={settings.luckyLoser}/>
            {/if}
            <button class="randomize" on:click={assignRandom}>Randomize</button>
        </section>
        <section class="selection">
            <div class="contestants card">
                <header>Contestants</header>
                {#each contestantsList.filter(({id}) => !assignedContestants.find(contestant => contestant === id)) as {id, name} (id)}
                    <div on:mousedown={startDrag(id)} class="contestant">{name}</div>
                {/each}
            </div>
            <div class="groups card">
                <header>
                    <span>Groups</span>
                    <button on:click={addGroup} class="svg"><Add/></button>
                </header>
                {#each values($groupsStore) as {id, name, members} (id)}
                    <div on:mouseup={handleDrop(id)} class="group card">
                        <header class="group-header underline">
                            <span>{name}</span>
                            <button on:click={removeGroup(id)} class="svg"><Minus/></button>
                        </header>
                        {#each members as memberId, memberIndex}
                            <div class="contestant">
                                <span>{contestants[memberId].name}</span>
                                <button on:click={removeContestant(id, memberIndex)} class="svg"><Minus/></button>
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        </section>
    {/if}
</main>

{#if grabbedContestant}
    <div class="grabbed-contestant card" style="top: {top}px; left: {left}px">
        {contestants[grabbedContestant].name}
    </div>
{/if}

<style>
    header {
        display: flex;
        justify-content: center;
    }
    h2 {
        margin-right: 1rem;
        transform: translateY(-.1em);
    }
    .contestant-count {
        margin-top: 1rem;
    }
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .inputs {
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: 2.5rem 2.5rem 2.5rem;
        grid-column-gap: 1rem;
        align-items: center;
        margin-top: 1rem;
    }
    .inputs label, .inputs div {
        justify-self: right;
    }
    .randomize {
        grid-column: 1 / 3;
        justify-self: center;
    }
    .selection {
        display: flex;
        margin-top: 1.5rem;
        align-items: flex-start;
    }
    .contestants {
        margin-right: 1rem;
    }
    .contestant {
        margin-top: .3rem;
        user-select: none;
        cursor: pointer;
    }
    header {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    header button {
        margin-left: 1rem;
    }
    .groups {
        min-width: 20ch;
    }
    .group {
        margin-top: .7rem;
    }
    .contestant {
        display: flex;
        align-items: center;
    }
    .contestant span {
        margin-right: auto;
    }
    .contestant button {
        margin-left: 1rem;
    }
    .grabbed-contestant {
        position: fixed;
        background-color: hsl(var(--clr-bg));
    }
</style>