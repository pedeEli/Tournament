<script lang="ts">
    import {clickOutside, doubleClick} from '../../util/actions'

    export let save: (value: string) => void
    export let load: () => string
    export let width = 'auto'

    let text = load()
    let editing = false

    let inputElement: HTMLInputElement
    const handleDoubleClick = () => {
        editing = true
        setTimeout(() => {
            inputElement && inputElement.select()
        })
    }

    const handleKeyDown = ({key}) => {
        if (key === 'Enter') return saveAndExitEditing()
        if (key !== 'Escape') return

        editing = false
        text = load()
    }

    const saveAndExitEditing = () => {
        editing = false
        save(text)
        setTimeout(() => text = load())
    }
</script>

{#if editing}
    <input
            bind:value={text}
            bind:this={inputElement}
            use:clickOutside
            on:clickoutside={saveAndExitEditing}
            on:keydown={handleKeyDown}
            type="text"
            style="width: {width}"
            lang="de"
    />
{:else}
    <span use:doubleClick on:doubleclick={handleDoubleClick}>{text}</span>
{/if}

<style>
    span {
        cursor: pointer;
    }
</style>