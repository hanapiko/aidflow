<script>
    export let message = '';
</script>

{#if message}
    <div class="error-container">
        <p>{message}</p>
    </div>
{/if}

<style>
    .error-container {
        padding: 1rem;
        background: #fff5f5;
        border: 1px solid #feb2b2;
        border-radius: 4px;
        color: #c53030;
        margin: 1rem 0;
    }

    p {
        margin: 0;
    }
</style> 