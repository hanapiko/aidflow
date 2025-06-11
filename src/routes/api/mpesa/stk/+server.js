import { json } from '@sveltejs/kit';
import axios from 'axios';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
    try {
        const { phoneNumber, amount, projectId } = await request.json();

        // Get access token
        const auth = Buffer.from(`${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`).toString('base64');
        const tokenResponse = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: { Authorization: `Basic ${auth}` }
            }
        );
        const accessToken = tokenResponse.data.access_token;

        // Generate timestamp
        const date = new Date();
        const timestamp = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0'),
            String(date.getHours()).padStart(2, '0'),
            String(date.getMinutes()).padStart(2, '0'),
            String(date.getSeconds()).padStart(2, '0')
        ].join('');

        // Generate password
        const password = Buffer.from(
            `${env.MPESA_SHORTCODE}${env.MPESA_PASSKEY}${timestamp}`
        ).toString('base64');

        // Make STK push request
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: env.MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: env.MPESA_SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: `${env.MPESA_CALLBACK_URL}?projectId=${projectId}`,
                AccountReference: `AidFlow-${projectId}`,
                TransactionDesc: 'Donation to social project'
            },
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        return json(response.data);
    } catch (error) {
        console.error('Error initiating STK push:', error);
        return json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to initiate payment' 
            }, 
            { status: 500 }
        );
    }
} 