<script lang="ts">
    import Add from '../svg/Add.svelte'
    import {clickOutside} from '../../util/actions'
    import EditableText from './EditableText.svelte'
    import Minus from '../svg/Minus.svelte'
    import {toStore} from '../../util/tournament'
    import Popup from '../Popup.svelte'
    import {capitalizeWords} from '../../util/contestants'

    export let heading = 'Liste'

    export let list: string[]
    const listStore = toStore(list)

    let isAdding = false
    let itemToAdd = ''
    let inputElement: HTMLInputElement

    const startAdding = () => {
        isAdding = true
        setTimeout(() => inputElement && inputElement.select())
    }

    const handleKeyDown = ({key}: KeyboardEvent) => {
        if (key === 'Enter') return addItem()
        if (key === 'Escape') return cancelAdding()
    }

    const addItem = () => {
        if (!itemToAdd) return
        itemToAdd = capitalizeWords(itemToAdd)
        if ($listStore.find(item => item === itemToAdd))
            return popup(`${itemToAdd} ist schon im Team`)
        list.push(itemToAdd)
    }

    const cancelAdding = () => {
        isAdding = false
    }

    const removeItem = (index: number) => {
        return () => list.splice(index, 1)
    }

    const renameItem = (index: number) => {
        return (value: string) => {
            if (!value) return removeItem(index)
            value = capitalizeWords(value)
            if (value === $listStore[index]) return
            if ($listStore.find(item => item === value))
                return popup(`${value} ist schon im Team`)
            list[index] = value
        }
    }

    let popup: (text: string) => void
</script>

<Popup bind:popup />

<section class="list card">
    <header class="underline">
        <h3>{heading}</h3>
        <button class="svg" on:click={startAdding}><Add/></button>
    </header>
    {#if isAdding}
        <input use:clickOutside on:clickoutside={cancelAdding} bind:this={inputElement} type="text" on:keydown={handleKeyDown} bind:value={itemToAdd}>
    {/if}
    {#each $listStore as item, index (item)}
        <div class="item">
            <button class="svg remove" on:click={removeItem(index)}><Minus/></button>
            <EditableText load={() => list[index]} save={renameItem(index)} width="15ch"/>
        </div>
    {/each}
</section>

<style>
    .list {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    header {
        display: flex;
        align-items: center;
    }
    h3 {
        margin: 0 .5em 0 0;
    }
    input {
        font-size: 1em;
        margin-bottom: .5em;
    }
    .item {
        font-size: 1em;
        display: flex;
        align-items: center;
        align-self: flex-start;
    }
    .item + .item {
        margin-top: .5em;
    }
    .remove {
        margin-right: .4em;
    }
</style>