<script>
    import Check from "./svg/Check.svelte";
    export let value = false
</script>

<button class="svg" on:click={() => value = !value}>
    {#if value}
        <Check/>
    {/if}
</button>