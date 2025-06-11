/**
 * Initiates an M-Pesa STK push request through the server endpoint
 * @param {string} phoneNumber - The phone number to send the STK push to (format: 254XXXXXXXXX)
 * @param {number} amount - The amount to charge
 * @param {string|number} projectId - The ID of the project being donated to
 * @returns {Promise<any>} The M-Pesa response
 */
export const initiateSTKPush = async (phoneNumber, amount, projectId) => {
    try {
        const response = await fetch('/api/mpesa/stk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber,
                amount,
                projectId
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Payment initiation failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error initiating STK push:', error);
        throw error;
    }
}; 