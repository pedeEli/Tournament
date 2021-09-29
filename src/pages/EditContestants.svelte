<script lang="ts">
    import EditableList from '../lib/components/editable/EditableList.svelte'
    import Minus from '../lib/components/svg/Minus.svelte'
    import EditableText from '../lib/components/editable/EditableText.svelte'
    import {getContext} from 'svelte'
    import type {Contestant, Tournament} from '../lib/Types'
    import {createId, keys, toStore, values} from '../lib/util/tournament'
    import {capitalizeWords, groupByType} from '../lib/util/contestants'
    import {clickOutside} from '../lib/util/actions'
    import Popup from '../lib/components/Popup.svelte'
    import Add from '../lib/components/svg/Add.svelte'
    import {removeMatchesOfContestant} from '../lib/util/groups'


    const tournament = getContext<Tournament>('tournament')
    const contestants = tournament.contestants
    const contestantsStore = toStore(contestants)

    const addingContestant = tournament.settings.addingContestant

    let {addingType, teamName, personName, members} = addingContestant
    $: addingContestant.addingType = addingType
    $: addingContestant.teamName = teamName
    $: addingContestant.personName = personName

    const addContestant = () => {
        teamName = teamName.trim()
        personName = personName.trim()

        const id = createId(keys(contestants))
        const contestant = createContestant(id)

        if (contestant.name === '')
            return popup('Name cannot be empty')
        if (values(contestants).find(({name}) => name === contestant.name))
            return popup(`${contestant.name} already exists`)
        if (contestant.type === 'team' && contestant.members.length < 2)
            return popup('There must be at least 2 members in a group')

        contestants[id] = contestant

        teamName = ''
        personName = ''
        addingContestant.members.splice(0, addingContestant.members.length)
    }
    const createContestant = (id: string): Contestant => {
        if (addingType === 'team') {
            if (teamName !== '') teamName = capitalizeWords(teamName)
            return {
                id,
                type: 'team',
                name: teamName,
                members: [...members]
            }
        }
        if (personName !== '') personName = capitalizeWords(personName)
        return {
            id,
            type: 'person',
            name: personName
        }
    }

    const removeContestant = (id: string) => {
        return () => {
            if (selectedTeamId === id) selectedTeamId = false
            removeContestantFromGroups(id)
            delete contestants[id]
        }
    }

    const removeContestantFromGroups = (id: string) => {
        values(tournament.groups).forEach(group => {
            group.members = group.members.filter(_id => _id !== id)
            removeMatchesOfContestant(id, group, tournament.matches)
        })
    }

    const renameContestant = (id: string) => {
        return value => {
            if (value === contestants[id].name) return
            if (values(contestants).find(({name}) => name === value))
                return popup(`${value} already exists`)
            contestants[id].name = value
        }
    }

    const getContestantName = (id: string) => {
        return () => contestants[id].name
    }

    const handleKeyDownPerson = ({key}: KeyboardEvent) => {
        if (key !== 'Enter') return
        addContestant()
    }

    $: groupedContestants = groupByType($contestantsStore)
    $: persons = groupedContestants.persons
    $: teams = groupedContestants.teams

    let selectedTeamId: string | false = false

    let popup: (text: string) => void
</script>

<Popup bind:popup/>

<main>
    <h2>Add a team or single person</h2>
    <section class="buttons">
        <button class:active={addingType === 'team'} on:click={() => addingType = 'team'}>Team</button>
        <button class:active={addingType === 'person'} on:click={() => addingType = 'person'}>Person</button>
        <button class="svg" on:click={addContestant}><Add/></button>
    </section>
    <section class="name">
        {#if addingType === 'team'}
            <label for="team-name">Name</label>
            <input id="team-name" type="text" bind:value={teamName}>
        {:else}
            <label for="person-name">Name</label>
            <input id="person-name" type="text" on:keydown={handleKeyDownPerson} bind:value={personName}>
        {/if}
    </section>
    {#if addingType === 'team'}
        <div class="team-members">
            <EditableList list={members} heading="Team Mitglieder"/>
        </div>
    {/if}

    <div class="contestants">
        {#if persons}
            <section class="persons">
                <h2>Persons</h2>
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
                            <div class="selected-team">
                                <EditableList list={contestants[selectedTeamId].members} bind:heading={$contestantsStore[selectedTeamId].name}/>
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
    .buttons {
        display: flex;
        align-items: center;
        margin-top: 1rem;
    }
    .buttons button {
        margin: 0 .5rem;
    }
    .name {
        margin-top: 1rem;
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
        cursor: pointer;
    }
    .team-name button {
        margin-left: .4rem
    }
    .persons + .teams {
        margin-left: 2rem;
    }
    .selected-team {
        position: fixed;
        top: 5rem;
        right: 5rem;
    }
</style>