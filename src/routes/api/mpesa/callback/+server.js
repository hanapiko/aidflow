import { json } from '@sveltejs/kit';
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

export async function POST({ request, url }) {
    try {
        const projectId = url.searchParams.get('projectId');
        const callbackData = await request.json();
        
        // Connect to database
        const connection = await mysql.createConnection({
            host: env.DB_HOST || 'localhost',
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            database: env.DB_NAME
        });

        // Extract relevant data from callback
        const { ResultCode, ResultDesc, CallbackMetadata } = callbackData.Body.stkCallback;
        
        let mpesaReceipt = '';
        let amount = 0;
        let phoneNumber = '';
        
        if (CallbackMetadata && CallbackMetadata.Item) {
            CallbackMetadata.Item.forEach(item => {
                if (item.Name === 'MpesaReceiptNumber') mpesaReceipt = item.Value;
                if (item.Name === 'Amount') amount = item.Value;
                if (item.Name === 'PhoneNumber') phoneNumber = item.Value;
            });
        }

        // Update donation record
        if (ResultCode === 0) {
            // Transaction successful
            await connection.execute(
                'UPDATE donations SET status = ?, mpesa_receipt = ? WHERE project_id = ? AND phone_number = ? AND status = ?',
                ['completed', mpesaReceipt, projectId, phoneNumber, 'pending']
            );

            // Update project amount
            await connection.execute(
                'UPDATE projects SET current_amount = current_amount + ? WHERE id = ?',
                [amount, projectId]
            );
        } else {
            // Transaction failed
            await connection.execute(
                'UPDATE donations SET status = ?, error_message = ? WHERE project_id = ? AND phone_number = ? AND status = ?',
                ['failed', ResultDesc, projectId, phoneNumber, 'pending']
            );
        }

        await connection.end();

        return json({ success: true });
    } catch (error) {
        console.error('Error processing Mpesa callback:', error);
        return json({ success: false, error: error.message }, { status: 500 });
    }
} 