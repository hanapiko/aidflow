<script>
    import { goto } from '$app/navigation';
    import { isAuthenticated, logout } from '$lib/stores/auth';

    function handleLogout() {
        logout();
        goto('/admin/login');
    }
</script>

{#if $isAuthenticated}
    <div class="admin-layout">
        <header>
            <div class="header-content">
                <h2>Admin Dashboard</h2>
                <button class="logout-btn" on:click={handleLogout}>Logout</button>
            </div>
        </header>
        <main>
            <slot />
        </main>
    </div>
{:else}
    <slot />
{/if}

<style>
    .admin-layout {
        min-height: 100vh;
    }

    header {
        background: var(--primary-color);
        color: white;
        padding: 1rem;
    }

    .header-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h2 {
        margin: 0;
    }

    .logout-btn {
        background: white;
        color: var(--primary-color);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
    }

    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }
</style> 