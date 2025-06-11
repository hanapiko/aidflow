<script>
    /** @type {import('./$types').PageData} */
    export let data;
    
    let selectedProject = 'all';
    let dateRange = '7days';
    
    $: filteredDonations = data.donations.filter(donation => {
        if (selectedProject !== 'all' && donation.project_id !== selectedProject) {
            return false;
        }
        
        const date = new Date(donation.created_at);
        const now = new Date();
        
        switch (dateRange) {
            case '24hours':
                return date >= new Date(now - 24 * 60 * 60 * 1000);
            case '7days':
                return date >= new Date(now - 7 * 24 * 60 * 60 * 1000);
            case '30days':
                return date >= new Date(now - 30 * 24 * 60 * 60 * 1000);
            default:
                return true;
        }
    });
    
    $: totalAmount = filteredDonations
        .filter(d => d.status === 'completed')
        .reduce((sum, d) => sum + d.amount, 0);
        
    $: successRate = filteredDonations.length > 0
        ? (filteredDonations.filter(d => d.status === 'completed').length / filteredDonations.length * 100).toFixed(1)
        : 0;
</script>

<div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    
    <div class="filters">
        <div class="filter-group">
            <label for="project">Project</label>
            <select id="project" bind:value={selectedProject}>
                <option value="all">All Projects</option>
                {#each data.projects as project}
                    <option value={project.id}>{project.title}</option>
                {/each}
            </select>
        </div>
        
        <div class="filter-group">
            <label for="date">Time Period</label>
            <select id="date" bind:value={dateRange}>
                <option value="24hours">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="all">All Time</option>
            </select>
        </div>
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <h3>Total Donations</h3>
            <p>KES {totalAmount.toLocaleString()}</p>
        </div>
        
        <div class="stat-card">
            <h3>Success Rate</h3>
            <p>{successRate}%</p>
        </div>
        
        <div class="stat-card">
            <h3>Total Transactions</h3>
            <p>{filteredDonations.length}</p>
        </div>
    </div>
    
    <div class="donations-table">
        <h2>Recent Donations</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Receipt</th>
                </tr>
            </thead>
            <tbody>
                {#each filteredDonations as donation}
                    <tr class={donation.status}>
                        <td>{new Date(donation.created_at).toLocaleString()}</td>
                        <td>
                            {data.projects.find(p => p.id === donation.project_id)?.title || 'Unknown'}
                        </td>
                        <td>KES {donation.amount.toLocaleString()}</td>
                        <td>{donation.phone_number}</td>
                        <td>{donation.status}</td>
                        <td>{donation.mpesa_receipt || '-'}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .admin-dashboard {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
    }
    
    .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        min-width: 200px;
    }
    
    .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .stat-card {
        background: #f5f5f5;
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
    }
    
    .stat-card h3 {
        margin: 0;
        color: #666;
        font-size: 1rem;
    }
    
    .stat-card p {
        margin: 0.5rem 0 0;
        font-size: 1.5rem;
        font-weight: bold;
    }
    
    .donations-table {
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow-x: auto;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
    }
    
    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
    }
    
    th {
        background: #f5f5f5;
        font-weight: 600;
    }
    
    tr.completed td {
        background: #f0fff4;
    }
    
    tr.failed td {
        background: #fff5f5;
    }
    
    tr.pending td {
        background: #fffbeb;
    }
    
    @media (max-width: 768px) {
        .filters {
            flex-direction: column;
        }
        
        .stat-card {
            padding: 1rem;
        }
        
        th, td {
            padding: 0.5rem;
        }
    }
</style>
