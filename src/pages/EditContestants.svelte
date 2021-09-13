<script lang="ts">
    import EditableList from '../lib/components/editable/EditableList.svelte'
    import Minus from '../lib/components/svg/Minus.svelte'
    import EditableText from '../lib/components/editable/EditableText.svelte'
    import {getContext} from 'svelte'
    import type {Contestant, Tournament} from '../lib/Types'
    import {createId, toStore} from '../lib/util/tournament'
    import {groupByType} from '../lib/util/contestants'
    import {clickOutside} from '../lib/util/actions'


    const tournament = getContext<Tournament>('tournament')
    const contestants = tournament.contestants
    const contestantsStore = toStore(contestants)

    const addingContestant = tournament.settings.addingContestant

    let {addingType, teamName, personName, members} = addingContestant
    $: addingContestant.addingType = addingType
    $: addingContestant.teamName = teamName
    $: addingContestant.personName = personName

    const addContestant = () => {
        const id = createId(Object.keys($contestantsStore))
        contestants[id] = createContestant(id)

        personName = ''
        teamName = ''
        addingContestant.members.splice(0, addingContestant.members.length)
    }
    const createContestant = (id: string): Contestant => {
        if (addingType === 'team') {
            const copiedMembers = Array(members.length).fill(null).map((_, index) => members[index])
            return {
                id,
                type: 'team',
                name: teamName,
                members: copiedMembers
            }
        }
        return {
            id,
            type: 'person',
            name: personName
        }
    }

    const removeContestant = (id: string) => {
        return () => {
            if (selectedTeamId === id) selectedTeamId = false
            delete contestants[id]
        }
    }

    const renameContestant = (id: string) => {
        return value => contestants[id].name = value
    }

    const getContestantName = (id: string) => {
        return () => $contestantsStore[id].name
    }

    const handleKeyDownPerson = ({key}: KeyboardEvent) => {
        if (key !== 'Enter') return
        addContestant()
    }

    $: groupedContestants = groupByType($contestantsStore)
    $: persons = groupedContestants.persons
    $: teams = groupedContestants.teams

    let selectedTeamId: string | false = false

</script>

<main>
    <h2>Füge Team oder Person hinzu</h2>
    <section class="type-buttons">
        <button class:active={addingType === 'team'} on:click={() => addingType = 'team'}>Team</button>
        <button class:active={addingType === 'person'} on:click={() => addingType = 'person'}>Person</button>
    </section>
    <section class="name">
        <label for="name">Name</label>
        {#if addingType === 'team'}
            <input id="name" type="text" bind:value={teamName}>
        {:else}
            <input id="name" type="text" on:keydown={handleKeyDownPerson} bind:value={personName}>
        {/if}
    </section>
    {#if addingType === 'team'}
        <div class="team-members">
            <EditableList list={members} heading="Team Mitglieder"/>
        </div>
    {/if}
    <section class="action-buttons">
        <button class="action-button" on:click={addContestant}>Hinzufügen</button>
        <button class="action-button" >Gruppen Konfigurieren</button>
    </section>

    <div class="contestants">
        {#if persons}
            <section class="persons">
                <h2>Personen</h2>
                {#each persons as {id} (id)}
                    <div class="person">
                        <button on:click={removeContestant(id)} class="svg small-svg"><Minus/></button>
                        <EditableText load={getContestantName(id)} save={renameContestant(id)} width="13ch"/>
                    </div>
                {/each}
            </section>
        {/if}
        {#if teams}
            <section use:clickOutside on:clickoutside={() => selectedTeamId = false} class="teams">
                <h2>Teams</h2>
                <div class="teams-wrapper">
                    {#each teams as {id, members} (id)}
                        <div on:click={() => selectedTeamId = id} class="team card">
                            <div class="team-name underline">
                                <EditableText load={getContestantName(id)} save={renameContestant(id)} width="20ch"/>
                                <button on:click={removeContestant(id)} class="svg small-svg"><Minus/></button>
                            </div>
                            {#each members as member (member)}
                                <div class="member">{member}</div>
                            {/each}
                        </div>
                        {#if selectedTeamId === id}
                            <div class="team">
                                <EditableList list={contestants[selectedTeamId].members}
                                              bind:heading={$contestantsStore[selectedTeamId].name}/>
                            </div>
                        {/if}
                    {/each}
                </div>
            </section>
        {/if}
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .type-buttons, .action-buttons {
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        margin: .6rem;
    }
    .type-buttons button:last-child,
    .action-buttons button:last-child {
        margin-left: 1rem;
    }
    .active {
        background-color: hsl(var(--clr-bg-light));
    }
    label {
        margin-right: 1rem;
    }
    .team-members {
        margin-top: 1rem;
        min-width: 35ch;
        font-size: 1.3rem;
    }
    .action-buttons {
        margin-top: 1rem;
    }
    .action-button {
        font-size: 1.7rem;
    }
    h2 {
        text-align: center;
        margin: 0;
    }
    .contestants {
        margin: 2rem;
        display: flex;
        align-items: flex-start;
        max-width: 60rem;
    }
    .persons {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-width: 20ch;
    }
    .person, .team-name {
        display: flex;
        align-items: center;
    }
    .person {
        margin-top: .7rem;
    }
    .person button {
        margin-right: .4rem;
    }
    .teams {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .teams-wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
    }
    .team {
        margin-top: .7rem;
        margin-right: .7rem;
    }
    .team-name button {
        margin-left: .4rem
    }
    .persons + .teams {
        margin-left: 2rem;
    }
</style>