import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const {
    MPESA_CONSUMER_KEY,
    MPESA_CONSUMER_SECRET,
    MPESA_PASSKEY,
    MPESA_SHORTCODE
} = process.env;

// Base URLs
const SANDBOX_URL = 'https://sandbox.safaricom.co.ke';
const PRODUCTION_URL = 'https://api.safaricom.co.ke';

// Use sandbox URL for development
const BASE_URL = SANDBOX_URL;

async function getAccessToken() {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw new Error('Failed to get access token');
    }
}

export async function initiateSTKPush(phoneNumber, amount, projectId) {
    try {
        const accessToken = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = Buffer.from(
            `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
        ).toString('base64');

        const response = await axios({
            method: 'post',
            url: `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                BusinessShortCode: MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: MPESA_SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: `${process.env.APP_URL}/api/mpesa/callback`,
                AccountReference: `AidFlow-${projectId}`,
                TransactionDesc: 'Donation to social project'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error initiating STK push:', error);
        throw new Error('Failed to initiate payment');
    }
}

export async function validateTransaction(transactionId) {
    try {
        const accessToken = await getAccessToken();
        
        const response = await axios({
            method: 'post',
            url: `${BASE_URL}/mpesa/transactionstatus/v1/query`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                Initiator: MPESA_SHORTCODE,
                SecurityCredential: MPESA_PASSKEY,
                CommandID: 'TransactionStatusQuery',
                TransactionID: transactionId,
                PartyA: MPESA_SHORTCODE,
                IdentifierType: '4',
                ResultURL: `${process.env.APP_URL}/api/mpesa/result`,
                QueueTimeOutURL: `${process.env.APP_URL}/api/mpesa/timeout`,
                Remarks: 'Validate donation transaction',
                Occasion: 'Donation'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error validating transaction:', error);
        throw new Error('Failed to validate transaction');
    }
}
