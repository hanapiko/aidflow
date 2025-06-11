import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const {
    MPESA_CONSUMER_KEY,
    MPESA_CONSUMER_SECRET,
    MPESA_PASSKEY,
    MPESA_SHORTCODE,
    MPESA_CALLBACK_URL
} = process.env;

// Validate required environment variables
if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_PASSKEY || !MPESA_SHORTCODE || !MPESA_CALLBACK_URL) {
    throw new Error('Missing required M-Pesa configuration');
}

const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

/**
 * Get M-Pesa access token
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
    try {
        const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
        const response = await axios.get(MPESA_AUTH_URL, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting M-Pesa access token:', error);
        throw new Error('Failed to get M-Pesa access token');
    }
}

/**
 * Generate password for STK Push
 * @returns {string} Generated password
 */
function generatePassword() {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
    return { password, timestamp };
}

/**
 * Initiate STK Push request
 * @param {string} phoneNumber - Customer phone number (254XXXXXXXXX)
 * @param {number} amount - Amount to charge
 * @param {string} reference - Payment reference
 * @returns {Promise<Object>} STK Push response
 */
export async function initiateSTKPush(phoneNumber, amount, reference) {
    try {
        const accessToken = await getAccessToken();
        const { password, timestamp } = generatePassword();

        const response = await axios.post(MPESA_STK_URL, {
            BusinessShortCode: MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: MPESA_SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL: MPESA_CALLBACK_URL,
            AccountReference: reference,
            TransactionDesc: `Donation to ${reference}`
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error initiating STK Push:', error);
        throw new Error('Failed to initiate payment');
    }
}

/**
 * Process M-Pesa callback
 * @param {Object} callbackData - Callback data from M-Pesa
 * @returns {Object} Processed callback data
 */
export function processCallback(callbackData) {
    try {
        const { Body: { stkCallback } } = callbackData;
        const { ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

        if (ResultCode !== 0) {
            return {
                success: false,
                message: ResultDesc
            };
        }

        const metadata = {};
        CallbackMetadata.Item.forEach(item => {
            metadata[item.Name] = item.Value;
        });

        return {
            success: true,
            data: {
                amount: metadata.Amount,
                mpesaReceiptNumber: metadata.MpesaReceiptNumber,
                transactionDate: metadata.TransactionDate,
                phoneNumber: metadata.PhoneNumber
            }
        };
    } catch (error) {
        console.error('Error processing M-Pesa callback:', error);
        throw new Error('Failed to process payment callback');
    }
} 