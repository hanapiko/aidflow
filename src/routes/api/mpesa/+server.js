import { json } from '@sveltejs/kit';
import { initiateSTKPush } from '$lib/mpesa/index.js';
import { query } from '$lib/database/db.js';

export async function POST({ request }) {
    try {
        const { phoneNumber, amount, projectId } = await request.json();

        // Validate phone number format
        if (!phoneNumber.match(/^254[0-9]{9}$/)) {
            return new Response(
                JSON.stringify({ error: 'Invalid phone number format. Use 254XXXXXXXXX' }), 
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Validate amount
        if (amount < 10) {
            return new Response(
                JSON.stringify({ error: 'Minimum donation amount is KSH 10' }), 
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Initiate M-Pesa STK Push
        const mpesaResponse = await initiateSTKPush(phoneNumber, amount, `Project-${projectId}`);

        // Store the pending donation
        await query(
            'INSERT INTO donations (project_id, amount, phone_number, transaction_id, status) VALUES (?, ?, ?, ?, ?)',
            [projectId, amount, phoneNumber, mpesaResponse.CheckoutRequestID, 'pending']
        );

        return json({
            message: 'Payment initiated successfully',
            checkoutRequestId: mpesaResponse.CheckoutRequestID
        });
    } catch (error) {
        console.error('Payment initiation error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to initiate payment. Please try again.' }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Handle M-Pesa callback
export async function PUT({ request }) {
    try {
        const callbackData = await request.json();
        const { Body: { stkCallback } } = callbackData;
        const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback;

        if (ResultCode === 0) {
            // Payment successful
            const metadata = {};
            CallbackMetadata.Item.forEach(item => {
                metadata[item.Name] = item.Value;
            });

            // Update donation status
            await query(
                'UPDATE donations SET status = ?, mpesa_receipt = ? WHERE transaction_id = ?',
                ['completed', metadata.MpesaReceiptNumber, CheckoutRequestID]
            );

            // Update project amount
            const donation = await query(
                'SELECT amount, project_id FROM donations WHERE transaction_id = ?',
                [CheckoutRequestID]
            );

            if (donation.length > 0) {
                await query(
                    'UPDATE projects SET current_amount = current_amount + ? WHERE id = ?',
                    [donation[0].amount, donation[0].project_id]
                );
            }
        } else {
            // Payment failed
            await query(
                'UPDATE donations SET status = ?, error_message = ? WHERE transaction_id = ?',
                ['failed', ResultDesc, CheckoutRequestID]
            );
        }

        return new Response(null, { status: 200 });
    } catch (error) {
        console.error('Callback processing error:', error);
        return new Response(null, { status: 500 });
    }
} 