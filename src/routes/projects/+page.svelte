<script>
    import { onMount } from 'svelte';

    let projects = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error('Failed to load projects');
            projects = await response.json();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    function calculateProgress(current, target) {
        return Math.min((current / target) * 100, 100);
    }

    function formatAmount(amount) {
        return amount.toLocaleString('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
</script>

<svelte:head>
    <title>Projects - AidFlow</title>
</svelte:head>

<div class="projects-container">
    <header>
        <h1>Support Local Projects</h1>
        <p class="subtitle">Choose a project to support and make a difference in your community</p>
    </header>

    {#if loading}
        <div class="loading">Loading projects...</div>
    {:else if error}
        <div class="error-message">{error}</div>
    {:else if projects.length === 0}
        <div class="no-projects">
            <p>No projects available at the moment.</p>
        </div>
    {:else}
        <div class="projects-grid">
            {#each projects as project}
                <div class="project-card">
                    {#if project.image_url}
                        <img 
                            src={project.image_url} 
                            alt={project.title}
                            class="project-image"
                        />
                    {/if}
                    <div class="project-content">
                        <h2>{project.title}</h2>
                        <p class="description">{project.description}</p>
                        
                        <div class="progress-section">
                            <div class="progress-bar">
                                <div 
                                    class="progress" 
                                    style="width: {calculateProgress(project.current_amount, project.target_amount)}%"
                                >
                                </div>
                            </div>
                            <div class="progress-stats">
                                <span class="amount-raised">
                                    {formatAmount(project.current_amount)}
                                </span>
                                <span class="amount-target">
                                    raised of {formatAmount(project.target_amount)}
                                </span>
                            </div>
                        </div>

                        <a 
                            href="/projects/{project.id}" 
                            class="donate-button"
                        >
                            Donate Now
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .projects-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    header {
        text-align: center;
        margin-bottom: 3rem;
    }

    h1 {
        font-size: 2.5rem;
        color: var(--text-color);
        margin-bottom: 0.5rem;
    }

    .subtitle {
        font-size: 1.2rem;
        color: #666;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
    }

    .project-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.2s ease;
    }

    .project-card:hover {
        transform: translateY(-4px);
    }

    .project-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .project-content {
        padding: 1.5rem;
    }

    .project-content h2 {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        color: var(--text-color);
    }

    .description {
        color: #444;
        margin-bottom: 1.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .progress-section {
        margin: 1.5rem 0;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: #eee;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress {
        height: 100%;
        background: var(--primary-color);
        transition: width 0.3s ease;
    }

    .progress-stats {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        color: #666;
    }

    .amount-raised {
        color: var(--primary-color);
        font-weight: bold;
    }

    .donate-button {
        display: block;
        width: 100%;
        padding: 1rem;
        background: var(--primary-color);
        color: white;
        text-align: center;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 500;
        transition: opacity 0.2s ease;
    }

    .donate-button:hover {
        opacity: 0.9;
    }

    .loading, .error-message, .no-projects {
        text-align: center;
        padding: 3rem;
        color: #666;
    }

    .error-message {
        color: #e53e3e;
        background: #fff5f5;
        border-radius: 8px;
    }

    @media (max-width: 768px) {
        .projects-grid {
            grid-template-columns: 1fr;
        }

        .projects-container {
            padding: 1rem;
        }

        h1 {
            font-size: 2rem;
        }
    }
</style>
