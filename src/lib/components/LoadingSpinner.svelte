<div class="spinner-container">
    <div class="spinner"></div>
</div>

<style>
    .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style> 