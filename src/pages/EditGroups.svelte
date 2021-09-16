<script lang="ts">
    import {getContext} from 'svelte'
    import type {Contestant, Tournament} from '../lib/Types'
    import {createId, toStore} from '../lib/util/tournament'
    import Checkbox from '../lib/components/Checkbox.svelte'
    import Add from '../lib/components/svg/Add.svelte'
    import Minus from '../lib/components/svg/Minus.svelte'

    const tournament = getContext<Tournament>('tournament')

    const {settings, contestants, groups} = tournament
    const contestantsList: Contestant[] = Object.values(contestants)
    const groupsStore = toStore(groups)
    const settingsStore = toStore(settings)

    $: luckyLoserPossible = Math.log2($settingsStore.winnerPerGroup * Object.keys($groupsStore).length) % 1 !== 0

    const assignRandom = () => {
    }

    let assignedContestants: string[] = Object.values(groups).map(group => group.members).flat(1)
    let grabbedContestant: string | false = false
    let top: number
    let left: number

    const addGroup = () => {
        const id = createId(Object.keys($groupsStore))
        groups[id] = {
            id,
            name: `Gruppe ${Object.keys($groupsStore).length + 1}`,
            matches: [],
            members: []
        }
    }
    const handleDrop = (id: string) => () => {
        if (!grabbedContestant) return
        groups[id].members.push(grabbedContestant)
        assignedContestants = [...assignedContestants, grabbedContestant]
        grabbedContestant = false
    }
    const removeGroup = (id: string) => () => {
        groups[id].members.forEach(member => assignedContestants = assignedContestants.filter(contestant => contestant !== member))
        delete groups[id]
        renameAllGroups()
    }
    const renameAllGroups = () => {
        Object.values(groups).forEach((group, index) => group.name = `Gruppe ${index + 1}`)
    }
    const removeContestant = (id: string, memberIndex: number) => () => {
        const contestantId = groups[id].members.splice(memberIndex, 1)[0]
        assignedContestants = assignedContestants.filter(id => id !== contestantId)
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
    <h2>Gruppen Konfigurieren</h2>
    <div>Es sind insgesamt {contestantsList.length} Teilnehmer</div>
    <section class="inputs">
        <label for="winner-per-group">Gewinner pro Gruppe</label>
        <input id="winner-per-group" type="text" bind:value={settings.winnerPerGroup}>
        {#if luckyLoserPossible}
            <div class="label">Lucky Loser</div>
            <Checkbox bind:value={settings.luckyLoser}/>
        {/if}
    </section>
    <section class="buttons">
        <button on:click={() => tournament.settings.state = 'editingContestants'}>Teams Bearbeiten</button>
        <button on:click={assignRandom}>Zufällig</button>
        <button on:click={() => {}}>Tunier Starten</button>
    </section>
    <section class="selection">
        <div class="contestants card">
            <header>Teilnehmer</header>
            {#each contestantsList.filter(({id}) => !assignedContestants.find(contestant => contestant === id)) as {id, name} (id)}
                <div on:mousedown={startDrag(id)} class="contestant">{name}</div>
            {/each}
        </div>
        <div class="groups card">
            <header>
                <span>Gruppen</span>
                <button on:click={addGroup} class="svg"><Add/></button>
            </header>
            {#each Object.values($groupsStore) as {id, name, members} (id)}
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
</main>

{#if grabbedContestant}
    <div class="grabbed-contestant card" style="top: {top}px; left: {left}px">
        {contestants[grabbedContestant].name}
    </div>
{/if}

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .inputs {
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: 2.5rem 2.5rem;
        grid-column-gap: 1rem;
        align-items: center;
        margin-top: 1rem;
    }
    .inputs label, .inputs div {
        justify-self: right;
    }
    .buttons {
        margin-top: .5rem;
    }
    .selection {
        display: flex;
        margin-top: 1rem;
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