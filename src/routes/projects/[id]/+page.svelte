<script>
    import { initiateSTKPush } from '$lib/mpesa';
    
    /** @type {import('./$types').PageData} */
    export let data;
    
    let donationForm = {
        phoneNumber: '',
        amount: '',
        processing: false,
        error: null,
        success: false
    };

    function validatePhoneNumber(phone) {
        return /^254\d{9}$/.test(phone);
    }

    const handleDonation = async () => {
        try {
            donationForm.processing = true;
            donationForm.error = null;
            donationForm.success = false;
            
            // Basic validation
            if (!donationForm.amount || isNaN(donationForm.amount) || donationForm.amount <= 0) {
                throw new Error('Please enter a valid amount');
            }
            
            if (!donationForm.phoneNumber || !validatePhoneNumber(donationForm.phoneNumber)) {
                throw new Error('Please enter a valid phone number starting with 254');
            }
            
            // Create pending donation record
            const donationRes = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: data.project.id,
                    amount: parseFloat(donationForm.amount),
                    phoneNumber: donationForm.phoneNumber
                })
            });
            
            if (!donationRes.ok) {
                throw new Error('Failed to create donation record');
            }
            
            // Initiate Mpesa STK Push
            const mpesaRes = await initiateSTKPush(
                donationForm.phoneNumber, 
                parseFloat(donationForm.amount), 
                data.project.id
            );
            
            if (mpesaRes.ResponseCode === '0') {
                donationForm.success = true;
                donationForm.amount = '';
                donationForm.phoneNumber = '';
            } else {
                throw new Error(mpesaRes.ResponseDescription || 'Failed to initiate payment');
            }
        } catch (e) {
            donationForm.error = e.message;
        } finally {
            donationForm.processing = false;
        }
    };
</script>

<svelte:head>
    <title>{data.project.title} - AidFlow</title>
</svelte:head>

<div class="project-details">
    <img src={data.project.image_url} alt={data.project.title} class="project-image" />
    
    <div class="project-info">
        <h1>{data.project.title}</h1>
        <div class="progress-bar">
            <div 
                class="progress" 
                style="width: {(data.project.current_amount / data.project.target_amount) * 100}%"
            ></div>
        </div>
        <div class="amounts">
            <span>Raised: KES {data.project.current_amount.toLocaleString()}</span>
            <span>Target: KES {data.project.target_amount.toLocaleString()}</span>
        </div>
        <div class="description">
            {data.project.description}
        </div>
        
        <form on:submit|preventDefault={handleDonation} class="donation-form">
            <h2>Make a Donation</h2>
            {#if donationForm.error}
                <div class="error">{donationForm.error}</div>
            {/if}
            {#if donationForm.success}
                <div class="success">Please check your phone to complete the payment</div>
            {/if}
            
            <div class="form-group">
                <label for="amount">Amount (KES)</label>
                <input
                    type="number"
                    id="amount"
                    bind:value={donationForm.amount}
                    min="1"
                    required
                    disabled={donationForm.processing}
                />
            </div>
            
            <div class="form-group">
                <label for="phone">Phone Number (254...)</label>
                <input
                    type="text"
                    id="phone"
                    bind:value={donationForm.phoneNumber}
                    placeholder="254712345678"
                    pattern="^254[0-9]{9}$"
                    required
                    disabled={donationForm.processing}
                />
            </div>
            
            <button type="submit" disabled={donationForm.processing}>
                {donationForm.processing ? 'Processing...' : 'Donate Now'}
            </button>
        </form>
    </div>
</div>

<style>
    .project-details {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    
    .project-image {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }
    
    .project-info {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .progress-bar {
        width: 100%;
        height: 20px;
        background: #eee;
        border-radius: 10px;
        overflow: hidden;
    }
    
    .progress {
        height: 100%;
        background: var(--primary-color);
        transition: width 0.3s ease;
    }
    
    .amounts {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
    }
    
    .description {
        white-space: pre-line;
        margin: 1rem 0;
    }
    
    .donation-form {
        background: #f5f5f5;
        padding: 1.5rem;
        border-radius: 8px;
        margin-top: 1rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    label {
        display: block;
        margin-bottom: 0.5rem;
    }
    
    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    button {
        width: 100%;
        padding: 1rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .error {
        color: red;
        margin-bottom: 1rem;
    }
    
    .success {
        color: green;
        margin-bottom: 1rem;
    }
    
    @media (max-width: 768px) {
        .project-details {
            grid-template-columns: 1fr;
        }
    }
</style> 